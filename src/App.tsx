import { Route, Routes } from 'react-router'

import ItemDetailView from './views/item-detail.view'
import PlanningView from './views/planning.view'
import ProjectOverviewView from './views/project-overview.view'

function App() {
  return (
    <Routes>
      <Route index element={<ProjectOverviewView />} />
      <Route path="planning" element={<PlanningView />} />
      <Route path="item/:itemId" element={<ItemDetailView />} />
    </Routes>
  )
}

export default App
