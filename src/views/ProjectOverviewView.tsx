import Page from '../components/Page.component'
import { Title, TitleLabel } from '../components/Text.component'
import { Button } from '../components/Button.component'
import { Icon } from '../components/Icons.component'
import { ProjectCard, ProjectGrid } from '../components/Projects.component'
import { EmptyState } from '../components/EmptyState.component'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useProjects } from '../hooks/useProjects'

function ProjectOverviewView() {
  const [isCreateInitialiazed, setIsCreateInitialiazed] = useState<boolean>(false);
  const navigate = useNavigate();
  const { projects, createProject, updateProject, deleteProject, exportData, importData } = useProjects();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEmpty = projects.length === 0 && !isCreateInitialiazed;

  const handleImportFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) importData(file);
    e.target.value = '';
  };

  return (
    <Page>
      <Page.Header>
        <Page.Header.Left>
          <TitleLabel>LOCAL · NO ACCOUNT · NO NETWORK</TitleLabel>
          <Title>Projects</Title>
        </Page.Header.Left>
        <Page.Header.Right>
          <Button variant="secondary" onClick={exportData}>
            <Icon variant="download" label="download data" />
          </Button>
          <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
            <Icon variant="upload" label="upload data" />
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            style={{ display: 'none' }}
            onChange={handleImportFileSelected}
          />
          <Button onClick={() => setIsCreateInitialiazed(true)}>
            <Icon variant="plus" label="add project" />
          </Button>
        </Page.Header.Right>
      </Page.Header>
      <Page.Content>
        {isEmpty
          ? <EmptyState icon="search" />
          : <ProjectGrid>
            <ProjectCard.Update
              isVisible={isCreateInitialiazed}
              onClose={() => setIsCreateInitialiazed(false)}
              onCreate={(name) => createProject(name)}
            />
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.name}
                items={{
                  todo: project.itemsByColumn.todo,
                  inProgress: project.itemsByColumn['in-progress'],
                  testing: project.itemsByColumn.testing,
                  done: project.itemsByColumn.done,
                }}
                actions={{
                  open: () => navigate(`/planning?projectId=${project.id}`),
                  update: (name) => updateProject(project.id, name),
                  delete: () => deleteProject(project.id),
                }}
              />
            ))}
          </ProjectGrid>
        }
      </Page.Content>
    </Page>
  )
}

export default ProjectOverviewView
