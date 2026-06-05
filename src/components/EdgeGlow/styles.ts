import styled from "styled-components";

interface GlowProps {
  $glowColor: string;
  $glowSize: string;
}

export const Glow = styled.div<GlowProps>`
  position: absolute;
  inset: 0;
  border-radius: 0.75rem;
  pointer-events: none;
  opacity: 0;
  transition: opacity 300ms ease;
  padding: 1px;
  background: radial-gradient(
    ${({ $glowSize, $glowColor }) => `${$glowSize} circle at var(--eg-x, 50%) var(--eg-y, 50%), ${$glowColor} 0%, rgba(168, 85, 247, 0.7) 30%, transparent 60%`}
  );
  -webkit-mask:
    linear-gradient(black, black) content-box,
    linear-gradient(black, black);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  z-index: 5;

  .group:hover & {
    opacity: 1;
  }
`;
