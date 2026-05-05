"use client";

export function TraceMarker({
  index,
  onActivate,
  ariaLabel,
}: {
  index: number | string;
  onActivate?: () => void;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel ?? `Trace provenance ${index}`}
      onClick={onActivate}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 18,
        height: 18,
        marginLeft: 6,
        verticalAlign: "super",
        fontSize: 10,
        fontWeight: 600,
        color: "var(--ink-3)",
        border: "1px solid var(--border)",
        background: "var(--surface-2)",
        borderRadius: "50%",
        cursor: onActivate ? "pointer" : "default",
        transition: "color var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease)",
      }}
    >
      {index}
    </button>
  );
}
