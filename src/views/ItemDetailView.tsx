import { useParams } from 'react-router'

function ItemDetailView() {
  const { itemId } = useParams()

  return (
    <section>
      <h1>Item {itemId}</h1>
      <p>Status: Open</p>
      <p>Details for this item go here.</p>
    </section>
  )
}

export default ItemDetailView
