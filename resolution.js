/* Evidence-based issue resolution: response speed, distinct routes and successful recovery. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./behaviour.js'));else factory(root.Lab);})(typeof globalThis!=='undefined'?globalThis:this,function(L){
'use strict';
const baseEvaluate=L.evaluate;
const WEIGHTS={response:40,variety:35,recovery:25};
const ROUTES={goods:['standard','consolidated','partner','express'],invoice:['standard-credit','patient-credit','priority-credit','joint-review'],delay:['wait','bridge','expedite','updates','supplier-escalation']};
const speed=(days,loss)=>Math.max(0,100-Math.max(0,days-1)*loss);
const avg=values=>values.length?values.reduce((a,n)=>a+n,0)/values.length:null;
function relevant(p,context,category){if(!p.lines.some(l=>category==='all'||l.item===category))return false;if(context!=='goods'||category==='all')return true;return p.issues.some(x=>!x.informational&&x.type!=='Invoice overcharge'&&x.line!==undefined&&p.lines[x.line]?.item===category);}
function distinctRoutes(c){const allowed=ROUTES[c.context]||[];return Math.min(4,new Set(c.options.filter(o=>allowed.includes(o.key)).map(o=>o.key)).size);}
function resolutionDetails(s,vid,category='all'){
 const groups=new Map();for(const c of s.consultations||[]){const p=s.pos.find(p=>p.id===c.po);if(!p||p.vendor!==vid||!relevant(p,c.context,category))continue;const key=c.po+'|'+c.context;if(!groups.has(key))groups.set(key,{p,context:c.context,consultations:[]});groups.get(key).consultations.push(c);}
 const cases=[...groups.values()].map(({p,context,consultations})=>{
 const cs=consultations.slice().sort((a,b)=>a.requested-b.requested||a.attempt-b.attempt),first=cs[0],replied=s.day>=first.responds,responseDays=replied?Math.max(0,first.responds-first.requested):null;
 // Only routes actually available when the first reply arrived count; later expiry does not erase evidence.
 const periodAtReply=Math.floor((first.responds-1)/50),validAtReply=first.epoch===periodAtReply&&first.expires>=first.responds&&(context!=='delay'||first.responds<(p.delayPlan?.originalArrival??p.arrival));
 const optionCount=replied&&validAtReply?distinctRoutes(first):0;
 const ds=(s.decisions||[]).filter(d=>d.po===p.id&&d.context===context);
 const issues=p.issues.filter(x=>!x.informational&&(context==='invoice'?x.type==='Invoice overcharge':x.type!=='Invoice overcharge'&&(category==='all'||x.line===undefined||p.lines[x.line]?.item===category)));
 const completed=context==='delay'?p.receipts.length>0:issues.length>0&&issues.every(x=>x.resolved!==null&&x.resolved<=s.day);
 let recoveryDays=null;
 if(completed){if(context==='delay'){const last=ds.at(-1),reply=last?cs.find(c=>c.id===last.consultation):first;recoveryDays=Math.max(0,(reply?reply.responds-reply.requested:0)+p.arrival-(last?last.day:first.responds));}
 else if(ds.length){recoveryDays=ds.reduce((n,d)=>{const c=cs.find(c=>c.id===d.consultation);return n+Math.max(0,c?c.responds-c.requested:0)+d.quotedDays;},0);}
 else recoveryDays=Math.max(0,Math.max(...issues.map(x=>x.resolved))-first.requested);}
 const responseScore=replied?speed(responseDays,15):0,varietyScore=25*optionCount,recoveryScore=completed?speed(recoveryDays,10):0;
 const score=(WEIGHTS.response*responseScore+WEIGHTS.variety*varietyScore+WEIGHTS.recovery*recoveryScore)/100;
 return {po:p.id,context,firstConsultation:first.id,requested:first.requested,replied,responseDays,optionCount,validAtReply,completed,recoveryDays,responseScore,varietyScore,recoveryScore,score,attempts:cs.length,provisional:!completed};
 });
 const olderCases=s.pos.filter(p=>p.vendor===vid).reduce((n,p)=>n+['goods','invoice'].filter(context=>relevant(p,context,category)&&p.issues.some(x=>!x.informational&&(context==='invoice'?x.type==='Invoice overcharge':x.type!=='Invoice overcharge'&&(category==='all'||x.line===undefined||p.lines[x.line]?.item===category)))&&!groups.has(p.id+'|'+context)).length,0);
 return {cases,count:cases.length,completed:cases.filter(c=>c.completed).length,pending:cases.filter(c=>!c.replied).length,unresolved:cases.filter(c=>!c.completed).length,olderCases,responseScore:avg(cases.map(c=>c.responseScore)),varietyScore:avg(cases.map(c=>c.varietyScore)),recoveryScore:avg(cases.map(c=>c.recoveryScore)),score:avg(cases.map(c=>c.score)),meanResponseDays:avg(cases.filter(c=>c.replied).map(c=>c.responseDays)),meanOptions:avg(cases.filter(c=>c.replied).map(c=>c.optionCount)),meanRecoveryDays:avg(cases.filter(c=>c.completed).map(c=>c.recoveryDays))};
}
L.evaluate=function(s,category='all'){return baseEvaluate(s,category).map(d=>{const resolution=resolutionDetails(s,d.vendor,category),score={...d.score,support:resolution.score},active=Object.entries(score).filter(([k,v])=>v!==null&&s.weights[k]>0),coverage=active.reduce((n,[k])=>n+s.weights[k],0),overall=coverage?active.reduce((n,[k,v])=>n+s.weights[k]*v,0)/coverage:null;return {...d,score,overall,coverage,resolution};});};
Object.assign(L,{RESOLUTION_WEIGHTS:WEIGHTS,resolutionDetails});
return L;
});
