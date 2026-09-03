import { useNavigate, useParams, useSearchParams } from 'react-router'
import Page from '../components/Page.component'
import { Title, TitleLabel } from '../components/Text.component'
import { CancelButton, CreateButton, DeleteButton } from '../components/Button.component'
import { useProject } from '../hooks/useProjects'
import { useCreateItem, useItem } from '../hooks/useItems'

function ItemDetailView() {
  const { itemId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isCreateMode = searchParams.get('create') === 'true';
  const projectId = searchParams.get('projectId') ?? undefined;

  const { project, isLoading: isProjectLoading } = useProject(projectId);
  const { item, isLoading: isItemLoading, updateItem, deleteItem } = useItem(isCreateMode ? undefined : itemId);
  const { createItem } = useCreateItem(projectId);

  const isLoading = isProjectLoading || (!isCreateMode && isItemLoading);

  const handleSave = async () => {
    if (isCreateMode) {
      const created = await createItem({ title: item?.title ?? 'Untitled' })
      if (created) navigate(`/item/${created.id}?projectId=${projectId}`)
    } else {
      await updateItem({ title: item?.title })
    }
  }

  const handleDelete = async () => {
    await deleteItem()
    navigate(`/planning?projectId=${projectId}`)
  }

  const handleAbort = () => {
    navigate(`/planning?projectId=${projectId}`)
  }

  return (
    <Page>
      <Page.Header>
        <Page.Header.Left>
          <TitleLabel>{project?.name ?? 'LOCAL · NO ACCOUNT · NO NETWORK'}</TitleLabel>
          <Title>{isCreateMode ? 'New Item' : item?.title ?? 'Item'}</Title>
        </Page.Header.Left>
        <Page.Header.Right>
          <CreateButton label='Save' onClick={handleSave} />
          <CancelButton onClick={handleAbort} />
          {!isCreateMode && <DeleteButton onClick={handleDelete} />}
        </Page.Header.Right>
      </Page.Header>
      <Page.Content>
        {isLoading ? 'Loading…' : 'Test'}
      </Page.Content>
    </Page>
  )
}

export default ItemDetailView
