import { useState, useEffect } from 'react';
import { LuX, LuHistory, LuGamepad2, LuShieldCheck, LuCircleCheckBig, LuCircleX, LuTrendingUp } from "react-icons/lu";
import { getSystemLogo } from '../../lib/system-logos';
import {
  Overlay,
  ModalContainer,
  ModalHeader,
  ModalHeaderContent,
  HeaderIcon,
  ModalTitle,
  CloseButton,
  TabsContainer,
  TabButton,
  ContentArea,
  EmptyState,
  SummaryGrid,
  SummaryCard,
  CardIcon,
  CardValue,
  CardLabel,
  BarChartContainer,
  ChartTitle,
  BarsContainer,
  BarRow,
  BarHeader,
  FolderLabel,
  ExecutionDate,
  BarsRow,
  ProgressBar,
  BarTooltip,
  LegendContainer,
  LegendItem,
  LegendDot,
  LegendText,
  PieChartContainer,
  PieSvgWrapper,
  PieSvgContainer,
  PieCenterText,
  PieCenterValue,
  PieLegend,
  PieLegendItem,
  PieLegendDot,
  PieLegendLabel,
  PieLegendValue,
  DetailList,
  DetailCard,
  DetailCardHeader,
  DetailCardHeaderLeft,
  DetailCardIcon,
  FolderText,
  DetailDate,
  DetailStatsGrid,
  DetailStat,
  StatIcon,
  StatLabel,
  StatValue,
  DetailSystems,
  SystemsTitle,
  SystemsTags,
  SystemTag,
  SystemLogo,
  SystemText,
  SystemCount,
} from './styles';

interface StatsHistoryProps {
  onClose: () => void;
}

