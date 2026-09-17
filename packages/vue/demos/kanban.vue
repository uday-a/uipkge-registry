<script setup lang="ts">
import { ref } from "vue";
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
  KanbanColumnEmpty,
  KanbanCard,
  KanbanCardTitle,
  KanbanCardDescription,
  KanbanCardFooter,
  type KanbanMoveEvent,
} from "@/components/ui/kanban";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-vue-next";

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

const columns = ref<Column[]>([
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
]);

function handleCardMove({ cardId, fromColumnId, toColumnId }: KanbanMoveEvent) {
  if (fromColumnId === toColumnId) return;

  let movedTask: Task | undefined;
  const sourceCol = columns.value.find((col) => col.id === fromColumnId);
  if (!sourceCol) return;

  sourceCol.tasks = sourceCol.tasks.filter((t) => {
    if (t.id === cardId) {
      movedTask = t;
      return false;
    }
    return true;
  });

  if (!movedTask) return;
  const destCol = columns.value.find((col) => col.id === toColumnId);
  if (destCol) {
    destCol.tasks.push(movedTask);
  }
}

/* ---------------------------------------------------------------- */
/* Small boards for the focused stories below                        */
/* ---------------------------------------------------------------- */

interface MiniCard {
  id: string;
  title: string;
}
interface MiniColumn {
  id: string;
  label: string;
  dotColor: string;
  cards: MiniCard[];
}

function miniBoard(): MiniColumn[] {
  return [
    {
      id: "todo",
      label: "To do",
      dotColor: "bg-slate-400",
      cards: [
        { id: "m-1", title: "Write the migration note" },
        { id: "m-2", title: "Rename the legacy tokens" },
      ],
    },
    {
      id: "doing",
      label: "Doing",
      dotColor: "bg-amber-500",
      cards: [{ id: "m-3", title: "Ship the parity check" }],
    },
    { id: "done", label: "Done", dotColor: "bg-emerald-500", cards: [] },
  ];
}

/** Move between columns, and reorder inside one when `toIndex` is present. */
function applyMove(
  board: MiniColumn[],
  { cardId, fromColumnId, toColumnId, toIndex }: KanbanMoveEvent,
) {
  const from = board.find((c) => c.id === fromColumnId);
  const to = board.find((c) => c.id === toColumnId);
  if (!from || !to) return;
  const index = from.cards.findIndex((c) => c.id === cardId);
  if (index === -1) return;
  const [card] = from.cards.splice(index, 1);
  if (toIndex === undefined) to.cards.push(card);
  else to.cards.splice(toIndex, 0, card);
}

const keyboardBoard = ref(miniBoard());
const reorderBoard = ref([
  {
    id: "sprint",
    label: "Sprint backlog",
    dotColor: "bg-blue-500",
    cards: [
      { id: "r-1", title: "Highest priority" },
      { id: "r-2", title: "Second" },
      { id: "r-3", title: "Third" },
      { id: "r-4", title: "Lowest priority" },
    ],
  },
]);
const lockedBoard = ref(miniBoard());
const pointerOnlyBoard = ref(miniBoard());
const wipBoard = ref(miniBoard());
const compactBoard = ref(miniBoard());
const scrollBoard = ref([
  ...miniBoard(),
  {
    id: "blocked",
    label: "Blocked",
    dotColor: "bg-rose-500",
    cards: [{ id: "m-4", title: "Waiting on legal" }],
  },
  {
    id: "archive",
    label: "Archive",
    dotColor: "bg-slate-300",
    cards: [{ id: "m-5", title: "Old spike" }],
  },
]);

const WIP_LIMIT = 2;
</script>

