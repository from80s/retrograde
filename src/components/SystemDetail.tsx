import { useRef, useEffect, useCallback, useMemo, useState } from "react";
import {
  X,
  Monitor,
  Calendar,
  Flag,
  Gamepad2,
  HardDrive,
  Sparkles,
  BookOpen,
  Globe,
  Cpu,
} from "lucide-react";
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
import { getSystemMetadata, getLogoUrl } from "@/utils/metadata";
import { getFanartUrl } from "@/utils/fanart";

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

const PHASE1_END = 0.3;
const LOGO_INITIAL = 18;
const LOGO_SWITCH = 95;
const LOGO_FINAL = 320;
const MASK_REMOVE_THRESHOLD = 280;

// Progressive blur parameters (simulates iOS-style diagonal blur)
// BLUR_ANGLE: gradient direction in degrees. 0=top→bottom, 90=left→right, 135=↘, 160≈↙
// BLUR_FADE: soft transition width between layers (percentage points)
// BLUR_LAYERS: each entry is one stacked layer. `blur`=gaussian px, `start/end`=visibility range along the gradient axis.
//   Layer 0 (blur=0) is the sharp base. Last layer is the strongest blur.
//   Each layer fades in/out across BLUR_FADE% to create smooth blending.
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
  const contentRevealedRef = useRef(false);

  const contentRef = useRef<HTMLDivElement>(null);

  const [contentVisible, setContentVisible] = useState(false);

  const meta = getSystemMetadata(systemName);
  const logoUrl = getLogoUrl(systemName);
  const fanartUrl = getFanartUrl(systemName);

  const maskImageValue = useMemo(() => {
    if (!logoUrl) return undefined;
    return `url(${logoUrl})`;
  }, [logoUrl]);

  const revealContent = useCallback(() => {
    if (contentRevealedRef.current) return;
    contentRevealedRef.current = true;
    setContentVisible(true);
    const content = contentRef.current;
    if (content) {
      content.style.opacity = "1";
      content.style.transform = "translateY(0)";
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(revealContent, 4000);
    return () => clearTimeout(timer);
  }, [revealContent]);

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
      if (scrollTop > 50) revealContent();
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
    } else {
      const t = easeInOutCubic((progress - PHASE1_END) / (1 - PHASE1_END));
      logoSize = LOGO_SWITCH + (LOGO_FINAL - LOGO_SWITCH) * t;

      logoEl.style.opacity = "0";

      if (logoSize >= MASK_REMOVE_THRESHOLD) {
        maskEl.style.webkitMaskImage = "none";
        maskEl.style.maskImage = "none";
        revealContent();
      } else {
        maskEl.style.webkitMaskImage = maskImageValue;
        maskEl.style.maskImage = maskImageValue;
        maskEl.style.webkitMaskSize = `${logoSize}vw`;
        maskEl.style.maskSize = `${logoSize}vw`;
      }
    }
  }, [maskImageValue, revealContent]);

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
              <div className="absolute inset-0">
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

          <div
            ref={contentRef}
            className="relative bg-zinc-950/95 backdrop-blur-sm min-h-screen"
            style={{
              opacity: contentVisible ? 1 : 0,
              transform: contentVisible ? "translateY(0)" : "translateY(40px)",
              transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
            }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
              {meta && (
                <>
                  <div className="mb-8 sm:mb-12">
                    <div className="flex items-center gap-3 mb-2">
                      {logoUrl && (
                        <img
                          src={logoUrl}
                          alt=""
                          className="w-8 h-8 object-contain brightness-0 invert"
                        />
                      )}
                      <h1 className="text-xl sm:text-2xl font-bold text-zinc-100">
                        {meta.name}
                      </h1>
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-500 font-mono">
                      {meta.id.replace(/_/g, " ")} —{" "}
                      {meta.supported_extensions.length} extensões suportadas
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-auto">
                    <div className="col-span-2 sm:col-span-3 lg:col-span-4 row-span-1 rounded-2xl bg-zinc-900/60 border border-zinc-800/50 p-5 sm:p-6">
                      <div className="flex items-center gap-2 mb-3 text-zinc-400">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-xs font-medium uppercase tracking-wider">
                          Sobre
                        </span>
                      </div>
                      <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                        {meta.description}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800/50 p-5 sm:p-6">
                      <div className="flex items-center gap-2 mb-3 text-zinc-400">
                        <Monitor className="w-4 h-4" />
                        <span className="text-xs font-medium uppercase tracking-wider">
                          Fabricante
                        </span>
                      </div>
                      <p className="text-base sm:text-lg font-semibold text-zinc-200">
                        {meta.manufacturer}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800/50 p-5 sm:p-6">
                      <div className="flex items-center gap-2 mb-3 text-zinc-400">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs font-medium uppercase tracking-wider">
                          Lançamento
                        </span>
                      </div>
                      <p className="text-base sm:text-lg font-semibold text-zinc-200">
                        {meta.release_year > 0 ? meta.release_year : "—"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800/50 p-5 sm:p-6">
                      <div className="flex items-center gap-2 mb-3 text-zinc-400">
                        <Flag className="w-4 h-4" />
                        <span className="text-xs font-medium uppercase tracking-wider">
                          Origem
                        </span>
                      </div>
                      <p className="text-base sm:text-lg font-semibold text-zinc-200">
                        {meta.origin_country}
                      </p>
                    </div>

                    <div className="col-span-2 rounded-2xl bg-zinc-900/60 border border-zinc-800/50 p-5 sm:p-6">
                      <div className="flex items-center gap-2 mb-3 text-zinc-400">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-xs font-medium uppercase tracking-wider">
                          Curiosidades
                        </span>
                      </div>
                      {meta.curiosities.length > 0 ? (
                        <ul className="space-y-2">
                          {meta.curiosities.map((curiosity, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm text-zinc-300"
                            >
                              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
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

                    <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800/50 p-5 sm:p-6">
                      <div className="flex items-center gap-2 mb-3 text-zinc-400">
                        <Cpu className="w-4 h-4" />
                        <span className="text-xs font-medium uppercase tracking-wider">
                          ID do Sistema
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-mono text-zinc-300 break-all">
                        {meta.id}
                      </p>
                    </div>

                    <div className="col-span-2 rounded-2xl bg-zinc-900/60 border border-zinc-800/50 p-5 sm:p-6">
                      <div className="flex items-center gap-2 mb-3 text-zinc-400">
                        <HardDrive className="w-4 h-4" />
                        <span className="text-xs font-medium uppercase tracking-wider">
                          Extensões Suportadas
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {meta.supported_extensions.map((ext) => (
                          <span
                            key={ext}
                            className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs font-mono text-purple-300"
                          >
                            {ext}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="col-span-2 sm:col-span-3 lg:col-span-4 rounded-2xl bg-gradient-to-br from-zinc-900/60 to-zinc-900/30 border border-zinc-800/50 p-5 sm:p-6">
                      <div className="flex items-center gap-2 mb-3 text-zinc-400">
                        <Globe className="w-4 h-4" />
                        <span className="text-xs font-medium uppercase tracking-wider">
                          Links
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <a
                          href={`https://www.thegamesdb.net/platforms/`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors"
                        >
                          TheGamesDB (TGDB: {meta.tgdb_id})
                        </a>
                        <a
                          href={`https://www.igdb.com/platforms/${meta.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors"
                        >
                          IGDB (ID: {meta.igdb_id})
                        </a>
                      </div>
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
            <div className="h-[50vh]" />
          </div>
        </div>
      </div>
    </div>
  );
}
