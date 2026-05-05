"use client";

export function MemoResetButton({ amendmentId }: { amendmentId: string }) {
  function handleReset() {
    try {
      window.localStorage.removeItem(`tabs-cd:memos:${amendmentId}`);
    } catch {
      // localStorage unavailable (e.g. private mode); the event still fires
      // so in-memory state can reset.
    }
    window.dispatchEvent(
      new CustomEvent("tabs-cd:memos:reset", { detail: { amendmentId } }),
    );
  }

  return (
    <button
      type="button"
      onClick={handleReset}
      style={{
        height: 32,
        padding: "0 12px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
        fontWeight: 500,
        color: "var(--ink-2)",
        borderRadius: 8,
        border: "1px solid var(--border)",
        background: "var(--surface)",
        cursor: "pointer",
      }}
    >
      Reset
    </button>
  );
}
