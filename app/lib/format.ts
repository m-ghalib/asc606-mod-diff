export function money(cents: number, opts: { sign?: boolean } = {}): string {
  const sign = opts.sign && cents > 0 ? "+" : "";
  const negative = cents < 0;
  const dollars = Math.round(Math.abs(cents) / 100);
  return `${negative ? "−" : sign}$${dollars.toLocaleString("en-US")}`;
}

export function percent(ratio: number, digits = 1): string {
  return `${(ratio * 100).toFixed(digits)}%`;
}

export function deltaSign(value: number): string {
  if (value === 0) return "0";
  return value > 0 ? `+${value.toLocaleString("en-US")}` : `−${Math.abs(value).toLocaleString("en-US")}`;
}

export function isoDate(d: string): string {
  return d;
}

export function shortDate(d: string): string {
  const date = new Date(d + "T00:00:00Z");
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function timestamp(iso: string): string {
  const d = new Date(iso);
  const date = d.toISOString().slice(0, 10);
  const time = d.toISOString().slice(11, 16);
  return `${date} ${time}Z`;
}
