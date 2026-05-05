"use client";

import { useState } from "react";
import type { Amendment } from "@/lib/types";
import { isMaterial } from "@/lib/materiality";

export function PbcBundleFooter({ amendment }: { amendment: Amendment }) {
  const [toast, setToast] = useState<string | null>(null);
  const material = isMaterial(amendment);

  function fireExport() {
    setToast(
      `Bundle prepared (no-op in v0.1): diff + schedule + memo + audit trail for MOD-${String(
        amendment.number
      ).padStart(3, "0")}.`
    );
    setTimeout(() => setToast(null), 4000);
  }

  return (
    <footer
      style={{
        position: "fixed",
        left: "var(--sidebar-w)",
        right: 0,
        bottom: 0,
        zIndex: 25,
        background: "var(--surface)",
        borderTop: "1px solid var(--border)",
        boxShadow: "var(--shadow-elev)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          padding: "12px 32px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "3px 10px",
              borderRadius: "var(--radius-pill)",
              background: "var(--ink)",
              color: "var(--surface-raised)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 0.5,
            }}
          >
            PBC
          </span>
          <span style={{ fontSize: 13, color: "var(--ink-2)" }}>
            Bundle includes diff · schedule · memo · audit trail · source artifacts
          </span>
          {material && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "3px 10px",
                borderRadius: "var(--radius-pill)",
                background: "var(--material-flag-bg)",
                color: "var(--material-flag)",
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              ▲ Material — required on PBC list
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={fireExport}
          style={{
            fontSize: 13,
            fontWeight: 500,
            padding: "8px 16px",
            background: "var(--ink)",
            color: "var(--surface-raised)",
            border: "1px solid var(--ink)",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Export PBC zip
        </button>
      </div>

      {toast && (
        <div
          role="status"
          style={{
            position: "fixed",
            right: 24,
            bottom: 80,
            background: "var(--ink)",
            color: "var(--surface-raised)",
            padding: "10px 14px",
            borderRadius: 10,
            fontSize: 13,
            maxWidth: 380,
            zIndex: 80,
            boxShadow: "var(--shadow-elev)",
            animation: "paper-fade-in var(--dur-mid) var(--ease) both",
          }}
        >
          {toast}
        </div>
      )}
    </footer>
  );
}
