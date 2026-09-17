import { describe, it, expect } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
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

describe('TreeTable', () => {
  it('renders container with data-slot="tree-table"', () => {
    const { container } = render(<TreeTable data={rows} columns={columns} />)
    expect(container.querySelector('[data-slot="tree-table"]')).toBeTruthy()
  })

  it('has data-uipkge on container', () => {
    const { container } = render(<TreeTable data={rows} columns={columns} />)
    expect(container.querySelector('[data-slot="tree-table"]')?.hasAttribute('data-uipkge')).toBe(true)
  })

  it('renders table rows for top-level data', () => {
    const { container } = render(<TreeTable data={rows} columns={columns} />)
    expect(container.querySelectorAll('[data-tree-row]').length).toBe(2)
  })

  it('renders column headers', () => {
    const { container } = render(<TreeTable data={rows} columns={columns} />)
    expect(container.textContent).toContain('Name')
  })

  it('expands children when defaultExpanded is true', () => {
    const { container } = render(<TreeTable data={rows} columns={columns} defaultExpanded />)
    expect(container.querySelectorAll('[data-tree-row]').length).toBe(4)
  })

  it('toggles expansion on expand button click', () => {
    const { container } = render(<TreeTable data={rows} columns={columns} />)
    expect(container.querySelectorAll('[data-tree-row]').length).toBe(2)
    const expandBtn = container.querySelector('button[aria-label="Expand"]')
    fireEvent.click(expandBtn!)
    expect(container.querySelectorAll('[data-tree-row]').length).toBe(4)
  })

  it('renders empty state when data is empty', () => {
    const { container } = render(<TreeTable data={[]} columns={columns} />)
    expect(container.textContent).toContain('No data.')
  })
})
