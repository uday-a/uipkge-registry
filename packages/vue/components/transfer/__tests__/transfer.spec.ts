import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Transfer } from '../index'

function mountTransfer(props: Record<string, unknown> = {}) {
  return mount(Transfer, {
    props: {
      dataSource: [
        { key: '1', label: 'Item 1' },
        { key: '2', label: 'Item 2' },
      ],
      targetKeys: [],
      ...props,
    },
    attachTo: document.body,
  })
}

describe('Transfer', () => {
  it('renders with data-slot="transfer"', () => {
    const w = mountTransfer()
    expect(w.find('[data-slot="transfer"]').exists()).toBe(true)
    w.unmount()
  })

  it('has data-uipkge', () => {
    const w = mountTransfer()
    expect(w.find('[data-slot="transfer"]').attributes('data-uipkge')).toBeDefined()
    w.unmount()
  })

  it('renders two lists (source and target)', () => {
    const w = mountTransfer()
    expect(w.findAll('ul[role="listbox"]').length).toBe(2)
    w.unmount()
  })

  it('renders titles', () => {
    const w = mountTransfer({ titles: ['Source List', 'Target List'] })
    expect(w.text()).toContain('Source List')
    expect(w.text()).toContain('Target List')
    w.unmount()
  })

  it('renders items from dataSource', () => {
    const w = mountTransfer()
    expect(w.text()).toContain('Item 1')
    expect(w.text()).toContain('Item 2')
    w.unmount()
  })

  it('shows search input when showSearch is true', () => {
    const w = mountTransfer({ showSearch: true })
    expect(w.find('input[aria-label="Search Source"]').exists()).toBe(true)
    w.unmount()
  })

  it('does not show search input when showSearch is false', () => {
    const w = mountTransfer({ showSearch: false })
    expect(w.find('input[aria-label="Search Source"]').exists()).toBe(false)
    w.unmount()
  })

  it('disables when disabled prop is true', () => {
    const w = mountTransfer({ disabled: true })
    const options = w.findAll('[role="option"]')
    expect(options.length).toBeGreaterThan(0)
    options.forEach((opt) => {
      expect(opt.attributes('tabindex')).toBe('-1')
    })
    w.unmount()
  })

  it('renders operation buttons', () => {
    const w = mountTransfer()
    expect(w.find('button[aria-label="Move selected to right"]').exists()).toBe(true)
    expect(w.find('button[aria-label="Move selected to left"]').exists()).toBe(true)
    w.unmount()
  })

  it('renders option rows for source items', () => {
    const w = mountTransfer()
    expect(w.findAll('[role="option"]').length).toBe(2)
    w.unmount()
  })
})
