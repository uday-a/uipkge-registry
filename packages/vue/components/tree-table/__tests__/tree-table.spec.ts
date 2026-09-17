import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { TreeTable } from '../index'
import type { TreeTableColumn, TreeTableRow } from '../types'

const rows: TreeTableRow[] = [
  {
    id: '1',
    name: 'Root 1',
    children: [
      { id: '1-1', name: 'Child 1-1' },
      { id: '1-2', name: 'Child 1-2' },
    ],
  },
  { id: '2', name: 'Root 2' },
]

const columns: TreeTableColumn[] = [{ key: 'name', label: 'Name' }]

function mountTreeTable(props: Record<string, unknown> = {}) {
  return mount(TreeTable, {
    props: {
      data: props.data ?? rows,
      columns: props.columns ?? columns,
      defaultExpanded: props.defaultExpanded ?? false,
      selectable: props.selectable ?? false,
      ...props,
    },
    attachTo: document.body,
  })
}

describe('TreeTable', () => {
  it('renders container with data-slot="tree-table"', () => {
    const w = mountTreeTable()
    expect(w.find('[data-slot="tree-table"]').exists()).toBe(true)
    w.unmount()
  })

  it('has data-uipkge on container', () => {
    const w = mountTreeTable()
    expect(w.find('[data-slot="tree-table"]').attributes('data-uipkge')).toBeDefined()
    w.unmount()
  })

  it('renders table rows for top-level data', () => {
    const w = mountTreeTable()
    expect(w.findAll('[data-tree-row]').length).toBe(2)
    w.unmount()
  })

  it('renders column headers', () => {
    const w = mountTreeTable()
    expect(w.text()).toContain('Name')
    w.unmount()
  })

  it('expands children when defaultExpanded is true', () => {
    const w = mountTreeTable({ defaultExpanded: true })
    expect(w.findAll('[data-tree-row]').length).toBe(4)
    w.unmount()
  })

  it('toggles expansion on expand button click', async () => {
    const w = mountTreeTable()
    expect(w.findAll('[data-tree-row]').length).toBe(2)
    const expandBtn = w.find('[data-tree-row] button[aria-label="Expand"]')
    await expandBtn.trigger('click')
    expect(w.findAll('[data-tree-row]').length).toBe(4)
    w.unmount()
  })

  it('renders empty state when data is empty', () => {
    const w = mountTreeTable({ data: [] })
    expect(w.text()).toContain('No data.')
    w.unmount()
  })
})
