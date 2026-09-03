import { type JSX, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Board, MoveBanner } from "../components/board.component";
import { Button } from "../components/button.component";
import { Icon } from "../components/icons.component";
import { Item } from "../components/item.component";
import Page from "../components/page.component";
import { ProgressBar, ProgressContainer, ProgressOverview } from "../components/progress.component";
import { Title, TitleLabel } from "../components/text.component";
import type { ColumnStatus } from "../db/types";
import { useItemActions, useProjectItems } from "../hooks/use-items.hook";
import { useProject, useProjects } from "../hooks/use-projects.hook";

import ErrorView from "./error.view";

/**
 * Board view for a single project: shows its items grouped by column,
 * progress toward completion, and lets the user add items, move items
 * between columns, delete items, or open an item's detail view.
 *
 * Opportunities:
 * - Surface a loading state while the project/items are being fetched,
 *   similar to {@link LoadingView}, instead of rendering with defaults.
 * - Handle the "project not found" case distinctly from a generic error.
 */
function PlanningView(): JSX.Element {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = searchParams.get("projectId") ?? undefined;
  const { project } = useProject(projectId);
  const { projects } = useProjects();
  const { items } = useProjectItems(projectId);
  const { deleteItem, moveItem } = useItemActions();
  const [movingItemId, setMovingItemId] = useState<string | undefined>(undefined);

  if (project === undefined) {
    return <ErrorView message="Project is undefined" />;
  }

  const movingItem = items.find((item) => item.id === movingItemId);

  const handleMoveTo = (column: ColumnStatus) => {
    if (movingItemId === undefined) return;
    moveItem(movingItemId, column);
    setMovingItemId(undefined);
  };

  const handleCancelMove = () => setMovingItemId(undefined);

  const projectSummary = projects.find((summary) => summary.id === project.id);
  const doneCount = projectSummary?.itemsByColumn.done ?? 0;
  const itemCount = projectSummary?.itemCount ?? 0;
  const completionPercentage = projectSummary?.completionPercentage ?? 0;

  const handleBack = () => navigate("/");
  const handleAdd = () => navigate(`/item/new?create=true&projectId=${project.id}`);

  const leftIcon = <Icon variant="chevL" size="16" onClick={handleBack} />;

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
          <Button.Add onClick={handleAdd} />
          <Button.Back onClick={handleBack} />
        </Page.Header.Right>
      </Page.Header>
      {movingItem && <MoveBanner title={movingItem.title} onCancel={handleCancelMove} />}
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
  );
}

export default PlanningView;
