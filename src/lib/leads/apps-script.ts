import 'server-only';
import {createHmac} from 'node:crypto';
import {z} from 'zod';
import type {FormType} from './mapping';

type ScriptRequest =
  | {operation:'save';type:FormType;submissionId:string;hash:string;row:(string|boolean)[]}
  | {operation:'lookup';type:FormType;submissionId:string}
  | {operation:'rate';key:string};

const responseSchema = z.object({
  protocol:z.literal('utopia-leads-v1'),
  status:z.enum(['saved','duplicate','conflict','received','checking','allowed','limited','unavailable','invalid']),
  submissionId:z.string().optional(),
  type:z.enum(['assessment','contact']).optional(),
});

export function appsScriptConfiguration() {
  const url = process.env.GOOGLE_APPS_SCRIPT_URL;
  const secret = process.env.GOOGLE_APPS_SCRIPT_SECRET;
  if (!url || !/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(url) || !secret || secret.length < 32) {
    throw Error('APPS_SCRIPT_NOT_CONFIGURED');
  }
  return {url,secret};
}

export async function appsScriptRequest(request:ScriptRequest) {
  const {url,secret} = appsScriptConfiguration();
  const payload = JSON.stringify({...request,timestamp:Date.now()});
  const signature = createHmac('sha256',secret).update(payload).digest('hex');
  try {
    const response = await fetch(url,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({payload,signature}),
      cache:'no-store',
      redirect:'follow',
      signal:AbortSignal.timeout(25000),
    });
    if (!response.ok) throw Error();
    const result = responseSchema.parse(await response.json());
    if (result.status === 'invalid' || result.status === 'unavailable') throw Error();
    return result;
  } catch {
    // Keep signed requests, provider error pages and deployment URLs out of logs.
    throw Error('APPS_SCRIPT_UNAVAILABLE');
  }
}
