import type { Amendment, Clause, Contract, InvoiceLine, MemoVersion, Meter, ScheduleLine } from "./types";

const PERIODS_2025 = [
  "2025-01", "2025-02", "2025-03", "2025-04", "2025-05", "2025-06",
  "2025-07", "2025-08", "2025-09", "2025-10", "2025-11", "2025-12",
];

const meters: Meter[] = [
  { id: "m_query_units", label: "Query units", unit: "units" },
  { id: "m_premium_hours", label: "Premium support hours", unit: "hours" },
];

const masterClauses: Clause[] = [
  {
    id: "cl_term",
    category: "term",
    label: "Initial term",
    value: "12 months, 2025-01-01 through 2025-12-31",
    cite: "ASC 606-10-25-1",
  },
  {
    id: "cl_tprice",
    category: "transaction-price",
    label: "Annual commit",
    value: "$1.20 million (straight-line $100,000 / month)",
    cite: "ASC 606-10-32-2",
  },
  {
    id: "cl_po",
    category: "performance-obligation",
    label: "Performance obligation",
    value: "Single PO: Acme Data Platform access",
    cite: "ASC 606-10-25-14",
  },
  {
    id: "cl_overage",
    category: "overage",
    label: "Overage rate",
    value: "$0.10 per query unit above commit-equivalent volume",
    cite: "ASC 606-10-32-11",
  },
  {
    id: "cl_billing",
    category: "billing",
    label: "Billing cadence",
    value: "Monthly in advance, net-30",
    cite: "ASC 606-10-32-2",
  },
];

const masterInvoices: InvoiceLine[] = PERIODS_2025.map((p, i) => ({
  id: `inv_${p}_001`,
  period: p,
  meterId: null,
  description: `Acme Data Platform commit (period ${i + 1} of 12)`,
  amountCents: 10_000_000,
}));

// helper: build a schedule line per period
function line(
  id: string,
  period: string,
  category: ScheduleLine["category"],
  oldCents: number,
  newCents: number,
  clauseId: string,
  meterId: string | null,
  invoiceLineId: string | null,
  performanceObligation = "Acme Data Platform"
): ScheduleLine {
  return { id, period, category, oldCents, newCents, clauseId, meterId, invoiceLineId, performanceObligation };
}

// ============================================================================
// AMENDMENT 1 — mid-term price reduction (modification, prospective)
// effective 2025-04-15. monthly commit drops from $100,000 to $95,000.
// not material (~3.6% of TCV).
// ============================================================================

const amd001Lines: ScheduleLine[] = [
  // jan-mar unchanged
  line("sch_amd001_2025-01_commit", "2025-01", "commit", 10_000_000, 10_000_000, "cl_tprice", null, "inv_2025-01_001"),
  line("sch_amd001_2025-02_commit", "2025-02", "commit", 10_000_000, 10_000_000, "cl_tprice", null, "inv_2025-02_001"),
  line("sch_amd001_2025-03_commit", "2025-03", "commit", 10_000_000, 10_000_000, "cl_tprice", null, "inv_2025-03_001"),
  // april blended: 14/30 at $100k + 16/30 at $95k = $46,666.67 + $50,666.67 = $97,333
  line("sch_amd001_2025-04_commit", "2025-04", "commit", 10_000_000, 9_733_333, "cl_tprice", null, "inv_2025-04_001"),
  // may-dec at $95k
  line("sch_amd001_2025-05_commit", "2025-05", "commit", 10_000_000, 9_500_000, "cl_tprice", null, "inv_2025-05_001"),
  line("sch_amd001_2025-06_commit", "2025-06", "commit", 10_000_000, 9_500_000, "cl_tprice", null, "inv_2025-06_001"),
  line("sch_amd001_2025-07_commit", "2025-07", "commit", 10_000_000, 9_500_000, "cl_tprice", null, "inv_2025-07_001"),
  line("sch_amd001_2025-08_commit", "2025-08", "commit", 10_000_000, 9_500_000, "cl_tprice", null, "inv_2025-08_001"),
  line("sch_amd001_2025-09_commit", "2025-09", "commit", 10_000_000, 9_500_000, "cl_tprice", null, "inv_2025-09_001"),
  line("sch_amd001_2025-10_commit", "2025-10", "commit", 10_000_000, 9_500_000, "cl_tprice", null, "inv_2025-10_001"),
  line("sch_amd001_2025-11_commit", "2025-11", "commit", 10_000_000, 9_500_000, "cl_tprice", null, "inv_2025-11_001"),
  line("sch_amd001_2025-12_commit", "2025-12", "commit", 10_000_000, 9_500_000, "cl_tprice", null, "inv_2025-12_001"),
];

