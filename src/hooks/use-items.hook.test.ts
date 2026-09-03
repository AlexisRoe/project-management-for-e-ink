import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { db } from "../db/db";
import type { ProjectItem } from "../db/types";
import { useCreateItem, useItem, useItemActions, useProjectItems } from "./use-items.hook";

const PROJECT_ID = "project-1";

beforeEach(async () => {
  await db.projects.add({ id: PROJECT_ID, name: "Project one", createdAt: 1, updatedAt: 1 });
});

afterEach(async () => {
  await db.items.clear();
  await db.projects.clear();
});

describe("useProjectItems", () => {
  it("starts loading and resolves to an empty list when there are no items", async () => {
    const { result } = renderHook(() => useProjectItems(PROJECT_ID));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.items).toEqual([]);
  });

  it("returns an empty, non-loading list when projectId is undefined", async () => {
    const { result } = renderHook(() => useProjectItems(undefined));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.items).toEqual([]);
  });

  it("returns items for the project sorted by position", async () => {
    await db.items.bulkAdd([
      {
        id: "a",
        projectId: PROJECT_ID,
        title: "Second",
        description: "",
        column: "todo",
        position: 1,
        createdAt: 1,
        updatedAt: 1,
      },
      {
        id: "b",
        projectId: PROJECT_ID,
        title: "First",
        description: "",
        column: "todo",
        position: 0,
        createdAt: 1,
        updatedAt: 1,
      },
      {
        id: "c",
        projectId: "other-project",
        title: "Elsewhere",
        description: "",
        column: "todo",
        position: 0,
        createdAt: 1,
        updatedAt: 1,
      },
    ]);

    const { result } = renderHook(() => useProjectItems(PROJECT_ID));

    await waitFor(() => expect(result.current.items).toHaveLength(2));
    expect(result.current.items.map((item) => item.title)).toEqual(["First", "Second"]);
  });

  it("updates live when a matching item is created", async () => {
    const { result } = renderHook(() => useProjectItems(PROJECT_ID));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await db.items.add({
        id: "new-item",
        projectId: PROJECT_ID,
        title: "New",
        description: "",
        column: "todo",
        position: 0,
        createdAt: 1,
        updatedAt: 1,
      });
    });

    await waitFor(() => expect(result.current.items).toHaveLength(1));
  });
});

describe("useItem", () => {
  it("is not loading and has no item when itemId is undefined", () => {
    const { result } = renderHook(() => useItem(undefined));
    expect(result.current.isLoading).toBe(false);
    expect(result.current.item).toBeUndefined();
  });

  it("loads the item by id", async () => {
    await db.items.add({
      id: "item-1",
      projectId: PROJECT_ID,
      title: "Task",
      description: "desc",
      column: "todo",
      position: 0,
      createdAt: 1,
      updatedAt: 1,
    });

    const { result } = renderHook(() => useItem("item-1"));

    await waitFor(() => expect(result.current.item?.title).toBe("Task"));
  });

  it("updateItem patches fields and bumps updatedAt", async () => {
    await db.items.add({
      id: "item-1",
      projectId: PROJECT_ID,
      title: "Task",
      description: "",
      column: "todo",
      position: 0,
      createdAt: 1,
      updatedAt: 1,
    });

    const { result } = renderHook(() => useItem("item-1"));
    await waitFor(() => expect(result.current.item).toBeDefined());

    await act(async () => {
      await result.current.updateItem({ title: "Updated" });
    });

    await waitFor(() => expect(result.current.item?.title).toBe("Updated"));
    expect(result.current.item?.updatedAt).toBeGreaterThan(1);
  });

  it("updateItem is a no-op when itemId is undefined", async () => {
    const { result } = renderHook(() => useItem(undefined));
    await expect(result.current.updateItem({ title: "x" })).resolves.toBeUndefined();
  });

  it("deleteItem removes the item", async () => {
    await db.items.add({
      id: "item-1",
      projectId: PROJECT_ID,
      title: "Task",
      description: "",
      column: "todo",
      position: 0,
      createdAt: 1,
      updatedAt: 1,
    });

    const { result } = renderHook(() => useItem("item-1"));
    await waitFor(() => expect(result.current.item).toBeDefined());

    await act(async () => {
      await result.current.deleteItem();
    });

    await waitFor(() => expect(result.current.item).toBeUndefined());
    expect(await db.items.get("item-1")).toBeUndefined();
  });
});

describe("useItemActions", () => {
  it("deleteItem removes the given item", async () => {
    await db.items.add({
      id: "item-1",
      projectId: PROJECT_ID,
      title: "Task",
      description: "",
      column: "todo",
      position: 0,
      createdAt: 1,
      updatedAt: 1,
    });

    const { result } = renderHook(() => useItemActions());
    await act(async () => {
      await result.current.deleteItem("item-1");
    });

    expect(await db.items.get("item-1")).toBeUndefined();
  });

  it("moveItem updates the column and bumps updatedAt", async () => {
    await db.items.add({
      id: "item-1",
      projectId: PROJECT_ID,
      title: "Task",
      description: "",
      column: "todo",
      position: 0,
      createdAt: 1,
      updatedAt: 1,
    });

    const { result } = renderHook(() => useItemActions());
    await act(async () => {
      await result.current.moveItem("item-1", "done");
    });

    const updated = await db.items.get("item-1");
    expect(updated?.column).toBe("done");
    expect(updated?.updatedAt).toBeGreaterThan(1);
  });
});

describe("useCreateItem", () => {
  it("creates an item with defaults applied", async () => {
    const { result } = renderHook(() => useCreateItem(PROJECT_ID));

    let created: ProjectItem | undefined;
    await act(async () => {
      created = await result.current.createItem({ title: "New task" });
    });

    expect(created).toMatchObject({
      projectId: PROJECT_ID,
      title: "New task",
      description: "",
      column: "todo",
      position: 0,
    });
    expect(await db.items.count()).toBe(1);
  });

  it("honors explicit overrides", async () => {
    const { result } = renderHook(() => useCreateItem(PROJECT_ID));

    let created: ProjectItem | undefined;
    await act(async () => {
      created = await result.current.createItem({
        title: "Task",
        description: "desc",
        column: "in-progress",
        position: 3,
        startDate: 10,
        endDate: 20,
      });
    });

    expect(created).toMatchObject({
      description: "desc",
      column: "in-progress",
      position: 3,
      startDate: 10,
      endDate: 20,
    });
  });

  it("resolves to undefined and does not persist when projectId is undefined", async () => {
    const { result } = renderHook(() => useCreateItem(undefined));

    const created = await result.current.createItem({ title: "Orphan" });

    expect(created).toBeUndefined();
    expect(await db.items.count()).toBe(0);
  });
});
