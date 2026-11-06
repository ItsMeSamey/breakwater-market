"""Exact independent v3 relocation/coverage check; no production imports."""
from pathlib import Path
from itertools import combinations, product
import hashlib
import json
import sys
import time
import traceback

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'evidence' / 'v3-structural-check'
LAYOUTS = list(combinations(range(6), 3))
FORECASTS = list(product(range(2), range(3)))
CASH = [0, 1, 2, 3, 4, 5, 6, 12, 18, 20]
POLICIES = ['none', 'surge', 'fault']
sha = lambda data: hashlib.sha256(data).hexdigest()
canonical = lambda obj: json.dumps(obj, sort_keys=True, separators=(',', ':')).encode()
structural_inputs = [dict(positions=p, row=r, col=c, cash=cash, actions=a)
                     for p in LAYOUTS for r, c in FORECASTS
                     for a in range(3) for cash in CASH]
economic_inputs = [dict(positions=p, row=r, col=c, bonus=b, cash=cash, actions=a)
                   for p in LAYOUTS for r, c in FORECASTS for b in range(6)
                   for cash in [6, 12, 20] for a in range(3)]
seal = {
    'scope': 'Exact all-open relocation and one-day coverage tradeoff; no gameplay change.',
    'structuralCases': len(structural_inputs), 'economicCases': len(economic_inputs),
    'structuralInputsSha256': sha(canonical(structural_inputs)),
    'economicInputsSha256': sha(canonical(economic_inputs)),
    'sourcePins': {str(p.relative_to(ROOT)): sha(p.read_bytes()) for p in [
        Path(__file__), ROOT / 'STRUCTURAL_CHECK_V3_CONTRACT.md',
        ROOT / 'core.js', ROOT / 'RULES_V3.md']}
}
OUT.mkdir(exist_ok=False)
with (OUT / 'input-seal.json').open('x') as handle:
    json.dump(seal, handle, indent=2)
print(json.dumps({'stage': 'sealed-before-computation', **seal}), flush=True)


def distance(source, target):
    return len(set(source) - set(target))


