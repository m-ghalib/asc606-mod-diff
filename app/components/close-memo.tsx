"use client";

import { useMemo, useState } from "react";
import type { Amendment, MemoVersion } from "@/lib/types";
import { timestamp } from "@/lib/format";

export function CloseMemo({ amendment }: { amendment: Amendment }) {
  const [memoVersions, setMemoVersions] = useState<MemoVersion[]>(amendment.memo);
  const versions = useMemo(
    () => [...memoVersions].sort((a, b) => b.version - a.version),
    [memoVersions],
  );
  const [activeId, setActiveId] = useState<string>(versions[0]?.id ?? "");
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const active = versions.find(v => v.id === activeId) ?? versions[0];
  const isLatest = active && active.version === versions[0].version;

  async function handleRegenerate() {
    setRegenerating(true);
    setError(null);
    try {
      const res = await fetch(`/api/amendments/${amendment.id}/memo`, { method: "POST" });
      if (!res.ok) {
        const detail = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(detail?.error ?? `request failed (${res.status})`);
      }
      const next = (await res.json()) as MemoVersion;
      setMemoVersions(prev => [...prev, next]);
      setActiveId(next.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "regenerate failed");
    } finally {
      setRegenerating(false);
    }
  }

  if (!active) return null;

  return (
    <section
      aria-label="Close memo"
      className="card"
      style={{ padding: 0 }}
    >
      <header
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span className="heading-2">Close memo</span>
        <span style={{ fontSize: 12, color: "var(--ink-3)" }}>
          v{active.version} · {amendment.citePrimary}
        </span>
        {!isLatest && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "2px 8px",
              borderRadius: "var(--radius-pill)",
              background: "var(--treat-modify-bg)",
              color: "var(--treat-modify)",
              fontSize: 11,
              fontWeight: 500,
            }}
          >
            Viewing prior version
          </span>
        )}
        {error && (
          <span
            role="alert"
            style={{
              fontSize: 12,
              color: "var(--treat-terminate, #b3261e)",
              maxWidth: 360,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={error}
          >
            Regenerate failed: {error}
          </span>
        )}
        <span style={{ flex: 1 }} />
        <button
          type="button"
          onClick={handleRegenerate}
          disabled={regenerating}
          style={{
            fontSize: 12,
            fontWeight: 500,
            padding: "6px 12px",
            borderRadius: 8,
            border: "1px solid var(--border)",
            background: regenerating ? "var(--surface-2)" : "var(--surface-raised)",
            color: regenerating ? "var(--ink-3)" : "var(--ink)",
            cursor: regenerating ? "wait" : "pointer",
          }}
        >
          {regenerating ? "Drafting…" : "Regenerate with Gemini"}
        </button>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 280px",
          gap: 0,
        }}
      >
        <div style={{ padding: "20px 24px", minWidth: 0 }}>
          <MemoSection title="Facts">{active.body.facts}</MemoSection>
          <MemoSection title="Treatment determination">{active.body.treatmentDetermination}</MemoSection>
          <MemoSection title="Revenue schedule impact">{active.body.revenueScheduleImpact}</MemoSection>
          <MemoSection title="Materiality assessment">{active.body.materialityAssessment}</MemoSection>

          {active.body.citations.length > 0 && (
            <div
              style={{
                marginTop: 24,
                paddingTop: 16,
                borderTop: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: "var(--ink-3)",
                  marginBottom: 8,
                  fontWeight: 500,
                }}
              >
                Authoritative citations
              </div>
              <ol
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                {active.body.citations.map(c => (
                  <li
                    key={c.marker}
                    className="mono"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "28px 1fr",
                      gap: 8,
                      fontSize: 12,
                      color: "var(--ink-2)",
                    }}
                  >
                    <span style={{ color: "var(--ink-3)" }}>[{c.marker}]</span>
                    <span>{c.cite}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        <aside
          style={{
            borderLeft: "1px solid var(--border)",
            padding: 16,
            background: "var(--surface-2)",
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: "var(--ink-3)",
              marginBottom: 10,
              fontWeight: 500,
            }}
          >
            Version history
          </div>

          <ol
            role="list"
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {versions.map(v => {
              const selected = v.id === active.id;
              return (
                <li key={v.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(v.id)}
                    aria-current={selected ? "true" : undefined}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "8px 10px",
                      borderRadius: 8,
                      display: "grid",
                      gridTemplateColumns: "32px 1fr",
                      gap: 8,
                      cursor: "pointer",
                      background: selected ? "var(--surface-raised)" : "transparent",
                      border: selected ? "1px solid var(--border)" : "1px solid transparent",
                    }}
                  >
                    <span
                      className="mono"
                      style={{
                        fontSize: 12,
                        fontWeight: selected ? 600 : 500,
                        color: selected ? "var(--ink)" : "var(--ink-3)",
                      }}
                    >
                      v{v.version}
                    </span>
                    <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <span
                        style={{
                          fontSize: 11,
                          color:
                            v.source === "human-edit"
                              ? "var(--treat-modify)"
                              : "var(--ink-2)",
                          fontWeight: 600,
                        }}
                      >
                        {v.source === "human-edit" ? "Human edit" : "Generated"}
                      </span>
                      <span
                        className="mono"
                        style={{ fontSize: 11, color: "var(--ink-3)" }}
                      >
                        {timestamp(v.createdAt)}
                      </span>
                      <span style={{ fontSize: 12, color: "var(--ink-2)" }}>
                        {v.authorLabel}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <p
            style={{
              marginTop: 14,
              fontSize: 11,
              color: "var(--ink-3)",
              lineHeight: 1.55,
            }}
          >
            Append-only history. Every regenerate or human edit creates a new timestamped version
            with prior-version pointer.
          </p>
        </aside>
      </div>
    </section>
  );
}

function MemoSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 18 }}>
      <h3
        style={{
          margin: "0 0 6px 0",
          fontSize: 14,
          fontWeight: 600,
          color: "var(--ink)",
          letterSpacing: "-0.005em",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          margin: 0,
          fontSize: 14,
          lineHeight: 1.6,
          color: "var(--ink-2)",
          maxWidth: "62ch",
        }}
      >
        {renderMemoBody(children)}
      </p>
    </div>
  );
}

function renderMemoBody(node: React.ReactNode): React.ReactNode {
  if (typeof node !== "string") return node;
  const parts = node.split(/(\[\d+\])/g);
  return parts.map((p, i) => {
    const m = /^\[(\d+)\]$/.exec(p);
    if (m)
      return (
        <sup
          key={i}
          className="mono"
          style={{
            fontSize: 10,
            color: "var(--ink-3)",
            margin: "0 1px",
          }}
        >
          {m[1]}
        </sup>
      );
    return <span key={i}>{p}</span>;
  });
}

