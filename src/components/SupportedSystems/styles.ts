import styled from 'styled-components';

/* Container principal com estilo glass */
export const GlassContainer = styled.div`
  background: rgba(24, 24, 27, 0.6);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(39, 39, 42, 0.5);
  border-radius: 1rem;
  overflow: hidden;
`;

/* Barra de cabeçalho */
export const HeaderBar = styled.div`
  padding: 1rem;
  border-bottom: 1px solid rgba(39, 39, 42, 0.5);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

/* Título do cabeçalho */
export const Title = styled.h3`
  font-weight: 600;
  color: #e4e4e7;
  white-space: nowrap;
`;

/* Wrapper do campo de busca */
export const SearchWrapper = styled.div`
  flex: 1;
  max-width: 24rem;
`;

/* Container do carrossel */
export const CarouselWrapper = styled.div`
  position: relative;
`;

/* Botão de scroll */
export const ScrollButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  background: rgba(24, 24, 27, 0.8);
  border: 1px solid rgba(63, 63, 70, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a1a1aa;
  transition: color 0.2s, background-color 0.2s;

  &:hover {
    color: #e4e4e7;
    background: #27272a;
  }

  &.left {
    left: 0.5rem;
  }

  &.right {
    right: 0.5rem;
  }
`;

/* Área de scroll do carrossel */
export const CarouselScroll = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 1rem 3rem;
  cursor: grab;
  user-select: none;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  &:active {
    cursor: grabbing;
  }
`;

/* Card do sistema */
export const SystemCardWrapper = styled.div`
  flex-shrink: 0;
  width: 12rem;
  background: rgba(39, 39, 42, 0.4);
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
  border: 1px solid rgba(63, 63, 70, 0.2);
  transition: border-color 0.2s;
  position: relative;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    border-color: rgba(82, 82, 91, 0.4);
  }
`;

/* Imagem de fundo do card */
export const SystemCardBackground = styled.div<{ $bgUrl: string }>`
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-image: url(${({ $bgUrl }) => $bgUrl});
  pointer-events: none;
  transition: transform 0.5s;

  ${SystemCardWrapper}:hover & {
    transform: scale(1.1);
  }
`;

/* Sobreposição gradiente do card */
export const SystemCardOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    #09090b,
    rgba(9, 9, 11, 0.6) 60%,
    rgba(9, 9, 11, 0.2)
  );
  pointer-events: none;
`;

/* Conteúdo do card */
export const SystemCardContent = styled.div`
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
  width: 100%;
`;

/* Logo do sistema */
export const SystemLogo = styled.img`
  width: 7rem;
  height: 7rem;
  object-fit: contain;
  pointer-events: none;
  user-select: none;
`;

/* Container do nome */
export const SystemNameWrapper = styled.div`
  min-width: 0;
  width: 100%;
`;

/* Nome do sistema */
export const SystemName = styled.p`
  font-size: 0.75rem;
  font-weight: 600;
  color: #e4e4e7;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/* Nome curto do sistema */
export const SystemShortName = styled.p`
  font-size: 10px;
  color: #71717a;
`;

/* Container de extensões */
export const ExtensionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  justify-content: center;
`;

/* Badge de extensão */
export const ExtensionBadge = styled.span`
  font-size: 9px;
  font-family: 'JetBrains Mono', monospace;
  padding: 2px 4px;
  background: rgba(63, 63, 70, 0.5);
  border-radius: 4px;
  color: #22d3ee;
`;

/* Badge de mais extensões */
export const ExtensionMore = styled.span`
  font-size: 9px;
  font-family: 'JetBrains Mono', monospace;
  padding: 2px 4px;
  background: rgba(63, 63, 70, 0.3);
  border-radius: 4px;
  color: #71717a;
`;

/* Container do filtro */
export const FilterContainer = styled.div`
  padding: 0 1rem 0.75rem;
`;

/* Texto do filtro */
export const FilterText = styled.p`
  font-size: 0.75rem;
  color: #71717a;
  text-align: center;
`;

/* Estado vazio */
export const NoResults = styled.div`
  flex-shrink: 0;
  width: 100%;
  text-align: center;
  padding: 2rem 0;
  color: #71717a;
  font-size: 0.875rem;
`;
