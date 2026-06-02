import { useRef, useEffect, useCallback, useMemo, useState } from "react";
import {
  LuX,
  LuMonitor,
  LuCalendar,
  LuGamepad2,
  LuCpu,
  LuBookOpen,
  LuStar,
} from "react-icons/lu";

function ScrollDownIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 18062 22578"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M7285 12l3492 0c688,0 1314,282 1767,735 454,453 735,1079 735,1768l0 7439c0,688 -281,1314 -735,1767 -453,454 -1079,735 -1767,735l-3492 0c-688,0 -1314,-281 -1767,-735 -453,-453 -735,-1079 -735,-1767l0 -7439c0,-689 282,-1315 735,-1768 453,-453 1079,-735 1767,-735zm3492 556l-3492 0c-535,0 -1021,219 -1374,572 -353,353 -572,840 -572,1375l0 7439c0,535 219,1021 572,1374 353,353 839,572 1374,572l3492 0c535,0 1021,-219 1374,-572 353,-353 572,-839 572,-1374l0 -7439c0,-535 -219,-1022 -572,-1375 -353,-353 -839,-572 -1374,-572z"
        fillRule="nonzero"
      />
      <polygon points="9309,2541 9309,4935 8753,4935 8753,2541" />
      <polygon points="8755,9594 9307,9594 9307,16953 8755,16953" />
      <polygon points="9008,18050 7631,16026 8040,15670 8801,16811 9214,16797 9977,15692 10432,16015" />
    </svg>
  );
}

import {
  getSystemMetadata,
  getLogoUrl,
  getHardwareUrl,
} from "@/utils/metadata";
import { getFanartUrl } from "@/utils/fanart";

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

const LOGO_INITIAL = 18;
const LOGO_FINAL = 500;
const LOGO_FADE_END = 0.4;
const MASK_REMOVE_PROGRESS = 0.72;

const BLUR_ANGLE = 160;
const BLUR_FADE = 10;
const BLUR_LAYERS = [
  { blur: 0, start: 0, end: 75 },
  { blur: 4, start: 60, end: 85 },
  { blur: 10, start: 72, end: 92 },
  { blur: 20, start: 82, end: 100 },
  { blur: 32, start: 90, end: 100 },
];

interface SystemDetailProps {
  systemName: string;
  onClose: () => void;
}

