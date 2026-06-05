import styled from "styled-components";

export const Container = styled.div`
  position: relative;
`;

export const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  color: #71717a;
  pointer-events: none;
`;

export const Input = styled.input`
  width: 100%;
  background: rgba(39, 39, 42, 0.5);
  border: 1px solid rgba(63, 63, 70, 0.5);
  border-radius: 0.75rem;
  padding: 0.5rem 2.5rem 0.5rem 2.5rem;
  font-size: 0.875rem;
  color: #e4e4e7;
  outline: none;
  transition: border-color 200ms ease;

  &:focus {
    border-color: rgba(var(--color-retro-primary-rgb, 168, 85, 247), 0.5);
  }

  &::placeholder {
    color: #52525b;
  }
`;

export const ClearButton = styled.button`
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #71717a;
  transition: all 200ms ease;

  &:hover {
    color: #e4e4e7;
    background: rgba(63, 63, 70, 0.5);
  }
`;
