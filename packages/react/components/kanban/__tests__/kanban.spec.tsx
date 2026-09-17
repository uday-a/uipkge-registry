import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import * as React from "react";
import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnHeader,
  KanbanColumnTitle,
  KanbanColumnCount,
  KanbanColumnBody,
  KanbanCard,
  KanbanCardTitle,
  KanbanCardDescription,
} from "../Kanban";

/** Two-column board with `cards` laid out per column. */
function renderBoard(
  cards: Record<string, string[]> = { todo: ["card-1"], done: ["card-2"] },
  cardProps: Partial<React.ComponentProps<typeof KanbanCard>> = {},
  onCardMove?: (event: {
    cardId: string;
    fromColumnId: string;
    toColumnId: string;
    toIndex?: number;
  }) => void,
) {
  return render(
    <Kanban onCardMove={onCardMove}>
      <KanbanBoard>
        {Object.entries(cards).map(([columnId, ids]) => (
          <KanbanColumn
            key={columnId}
            id={columnId}
            label={columnId === "todo" ? "To do" : "Done"}
          >
            <KanbanColumnHeader>
              <KanbanColumnTitle>{columnId}</KanbanColumnTitle>
              <KanbanColumnCount count={ids.length} />
            </KanbanColumnHeader>
            <KanbanColumnBody>
              {ids.map((id) => (
                <KanbanCard key={id} id={id} {...cardProps}>
                  <KanbanCardTitle>{id}</KanbanCardTitle>
                </KanbanCard>
              ))}
            </KanbanColumnBody>
          </KanbanColumn>
        ))}
      </KanbanBoard>
    </Kanban>,
  );
}

