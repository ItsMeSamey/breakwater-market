# Pre-run risk-label clarification

November 6, 2026. This revision was made before any prototype or evaluation execution. RULES_FREEZE.md remains unchanged as the original v1 design record.

The original final paragraph described the chance of being unable to pay newly caused repairs. The critic's EVALUATION_DRAFT.md instead defines the chance of being unable to reopen all stalls, including existing closures. Use the latter, more useful player-facing definition. The visible summary now reads 'chance you cannot reopen all stalls'. Each possible-event line separates new damage, existing repairs, payout and the resulting funding gap.

Existing closed stalls add four coins each to the full repair requirement. They never generate new damage or another claim. Payout still depends only on newly damaged open stalls and the named covered peril. Mean raw damage remains new damage only. Income arrives after settlement and cannot fund immediate reopening. A cash balance exactly equal to required repairs is sufficient.

The production pure preview entry point is previewFor(state, publicForecast). It receives only the current positions/open flags/cash/policy and public row/column forecast. A game wrapper obtains the public forecast, then calls this function. It never passes or reads the realized ticket in previewFor.

Initial editing failure: one multi-file context patch was rejected with INVALID_ARGUMENT before any write; a source grep confirmed the old preview remained. The corrected core-only patch applied. No evaluation result informed this revision.
