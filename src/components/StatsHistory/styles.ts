import styled from 'styled-components';
import { motion } from 'framer-motion';
import type { MotionProps } from 'framer-motion';

/* Wrapper do motion.div para uso com styled-components */
export const MotionDiv = motion.div as React.ComponentType<MotionProps & React.HTMLAttributes<HTMLDivElement>>;

/* Container de sobreposição */
export const Overlay = styled(MotionDiv)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

/* Container do modal */
export const ModalContainer = styled(MotionDiv)`
  background: rgba(24, 24, 27, 0.6);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(39, 39, 42, 0.5);
  border-radius: 1rem;
  width: 100%;
  max-width: 56rem;
  max-height: 85vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

/* Cabeçalho do modal */
export const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(39, 39, 42, 0.5);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

/* Conteúdo do cabeçalho */
export const ModalHeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

/* Ícone do cabeçalho */
export const HeaderIcon = styled.span`
  color: #22d3ee;

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

/* Título do modal */
export const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #f4f4f5;
`;

/* Botão de fechar */
export const CloseButton = styled.button`
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a1a1aa;
  transition: color 0.2s, background-color 0.2s;

  &:hover {
    color: #e4e4e7;
    background: #27272a;
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

/* Container de abas */
export const TabsContainer = styled.div`
  padding: 1rem 1.5rem 0;
  display: flex;
  gap: 0.5rem;
`;

/* Botão de aba */
export const TabButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
  background: ${({ $active }) => ($active ? 'rgba(34, 211, 238, 0.1)' : 'transparent')};
  color: ${({ $active }) => ($active ? '#22d3ee' : '#71717a')};
  border: ${({ $active }) => ($active ? '1px solid rgba(34, 211, 238, 0.3)' : '1px solid transparent')};

  &:hover {
    color: ${({ $active }) => ($active ? '#22d3ee' : '#d4d4d8')};
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

/* Área de conteúdo */
export const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #3f3f46 #18181b;
  padding: 1.5rem;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #18181b;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #3f3f46;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #52525b;
  }
`;

/* Estado vazio */
export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  color: #52525b;

  svg {
    width: 3rem;
    height: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  p {
    font-size: 0.875rem;
  }
`;

/* Grid de resumo */
export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
`;

/* Cartão de resumo */
export const SummaryCard = styled(MotionDiv)`
  background: rgba(24, 24, 27, 0.6);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(39, 39, 42, 0.5);
  border-radius: 0.75rem;
  padding: 1rem;
  text-align: center;
`;

/* Ícone do cartão */
export const CardIcon = styled.span<{ $color: string }>`
  display: block;
  margin: 0 auto 0.5rem;
  color: ${({ $color }) => $color};

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

/* Valor do cartão */
export const CardValue = styled.p<{ $color: string }>`
  font-size: 1.5rem;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  color: ${({ $color }) => $color};
`;

/* Rótulo do cartão */
export const CardLabel = styled.p`
  font-size: 0.75rem;
  color: #71717a;
  margin-top: 0.25rem;
`;

/* Container do gráfico de barras */
export const BarChartContainer = styled.div`
  background: rgba(24, 24, 27, 0.6);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(39, 39, 42, 0.5);
  border-radius: 0.75rem;
  padding: 1.5rem;
`;

/* Título do gráfico */
export const ChartTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: #a1a1aa;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1.5rem;
`;

/* Container das barras */
export const BarsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

/* Linha individual do gráfico */
export const BarRow = styled(MotionDiv)`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

/* Cabeçalho da barra */
export const BarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
`;

/* Rótulo da pasta */
export const FolderLabel = styled.span`
  color: #a1a1aa;
  font-family: 'JetBrains Mono', monospace;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
`;

/* Data da execução */
export const ExecutionDate = styled.span`
  color: #71717a;
`;

/* Container das barras de progresso */
export const BarsRow = styled.div`
  display: flex;
  gap: 2px;
  height: 2rem;
`;

/* Barra de progresso */
export const ProgressBar = styled(MotionDiv)<{ $color: string; $rounded?: string }>`
  background: ${({ $color }) => $color};
  opacity: 0.6;
  border-radius: ${({ $rounded }) => ($rounded === 'left' ? '4px 0 0 4px' : $rounded === 'right' ? '0 4px 4px 0' : '0')};
  position: relative;

  &:hover > div {
    opacity: 1;
  }
`;

/* Tooltip da barra */
export const BarTooltip = styled.div<{ $color: string }>`
  position: absolute;
  top: -2rem;
  left: 50%;
  transform: translateX(-50%);
  background: #27272a;
  color: ${({ $color }) => $color};
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
`;

/* Container da legenda */
export const LegendContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(39, 39, 42, 0.5);
`;

/* Item da legenda */
export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

/* Ponto da legenda */
export const LegendDot = styled.div<{ $color: string }>`
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 2px;
  background: ${({ $color }) => $color};
  opacity: 0.6;
`;

/* Texto da legenda */
export const LegendText = styled.span`
  font-size: 0.75rem;
  color: #71717a;
`;

/* Container do gráfico de pizza */
export const PieChartContainer = styled.div`
  background: rgba(24, 24, 27, 0.6);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(39, 39, 42, 0.5);
  border-radius: 0.75rem;
  padding: 1.5rem;
`;

/* Wrapper do SVG */
export const PieSvgWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
`;

/* Container do SVG */
export const PieSvgContainer = styled.div`
  position: relative;
  width: 8rem;
  height: 8rem;

  svg {
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
  }
`;

/* Texto central do SVG */
export const PieCenterText = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/* Valor central */
export const PieCenterValue = styled.span`
  font-size: 1.125rem;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  color: #e4e4e7;
`;

/* Legenda do gráfico de pizza */
export const PieLegend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

/* Item da legenda do pizza */
export const PieLegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

/* Ponto da legenda do pizza */
export const PieLegendDot = styled.div<{ $color: string }>`
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 9999px;
  background: ${({ $color }) => $color};
`;

/* Rótulo da legenda do pizza */
export const PieLegendLabel = styled.p`
  font-size: 0.875rem;
  color: #d4d4d8;
`;

/* Valor da legenda do pizza */
export const PieLegendValue = styled.p`
  font-size: 0.75rem;
  color: #71717a;
`;

/* Container da lista detalhada */
export const DetailList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

/* Cartão da lista detalhada */
export const DetailCard = styled(MotionDiv)`
  background: rgba(24, 24, 27, 0.6);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(39, 39, 42, 0.5);
  border-radius: 0.75rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

/* Cabeçalho do cartão da lista */
export const DetailCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

/* Conteúdo do cabeçalho do cartão */
export const DetailCardHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

/* Ícone do cartão da lista */
export const DetailCardIcon = styled.span`
  color: #22d3ee;

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

/* Texto da pasta */
export const FolderText = styled.span`
  font-size: 0.875rem;
  font-family: 'JetBrains Mono', monospace;
  color: #d4d4d8;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 28rem;
`;

/* Data do cartão */
export const DetailDate = styled.span`
  font-size: 0.75rem;
  color: #71717a;
  font-family: 'JetBrains Mono', monospace;
`;

/* Grid de estatísticas do cartão */
export const DetailStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
`;

/* Estatística individual */
export const DetailStat = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

/* Ícone da estatística */
export const StatIcon = styled.span<{ $color: string }>`
  color: ${({ $color }) => $color};

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

/* Rótulo da estatística */
export const StatLabel = styled.p`
  font-size: 0.75rem;
  color: #71717a;
`;

/* Valor da estatística */
export const StatValue = styled.p<{ $color: string }>`
  font-size: 0.875rem;
  font-family: 'JetBrains Mono', monospace;
  color: ${({ $color }) => $color};
`;

/* Container de sistemas encontrados */
export const DetailSystems = styled.div`
  padding-top: 0.75rem;
  border-top: 1px solid rgba(39, 39, 42, 0.5);
`;

/* Título dos sistemas */
export const SystemsTitle = styled.p`
  font-size: 0.75rem;
  color: #71717a;
  margin-bottom: 0.5rem;
`;

/* Container das tags de sistemas */
export const SystemsTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

/* Tag de sistema */
export const SystemTag = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  background: rgba(39, 39, 42, 0.5);
  border-radius: 0.5rem;
  padding: 0.25rem 0.5rem;
`;

/* Logo do sistema */
export const SystemLogo = styled.img`
  width: 1rem;
  height: 1rem;
`;

/* Texto do sistema */
export const SystemText = styled.span`
  font-size: 0.75rem;
  color: #d4d4d8;
  font-family: 'JetBrains Mono', monospace;
`;

/* Contagem do sistema */
export const SystemCount = styled.span`
  font-size: 0.75rem;
  color: #71717a;
`;
