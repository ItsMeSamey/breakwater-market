'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const B=require('../core.js');
const cohort=process.argv[2];if(!['qualification','development'].includes(cohort))throw Error('Specify qualification or development');
const OUT=path.join(__dirname,'../evidence/v3-'+cohort); fs.mkdirSync(OUT,{recursive:true});
const seeds=Array.from({length:40},(_,i)=>(cohort==='qualification'?'QUAL-V3-':'DIAG-')+String(i+1).padStart(3,'0'));
const policies=['Reserve','Margin','Fixed berths'];
const seal={cohort,seeds,policies,files:{}};
for(const name of ['GAMEPLAY_DIAGNOSTIC_FREEZE.md','RULES_FREEZE.md','RULES_PRE_RUN_REVISION.md','RULES_V2.md','RULES_V3.md','V3_DIAGNOSTIC_CRITERIA_FREEZE.md','core.js','tests/gameplay-diagnostic-v3.cjs'])seal.files[name]=crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,'..',name))).digest('hex');
const sealPath=path.join(OUT,'gameplay-input-seal.json');
if(fs.existsSync(sealPath))throw Error('Existing gameplay evidence retained. Use a new explicitly versioned run path, not overwrite.');
fs.writeFileSync(sealPath,JSON.stringify(seal,null,2));
const clone=x=>JSON.parse(JSON.stringify(x));
function income(pos,f){return(pos<3?3:2)+(pos===f.bonus?1:0)-1;}
function settlementOrder(s,f){return s.stalls.filter(t=>!t.open).sort((a,b)=>income(b.pos,f)-income(a.pos,f)||a.id-b.id);}
function expect(s,f){
  let wealth=0,open=0;
  for(let ticket=0;ticket<4;ticket++){
    const v=clone(s),kind=ticket<2?'calm':ticket===2?'surge':'fault';
    const hits=v.stalls.filter(t=>t.open&&(kind==='surge'?Math.floor(t.pos/3)===f.row:kind==='fault'?t.pos%3===f.col:false));
    const bill=hits.length*4,claim=s.policy===kind&&kind!=='calm'?Math.min(6,Math.max(0,bill-2)):0;
    v.cash-=s.policy==='none'?0:2;v.cash+=claim;
    hits.forEach(t=>t.open=false);
    for(const t of settlementOrder(v,f))if(v.cash>=4){v.cash-=4;t.open=true;}
    v.cash+=v.stalls.reduce((n,t)=>n+(t.open?income(t.pos,f):0),0);
    const count=v.stalls.filter(t=>t.open).length;wealth+=(v.cash+4*count)/4;open+=count/4;
  }
  return{wealth,open};
}
function choose(observation,f,name){
  assert.deepEqual(Object.keys(observation).sort(),['actions','cash','phase','policy','rescueUsed','stalls']);
  const plans=[],seen=new Set();
  function visit(s,actions){
    const signature=JSON.stringify([s.cash,s.actions,s.rescueUsed,s.stalls]);if(seen.has(signature))return;seen.add(signature);
    for(const policy of ['none','surge','fault'])if(s.cash>=(policy==='none'?0:2)){
      const p={...s,policy},score=expect(p,f),key=JSON.stringify([...actions,{type:'policy',value:policy}]);
      plans.push({actions:[...actions,{type:'policy',value:policy}],...score,spend:observation.cash-s.cash,key});
    }
    if(!s.actions)return;
    const available=[];
    for(const t of s.stalls){
      if(name!=='Fixed berths'&&s.cash>=1)for(let pos=0;pos<6;pos++)if(!s.stalls.some(u=>u.pos===pos))available.push({type:'move',id:t.id,pos});
      if(!t.open&&s.cash>=3)available.push({type:'repair',id:t.id});
    }
    if(!s.rescueUsed&&!s.stalls.some(t=>t.open))available.push({type:'rescue'});
    available.sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)));
    for(const a of available)visit(B.act(s,a),[...actions,a]);
  }
  visit(clone(observation),[]);
  plans.sort((a,b)=>name==='Reserve'?(b.open-a.open||b.wealth-a.wealth||a.spend-b.spend||a.key.localeCompare(b.key)):(b.wealth-a.wealth||b.open-a.open||a.spend-b.spend||a.key.localeCompare(b.key)));
  return plans[0];
}
const results=[];const start=performance.now();
for(const seed of seeds)for(const name of policies){
  let s=B.initial(seed);const trace=[],counts={move:0,repair:0,scheduledRepair:0,emergencyRepair:0,rescue:0,none:0,surge:0,fault:0};
  for(let day=0;day<6;day++){
    const f=B.forecast(s),observation={cash:s.cash,stalls:clone(s.stalls),actions:s.actions,policy:s.policy,phase:s.phase,rescueUsed:s.rescueUsed};
    const chosen=choose(observation,f,name);
    for(const a of chosen.actions){s=B.act(s,a);counts[a.type==='policy'?a.value:a.type]++;if(a.type==='repair')counts.scheduledRepair++;}
    const layout=s.stalls.map(t=>t.pos),cash=s.cash,chosenRisk=B.preview(s).shortfall;s=B.act(s,{type:'commit'});
    const event=clone(s.event);assert.ok(event.payout>=0&&event.payout<=6);
    if(s.policy!==event.kind)assert.equal(event.payout,0);
    for(const t of settlementOrder(s,f))if(s.cash>=4){s=B.act(s,{type:'repair',id:t.id});counts.repair++;counts.emergencyRepair++;}
    s=B.act(s,{type:'collect'});
    const h=s.history.at(-1);assert.equal(h.cashEnd,h.cashBefore-h.premium+h.payout-h.repairs+h.grossIncome-h.supplies);
    assert.ok(s.cash>=0&&Number.isInteger(s.cash));assert.equal(new Set(s.stalls.map(t=>t.pos)).size,3);
    trace.push({day:day+1,forecast:f,actions:chosen.actions,expected:{wealth:chosen.wealth,open:chosen.open},layout,chosenRisk,cashBeforeMarket:cash,event:{kind:event.kind,row:event.row,col:event.col},cashEnd:s.cash,open:s.stalls.filter(t=>t.open).length});
  }
  assert.equal(s.phase,'over');const row={seed,policy:name,...B.outcome(s),counts,trace};results.push(row);fs.appendFileSync(path.join(OUT,'gameplay-completed.jsonl'),JSON.stringify(row)+'\n');
}
for(const seed of seeds){const rows=results.filter(r=>r.seed===seed);for(const row of rows.slice(1))assert.deepEqual(row.trace.map(t=>t.event),rows[0].trace.map(t=>t.event));}
const aggregate=policies.map(policy=>{
  const rows=results.filter(r=>r.policy===policy);return{policy,games:rows.length,goals:rows.filter(r=>r.lanterns).length,meanCash:rows.reduce((n,r)=>n+r.cash,0)/rows.length,minCash:Math.min(...rows.map(r=>r.cash)),maxCash:Math.max(...rows.map(r=>r.cash)),meanOpen:rows.reduce((n,r)=>n+r.open,0)/rows.length,uniqueLayouts:new Set(rows.flatMap(r=>r.trace.map(t=>t.layout.join(',')))).size,counts:rows.reduce((a,r)=>{for(const[k,v]of Object.entries(r.counts))a[k]=(a[k]||0)+v;return a;},{})};
});
const pairs=[];
for(let i=0;i<policies.length;i++)for(let j=i+1;j<policies.length;j++){
 const p={a:policies[i],b:policies[j],cashWin:0,cashTie:0,cashLoss:0,goalWin:0,goalTie:0,goalLoss:0,identicalPlans:0};
 for(const seed of seeds){const a=results.find(r=>r.seed===seed&&r.policy===p.a),b=results.find(r=>r.seed===seed&&r.policy===p.b);p[a.cash>b.cash?'cashWin':a.cash<b.cash?'cashLoss':'cashTie']++;p[Number(a.lanterns)>Number(b.lanterns)?'goalWin':Number(a.lanterns)<Number(b.lanterns)?'goalLoss':'goalTie']++;if(JSON.stringify(a.trace.map(t=>t.actions))===JSON.stringify(b.trace.map(t=>t.actions)))p.identicalPlans++;}pairs.push(p);
}
const daily=policies.map(policy=>({policy,days:Array.from({length:6},(_,day)=>{const values=results.filter(r=>r.policy===policy).map(r=>r.trace[day]);return{day:day+1,minCash:Math.min(...values.map(v=>v.cashEnd)),meanCash:values.reduce((n,v)=>n+v.cashEnd,0)/40,openCounts:[0,1,2,3].map(k=>values.filter(v=>v.open===k).length),nonzeroRisk:values.filter(v=>v.chosenRisk>0).length};})}));
const universalGoals=results.every(r=>r.lanterns),allOpenEveryDay=results.every(r=>r.trace.every(t=>t.open===3)),samePlans=pairs.find(p=>p.a==='Reserve'&&p.b==='Margin').identicalPlans===40;
const classification=universalGoals&&allOpenEveryDay&&samePlans?'PERSISTENT_TRIVIALITY':results.every(r=>!r.lanterns)?'UNIVERSAL_GOAL_FAILURE':'NONTRIVIALITY_NOT_RULED_OUT';
const report={cohort,classification,universalGoals,allOpenEveryDay,samePlans,daily,status:'complete',elapsedMs:performance.now()-start,node:process.version,aggregate,pairs,limits:'Synthetic causal policies with one-day expectations and common greedy settlement, not human play or learning evidence.'};
fs.writeFileSync(path.join(OUT,'gameplay-cases.json'),JSON.stringify(results,null,2));fs.writeFileSync(path.join(OUT,'gameplay-summary.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
