import { Link } from 'react-router'

const projects = [
  { id: '1', name: 'Kitchen Renovation', itemCount: 12 },
  { id: '2', name: 'Website Redesign', itemCount: 5 },
  { id: '3', name: 'Book Manuscript', itemCount: 24 },
]

function ProjectOverviewView() {
  return (
    <section>
      <h1>Projects</h1>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <Link to="/planning">{project.name}</Link> ({project.itemCount} items)
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ProjectOverviewView
