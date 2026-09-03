import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

import { useProject, useProjects } from '../hooks/useProjects'
import { useItemActions, useProjectItems } from '../hooks/useItems'

import Page from '../components/Page.component'
import { Title, TitleLabel } from '../components/Text.component';
import { Icon } from '../components/Icons.component';
import { AddButton, BackButton } from '../components/Button.component';
import { ProgressBar, ProgressContainer, ProgressOverview } from '../components/Progress.component';
import { Board, MoveBanner } from '../components/Board.component';
import { Item } from '../components/Item.component';
import type { ColumnStatus } from '../db/types';

function PlanningView() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = searchParams.get('projectId') ?? undefined;
  const { project } = useProject(projectId);
  const { projects } = useProjects();
  const { items } = useProjectItems(projectId);
  const { deleteItem, moveItem } = useItemActions();
  const [movingItemId, setMovingItemId] = useState<string | undefined>(undefined);

  if (project === undefined) {
    return <div>Something went wrong</div>
  }

  const movingItem = items.find((item) => item.id === movingItemId);

  const handleMoveTo = (column: ColumnStatus) => {
    if (movingItemId === undefined) return
    moveItem(movingItemId, column);
    setMovingItemId(undefined);
  };

  const handleCancelMove = () => setMovingItemId(undefined);

  const projectSummary = projects.find((summary) => summary.id === project.id);
  const doneCount = projectSummary?.itemsByColumn.done ?? 0;
  const itemCount = projectSummary?.itemCount ?? 0;
  const completionPercentage = projectSummary?.completionPercentage ?? 0;

  const handleBack = () => navigate('/');
  const handleAdd = () => navigate(`/item/new?create=true&projectId=${project.id}`);

  const leftIcon = <Icon variant='chevL' size='16' onClick={handleBack} />

  return (
    <Page>
      <Page.Header>
        <Page.Header.Left>
          <TitleLabel iconLeft={leftIcon}>Projects</TitleLabel>
          <Title>{project.name}</Title>
        </Page.Header.Left>
        <Page.Header.Right>
          <ProgressContainer>
            <ProgressBar value={completionPercentage} />
            <ProgressOverview done={doneCount} total={itemCount} />
          </ProgressContainer>
          <AddButton onClick={handleAdd} />
          <BackButton onClick={handleBack} />
        </Page.Header.Right>
      </Page.Header>
      {movingItem && (
        <MoveBanner title={movingItem.title} onCancel={handleCancelMove} />
      )}
      <Page.Content>
        <Board
          items={items}
          movingItemId={movingItemId}
          onMoveTo={handleMoveTo}
          renderItem={(item) => (
            <Item
              key={item.id}
              title={item.title}
              description={item.description}
              isMoving={item.id === movingItemId}
              actions={{
                delete: () => deleteItem(item.id),
                move: () => setMovingItemId(item.id),
                openDetail: () => navigate(`/item/${item.id}?projectId=${project.id}`),
              }}
            />
          )}
        />
      </Page.Content>
    </Page>
  )
}

export default PlanningView
