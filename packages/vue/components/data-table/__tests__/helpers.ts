import { mount, type VueWrapper, flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import DataTable from '../DataTable.vue'
import { employees, plainColumns, sortableColumns, filters, type Employee } from './fixtures'

export async function mountTable(props: Record<string, unknown> = {}) {
  const wrapper = mount(DataTable as any, {
    props: {
      columns: plainColumns as ColumnDef<Employee, unknown>[],
      data: employees,
      ...props,
    },
    attachTo: document.body,
  })
  await flushPromises()
  await nextTick()
  await new Promise((r) => setTimeout(r, 10))
  await flushPromises()
  return wrapper
}

export async function mountSortable(props: Record<string, unknown> = {}) {
  return mountTable({
    columns: sortableColumns as ColumnDef<Employee, unknown>[],
    filterColumn: 'email',
    filterPlaceholder: 'Search by email…',
    filters,
    enableColumnVisibility: true,
    ...props,
  })
}

export function bodyTexts(wrapper: VueWrapper): string[] {
  return wrapper.findAll('[data-slot="data-table"] tbody tr').map((r) => r.text())
}

export function rowCount(wrapper: VueWrapper): number {
  const tbody = wrapper.find('[data-slot="data-table"] tbody')
  if (!tbody.exists()) return 0
  if (tbody.text().includes('No results')) return 0
  return wrapper.findAll('[data-slot="data-table"] tbody tr').length
}

export async function typeSearch(wrapper: VueWrapper, value: string) {
  const search = wrapper.find(
    'input[placeholder*="Search"], input[placeholder*="Filter"], input[placeholder*="email"], input[placeholder*="Search by"]',
  )
  if (!search.exists()) throw new Error('search input not found')
  await search.setValue(value)
  await flushPromises()
  await nextTick()
  await new Promise((r) => setTimeout(r, 50))
  await flushPromises()
}

export function root(wrapper: VueWrapper) {
  return wrapper.find('[data-slot="data-table"]')
}

export function namesInOrder(wrapper: VueWrapper): string[] {
  return bodyTexts(wrapper)
    .map((t) => employees.find((e) => t.includes(e.name))?.name ?? '')
    .filter(Boolean)
}

export async function clickButtonByText(wrapper: VueWrapper, text: string) {
  const btn = wrapper.findAll('button').find((b) => b.text().includes(text))
  if (!btn) throw new Error('button not found: ' + text)
  await btn.trigger('click')
  await flushPromises()
  await nextTick()
}

export function exposedTable(wrapper: VueWrapper): any {
  return (wrapper.vm as any).table
}
