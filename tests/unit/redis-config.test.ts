import {afterEach,expect,it,vi} from 'vitest';
import {appsScriptRepository,durableRate,storage} from '../../src/lib/leads/storage';

afterEach(()=>{
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

function productionConfiguration(){
  vi.stubEnv('NODE_ENV','production');
  vi.stubEnv('LEAD_STORAGE','google_apps_script');
  vi.stubEnv('GOOGLE_APPS_SCRIPT_URL','https://script.google.com/macros/s/test-deployment/exec');
  vi.stubEnv('GOOGLE_APPS_SCRIPT_SECRET','test-only-connection-secret-'.repeat(3));
  for(const name of ['REDIS_REST_URL','REDIS_REST_TOKEN','KV_REST_API_URL','KV_REST_API_TOKEN','UPSTASH_REDIS_REST_URL','UPSTASH_REDIS_REST_TOKEN'])vi.stubEnv(name,'');
}

it.each([
  ['REDIS_REST_URL','REDIS_REST_TOKEN'],
  ['KV_REST_API_URL','KV_REST_API_TOKEN'],
  ['UPSTASH_REDIS_REST_URL','UPSTASH_REDIS_REST_TOKEN'],
])('uses a complete %s / %s pair for production form rate limits',async(urlName,tokenName)=>{
  productionConfiguration();
  vi.stubEnv(urlName,'https://redis.example.invalid');
  vi.stubEnv(tokenName,'test-only-token');
  const fetchMock=vi.fn(async()=>Response.json({result:1}));
  vi.stubGlobal('fetch',fetchMock);
  expect(storage()).toBe(appsScriptRepository);
  expect(await durableRate('synthetic-rate-key')).toBe(true);
  expect(fetchMock).toHaveBeenCalledTimes(2);
  for(const [url,options] of fetchMock.mock.calls as unknown as [string,RequestInit][]){
    expect(url).toBe('https://redis.example.invalid');
    expect(options.headers).toMatchObject({Authorization:'Bearer test-only-token'});
  }
});

it('rejects partial credentials from unrelated variable pairs',()=>{
  productionConfiguration();
  vi.stubEnv('REDIS_REST_URL','https://custom.example.invalid');
  vi.stubEnv('KV_REST_API_TOKEN','test-only-unrelated-token');
  expect(storage).toThrow('DURABLE_STORE_REQUIRED');
});