def safe(positions, row, col):
    return sum(p // 3 == row for p in positions) <= 1 and sum(p % 3 == col for p in positions) <= 1


def strong_safe(positions, row):
    return len({p % 3 for p in positions}) == 3 and sum(p // 3 == row for p in positions) <= 1


def income(pos, bonus):
    return (3 if pos < 3 else 2) + (pos == bonus) - 1


def plan(case, target, policy):
    moved = distance(case['positions'], target)
    premium = 0 if policy == 'none' else 2
    funds = case['cash'] - moved - premium
    assert moved <= case['actions'] and funds >= 0
    events = []
    for kind, probability in [('calm', 0.5), ('surge', 0.25), ('fault', 0.25)]:
        damaged = [p for p in target if (kind == 'surge' and p // 3 == case['row']) or
                   (kind == 'fault' and p % 3 == case['col'])]
        bill = 4 * len(damaged)
        payout = min(6, max(0, bill - 2)) if policy == kind and kind != 'calm' else 0
        cash = funds + payout
        funding_gap = max(0, bill - cash)
        opened = set(target) - set(damaged)
        for pos in sorted(damaged, key=lambda p: (-income(p, case['bonus']), p)):
            if cash >= 4:
                cash -= 4
                opened.add(pos)
        cash += sum(income(p, case['bonus']) for p in opened)
        events.append(dict(kind=kind, probability=probability, bill=bill, payout=payout,
                           fundsBeforeRepair=funds + payout, gap=funding_gap,
                           cash=cash, open=len(opened), goal=len(opened) == 3 and cash >= 18))
    result = dict(target=target, moves=moved, policy=policy,
                  expectedCash=sum(e['cash'] * e['probability'] for e in events),
                  expectedOpen=sum(e['open'] * e['probability'] for e in events),
                  shortfall=sum(e['probability'] for e in events if e['gap'] > 0),
                  finalDayGoalProbability=sum(e['probability'] for e in events if e['goal']))
    result['expectedWealth'] = result['expectedCash'] + 4 * result['expectedOpen']
    result['events'] = events
    return result


def brief(result):
    return {k: v for k, v in result.items() if k != 'events'} if result else None


def choose(plans):
    if not plans:
        return None, 0
    maximum = max(p['expectedWealth'] for p in plans)
    tied = [p for p in plans if p['expectedWealth'] == maximum]
    # Disclosed tie break for illustrative selection only; tied count is retained.
    tied.sort(key=lambda p: (-p['expectedOpen'], p['moves'], p['policy'], p['target']))
    return tied[0], len(tied)


structural = []
economic = []
summary = {'status': 'running', 'seal': seal}
started = time.monotonic()
try:
    assert len(structural_inputs) == 3600 and len(economic_inputs) == 6480
    geometry = []
    for source in LAYOUTS:
        for row, col in FORECASTS:
            minimum = min(distance(source, target) for target in LAYOUTS if safe(target, row, col))
            strong_minimum = min(distance(source, target) for target in LAYOUTS if strong_safe(target, row))
            assert strong_minimum <= 2
            geometry.append(dict(positions=source, row=row, col=col,
                                 minimumSafeMoves=minimum, minimumStrongSafeMoves=strong_minimum))
    for case in structural_inputs:
        source, row, col = case['positions'], case['row'], case['col']
        candidates = [(target, distance(source, target)) for target in LAYOUTS
                      if distance(source, target) <= case['actions'] and distance(source, target) <= case['cash']]
        possible = [(target, cost) for target, cost in candidates if safe(target, row, col)]
        strong = [(target, cost) for target, cost in candidates if strong_safe(target, row)]
        funded = [(target, cost) for target, cost in possible if case['cash'] - cost >= 4]
        structural.append(dict(input=case, safeReachable=bool(possible), strongSafeReachable=bool(strong),
                               safeAndFourCoinsReachable=bool(funded),
                               minimumAffordableSafeMoves=min((cost for _, cost in possible), default=None)))
        if case['actions'] == 2 and case['cash'] >= 6:
            assert strong and funded
    safe_dominance_checks = 0
    late_stay_funding_checks = 0
    for case in economic_inputs:
        legal = []
        safe_none = []
        stay_cover = []
        stay_none = None
        for target in LAYOUTS:
            moved = distance(case['positions'], target)
            if moved > case['actions'] or moved > case['cash']:
                continue
            variants = {}
            for policy in POLICIES:
                if case['cash'] - moved < (0 if policy == 'none' else 2):
                    continue
                result = plan(case, target, policy)
                variants[policy] = result
                legal.append(result)
                if target == case['positions']:
                    if policy == 'none':
                        stay_none = result
                    else:
                        stay_cover.append(result)
                if policy == 'none' and safe(target, case['row'], case['col']):
                    safe_none.append(result)
            if safe(target, case['row'], case['col']):
                for policy in ['surge', 'fault']:
                    if policy not in variants:
                        continue
                    for uncovered, covered in zip(variants['none']['events'], variants[policy]['events']):
                        assert covered['fundsBeforeRepair'] <= uncovered['fundsBeforeRepair']
                        assert covered['open'] <= uncovered['open']
                        assert covered['cash'] + 4 * covered['open'] <= uncovered['cash'] + 4 * uncovered['open']
                        safe_dominance_checks += 1
        if case['cash'] >= 12:
            assert stay_none['shortfall'] == 0
            late_stay_funding_checks += 1
        best_safe, safe_ties = choose(safe_none)
        best_cover, cover_ties = choose(stay_cover)
        best_any, any_ties = choose(legal)
        economic.append(dict(input=case, bestSafeNoCover=brief(best_safe), safeMaximumTies=safe_ties,
                             bestStayCover=brief(best_cover), coverMaximumTies=cover_ties,
                             stayNoCover=brief(stay_none), bestOverall=brief(best_any), overallMaximumTies=any_ties,
                             stayCoverMinusSafeWealth=(best_cover['expectedWealth'] - best_safe['expectedWealth'])
                             if best_cover and best_safe else None))
    first = dict(positions=(0, 1, 5), row=0, col=1, bonus=1, cash=6, actions=2)
    initial_row = next(row for row in economic if row['input'] == first)
    assert initial_row['bestSafeNoCover']['expectedWealth'] == 20
    assert plan(first, first['positions'], 'surge')['expectedWealth'] == 20.5
    last = dict(positions=(0, 1, 2), row=0, col=0, bonus=3, cash=20, actions=2)
    no_cover = plan(last, last['positions'], 'none')
    surge_cover = plan(last, last['positions'], 'surge')
    assert [e['cash'] for e in no_cover['events']] == [26, 14, 22]
    assert [e['cash'] for e in surge_cover['events']] == [24, 18, 20]
    assert no_cover['finalDayGoalProbability'] == 0.75
    assert surge_cover['finalDayGoalProbability'] == 1
    compared = [row for row in economic if row['stayCoverMinusSafeWealth'] is not None]
    summary.update(status='complete', structuralCases=len(structural), economicCases=len(economic),
                   maximumMinimumSafeMoves=max(row['minimumSafeMoves'] for row in geometry),
                   maximumMinimumStrongSafeMoves=max(row['minimumStrongSafeMoves'] for row in geometry),
                   geometryDistanceCounts={str(n): sum(row['minimumStrongSafeMoves'] == n for row in geometry) for n in range(3)},
                   initialCashSixFullActionsAlwaysFunded=all(row['safeAndFourCoinsReachable'] for row in structural
                       if row['input']['cash'] == 6 and row['input']['actions'] == 2),
                   safeCoveragePathwiseChecks=safe_dominance_checks, lateStayFundingChecks=late_stay_funding_checks,
                   economicComparisonCases=len(compared),
                   stayCoverBetterThanBestSafe=sum(row['stayCoverMinusSafeWealth'] > 0 for row in compared),
                   stayCoverEqualToBestSafe=sum(row['stayCoverMinusSafeWealth'] == 0 for row in compared),
                   stayCoverWorseThanBestSafe=sum(row['stayCoverMinusSafeWealth'] < 0 for row in compared),
                   initialExample=dict(case=first, comparison=initial_row,
                       staySurge=plan(first, first['positions'], 'surge')),
                   finalDayExample=dict(case=last, none=no_cover, surge=surge_cover),
                   limits='All currently open stalls; finite structural and one-day objective analysis. Not a six-day dominance, player-benefit or fun result.')
    (OUT / 'geometry.json').write_text(json.dumps(geometry, indent=2) + '\n')
except Exception as error:
    summary.update(status='failed', error=str(error), traceback=traceback.format_exc())
finally:
    summary['seconds'] = time.monotonic() - started
    (OUT / 'structural-cases.json').write_text(json.dumps(structural, separators=(',', ':')) + '\n')
    (OUT / 'economic-cases.json').write_text(json.dumps(economic, separators=(',', ':')) + '\n')
    (OUT / 'summary.json').write_text(json.dumps(summary, indent=2) + '\n')
    print(json.dumps(summary, indent=2))
if summary['status'] != 'complete':
    raise SystemExit(1)
