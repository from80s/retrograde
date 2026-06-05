import styled from "styled-components";

interface SystemLogoProps {
  $size: string;
}

export const Logo = styled.img<SystemLogoProps>`
  ${({ $size }) => `
    width: ${$size.includes("w-") ? undefined : $size};
  `}
  object-fit: contain;

  &[src=""] {
    display: none;
  }
`;
