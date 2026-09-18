import * as React from 'react'
import Story from '../../components/story/Story'
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
} from '@/components/ui/kanban'
import { Badge } from '@/components/ui/badge'
import { Calendar } from 'lucide-react'

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

/** Keeps a mini board in state and returns the move handler for it. */
function useMiniBoard(initial: MiniColumn[] = miniBoard()) {
  const [board, setBoard] = React.useState<MiniColumn[]>(initial)
  const onCardMove = React.useCallback((event: KanbanMoveEvent) => {
    setBoard((prev) => applyMove(prev, event))
  }, [])
  return { board, onCardMove }
}

const WIP_LIMIT = 2

export default function KanbanDemo() {
  const [columns, setColumns] = React.useState<Column[]>(initialColumns)
  const keyboard = useMiniBoard()
  const reorder = useMiniBoard([
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
  const locked = useMiniBoard()
  const pointerOnly = useMiniBoard()
  const wip = useMiniBoard()
  const compact = useMiniBoard()
  const scrolling = useMiniBoard([
    ...miniBoard(),
    { id: 'blocked', label: 'Blocked', dotColor: 'bg-rose-500', cards: [{ id: 'm-4', title: 'Waiting on legal' }] },
    { id: 'archive', label: 'Archive', dotColor: 'bg-slate-300', cards: [{ id: 'm-5', title: 'Old spike' }] },
  ])

  const handleCardMove = ({ cardId, fromColumnId, toColumnId }: KanbanMoveEvent) => {
    if (fromColumnId === toColumnId) return

    setColumns((prev) => {
      let movedTask: Task | undefined
      const newCols = prev.map((col) => {
        if (col.id === fromColumnId) {
          const remaining = col.tasks.filter((t) => {
            if (t.id === cardId) {
              movedTask = t
              return false
            }
            return true
          })
          return { ...col, tasks: remaining }
        }
        return col
      })

      if (!movedTask) return prev

      return newCols.map((col) => {
        if (col.id === toColumnId) {
          return { ...col, tasks: [...col.tasks, movedTask!] }
        }
        return col
      })
    })
  }

  return (
    <>
      <Story
        title="Default"
        description="A composable Kanban primitive with drag-and-drop column routing and tactile card feedback. Cards are also keyboard-operable — see the next story."
      >
        <Kanban onCardMove={handleCardMove}>
          <KanbanBoard>
            {columns.map((column) => (
              <KanbanColumn key={column.id} id={column.id} label={column.title}>
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
                      {task.description && <KanbanCardDescription>{task.description}</KanbanCardDescription>}
                      <KanbanCardFooter>
                        <div className="text-muted-foreground flex items-center gap-1.5">
                          <Calendar className="size-3" />
                          <span>{task.dueDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[11px] font-normal">
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

      <Story
        title="Keyboard drag and drop"
        description="Tab to a card, press Space to pick it up, then ← → to change column and ↑ ↓ to reorder. Space drops it, Escape cancels. Every step is announced through a polite live region."
      >
        <Kanban onCardMove={keyboard.onCardMove}>
          <KanbanBoard>
            {keyboard.board.map((column) => (
              <KanbanColumn key={column.id} id={column.id} label={column.label}>
                <KanbanColumnHeader>
                  <div className="flex items-center gap-2">
                    <KanbanColumnDot color={column.dotColor} />
                    <KanbanColumnTitle>{column.label}</KanbanColumnTitle>
                    <KanbanColumnCount count={column.cards.length} />
                  </div>
                </KanbanColumnHeader>
                <KanbanColumnBody>
                  {column.cards.map((card) => (
                    <KanbanCard key={card.id} id={card.id}>
                      <KanbanCardTitle>{card.title}</KanbanCardTitle>
                    </KanbanCard>
                  ))}
                  {column.cards.length === 0 && <KanbanColumnEmpty>Drop a card here</KanbanColumnEmpty>}
                </KanbanColumnBody>
              </KanbanColumn>
            ))}
          </KanbanBoard>
        </Kanban>
      </Story>

      <Story
        title="Reorder within a column"
        description="↑ and ↓ on a held card emit a move with `toIndex`, so a single handler covers both cross-column routing and in-column priority."
      >
        <Kanban onCardMove={reorder.onCardMove}>
          <KanbanBoard>
            {reorder.board.map((column) => (
              <KanbanColumn key={column.id} id={column.id} label={column.label}>
                <KanbanColumnHeader>
                  <div className="flex items-center gap-2">
                    <KanbanColumnDot color={column.dotColor} />
                    <KanbanColumnTitle>{column.label}</KanbanColumnTitle>
                    <KanbanColumnCount count={column.cards.length} />
                  </div>
                </KanbanColumnHeader>
                <KanbanColumnBody>
                  {column.cards.map((card, index) => (
                    <KanbanCard key={card.id} id={card.id}>
                      <KanbanCardTitle>
                        {index + 1}. {card.title}
                      </KanbanCardTitle>
                    </KanbanCard>
                  ))}
                </KanbanColumnBody>
              </KanbanColumn>
            ))}
          </KanbanBoard>
        </Kanban>
      </Story>

      <Story
        title="Locked card"
        description="`disabled` takes a card out of the tab order, blocks the grab, and marks it aria-disabled — for cards a workflow rule owns."
      >
        <Kanban onCardMove={locked.onCardMove}>
          <KanbanBoard>
            {locked.board.map((column) => (
              <KanbanColumn key={column.id} id={column.id} label={column.label}>
                <KanbanColumnHeader>
                  <div className="flex items-center gap-2">
                    <KanbanColumnDot color={column.dotColor} />
                    <KanbanColumnTitle>{column.label}</KanbanColumnTitle>
                  </div>
                </KanbanColumnHeader>
                <KanbanColumnBody>
                  {column.cards.map((card) => (
                    <KanbanCard key={card.id} id={card.id} disabled={card.id === 'm-2'}>
                      <KanbanCardTitle>{card.title}</KanbanCardTitle>
                      {card.id === 'm-2' && <KanbanCardDescription>Locked by a workflow rule</KanbanCardDescription>}
                    </KanbanCard>
                  ))}
                  {column.cards.length === 0 && <KanbanColumnEmpty>Empty</KanbanColumnEmpty>}
                </KanbanColumnBody>
              </KanbanColumn>
            ))}
          </KanbanBoard>
        </Kanban>
      </Story>

      <Story
        title="Pointer-only cards"
        description="`keyboardDraggable={false}` keeps mouse dragging and drops the keyboard affordance — for boards where a separate control already moves cards."
      >
        <Kanban onCardMove={pointerOnly.onCardMove}>
          <KanbanBoard>
            {pointerOnly.board.map((column) => (
              <KanbanColumn key={column.id} id={column.id} label={column.label}>
                <KanbanColumnHeader>
                  <div className="flex items-center gap-2">
                    <KanbanColumnDot color={column.dotColor} />
                    <KanbanColumnTitle>{column.label}</KanbanColumnTitle>
                  </div>
                </KanbanColumnHeader>
                <KanbanColumnBody>
                  {column.cards.map((card) => (
                    <KanbanCard key={card.id} id={card.id} keyboardDraggable={false}>
                      <KanbanCardTitle>{card.title}</KanbanCardTitle>
                    </KanbanCard>
                  ))}
                  {column.cards.length === 0 && <KanbanColumnEmpty>Empty</KanbanColumnEmpty>}
                </KanbanColumnBody>
              </KanbanColumn>
            ))}
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
        <Kanban onCardMove={wip.onCardMove}>
          <KanbanBoard>
            {wip.board.map((column) => (
              <KanbanColumn key={column.id} id={column.id} label={column.label}>
                <KanbanColumnHeader>
                  <div className="flex items-center gap-2">
                    <KanbanColumnDot color={column.dotColor} />
                    <KanbanColumnTitle>{column.label}</KanbanColumnTitle>
                    <KanbanColumnCount
                      className={column.cards.length > WIP_LIMIT ? 'bg-destructive/10 text-destructive' : undefined}
                    >
                      {column.cards.length} / {WIP_LIMIT}
                    </KanbanColumnCount>
                  </div>
                </KanbanColumnHeader>
                <KanbanColumnBody>
                  {column.cards.map((card) => (
                    <KanbanCard key={card.id} id={card.id}>
                      <KanbanCardTitle>{card.title}</KanbanCardTitle>
                    </KanbanCard>
                  ))}
                  {column.cards.length === 0 && <KanbanColumnEmpty>Empty</KanbanColumnEmpty>}
                </KanbanColumnBody>
              </KanbanColumn>
            ))}
          </KanbanBoard>
        </Kanban>
      </Story>

      <Story
        title="Compact cards"
        description="Title-only cards for dense boards. The card is a container — everything inside it is yours."
      >
        <Kanban onCardMove={compact.onCardMove}>
          <KanbanBoard>
            {compact.board.map((column) => (
              <KanbanColumn key={column.id} id={column.id} label={column.label} className="min-h-[180px] w-56 p-2">
                <KanbanColumnHeader>
                  <KanbanColumnTitle className="text-xs">{column.label}</KanbanColumnTitle>
                  <KanbanColumnCount count={column.cards.length} />
                </KanbanColumnHeader>
                <KanbanColumnBody>
                  {column.cards.map((card) => (
                    <KanbanCard key={card.id} id={card.id} className="gap-0 p-2">
                      <KanbanCardTitle className="text-xs">{card.title}</KanbanCardTitle>
                    </KanbanCard>
                  ))}
                </KanbanColumnBody>
              </KanbanColumn>
            ))}
          </KanbanBoard>
        </Kanban>
      </Story>

      <Story
        title="Scrolling board"
        description="`KanbanBoard` scrolls horizontally once the columns outrun the viewport; each column keeps its own vertical scroll."
      >
        <Kanban onCardMove={scrolling.onCardMove}>
          <KanbanBoard className="max-w-full">
            {scrolling.board.map((column) => (
              <KanbanColumn key={column.id} id={column.id} label={column.label}>
                <KanbanColumnHeader>
                  <div className="flex items-center gap-2">
                    <KanbanColumnDot color={column.dotColor} />
                    <KanbanColumnTitle>{column.label}</KanbanColumnTitle>
                    <KanbanColumnCount count={column.cards.length} />
                  </div>
                </KanbanColumnHeader>
                <KanbanColumnBody>
                  {column.cards.map((card) => (
                    <KanbanCard key={card.id} id={card.id}>
                      <KanbanCardTitle>{card.title}</KanbanCardTitle>
                    </KanbanCard>
                  ))}
                  {column.cards.length === 0 && <KanbanColumnEmpty>Empty</KanbanColumnEmpty>}
                </KanbanColumnBody>
              </KanbanColumn>
            ))}
          </KanbanBoard>
        </Kanban>
      </Story>

      <Story
        title="Column accents"
        description="`KanbanColumnDot` takes any background utility, so columns can carry the same status colours as the rest of the app."
      >
        <Kanban>
          <KanbanBoard>
            {[
              { id: 'a-1', label: 'Triage', dotColor: 'bg-slate-400' },
              { id: 'a-2', label: 'At risk', dotColor: 'bg-rose-500' },
              { id: 'a-3', label: 'On track', dotColor: 'bg-emerald-500' },
            ].map((column) => (
              <KanbanColumn key={column.id} id={column.id} label={column.label} className="min-h-[140px]">
                <KanbanColumnHeader>
                  <div className="flex items-center gap-2">
                    <KanbanColumnDot color={column.dotColor} />
                    <KanbanColumnTitle>{column.label}</KanbanColumnTitle>
                  </div>
                </KanbanColumnHeader>
                <KanbanColumnBody>
                  <KanbanColumnEmpty>No cards</KanbanColumnEmpty>
                </KanbanColumnBody>
              </KanbanColumn>
            ))}
          </KanbanBoard>
        </Kanban>
      </Story>
    </>
  )
}
