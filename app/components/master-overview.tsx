import Link from "next/link";
import { acmeContract } from "@/lib/gold-contract";
import { isMaterial, materialityRatio, tcvDeltaCents } from "@/lib/materiality";
import { TreatmentChip } from "@/components/ui/treatment-chip";
import { PatternBadge } from "@/components/ui/pattern-badge";
import { money } from "@/lib/format";
import { CalendarIcon, ChevronRight, FilterIcon, SearchIcon } from "@/components/shell/icons";

export function MasterOverview() {
  const c = acmeContract;
  const materialCount = c.amendments.filter(isMaterial).length;

  return (
    <section
      className="card"
      style={{
        padding: 0,
        marginBottom: 24,
      }}
    >
      {/* card header */}
      <header
        style={{
          padding: "18px 20px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <h2 className="heading-1" style={{ margin: 0 }}>
            Amendments
          </h2>
          <span style={{ fontSize: 13, color: "var(--ink-3)" }}>
            {c.amendments.length} total · {materialCount} material
          </span>
        </div>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            color: "var(--status-ok)",
          }}
        >
          <span
            aria-hidden
            style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--status-ok)" }}
          />
          Up to date · {timestampHint()}
        </span>
      </header>

      {/* toolbar */}
      <div
        style={{
          padding: "12px 20px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <Toolbar />
      </div>

      {/* table */}
      <div role="table" aria-label="Amendments">
        <div
          role="row"
          style={{
            display: "grid",
            gridTemplateColumns: "100px 1.4fr 110px 170px 1fr 1fr 90px 28px",
            alignItems: "center",
            gap: 16,
            padding: "10px 20px",
            borderBottom: "1px solid var(--border)",
            background: "var(--surface-2)",
            fontSize: 12,
            color: "var(--ink-3)",
            fontWeight: 500,
          }}
        >
          <span>Mod</span>
          <span>Title</span>
          <span>Effective</span>
          <span>Treatment</span>
          <span>Δ TCV</span>
          <span>Catch-up</span>
          <span>Status</span>
          <span />
        </div>

        {c.amendments.map((amd, idx) => {
          const material = isMaterial(amd);
          const delta = tcvDeltaCents(amd);
          const ratio = materialityRatio(amd);
          return (
            <Link
              key={amd.id}
              href={`/contracts/acme?mod=${amd.number}`}
              role="row"
              style={{
                display: "grid",
                gridTemplateColumns: "100px 1.4fr 110px 170px 1fr 1fr 90px 28px",
                alignItems: "center",
                gap: 16,
                padding: "16px 20px",
                borderBottom:
                  idx === c.amendments.length - 1 ? "none" : "1px solid var(--border)",
                color: "inherit",
                fontSize: 14,
                transition: "background var(--dur-fast) var(--ease)",
              }}
            >
              <span
                className="mono"
                style={{ fontSize: 13, color: "var(--ink-2)", fontWeight: 500 }}
              >
                MOD-{String(amd.number).padStart(3, "0")}
              </span>
              <span style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
                <span style={{ color: "var(--ink)", fontWeight: 500 }}>{amd.shortTitle}</span>
                <PatternBadge pattern={amd.pattern} size="sm" />
              </span>
              <span
                className="mono"
                style={{ fontSize: 13, color: "var(--ink-2)" }}
              >
                {amd.effectiveDate}
              </span>
              <span>
                <TreatmentChip treatment={amd.treatment} size="sm" />
              </span>
              <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span
                  className="mono"
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: delta < 0 ? "var(--diff-remove)" : "var(--diff-add)",
                  }}
                >
                  {delta >= 0 ? "+" : ""}
                  {money(delta)}
                </span>
                <span
                  className="mono"
                  style={{ fontSize: 12, color: "var(--ink-3)" }}
                >
                  {(ratio * 100).toFixed(1)}% of prior
                </span>
              </span>
              <span>
                {amd.cumulativeCatchupCents > 0 ? (
                  <span
                    className="mono"
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--pattern-catchup)",
                    }}
                  >
                    {money(amd.cumulativeCatchupCents)}
                  </span>
                ) : (
                  <span style={{ color: "var(--ink-4)" }}>—</span>
                )}
              </span>
              <span>
                {material ? (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "3px 10px",
                      borderRadius: "var(--radius-pill)",
                      background: "var(--material-flag-bg)",
                      color: "var(--material-flag)",
                      fontSize: 11,
                      fontWeight: 500,
                    }}
                  >
                    Material
                  </span>
                ) : (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "3px 10px",
                      borderRadius: "var(--radius-pill)",
                      background: "var(--treat-separate-bg)",
                      color: "var(--treat-separate)",
                      fontSize: 11,
                      fontWeight: 500,
                    }}
                  >
                    Below thr.
                  </span>
                )}
              </span>
              <span style={{ color: "var(--ink-3)", justifySelf: "end", display: "inline-flex" }}>
                <ChevronRight />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function Toolbar() {
  return (
    <>
      <label
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "var(--surface-raised)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: "6px 10px",
          flex: "1 1 240px",
          maxWidth: 320,
        }}
      >
        <span style={{ color: "var(--ink-3)", display: "inline-flex" }}>
          <SearchIcon />
        </span>
        <input
          placeholder="Search amendments"
          style={{
            border: 0,
            outline: 0,
            background: "transparent",
            fontSize: 13,
            color: "var(--ink)",
            flex: 1,
          }}
        />
      </label>
      <Chip>
        <CalendarIcon />
        <span style={{ marginLeft: 6 }}>2025-01 – 2025-12</span>
      </Chip>
      <Chip>
        <FilterIcon />
        <span style={{ marginLeft: 6 }}>Filters</span>
        <span
          style={{
            marginLeft: 6,
            background: "var(--treat-modify-bg)",
            color: "var(--treat-modify)",
            fontSize: 11,
            padding: "1px 6px",
            borderRadius: "var(--radius-pill)",
          }}
        >
          2
        </span>
      </Chip>
      <button
        style={{
          fontSize: 13,
          color: "var(--ink-3)",
          padding: "6px 10px",
        }}
      >
        Clear all
      </button>
    </>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: "var(--surface-raised)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        padding: "6px 10px",
        fontSize: 13,
        color: "var(--ink-2)",
      }}
    >
      {children}
    </span>
  );
}

function timestampHint(): string {
  return "2026-01-04 09:14Z";
}
