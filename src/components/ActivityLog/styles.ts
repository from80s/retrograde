import styled from "styled-components";
import { motion } from "framer-motion";

export const MotionDiv = motion.div as React.ComponentType<
  React.ComponentProps<typeof motion.div>
>;

export const GlassContainer = styled.div`
  background: rgba(24, 24, 27, 0.8);
  border: 1px solid rgba(63, 63, 70, 0.5);
  backdrop-filter: blur(12px);
  border-radius: 1rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const Header = styled.div`
  padding: 1rem;
  border-bottom: 1px solid rgba(39, 39, 42, 0.5);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
`;

export const Title = styled.h3`
  font-weight: 600;
  color: #e4e4e7;
`;

export const Count = styled.span`
  font-size: 0.75rem;
  color: #71717a;
  font-family: monospace;
`;

export const LogList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-height: 0;
`;

export const LogEntry = styled(MotionDiv)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  transition: background-color 150ms ease;

  &:hover {
    background-color: rgba(39, 39, 42, 0.3);
  }
`;

export const IconWrapper = styled.span<{ $color: string }>`
  display: flex;
  flex-shrink: 0;
  color: ${({ $color }) => $color};
`;

export const FileName = styled.span`
  font-size: 0.875rem;
  font-family: monospace;
  color: #d4d4d8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
`;

export const SystemLogo = styled.img`
  width: 1rem;
  height: 1rem;
  object-fit: contain;
  flex-shrink: 0;
`;

export const SystemName = styled.span`
  font-size: 0.75rem;
  color: #71717a;
  flex-shrink: 0;
`;

export const RatingWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
`;

export const RatingText = styled.span`
  font-size: 0.75rem;
  font-family: monospace;
  color: var(--color-retro-warning, #eab308);
`;

export const GenresText = styled.span`
  font-size: 0.75rem;
  color: #71717a;
  flex-shrink: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
`;

export const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #52525b;
`;

export const EmptyText = styled.p`
  font-size: 0.875rem;
`;
