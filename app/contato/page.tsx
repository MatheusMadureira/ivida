"use client";

import Link from "next/link";
import { Blobs } from "@/components/Blobs";
import { SiteHeader } from "@/components/SiteHeader";
import { PageHero } from "@/components/PageHero";
import { PageTransition } from "@/components/PageTransition";
import { SectionBlock } from "@/components/SectionBlock";

const ENDERECO = "R. Frei Veloso, 37 - Dr. Laureano, Duque de Caxias - RJ, 25051-260";
const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(ENDERECO);

function IconMapPin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export default function ContatoPage() {
  return (
    <main
      className="min-h-screen w-full flex flex-col relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 90% 80% at 50% 0%, rgba(40, 38, 38, 0.6) 0%, rgb(22, 21, 21) 45%, rgb(18, 17, 17) 100%)",
      }}
    >
      <Blobs />

      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,transparent_60%,rgba(0,0,0,0.15)_100%)]" aria-hidden />

      <SiteHeader />

      <PageTransition>
        <div className="relative z-10 flex-1 px-5 sm:px-6 py-12 sm:py-16 pb-20">
          <div className="max-w-[820px] mx-auto">
            <PageHero
              title="Contato"
              subtitle="Estamos à disposição para acolher você"
              className="mb-16 sm:mb-20"
            />

            <section className="mb-16 sm:mb-20" id="oracao">
              <h2 className="text-lg font-medium text-ivida-red tracking-tight mb-4">Pedido de oração</h2>
              <div className="w-12 h-0.5 bg-ivida-red/80 rounded-full mb-6" aria-hidden />
              <p className="text-white/80 leading-relaxed">
                Se você precisa de oração, envie seu pedido. Nossa equipe de intercessão
                está pronta para levar suas necessidades diante do Senhor.
              </p>
            </section>

            <SectionBlock title="Onde estamos" className="mb-16 sm:mb-20">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex items-start gap-3 shrink-0">
                  <IconMapPin className="w-5 h-5 text-ivida-red/80 mt-0.5 shrink-0" aria-hidden />
                  <div>
                    <p className="text-white/90 font-medium">IVIDA — Igreja Vivendo o Discipulado</p>
                    <p className="text-white/70 mt-1">{ENDERECO}</p>
                    <p className="text-white/60 text-sm mt-1">Domingos às 17:30 · Culto de Louvor e Adoração</p>
                  </div>
                </div>
                <Link
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center py-2.5 px-5 rounded-xl text-sm font-medium border border-ivida-red/40 text-white/90 hover:bg-ivida-red/10 transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]"
                >
                  Ver no mapa
                </Link>
              </div>
            </SectionBlock>

            <SectionBlock title="Fale conosco">
              <p>
                Para dúvidas, sugestões ou informações sobre a igreja, venha nos visitar
                em um de nossos cultos.
              </p>
            </SectionBlock>
          </div>
        </div>
      </PageTransition>
    </main>
  );
}
