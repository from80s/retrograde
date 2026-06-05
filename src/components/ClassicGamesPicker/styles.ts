import styled from 'styled-components';
import { motion } from 'framer-motion';
import type { MotionProps } from 'framer-motion';

/* Wrapper do motion.div para uso com styled-components */
export const MotionDiv = motion.div as React.ComponentType<MotionProps & React.HTMLAttributes<HTMLDivElement>>;

/* Container de sobreposição */
export const Overlay = styled(MotionDiv)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;
`;

/* Container do modal */
export const ModalContainer = styled(MotionDiv)`
  background: rgba(24, 24, 27, 0.6);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(39, 39, 42, 0.5);
  border-radius: 1rem;
  width: 100%;
  max-width: 48rem;
  max-height: 85vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

/* Cabeçalho do modal */
export const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(39, 39, 42, 0.5);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

/* Conteúdo do cabeçalho */
export const ModalHeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

/* Ícone do cabeçalho */
export const HeaderIcon = styled.span`
  color: #a78bfa;

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

/* Título do modal */
export const ModalTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #f4f4f5;
`;

/* Botão de fechar */
export const CloseButton = styled.button`
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a1a1aa;
  transition: color 0.2s, background-color 0.2s;

  &:hover {
    color: #e4e4e7;
    background: #27272a;
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

/* Área de conteúdo do modal */
export const ModalContent = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #3f3f46 #18181b;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #18181b;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #3f3f46;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #52525b;
  }
`;

/* Texto de descrição */
export const DescriptionText = styled.p`
  font-size: 0.75rem;
  color: #71717a;
`;

/* Barra de controles */
export const ControlsBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

/* Container do dropdown */
export const DropdownContainer = styled.div`
  position: relative;
  width: 14rem;
`;

/* Botão do dropdown */
export const DropdownButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: rgba(39, 39, 42, 0.5);
  border: 1px solid rgba(63, 63, 70, 0.5);
  border-radius: 0.75rem;
  font-size: 0.875rem;
  color: #e4e4e7;
  transition: border-color 0.2s;

  &:hover {
    border-color: rgba(82, 82, 91, 0.5);
  }
`;

/* Rótulo do dropdown */
export const DropdownLabel = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/* Chevron do dropdown */
export const DropdownChevron = styled.span<{ $open: boolean }>`
  width: 1rem;
  height: 1rem;
  color: #71717a;
  flex-shrink: 0;
  transition: transform 0.2s;
  transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'rotate(0)')};
`;

/* Menu do dropdown */
export const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.25rem;
  background: #27272a;
  border: 1px solid rgba(63, 63, 70, 0.5);
  border-radius: 0.75rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  z-index: 50;
  max-height: 16rem;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #3f3f46 #18181b;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #18181b;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #3f3f46;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #52525b;
  }
`;

/* Item do dropdown */
export const DropdownItem = styled.button<{ $active: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-align: left;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  transition: color 0.2s, background-color 0.2s;
  background: ${({ $active }) => ($active ? 'rgba(167, 139, 250, 0.1)' : 'transparent')};
  color: ${({ $active }) => ($active ? '#a78bfa' : '#a1a1aa')};
  font-weight: ${({ $active }) => ($active ? 500 : 400)};

  &:hover {
    color: ${({ $active }) => ($active ? '#a78bfa' : '#e4e4e7')};
    background: ${({ $active }) => ($active ? 'rgba(167, 139, 250, 0.1)' : 'rgba(63, 63, 70, 0.3)')};
  }
`;

/* Container de busca */
export const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 20rem;
`;

/* Ícone de busca */
export const SearchIcon = styled.span`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  color: #71717a;
`;

/* Input de busca */
export const SearchInput = styled.input`
  width: 100%;
  background: rgba(39, 39, 42, 0.5);
  border: 1px solid rgba(63, 63, 70, 0.5);
  border-radius: 0.75rem;
  padding: 0.625rem 1rem 0.625rem 2.5rem;
  font-size: 0.875rem;
  color: #e4e4e7;
  outline: none;
  transition: border-color 0.2s;

  &::placeholder {
    color: #52525b;
  }

  &:focus {
    border-color: rgba(167, 139, 250, 0.5);
  }
`;

/* Toggle de visualização */
export const ViewToggle = styled.div`
  display: flex;
  background: rgba(39, 39, 42, 0.5);
  border: 1px solid rgba(63, 63, 70, 0.5);
  border-radius: 0.75rem;
  overflow: hidden;
`;

/* Botão do toggle */
export const ViewToggleButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem;
  transition: color 0.2s, background-color 0.2s;
  background: ${({ $active }) => ($active ? 'rgba(167, 139, 250, 0.2)' : 'transparent')};
  color: ${({ $active }) => ($active ? '#a78bfa' : '#71717a')};

  &:hover {
    color: ${({ $active }) => ($active ? '#a78bfa' : '#d4d4d8')};
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

/* Barra de ações */
export const ActionBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #71717a;
`;

/* Botões de ação */
export const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
`;

/* Botão de selecionar todos */
export const SelectAllButton = styled.button`
  color: #a78bfa;
  transition: color 0.2s;

  &:hover {
    color: rgba(167, 139, 250, 0.8);
  }
`;

/* Botão de limpar */
export const ClearButton = styled.button`
  color: #a1a1aa;
  transition: color 0.2s;

  &:hover {
    color: #e4e4e7;
  }
`;

/* Container da lista */
export const ListView = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  max-height: 24rem;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #3f3f46 #18181b;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #18181b;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #3f3f46;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #52525b;
  }
`;

/* Item da lista */
export const ListItem = styled.button<{ $selected: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  transition: all 0.2s;
  text-align: left;
  background: ${({ $selected }) => ($selected ? 'rgba(167, 139, 250, 0.1)' : 'rgba(39, 39, 42, 0.2)')};
  border: ${({ $selected }) => ($selected ? '1px solid rgba(167, 139, 250, 0.3)' : '1px solid transparent')};
  color: ${({ $selected }) => ($selected ? '#a78bfa' : '#d4d4d8')};

  &:hover {
    background: ${({ $selected }) => ($selected ? 'rgba(167, 139, 250, 0.1)' : 'rgba(39, 39, 42, 0.4)')};
  }
`;

/* Checkbox da lista */
export const ListItemCheckbox = styled.div<{ $selected: boolean }>`
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 4px;
  border: 2px solid ${({ $selected }) => ($selected ? '#a78bfa' : '#52525b')};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  background: ${({ $selected }) => ($selected ? '#a78bfa' : 'transparent')};

  svg {
    width: 0.75rem;
    height: 0.75rem;
    color: white;
  }
`;

/* Nome do jogo na lista */
export const ListItemName = styled.span`
  flex: 1;
  font-weight: 500;
`;

/* Gênero do jogo na lista */
export const ListItemGenre = styled.span`
  font-size: 0.75rem;
  color: #71717a;
`;

/* Logo do sistema na lista */
export const ListItemSystemLogo = styled.img`
  width: 1.25rem;
  height: 1.25rem;
  object-fit: contain;
`;

/* Texto do sistema na lista */
export const ListItemSystemText = styled.span`
  font-size: 0.75rem;
  color: #52525b;
`;

/* Container da grade */
export const GridView = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }

  gap: 0.75rem;
  max-height: 24rem;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #3f3f46 #18181b;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #18181b;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #3f3f46;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #52525b;
  }
