# Independent v2 result review and bounded v3 proposal

November 6, 2026. Read-only inspection of retained evaluation output, gameplay traces and rule documents. No game, diagnostic or browser action was rerun for this review. Only this review document was written.

## Conclusion

The probability preview passed its technical correctness comparison. The game did not pass the intended test of meaningful liquidity tension. These are separate conclusions. The current prototype is not supported as a competitive or enjoyable entry by the available evidence. One coherent economy revision is justified; repeated tuning until a preferred success percentage appears is not.

## Observed evidence

The independent preview output contains all 6,360 primary cases, 222,671 checks and zero failures. Its source pin matches the sealed evaluator. Exact-preview shortfall error is zero. The independence ablation has mean absolute error 0.040654481132075475, or 4.065448 percentage points, and maximum error 32.8125 percentage points. It agrees exactly on 4,356 cases, overestimates on 1,152 and underestimates on 852. This is a result on the frozen synthetic case set, not empirical calibration on player behavior, a competitor benchmark or a learning outcome.

The v2 run receipt records exit 0 for core tests and gameplay. The gameplay file contains 120 completed games: 40 seeds for each of Reserve, Margin and Fixed berths. All 120 reached the lantern-night goal. Reserve and Margin used identical planning sequences on all 40 paired seeds. Their mean final cash was 45.9 versus 40.475 for Fixed berths. Movement improved terminal cash on 36 seeds, tied on one and worsened it on three; it never changed observed goal completion.

The per-day traces reveal the more material issue: every policy reopened all three stalls by the end of every day in every tested game. Reserve/Margin mean cash reached 18.625 by day two. By day four their minimum cash across seeds was 20, already above the final target of 18. Fixed berths also kept all three open every day and ended with at least 30 coins. No policy used rescue or fault coverage. These observations do not prove universal dominance outside the tested scenarios, but they give little reason to expect reserve management to remain consequential over this six-day game.

No human playtest, fun, learning, retention or prize-quality result exists. The all-closed recovery integration check establishes that recovery is mechanically possible, not that ordinary play presents an interesting recovery decision.

## Why the failure is structural

Cash generation outpaces the losses that the accepted policies experience. Three open stalls produce substantial recurring income after repairs, while repair reserves are not committed elsewhere. Cash accumulates and soon exceeds the maximum emergency repair bill. Once that happens, the exact shortfall preview usually loses its practical role. Raising the final goal alone would make a numeric win rarer without restoring the reserve-versus-risk decision during play.

The fact that Margin and Reserve coincide is not by itself proof that either policy is broken: their one-day objectives can align when reopening is affordable. However, the coincidence combined with full recovery every day and rapid cash growth identifies the absence of a binding liquidity tradeoff in this tested economy.

## Proposed v3: show the difference between sales and available margin

Make one rule change only: each open stall uses one coin of operating supplies, paid from that same day's sales. Preserve the stated gross sales of three on the waterfront and two on the garden quay, plus the public hotspot bonus. Net income becomes two on the waterfront and one on the garden quay, plus the hotspot bonus.

Show gross sales, supplies and net cash received in the settlement ledger. The cost applies only to operating stalls; a closed stall makes no sales and pays no supply cost. Because gross sales always cover this one-coin cost, this introduces neither debt nor an upfront funding requirement. It is an explicit fictional game cost, not a hidden fee or a claim about real businesses.

Keep everything else unchanged: six days, three stalls, six starting coins, two actions, existing v2 repair prices, once-per-day all-closed rescue, two-coin policy premium, deductible two, cap six, two calm/one surge/one fault tickets, and the all-three-open plus 18-coin goal. Do not add harsher weather, a moving target, random upkeep or new products in the same revision. A single change makes its effect interpretable and keeps the prototype compact.

The original preview evaluates available cash before event settlement and before sales. Its four-coin emergency repair requirement and event probabilities are unchanged. Preserve its frozen result and verify the preview function binding remains identical. Do not describe the original 6,360-case result as a new v3 run if it was not rerun.

## Predeclared follow-up, only if v3 is adopted

Before running, preserve v2 source, seals and results, and create RULES_V3.md plus a new diagnostic record. Use the same three causal policies, legal actions, objectives and shared settlement rule; update their independently expressed income arithmetic to the disclosed net amount. Do not weaken any baseline.

Use the original DIAG-001 through DIAG-040 solely as seen development/regression cases for paired before/after interpretation. Separately freeze exactly QUAL-V3-001 through QUAL-V3-040 as the fresh qualification set before viewing results. This prefix follows the owner's accepted pre-run naming; no v3 run informed the choice. Report both sets separately; do not pool them or call the original set unseen. This is one bounded diagnostic, not a seed search or parameter sweep.

Retain per-seed outcomes and partial failures. In addition to existing final cash, open stalls, goals and action counts, report:

- each day's minimum and mean cash and the distribution of open stalls after settlement;
- days where the chosen plan has nonzero immediate shortfall probability;
- the number of paired seeds on which Reserve and Margin choose different actions, and which choices differ;
- coverage counts, rescue counts and movement/repair timing counts;
- paired goal and cash differences with Fixed berths.

An adverse result remains adverse. If all three policies again reach every goal while every stall reopens every day and Reserve/Margin still coincide, do not keep adjusting the target or event probabilities. The design has not demonstrated its intended tension; pause competitiveness claims and reconsider the game loop. Conversely, some failures or differing policies do not prove balance or fun. They only justify an actual six-day player-facing walkthrough and replay review.

If the fresh scenarios are broadly unrecoverable even with legal rescue, treat that as a failure too. Do not celebrate a lower completion rate by itself. Inspect how decisions change outcomes, whether the board explains those consequences, whether an unsuccessful player can still finish the game, and whether the same-seed replay offers an understandable alternative.

## Competitive scope

A visible spatial consequence loop, truthful insurance arithmetic, exact risk display and accessible local-file delivery could support a small technical prototype. The current data do not support educational efficacy or broad originality. Do not spend further effort on entry polish or funding ambitions until the revised game has actual rendered play, meaningful decisions and a clear end-to-end recovery path. Separate delivery qualification and discretionary award conditions remain unchanged.
