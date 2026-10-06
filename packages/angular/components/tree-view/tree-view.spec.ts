import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiTreeViewComponent, UiTreeViewNodeComponent } from './tree-view.component'

const here = dirname(fileURLToPath(import.meta.url))
const src = readFileSync(resolve(here, './tree-view.component.ts'), 'utf8')
const items = [{ id: 'p', label: 'Parent', children: [{ id: 'c', label: 'Child' }] }]

describe('TreeView (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(src).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (icons on, no checkboxes)', () => {
    const c = new UiTreeViewComponent()
    expect(c.showIcons).toBe(true)
    expect(c.showCheckboxes).toBe(false)
    expect(c.defaultExpanded).toBe(false)
    expect(c.selectedId).toBeNull()
  })
  it('3: toggle expands + emits', () => {
    const c = new UiTreeViewComponent()
    c.items = items
    let got: string | null = null
    c.toggle.subscribe((v: { id: string }) => (got = v.id))
    c.toggleItem(items[0]!)
    expect(c.isExpanded('p')).toBe(true)
    expect(got).toBe('p')
  })
  it('4: disabled nodes do not toggle', () => {
    const c = new UiTreeViewComponent()
    c.toggleItem({ id: 'x', label: 'X', disabled: true })
    expect(c.isExpanded('x')).toBe(false)
  })
  it('5: select sets selectedId + emits', () => {
    const c = new UiTreeViewComponent()
    let got: string | null = null
    c.select.subscribe((v: { id: string }) => (got = v.id))
    c.selectItem({ id: 'c', label: 'Child' })
    expect(c.selectedId).toBe('c')
    expect(got).toBe('c')
  })
  it('6: checkbox toggle tracks checked ids', () => {
    const c = new UiTreeViewComponent()
    c.toggleCheck({ id: 'c', label: 'Child' })
    expect(c.checkedIds.has('c')).toBe(true)
    c.toggleCheck({ id: 'c', label: 'Child' })
    expect(c.checkedIds.has('c')).toBe(false)
  })
  it('7: keyboard Enter selects', () => {
    const c = new UiTreeViewComponent()
    let fired = false
    c.select.subscribe(() => (fired = true))
    c.onKeydown({ key: 'Enter', preventDefault: () => {} } as KeyboardEvent, { id: 'c', label: 'Child' }, false)
    expect(fired).toBe(true)
  })
  it('8: keyboard arrows expand/collapse', () => {
    const c = new UiTreeViewComponent()
    c.items = items
    const item = items[0]!
    c.onKeydown({ key: 'ArrowRight', preventDefault: () => {} } as KeyboardEvent, item, true)
    expect(c.isExpanded('p')).toBe(true)
    c.onKeydown({ key: 'ArrowLeft', preventDefault: () => {} } as KeyboardEvent, item, true)
    expect(c.isExpanded('p')).toBe(false)
  })
  it('9: node indent scales with depth', () => {
    const n = new UiTreeViewNodeComponent()
    n.depth = 2
    expect(n.indentStyle()).toEqual({ 'padding-left': '48px' })
  })
  it('10: data-slot contracts + tree role', () => {
    expect(src).toContain('"tree-view"')
    expect(src).toContain('"tree-view-node"')
    expect(src).toContain('"tree"')
  })
})
