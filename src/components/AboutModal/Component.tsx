import { LuX, LuGithub, LuCode, LuAward, LuHeart } from "react-icons/lu";
import RetroGradeLogo from '../../../assets/images/RetroGrade.png';
import {
  Overlay, ModalContent, Header, Title, CloseButton, Body,
  Logo, Description, VersionText, InfoRow, InfoName,
  GitHubLink, LicenseLink, TechSection, TechTitle, TechList, TechBadge,
} from './styles';

interface AboutModalProps {
  onClose: () => void;
  version: string;
}

export function AboutModal({ onClose, version }: AboutModalProps) {
  return (
    <Overlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Sobre</Title>
          <CloseButton onClick={onClose}>
            <LuX size={20} />
          </CloseButton>
        </Header>

        <Body>
          <Logo src={RetroGradeLogo} alt="RetroGrade" />

          <Description>
            RetroGrade é um curador inteligente de bibliotecas de jogos retrô,
            projetado para ajudar você a organizar, limpar e preservar apenas os melhores clássicos da sua coleção.
          </Description>
          <VersionText>v{version}</VersionText>

          <InfoRow>
            <LuHeart size={16} color="#f87171" />
            <span>Criado por <InfoName>Thiago Teles</InfoName></span>
          </InfoRow>

          <GitHubLink
            href="https://github.com/from80s/retrograde"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LuGithub size={16} />
            <span>Repositório no GitHub</span>
          </GitHubLink>

          <LicenseLink
            href="https://github.com/from80s/retrograde/blob/master/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LuAward size={16} />
            <span>MIT License</span>
          </LicenseLink>

          <TechSection>
            <TechTitle>
              <LuCode size={16} />
              Tecnologias
            </TechTitle>
            <TechList>
              {['Electron', 'React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion'].map((tech) => (
                <TechBadge key={tech}>{tech}</TechBadge>
              ))}
            </TechList>
          </TechSection>
        </Body>
      </ModalContent>
    </Overlay>
  );
}
