import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gap-Intel CRM — Precision / Kladius",
  description: "Scored weak-digital SME leads, brokers & buyers, funding, and the two-doorway playbook.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