const amd001: Amendment = {
  id: "amd_001",
  number: 1,
  effectiveDate: "2025-04-15",
  shortTitle: "Mid-term price reduction",
  description: "Acme requested a goodwill price concession on the Data Platform commit, dropping the monthly rate from $100,000 to $95,000 starting 2025-04-15. The remaining services are distinct from those already transferred, so the modification is treated prospectively per 25-13(b).",
  treatment: "modification",
  pattern: "prospective",
  clauseChanges: [
    {
      clauseId: "cl_tprice",
      before: "$1.20 million (straight-line $100,000 / month)",
      after: "$1.16 million (Jan–Mar at $100,000; Apr blended at $97,333; May–Dec at $95,000)",
      changedFields: ["transaction-price", "monthly-rate"],
    },
  ],
  scheduleLines: amd001Lines,
  cumulativeCatchupCents: 0,
  totalContractValueOldCents: 120_000_000,
  totalContractValueNewCents: 115_733_333,
  recognizedToDateOldCents: 30_000_000,
  recognizedToDateNewCents: 30_000_000,
  citePrimary: "ASC 606-10-25-13(b)",
  computedBy: {
    appVersion: "diff@0.1.0",
    promptVersion: "memo-prompt-v3",
    modelVersion: "gemini-3-flash-preview",
    computedAt: "2025-04-15T09:14:00Z",
    inputHash: "sha256:a4f1c9e2",
  },
  memo: [
    {
      id: "mv_amd001_v1",
      version: 1,
      source: "generated",
      authorLabel: "gemini-3-flash-preview",
      modelVersion: "gemini-3-flash-preview",
      promptVersion: "memo-prompt-v3",
      inputPayloadHash: "sha256:a4f1c9e2",
      priorVersionId: null,
      createdAt: "2025-04-15T09:14:00Z",
      body: {
        facts:
          "Effective 2025-04-15, Acme Corp and the Company executed an amendment reducing the monthly Data Platform commit from $100,000 to $95,000 for the remaining contractual term. Quarter 1 invoices and revenue recognition for January through March 2025 remain unchanged. Total contract value declines from $1.20 million to $1.16 million, a reduction of $42,667 (3.6% of original TCV).",
        treatmentDetermination:
          "The amendment does not add distinct goods or services and does not reflect standalone selling prices, so separate-contract treatment under 25-12 does not apply.[1] The remaining services are distinct from those already transferred to the customer through 2025-04-14, satisfying 25-13(b);[2] accordingly the modification is accounted for as a change in transaction price for the remaining performance obligations on a prospective basis. No revision of revenue recognized in prior periods is required.",
        revenueScheduleImpact:
          "Recognition for periods 2025-01 through 2025-03 is unchanged at $100,000 per month. Period 2025-04 reflects a blended rate of $97,333 (14 days at $100,000, 16 days at $95,000). Periods 2025-05 through 2025-12 recognize $95,000 per month.",
        materialityAssessment:
          "The absolute change in TCV of $42,667 represents 3.6% of the original $1.20 million commitment. This falls below the 5% threshold for the materiality flag and does not trigger restatement of any prior period. The change will be disclosed in the next quarterly contract activity summary.",
        citations: [
          { marker: 1, cite: "ASC 606-10-25-12" },
          { marker: 2, cite: "ASC 606-10-25-13(b)" },
        ],
      },
    },
  ],
};

// ============================================================================
// AMENDMENT 2 — add new product SKU (separate contract, allocation reshuffle)
// effective 2025-06-01. Premium Support added at $3,000/mo standalone selling price.
// not material (~1.8% on consolidated TCV).
// ============================================================================

const amd002Lines: ScheduleLine[] = [
  // commit unchanged from amd_001 baseline
  ...amd001Lines.map(l => ({
    ...l,
    id: l.id.replace("amd001", "amd002_commit"),
    oldCents: l.newCents,
    newCents: l.newCents,
  })),
  // premium support new line: jun-dec at $3,000/mo, old=$0
  ...["2025-06", "2025-07", "2025-08", "2025-09", "2025-10", "2025-11", "2025-12"].map((p, i) =>
    line(
      `sch_amd002_${p}_premium`,
      p,
      "premium-support",
      0,
      300_000,
      "cl_premium_new",
      "m_premium_hours",
      `inv_${p}_002`,
      "Premium Support (standalone PO)"
    )
  ),
];

