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

/**
 * Live list of all items belonging to a project, ordered by their Kanban position.
 *
 * Backed by a Dexie live query, so the returned `items` automatically re-render
 * any consuming component when the underlying `items` table changes.
 *
 * @param projectId - Project to list items for. When `undefined`, returns an
 *   empty, non-loading list (useful while a project id is still resolving).
 * @returns `{ items, isLoading }` where `items` is the sorted array of
 *   {@link ProjectItem}s (empty until loaded) and `isLoading` is `true` only
 *   during the initial fetch.
 *
 * @example
 * ```tsx
 * function Board({ projectId }: { projectId: string }) {
 *   const { items, isLoading } = useProjectItems(projectId)
 *   if (isLoading) return <Loading />
 *   return <>{items.map((item) => <Card key={item.id} item={item} />)}</>
 * }
 * ```
 */
export function useProjectItems(projectId: string | undefined) {
  const items = useLiveQuery(
    async () =>
      projectId
        ? await db.items.where('projectId').equals(projectId).sortBy('position')
        : [],
    [projectId],
  )

  return {
    items: items ?? [],
    isLoading: items === undefined,
  }
}

/**
 * Live view of a single item plus mutators scoped to it.
 *
 * @param itemId - Item to load. When `undefined`, `item` stays `undefined`
 *   and `isLoading` is `false` (there's nothing to load).
 * @returns `{ item, isLoading, updateItem, deleteItem }`:
 *   - `item` — the current {@link ProjectItem}, or `undefined` while loading or missing.
 *   - `isLoading` — `true` while an `itemId` is set but the item hasn't resolved yet.
 *   - `updateItem(updates)` — patches the item and bumps `updatedAt`. No-op if `itemId` is unset.
 *   - `deleteItem()` — removes the item. No-op if `itemId` is unset.
 *
 * @example
 * ```tsx
 * function ItemDetail({ itemId }: { itemId: string }) {
 *   const { item, updateItem, deleteItem } = useItem(itemId)
 *   return (
 *     <button onClick={() => updateItem({ column: 'done' })}>
 *       Mark done
 *     </button>
 *   )
 * }
 * ```
 */
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

/**
 * Stateless item mutators that don't require loading the item first.
 *
 * Useful for list/board views (e.g. drag-and-drop, delete buttons) that act
 * on items by id without subscribing to any single item's live query.
 *
 * @returns `{ deleteItem, moveItem }`:
 *   - `deleteItem(itemId)` — removes the item with the given id.
 *   - `moveItem(itemId, column)` — moves the item to `column` and bumps `updatedAt`.
 *
 * @example
 * ```tsx
 * function KanbanCard({ item }: { item: ProjectItem }) {
 *   const { moveItem } = useItemActions()
 *   return <button onClick={() => moveItem(item.id, 'done')}>Done</button>
 * }
 * ```
 */
export function useItemActions() {
  const deleteItem = useCallback(async (itemId: string) => {
    await db.items.delete(itemId)
  }, [])

  const moveItem = useCallback(async (itemId: string, column: ColumnStatus) => {
    await db.items.update(itemId, { column, updatedAt: Date.now() })
  }, [])

  return { deleteItem, moveItem }
}

/**
 * Provides a `createItem` function scoped to a single project.
 *
 * @param projectId - Project the created item will belong to. When
 *   `undefined`, `createItem` is a no-op that resolves to `undefined`.
 * @returns `{ createItem }` where `createItem(input)` persists a new
 *   {@link ProjectItem} (defaulting `column` to `'todo'`, `description` to
 *   `''`, and `position` to `0`) and resolves to the created item.
 *
 * @example
 * ```tsx
 * function NewItemButton({ projectId }: { projectId: string }) {
 *   const { createItem } = useCreateItem(projectId)
 *   return <button onClick={() => createItem({ title: 'New task' })}>Add</button>
 * }
 * ```
 */
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
