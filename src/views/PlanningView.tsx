import { Link } from 'react-router'

const items = [
  { id: '1', title: 'Buy tiles' },
  { id: '2', title: 'Hire electrician' },
  { id: '3', title: 'Order cabinets' },
]

function PlanningView() {
  return (
    <section>
      <h1>Planning</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <Link to={`/item/${item.id}`}>{item.title}</Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default PlanningView
