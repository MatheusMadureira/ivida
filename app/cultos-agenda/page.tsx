"use client";

import Link from "next/link";
import { Blobs } from "@/components/Blobs";
import { SiteHeader } from "@/components/SiteHeader";
import { PageHero } from "@/components/PageHero";
import { PageTransition } from "@/components/PageTransition";
import { ScheduleSection } from "@/components/ScheduleSection";

const PROGRAMACAO = [
  {
    dia: "Domingo",
    itens: [
      { horario: "8:00", nome: "Consagração" },
      { horario: "9:30", nome: "Curso de Bíblia" },
      { horario: "17:30", nome: "Culto de Louvor e Adoração" },
    ],
  },
  {
    dia: "Segunda-feira",
    itens: [{ horario: "—", nome: "Sem programação fixa" }],
  },
  {
    dia: "Terça-feira",
    itens: [{ horario: "19:00", nome: "Curso de Teologia" }],
  },
  {
    dia: "Quarta-feira",
    itens: [{ horario: "19:30", nome: "Quarta-feira profética" }],
  },
  {
    dia: "Quinta-feira",
    itens: [{ horario: "—", nome: "Sem programação fixa" }],
  },
  {
    dia: "Sexta-feira",
    itens: [{ horario: "—", nome: "Sem programação fixa" }],
  },
] as const;

export default function CultosAgendaPage() {
  return (
    <main
      className="min-h-screen w-full flex flex-col relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 90% 80% at 50% 0%, rgba(40, 38, 38, 0.6) 0%, rgb(22, 21, 21) 45%, rgb(18, 17, 17) 100%)",
      }}
    >
      <Blobs />

      {/* Vinheta sutil global */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,transparent_60%,rgba(0,0,0,0.15)_100%)]" aria-hidden />

      <SiteHeader />

      <PageTransition>
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center w-full min-w-0 py-12 sm:py-16">
        <div className="w-full max-w-[1100px] mx-auto px-6">
            <PageHero
              title="Cultos & Agenda"
              subtitle="Programação semanal da IVIDA"
              className="mb-16 sm:mb-20"
            />

            <ScheduleSection
              title="Programação semanal"
              days={PROGRAMACAO}
            />
        </div>
      </div>
      </PageTransition>
    </main>
  );
}
