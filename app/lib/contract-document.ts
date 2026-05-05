export type ContractDocSection = {
  id: string;
  clauseId: string | null;
  heading: string;
  body: string[];
};

export type ContractDocument = {
  contractId: string;
  title: string;
  parties: { customer: string; vendor: string };
  effectiveDate: string;
  documentNumber: string;
  sections: ContractDocSection[];
};

export const acmeMasterDocument: ContractDocument = {
  contractId: "ctr_acme",
  title: "Master Subscription Agreement and Order Form",
  parties: {
    customer: "Acme Corporation, a Delaware corporation",
    vendor: "Conduit Data Platform, Inc., a Delaware corporation",
  },
  effectiveDate: "2026-01-01",
  documentNumber: "MSA-ACME-2026-01",
  sections: [
    {
      id: "section-recitals",
      clauseId: null,
      heading: "Recitals",
      body: [
        "This Master Subscription Agreement (the \"Agreement\") is entered into as of January 1, 2026 (the \"Effective Date\") by and between Conduit Data Platform, Inc. (\"Vendor\") and Acme Corporation (\"Customer\").",
        "Vendor operates a hosted data platform service made available on a subscription basis. Customer wishes to subscribe to the service for the term and on the commercial terms set forth in this Agreement and the Order Form attached as Exhibit A.",
        "The parties agree that the rights and obligations described below govern the entire commercial relationship between them with respect to the subject matter hereof and supersede any prior course of dealing.",
      ],
    },
    {
      id: "section-1",
      clauseId: null,
      heading: "Section 1. Definitions",
      body: [
        "\"Service\" means the Acme Data Platform hosted offering, including the analytics workspace, query engine, and supporting integrations as documented in the then-current product documentation.",
        "\"Query Unit\" means one (1) executed analytical query against the Service, measured in accordance with Vendor's standard metering rules and reported in the monthly usage statement.",
        "\"Order Form\" means the commercial schedule attached as Exhibit A or any subsequent ordering document executed by both parties referencing this Agreement.",
        "\"Renewal Term\" means any twelve (12) month period beginning immediately after expiration of the Initial Term, unless either party provides written notice of non-renewal at least sixty (60) days prior to expiration.",
      ],
    },
    {
      id: "section-2",
      clauseId: "cl_po",
      heading: "Section 2. Subscription Scope and Performance Obligation",
      body: [
        "Subject to the terms of this Agreement, Vendor will provide Customer with access to the Service for the Initial Term as a single, integrated subscription. The Service constitutes a single performance obligation under ASC 606-10-25-14: a stand-ready promise to provide continuous access to the Acme Data Platform.",
        "Customer's authorized users may submit Query Units against the Service up to the commit-equivalent volume implied by the monthly fee. Usage above that level is subject to the overage rate set forth in Section 5.",
        "Vendor will provide commercially reasonable support during business hours as part of the base subscription. Higher support tiers, if any, are governed by separate Order Forms.",
      ],
    },
    {
      id: "section-3",
      clauseId: "cl_term",
      heading: "Section 3. Term",
      body: [
        "The initial term of this Agreement (the \"Initial Term\") begins on the Effective Date of January 1, 2026 and continues for three (3) months, ending on March 31, 2026.",
        "This Agreement automatically renews for successive Renewal Terms of twelve (12) months each unless either party provides written notice of non-renewal at least sixty (60) days prior to the end of the then-current term.",
        "Either party may terminate this Agreement for material breach upon thirty (30) days' written notice if the breaching party fails to cure within that period. Termination for breach does not affect amounts already invoiced and earned through the termination date.",
      ],
    },
    {
      id: "section-4",
      clauseId: "cl_tprice",
      heading: "Section 4. Fees and Quarterly Commit",
      body: [
        "Customer agrees to pay Vendor a total subscription fee of $300,000 for the Initial Term, representing a quarterly commit for access to the Service. The quarterly commit is recognized straight-line over the three (3) month Initial Term at $100,000 per month.",
        "The quarterly commit reflects fixed consideration under ASC 606-10-32-2 and constitutes the transaction price allocated to the single performance obligation defined in Section 2 (subject to the variable-consideration provisions in Section 5).",
        "Mid-term changes to the monthly rate may be agreed by amendment and are governed by the modification provisions in Section 7. Any such amendment will identify the effective date and the prospective or cumulative-catch-up treatment.",
      ],
    },
    {
      id: "section-5",
      clauseId: "cl_overage",
      heading: "Section 5. Variable Consideration and Overage",
      body: [
        "Usage in excess of the commit-equivalent volume is billed at $0.10 per Query Unit (the \"Overage Rate\"). Overage is variable consideration under ASC 606-10-32-11 and is recognized when the underlying usage occurs and the right to the related consideration becomes unconditional.",
        "Vendor's metering system measures Query Units monthly and reports the count to Customer in the usage statement. If a metering error is identified, the parties will agree on a restated volume; any retroactive billing or revenue adjustment will be treated as a contract modification under Section 7 with cumulative catch-up where required.",
        "No constraint on variable consideration applies to the Overage Rate because the rate is fixed and the only variable input is measured Query Units, which are observable at period end.",
      ],
    },
    {
      id: "section-6",
      clauseId: "cl_billing",
      heading: "Section 6. Invoicing and Payment",
      body: [
        "Vendor will invoice Customer monthly in advance for the monthly portion of the quarterly commit. Overage, if any, will be invoiced monthly in arrears together with the next monthly commit invoice.",
        "Each invoice is payable net thirty (30) days from the invoice date. Amounts not paid when due accrue interest at the lower of one percent (1%) per month or the maximum rate permitted by law.",
        "Customer is responsible for all taxes other than those based on Vendor's net income.",
      ],
    },
    {
      id: "section-7",
      clauseId: null,
      heading: "Section 7. Modifications and Amendments",
      body: [
        "Any change to the scope, transaction price, term, or metering of the Service must be set forth in a written amendment signed by both parties. Each amendment will state its effective date and identify, where relevant, the ASC 606 modification treatment (separate contract, prospective modification, or termination of the existing contract and creation of a new contract).",
        "Amendments that add a distinct service at standalone selling price will be treated as separate contracts under ASC 606-10-25-12. Amendments that change the price of the remaining services without adding distinct services will be treated as prospective modifications under ASC 606-10-25-13(b). Amendments that revise the meter for measurement of services already transferred will be treated under ASC 606-10-25-13(a) with cumulative catch-up.",
        "Both parties acknowledge that any amendment is part of the integrated audit trail for the contract and will be cross-referenced in the Vendor's revenue recognition workpapers.",
      ],
    },
    {
      id: "section-order-form",
      clauseId: null,
      heading: "Exhibit A. Order Form (2026-01-01)",
      body: [
        "Subscription: Acme Data Platform — single performance obligation, full-platform access.",
        "Initial Term: 3 months, January 1, 2026 through March 31, 2026.",
        "Quarterly Commit: $300,000, billed at $100,000 per month, in advance, net 30.",
        "Overage Rate: $0.10 per Query Unit above commit-equivalent volume; billed monthly in arrears.",
        "Authorized Users: as set forth in Customer's user provisioning portal; no per-seat fee under the Initial Term.",
        "Premium Support and other higher service tiers: not included in the Initial Term; available by separate Order Form.",
      ],
    },
  ],
};
