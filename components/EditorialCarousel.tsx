"use client";

import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

export type CarouselSlide =
  | { src: string; alt: string; caption?: string }
  | { placeholder: true; label: string };

function pathToAlt(src: string): string {
  const name = src.split("/").pop() ?? "";
  return name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ").trim() || "Imagem";
}

type Props = {
  fetchUrl?: string | null;
  initialSlides: CarouselSlide[];
  title?: string;
  subtitle?: string;
  /** Classe para ring de foco nos botões (ex: "focus-visible:ring-ivida-red/40" ou "focus-visible:ring-[var(--iforte-blue)]") */
  buttonRingClass?: string;
  /** Classe do container (ex: max-w-5xl) */
  containerClassName?: string;
};

const PLACEHOLDER_EMPTY: CarouselSlide = { placeholder: true, label: "Em breve" };

/** Cache por fetchUrl: mostra galeria já carregada na hora; revalida em background e atualiza se houver novas imagens. */
const imageListCache: Record<string, string[]> = {};

function slidesFromUrls(urls: string[]): CarouselSlide[] {
  return urls.map((src) => ({ src, alt: pathToAlt(src) }));
}

export function EditorialCarousel({
  fetchUrl = null,
  initialSlides,
  title,
  subtitle,
  buttonRingClass = "focus-visible:ring-ivida-red/40",
  containerClassName = "w-full max-w-5xl mx-auto px-4 sm:px-6",
}: Props) {
  const [slides, setSlides] = useState<CarouselSlide[]>(() => {
    if (fetchUrl && imageListCache[fetchUrl]?.length) {
      return slidesFromUrls(imageListCache[fetchUrl]);
    }
    return initialSlides;
  });
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [trackOffset, setTrackOffset] = useState<0 | 1 | 2>(1);
  const [carouselDirection, setCarouselDirection] = useState<"prev" | "next" | null>(null);
  const [carouselTransitionOff, setCarouselTransitionOff] = useState(false);
  const [lightboxSlide, setLightboxSlide] = useState<{ src: string; alt: string } | null>(null);
  const [visible, setVisible] = useState(false);
  const [imageStateBySrc, setImageStateBySrc] = useState<Record<string, "loading" | "loaded" | "error">>({});
  const [imageRetryBySrc, setImageRetryBySrc] = useState<Record<string, number>>({});
  const sectionRef = useRef<HTMLElement>(null);
  const carouselTrackRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const getImageSrcWithRetry = (src: string) => {
    const retry = imageRetryBySrc[src] ?? 0;
    if (retry === 0) return src;
    const sep = src.includes("?") ? "&" : "?";
    return `${src}${sep}_retry=${retry}`;
  };

  const handleMobileImageLoad = (src: string) => {
    if (process.env.NODE_ENV === "development") {
      console.log("[Carousel] onLoad", { src });
    }
    setImageStateBySrc((prev) => ({ ...prev, [src]: "loaded" }));
  };

  const handleMobileImageError = (src: string, e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (process.env.NODE_ENV === "development") {
      console.log("[Carousel] onError", { src, error: e });
    }
    setImageStateBySrc((prev) => ({ ...prev, [src]: "error" }));
  };

  const handleMobileImageRetry = (src: string) => {
    setImageRetryBySrc((prev) => ({ ...prev, [src]: (prev[src] ?? 0) + 1 }));
    setImageStateBySrc((prev) => ({ ...prev, [src]: "loading" }));
  };

  useEffect(() => {
    if (!fetchUrl) return;
    const loadImages = () => {
      fetch(fetchUrl)
        .then((res) => res.json())
        .then((data: { images: string[] }) => {
          if (data.images?.length > 0) {
            imageListCache[fetchUrl] = data.images;
            setSlides(slidesFromUrls(data.images));
            setCarouselIndex(0);
          }
        })
        .catch(() => {});
    };
    loadImages();
  }, [fetchUrl, visible]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const images = slides.length > 0 ? slides : [PLACEHOLDER_EMPTY];
  const n = images.length;
  const activeIndex = slides.length > 0 ? carouselIndex % n : 0;
  const isAnimating = carouselDirection !== null;

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const slide = images[activeIndex];
    if (slide && "src" in slide) {
      const status = imageStateBySrc[slide.src] ?? "loading";
      console.log("[Carousel] slide ativo (mobile)", { src: slide.src, status });
    }
  }, [activeIndex, images, imageStateBySrc]);

  const goPrev = () => {
    if (n <= 0 || isAnimating) return;
    setCarouselDirection("prev");
    setTrackOffset(0);
  };
  const goNext = () => {
    if (n <= 0 || isAnimating) return;
    setCarouselDirection("next");
    setTrackOffset(2);
  };

  const handleCarouselTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== carouselTrackRef.current || e.propertyName !== "transform") return;
    if (carouselDirection === "prev") {
      setCarouselIndex((i) => (i - 1 + n) % n);
    } else if (carouselDirection === "next") {
      setCarouselIndex((i) => (i + 1) % n);
    }
    setCarouselDirection(null);
    setCarouselTransitionOff(true);
    setTrackOffset(1);
  };

  useEffect(() => {
    if (!carouselTransitionOff) return;
    const track = carouselTrackRef.current;
    const id = requestAnimationFrame(() => {
      void track?.offsetHeight;
      requestAnimationFrame(() => setCarouselTransitionOff(false));
    });
    return () => cancelAnimationFrame(id);
  }, [carouselTransitionOff]);

  return (
    <>
      <section
        ref={sectionRef}
        className={`relative z-10 py-16 sm:py-20 border-t border-white/[0.06] transition-all duration-700 ease-out ${visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
        aria-label={title || "Galeria"}
      >
        <div className={containerClassName}>
          {(title || subtitle) && (
            <div className="text-center mb-8">
              {title && <h2 className="text-lg font-medium text-white/90 tracking-tight">{title}</h2>}
              {subtitle && (
                <p className={`text-sm text-white/40 tracking-wide ${title ? "mt-1" : ""}`}>{subtitle}</p>
              )}
            </div>
          )}

          <div className="relative z-20 flex items-center justify-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => (typeof window !== "undefined" && window.innerWidth < 640 ? setCarouselIndex((i) => (i - 1 + n) % n) : goPrev())}
              disabled={isAnimating}
              className={`flex shrink-0 w-10 h-10 items-center justify-center rounded-full text-white/40 hover:text-white/80 hover:bg-white/5 transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 ${buttonRingClass} disabled:opacity-50 disabled:pointer-events-none`}
              aria-label="Imagem anterior"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            </button>

            <div className="flex-1 min-w-0 w-full max-w-5xl">
              <div className="relative w-full aspect-[3/4] sm:aspect-video">
                <div
                  className="sm:hidden relative w-full h-full rounded-2xl overflow-hidden border border-white/[0.06] touch-pan-y"
                  style={{ background: "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(0,0,0,0.25), rgba(0,0,0,0.4))" }}
                  onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
                  onTouchEnd={(e) => {
                    if (touchStartX.current == null) return;
                    const dx = e.changedTouches[0].clientX - touchStartX.current;
                    touchStartX.current = null;
                    if (Math.abs(dx) < 50) return;
                    if (dx > 0) setCarouselIndex((i) => (i - 1 + n) % n);
                    else setCarouselIndex((i) => (i + 1) % n);
                  }}
                >
                  {(() => {
                    const slide = images[activeIndex];
                    const isPlaceholder = "placeholder" in slide && slide.placeholder;
                    if (isPlaceholder) {
                      return (
                        <div
                          key={activeIndex}
                          className={`absolute inset-0 z-0 carousel-slide-in`}
                        >
                          <div className="w-full h-full bg-gradient-to-br from-white/[0.06] to-white/[0.02] flex items-center justify-center">
                            <span className="text-white/30 text-sm tracking-widest uppercase">{slide.label}</span>
                          </div>
                        </div>
                      );
                    }
                    if (!("src" in slide)) return null;
                    const src = slide.src;
                    const status = imageStateBySrc[src] ?? "loading";
                    const retryCount = imageRetryBySrc[src] ?? 0;
                    const displaySrc = getImageSrcWithRetry(src);
                    return (
                      <div
                        key={`${activeIndex}-${src}-${retryCount}`}
                        className="absolute inset-0 z-0 carousel-slide-in cursor-pointer"
                        role="button"
                        tabIndex={0}
                        onClick={() => status === "loaded" && setLightboxSlide({ src: slide.src, alt: slide.alt })}
                        onKeyDown={(e) => {
                          if (status === "loaded" && (e.key === "Enter" || e.key === " ")) {
                            e.preventDefault();
                            setLightboxSlide({ src: slide.src, alt: slide.alt });
                          }
                        }}
                      >
                        <div className="absolute inset-0 z-0 w-full h-full relative">
                          <Image
                            key={displaySrc}
                            src={displaySrc}
                            alt={slide.alt}
                            fill
                            sizes="100vw"
                            className={`object-contain object-center pointer-events-none transition-opacity duration-200 ${status === "loaded" ? "opacity-100" : "opacity-0"}`}
                            onLoad={() => handleMobileImageLoad(src)}
                            onError={(e) => handleMobileImageError(src, e)}
                          />
                        </div>
                        {status === "loading" && (
                          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20" aria-hidden>
                            <div className="h-24 w-3/4 max-w-[200px] animate-pulse rounded-xl bg-white/10" />
                          </div>
                        )}
                        {status === "error" && (
                          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-black/20 p-4">
                            <svg className="h-12 w-12 shrink-0 text-white/40" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                            </svg>
                            <p className="text-center text-sm text-white/70">Imagem indisponível</p>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleMobileImageRetry(src); }}
                              className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                            >
                              Recarregar
                            </button>
                          </div>
                        )}
                        <div className="pointer-events-none absolute inset-0 z-[5] bg-gradient-to-t from-black/30 via-transparent to-transparent" aria-hidden />
                      </div>
                    );
                  })()}
                </div>

                <div className="hidden sm:block relative w-full max-w-6xl mx-auto h-full overflow-hidden rounded-2xl">
                  <div
                    ref={carouselTrackRef}
                    className="flex h-full"
                    style={{
                      width: "166.667%",
                      willChange: "transform",
                      backfaceVisibility: "hidden",
                      transform: `translateX(${trackOffset === 0 ? "0" : trackOffset === 1 ? "-20" : "-40"}%) translateZ(0)`,
                      transition: carouselTransitionOff ? "none" : "transform 450ms cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                    onTransitionEnd={handleCarouselTransitionEnd}
                  >
                    {[-2, -1, 0, 1, 2].map((offset) => {
                      const slide = images[(activeIndex + offset + n) % n];
                      const isPlaceholderSlide = "placeholder" in slide && slide.placeholder;
                      const trackIndex = offset + 2;
                      const centerTrackIndex = trackOffset + 1;
                      const isCenter = trackIndex === centerTrackIndex;
                      const scale = isCenter ? 1 : 0.9;
                      const opacity = isCenter ? 1 : 0.65;
                      return (
                        <div
                          key={`track-${offset}`}
                          className="flex-[0_0_20%] h-full px-2 flex items-center justify-center shrink-0"
                          style={{
                            transform: `scale(${scale})`,
                            opacity,
                            transition: carouselTransitionOff
                              ? "none"
                              : "transform 450ms cubic-bezier(0.22, 1, 0.36, 1), opacity 450ms cubic-bezier(0.22, 1, 0.36, 1)",
                          }}
                        >
                          <div
                            className={`w-full h-full rounded-xl overflow-hidden bg-white/[0.03] border border-white/[0.06] relative cursor-pointer ${isCenter ? "ring-2 ring-white/20 ring-offset-2 ring-offset-[#121212] shadow-[0_12px_40px_rgba(0,0,0,0.35)]" : ""}`}
                            style={{ willChange: "transform", transform: "translateZ(0)" }}
                            role={isPlaceholderSlide ? undefined : "button"}
                            tabIndex={isPlaceholderSlide ? undefined : 0}
                            onClick={() => { if (!isPlaceholderSlide && "src" in slide) setLightboxSlide({ src: slide.src, alt: slide.alt }); }}
                            onKeyDown={(e) => { if (!isPlaceholderSlide && "src" in slide && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); setLightboxSlide({ src: slide.src, alt: slide.alt }); } }}
                          >
                            {isPlaceholderSlide ? (
                              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] to-white/[0.02] flex items-center justify-center">
                                <span className="text-white/30 text-sm tracking-widest uppercase">{slide.label}</span>
                              </div>
                            ) : "src" in slide ? (
                              <>
                                <div className="absolute inset-0 w-full h-full relative">
                                  <Image
                                    src={slide.src}
                                    alt={slide.alt}
                                    fill
                                    sizes="(max-width: 640px) 100vw, 340px"
                                    className="object-cover min-w-0 min-h-0 pointer-events-none"
                                  />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" aria-hidden />
                              </>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => (typeof window !== "undefined" && window.innerWidth < 640 ? setCarouselIndex((i) => (i + 1) % n) : goNext())}
              disabled={isAnimating}
              className={`flex shrink-0 w-10 h-10 items-center justify-center rounded-full text-white/40 hover:text-white/80 hover:bg-white/5 transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 ${buttonRingClass} disabled:opacity-50 disabled:pointer-events-none`}
              aria-label="Próxima imagem"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
            </button>
          </div>
        </div>
      </section>

      {lightboxSlide && typeof document !== "undefined" && createPortal(
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 overflow-hidden"
          onClick={() => setLightboxSlide(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Visualização da imagem"
        >
          <button
            type="button"
            onClick={() => setLightboxSlide(null)}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full text-white/80 hover:bg-white/10 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            aria-label="Fechar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
          <div className="flex items-center justify-center min-w-0 min-h-0 max-w-full max-h-full">
            <img
              src={lightboxSlide.src}
              alt={lightboxSlide.alt}
              className="max-h-[calc(100vh-2rem)] max-w-[calc(100vw-2rem)] w-auto h-auto object-contain"
              onClick={(e) => e.stopPropagation()}
              draggable={false}
            />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
