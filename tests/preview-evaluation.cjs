'use strict';

// Independent v1 evaluator. Only the production preview entry point is used.
const { previewFor } = require('../core.js');
const { createHash } = require('node:crypto');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const EPSILON = 1e-12;
const coordinates = [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2]];
const POLICY_NAMES = ['none', 'surge', 'fault'];
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');

function input(positions, row, col, cash, policy, active = [true, true, true]) {
  return {
    state: { cash, policy, stalls: positions.map((pos, id) => ({ id, pos, open: active[id] })) },
    forecast: { row, col }
  };
}
function referencePayment(loss, policy, kind) {
  if (policy === 'none' || policy !== kind) return 0;
  if (loss <= 2) return 0;
  return loss - 2 > 6 ? 6 : loss - 2;
}
function jointTickets(example) {
  const { state, forecast } = example;
  return ['calm', 'calm', 'surge', 'fault'].map(kind => ({
    kind,
    probability: 0.25,
    categories: state.stalls.map(stall => {
      if (!stall.open) return 'none';
      const [row, col] = coordinates[stall.pos];
      if (kind === 'surge' && row === forecast.row) return 'surge';
      if (kind === 'fault' && col === forecast.col) return 'fault';
      return 'none';
    })
  }));
}
function marginalCategories(example) {
  return example.state.stalls.map(stall => {
    if (!stall.open) return [{ kind: 'none', probability: 1 }];
    const [row, col] = coordinates[stall.pos];
    const surge = row === example.forecast.row ? 0.25 : 0;
    const fault = col === example.forecast.col ? 0.25 : 0;
    return [{ kind: 'none', probability: 1 - surge - fault },
      { kind: 'surge', probability: surge }, { kind: 'fault', probability: fault }]
      .filter(item => item.probability > 0);
  });
}
function independentOutcomes(example) {
  const marginals = marginalCategories(example);
  const outcomes = [];
  function append(index, categories, probability) {
    if (index === marginals.length) {
      outcomes.push({ categories, probability });
      return;
    }
    for (const entry of marginals[index]) {
      append(index + 1, [...categories, entry.kind], probability * entry.probability);
    }
  }
  append(0, [], 1);
  return outcomes;
}
function reference(example, outcomes) {
  const { state } = example;
  const premium = state.policy === 'none' ? 0 : 2;
  const available = state.cash - premium;
  const existingBill = state.stalls.filter(stall => !stall.open).length * 4;
  const detail = outcomes.map(outcome => {
    const bill = outcome.categories.filter(kind => kind !== 'none').length * 4;
    const coveredBill = state.policy === 'none' ? 0 : outcome.categories.filter(kind => kind === state.policy).length * 4;
    const payout = referencePayment(coveredBill, state.policy, state.policy);
    const gap = Math.max(0, existingBill + bill - available - payout);
    return { ...outcome, bill, payout, existingBill, gap };
  });
  return {
    affordable: available >= 0, available, existingBill,
    mass: detail.reduce((sum, event) => sum + event.probability, 0),
    rawMean: detail.reduce((sum, event) => sum + event.bill * event.probability, 0),
    payoutMean: detail.reduce((sum, event) => sum + event.payout * event.probability, 0),
    shortfall: available < 0 ? null : detail.reduce((sum, event) => sum + (event.gap > 0 ? event.probability : 0), 0),
    detail
  };
}
function compact(result) {
  return { affordable: result.affordable, available: result.available,
    existingBill: result.existingBill, rawMean: result.rawMean,
    payoutMean: result.payoutMean, shortfall: result.shortfall };
}

const primary = [];
for (let a = 0; a < 4; a++) {
  for (let b = a + 1; b < 5; b++) {
    for (let c = b + 1; c < 6; c++) {
      for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 3; col++) {
          for (const policy of POLICY_NAMES) {
            for (let cash = 0; cash <= 18; cash++) {
              if (policy !== 'none' && cash < 2) continue;
              primary.push(input([a, b, c], row, col, cash, policy));
            }
          }
        }
      }
    }
  }
}
// This is emitted before any preview invocation so the input pin precedes results.
const primaryInputSha256 = sha256(JSON.stringify(primary));
process.stderr.write(JSON.stringify({ stage: 'frozen-inputs', specification: 'v1',
  cases: primary.length, primaryInputSha256 }) + '\n');

