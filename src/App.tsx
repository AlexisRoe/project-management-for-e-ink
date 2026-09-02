import { Link, Route, Routes } from 'react-router'
import ItemDetailView from './views/ItemDetailView'
import PlanningView from './views/PlanningView'
import ProjectOverviewView from './views/ProjectOverviewView'

function App() {
  return (
    <>
      <nav>
        <Link to="/">Overview</Link>
        <Link to="/planning">Planning</Link>
      </nav>
      <Routes>
        <Route index element={<ProjectOverviewView />} />
        <Route path="planning" element={<PlanningView />} />
        <Route path="item/:itemId" element={<ItemDetailView />} />
      </Routes>
    </>
  )
}

export default App
