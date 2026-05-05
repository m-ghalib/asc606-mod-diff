import Link from "next/link";
import {
  HomeIcon,
  CustomersIcon,
  InvoicingIcon,
  RevenueIcon,
  ContractIcon,
  ReportingIcon,
  DataIcon,
  IntegrationsIcon,
  SettingsIcon,
  ChevronDown,
  CollapseIcon,
  LogoutIcon,
} from "./icons";

type NavRow = {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  expanded?: boolean;
  href?: string;
  children?: { label: string; href?: string; active?: boolean }[];
};

export function Sidebar({ activeKey }: { activeKey: "diffs" | "overview" }) {
  const items: NavRow[] = [
    { label: "Overview", icon: <HomeIcon />, href: "#" },
    { label: "Customers", icon: <CustomersIcon />, href: "#" },
    {
      label: "Invoicing",
      icon: <InvoicingIcon />,
      expanded: false,
      children: [
        { label: "Billing" },
        { label: "Collections" },
        { label: "Credit memos" },
        { label: "Usage" },
      ],
    },
    {
      label: "Revenue",
      icon: <RevenueIcon />,
      expanded: true,
      children: [
        { label: "Overview" },
        { label: "ARR waterfall" },
        { label: "Revenue recognition" },
        { label: "Close management" },
      ],
    },
    {
      label: "Contract diffs",
      icon: <ContractIcon />,
      expanded: true,
      active: activeKey === "diffs",
      children: [
        { label: "Acme Corp", href: "/contracts/acme", active: activeKey === "diffs" },
      ],
    },
    { label: "Reporting", icon: <ReportingIcon />, href: "#" },
    { label: "Data", icon: <DataIcon />, href: "#" },
  ];

  return (
    <aside
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        width: "var(--sidebar-w)",
        background: "var(--sidebar)",
        color: "var(--sidebar-ink)",
        display: "flex",
        flexDirection: "column",
        zIndex: 40,
        borderRight: "1px solid var(--sidebar-rule)",
      }}
    >
      {/* Brand row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 16px 12px 16px",
        }}
      >
        <Link
          href="/contracts/acme"
          style={{
            display: "inline-flex",
            alignItems: "baseline",
            gap: 2,
            color: "var(--sidebar-ink-active)",
            fontWeight: 700,
            fontSize: 18,
            letterSpacing: "-0.01em",
          }}
        >
          diff
          <span style={{ color: "#7fd1cf", fontWeight: 700, fontSize: 18, marginLeft: 1 }}>+</span>
        </Link>
        <button
          aria-label="Collapse sidebar"
          style={{
            color: "var(--sidebar-ink-dim)",
            padding: 4,
            display: "inline-flex",
          }}
        >
          <CollapseIcon />
        </button>
      </div>

      {/* group label */}
      <div
        style={{
          padding: "0 16px 14px 16px",
          color: "var(--sidebar-ink-mute)",
          fontSize: 12,
          letterSpacing: 0,
        }}
      >
        Close support
      </div>

      {/* Nav */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 2, padding: "0 8px", flex: 1 }}>
        {items.map(item => (
          <NavGroup key={item.label} item={item} />
        ))}
      </nav>

      {/* Bottom block */}
      <div style={{ padding: "8px 8px 12px 8px", borderTop: "1px solid var(--sidebar-rule)" }}>
        <NavLeaf label="Integrations" icon={<IntegrationsIcon />} />
        <NavLeaf label="Settings" icon={<SettingsIcon />} />
        <div style={{ marginTop: 8, padding: "8px 8px", display: "flex", alignItems: "center", gap: 10 }}>
          <span
            aria-hidden
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #b48a59, #8a6444)",
              color: "white",
              display: "grid",
              placeItems: "center",
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            M
          </span>
          <span style={{ flex: 1, color: "var(--sidebar-ink)", fontSize: 13 }}>Momin Ghalib</span>
          <button
            aria-label="Sign out"
            style={{ color: "var(--sidebar-ink-dim)", padding: 4, display: "inline-flex" }}
          >
            <LogoutIcon />
          </button>
        </div>
      </div>
    </aside>
  );
}

function NavGroup({ item }: { item: NavRow }) {
  const isHeader = !!item.children && item.children.length > 0;
  const headerActive = !!item.active && !!item.expanded;

  return (
    <div>
      <NavLeaf
        label={item.label}
        icon={item.icon}
        href={item.href}
        active={item.active && !item.children}
        trailing={
          isHeader ? (
            <ChevronDown
              style={{
                color: "var(--sidebar-ink-dim)",
                transform: item.expanded ? "rotate(0deg)" : "rotate(-90deg)",
                transition: "transform var(--dur-fast) var(--ease)",
              }}
            />
          ) : null
        }
        bold={headerActive}
      />
      {item.expanded && item.children && (
        <div style={{ display: "flex", flexDirection: "column", gap: 1, padding: "2px 0 4px 0" }}>
          {item.children.map(c => (
            <Link
              key={c.label}
              href={c.href ?? "#"}
              style={{
                display: "block",
                margin: "0 8px",
                padding: "6px 12px 6px 40px",
                borderRadius: 8,
                fontSize: 13,
                color: c.active ? "var(--sidebar-ink-active)" : "var(--sidebar-ink)",
                background: c.active ? "var(--sidebar-active)" : "transparent",
                fontWeight: c.active ? 500 : 400,
                transition: "background var(--dur-fast) var(--ease)",
              }}
            >
              {c.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function NavLeaf({
  label,
  icon,
  href,
  active,
  trailing,
  bold,
}: {
  label: string;
  icon: React.ReactNode;
  href?: string;
  active?: boolean;
  trailing?: React.ReactNode;
  bold?: boolean;
}) {
  const inner = (
    <span
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 10px",
        borderRadius: 8,
        color: active ? "var(--sidebar-ink-active)" : "var(--sidebar-ink)",
        background: active ? "var(--sidebar-active)" : "transparent",
        fontSize: 13,
        fontWeight: bold || active ? 500 : 400,
        transition: "background var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease)",
      }}
    >
      <span style={{ color: active ? "var(--sidebar-ink-active)" : "var(--sidebar-ink-dim)", display: "inline-flex" }}>
        {icon}
      </span>
      <span style={{ flex: 1 }}>{label}</span>
      {trailing}
    </span>
  );
  if (href) {
    return (
      <Link href={href} style={{ display: "block" }}>
        {inner}
      </Link>
    );
  }
  return <div style={{ cursor: "default" }}>{inner}</div>;
}
