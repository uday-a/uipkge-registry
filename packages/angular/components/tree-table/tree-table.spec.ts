import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiTreeTableComponent } from './tree-table.component'

const here = dirname(fileURLToPath(import.meta.url))
const src = readFileSync(resolve(here, './tree-table.component.ts'), 'utf8')
const cols = [{ key: 'name', title: 'Name' }]
const data = [
  { id: 'p', data: { name: 'Parent' }, children: [{ id: 'c', data: { name: 'Child' } }] },
  { id: 's', data: { name: 'Solo' } },
]

describe('TreeTable (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(src).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (indent 24, empty text)', () => {
    const c = new UiTreeTableComponent()
    expect(c.indent).toBe(24)
    expect(c.defaultExpanded).toBe(false)
    expect(c.selectable).toBe(false)
    expect(c.loading).toBe(false)
    expect(c.emptyText).toBe('No data.')
  })
  it('3: collapsed hides children', () => {
    const c = new UiTreeTableComponent()
    c.data = data
    c.columns = cols
    expect(c.visibleRows().map((r) => r.row.id)).toEqual(['p', 's'])
  })
  it('4: toggle reveals children with depth', () => {
    const c = new UiTreeTableComponent()
    c.data = data
    c.columns = cols
    c.toggle('p')
    const rows = c.visibleRows()
    expect(rows.map((r) => r.row.id)).toEqual(['p', 'c', 's'])
    expect(rows[1]!.depth).toBe(1)
  })
  it('5: defaultExpanded opens every branch', () => {
    const c = new UiTreeTableComponent()
    c.defaultExpanded = true
    c.data = data
    c.columns = cols
    expect(c.visibleRows().length).toBe(3)
  })
  it('6: expand event reports id + state', () => {
    const c = new UiTreeTableComponent()
    c.data = data
    let got: unknown = null
    c.expand.subscribe((v: unknown) => (got = v))
    c.toggle('p')
    expect(got).toEqual({ id: 'p', expanded: true })
  })
  it('7: indent style scales per depth', () => {
    const c = new UiTreeTableComponent()
    expect(c.indentStyle(2)).toEqual({ 'padding-left': '60px' })
  })
  it('8: selection toggles + emits', () => {
    const c = new UiTreeTableComponent()
    const seen: unknown[] = []
    c.selectedChange.subscribe((v: unknown) => seen.push(v))
    c.toggleSelect('p')
    // Uncontrolled: internal state tracks the toggle (React internalSelected parity).
    expect(c.isSelected('p')).toBe(true)
    c.selected = ['p']
    c.toggleSelect('p')
    expect(seen).toEqual([['p'], []])
  })
  it('9: cell text reads key or render fn', () => {
    const c = new UiTreeTableComponent()
    expect(c.cellText(data[0]!, cols[0]!)).toBe('Parent')
    expect(c.cellText(data[0]!, { key: 'name', title: 'N', render: () => 'R' })).toBe('R')
  })
  it('10: data-slot tree-table + custom class', () => {
    expect(src).toContain('"tree-table"')
    const c = new UiTreeTableComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
  })
})