const amd002: Amendment = {
  id: "amd_002",
  number: 2,
  effectiveDate: "2025-06-01",
  shortTitle: "Add Premium Support SKU",
  description: "Acme adds a Premium Support package at $3,000 / month for the remaining seven periods of the term. Pricing reflects standalone selling price; scope adds a distinct PO with no economic interaction with the original Data Platform PO. Treated as a separate contract under 25-12.",
  treatment: "separate-contract",
  pattern: "allocation-reshuffle",
  clauseChanges: [
    {
      clauseId: "cl_po",
      before: "Single PO: Acme Data Platform access",
      after: "Two POs: Acme Data Platform access; Acme Premium Support (added 2025-06-01)",
      changedFields: ["performance-obligation", "scope"],
    },
    {
      clauseId: "cl_premium_new",
      before: "(no clause)",
      after: "Premium Support: $3,000 / month, beginning 2025-06-01, prorated for 7 remaining periods, $21,000 incremental TCV",
      changedFields: ["transaction-price", "scope"],
    },
  ],
  scheduleLines: amd002Lines,
  cumulativeCatchupCents: 0,
  totalContractValueOldCents: 115_733_333,
  totalContractValueNewCents: 117_833_333,
  recognizedToDateOldCents: 49_733_333,
  recognizedToDateNewCents: 49_733_333,
  citePrimary: "ASC 606-10-25-12",
  computedBy: {
    appVersion: "diff@0.1.0",
    promptVersion: "memo-prompt-v3",
    modelVersion: "gemini-3-flash-preview",
    computedAt: "2025-06-01T08:20:00Z",
    inputHash: "sha256:b2c4f071",
  },
  memo: [
    {
      id: "mv_amd002_v1",
      version: 1,
      source: "generated",
      authorLabel: "gemini-3-flash-preview",
      modelVersion: "gemini-3-flash-preview",
      promptVersion: "memo-prompt-v3",
      inputPayloadHash: "sha256:b2c4f071",
      priorVersionId: null,
      createdAt: "2025-06-01T08:20:00Z",
      body: {
        facts:
          "Effective 2025-06-01, Acme added a Premium Support SKU at $3,000 per month for the remaining seven periods of the term, contributing $21,000 of incremental contract value. The Premium Support deliverable is a distinct service independent from the Data Platform access obligation.",
        treatmentDetermination:
          "Both criteria of 25-12 are satisfied: the amendment increases scope by adding a distinct service,[1] and the price increase reflects the standalone selling price of $3,000 per month established in the Premium Support price list.[2] The amendment is accounted for as a separate contract; the original Data Platform contract is not modified, no transaction price reallocation across performance obligations is required.",
        revenueScheduleImpact:
          "The Data Platform recognition schedule is unchanged from the post-amendment-1 baseline. A new schedule of $3,000 per month is added for periods 2025-06 through 2025-12, recognized straight-line over the seven-period span of the Premium Support PO.",
        materialityAssessment:
          "Consolidated TCV moves from $1.16 million to $1.18 million, a change of $21,000 or 1.8%. The change is below the 5% materiality flag threshold and is non-disruptive to the original Data Platform schedule.",
        citations: [
          { marker: 1, cite: "ASC 606-10-25-12(a)" },
          { marker: 2, cite: "ASC 606-10-25-12(b)" },
        ],
      },
    },
  ],
};

// ============================================================================
// AMENDMENT 3 — backdated quantity true-up (modification, cumulative catch-up)
// effective 2025-09-15, retroactive. Meter calibration error revealed +$7,500/mo
// of overage that should have been recognized in periods 2025-01 through 2025-08.
// MATERIAL (7.6% of post-amd_002 TCV).
// ============================================================================

const amd003BaselineCommit = amd001Lines.map(l => l.newCents);
const amd003BaselinePremium = (period: string) =>
  ["2025-06", "2025-07", "2025-08", "2025-09", "2025-10", "2025-11", "2025-12"].includes(period) ? 300_000 : 0;

