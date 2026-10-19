import {readFile,writeFile} from 'node:fs/promises';import {assessmentColumns,contactColumns,csvCell} from '../src/lib/leads/mapping';
async function main(){
const type=process.argv[2]==='contact'?'contact':'assessment';const dir=process.env.LOCAL_LEADS_DIR||'data/local';const rows=(await readFile(`${dir}/${type}-submissions.jsonl`,'utf8')).split('\n').filter(Boolean).map(l=>JSON.parse(l).row);const output=[type==='assessment'?assessmentColumns:contactColumns,...rows].map(r=>r.map(csvCell).join(',')).join('\r\n');await writeFile(`${dir}/${type}-export.csv`,output,{mode:0o600});console.log(`Exported ${rows.length} private rows to ${dir}/${type}-export.csv`);

}
main().catch(e=>{console.error(e.message);process.exitCode=1});
