# Prompts

Prompts and evaluation rubrics for AI-generated artifacts in this app. Kept at the repo root so a reviewer can read the LLM contract without grepping through component code.

## Files

- [`close-memo-system.md`](./close-memo-system.md) — system instruction for the per-amendment ASC 606 close memo. Wired into `app/lib/gemini.ts`; bumping its content is the same as bumping the prompt version.
- [`close-memo-evals.md`](./close-memo-evals.md) — rubric for judging a generated close memo. Six scoring dimensions plus four hard-fail conditions. Per-amendment expected facts.

## How prompts are loaded

`app/lib/gemini.ts` reads `prompts/close-memo-system.md` from disk at module load via `fs.readFileSync`. No bundling, no string-in-code copy. Edit the markdown, restart the dev server, get a new prompt version.

The version label baked into each `MemoVersion` is `memo-prompt-v4-gemini`. Bump that string in `app/lib/gemini.ts` when you change the prompt content.

## Model

`gemini-3-flash-preview` via `@google/genai`. Structured JSON output via `responseSchema`. The schema lives in `app/lib/gemini.ts` and mirrors the `MemoBody` type in `app/lib/types.ts`.

## Manual eval workflow

1. `bun run dev`
2. Visit `/contracts/acme?mod=N` for N in {1,2,3,4}.
3. Click **Regenerate**. Read the new memo against `close-memo-evals.md`.
4. Score it. Anything below 9/12 or hitting a hard-fail means the prompt or model needs work.
