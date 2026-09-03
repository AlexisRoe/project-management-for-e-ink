import { useLiveQuery } from 'dexie-react-hooks'
import { useCallback } from 'react'

import { db } from '../db/db'
import type { ColumnStatus, Project, ProjectItem } from '../db/types'

/** Shape of the JSON produced by {@link useProjects}'s `exportData` and consumed by `importData`. */
interface ExportedData {
  /** All projects at the time of export. */
  projects: Project[]
  /** All items at the time of export, across all projects. */
  items: ProjectItem[]
}

/** A project enriched with derived stats about its items, for display in list/overview views. */
export interface ProjectSummary {
  /** UUID v4, matching the source {@link Project.id}. */
  id: string
  /** Display name of the project. */
  name: string
  /** Unix timestamp (ms) when the project was created. */
  createdAt: number
  /** Unix timestamp (ms) when the project was last updated. */
  updatedAt: number
  /** Total number of items belonging to the project. */
  itemCount: number
  /** Number of items in each Kanban column. */
  itemsByColumn: Record<ColumnStatus, number>
  /** Percentage (0–100) of items in the `done` column. */
  completionPercentage: number
}

const emptyColumnCounts = (): Record<ColumnStatus, number> => ({
  todo: 0,
  'in-progress': 0,
  testing: 0,
  done: 0,
})

/**
 * Live list of all projects, each enriched with item counts and completion
 * stats, plus whole-database mutators (create/update/delete project,
 * export/import all data).
 *
 * Backed by a Dexie live query over both the `projects` and `items` tables,
 * so `projects` re-renders whenever either table changes.
 *
 * @returns `{ projects, isLoading, createProject, updateProject, deleteProject, exportData, importData }`:
 *   - `projects` — {@link ProjectSummary}[] sorted by `createdAt` ascending (empty until loaded).
 *   - `isLoading` — `true` during the initial fetch.
 *   - `createProject(name)` — creates a project and resolves to it.
 *   - `updateProject(projectId, name)` — renames a project and bumps `updatedAt`.
 *   - `deleteProject(projectId)` — deletes a project and all of its items, atomically.
 *   - `exportData()` — downloads all projects and items as a JSON file.
 *   - `importData(file)` — replaces all projects and items with the contents of a
 *     previously exported JSON file.
 *
 * @example
 * ```tsx
 * function ProjectList() {
 *   const { projects, isLoading, createProject } = useProjects()
 *   if (isLoading) return <Loading />
 *   return (
 *     <>
 *       {projects.map((p) => <div key={p.id}>{p.name} ({p.completionPercentage}%)</div>)}
 *       <button onClick={() => createProject('New project')}>Add</button>
 *     </>
 *   )
 * }
 * ```
 */
export function useProjects() {
  const projectSummaries = useLiveQuery<ProjectSummary[]>(async () => {
    const [projects, items] = await Promise.all([db.projects.toArray(), db.items.toArray()])

    return projects
      .map((project) => {
        const projectItems = items.filter((item) => item.projectId === project.id)
        // Tally items per column to derive counts and completion percentage below.
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

  const updateProject = useCallback(async (projectId: string, name: string) => {
    await db.projects.update(projectId, { name, updatedAt: Date.now() })
  }, [])

  const deleteProject = useCallback(async (projectId: string) => {
    // Delete items first so a crash mid-transaction never leaves orphans.
    await db.transaction('rw', db.projects, db.items, async () => {
      await db.items.where('projectId').equals(projectId).delete()
      await db.projects.delete(projectId)
    })
  }, [])

  const exportData = useCallback(async () => {
    const [projects, items] = await Promise.all([db.projects.toArray(), db.items.toArray()])
    const data: ExportedData = { projects, items }
    // Trigger a browser download via a throwaway object URL and anchor click.
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `paperflow-export-${new Date().toISOString().slice(0, 10)}.json`
    anchor.click()
    URL.revokeObjectURL(url)
  }, [])

  const importData = useCallback(async (file: File) => {
    const text = await file.text()
    const data = JSON.parse(text) as ExportedData

    // Full replace: clear both tables before bulk-loading the import.
    await db.transaction('rw', db.projects, db.items, async () => {
      await db.projects.clear()
      await db.items.clear()
      await db.projects.bulkAdd(data.projects)
      await db.items.bulkAdd(data.items)
    })
  }, [])

  return {
    projects: projectSummaries ?? [],
    isLoading: projectSummaries === undefined,
    createProject,
    updateProject,
    deleteProject,
    exportData,
    importData,
  }
}

/**
 * Live view of a single project (without item stats).
 *
 * @param projectId - Project to load. When `undefined`, `project` stays `undefined`.
 * @returns `{ project, isLoading }` where `project` is the raw {@link Project}
 *   record, and `isLoading` is `true` until the query resolves (including
 *   when the project doesn't exist, since it resolves to `undefined` either way).
 *
 * @example
 * ```tsx
 * function ProjectHeader({ projectId }: { projectId: string }) {
 *   const { project, isLoading } = useProject(projectId)
 *   if (isLoading) return <Loading />
 *   return <h1>{project?.name}</h1>
 * }
 * ```
 */
export function useProject(projectId: string | undefined) {
  const project = useLiveQuery(
    async () => (projectId ? await db.projects.get(projectId) : undefined),
    [projectId],
  )

  return {
    project,
    isLoading: project === undefined,
  }
}
