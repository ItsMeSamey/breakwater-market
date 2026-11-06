(function () {
  'use strict';
  const B = window.Breakwater;
  if (!B) return;
  const $ = id => document.getElementById(id);
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let state = B.initial(), selected = null;
  const quay = row => row ? 'Garden' : 'Waterfront';
  const percent = n => Math.round(n * 100) + '%';
  function notice(text) { $('status').textContent = text; }
  function render(focusId) {
    const f = B.forecast(state), p = B.preview(state), end = B.outcome(state);
    $('hud').innerHTML = `<div><strong>${Math.min(6, state.day + 1)} / 6</strong><span>Market day</span></div><div><strong>${state.cash}</strong><span>Coins available</span></div><div><strong>${end.open} / 3</strong><span>Stalls open</span></div><div><strong>${state.phase === 'plan' ? state.actions : '-'}</strong><span>Planning actions</span></div>`;
    $('phase-label').textContent = state.phase === 'plan' ? 'Plan, then reveal' : state.phase === 'settle' ? 'Repair, then collect' : 'Week complete';
    $('selection-help').textContent = state.phase === 'plan' ? selected === null ? 'Select a stall, then an empty berth. Moving costs 1 coin and 1 action.' : state.stalls[selected].name + ' selected. Choose an empty berth, or reopen it if closed.' : state.phase === 'settle' ? 'Select a closed stall to reopen it for 4 coins. You can also leave it closed.' : 'Your final market. Start another week to try different decisions.';
    $('board').innerHTML = Array.from({length: 6}, (_, pos) => {
      const t = state.stalls.find(t => t.pos === pos), row = Math.floor(pos / 3), col = pos % 3;
      const threats = [(row === f.row ? 'Surge zone' : ''), (col === f.col ? 'Fault lane' : '')].filter(Boolean).join(' + ');
      const label = `${quay(row)} lane ${col + 1}, ${t ? t.name + ', ' + (t.open ? 'open' : 'closed') : 'empty berth'}, earns ${B.earnings(pos,f)} coins${threats ? ', ' + threats : ''}`;
      return `<button id="berth-${pos}" class="berth ${t && t.id === selected ? 'selected' : ''} ${threats ? 'at-risk' : ''}" data-pos="${pos}" aria-label="${esc(label)}" ${state.phase === 'over' ? 'disabled' : ''} ${t ? `aria-pressed="${t.id === selected}"` : ''}><span class="location">${quay(row)} ${col + 1}${pos === f.bonus ? ' *' : ''}</span><span aria-hidden="true" class="${t ? 'stall-art ' + (t.open ? '' : 'closed') : 'empty'}">${t ? '' : '+'}</span><strong>${t ? t.name : 'Empty'}</strong><span class="income">${B.earnings(pos,f)} coins / day</span><span class="hazards">${threats || 'Outside today\'s zones'}</span></button>`;
    }).join('');
    const t = state.stalls.find(t => t.id === selected);
    $('actions').innerHTML = state.phase === 'over' ? '' : `<button id="repair" ${!t || t.open || state.cash < 4 || (state.phase === 'plan' && state.actions < 1) ? 'disabled' : ''}>Reopen ${t ? esc(t.name) : 'selected stall'} (4 coins${state.phase === 'plan' ? ', 1 action' : ''})</button>${state.phase === 'plan' ? `<button id="rescue" ${end.open || !state.actions ? 'disabled' : ''}>Rescue job (+4 coins, 1 action)</button>` : ''}`;
    $('forecast-title').textContent = state.phase === 'over' ? 'Final day forecast' : "Today's forecast";
    $('forecast').innerHTML = B.events(f).map(e => `<div class="ticket"><span>${esc(e.label)}<br><small>${e.kind === 'calm' ? 'No incident' : e.kind === 'surge' ? 'Hits every open stall on this quay' : 'Hits open stalls in this lane on both quays'}</small></span><b>${e.weight} of 4</b></div>`).join('');
    $('policies').innerHTML = [['none','Keep coins'],['surge','Surge cover'],['fault','Fault cover']].map(([value,label]) => `<button id="policy-${value}" data-policy="${value}" aria-pressed="${state.policy === value}" ${state.phase !== 'plan' ? 'disabled' : ''}>${label}<br>${value === 'none' ? '0 coins' : '2 coins'}</button>`).join('');
    if (state.phase === 'plan') {
      $('risk').innerHTML = p.affordable ? `<p><span class="risk-number">${percent(p.shortfall)}</span> chance you cannot reopen all stalls.</p><p>${p.available} coins remain after the premium, before the event. Income arrives later.</p>` : '<p>You cannot afford this premium. Choose no cover or keep two coins available.</p>';
      $('risk-table').innerHTML = p.outcomes.map(e => `<div class="risk-row"><strong>${esc(e.label)} (${percent(e.probability)})</strong>New damage ${e.bill}; existing repairs ${e.existingBill}; payout ${e.payout}; funding gap ${e.gap}.</div>`).join('');
    } else {
      $('risk').innerHTML = '<p>The event is revealed. The pre-event odds and cash trail remain below.</p>';
      $('risk-table').innerHTML = '<p>Open the cash trail after collecting income to compare the forecast with the draw.</p>';
    }
    $('event-panel').hidden = state.phase !== 'settle';
    if (state.event) {
      const e = state.event;
      $('event-panel').innerHTML = `<h2>${esc(e.label)}</h2><p>${e.hitIds.length ? e.hitIds.map(id => esc(state.stalls[id].name)).join(', ') + ' closed. Reopen each for 4 coins, or leave it closed for now.' : 'No new damage. Closed stalls from earlier days stay closed until repaired.'}</p><div class="cash-line"><span>Started: ${e.cashBefore}</span><span>Premium: -${e.premium}</span><span>New repair bill: ${e.bill}</span><span>Claim: +${e.payout}</span><span>Available now: ${state.cash}</span></div><p class="fine">The repair bill is a cost to reopen stalls, not a debt. ${e.premium && e.payout === 0 ? 'A premium is paid even when no covered claim is paid.' : 'Only new damage from the named covered incident can produce a claim.'} Before the draw, this plan had a ${percent(e.preview.shortfall)} chance of a funding gap. One lucky or unlucky draw does not change those odds.</p>`;
    }
    $('advance').hidden = state.phase === 'over';
    $('advance').disabled = state.phase === 'plan' && !p.affordable;
    $('advance').textContent = state.phase === 'plan' ? `Open day ${state.day + 1} market` : 'Collect income and finish day';
    $('advance-note').textContent = state.phase === 'plan' ? 'Cover is paid when you open. Check the forecast first.' : 'Only open stalls earn. You may leave a stall closed and repair it on a later day.';
    $('ending').hidden = state.phase !== 'over';
    if (state.phase === 'over') $('ending').innerHTML = `<h2>${end.lanterns ? 'Light the harbor.' : 'A week worth learning from.'}</h2><p>${end.cash} coins remain; ${end.open} of 3 stalls are open. ${end.lanterns ? 'You can fund the 18-coin lantern night with every stall trading.' : 'Lantern night needs 18 coins and all three stalls open. Try the same week again, or explore a new seed.'}</p><p>Seed: <strong>${esc(state.seed)}</strong>. These are game outcomes, not a measure of financial knowledge.</p><button id="replay" class="primary">Replay this week</button>`;
    $('history').innerHTML = state.history.length ? state.history.map(h => `<article class="history-day"><h3>Day ${h.day}: ${esc(h.label)}</h3><p>${h.cashBefore} before market - ${h.premium} premium + ${h.payout} claim - ${h.repairs} repairs + ${h.income} income = <strong>${h.cashEnd} coins</strong>. ${h.open} stalls open.</p><p>New damage bill: ${h.bill}. Pre-event funding-gap chance: ${percent(h.preview.shortfall)}.</p></article>`).join('') : '<p>No days completed yet. Your first market will appear here.</p>';
    if (focusId) { const el = $(focusId); if (el && !el.disabled) el.focus(); else if (!$('advance').hidden && !$('advance').disabled) $('advance').focus(); else $('restart').focus(); }
  }
  function perform(action, message, focusId) {
    try {
      state = B.act(state, action); $('error').hidden = true;
      if (action.type === 'collect') selected = null;
      render(focusId); notice(message);
      if (action.type === 'commit') { $('event-panel').classList.remove('reveal'); void $('event-panel').offsetWidth; $('event-panel').classList.add('reveal'); }
    } catch (error) { $('error').hidden = false; $('error').textContent = error.message; }
  }
  $('board').addEventListener('click', event => {
    const button = event.target.closest('[data-pos]'); if (!button) return;
    const pos = Number(button.dataset.pos), stall = state.stalls.find(t => t.pos === pos);
    if (stall) { selected = stall.id; render('berth-' + pos); notice(stall.name + ' selected. ' + (stall.open ? 'Choose an empty berth to move.' : 'Use Reopen to trade again.')); }
    else if (selected !== null && state.phase === 'plan') perform({type:'move', id:selected, pos}, 'Stall moved. Forecast and funding risk updated.', 'berth-' + pos);
    else { notice(state.phase === 'settle' ? 'Select a closed stall to reopen it. Moving is available tomorrow.' : 'Select a stall before choosing an empty berth.'); }
  });
  $('policies').addEventListener('click', event => {
    const b = event.target.closest('[data-policy]'); if (b) perform({type:'policy', value:b.dataset.policy}, 'Cover changed. No premium is charged until the market opens.', b.id);
  });
  $('actions').addEventListener('click', event => {
    if (event.target.id === 'repair') perform({type:'repair', id:selected}, 'Stall reopened. It can earn when you collect income.', selected === null ? 'advance' : 'berth-' + state.stalls[selected].pos);
    if (event.target.id === 'rescue') perform({type:'rescue'}, 'Rescue job complete: four coins added. Select a closed stall and reopen it.', 'berth-' + state.stalls[0].pos);
  });
  $('advance').addEventListener('click', () => perform({type:state.phase === 'plan' ? 'commit' : 'collect'}, state.phase === 'plan' ? 'Event revealed. Review the repair bill before collecting income.' : 'Income collected. The cash trail has been updated.', 'advance'));
  function openNew() { $('seed').value = state.seed; $('new-dialog').showModal(); }
  $('restart').addEventListener('click', openNew);
  $('ending').addEventListener('click', event => { if (event.target.id === 'replay') openNew(); });
  $('cancel-new').addEventListener('click', () => $('new-dialog').close());
  $('random-seed').addEventListener('click', () => {
    const words = new Uint32Array(1); crypto.getRandomValues(words);
    $('seed').value = 'HARBOR-' + words[0].toString(36).toUpperCase(); $('seed').focus();
  });
  $('new-form').addEventListener('submit', event => {
    event.preventDefault();
    try { state = B.initial($('seed').value.trim()); selected = null; $('new-dialog').close(); $('error').hidden = true; render('berth-0'); notice('A fresh six-day market. Read the forecast and make your first move.'); }
    catch (error) { $('seed').setCustomValidity(error.message); $('seed').reportValidity(); }
  });
  $('seed').addEventListener('input', () => $('seed').setCustomValidity(''));
  $('boot').hidden = true; render(); notice('Day 1: two planning actions. You can also open without moving.');
})();
