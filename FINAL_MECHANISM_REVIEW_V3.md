# Independent mechanism review after v3

November 6, 2026. This review reads retained results and source; it does not rerun the game or diagnostic. No further parameter adjustment is proposed for the current prototype.

## Conclusion

A limited mechanics-prototype claim is justified: the implementation has an independently checked current-round risk calculation, causal spatial decisions with observable financial consequences, and an explicit six-day goal. The fresh automated cases include both successful and unsuccessful outcomes and cases where moving performs worse. Actual rendered desktop, narrow-layout, keyboard, recovery and complete-playthrough checks remain separate delivery requirements.

The evidence does not establish a compelling reserve-management game, balance, fun, financial learning or competitive quality. Reserve and Margin still produce exactly the same plans. The positive classification means only that the narrowly frozen recurrence of universal triviality was not observed; it is not a positive gameplay-quality verdict.

## Source, case and criterion audit

The current source hashes match evidence/v3-run.json: core 267ee92934874296713becfb19311699248ab0fc492baac9a86965a207da1071; diagnostic 0309f5642fd4afe995eaf37686a3e87adecb1333ddef840aa808e90c4c3fc15f; rules 13449b314ac399c95de1ecc78e694c98700a3c81de42656166237f3c355c4ade; criteria 7fcd65cc37901b382b91dde8ecd0ecb0bad7afdababf145caaf5633834ead09b. The receipt records successful core tests and both cohort runs with exit 0.

The development seal contains precisely DIAG-001..DIAG-040; the qualification seal contains precisely QUAL-V3-001..QUAL-V3-040. Each retained case file contains 120 unique seed/policy pairs. Qualification has 120 completed per-game JSONL records. Realized event sequences match across the three policies for each paired qualification seed. The chooser receives current observations and public forecast only, and its independently expressed income formula subtracts one supply coin from gross sales. The fixed-berth comparator still allows repairs, rescue and all affordable policies.

The frozen criterion requires universal goals, all stalls open every day, and identical Reserve/Margin plans together to mark PERSISTENT_TRIVIALITY. In qualification, the first two conditions are false and the third is true. Universal goal failure is also false. NONTRIVIALITY_NOT_RULED_OUT is therefore the correct predeclared classification. Do not relabel it as a balance or playability success.

The receipt binds the unchanged preview function to the earlier verified version. Its 6,360-case result is retained evidence, not a fresh v3 preview execution. The original exact-versus-independence comparison remains a technical own-model ablation, not player evidence.

## Fresh qualification results and remaining weakness

Reserve and Margin each reach the goal on 38/40 seeds; Fixed berths reaches it on 33/40. Reserve and Margin end with mean cash 30.55 versus 24 for Fixed berths. Their paired cash comparison is 35 wins, one tie and four losses; goal comparison is five wins, 35 ties and zero losses. These comparisons use the complete frozen qualification set, not just the examples below.

The caution is material: Reserve and Margin have identical planning sequences on all 40 seeds and all three stalls open after every day. Neither policy ever chooses a plan with nonzero immediate repair-funding risk. All three recorded nonzero-risk days and the sole day ending with only two open stalls belong to Fixed berths. The active policies do not exercise scheduled repair, rescue or fault coverage. They buy surge coverage only 14 times over 240 days each.

Consequently, these cases support a narrower game about reacting to public spatial hazards and net earning opportunities. They do not demonstrate distinct reserve-seeking versus margin-seeking strategies or sustained recovery pressure. Unused options should be presented as implemented rules and explicit recovery affordances, not as empirically demonstrated strategic depth.

## One understandable paired trace, including an adverse outcome

The main explanatory example is QUAL-V3-004. It is selected after the complete evaluation for explanation, not treated as an independent evaluation endpoint. Both policies start day one with six coins at positions [0,1,5]. The forecast threatens front row 0 and column 0, and the hotspot is position 1.

- Reserve moves Copper from position 0 to position 4 for one coin and chooses no insurance. Its chosen one-day expected cash-plus-stall-value is 21.
- Fixed berths stays in place and buys surge coverage. Its chosen expected value is 20.5.
- The realized ticket is a front-row surge. Reserve has only one front-row stall hit: five coins after moving, minus four in emergency repairs, plus five net income leaves six coins.
- Fixed berths has two stalls hit. Six coins minus the two-coin premium plus a six-coin claim leaves ten; eight in repairs and six net income leave eight coins.

The higher one-day expected-value move produces a worse result on this realized event. Both choices maintain all three stalls. Over the full same-event six-day replay, Reserve ends with 25 coins and Fixed berths with 27; both meet the goal. This is a useful consequence to show because the game should not imply that an apparently better expected choice always wins a particular realized sequence.

A complementary beneficial trace is QUAL-V3-035. On day two, Reserve moves the back-row stall from position 5 to front position 2. The one-coin move pays for itself in that day's extra net income, so both policies end day two with 11 coins. The moved stall then contributes two additional coins relative to Fixed berths on each of days three and four because of the hotspot. On day five the back-row surge misses the relocated stall, while Fixed berths must repair its stall at position 5. Reserve later makes one more move on day six. Final cash is 24 versus 17, with all stalls open: Reserve reaches the goal and Fixed berths misses the cash requirement.

| Seed and policy | Day 1 | Day 2 | Day 3 | Day 4 | Day 5 | Final cash | Goal |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| QUAL-V3-004 Reserve | 6 | 11 | 17 | 22 | 19 | 25 | Yes |
| QUAL-V3-004 Fixed berths | 8 | 14 | 20 | 25 | 22 | 27 | Yes |
| QUAL-V3-035 Reserve | 10 | 11 | 18 | 21 | 27 | 24 | Yes |
| QUAL-V3-035 Fixed berths | 10 | 11 | 16 | 17 | 19 | 17 | No |

These are paired policy traces, not a single-action causal isolation: subsequent policies can make different choices. The day-one adverse accounting is a direct, inspectable same-state comparison; the full six-day differences include the complete respective policy paths.

## What to claim and what to finish

A supportable description is: a small turn-based financial-risk prototype where a player moves stalls around shared hazards, compares explicit insurance terms, chooses repairs and sees net sales after supplies. The displayed immediate repair-funding probability has been independently verified under the fictional rules. Fixed-seed replay lets a player inspect different choices against the same events.

Do not claim that insurance, reserve timing and rescue are all equally important in ordinary play; the diagnostic does not show that. Do not turn 38/40 versus 33/40 into a claim about people making better decisions. Actual UI review must establish that the player can understand and complete the loop, including an adverse replay and deliberate all-closed recovery, without relying on an automated policy.

There is no further balance tuning in this approved iteration. If a later separately scoped design seeks stronger reserve tradeoffs, investigate structural commitments rather than another income or success-target adjustment. For example, a disclosed multi-day placement commitment could prevent costless daily reaction to each newly revealed forecast and make reserves matter across time. That is a future design hypothesis requiring its own rules, evaluation and playtesting, not an approved change or a claimed solution here.
