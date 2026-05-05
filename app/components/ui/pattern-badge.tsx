import type { Pattern } from "@/lib/types";

const labels: Record<Pattern, string> = {
  "prospective": "Prospective",
  "cumulative-catchup": "Cumulative catch-up",
  "allocation-reshuffle": "Allocation reshuffle",
};

const fg: Record<Pattern, string> = {
  "prospective": "var(--pattern-prospective)",
  "cumulative-catchup": "var(--pattern-catchup)",
  "allocation-reshuffle": "var(--pattern-reshuffle)",
};

const bg: Record<Pattern, string> = {
  "prospective": "var(--pattern-prospective-bg)",
  "cumulative-catchup": "var(--pattern-catchup-bg)",
  "allocation-reshuffle": "var(--pattern-reshuffle-bg)",
};

export function PatternBadge({ pattern, size = "md" }: { pattern: Pattern; size?: "sm" | "md" }) {
  const fs = size === "sm" ? 11 : 12;
  const py = size === "sm" ? 2 : 4;
  const px = size === "sm" ? 8 : 10;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: `${py}px ${px}px`,
        borderRadius: "var(--radius-pill)",
        background: bg[pattern],
        color: fg[pattern],
        fontSize: fs,
        fontWeight: 500,
        lineHeight: 1,
      }}
    >
      {labels[pattern]}
    </span>
  );
}
