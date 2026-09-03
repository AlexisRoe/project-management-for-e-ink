/** Kanban column a {@link ProjectItem} currently belongs to. */
export type ColumnStatus = "todo" | "in-progress" | "testing" | "done";

/** A project, acting as a container for {@link ProjectItem} records. */
export interface Project {
  /** UUID v4. */
  id: string;
  /** Display name of the project. */
  name: string;
  /** Unix timestamp (ms) when the project was created. */
  createdAt: number;
  /** Unix timestamp (ms) when the project was last updated. */
  updatedAt: number;
}

/** A single card/task within a project's Kanban board. */
export interface ProjectItem {
  /** UUID v4. */
  id: string;
  /** Foreign key referencing {@link Project.id}. */
  projectId: string;
  /** Short title of the item. */
  title: string;
  /** Longer free-text description of the item. */
  description: string;
  /** Kanban column the item currently sits in. */
  column: ColumnStatus;
  /** Optional planned/actual start date, as a Unix timestamp (ms). */
  startDate?: number;
  /** Optional planned/actual end date, as a Unix timestamp (ms). */
  endDate?: number;
  /** Vertical sort order within its column, for drag-and-drop ordering. */
  position: number;
  /** Unix timestamp (ms) when the item was created. */
  createdAt: number;
  /** Unix timestamp (ms) when the item was last updated. */
  updatedAt: number;
}
