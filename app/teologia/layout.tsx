"use client";

import "./iforte.css";
import { PageTransition } from "@/components/PageTransition";
import { SiteHeader, TeologiaLogo } from "@/components/SiteHeader";

export default function TeologiaLayout({ children }: { children: React.ReactNode }) {
  return (
    <main
      data-theme="iforte"
      className="min-h-screen w-full flex flex-col relative overflow-hidden"
      style={{
        background: "radial-gradient(ellipse 90% 80% at 50% 0%, rgba(40, 38, 38, 0.5) 0%, rgb(22, 21, 21) 45%, rgb(18, 17, 17) 100%)",
      }}
    >
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,transparent_60%,rgba(0,0,0,0.15)_100%)]" aria-hidden />

      <SiteHeader left={<TeologiaLogo />} />

      <div className="relative z-10 flex-1 iforte-scope min-h-full">
        <PageTransition>{children}</PageTransition>
      </div>
    </main>
  );
}
