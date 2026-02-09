"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import { Blobs } from "@/components/Blobs";
import { SiteHeader } from "@/components/SiteHeader";
import { PageHero } from "@/components/PageHero";
import { PageTransition } from "@/components/PageTransition";

const MINISTRY_LEADERS_API = "/api/ministry-leaders";

type MinistryLeadersResponse = { leaderImages?: Record<string, string> };

const fetcher = (url: string) =>
  fetch(url).then((res) => res.json()) as Promise<MinistryLeadersResponse>;

function ministryInitials(titulo: string): string {
  const parts = titulo.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return titulo.slice(0, 2).toUpperCase() || "?";
}

type LeaderData = {
  name: string;
  imageUrl: string;
};

type MinisterioData = {
  titulo: string;
  slug: string;
  descricao: string;
  verse: string;
  verseRef: string;
  leaders: Array<{ name: string }>;
};

const MINISTERIOS: MinisterioData[] = [
  {
    titulo: "Crianças",
    slug: "kids",
    descricao: "Ministério que cuida e discípula as crianças, ensinando a Palavra de forma lúdica e acessível para cada faixa etária. Atividades, histórias bíblicas e momentos de adoração pensados para que os pequenos conheçam a Jesus e cresçam na fé desde cedo.",
    verse: "Deixai vir a mim os pequeninos e não os impeçais.",
    verseRef: "Mateus 19.14",
    leaders: [{ name: "Thamires Tavares" }],
  },
  {
    titulo: "Juventude",
    slug: "youth",
    descricao: "Espaço para jovens crescerem na fé, se conectarem e servirem. Encontros, estudos bíblicos e eventos pensados para essa fase da vida. Um lugar de identidade, amizade e propósito, onde a juventude é desafiada a viver o Evangelho no dia a dia.",
    verse: "Ninguém te despreze por seres jovem; pelo contrário, torna-te padrão dos fiéis.",
    verseRef: "1 Timóteo 4.12",
    leaders: [{ name: "Matheus Madureira" }],
  },
  {
    titulo: "Louvor",
    slug: "worship",
    descricao: "Responsável pela música e adoração nos cultos. Uma equipe dedicada a levar a congregação a experimentar a presença de Deus por meio do canto e dos instrumentos. Ensaios, preparação do coração e entrega para que cada momento seja de glorificação ao Senhor.",
    verse: "Cantai ao Senhor um cântico novo; cantai ao Senhor, toda a terra.",
    verseRef: "Salmos 96.1",
    leaders: [{ name: "Douglas Mitidiere" }],
  },
  {
    titulo: "Intercessão",
    slug: "intercession",
    descricao: "Grupo de oração e clamor que intercede pela igreja, pelas famílias e pelas necessidades trazidas à comunhão. Reuniões de oração, vigílias e apoio pastoral em momentos de luta. Quem intercede carrega o outro no coração e na presença de Deus.",
    verse: "Confessai, pois, os vossos pecados uns aos outros e orai uns pelos outros.",
    verseRef: "Tiago 5.16",
    leaders: [{ name: "Vanessa Fabro" }],
  },
  {
    titulo: "Homens",
    slug: "men",
    descricao: "Encontros e atividades que fortalecem os homens na fé, no caráter e no serviço. Um espaço de comunhão e crescimento, onde a masculinidade é edificada à luz da Palavra. Desafios, estudos e amizade para que cada homem seja líder em casa e na igreja.",
    verse: "Sê forte e corajoso; não temas nem te espantes, porque o Senhor teu Deus é contigo.",
    verseRef: "Josué 1.9",
    leaders: [{ name: "Ruy Gadelha" }],
  },
  {
    titulo: "Mulheres",
    slug: "women",
    descricao: "Ministério que reúne as mulheres para comunhão, oração e edificação mútua. Eventos e estudos voltados para essa vivência, com espaço para compartilhar, acolher e crescer juntas. Um lugar onde a identidade em Cristo e o serviço se encontram.",
    verse: "A mulher virtuosa é a coroa do seu marido.",
    verseRef: "Provérbios 12.4",
    leaders: [{ name: "Dilcineia Drumound" }],
  },
  {
    titulo: "Família",
    slug: "family",
    descricao: "Espaço para fortalecer laços familiares à luz da Palavra. Encontros e atividades que valorizam o lar e a convivência, com orientação para casais, pais e filhos. O objetivo é que cada família seja um lugar de graça, perdão e testemunho do amor de Deus.",
    verse: "Eu e a minha casa serviremos ao Senhor.",
    verseRef: "Josué 24.15",
    leaders: [{ name: "André Lourenço" }, { name: "Andressa Droumound" }],
  },
  {
    titulo: "Mídia",
    slug: "media",
    descricao: "Equipe responsável pela divulgação, transmissões e comunicação visual. Leva a mensagem da igreja por meio dos canais digitais, redes sociais e transmissões ao vivo. Cada post, vídeo e arte é uma oportunidade de alcançar vidas e glorificar a Deus.",
    verse: "Anunciai entre as nações a sua glória, entre todos os povos as suas maravilhas.",
    verseRef: "1 Crônicas 16.24",
    leaders: [{ name: "Andressa Droumound" }],
  },
];

