import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { db } from "../db/db";
import type { Project } from "../db/types";
import { useProject, useProjects } from "./use-projects.hook";

afterEach(async () => {
  await db.items.clear();
  await db.projects.clear();
});

describe("useProjects", () => {
  it("starts loading and resolves to an empty list", async () => {
    const { result } = renderHook(() => useProjects());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.projects).toEqual([]);
  });

  it("summarizes item counts, per-column counts and completion percentage", async () => {
    await db.projects.add({ id: "p1", name: "Project one", createdAt: 1, updatedAt: 1 });
    await db.items.bulkAdd([
      {
        id: "i1",
        projectId: "p1",
        title: "a",
        description: "",
        column: "done",
        position: 0,
        createdAt: 1,
        updatedAt: 1,
      },
      {
        id: "i2",
        projectId: "p1",
        title: "b",
        description: "",
        column: "done",
        position: 1,
        createdAt: 1,
        updatedAt: 1,
      },
      {
        id: "i3",
        projectId: "p1",
        title: "c",
        description: "",
        column: "todo",
        position: 2,
        createdAt: 1,
        updatedAt: 1,
      },
      {
        id: "i4",
        projectId: "p1",
        title: "d",
        description: "",
        column: "in-progress",
        position: 3,
        createdAt: 1,
        updatedAt: 1,
      },
    ]);

    const { result } = renderHook(() => useProjects());

    await waitFor(() => expect(result.current.projects).toHaveLength(1));
    const summary = result.current.projects[0];
    expect(summary.itemCount).toBe(4);
    expect(summary.itemsByColumn).toEqual({ todo: 1, "in-progress": 1, testing: 0, done: 2 });
    expect(summary.completionPercentage).toBe(50);
  });

  it("reports 0% completion for a project with no items", async () => {
    await db.projects.add({ id: "p1", name: "Empty", createdAt: 1, updatedAt: 1 });

    const { result } = renderHook(() => useProjects());

    await waitFor(() => expect(result.current.projects).toHaveLength(1));
    expect(result.current.projects[0].completionPercentage).toBe(0);
  });

  it("sorts projects by createdAt ascending", async () => {
    await db.projects.bulkAdd([
      { id: "p2", name: "Second", createdAt: 20, updatedAt: 20 },
      { id: "p1", name: "First", createdAt: 10, updatedAt: 10 },
    ]);

    const { result } = renderHook(() => useProjects());

    await waitFor(() => expect(result.current.projects).toHaveLength(2));
    expect(result.current.projects.map((p) => p.name)).toEqual(["First", "Second"]);
  });

  it("createProject persists a new project and resolves to it", async () => {
    const { result } = renderHook(() => useProjects());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    let created: Project | undefined;
    await act(async () => {
      created = await result.current.createProject("New project");
    });

    expect(created).toMatchObject({ name: "New project" });
    expect(await db.projects.count()).toBe(1);
  });

  it("updateProject renames the project and bumps updatedAt", async () => {
    await db.projects.add({ id: "p1", name: "Old", createdAt: 1, updatedAt: 1 });
    const { result } = renderHook(() => useProjects());
    await waitFor(() => expect(result.current.projects).toHaveLength(1));

    await act(async () => {
      await result.current.updateProject("p1", "New name");
    });

    const updated = await db.projects.get("p1");
    expect(updated?.name).toBe("New name");
    expect(updated?.updatedAt).toBeGreaterThan(1);
  });

  it("deleteProject removes the project and all of its items", async () => {
    await db.projects.add({ id: "p1", name: "Project", createdAt: 1, updatedAt: 1 });
    await db.items.add({
      id: "i1",
      projectId: "p1",
      title: "a",
      description: "",
      column: "todo",
      position: 0,
      createdAt: 1,
      updatedAt: 1,
    });

    const { result } = renderHook(() => useProjects());
    await waitFor(() => expect(result.current.projects).toHaveLength(1));

    await act(async () => {
      await result.current.deleteProject("p1");
    });

    expect(await db.projects.get("p1")).toBeUndefined();
    expect(await db.items.where("projectId").equals("p1").count()).toBe(0);
  });

  it("importData replaces all existing projects and items", async () => {
    await db.projects.add({ id: "stale", name: "Stale", createdAt: 1, updatedAt: 1 });

    const { result } = renderHook(() => useProjects());
    await waitFor(() => expect(result.current.projects).toHaveLength(1));

    const file = new File(
      [
        JSON.stringify({
          projects: [{ id: "fresh", name: "Fresh", createdAt: 2, updatedAt: 2 }],
          items: [
            {
              id: "i1",
              projectId: "fresh",
              title: "a",
              description: "",
              column: "todo",
              position: 0,
              createdAt: 2,
              updatedAt: 2,
            },
          ],
        }),
      ],
      "export.json",
      { type: "application/json" },
    );

    await act(async () => {
      await result.current.importData(file);
    });

    expect(await db.projects.get("stale")).toBeUndefined();
    expect(await db.projects.get("fresh")).toMatchObject({ name: "Fresh" });
    expect(await db.items.count()).toBe(1);
  });
});

describe("useProject", () => {
  it("has no project when projectId is undefined", () => {
    const { result } = renderHook(() => useProject(undefined));
    expect(result.current.project).toBeUndefined();
  });

  it("loads the project by id", async () => {
    await db.projects.add({ id: "p1", name: "Project one", createdAt: 1, updatedAt: 1 });

    const { result } = renderHook(() => useProject("p1"));

    await waitFor(() => expect(result.current.project?.name).toBe("Project one"));
    expect(result.current.isLoading).toBe(false);
  });
});
