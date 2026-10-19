export function comparisonPosition(clientX:number,left:number,width:number){return width>0?Math.max(0,Math.min(100,Math.round((clientX-left)/width*100))):0;}
export function comparisonKey(key:string,value:number){if(key==='Home')return 0;if(key==='End')return 100;if(key==='ArrowLeft'||key==='ArrowDown')return Math.max(0,value-1);if(key==='ArrowRight'||key==='ArrowUp')return Math.min(100,value+1);return value;}
export function reachedStages(progress:number){return Math.min(4,Math.max(0,Math.ceil(Math.max(0,Math.min(1,progress))*4)));}
