import { Component, Input, signal } from '@angular/core'
import {
  UiKanbanBoardComponent,
  UiKanbanCardComponent,
  UiKanbanCardDescriptionComponent,
  UiKanbanCardFooterComponent,
  UiKanbanCardTitleComponent,
  UiKanbanColumnAddComponent,
  UiKanbanColumnBodyComponent,
  UiKanbanColumnComponent,
  UiKanbanColumnCountComponent,
  UiKanbanColumnDotComponent,
  UiKanbanColumnEmptyComponent,
  UiKanbanColumnHeaderComponent,
  UiKanbanColumnTitleComponent,
  UiKanbanComponent,
  type KanbanMoveEvent,
} from '../../../../../packages/registry-angular/components/kanban/kanban.component'
import { UiBadgeComponent } from '../../../../../packages/registry-angular/components/badge/badge.component'

interface Task {
  id: string
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high'
  tag: string
  dueDate: string
  assignee: string
}

interface Column {
  id: string
  title: string
  dotColor: string
  tasks: Task[]
}

const initialColumns: Column[] = [
  {
    id: 'backlog',
    title: 'Backlog',
    dotColor: 'bg-slate-400',
    tasks: [
      {
        id: 't-1',
        title: 'Audit accessibility on modals',
        description: 'Ensure focus trap, ESC handling, and ARIA labels match WCAG 2.1 AA.',
        priority: 'high',
        tag: 'Design',
        dueDate: 'Sep 2',
        assignee: 'Sarah L.',
      },
      {
        id: 't-2',
        title: 'Document keyboard shortcut spec',
        description: 'Map global hotkeys for search, quick navigation, and command palette.',
        priority: 'low',
        tag: 'Docs',
        dueDate: 'Sep 10',
        assignee: 'Alex M.',
      },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    dotColor: 'bg-amber-500',
    tasks: [
      {
        id: 't-3',
        title: 'Spring physics on drag-and-drop',
        description: 'Calibrate gesture velocity and snap curves for tactile drag feedback.',
        priority: 'medium',
        tag: 'Core UI',
        dueDate: 'Aug 28',
        assignee: 'Elena R.',
      },
      {
        id: 't-4',
        title: 'OKLCH color system migration',
        description: 'Replace legacy HSL tokens with gamut-mapped OKLCH palette.',
        priority: 'high',
        tag: 'Tokens',
        dueDate: 'Aug 30',
        assignee: 'Marcus K.',
      },
    ],
  },
  {
    id: 'in-review',
    title: 'In Review',
    dotColor: 'bg-blue-500',
    tasks: [
      {
        id: 't-5',
        title: 'Command palette fuzzy match',
        description: 'Score rankings and highlight matching character substrings.',
        priority: 'medium',
        tag: 'Search',
        dueDate: 'Aug 26',
        assignee: 'Devon T.',
      },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    dotColor: 'bg-emerald-500',
    tasks: [
      {
        id: 't-6',
        title: 'Dual-framework registry sync',
        description: 'Auto-generate Vue and React component schemas with 100% parity.',
        priority: 'high',
        tag: 'Infra',
        dueDate: 'Aug 24',
        assignee: 'Elena R.',
      },
    ],
  },
]

/* ------------------------------------------------------------------ */
/* Small boards for the focused stories below                          */
/* ------------------------------------------------------------------ */

interface MiniCard {
  id: string
  title: string
}
interface MiniColumn {
  id: string
  label: string
  dotColor: string
  cards: MiniCard[]
}

function miniBoard(): MiniColumn[] {
  return [
    {
      id: 'todo',
      label: 'To do',
      dotColor: 'bg-slate-400',
      cards: [
        { id: 'm-1', title: 'Write the migration note' },
        { id: 'm-2', title: 'Rename the legacy tokens' },
      ],
    },
    { id: 'doing', label: 'Doing', dotColor: 'bg-amber-500', cards: [{ id: 'm-3', title: 'Ship the parity check' }] },
    { id: 'done', label: 'Done', dotColor: 'bg-emerald-500', cards: [] },
  ]
}

/** Move between columns, and reorder inside one when `toIndex` is present. */
function applyMove(board: MiniColumn[], { cardId, fromColumnId, toColumnId, toIndex }: KanbanMoveEvent): MiniColumn[] {
  const card = board.find((c) => c.id === fromColumnId)?.cards.find((c) => c.id === cardId)
  if (!card) return board
  return board.map((column) => {
    if (column.id === fromColumnId && column.id === toColumnId) {
      const rest = column.cards.filter((c) => c.id !== cardId)
      rest.splice(toIndex ?? rest.length, 0, card)
      return { ...column, cards: rest }
    }
    if (column.id === fromColumnId) return { ...column, cards: column.cards.filter((c) => c.id !== cardId) }
    if (column.id === toColumnId) {
      const next = [...column.cards]
      next.splice(toIndex ?? next.length, 0, card)
      return { ...column, cards: next }
    }
    return column
  })
}

/** Keeps a mini board in a signal and exposes the move handler for it. */
class MiniBoard {
  readonly board: ReturnType<typeof signal<MiniColumn[]>>
  constructor(initial: MiniColumn[] = miniBoard()) {
    this.board = signal(initial)
  }
  readonly move = (event: KanbanMoveEvent) => this.board.update((prev) => applyMove(prev, event))
}

const WIP_LIMIT = 2

/** Angular demo for the kanban page. Mirrors demos/react/kanban.tsx story by story. */
@Component({
  selector: 'angular-kanban-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiKanbanComponent,
    UiKanbanBoardComponent,
    UiKanbanColumnComponent,
    UiKanbanColumnHeaderComponent,
    UiKanbanColumnDotComponent,
    UiKanbanColumnTitleComponent,
    UiKanbanColumnCountComponent,
    UiKanbanColumnAddComponent,
    UiKanbanColumnBodyComponent,
    UiKanbanColumnEmptyComponent,
    UiKanbanCardComponent,
    UiKanbanCardTitleComponent,
    UiKanbanCardDescriptionComponent,
    UiKanbanCardFooterComponent,
    UiBadgeComponent,
  ],
  template: `
    @switch (story) {
      @case ('Default') {
        <div ui-kanban (cardMove)="handleCardMove($event)">
          <div ui-kanban-board>
            @for (column of columns(); track column.id) {
              <div ui-kanban-column [id]="column.id" [label]="column.title">
                <div ui-kanban-column-header>
                  <div class="flex items-center gap-2">
                    <span ui-kanban-column-dot [color]="column.dotColor"></span>
                    <h3 ui-kanban-column-title>{{ column.title }}</h3>
                    <span ui-kanban-column-count [count]="column.tasks.length"></span>
                  </div>
                  <button ui-kanban-column-add></button>
                </div>
                <div ui-kanban-column-body>
                  @for (task of column.tasks; track task.id) {
                    <div ui-kanban-card [id]="task.id">
                      <p ui-kanban-card-title>{{ task.title }}</p>
                      @if (task.description) {
                        <p ui-kanban-card-description>{{ task.description }}</p>
                      }
                      <div ui-kanban-card-footer>
                        <div class="text-muted-foreground flex items-center gap-1.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="lucide lucide-calendar size-3"
                            aria-hidden="true"
                          >
                            <path d="M8 2v4" />
                            <path d="M16 2v4" />
                            <rect width="18" height="18" x="3" y="4" rx="2" />
                            <path d="M3 10h18" />
                          </svg>
                          <span>{{ task.dueDate }}</span>
                        </div>
                        <div class="flex items-center gap-2">
                          <span ui-badge variant="outline" class="text-[11px] font-normal">{{ task.tag }}</span>
                          <div
                            class="bg-primary/10 text-primary flex size-5 items-center justify-center rounded-full text-[10px] font-medium"
                            [title]="task.assignee"
                          >
                            {{ task.assignee.charAt(0) }}
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      }
      @case ('Keyboard drag and drop') {
        <div ui-kanban (cardMove)="keyboard.move($event)">
          <div ui-kanban-board>
            @for (column of keyboard.board(); track column.id) {
              <div ui-kanban-column [id]="column.id" [label]="column.label">
                <div ui-kanban-column-header>
                  <div class="flex items-center gap-2">
                    <span ui-kanban-column-dot [color]="column.dotColor"></span>
                    <h3 ui-kanban-column-title>{{ column.label }}</h3>
                    <span ui-kanban-column-count [count]="column.cards.length"></span>
                  </div>
                </div>
                <div ui-kanban-column-body>
                  @for (card of column.cards; track card.id; let index = $index) {
                    <div ui-kanban-card [id]="card.id">
                      <p ui-kanban-card-title>{{ card.title }}</p>
                    </div>
                  }
                  @if (column.cards.length === 0) {
                    <div ui-kanban-column-empty>Drop a card here</div>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      }
      @case ('Reorder within a column') {
        <div ui-kanban (cardMove)="reorder.move($event)">
          <div ui-kanban-board>
            @for (column of reorder.board(); track column.id) {
              <div ui-kanban-column [id]="column.id" [label]="column.label">
                <div ui-kanban-column-header>
                  <div class="flex items-center gap-2">
                    <span ui-kanban-column-dot [color]="column.dotColor"></span>
                    <h3 ui-kanban-column-title>{{ column.label }}</h3>
                    <span ui-kanban-column-count [count]="column.cards.length"></span>
                  </div>
                </div>
                <div ui-kanban-column-body>
                  @for (card of column.cards; track card.id; let index = $index) {
                    <div ui-kanban-card [id]="card.id">
                      <p ui-kanban-card-title>{{ index + 1 }}. {{ card.title }}</p>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      }
      @case ('Locked card') {
        <div ui-kanban (cardMove)="locked.move($event)">
          <div ui-kanban-board>
            @for (column of locked.board(); track column.id) {
              <div ui-kanban-column [id]="column.id" [label]="column.label">
                <div ui-kanban-column-header>
                  <div class="flex items-center gap-2">
                    <span ui-kanban-column-dot [color]="column.dotColor"></span>
                    <h3 ui-kanban-column-title>{{ column.label }}</h3>
                  </div>
                </div>
                <div ui-kanban-column-body>
                  @for (card of column.cards; track card.id; let index = $index) {
                    <div ui-kanban-card [id]="card.id" [disabled]="card.id === 'm-2'">
                      <p ui-kanban-card-title>{{ card.title }}</p>
                      @if (card.id === 'm-2') {
                        <p ui-kanban-card-description>Locked by a workflow rule</p>
                      }
                    </div>
                  }
                  @if (column.cards.length === 0) {
                    <div ui-kanban-column-empty>Empty</div>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      }
      @case ('Pointer-only cards') {
        <div ui-kanban (cardMove)="pointerOnly.move($event)">
          <div ui-kanban-board>
            @for (column of pointerOnly.board(); track column.id) {
              <div ui-kanban-column [id]="column.id" [label]="column.label">
                <div ui-kanban-column-header>
                  <div class="flex items-center gap-2">
                    <span ui-kanban-column-dot [color]="column.dotColor"></span>
                    <h3 ui-kanban-column-title>{{ column.label }}</h3>
                  </div>
                </div>
                <div ui-kanban-column-body>
                  @for (card of column.cards; track card.id; let index = $index) {
                    <div ui-kanban-card [id]="card.id" [keyboardDraggable]="false">
                      <p ui-kanban-card-title>{{ card.title }}</p>
                    </div>
                  }
                  @if (column.cards.length === 0) {
                    <div ui-kanban-column-empty>Empty</div>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      }
      @case ('Empty column') {
        <div ui-kanban>
          <div ui-kanban-board>
            <div ui-kanban-column id="empty-a" label="Ready">
              <div ui-kanban-column-header>
                <h3 ui-kanban-column-title>Ready</h3>
                <button ui-kanban-column-add></button>
              </div>
              <div ui-kanban-column-body>
                <div ui-kanban-column-empty></div>
              </div>
            </div>
            <div ui-kanban-column id="empty-b" label="Shipped">
              <div ui-kanban-column-header>
                <h3 ui-kanban-column-title>Shipped</h3>
              </div>
              <div ui-kanban-column-body>
                <div ui-kanban-column-empty>Nothing shipped this week</div>
              </div>
            </div>
          </div>
        </div>
      }
      @case ('WIP limit') {
        <div ui-kanban (cardMove)="wip.move($event)">
          <div ui-kanban-board>
            @for (column of wip.board(); track column.id) {
              <div ui-kanban-column [id]="column.id" [label]="column.label">
                <div ui-kanban-column-header>
                  <div class="flex items-center gap-2">
                    <span ui-kanban-column-dot [color]="column.dotColor"></span>
                    <h3 ui-kanban-column-title>{{ column.label }}</h3>
                    <span
                      ui-kanban-column-count
                      [class]="column.cards.length > wipLimit ? 'bg-destructive/10 text-destructive' : undefined"
                      >{{ column.cards.length }} / {{ wipLimit }}</span
                    >
                  </div>
                </div>
                <div ui-kanban-column-body>
                  @for (card of column.cards; track card.id; let index = $index) {
                    <div ui-kanban-card [id]="card.id">
                      <p ui-kanban-card-title>{{ card.title }}</p>
                    </div>
                  }
                  @if (column.cards.length === 0) {
                    <div ui-kanban-column-empty>Empty</div>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      }
      @case ('Compact cards') {
        <div ui-kanban (cardMove)="compact.move($event)">
          <div ui-kanban-board>
            @for (column of compact.board(); track column.id) {
              <div ui-kanban-column [id]="column.id" [label]="column.label" class="min-h-[180px] w-56 p-2">
                <div ui-kanban-column-header>
                  <h3 ui-kanban-column-title class="text-xs">{{ column.label }}</h3>
                  <span ui-kanban-column-count [count]="column.cards.length"></span>
                </div>
                <div ui-kanban-column-body>
                  @for (card of column.cards; track card.id; let index = $index) {
                    <div ui-kanban-card [id]="card.id" class="gap-0 p-2">
                      <p ui-kanban-card-title class="text-xs">{{ card.title }}</p>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      }
      @case ('Scrolling board') {
        <div ui-kanban (cardMove)="scrolling.move($event)">
          <div ui-kanban-board class="max-w-full">
            @for (column of scrolling.board(); track column.id) {
              <div ui-kanban-column [id]="column.id" [label]="column.label">
                <div ui-kanban-column-header>
                  <div class="flex items-center gap-2">
                    <span ui-kanban-column-dot [color]="column.dotColor"></span>
                    <h3 ui-kanban-column-title>{{ column.label }}</h3>
                    <span ui-kanban-column-count [count]="column.cards.length"></span>
                  </div>
                </div>
                <div ui-kanban-column-body>
                  @for (card of column.cards; track card.id; let index = $index) {
                    <div ui-kanban-card [id]="card.id">
                      <p ui-kanban-card-title>{{ card.title }}</p>
                    </div>
                  }
                  @if (column.cards.length === 0) {
                    <div ui-kanban-column-empty>Empty</div>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      }
      @case ('Column accents') {
        <div ui-kanban>
          <div ui-kanban-board>
            @for (column of accents; track column.id) {
              <div ui-kanban-column [id]="column.id" [label]="column.label" class="min-h-[140px]">
                <div ui-kanban-column-header>
                  <div class="flex items-center gap-2">
                    <span ui-kanban-column-dot [color]="column.dotColor"></span>
                    <h3 ui-kanban-column-title>{{ column.label }}</h3>
                  </div>
                </div>
                <div ui-kanban-column-body>
                  <div ui-kanban-column-empty>No cards</div>
                </div>
              </div>
            }
          </div>
        </div>
      }
    }
  `,
})
export class AngularKanbanDemoComponent {
  @Input() story = 'Default'
  readonly wipLimit = WIP_LIMIT
  readonly columns = signal<Column[]>(initialColumns)
  readonly keyboard = new MiniBoard()
  readonly reorder = new MiniBoard([
    {
      id: 'sprint',
      label: 'Sprint backlog',
      dotColor: 'bg-blue-500',
      cards: [
        { id: 'r-1', title: 'Highest priority' },
        { id: 'r-2', title: 'Second' },
        { id: 'r-3', title: 'Third' },
        { id: 'r-4', title: 'Lowest priority' },
      ],
    },
  ])
  readonly locked = new MiniBoard()
  readonly pointerOnly = new MiniBoard()
  readonly wip = new MiniBoard()
  readonly compact = new MiniBoard()
  readonly scrolling = new MiniBoard([
    ...miniBoard(),
    { id: 'blocked', label: 'Blocked', dotColor: 'bg-rose-500', cards: [{ id: 'm-4', title: 'Waiting on legal' }] },
    { id: 'archive', label: 'Archive', dotColor: 'bg-slate-300', cards: [{ id: 'm-5', title: 'Old spike' }] },
  ])
  readonly accents = [
    { id: 'a-1', label: 'Triage', dotColor: 'bg-slate-400' },
    { id: 'a-2', label: 'At risk', dotColor: 'bg-rose-500' },
    { id: 'a-3', label: 'On track', dotColor: 'bg-emerald-500' },
  ]

  handleCardMove({ cardId, fromColumnId, toColumnId }: KanbanMoveEvent): void {
    if (fromColumnId === toColumnId) return
    this.columns.update((prev) => {
      const movedTask = prev.find((c) => c.id === fromColumnId)?.tasks.find((t) => t.id === cardId)
      if (!movedTask) return prev
      return prev.map((col) => {
        if (col.id === fromColumnId) return { ...col, tasks: col.tasks.filter((t) => t.id !== cardId) }
        if (col.id === toColumnId) return { ...col, tasks: [...col.tasks, movedTask] }
        return col
      })
    })
  }
}
