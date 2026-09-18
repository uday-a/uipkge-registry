import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Calendar } from '../index'

function mountCalendar() {
  return mount(
    {
      template: '<Calendar />',
      components: { Calendar },
    },
    { attachTo: document.body },
  )
}

describe('Calendar', () => {
  it('renders with data-slot="calendar"', () => {
    const w = mountCalendar()
    expect(w.find('[data-slot="calendar"]').exists()).toBe(true)
    w.unmount()
  })

  it('has data-uipkge', () => {
    const w = mountCalendar()
    expect(w.find('[data-slot="calendar"]').attributes('data-uipkge')).toBeDefined()
    w.unmount()
  })

  it('renders a grid with dates', () => {
    const w = mountCalendar()
    expect(w.find('[data-slot="calendar-grid"]').exists()).toBe(true)
    expect(w.findAll('[data-slot="calendar-cell-trigger"]').length).toBeGreaterThan(0)
    w.unmount()
  })

  it('renders weekday headers', () => {
    const w = mountCalendar()
    expect(w.find('[data-slot="calendar-grid-head"]').exists()).toBe(true)
    expect(w.findAll('[data-slot="calendar-head-cell"]').length).toBeGreaterThan(0)
    w.unmount()
  })

  it('has navigation buttons (prev/next)', () => {
    const w = mountCalendar()
    expect(w.find('[data-slot="calendar-prev-button"]').exists()).toBe(true)
    expect(w.find('[data-slot="calendar-next-button"]').exists()).toBe(true)
    w.unmount()
  })

  it('renders current month/year heading', () => {
    const w = mountCalendar()
    expect(w.find('[data-slot="calendar-heading"]').exists()).toBe(true)
    expect(w.find('[data-slot="calendar-heading"]').text().trim().length).toBeGreaterThan(0)
    w.unmount()
  })

  it('renders without crashing with default props', () => {
    const w = mountCalendar()
    expect(w.find('[data-slot="calendar"]').exists()).toBe(true)
    expect(w.find('[data-slot="calendar-header"]').exists()).toBe(true)
    w.unmount()
  })

  it('renders calendar grid body with rows', () => {
    const w = mountCalendar()
    expect(w.find('[data-slot="calendar-grid-body"]').exists()).toBe(true)
    expect(w.findAll('[data-slot="calendar-grid-row"]').length).toBeGreaterThan(0)
    w.unmount()
  })
})
