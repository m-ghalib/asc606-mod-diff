"use client";

import { useEffect } from "react";
import type { Amendment, ScheduleLine } from "@/lib/types";
import { acmeContract } from "@/lib/gold-contract";
import { money, timestamp } from "@/lib/format";
import type { TraceTarget } from "./diff-workspace";

export function ProvenanceTrace({
  target,
  amendment,
  onClose,
}: {
  target: TraceTarget | null;
  amendment: Amendment;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!target) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [target, onClose]);

  if (!target) return null;

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(14, 20, 24, 0.32)",
          zIndex: 60,
          animation: "paper-fade-in var(--dur-mid) var(--ease) both",
        }}
      />
      <aside
        role="dialog"
        aria-label="Provenance trace"
        style={{
          position: "fixed",
          right: 0,
          top: 0,
          bottom: 0,
          width: 420,
          maxWidth: "90vw",
          background: "var(--surface-raised)",
          borderLeft: "1px solid var(--border)",
          boxShadow: "var(--shadow-elev)",
          zIndex: 70,
          display: "flex",
          flexDirection: "column",
          animation: "rail-slide-in var(--dur-mid) var(--ease) both",
        }}
      >
        <header
          style={{
            padding: "18px 20px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontSize: 12, color: "var(--ink-3)", marginBottom: 4 }}>
              Provenance trace
            </div>
            <h3 className="display-2" style={{ margin: 0, fontSize: 20 }}>
              Show your work
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close trace"
            style={{
              fontSize: 14,
              color: "var(--ink-3)",
              padding: 6,
              borderRadius: 6,
            }}
          >
            ✕
          </button>
        </header>

        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {target.kind === "schedule-line" ? (
            <ScheduleLineChain line={target.line} />
          ) : (
            <ClauseChain clauseId={target.clauseId} amendment={amendment} />
          )}

          <hr style={{ border: 0, borderTop: "1px solid var(--border)", margin: "8px 0" }} />

          <div>
            <div
              style={{
                fontSize: 12,
                color: "var(--ink-3)",
                marginBottom: 8,
                fontWeight: 500,
              }}
            >
              Computed-by signature
            </div>
            <KV k="App version" v={amendment.computedBy.appVersion} />
            <KV k="Prompt version" v={amendment.computedBy.promptVersion} />
            <KV k="Model" v={amendment.computedBy.modelVersion} />
            <KV k="Computed at" v={timestamp(amendment.computedBy.computedAt)} />
            <KV k="Input hash" v={amendment.computedBy.inputHash} mono />
          </div>

          <div
            style={{
              padding: 12,
              borderRadius: 10,
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              fontSize: 12,
              color: "var(--ink-3)",
              lineHeight: 1.6,
            }}
          >
            Chain of custody is immutable. Re-rendering this view emits a new computed-at stamp;
            prior traces remain readable through the audit trail log included in the PBC bundle.
          </div>
        </div>
      </aside>
    </>
  );
}