function VerseBlock({ verse, verseRef }: { verse: string; verseRef: string }) {
  return (
    <blockquote className="flex gap-3">
      <span
        className="shrink-0 w-px bg-ivida-red/50 rounded-full min-h-[2.5rem]"
        aria-hidden
      />
      <div className="min-w-0">
        <p className="text-white/60 text-sm sm:text-[0.9375rem] leading-relaxed italic">
          &ldquo;{verse}&rdquo;
        </p>
        <cite className="not-italic text-[11px] sm:text-xs text-white/40 mt-1 block">
          {verseRef}
        </cite>
      </div>
    </blockquote>
  );
}

type MinistryCardProps = {
  titulo: string;
  slug: string;
  descricao: string;
  verse: string;
  verseRef: string;
  leaders: LeaderData[];
  /** true enquanto as URLs das imagens ainda estão sendo carregadas (evita mostrar "sem imagem") */
  imagesLoading?: boolean;
};

function LeadersBlock({ leaders }: { leaders: LeaderData[] }) {
  const singleName = leaders.length === 0 ? "—" : leaders[0].name;

  return (
    <div className="space-y-1.5">
      <p className="text-[11px] uppercase tracking-wider text-white/45">
        LÍDER
      </p>
      {leaders.length > 1 ? (
        <div className="space-y-0.5">
          {leaders.map((leader) => (
            <p
              key={leader.name}
              className="text-base sm:text-lg font-semibold text-white leading-snug"
            >
              {leader.name}
            </p>
          ))}
        </div>
      ) : (
        <p className="text-base sm:text-lg font-semibold text-white leading-snug">
          {singleName}
        </p>
      )}
    </div>
  );
}

