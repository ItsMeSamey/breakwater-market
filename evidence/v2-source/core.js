(function (root) {
  'use strict';
  const names = ['Copper', 'Mint', 'Coral'];
  const policies = ['none', 'surge', 'fault'];
  const copy = value => JSON.parse(JSON.stringify(value));
  function seedValue(text) {
    let h = 2166136261;
    for (const c of String(text)) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
    return h >>> 0;
  }
  function random(seed) {
    let x = seed || 1;
    return () => { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return (x >>> 0) / 4294967296; };
  }
  function season(seed) {
    const forecastRng = random(seedValue('forecast:' + seed));
    const eventRng = random(seedValue('events:' + seed));
    return Array.from({length: 6}, () => ({
      row: Math.floor(forecastRng() * 2), col: Math.floor(forecastRng() * 3),
      bonus: Math.floor(forecastRng() * 6), ticket: Math.floor(eventRng() * 4)
    }));
  }
  function initial(seed = 'HARBOR-1') {
    if (!/^[A-Za-z0-9-]{1,24}$/.test(seed)) throw new Error('Use 1 to 24 letters, numbers or hyphens for a seed.');
    return {seed, day: 0, cash: 6, stalls: [0, 1, 5].map((pos, id) => ({id, name: names[id], pos, open: true})),
      actions: 2, rescueUsed: false, policy: 'none', phase: 'plan', history: [], event: null};
  }
  function forecast(state) {
    const {row, col, bonus} = season(state.seed)[Math.min(state.day, 5)];
    return {row, col, bonus};
  }
  function events(f) {
    return [{kind: 'calm', weight: 2, label: 'Calm market'},
      {kind: 'surge', row: f.row, weight: 1, label: (f.row ? 'Garden' : 'Waterfront') + ' quay surge'},
      {kind: 'fault', col: f.col, weight: 1, label: 'Cable fault, lane ' + (f.col + 1)}];
  }
  function hit(stall, event) {
    return stall.open && (event.kind === 'surge' ? Math.floor(stall.pos / 3) === event.row :
      event.kind === 'fault' ? stall.pos % 3 === event.col : false);
  }
  function premium(policy) { return policy === 'none' ? 0 : 2; }
  function claim(bill, policy, eventKind) {
    return policy !== 'none' && policy === eventKind ? Math.min(6, Math.max(0, bill - 2)) : 0;
  }
  function previewFor(state, publicForecast) {
    const available = state.cash - premium(state.policy);
    const existingBill = 4 * state.stalls.filter(s => !s.open).length;
    const outcomes = events(publicForecast).map(event => {
      const bill = 4 * state.stalls.filter(s => hit(s, event)).length;
      const payout = claim(bill, state.policy, event.kind);
      return {...event, probability: event.weight / 4, bill, payout, existingBill, gap: Math.max(0, existingBill + bill - payout - available)};
    });
    return {available, affordable: available >= 0, outcomes, existingBill,
      rawMean: outcomes.reduce((n, e) => n + e.bill * e.probability, 0),
      payoutMean: outcomes.reduce((n, e) => n + e.payout * e.probability, 0),
      shortfall: available < 0 ? null : outcomes.reduce((n, e) => n + (e.gap > 0 ? e.probability : 0), 0)};
  }
  function preview(state) { return previewFor(state, forecast(state)); }
  function act(state, action) {
    const s = copy(state);
    const fail = message => { throw new Error(message); };
    if (action.type === 'policy') {
      if (s.phase !== 'plan') fail('Choose cover before opening the market.');
      if (!policies.includes(action.value)) fail('Choose a listed policy.');
      s.policy = action.value; return s;
    }
    if (action.type === 'move' || action.type === 'repair' || action.type === 'rescue') {
      if (s.phase !== 'plan' && !(s.phase === 'settle' && action.type === 'repair')) fail('This action is not available now.');
      if (s.phase === 'plan' && s.actions < 1) fail('Both planning actions are used. Open the market to continue.');
      if (action.type === 'rescue') {
        if (s.stalls.some(t => t.open)) fail('The rescue job is available only when every stall is closed.');
        if (s.rescueUsed) fail('The rescue job is available only once per day.');
        s.cash += 4; s.actions--; s.rescueUsed = true; return s;
      }
      const stall = s.stalls.find(t => t.id === action.id);
      if (!stall) fail('Choose a stall first.');
      if (action.type === 'move') {
        if (!Number.isInteger(action.pos) || action.pos < 0 || action.pos > 5) fail('Choose a berth on the board.');
        if (s.stalls.some(t => t.pos === action.pos)) fail('That berth is occupied. Choose an empty one.');
        if (s.cash < 1) fail('Moving needs one coin.');
        stall.pos = action.pos; s.cash--; s.actions--;
      } else {
        if (stall.open) fail('That stall is already open.');
        const price = s.phase === 'plan' ? 3 : 4;
        if (s.cash < price) fail('Reopening needs ' + price + ' coins. Leave it closed for now, or use a rescue job when all are closed.');
        stall.open = true; s.cash -= price;
        if (s.phase === 'plan') s.actions--;
      }
      return s;
    }
    if (action.type === 'commit') {
      if (s.phase !== 'plan') fail('The market has already opened.');
      const price = premium(s.policy);
      if (s.cash < price) fail('This policy needs two coins. Choose no cover or keep enough cash.');
      const f = forecast(s), ticket = season(s.seed)[s.day].ticket;
      const event = events(f)[ticket < 2 ? 0 : ticket - 1];
      const hitIds = s.stalls.filter(t => hit(t, event)).map(t => t.id);
      const bill = hitIds.length * 4, payout = claim(bill, s.policy, event.kind);
      const before = s.cash;
      s.cash = s.cash - price + payout;
      s.stalls.forEach(t => { if (hitIds.includes(t.id)) t.open = false; });
      s.phase = 'settle';
      s.event = {...event, hitIds, bill, payout, premium: price, cashBefore: before,
        cashAfterClaim: s.cash, preview: preview(state)};
      return s;
    }
    if (action.type === 'collect') {
      if (s.phase !== 'settle') fail('Open the market before collecting income.');
      const f = forecast(s);
      const income = s.stalls.reduce((sum, t) => sum + (t.open ? earnings(t.pos, f) : 0), 0);
      const repairs = s.event.cashAfterClaim - s.cash;
      s.cash += income;
      s.history.push({day: s.day + 1, ...s.event, repairs, income, cashEnd: s.cash,
        open: s.stalls.filter(t => t.open).length});
      s.day++;
      s.phase = s.day === 6 ? 'over' : 'plan';
      s.actions = 2; s.rescueUsed = false; s.policy = 'none'; s.event = null;
      return s;
    }
    fail('Unknown action.');
  }
  function earnings(pos, f) { return (pos < 3 ? 3 : 2) + (pos === f.bonus ? 1 : 0); }
  function outcome(s) { return {cash: s.cash, open: s.stalls.filter(t => t.open).length,
    lanterns: s.phase === 'over' && s.cash >= 18 && s.stalls.every(t => t.open)}; }
  const api = {initial, forecast, events, hit, premium, claim, preview, previewFor, act, earnings, outcome, seedValue, season};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Breakwater = api;
})(typeof globalThis === 'undefined' ? this : globalThis);
