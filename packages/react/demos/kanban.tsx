import * as React from "react";
import Story from "../../components/story/Story";
import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnHeader,
  KanbanColumnDot,
  KanbanColumnTitle,
  KanbanColumnCount,
  KanbanColumnAdd,
  KanbanColumnBody,
  KanbanCard,
  KanbanCardTitle,
  KanbanCardDescription,
  KanbanCardFooter,
  type KanbanMoveEvent,
} from "@/components/ui/kanban";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  tag: string;
  dueDate: string;
  assignee: string;
}

interface Column {
  id: string;
  title: string;
  dotColor: string;
  tasks: Task[];
}

const initialColumns: Column[] = [
  {
    id: "backlog",
    title: "Backlog",
    dotColor: "bg-slate-400",
    tasks: [
      {
        id: "t-1",
        title: "Audit accessibility on modals",
        description:
          "Ensure focus trap, ESC handling, and ARIA labels match WCAG 2.1 AA.",
        priority: "high",
        tag: "Design",
        dueDate: "Sep 2",
        assignee: "Sarah L.",
      },
      {
        id: "t-2",
        title: "Document keyboard shortcut spec",
        description:
          "Map global hotkeys for search, quick navigation, and command palette.",
        priority: "low",
        tag: "Docs",
        dueDate: "Sep 10",
        assignee: "Alex M.",
      },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    dotColor: "bg-amber-500",
    tasks: [
      {
        id: "t-3",
        title: "Spring physics on drag-and-drop",
        description:
          "Calibrate gesture velocity and snap curves for tactile drag feedback.",
        priority: "medium",
        tag: "Core UI",
        dueDate: "Aug 28",
        assignee: "Elena R.",
      },
      {
        id: "t-4",
        title: "OKLCH color system migration",
        description:
          "Replace legacy HSL tokens with gamut-mapped OKLCH palette.",
        priority: "high",
        tag: "Tokens",
        dueDate: "Aug 30",
        assignee: "Marcus K.",
      },
    ],
  },
  {
    id: "in-review",
    title: "In Review",
    dotColor: "bg-blue-500",
    tasks: [
      {
        id: "t-5",
        title: "Command palette fuzzy match",
        description:
          "Score rankings and highlight matching character substrings.",
        priority: "medium",
        tag: "Search",
        dueDate: "Aug 26",
        assignee: "Devon T.",
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    dotColor: "bg-emerald-500",
    tasks: [
      {
        id: "t-6",
        title: "Dual-framework registry sync",
        description:
          "Auto-generate Vue and React component schemas with 100% parity.",
        priority: "high",
        tag: "Infra",
        dueDate: "Aug 24",
        assignee: "Elena R.",
      },
    ],
  },
];

export default function KanbanDemo() {
  const [columns, setColumns] = React.useState<Column[]>(initialColumns);

  const handleCardMove = ({
    cardId,
    fromColumnId,
    toColumnId,
  }: KanbanMoveEvent) => {
    if (fromColumnId === toColumnId) return;

    setColumns((prev) => {
      let movedTask: Task | undefined;
      const newCols = prev.map((col) => {
        if (col.id === fromColumnId) {
          const remaining = col.tasks.filter((t) => {
            if (t.id === cardId) {
              movedTask = t;
              return false;
            }
            return true;
          });
          return { ...col, tasks: remaining };
        }
        return col;
      });

      if (!movedTask) return prev;

      return newCols.map((col) => {
        if (col.id === toColumnId) {
          return { ...col, tasks: [...col.tasks, movedTask!] };
        }
        return col;
      });
    });
  };

  return (
    <Story
      title="Default"
      description="A composable Kanban primitive with drag-and-drop column routing and tactile card feedback."
    >
      <Kanban onCardMove={handleCardMove}>
        <KanbanBoard>
          {columns.map((column) => (
            <KanbanColumn key={column.id} id={column.id}>
              <KanbanColumnHeader>
                <div className="flex items-center gap-2">
                  <KanbanColumnDot color={column.dotColor} />
                  <KanbanColumnTitle>{column.title}</KanbanColumnTitle>
                  <KanbanColumnCount count={column.tasks.length} />
                </div>
                <KanbanColumnAdd />
              </KanbanColumnHeader>

              <KanbanColumnBody>
                {column.tasks.map((task) => (
                  <KanbanCard key={task.id} id={task.id}>
                    <KanbanCardTitle>{task.title}</KanbanCardTitle>
                    {task.description && (
                      <KanbanCardDescription>
                        {task.description}
                      </KanbanCardDescription>
                    )}
                    <KanbanCardFooter>
                      <div className="text-muted-foreground flex items-center gap-1.5">
                        <Calendar className="size-3" />
                        <span>{task.dueDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="text-[11px] font-normal"
                        >
                          {task.tag}
                        </Badge>
                        <div
                          className="bg-primary/10 text-primary flex size-5 items-center justify-center rounded-full text-[10px] font-medium"
                          title={task.assignee}
                        >
                          {task.assignee.charAt(0)}
                        </div>
                      </div>
                    </KanbanCardFooter>
                  </KanbanCard>
                ))}
              </KanbanColumnBody>
            </KanbanColumn>
          ))}
        </KanbanBoard>
      </Kanban>
    </Story>
  );
}
