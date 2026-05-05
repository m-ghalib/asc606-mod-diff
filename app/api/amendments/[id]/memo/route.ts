import { NextResponse } from "next/server";
import { acmeContract } from "@/lib/gold-contract";
import { generateMemoBody, MODEL_VERSION, PROMPT_VERSION } from "@/lib/gemini";
import type { MemoVersion } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const amendment = acmeContract.amendments.find(a => a.id === id);
  if (!amendment) {
    return NextResponse.json({ error: "amendment not found" }, { status: 404 });
  }

  const hint = (await req.json().catch(() => null)) as
    | { nextVersion?: unknown; priorVersionId?: unknown }
    | null;

  let body;
  try {
    body = await generateMemoBody(amendment, acmeContract);
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const seedLatest = amendment.memo
    .slice()
    .sort((a, b) => b.version - a.version)[0];
  const hintedVersion =
    typeof hint?.nextVersion === "number" &&
    Number.isInteger(hint.nextVersion) &&
    hint.nextVersion > 0
      ? hint.nextVersion
      : null;
  const nextVersion = hintedVersion ?? (seedLatest?.version ?? 0) + 1;
  const priorVersionId =
    typeof hint?.priorVersionId === "string" || hint?.priorVersionId === null
      ? (hint.priorVersionId as string | null)
      : seedLatest?.id ?? null;

  const memoVersion: MemoVersion = {
    id: `mv_${amendment.id}_v${nextVersion}_${Date.now().toString(36)}`,
    version: nextVersion,
    source: "generated",
    authorLabel: MODEL_VERSION,
    modelVersion: MODEL_VERSION,
    promptVersion: PROMPT_VERSION,
    priorVersionId,
    createdAt: new Date().toISOString(),
    body,
  };

  return NextResponse.json(memoVersion);
}
