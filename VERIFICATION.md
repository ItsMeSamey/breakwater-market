# Verification and limits

November 6, 2026. This record separates arithmetic correctness, automated game diagnostics and actual interface observations. It does not measure human learning, fun, accessibility conformance, competitor superiority or likely prize placement.

## Exact public risk preview

The independent evaluator defines its own event enumeration, claim arithmetic and repair requirement. It imports only the production preview entry point. Its frozen primary set contains 6,360 cases across layouts, public forecasts, cash balances and affordable policies. Further controls cover 720 existing-closure cases, 48 symmetry cases, affordability, probability mass and exclusion of future information.

The first run completed 222,671 checks with no failure. The exact preview's primary mean and maximum absolute probability errors were zero. Its source remained byte-identical through the later economy revisions; evidence/v3-run.json records that binding.

Our independence ablation preserves each stall's marginal chance of damage but removes the shared event relationship. On the same primary inputs its mean absolute repair-shortfall probability error was 4.065448 percentage points, with a maximum of 32.8125 points. It tied on 4,356 cases, overestimated on 1,152 and underestimated on 852. Mean raw damage matches; mean payout or net repair need need not match because the deductible and cap apply to aggregate covered loss.

This addresses a player-facing defect: misleading repair-funding odds when several stalls share a shock. It is an ablation of this game's model, not a claim about a competitor or educational efficacy. The complete input/output report and frozen evaluator are included.

## Game diagnostics, including adverse findings

All policies see only public current state and today's forecast. They share legal-action enumeration, settlement and action-independent incident sequences. Reserve prioritizes expected open stalls then one-day wealth; Margin reverses those priorities. Fixed berths uses Margin's objective with movement removed. None is a full-week goal optimizer.

Version 1 source review found two defects before strategy execution: scheduled repairs cost the same as emergency repairs while also using an action and exposing the stall; rescue could repeat twice in one day. Version 2 made scheduled repair cost three instead of four and limited rescue to once daily.

The first 40-seed, three-policy diagnostic then found an overly forgiving economy. All 120 games won, all stalls reopened every day, and Reserve and Margin made identical plans. These adverse results and traces are preserved. Version 3 adds one coin of operating supplies per open stall, paid from sales, while keeping the goal, risks, premiums, repairs and movement rules fixed.

The original 40 seeds remain development evidence. On 40 separate predeclared qualification seeds, Reserve and Margin each met the goal in 38 games and Fixed berths in 33. Each moving policy averaged 30.55 ending coins versus 24 for Fixed berths. Moving had higher cash on 35 paired weeks, tied on one and had lower cash on four. It added five goal successes and lost none in this set.

The two moving policies still chose identical plans on all 40 weeks. They kept all three stalls open every day and had zero predicted repair-funding-risk days. They did not use fault cover, scheduled repair or rescue. The few liquidity-pressure observations belonged to Fixed berths. Avoiding universal success is not evidence of balanced or entertaining play. All 120 qualification traces are retained, including adverse and tied cases.

A separate exact structural check examined 3,600 geometry/affordability cases and 6,480 economic cases. Every layout and forecast can reach one stall per lane and at most one on the threatened quay in two moves. However, staying with cover beat the best safe move's one-day wealth in 387 of 5,076 comparable cases because relocation can sacrifice sales. Coverage is not structurally irrelevant. A cash-20 final-day example illustrates a goal-probability versus expected-cash tradeoff, but no actual reachable play history for that state has been established.

## Actual browser play

The self-contained build ran in the connected original browser over a localhost HTTP preview. Only synthetic game data and ordinary controls were used.

- One six-day HARBOR1 playthrough finished with 26 coins, all three stalls open and the lantern goal reached. Replaying HARBOR1 repeated its first incident. This is an observed example, separate from the frozen diagnostics.
- The restart dialog rejected an invalid seed, accepted a fresh seed, and closed on Escape while restoring focus to New voyage and preserving the current game.
- Normal play reached zero coins and three closed stalls. Unaffordable cover blocked commitment. One rescue granted four coins; a scheduled repair spent three; a second rescue was unavailable. An attempted move after both actions were used produced the explanatory error. Collection restored two net coins, beginning day four with three coins and one open stall.
- Tab, Space and Enter selected and reopened a stall in the narrow event flow. Phase changes focused the event, next day and ending. Empty berths remained understandable move targets.
- The initial desktop layout pushed important controls below the first view. The revised layout brings the whole board, resources, cover, preview and primary turn action together.
- A 390-by-1600 CSS-pixel iframe verified width reflow. A separate 390-by-780 iframe exposed a narrow-flow defect: the sticky action left the viewport at the board boundary while policy choices remained below it. The failed capture is preserved. Targeted correction and verification are recorded in the final addendum below.

Screenshots are genuine browser captures, with no composited or injected game state. Their descriptions identify versions and viewport scope. They do not establish physical-phone or touchscreen behavior.

## Reproduction and unverified scope

The package uses no external dependencies. `python3 tools/reproduce.py` runs the core tests, exact preview evaluator, qualification policies and structural check in a fresh temporary directory. It reports the directory and keeps every output. It never runs inside the bundled evidence directories, so historical results stay intact. Rerunning the qualification seeds is reproduction, not another untouched qualification set.

Twelve core integration tests cover claims, accounting, action budgets, replay, closed-stall recovery, scheduled versus emergency repair, daily rescue reset and supplies. The preview evaluator is independent of the production event/claim helpers; the gameplay diagnostic intentionally uses the shared engine for legal transitions.

The build contains embedded CSS and classic scripts, no fetch or module import, and no remote assets. Actual direct file:// execution remains unverified; the supported browser route was HTTP. The no-script/loading fallback and initial disabled controls were source-reviewed, not tested by forcibly disabling scripts. Screen-reader announcements, touch input, physical phones, additional browsers and human playtesting remain unverified.

Historical source revisions, failed development gates and evaluation contracts remain in the evidence package. Account access, organizer acceptance and actual entry submission are outside this local verification.

## Final narrow action correction

The corrected UI keeps the same single primary action in a bottom dock at widths up to 850 CSS pixels. Its measured height reserves page space. In the actual 390-by-780 iframe, keyboard focus reached the lower Coral stall, selected Fault cover, expanded the possible bills, opened the cash trail and reached the final source link. The focused controls stayed clear of the dock; the full Open market button remained available throughout. A normal dock click opened the incident. The longer collection message wrapped without clipping, and the emergency-repair button remained visible and reachable by keyboard above it. A fresh desktop capture retained the compact board and original desktop action placement.

This targeted UI correction did not change the numerical rules. The earlier full-week and zero-cash playthroughs remain historical evidence of those unchanged rules. No new whole-week or untouched-seed claim is inferred from the layout check. Final standalone HTML SHA-256: 914c7bb0bcd7cc99a5d6685c7d3f1967c465e99e945a2e9ecf135f24a63c690c. Browser preview services were stopped after verification.
