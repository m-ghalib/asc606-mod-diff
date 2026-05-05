export type Treatment = "separate-contract" | "termination-new-contract" | "modification";
export type Pattern = "prospective" | "cumulative-catchup" | "allocation-reshuffle";

export type Period = string; // 'YYYY-MM'

export type Clause = {
  id: string; // 'cl_acme_001'
  category: "term" | "transaction-price" | "performance-obligation" | "pricing-tier" | "overage" | "billing";
  label: string;
  value: string; // human-readable rendered value
  cite: string; // ASC 606-10-XX-YY
};

export type ClauseDiff = {
  clauseId: string;
  before: string;
  after: string;
  changedFields: string[];
};

export type Meter = {
  id: string; // 'm_query_units'
  label: string;
  unit: string; // 'units', 'queries', 'GB'
};

export type InvoiceLine = {
  id: string; // 'inv_2025_03_001'
  period: Period;
  meterId: string | null;
  description: string;
  amountCents: number;
};

export type ScheduleLine = {
  id: string; // 'sch_2025_03_commit'
  period: Period;
  performanceObligation: string;
  category: "commit" | "overage" | "premium-support" | "renewal-stub" | "renewal-new";
  oldCents: number;
  newCents: number;
  // provenance
  clauseId: string;
  meterId: string | null;
  invoiceLineId: string | null;
};

export type ScheduleDelta = {
  scheduleLineId: string;
  oldCents: number;
  newCents: number;
  deltaCents: number;
  isCatchup: boolean;
};

export type MemoVersion = {
  id: string;
  version: number;
  source: "generated" | "human-edit";
  authorLabel: string;
  modelVersion?: string;
  promptVersion?: string;
  inputPayloadHash?: string;
  priorVersionId?: string | null;
  createdAt: string; // ISO
  body: MemoBody;
};

export type MemoBody = {
  facts: string;
  treatmentDetermination: string;
  revenueScheduleImpact: string;
  materialityAssessment: string;
  citations: { marker: number; cite: string; quote?: string }[];
};

export type Amendment = {
  id: string;
  number: number; // 1-4
  effectiveDate: string;
  shortTitle: string;
  description: string;
  treatment: Treatment;
  pattern: Pattern;
  clauseChanges: ClauseDiff[];
  scheduleLines: ScheduleLine[]; // 12 periods × stacked categories
  cumulativeCatchupCents: number;
  totalContractValueOldCents: number;
  totalContractValueNewCents: number;
  recognizedToDateOldCents: number;
  recognizedToDateNewCents: number;
  citePrimary: string; // ASC 606-10-25-XX
  memo: MemoVersion[];
  computedBy: {
    appVersion: string;
    promptVersion: string;
    modelVersion: string;
    computedAt: string;
    inputHash: string;
  };
};

export type Contract = {
  id: string;
  slug: string;
  entity: string;
  entityShort: string;
  effectiveDate: string;
  termEnds: string;
  termMonths: number;
  type: "master";
  description: string;
  initialTcvCents: number;
  clauses: Clause[];
  meters: Meter[];
  invoiceLines: InvoiceLine[];
  amendments: Amendment[];
};
