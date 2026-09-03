import { useParams } from 'react-router'
import Page from '../components/Page.component'

function ItemDetailView() {
  const { itemId } = useParams()

  return (
    <Page>
      <Page.Header>
        <h1>Item {itemId}</h1>
      </Page.Header>
      <Page.Content>
        <p>Status: Open</p>
        <p>Details for this item go here.</p>
      </Page.Content>
    </Page>
  )
}

export default ItemDetailView