export function SystemDetail({ systemName, onClose }: SystemDetailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const scrollIconRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentVisible, setContentVisible] = useState(false);
  const contentVisibleRef = useRef(false);

  const meta = getSystemMetadata(systemName);
  const logoUrl = getLogoUrl(systemName);
  const fanartUrl = getFanartUrl(systemName);
  const hardwareUrl = getHardwareUrl(systemName);

  const maskImageValue = useMemo(() => {
    if (!logoUrl) return undefined;
    return `url(${logoUrl})`;
  }, [logoUrl]);

  const setContentVisibility = useCallback((visible: boolean) => {
    if (visible === contentVisibleRef.current) return;
    contentVisibleRef.current = visible;
    setContentVisible(visible);
  }, []);

  const updateAnimation = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const scrollTop = el.scrollTop;
    const maxScroll = el.scrollHeight - el.clientHeight;
    const heroRevealDistance = Math.min(el.clientHeight, maxScroll || Infinity);
    const progress =
      heroRevealDistance > 0 ? Math.min(scrollTop / heroRevealDistance, 1) : 0;

    const scrollIcon = scrollIconRef.current;
    if (scrollIcon) {
      scrollIcon.style.opacity = String(Math.max(0, 1 - progress * 8));
    }

    const logoEl = logoRef.current;
    const maskEl = maskRef.current;

    if (!logoEl || !maskEl || !maskImageValue) {
      setContentVisibility(progress >= MASK_REMOVE_PROGRESS);
      return;
    }

    const t = easeInOutCubic(progress);
    const logoSize = LOGO_INITIAL + (LOGO_FINAL - LOGO_INITIAL) * t;

    const logoFadeProgress = Math.min(progress / LOGO_FADE_END, 1);
    const logoOpacity = 1 - easeInOutCubic(logoFadeProgress);
    logoEl.style.opacity = String(logoOpacity);
    logoEl.style.width = `${logoSize}vw`;
    logoEl.style.height = `${logoSize}vw`;

    if (progress >= MASK_REMOVE_PROGRESS) {
      maskEl.style.webkitMaskImage = "none";
      maskEl.style.maskImage = "none";
    } else {
      maskEl.style.webkitMaskImage = maskImageValue;
      maskEl.style.maskImage = maskImageValue;
      maskEl.style.webkitMaskSize = `${logoSize}vw`;
      maskEl.style.maskSize = `${logoSize}vw`;
    }

    setContentVisibility(progress >= MASK_REMOVE_PROGRESS);
  }, [maskImageValue, setContentVisibility]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let rafId: number | null = null;
    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        updateAnimation();
      });
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    updateAnimation();
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [updateAnimation]);

  // Quando o conteúdo fica visível, faz scroll automático do containerRef
  // para alinhar o topo do contentRef com o topo da viewport.
  // Isso garante que o containerRef.scrollTop chegue ao máximo, eliminando
  // o spacer do scroll chain â€” a partir daí qualquer wheel event vai
  // diretamente para o containerRef (que já está no fim) e naturalmente
  // não avança mais, revertendo a animação ao rolar para cima.
  useEffect(() => {
    if (!contentVisible) return;
    const el = containerRef.current;
    if (!el) return;
    const maxScroll = el.scrollHeight - el.clientHeight;
    el.scrollTo({ top: maxScroll, behavior: "instant" });
  }, [contentVisible]);

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <button
        onClick={onClose}
        className="fixed top-4 right-8 z-[70] w-10 h-10 rounded-full bg-zinc-900/80 border border-zinc-700/50 flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
      >
        <LuX className="w-5 h-5" />
      </button>

      {/*
        containerRef é o ÃšNICO scroll container.
        O contentRef NÃƒO tem overflow â€” ele é position:fixed para cobrir
        a tela, mas não participa do scroll chain do browser.
        Scroll interno do conteúdo é gerenciado pelo wheel handler abaixo.
      */}
      <div ref={containerRef} className="h-full overflow-y-auto scrollbar-none">
        <div className="relative">
          <section className="sticky top-0 z-40 h-screen bg-black overflow-clip">
            <div
              ref={maskRef}
              className="absolute inset-0"
              style={{
                WebkitMaskImage: maskImageValue ?? "none",
                maskImage: maskImageValue ?? "none",
                WebkitMaskSize: `${LOGO_INITIAL}vw`,
                maskSize: `${LOGO_INITIAL}vw`,
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
                willChange: "mask-size, -webkit-mask-size",
              }}
            >
              <div className="absolute inset-0 pointer-events-none">
                {fanartUrl &&
                  BLUR_LAYERS.map((layer) => (
                    <div
                      key={layer.blur}
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${fanartUrl})`,
                        filter: `blur(${layer.blur}px)`,
                        WebkitMaskImage: `linear-gradient(${BLUR_ANGLE}deg, transparent ${layer.start - BLUR_FADE}%, black ${layer.start + BLUR_FADE}%, black ${layer.end - BLUR_FADE}%, transparent ${layer.end + BLUR_FADE}%)`,
                        maskImage: `linear-gradient(${BLUR_ANGLE}deg, transparent ${layer.start - BLUR_FADE}%, black ${layer.start + BLUR_FADE}%, black ${layer.end - BLUR_FADE}%, transparent ${layer.end + BLUR_FADE}%)`,
                      }}
                    />
                  ))}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/20" />
              </div>

              {/*
                MUDANÃ‡A PRINCIPAL:
                - Removido overflowY dinâmico â€” contentRef nunca é scroll container
                - Scroll interno simulado via wheel handler no containerRef
                - contentRef usa position:absolute mas overflow:hidden sempre
                - Um ref interno (innerScrollRef) controla a posição visual via translateY
              */}
              <ContentPanel
                contentRef={contentRef}
                containerRef={containerRef}
                contentVisible={contentVisible}
                meta={meta}
                hardwareUrl={hardwareUrl}
                systemName={systemName}
              />
            </div>

            {logoUrl && (
              <img
                ref={logoRef}
                src={logoUrl}
                alt={systemName}
                className="absolute inset-0 z-20 m-auto pointer-events-none select-none"
                style={{
                  width: `${LOGO_INITIAL}vw`,
                  height: `${LOGO_INITIAL}vw`,
                  objectFit: "contain",
                  opacity: "1",
                  filter: "brightness(0) invert(1)",
                  willChange: "width",
                }}
              />
            )}

            <div
              ref={scrollIconRef}
              className="absolute left-1/2 -translate-x-1/2 z-30 text-zinc-400 pointer-events-none select-none"
              style={{ bottom: "10vh", opacity: "1" }}
            >
              <ScrollDownIcon className="w-16 h-16 animate-bounce opacity-70" />
            </div>
          </section>

          <div className="h-[200vh]" />
        </div>
      </div>
    </div>
  );
}

// ContentPanel isolado para manter o useRef do scroll interno limpo
function ContentPanel({
  contentRef,
  containerRef,
  contentVisible,
  meta,
  hardwareUrl,
  systemName,
}: {
  contentRef: React.RefObject<HTMLDivElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  contentVisible: boolean;
  meta: ReturnType<typeof getSystemMetadata>;
  hardwareUrl: string | null;
  systemName: string;
}) {
  // innerScrollTop: posição de scroll virtual do conteúdo interno.
  // Ã‰ um ref (não state) para não causar re-renders a cada evento wheel.
  const innerScrollTop = useRef(0);
  const innerContentRef = useRef<HTMLDivElement>(null);

  // Reseta scroll interno quando o painel fecha
  useEffect(() => {
    if (!contentVisible) {
      innerScrollTop.current = 0;
      if (innerContentRef.current) {
        innerContentRef.current.style.transform = "translateY(0px)";
      }
    }
  }, [contentVisible]);

  // Wheel handler no containerRef â€” intercepta TODOS os eventos quando
  // o conteúdo está visível e decide manualmente para onde vai o scroll.
  // Como o containerRef é o único scroll container, não há disputa.
  useEffect(() => {
    const outerEl = containerRef.current;
    if (!outerEl || !contentVisible) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      let px = e.deltaY;
      if (e.deltaMode === 1) px *= 24;
      else if (e.deltaMode === 2) px *= window.innerHeight;

      const inner = innerContentRef.current;
      const viewport = contentRef.current;
      if (!inner || !viewport) return;

      const maxInnerScroll = inner.scrollHeight - viewport.clientHeight;
      const atInnerTop = innerScrollTop.current <= 0;
      const atInnerBottom = innerScrollTop.current >= maxInnerScroll;
      const isUp = px < 0;
      const isDown = px > 0;

      if ((atInnerTop && isUp) || (atInnerBottom && isDown)) {
        // Limites do scroll interno atingidos: redireciona para o outer
        outerEl.scrollBy({ top: px, behavior: "instant" });
      } else {
        // Scroll dentro do conteúdo via translateY
        const next = Math.max(
          0,
          Math.min(maxInnerScroll, innerScrollTop.current + px),
        );
        innerScrollTop.current = next;
        inner.style.transform = `translateY(${-next}px)`;
      }
    };

    // Listener no containerRef (não no contentRef) â€” assim não há
    // segundo scroll container para o browser considerar no hit test.
    outerEl.addEventListener("wheel", onWheel, { passive: false });
    return () => outerEl.removeEventListener("wheel", onWheel);
  }, [contentVisible, containerRef, contentRef]);

  return (
    <div
      ref={contentRef as React.Ref<HTMLDivElement>}
      className="absolute inset-0 z-10 backdrop-blur-sm overflow-hidden"
      style={{
        opacity: contentVisible ? 1 : 0,
        transform: contentVisible ? "translateY(0)" : "translateY(40px)",
        transition:
          "opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        pointerEvents: contentVisible ? "auto" : "none",
      }}
    >
      {/* Camada interna que se move via translateY â€” nunca tem overflow */}
      <div ref={innerContentRef} style={{ willChange: "transform" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          {meta && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-auto">
                {/* 1. Título + Descrição com BG do hardware */}
                <div className="relative col-span-2 sm:col-span-3 rounded-2xl border border-zinc-800/50 overflow-hidden">
                  {hardwareUrl && (
                    <>
                      <img
                        src={hardwareUrl}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/70 to-zinc-950/50" />
                    </>
                  )}
                  <div className="relative p-5 sm:p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <h1 className="text-xl sm:text-2xl font-bold text-white">
                        {meta.name}
                      </h1>
                    </div>
                    <p className="text-sm text-zinc-200 leading-relaxed max-w-2xl">
                      {meta.description}
                    </p>
                  </div>
                </div>

                {/* 3. Especificações técnicas */}
                <div className="relative rounded-2xl bg-zinc-900/60 border border-zinc-800/50 p-5 sm:p-6 overflow-hidden">
                  <div className="flex items-center gap-2 mb-3 text-zinc-400">
                    <LuCpu className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">
                      Especificações
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      ["Fabricante", meta.manufacturer],
                      ["Origem", meta.origin_country],
                      ["Tipo", meta.type],
                      ["Geração", meta.generation],
                      ["CPU", meta.cpu],
                      ["Memória", meta.memory],
                      ["Armazenamento", meta.storage],
                      ["Mídia", meta.media],
                      ["SO", meta.os],
                      ["Display", meta.display],
                      ["Gráficos", meta.graphics],
                      ["Som", meta.sound],
                      ["Conectividade", meta.connectivity],
                    ]
                      .filter(([, v]) => v)
                      .map(([label, value]) => (
                        <div key={label as string}>
                          <span className="text-[10px] uppercase tracking-wider text-zinc-600 font-medium">
                            {label as string}
                          </span>
                          <p className="text-sm font-semibold text-zinc-200">
                            {value as string}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>

                {/* 4. Ano de Lançamento */}
                <div className="col-span-2 sm:col-span-1 rounded-2xl bg-zinc-900/60 border border-zinc-800/50 p-5 sm:p-6">
                  <div className="flex items-center gap-2 mb-3 text-zinc-400">
                    <LuCalendar className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">
                      Ano de Lançamento
                    </span>
                  </div>
                  {meta.release_year > 0 ? (
                    <p className="text-2xl font-bold font-mono text-zinc-200">
                      {meta.release_year}
                    </p>
                  ) : (
                    <p className="text-sm text-zinc-500 italic">Desconhecido</p>
                  )}
                </div>

                {/* 5. Sistema e periféricos */}
                <div className="col-span-2 lg:col-span-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/50 p-5 sm:p-6">
                  <div className="flex items-center gap-2 mb-3 text-zinc-400">
                    <LuMonitor className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">
                      Sistema & Periféricos
                    </span>
                  </div>

                  {meta.emulators.length > 0 && (
                    <div className="mb-3">
                      <span className="text-[10px] uppercase tracking-wider text-zinc-600 font-medium">
                        Emuladores
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {meta.emulators.map((emu) => (
                          <span
                            key={emu}
                            className="px-2 py-0.5 rounded-md bg-retro-secondary/10 border border-retro-secondary/20 text-xs text-retro-secondary/80"
                          >
                            {emu}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {meta.supported_extensions.length > 0 && (
                    <div className="mb-3">
                      <span className="text-[10px] uppercase tracking-wider text-zinc-600 font-medium">
                        Mídia Suportada
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {meta.supported_extensions.map((ext) => (
                          <span
                            key={ext}
                            className="px-2 py-0.5 rounded-md bg-zinc-800/50 border border-zinc-700/30 text-xs font-mono text-zinc-400"
                          >
                            {ext}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {[
                    ["Preço de Lançamento", meta.launch_price],
                    ["Unidades Vendidas", meta.units_sold],
                    ["Predecessor", meta.predecessor],
                    ["Sucessor", meta.successor],
                  ]
                    .filter(([, v]) => v)
                    .map(([label, value]) => (
                      <div key={label as string} className="mb-2">
                        <span className="text-[10px] uppercase tracking-wider text-zinc-600 font-medium">
                          {label as string}
                        </span>
                        <p className="text-sm font-semibold text-zinc-200">
                          {value as string}
                        </p>
                      </div>
                    ))}
                </div>

                {/* 6. Curiosidades */}
                <div className="col-span-2 lg:col-span-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/50 p-5 sm:p-6">
                  <div className="flex items-center gap-2 mb-3 text-zinc-400">
                    <LuBookOpen className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">
                      Curiosidades
                    </span>
                  </div>
                  {meta.curiosities.length > 0 ? (
                    <ul className="space-y-3">
                      {meta.curiosities.map((curiosity, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-zinc-300 leading-relaxed"
                        >
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-retro-primary shrink-0" />
                          {curiosity}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-zinc-500 italic">
                      Nenhuma curiosidade registrada.
                    </p>
                  )}
                </div>

                {/* 7. Jogos em Destaque */}
                {meta.top_games && meta.top_games.length > 0 && (
                  <div className="col-span-2 lg:col-span-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/50 p-5 sm:p-6">
                    <div className="flex items-center gap-2 mb-4 text-zinc-400">
                      <LuStar className="w-4 h-4" />
                      <span className="text-xs font-medium uppercase tracking-wider">
                        Principais Títulos
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {meta.top_games.map((game) => {
                        const coverUrl = game.cover_path
                          ? game.cover_path.replace(/^assets\//, "")
                          : null;
                        return (
                          <div
                            key={game.slug}
                            className="group rounded-xl bg-zinc-800/40 border border-zinc-700/30 overflow-hidden transition-all duration-200 hover:bg-zinc-800/60 hover:border-zinc-600/50 hover:scale-[1.02]"
                          >
                            <div className="aspect-[3/4] bg-zinc-800/60 overflow-hidden">
                              {coverUrl ? (
                                <img
                                  src={coverUrl}
                                  alt={game.name}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-600">
                                  <LuGamepad2 className="w-8 h-8" />
                                </div>
                              )}
                            </div>
                            <div className="p-2.5">
                              {(() => {
                                const r = game.rating;
                                if (!r) return null;
                                return (
                                  <div className="flex gap-0.5 mt-1">
                                    {[1, 2, 3, 4, 5].map((star) => {
                                      const filled = r >= star * 20 - 10;
                                      return (
                                        <svg
                                          key={star}
                                          viewBox="0 0 24 24"
                                          className="w-3 h-3"
                                          fill={filled ? "#fbbf24" : "none"}
                                          stroke={
                                            filled ? "#f59e0b" : "#52525b"
                                          }
                                          strokeWidth="1.5"
                                          style={
                                            filled
                                              ? {
                                                  filter:
                                                    "drop-shadow(0 0 3px rgba(251,191,36,0.5))",
                                                }
                                              : undefined
                                          }
                                        >
                                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                        </svg>
                                      );
                                    })}
                                  </div>
                                );
                              })()}
                              <p className="text-xs font-medium text-zinc-300 leading-tight line-clamp-2 group-hover:text-zinc-100 transition-colors mt-4">
                                {game.name}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {!meta && (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
              <LuGamepad2 className="w-12 h-12 mb-4" />
              <p className="text-lg font-medium mb-1">Sistema não encontrado</p>
              <p className="text-sm">
                Nenhum metadado disponível para {systemName}.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
