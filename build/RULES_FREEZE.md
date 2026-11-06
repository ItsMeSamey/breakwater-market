# Prototype rules frozen before execution

November 6, 2026. Version 1. No prototype or evaluation run occurred before this file. Later rule changes require a new version and preserved earlier results.

Six days, three persistent stalls, six locations in two rows of three. Initial locations are 0,1,5; cash is 6; all stalls open. Front row earns 3 coins per open stall per day; back row earns 2. Each day's known highlighted location earns one extra coin. A successful lantern night requires all three stalls open and cash at least 18 after day six. Report cash and open stalls directly; no educational score.

Each planning phase has two actions. Move one stall to an empty location for one action and one coin. Repair one closed stall for one action and four coins. If all stalls are closed, a rescue job adds four coins for one action. The next action can reopen a stall. No debt or negative cash. This rescue rule is a deliberate safety net, not a financial product. No building/upgrades or buying extra stalls.

A policy selection costs two coins at market opening, or choose no policy. Choices are surge coverage or cable-fault coverage. The policy expires after this day's event. A matching event pays max(0, repair bill minus 2), capped at 6. The bill is four coins per newly damaged open stall. An already closed stall neither generates a bill nor a claim. Payment is immediate in this simplified game. All numbers and probabilities are fictional.

Each day's forecast contains four equally likely tickets: two calm, one surge affecting one named row, one cable fault affecting one named column. The seed selects the public row, column and bonus location and separately the event. No future realized event is exposed by the preview. The event happens before earnings. Hit open stalls close, and a matching claim is paid. During settlement the player may pay four coins per closed stall to reopen it, or leave it closed. Then each open stall earns the current location's stated income. This order makes cash available before the incident matter.

Next day reveals a new forecast and resets the action budget. After the sixth settlement, report the lantern goal and actual remaining cash/open stalls. Replaying a seed repeats events; a fresh seed changes them. Replay is for counterfactual exploration, not a hidden competitive leaderboard.

The preview displays current cash after premium, each possible event, bill, payout and funding gap; the exact probability of being unable to pay all newly caused repairs is the main risk summary. It neither ranks moves nor reveals the realized event. Tail calculations must use the joint board events. An independence ablation is an intentionally limited version of this preview, never an external competitor or evidence of human learning.
