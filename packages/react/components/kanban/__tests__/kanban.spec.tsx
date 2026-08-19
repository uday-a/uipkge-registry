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
});
