import Dexie, { type EntityTable } from "dexie";
import type { Project, ProjectItem } from "./types";

export const db = new Dexie("paperflow") as Dexie & {
  projects: EntityTable<Project, "id">;
  items: EntityTable<ProjectItem, "id">;
};

db.version(1).stores({
  projects: "id, name, createdAt, updatedAt",
  items: "id, projectId, column, position, createdAt, updatedAt",
});
