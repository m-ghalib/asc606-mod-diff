import type { Amendment, Clause, Contract, InvoiceLine, MemoVersion, Meter, ScheduleLine } from "./types";

const PERIODS_Q1_2026 = ["2026-01", "2026-02", "2026-03"];

const meters: Meter[] = [
  { id: "m_query_units", label: "Query units", unit: "units" },
  { id: "m_premium_hours", label: "Premium support hours", unit: "hours" },
];

const masterClauses: Clause[] = [
  {
    id: "cl_term",
    category: "term",
    label: "Initial term",
    value: "3 months, 2026-01-01 through 2026-03-31",
    cite: "ASC 606-10-25-1",
  },
  {
    id: "cl_tprice",
    category: "transaction-price",
    label: "Quarterly commit",
    value: "$300,000 (straight-line $100,000 / month)",
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

const masterInvoices: InvoiceLine[] = PERIODS_Q1_2026.map((p, i) => ({
  id: `inv_${p}_001`,
  period: p,
  meterId: null,
  description: `Acme Data Platform commit (period ${i + 1} of 3)`,
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
// effective 2026-01-15. monthly commit drops from $100,000 to $95,000.
// not material (~4.2% of TCV).
// ============================================================================

const amd001Lines: ScheduleLine[] = [
  // jan blended: 14/31 at $100k + 17/31 at $95k = $45,161.29 + $52,096.77 = $97,258.06
  line("sch_amd001_2026-01_commit", "2026-01", "commit", 10_000_000, 9_725_806, "cl_tprice", null, "inv_2026-01_001"),
  // feb-mar at $95k
  line("sch_amd001_2026-02_commit", "2026-02", "commit", 10_000_000, 9_500_000, "cl_tprice", null, "inv_2026-02_001"),
  line("sch_amd001_2026-03_commit", "2026-03", "commit", 10_000_000, 9_500_000, "cl_tprice", null, "inv_2026-03_001"),
];

const amd001: Amendment = {
  id: "amd_001",
  number: 1,
  effectiveDate: "2026-01-15",
  shortTitle: "Mid-term price reduction",
  description: "Acme requested a goodwill price concession on the Data Platform commit, dropping the monthly rate from $100,000 to $95,000 starting 2026-01-15. The remaining services are distinct from those already transferred, so the modification is treated prospectively per 25-13(b).",
  treatment: "modification",
  pattern: "prospective",
  clauseChanges: [
    {
      clauseId: "cl_tprice",
      before: "$300,000 (straight-line $100,000 / month)",
      after: "$287,258 (Jan blended at $97,258; Feb–Mar at $95,000)",
      changedFields: ["transaction-price", "monthly-rate"],
    },
  ],
  scheduleLines: amd001Lines,
  cumulativeCatchupCents: 0,
  totalContractValueOldCents: 30_000_000,
  totalContractValueNewCents: 28_725_806,
  recognizedToDateOldCents: 0,
  recognizedToDateNewCents: 0,
  citePrimary: "ASC 606-10-25-13(b)",
  computedBy: {
    appVersion: "diff@0.1.0",
    promptVersion: "memo-prompt-v3",
    modelVersion: "gemini-3-flash-preview",
    computedAt: "2026-01-15T09:14:00Z",
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
      createdAt: "2026-01-15T09:14:00Z",
      body: {
        facts:
          "Effective 2026-01-15, Acme Corp and the Company executed an amendment reducing the monthly Data Platform commit from $100,000 to $95,000 for the remaining contractual term. The amendment was signed mid-January 2026, before any full period had closed. Total contract value declines from $300,000 to $287,258, a reduction of $12,742 (4.2% of original TCV).",
        treatmentDetermination:
          "The amendment does not add distinct goods or services and does not reflect standalone selling prices, so separate-contract treatment under 25-12 does not apply.[1] The remaining services are distinct from those already transferred to the customer through 2026-01-14, satisfying 25-13(b);[2] accordingly the modification is accounted for as a change in transaction price for the remaining performance obligations on a prospective basis. No revision of revenue recognized in prior periods is required.",
        revenueScheduleImpact:
          "Period 2026-01 reflects a blended rate of $97,258 (14 days at $100,000, 17 days at $95,000). Periods 2026-02 and 2026-03 recognize $95,000 per month.",
        materialityAssessment:
          "The absolute change in TCV of $12,742 represents 4.2% of the original $300,000 commitment. This falls below the 5% threshold for the materiality flag and does not trigger restatement of any prior period. The change will be disclosed in the next quarterly contract activity summary.",
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
// effective 2026-02-01. Premium Support added at $3,000/mo standalone selling price.
// not material (~2.1% on consolidated TCV).
// ============================================================================

const amd002Lines: ScheduleLine[] = [
  // commit unchanged from amd_001 baseline
  ...amd001Lines.map(l => ({
    ...l,
    id: l.id.replace("amd001", "amd002_commit"),
    oldCents: l.newCents,
    newCents: l.newCents,
  })),
  // premium support new line: feb-mar at $3,000/mo, old=$0
  ...["2026-02", "2026-03"].map((p) =>
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
  effectiveDate: "2026-02-01",
  shortTitle: "Add Premium Support SKU",
  description: "Acme adds a Premium Support package at $3,000 / month for the remaining two periods of the term. Pricing reflects standalone selling price; scope adds a distinct PO with no economic interaction with the original Data Platform PO. Treated as a separate contract under 25-12.",
  treatment: "separate-contract",
  pattern: "allocation-reshuffle",
  clauseChanges: [
    {
      clauseId: "cl_po",
      before: "Single PO: Acme Data Platform access",
      after: "Two POs: Acme Data Platform access; Acme Premium Support (added 2026-02-01)",
      changedFields: ["performance-obligation", "scope"],
    },
    {
      clauseId: "cl_premium_new",
      before: "(no clause)",
      after: "Premium Support: $3,000 / month, beginning 2026-02-01, prorated for 2 remaining periods, $6,000 incremental TCV",
      changedFields: ["transaction-price", "scope"],
    },
  ],
  scheduleLines: amd002Lines,
  cumulativeCatchupCents: 0,
  totalContractValueOldCents: 28_725_806,
  totalContractValueNewCents: 29_325_806,
  recognizedToDateOldCents: 9_725_806,
  recognizedToDateNewCents: 9_725_806,
  citePrimary: "ASC 606-10-25-12",
  computedBy: {
    appVersion: "diff@0.1.0",
    promptVersion: "memo-prompt-v3",
    modelVersion: "gemini-3-flash-preview",
    computedAt: "2026-02-01T08:20:00Z",
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
      createdAt: "2026-02-01T08:20:00Z",
      body: {
        facts:
          "Effective 2026-02-01, Acme added a Premium Support SKU at $3,000 per month for the remaining two periods of the term, contributing $6,000 of incremental contract value. The Premium Support deliverable is a distinct service independent from the Data Platform access obligation.",
        treatmentDetermination:
          "Both criteria of 25-12 are satisfied: the amendment increases scope by adding a distinct service,[1] and the price increase reflects the standalone selling price of $3,000 per month established in the Premium Support price list.[2] The amendment is accounted for as a separate contract; the original Data Platform contract is not modified, no transaction price reallocation across performance obligations is required.",
        revenueScheduleImpact:
          "The Data Platform recognition schedule is unchanged from the post-amendment-1 baseline. A new schedule of $3,000 per month is added for periods 2026-02 and 2026-03, recognized straight-line over the two-period span of the Premium Support PO.",
        materialityAssessment:
          "Consolidated TCV moves from $287,258 to $293,258, a change of $6,000 or 2.1%. The change is below the 5% materiality flag threshold and is non-disruptive to the original Data Platform schedule.",
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
// effective 2026-03-01, retroactive. Meter calibration error revealed +$7,500/mo
// of overage that should have been recognized in periods 2026-01 through 2026-02.
// MATERIAL (7.7% of post-amd_002 TCV).
// ============================================================================

const amd003BaselineCommit = amd001Lines.map(l => l.newCents);
const amd003BaselinePremium = (period: string) =>
  ["2026-02", "2026-03"].includes(period) ? 300_000 : 0;

const amd003Lines: ScheduleLine[] = [
  ...PERIODS_Q1_2026.flatMap((p, i) => [
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
  effectiveDate: "2026-03-01",
  shortTitle: "Backdated quantity true-up",
  description: "Meter calibration audit on 2026-02-26 revealed Acme query volume was understated by ~75,000 units / month for 2026-01 through 2026-02. Amendment adjusts the meter and bills the prior overage retroactively at the contractual $0.10 / unit rate. Remaining services are not distinct from those already transferred; modification is accounted for as if part of the existing contract per 25-13(a) with cumulative catch-up.",
  treatment: "modification",
  pattern: "cumulative-catchup",
  clauseChanges: [
    {
      clauseId: "cl_overage",
      before: "$0.10 per query unit above commit-equivalent volume",
      after: "$0.10 per query unit above commit-equivalent volume; meter restated effective 2026-01-01 per Schedule M-3 calibration report 2026-02-26",
      changedFields: ["overage", "meter"],
    },
  ],
  scheduleLines: amd003Lines,
  cumulativeCatchupCents: 1_500_000,
  totalContractValueOldCents: 29_325_806,
  totalContractValueNewCents: 31_575_806,
  recognizedToDateOldCents: 19_525_806,
  recognizedToDateNewCents: 21_025_806,
  citePrimary: "ASC 606-10-25-13(a)",
  computedBy: {
    appVersion: "diff@0.1.0",
    promptVersion: "memo-prompt-v3",
    modelVersion: "gemini-3-flash-preview",
    computedAt: "2026-03-01T14:22:00Z",
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
      createdAt: "2026-03-01T14:22:00Z",
      body: {
        facts:
          "Schedule M-3 calibration report dated 2026-02-26 identified a 30% understatement of Acme query units in periods 2026-01 through 2026-02. Restated volume yields $7,500 per period of overage that should have been recognized at the contractual $0.10 / unit rate. The amendment effective 2026-03-01 corrects the meter prospectively and bills the two-period retroactive amount of $15,000 in cumulative catch-up.",
        treatmentDetermination:
          "The remaining services are not distinct from those already transferred; the corrected metering applies uniformly across the contract term. The amendment is accounted for as if part of the existing contract per 25-13(a),[1] requiring a cumulative catch-up adjustment to revenue at the modification date for prior periods.",
        revenueScheduleImpact:
          "A cumulative catch-up of $15,000 is recognized in 2026-03 covering the 2026-01 through 2026-02 understatement. Period 2026-03 also recognizes $7,500 of corrected overage prospectively. Recognized-to-date through 2026-03-31 moves from $293,258 to $315,758.",
        materialityAssessment:
          "Absolute change in TCV is $22,500, representing 7.7% of the post-amendment-2 TCV of $293,258. This exceeds the 5% materiality threshold and triggers the materiality flag. Disclosure required in the 2026-Q1 contract activity memo and on the auditor PBC list. No SEC restatement risk; correction is within the same fiscal year and reflects a billing-side metering error, not a revenue-recognition policy change.",
        citations: [{ marker: 1, cite: "ASC 606-10-25-13(a)" }],
      },
    },
    {
      id: "mv_amd003_v2",
      version: 2,
      source: "human-edit",
      authorLabel: "m.abrar (Controller)",
      priorVersionId: "mv_amd003_v1",
      createdAt: "2026-03-01T16:08:00Z",
      body: {
        facts:
          "Schedule M-3 calibration report dated 2026-02-26 (issued by the data infrastructure team) identified a 30% understatement of Acme query units in periods 2026-01 through 2026-02. The restated volume yields $7,500 per period of overage that should have been recognized at the contractual $0.10 / unit rate. The amendment effective 2026-03-01 corrects the meter prospectively and bills the two-period retroactive amount of $15,000 in cumulative catch-up.",
        treatmentDetermination:
          "The remaining services are not distinct from those already transferred to the customer; the corrected metering applies uniformly across the entire contract term. The amendment is accounted for as if it were part of the existing contract per 25-13(a),[1] requiring a cumulative catch-up adjustment to revenue at the modification date for prior periods. The billing correction is not a change in estimate under ASC 250 because the underlying contract right was always present; only the meter measurement was understated.",
        revenueScheduleImpact:
          "A cumulative catch-up of $15,000 is recognized in 2026-03 covering the 2026-01 through 2026-02 understatement. Period 2026-03 also recognizes $7,500 of corrected overage prospectively. Recognized-to-date through 2026-03-31 moves from $293,258 to $315,758.",
        materialityAssessment:
          "Absolute change in TCV is $22,500, representing 7.7% of the post-amendment-2 TCV of $293,258. This exceeds the 5% materiality threshold and triggers the materiality flag. Disclosure is required in the 2026-Q1 contract activity memo and on the auditor PBC list. No SEC restatement risk: the correction is within the same fiscal year and reflects a billing-side metering error, not a revenue-recognition policy change. ITGC review of the meter calibration control is recommended as a follow-up.",
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
      createdAt: "2026-03-02T09:14:00Z",
      body: {
        facts:
          "Schedule M-3 calibration report dated 2026-02-26 documented a 30% understatement of Acme query units across periods 2026-01 through 2026-02. Restated volume yields $7,500 per period of incremental overage at the contractual $0.10 / unit rate. The amendment effective 2026-03-01 corrects the meter prospectively and recognizes the two-period retroactive amount of $15,000 as a cumulative catch-up.",
        treatmentDetermination:
          "Remaining services are not distinct from those already transferred; the corrected metering applies uniformly to the contract term. The modification is accounted for as if part of the existing contract per 25-13(a),[1] with cumulative catch-up at the modification date. The billing correction is not a change in estimate under ASC 250 because the contractual right to overage was unchanged: only the meter measurement was understated.",
        revenueScheduleImpact:
          "A $15,000 cumulative catch-up is recognized in 2026-03. Period 2026-03 also recognizes an additional $7,500 of corrected overage. Recognized-to-date through 2026-03-31 moves from $293,258 to $315,758; full-period TCV moves from $293,258 to $315,758.",
        materialityAssessment:
          "Δ TCV of $22,500 represents 7.7% of the prior baseline of $293,258, exceeding the 5% materiality threshold. Disclosure is required in 2026-Q1 contract activity and on the auditor PBC list. ITGC review of the meter calibration control is recommended as a follow-up. No SEC restatement risk; the correction is within the fiscal year and is a metering error, not a revenue policy change.",
        citations: [{ marker: 1, cite: "ASC 606-10-25-13(a)" }],
      },
    },
  ],
};

// ============================================================================
// AMENDMENT 4 — renewal with extension (termination + new contract)
// effective 2026-03-15. Original term terminated 2026-03-14; new 12-month contract
// (2026-03-15 → 2027-03-14) at $110k/mo commit + $7,500 overage + $3,000 premium.
// MATERIAL (~440% on consolidated TCV including extension horizon).
// ============================================================================

const amd004Lines: ScheduleLine[] = [
  // jan + feb unchanged from amd_003 baseline
  ...PERIODS_Q1_2026.slice(0, 2).flatMap((p, i) => [
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
  // mar 2026: original term terminated 2026-03-14 (14/31 of month at original $95k = $42,903 still recognized);
  //           renewal runs 2026-03-15 onward (17/31 of march at new $110k = $60,323).
  line(
    "sch_amd004_2026-03_renewal_stub",
    "2026-03",
    "renewal-stub",
    9_500_000,
    4_290_323,
    "cl_tprice",
    null,
    "inv_2026-03_001",
    "Acme Data Platform (terminated stub)"
  ),
  line(
    "sch_amd004_2026-03_renewal_new",
    "2026-03",
    "renewal-new",
    0,
    6_032_258,
    "cl_renewal_new",
    null,
    "inv_2026-03_renewal",
    "Acme Data Platform (renewal term)"
  ),
  line(
    "sch_amd004_2026-03_overage_renewal",
    "2026-03",
    "overage",
    750_000,
    750_000,
    "cl_overage",
    "m_query_units",
    "inv_2026-03_overage"
  ),
  line(
    "sch_amd004_2026-03_premium_renewal",
    "2026-03",
    "premium-support",
    300_000,
    300_000,
    "cl_premium_new",
    "m_premium_hours",
    "inv_2026-03_002",
    "Premium Support"
  ),
];

const amd004: Amendment = {
  id: "amd_004",
  number: 4,
  effectiveDate: "2026-03-15",
  shortTitle: "Renewal with extension",
  description: "Acme executes a 12-month renewal effective 2026-03-15 through 2027-03-14. Renewal commit increases to $110,000 per month and consolidates Premium Support and corrected overage into a single new agreement. Remaining 17 days of the original-term March are terminated; new contract terms apply prospectively. Term-combination test failed: combined consideration is not at standalone selling price, so termination + new contract treatment per 25-13(c) applies.",
  treatment: "termination-new-contract",
  pattern: "prospective",
  clauseChanges: [
    {
      clauseId: "cl_term",
      before: "3 months, 2026-01-01 through 2026-03-31",
      after: "Original term terminated 2026-03-14; renewal term 2026-03-15 through 2027-03-14 (12 months)",
      changedFields: ["term", "end-date"],
    },
    {
      clauseId: "cl_tprice",
      before: "$287,258 (Jan blended at $97,258; Feb–Mar at $95,000)",
      after: "Stub Mar 15-31 terminated; renewal term commit $110,000 / month × 12 months = $1,320,000 + Premium Support $36,000 + estimated overage $90,000",
      changedFields: ["transaction-price", "monthly-rate"],
    },
  ],
  scheduleLines: amd004Lines,
  cumulativeCatchupCents: 0,
  totalContractValueOldCents: 31_575_806,
  totalContractValueNewCents: 170_390_300,
  recognizedToDateOldCents: 25_790_300,
  recognizedToDateNewCents: 25_790_300,
  citePrimary: "ASC 606-10-25-13(c)",
  computedBy: {
    appVersion: "diff@0.1.0",
    promptVersion: "memo-prompt-v3",
    modelVersion: "gemini-3-flash-preview",
    computedAt: "2026-03-15T11:02:00Z",
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
      createdAt: "2026-03-15T11:02:00Z",
      body: {
        facts:
          "On 2026-03-15 Acme and the Company executed a renewal agreement covering 2026-03-15 through 2027-03-14. The renewal increases the monthly commit to $110,000 and consolidates Premium Support and corrected overage into a single agreement. The remaining 17 days of the original-term March are superseded.",
        treatmentDetermination:
          "The remaining services under the original contract are not distinct from those provided under the renewal, and the renewal price does not reflect the standalone selling price of the remaining services (per the SSP analysis dated 2026-03-10). The criteria of 25-12 are not met. Under 25-13(c),[1] the modification is accounted for as a termination of the existing contract and creation of a new contract; remaining unrecognized consideration from the original contract is combined with the new consideration and recognized prospectively over the new term.",
        revenueScheduleImpact:
          "Periods 2026-01 and 2026-02 are unchanged from the post-amendment-3 baseline. The 17-day stub of original-term March (2026-03-15 through 2026-03-31, $52,097 commit at $95,000 monthly equivalent) is terminated. New contract recognition begins 2026-03-15 at $110,000 commit + $7,500 overage + $3,000 Premium Support per period for the 12-month renewal term ending 2027-03-14.",
        materialityAssessment:
          "Δ consolidated TCV is approximately $1.39 million, representing 440% of the prior baseline of $315,758, well above the 5% materiality threshold. Disclosure is required in the 2026-Q1 contract activity memo and on the auditor PBC list. Renewal pricing analysis (SSP study 2026-03-10) and term-combination test working paper are required attachments.",
        citations: [{ marker: 1, cite: "ASC 606-10-25-13(c)" }],
      },
    },
    {
      id: "mv_amd004_v2",
      version: 2,
      source: "human-edit",
      authorLabel: "m.abrar (Controller)",
      priorVersionId: "mv_amd004_v1",
      createdAt: "2026-03-15T15:40:00Z",
      body: {
        facts:
          "On 2026-03-15 Acme and the Company executed a renewal agreement covering the period 2026-03-15 through 2027-03-14. The renewal increases the monthly commit to $110,000 and consolidates Premium Support and corrected overage into a single new agreement. The remaining 17 days of the original-term March (2026-03-15 through 2026-03-31) are superseded by the renewal terms.",
        treatmentDetermination:
          "Per the SSP analysis dated 2026-03-10, the renewal price does not reflect standalone selling price of the remaining services; the remaining services are not distinct from those provided under the renewal. The criteria of 25-12 are not met. Under 25-13(c),[1] the modification is accounted for as a termination of the existing contract and the creation of a new contract; remaining unrecognized consideration from the original contract is combined with the new consideration and recognized prospectively over the new contract term.",
        revenueScheduleImpact:
          "Periods 2026-01 and 2026-02 are unchanged from the post-amendment-3 baseline. The 17-day stub of original-term March ($52,097 commit at the $95,000 monthly-equivalent rate) is terminated. New contract recognition begins 2026-03-15 at $110,000 commit + $7,500 estimated overage + $3,000 Premium Support per period across the 12-month renewal term, ending 2027-03-14.",
        materialityAssessment:
          "Δ consolidated TCV is approximately $1.39 million, representing 440% of the prior $315,758 baseline; well above the 5% materiality threshold. Disclosure is required in the 2026-Q1 contract activity memo and on the auditor PBC list. The SSP study (2026-03-10) and term-combination test working paper are required attachments. Renewal commission accrual schedule is amended in parallel under the related ASC 340-40 work; cross-reference workpaper RR-04 in this PBC bundle.",
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
  effectiveDate: "2026-01-01",
  termEnds: "2026-03-31",
  termMonths: 3,
  type: "master",
  description: "Quarterly data-platform commit with usage-based overage. Series-B SaaS reference scenario per PRD §4.",
  initialTcvCents: 30_000_000,
  clauses: masterClauses,
  meters,
  invoiceLines: masterInvoices,
  amendments: [amd001, amd002, amd003, amd004],
};

export const PERIODS = PERIODS_Q1_2026;

export function findAmendment(modParam: string | undefined): Amendment | null {
  if (!modParam) return null;
  const n = parseInt(modParam, 10);
  if (!Number.isFinite(n)) return null;
  return acmeContract.amendments.find(a => a.number === n) ?? null;
}
