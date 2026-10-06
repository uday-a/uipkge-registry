import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiGanttComponent, UiGanttContextMenuComponent } from './gantt.component'

const here = dirname(fileURLToPath(import.meta.url))
const angularSrc = readFileSync(resolve(here, './gantt.component.ts'), 'utf8')

describe('Gantt (angular parity, 11 checks)', () => {
  it('1: types file is byte-identical to Vue copy', () => {
    const a = readFileSync(resolve(here, './types.ts'), 'utf8')
    const v = readFileSync(resolve(here, '../../../registry-vue/components/gantt/types.ts'), 'utf8')
    expect(a).toBe(v)
  })
  it('2: component is standalone', () => {
    expect(angularSrc).toContain('standalone: true')
  })
  it('3: defaults mirror React/Vue (day / 40 / 48 / 280)', () => {
    const c = new UiGanttComponent()
    expect(c.currentScale).toBe('day')
    expect(c.rowHeight).toBe(40)
    expect(c.headerHeight).toBe(48)
    expect(c.treeWidth).toBe(280)
  })
  it('4: host has rounded-xl border', () => {
    expect(new UiGanttComponent().hostClass).toContain('rounded-xl border')
  })
  it('5: setScale emits scaleChange', () => {
    const c = new UiGanttComponent()
    let emitted: unknown
    c.scaleChange.subscribe((v) => (emitted = v))
    c.setScale('week')
    expect(c.currentScale).toBe('week')
    expect(emitted).toBe('week')
  })
  it('6: taskClick emits task', () => {
    const c = new UiGanttComponent()
    let clicked: unknown
    c.taskClick.subscribe((v) => (clicked = v))
    c.onTaskClick({ id: '1', name: 'Task 1', startDate: '2026-01-01', endDate: '2026-01-02' })
    expect(clicked).toEqual({ id: '1', name: 'Task 1', startDate: '2026-01-01', endDate: '2026-01-02' })
  })
  it('7: bar math stays in 0-100', () => {
    const c = new UiGanttComponent()
    c.startDate = '2026-01-01'
    c.endDate = '2026-02-01'
    const left = c.barLeft({ startDate: '2026-01-15' } as never)
    expect(left).toBeGreaterThanOrEqual(0)
    expect(left).toBeLessThanOrEqual(100)
  })
  it('8: bar width has 2% minimum', () => {
    const c = new UiGanttComponent()
    c.startDate = '2026-01-01'
    c.endDate = '2026-12-31'
    expect(c.barWidth({ startDate: '2026-01-01', endDate: '2026-01-01' } as never)).toBeGreaterThanOrEqual(2)
  })
  it('9: custom class merges', () => {
    const c = new UiGanttComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
  })
  it('10: data-slot gantt contracts present', () => {
    for (const slot of [
      '"gantt"',
      '"gantt-header"',
      '"gantt-tree"',
      '"gantt-timeline"',
      'gantt-bar',
      '"gantt-milestone"',
      '"gantt-context-menu"',
    ]) {
      expect(angularSrc).toContain(slot)
    }
  })
  it('11: context menu mirrors React outputs (edit/status/priority/duplicate/delete)', () => {
    expect(angularSrc).toContain('UiGanttContextMenuComponent')
    const c = new UiGanttContextMenuComponent()
    const seen: Record<string, unknown> = {}
    c.edit.subscribe((v) => (seen['edit'] = v))
    c.statusChange.subscribe((v) => (seen['status'] = v))
    c.priorityChange.subscribe((v) => (seen['priority'] = v))
    c.duplicate.subscribe((v) => (seen['duplicate'] = v))
    c.deleteTask.subscribe((v) => (seen['delete'] = v))
    const task = { id: 't1', name: 'Task', startDate: '2026-01-01', endDate: '2026-01-02' } as never
    c.task = task
    c.edit.emit(task)
    c.statusChange.emit({ task, status: 'done' })
    c.priorityChange.emit({ task, priority: 'high' })
    c.duplicate.emit(task)
    c.deleteTask.emit(task)
    expect(seen['edit']).toBe(task)
    expect(seen['status']).toEqual({ task, status: 'done' })
    expect(seen['priority']).toEqual({ task, priority: 'high' })
    expect(seen['duplicate']).toBe(task)
    expect(seen['delete']).toBe(task)
  })
})
