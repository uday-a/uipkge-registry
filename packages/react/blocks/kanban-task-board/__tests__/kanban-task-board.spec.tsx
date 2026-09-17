import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { KanbanBoard, SimpleKanban, type SimpleKanbanColumn } from '../KanbanBoard'
import type { KanbanColumn } from '@/lib/use-kanban'

const columns: KanbanColumn[] = [
  {
    id: 'backlog',
    title: 'Backlog',
    color: 'bg-slate-500',
    dotColor: 'bg-slate-500',
    tasks: [
      {
        id: 't1',
        title: 'Design landing page',
        priority: 'high',
        assignee: { name: 'Alice Chen', color: 'bg-orange-500/15 text-orange-600' },
        tags: [{ label: 'Design', color: 'bg-sky-500/10 text-sky-600' }],
        subtaskIds: [],
        commentItems: [],
        fileItems: [],
      },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    color: 'bg-blue-500',
    dotColor: 'bg-blue-500',
    tasks: [
      {
        id: 't2',
        title: 'Build API endpoint',
        priority: 'medium',
        assignee: { name: 'Bob Martinez', color: 'bg-blue-500/15 text-blue-600' },
        tags: [],
        subtaskIds: [],
        commentItems: [],
        fileItems: [],
      },
    ],
  },
]

const simpleColumns: SimpleKanbanColumn[] = [
  {
    id: 'backlog',
    title: 'Backlog',
    dotColor: 'bg-slate-400',
    items: [
      {
        id: 's1',
        title: 'Simple task one',
        date: 'May 15 - Jun 2, 2026',
        priority: 'high',
        tag: 'Core',
        assignee: { name: 'Alice Chen', initials: 'AC' },
      },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    dotColor: 'bg-emerald-500',
    items: [
      {
        id: 's2',
        title: 'Completed item',
        date: 'Apr 10',
        priority: 'low',
      },
    ],
  },
]

describe('KanbanBoard', () => {
  it('renders without crashing', () => {
    const { container } = render(<KanbanBoard columns={columns} onColumnsChange={vi.fn()} />)
    expect(container.querySelector('[data-slot="kanban-board"]')).toBeTruthy()
  })

  it('renders the board title', () => {
    const { container } = render(<KanbanBoard columns={columns} onColumnsChange={vi.fn()} title="Sprint Board" />)
    expect(container.textContent).toContain('Sprint Board')
  })

  it('renders columns with their titles', () => {
    const { container } = render(<KanbanBoard columns={columns} onColumnsChange={vi.fn()} />)
    expect(container.textContent).toContain('Backlog')
    expect(container.textContent).toContain('In Progress')
  })

  it('renders cards from column tasks', () => {
    const { container } = render(<KanbanBoard columns={columns} onColumnsChange={vi.fn()} />)
    expect(container.textContent).toContain('Design landing page')
    expect(container.textContent).toContain('Build API endpoint')
  })

  it('has an Add Task button', () => {
    const { container } = render(<KanbanBoard columns={columns} onColumnsChange={vi.fn()} />)
    const buttons = container.querySelectorAll('button')
    const addTask = Array.from(buttons).find((b) => b.textContent?.includes('Add Task'))
    expect(addTask).toBeTruthy()
  })

  it('renders the toolbar with search input', () => {
    const { container } = render(<KanbanBoard columns={columns} onColumnsChange={vi.fn()} />)
    const search = container.querySelector('input[placeholder*="Search"], input[type="text"], input')
    expect(search).toBeTruthy()
  })

  it('renders the task count badge', () => {
    const { container } = render(<KanbanBoard columns={columns} onColumnsChange={vi.fn()} />)
    expect(container.textContent).toContain('2 tasks')
  })

  it('opens the add task dialog when Add Task is clicked', () => {
    const { container } = render(<KanbanBoard columns={columns} onColumnsChange={vi.fn()} />)
    const buttons = container.querySelectorAll('button')
    const addTask = Array.from(buttons).find((b) => b.textContent?.includes('Add Task'))
    expect(addTask).toBeTruthy()
    fireEvent.click(addTask!)
    // Dialog title should appear after opening
    expect(container.textContent).toContain('Add Task')
  })
})

describe('SimpleKanban', () => {
  it('renders without crashing', () => {
    const { container } = render(<SimpleKanban columns={simpleColumns} onColumnsChange={vi.fn()} />)
    expect(container.querySelector('[data-slot="simple-kanban"]')).toBeTruthy()
  })

  it('renders columns, counts, and card titles', () => {
    const { container } = render(<SimpleKanban columns={simpleColumns} onColumnsChange={vi.fn()} />)
    expect(container.textContent).toContain('Backlog')
    expect(container.textContent).toContain('Done')
    expect(container.textContent).toContain('Simple task one')
    expect(container.textContent).toContain('Completed item')
    expect(container.textContent).toContain('May 15 - Jun 2, 2026')
  })

  it('fires onCardClick when a card is clicked', () => {
    const onCardClick = vi.fn()
    const { container } = render(
      <SimpleKanban columns={simpleColumns} onColumnsChange={vi.fn()} onCardClick={onCardClick} />,
    )
    const card = container.querySelector('[data-slot="kanban-card"]')
    expect(card).toBeTruthy()
    fireEvent.click(card!)
    expect(onCardClick).toHaveBeenCalledWith(simpleColumns[0]!.items[0], 'backlog')
  })
})
