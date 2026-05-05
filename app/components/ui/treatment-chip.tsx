import type { Treatment } from "@/lib/types";

const labels: Record<Treatment, string> = {
  "separate-contract": "Separate contract",
  "termination-new-contract": "Termination + new",
  "modification": "Modification",
};

const fg: Record<Treatment, string> = {
  "separate-contract": "var(--treat-separate)",
  "termination-new-contract": "var(--treat-termnew)",
  "modification": "var(--treat-modify)",
};

const bg: Record<Treatment, string> = {
  "separate-contract": "var(--treat-separate-bg)",
  "termination-new-contract": "var(--treat-termnew-bg)",
  "modification": "var(--treat-modify-bg)",
};

export function TreatmentChip({ treatment, size = "md" }: { treatment: Treatment; size?: "sm" | "md" | "lg" }) {
  const fs = size === "sm" ? 11 : size === "lg" ? 13 : 12;
  const py = size === "sm" ? 2 : 4;
  const px = size === "sm" ? 8 : 10;
  const dot = size === "sm" ? 6 : 7;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: `${py}px ${px}px`,
        borderRadius: "var(--radius-pill)",
        background: bg[treatment],
        color: fg[treatment],
        fontSize: fs,
        fontWeight: 500,
        lineHeight: 1,
      }}
    >
      <span
        aria-hidden
        style={{ width: dot, height: dot, borderRadius: "50%", background: fg[treatment] }}
      />
      {labels[treatment]}
    </span>
  );
}

export function TreatmentDot({ treatment, size = 10 }: { treatment: Treatment; size?: number }) {
  return (
    <span
      aria-label={labels[treatment]}
      style={{
        display: "inline-block",
        width: size,
        height: size,
        background: fg[treatment],
        borderRadius: "50%",
      }}
    />
  );
}
