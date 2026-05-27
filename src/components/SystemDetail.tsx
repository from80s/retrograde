import { useRef, useEffect, useCallback, useMemo, useState } from "react";
import { X, Monitor, Calendar, Gamepad2, Cpu, BookOpen } from "lucide-react";
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

const PHASE1_END = 0.3;
const LOGO_INITIAL = 18;
const LOGO_SWITCH = 95;
const LOGO_FINAL = 320;
const MASK_REMOVE_THRESHOLD = 280;

// Parâmetros do blur progressivo (simula blur diagonal estilo iOS)
// BLUR_ANGLE: direção do gradiente em graus. 0=topo→base, 90=esquerda→direita, 135=↘, 160≈↙
// BLUR_FADE: largura da transição suave entre camadas (pontos percentuais)
// BLUR_LAYERS: cada entrada é uma camada empilhada. `blur`=px gaussiano, `start/end`=faixa de visibilidade ao longo do eixo do gradiente.
//   Camada 0 (blur=0) é a base nítida. A última camada é o blur mais forte.
//   Cada camada faz fade in/out através de BLUR_FADE% para criar mesclagem suave.
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
  const contentVisibleRef = useRef(false);
  const [contentVisible, setContentVisible] = useState(false);

  const meta = getSystemMetadata(systemName);
  const logoUrl = getLogoUrl(systemName);
  const fanartUrl = getFanartUrl(systemName);
  const hardwareUrl = getHardwareUrl(systemName);

  const maskImageValue = useMemo(() => {
    if (!logoUrl) return undefined;
    return `url(${logoUrl})`;
  }, [logoUrl]);

  const CONTENT_THRESHOLD = 0.85;

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
    const progress = maxScroll > 0 ? Math.min(scrollTop / maxScroll, 1) : 0;

    const scrollIcon = scrollIconRef.current;
    if (scrollIcon) {
      scrollIcon.style.opacity = String(Math.max(0, 1 - progress * 10));
    }

    const logoEl = logoRef.current;
    const maskEl = maskRef.current;

    if (!logoEl || !maskEl || !maskImageValue) {
      setContentVisibility(progress >= CONTENT_THRESHOLD);
      return;
    }

    let logoSize: number;

    if (progress <= PHASE1_END) {
      const t = easeInOutCubic(progress / PHASE1_END);
      logoSize = LOGO_INITIAL + (LOGO_SWITCH - LOGO_INITIAL) * t;
      const logoOpacity = 1 - t;

      logoEl.style.opacity = String(logoOpacity);
      logoEl.style.width = `${logoSize}vw`;
      logoEl.style.height = `${logoSize}vw`;

      maskEl.style.webkitMaskImage = maskImageValue;
      maskEl.style.maskImage = maskImageValue;
      maskEl.style.webkitMaskSize = `${logoSize}vw`;
      maskEl.style.maskSize = `${logoSize}vw`;

      setContentVisibility(false);
    } else {
      const t = easeInOutCubic((progress - PHASE1_END) / (1 - PHASE1_END));
      logoSize = LOGO_SWITCH + (LOGO_FINAL - LOGO_SWITCH) * t;

      logoEl.style.opacity = "0";

      if (logoSize >= MASK_REMOVE_THRESHOLD) {
        maskEl.style.webkitMaskImage = "none";
        maskEl.style.maskImage = "none";
        setContentVisibility(true);
      } else {
        maskEl.style.webkitMaskImage = maskImageValue;
        maskEl.style.maskImage = maskImageValue;
        maskEl.style.webkitMaskSize = `${logoSize}vw`;
        maskEl.style.maskSize = `${logoSize}vw`;
        setContentVisibility(false);
      }
    }
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

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <button
        onClick={onClose}
        className="fixed top-4 right-8 z-[70] w-10 h-10 rounded-full bg-zinc-900/80 border border-zinc-700/50 flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <div ref={containerRef} className="h-full overflow-y-auto scrollbar-none">
        <div className="relative">
          <section className="sticky top-0 z-40 h-screen overflow-hidden bg-black">
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

              <div
                ref={contentRef}
                className="absolute inset-0 z-10 bg-zinc-950/95 backdrop-blur-sm"
                style={{
                  opacity: contentVisible ? 1 : 0,
                  transform: contentVisible
                    ? "translateY(0)"
                    : "translateY(40px)",
                  transition:
                    "opacity 0.4s ease-in-out, transform 0.4s ease-in-out",
                  overflowY: contentVisible ? "auto" : "hidden",
                  pointerEvents: contentVisible ? "auto" : "none",
                }}
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 min-h-full">
                  {meta && (
                    <>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-auto">
                        {/* 1. Título + Subtítulo */}
                        <div className="col-span-2 rounded-2xl bg-zinc-900/60 border border-zinc-800/50 p-5 sm:p-6">
                          <div className="flex items-center gap-2 mb-4">
                            {/* {logoUrl && (
                              <img
                                src={logoUrl}
                                alt=""
                                className="w-6 h-6 object-contain brightness-0 invert"
                              />
                            )} */}
                            <h1 className="text-xl sm:text-2xl font-bold text-zinc-100">
                              {meta.name}
                            </h1>
                          </div>
                          {/* <p className="text-[10px] uppercase tracking-wider text-zinc-600 font-mono mb-3">
                            {meta.id.replace(/_/g, " ")}
                          </p> */}
                          <p className="text-sm text-zinc-300 leading-relaxed">
                            {meta.description}
                          </p>
                        </div>

                        {/* 2. Imagem principal do hardware */}
                        <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800/50 flex items-center justify-center overflow-hidden">
                          {hardwareUrl ? (
                            <img
                              src={hardwareUrl}
                              alt={meta.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="flex flex-col items-center gap-2 text-zinc-600 py-4 px-3">
                              <Monitor className="w-8 h-8" />
                              <span className="text-[10px] uppercase tracking-wider">
                                Sem imagem
                              </span>
                            </div>
                          )}
                        </div>

                        {/* 3. Especificações técnicas */}
                        <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800/50 p-5 sm:p-6">
                          <div className="flex items-center gap-2 mb-3 text-zinc-400">
                            <Cpu className="w-4 h-4" />
                            <span className="text-xs font-medium uppercase tracking-wider">
                              Especificações
                            </span>
                          </div>
                          <div className="scrollbar-auto max-h-[220px] space-y-2.5 pr-1">
                            {[
                              ['Fabricante', meta.manufacturer],
                              ['Origem', meta.origin_country],
                              ['Tipo', meta.type],
                              ['Geração', meta.generation],
                              ['CPU', meta.cpu],
                              ['Memória', meta.memory],
                              ['Armazenamento', meta.storage],
                              ['Mídia', meta.media],
                              ['SO', meta.os],
                              ['Display', meta.display],
                              ['Gráficos', meta.graphics],
                              ['Som', meta.sound],
                              ['Conectividade', meta.connectivity],
                            ].filter(([, v]) => v).map(([label, value]) => (
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
                            <Calendar className="w-4 h-4" />
                            <span className="text-xs font-medium uppercase tracking-wider">
                              Ano de Lançamento
                            </span>
                          </div>
                          {meta.release_year > 0 ? (
                            <p className="text-2xl font-bold font-mono text-zinc-200">
                              {meta.release_year}
                            </p>
                          ) : (
                            <p className="text-sm text-zinc-500 italic">
                              Desconhecido
                            </p>
                          )}
                        </div>

                        {/* 5. Sistema e periféricos */}
                        <div className="col-span-2 lg:col-span-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/50 p-5 sm:p-6">
                          <div className="flex items-center gap-2 mb-3 text-zinc-400">
                            <Monitor className="w-4 h-4" />
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
                            ['Preço de Lançamento', meta.launch_price],
                            ['Unidades Vendidas', meta.units_sold],
                            ['Predecessor', meta.predecessor],
                            ['Sucessor', meta.successor],
                          ].filter(([, v]) => v).map(([label, value]) => (
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
                            <BookOpen className="w-4 h-4" />
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
                      </div>
                    </>
                  )}

                  {!meta && (
                    <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                      <Gamepad2 className="w-12 h-12 mb-4" />
                      <p className="text-lg font-medium mb-1">
                        Sistema não encontrado
                      </p>
                      <p className="text-sm">
                        Nenhum metadado disponível para {systemName}.
                      </p>
                    </div>
                  )}
                </div>
              </div>
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
