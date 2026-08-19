import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
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

function mountGantt(tasks = sampleTasks) {
  return mount(
    {
      components: { Gantt, GanttHeader, GanttTree, GanttTimeline },
      setup() {
        return { tasks };
      },
      template: `
        <Gantt :tasks="tasks" scale="day">
          <GanttHeader title="Test Roadmap" />
          <div class="flex">
            <GanttTree />
            <GanttTimeline />
          </div>
        </Gantt>
      `,
    },
    { attachTo: document.body },
  );
}

describe("Gantt", () => {
  it('renders root container with data-slot="gantt"', () => {
    const w = mountGantt();
    expect(w.find('[data-slot="gantt"]').exists()).toBe(true);
    w.unmount();
  });

  it("has data-uipkge attribute", () => {
    const w = mountGantt();
    expect(
      w.find('[data-slot="gantt"]').attributes("data-uipkge"),
    ).toBeDefined();
    w.unmount();
  });

  it("renders GanttHeader with title", () => {
    const w = mountGantt();
    const header = w.find('[data-slot="gantt-header"]');
    expect(header.exists()).toBe(true);
    expect(header.text()).toContain("Test Roadmap");
    w.unmount();
  });

  it("renders GanttTree with correct task count", () => {
    const w = mountGantt();
    const tree = w.find('[data-slot="gantt-tree"]');
    expect(tree.exists()).toBe(true);
    expect(tree.text()).toContain("Discovery Phase");
    w.unmount();
  });

  it("renders GanttTimeline with task bars and milestones", () => {
    const w = mountGantt();
    const timeline = w.find('[data-slot="gantt-timeline"]');
    expect(timeline.exists()).toBe(true);
    expect(w.find('[data-slot="gantt-bar"]').exists()).toBe(true);
    expect(w.find('[data-slot="gantt-milestone"]').exists()).toBe(true);
    w.unmount();
  });
});
