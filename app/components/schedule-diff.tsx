"use client";

import type { Amendment, ScheduleLine } from "@/lib/types";
import { PERIODS } from "@/lib/gold-contract";
import { money } from "@/lib/format";
import { TraceMarker } from "@/components/ui/trace-marker";

type CategoryKey = ScheduleLine["category"];

const CATEGORY_ORDER: CategoryKey[] = [
  "commit",
  "overage",
  "premium-support",
  "renewal-stub",
  "renewal-new",
];

const CATEGORY_LABEL: Record<CategoryKey, string> = {
  "commit": "Commit",
  "overage": "Overage",
  "premium-support": "Premium support",
  "renewal-stub": "Stub (terminated)",
  "renewal-new": "Renewal term",
};

const CATEGORY_COLOR: Record<CategoryKey, string> = {
  "commit": "var(--ink)",
  "overage": "var(--pattern-catchup)",
  "premium-support": "var(--treat-separate)",
  "renewal-stub": "var(--diff-remove)",
  "renewal-new": "var(--treat-termnew)",
};

const PATTERN_FOR_OLD: Record<CategoryKey, string> = {
  "commit": "var(--ink-3)",
  "overage": "rgba(197, 122, 26, 0.55)",
  "premium-support": "rgba(61, 122, 61, 0.5)",
  "renewal-stub": "rgba(156, 43, 43, 0.5)",
  "renewal-new": "rgba(107, 79, 168, 0.5)",
};

const PERIOD_LABEL: Record<string, string> = {
  "2025-01": "JAN",
  "2025-02": "FEB",
  "2025-03": "MAR",
  "2025-04": "APR",
  "2025-05": "MAY",
  "2025-06": "JUN",
  "2025-07": "JUL",
  "2025-08": "AUG",
  "2025-09": "SEP",
  "2025-10": "OCT",
  "2025-11": "NOV",
  "2025-12": "DEC",
};

type PeriodAgg = {
  period: string;
  oldBy: Map<CategoryKey, number>;
  newBy: Map<CategoryKey, number>;
  oldTotal: number;
  newTotal: number;
  lines: ScheduleLine[];
};

function aggregate(lines: ScheduleLine[]): PeriodAgg[] {
  const byPeriod = new Map<string, PeriodAgg>();
  for (const p of PERIODS) {
    byPeriod.set(p, {
      period: p,
      oldBy: new Map(),
      newBy: new Map(),
      oldTotal: 0,
      newTotal: 0,
      lines: [],
    });
  }
  for (const l of lines) {
    const agg = byPeriod.get(l.period);
    if (!agg) continue;
    agg.oldBy.set(l.category, (agg.oldBy.get(l.category) ?? 0) + l.oldCents);
    agg.newBy.set(l.category, (agg.newBy.get(l.category) ?? 0) + l.newCents);
    agg.oldTotal += l.oldCents;
    agg.newTotal += l.newCents;
    agg.lines.push(l);
  }
  return PERIODS.map(p => byPeriod.get(p)!);
}

