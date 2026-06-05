import { LuHardDrive, LuTrash2, LuTriangleAlert } from "react-icons/lu";
import { useState } from 'react';
import { Button } from "../Button";
import { formatBytes } from '../../utils/format';
import {
  GlassContainer,
  HeaderRow,
  HeaderIconWrapper,
  HeaderText,
  HeaderTitle,
  HeaderSubtitle,
  ContentSection,
  BytesRow,
  BytesValue,
  BytesUnit,
  ProgressTrack,
  ProgressFill,
  Description,
  MotionDiv,
  WarningBox,
  WarningRow,
  WarningText,
  WarningPath,
  WarningValue,
  ButtonRow,
} from "./styles";

interface SpaceSavingsCardProps {
  bytesSaved: number;
  action: 'move' | 'delete';
  onDeleteRemoved?: () => void;
}

export function SpaceSavingsCard({ bytesSaved, action, onDeleteRemoved }: SpaceSavingsCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const percentage = Math.min((bytesSaved / (1024 * 1024 * 1024)) * 100, 100);

  const handleDelete = async () => {
    if (onDeleteRemoved) {
      setDeleting(true);
      await onDeleteRemoved();
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <GlassContainer>
      <HeaderRow>
        <HeaderIconWrapper>
          <LuHardDrive style={{ width: '1.25rem', height: '1.25rem', color: '#34d399' }} />
        </HeaderIconWrapper>
        <HeaderText>
          <HeaderTitle>Economia de Espaço</HeaderTitle>
          <HeaderSubtitle>
            {action === 'move' ? 'Espaço recuperável' : 'Espaço economizado'}
          </HeaderSubtitle>
        </HeaderText>
      </HeaderRow>

      <ContentSection>
        <BytesRow>
          <BytesValue
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {formatBytes(bytesSaved)}
          </BytesValue>
          <BytesUnit>
            {action === 'move' ? 'na pasta /removidos' : 'em disco'}
          </BytesUnit>
        </BytesRow>

        <ProgressTrack>
          <ProgressFill
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
          />
        </ProgressTrack>

        <Description>
          {action === 'move'
            ? `Os arquivos removidos foram movidos para a pasta /removidos. Se você deletar esta pasta, liberará ${formatBytes(bytesSaved)} de espaço em disco.`
            : `A curadoria removeu permanentemente arquivos que totalizam ${formatBytes(bytesSaved)} de espaço em disco.`}
        </Description>
      </ContentSection>

      {action === 'move' && bytesSaved > 0 && (
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            variant="danger"
            icon={<LuTrash2 style={{ width: '1rem', height: '1rem' }} />}
            onClick={() => setShowDeleteConfirm(true)}
            disabled={deleting}
            className="w-full"
          >
            Deletar pasta /removidos
          </Button>
        </MotionDiv>
      )}

      {showDeleteConfirm && (
        <WarningBox
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <WarningRow>
            <LuTriangleAlert style={{ width: '1.25rem', height: '1.25rem', color: '#f87171', flexShrink: 0, marginTop: '0.125rem' }} />
            <WarningText>
              Tem certeza que deseja deletar permanentemente a pasta <WarningPath>/removidos</WarningPath>?
              Esta ação não pode ser desfeita e liberará <WarningValue>{formatBytes(bytesSaved)}</WarningValue> de espaço.
            </WarningText>
          </WarningRow>
          <ButtonRow>
            <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>
              Cancelar
            </Button>
            <Button variant="danger" loading={deleting} onClick={handleDelete}>
              {deleting ? 'Deletando...' : 'Confirmar Deleção'}
            </Button>
          </ButtonRow>
        </WarningBox>
      )}
    </GlassContainer>
  );
}
