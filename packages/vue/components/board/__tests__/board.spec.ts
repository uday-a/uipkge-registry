import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { Board, BoardLane, BoardLaneHeader, BoardCard } from "../index";

function mountBoard(template = defaultBoardTemplate()) {
  return mount(
    {
      components: { Board, BoardLane, BoardLaneHeader, BoardCard },
      template,
    },
    { attachTo: document.body },
  );
}

function defaultBoardTemplate() {
  return (
    "<Board>" +
    '<BoardLane id="todo"><BoardLaneHeader>Todo</BoardLaneHeader><BoardCard id="card1">Card 1</BoardCard></BoardLane>' +
    '<BoardLane id="done"><BoardLaneHeader>Done</BoardLaneHeader></BoardLane>' +
    "</Board>"
  );
}

describe("Board", () => {
  it('Board renders with data-slot="board"', () => {
    const w = mountBoard();
    expect(w.find('[data-slot="board"]').exists()).toBe(true);
    w.unmount();
  });

  it("Board has data-uipkge", () => {
    const w = mountBoard();
    expect(
      w.find('[data-slot="board"]').attributes("data-uipkge"),
    ).toBeDefined();
    w.unmount();
  });

  it("Board applies data-orientation", () => {
    const w = mountBoard();
    expect(w.find('[data-slot="board"]').attributes("data-orientation")).toBe(
      "horizontal",
    );
    w.unmount();
  });

  it('BoardLane renders with data-slot="board-lane"', () => {
    const w = mountBoard();
    expect(w.findAll('[data-slot="board-lane"]').length).toBe(2);
    w.unmount();
  });

  it("BoardLane has data-uipkge", () => {
    const w = mountBoard();
    expect(
      w.find('[data-slot="board-lane"]').attributes("data-uipkge"),
    ).toBeDefined();
    w.unmount();
  });

  it("BoardLane has data-lane-id", () => {
    const w = mountBoard();
    const lanes = w.findAll('[data-slot="board-lane"]');
    expect(lanes[0].attributes("data-lane-id")).toBe("todo");
    expect(lanes[1].attributes("data-lane-id")).toBe("done");
    w.unmount();
  });

  it('BoardLaneHeader renders with data-slot="board-lane-header"', () => {
    const w = mountBoard();
    expect(w.findAll('[data-slot="board-lane-header"]').length).toBe(2);
    w.unmount();
  });

  it('BoardCard renders with data-slot="board-card"', () => {
    const w = mountBoard();
    expect(w.find('[data-slot="board-card"]').exists()).toBe(true);
    w.unmount();
  });

  it("BoardCard has data-uipkge", () => {
    const w = mountBoard();
    expect(
      w.find('[data-slot="board-card"]').attributes("data-uipkge"),
    ).toBeDefined();
    w.unmount();
  });

  it("BoardCard has draggable attribute", () => {
    const w = mountBoard();
    expect(w.find('[data-slot="board-card"]').attributes("draggable")).toBe(
      "true",
    );
    w.unmount();
  });

  it('BoardCard has role="button"', () => {
    const w = mountBoard();
    expect(w.find('[data-slot="board-card"]').attributes("role")).toBe(
      "button",
    );
    w.unmount();
  });

  it("BoardLane applies data-disabled when disabled", () => {
    const w = mount(
      {
        components: { Board, BoardLane, BoardLaneHeader, BoardCard },
        template:
          '<Board><BoardLane id="todo" disabled><BoardLaneHeader>Todo</BoardLaneHeader></BoardLane></Board>',
      },
      { attachTo: document.body },
    );
    expect(
      w.find('[data-slot="board-lane"]').attributes("data-disabled"),
    ).toBeDefined();
    w.unmount();
  });
});
