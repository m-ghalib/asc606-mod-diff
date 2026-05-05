# Visual Design — Tabs-aligned restyle

Date locked: 2026-05-04. Supersedes the prior paper-and-audit aesthetic (Instrument Serif display, paper texture, rotated DRAFT / MATERIAL / PBC stamps, all-caps mono eyebrows).

## Why this aesthetic

The portfolio target is the Senior PM, Usage Data role at Tabs. Adopting the Tabs visual language reinforces the narrative line in `CLAUDE.md`: *"Diff makes amendments legible at month-end"*, positioned as an overlay inside Tabs, not a separate product. A reviewer landing on the demo cold should read it as something that could ship inside Tabs.

Reference set lives outside the repo: tabs.com demo screenshots showing AR Automation overview, Close management, Collections, and Customer billing schedules. Direction borrowed from those screens, not pixel-cloned.

## Layout

- **Sidebar** (`components/shell/sidebar.tsx`, fixed 232px).
  - Dark navy `#0E1418`, full text labels.
  - Brand "diff+" wordmark, "Close support" group label.
  - Nav order matches Tabs: Overview, Customers, Invoicing (tree), Revenue (tree), Contract diffs (active branch with Acme Corp child), Reporting, Data. Bottom: Integrations, Settings, user row with logout.
  - Collapsed groups render as a row with a chevron; expanded groups indent children.
- **App shell** (`components/shell/app-shell.tsx`).
  - Main pane offset by `--sidebar-w`. Header bar holds the breadcrumb and trailing icon buttons (search, help).
  - 96px teal gradient veil sits behind the header, fading into the canvas. Mirrors the cyan tint at the top of every Tabs screen.
- **Breadcrumb** uses chevron `›` separators, current segment in `--ink` weight 600.

## Page composition

### Master view

`ContractHero` (master mode) → `ContractTimeline` → `MasterOverview`.

- Hero: display title (`Acme Corp, Inc.`), one-line subtitle, "Export PBC bundle" primary button.
- KPI row: 4 cards — Initial TCV, Consolidated TCV, Recognized YTD, Material amendments. Each card holds a label, large mono figure, hint line, and a small `↗` glyph at top-right (Tabs pattern).
- Timeline card: month-tick rail with treatment-dot markers per amendment, "Master view" link in the corner.
- Amendments card: header with count + "Up to date" green-dot status, toolbar row (search input, date chip, filters chip with badge, clear button), then a clean grid table with treatment chip, pattern badge, signed Δ TCV, catch-up amount, and a Material / Below thr. status pill.

### Mod view

`ContractHero` (mod mode) → `ContractTimeline` → `DiffWorkspace` (clause + schedule diff) → `CloseMemo` → `PbcBundleFooter` → optional `ProvenanceTrace` drawer.

- Hero swaps to mod context: small caption with mod number, effective date, ASC cite; display title is the amendment short title; chips row carries treatment, pattern, and a material pill if tripped.
- Mod KPIs reuse the same card style: Δ TCV, Δ Recognized, Cumulative catch-up, Materiality %.
- Diff workspace is two cards in a 1 / 1.15 grid: Clause diff (header, then per-clause rows with paired before / after blocks) and Schedule diff (legend, axis, 3 monthly bar pairs old vs new, optional cumulative-catch-up band underneath).
- Close memo is one card with two columns: memo body sections (Facts / Treatment determination / Revenue schedule impact / Materiality assessment / Authoritative citations) and a right-rail Version history with selectable v1…vN entries.
- PBC footer: fixed strip offset by sidebar, soft elevation, charcoal "Export PBC zip" primary button.

## Token system

`styles/tokens.css` is the single source. Highlights:

- Surfaces: `--canvas` `#ECEBE5`, `--surface` `#F5F3EC`, `--surface-2` `#FAF8F2`, `--surface-raised` `#FFFFFF`. Cards default to `--surface` so they read warmer than the canvas, matching Tabs.
- Sidebar: `--sidebar` `#0E1418`, `--sidebar-active` `#1D262E`, `--sidebar-ink-active` `#FFFFFF`, dim/mute variants for inactive labels and group titles.
- Borders: rgba alphas at 8% / 14% / 5% over the ink color. No hard 1px hairlines on dark.
- Treatment colors retain semantic meaning but ship with paired `-bg` tokens at low saturation so they render as soft pills rather than outlined chips.
  - Modification → blue, Separate contract → green, Termination + new → purple.
- Pattern colors paired the same way (Prospective green, Cumulative catch-up amber, Allocation reshuffle purple-gray).
- Materiality and diff add / remove kept their warm-red and green pairing; tinted backgrounds (`--material-flag-bg`, `--diff-add-bg`, `--diff-remove-bg`) replace the rotated stamp.
- Radius scale: `8 / 10 / 14 / 999`. Cards are `--radius-lg` (14px).
- Type scale tightened for a SaaS dashboard register: display-1 36px, display-2 24px, body 15px, captions 12-13px. Geist Sans for everything; Geist Mono only for tabular figures, IDs, dates, and citations.

Legacy aliases (`--paper`, `--paper-2`, `--paper-3`, `--hairline`, `--hairline-2`, `--hairline-3`) point at the new tokens so any incremental component still compiles. Removable once everything is converted.

## Components dropped

- `contract-header.tsx` (replaced by `contract-hero.tsx`, which handles both master and mod modes).
- `mod-diff-header.tsx` (folded into `contract-hero.tsx` mod mode).
- `ui/materiality-stamp.tsx`, `ui/draft-stamp.tsx`, `ui/pbc-stamp.tsx` (rotated paper stamps replaced by soft pills).
- `ui/hairline.tsx`, `ui/figure.tsx` (no callers; card borders and inline mono spans replace them).

## What this still does not change

- ASC 606 mechanics, the gold contract data, the per-mod close memo prompt structure. Visual change only.
- Provenance trace drawer behavior. Restyled to match cards but keeps the chain-of-custody panel and the Esc-to-close keybinding.
- README thesis and PRD scope.

## Risks and trade-offs

- **Distinctiveness vs. mimicry.** Closely tracking Tabs's UI is intentional for the portfolio, but it costs originality. If this gets reused for any non-Tabs context, the palette and sidebar should re-skin.
- **Materiality salience.** Soft amber pills are calmer than the rotated red stamp, which may read as less alarming to a controller scanning at speed. The hero pill plus the table status pill plus the timeline material dot collectively keep the signal visible; if reviewers report missing it, escalate by switching the hero pill to a filled solid.
- **Legacy token aliases.** Keeping `--paper` and friends pointed at new tokens prevents a flag day, but leaves dead names in the file. Sweep when no component references them.
