<script lang="ts">
  import {
    Kanban,
    KanbanBoard,
    KanbanCard,
    KanbanCardDescription,
    KanbanCardFooter,
    KanbanCardTitle,
    KanbanColumn,
    KanbanColumnAdd,
    KanbanColumnBody,
    KanbanColumnCount,
    KanbanColumnDot,
    KanbanColumnEmpty,
    KanbanColumnHeader,
    KanbanColumnTitle,
    type KanbanMoveEvent,
  } from '@svelte-registry/kanban'
  import { Calendar } from '@lucide/svelte'

  let { story }: { story: string } = $props()

  interface Task {
    id: string
    title: string
    description?: string
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

  let columns = $state<Column[]>([
    {
      id: 'backlog',
      title: 'Backlog',
      dotColor: 'bg-slate-400',
      tasks: [
        {
          id: 't-1',
          title: 'Audit accessibility on modals',
          description: 'Ensure focus trap, ESC handling, and ARIA labels match WCAG 2.1 AA.',
          tag: 'Design',
          dueDate: 'Sep 2',
          assignee: 'Sarah L.',
        },
        {
          id: 't-2',
          title: 'Document keyboard shortcut spec',
          description: 'Map global hotkeys for search, quick navigation, and command palette.',
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
          tag: 'Core UI',
          dueDate: 'Aug 28',
          assignee: 'Elena R.',
        },
        {
          id: 't-4',
          title: 'OKLCH color system migration',
          description: 'Replace legacy HSL tokens with gamut-mapped OKLCH palette.',
          tag: 'Tokens',
          dueDate: 'Aug 30',
          assignee: 'Marcus K.',
        },
      ],
    },
    {
      id: 'done',
      title: 'Done',
      dotColor: 'bg-emerald-500',
      tasks: [
        {
          id: 't-5',
          title: 'Command palette fuzzy match',
          description: 'Score rankings and highlight matching character substrings.',
          tag: 'Core UI',
          dueDate: 'Aug 20',
          assignee: 'Priya P.',
        },
      ],
    },
  ])

  function handleMove(e: KanbanMoveEvent) {
    const from = columns.find((c) => c.id === e.fromColumnId)
    const to = columns.find((c) => c.id === e.toColumnId)
    if (!from || !to) return
    const idx = from.tasks.findIndex((t) => t.id === e.cardId)
    if (idx === -1) return
    const [task] = from.tasks.splice(idx, 1)
    if (e.toIndex != null && e.fromColumnId === e.toColumnId) {
      to.tasks.splice(e.toIndex, 0, task)
    } else {
      to.tasks.push(task)
    }
    columns = [...columns]
  }

  let lastMove = $state('')
</script>

{#if story === 'Task board'}
  <Kanban
    oncardmove={(e) => {
      handleMove(e)
      lastMove = `${e.cardId}: ${e.fromColumnId} → ${e.toColumnId}`
    }}
  >
    <KanbanBoard>
      {#each columns as column (column.id)}
        <KanbanColumn id={column.id} label={column.title}>
          <KanbanColumnHeader>
            <div class="flex items-center gap-2">
              <KanbanColumnDot color={column.dotColor} />
              <KanbanColumnTitle>{column.title}</KanbanColumnTitle>
              <KanbanColumnCount count={column.tasks.length} />
            </div>
            <KanbanColumnAdd aria-label="Add card to {column.title}" />
          </KanbanColumnHeader>
          <KanbanColumnBody>
            {#each column.tasks as task (task.id)}
              <KanbanCard id={task.id}>
                <KanbanCardTitle>{task.title}</KanbanCardTitle>
                {#if task.description}
                  <KanbanCardDescription>{task.description}</KanbanCardDescription>
                {/if}
                <KanbanCardFooter>
                  <span
                    class="bg-secondary text-secondary-foreground rounded-full px-2 py-0.5 text-[11px] font-medium"
                  >
                    {task.tag}
                  </span>
                  <span class="flex items-center gap-1">
                    <Calendar class="size-3" />
                    {task.dueDate}
                  </span>
                  <span>{task.assignee}</span>
                </KanbanCardFooter>
              </KanbanCard>
            {/each}
            {#if column.tasks.length === 0}
              <KanbanColumnEmpty />
            {/if}
          </KanbanColumnBody>
        </KanbanColumn>
      {/each}
    </KanbanBoard>
  </Kanban>
  {#if lastMove}
    <p class="text-muted-foreground mt-2 text-xs tabular-nums">Last move: {lastMove}</p>
  {/if}
{/if}

{#if story === 'Empty column'}
  <Kanban oncardmove={handleMove}>
    <KanbanBoard>
      <KanbanColumn id="empty" label="Empty">
        <KanbanColumnHeader>
          <div class="flex items-center gap-2">
            <KanbanColumnDot color="bg-slate-400" />
            <KanbanColumnTitle>Empty</KanbanColumnTitle>
            <KanbanColumnCount count={0} />
          </div>
          <KanbanColumnAdd aria-label="Add card" />
        </KanbanColumnHeader>
        <KanbanColumnBody>
          <KanbanColumnEmpty>Drop cards here</KanbanColumnEmpty>
        </KanbanColumnBody>
      </KanbanColumn>
    </KanbanBoard>
  </Kanban>
{/if}