export function StatsHistory({ onClose }: StatsHistoryProps) {
  const [stats, setStats] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'chart' | 'list'>('chart');

  useEffect(() => {
    window.api.readStats().then(setStats);
  }, []);

  const reversedStats = [...stats].reverse();
  const maxTotal = Math.max(...stats.map((s) => s.total_encontrado), 1);

  const totals = {
    total: stats.reduce((acc, s) => acc + s.total_encontrado, 0),
    classics: stats.reduce((acc, s) => acc + s.preservados_classicos, 0),
    kept: stats.reduce((acc, s) => acc + s.mantidos_por_nota, 0),
    removed: stats.reduce((acc, s) => acc + s.removidos, 0),
  };

  return (
    <Overlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <ModalContainer
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <ModalHeader>
          <ModalHeaderContent>
            <HeaderIcon>
              <LuHistory />
            </HeaderIcon>
            <ModalTitle>Histórico de Execuções</ModalTitle>
          </ModalHeaderContent>
          <CloseButton onClick={onClose}>
            <LuX />
          </CloseButton>
        </ModalHeader>

        {/* Abas */}
        <TabsContainer>
          <TabButton
            $active={activeTab === 'chart'}
            onClick={() => setActiveTab('chart')}
          >
            <LuTrendingUp />
            Gráficos
          </TabButton>
          <TabButton
            $active={activeTab === 'list'}
            onClick={() => setActiveTab('list')}
          >
            <LuHistory />
            Lista Detalhada
          </TabButton>
        </TabsContainer>

        {/* Conteúdo */}
        <ContentArea>
          {stats.length === 0 ? (
            <EmptyState>
              <LuHistory />
              <p>Nenhuma execução registrada</p>
            </EmptyState>
          ) : activeTab === 'chart' ? (
            <div className="space-y-8">
              {/* Cartões de Resumo */}
              <SummaryGrid>
                <SummaryCard
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <CardIcon $color="#22d3ee"><LuGamepad2 /></CardIcon>
                  <CardValue $color="#22d3ee">{totals.total.toLocaleString('pt-BR')}</CardValue>
                  <CardLabel>Total Analisado</CardLabel>
                </SummaryCard>
                <SummaryCard
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                >
                  <CardIcon $color="#a78bfa"><LuShieldCheck /></CardIcon>
                  <CardValue $color="#a78bfa">{totals.classics.toLocaleString('pt-BR')}</CardValue>
                  <CardLabel>Clássicos</CardLabel>
                </SummaryCard>
                <SummaryCard
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <CardIcon $color="#34d399"><LuCircleCheckBig /></CardIcon>
                  <CardValue $color="#34d399">{totals.kept.toLocaleString('pt-BR')}</CardValue>
                  <CardLabel>Mantidos</CardLabel>
                </SummaryCard>
                <SummaryCard
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <CardIcon $color="#f87171"><LuCircleX /></CardIcon>
                  <CardValue $color="#f87171">{totals.removed.toLocaleString('pt-BR')}</CardValue>
                  <CardLabel>Removidos</CardLabel>
                </SummaryCard>
              </SummaryGrid>

              {/* Gráfico de Barras */}
              <BarChartContainer>
                <ChartTitle>Execuções por Pasta</ChartTitle>
                <BarsContainer>
                  {reversedStats.slice(0, 10).map((stat, index) => (
                    <BarRow
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <BarHeader>
                        <FolderLabel>{stat.pasta.split('/').pop()}</FolderLabel>
                        <ExecutionDate>{stat.data}</ExecutionDate>
                      </BarHeader>
                      <BarsRow>
                        {/* Barra de Clássicos */}
                        <ProgressBar
                          $color="#a78bfa"
                          $rounded="left"
                          initial={{ width: 0 }}
                          animate={{ width: `${(stat.preservados_classicos / maxTotal) * 100}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                          style={{ minWidth: stat.preservados_classicos > 0 ? '4px' : '0' }}
                        >
                          <BarTooltip $color="#a78bfa">
                            Clássicos: {stat.preservados_classicos}
                          </BarTooltip>
                        </ProgressBar>
                        {/* Barra de Mantidos */}
                        <ProgressBar
                          $color="#34d399"
                          initial={{ width: 0 }}
                          animate={{ width: `${(stat.mantidos_por_nota / maxTotal) * 100}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 + 0.1 }}
                          style={{ minWidth: stat.mantidos_por_nota > 0 ? '4px' : '0' }}
                        >
                          <BarTooltip $color="#34d399">
                            Mantidos: {stat.mantidos_por_nota}
                          </BarTooltip>
                        </ProgressBar>
                        {/* Barra de Removidos */}
                        <ProgressBar
                          $color="#f87171"
                          $rounded="right"
                          initial={{ width: 0 }}
                          animate={{ width: `${(stat.removidos / maxTotal) * 100}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
                          style={{ minWidth: stat.removidos > 0 ? '4px' : '0' }}
                        >
                          <BarTooltip $color="#f87171">
                            Removidos: {stat.removidos}
                          </BarTooltip>
                        </ProgressBar>
                      </BarsRow>
                    </BarRow>
                  ))}
                </BarsContainer>

                {/* Legenda */}
                <LegendContainer>
                  <LegendItem>
                    <LegendDot $color="#a78bfa" />
                    <LegendText>Clássicos</LegendText>
                  </LegendItem>
                  <LegendItem>
                    <LegendDot $color="#34d399" />
                    <LegendText>Mantidos</LegendText>
                  </LegendItem>
                  <LegendItem>
                    <LegendDot $color="#f87171" />
                    <LegendText>Removidos</LegendText>
                  </LegendItem>
                </LegendContainer>
              </BarChartContainer>

              {/* Distribuição tipo pizza */}
              <PieChartContainer>
                <ChartTitle>Distribuição Geral</ChartTitle>
                <PieSvgWrapper>
                  <PieSvgContainer>
                    <svg viewBox="0 0 36 36">
                      {(() => {
                        const total = totals.classics + totals.kept + totals.removed;
                        if (total === 0) return null;
                        const classicsPct = (totals.classics / total) * 100;
                        const keptPct = (totals.kept / total) * 100;
                        const removedPct = (totals.removed / total) * 100;
                        return (
                          <>
                            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#a78bfa" strokeWidth="3" strokeDasharray={`${classicsPct} ${100 - classicsPct}`} strokeDashoffset="0" />
                            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#34d399" strokeWidth="3" strokeDasharray={`${keptPct} ${100 - keptPct}`} strokeDashoffset={`-${classicsPct}`} />
                            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f87171" strokeWidth="3" strokeDasharray={`${removedPct} ${100 - removedPct}`} strokeDashoffset={`-${classicsPct + keptPct}`} />
                          </>
                        );
                      })()}
                    </svg>
                    <PieCenterText>
                      <PieCenterValue>{totals.total.toLocaleString('pt-BR')}</PieCenterValue>
                    </PieCenterText>
                  </PieSvgContainer>
                  <PieLegend>
                    <PieLegendItem>
                      <PieLegendDot $color="#a78bfa" />
                      <div>
                        <PieLegendLabel>Clássicos</PieLegendLabel>
                        <PieLegendValue>{totals.classics} ({totals.total > 0 ? Math.round((totals.classics / totals.total) * 100) : 0}%)</PieLegendValue>
                      </div>
                    </PieLegendItem>
                    <PieLegendItem>
                      <PieLegendDot $color="#34d399" />
                      <div>
                        <PieLegendLabel>Mantidos</PieLegendLabel>
                        <PieLegendValue>{totals.kept} ({totals.total > 0 ? Math.round((totals.kept / totals.total) * 100) : 0}%)</PieLegendValue>
                      </div>
                    </PieLegendItem>
                    <PieLegendItem>
                      <PieLegendDot $color="#f87171" />
                      <div>
                        <PieLegendLabel>Removidos</PieLegendLabel>
                        <PieLegendValue>{totals.removed} ({totals.total > 0 ? Math.round((totals.removed / totals.total) * 100) : 0}%)</PieLegendValue>
                      </div>
                    </PieLegendItem>
                  </PieLegend>
                </PieSvgWrapper>
              </PieChartContainer>
            </div>
          ) : (
            <DetailList>
              {reversedStats.map((stat, index) => {
                const sistemas = stat.sistemas as Record<string, number> || {};
                const sistemaEntries = Object.entries(sistemas).sort((a, b) => a[0].localeCompare(b[0]));

                return (
                  <DetailCard
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <DetailCardHeader>
                      <DetailCardHeaderLeft>
                        <DetailCardIcon><LuGamepad2 /></DetailCardIcon>
                        <FolderText>{stat.pasta}</FolderText>
                      </DetailCardHeaderLeft>
                      <DetailDate>{stat.data}</DetailDate>
                    </DetailCardHeader>
                    <DetailStatsGrid>
                      <DetailStat>
                        <StatIcon $color="#22d3ee"><LuGamepad2 /></StatIcon>
                        <div>
                          <StatLabel>Total</StatLabel>
                          <StatValue $color="#22d3ee">{stat.total_encontrado}</StatValue>
                        </div>
                      </DetailStat>
                      <DetailStat>
                        <StatIcon $color="#a78bfa"><LuShieldCheck /></StatIcon>
                        <div>
                          <StatLabel>Clássicos</StatLabel>
                          <StatValue $color="#a78bfa">{stat.preservados_classicos}</StatValue>
                        </div>
                      </DetailStat>
                      <DetailStat>
                        <StatIcon $color="#34d399"><LuCircleCheckBig /></StatIcon>
                        <div>
                          <StatLabel>Mantidos</StatLabel>
                          <StatValue $color="#34d399">{stat.mantidos_por_nota}</StatValue>
                        </div>
                      </DetailStat>
                      <DetailStat>
                        <StatIcon $color="#f87171"><LuCircleX /></StatIcon>
                        <div>
                          <StatLabel>Removidos</StatLabel>
                          <StatValue $color="#f87171">{stat.removidos}</StatValue>
                        </div>
                      </DetailStat>
                    </DetailStatsGrid>
                    {sistemaEntries.length > 0 && (
                      <DetailSystems>
                        <SystemsTitle>Sistemas encontrados:</SystemsTitle>
                        <SystemsTags>
                          {sistemaEntries.map(([ext, count]) => {
                            const logo = getSystemLogo(ext);
                            return (
                              <SystemTag key={ext}>
                                {logo && (
                                  <SystemLogo
                                    src={`system/logos/${logo}`}
                                    alt={ext}
                                  />
                                )}
                                <SystemText>{ext}</SystemText>
                                <SystemCount>({count})</SystemCount>
                              </SystemTag>
                            );
                          })}
                        </SystemsTags>
                      </DetailSystems>
                    )}
                  </DetailCard>
                );
              })}
            </DetailList>
          )}
        </ContentArea>
      </ModalContainer>
    </Overlay>
  );
}