describe("Kanban Primitive (React)", () => {
  it("renders kanban board structure and slots correctly", () => {
    const { container } = render(
      <Kanban>
        <KanbanBoard>
          <KanbanColumn id="todo">
            <KanbanColumnHeader>
              <KanbanColumnTitle>To Do</KanbanColumnTitle>
              <KanbanColumnCount count={2} />
            </KanbanColumnHeader>
            <KanbanColumnBody>
              <KanbanCard id="c1">
                <KanbanCardTitle>Task 1</KanbanCardTitle>
                <KanbanCardDescription>Description 1</KanbanCardDescription>
              </KanbanCard>
              <KanbanCard id="c2">
                <KanbanCardTitle>Task 2</KanbanCardTitle>
              </KanbanCard>
            </KanbanColumnBody>
          </KanbanColumn>
        </KanbanBoard>
      </Kanban>,
    );

    expect(container.querySelector('[data-slot="kanban"]')).toBeTruthy();
    expect(container.querySelector('[data-slot="kanban-board"]')).toBeTruthy();
    expect(container.querySelector('[data-slot="kanban-column"]')).toBeTruthy();
    expect(screen.getByText("To Do")).toBeTruthy();
    expect(screen.getByText("2")).toBeTruthy();
    expect(screen.getByText("Task 1")).toBeTruthy();
    expect(screen.getByText("Description 1")).toBeTruthy();
    expect(screen.getByText("Task 2")).toBeTruthy();
  });

  it("handles drag-and-drop move event triggering onCardMove", () => {
    const handleMove = vi.fn();
    const { container } = render(
      <Kanban onCardMove={handleMove}>
        <KanbanBoard>
          <KanbanColumn id="todo">
            <KanbanColumnBody>
              <KanbanCard id="card-1">
                <KanbanCardTitle>Task 1</KanbanCardTitle>
              </KanbanCard>
            </KanbanColumnBody>
          </KanbanColumn>
          <KanbanColumn id="done">
            <KanbanColumnBody>
              <KanbanCard id="card-2">
                <KanbanCardTitle>Task 2</KanbanCardTitle>
              </KanbanCard>
            </KanbanColumnBody>
          </KanbanColumn>
        </KanbanBoard>
      </Kanban>,
    );

    const card = container.querySelector('[data-card-id="card-1"]')!;
    const doneCol = container.querySelector('[data-column-id="done"]')!;

    const dataTransfer = {
      effectAllowed: "",
      dropEffect: "",
      setData: vi.fn(),
      getData: vi.fn(),
    };

    fireEvent.dragStart(card, { dataTransfer });
    fireEvent.dragOver(doneCol, { dataTransfer });
    fireEvent.drop(doneCol, { dataTransfer });

    expect(handleMove).toHaveBeenCalledWith({
      cardId: "card-1",
      fromColumnId: "todo",
      toColumnId: "done",
    });
  });

  // A mouse-only board excludes keyboard and screen-reader users from the
  // primitive's only real interaction, so these cover the whole grab cycle.
  it("exposes each draggable card to assistive tech as a focusable grab target", () => {
    const { container } = renderBoard();
    const card = container.querySelector('[data-card-id="card-1"]')!;

    expect(card.getAttribute("role")).toBe("button");
    expect(card.getAttribute("tabindex")).toBe("0");
    expect(card.getAttribute("aria-roledescription")).toBe("draggable card");
    expect(card.getAttribute("aria-pressed")).toBe("false");
    expect(
      container
        .querySelector('[data-slot="kanban-live-region"]')!
        .getAttribute("aria-live"),
    ).toBe("polite");
  });

  it("names each column for screen readers, falling back to the id", () => {
    const { container } = renderBoard();
    const columns = container.querySelectorAll('[data-slot="kanban-column"]');

    expect(columns[0].getAttribute("role")).toBe("group");
    expect(columns[0].getAttribute("aria-label")).toBe("To do");
    expect(columns[1].getAttribute("aria-label")).toBe("Done");
  });

  it("picks a card up on Space and announces how to move it", () => {
    const { container } = renderBoard();
    const card = container.querySelector('[data-card-id="card-1"]')!;

    fireEvent.keyDown(card, { key: " " });

    expect(card.getAttribute("aria-pressed")).toBe("true");
    expect(card.getAttribute("data-state")).toBe("grabbed");
    expect(
      container.querySelector('[data-slot="kanban-live-region"]')!.textContent,
    ).toContain("Picked up card");
  });

  it("moves a grabbed card to the next column on ArrowRight", () => {
    const handleMove = vi.fn();
    const { container } = renderBoard(undefined, {}, handleMove);
    const card = container.querySelector('[data-card-id="card-1"]')!;

    fireEvent.keyDown(card, { key: " " });
    fireEvent.keyDown(card, { key: "ArrowRight" });

    expect(handleMove).toHaveBeenCalledWith({
      cardId: "card-1",
      fromColumnId: "todo",
      toColumnId: "done",
    });
    expect(
      container.querySelector('[data-slot="kanban-live-region"]')!.textContent,
    ).toContain("Moved to Done");
  });

  it("reorders within a column on ArrowDown, reporting the new position", () => {
    const handleMove = vi.fn();
    const { container } = renderBoard(
      { todo: ["card-1", "card-2"], done: [] },
      {},
      handleMove,
    );
    const card = container.querySelector('[data-card-id="card-1"]')!;

    fireEvent.keyDown(card, { key: " " });
    fireEvent.keyDown(card, { key: "ArrowDown" });

    expect(handleMove).toHaveBeenCalledWith({
      cardId: "card-1",
      fromColumnId: "todo",
      toColumnId: "todo",
      toIndex: 1,
    });
    expect(
      container.querySelector('[data-slot="kanban-live-region"]')!.textContent,
    ).toContain("Position 2 of 2");
  });

  it("stops at the ends of the board instead of wrapping around", () => {
    const handleMove = vi.fn();
    const { container } = renderBoard(undefined, {}, handleMove);
    const card = container.querySelector('[data-card-id="card-1"]')!;

    fireEvent.keyDown(card, { key: " " });
    fireEvent.keyDown(card, { key: "ArrowLeft" });

    expect(handleMove).not.toHaveBeenCalled();
  });

  it("ignores arrow keys until the card is grabbed", () => {
    const handleMove = vi.fn();
    const { container } = renderBoard(undefined, {}, handleMove);

    fireEvent.keyDown(container.querySelector('[data-card-id="card-1"]')!, {
      key: "ArrowRight",
    });

    expect(handleMove).not.toHaveBeenCalled();
  });

  it("releases the card on Escape and on blur so it cannot get stuck held", () => {
    const { container } = renderBoard();
    const card = container.querySelector('[data-card-id="card-1"]')!;

    fireEvent.keyDown(card, { key: " " });
    fireEvent.keyDown(card, { key: "Escape" });
    expect(card.getAttribute("aria-pressed")).toBe("false");
    expect(
      container.querySelector('[data-slot="kanban-live-region"]')!.textContent,
    ).toContain("Move cancelled");

    fireEvent.keyDown(card, { key: " " });
    fireEvent.blur(card);
    expect(card.getAttribute("aria-pressed")).toBe("false");
  });

  it("drops the card on a second Space", () => {
    const { container } = renderBoard();
    const card = container.querySelector('[data-card-id="card-1"]')!;

    fireEvent.keyDown(card, { key: " " });
    fireEvent.keyDown(card, { key: " " });

    expect(card.getAttribute("aria-pressed")).toBe("false");
    expect(
      container.querySelector('[data-slot="kanban-live-region"]')!.textContent,
    ).toContain("Card dropped");
  });

  it("keeps disabled cards out of the tab order and unmovable", () => {
    const handleMove = vi.fn();
    const { container } = renderBoard(
      { todo: ["card-1"], done: [] },
      { disabled: true },
      handleMove,
    );
    const card = container.querySelector('[data-card-id="card-1"]')!;

    expect(card.getAttribute("tabindex")).toBeNull();
    expect(card.getAttribute("aria-disabled")).toBe("true");
    expect(card.getAttribute("draggable")).toBe("false");

    fireEvent.keyDown(card, { key: " " });
    fireEvent.keyDown(card, { key: "ArrowRight" });
    expect(handleMove).not.toHaveBeenCalled();
  });

  it("leaves pointer dragging intact when keyboardDraggable is off", () => {
    const { container } = renderBoard(
      { todo: ["card-1"], done: [] },
      { keyboardDraggable: false },
    );
    const card = container.querySelector('[data-card-id="card-1"]')!;

    expect(card.getAttribute("tabindex")).toBeNull();
    expect(card.getAttribute("draggable")).toBe("true");

    fireEvent.keyDown(card, { key: " " });
    expect(card.getAttribute("data-state")).toBe("idle");
  });
});
