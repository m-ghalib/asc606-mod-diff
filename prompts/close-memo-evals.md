# Close Memo — Evaluation Rubric

How to judge a generated close memo. Score each dimension 0–2 (0 = fails, 1 = partial, 2 = passes). A memo ships at total ≥ 9/12 with no zero on any "must" dimension.

| # | Dimension | Must | What "passes" looks like |
|---|---|---|---|
| 1 | Treatment classification | yes | Names the right ASC 606-10-25 path and cites the correct paragraph from the input's `citePrimary` field. Justifies it from the supplied facts (distinct services? SSP? scope expansion?). |
| 2 | Dollar precision | yes | Every dollar figure matches the input cents exactly when converted. No rounding to "approximately" without a reason. Cumulative catch-up amount stated if present. |
| 3 | Period-by-period schedule impact | yes | Calls out which periods change and which don't. Names the exact dollar amount per period when material. References cumulative catch-up by month when present. |
| 4 | Materiality assessment | yes | Both absolute ($) and relative (% of prior baseline) stated. Compared to the 5% threshold. Disclosure requirement stated unambiguously. |
| 5 | Citation hygiene |  | Every `[n]` marker in body resolves in the `citations` array. No invented paragraph numbers. No paragraphs outside ASC 606-10-25 or the cited support docs. |
| 6 | Voice |  | Reads like a controller, not an LLM. No "Furthermore", "In conclusion", "It is important to note". No hedging ("might", "could", "possibly"). No first-person. |

## Hard fails (auto-reject regardless of score)

- Hallucinated invoice number, working paper ID, counterparty entity, or ASC paragraph not in input.
- Disagrees with the input's authoritative `treatment` field. Treatment is given; the model justifies, not classifies.
- Greeting, signoff, or addressee line.
- Reasoning visible in output (e.g., "Let me think…", "Step 1…").
- Markdown fences or any wrapper around the JSON.

## Quick test prompts

Run a regenerate on each amendment and check:

| Amendment | What the memo MUST get right |
|---|---|
| amd_001 (mid-term price reduction) | Treatment = modification under 25-13(b). Prospective. Q1 unchanged. Apr blended rate. TCV delta 3.6% (below threshold). |
| amd_002 (Premium Support SKU) | Treatment = separate contract under 25-12. New PO. Original Data Platform schedule unchanged. |
| amd_003 (backdated true-up) | Treatment = modification under 25-13(a). Cumulative catch-up of $60,000 in 2025-09. Material at 7.6%. |
| amd_004 (renewal with extension) | Treatment = termination + new contract under 25-13(c). 2-month stub terminated. Renewal term begins 2025-11-01. Material at ~97%. SSP study referenced. |

## Why this rubric exists

Two failure modes dominate LLM-generated 606 memos:

1. **Voice drift** — the model defaults to consultant-speak ("furthermore, the entity should consider…"). This makes the memo unusable in a PBC bundle and hurts the Tabs PM positioning.
2. **Treatment hallucination** — the model picks a different 606 path than the input asserts. The treatment classification is computed deterministically upstream; the model's job is justification, not re-classification.

The rubric is the eval surface. If you change `prompts/close-memo-system.md`, re-run all four amendments and re-score against this rubric before merging.
