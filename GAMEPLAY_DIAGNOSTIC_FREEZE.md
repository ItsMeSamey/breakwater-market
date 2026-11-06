# Gameplay diagnostic v1, frozen before execution

November 6, 2026. This diagnostic describes automated play, not players, fun, educational efficacy or superiority over another game. No game has been executed before this file.

Use exactly 40 seeds: DIAG-001 through DIAG-040, in increasing order. Each lasts the fixed six days. Three causal policies share identical event sequences and the same settlement rule. They receive only current cash, current stall states, action budget and today's public forecast. Never pass the seed, future forecasts, realized ticket or history containing future information to the chooser.

1. Reserve: enumerate all currently legal planning sequences of up to two actions, including moves, repairs and the all-closed rescue job. Enumerate all affordable policies. Rank choices by expected number of open stalls after immediate settlement, then expected cash plus four coins per open stall, then lower planning spend, then canonical action JSON order.
2. Margin: same action and policy enumeration, rank by expected cash plus four coins per open stall, then expected open stalls, then the same tie breaks.
3. Fixed berths: same Margin policy, with moves removed. Repairs, rescue and all affordable coverage choices remain available. This is a layout ablation of our own game, not a dumb spending baseline or another game.

Expected outcomes use only today's four public tickets, evaluated independently of the game seed. For each ticket, close newly hit active stalls; calculate the one event's aggregate matching claim with deductible2/cap6; then reopen closed stalls while cash permits, in descending current berth income and ascending id order; collect that day's income. This greedy settlement rule is shared across policies and disclosed as a limitation. At actual settlement use the same rule. Legal planning transitions may call production act but the expected-event evaluator must be independently expressed.

Metrics: per-seed end cash, open stalls, actual goal completion; aggregate ranges/means and success count; counts of each planning action and policy; paired win/tie/loss by terminal cash and goal; across policies report identical action sequences and layout diversity. No significance or human-effect estimate. Do not choose seeds after seeing results. Capture failures and exact output before adjusting design. A dominant policy or easy/trivial economy is an adverse design finding to retain.

Additional integration gates: all cash stays nonnegative/integer; positions stay unique/in-range; claims never exceed6 or pay on an excluded event; original states are immutable; replay returns identical tickets regardless of policy actions; all-closed cash0 plan permits rescue(+4) then repair(-4) and subsequent income. Invalid actions must not mutate state. Six-day termination must occur. No policy may inspect future outcomes.

Runtime scope: ordinary installed Node, no dependencies/network/paid resources. Stop on unexpected runaway behavior; this finite enumeration is below a few million small state evaluations. No broad search or parameter tuning is included.
