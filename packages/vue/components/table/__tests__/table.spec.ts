import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../index'

function mountTable() {
  return mount(
    {
      components: { Table, TableHeader, TableBody, TableRow, TableHead, TableCell },
      template: `
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
        </Table>
      `,
    },
    { attachTo: document.body },
  )
}

describe('Table', () => {
  it('renders table element with data-slot="table"', () => {
    const w = mountTable()
    expect(w.find('table[data-slot="table"]').exists()).toBe(true)
    w.unmount()
  })

  it('has data-uipkge on table element', () => {
    const w = mountTable()
    expect(w.find('[data-slot="table"]').attributes('data-uipkge')).toBeDefined()
    w.unmount()
  })

  it('renders table container with data-slot="table-container"', () => {
    const w = mountTable()
    expect(w.find('[data-slot="table-container"]').exists()).toBe(true)
    w.unmount()
  })

  it('TableHeader has data-slot="table-header"', () => {
    const w = mountTable()
    expect(w.find('thead[data-slot="table-header"]').exists()).toBe(true)
    w.unmount()
  })

  it('TableBody has data-slot="table-body"', () => {
    const w = mountTable()
    expect(w.find('tbody[data-slot="table-body"]').exists()).toBe(true)
    w.unmount()
  })

  it('TableRow has data-slot="table-row"', () => {
    const w = mountTable()
    expect(w.findAll('tr[data-slot="table-row"]').length).toBe(3)
    w.unmount()
  })

  it('TableHead has data-slot="table-head" and renders header cells', () => {
    const w = mountTable()
    const heads = w.findAll('th[data-slot="table-head"]')
    expect(heads.length).toBe(2)
    expect(heads[0].text()).toContain('Name')
    w.unmount()
  })

  it('TableCell has data-slot="table-cell" and renders body cells', () => {
    const w = mountTable()
    const cells = w.findAll('td[data-slot="table-cell"]')
    expect(cells.length).toBe(4)
    expect(cells[0].text()).toContain('Alice')
    w.unmount()
  })

  it('all sub-components have data-uipkge', () => {
    const w = mountTable()
    expect(w.find('[data-slot="table-header"]').attributes('data-uipkge')).toBeDefined()
    expect(w.find('[data-slot="table-body"]').attributes('data-uipkge')).toBeDefined()
    expect(w.find('[data-slot="table-row"]').attributes('data-uipkge')).toBeDefined()
    expect(w.find('[data-slot="table-head"]').attributes('data-uipkge')).toBeDefined()
    expect(w.find('[data-slot="table-cell"]').attributes('data-uipkge')).toBeDefined()
    w.unmount()
  })
})
