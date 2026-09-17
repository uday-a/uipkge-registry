import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KanbanBoard from '../KanbanBoard.vue'

const columns = [
  {
    id: 'todo',
    title: 'Todo',
    color: 'text-muted-foreground',
    dotColor: 'bg-muted-foreground',
    tasks: [
      {
        id: '1',
        title: 'Task 1',
        priority: 'medium' as const,
        assignee: { name: 'Alex', color: 'bg-chart-1' },
        tags: [{ label: 'design', color: 'bg-chart-2' }],
        subtaskIds: [],
        commentItems: [],
        fileItems: [],
      },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    color: 'text-muted-foreground',
    dotColor: 'bg-muted-foreground',
    tasks: [],
  },
]

describe('KanbanBoard', () => {
  it('renders without crashing', () => {
    const w = mount(KanbanBoard, { props: { columns }, attachTo: document.body })
    expect(w.find('[data-slot="kanban-board"]').exists()).toBe(true)
    w.unmount()
  })

  it('renders board title', () => {
    const w = mount(KanbanBoard, { props: { columns }, attachTo: document.body })
    expect(w.text()).toContain('Kanban Board')
    w.unmount()
  })

  it('renders columns', () => {
    const w = mount(KanbanBoard, { props: { columns }, attachTo: document.body })
    expect(w.text()).toContain('Todo')
    expect(w.text()).toContain('Done')
    w.unmount()
  })

  it('renders cards', () => {
    const w = mount(KanbanBoard, { props: { columns }, attachTo: document.body })
    expect(w.text()).toContain('Task 1')
    w.unmount()
  })

  it('has Add Task button', () => {
    const w = mount(KanbanBoard, { props: { columns }, attachTo: document.body })
    const addBtn = w.findAll('button').find((b) => b.text().includes('Add Task'))
    expect(addBtn).toBeTruthy()
    w.unmount()
  })

  it('has toolbar with search', () => {
    const w = mount(KanbanBoard, { props: { columns }, attachTo: document.body })
    const input = w.find('input')
    expect(input.exists()).toBe(true)
    w.unmount()
  })

  it('renders task count badge', () => {
    const w = mount(KanbanBoard, { props: { columns }, attachTo: document.body })
    expect(w.text()).toContain('tasks')
    w.unmount()
  })
})
