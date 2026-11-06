'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const B = require('../core.js');
const clone = s => JSON.parse(JSON.stringify(s));
test('zero cash and three closed stalls can recover production without debt', () => {
  let s = B.initial('RESCUE'); s.cash = 0; s.stalls.forEach(t => t.open = false);
  s = B.act(s,{type:'rescue'}); assert.equal(s.cash,4); assert.equal(s.actions,1);
  s = B.act(s,{type:'repair',id:0}); assert.equal(s.cash,0); assert.equal(s.actions,0); assert.ok(s.stalls[0].open);
  // A later shock can close the stall again, but neither path locks the next planning phase.
  s = B.act(s,{type:'commit'}); s = B.act(s,{type:'collect'});
  assert.equal(s.phase,'plan'); assert.equal(s.actions,2); assert.ok(s.cash>=0);
  if (!s.stalls.some(t=>t.open)) assert.equal(B.act(s,{type:'rescue'}).cash,s.cash+4);
  else assert.ok(s.cash>=2);
});
test('closed stalls cannot generate repeat claims and still need repair funds', () => {
  const s = B.initial(); s.cash=2; s.policy='surge'; s.stalls.forEach(t=>t.open=false);
  const p=B.previewFor(s,{row:0,col:0,bonus:0});
  assert.equal(p.shortfall,1); assert.equal(p.existingBill,12); assert.equal(p.rawMean,0); assert.equal(p.payoutMean,0);
});
test('invalid actions leave input unchanged and spending is bounded', () => {
  const s=B.initial(), before=clone(s);
  for (const action of [{type:'move',id:0,pos:1},{type:'move',id:0,pos:8},{type:'repair',id:0},{type:'rescue'},{type:'policy',value:'all'}]) assert.throws(()=>B.act(s,action));
  assert.deepEqual(s,before);
  const poor={...s,cash:0,policy:'fault'};
  assert.equal(B.preview(poor).affordable,false); assert.equal(B.preview(poor).shortfall,null);
  assert.throws(()=>B.act(poor,{type:'commit'})); assert.equal(poor.cash,0);
});
test('planning cannot produce unlimited actions or reuse a committed market', () => {
  let s=B.initial(); s=B.act(s,{type:'move',id:0,pos:2}); s=B.act(s,{type:'move',id:0,pos:3});
  assert.equal(s.actions,0); assert.throws(()=>B.act(s,{type:'move',id:0,pos:4}));
  s=B.act(s,{type:'commit'}); assert.throws(()=>B.act(s,{type:'commit'})); assert.throws(()=>B.act(s,{type:'policy',value:'none'}));
});
test('insurance boundaries, exclusions and premiums are explicit', () => {
  assert.deepEqual([0,4,8,12].map(n=>B.claim(n,'surge','surge')),[0,2,6,6]);
  assert.equal(B.claim(12,'surge','fault'),0); assert.equal(B.claim(12,'none','surge'),0);
  assert.equal(B.premium('none'),0); assert.equal(B.premium('fault'),2);
});
test('preview depends only on current public inputs and is immutable', () => {
  const s=B.initial(), copy=clone(s), f={row:1,col:2,bonus:0};
  const p=B.previewFor(s,f);
  const other={...s,seed:'DIFFERENT',day:5,future:[1,2,3],ticket:3};
  assert.deepEqual(B.previewFor(other,{...f,bonus:5}),p); assert.deepEqual(s,copy);
});
test('six-day sequence is deterministic, has exact cash trails and terminates', () => {
  function run() {
    let s=B.initial('AUDIT-REPLAY');
    for(let i=0;i<6;i++) {
      const before=clone(s); s=B.act(s,{type:'commit'}); assert.equal(before.phase,'plan');
      const e=clone(s.event); assert.ok(e.payout<=6); assert.ok(s.cash>=0);
      for(const t of s.stalls) if(!t.open&&s.cash>=4) s=B.act(s,{type:'repair',id:t.id});
      s=B.act(s,{type:'collect'}); const h=s.history.at(-1);
      assert.equal(h.cashEnd,h.cashBefore-h.premium+h.payout-h.repairs+h.income);
      assert.equal(new Set(s.stalls.map(t=>t.pos)).size,3); assert.ok(Number.isInteger(s.cash));
    }
    assert.equal(s.phase,'over'); assert.equal(s.day,6); assert.throws(()=>B.act(s,{type:'commit'})); return s;
  }
  assert.deepEqual(run(),run());
});
test('event sequence is independent of planning actions', () => {
  let a=B.initial('PAIRED'),b=B.initial('PAIRED'); b=B.act(b,{type:'move',id:0,pos:3});
  for(let day=0;day<6;day++) {
    a=B.act(a,{type:'commit'}); b=B.act(b,{type:'commit'});
    assert.equal(a.event.kind,b.event.kind); assert.equal(a.event.row,b.event.row); assert.equal(a.event.col,b.event.col);
    a=B.act(a,{type:'collect'}); b=B.act(b,{type:'collect'});
  }
});
test('seed validation and unavailable operations fail clearly', () => {
  assert.throws(()=>B.initial('')); assert.throws(()=>B.initial('<script>')); assert.throws(()=>B.initial('A'.repeat(25)));
  assert.throws(()=>B.act(B.initial(),{type:'collect'}));
});