function ScheduleLineChain({ line }: { line: ScheduleLine }) {
  const clause = acmeContract.clauses.find(c => c.id === line.clauseId);
  const meter = line.meterId ? acmeContract.meters.find(m => m.id === line.meterId) : null;
  const invoice = line.invoiceLineId
    ? acmeContract.invoiceLines.find(i => i.id === line.invoiceLineId)
    : null;

  return (
    <div>
      <div
        style={{
          fontSize: 12,
          color: "var(--ink-3)",
          marginBottom: 10,
          fontWeight: 500,
        }}
      >
        Schedule line · {line.period}
      </div>

      <div className="display-2" style={{ fontSize: 22, margin: "0 0 12px 0" }}>
        {money(line.newCents - line.oldCents) === "$0.00"
          ? "—"
          : money(line.newCents - line.oldCents)}
        <span
          className="mono"
          style={{
            display: "inline-block",
            marginLeft: 8,
            fontSize: 12,
            color: "var(--ink-3)",
            verticalAlign: "middle",
            fontWeight: 400,
          }}
        >
          {money(line.oldCents)} → {money(line.newCents)}
        </span>
      </div>

      <ChainStep n={1} label="Schedule line">
        <KV k="ID" v={line.id} mono />
        <KV k="Period" v={line.period} mono />
        <KV k="Category" v={line.category} mono />
        <KV k="Performance obligation" v={line.performanceObligation} />
      </ChainStep>

      <ChainStep n={2} label="Clause">
        {clause ? (
          <>
            <KV k="ID" v={clause.id} mono />
            <KV k="Label" v={clause.label} />
            <KV k="Cite" v={clause.cite} mono />
            <KV k="Value" v={clause.value} />
          </>
        ) : (
          <div style={{ fontSize: 12, color: "var(--ink-3)" }}>
            (clause introduced by this amendment, see clause-diff)
          </div>
        )}
      </ChainStep>

      {meter && (
        <ChainStep n={3} label="Usage meter">
          <KV k="ID" v={meter.id} mono />
          <KV k="Label" v={meter.label} />
          <KV k="Unit" v={meter.unit} mono />
        </ChainStep>
      )}

      {invoice && (
        <ChainStep n={meter ? 4 : 3} label="Invoice line">
          <KV k="ID" v={invoice.id} mono />
          <KV k="Period" v={invoice.period} mono />
          <KV k="Description" v={invoice.description} />
          <KV k="Amount" v={money(invoice.amountCents)} mono />
        </ChainStep>
      )}
    </div>
  );
}

function ClauseChain({ clauseId, amendment }: { clauseId: string; amendment: Amendment }) {
  const clause = acmeContract.clauses.find(c => c.id === clauseId);
  const change = amendment.clauseChanges.find(c => c.clauseId === clauseId);

  return (
    <div>
      <div
        style={{
          fontSize: 12,
          color: "var(--ink-3)",
          marginBottom: 10,
          fontWeight: 500,
        }}
      >
        Clause · {clauseId}
      </div>
      <ChainStep n={1} label="Clause record">
        {clause ? (
          <>
            <KV k="Label" v={clause.label} />
            <KV k="Cite" v={clause.cite} mono />
            <KV k="Master value" v={clause.value} />
          </>
        ) : (
          <KV k="ID" v={clauseId} mono />
        )}
      </ChainStep>

      {change && (
        <ChainStep n={2} label="Diff">
          <KV k="Before" v={change.before} />
          <KV k="After" v={change.after} />
          <KV k="Fields" v={change.changedFields.join(", ")} mono />
        </ChainStep>
      )}
    </div>
  );
}

function ChainStep({ n, label, children }: { n: number; label: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        marginBottom: 14,
        paddingLeft: 18,
        borderLeft: "1px solid var(--border)",
        position: "relative",
      }}
    >
      <span
        className="mono"
        style={{
          position: "absolute",
          left: -10,
          top: 0,
          width: 20,
          height: 20,
          background: "var(--surface-raised)",
          border: "1px solid var(--border-strong)",
          borderRadius: "50%",
          fontSize: 11,
          fontWeight: 600,
          display: "grid",
          placeItems: "center",
        }}
      >
        {n}
      </span>
      <div
        style={{
          fontSize: 12,
          color: "var(--ink-3)",
          marginBottom: 6,
          fontWeight: 500,
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

function KV({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "100px 1fr",
        gap: 8,
        padding: "3px 0",
        fontSize: 13,
      }}
    >
      <span style={{ fontSize: 12, color: "var(--ink-3)" }}>{k}</span>
      <span
        className={mono ? "mono" : undefined}
        style={
          mono
            ? { fontSize: 12, color: "var(--ink-2)", wordBreak: "break-all" }
            : { fontSize: 13, color: "var(--ink)" }
        }
      >
        {v}
      </span>
    </div>
  );
}