function MinistryCard({ titulo, slug, descricao, verse, verseRef, leaders, imagesLoading = false }: MinistryCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const primaryImageUrl = leaders[0]?.imageUrl ?? "";
  const hasImage = Boolean(primaryImageUrl?.trim());
  const showImage = hasImage && !imageError;
  const initials = ministryInitials(titulo);

  useEffect(() => {
    setImageLoaded(false);
  }, [primaryImageUrl]);

  return (
    <article
      className="group relative rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg overflow-hidden flex flex-col md:flex-row transition-all duration-200 hover:shadow-xl hover:border-white/20 hover:bg-white/[0.07] focus-within:ring-2 focus-within:ring-ivida-red/40 focus-within:ring-offset-2 focus-within:ring-offset-[#121212]"
      tabIndex={0}
    >
      {/* Coluna esquerda — media frame */}
      <div
        className="relative shrink-0 w-full md:w-[260px] md:min-w-[220px] md:max-w-[280px] min-h-[200px] md:min-h-0 md:self-stretch flex items-center justify-center rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none border-b md:border-b-0 md:border-r border-white/[0.08] overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(35, 33, 33, 0.9) 0%, rgba(22, 21, 21, 1) 50%, rgba(12, 12, 12, 1) 100%)",
        }}
      >
        {imagesLoading ? (
          <div className="w-full h-full flex items-center justify-center animate-pulse" aria-hidden>
            <div className="w-20 h-20 rounded-full bg-white/10" />
          </div>
        ) : showImage ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center animate-pulse" aria-hidden>
                <div className="w-20 h-20 rounded-full bg-white/10" />
              </div>
            )}
            <Image
              src={primaryImageUrl}
              alt={`Líder do ministério ${titulo}`}
              width={400}
              height={400}
              className={`w-full h-full object-contain object-center transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-white/40">
            <span className="text-4xl font-semibold" aria-hidden>
              {initials}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-60"
              aria-hidden
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
      </div>

      {/* Coluna direita — content: coluna estruturada com espaçamento equilibrado */}
      <div className="flex flex-col flex-1 min-w-0 h-full p-4 sm:p-5 gap-3 sm:gap-4">
        {/* Bloco: Título */}
        <div className="shrink-0">
          <h3 className="text-lg font-semibold text-white tracking-tight">
            {titulo}
          </h3>
          <div className="w-7 h-0.5 bg-ivida-red/80 rounded-full mt-1.5 sm:mt-2 mb-0" aria-hidden />
        </div>

        {/* Bloco: Descrição — margem média abaixo */}
        <p className="text-white/70 leading-relaxed text-[0.97rem] shrink-0">
          {descricao}
        </p>

        {/* Bloco: Versículo — respiro espiritual, mais espaço acima e abaixo */}
        <div className="my-2 sm:my-4 shrink-0">
          <VerseBlock verse={verse} verseRef={verseRef} />
        </div>

        {/* Bloco: Líder — fechamento natural do card */}
        <div className="mt-2 sm:mt-4 shrink-0">
          <LeadersBlock leaders={leaders} />
        </div>
      </div>
    </article>
  );
}

const SWR_OPTIONS = {
  revalidateOnFocus: false,
  revalidateIfStale: true,
  dedupingInterval: 60 * 60 * 1000, // 1h: evita refetch desnecessário ao navegar
  revalidateOnReconnect: true,
};

export default function MinisteriosPage() {
  const { data, isValidating } = useSWR<MinistryLeadersResponse>(MINISTRY_LEADERS_API, fetcher, SWR_OPTIONS);
  const leaderImages = data?.leaderImages && typeof data.leaderImages === "object" ? data.leaderImages : {};
  const imagesLoading = !data && isValidating;

  const buildLeaders = (m: MinisterioData): LeaderData[] => {
    const imageUrl = leaderImages[m.slug] ?? "";
    return m.leaders.map((l) => ({ name: l.name, imageUrl }));
  };

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
          <div className="max-w-[900px] mx-auto">
            <PageHero
              title="Ministérios"
              subtitle="Servindo juntos com nossos dons e talentos"
              className="mb-16 sm:mb-20"
            />

            <p className="text-white/80 leading-relaxed text-center max-w-2xl mx-auto mb-16">
              Na IVIDA, cada ministério é uma expressão do amor e do serviço. Descubra onde
              você pode se envolver e fazer parte desta família.
            </p>

            <div className="grid grid-cols-1 gap-6">
              {MINISTERIOS.map((m) => (
                <MinistryCard
                  key={m.slug}
                  titulo={m.titulo}
                  slug={m.slug}
                  descricao={m.descricao}
                  verse={m.verse}
                  verseRef={m.verseRef}
                  leaders={buildLeaders(m)}
                  imagesLoading={imagesLoading}
                />
              ))}
            </div>

            <div className="mt-16 text-center">
              <p className="text-white/70 mb-4">
                Quer participar de algum ministério?
              </p>
              <Link
                href="/contato"
                className="inline-flex items-center justify-center py-3 px-6 rounded-xl text-white font-medium bg-ivida-red hover:bg-ivida-redhover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ivida-red/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]"
              >
                Fale conosco
              </Link>
            </div>
          </div>
        </div>
      </PageTransition>
    </main>
  );
}
