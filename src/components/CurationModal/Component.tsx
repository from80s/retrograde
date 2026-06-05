import { useEffect, useRef } from 'react';
import { LuX, LuShieldCheck, LuCircleCheckBig, LuCircleX, LuStar } from "react-icons/lu";
import { getSystemLogo } from '../../lib/system-logos';
import {
  Overlay, ModalContent, Header, HeaderLeft, HeaderInfo,
  Title, Subtitle, HeaderActions, CancelButton, CloseButton,
  ProgressSection, ProgressLabel, ProgressBar, ProgressFill, ProgressFooter,
  CurrentFile, FileName, FileSystem, StatsGrid, StatCard, StatValue, StatLabel,
  LogSection, LogHeader, LogTitle, LogCount, LogList, LogEntry,
  LogFileName, LogSystem, RatingBadge, RatingText, GenresText, EmptyLog,
  SpinnerIcon,
} from './styles';

interface LogEntry {
  fileName: string;
  status: string;
  rating: number | null;
  system: string;
  genres?: string[];
}

interface CurationModalProps {
  onClose: () => void;
  onCancel?: () => void;
  progress: number;
  currentFile: string;
  currentSystem: string;
  currentRating: number | null;
  currentStatus: 'classic' | 'kept' | 'removed' | null;
  classics: number;
  kept: number;
  removed: number;
  total: number;
  current: number;
  log: LogEntry[];
  cancelled?: boolean;
}

const statusIcons = {
  classic: LuShieldCheck,
  kept: LuCircleCheckBig,
  removed: LuCircleX,
};

const statusColors = {
  classic: '#a78bfa',
  kept: '#22c55e',
  removed: '#ef4444',
};

export function CurationModal({
  onClose,
  onCancel,
  progress,
  currentFile,
  currentSystem,
  currentRating,
  currentStatus,
  classics,
  kept,
  removed,
  total,
  current,
  log,
  cancelled,
}: CurationModalProps) {
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [log]);

  return (
    <Overlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Header>
          <HeaderLeft>
            {cancelled ? (
              <LuCircleX size={20} color="#ef4444" />
            ) : (
              <SpinnerIcon size={20} color="#818cf8" />
            )}
            <HeaderInfo>
              <Title>{cancelled ? 'Curadoria Cancelada' : 'Curadoria em Andamento'}</Title>
              <Subtitle>
                {cancelled ? 'Processamento interrompido' : `Processando ${current} de ${total} ROMs`}
              </Subtitle>
            </HeaderInfo>
          </HeaderLeft>
          <HeaderActions>
            {!cancelled && onCancel && (
              <CancelButton onClick={onCancel}>
                <LuCircleX size={16} />
                Cancelar
              </CancelButton>
            )}
            <CloseButton onClick={onClose}>
              <LuX size={20} />
            </CloseButton>
          </HeaderActions>
        </Header>

        <ProgressSection>
          <ProgressLabel>
            <span>Progresso</span>
            <span>{Math.round(progress)}%</span>
          </ProgressLabel>
          <ProgressBar>
            <ProgressFill style={{ width: `${progress}%` }} />
          </ProgressBar>
          <ProgressFooter>
            <span>{current} processados</span>
            <span>{total - current} restantes</span>
          </ProgressFooter>

          {currentFile && (
            <CurrentFile>
              {currentStatus && (() => {
                const Icon = statusIcons[currentStatus];
                const color = statusColors[currentStatus];
                return <Icon size={16} color={color} style={{ flexShrink: 0 }} />;
              })()}
              <div style={{ flex: 1, minWidth: 0 }}>
                <FileName>{currentFile}</FileName>
                <FileSystem>{currentSystem}</FileSystem>
              </div>
              {currentRating !== null && (
                <RatingBadge>
                  <LuStar size={12} color="#fbbf24" />
                  <RatingText>{currentRating.toFixed(0)}</RatingText>
                </RatingBadge>
              )}
            </CurrentFile>
          )}

          <StatsGrid>
            <StatCard $variant="secondary">
              <StatValue $variant="secondary">{classics}</StatValue>
              <StatLabel>Clássicos</StatLabel>
            </StatCard>
            <StatCard $variant="success">
              <StatValue $variant="success">{kept}</StatValue>
              <StatLabel>Mantidos</StatLabel>
            </StatCard>
            <StatCard $variant="danger">
              <StatValue $variant="danger">{removed}</StatValue>
              <StatLabel>Removidos</StatLabel>
            </StatCard>
          </StatsGrid>
        </ProgressSection>

        <LogSection>
          <LogHeader>
            <LogTitle>Log de Atividades</LogTitle>
            <LogCount>{log.length} entradas</LogCount>
          </LogHeader>
          <LogList ref={logRef}>
            {log.map((entry, index) => {
              const Icon = statusIcons[entry.status as keyof typeof statusIcons] || LuCircleCheckBig;
              const color = statusColors[entry.status as keyof typeof statusColors] || '#a1a1aa';

              return (
                <LogEntry key={`${entry.fileName}-${index}`}>
                  <Icon size={16} color={color} style={{ flexShrink: 0 }} />
                  <LogFileName>{entry.fileName}</LogFileName>
                  {(() => {
                    const logo = getSystemLogo(undefined, entry.system);
                    return logo ? (
                      <img
                        src={`system/logos/${logo}`}
                        alt={entry.system}
                        style={{ width: 16, height: 16, objectFit: 'contain', flexShrink: 0 }}
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    ) : (
                      <LogSystem>{entry.system}</LogSystem>
                    );
                  })()}
                  {entry.rating !== null && (
                    <RatingBadge>
                      <LuStar size={12} color="#fbbf24" />
                      <RatingText>{entry.rating.toFixed(0)}</RatingText>
                    </RatingBadge>
                  )}
                  {entry.genres && entry.genres.length > 0 && (
                    <GenresText>{entry.genres.slice(0, 2).join(', ')}</GenresText>
                  )}
                </LogEntry>
              );
            })}
            {log.length === 0 && (
              <EmptyLog>
                <p>Aguardando processamento...</p>
              </EmptyLog>
            )}
          </LogList>
        </LogSection>
      </ModalContent>
    </Overlay>
  );
}
