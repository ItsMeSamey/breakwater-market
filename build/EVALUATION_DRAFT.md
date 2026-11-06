# Frozen preview evaluation specification, version 1

Status: frozen design specification on November 6, 2026, before implementation or evaluation. The filename remains EVALUATION_DRAFT.md for the owner's requested review workflow. No result is claimed. Changes after the first run require a new version and retention of the original result. This evaluates displayed current-round risk, not a playing strategy or educational outcome.

## Accepted rules relevant to the preview

The board has six berths, numbered row-major 0..5, with three distinct occupied positions. A forecast names one surge row (0 or 1) and one fault column (0, 1 or 2). Four equally likely tickets are calm, calm, that surge and that fault. Only active stalls are exposed to new damage. A newly damaged stall costs four coins to repair. Every already closed stall also needs four coins to reopen but creates no new loss or claim.

The preview's input cash is the current planning cash after completed move/repair/job actions and before the selected policy premium. Policy is none, surge or fault. A non-none policy costs two coins when committing. Covered new loss pays min(6, max(0, covered loss - 2)) in aggregate. Policies exclude the other peril. Income comes after the event and settlement and is not available to fund the immediate repairs.

For each possible outcome calculate:

- raw new damage = 4 times the number of active stalls struck;
- existing repair requirement = 4 times the number of closed stalls;
- available settlement cash = input cash - premium + payout;
- full repair requirement = existing repair requirement + raw new damage;
- shortfall iff full repair requirement > available settlement cash.

Equality is not a shortfall. The displayed quantity is the chance that available cash cannot reopen every stall immediately. It does not predict bankruptcy, mandatory debt, the player's chosen repair subset or eventual goal failure.

## Independent reference

The evaluator must import only the production preview entry point under test, not production event-generation, probability, claim, scoring or repair helpers. Define the six berth coordinates, four tickets, 4/2/6 constants and arithmetic independently in the evaluator. Explicitly enumerate the four tickets; each contributes weight 1/4. Keep an independently computed result for each complete case.

If the production result includes expected raw damage, compare it to the reference. If it includes expected net damage or payout, verify those against separately enumerated reference values; do not use them as raw-mean parity controls.

The production preview must depend only on the supplied current state and public forecast. It must not accept a realized ticket or read a future event sequence. Verify independence from any game-level future weather by changing future tickets while retaining the same current inputs.

## Frozen primary cases: 6,360

Enumerate in this order:

1. All 20 increasing three-position combinations from berths 0..5.
2. Surge row 0 then 1, fault column 0 then 1 then 2.
3. Policy none, surge, fault.
4. Integer planning cash 0 through 18, inclusive; omit policy states with cash below the two-coin premium.

All three stalls are active in the primary set. This gives 20 * 6 * (19 + 17 + 17) = 6,360 cases. The generator is exhaustive over these stated dimensions and needs no random seed. Save the canonical input list or its SHA-256 with the run before inspecting results. Do not select or drop cases based on the preview error.

## Independence ablation

For each stall, derive its categorical marginal probabilities from the public forecast independently:

- Surge probability is 1/4 if its berth is in the named surge row, otherwise zero.
- Fault probability is 1/4 if its berth is in the named fault column, otherwise zero.
- No-hit probability is one minus those probabilities.

For closed stalls, no-hit probability is one. Enumerate the Cartesian product of the three stall categories, multiplying marginal probabilities. This produces up to 27 outcomes. It deliberately removes cross-stall event dependence while retaining each stall's marginal exposure and peril label. It may admit combinations impossible under the real single-ticket game; that is the ablation being measured, not an undisclosed change to the actual game.

Apply the same independently specified aggregate deductible, cap and available-cash test to each ablation outcome. Insurance covers only the damage labeled with its selected peril. Premium is paid once. Do not use per-stall deductibles or caps.

Mean raw new damage must match the joint reference within 1e-12 on every case. The aggregate coverage rule is nonlinear: mean payout and net uncovered loss need not match and must not be described as equal.

## Controls and boundary tests

These do not enlarge the primary comparison denominator:

- Repeat the six forecasts for positions [0, 1, 5], all eight active/closed masks, policies none/surge/fault, and planning cash 2, 4, 6, 8, 12. Check exact shortfall, expected raw damage and payout against independent enumeration. Existing damage must not generate another claim.
- For zero newly exposed stalls, both models must agree. With one active stall and the rest closed, the models must agree because there is only one stochastic exposure. Existing repair requirements remain in the cash test.
- Validate payoff boundaries directly: covered losses 0, 4, 8, 12 imply payouts 0, 2, 6, 6; uncovered losses imply zero. Premium on calm days still applies. Cash exactly equal to a repair bill after payout implies no shortfall.
- An unaffordable selected policy must be rejected or returned as an explicitly invalid action. It must not silently provide free coverage or let a negative balance enter a probability comparison.
- Mirror board rows or permute columns, applying the same relabeling to occupied positions and forecast. Joint and ablated results must be unchanged. Income/hotspot labels are irrelevant to immediate shortfall because income occurs later.
- Independence-generator self-test: construct a separate genuinely independent three-stall categorical distribution, enumerate it directly as the true distribution, and require its ablation to agree. If the production preview only accepts four-ticket forecasts, this is an evaluator self-test, not a production-control pass claim.
- Check all probability totals equal one and all returned probabilities remain in [0, 1].

A predeclared illustrative counterexample is positions [0, 1, 5], all active, surge row 0, fault column 2, no policy, four coins. The real game has a 1/4 immediate full-repair shortfall probability. Independence gives 5/32 (0.15625). Both have expected raw damage of three coins. This constructed case explains the mechanism; it is not a representative user-effect estimate.

## Metrics and pass/fail

Correctness acceptance requires:

- every primary and applicable control case agrees with the independent joint reference within 1e-12 for unrounded probability;
- all raw-mean parity and probability-mass controls pass;
- no invalid policy state is silently accepted;
- displayed percent differs from raw probability by at most half a displayed unit, with the rounding rule stated;
- deterministic replay/future-ticket independence and the explicit zero-cash/all-closed recovery path pass separate integration checks.

For each model report mean absolute shortfall-probability error, maximum absolute error, number of exact ties, number of overestimates, number of underestimates, and the complete worst cases. Report probability differences in percentage points. Also retain the complete per-case results. Exact-zero error against the reference is a correctness claim; independence error is the cost of this defined ablation. Do not portray either as measured financial education.

The improvement claim is conditional: the exact model must have strictly lower mean absolute error than the ablation on this complete frozen set, with all correctness gates passing. If not, report the null or adverse result. Do not add a runtime or human-outcome win requirement after seeing results. Runtime can be recorded descriptively, with environment details, but is not the primary endpoint.

## Separate gameplay diagnostic

Before any strategy diagnostic, freeze its scenario seed list, causal policy code, permitted actions, budget and metrics in a separate versioned record. A policy must see only information available to a player at that decision point. Replay event sequences must be independent of policy actions. Do not substitute terminal score for learning, or omit a rescue/repair/coverage action from a baseline merely because it improves that baseline.

No strategy optimizer, player efficacy test or fun assessment is authorized or claimed by this preview specification. Balancing after a diagnostic is allowed as development, but the failed or trivial original version and result must remain identifiable.
