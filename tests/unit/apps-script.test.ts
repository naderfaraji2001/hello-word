import {readFileSync} from 'node:fs';
import {createHmac,randomUUID} from 'node:crypto';
import {createContext,runInContext} from 'node:vm';
import {afterEach,expect,it,vi} from 'vitest';
import {appsScriptRepository,Conflict,durableRate,lookup,storage} from '../../src/lib/leads/storage';
import {appsScriptRequest} from '../../src/lib/leads/apps-script';
import {handle} from '../../src/lib/leads/handler';
import {assessmentSchema,contactSchema} from '../../src/lib/validation/forms';
import {assessmentColumns,contactColumns,toRow} from '../../src/lib/leads/mapping';
import {sample} from './fixture';

const secret = 'test-only-connection-secret-'.repeat(3);
type Cell = string|boolean;

function fixture() {
  const properties = new Map<string,string>();
  const sheets = new Map<string,ReturnType<typeof makeSheet>>();
  const beforeWrite = vi.fn();
  const flush = vi.fn();
  const lock = {waitLock:vi.fn(),tryLock:vi.fn(()=>true),releaseLock:vi.fn()};

  function makeSheet() {
    const rows:Cell[][] = [];
    let maxColumns = 26;
    let maxRows = 1000;
    function getRange(row:number,column:number,height=1,width=1) {
      const range = {
        getValues:()=>Array.from({length:height},(_,y)=>Array.from({length:width},(_,x)=>rows[row-1+y]?.[column-1+x]??'')),
        getValue:()=>rows[row-1]?.[column-1]??'',
        setValues:(values:Cell[][])=>{
          beforeWrite(row,values);
          values.forEach((values,y)=>{
            rows[row-1+y]??=[];
            values.forEach((value,x)=>{
              rows[row-1+y][column-1+x]=typeof value==='string'&&value.startsWith("'")?value.slice(1):value;
            });
          });
          return range;
        },
        setValue:(value:Cell)=>range.setValues([[value]]),
        setNumberFormat:vi.fn(),
        setFontWeight:vi.fn(),
        createTextFinder:(id:string)=>{
          const finder = {
            matchEntireCell:()=>finder,
            useRegularExpression:()=>finder,
            findNext:()=>{
              const offset=range.getValues().findIndex(values=>values[0]===id);
              return offset===-1?null:{getRow:()=>row+offset};
            },
          };
          return finder;
        },
      };
      return range;
    }
    return {
      rows,getRange,
      getMaxColumns:()=>maxColumns,
      getMaxRows:()=>maxRows,
      getLastRow:()=>rows.length,
      insertColumnsAfter:(_:number,count:number)=>{maxColumns+=count;},
      insertRowsAfter:(_:number,count:number)=>{maxRows+=count;},
      setFrozenRows:vi.fn(),hideColumns:vi.fn(),
    };
  }

  const context = createContext({
    console:{log:vi.fn()},
    LockService:{getScriptLock:()=>lock},
    SpreadsheetApp:{
      flush,
      openById:()=>({
        getSheetByName:(name:string)=>sheets.get(name),
        insertSheet:(name:string)=>{const sheet=makeSheet();sheets.set(name,sheet);return sheet;},
      }),
    },
    PropertiesService:{getScriptProperties:()=>({
      getProperty:(key:string)=>properties.get(key)??null,
      setProperty:(key:string,value:string)=>properties.set(key,value),
      deleteProperty:(key:string)=>properties.delete(key),
      getProperties:()=>Object.fromEntries(properties),
    })},
    Utilities:{
      Charset:{UTF_8:'UTF-8'},
      computeHmacSha256Signature:(payload:string,key:string)=>Array.from(createHmac('sha256',key).update(payload).digest()),
    },
    ContentService:{MimeType:{JSON:'json'},createTextOutput:(text:string)=>({setMimeType:()=>JSON.parse(text)})},
  });
  const source=readFileSync(new URL('../../scripts/google-apps-script/Code.gs',import.meta.url),'utf8')
    .replace('YOUR_SPREADSHEET_ID','test-sheet').replace('YOUR_SHARED_SECRET',secret);
  runInContext(source,context);
  context.setup();
  beforeWrite.mockClear();
  process.env.LEAD_STORAGE='google_apps_script';
  process.env.GOOGLE_APPS_SCRIPT_URL='https://script.google.com/macros/s/test-deployment/exec';
  process.env.GOOGLE_APPS_SCRIPT_SECRET=secret;
  const fetchMock=vi.fn(async(_url:string,options:RequestInit)=>{
    const result=context.doPost({postData:{contents:String(options.body)}});
    return Response.json(result);
  });
  vi.stubGlobal('fetch',fetchMock);
  return {context,sheets,properties,beforeWrite,flush,lock,fetchMock};
}

