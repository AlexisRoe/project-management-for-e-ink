import { useRef, useState, type JSX } from 'react'
import { useNavigate } from 'react-router'

import Page from '../components/page.component'
import { Title, TitleLabel } from '../components/text.component'
import { Button } from '../components/button.component'
import { Icon } from '../components/icons.component'
import { ProjectCard, ProjectGrid } from '../components/projects.component'
import { EmptyState } from '../components/empty-state.component'
import { FileInput } from '../components/input.component'

import { useProjects } from '../hooks/use-projects.hook'

/**
 * Landing view listing all projects as cards, with each card's progress
 * broken down by column. Lets the user create, rename, or delete a
 * project, open a project's planning board, and export or import the
 * full project data as JSON.
 */
function ProjectOverviewView(): JSX.Element {
  const [isCreateInitialiazed, setIsCreateInitialiazed] = useState<boolean>(false);
  const navigate = useNavigate();
  const { projects, createProject, updateProject, deleteProject, exportData, importData } = useProjects();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEmpty = projects.length === 0 && !isCreateInitialiazed;

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
          <FileInput
            ref={fileInputRef}
            accept="application/json"
            onFileSelected={importData}
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
