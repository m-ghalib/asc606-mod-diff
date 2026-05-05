# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

ASC 606 Mod-Diff Visualizer. Portfolio piece for fintech/finance PM roles, primary target Senior Product Manager, Usage Data at Tabs.

Narrative: **"Tabs ships the engine. Diff makes amendments legible at month-end."** Position as auditor/controller-facing overlay on rev rec engines (Tabs, Maxio, Zuora, RightRev, NetSuite). Not a competitor to the engine.

Persona: internal controller doing month-end close at a Series B-C usage-based SaaS company. Snowflake-style contracts (annual commit + usage overage).

## Why This Exists

Closes two load-bearing rubric gaps from resume eval against the Tabs Senior PM Usage Data JD:

1. **`product_sense_customer_insight`** (cov 0.00, imp 7) — zero finance/RevOps customer-discovery evidence. Build must demonstrate Controller-perspective workflow understanding.
2. **`analytical_rigor`** (cov 0.75, imp 10) — missing usage-metering specifics. Code must demonstrate ASC 606 mechanics: variable consideration, cumulative catch-up, transaction price reallocation, traceability from invoice line item to underlying contract clause.

README must carry a thesis paragraph forwardable internally at Tabs without context. Tabs name does not appear in repo title.

## Locked Scope

**In scope** (occupies empty space vs Tabs / Maxio / Trullion):

- Mod diff side-by-side viz (the wedge)
- Per-mod close memo auto-draft via Gemini API, scoped narrower than generic 606 memo
- Mod-driven PBC sampling export (auditor bridge)

**Out of scope** (Tabs already ships, or competitors crowd):

- GL impact preview, exception inbox, signoff workflow, ML amendment classification
- Generic per-contract close memo (V7, ChatFin, Zone, RightRev, OpenAI internal own this)
- Contract list view (1 gold contract, list is dead weight)

## Data

- 1 gold contract: "Acme Corp" (Snowflake-style: annual commit + overage)
- 3-5 amendments. Each shifts recognized revenue meaningfully (mid-term price change, term extension, commit upsize, SKU swap, retroactive credit).
- JSON seed + generator script. No production data, no PII.

## Stack

- **Frontend**: Next.js (App Router)
- **Database**: SQLite
- **AI**: Google GenAI SDK (`@google/genai`) for per-mod close memo drafting
- **Package manager**: Bun
- **Hosting**: Vercel
- **Version Control**: jj colocated with git
- **License**: Apache 2.0

## ASC 606 Primer

ASC 606 is the US GAAP revenue recognition standard. A "mod" (modification/amendment) changes contract terms mid-stream and forces revenue schedule recalculation.

Key 606 concepts load-bearing in this codebase:

- **Performance obligation**: distinct promise of goods/services in a contract
- **Transaction price allocation**: spreading total contract value across performance obligations
- **Variable consideration**: usage-based/overage revenue subject to constraint
- **Cumulative catch-up**: when a mod changes the transaction price, prior periods get restated
- **Contract modification accounting** (ASC 606-10-25-10 through 25-13): three treatments — separate contract, termination + new contract, modification of existing contract. Diff viz must surface which treatment applies and why.

## AI Integration

Google GenAI SDK. Close memo prompt takes structured JSON (contract state before, contract state after, mod metadata, computed schedule delta) as input, never raw text. Output reads like a controller wrote it: passive-voice avoided, no AI tells, cites the specific clause + dollar delta.

Model: default to `gemini-3-flash-preview` for memo drafting unless cost, latency, or quality dictates a newer Gemini model.

## Quality Bar

- README thesis paragraph readable cold by a controller or a Tabs PM. No internal jargon, no "I built this for X" framing.
- Every UI surface reads as auditor-grade: dollar amounts to the cent, dates absolute not relative, mod identifiers stable.
- Diff viz makes the 606 treatment classification (separate / termination + new / modification) visible at a glance, not buried in a memo.
- Generator script is deterministic with a seed. Reviewer can reproduce the gold contract.

## Risks Tracked

- **Tabs ships diff in 6mo** → fallback positioning is opinion layer on which mods need controller eyes, not raw diff.
- **AI memo space crowded** (V7, ChatFin, Zone, RightRev) → per-mod scope, not per-contract, is the differentiator. Hold the line.
- **Controllers prefer ERP-native** → frame in copy as overlay over Tabs/Zuora/RightRev/NetSuite, not standalone close tool.

## Out of Bounds for This Repo

- Multi-tenant auth, billing, user accounts. Single-page demo, single contract.
- Real customer data or de-identified production exports.
- ERP push/pull. Read-only artifact.