afterEach(()=>{
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  for(const name of ['LEAD_STORAGE','GOOGLE_APPS_SCRIPT_URL','GOOGLE_APPS_SCRIPT_SECRET'])delete process.env[name];
});

it('keeps the production Redis configuration requirement before accepting submissions',()=>{
  fixture();
  vi.stubEnv('NODE_ENV','production');
  expect(storage).toThrow('DURABLE_STORE_REQUIRED');
});

it('accepts a form through the normal server handler and returns a signed receipt after persistence',async()=>{
  fixture();
  vi.stubEnv('RECEIPT_SIGNING_SECRET',secret);
  const request=()=>new Request('http://localhost:3000/api/assessment',{
    method:'POST',headers:{Origin:'http://localhost:3000','Content-Type':'application/json'},body:JSON.stringify(sample),
  });
  const first=await handle(request(),'assessment');
  expect(first.status).toBe(201);
  expect(await first.json()).toMatchObject({status:'received',reference:sample.submissionId,token:expect.any(String)});
  expect((await handle(request(),'assessment')).status).toBe(200);
});

it('connects the server adapter to the actual script with signed Unicode requests and private text cells',async()=>{
  const f=fixture();
  const lead=assessmentSchema.parse({...sample,organization:'=HYPERLINK("https://example.com")',phone:'+1 (555) 010-1000'});
  expect(storage()).toBe(appsScriptRepository);
  expect((await storage().save('assessment',lead)).status).toBe('saved');
  expect((await storage().save('assessment',lead)).status).toBe('duplicate');
  expect(await lookup('assessment',lead.submissionId)).toBe(true);
  expect(await lookup('contact',lead.submissionId)).toBe(false);
  const sheet=f.sheets.get('Assessment Requests')!;
  expect(sheet.rows).toHaveLength(2);
  expect(sheet.rows[0]).toEqual([...assessmentColumns,'payload_hash']);
  expect(f.sheets.get('Contact Requests')!.rows[0]).toEqual([...contactColumns,'payload_hash']);
  expect(sheet.rows[1][15]).toBe(lead.name);
  expect(sheet.rows[1][16]).toBe(lead.organization);
  expect(sheet.rows[1][18]).toBe(lead.phone);
  expect(f.beforeWrite.mock.calls[0][1][0][16]).toBe("'"+lead.organization);
  expect(f.properties.has('pending:'+lead.submissionId)).toBe(false);
  await expect(storage().save('assessment',{...lead,name:'Changed name'})).rejects.toBeInstanceOf(Conflict);
  const contact=contactSchema.parse({...lead,intent:'general',message:'Synthetic cross-form collision.'});
  await expect(storage().save('contact',contact)).rejects.toBeInstanceOf(Conflict);
});

it('reconciles a lost response without appending again',async()=>{
  const f=fixture();
  const lead=assessmentSchema.parse(sample);
  f.fetchMock.mockImplementationOnce(async(_url,options)=>{
    f.context.doPost({postData:{contents:String(options.body)}});
    throw Error('Response lost after write');
  });
  expect((await storage().save('assessment',lead)).status).toBe('uncertain');
  expect(await lookup('assessment',lead.submissionId)).toBe(true);
  expect((await storage().save('assessment',lead)).status).toBe('duplicate');
  expect(f.sheets.get('Assessment Requests')!.rows).toHaveLength(2);
});

