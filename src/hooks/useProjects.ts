import { useLiveQuery } from 'dexie-react-hooks'
import { useCallback } from 'react'
import { db } from '../db/db'
import type { ColumnStatus } from '../db/types'

export interface ProjectSummary {
  id: string
  name: string
  createdAt: number
  updatedAt: number
  itemCount: number
  itemsByColumn: Record<ColumnStatus, number>
  completionPercentage: number
}

const emptyColumnCounts = (): Record<ColumnStatus, number> => ({
  todo: 0,
  'in-progress': 0,
  testing: 0,
  done: 0,
})

export function useProjects() {
  const projectSummaries = useLiveQuery<ProjectSummary[]>(async () => {
    const [projects, items] = await Promise.all([db.projects.toArray(), db.items.toArray()])

    return projects
      .map((project) => {
        const projectItems = items.filter((item) => item.projectId === project.id)
        const itemsByColumn = projectItems.reduce((counts, item) => {
          counts[item.column]++
          return counts
        }, emptyColumnCounts())
        const itemCount = projectItems.length
        const completionPercentage = itemCount === 0 ? 0 : Math.round((itemsByColumn.done / itemCount) * 100)

        return {
          id: project.id,
          name: project.name,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
          itemCount,
          itemsByColumn,
          completionPercentage,
        }
      })
      .sort((a, b) => a.createdAt - b.createdAt)
  }, [])

  const createProject = useCallback(async (name: string) => {
    const now = Date.now()
    const project = {
      id: crypto.randomUUID(),
      name,
      createdAt: now,
      updatedAt: now,
    }
    await db.projects.add(project)
    return project
  }, [])

  const deleteProject = useCallback(async (projectId: string) => {
    await db.transaction('rw', db.projects, db.items, async () => {
      await db.items.where('projectId').equals(projectId).delete()
      await db.projects.delete(projectId)
    })
  }, [])

  return {
    projects: projectSummaries ?? [],
    isLoading: projectSummaries === undefined,
    createProject,
    deleteProject,
  }
}
