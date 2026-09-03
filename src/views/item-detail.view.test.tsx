import { render, screen } from "@testing-library/react";
import { act } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import "@marcomattes/epaper-components";

const mockNavigate = vi.fn();
const mockUseParams = vi.fn();
const mockUseSearchParams = vi.fn();

vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
  useParams: () => mockUseParams(),
  useSearchParams: () => mockUseSearchParams(),
}));

const mockUseProject = vi.fn();
const mockUseItem = vi.fn();
const mockCreateItem = vi.fn();

vi.mock("../hooks/use-projects.hook", () => ({
  useProject: (...args: unknown[]) => mockUseProject(...args),
}));

vi.mock("../hooks/use-items.hook", () => ({
  useItem: (...args: unknown[]) => mockUseItem(...args),
  useCreateItem: () => ({ createItem: mockCreateItem }),
}));

import ItemDetailView from "./item-detail.view";

const project = { id: "p1", name: "Website Relaunch", createdAt: 0, updatedAt: 0 };
const item = {
  id: "i1",
  projectId: "p1",
  title: "Write tests",
  description: "Cover the ideal path",
  column: "todo" as const,
  position: 0,
  createdAt: 0,
  updatedAt: 0,
};

describe("ItemDetailView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseParams.mockReturnValue({ itemId: "i1" });
    mockUseSearchParams.mockReturnValue([new URLSearchParams({ projectId: "p1" })]);
    mockUseProject.mockReturnValue({ project, isLoading: false });
  });

  it("shows a loading view while the project or item is loading", () => {
    mockUseItem.mockReturnValue({
      item: undefined,
      isLoading: true,
      updateItem: vi.fn(),
      deleteItem: vi.fn(),
    });

    render(<ItemDetailView />);

    expect(screen.getByText("… LOADING …")).toBeInTheDocument();
  });

  it("shows an error view when the project is undefined", () => {
    mockUseProject.mockReturnValue({ project: undefined, isLoading: false });
    mockUseItem.mockReturnValue({
      item: undefined,
      isLoading: false,
      updateItem: vi.fn(),
      deleteItem: vi.fn(),
    });

    render(<ItemDetailView />);

    expect(screen.getByText("Project is not defined")).toBeInTheDocument();
  });

  it("renders the item title and project name", () => {
    mockUseItem.mockReturnValue({
      item,
      isLoading: false,
      updateItem: vi.fn(),
      deleteItem: vi.fn(),
    });

    render(<ItemDetailView />);

    expect(screen.getByText("WEBSITE RELAUNCH")).toBeInTheDocument();
    expect(screen.getByText("Write tests")).toBeInTheDocument();
  });

  it("calls deleteItem and navigates back when Delete is clicked", () => {
    const deleteItem = vi.fn().mockResolvedValue(undefined);
    mockUseItem.mockReturnValue({ item, isLoading: false, updateItem: vi.fn(), deleteItem });

    const { container } = render(<ItemDetailView />);

    const deleteButton = container.querySelectorAll("e-button")[2];
    act(() => {
      deleteButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(deleteItem).toHaveBeenCalled();
  });
});
