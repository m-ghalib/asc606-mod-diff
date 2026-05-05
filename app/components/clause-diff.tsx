"use client";

import Link from "next/link";
import type { Amendment } from "@/lib/types";
import { acmeContract } from "@/lib/gold-contract";
import { acmeMasterDocument } from "@/lib/contract-document";
import { TraceMarker } from "@/components/ui/trace-marker";

const sourceClauseIds = new Set(
  acmeMasterDocument.sections.filter(s => s.clauseId).map(s => s.clauseId as string)
);

export function ClauseDiff({
  amendment,
  onTraceClause,
}: {
  amendment: Amendment;
  onTraceClause: (clauseId: string) => void;
}) {
  const clauseLookup = new Map(acmeContract.clauses.map(c => [c.id, c]));

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 12,
        }}
      >
        <span className="heading-2">Clause diff</span>
        <span style={{ fontSize: 12, color: "var(--ink-3)" }}>
          {amendment.clauseChanges.length} change
          {amendment.clauseChanges.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div role="list">
        {amendment.clauseChanges.map((change, idx) => {
          const clause = clauseLookup.get(change.clauseId);
          const label = clause?.label ?? humanizeClauseId(change.clauseId);
          const cite = clause?.cite ?? "—";
          const last = idx === amendment.clauseChanges.length - 1;

          return (
            <article
              key={change.clauseId + idx}
              role="listitem"
              style={{
                padding: "16px 20px",
                borderBottom: last ? "none" : "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>
                    {label}
                    <TraceMarker
                      index={idx + 1}
                      onActivate={() => onTraceClause(change.clauseId)}
                      ariaLabel={`Trace clause ${change.clauseId}`}
                    />
                  </span>
                  <span
                    className="mono"
                    style={{ fontSize: 12, color: "var(--ink-3)" }}
                  >
                    {cite}
                  </span>
                  {sourceClauseIds.has(change.clauseId) && (
                    <Link
                      href={`/contracts/${acmeContract.slug}/document#clause-${change.clauseId}`}
                      style={{ fontSize: 12, color: "var(--ink-3)" }}
                    >
                      View source ↗
                    </Link>
                  )}
                </div>
                {change.changedFields.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {change.changedFields.map(f => (
                      <span
                        key={f}
                        style={{
                          fontSize: 11,
                          color: "var(--ink-3)",
                          padding: "2px 8px",
                          border: "1px solid var(--border)",
                          borderRadius: "var(--radius-pill)",
                          background: "var(--surface-2)",
                        }}
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <DiffSide kind="before" body={change.before} />
                <DiffSide kind="after" body={change.after} />
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function DiffSide({ kind, body }: { kind: "before" | "after"; body: string }) {
  const isBefore = kind === "before";
  return (
    <div
      style={{
        padding: 12,
        borderRadius: 10,
        background: isBefore ? "var(--diff-remove-bg)" : "var(--diff-add-bg)",
        border: `1px solid ${isBefore ? "rgba(156, 43, 43, 0.18)" : "rgba(45, 106, 62, 0.18)"}`,
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: isBefore ? "var(--diff-remove)" : "var(--diff-add)",
          fontWeight: 600,
          marginBottom: 6,
          textTransform: "uppercase",
          letterSpacing: 0.4,
        }}
      >
        {isBefore ? "− Before" : "+ After"}
      </div>
      <div style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--ink-2)" }}>{body}</div>
    </div>
  );
}

function humanizeClauseId(id: string): string {
  return id.replace(/^cl_/, "").replace(/_/g, " ");
}
