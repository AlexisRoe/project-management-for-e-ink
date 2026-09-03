import { useLiveQuery } from 'dexie-react-hooks'
import { useCallback } from 'react'
import { db } from '../db/db'
import type { ColumnStatus, ProjectItem } from '../db/types'

export interface CreateItemInput {
  title: string
  description?: string
  column?: ColumnStatus
  startDate?: number
  endDate?: number
  position?: number
}

export type UpdateItemInput = Partial<
  Pick<ProjectItem, 'title' | 'description' | 'column' | 'startDate' | 'endDate' | 'position'>
>

export function useItem(itemId: string | undefined) {
  const item = useLiveQuery(
    async () => (itemId ? await db.items.get(itemId) : undefined),
    [itemId],
  )

  const updateItem = useCallback(
    async (updates: UpdateItemInput) => {
      if (!itemId) return
      await db.items.update(itemId, { ...updates, updatedAt: Date.now() })
    },
    [itemId],
  )

  const deleteItem = useCallback(async () => {
    if (!itemId) return
    await db.items.delete(itemId)
  }, [itemId])

  return {
    item,
    isLoading: itemId !== undefined && item === undefined,
    updateItem,
    deleteItem,
  }
}

export function useCreateItem(projectId: string | undefined) {
  const createItem = useCallback(
    async (input: CreateItemInput) => {
      if (!projectId) return undefined

      const now = Date.now()
      const item: ProjectItem = {
        id: crypto.randomUUID(),
        projectId,
        title: input.title,
        description: input.description ?? '',
        column: input.column ?? 'todo',
        startDate: input.startDate,
        endDate: input.endDate,
        position: input.position ?? 0,
        createdAt: now,
        updatedAt: now,
      }
      await db.items.add(item)
      return item
    },
    [projectId],
  )

  return { createItem }
}
