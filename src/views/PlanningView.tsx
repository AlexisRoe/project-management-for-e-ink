import { useNavigate, useSearchParams } from 'react-router'

import { useProject, useProjects } from '../hooks/useProjects'

import Page from '../components/Page.component'
import { Title, TitleLabel } from '../components/Text.component';
import { Icon } from '../components/Icons.component';
import { AddButton, BackButton } from '../components/Button.component';
import { ProgressBar, ProgressContainer, ProgressOverview } from '../components/Progress.component';

function PlanningView() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = searchParams.get('projectId') ?? undefined;
  const { project } = useProject(projectId);
  const { projects } = useProjects();

  if (project === undefined) {
    return <div>Something went wrong</div>
  }

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
      <Page.Content>
        {<p>Project ID: {project.id}</p>}
      </Page.Content>
    </Page>
  )
}

export default PlanningView