const amd003Lines: ScheduleLine[] = [
  ...PERIODS_2025.flatMap((p, i) => [
    line(
      `sch_amd003_${p}_commit`,
      p,
      "commit",
      amd003BaselineCommit[i],
      amd003BaselineCommit[i],
      "cl_tprice",
      null,
      `inv_${p}_001`
    ),
    line(
      `sch_amd003_${p}_overage`,
      p,
      "overage",
      0,
      750_000,
      "cl_overage",
      "m_query_units",
      `inv_${p}_overage`
    ),
    line(
      `sch_amd003_${p}_premium`,
      p,
      "premium-support",
      amd003BaselinePremium(p),
      amd003BaselinePremium(p),
      "cl_premium_new",
      "m_premium_hours",
      `inv_${p}_002`,
      "Premium Support"
    ),
  ]),
];

const amd003: Amendment = {
  id: "amd_003",
  number: 3,
  effectiveDate: "2025-09-15",
  shortTitle: "Backdated quantity true-up",
  description: "Meter calibration audit on 2025-09-12 revealed Acme query volume was understated by ~75,000 units / month for 2025-01 through 2025-08. Amendment adjusts the meter and bills the prior overage retroactively at the contractual $0.10 / unit rate. Remaining services are not distinct from those already transferred; modification is accounted for as if part of the existing contract per 25-13(a) with cumulative catch-up.",
  treatment: "modification",
  pattern: "cumulative-catchup",
  clauseChanges: [
    {
      clauseId: "cl_overage",
      before: "$0.10 per query unit above commit-equivalent volume",
      after: "$0.10 per query unit above commit-equivalent volume; meter restated effective 2025-01-01 per Schedule M-3 calibration report 2025-09-12",
      changedFields: ["overage", "meter"],
    },
  ],
  scheduleLines: amd003Lines,
  cumulativeCatchupCents: 6_000_000,
  totalContractValueOldCents: 117_833_333,
  totalContractValueNewCents: 126_833_333,
  recognizedToDateOldCents: 81_233_333,
  recognizedToDateNewCents: 87_233_333,
  citePrimary: "ASC 606-10-25-13(a)",
  computedBy: {
    appVersion: "diff@0.1.0",
    promptVersion: "memo-prompt-v3",
    modelVersion: "gemini-3-flash-preview",
    computedAt: "2025-09-15T14:22:00Z",
    inputHash: "sha256:c91d3a5e",
  },
  memo: [
    {
      id: "mv_amd003_v1",
      version: 1,
      source: "generated",
      authorLabel: "gemini-3-flash-preview",
      modelVersion: "gemini-3-flash-preview",
      promptVersion: "memo-prompt-v3",
      inputPayloadHash: "sha256:c91d3a5e",
      priorVersionId: null,
      createdAt: "2025-09-15T14:22:00Z",
      body: {
        facts:
          "Schedule M-3 calibration report dated 2025-09-12 identified a 30% understatement of Acme query units in periods 2025-01 through 2025-08. Restated volume yields $7,500 per period of overage that should have been recognized at the contractual $0.10 / unit rate. The amendment effective 2025-09-15 corrects the meter prospectively and bills the eight-period retroactive amount of $60,000 in cumulative catch-up.",
        treatmentDetermination:
          "The remaining services are not distinct from those already transferred; the corrected metering applies uniformly across the contract term. The amendment is accounted for as if part of the existing contract per 25-13(a),[1] requiring a cumulative catch-up adjustment to revenue at the modification date for prior periods.",
        revenueScheduleImpact:
          "A cumulative catch-up of $60,000 is recognized in 2025-09 covering the 2025-01 through 2025-08 understatement. Periods 2025-09 through 2025-12 also recognize $7,500 per period of corrected overage prospectively. Recognized-to-date through 2025-09-30 moves from $812,333 to $872,333.",
        materialityAssessment:
          "Absolute change in TCV is $90,000, representing 7.6% of the post-amendment-2 TCV of $1.18 million. This exceeds the 5% materiality threshold and triggers the materiality flag. Disclosure required in the 2025-Q3 contract activity memo and on the auditor PBC list. No SEC restatement risk; correction is within the same fiscal year and reflects a billing-side metering error, not a revenue-recognition policy change.",
        citations: [{ marker: 1, cite: "ASC 606-10-25-13(a)" }],
      },
    },
    {
      id: "mv_amd003_v2",
      version: 2,
      source: "human-edit",
      authorLabel: "m.abrar (Controller)",
      priorVersionId: "mv_amd003_v1",
      createdAt: "2025-09-15T16:08:00Z",
      body: {
        facts:
          "Schedule M-3 calibration report dated 2025-09-12 (issued by the data infrastructure team) identified a 30% understatement of Acme query units in periods 2025-01 through 2025-08. The restated volume yields $7,500 per period of overage that should have been recognized at the contractual $0.10 / unit rate. The amendment effective 2025-09-15 corrects the meter prospectively and bills the eight-period retroactive amount of $60,000 in cumulative catch-up.",
        treatmentDetermination:
          "The remaining services are not distinct from those already transferred to the customer; the corrected metering applies uniformly across the entire contract term. The amendment is accounted for as if it were part of the existing contract per 25-13(a),[1] requiring a cumulative catch-up adjustment to revenue at the modification date for prior periods. The billing correction is not a change in estimate under ASC 250 because the underlying contract right was always present; only the meter measurement was understated.",
        revenueScheduleImpact:
          "A cumulative catch-up of $60,000 is recognized in 2025-09 covering the 2025-01 through 2025-08 understatement. Periods 2025-09 through 2025-12 also recognize $7,500 per period of corrected overage prospectively. Recognized-to-date through 2025-09-30 moves from $812,333 to $872,333.",
        materialityAssessment:
          "Absolute change in TCV is $90,000, representing 7.6% of the post-amendment-2 TCV of $1.18 million. This exceeds the 5% materiality threshold and triggers the materiality flag. Disclosure is required in the 2025-Q3 contract activity memo and on the auditor PBC list. No SEC restatement risk: the correction is within the same fiscal year and reflects a billing-side metering error, not a revenue-recognition policy change. ITGC review of the meter calibration control is recommended as a follow-up.",
        citations: [{ marker: 1, cite: "ASC 606-10-25-13(a)" }],
      },
    },
    {
      id: "mv_amd003_v3",
      version: 3,
      source: "generated",
      authorLabel: "gemini-3-flash-preview",
      modelVersion: "gemini-3-flash-preview",
      promptVersion: "memo-prompt-v3",
      inputPayloadHash: "sha256:c91d3a5e-r1",
      priorVersionId: "mv_amd003_v2",
      createdAt: "2025-09-16T09:14:00Z",
      body: {
        facts:
          "Schedule M-3 calibration report dated 2025-09-12 documented a 30% understatement of Acme query units across periods 2025-01 through 2025-08. Restated volume yields $7,500 per period of incremental overage at the contractual $0.10 / unit rate. The amendment effective 2025-09-15 corrects the meter prospectively and recognizes the eight-period retroactive amount of $60,000 as a cumulative catch-up.",
        treatmentDetermination:
          "Remaining services are not distinct from those already transferred; the corrected metering applies uniformly to the contract term. The modification is accounted for as if part of the existing contract per 25-13(a),[1] with cumulative catch-up at the modification date. The billing correction is not a change in estimate under ASC 250 because the contractual right to overage was unchanged: only the meter measurement was understated.",
        revenueScheduleImpact:
          "A $60,000 cumulative catch-up is recognized in 2025-09. Periods 2025-09 through 2025-12 each recognize an additional $7,500 of corrected overage. Recognized-to-date through 2025-09-30 moves from $812,333 to $872,333; full-period TCV moves from $1.18 million to $1.27 million.",
        materialityAssessment:
          "Δ TCV of $90,000 represents 7.6% of the prior baseline of $1.18 million, exceeding the 5% materiality threshold. Disclosure is required in 2025-Q3 contract activity and on the auditor PBC list. ITGC review of the meter calibration control is recommended as a follow-up. No SEC restatement risk; the correction is within the fiscal year and is a metering error, not a revenue policy change.",
        citations: [{ marker: 1, cite: "ASC 606-10-25-13(a)" }],
      },
    },
  ],
};

