# V3 structural check: easy safety is reachable, but insurance is not universally redundant

November 6, 2026. The predeclared standalone check completed once with exit 0, approximately 2.08 seconds of command wall time. Contract and source were hashed before execution. No game rules, runtime source, browser state or prior results were changed.

The retained contract is STRUCTURAL_CHECK_V3_CONTRACT.md. Source is tests/structural-v3.py, SHA-256 c8836deada0f894ece4e8513049cb8b6c0652afa0cb121c6ab42c9ef5d3749c8. Complete inputs, hashes, 3,600 structural cases and 6,480 economic cases are under evidence/v3-structural-check/. The model independently expresses the current v3 rules and does not import production helpers.

## Proven reachability and its limits

For three open stalls on the six berths, a target layout is reachable in exactly the number of currently occupied positions absent from the target. Each corresponding target position is empty and can receive one moved stall. This establishes both the lower bound and a legal move construction; no swap, extra action or free relocation is assumed.

Every three-stall layout can reach a layout with one stall per column and at most one in the forecast surge row in no more than two moves. Across all 20 layouts and six forecasts, 24 already satisfy this stronger condition, 90 require one move and six require two. The two-move cases are the layouts with all three stalls in the threatened row. Move two to the opposite row in their respective columns. Other violations can be repaired by moving a stall to the missing column, the opposite row, or both.

That stronger layout limits every named column fault and the forecast surge to at most one damaged stall. With two actions and at least six coins, even two one-coin moves leave four coins, enough to reopen the maximum one damaged stall immediately without insurance. The exact affordability enumeration confirmed this for every applicable case.

The conditions matter. A player with only one action cannot move two of three stalls out of the threatened row. Cash spent on moving is not available for repairs. Existing closed stalls also require money and are outside this all-open invariant. The result is not an induction proving that every six-day sequence can stay solvent: later cash, actions and damage may differ. It establishes a readily accessible one-round safety option under the stated resources.

## Coverage on a fixed one-hit layout

When either possible incident can hit at most one stall, the largest matching claim is two coins, equal to the premium. On the covered incident, buying coverage leaves no more funds before repair than not buying it. On a calm or excluded event it leaves two fewer coins. The independent enumeration verified 155,520 such event comparisons, including open-stall and cash-plus-stall-value comparisons after settlement.

This is a valid pathwise statement for the same already-safe layout. It is not a comparison between the income and relocation cost of that layout and a different, more exposed layout. Do not extend it to blanket insurance irrelevance.

## Relocation does not dominate staying with cover

Among 5,076 economic cases where both the best safe relocation and a staying-with-coverage option were available, staying with coverage had higher one-day expected cash-plus-stall-value in 387, tied in nine and had lower value in 4,680. These are counts in the fixed exhaustive check, not an estimate of how often players will encounter those situations. The one-day objective and settlement rule match the disclosed diagnostic interpretation; no six-day optimality claim follows.

The predeclared initial-state counterexample confirms the income/action-cost concern. Start at [0,1,5] with six coins and two actions; forecast front-row surge, column1 fault and hotspot1. Staying with surge coverage has expected cash8.5 and all three stalls open in every event, for cash-plus-stall value20.5. The best safe relocation has expected cash8 and all three open, value20. Moving costs a coin and changes available earning positions. Staying without coverage ties value20.5 but has expected open stalls2.75 and a25% immediate repair-funding shortfall probability. Thus coverage is a meaningful way to preserve production without giving up the valuable location in this state.

## High cash removes funding risk, not every financial risk

With at least12 coins and no movement or premium, even the largest immediate repair bill can be paid. All4,320 applicable high-cash economic cases confirmed zero immediate funding shortfall. Also, a named peril occurs with probability1/4 and coverage pays at most6, so expected payout is at most1.5 against a2-coin premium. These facts explain why the mean-wealth policy often declines cover.

However, the actual lantern goal has a cash threshold. Consider the predeclared final-day state:20 coins, all three stalls on the front row [0,1,2], forecast front-row surge and column0 fault, with hotspot3 on the back row. Keep the layout unchanged:

| Choice | Calm cash | Surge cash | Fault cash | Mean cash | Goal probability |
| --- | ---: | ---: | ---: | ---: | ---: |
| No coverage |26|14|22|22|75%|
| Surge coverage |24|18|20|21.5|100%|

All stalls reopen in every outcome under both choices, so both have zero repair-funding shortfall. Coverage sacrifices half a coin of expected cash but protects the18-coin final target. The best safe relocation also reaches the goal in every event, but its mean cash is21, below the insured unchanged layout's21.5. This disproves both 'high cash makes insurance irrelevant to the goal' and 'relocation always dominates insurance.'

The existing Reserve and Margin diagnostics optimize expected open stalls and cash-plus-stall value. They do not optimize the actual final-goal probability. Their agreement and low coverage use are real observations under those policies, but are insufficient evidence that the game's coverage option is systematically irrelevant. A zero displayed funding-shortfall probability must not be described as zero chance of missing the lantern goal.

## Consequence for the prototype

The board does provide a cheap, easy-to-reach immediate safety option, which helps explain the lack of liquidity pressure in the v3 policy traces. But it has a disclosed income cost, and specific states preserve a real choice between earnings, coverage and goal protection. The narrower limited-prototype claim remains defensible; claims of balanced reserve play or broad strategic depth remain unsupported.

This check does not justify adding downtime merely to make moving painful. A relocation-commitment rule could be investigated in a separately scoped design, but it changes the game rather than repairing a proven accounting defect. Before such a change, a separately frozen causal diagnostic that values the actual terminal goal could distinguish a policy-objective blind spot from a missing mechanism. Preserve the existing policy results if that diagnostic is ever added; do not relabel them as goal-optimal.

No additional diagnostic or mechanism change was executed here. Actual rendered six-day play, adverse replay and all-closed recovery remain the appropriate usability evidence. The original v2 failure and v3's residual limitations remain part of the record.
