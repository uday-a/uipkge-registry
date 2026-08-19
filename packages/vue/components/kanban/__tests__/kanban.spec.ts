import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { h } from "vue";
import Kanban from "../Kanban.vue";
import KanbanBoard from "../KanbanBoard.vue";
import KanbanColumn from "../KanbanColumn.vue";
import KanbanColumnHeader from "../KanbanColumnHeader.vue";
import KanbanColumnTitle from "../KanbanColumnTitle.vue";
import KanbanColumnCount from "../KanbanColumnCount.vue";
import KanbanColumnBody from "../KanbanColumnBody.vue";
import KanbanCard from "../KanbanCard.vue";
import KanbanCardTitle from "../KanbanCardTitle.vue";

describe("Kanban Primitive (Vue)", () => {
  it("renders without crashing and applies custom class", () => {
    const wrapper = mount(Kanban, {
      props: { class: "custom-kanban" },
    });
    expect(wrapper.find('[data-slot="kanban"]').exists()).toBe(true);
    expect(wrapper.find('[data-slot="kanban"]').classes()).toContain(
      "custom-kanban",
    );
    wrapper.unmount();
  });

  it("renders compound Kanban elements properly", () => {
    const wrapper = mount(Kanban, {
      slots: {
        default: () =>
          h(KanbanBoard, {}, () => [
            h(KanbanColumn, { id: "todo" }, () => [
              h(KanbanColumnHeader, {}, () => [
                h(KanbanColumnTitle, {}, () => "To Do"),
                h(KanbanColumnCount, { count: 1 }),
              ]),
              h(KanbanColumnBody, {}, () => [
                h(KanbanCard, { id: "card-1" }, () => [
                  h(KanbanCardTitle, {}, () => "Task 1"),
                ]),
              ]),
            ]),
          ]),
      },
    });

    expect(wrapper.find('[data-slot="kanban"]').exists()).toBe(true);
    expect(wrapper.find('[data-slot="kanban-board"]').exists()).toBe(true);
    expect(wrapper.find('[data-slot="kanban-column"]').exists()).toBe(true);
    expect(wrapper.text()).toContain("To Do");
    expect(wrapper.text()).toContain("1");
    expect(wrapper.text()).toContain("Task 1");
  });
});
