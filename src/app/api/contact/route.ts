import {handle} from '@/lib/leads/handler';export const runtime='nodejs';export const POST=(r:Request)=>handle(r,'contact');
