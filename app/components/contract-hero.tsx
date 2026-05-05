import Link from "next/link";
import { acmeContract } from "@/lib/gold-contract";
import { isMaterial, materialityRatio, recogDeltaCents, tcvDeltaCents } from "@/lib/materiality";
import type { Amendment } from "@/lib/types";
import { money } from "@/lib/format";
import { TreatmentChip } from "@/components/ui/treatment-chip";
import { PatternBadge } from "@/components/ui/pattern-badge";

export function ContractHero({ amendment }: { amendment: Amendment | null }) {
  return amendment ? <ModHero amendment={amendment} /> : <MasterHero />;
}

function MasterHero() {
  const c = acmeContract;
  const last = c.amendments[c.amendments.length - 1];
  const consolidatedTcv = last.totalContractValueNewCents;
  const ytdRecognized = last.recognizedToDateNewCents;
  const materialCount = c.amendments.filter(isMaterial).length;

  return (
    <section style={{ marginTop: 8, marginBottom: 24 }}>
      {/* title row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 24,
          marginBottom: 20,
        }}
      >
        <div>
          <h1 className="display-1" style={{ margin: 0 }}>
            {c.entity}
          </h1>
          <p style={{ margin: "6px 0 0", color: "var(--ink-3)", fontSize: 14 }}>
            Annual commit + usage overage · {c.effectiveDate} → 2026-10-31 ·{" "}
            {c.amendments.length} amendments
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Link href={`/contracts/${c.slug}/document`} style={btnSecondary}>
            Source contract ↗
          </Link>
          <button style={btnPrimary}>Export PBC bundle</button>
        </div>
      </div>

      {/* KPI row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 16,
        }}
      >
        <Kpi label="Initial TCV" value={money(c.initialTcvCents)} hint={`${c.termMonths} mo · straight-line`} />
        <Kpi
          label="Consolidated TCV"
          value={money(consolidatedTcv)}
          hint={signed(consolidatedTcv - c.initialTcvCents) + " vs initial"}
        />
        <Kpi label="Recognized YTD" value={money(ytdRecognized)} hint="Through 2025-Q4 close" />
        <Kpi
          label="Material amendments"
          value={`${materialCount} / ${c.amendments.length}`}
          hint="≥ 5% TCV threshold"
          tone={materialCount > 0 ? "warn" : "neutral"}
        />
      </div>
    </section>
  );
}

function ModHero({ amendment }: { amendment: Amendment }) {
  const material = isMaterial(amendment);
  const ratioPct = materialityRatio(amendment) * 100;
  const tcvDelta = tcvDeltaCents(amendment);
  const recogDelta = recogDeltaCents(amendment);

  return (
    <section style={{ marginTop: 8, marginBottom: 24 }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 24,
          marginBottom: 20,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 12,
              color: "var(--ink-3)",
              letterSpacing: 0.2,
              marginBottom: 6,
            }}
          >
            MOD-{String(amendment.number).padStart(3, "0")} · effective {amendment.effectiveDate} ·{" "}
            {amendment.citePrimary}
          </div>
          <h1 className="display-1" style={{ margin: 0 }}>
            {amendment.shortTitle}
          </h1>
          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            <TreatmentChip treatment={amendment.treatment} />
            <PatternBadge pattern={amendment.pattern} />
            {material && <Pill tone="material">▲ Material · {ratioPct.toFixed(1)}% of prior TCV</Pill>}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Link href={`/contracts/${acmeContract.slug}/document`} style={btnSecondary}>
            Source contract ↗
          </Link>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 16,
        }}
      >
        <Kpi
          label="Δ TCV"
          value={(tcvDelta >= 0 ? "+" : "") + money(tcvDelta)}
          hint={`${money(amendment.totalContractValueOldCents)} → ${money(amendment.totalContractValueNewCents)}`}
          tone={tcvDelta < 0 ? "neg" : tcvDelta > 0 ? "pos" : "neutral"}
        />
        <Kpi
          label="Δ Recognized"
          value={recogDelta === 0 ? "—" : (recogDelta > 0 ? "+" : "") + money(recogDelta)}
          hint={`${money(amendment.recognizedToDateOldCents)} → ${money(amendment.recognizedToDateNewCents)}`}
          tone={recogDelta > 0 ? "warn" : recogDelta < 0 ? "neg" : "neutral"}
        />
        <Kpi
          label="Cumulative catch-up"
          value={amendment.cumulativeCatchupCents > 0 ? money(amendment.cumulativeCatchupCents) : "—"}
          hint={amendment.cumulativeCatchupCents > 0 ? "Recognized 2025-09" : "No catch-up"}
          tone={amendment.cumulativeCatchupCents > 0 ? "warn" : "neutral"}
        />
        <Kpi
          label="Materiality"
          value={`${ratioPct.toFixed(1)}%`}
          hint={material ? "Above 5% threshold" : "Below 5% threshold"}
          tone={material ? "material" : "pos"}
        />
      </div>
    </section>
  );
}

type Tone = "neutral" | "pos" | "neg" | "warn" | "material";

function Kpi({
  label,
  value,
  hint,
  tone = "neutral",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: Tone;
}) {
  const valueColor =
    tone === "pos"
      ? "var(--diff-add)"
      : tone === "neg"
      ? "var(--diff-remove)"
      : tone === "warn"
      ? "var(--pattern-catchup)"
      : tone === "material"
      ? "var(--material-flag)"
      : "var(--ink)";

  return (
    <div
      className="card"
      style={{
        padding: "16px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        position: "relative",
      }}
    >
      <span style={{ fontSize: 13, color: "var(--ink-3)", paddingRight: 26 }}>{label}</span>
      <span
        className="mono"
        title={value}
        style={{
          fontSize: "clamp(18px, 2.1vw, 24px)",
          fontWeight: 600,
          color: valueColor,
          letterSpacing: "-0.015em",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {value}
      </span>
      {hint && (
        <span style={{ fontSize: 12, color: "var(--ink-3)" }}>{hint}</span>
      )}
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          width: 20,
          height: 20,
          borderRadius: 6,
          border: "1px solid var(--border)",
          color: "var(--ink-4)",
          display: "grid",
          placeItems: "center",
          fontSize: 11,
        }}
      >
        ↗
      </span>
    </div>
  );
}

function Pill({ tone, children }: { tone: "material"; children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 10px",
        borderRadius: "var(--radius-pill)",
        fontSize: 12,
        fontWeight: 500,
        background: "var(--material-flag-bg)",
        color: "var(--material-flag)",
      }}
    >
      {children}
    </span>
  );
}

const btnPrimary: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: 8,
  background: "var(--ink)",
  color: "var(--surface-raised)",
  fontSize: 13,
  fontWeight: 500,
};

const btnSecondary: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: 8,
  background: "var(--surface-raised)",
  color: "var(--ink)",
  border: "1px solid var(--border)",
  fontSize: 13,
  fontWeight: 500,
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
};

function signed(cents: number): string {
  if (cents === 0) return "no change";
  return (cents > 0 ? "+" : "") + money(cents);
}