// ============================================================================
// AMENDMENT 4 — renewal with extension (termination + new contract)
// effective 2025-11-01. Original 2-month stub terminated; new 12-month contract
// (2025-11-01 → 2026-10-31) at $110k/mo commit + $7,500 overage + $3,000 premium.
// MATERIAL (97% on consolidated TCV including extension horizon).
// ============================================================================

const amd004Lines: ScheduleLine[] = [
  // jan-oct unchanged from amd_003 baseline
  ...PERIODS_2025.slice(0, 10).flatMap((p, i) => [
    line(
      `sch_amd004_${p}_commit`,
      p,
      "commit",
      amd003BaselineCommit[i],
      amd003BaselineCommit[i],
      "cl_tprice",
      null,
      `inv_${p}_001`
    ),
    line(
      `sch_amd004_${p}_overage`,
      p,
      "overage",
      750_000,
      750_000,
      "cl_overage",
      "m_query_units",
      `inv_${p}_overage`
    ),
    line(
      `sch_amd004_${p}_premium`,
      p,
      "premium-support",
      amd003BaselinePremium(p),
      amd003BaselinePremium(p),
      "cl_premium_new",
      "m_premium_hours",
      `inv_${p}_002`,
      "Premium Support"
    ),
  ]),
  // nov + dec: terminated stub replaced with new contract terms
  ...["2025-11", "2025-12"].map(p =>
    line(
      `sch_amd004_${p}_renewal_stub`,
      p,
      "renewal-stub",
      9_500_000,
      0,
      "cl_tprice",
      null,
      null,
      "Acme Data Platform (terminated stub)"
    )
  ),
  ...["2025-11", "2025-12"].map(p =>
    line(
      `sch_amd004_${p}_renewal_new`,
      p,
      "renewal-new",
      0,
      11_000_000,
      "cl_renewal_new",
      null,
      `inv_${p}_renewal`,
      "Acme Data Platform (renewal term)"
    )
  ),
  ...["2025-11", "2025-12"].map(p =>
    line(
      `sch_amd004_${p}_overage_renewal`,
      p,
      "overage",
      750_000,
      750_000,
      "cl_overage",
      "m_query_units",
      `inv_${p}_overage`
    )
  ),
  ...["2025-11", "2025-12"].map(p =>
    line(
      `sch_amd004_${p}_premium_renewal`,
      p,
      "premium-support",
      300_000,
      300_000,
      "cl_premium_new",
      "m_premium_hours",
      `inv_${p}_002`,
      "Premium Support"
    )
  ),
];

