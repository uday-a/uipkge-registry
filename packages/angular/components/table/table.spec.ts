import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  UiTableComponent,
  UiTableBodyComponent,
  UiTableCellComponent,
  UiTableEmptyComponent,
  UiTableHeadComponent,
  UiTableRowComponent,
  tableDensityClass,
} from './table.component'

const here = dirname(fileURLToPath(import.meta.url))
const src = readFileSync(resolve(here, './table.component.ts'), 'utf8')

describe('Table (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(src).toContain('standalone: true')
  })
  it('2: container carries scroll chrome', () => {
    expect(new UiTableComponent().hostClass).toContain('overflow-auto')
  })
  it('3: inner table keeps caption-bottom + text-sm', () => {
    const c = new UiTableComponent()
    expect(c.tableClass).toContain('caption-bottom')
    expect(c.tableClass).toContain('text-sm')
  })
  it('4: cozy density adds no override (Vue baseline)', () => {
    expect(tableDensityClass('cozy')).toBe('')
    expect(new UiTableComponent().tableClass).not.toContain('[&_td]:py-1.5')
  })
  it('5: compact density tightens cells', () => {
    const c = new UiTableComponent()
    c.density = 'compact'
    expect(c.tableClass).toContain('[&_td]:py-1.5')
  })
  it('6: comfortable density loosens cells', () => {
    expect(tableDensityClass('comfortable')).toContain('[&_td]:py-3')
  })
  it('7: body strips last-row border like Vue', () => {
    expect(new UiTableBodyComponent().hostClass).toContain('[&_tr:last-child]:border-0')
  })
  it('8: row has hover + selected states', () => {
    const r = new UiTableRowComponent().hostClass
    expect(r).toContain('hover:bg-muted/50')
    expect(r).toContain('data-[state=selected]')
  })
  it('9: head + cell keep checkbox affordances', () => {
    expect(new UiTableHeadComponent().hostClass).toContain('[role=checkbox]')
    expect(new UiTableCellComponent().hostClass).toContain('[role=checkbox]')
  })
  it('10: data-slot contracts + custom class + empty colspan', () => {
    for (const s of [
      '"table-container"',
      '"table-header"',
      '"table-body"',
      '"table-row"',
      '"table-cell"',
      '"table-caption"',
      '"table-empty"',
    ]) {
      expect(src).toContain(s)
    }
    const c = new UiTableComponent()
    c.className = 'custom-class'
    expect(c.tableClass).toContain('custom-class')
    // Empty renders a real row > spanning cell like React/Vue (colspan default 1).
    const e = new UiTableEmptyComponent()
    expect(e.colSpan).toBe(1)
    expect(e.cellClass).toContain('text-foreground')
    // The <tr ui-table-empty> host IS the row, so it must carry the row classes itself.
    expect(e.hostClass).toContain('table-row')
    expect(e.hostClass).toContain('border-b')
  })
})
