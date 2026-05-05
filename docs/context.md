# Context — Why This Build Exists

Upstream context for `docs/prd.md`. Captures the hiring target, the rubric gaps this artifact closes, and the distribution plan. Source files live in `~/GitHub/obsidian/Resumes/` (`3-jobs/`, `6-analysis/`, `8-coldies/strategy/`, `scratchpad/2026-04-30-tabs-resume/`).

## Hiring target

| Field | Value |
|---|---|
| Company | Tabs |
| Role | Senior Product Manager, Usage Data |
| Comp | $180K – $220K + equity |
| Location | NYC, on-site, 5-day in-office |
| Posting | https://jobs.ashbyhq.com/tabs/3af8639b-41b1-4abf-a3ad-b1fbac042703 |
| HM | Joanne Wu, Director of Product Management |
| Skip | Arjun Gopalratnam, Chief Product Officer |
| Peer | Keith Huang, Sr Product Manager - Revenue |
| Recruiter | Josh Gr***r, VP of Talent (last name obfuscated in Apollo) |
| Fit score | 3.4 / 5.0 (Tier A) |
| Ship deadline | 2026-05-08 |

## Tabs snapshot

- AI-native contract-to-cash platform for finance/accounting teams. Founded 2023.
- Series B, $55M (Feb 2026, Lightspeed-led). $91M+ total. Investors: Lightspeed, General Catalyst, Primary, World Innovation Lab.
- Customers: 200+. Cursor, Statsig as flagship engineering-led logos.
- Traction: 5x ARR YoY, $500M+ invoice volume automated.
- Cadence: one-week sprints, weekly ship goals, intra-month releases.
- Founders: Ali Hussain (CEO, ex-COO Latch IPO), Deepak Bapat, Rebecca Schwartz.
- Buyer: Office of the CFO. Controllers, finance, RevOps. Not RevOps-CPQ (that is competitor Alguna's seat).

## Platform surface (4 modules)

1. **AI contract ingestion** — LLMs extract commercial terms from contracts/CRM into deterministic billing logic.
2. **Billing & invoicing** — automated schedules; usage events polled, computed against contract terms.
3. **Collections & dunning** — embedded payment links, real-time reconciliation.
4. **ASC 606 rev rec + ERP sync** — Deferred-vs-Recognized schedules; bi-directional sync with NetSuite (certified SuiteApp), QuickBooks, Rillet.

## Role surface

PM owns systems for **ingesting, processing, summarizing usage data** powering usage-based billing and reporting. Technical paradigms expected:

- **Ingestion + idempotency** — APIs, webhooks, S3, Snowflake. Deduplication mandatory.
- **Stream processing + aggregation** — Kafka/Flink/Spark-style materialized views.
- **Accuracy, trust, auditability** — 0.1% drop = revenue leakage. Audit trail from invoice line item back to raw event.
- **Complex pricing models** — high-water mark, proration, prepaid drawdown, tiered overages, hybrid commit + variable.

Comparator companies: Twilio, AWS, Snowflake, Datadog, Stripe, Metronome, Orb, Chargebee.

## Rubric gaps this build closes

Critic eval against master resume produced two load-bearing gaps:

| Dimension | Coverage | Importance | Gap |
|---|---|---|---|
| `product_sense_customer_insight` | 0.00 | 7 | Zero finance/RevOps customer-discovery evidence on master resume. |
| `analytical_rigor` | 0.75 | 10 | Missing usage-metering specifics: idempotency, duplicate-event handling, aggregation, reconciliation, traceability. |

This artifact (P2 in outreach playbook) inverts both gaps experientially:

- **Controller persona work** (`docs/persona.md`) demonstrates finance customer insight in the workflow itself, not as a resume bullet.
- **Mod-diff + per-mod close memo + PBC bundle** demonstrate ASC 606 mechanics — variable consideration, cumulative catch-up, transaction price reallocation, traceability from invoice line item to clause — in code.

## Strategic positioning

Narrative locked in Todoist task `6gX322Fg5ppRr6wm`:

> "Tabs ships the engine. Diff makes amendments legible at month-end."

Position as **auditor/controller-facing overlay** on rev rec engines (Tabs, Maxio, Zuora, RightRev, NetSuite). Not a competitor to the engine. Not a generic close memo tool.

### Wedge (occupies empty space vs Tabs / Maxio / Trullion)

- Mod diff side-by-side viz
- Per-mod close memo auto-draft via Gemini API, scoped narrower than generic 606 memo
- Mod-driven PBC sampling export (auditor bridge)

### Out of scope (Tabs already ships, or competitors crowd)

- GL impact preview, exception inbox, signoff workflow, ML amendment classification (Tabs)
- Generic per-contract close memo (V7, ChatFin, Zone, RightRev, OpenAI internal)
- Contract list view (1 gold contract, list = dead weight)

### Risks tracked

- **Tabs ships diff in 6mo** → fallback positioning is opinion layer on which mods need controller eyes, not raw diff.
- **AI memo space crowded** (V7, ChatFin, Zone, RightRev) → per-mod scope, not per-contract, is the differentiator. Hold the line.
- **Controllers prefer ERP-native** → frame in copy as overlay over Tabs/Zuora/RightRev/NetSuite, not standalone close tool.

## Distribution plan

| Target | Node | Plays | Status |
|---|---|---|---|
| Joanne Wu | HM | P2 artifact (this repo) + P4 90-day plan PDF + optional P1 Loom, single LinkedIn DM | pending, deadline 2026-05-08 |
| Keith Huang | PR (peer) | P3 LI engage (3-5 substantive comments over 2 wk) → DM with one JD-rooted question | runway started |
| Josh Gr***r | Recruiter | calibration email, 2 JD-specific questions only | pending |
| Arjun Gopalratnam | Skip | none direct (warm path closed; 2 mutuals weak) | will surface if Joanne forwards |
| Sloane Kolt | Community backchannel (Lenny's Slack) | P7-light, intel only, no referral ask | pending |

## Quality bar (from `CLAUDE.md`)

- README thesis paragraph readable cold by a controller or a Tabs PM. No internal jargon, no "I built this for X" framing.
- Every UI surface reads as **auditor-grade**: dollar amounts to the cent, dates absolute not relative, mod identifiers stable.
- Diff viz makes the 606 treatment classification (separate / termination + new / modification) visible at a glance, not buried in a memo.
- Generator script deterministic with a seed. Reviewer can reproduce the gold contract.
- Tabs name **does not appear** in repo title or README. The thesis paragraph stands alone, forwardable internally without setup context.

## Anti-patterns (from outreach strategy)

Locked across all surfaces (DM, README, plan PDF):

- Stat-stuffed subject lines
- "JD reads like the work"
- "Same shape as Tabs"
- "Worth 15 min?"
- "Resume + a one-pager"
- Em-dashes, en-dashes
- The 5-line shape
- Leading with credentials
- "Hi Joanne, hope you're well"

## Source materials

- `~/GitHub/obsidian/Resumes/3-jobs/In progress/Senior Product Manager, Usage Data - Tabs.md` — JD + resume score
- `~/GitHub/obsidian/Resumes/6-analysis/senior_product_manager_usage_data_tabs__analysis.md` — full deep research, rubric, critic eval
- `~/GitHub/obsidian/Resumes/8-coldies/strategy/tabs_strategy.md` — outreach play stack
- `~/GitHub/obsidian/Resumes/scratchpad/2026-04-30-tabs-resume/{research_brief,job_description,deep_research}.md` — raw research
- Todoist parent task `6gX322Fg5ppRr6wm`
