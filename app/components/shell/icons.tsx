import type { SVGProps } from "react";

const base: SVGProps<SVGSVGElement> = {
  width: 16,
  height: 16,
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function HomeIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M2.5 7L8 2.5 13.5 7v6a1 1 0 0 1-1 1H3.5a1 1 0 0 1-1-1V7Z" />
      <path d="M6.5 14V9.5h3V14" />
    </svg>
  );
}

export function CustomersIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <rect x="3" y="2.5" width="10" height="11" rx="1.2" />
      <path d="M5.5 5.5h5M5.5 8h5M5.5 10.5h3" />
    </svg>
  );
}

export function InvoicingIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M4 2.5h6.5L12.5 4.5V13a.5.5 0 0 1-.5.5H4A.5.5 0 0 1 3.5 13V3a.5.5 0 0 1 .5-.5Z" />
      <path d="M5.5 6.5h5M5.5 9h5M5.5 11.5h3" />
    </svg>
  );
}

export function RevenueIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <circle cx="8" cy="8" r="5.5" />
      <path d="M8 4.5V8l2.2 1.6" />
    </svg>
  );
}

export function ContractIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M3.5 2.5h6L12.5 5.5V13a.5.5 0 0 1-.5.5H3.5a.5.5 0 0 1-.5-.5V3a.5.5 0 0 1 .5-.5Z" />
      <path d="M9.5 2.5V5.5h3" />
      <path d="M5.5 8.5h5M5.5 10.5h5" />
    </svg>
  );
}

export function ReportingIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M2.5 13.5h11" />
      <rect x="3.5" y="8" width="2" height="4.5" rx="0.3" />
      <rect x="7" y="5" width="2" height="7.5" rx="0.3" />
      <rect x="10.5" y="2.5" width="2" height="10" rx="0.3" />
    </svg>
  );
}

export function DataIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <ellipse cx="8" cy="3.5" rx="5" ry="1.5" />
      <path d="M3 3.5v5c0 .8 2.2 1.5 5 1.5s5-.7 5-1.5v-5" />
      <path d="M3 8.5v4c0 .8 2.2 1.5 5 1.5s5-.7 5-1.5v-4" />
    </svg>
  );
}

export function IntegrationsIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <rect x="2.5" y="2.5" width="5" height="5" rx="0.8" />
      <rect x="8.5" y="8.5" width="5" height="5" rx="0.8" />
      <path d="M7.5 5h3a1 1 0 0 1 1 1v2.5" />
    </svg>
  );
}

export function SettingsIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <circle cx="8" cy="8" r="2" />
      <path d="M8 1.5v1.6M8 12.9v1.6M2.6 5l1.4.8M12 10.2l1.4.8M2.6 11l1.4-.8M12 5.8l1.4-.8" />
    </svg>
  );
}

export function ChevronDown(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M4 6.5 8 10.5l4-4" />
    </svg>
  );
}

export function ChevronRight(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M6 4l4 4-4 4" />
    </svg>
  );
}

export function CollapseIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <rect x="2.5" y="3" width="11" height="10" rx="1.2" />
      <path d="M6 3v10" />
    </svg>
  );
}

export function SearchIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <circle cx="7" cy="7" r="4" />
      <path d="m10 10 3 3" />
    </svg>
  );
}

export function CalendarIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <rect x="2.5" y="3.5" width="11" height="10" rx="1.2" />
      <path d="M2.5 6.5h11M5.5 2.5v2M10.5 2.5v2" />
    </svg>
  );
}

export function FilterIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M2.5 4h11M4.5 8h7M6.5 12h3" />
    </svg>
  );
}

export function HelpIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <circle cx="8" cy="8" r="5.5" />
      <path d="M6.5 6.5a1.5 1.5 0 0 1 3 0c0 1-1.5 1-1.5 2" />
      <circle cx="8" cy="11" r="0.5" fill="currentColor" />
    </svg>
  );
}

export function LogoutIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M9.5 2.5h3a.5.5 0 0 1 .5.5v10a.5.5 0 0 1-.5.5h-3" />
      <path d="M2.5 8h7.5M7.5 5l3 3-3 3" />
    </svg>
  );
}

export function PlusIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M8 3.5v9M3.5 8h9" />
    </svg>
  );
}
