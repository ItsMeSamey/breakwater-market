# Breakwater Market
## Game design document, prototype v3

Prepared November 6, 2026. A six-day, turn-based harbor game for one player. The prototype is a downloadable HTML game that runs locally with embedded styles and scripts.

## The loop

Three stalls share six berths. Waterfront sales are higher, but a surge can strike an entire quay. A cable fault crosses both quays in one lane. Each day, the player sees four equally likely event tickets, moves or reopens stalls, chooses insurance or keeps cash, then opens the market. The incident happens before sales. The player decides which damaged stalls to reopen, collects sales, pays operating supplies, and prepares for the next day.

The goal is to finish day six with all three stalls open and at least 18 coins for lantern night. Progress is measured by coins and operating stalls.

## Decisions and consequences

Moving costs one coin and one of two planning actions. A safer berth may earn less or lose the day's high-demand bonus. Scheduled reopening costs three coins and one action but exposes the stall to today's incident. Emergency reopening after the incident costs four coins. A player with every stall closed can take one rescue job per day for four coins and one action, including at zero cash.

Surge and cable-fault cover each cost two coins for one day. Only the named incident is covered. The claim is max(0, new covered repair bill minus two coins), capped at six coins. Old damage creates no new claim. Payment is immediate in the simplified game. A calm day still costs the premium.

Each open stall sells three coins on the waterfront or two in the garden, plus one at the visible high-demand berth. One coin of supplies is deducted from each open stall's sales. Closed stalls have no sales or supply cost. No borrowing or negative balance is required.

The game distinguishes accessible cash from expected earnings. A group of stalls can have the same average damage as independent risks while having a different chance of a simultaneous repair shortage. The live preview enumerates the actual joint events. It does not reveal which ticket will be drawn or choose a move for the player. A zero repair-funding risk does not guarantee enough money for lantern night.

## Replay and variation

A seed generates six public forecasts, high-demand locations and event draws. Event draws are independent of the player's actions. Replaying a seed repeats those draws, allowing a different placement or policy choice to be compared with the same events. A new seed changes the week. A week is a short solo experiment.

## Presentation and controls

The harbor board is the main interaction surface. Original CSS stall shapes, quay colors, stripes, text labels and visible damage indicators show position and exposure. Color is never the sole signal. A compact resource display and primary turn action sit beside the decisions. The event reveal explains the premium, claim, repair cost and remaining cash. The cash trail includes planning actions, gross sales, supplies and net receipts.

Real buttons support Tab, Enter and Space. Phase changes move focus to the event, next day or ending. Reduced-motion settings suppress the reveal animation. The narrow layout preserves the three-column harbor geometry and wraps labels. There is no drag-only interaction, audio requirement or timed input. A no-script/loading fallback explains how to keep the local files together. A restart dialog validates seeds before replacing a game.

## Implemented technical evidence

An independently written reference checked 6,360 fixed current-round cases plus closed-stall, symmetry, affordability, probability-mass and future-information controls. The exact preview had zero shortfall-probability error. Removing cross-stall dependence while preserving individual risk produced 4.065 percentage points mean absolute error and 32.8125 points maximum error. This comparison removes dependence from our own model; the full method and scope are in VERIFICATION.md.

Twelve core integration tests cover recovery at zero cash, action budgets, scheduled versus emergency repairs, once-daily rescue, claims, accounting, deterministic replay and operating supplies. The unchanged preview function is explicitly bound to the earlier independent result.

Automated causal policies were also tested. The earlier economy was too forgiving: all 120 test games won and all stalls reopened every day. Version 3 adds the disclosed operating-supply cost. On 40 fresh weeks, the two moving policies each won 38 goals; the fixed-berth variant won 33. The moving policies still made identical decisions and rarely faced liquidity shortages. Their one-day objectives do not optimize final-goal probability. These tests identify economic consequences and weaknesses to examine in playtesting.

An exact structural check found real reasons to buy cover despite easy relocation. Moving can sacrifice earnings. In one valid final-day illustration, cover reduced expected cash from 22 to 21.5 while increasing the probability of funding lantern night from 75% to 100%. The illustration uses a valid state whose reachable play history remains unverified.

Actual original-browser play completed all six days, seed restart and zero-cash recovery. Narrow-layout and keyboard observations are documented separately in VERIFICATION.md. Human playtesting and assistive-technology review remain future work.

## Scope and possible later work

Completed scope is the six-day local prototype, deterministic rules, readable cash trail, risk preview and reproducible tests. Possible later work includes volunteer playtesting, clearer onboarding based on observed confusion, translation reviewed by fluent speakers, more varied public incident structures, and a goal-aware comparison mode. Later development would be scoped under a separate agreement.

## Sources and credits

Financial concepts were checked against NAIC's How Does Insurance Work, the Texas Department of Insurance's deductible explanation, and the Consumer Financial Protection Bureau's emergency-fund guide. The prices, incident probabilities and service timings are fictional game rules. Real products have different terms.

https://content.naic.org/consumer/how-does-insurance-work
https://www.tdi.texas.gov/tips/deductibles.html
https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/

The game, interface shapes and tests were developed with OpenAI Codex assistance, including independent design/source review. The artwork uses original CSS shapes, and the game is silent. Browser and Node provide the execution environments. Embedded JavaScript handles the game locally.
