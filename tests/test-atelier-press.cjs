const assert=require('node:assert/strict');

const L=require('../resolution.js');
const copy=x=>JSON.parse(JSON.stringify(x));
let checks=0;const ok=(b,m)=>{assert(b,m);checks++};const rejects=(f,m)=>{assert.throws(f,undefined,m);checks++};
const line=(qty=1,variant='Clamshell')=>({item:'press',variant,qty,needBy:15});
function order(s,lines=[line()]){const pr=L.createPR(s,lines,'Heat-press availability test');L.approvePR(s,pr.id);lines.forEach((_,i)=>L.award(s,pr.id,i,'atelier'));const ids=L.createPOs(s,pr.id);return L.getPO?L.getPO(s,ids[0]):s.pos.find(p=>p.id===ids[0]);}
function go(s,day){if(day>s.day)L.advance(s,day-s.day);}
let s=L.newRun();let q=L.quote(s,'atelier',line());
ok(q.eligible&&q.stock===1&&q.price===920&&q.delivery===13&&!q.backorder,'One Clamshell unit is stocked and quoted for Day 13');
q=L.quote(s,'atelier',line(2));ok(q.eligible&&q.backorder&&q.delivery===34&&q.late,'Two units require replenishment and show a late delivery');
ok(!L.quote(s,'atelier',line(3)).eligible,'Larger orders exceed capacity');
ok(!L.quote(s,'atelier',line(1,'Swing-away')).eligible,'Unsupported configuration stays unavailable');
s.mode='clean';let p=order(s);ok(p.freight===45&&L.total(p)===965,'Correct PO price and one freight charge');
ok(s.stock.atelier.press===0&&L.quote(s,'atelier',line()).backorder,'Ordering consumes stock');
go(s,p.arrival);L.receive(s,p.id);L.makeInvoice(s,p.id);L.postInvoice(s,p.id);L.pay(s,p.id);
ok(p.payment.amount===965&&L.budgetSummary(s).spent===96500,'Complete receipt, invoice and payment reconcile with the budget');
assert.deepEqual(L.validateImport(copy(s)),s);checks++;
s=L.newRun();s.mode='clean';p=order(s,[{item:'tee',variant:'Black',qty:50,needBy:15},line()]);ok(s.pos.length===1&&p.lines.length===2&&L.total(p)===3065,'Mixed Atelier basket uses one PO and one freight charge');
s=L.newRun();s.mode='shortage';p=order(s);go(s,p.arrival);L.receive(s,p.id);ok(L.remaining(p)[0]===1,'One-unit shortage remains recoverable');const c=L.consultSupplier(s,p.id);go(s,c.responds);const remedy=c.options.find(o=>o.key==='standard');ok(remedy.supplierStatement.includes('machinery partner'),'Equipment recovery uses partner-specific explanation');L.selectResolution(s,c.id,remedy.id);go(s,p.recovery.due);L.receiveRecovery(s,p.id);L.makeInvoice(s,p.id);L.postInvoice(s,p.id);L.pay(s,p.id);ok(L.remaining(p)[0]===0&&p.payment,'Heat-press recovery completes the procurement process');
const prior=copy(L.newRun());delete prior.catalogueVersion;delete prior.stock.atelier.press;const original=JSON.stringify(prior);const migrated=L.validateImport(prior);ok(migrated.catalogueVersion===2&&migrated.stock.atelier.press===1,'Legacy exports receive the new stock entry');ok(JSON.stringify(prior)===original,'Import migration does not mutate the supplied run');ok(migrated.stock.atelier.tee===prior.stock.atelier.tee&&migrated.stock.atelier.sew===prior.stock.atelier.sew,'Existing inventory remains unchanged');
const damaged=copy(L.newRun());delete damaged.stock.atelier.press;rejects(()=>L.validateImport(damaged),'New exports with missing inventory are rejected');
const invalid=copy(s);delete invalid.catalogueVersion;delete invalid.stock.atelier.press;rejects(()=>L.validateImport(invalid),'Do not invent missing stock when a heat-press PO already exists');
const legacy=require('./helpers/legacy-run.cjs')(L);const upgraded=L.validateImport(legacy);ok(upgraded.pos.length===legacy.pos.length&&upgraded.stock.atelier.press===1,'Synthetic legacy run still imports');assert.deepEqual(upgraded.pos,legacy.pos);checks++;
s=L.newRun();L.advance(s,50);const profile=L.marketProfile(s,'atelier');q=L.quote(s,'atelier',line());ok(q.eligible&&q.delivery===s.day+Math.max(1,12+profile.leadDelta),'Day-skip conditions affect the new heat-press lead time');const capacity=Math.max(1,Math.floor(2*profile.capacityFactor));ok(L.quote(s,'atelier',line(2)).eligible===(capacity>=2),'Day-skip conditions affect small-order capacity');
console.log(JSON.stringify({passed:checks,status:'Atelier configurations, replenishment, procurement, recovery and saved-run compatibility passed'}));
