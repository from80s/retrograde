import styled from "styled-components";

export const Container = styled.div`
  height: 2.5rem;
  background: #09090b;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  user-select: none;
  -webkit-app-region: drag;
`;

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const Logo = styled.div`
  width: 1rem;
  height: 1rem;
  border-radius: 9999px;
  background: linear-gradient(
    to bottom right,
    var(--color-retro-primary, #a855f7),
    var(--color-retro-secondary, #6366f1)
  );
`;

export const BrandText = styled.span`
  font-size: 0.75rem;
  color: #71717a;
  font-weight: 500;
`;

export const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  -webkit-app-region: no-drag;
`;

export const ControlButton = styled.button<{ $danger?: boolean }>`
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #71717a;
  border-radius: 0.25rem;
  transition: color 150ms ease, background-color 150ms ease;

  &:hover {
    color: ${({ $danger }) => ($danger ? "var(--color-retro-danger, #ef4444)" : "#d4d4d8")};
    background-color: #27272a;
  }
`;
