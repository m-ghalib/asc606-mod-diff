import { notFound } from "next/navigation";
import { acmeContract, findAmendment } from "@/lib/gold-contract";
import { AppShell, Breadcrumb } from "@/components/shell/app-shell";
import { ContractHero } from "@/components/contract-hero";
import { ContractTimeline } from "@/components/contract-timeline";
import { DiffWorkspace } from "@/components/diff-workspace";
import { MasterOverview } from "@/components/master-overview";
import { HelpIcon, SearchIcon } from "@/components/shell/icons";

type SP = { mod?: string };

export default async function ContractPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SP>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  if (slug !== acmeContract.slug) notFound();

  const amendment = findAmendment(sp.mod);

  const trail: { label: string; href?: string; current?: boolean }[] = [
    { label: "Revenue" },
    { label: "Contract diffs", href: "/contracts/acme" },
    {
      label: "Acme Corp",
      href: "/contracts/acme",
      current: !amendment,
    },
  ];
  if (amendment) {
    trail.push({
      label: `MOD-${String(amendment.number).padStart(3, "0")} · ${amendment.shortTitle}`,
      current: true,
    });
  }

  return (
    <AppShell
      breadcrumb={<Breadcrumb trail={trail} />}
      trailing={
        <>
          <button aria-label="Search" style={iconBtn}>
            <SearchIcon />
          </button>
          <button aria-label="Help" style={iconBtn}>
            <HelpIcon />
          </button>
        </>
      }
    >
      <div style={{ padding: "8px 32px 64px" }}>
        <ContractHero amendment={amendment} />
        <ContractTimeline selected={amendment ? amendment.number : null} />
        {amendment ? <DiffWorkspace amendment={amendment} /> : <MasterOverview />}
      </div>
    </AppShell>
  );
}

const iconBtn: React.CSSProperties = {
  width: 32,
  height: 32,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--ink-2)",
  borderRadius: 8,
  border: "1px solid var(--border)",
  background: "var(--surface)",
};
