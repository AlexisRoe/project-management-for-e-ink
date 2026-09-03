import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import "@marcomattes/epaper-components";

const mockNavigate = vi.fn();

vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));

const mockUseProjects = vi.fn();

vi.mock("../hooks/use-projects.hook", () => ({
  useProjects: () => mockUseProjects(),
}));

import ProjectOverviewView from "./project-overview.view";

const projectSummary = {
  id: "p1",
  name: "Website Relaunch",
  createdAt: 0,
  updatedAt: 0,
  itemCount: 4,
  itemsByColumn: { todo: 1, "in-progress": 1, testing: 1, done: 1 },
  completionPercentage: 25,
};

describe("ProjectOverviewView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseProjects.mockReturnValue({
      projects: [],
      createProject: vi.fn(),
      updateProject: vi.fn(),
      deleteProject: vi.fn(),
      exportData: vi.fn(),
      importData: vi.fn(),
    });
  });

  it("shows an empty state when there are no projects", () => {
    render(<ProjectOverviewView />);

    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("Oops nothing here")).toBeInTheDocument();
  });

  it("renders a card for each project", () => {
    mockUseProjects.mockReturnValue({
      projects: [projectSummary],
      createProject: vi.fn(),
      updateProject: vi.fn(),
      deleteProject: vi.fn(),
      exportData: vi.fn(),
      importData: vi.fn(),
    });

    render(<ProjectOverviewView />);

    expect(screen.getByText("Website Relaunch")).toBeInTheDocument();
    expect(screen.getByText("4 ITEMS")).toBeInTheDocument();
  });
});
