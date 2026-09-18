import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../table'

function renderTable() {
  return render(
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Age</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Alice</TableCell>
          <TableCell>30</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Bob</TableCell>
          <TableCell>25</TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  )
}

describe('Table', () => {
  it('renders table element with data-slot="table"', () => {
    const { container } = renderTable()
    expect(container.querySelector('table[data-slot="table"]')).toBeTruthy()
  })

  it('has data-uipkge on table element', () => {
    const { container } = renderTable()
    expect(container.querySelector('[data-slot="table"]')?.hasAttribute('data-uipkge')).toBe(true)
  })

  it('renders table container with data-slot="table-container"', () => {
    const { container } = renderTable()
    expect(container.querySelector('[data-slot="table-container"]')).toBeTruthy()
  })

  it('TableHeader has data-slot="table-header"', () => {
    const { container } = renderTable()
    expect(container.querySelector('thead[data-slot="table-header"]')).toBeTruthy()
  })

  it('TableBody has data-slot="table-body"', () => {
    const { container } = renderTable()
    expect(container.querySelector('tbody[data-slot="table-body"]')).toBeTruthy()
  })

  it('TableRow has data-slot="table-row"', () => {
    const { container } = renderTable()
    expect(container.querySelectorAll('tr[data-slot="table-row"]').length).toBe(3)
  })

  it('TableHead has data-slot="table-head" and renders header cells', () => {
    const { container } = renderTable()
    const heads = container.querySelectorAll('th[data-slot="table-head"]')
    expect(heads.length).toBe(2)
    expect(heads[0].textContent).toContain('Name')
  })

  it('TableCell has data-slot="table-cell" and renders body cells', () => {
    const { container } = renderTable()
    const cells = container.querySelectorAll('td[data-slot="table-cell"]')
    expect(cells.length).toBe(4)
    expect(cells[0].textContent).toContain('Alice')
  })

  it('all sub-components have data-uipkge', () => {
    const { container } = renderTable()
    expect(container.querySelector('[data-slot="table-header"]')?.hasAttribute('data-uipkge')).toBe(true)
    expect(container.querySelector('[data-slot="table-body"]')?.hasAttribute('data-uipkge')).toBe(true)
    expect(container.querySelector('[data-slot="table-row"]')?.hasAttribute('data-uipkge')).toBe(true)
    expect(container.querySelector('[data-slot="table-head"]')?.hasAttribute('data-uipkge')).toBe(true)
    expect(container.querySelector('[data-slot="table-cell"]')?.hasAttribute('data-uipkge')).toBe(true)
  })
})
