import type { JSX } from 'react'

import Page from '../components/page.component'
import { Title, TitleLabel } from '../components/text.component'
import { EmptyState } from '../components/empty-state.component'

interface LoadingViewProps {
  /** Label shown above the title, e.g. the project or workspace name. */
  titleLabel: string
  /** Title of the view being loaded. */
  title: string
}

/**
 * Full-page view shown in place of a view's normal content while it
 * is loading.
 */
function LoadingView({ titleLabel, title }: LoadingViewProps): JSX.Element {
  return (
    <Page>
      <Page.Header>
        <Page.Header.Left>
          <TitleLabel>{titleLabel}</TitleLabel>
          <Title>{title}</Title>
        </Page.Header.Left>
      </Page.Header>
      <Page.Content>
        <EmptyState icon="refresh" message="… LOADING …" />
      </Page.Content>
    </Page>
  )
}

export default LoadingView
