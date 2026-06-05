import styled, { css } from "styled-components";

const SLIDE_WIDTH = 82;
const GAP = 2;

export const Root = styled.div`
  position: relative;
  width: 100%;
  padding: 0 3.5rem;
`;

export const ArrowsWrapper = styled.div`
  position: relative;
`;

export const Viewport = styled.div`
  width: 100%;
  overflow: hidden;
  border-radius: 0.75rem;
`;

export const Wrapper = styled.ul<{ $currentIndex: number }>`
  display: flex;
  gap: ${GAP}%;
  transition: transform 600ms cubic-bezier(0.25, 1, 0.35, 1);
  padding: 0.5rem 0;
  transform: translateX(
    ${({ $currentIndex }) => `-${$currentIndex * (SLIDE_WIDTH + GAP)}%`}
  );
`;

export const Slide = styled.li<{
  $variant: "current" | "previous" | "next" | "default";
}>`
  --x: 0;
  --y: 0;
  flex: 0 0 ${SLIDE_WIDTH}%;
  align-items: center;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  text-align: center;
  transition:
    opacity 300ms cubic-bezier(0.25, 0.46, 0.45, 0.84),
    transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.84);
  z-index: 1;
  cursor: pointer;
  aspect-ratio: 3/4;

  ${({ $variant }) => {
    switch ($variant) {
      case "current":
        return css`
          opacity: 1;
          pointer-events: auto;
          user-select: auto;
          z-index: 2;
        `;
      case "previous":
      case "next":
        return css`
          opacity: 0.35;
          pointer-events: none;
        `;
      default:
        return css`
          opacity: 0.25;
          pointer-events: none;
        `;
    }
  }}
`;

export const ImageWrapper = styled.div`
  background-color: #1a1a2e;
  border-radius: 0.75rem;
  height: 100%;
  left: 0;
  overflow: hidden;
  position: absolute;
  top: 0;
  transition: transform 150ms cubic-bezier(0.25, 0.46, 0.45, 0.84);
  width: 100%;

  @media (hover: hover) {
    ${Slide}[data-variant="current"]:hover & {
      transform: scale(1.025)
        translate(
          calc(var(--x) / 50 * 1px),
          calc(var(--y) / 50 * 1px)
        );
    }
  }
`;

export const Image = styled.img`
  --d: 20;
  height: 110%;
  object-fit: cover;
  pointer-events: none;
  position: absolute;
  top: -5%;
  transition: transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.84);
  user-select: none;
  width: 110%;

  @media (hover: hover) {
    ${Slide}[data-variant="current"]:hover & {
      transform: translate(
        calc(var(--x) / var(--d) * 1px),
        calc(var(--y) / var(--d) * 1px)
      );
    }
  }
`;

export const Content = styled.div`
  --d: 60;
  position: absolute;
  top: 55%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 85%;
  opacity: 0;
  visibility: hidden;
  transition: transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.84);

  ${Slide}[data-variant="current"] & {
    opacity: 1;
    visibility: visible;
  }

  @media (hover: hover) {
    ${Slide}[data-variant="current"]:hover & {
      transform: translate(
        calc(-50% + var(--x) / var(--d) * -1px),
        calc(-50% + var(--y) / var(--d) * -1px)
      );
    }
  }
`;

export const ContentBg = styled.div`
  position: absolute;
  inset: -1.5rem;
  background: radial-gradient(
    ellipse at center,
    rgba(0, 0, 0, 0.65) 0%,
    transparent 75%
  );
  z-index: -1;
  border-radius: 1rem;
`;

export const Stars = styled.div`
  display: flex;
  gap: 3px;
  margin-bottom: 0.5rem;
`;

export const Title = styled.div`
  font-size: clamp(1.5rem, 5vw, 2.25rem);
  font-weight: 700;
  color: #ffffff;
  line-height: 1.25;
  text-shadow:
    0 1px 3px rgba(0, 0, 0, 0.9),
    0 4px 16px rgba(0, 0, 0, 0.8),
    0 0 40px rgba(0, 0, 0, 0.6);
  word-break: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
`;

export const Arrow = styled.button<{ $side: "prev" | "next" }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #d4d4d8;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 20;
  backdrop-filter: blur(8px);
  font-size: 1.125rem;
  line-height: 1;

  &:hover {
    background: rgba(255, 255, 255, 0.18);
    color: #fafafa;
    transform: translateY(-50%) scale(1.08);
  }

  ${({ $side }) =>
    $side === "prev"
      ? css`
          left: -3.5rem;
        `
      : css`
          right: -3.5rem;
        `}
`;

export const Nav = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.875rem;
`;

export const Dots = styled.div`
  display: flex;
  gap: 4px;
`;

export const Dot = styled.button<{ $active: boolean }>`
  width: ${({ $active }) => ($active ? "16px" : "6px")};
  height: 6px;
  border-radius: ${({ $active }) => ($active ? "3px" : "50%")};
  background: ${({ $active }) =>
    $active ? "#fbbf24" : "rgba(255, 255, 255, 0.2)"};
  box-shadow: ${({ $active }) =>
    $active ? "0 0 8px rgba(251, 191, 36, 0.5)" : "none"};
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  padding: 0;
`;

export const NoCover = styled.div`
  width: 100%;
  height: 100%;
  background-color: #27272a;
`;