export function ScheduleDiff({
  amendment,
  onTraceLine,
}: {
  amendment: Amendment;
  onTraceLine: (line: ScheduleLine) => void;
}) {
  const aggs = aggregate(amendment.scheduleLines);
  const maxTotal = Math.max(...aggs.flatMap(a => [a.oldTotal, a.newTotal]));
  const barAreaHeight = 180;
  const totalOld = aggs.reduce((s, a) => s + a.oldTotal, 0);
  const totalNew = aggs.reduce((s, a) => s + a.newTotal, 0);
  const netDelta = totalNew - totalOld;
  const changedPeriods = aggs.filter(a => Math.abs(a.newTotal - a.oldTotal) > 1).length;

  const catchupBandHeight = amendment.cumulativeCatchupCents > 0 ? 44 : 0;

  // For amd_003, catch-up applies to periods 2025-01 through 2025-08 (8 periods)
  const catchupPeriodsCount = amendment.pattern === "cumulative-catchup" ? 8 : 0;

  // Identify which categories appear at all
  const presentCats = new Set<CategoryKey>();
  for (const a of aggs) {
    for (const k of [...a.oldBy.keys(), ...a.newBy.keys()]) {
      if ((a.oldBy.get(k) ?? 0) > 0 || (a.newBy.get(k) ?? 0) > 0) presentCats.add(k);
    }
  }
  const legend = CATEGORY_ORDER.filter(c => presentCats.has(c));

  return (
    <div className="card">
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span className="heading-2">Schedule diff</span>
          {Math.abs(netDelta) > 1 && (
            <span
              className="mono"
              style={{
                fontSize: 12,
                color: "var(--ink-3)",
                letterSpacing: "-0.005em",
              }}
            >
              <span style={{ color: netDelta > 0 ? "var(--diff-add)" : "var(--diff-remove)", fontWeight: 600 }}>
                {netDelta > 0 ? "+" : "−"}
                {money(Math.abs(netDelta)).replace(/^[−+]/, "")}
              </span>{" "}
              net · {changedPeriods} of 12 periods changed
            </span>
          )}
        </div>
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {legend.map(c => (
            <span
              key={c}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 11,
                color: "var(--ink-3)",
              }}
            >
              <span
                aria-hidden
                style={{ width: 10, height: 10, borderRadius: 3, background: CATEGORY_COLOR[c] }}
              />
              {CATEGORY_LABEL[c]}
            </span>
          ))}
        </div>
      </div>

      <div style={{ padding: "var(--space-5) var(--space-5) var(--space-3) var(--space-5)" }}>
        {/* axis labels (left) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "44px 1fr",
            alignItems: "stretch",
            gap: "var(--space-3)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: "0.625rem",
              color: "var(--ink-3)",
              letterSpacing: "0.04em",
              paddingBottom: 24,
            }}
          >
            <span>{shortCents(maxTotal)}</span>
            <span>{shortCents(maxTotal / 2)}</span>
            <span>$0</span>
          </div>

          <div
            style={{
              position: "relative",
              borderLeft: "1px solid var(--hairline-2)",
              borderBottom: "1px solid var(--ink-2)",
              paddingLeft: 8,
            }}
          >
            {/* gridlines */}
            {[0.25, 0.5, 0.75].map(g => (
              <span
                key={g}
                aria-hidden
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: g * barAreaHeight + 24,
                  height: 1,
                  background: "var(--hairline-2)",
                  opacity: 0.7,
                }}
              />
            ))}

            <div
              role="grid"
              aria-label="Schedule diff bars"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(12, 1fr)",
                alignItems: "end",
                height: barAreaHeight + 24,
                gap: 0,
              }}
            >
              {aggs.map(a => {
                const oldRatio = maxTotal === 0 ? 0 : a.oldTotal / maxTotal;
                const newRatio = maxTotal === 0 ? 0 : a.newTotal / maxTotal;
                return (
                  <div
                    key={a.period}
                    role="gridcell"
                    style={{
                      position: "relative",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      paddingBottom: 24,
                    }}
                  >
                    {/* bars wrapper (old | new) */}
                    <div
                      style={{
                        display: "flex",
                        gap: 2,
                        alignItems: "flex-end",
                        height: barAreaHeight,
                        width: "80%",
                      }}
                    >
                      <Bar
                        height={oldRatio * barAreaHeight}
                        agg={a}
                        side="old"
                        onTraceLine={onTraceLine}
                      />
                      <Bar
                        height={newRatio * barAreaHeight}
                        agg={a}
                        side="new"
                        onTraceLine={onTraceLine}
                      />
                    </div>

                    {/* x-axis label */}
                    <span
                      className="mono"
                      style={{
                        position: "absolute",
                        bottom: 4,
                        fontSize: "0.625rem",
                        color: "var(--ink-3)",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {PERIOD_LABEL[a.period]}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* catchup band */}
            {catchupBandHeight > 0 && (
              <div
                aria-label="Cumulative catch-up band"
                style={{
                  position: "relative",
                  marginTop: 8,
                  height: catchupBandHeight,
                  display: "grid",
                  gridTemplateColumns: "repeat(12, 1fr)",
                }}
              >
                {Array.from({ length: 12 }).map((_, i) => {
                  const isAffected = i < catchupPeriodsCount;
                  return (
                    <div
                      key={i}
                      style={{
                        background: isAffected
                          ? "rgba(197, 122, 26, 0.18)"
                          : "transparent",
                        borderTop: isAffected ? "1px solid var(--pattern-catchup)" : "none",
                        borderBottom: isAffected ? "1px solid var(--pattern-catchup)" : "none",
                      }}
                    />
                  );
                })}
                <div
                  style={{
                    position: "absolute",
                    inset: "0 12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                    pointerEvents: "none",
                  }}
                >
                  <span
                    className="mono"
                    style={{
                      fontSize: "0.6875rem",
                      color: "var(--pattern-catchup)",
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    Catch-up · recognized 2025-09
                  </span>
                  <span
                    className="mono"
                    style={{
                      fontSize: "0.8125rem",
                      color: "var(--pattern-catchup)",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    +{money(amendment.cumulativeCatchupCents).replace("+", "")}
                  </span>
                </div>
              </div>
            )}

            {/* footer note */}
            <div
              style={{
                marginTop: catchupBandHeight > 0 ? 12 : 16,
                display: "flex",
                justifyContent: "space-between",
                gap: "var(--space-3)",
                flexWrap: "wrap",
              }}
            >
              <div
                className="mono"
                style={{
                  fontSize: "0.625rem",
                  color: "var(--ink-3)",
                  letterSpacing: "0.04em",
                }}
              >
                Each period: <span style={{ color: "var(--ink-3)" }}>old</span>{" "}
                <span style={{ color: "var(--ink)" }}>vs</span>{" "}
                <span style={{ color: "var(--ink)" }}>new</span> · click any bar to trace provenance
              </div>
              {amendment.pattern === "prospective" && amendment.treatment === "termination-new-contract" && (
                <div
                  className="mono"
                  style={{
                    fontSize: "0.625rem",
                    color: "var(--treat-termnew)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  ⤳ chart shows 2025; renewal extends through 2026-10-31
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Bar({
  height,
  agg,
  side,
  onTraceLine,
}: {
  height: number;
  agg: PeriodAgg;
  side: "old" | "new";
  onTraceLine: (l: ScheduleLine) => void;
}) {
  const map = side === "old" ? agg.oldBy : agg.newBy;
  const total = side === "old" ? agg.oldTotal : agg.newTotal;
  const segments = CATEGORY_ORDER.filter(c => (map.get(c) ?? 0) > 0);

  // pick a representative line for each category for trace marker
  const repLineByCat = new Map<CategoryKey, ScheduleLine>();
  for (const l of agg.lines) {
    if (!repLineByCat.has(l.category)) repLineByCat.set(l.category, l);
  }

  return (
    <button
      type="button"
      aria-label={`${side === "old" ? "Before" : "After"} bar for ${agg.period}, total ${money(total)}`}
      onClick={() => {
        const first = segments[0];
        if (!first) return;
        const line = repLineByCat.get(first);
        if (line) onTraceLine(line);
      }}
      style={{
        position: "relative",
        flex: 1,
        height: Math.max(height, total > 0 ? 2 : 0),
        background: "transparent",
        border: "0",
        padding: 0,
        display: "flex",
        flexDirection: "column-reverse",
        cursor: total > 0 ? "pointer" : "default",
        animation: "bar-grow var(--dur-slow) var(--ease) both",
        transformOrigin: "bottom",
      }}
    >
      {segments.map(c => {
        const v = map.get(c) ?? 0;
        const pct = total === 0 ? 0 : v / total;
        return (
          <span
            key={c}
            aria-hidden
            style={{
              display: "block",
              height: `${pct * 100}%`,
              background: side === "old" ? PATTERN_FOR_OLD[c] : CATEGORY_COLOR[c],
              borderTop: side === "new" && v > 0 ? "1px solid rgba(250, 247, 242, 0.5)" : "none",
              outline: side === "old" ? "1px dashed rgba(14, 15, 17, 0.15)" : "none",
              outlineOffset: -1,
            }}
          />
        );
      })}
    </button>
  );
}

function shortCents(c: number): string {
  const dollars = Math.abs(c) / 100;
  const sign = c < 0 ? "−" : "";
  if (dollars >= 1_000_000) return `${sign}$${Math.round(dollars / 1_000_000)}M`;
  if (dollars >= 1_000) return `${sign}$${Math.round(dollars / 1_000)}K`;
  return `${sign}$${Math.round(dollars)}`;
}
