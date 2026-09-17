import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Gantt, GanttHeader, GanttTree, GanttTimeline } from "../index";
import type { GanttTask } from "../types";

const sampleTasks: GanttTask[] = [
  {
    id: "t-1",
    name: "Discovery Phase",
    startDate: "2026-08-01",
    endDate: "2026-08-10",
    progress: 100,
    status: "done",
  },
  {
    id: "t-2",
    name: "Release Milestone",
    startDate: "2026-08-15",
    endDate: "2026-08-15",
    isMilestone: true,
    status: "todo",
  },
];

describe("Gantt (React)", () => {
  it('renders root container with data-slot="gantt"', () => {
    const { container } = render(
      <Gantt tasks={sampleTasks} scale="day">
        <GanttHeader title="Test Roadmap" />
        <div className="flex">
          <GanttTree />
          <GanttTimeline />
        </div>
      </Gantt>,
    );
    expect(container.querySelector('[data-slot="gantt"]')).toBeTruthy();
  });

  it("has data-uipkge attribute", () => {
    const { container } = render(
      <Gantt tasks={sampleTasks} scale="day">
        <GanttHeader title="Test Roadmap" />
      </Gantt>,
    );
    expect(
      container
        .querySelector('[data-slot="gantt"]')
        ?.hasAttribute("data-uipkge"),
    ).toBe(true);
  });

  it("renders GanttHeader with title", () => {
    const { container } = render(
      <Gantt tasks={sampleTasks} scale="day">
        <GanttHeader title="Test Roadmap" />
      </Gantt>,
    );
    expect(
      container.querySelector('[data-slot="gantt-header"]')?.textContent,
    ).toContain("Test Roadmap");
  });

  it("renders GanttTree with deliverable item", () => {
    const { container } = render(
      <Gantt tasks={sampleTasks} scale="day">
        <GanttTree />
      </Gantt>,
    );
    expect(
      container.querySelector('[data-slot="gantt-tree"]')?.textContent,
    ).toContain("Discovery Phase");
  });

  it("renders GanttTimeline with task bars and milestones", () => {
    const { container } = render(
      <Gantt tasks={sampleTasks} scale="day">
        <GanttTimeline />
      </Gantt>,
    );
    expect(container.querySelector('[data-slot="gantt-bar"]')).toBeTruthy();
    expect(
      container.querySelector('[data-slot="gantt-milestone"]'),
    ).toBeTruthy();
  });
});
