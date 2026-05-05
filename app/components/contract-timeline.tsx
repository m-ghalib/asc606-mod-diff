import Link from "next/link";
import { acmeContract } from "@/lib/gold-contract";
import { isMaterial } from "@/lib/materiality";
import { TreatmentDot } from "@/components/ui/treatment-chip";
import type { Amendment } from "@/lib/types";

export function ContractTimeline({ selected }: { selected: number | null }) {
  const c = acmeContract;
  const startMs = new Date(c.effectiveDate + "T00:00:00Z").getTime();
  const endMs = new Date(c.termEnds + "T00:00:00Z").getTime();
  const span = endMs - startMs;

  const positions = c.amendments.map(a => ({
    amd: a,
    pct: ((new Date(a.effectiveDate + "T00:00:00Z").getTime() - startMs) / span) * 100,
  }));

  return (
    <section
      aria-label="Contract timeline"
      className="card"
      style={{
        padding: "16px 20px 22px",
        marginBottom: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 18,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <span className="heading-2">Contract timeline</span>
          <span style={{ fontSize: 12, color: "var(--ink-3)" }}>Q1 2026 calendar</span>
        </div>
        <Link
          href="/contracts/acme"
          style={{
            fontSize: 12,
            color: selected === null ? "var(--ink)" : "var(--ink-3)",
            fontWeight: selected === null ? 600 : 400,
          }}
        >
          Master view
        </Link>
      </div>

      <div style={{ position: "relative", height: 76, marginTop: 6 }}>
        {/* rail */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 32,
            height: 2,
            background: "var(--border)",
            borderRadius: 1,
          }}
        />
        {/* month ticks */}
        {Array.from({ length: 13 }).map((_, i) => (
          <div
            key={i}
            aria-hidden
            style={{
              position: "absolute",
              left: `calc(${(i / 12) * 100}% - 0.5px)`,
              top: 30,
              width: 1,
              height: 6,
              background: "var(--border-strong)",
              opacity: 0.5,
            }}
          />
        ))}
        {/* master anchor */}
        <TimelineNode
          isMaster
          isSelected={selected === null}
          href="/contracts/acme"
          left="0%"
          label="Master"
          date={c.effectiveDate}
          align="left"
        />
        {/* amendment markers */}
        {positions.map(({ amd, pct }) => (
          <TimelineNode
            key={amd.id}
            amendment={amd}
            isSelected={selected === amd.number}
            href={`/contracts/acme?mod=${amd.number}`}
            left={`${pct}%`}
            label={`MOD-${String(amd.number).padStart(3, "0")}`}
            date={amd.effectiveDate}
            align="center"
          />
        ))}
        {/* term end */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: "100%",
            top: 26,
            transform: "translateX(-100%)",
            textAlign: "right",
          }}
        >
          <div
            style={{
              width: 1,
              height: 12,
              background: "var(--ink-2)",
              marginLeft: "auto",
            }}
          />
          <div
            style={{
              fontSize: 11,
              color: "var(--ink-3)",
              marginTop: 4,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {c.termEnds}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineNode({
  amendment,
  isMaster,
  isSelected,
  href,
  left,
  label,
  date,
  align,
}: {
  amendment?: Amendment;
  isMaster?: boolean;
  isSelected: boolean;
  href: string;
  left: string;
  label: string;
  date: string;
  align: "left" | "center" | "right";
}) {
  const transform =
    align === "center" ? "translateX(-50%)" : align === "right" ? "translateX(-100%)" : "none";
  const material = amendment ? isMaterial(amendment) : false;

  return (
    <Link
      href={href}
      aria-current={isSelected ? "page" : undefined}
      style={{
        position: "absolute",
        left,
        top: 0,
        transform,
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
        gap: 6,
        padding: 4,
        cursor: "pointer",
      }}
    >
      <span
        style={{
          fontSize: 11,
          color: isSelected ? "var(--ink)" : "var(--ink-3)",
          fontWeight: isSelected ? 600 : 500,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <span
        style={{
          position: "relative",
          width: 16,
          height: 16,
          display: "grid",
          placeItems: "center",
        }}
      >
        {amendment ? (
          <TreatmentDot treatment={amendment.treatment} size={isSelected ? 13 : 10} />
        ) : (
          <span
            aria-hidden
            style={{
              width: isSelected ? 13 : 10,
              height: isSelected ? 13 : 10,
              borderRadius: "50%",
              border: "1.5px solid var(--ink)",
              background: isMaster ? "var(--surface-raised)" : "transparent",
            }}
          />
        )}
        {material && (
          <span
            aria-hidden
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--material-flag)",
            }}
          />
        )}
      </span>
      <span
        style={{
          fontSize: 11,
          color: "var(--ink-3)",
          whiteSpace: "nowrap",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {date}
      </span>
    </Link>
  );
}