`;

/* Item da grade */
export const GridItem = styled.button<{ $selected: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 0.75rem;
  overflow: hidden;
  transition: all 0.2s;
  background: ${({ $selected }) => ($selected ? 'rgba(167, 139, 250, 0.1)' : 'rgba(39, 39, 42, 0.2)')};
  border: ${({ $selected }) => ($selected ? '1px solid rgba(167, 139, 250, 0.4)' : '1px solid rgba(63, 63, 70, 0.3)')};

  &:hover {
    background: ${({ $selected }) => ($selected ? 'rgba(167, 139, 250, 0.1)' : 'rgba(39, 39, 42, 0.4)')};
    border-color: ${({ $selected }) => ($selected ? 'rgba(167, 139, 250, 0.4)' : 'rgba(82, 82, 91, 0.5)')};
  }
`;

/* Imagem do item da grade */
export const GridItemImage = styled.div`
  aspect-ratio: 3/4;
  background: rgba(39, 39, 42, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

/* Placeholder da imagem */
export const GridItemPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #52525b;

  svg {
    width: 2rem;
    height: 2rem;
  }

  span {
    font-size: 10px;
    padding: 0 0.5rem;
    text-align: center;
    line-height: 1.2;
  }
`;

/* Informações do item da grade */
export const GridItemInfo = styled.div`
  padding: 0.5rem;
  text-align: left;
`;

/* Nome do jogo na grade */
export const GridItemName = styled.p`
  font-size: 0.75rem;
  font-weight: 500;
  color: #e4e4e7;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/* Gênero do jogo na grade */
export const GridItemGenre = styled.p`
  font-size: 10px;
  color: #71717a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/* Logo do sistema na grade */
export const GridItemSystemLogo = styled.img`
  width: 0.875rem;
  height: 0.875rem;
  object-fit: contain;
`;

/* Checkbox da grade */
export const GridItemCheckbox = styled.div<{ $selected: boolean }>`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 4px;
  border: 2px solid ${({ $selected }) => ($selected ? '#a78bfa' : '#71717a')};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  background: ${({ $selected }) => ($selected ? '#a78bfa' : 'rgba(0, 0, 0, 0.4)')};
  opacity: ${({ $selected }) => ($selected ? 1 : 0)};

  ${GridItem}:hover & {
    opacity: 1;
  }

  svg {
    width: 0.75rem;
    height: 0.75rem;
    color: white;
  }
`;

/* Estado vazio */
export const EmptyState = styled.p`
  text-align: center;
  color: #52525b;
  padding: 2rem 0;
  font-size: 0.875rem;
`;

/* Container da grade vazio */
export const EmptyGridState = styled.p`
  grid-column: span 1 / -1;
  text-align: center;
  color: #52525b;
  padding: 2rem 0;
  font-size: 0.875rem;
`;

/* Rodapé do modal */
export const ModalFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid rgba(39, 39, 42, 0.5);
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

/* Botão de cancelar */
export const CancelButton = styled.button`
  padding: 0.625rem 1.5rem;
  border-radius: 0.75rem;
  color: #a1a1aa;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s, background-color 0.2s;

  &:hover {
    color: #e4e4e7;
    background: rgba(39, 39, 42, 0.5);
  }
`;

/* Botão de adicionar */
export const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.5rem;
  background: rgba(167, 139, 250, 0.1);
  color: #a78bfa;
  border: 1px solid rgba(167, 139, 250, 0.3);
  border-radius: 0.75rem;
  font-weight: 500;
  transition: all 0.2s;
  transform: scale(1);

  &:hover {
    background: rgba(167, 139, 250, 0.2);
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
`;
