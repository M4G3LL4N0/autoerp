import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoERP — operating-map planner",
  description: "A browser planner that maps where finance, HR, procurement, and inventory stall. Estimates are sketches, not audited results.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-full bg-[#070d18] text-slate-100">
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
