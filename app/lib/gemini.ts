import { readFileSync } from "node:fs";
import { join } from "node:path";
import { GoogleGenAI, Type, type Schema } from "@google/genai";
import type { Amendment, Contract, MemoBody } from "./types";

export const PROMPT_VERSION = "memo-prompt-v4-gemini";
export const MODEL_VERSION = "gemini-3-flash-preview";

const SYSTEM_INSTRUCTION = readFileSync(
  join(process.cwd(), "prompts", "close-memo-system.md"),
  "utf-8",
);

const memoBodySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    facts: { type: Type.STRING },
    treatmentDetermination: { type: Type.STRING },
    revenueScheduleImpact: { type: Type.STRING },
    materialityAssessment: { type: Type.STRING },
    citations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          marker: { type: Type.INTEGER },
          cite: { type: Type.STRING },
        },
        required: ["marker", "cite"],
        propertyOrdering: ["marker", "cite"],
      },
    },
  },
  required: [
    "facts",
    "treatmentDetermination",
    "revenueScheduleImpact",
    "materialityAssessment",
    "citations",
  ],
  propertyOrdering: [
    "facts",
    "treatmentDetermination",
    "revenueScheduleImpact",
    "materialityAssessment",
    "citations",
  ],
};

export async function generateMemoBody(
  amendment: Amendment,
  contract: Contract,
): Promise<MemoBody> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const { memo: _memo, ...amendmentForModel } = amendment;
  const { amendments: _amendments, invoiceLines: _invoiceLines, ...contractForModel } = contract;

  const payload = {
    amendment: amendmentForModel,
    contract: contractForModel,
  };

  const treatmentDirective = treatmentDirectiveFor(amendment);
  const userText = `${treatmentDirective}\n\nINPUT:\n${JSON.stringify(payload, null, 2)}`;

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: MODEL_VERSION,
    contents: [{ role: "user", parts: [{ text: userText }] }],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: memoBodySchema,
      temperature: 0.2,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Gemini returned empty response");
  }

  const parsed = JSON.parse(text) as MemoBody;
  return parsed;
}

function treatmentDirectiveFor(amendment: Amendment): string {
  const phrasing: Record<Amendment["treatment"], string> = {
    "separate-contract":
      "treat the amendment as a SEPARATE CONTRACT under ASC 606-10-25-12. The original contract's revenue schedule is unchanged.",
    "termination-new-contract":
      "treat the amendment as a TERMINATION OF THE EXISTING CONTRACT and CREATION OF A NEW CONTRACT under ASC 606-10-25-13(c). Remaining consideration from the original contract combines with the new consideration and is recognized prospectively.",
    "modification":
      "treat the amendment as a MODIFICATION OF THE EXISTING CONTRACT. Do NOT describe it as a separate contract or as termination + new contract. The applicable subparagraph is given below.",
  };
  return [
    `AUTHORITATIVE TREATMENT: ${amendment.treatment}.`,
    `Citation: ${amendment.citePrimary}.`,
    `Required phrasing: ${phrasing[amendment.treatment]}`,
    `Justify this classification from the supplied facts. Do not pick a different ASC 606 path.`,
  ].join(" ");
}
