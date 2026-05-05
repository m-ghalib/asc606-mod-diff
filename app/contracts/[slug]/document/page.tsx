import { notFound } from "next/navigation";
import Link from "next/link";
import { acmeContract } from "@/lib/gold-contract";
import { acmeMasterDocument } from "@/lib/contract-document";
import { AppShell, Breadcrumb } from "@/components/shell/app-shell";
import { HelpIcon, SearchIcon } from "@/components/shell/icons";

export default async function ContractDocumentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (slug !== acmeContract.slug) notFound();

  const doc = acmeMasterDocument;

  const trail = [
    { label: "Revenue" },
    { label: "Contract diffs", href: "/contracts/acme" },
    { label: "Acme Corp", href: "/contracts/acme" },
    { label: "Source contract", current: true },
  ];

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
      <div style={{ padding: "8px 32px 64px", display: "flex", justifyContent: "center" }}>
        <article
          style={{
            width: "100%",
            maxWidth: 760,
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <header style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontSize: 12, color: "var(--ink-3)" }}>
              {doc.documentNumber} · effective {doc.effectiveDate}
            </div>
            <h1 className="display-1" style={{ margin: 0 }}>
              {doc.title}
            </h1>
            <div style={{ fontSize: 13, color: "var(--ink-2)", marginTop: 6 }}>
              Between {doc.parties.vendor} and {doc.parties.customer}.
            </div>
            <div
              style={{
                marginTop: 12,
                display: "flex",
                gap: 12,
                fontSize: 13,
              }}
            >
              <Link
                href={`/contracts/${acmeContract.slug}`}
                style={{ color: "var(--ink-2)" }}
              >
                ← Back to diff workspace
              </Link>
            </div>
          </header>

          <section
            className="card"
            style={{
              padding: "20px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            {doc.sections.map(s => (
              <DocSection key={s.id} section={s} />
            ))}
          </section>

          <p style={{ fontSize: 12, color: "var(--ink-3)", margin: 0 }}>
            This is a sample agreement seeded for the diff workspace demo. Section anchors of the
            form <code>#clause-cl_xxx</code> link clauses cited in the diff to the originating
            contract language.
          </p>
        </article>
      </div>
    </AppShell>
  );
}

function DocSection({ section }: { section: { id: string; clauseId: string | null; heading: string; body: string[] } }) {
  return (
    <section
      id={section.clauseId ? `clause-${section.clauseId}` : section.id}
      style={{ display: "flex", flexDirection: "column", gap: 8, scrollMarginTop: 80 }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
        <h2
          style={{
            margin: 0,
            fontSize: 16,
            fontWeight: 600,
            color: "var(--ink)",
            letterSpacing: "-0.005em",
          }}
        >
          {section.heading}
        </h2>
        {section.clauseId && (
          <span
            className="mono"
            style={{
              fontSize: 11,
              color: "var(--ink-3)",
              padding: "2px 8px",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-pill)",
              background: "var(--surface-2)",
            }}
          >
            {section.clauseId}
          </span>
        )}
      </div>
      {section.body.map((p, i) => (
        <p
          key={i}
          style={{
            margin: 0,
            fontSize: 14,
            lineHeight: 1.65,
            color: "var(--ink-2)",
          }}
        >
          {p}
        </p>
      ))}
    </section>
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
