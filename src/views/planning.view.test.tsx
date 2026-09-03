import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'

import '@marcomattes/epaper-components'

const mockNavigate = vi.fn()
const mockUseSearchParams = vi.fn()

vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
  useSearchParams: () => mockUseSearchParams(),
}))

const mockUseProject = vi.fn()
const mockUseProjects = vi.fn()
const mockUseProjectItems = vi.fn()
const mockUseItemActions = vi.fn()

vi.mock('../hooks/use-projects.hook', () => ({
  useProject: (...args: unknown[]) => mockUseProject(...args),
  useProjects: () => mockUseProjects(),
}))

vi.mock('../hooks/use-items.hook', () => ({
  useProjectItems: (...args: unknown[]) => mockUseProjectItems(...args),
  useItemActions: () => mockUseItemActions(),
}))

import PlanningView from './planning.view'

const project = { id: 'p1', name: 'Website Relaunch', createdAt: 0, updatedAt: 0 }
const projectSummary = {
  id: 'p1',
  name: 'Website Relaunch',
  createdAt: 0,
  updatedAt: 0,
  itemCount: 2,
  itemsByColumn: { todo: 1, 'in-progress': 0, testing: 0, done: 1 },
  completionPercentage: 50,
}
const items = [
  {
    id: 'i1',
    projectId: 'p1',
    title: 'Write tests',
    description: 'Cover the ideal path',
    column: 'todo' as const,
    position: 0,
    createdAt: 0,
    updatedAt: 0,
  },
  {
    id: 'i2',
    projectId: 'p1',
    title: 'Ship it',
    description: 'Deploy to prod',
    column: 'done' as const,
    position: 0,
    createdAt: 0,
    updatedAt: 0,
  },
]

describe('PlanningView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseSearchParams.mockReturnValue([new URLSearchParams({ projectId: 'p1' })])
    mockUseProject.mockReturnValue({ project, isLoading: false })
    mockUseProjects.mockReturnValue({ projects: [projectSummary] })
    mockUseProjectItems.mockReturnValue({ items, isLoading: false })
    mockUseItemActions.mockReturnValue({ deleteItem: vi.fn(), moveItem: vi.fn() })
  })

  it('shows an error view when the project is undefined', () => {
    mockUseProject.mockReturnValue({ project: undefined, isLoading: false })

    render(<PlanningView />)

    expect(screen.getByText('Project is undefined')).toBeInTheDocument()
  })

  it('renders the project name, progress and items', () => {
    render(<PlanningView />)

    expect(screen.getByText('Website Relaunch')).toBeInTheDocument()
    expect(screen.getByText('Write tests')).toBeInTheDocument()
    expect(screen.getByText('Ship it')).toBeInTheDocument()
    expect(screen.getByText('1/2 DONE')).toBeInTheDocument()
  })
})