const amd004: Amendment = {
  id: "amd_004",
  number: 4,
  effectiveDate: "2025-11-01",
  shortTitle: "Renewal with extension",
  description: "Acme executes a 12-month renewal effective 2025-11-01 through 2026-10-31. Renewal commit increases to $110,000 per month and consolidates Premium Support and corrected overage into a single new agreement. Remaining 2-month stub of the original contract is terminated; new contract terms apply prospectively. Term-combination test failed: combined consideration is not at standalone selling price, so termination + new contract treatment per 25-13(c) applies.",
  treatment: "termination-new-contract",
  pattern: "prospective",
  clauseChanges: [
    {
      clauseId: "cl_term",
      before: "12 months, 2025-01-01 through 2025-12-31",
      after: "Original term terminated 2025-10-31; renewal term 2025-11-01 through 2026-10-31 (12 months)",
      changedFields: ["term", "end-date"],
    },
    {
      clauseId: "cl_tprice",
      before: "$1.16 million (Jan–Mar at $100,000; Apr blended at $97,333; May–Dec at $95,000)",
      after: "Stub Nov-Dec terminated; renewal term commit $110,000 / month × 12 months = $1.32 million + Premium Support $36,000 + estimated overage $90,000",
      changedFields: ["transaction-price", "monthly-rate"],
    },
  ],
  scheduleLines: amd004Lines,
  cumulativeCatchupCents: 0,
  totalContractValueOldCents: 126_833_333,
  totalContractValueNewCents: 250_333_333,
  recognizedToDateOldCents: 109_233_333,
  recognizedToDateNewCents: 109_233_333,
  citePrimary: "ASC 606-10-25-13(c)",
  computedBy: {
    appVersion: "diff@0.1.0",
    promptVersion: "memo-prompt-v3",
    modelVersion: "gemini-3-flash-preview",
    computedAt: "2025-11-01T11:02:00Z",
    inputHash: "sha256:d83b720c",
  },
  memo: [
    {
      id: "mv_amd004_v1",
      version: 1,
      source: "generated",
      authorLabel: "gemini-3-flash-preview",
      modelVersion: "gemini-3-flash-preview",
      promptVersion: "memo-prompt-v3",
      inputPayloadHash: "sha256:d83b720c",
      priorVersionId: null,
      createdAt: "2025-11-01T11:02:00Z",
      body: {
        facts:
          "On 2025-11-01 Acme and the Company executed a renewal agreement covering 2025-11-01 through 2026-10-31. The renewal increases the monthly commit to $110,000 and consolidates Premium Support and corrected overage into a single agreement. The remaining 2-month stub of the original contract is superseded.",
        treatmentDetermination:
          "The remaining services under the original contract are not distinct from those provided under the renewal, and the renewal price does not reflect the standalone selling price of the remaining services (per the SSP analysis dated 2025-10-28). The criteria of 25-12 are not met. Under 25-13(c),[1] the modification is accounted for as a termination of the existing contract and creation of a new contract; remaining unrecognized consideration from the original contract is combined with the new consideration and recognized prospectively over the new term.",
        revenueScheduleImpact:
          "Periods 2025-01 through 2025-10 are unchanged from the post-amendment-3 baseline. The 2-month stub for periods 2025-11 and 2025-12 ($95,000 commit per period) is terminated. New contract recognition begins 2025-11-01 at $110,000 commit + $7,500 overage + $3,000 Premium Support per period for the 12-month renewal term.",
        materialityAssessment:
          "Δ consolidated TCV is approximately $1.24 million, representing 97.4% of the prior baseline of $1.27 million, well above the 5% materiality threshold. Disclosure is required in the 2025-Q4 contract activity memo and on the auditor PBC list. Renewal pricing analysis (SSP study 2025-10-28) and term-combination test working paper are required attachments.",
        citations: [{ marker: 1, cite: "ASC 606-10-25-13(c)" }],
      },
    },
    {
      id: "mv_amd004_v2",
      version: 2,
      source: "human-edit",
      authorLabel: "m.abrar (Controller)",
      priorVersionId: "mv_amd004_v1",
      createdAt: "2025-11-01T15:40:00Z",
      body: {
        facts:
          "On 2025-11-01 Acme and the Company executed a renewal agreement covering the period 2025-11-01 through 2026-10-31. The renewal increases the monthly commit to $110,000 and consolidates Premium Support and corrected overage into a single new agreement. The remaining 2-month stub of the original contract (periods 2025-11 and 2025-12) is superseded by the renewal terms.",
        treatmentDetermination:
          "Per the SSP analysis dated 2025-10-28, the renewal price does not reflect standalone selling price of the remaining services; the remaining services are not distinct from those provided under the renewal. The criteria of 25-12 are not met. Under 25-13(c),[1] the modification is accounted for as a termination of the existing contract and the creation of a new contract; remaining unrecognized consideration from the original contract is combined with the new consideration and recognized prospectively over the new contract term.",
        revenueScheduleImpact:
          "Periods 2025-01 through 2025-10 are unchanged from the post-amendment-3 baseline. The 2-month stub of the original contract for periods 2025-11 and 2025-12 ($95,000 commit per period) is terminated. New contract recognition begins 2025-11-01 at $110,000 commit + $7,500 estimated overage + $3,000 Premium Support per period across the 12-month renewal term, ending 2026-10-31.",
        materialityAssessment:
          "Δ consolidated TCV is approximately $1.24 million, representing 97.4% of the prior $1.27 million baseline; well above the 5% materiality threshold. Disclosure is required in the 2025-Q4 contract activity memo and on the auditor PBC list. The SSP study (2025-10-28) and term-combination test working paper are required attachments. Renewal commission accrual schedule is amended in parallel under the related ASC 340-40 work; cross-reference workpaper RR-04 in this PBC bundle.",
        citations: [{ marker: 1, cite: "ASC 606-10-25-13(c)" }],
      },
    },
  ],
};

// ============================================================================
// CONTRACT
// ============================================================================

export const acmeContract: Contract = {
  id: "ctr_acme",
  slug: "acme",
  entity: "Acme Corp, Inc.",
  entityShort: "ACME",
  effectiveDate: "2025-01-01",
  termEnds: "2025-12-31",
  termMonths: 12,
  type: "master",
  description: "Annual data-platform commit with usage-based overage. Series-B SaaS reference scenario per PRD §4.",
  initialTcvCents: 120_000_000,
  clauses: masterClauses,
  meters,
  invoiceLines: masterInvoices,
  amendments: [amd001, amd002, amd003, amd004],
};

export const PERIODS = PERIODS_2025;

export function findAmendment(modParam: string | undefined): Amendment | null {
  if (!modParam) return null;
  const n = parseInt(modParam, 10);
  if (!Number.isFinite(n)) return null;
  return acmeContract.amendments.find(a => a.number === n) ?? null;
}
