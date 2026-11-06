(function () {
  'use strict';
  const B = window.Breakwater;
  if (!B) return;
  const $ = id => document.getElementById(id);
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let state = B.initial(), selected = null, planningTrail = [];
  const quay = row => row ? 'Garden' : 'Waterfront';
  const percent = n => Math.round(n * 100) + '%';
  const berthName = pos => quay(Math.floor(pos / 3)) + ' ' + (pos % 3 + 1);
  function preparation(day) {
    const entries = planningTrail.filter(entry => entry.day === day);
    return entries.length ? entries.map(entry => esc(entry.text)).join('; ') : 'No planning spending or rescue income.';
  }
  function notice(text) { $('status').textContent = text; }
  function render(focusId) {
    const f = B.forecast(state), p = B.preview(state), end = B.outcome(state);
    $('hud').innerHTML = `<div><strong>${Math.min(6, state.day + 1)} / 6</strong><span>Market day</span></div><div><strong>${state.cash}</strong><span>Coins available</span></div><div><strong>${end.open} / 3</strong><span>Stalls open</span></div><div><strong>${state.phase === 'plan' ? state.actions : '-'}</strong><span>Planning actions</span></div>`;
    $('phase-label').textContent = state.phase === 'plan' ? 'Plan, then reveal' : state.phase === 'settle' ? 'Repair, then collect' : 'Week complete';
    $('selection-help').textContent = state.phase === 'plan' ? state.actions === 0 ? 'Both planning actions are used. Choose cover, then open the market.' : selected === null ? 'Select a stall, then an empty berth. Moving costs 1 coin and 1 action.' : state.stalls[selected].name + ' selected. Choose an empty berth, or reopen it if closed (3 coins, 1 action).' : state.phase === 'settle' ? 'Select a closed stall to reopen it for 4 coins, with no action cost. You can also leave it closed.' : 'Your final market. Start another week to try different decisions.';
    $('recovery-help').hidden = end.open > 0 || state.phase === 'over';
    $('recovery-help').textContent = state.phase === 'plan' ? !state.rescueUsed && state.actions > 0 ? 'Every stall is closed. A rescue job adds 4 coins once per day. With another action, schedule a reopening for 3 coins; otherwise reopen after the incident for 4.' : state.day === 5 ? 'Every stall is closed. Open the market to reach emergency repairs before the final collection.' : 'Every stall is closed. Open the market to reach emergency repairs. If you cannot reopen today, collect zero income to reach tomorrow\'s rescue job.' : state.cash >= 4 ? 'Every stall is closed. You can afford an emergency reopening before collecting income.' : state.day === 5 ? 'Every stall is closed and there is not enough cash to reopen. Collecting zero income will finish this week.' : 'Every stall is closed and there is not enough cash to reopen. Collect zero income; tomorrow\'s rescue job can help you recover.';
    $('board').innerHTML = Array.from({length: 6}, (_, pos) => {
      const t = state.stalls.find(t => t.pos === pos), row = Math.floor(pos / 3), col = pos % 3;
      const threats = [(row === f.row ? 'Surge zone' : ''), (col === f.col ? 'Fault lane' : '')].filter(Boolean).join(' + ');
      const label = `${quay(row)} lane ${col + 1}, ${t ? t.name + ', ' + (t.open ? 'open' : 'closed, currently earns zero') : 'empty berth'}, ${B.earnings(pos,f)} coins if open at collection${pos === f.bonus ? ', busy berth bonus included' : ''}${threats ? ', ' + threats : ''}`;
      const struck = state.phase === 'settle' && t && state.event.hitIds.includes(t.id);
      return `<button id="berth-${pos}" class="berth ${t && t.id === selected ? 'selected' : ''} ${threats ? 'at-risk' : ''} ${struck ? 'struck' : ''}" data-pos="${pos}" aria-label="${esc(label + (struck ? ', hit this day' : ''))}" ${state.phase === 'over' ? 'disabled' : ''} ${t ? `aria-pressed="${t.id === selected}"` : ''}><span class="location">${quay(row)} ${col + 1}${pos === f.bonus ? ' *' : ''}</span><span aria-hidden="true" class="${t ? 'stall-art ' + (t.open ? '' : 'closed') : 'empty'}">${t ? '' : '+'}</span><strong>${t ? t.name : 'Empty'}</strong><span class="income">${t && !t.open ? '0 closed / ' : ''}${B.earnings(pos,f)} if open</span><span class="hazards">${struck ? 'Hit today; ' : ''}${threats || 'Outside today\'s zones'}</span></button>`;
    }).join('');
    const t = state.stalls.find(t => t.id === selected);
    const repairCost = state.phase === 'plan' ? 3 : 4;
    $('actions').innerHTML = state.phase === 'over' ? '' : `<button id="repair" ${!t || t.open || state.cash < repairCost || (state.phase === 'plan' && state.actions < 1) ? 'disabled' : ''}>${state.phase === 'plan' ? 'Schedule reopening:' : 'Emergency reopen:'} ${t ? esc(t.name) : 'select a stall'} (${repairCost} coins${state.phase === 'plan' ? ', 1 action' : ''})</button>${state.phase === 'plan' ? `<button id="rescue" ${end.open || !state.actions || state.rescueUsed ? 'disabled' : ''}>${state.rescueUsed ? 'Rescue job used today' : 'Rescue job (+4 coins, 1 action)'}</button><p class="action-note">Scheduled reopening costs 3 coins, but exposes the stall to today\'s incident. Emergency reopening costs 4 coins after the incident.</p>` : ''}${t && !t.open && state.cash < repairCost ? `<p class="action-note">${esc(t.name)} needs ${repairCost - state.cash} more coin${repairCost - state.cash === 1 ? '' : 's'} to reopen in this phase.</p>` : ''}`;
    $('forecast-title').textContent = state.phase === 'over' ? 'Final day forecast' : "Today's forecast";
    $('forecast').innerHTML = B.events(f).map(e => `<div class="ticket"><span>${esc(e.label)}<br><small>${e.kind === 'calm' ? 'No incident' : e.kind === 'surge' ? 'Hits every open stall on this quay' : 'Hits open stalls in this lane on both quays'}</small></span><b>${e.weight} of 4</b></div>`).join('');
    $('policies').innerHTML = [['none','Keep coins'],['surge','Surge cover'],['fault','Fault cover']].map(([value,label]) => `<button id="policy-${value}" data-policy="${value}" aria-pressed="${state.policy === value}" ${state.phase !== 'plan' ? 'disabled' : ''}>${label}<br>${value === 'none' ? '0 coins' : '2 coins'}</button>`).join('');
    if (state.phase === 'plan') {
      $('risk').innerHTML = p.affordable ? `<p><span class="risk-number">${percent(p.shortfall)}</span> chance you cannot reopen all stalls.</p><p>${p.available} coins remain after the premium, before the event. Income arrives later.</p>` : '<p>You cannot afford this premium. Choose no cover or keep two coins available.</p>';
      $('risk-table').innerHTML = p.affordable ? '<p class="fine">All amounts are coins. Repairs use the 4-coin emergency price. A funding gap means available cash plus the claim cannot pay to reopen every stall before income.</p>' + p.outcomes.map(e => `<div class="risk-row"><strong>${esc(e.label)} (${percent(e.probability)})</strong>New damage ${e.bill}; existing repairs ${e.existingBill}; payout ${e.payout}; funding gap ${e.gap}.</div>`).join('') : '<p>Choose an affordable policy to calculate the funding gap.</p>';
    } else {
      $('risk').innerHTML = `<p>${state.phase === 'over' ? 'The week is complete.' : 'The event is revealed.'} The cash trail records the pre-event funding-gap chance for each completed day.</p>`;
      $('risk-table').innerHTML = '<p>Open the cash trail after collecting income to compare the forecast with the draw.</p>';
    }
    $('event-panel').hidden = state.phase !== 'settle';
    if (state.event) {
      const e = state.event;
      const claimText = state.policy === 'none' ? 'No cover selected: claim 0.' : e.kind !== state.policy ? 'This event is outside the selected cover: claim 0. The 2-coin premium is still paid.' : `Covered new damage ${e.bill} - deductible 2, floored at 0 and capped at 6 = claim ${e.payout}.`;
      $('event-panel').innerHTML = `<h2 id="event-title" tabindex="-1">${esc(e.label)}</h2><p>${e.hitIds.length ? e.hitIds.map(id => esc(state.stalls[id].name)).join(', ') + ' took new damage. The board shows which stalls are still closed. Reopen each for 4 coins, or leave it closed.' : 'No new damage. Closed stalls from earlier days stay closed until repaired.'}</p><div class="cash-line"><span>Before market: ${e.cashBefore}</span><span>Premium: -${e.premium}</span><span>Claim: +${e.payout}</span><span>Emergency repairs paid: -${e.cashAfterClaim - state.cash}</span><span>Available now: ${state.cash}</span></div><p>New damage: ${e.bill} coins. Existing closures: ${e.preview.existingBill} coins to reopen. ${claimText}</p><p class="fine">The repair bill is a cost to reopen stalls, not a debt. Existing closures never generate another claim. Before the draw, this plan had a ${percent(e.preview.shortfall)} chance of a funding gap. One lucky or unlucky draw does not change those odds.</p>`;
    }
    $('advance').hidden = state.phase === 'over';
    $('advance').disabled = state.phase === 'plan' && !p.affordable;
    $('advance').textContent = state.phase === 'plan' ? `Open day ${state.day + 1} market` : 'Collect income and finish day';
    $('advance-note').textContent = state.phase === 'plan' ? 'Cover is paid when you open. Unused planning actions expire.' : state.phase === 'over' ? 'The six-day week is complete.' : state.day === 5 ? 'Final collection: only open stalls earn. Reopen any stalls you can before finishing the week.' : 'Only open stalls earn. You may leave a stall closed and repair it on a later day.';
    $('ending').hidden = state.phase !== 'over';
    if (state.phase === 'over') $('ending').innerHTML = `<h2 id="ending-title" tabindex="-1">${end.lanterns ? 'Light the harbor.' : 'The market week is over.'}</h2><p>${end.cash} coins remain; ${end.open} of 3 stalls are open. ${end.lanterns ? 'You can fund the 18-coin lantern night with every stall trading.' : 'Lantern night needs 18 coins and all three stalls open. Try the same week again, or explore a new seed.'}</p><p>Seed: <strong>${esc(state.seed)}</strong>. These are game outcomes, not a measure of financial knowledge.</p><button id="replay" class="primary">Replay this week</button>`;
    const completed = state.history.map((h, i) => `<article class="history-day"><h3>Day ${h.day}: ${esc(h.label)}</h3><p>Started planning with ${i ? state.history[i - 1].cashEnd : 6} coins. ${preparation(h.day)} Before market: ${h.cashBefore} coins.</p><p>${h.cashBefore} before market - ${h.premium} premium + ${h.payout} claim - ${h.repairs} emergency repairs + ${h.income} income = <strong>${h.cashEnd} coins</strong>. ${h.open} stalls open.</p><p>New damage bill: ${h.bill}. Pre-event funding-gap chance: ${percent(h.preview.shortfall)}.</p></article>`).join('');
    const current = state.phase === 'over' ? '' : `<article class="history-day"><h3>Day ${state.day + 1}: ${state.phase === 'plan' ? 'preparing' : 'awaiting collection'}</h3><p>Started planning with ${state.history.length ? state.history[state.history.length - 1].cashEnd : 6} coins. ${preparation(state.day + 1)}</p><p>${state.phase === 'plan' ? 'Available now' : 'Before market'}: ${state.phase === 'plan' ? state.cash : state.event.cashBefore} coins. ${state.phase === 'plan' ? 'The selected premium has not been charged.' : 'The event panel shows premium, claim and emergency repair spending.'}</p></article>`;
    $('history').innerHTML = completed + current;
    if (focusId) { const el = $(focusId); if (el && !el.disabled) el.focus(); else if (!$('advance').hidden && !$('advance').disabled) $('advance').focus(); else $('restart').focus(); }
  }
  function perform(action, message, focusId) {
    try {
      const before = state;
      state = B.act(state, action); $('error').hidden = true;
      if (before.phase === 'plan') {
        const stall = before.stalls.find(t => t.id === action.id);
        const detail = action.type === 'move' ? `${stall.name}: ${berthName(stall.pos)} to ${berthName(action.pos)} (-1 coin)` : action.type === 'repair' ? `${stall.name}: scheduled reopening (-3 coins)` : action.type === 'rescue' ? 'Rescue job (+4 coins)' : '';
        if (detail) planningTrail.push({day: before.day + 1, text: detail});
      }
      if (action.type === 'collect') selected = null;
      if (action.type === 'commit') {
        focusId = 'event-title';
        message = `${state.event.label}. ${state.event.hitIds.length} stalls took new damage. Claim ${state.event.payout} coins; ${state.cash} coins available for emergency repairs.`;
      }
      if (action.type === 'collect') {
        const last = state.history[state.history.length - 1], end = B.outcome(state);
        focusId = state.phase === 'over' ? 'ending-title' : 'board-title';
        message = state.phase === 'over' ? `Week complete. ${last.income} coins collected; ${end.cash} coins remain and ${end.open} stalls are open. ${end.lanterns ? 'Lantern night funded.' : 'Lantern goal not reached.'}` : `${last.income} coins collected. Day ${state.day + 1}: ${state.cash} coins, ${end.open} stalls open, two planning actions. Read the new forecast.`;
      }
      render(focusId); notice(message);
      if (action.type === 'commit') { $('event-panel').classList.remove('reveal'); void $('event-panel').offsetWidth; $('event-panel').classList.add('reveal'); }
    } catch (error) { $('error').hidden = false; $('error').textContent = error.message; }
  }
  $('board').addEventListener('click', event => {
    const button = event.target.closest('[data-pos]'); if (!button) return;
    const pos = Number(button.dataset.pos), stall = state.stalls.find(t => t.pos === pos);
    if (stall) { selected = stall.id; $('error').hidden = true; render('berth-' + pos); notice(stall.name + ' selected. ' + (stall.open ? state.phase === 'plan' ? state.actions ? 'Choose an empty berth to move.' : 'Both planning actions are used. Choose cover and open the market.' : 'This stall will earn at collection. Moving is only available during planning.' : state.phase === 'plan' ? 'Scheduled reopening costs three coins and one action; the stall can be hit again today.' : 'Emergency reopening costs four coins.')); }
    else if (selected !== null && state.phase === 'plan') perform({type:'move', id:selected, pos}, 'Stall moved. Forecast and funding risk updated.', 'berth-' + pos);
    else { notice(state.phase === 'settle' ? 'Select a closed stall to reopen it. Moving is only available during planning.' : 'Select a stall before choosing an empty berth.'); }
  });
  $('policies').addEventListener('click', event => {
    const b = event.target.closest('[data-policy]'); if (b) perform({type:'policy', value:b.dataset.policy}, 'Cover changed. No premium is charged until the market opens.', b.id);
  });
  $('actions').addEventListener('click', event => {
    if (event.target.id === 'repair') perform({type:'repair', id:selected}, state.phase === 'plan' ? 'Scheduled reopening paid: three coins and one action. The stall can be hit again by today\'s incident.' : 'Emergency reopening paid: four coins. The stall will earn when you collect income.', selected === null ? 'advance' : 'berth-' + state.stalls[selected].pos);
    if (event.target.id === 'rescue') perform({type:'rescue'}, 'Rescue job complete: four coins added. Select a closed stall and reopen it.', 'berth-' + state.stalls[0].pos);
  });
  $('advance').addEventListener('click', () => perform({type:state.phase === 'plan' ? 'commit' : 'collect'}, state.phase === 'plan' ? 'Event revealed. Review the repair bill before collecting income.' : 'Income collected. The cash trail has been updated.', 'advance'));
  function openNew() { $('seed').value = state.seed; $('seed').setCustomValidity(''); $('cancel-new').textContent = state.phase === 'over' ? 'Keep this result' : 'Keep playing'; $('new-dialog').showModal(); }
  $('restart').addEventListener('click', openNew);
  $('ending').addEventListener('click', event => { if (event.target.id === 'replay') openNew(); });
  $('cancel-new').addEventListener('click', () => $('new-dialog').close());
  $('random-seed').addEventListener('click', () => {
    const words = new Uint32Array(1); crypto.getRandomValues(words);
    $('seed').value = 'HARBOR-' + words[0].toString(36).toUpperCase(); $('seed').setCustomValidity(''); $('seed').focus();
  });
  $('new-form').addEventListener('submit', event => {
    event.preventDefault();
    try { state = B.initial($('seed').value.trim()); selected = null; planningTrail = []; $('new-dialog').close(); $('error').hidden = true; render('board-title'); notice('A fresh six-day market. Read the forecast and make your first move.'); }
    catch (error) { $('seed').setCustomValidity(error.message); $('seed').reportValidity(); }
  });
  $('seed').addEventListener('input', () => $('seed').setCustomValidity(''));
  render(); $('boot').hidden = true; $('restart').disabled = false; notice('Day 1: two planning actions. You can also open without moving.');
})();
