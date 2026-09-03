import { Link } from 'react-router'
import Page from '../components/Page.component'

const items = [
  { id: '1', title: 'Buy tiles' },
  { id: '2', title: 'Hire electrician' },
  { id: '3', title: 'Order cabinets' },
]

function PlanningView() {
  return (
    <Page>
      <Page.Header>
        <h1>Planning</h1>
      </Page.Header>
      <Page.Content>
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <Link to={`/item/${item.id}`}>{item.title}</Link>
            </li>
          ))}
        </ul>
      </Page.Content>
    </Page>
  )
}

export default PlanningView
