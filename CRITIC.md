# Independent gameplay and evidence critique

Reviewed November 6, 2026, before implementation. No code execution, browser action, registration or entry was performed for this review. This is design judgment, not a playtest or an educational-impact result.

## Chosen compact game

Use Breakwater Market, a six-day spatial placement and recovery game with three fixed stalls on a two-row, three-column board. Do not add building, upgrades, loans, inventory trading or a route puzzle to this prototype. Current jam metadata already includes delivery and cashflow games; metadata alone does not establish their quality or a novelty claim for ours.

The owner's accepted rules are:

- Start with 6 coins and active stalls at positions [0, 1, 5], with positions numbered row-major from 0 to 5.
- Each planning phase provides two actions. Move an active or closed stall to an empty berth for one coin and one action. Repair a closed stall for four coins and one action.
- If all stalls are closed, a rescue job grants four coins for one action. The second action can repair a stall. This is an explicit game recovery rule, not a claim about real-world assistance.
- Before committing, the player sees four equally likely event tickets: two calm, one surge affecting a named row, and one cable fault affecting a named column. The row, column and market hotspot may change each day. The actual ticket stays hidden until commit.
- Policy choices are none, surge or fault. A policy costs two coins for that day, charged once at commit. Unaffordable choices cannot commit. The aggregate deductible is two coins and the payout cap is six coins. The policy excludes the other peril.
- Resolve the event before income. Only previously active stalls newly struck by that event become damaged and generate a four-coin-per-stall repair bill. Existing damage generates neither another bill nor another payout.
- Deposit the matching-peril payout before repairs: min(6, max(0, newly covered repair bill - 2)). Premiums are paid even on calm days. The cap limits the payout, not the bill.
- Settlement lets the player choose immediate repairs for four coins per stall without a planning-action limit. They may leave stalls closed for later. No borrowing, hidden charge or automatic negative balance is allowed.
- Then active stalls earn income: three coins on the front row, two on the back row, plus one at that day's publicly highlighted market spot. Closed stalls earn nothing.
- After day six, show actual cash and open stalls. The lantern-night goal requires all three open and at least 18 coins. Do not award educational points or claim that reaching the goal demonstrates financial competence.

The action budget applies to preparation; settlement is a separate emergency repair phase. Explain this distinction directly because the same repair has a different action cost in the two phases.

## Why this can be a game

The board must carry the decision. Selecting a stall and a destination changes its exposure and possible income. Show the threatened row and column, then reveal the ticket and visibly close struck stalls. The player chooses what to reopen, sees income arrive, and faces a changed board the next day. A seed replay preserves forecasts and realized events so another plan has an inspectable consequence.

Use one short first-turn instruction with a visible commit button. Explain premium, deductible and exclusions beside the policy selector; show the exact claim calculation after an insured hit. Do not require a long tutorial or modal quiz before moving a stall. A small cash ledger should explain the turn, not replace the board.

The concept is still unproven as entertainment. A functioning board and animations are not evidence of fun. The prototype needs an actual uninterrupted six-day playthrough, a different replay choice with a visible consequence, keyboard play, and a deliberate zero-cash/all-closed recovery check before it can be described as playable.

## Financial and mechanical red flags

1. Correlation changes the distribution of total loss, not the mean of a linear sum with matched marginal risks. The independence ablation must preserve mean raw damage. Aggregate deductible/cap rules are nonlinear, so expected payout and mean net uncovered loss may differ. Do not promise equal net-loss means.
2. Insurance does not prevent physical damage. The event still closes affected stalls; the payout changes available repair funds. Only chosen repairs reopen them.
3. A repair funding shortfall is not bankruptcy. Closed stalls may recover and there is no debt model. Use the narrower label throughout.
4. Three stalls at six coins initial cash create a possible shortfall; twelve starting coins would already cover the maximum twelve-coin repair bill before premium. Keep the accepted six-coin start unless a separately recorded design revision changes it.
5. A rescue job available every turn could become a dominant income action and erase the reserve decision. Restricting it to all-closed states preserves recovery without silently handicapping comparison policies.
6. Front-row earnings, movement costs, the hotspot and the final cash target may still produce a simple dominant strategy. This has not been tested. Never make policy comparators skip legal profitable actions merely to manufacture a gain.
7. A deterministic replay must not consume weather randomness based on player actions. Otherwise a different move changes the realized storm and the comparison is misleading. Generate the complete event/forecast sequence independently of choices.
8. The current forecast may be public; future realized tickets must not enter either the preview or a comparison policy. An exact current-round risk calculation is not a clairvoyant policy optimizer.
9. Confirm that every affordable action stays affordable until commit, policy premiums are deducted once, and a changed policy selection does not repeatedly charge or refund cash.
10. A normal loss remains a valid outcome. Do not guarantee the lantern-night target, label all unsuccessful play irrational, or tune the evaluation cases until the preferred mechanic wins.

## Honest comparison

The frozen preview evaluation is specified in EVALUATION_DRAFT.md. It compares our exact joint-event preview with our own independence ablation on the same states. It is not a competitor benchmark. Correct displayed shortfall probabilities are a technical benefit under the stated game rules. They do not establish better player decisions, financial literacy, retention, wellbeing or judge placement.

A separate gameplay diagnostic should compare causal fixed policies across a predeclared seed set, retaining all outcomes. Record goal completion, final cash, open stalls, relocations, coverage spend and rescue use. If one trivial policy achieves every goal and makes the spatial or insurance choices irrelevant, revise the game before presenting those choices as meaningful. Keep any revised design and subsequent diagnostic results distinct from the original. Human fun and learning claims still require separate human evidence.

## Delivery boundary

A local-file build must run without module-fetch CORS errors, network calls, packages or credentials. Use real buttons, text labels for both perils and states, visible focus, keyboard actions, and a layout that preserves all choices at narrow width. Keep reset confirmation, invalid-action feedback and the rescue instruction visible where needed. Do not describe a narrow layout as tested until it is actually rendered.

This review does not resolve the separate registration, policy-access, final-form or award-contract dependencies in the Zoud qualification record. No future development commitment is proposed here.
