// @vitest-environment jsdom

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiDataTableComponent, UiDataTableColumnHeaderComponent } from './data-table.component'

const here = dirname(fileURLToPath(import.meta.url))
const src = readFileSync(resolve(here, './data-table.component.ts'), 'utf8')
const cols = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'age', label: 'Age', sortable: true },
]
const rows = [
  { name: 'Bob', age: 30 },
  { name: 'Amy', age: 25 },
  { name: 'Zed', age: 40 },
]

describe('DataTable (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(src).toContain('standalone: true')
  })
  it('2: defaults mirror React/Vue (search + pagination on, visibility off)', () => {
    const c = new UiDataTableComponent()
    expect(c.enableSearch).toBe(true)
    expect(c.enableColumnVisibility).toBe(false)
    expect(c.enablePagination).toBe(true)
    expect(c.hideToolbar).toBe(false)
    expect(c.enableExport).toBe(false)
    expect(c.pageSize).toBe(10)
  })
  it('3: search filters across columns', () => {
    const c = new UiDataTableComponent()
    c.columns = cols
    c.data = rows
    c.search = 'am'
    expect(c.filteredData().map((r) => r['name'])).toEqual(['Amy'])
  })
  it('4: filterColumn scopes search', () => {
    const c = new UiDataTableComponent()
    c.columns = cols
    c.data = rows
    c.filterColumn = 'age'
    c.search = 'bob'
    expect(c.filteredData()).toEqual([])
  })
  it('5: sorting asc then desc on repeat', () => {
    const c = new UiDataTableComponent()
    c.columns = cols
    c.data = rows
    c.setSort('age')
    expect(c.sortedData()[0]!['name']).toBe('Amy')
    c.setSort('age')
    expect(c.sortedData()[0]!['name']).toBe('Zed')
  })
  it('6: pagination slices pages', () => {
    const c = new UiDataTableComponent()
    c.columns = cols
    c.data = rows
    c.pageSize = 2
    c.page = 1
    expect(c.pagedData().length).toBe(1)
    expect(c.totalPages()).toBe(2)
  })
  it('7: gotoPage clamps to range', () => {
    const c = new UiDataTableComponent()
    c.columns = cols
    c.data = rows
    c.pageSize = 2
    const seen: number[] = []
    c.pageChange.subscribe((v: number) => seen.push(v))
    c.gotoPage(99)
    c.gotoPage(-5)
    expect(seen).toEqual([1, 0])
  })
  it('8: hidden columns drop from export', () => {
    const c = new UiDataTableComponent()
    c.columns = cols
    c.data = rows
    c.hiddenColumns = ['age']
    expect(c.visibleColumns().map((x) => x.key)).toEqual(['name'])
    expect(c.exportCsv().split('\n')[0]).toBe('"Name"')
  })
  it('9: csv escapes quotes', () => {
    const c = new UiDataTableComponent()
    c.columns = [{ key: 'name', label: 'Name' }]
    c.data = [{ name: 'Say "hi"' }]
    expect(c.exportCsv()).toContain('"Say ""hi"""')
  })
  it('ariaSort reports the active sort for aria-sort on sortable header cells', () => {
    // Screen readers announce sort only from aria-sort on the column header.
    const c = new UiDataTableComponent()
    c.columns = cols
    c.data = rows
    expect(c.ariaSort('name')).toBe('none')
    c.setSort('name')
    expect(c.ariaSort('name')).toBe('ascending')
    expect(c.ariaSort('age')).toBe('none')
    c.setSort('name')
    expect(c.ariaSort('name')).toBe('descending')
  })

  it('10: data-slot contracts + header aligns', () => {
    expect(src).toContain('"data-table"')
    expect(src).toContain('"data-table-column-header"')
    const h = new UiDataTableColumnHeaderComponent()
    h.align = 'right'
    expect(h.hostClass).toContain('justify-end')
  })

  it('column header shows its label, or your own content instead', async () => {
    // `label` used to be required yet never rendered, so <th ui-data-table-column-header label="Amount"> came out blank.
    const { TestBed } = await import('@angular/core/testing')
    const plain = TestBed.createComponent(UiDataTableColumnHeaderComponent)
    plain.componentRef.setInput('label', 'Amount')
    plain.detectChanges()
    expect(plain.nativeElement.textContent.trim()).toBe('Amount')
  })
})
