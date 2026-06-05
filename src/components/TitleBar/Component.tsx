import { LuMinus, LuSquare, LuX } from "react-icons/lu";
import { Container, Brand, Logo, BrandText, Controls, ControlButton } from "./styles";

export function TitleBar() {
  return (
    <Container>
      <Brand>
        <Logo />
        <BrandText>RetroGrade</BrandText>
      </Brand>
      <Controls>
        <ControlButton onClick={() => window.api.windowMinimize()}>
          <LuMinus size={16} />
        </ControlButton>
        <ControlButton onClick={() => window.api.windowMaximize()}>
          <LuSquare size={14} />
        </ControlButton>
        <ControlButton $danger onClick={() => window.api.windowClose()}>
          <LuX size={16} />
        </ControlButton>
      </Controls>
    </Container>
  );
}
