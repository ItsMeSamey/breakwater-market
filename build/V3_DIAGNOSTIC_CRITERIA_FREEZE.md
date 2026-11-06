# V3 diagnostic criteria, frozen before execution

November 6, 2026. The owner accepted this single bounded revision before any v3 execution. This freezes the rule delta, cases, comparison and interpretation. It does not claim that the revision improves the game.

## Exact rule delta

For each open stall after settlement, gross sales remain three coins on the front row or two on the back row, plus one for the public hotspot. Subtract one coin of operating supplies from that same stall's sales. Net income is therefore two/front or one/back, plus the hotspot bonus. Closed stalls receive no sales and pay no supply cost. Sales always cover this cost, so it introduces no debt or upfront payment requirement. Display gross sales, supply cost and net receipt explicitly.

No other rule changes: preserve all accepted v2 starting resources, six-day horizon, board/stall counts, actions, movement cost, scheduled/emergency repair prices, rescue rule, policy premium/deductible/cap, event tickets and lantern goal. Preserve v2 source and results before editing. Record new source hashes before execution.

The current-round preview's inputs, joint event model, claims and immediate emergency repair requirement do not change. Bind its function source to the prior verified function. Reuse the original frozen preview result only with an explicit unchanged-function statement; do not invent a rerun.

## Fixed cases and policies

Run exactly two separately reported sets, in this order:

1. Development/regression: DIAG-001 through DIAG-040. These cases were already observed in v2 and are not held out.
2. Fresh qualification: QUAL-V3-001 through QUAL-V3-040. No outcomes from this set have informed the rule change.

Use Reserve, Margin and Fixed berths as previously frozen, with all legal actions and affordable coverage options available. Their independent expected-income formula must explicitly compute gross sales minus one-coin supplies; do not call the production income helper. Keep the one-day objectives, tie breaks, common greedy emergency settlement and available observations unchanged. The fixed-berth policy may omit movement only. Preserve the limitations of myopic policies and shared greedy settlement in every interpretation.

There is no seed search, alternative parameter sweep, target adjustment or automatic retry included in this freeze. Preserve partial case records on failure. Save source, seed-list and policy pins before calling the game.

## Required outputs

For each set independently retain every seed/policy trace and report:

- final cash, open stalls and actual lantern-goal completion;
- per-day cash minimum/mean and counts ending with zero, one, two or three open stalls;
- chosen-plan days with nonzero immediate full-repair shortfall probability;
- movement, scheduled repair, emergency repair, rescue and each policy count;
- Reserve/Margin identical versus different action-sequence counts;
- paired goal/cash wins, ties and losses against Fixed berths;
- claims and cash-trail invariant failures, source pins and completion/exit status.

Do not pool seen development cases with fresh qualification to strengthen a claim. Any v2/v3 paired comparison uses only the original development seeds and must be labeled as development evidence.

## Interpretation gates

Correctness is required first: no illegal state, negative cash, duplicate location, excluded claim, accounting discrepancy, future-information access or failure to terminate. Zero-cash/all-closed recovery must remain mechanically playable in the separate integration check. A gameplay economy result cannot excuse a correctness failure.

Mark PERSISTENT_TRIVIALITY if, on the fresh qualification set, all three policies win every lantern goal, every game ends every day with all three stalls open, and Reserve/Margin use identical complete planning sequences on all 40 seeds. This is the predeclared recurrence of the v2 failure. If present, stop competitiveness claims and this balance-tuning line; do not try another income, weather or goal parameter merely to escape the gate.

Also retain weaker warning signs separately: universal goal completion even when policies differ; no liquidity exposure under any chosen plan; unchanged decisions for Reserve/Margin; all insurance or all movement unused. None alone establishes that the game is universally trivial, but none may be hidden by a favorable mean-cash comparison.

Mark UNIVERSAL_GOAL_FAILURE if every policy fails every goal in the qualification set. That is an adverse feasibility result requiring reconsideration, not success at making the game harder. Any actual state with no legal path to finish the six-day game is a correctness/playability failure, regardless of its final goal result.

If neither extreme occurs, classify the result as NONTRIVIALITY_NOT_RULED_OUT, not 'balanced', 'fun', 'educational' or 'competitive'. Review concrete paired traces to identify an understandable decision and consequence before proceeding to actual rendered play and replay inspection. A lower success percentage alone is not evidence of an improvement.

No educational, player-benefit, novelty, competitor-superiority, retention or prize-placement conclusion follows from this diagnostic. The version-2 adverse result remains part of the project history even if version 3 behaves differently.
