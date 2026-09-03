import { Link, useSearchParams } from 'react-router'
import Page from '../components/Page.component'
import { useProject } from '../hooks/useProjects'

function PlanningView() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId') ?? undefined;
  const { project, isLoading } = useProject(projectId);

  return (
    <Page>
      <Page.Header>
        <Link to="/">&larr; Back to projects</Link>
        <h1>{isLoading ? 'Loading…' : project?.name ?? 'Project not found'}</h1>
      </Page.Header>
      <Page.Content>
        {project && <p>Project ID: {project.id}</p>}
      </Page.Content>
    </Page>
  )
}

export default PlanningView
