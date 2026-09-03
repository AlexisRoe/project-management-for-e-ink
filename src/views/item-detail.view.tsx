import { useState, type JSX } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'

import Page from '../components/Page.component'
import { Title, TitleLabel } from '../components/Text.component'
import { CancelButton, CreateButton, DeleteButton } from '../components/Button.component'
import { Icon } from '../components/Icons.component'
import { ItemForm, type ItemFormValue } from '../components/ItemForm.component'

import LoadingView from './loading.view'
import ErrorView from './error.view'

import { useProject } from '../hooks/use-projects.hook'
import { useCreateItem, useItem } from '../hooks/use-items.hook'

/**
 * View for creating a new item or viewing and editing an existing one.
 * Lets the user save their changes, cancel back to the planning board,
 * or delete the item.
 */
function ItemDetailView(): JSX.Element {
  const { itemId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isCreateMode = searchParams.get('create') === 'true';
  const projectId = searchParams.get('projectId') ?? undefined;

  const { project, isLoading: isProjectLoading } = useProject(projectId);
  const { item, isLoading: isItemLoading, updateItem, deleteItem } = useItem(isCreateMode ? undefined : itemId);
  const { createItem } = useCreateItem(projectId);
  const [formValue, setFormValue] = useState<ItemFormValue | undefined>(undefined);

  const isLoading = isProjectLoading || (!isCreateMode && isItemLoading);

  const goBack = () => {
    navigate(`/planning?projectId=${projectId}`);
  }

  const handleSave = async () => {
    if (!formValue || formValue.title.trim().length === 0) return

    if (isCreateMode) {
      await createItem(formValue)
    } else {
      await updateItem(formValue)
    }

    goBack();
  }

  const handleDelete = async () => {
    await deleteItem()
    goBack();
  }

  const title = isCreateMode ? 'New Item' : item?.title ?? 'Item';
  const titleLabel = project?.name ?? 'LOCAL · NO ACCOUNT · NO NETWORK';

  if (isLoading) {
    return <LoadingView title={title} titleLabel={titleLabel} />
  }

  if (project === undefined) {
    return <ErrorView message='Project is not defined' />
  }

  const leftIcon = <Icon variant='chevL' size='16' onClick={goBack} />

  return (
    <Page>
      <Page.Header>
        <Page.Header.Left>
          <TitleLabel iconLeft={leftIcon}>{titleLabel}</TitleLabel>
          <Title>{title}</Title>
        </Page.Header.Left>
        <Page.Header.Right>
          <CreateButton
            label='Save'
            onClick={handleSave}
            disabled={!formValue || formValue.title.trim().length === 0}
          />
          <CancelButton onClick={goBack} />
          {!isCreateMode && <DeleteButton onClick={handleDelete} />}
        </Page.Header.Right>
      </Page.Header>
      <Page.Content>
        <ItemForm
          key={item?.id ?? 'new'}
          initialTitle={item?.title}
          initialDescription={item?.description}
          initialColumn={item?.column}
          onChange={setFormValue}
        />
      </Page.Content>
    </Page>
  )
}

export default ItemDetailView
