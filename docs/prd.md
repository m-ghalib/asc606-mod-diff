# PRD - ASC 606 Mod-Diff Visualizer (Draft v0.1)

Demo / portfolio scope. Single gold contract, single happy path. Optimized to show the workflow and the visualization, not to be a real product.

## 0. Positioning

This is an auditor/controller evidence overlay for amendment review, not a revenue-recognition engine. Tabs, Maxio, Zuora, RightRev, and NetSuite own calculation and system-of-record workflows. This demo makes amendment effects legible at month-end: what changed, why the ASC 606 treatment applies, how the revenue schedule moved, and what evidence belongs in the auditor PBC packet.

## 1. Problem

Controllers at usage-based SaaS companies dread mid-stream contract amendments. A mod can shift transaction price allocation across periods, force cumulative catch-up adjustments, and reopen closed periods. The fear is restatement: a resume scar, audit committee notice, SEC comment letter risk.

Today the controller assembles defense by hand: pull old contract, pull new contract, diff the clauses in their head, recompute the rev schedule in Excel, write a memo, archive everything for the auditor PBC list. Slow, error-prone, hard to defend three quarters later.

## 2. Persona

Internal controller, Series B-C SaaS company, Snowflake-style contracts (annual commit + overage). Risk-averse career-protector. Buys for defensibility first, speed second. Adjacent buyer: VP Controller / Director of SOX in pre-IPO track.

Job to be done: "When an amendment lands, produce audit-ready evidence that the new revenue schedule is correct and that I can defend every number to the auditor."

## 3. Goals

- Make every amendment legible at a glance: what changed, what the dollar impact is, which ASC 606 treatment applies, and whether the revenue impact is prospective or cumulative catch-up.
- Produce a workpaper-grade artifact per mod: diff, recomputed schedule, close memo citing ASC 606 paragraphs, timestamped source pointers.
- Bundle artifacts for the PBC list at month-end.

### Non-goals (this demo)

- Multi-tenant auth, billing, real ingestion from Tabs / Maxio / Zuora.
- Edge-case 606 treatment beyond the scripted amendment paths below.
- Mobile, exports beyond PDF/JSON, multi-currency, tax.

## 4. Gold scenario

One contract: **Acme Corp**. Annual commit $1.2M + overage at $0.10 per unit. Four amendments across the year:

1. **Mid-term price reduction**: modification of existing contract; prospective revenue impact.
2. **Add new product SKU**: separate contract assessment; allocation reshuffle.
3. **Backdated quantity true-up**: modification of existing contract; cumulative catch-up to prior periods.
4. **Renewal with extension**: termination plus new contract assessment; term combination test.

Each amendment is picked because it forces a different ASC 606 analysis path. The visualization must separate the accounting treatment from the revenue impact pattern:

- **Accounting treatment:** separate contract, termination plus new contract, or modification of existing contract.
- **Revenue impact pattern:** prospective, cumulative catch-up, or allocation reshuffle.

## 5. Core workflow

Five steps. Linear. No branching in v0.1.

1. **Land amendment**: controller picks an amendment from the contract timeline.
2. **See the diff**: side-by-side old vs new contract terms, dollar deltas highlighted.
3. **See the schedule impact**: old recognition curve vs new recognition curve, period-by-period delta, cumulative catch-up flagged.
4. **Read the memo**: Claude-drafted close memo citing ASC 606-10 paragraphs, stating treatment, distinguishing prospective vs cumulative catch-up, materiality flagged.
5. **Bundle PBC**: one-click export of diff + schedules + memo + audit trail to a single PDF/zip for the auditor.

## 6. Visualization spec

Three views, accessible from the contract page.

### 6.1 Contract timeline

Horizontal timeline. Master contract anchored left. Each amendment plotted at its effective date. Color-coded by ASC 606 treatment (separate contract = green, termination plus new contract = purple, modification of existing contract = blue). A secondary badge shows the revenue impact pattern: prospective, cumulative catch-up, or allocation reshuffle. Click an amendment to drill into the diff view.

### 6.2 Mod-diff view

Two-panel layout.

- **Left panel: clause diff.** Old contract terms vs new. Inline highlights on changed fields: term length, transaction price, performance obligations, pricing tiers, overage rate. Standard `+` / `-` diff coloring on the values that move.
- **Right panel: schedule diff.** Stacked bars per period, period on x-axis, recognized revenue on y-axis. Old vs new bars side-by-side. Cumulative catch-up amount rendered as a separate band beneath the per-period bars so it does not get lost inside the timeline.

Top of view: header strip showing ASC 606 treatment, revenue impact pattern, total contract value old -> new, total recognized to date old -> new, cumulative catch-up dollar amount, materiality flag. Materiality flag fires when the absolute delta exceeds 5% of TCV (hardcoded; no per-contract config in v0.1).

### 6.3 Close memo panel

Right rail or modal. Generated memo text with inline citations to ASC 606-10 paragraphs. Sections: facts, treatment determination, revenue schedule impact, materiality assessment. Regenerate button. Editable before bundling.

Memo history is **append-only**: each regenerate stores a new version with timestamp, model version, prompt version, and input payload hash. Human edits also create timestamped versions with editor label and prior-version pointer. Prior versions remain readable through a version selector. This preserves the audit-trail principle from `docs/persona.md`: auditors want to see what changed and why, not just the final text.

## 7. Data model

Per `docs/notes.md`. Contract entity with: date, length, type (master / amendment), contracting entity, related contracts (FK to master), products covered, clauses, pricing (commit + tapering / overage), risks. Plus per amendment: effective date, ASC 606 treatment classification, revenue impact pattern, computed schedule delta, memo history, PBC bundle pointer.

Traceability is first-class. Seed data must include stable IDs for clauses, amendments, usage meters, invoice lines, and revenue schedule lines. Every visible dollar delta must trace from changed clause to usage meter or invoice line to computed schedule line.

Storage: SQLite. Seed file ships the Acme Corp gold scenario. The seed file must be reproducible from a deterministic generator script with a fixed seed, including contract, amendment, usage, invoice, and schedule artifacts.

## 8. AI integration

Anthropic SDK. Close memo prompt takes structured JSON (old terms, new terms, computed deltas, ASC 606 treatment, revenue impact pattern, and provenance IDs) and returns a memo in controller voice with paragraph citations. Prompt caching on the contract context block since it repeats across all four amendments. No raw text dumps as input.

## 9. Audit trail

Every diff carries:

- Immutable timestamp.
- Source-of-truth pointer (which contract version, which amendment ID, which clause IDs).
- Provenance pointer for each dollar delta (usage meter ID, invoice line ID, revenue schedule line ID).
- Computed-by signature (model version, prompt version, app version).
- Memo history events for generated versions and human edits.

PBC bundle includes the audit trail log, not just the final numbers.

Bundle format: **zip containing PDF + JSON + source files**. PDF is the human-readable workpaper (diff snapshot, schedule chart, memo, audit-trail appendix). JSON carries the structured payload for downstream tooling. Source files are the original contract and amendment artifacts the diff was computed against, closest to a real PBC packet.

## 10. Out of scope (v0.1)

Real ingestion. Multi-contract dashboard. User auth. Collaborative approval or signoff workflow. Auditor view mode. GL impact preview. Live recomputation as data changes. Anything beyond the four scripted amendments.

## 11. Success criteria (demo)

A controller (or a PM playing one in an interview) can, in under 90 seconds, pick an amendment, see the dollar impact, read the memo, and export the PBC bundle. The artifact looks like something an auditor would accept.
