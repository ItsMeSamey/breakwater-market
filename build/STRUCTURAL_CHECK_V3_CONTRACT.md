# V3 relocation and coverage structural check: pre-run contract

November 6, 2026. Root requested this bounded structural check after the v3 diagnostic. This is not a parameter search, gameplay revision or a new held-out outcome study. Preserve v3 source and all prior results. No runtime changes or browser actions are included.

## Questions and mathematical scope

For three currently open stalls on a two-row/three-column board, can a player always reach a layout with at most one stall exposed to either currently forecast event within two one-coin moves? Does the answer depend on remaining actions/cash? Does such a layout dominate staying with insurance after net income and movement cost are counted? What remains relevant at high cash and on the final day?

All stalls are currently open. Existing closures, planned repair and rescue are outside this relocation invariant and must not be silently covered by its conclusion. Stalls have identical financial rules apart from their berth. Enumerate occupied position sets rather than stall identities. Any target set is reachable in exactly the number of positions removed from the source set: move each removed stall directly into a newly occupied empty position. This gives both a lower bound and a legal construction without assuming swaps or free moves.

A forecast-safe set has at most one stall in the threatened row and at most one in the threatened column. A stronger set also has exactly one stall in each column and at most one in the threatened row; this limits damage to one stall even for a different fault column. Distinguish these definitions.

## Fixed enumerations

Use all 20 three-position combinations from 0..5 and all six row/column forecasts.

Structural affordability cases: remaining actions 0,1,2 and cash 0,1,2,3,4,5,6,12,18,20. This gives 3,600 cases. Record minimum distances to both safe-set definitions, affordability, and whether safe relocation leaves at least four coins for the maximum one-stall emergency bill.

Economic cases: the same layouts/forecasts, all six hotspots, cash 6,12,20, and actions 0,1,2. This gives 6,480 cases. Enumerate all reachable target sets within actions and cash, and all affordable none/surge/fault policies. Use the current v3 net berth income, one-coin move cost, two-coin premium, four-coin emergency repair cost, aggregate deductible two and payout cap six. Event probabilities are calm1/2, named-row surge1/4 and named-column fault1/4. There is no future-weather information.

For each outcome reopen damaged stalls greedily by highest current net income while funds permit, as in the existing diagnostic. With homogeneous repair cost and immediate one-day cash-plus-four-per-open-stall value, reopening the highest earners maximizes that one-day objective; it is not an optimal six-day strategy claim. Record expected cash, open stalls, cash plus four per open stall, immediate shortfall probability, and probability of meeting the existing all-open/cash18 goal if this were the last day. Keep the best safe relocation without coverage and the best staying-with-coverage option, retaining equal-value ties explicitly where relevant.

Do not infer pathwise dominance merely from higher expected value. Check the three named event outcomes as well. Insurance can be a mean-cost tradeoff while changing a final cash-threshold probability.

## Predeclared illustrative checks

1. Initial positions [0,1,5], cash6, two actions, surge row0, fault column1, hotspot1. Check whether staying with surge cover beats the best safe relocation in one-day expected cash-plus-stall value. The analytic candidate values are 20.5 versus20; these are hypotheses to verify, not retained execution results.
2. Final-day positions [0,1,2], cash20, surge row0, fault column0, hotspot3. Compare no relocation with none versus surge coverage. Predicted cash after calm/surge/fault is26/14/22 without cover and24/18/20 with surge cover. Predicted goal probabilities are3/4 and1, despite lower mean cash with cover. Verify exact arithmetic.
3. Any forecast-safe layout: when a selected covered event can hit at most one stall, payout is at most2, no greater than the premium. On that fixed layout coverage cannot increase settlement funds in any outcome, and costs money in calm/excluded outcomes. Verify this property over the enumerated cases.
4. Current cash at least12 and no move: no policy is needed to pay even the maximum12 immediate repair bill. This is a funding statement, not a statement that insurance cannot affect final-goal probability or cash variability.

## Execution and reporting

Use a standalone independent local Python script with no dependencies or production imports. Save its source and contract hash before computation; create a new evidence directory with an exclusive input-seal write and refuse an existing run path. Save full structural and economic case results plus a compact summary. Do not overwrite old evidence or retry silently after failure. These are finite combinatorial checks, not sampled player results.

Acceptance is truthful accounting and complete enumeration. Disproving blanket insurance irrelevance is a valid result. If a cheap reachable safety option exists but sacrifices earnings, report both facts. A future structural change requires a separate rationale and rules; this check itself authorizes none.
