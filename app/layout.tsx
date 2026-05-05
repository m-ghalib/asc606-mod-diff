import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "Diff — ASC 606 Mod-Diff Visualizer",
  description:
    "Auditor-grade overlay for ASC 606 contract amendments: diff, schedule impact, close memo, PBC bundle.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="darkreader-lock" />
        <meta name="color-scheme" content="light only" />
      </head>
      <body>{children}</body>
    </html>
  );
}
