# Rules v2: scheduled repair and bounded rescue

November 6, 2026. Adopted after the v1 independent probability/accounting tests, but before any gameplay diagnostic or rendered play. The change responds to source-review defects, not tuned strategy outcomes. Original source is preserved in evidence/v1-source with hashes; original rules and run receipts remain intact.

All rules in RULES_FREEZE.md plus the pre-run full-repair-risk clarification remain, except:

- Scheduled reopening during planning costs three coins and one action. The stall is open immediately, so it can be struck by the imminent incident. This is a cheaper planned service with exposure risk.
- Emergency reopening during settlement costs four coins and no planning action. The incident has already happened, so the reopened stall is safe until the following day. Closed stalls earn nothing until reopened.
- Rescue is available only when all three stalls are closed, at most once per day, for one action and four coins. A rescueUsed flag resets when the next day begins. Rescue remains available with zero cash; it can fund a scheduled reopening with one coin left, or an emergency reopening after the event.

These fictional prices make the timing decision real. In v1, scheduled repair cost the same four coins as later emergency repair, used an action and exposed a stall, making it weakly dominated. V1 also allowed two rescue jobs in one day. The source critic found both before strategy execution.

The preview remains the probability of being unable to fund all immediate emergency reopenings at four coins each. Existing closures add a repair requirement but do not create a new insurance claim. Newly damaged open stalls still produce a four-coin bill per stall; matching coverage has a two-coin aggregate deductible and six-coin cap. Therefore the frozen 6,360-case preview specification and its arithmetic need no change. A focused source binding/check must confirm preview code remains unchanged in v2.

## Gameplay diagnostic amendment, before its first run

Keep the original 40 seeds, three causal policies, expected one-day objectives, action enumeration, common emergency-settlement rule and metrics. Permit scheduled repair at three coins and disallow a repeated rescue once rescueUsed is true. The policy observation includes rescueUsed, an already public current-day flag. It still excludes seed, future events and future forecasts. Preserve per-game traces incrementally so a partial or failed run retains completed outcomes. No results have been inspected to choose these rules.
