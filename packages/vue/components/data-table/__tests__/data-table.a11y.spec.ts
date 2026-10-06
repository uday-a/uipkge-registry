import { describe, it, expect } from 'vitest'
import { mountSortable, mountTable, clickButtonByText } from './helpers'

// Screen readers read the active sort from aria-sort on the <th>, not the inner
// button, so the header cell itself must carry it.
function headerCell(w: Awaited<ReturnType<typeof mountTable>>, label: string) {
  const th = w.findAll('[data-slot="data-table"] thead th').find((h) => h.text().includes(label))
  if (!th) throw new Error('header not found: ' + label)
  return th
}

describe('DataTable header a11y', () => {
  it('header cells are column-scoped', async () => {
    const w = await mountSortable()
    const ths = w.findAll('[data-slot="data-table"] thead th')
    expect(ths.length).toBeGreaterThan(0)
    expect(ths.every((th) => th.attributes('scope') === 'col')).toBe(true)
    w.unmount()
  })

  it('aria-sort cycles none → ascending → descending → none on the th', async () => {
    const w = await mountSortable({ enablePagination: false })
    expect(headerCell(w, 'Name').attributes('aria-sort')).toBe('none')
    await clickButtonByText(w, 'Name')
    expect(headerCell(w, 'Name').attributes('aria-sort')).toBe('ascending')
    await clickButtonByText(w, 'Name')
    expect(headerCell(w, 'Name').attributes('aria-sort')).toBe('descending')
    await clickButtonByText(w, 'Name')
    expect(headerCell(w, 'Name').attributes('aria-sort')).toBe('none')
    // Only the header cell announces it — not the inner sort button.
    expect(headerCell(w, 'Name').find('button[aria-sort]').exists()).toBe(false)
    w.unmount()
  })

  it('non-sortable columns carry no aria-sort', async () => {
    const w = await mountSortable()
    const selectTh = w.find('[data-slot="data-table"] thead th input[aria-label="Select all rows"]').element.closest('th')
    expect(selectTh?.hasAttribute('aria-sort')).toBe(false)
    w.unmount()
  })
})
