import type { JSX, ReactNode } from 'react'

import { Mono } from './Text.component'
import { CancelButton } from './Button.component'
import type { ColumnStatus, ProjectItem } from '../db/types'

import './Board.component.css'

const COLUMNS: { status: ColumnStatus; label: string }[] = [
  { status: 'todo', label: 'To do' },
  { status: 'in-progress', label: 'In progress' },
  { status: 'testing', label: 'Testing' },
  { status: 'done', label: 'Done' },
]

interface BoardProps {
  items: ProjectItem[]
  renderItem: (item: ProjectItem) => ReactNode
  movingItemId?: string
  onMoveTo?: (column: ColumnStatus) => void
}

export function Board({ items, renderItem, movingItemId, onMoveTo }: BoardProps): JSX.Element {
  const movingItemColumn = items.find((item) => item.id === movingItemId)?.column

  return (
    <div className="board">
      {COLUMNS.map(({ status, label }) => {
        const columnItems = items.filter((item) => item.column === status)
        const showMoveHere = movingItemId !== undefined && status !== movingItemColumn

        return (
          <div className="board-column" key={status}>
            <div className="board-column-header">
              <Mono>{label.toUpperCase()}</Mono>
              <Mono>{String(columnItems.length).padStart(2, '0')}</Mono>
            </div>
            {showMoveHere && (
              <button type="button" className="board-move-here" onClick={() => onMoveTo?.(status)}>
                <Mono>{'↓ MOVE HERE'}</Mono>
              </button>
            )}
            <div className="board-column-body">
              {columnItems.map((item) => renderItem(item))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

interface MoveBannerProps {
  title: string;
  onCancel: () => void;
}

export function MoveBanner({ title, onCancel }: MoveBannerProps): JSX.Element {
  return (
    <div className="move-banner">
      <div className="move-banner-text">
        <Mono>MOVING</Mono>
        <strong>{title}</strong>
        <Mono>{'CHOOSE A COLUMN ↓'}</Mono>
      </div>
      <CancelButton size="small" className="move-banner-close" onClick={onCancel} />
    </div>
  )
}
