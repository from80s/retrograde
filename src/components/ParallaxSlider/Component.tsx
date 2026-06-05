import { useRef, useEffect, useCallback, useState } from "react";
import {
  Root,
  ArrowsWrapper,
  Viewport,
  Wrapper,
  Slide,
  ImageWrapper,
  Image,
  Content,
  ContentBg,
  Stars,
  Title,
  Arrow,
  Nav,
  Dots,
  Dot,
  NoCover,
} from "./styles";

interface Game {
  slug: string;
  name: string;
  cover_path?: string | null;
  rating?: number | null;
}

interface ParallaxSliderProps {
  games: Game[];
}

function getSlideVariant(
  index: number,
  currentIndex: number,
  total: number
): "current" | "previous" | "next" | "default" {
  if (index === currentIndex) return "current";
  if (
    index === currentIndex - 1 ||
    (currentIndex === 0 && index === total - 1)
  )
    return "previous";
  if (
    index === currentIndex + 1 ||
    (currentIndex === total - 1 && index === 0)
  )
    return "next";
  return "default";
}

export default function ParallaxSlider({ games }: ParallaxSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideRefs = useRef<Map<number, HTMLLIElement>>(new Map());

  const setSlideRef = useCallback(
    (index: number, el: HTMLLIElement | null) => {
      if (el) slideRefs.current.set(index, el);
      else slideRefs.current.delete(index);
    },
    []
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent, index: number) => {
      const el = slideRefs.current.get(index);
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty(
        "--x",
        String(e.clientX - (r.left + Math.floor(r.width / 2)))
      );
      el.style.setProperty(
        "--y",
        String(e.clientY - (r.top + Math.floor(r.height / 2)))
      );
    },
    []
  );

  const handleMouseLeave = useCallback(
    (_e: React.MouseEvent, index: number) => {
      const el = slideRefs.current.get(index);
      if (!el) return;
      el.style.setProperty("--x", "0");
      el.style.setProperty("--y", "0");
    },
    []
  );

  const goTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= games.length) return;
      setCurrentIndex(index);
    },
    [games.length]
  );

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % games.length);
  }, [games.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + games.length) % games.length);
  }, [games.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  return (
    <Root>
      <ArrowsWrapper>
        <Viewport>
          <Wrapper $currentIndex={currentIndex}>
            {games.map((game, i) => {
              const coverUrl = game.cover_path
                ? game.cover_path.replace(/^assets\//, "")
                : null;

              return (
                <Slide
                  key={game.slug}
                  ref={(el) => setSlideRef(i, el)}
                  $variant={getSlideVariant(i, currentIndex, games.length)}
                  data-variant={getSlideVariant(i, currentIndex, games.length)}
                  onClick={() => goTo(i)}
                  onMouseMove={(e) => handleMouseMove(e, i)}
                  onMouseLeave={(e) => handleMouseLeave(e, i)}
                >
                  <ImageWrapper>
                    {coverUrl ? (
                      <Image src={coverUrl} alt="" draggable={false} />
                    ) : (
                      <NoCover />
                    )}
                  </ImageWrapper>

                  <Content>
                    <ContentBg />
                    <Stars>
                      {(() => {
                        const r = game.rating;
                        if (!r) return null;
                        return [1, 2, 3, 4, 5].map((star) => {
                          const filled = r >= star * 20 - 10;
                          return (
                            <svg
                              key={star}
                              viewBox="0 0 24 24"
                              style={{
                                width: "1rem",
                                height: "1rem",
                                fill: filled ? "#fbbf24" : "none",
                                stroke: filled ? "#f59e0b" : "#71717a",
                                strokeWidth: 1.5,
                                filter: filled
                                  ? "drop-shadow(0 0 4px rgba(251,191,36,0.6))"
                                  : undefined,
                              }}
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          );
                        });
                      })()}
                    </Stars>
                    <Title>{game.name}</Title>
                  </Content>
                </Slide>
              );
            })}
          </Wrapper>
        </Viewport>

        <Arrow $side="prev" onClick={goPrev} aria-label="Anterior">
          ‹
        </Arrow>
        <Arrow $side="next" onClick={goNext} aria-label="Próximo">
          ›
        </Arrow>
      </ArrowsWrapper>

      {games.length > 1 && (
        <Nav>
          <Dots>
            {games.map((_, i) => (
              <Dot
                key={i}
                $active={i === currentIndex}
                onClick={() => goTo(i)}
                aria-label={`Jogo ${i + 1}`}
              />
            ))}
          </Dots>
        </Nav>
      )}
    </Root>
  );
}
