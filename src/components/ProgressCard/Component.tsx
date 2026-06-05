import { LuGamepad2, LuStar, LuShieldCheck, LuCircleCheckBig, LuCircleX } from "react-icons/lu";
import { ProgressBar } from "../ProgressBar";
import { SystemLogo } from "../SystemLogo";
import {
  GlassContainer,
  FileRow,
  StatusIconWrapper,
  FileInfo,
  FileName,
  SystemInfo,
  SystemName,
  RatingWrapper,
  RatingValue,
  StatusBadge,
} from "./styles";

interface ProgressCardProps {
  progress: number;
  currentFile: string;
  currentSystem: string;
  currentRating: number | null;
  currentStatus: 'classic' | 'kept' | 'removed' | null;
}

const statusConfig = {
  classic: { icon: LuShieldCheck, color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.1)', label: 'Clássico Preservado' },
  kept: { icon: LuCircleCheckBig, color: '#34d399', bg: 'rgba(52, 211, 153, 0.1)', label: 'Mantido por Nota' },
  removed: { icon: LuCircleX, color: '#f87171', bg: 'rgba(248, 113, 113, 0.1)', label: 'Removido' },
};

export function ProgressCard({ progress, currentFile, currentSystem, currentRating, currentStatus }: ProgressCardProps) {
  const status = currentStatus ? statusConfig[currentStatus] : null;
  const StatusIcon = status?.icon || LuGamepad2;

  return (
    <GlassContainer>
      <ProgressBar
        percent={progress}
        label="Progresso da Curadoria"
        color="from-retro-primary to-retro-secondary"
      />

      {currentFile && (
        <FileRow
          key={currentFile}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <StatusIconWrapper $bgColor={status?.bg || 'rgba(63, 63, 70, 1)'}>
            <StatusIcon style={{ width: '1.25rem', height: '1.25rem', color: status?.color || '#a1a1aa' }} />
          </StatusIconWrapper>
          <FileInfo>
            <FileName>{currentFile}</FileName>
            <SystemInfo>
              <SystemLogo system={currentSystem} />
              <SystemName>{currentSystem}</SystemName>
            </SystemInfo>
          </FileInfo>
          {currentRating !== null && (
            <RatingWrapper>
              <LuStar style={{ width: '1rem', height: '1rem', color: '#fbbf24', fill: '#fbbf24' }} />
              <RatingValue>{(currentRating / 10).toFixed(1)}</RatingValue>
            </RatingWrapper>
          )}
          {status && (
            <StatusBadge $bgColor={status.bg} $textColor={status.color}>
              {status.label}
            </StatusBadge>
          )}
        </FileRow>
      )}
    </GlassContainer>
  );
}
