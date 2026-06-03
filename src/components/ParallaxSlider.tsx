import { useRef, useEffect, useCallback, useState } from "react";

interface Game {
  slug: string;
  name: string;
  cover_path?: string | null;
  rating?: number | null;
}

interface ParallaxSliderProps {
  games: Game[];
}

const SCRAMBLE_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";

function scrambleText(
  element: HTMLElement,
  finalText: string,
  duration: number = 1000,
): () => void {
  let frame = 0;
  const totalFrames = Math.ceil(duration / 16);
  let cancelled = false;

  const tick = () => {
    if (cancelled) return;

    const progress = Math.min(frame / totalFrames, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    let result = "";

    for (let i = 0; i < finalText.length; i++) {
      const char = finalText[i];
      if (char === " ") {
        result += " ";
        continue;
      }
      const threshold = i / finalText.length;
      if (eased > threshold) {
        result += char;
      } else {
        result +=
          SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }
    }

    element.textContent = result;

    if (progress < 1) {
      frame++;
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);

  return () => {
    cancelled = true;
  };
}

export default function ParallaxSlider({ games }: ParallaxSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const mousePos = useRef({ x: 50, y: 50 });
  const rafId = useRef(0);
  const titleRef = useRef<HTMLDivElement>(null);

  const updateParallax = useCallback(() => {
    if (!containerRef.current) return;
    containerRef.current.style.setProperty(
      "--mouse-x",
      String(mousePos.current.x),
    );
    containerRef.current.style.setProperty(
      "--mouse-y",
      String(mousePos.current.y),
    );
    rafId.current = requestAnimationFrame(updateParallax);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mousePos.current.x = ((e.clientX - rect.left) / rect.width) * 100;
    mousePos.current.y = ((e.clientY - rect.top) / rect.height) * 100;
  }, []);

  const handleMouseLeave = useCallback(() => {
    mousePos.current.x = 50;
    mousePos.current.y = 50;
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= games.length) return;
      setCurrentIndex(index);
    },
    [games.length],
  );

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, games.length - 1));
  }, [games.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  useEffect(() => {
    rafId.current = requestAnimationFrame(updateParallax);
    return () => cancelAnimationFrame(rafId.current);
  }, [updateParallax]);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
    if (titleRef.current && games[currentIndex]) {
      scrambleText(titleRef.current, games[currentIndex].name, 1000);
    }
  }, [currentIndex, games]);

  const getSlideClass = (index: number) => {
    if (index === currentIndex) return "parallax-slide parallax-slide--current";
    if (index < currentIndex) return "parallax-slide parallax-slide--previous";
    return "parallax-slide parallax-slide--next";
  };

  return (
    <div className="parallax-slider-root">
      <style>{`
        .parallax-slider-root {
          position: relative;
          width: 100%;
          --mouse-x: 50;
          --mouse-y: 50;
        }

        .parallax-slider-viewport {
          position: relative;
          width: 100%;
          overflow: hidden;
          border-radius: 0.75rem;
        }

        .parallax-slider-track {
          display: flex;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform;
        }

        .parallax-slide {
          position: relative;
          width: 100%;
          flex-shrink: 0;
          aspect-ratio: 3/4;
          overflow: hidden;
          cursor: pointer;
        }

        .parallax-slide--previous,
        .parallax-slide--next {
          pointer-events: none;
        }

        .parallax-layer {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          will-change: transform;
        }

        .parallax-layer img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          user-select: none;
          -webkit-user-drag: none;
        }

        .parallax-layer--bg {
          transform: translate(
            calc((var(--mouse-x) - 50) * -0.015),
            calc((var(--mouse-y) - 50) * -0.015)
          );
          scale: 1.15;
        }

        .parallax-layer--mid {
          transform: translate(
            calc((var(--mouse-x) - 50) * -0.04),
            calc((var(--mouse-y) - 50) * -0.04)
          );
        }

        .parallax-layer--front {
          transform: translate(
            calc((var(--mouse-x) - 50) * -0.07),
            calc((var(--mouse-y) - 50) * -0.07)
          );
        }

        .parallax-layer--shine {
          background: radial-gradient(
            circle at
              calc(var(--mouse-x) * 1%)
              calc(var(--mouse-y) * 1%),
            rgba(255, 255, 255, 0.12) 0%,
            transparent 60%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .parallax-slide--current .parallax-layer--shine {
          opacity: 1;
        }

        .parallax-info {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 1.25rem;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.85));
          z-index: 10;
        }

        .parallax-info__stars {
          display: flex;
          gap: 2px;
          margin-bottom: 0.375rem;
        }

        .parallax-info__title {
          font-size: 2rem;
          font-weight: 600;
          color: #fafafa;
          line-height: 1.3;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          min-height: 1.3em;
        }

        .parallax-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 0.875rem;
        }

        .parallax-nav__btn {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #a1a1aa;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.75rem;
          line-height: 1;
        }

        .parallax-nav__btn:hover {
          background: rgba(255, 255, 255, 0.15);
          color: #fafafa;
        }

        .parallax-nav__btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .parallax-nav__dots {
          display: flex;
          gap: 4px;
        }

        .parallax-nav__dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          padding: 0;
        }

        .parallax-nav__dot--active {
          background: #fbbf24;
          box-shadow: 0 0 8px rgba(251, 191, 36, 0.5);
          width: 16px;
          border-radius: 3px;
        }
      `}</style>

      <div
        ref={containerRef}
        className="parallax-slider-viewport"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div ref={sliderRef} className="parallax-slider-track">
          {games.map((game, i) => {
            const coverUrl = game.cover_path
              ? game.cover_path.replace(/^assets\//, "")
              : null;

            return (
              <div key={game.slug} className={getSlideClass(i)}>
                <div className="parallax-layer parallax-layer--bg">
                  {coverUrl ? (
                    <img src={coverUrl} alt="" draggable={false} />
                  ) : (
                    <div className="w-full h-full bg-zinc-800" />
                  )}
                </div>
                <div className="parallax-layer parallax-layer--mid">
                  {coverUrl ? (
                    <img src={coverUrl} alt="" draggable={false} />
                  ) : (
                    <div className="w-full h-full bg-zinc-800" />
                  )}
                </div>
                <div className="parallax-layer parallax-layer--front" />
                <div className="parallax-layer parallax-layer--shine" />

                <div className="parallax-info">
                  <div className="parallax-info__stars">
                    {(() => {
                      const r = game.rating;
                      if (!r) return null;
                      return [1, 2, 3, 4, 5].map((star) => {
                        const filled = r >= star * 20 - 10;
                        return (
                          <svg
                            key={star}
                            viewBox="0 0 24 24"
                            className="w-3.5 h-3.5"
                            fill={filled ? "#fbbf24" : "none"}
                            stroke={filled ? "#f59e0b" : "#71717a"}
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
                      });
                    })()}
                  </div>
                  <div
                    ref={i === currentIndex ? titleRef : undefined}
                    className="parallax-info__title"
                  >
                    {game.name}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {games.length > 1 && (
        <div className="parallax-nav">
          <button
            className="parallax-nav__btn"
            onClick={goPrev}
            disabled={currentIndex === 0}
            aria-label="Anterior"
          >
            ‹
          </button>
          <div className="parallax-nav__dots">
            {games.map((_, i) => (
              <button
                key={i}
                className={`parallax-nav__dot ${i === currentIndex ? "parallax-nav__dot--active" : ""}`}
                onClick={() => goTo(i)}
                aria-label={`Jogo ${i + 1}`}
              />
            ))}
          </div>
          <button
            className="parallax-nav__btn"
            onClick={goNext}
            disabled={currentIndex === games.length - 1}
            aria-label="Próximo"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
