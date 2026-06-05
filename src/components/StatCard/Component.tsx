import { type IconType } from "react-icons";
import {
  GlassContainer,
  BgOverlay,
  Content,
  IconWrapper,
  Value,
  Label,
} from "./styles";

interface StatCardProps {
  label: string;
  value: number;
  icon: IconType;
  color: string;
}

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  'retro-primary': { bg: 'rgba(34, 211, 238, 0.1)', text: '#22d3ee', border: 'rgba(34, 211, 238, 0.2)' },
  'retro-secondary': { bg: 'rgba(167, 139, 250, 0.1)', text: '#a78bfa', border: 'rgba(167, 139, 250, 0.2)' },
  'retro-success': { bg: 'rgba(52, 211, 153, 0.1)', text: '#34d399', border: 'rgba(52, 211, 153, 0.2)' },
  'retro-danger': { bg: 'rgba(248, 113, 113, 0.1)', text: '#f87171', border: 'rgba(248, 113, 113, 0.2)' },
};

export function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  const colors = colorMap[color] || colorMap['retro-primary'];

  return (
    <GlassContainer
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <BgOverlay $bgColor={colors.bg} />
      <Content>
        <IconWrapper $bgColor={colors.bg} $borderColor={colors.border}>
          <Icon style={{ width: '1.5rem', height: '1.5rem', color: colors.text }} />
        </IconWrapper>
        <Value
          key={value}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          $textColor={colors.text}
        >
          {value.toLocaleString('pt-BR')}
        </Value>
        <Label>{label}</Label>
      </Content>
    </GlassContainer>
  );
}
