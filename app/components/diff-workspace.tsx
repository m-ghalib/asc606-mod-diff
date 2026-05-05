"use client";

import { useCallback, useState } from "react";
import type { Amendment, ScheduleLine } from "@/lib/types";
import { ClauseDiff } from "./clause-diff";
import { ScheduleDiff } from "./schedule-diff";
import { CloseMemo } from "./close-memo";
import { PbcBundleFooter } from "./pbc-bundle-footer";
import { ProvenanceTrace } from "./provenance-trace";

export type TraceTarget =
  | { kind: "schedule-line"; line: ScheduleLine; amendmentId: string }
  | { kind: "clause"; clauseId: string; amendmentId: string };

export function DiffWorkspace({ amendment }: { amendment: Amendment }) {
  const [trace, setTrace] = useState<TraceTarget | null>(null);
  const openTrace = useCallback((t: TraceTarget) => setTrace(t), []);
  const closeTrace = useCallback(() => setTrace(null), []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <section aria-label="Diff body">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.15fr)",
            gap: 16,
            alignItems: "stretch",
          }}
        >
          <ClauseDiff
            amendment={amendment}
            onTraceClause={cid =>
              openTrace({ kind: "clause", clauseId: cid, amendmentId: amendment.id })
            }
          />
          <ScheduleDiff
            amendment={amendment}
            onTraceLine={line =>
              openTrace({ kind: "schedule-line", line, amendmentId: amendment.id })
            }
          />
        </div>
      </section>
      <CloseMemo amendment={amendment} />
      <PbcBundleFooter amendment={amendment} />
      <ProvenanceTrace target={trace} amendment={amendment} onClose={closeTrace} />
    </div>
  );
}
