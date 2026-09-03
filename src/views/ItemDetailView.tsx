import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import Page from '../components/Page.component'
import { Title, TitleLabel } from '../components/Text.component'
import { CancelButton, CreateButton, DeleteButton } from '../components/Button.component'
import { useProject } from '../hooks/useProjects'
import { useCreateItem, useItem } from '../hooks/useItems'
import { Icon } from '../components/Icons.component'
import { ItemForm, type ItemFormValue } from '../components/ItemForm.component'

function ItemDetailView() {
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

  const handleSave = async () => {
    if (!formValue || formValue.title.trim().length === 0) return

    if (isCreateMode) {
      await createItem(formValue)
    } else {
      await updateItem(formValue)
    }

    navigate(`/planning?projectId=${projectId}`)
  }

  const handleDelete = async () => {
    await deleteItem()
    navigate(`/planning?projectId=${projectId}`)
  }

  const handleAbort = () => {
    navigate(`/planning?projectId=${projectId}`)
  }

  const leftIcon = <Icon variant='chevL' size='16' onClick={handleAbort} />


  return (
    <Page>
      <Page.Header>
        <Page.Header.Left>
          <TitleLabel iconLeft={leftIcon}>{project?.name ?? 'LOCAL · NO ACCOUNT · NO NETWORK'}</TitleLabel>
          <Title>{isCreateMode ? 'New Item' : item?.title ?? 'Item'}</Title>
        </Page.Header.Left>
        <Page.Header.Right>
          <CreateButton
            label='Save'
            onClick={handleSave}
            disabled={!formValue || formValue.title.trim().length === 0}
          />
          <CancelButton onClick={handleAbort} />
          {!isCreateMode && <DeleteButton onClick={handleDelete} />}
        </Page.Header.Right>
      </Page.Header>
      <Page.Content>
        {isLoading ? 'Loading…' : (
          <ItemForm
            key={item?.id ?? 'new'}
            initialTitle={item?.title}
            initialDescription={item?.description}
            initialColumn={item?.column}
            onChange={setFormValue}
          />
        )}
      </Page.Content>
    </Page>
  )
}

export default ItemDetailView