const report = {
  specification: 'EVALUATION_DRAFT.md version 1, frozen before implementation',
  scope: 'Current-round technical risk preview versus our own independence ablation; no gameplay or education claim.',
  sourcePins: {
    evaluator: sha256(readFileSync(__filename)),
    core: sha256(readFileSync(path.join(__dirname, '..', 'core.js'))),
    specification: sha256(readFileSync(path.join(__dirname, '..', 'EVALUATION_DRAFT.md'))),
    rulesRevision: sha256(readFileSync(path.join(__dirname, '..', 'RULES_PRE_RUN_REVISION.md')))
  },
  primaryInputSha256,
  primaryCaseCount: primary.length,
  tolerance: EPSILON,
  checks: 0,
  failures: [],
  primary: [],
  controls: [],
  pendingIntegrationChecks: [
    'Rendered percent rounding is a UI check and is not executed by this pure-entry-point evaluator.',
    'Playable zero-cash/all-closed rescue and action-independent full-season replay require game integration checks.'
  ]
};
function check(condition, label, context, actual, expected) {
  report.checks++;
  if (!condition) report.failures.push({ label, context, actual, expected });
}
function close(actual, expected, label, context) {
  check(Number.isFinite(actual) && Number.isFinite(expected) && Math.abs(actual - expected) <= EPSILON,
    label, context, actual, expected);
}
function validateActual(example, expected, context) {
  const before = JSON.stringify(example);
  let actual;
  try { actual = previewFor(example.state, example.forecast); }
  catch (error) {
    check(false, 'production preview threw', context, error.message, 'valid result');
    return null;
  }
  check(JSON.stringify(example) === before, 'preview preserves input', context);
  if (!actual || typeof actual !== 'object') {
    check(false, 'preview returns an object', context, actual, 'object');
    return null;
  }
  check(actual.affordable === expected.affordable, 'policy affordability', context, actual.affordable, expected.affordable);
  for (const key of ['available', 'existingBill', 'rawMean', 'payoutMean']) close(actual[key], expected[key], key, context);
  if (expected.shortfall === null) check(actual.shortfall === null, 'unaffordable policy has no valid risk probability', context, actual.shortfall, null);
  else {
    close(actual.shortfall, expected.shortfall, 'joint shortfall', context);
    check(actual.shortfall >= 0 && actual.shortfall <= 1, 'shortfall bounded', context, actual.shortfall);
  }
  if (!Array.isArray(actual.outcomes)) {
    check(false, 'outcome distribution exists', context);
    return actual;
  }
  close(actual.outcomes.reduce((sum, event) => sum + event.probability, 0), 1, 'production probability mass', context);
  check(actual.outcomes.length === 3, 'three aggregated event classes', context, actual.outcomes.length, 3);
  for (const kind of ['calm', 'surge', 'fault']) {
    const matches = actual.outcomes.filter(event => event.kind === kind);
    check(matches.length === 1, 'one outcome per event class', { ...context, kind }, matches.length, 1);
    if (matches.length !== 1) continue;
    const event = matches[0], tickets = expected.detail.filter(item => item.kind === kind), want = tickets[0];
    close(event.probability, tickets.reduce((sum, item) => sum + item.probability, 0), 'event probability', { ...context, kind });
    for (const key of ['bill', 'payout', 'existingBill', 'gap']) close(event[key], want[key], 'event ' + key, { ...context, kind });
  }
  return actual;
}
function evaluate(example, context) {
  const expected = reference(example, jointTickets(example));
  const ablation = reference(example, independentOutcomes(example));
  close(expected.mass, 1, 'reference probability mass', context);
  close(ablation.mass, 1, 'independence probability mass', context);
  close(ablation.rawMean, expected.rawMean, 'matched mean raw damage', context);
  const actual = validateActual(example, expected, context);
  return { input: example, expected: compact(expected), actual: actual ? compact(actual) : null,
    independence: compact(ablation) };
}
function control(name, example) {
  const row = evaluate(example, { control: name });
  report.controls.push({ name, ...row });
  return row;
}