<template>
  <Story
    title="Default"
    description="A composable Kanban primitive with drag-and-drop column routing and tactile card feedback. Cards are also keyboard-operable — see the next story."
  >
    <Kanban @card-move="handleCardMove">
      <KanbanBoard>
        <KanbanColumn
          v-for="column in columns"
          :key="column.id"
          :id="column.id"
          :label="column.title"
        >
          <KanbanColumnHeader>
            <div class="flex items-center gap-2">
              <KanbanColumnDot :color="column.dotColor" />
              <KanbanColumnTitle>{{ column.title }}</KanbanColumnTitle>
              <KanbanColumnCount :count="column.tasks.length" />
            </div>
            <KanbanColumnAdd />
          </KanbanColumnHeader>

          <KanbanColumnBody>
            <KanbanCard
              v-for="task in column.tasks"
              :key="task.id"
              :id="task.id"
            >
              <KanbanCardTitle>{{ task.title }}</KanbanCardTitle>
              <KanbanCardDescription v-if="task.description">
                {{ task.description }}
              </KanbanCardDescription>
              <KanbanCardFooter>
                <div class="text-muted-foreground flex items-center gap-1.5">
                  <Calendar class="size-3" />
                  <span>{{ task.dueDate }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <Badge variant="outline" class="text-[11px] font-normal">
                    {{ task.tag }}
                  </Badge>
                  <div
                    class="bg-primary/10 text-primary flex size-5 items-center justify-center rounded-full text-[10px] font-medium"
                    :title="task.assignee"
                  >
                    {{ task.assignee.charAt(0) }}
                  </div>
                </div>
              </KanbanCardFooter>
            </KanbanCard>
          </KanbanColumnBody>
        </KanbanColumn>
      </KanbanBoard>
    </Kanban>
  </Story>

  <Story
    title="Keyboard drag and drop"
    description="Tab to a card, press Space to pick it up, then ← → to change column and ↑ ↓ to reorder. Space drops it, Escape cancels. Every step is announced through a polite live region."
  >
    <Kanban @card-move="(e) => applyMove(keyboardBoard, e)">
      <KanbanBoard>
        <KanbanColumn
          v-for="column in keyboardBoard"
          :key="column.id"
          :id="column.id"
          :label="column.label"
        >
          <KanbanColumnHeader>
            <div class="flex items-center gap-2">
              <KanbanColumnDot :color="column.dotColor" />
              <KanbanColumnTitle>{{ column.label }}</KanbanColumnTitle>
              <KanbanColumnCount :count="column.cards.length" />
            </div>
          </KanbanColumnHeader>
          <KanbanColumnBody>
            <KanbanCard
              v-for="card in column.cards"
              :key="card.id"
              :id="card.id"
            >
              <KanbanCardTitle>{{ card.title }}</KanbanCardTitle>
            </KanbanCard>
            <KanbanColumnEmpty v-if="!column.cards.length"
              >Drop a card here</KanbanColumnEmpty
            >
          </KanbanColumnBody>
        </KanbanColumn>
      </KanbanBoard>
    </Kanban>
  </Story>

  <Story
    title="Reorder within a column"
    description="↑ and ↓ on a held card emit a move with `toIndex`, so a single handler covers both cross-column routing and in-column priority."
  >
    <Kanban @card-move="(e) => applyMove(reorderBoard, e)">
      <KanbanBoard>
        <KanbanColumn
          v-for="column in reorderBoard"
          :key="column.id"
          :id="column.id"
          :label="column.label"
        >
          <KanbanColumnHeader>
            <div class="flex items-center gap-2">
              <KanbanColumnDot :color="column.dotColor" />
              <KanbanColumnTitle>{{ column.label }}</KanbanColumnTitle>
              <KanbanColumnCount :count="column.cards.length" />
            </div>
          </KanbanColumnHeader>
          <KanbanColumnBody>
            <KanbanCard
              v-for="(card, index) in column.cards"
              :key="card.id"
              :id="card.id"
            >
              <KanbanCardTitle
                >{{ index + 1 }}. {{ card.title }}</KanbanCardTitle
              >
            </KanbanCard>
          </KanbanColumnBody>
        </KanbanColumn>
      </KanbanBoard>
    </Kanban>
  </Story>

  <Story
    title="Locked card"
    description="`disabled` takes a card out of the tab order, blocks the grab, and marks it aria-disabled — for cards a workflow rule owns."
  >
    <Kanban @card-move="(e) => applyMove(lockedBoard, e)">
      <KanbanBoard>
        <KanbanColumn
          v-for="column in lockedBoard"
          :key="column.id"
          :id="column.id"
          :label="column.label"
        >
          <KanbanColumnHeader>
            <div class="flex items-center gap-2">
              <KanbanColumnDot :color="column.dotColor" />
              <KanbanColumnTitle>{{ column.label }}</KanbanColumnTitle>
            </div>
          </KanbanColumnHeader>
          <KanbanColumnBody>
            <KanbanCard
              v-for="card in column.cards"
              :key="card.id"
              :id="card.id"
              :disabled="card.id === 'm-2'"
            >
              <KanbanCardTitle>{{ card.title }}</KanbanCardTitle>
              <KanbanCardDescription v-if="card.id === 'm-2'"
                >Locked by a workflow rule</KanbanCardDescription
              >
            </KanbanCard>
            <KanbanColumnEmpty v-if="!column.cards.length"
              >Empty</KanbanColumnEmpty
            >
          </KanbanColumnBody>
        </KanbanColumn>
      </KanbanBoard>
    </Kanban>
  </Story>

  <Story
    title="Pointer-only cards"
    description="`keyboard-draggable=\`false\`` keeps mouse dragging and drops the keyboard affordance — for boards where a separate control already moves cards."
  >
    <Kanban @card-move="(e) => applyMove(pointerOnlyBoard, e)">
      <KanbanBoard>
        <KanbanColumn
          v-for="column in pointerOnlyBoard"
          :key="column.id"
          :id="column.id"
          :label="column.label"
        >
          <KanbanColumnHeader>
            <div class="flex items-center gap-2">
              <KanbanColumnDot :color="column.dotColor" />
              <KanbanColumnTitle>{{ column.label }}</KanbanColumnTitle>
            </div>
          </KanbanColumnHeader>
          <KanbanColumnBody>
            <KanbanCard
              v-for="card in column.cards"
              :key="card.id"
              :id="card.id"
              :keyboard-draggable="false"
            >
              <KanbanCardTitle>{{ card.title }}</KanbanCardTitle>
            </KanbanCard>
            <KanbanColumnEmpty v-if="!column.cards.length"
              >Empty</KanbanColumnEmpty
            >
          </KanbanColumnBody>
        </KanbanColumn>
      </KanbanBoard>
    </Kanban>
  </Story>

  <Story
    title="Empty column"
    description="`KanbanColumnEmpty` fills a column that has no cards so the drop target still reads as a target."
  >
    <Kanban>
      <KanbanBoard>
        <KanbanColumn id="empty-a" label="Ready">
          <KanbanColumnHeader>
            <KanbanColumnTitle>Ready</KanbanColumnTitle>
            <KanbanColumnAdd />
          </KanbanColumnHeader>
          <KanbanColumnBody>
            <KanbanColumnEmpty />
          </KanbanColumnBody>
        </KanbanColumn>
        <KanbanColumn id="empty-b" label="Shipped">
          <KanbanColumnHeader>
            <KanbanColumnTitle>Shipped</KanbanColumnTitle>
          </KanbanColumnHeader>
          <KanbanColumnBody>
            <KanbanColumnEmpty>Nothing shipped this week</KanbanColumnEmpty>
          </KanbanColumnBody>
        </KanbanColumn>
      </KanbanBoard>
    </Kanban>
  </Story>

  <Story
    title="WIP limit"
    description="The count badge is a slot, not a fixed string — colour it against a limit to make an over-capacity column obvious."
  >
    <Kanban @card-move="(e) => applyMove(wipBoard, e)">
      <KanbanBoard>
        <KanbanColumn
          v-for="column in wipBoard"
          :key="column.id"
          :id="column.id"
          :label="column.label"
        >
          <KanbanColumnHeader>
            <div class="flex items-center gap-2">
              <KanbanColumnDot :color="column.dotColor" />
              <KanbanColumnTitle>{{ column.label }}</KanbanColumnTitle>
              <KanbanColumnCount
                :class="
                  column.cards.length > WIP_LIMIT
                    ? 'bg-destructive/10 text-destructive'
                    : undefined
                "
              >
                {{ column.cards.length }} / {{ WIP_LIMIT }}
              </KanbanColumnCount>
            </div>
          </KanbanColumnHeader>
          <KanbanColumnBody>
            <KanbanCard
              v-for="card in column.cards"
              :key="card.id"
              :id="card.id"
            >
              <KanbanCardTitle>{{ card.title }}</KanbanCardTitle>
            </KanbanCard>
            <KanbanColumnEmpty v-if="!column.cards.length"
              >Empty</KanbanColumnEmpty
            >
          </KanbanColumnBody>
        </KanbanColumn>
      </KanbanBoard>
    </Kanban>
  </Story>

  <Story
    title="Compact cards"
    description="Title-only cards for dense boards. The card is a container — everything inside it is yours."
  >
    <Kanban @card-move="(e) => applyMove(compactBoard, e)">
      <KanbanBoard>
        <KanbanColumn
          v-for="column in compactBoard"
          :key="column.id"
          :id="column.id"
          :label="column.label"
          class="min-h-[180px] w-56 p-2"
        >
          <KanbanColumnHeader>
            <KanbanColumnTitle class="text-xs">{{
              column.label
            }}</KanbanColumnTitle>
            <KanbanColumnCount :count="column.cards.length" />
          </KanbanColumnHeader>
          <KanbanColumnBody>
            <KanbanCard
              v-for="card in column.cards"
              :key="card.id"
              :id="card.id"
              class="gap-0 p-2"
            >
              <KanbanCardTitle class="text-xs">{{
                card.title
              }}</KanbanCardTitle>
            </KanbanCard>
          </KanbanColumnBody>
        </KanbanColumn>
      </KanbanBoard>
    </Kanban>
  </Story>

  <Story
    title="Scrolling board"
    description="`KanbanBoard` scrolls horizontally once the columns outrun the viewport; each column keeps its own vertical scroll."
  >
    <Kanban @card-move="(e) => applyMove(scrollBoard, e)">
      <KanbanBoard class="max-w-full">
        <KanbanColumn
          v-for="column in scrollBoard"
          :key="column.id"
          :id="column.id"
          :label="column.label"
        >
          <KanbanColumnHeader>
            <div class="flex items-center gap-2">
              <KanbanColumnDot :color="column.dotColor" />
              <KanbanColumnTitle>{{ column.label }}</KanbanColumnTitle>
              <KanbanColumnCount :count="column.cards.length" />
            </div>
          </KanbanColumnHeader>
          <KanbanColumnBody>
            <KanbanCard
              v-for="card in column.cards"
              :key="card.id"
              :id="card.id"
            >
              <KanbanCardTitle>{{ card.title }}</KanbanCardTitle>
            </KanbanCard>
            <KanbanColumnEmpty v-if="!column.cards.length"
              >Empty</KanbanColumnEmpty
            >
          </KanbanColumnBody>
        </KanbanColumn>
      </KanbanBoard>
    </Kanban>
  </Story>

  <Story
    title="Column accents"
    description="`KanbanColumnDot` takes any background utility, so columns can carry the same status colours as the rest of the app."
  >
    <Kanban>
      <KanbanBoard>
        <KanbanColumn
          v-for="column in [
            { id: 'a-1', label: 'Triage', dotColor: 'bg-slate-400' },
            { id: 'a-2', label: 'At risk', dotColor: 'bg-rose-500' },
            { id: 'a-3', label: 'On track', dotColor: 'bg-emerald-500' },
          ]"
          :key="column.id"
          :id="column.id"
          :label="column.label"
          class="min-h-[140px]"
        >
          <KanbanColumnHeader>
            <div class="flex items-center gap-2">
              <KanbanColumnDot :color="column.dotColor" />
              <KanbanColumnTitle>{{ column.label }}</KanbanColumnTitle>
            </div>
          </KanbanColumnHeader>
          <KanbanColumnBody>
            <KanbanColumnEmpty>No cards</KanbanColumnEmpty>
          </KanbanColumnBody>
        </KanbanColumn>
      </KanbanBoard>
    </Kanban>
  </Story>
</template>
