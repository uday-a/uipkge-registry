import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Board, BoardLane, BoardLaneHeader, BoardCard } from "../board";

describe("Board", () => {
  it('renders with data-slot="board"', () => {
    const { container } = render(
      <Board>
        <BoardLane id="todo">
          <BoardLaneHeader>Todo</BoardLaneHeader>
          <BoardCard id="card1">Card 1</BoardCard>
        </BoardLane>
        <BoardLane id="done">
          <BoardLaneHeader>Done</BoardLaneHeader>
        </BoardLane>
      </Board>,
    );
    expect(container.querySelector('[data-slot="board"]')).toBeTruthy();
  });

  it("has data-uipkge", () => {
    const { container } = render(
      <Board>
        <BoardLane id="todo">
          <BoardLaneHeader>Todo</BoardLaneHeader>
        </BoardLane>
      </Board>,
    );
    expect(
      container
        .querySelector('[data-slot="board"]')
        ?.hasAttribute("data-uipkge"),
    ).toBe(true);
  });

  it("applies data-orientation", () => {
    const { container } = render(
      <Board orientation="vertical">
        <BoardLane id="todo">
          <BoardLaneHeader>Todo</BoardLaneHeader>
        </BoardLane>
      </Board>,
    );
    expect(
      container
        .querySelector('[data-slot="board"]')
        ?.getAttribute("data-orientation"),
    ).toBe("vertical");
  });

  it('BoardLane renders with data-slot="board-lane"', () => {
    const { container } = render(
      <Board>
        <BoardLane id="todo">
          <BoardLaneHeader>Todo</BoardLaneHeader>
        </BoardLane>
      </Board>,
    );
    expect(container.querySelector('[data-slot="board-lane"]')).toBeTruthy();
  });

  it("BoardLane has data-uipkge", () => {
    const { container } = render(
      <Board>
        <BoardLane id="todo">
          <BoardLaneHeader>Todo</BoardLaneHeader>
        </BoardLane>
      </Board>,
    );
    expect(
      container
        .querySelector('[data-slot="board-lane"]')
        ?.hasAttribute("data-uipkge"),
    ).toBe(true);
  });

  it("BoardLane has data-lane-id", () => {
    const { container } = render(
      <Board>
        <BoardLane id="todo">
          <BoardLaneHeader>Todo</BoardLaneHeader>
        </BoardLane>
      </Board>,
    );
    expect(
      container
        .querySelector('[data-slot="board-lane"]')
        ?.getAttribute("data-lane-id"),
    ).toBe("todo");
  });

  it('BoardLaneHeader renders with data-slot="board-lane-header"', () => {
    const { container } = render(
      <Board>
        <BoardLane id="todo">
          <BoardLaneHeader>Todo</BoardLaneHeader>
        </BoardLane>
      </Board>,
    );
    expect(
      container.querySelector('[data-slot="board-lane-header"]'),
    ).toBeTruthy();
  });

  it('BoardCard renders with data-slot="board-card"', () => {
    const { container } = render(
      <Board>
        <BoardLane id="todo">
          <BoardLaneHeader>Todo</BoardLaneHeader>
          <BoardCard id="card1">Card 1</BoardCard>
        </BoardLane>
      </Board>,
    );
    expect(container.querySelector('[data-slot="board-card"]')).toBeTruthy();
  });

  it("BoardCard has data-uipkge", () => {
    const { container } = render(
      <Board>
        <BoardLane id="todo">
          <BoardLaneHeader>Todo</BoardLaneHeader>
          <BoardCard id="card1">Card 1</BoardCard>
        </BoardLane>
      </Board>,
    );
    expect(
      container
        .querySelector('[data-slot="board-card"]')
        ?.hasAttribute("data-uipkge"),
    ).toBe(true);
  });

  it("BoardCard has draggable attribute", () => {
    const { container } = render(
      <Board>
        <BoardLane id="todo">
          <BoardLaneHeader>Todo</BoardLaneHeader>
          <BoardCard id="card1">Card 1</BoardCard>
        </BoardLane>
      </Board>,
    );
    expect(
      container
        .querySelector('[data-slot="board-card"]')
        ?.getAttribute("draggable"),
    ).toBe("true");
  });

  it('BoardCard has role="button"', () => {
    const { container } = render(
      <Board>
        <BoardLane id="todo">
          <BoardLaneHeader>Todo</BoardLaneHeader>
          <BoardCard id="card1">Card 1</BoardCard>
        </BoardLane>
      </Board>,
    );
    expect(
      container.querySelector('[data-slot="board-card"]')?.getAttribute("role"),
    ).toBe("button");
  });

  it("BoardLane applies data-disabled when disabled", () => {
    const { container } = render(
      <Board>
        <BoardLane id="todo" disabled>
          <BoardLaneHeader>Todo</BoardLaneHeader>
        </BoardLane>
      </Board>,
    );
    expect(
      container
        .querySelector('[data-slot="board-lane"]')
        ?.hasAttribute("data-disabled"),
    ).toBe(true);
  });
});
