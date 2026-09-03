import Page from '../components/Page.component'
import { Title, TitleLabel } from '../components/Text.component'
import { Button } from '../components/Button.component'
import { Icon } from '../components/Icons.component'
import { ProjectCard, ProjectGrid } from '../components/Projects.component'
import { useState } from 'react'

const MockItem = {
  todo: 2,
  inProgress: 5,
  testing: 0,
  done: 3,
}

const MockActions = {
  update: () => console.log(''),
  delete: () => console.log(''),
  open: () => console.log(''),
}

function ProjectOverviewView() {
  const [isCreateInitialiazed, setIsCreateInitialiazed] = useState<boolean>(false);

  return (
    <Page>
      <Page.Header>
        <Page.Header.Left>
          <TitleLabel>LOCAL · NO ACCOUNT · NO NETWORK</TitleLabel>
          <Title>Projects</Title>
        </Page.Header.Left>
        <Page.Header.Right>
          <Button variant="secondary">
            <Icon variant="download" label="download data" />
          </Button>
          <Button variant="secondary">
            <Icon variant="upload" label="upload data" />
          </Button>
          <Button onClick={() => setIsCreateInitialiazed(true)}>
            <Icon variant="plus" label="add project" />
          </Button>
        </Page.Header.Right>
      </Page.Header>
      <Page.Content>
        <ProjectGrid>
          <ProjectCard.Update
            isVisible={isCreateInitialiazed}
            onClose={() => setIsCreateInitialiazed(false)}
            onCreate={() => console.log('')}
          />
          <ProjectCard title='test' items={MockItem} actions={MockActions} />
        </ProjectGrid>
      </Page.Content>
    </Page>
  )
}

export default ProjectOverviewView