try {
  check(primary.length === 6360, 'frozen primary case count', {}, primary.length, 6360);
  for (let index = 0; index < primary.length; index++) {
    report.primary.push({ id: index + 1, ...evaluate(primary[index], { primary: index + 1 }) });
  }

  // Closed-stall factorial: 6 forecasts x 8 open masks x 3 policies x 5 balances.
  let closedCount = 0;
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 3; col++) {
      for (let mask = 0; mask < 8; mask++) {
        for (const policy of POLICY_NAMES) {
          for (const cash of [2, 4, 6, 8, 12]) {
            const active = [0, 1, 2].map(index => Boolean(mask & (1 << index)));
            const item = control('closed-factorial-' + (++closedCount), input([0, 1, 5], row, col, cash, policy, active));
            const exposures = item.input.state.stalls.filter(stall => stall.open &&
              (coordinates[stall.pos][0] === row || coordinates[stall.pos][1] === col)).length;
            if (exposures <= 1) {
              close(item.independence.shortfall, item.expected.shortfall, 'at most one stochastic exposure agrees', { control: closedCount });
              close(item.independence.payoutMean, item.expected.payoutMean, 'at most one exposure payout agrees', { control: closedCount });
            }
          }
        }
      }
    }
  }
  check(closedCount === 720, 'closed-state factorial count', {}, closedCount, 720);

  for (const policy of ['surge', 'fault']) {
    for (const cash of [0, 1]) control('unaffordable-' + policy + '-' + cash, input([0, 1, 5], 0, 2, cash, policy));
  }

  // Event-level payout boundaries, including pre-existing closed stalls.
  for (let count = 0; count <= 3; count++) {
    const active = [0, 1, 2].map(index => index < count);
    const example = input([0, 1, 2], 0, 0, 20, 'surge', active);
    const item = control('covered-bill-' + 4 * count, example);
    const actual = previewFor(example.state, example.forecast);
    close(actual.outcomes.find(event => event.kind === 'surge').payout, [0, 2, 6, 6][count], 'fixed covered-loss boundary', { count });
    close(actual.outcomes.find(event => event.kind === 'fault').payout, 0, 'other peril excluded', { count });
    close(actual.outcomes.find(event => event.kind === 'calm').payout, 0, 'calm never pays', { count });
    close(item.actual.available, 18, 'premium remains paid on calm day', { count });
  }
  const equality = control('exact-cash-boundary', input([0, 1, 2], 0, 0, 8, 'surge'));
  const equalityPreview = previewFor(equality.input.state, equality.input.forecast);
  close(equalityPreview.outcomes.find(event => event.kind === 'surge').gap, 0, 'available plus cap exactly pays full bill', {});

  // A fixed, predeclared explanatory case, not a case selected after results.
  const illustration = control('predeclared-counterexample', input([0, 1, 5], 0, 2, 4, 'none'));
  close(illustration.expected.shortfall, 0.25, 'fixed exact counterexample', {});
  close(illustration.independence.shortfall, 5 / 32, 'fixed independence counterexample', {});
  close(illustration.expected.rawMean, 3, 'fixed raw-mean counterexample', {});

  // Deterministic symmetry subset, independent of observed error.
  const symmetryBases = primary.filter((_, index) => index % 265 === 0).slice(0, 24);
  for (let index = 0; index < symmetryBases.length; index++) {
    const base = symmetryBases[index];
    const baseExpected = reference(base, jointTickets(base));
    for (const type of ['row-mirror', 'column-cycle']) {
      const transform = pos => type === 'row-mirror' ? (pos + 3) % 6 : Math.floor(pos / 3) * 3 + (pos % 3 + 1) % 3;
      const variant = input(base.state.stalls.map(stall => transform(stall.pos)),
        type === 'row-mirror' ? 1 - base.forecast.row : base.forecast.row,
        type === 'column-cycle' ? (base.forecast.col + 1) % 3 : base.forecast.col,
        base.state.cash, base.state.policy);
      const item = control(type + '-' + index, variant);
      for (const key of ['shortfall', 'rawMean', 'payoutMean']) {
        close(item.expected[key], baseExpected[key], 'reference symmetry ' + key, { type, index });
        const originalIndependent = reference(base, independentOutcomes(base));
        close(item.independence[key], originalIndependent[key], 'independence symmetry ' + key, { type, index });
      }
    }
  }

  // A true product-distribution control constructed with explicit nested loops,
  // separate from the recursive marginal-outcome generator above.
  const productExample = input([0, 1, 3], 0, 0, 4, 'surge');
  const trueIndependent = [];
  for (const [first, p1] of [['none', 0.5], ['surge', 0.25], ['fault', 0.25]]) {
    for (const [second, p2] of [['none', 0.75], ['surge', 0.25]]) {
      for (const [third, p3] of [['none', 0.75], ['fault', 0.25]]) {
        trueIndependent.push({ categories: [first, second, third], probability: p1 * p2 * p3 });
      }
    }
  }
  const independentlyTrue = reference(productExample, trueIndependent);
  const productAblation = reference(productExample, independentOutcomes(productExample));
  for (const key of ['mass', 'shortfall', 'rawMean', 'payoutMean']) close(productAblation[key], independentlyTrue[key], 'true-independence generator control ' + key, {});
  report.independenceSelfTest = { scope: 'Evaluator generator self-test, not an additional production forecast.',
    expected: compact(independentlyTrue), actual: compact(productAblation), outcomes: trueIndependent.length };

  // Poison unavailable future information: the pure preview must never read it.
  const noFuture = input([0, 1, 5], 0, 2, 4, 'none');
  const denied = new Set(['seed', 'day', 'history', 'ticket', 'future', 'season']);
  const forbidFuture = object => new Proxy(object, {
    get(target, key) {
      if (denied.has(key)) throw new Error('Preview read unavailable future field: ' + key);
      return Reflect.get(target, key);
    }
  });
  try {
    const actual = previewFor(forbidFuture(noFuture.state), forbidFuture(noFuture.forecast));
    const expected = reference(noFuture, jointTickets(noFuture));
    for (const key of ['shortfall', 'rawMean', 'payoutMean']) close(actual[key], expected[key], 'future information not read: ' + key, {});
    report.futureDataGuard = 'passed';
  } catch (error) {
    check(false, 'future information guard', {}, error.message, 'no future reads');
    report.futureDataGuard = 'failed';
  }

  function metrics(model) {
    const errors = report.primary.map(row => ({ id: row.id, input: row.input,
      error: row[model] && Number.isFinite(row[model].shortfall) ? row[model].shortfall - row.expected.shortfall : null }));
    const finite = errors.filter(item => item.error !== null);
    const maximum = finite.length ? Math.max(...finite.map(item => Math.abs(item.error))) : null;
    return {
      evaluatedCases: finite.length,
      missingCases: errors.length - finite.length,
      meanAbsoluteError: finite.length ? finite.reduce((sum, item) => sum + Math.abs(item.error), 0) / finite.length : null,
      maximumAbsoluteError: maximum,
      exactTies: finite.filter(item => Math.abs(item.error) <= EPSILON).length,
      overestimates: finite.filter(item => item.error > EPSILON).length,
      underestimates: finite.filter(item => item.error < -EPSILON).length,
      worstCases: maximum === null ? [] : finite.filter(item => Math.abs(Math.abs(item.error) - maximum) <= EPSILON)
    };
  }
  report.metrics = { exact: metrics('actual'), independence: metrics('independence'),
    units: 'Probabilities; multiply an error by 100 for percentage points. All tied worst cases are retained.' };
  report.correctnessPassed = report.failures.length === 0;
  report.improvementEstablished = report.correctnessPassed &&
    report.metrics.exact.meanAbsoluteError < report.metrics.independence.meanAbsoluteError;
  report.interpretation = report.improvementEstablished
    ? 'Exact joint-event preview has lower shortfall error than the specified own-model independence ablation on this frozen synthetic set. No player-outcome claim.'
    : 'Improvement not established. Retain all failures or null results; do not select a replacement case set.';
} catch (error) {
  report.failures.push({ label: 'evaluator interrupted', message: error.message, stack: error.stack });
  report.correctnessPassed = false;
  report.improvementEstablished = false;
}

process.stdout.write(JSON.stringify(report, null, 2) + '\n');
if (!report.correctnessPassed) process.exitCode = 1;
