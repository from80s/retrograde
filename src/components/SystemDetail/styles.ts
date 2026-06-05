import styled from "styled-components";

// Wrapper principal: fixed fullscreen preto
export const Wrapper = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  background: #000;
`;

// Botão de fechar (X)
export const CloseButton = styled.button`
  position: fixed;
  top: 1rem;
  right: 2rem;
  z-index: 70;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background: rgba(24, 24, 27, 0.8);
  border: 1px solid rgba(63, 63, 70, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a1a1aa;
  cursor: pointer;
  transition: color 0.15s, background 0.15s;

  &:hover {
    color: #e4e4e7;
    background: #27272a;
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

// Container de scroll único
export const ScrollContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

// Wrapper relativo para o hero
export const HeroWrapper = styled.div`
  position: relative;
`;

// Seção sticky que cobre a tela
export const HeroSection = styled.section`
  position: sticky;
  top: 0;
  z-index: 40;
  height: 100vh;
  background: #000;
  overflow: clip;
`;

// Container da máscara (contém fanart blur + gradient + content panel)
export const MaskContainer = styled.div`
  position: absolute;
  inset: 0;
  will-change: mask-size, -webkit-mask-size;
`;

// Fanart blur layers container
export const FanartLayersContainer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
`;

// Fanart individual layer
export const FanartLayer = styled.div<{ $blur: number; $gradientMask: string; $backgroundImage: string }>`
  position: absolute;
  inset: 0;
  background-image: ${({ $backgroundImage }) => $backgroundImage};
  background-size: cover;
  background-position: center;
  filter: blur(${({ $blur }) => $blur}px);
  -webkit-mask-image: ${({ $gradientMask }) => $gradientMask};
  mask-image: ${({ $gradientMask }) => $gradientMask};
`;

// Gradiente de overlay sobre fanart
export const FanartOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    #09090b 0%,
    rgba(9, 9, 11, 0.6) 50%,
    rgba(9, 9, 11, 0.2) 100%
  );
`;

// Logo centralizado
export const LogoImage = styled.img`
  position: absolute;
  inset: 0;
  z-index: 20;
  margin: auto;
  pointer-events: none;
  user-select: none;
  object-fit: contain;
  will-change: width;
  filter: brightness(0) invert(1);
`;

// Ícone de scroll
export const ScrollIconWrapper = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 30;
  color: #a1a1aa;
  pointer-events: none;
  user-select: none;
  bottom: 10vh;
  opacity: 1;
`;

export const ScrollIconSvg = styled.svg`
  width: 4rem;
  height: 4rem;
  animation: bounce 1s infinite;
  opacity: 0.7;

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
`;

// Espaçador que gera a scroll height (200vh)
export const ScrollSpacer = styled.div`
  height: 200vh;
`;

// ===== ContentPanel =====

export const ContentPanelWrapper = styled.div<{ $visible: boolean }>`
  position: absolute;
  inset: 0;
  z-index: 10;
  overflow: hidden;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible }) => ($visible ? "translateY(0)" : "translateY(40px)")};
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: ${({ $visible }) => ($visible ? "auto" : "none")};
`;

export const ContentLayout = styled.div`
  display: flex;
  height: 100%;
`;

// Coluna esquerda - card fixo com hardware bg
export const LeftColumn = styled.div`
  width: 55%;
  flex-shrink: 0;
  padding: 1.5rem;
`;

export const HardwareCard = styled.div`
  position: relative;
  height: 100%;
  border-radius: 1rem;
  border: 1px solid rgba(39, 39, 42, 0.5);
  overflow: hidden;
`;

export const HardwareImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const HardwareOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(9, 9, 11, 0.9) 0%,
    rgba(9, 9, 11, 0.7) 50%,
    rgba(9, 9, 11, 0.3) 100%
  );
`;

export const HardwareContent = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.5rem;

  @media (min-width: 640px) {
    padding: 2rem;
  }
`;

export const SystemTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 1rem;
  line-height: 1.25;

  @media (min-width: 640px) {
    font-size: 1.875rem;
  }

  @media (min-width: 1024px) {
    font-size: 2.25rem;
  }
`;

export const SystemDescription = styled.p`
  font-size: 0.875rem;
  color: #e4e4e7;
  line-height: 1.625;
  max-width: 36rem;

  @media (min-width: 640px) {
    font-size: 1rem;
  }
`;

// Coluna direita - cards scrolláveis com parallax
export const RightColumn = styled.div`
  flex: 1;
  min-width: 0;
  will-change: transform;
`;

export const CardsContainer = styled.div`
  padding: 1.5rem;
  padding-left: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

// ===== ParallaxCard3D =====

export const CardRevealWrapper = styled.div<{ $delay: number }>`
  transition-delay: ${({ $delay }) => $delay}s;
`;

export const Card3D = styled.div`
  position: relative;
  border-radius: 1rem;
  background: rgba(24, 24, 27, 0.6);
  border: 1px solid rgba(39, 39, 42, 0.5);
  overflow: hidden;
  will-change: transform;
  transform-style: preserve-3d;
  transform: perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1);
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
`;

export const CardShine = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: 1rem;
  opacity: 0;
  transition: opacity 0.2s;
`;

// ===== Card Internos =====

export const CardInner = styled.div`
  padding: 1.25rem;

  @media (min-width: 640px) {
    padding: 1.5rem;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  color: #a1a1aa;

  svg {
    width: 1rem;
    height: 1rem;
  }

  span {
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

export const CardHeaderLarge = styled(CardHeader)`
  margin-bottom: 1rem;
`;

export const SpecsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

export const SpecItem = styled.div``;

export const SpecLabel = styled.span`
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #52525b;
  font-weight: 500;
  display: block;
`;

export const SpecValue = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: #e4e4e7;
`;

export const YearValue = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
  font-family: monospace;
  color: #e4e4e7;
`;

export const YearUnknown = styled.p`
  font-size: 0.875rem;
  color: #71717a;
  font-style: italic;
`;

export const SubSection = styled.div`
  margin-bottom: 0.75rem;
`;

export const SubLabel = styled.span`
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #52525b;
  font-weight: 500;
  display: block;
`;

export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-top: 0.25rem;
`;

export const EmuTag = styled.span`
  padding: 0.125rem 0.5rem;
  border-radius: 0.375rem;
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.2);
  font-size: 0.75rem;
  color: rgba(139, 92, 246, 0.8);
`;

export const ExtTag = styled.span`
  padding: 0.125rem 0.5rem;
  border-radius: 0.375rem;
  background: rgba(39, 39, 42, 0.5);
  border: 1px solid rgba(63, 63, 70, 0.3);
  font-size: 0.75rem;
  font-family: monospace;
  color: #a1a1aa;
`;

export const InfoItem = styled.div`
  margin-bottom: 0.5rem;
`;

export const CuriositiesList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const CuriosityItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #d4d4d8;
  line-height: 1.625;
`;

export const CuriosityDot = styled.span`
  margin-top: 0.375rem;
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 9999px;
  background: #8b5cf6;
  flex-shrink: 0;
`;

export const NoDataText = styled.p`
  font-size: 0.875rem;
  color: #71717a;
  font-style: italic;
`;

// Fallback: sistema não encontrado
export const NotFound = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #71717a;
`;

export const NotFoundContent = styled.div`
  text-align: center;

  svg {
    width: 3rem;
    height: 3rem;
    margin: 0 auto 1rem;
  }
`;

export const NotFoundTitle = styled.p`
  font-size: 1.125rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

export const NotFoundSubtitle = styled.p`
  font-size: 0.875rem;
`;
