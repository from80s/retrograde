import { AnimatePresence } from 'framer-motion';
import { LuShieldCheck, LuCircleCheckBig, LuCircleX, LuStar } from "react-icons/lu";
import * as React from 'react';
import { getSystemLogo } from '../../lib/system-logos';
import {
  GlassContainer,
  Header,
  Title,
  Count,
  LogList,
  LogEntry,
  IconWrapper,
  FileName,
  SystemLogo,
  SystemName,
  RatingWrapper,
  RatingText,
  GenresText,
  EmptyState,
  EmptyText,
} from './styles';

interface LogEntryType {
  fileName: string;
  status: string;
  rating: number | null;
  system: string;
  genres?: string[];
}

interface ActivityLogProps {
  log: LogEntryType[];
  logRef: React.RefObject<HTMLDivElement>;
}

const statusIcons = {
  classic: LuShieldCheck,
  kept: LuCircleCheckBig,
  removed: LuCircleX,
};

const statusColors: Record<string, string> = {
  classic: 'var(--color-retro-secondary, #6366f1)',
  kept: 'var(--color-retro-success, #22c55e)',
  removed: 'var(--color-retro-danger, #ef4444)',
};

export function ActivityLog({ log, logRef }: ActivityLogProps) {
  return (
    <GlassContainer>
      <Header>
        <Title>Log de Atividades</Title>
        <Count>{log.length} entradas</Count>
      </Header>
      <LogList ref={logRef}>
        <AnimatePresence initial={false}>
          {log.map((entry, index) => {
            const Icon = statusIcons[entry.status as keyof typeof statusIcons] || LuCircleCheckBig;
            const color = statusColors[entry.status] || '#a1a1aa';

            return (
              <LogEntry
                key={`${entry.fileName}-${index}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <IconWrapper $color={color}>
                  <Icon size={16} />
                </IconWrapper>
                <FileName>{entry.fileName}</FileName>
                {(() => {
                  const logo = getSystemLogo(undefined, entry.system);
                  return logo ? (
                    <SystemLogo
                      src={`system/logos/${logo}`}
                      alt={entry.system}
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                  ) : (
                    <SystemName>{entry.system}</SystemName>
                  );
                })()}
                {entry.rating !== null && (
                  <RatingWrapper>
                    <LuStar size={12} color="var(--color-retro-warning, #eab308)" />
                    <RatingText>
                      {entry.rating.toFixed(0)}
                    </RatingText>
                  </RatingWrapper>
                )}
                {entry.genres && entry.genres.length > 0 && (
                  <GenresText>
                    {entry.genres.slice(0, 2).join(', ')}
                  </GenresText>
                )}
              </LogEntry>
            );
          })}
        </AnimatePresence>
        {log.length === 0 && (
          <EmptyState>
            <EmptyText>Nenhuma atividade registrada</EmptyText>
          </EmptyState>
        )}
      </LogList>
    </GlassContainer>
  );
}
