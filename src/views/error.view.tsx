import type { JSX } from "react";
import { EmptyState } from "../components/empty-state.component";
import Page from "../components/page.component";
import { Title, TitleLabel } from "../components/text.component";

interface ErrorViewProps {
  /** Error message shown to the user. */
  message: string;
}

/**
 * Full-page view shown in place of a view's normal content when it
 * fails to load, surfacing the given error message.
 */
function ErrorView({ message }: ErrorViewProps): JSX.Element {
  return (
    <Page>
      <Page.Header>
        <Page.Header.Left>
          <TitleLabel>LOCAL · NO ACCOUNT · NO NETWORK</TitleLabel>
          <Title>Error</Title>
        </Page.Header.Left>
      </Page.Header>
      <Page.Content>
        <EmptyState icon="moon" message={message} />
      </Page.Content>
    </Page>
  );
}

export default ErrorView;
