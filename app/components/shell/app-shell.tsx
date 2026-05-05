import { Sidebar } from "./sidebar";

export function AppShell({
  children,
  breadcrumb,
  trailing,
}: {
  children: React.ReactNode;
  breadcrumb: React.ReactNode;
  trailing?: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--canvas)" }}>
      <Sidebar activeKey="diffs" />
      <div
        style={{
          marginLeft: "var(--sidebar-w)",
          minHeight: "100vh",
          position: "relative",
        }}
      >
        {/* teal accent strip behind the breadcrumb */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: "0 0 auto 0",
            height: 96,
            background:
              "linear-gradient(180deg, rgba(127, 209, 207, 0.32) 0%, rgba(127, 209, 207, 0.10) 60%, rgba(127, 209, 207, 0) 100%)",
            pointerEvents: "none",
          }}
        />
        <header
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 32px",
            minHeight: 56,
            zIndex: 1,
          }}
        >
          <div style={{ fontSize: 14, color: "var(--ink-2)" }}>{breadcrumb}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>{trailing}</div>
        </header>
        <main style={{ position: "relative", zIndex: 1 }}>{children}</main>
      </div>
    </div>
  );
}

export function Breadcrumb({ trail }: { trail: { label: string; href?: string; current?: boolean }[] }) {
  return (
    <nav aria-label="Breadcrumb" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      {trail.map((t, i) => (
        <span key={t.label} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          {i > 0 && <span style={{ color: "var(--ink-4)" }}>›</span>}
          <span
            style={{
              color: t.current ? "var(--ink)" : "var(--ink-3)",
              fontWeight: t.current ? 600 : 400,
            }}
          >
            {t.label}
          </span>
        </span>
      ))}
    </nav>
  );
}
