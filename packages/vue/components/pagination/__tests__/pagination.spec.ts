import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Pagination } from '../index'

function mountPagination(props: Record<string, unknown> = {}) {
  return mount(Pagination, {
    props: { total: 100, itemsPerPage: 10, ...props },
    slots: { default: 'Page content' },
    attachTo: document.body,
  })
}

describe('Pagination', () => {
  it('renders with data-slot="pagination"', () => {
    const w = mountPagination()
    expect(w.find('[data-slot="pagination"]').exists()).toBe(true)
    w.unmount()
  })

  it('has data-uipkge', () => {
    const w = mountPagination()
    expect(w.find('[data-slot="pagination"]').attributes('data-uipkge')).toBeDefined()
    w.unmount()
  })

  it('renders a nav element', () => {
    const w = mountPagination()
    const nav = w.find('[data-slot="pagination"]')
    expect(nav.element.tagName.toLowerCase()).toBe('nav')
    w.unmount()
  })

  it('has aria-label="Pagination" by default', () => {
    const w = mountPagination()
    expect(w.find('[data-slot="pagination"]').attributes('aria-label')).toBe('Pagination')
    w.unmount()
  })

  it('accepts custom aria-label', () => {
    const w = mountPagination({ ariaLabel: 'Custom Pagination' })
    expect(w.find('[data-slot="pagination"]').attributes('aria-label')).toBe('Custom Pagination')
    w.unmount()
  })

  it('renders slot content', () => {
    const w = mountPagination()
    expect(w.text()).toContain('Page content')
    w.unmount()
  })
})