it('retains an uncertain write and reserves its row while later requests are saved',async()=>{
  const f=fixture();
  const lead=assessmentSchema.parse(sample);
  f.beforeWrite.mockImplementationOnce(()=>{throw Error('Write may still complete later');});
  expect((await storage().save('assessment',lead)).status).toBe('uncertain');
  expect((await storage().save('assessment',lead)).status).toBe('uncertain');
  expect(await lookup('assessment',lead.submissionId)).toBe(false);
  const later={...lead,submissionId:randomUUID()};
  expect((await storage().save('assessment',later)).status).toBe('saved');
  expect(f.beforeWrite.mock.calls.map(call=>call[0])).toEqual([2,3]);
  expect(f.properties.has('pending:'+lead.submissionId)).toBe(true);
});

it('supports legacy rows and permits team notes to change without accepting changed answers',async()=>{
  const f=fixture();
  const lead=assessmentSchema.parse(sample);
  const row=toRow('assessment',lead,'2026-01-01T00:00:00.000Z');
  row[28]='in progress';row[30]='Internal team note';
  f.sheets.get('Assessment Requests')!.rows.push([...row,'']);
  expect((await storage().save('assessment',lead)).status).toBe('duplicate');
  await expect(storage().save('assessment',{...lead,organization:'Changed organization'})).rejects.toBeInstanceOf(Conflict);
});

it('saves contact requests separately and enforces a durable limit across requests',async()=>{
  const f=fixture();
  const lead=contactSchema.parse({...sample,intent:'general',message:'Synthetic Apps Script contact test.'});
  expect((await storage().save('contact',lead)).status).toBe('saved');
  expect(await lookup('contact',lead.submissionId)).toBe(true);
  expect(f.sheets.get('Contact Requests')!.rows).toHaveLength(2);
  const key='a'.repeat(64);
  for(let i=0;i<8;i++)expect(await durableRate(key)).toBe(true);
  expect(await durableRate(key)).toBe(false);
  f.properties.set('rate:'+key,JSON.stringify({count:8,until:Date.now()-1}));
  expect(await durableRate(key)).toBe(true);
});

it('rejects tampered or expired requests and never confirms a busy or broken deployment',async()=>{
  const f=fixture();
  const payload=JSON.stringify({operation:'rate',key:'a'.repeat(64),timestamp:Date.now()-600000});
  const expired={payload,signature:createHmac('sha256',secret).update(payload).digest('hex')};
  expect(f.context.doPost({postData:{contents:JSON.stringify(expired)}}).status).toBe('invalid');
  const lead=assessmentSchema.parse(sample);
  process.env.GOOGLE_APPS_SCRIPT_SECRET='incorrect-connection-secret-'.repeat(3);
  expect((await storage().save('assessment',lead)).status).toBe('uncertain');
  process.env.GOOGLE_APPS_SCRIPT_SECRET=secret;
  f.lock.tryLock.mockReturnValue(false);
  expect((await storage().save('assessment',lead)).status).toBe('uncertain');
  f.fetchMock.mockResolvedValueOnce(Response.json({protocol:'utopia-leads-v1',status:'saved',type:'assessment',submissionId:randomUUID()}));
  expect((await storage().save('assessment',lead)).status).toBe('uncertain');
  f.fetchMock.mockResolvedValueOnce(new Response('<html>Sign in</html>'));
  await expect(appsScriptRequest({operation:'lookup',type:'assessment',submissionId:lead.submissionId})).rejects.toThrow('APPS_SCRIPT_UNAVAILABLE');
  expect(f.sheets.get('Assessment Requests')!.rows).toHaveLength(1);
  process.env.GOOGLE_APPS_SCRIPT_URL='https://example.com/untrusted';
  expect(storage).toThrow('APPS_SCRIPT_NOT_CONFIGURED');
});
