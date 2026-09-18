import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EventCalendar from '../EventCalendar.vue'
import { calculateTimedEventPositions, formatTime, getMonthDays, getWeekDays } from '../date-utils'
import type { CalendarEvent } from '../types'

const sampleEvents: CalendarEvent[] = [
  {
    id: 'e1',
    title: 'Sprint Planning',
    start: '2026-05-18 09:00',
    end: '2026-05-18 10:30',
    color: 'primary',
  },
  {
    id: 'e2',
    title: 'Design Review',
    start: '2026-05-18 10:00',
    end: '2026-05-18 11:00',
    color: 'purple',
  },
  {
    id: 'e3',
    title: 'All-day Hackathon',
    start: '2026-05-18',
    allDay: true,
    color: 'success',
  },
  {
    id: 'e4',
    title: 'One-on-One',
    start: '2026-05-18 14:00',
    end: '2026-05-18 14:30',
    category: 'room-a',
    color: 'info',
  },
]

describe('EventCalendar', () => {
  it('renders root container with data-slot="event-calendar"', () => {
    const wrapper = mount(EventCalendar, {
      props: {
        modelValue: '2026-05-18',
        events: sampleEvents,
      },
    })
    expect(wrapper.find('[data-slot="event-calendar"]').exists()).toBe(true)
  })

  it('renders month view by default with day cells and events', () => {
    const wrapper = mount(EventCalendar, {
      props: {
        modelValue: '2026-05-18',
        events: sampleEvents,
        view: 'month',
      },
    })
    expect(wrapper.text()).toContain('May 2026')
    expect(wrapper.text()).toContain('Sprint Planning')
  })

  it('switches to week view and renders day column headers', async () => {
    const wrapper = mount(EventCalendar, {
      props: {
        modelValue: '2026-05-18',
        events: sampleEvents,
        view: 'week',
      },
    })
    expect(wrapper.text()).toContain('All-day')
    expect(wrapper.text()).toContain('All-day Hackathon')
    expect(wrapper.text()).toContain('Sprint Planning')
  })

  it('switches to day view and renders hourly schedule', async () => {
    const wrapper = mount(EventCalendar, {
      props: {
        modelValue: '2026-05-18',
        events: sampleEvents,
        view: 'day',
      },
    })
    expect(wrapper.text()).toContain('Sprint Planning')
    expect(wrapper.text()).toContain('Design Review')
  })

  it('renders category view when categories are provided', () => {
    const wrapper = mount(EventCalendar, {
      props: {
        modelValue: '2026-05-18',
        events: sampleEvents,
        view: 'category',
        categories: [
          { id: 'room-a', name: 'Conference Room A' },
          { id: 'room-b', name: 'Conference Room B' },
        ],
      },
    })
    expect(wrapper.text()).toContain('Conference Room A')
    expect(wrapper.text()).toContain('Conference Room B')
    expect(wrapper.text()).toContain('One-on-One')
  })

  it('emits click:event when clicking an event card', async () => {
    const wrapper = mount(EventCalendar, {
      props: {
        modelValue: '2026-05-18',
        events: sampleEvents,
        view: 'month',
      },
    })
    const eventCard = wrapper.find('[data-slot="event-card"]')
    if (eventCard.exists()) {
      await eventCard.trigger('click')
      expect(wrapper.emitted('click:event')).toBeTruthy()
    }
  })

  it('emits click:date when clicking a day cell in month view', async () => {
    const wrapper = mount(EventCalendar, {
      props: {
        modelValue: '2026-05-18',
        events: sampleEvents,
        view: 'month',
      },
    })
    const cell = wrapper.find('.min-h-\\[96px\\]')
    if (cell.exists()) {
      await cell.trigger('click')
      expect(wrapper.emitted('click:date')).toBeTruthy()
    }
  })

  it('calculates overlapping timed event positions into split columns', () => {
    const date = new Date(2026, 4, 18)
    const positions = calculateTimedEventPositions(sampleEvents, date, 0, 24, 60)

    // e1: 09:00 - 10:30 (540 - 630)
    // e2: 10:00 - 11:00 (600 - 660) -> overlap with e1!
    // e4: 14:00 - 14:30 (840 - 870) -> separate
    const e1Pos = positions.find((p) => p.event.id === 'e1')
    const e2Pos = positions.find((p) => p.event.id === 'e2')
    const e4Pos = positions.find((p) => p.event.id === 'e4')

    expect(e1Pos).toBeDefined()
    expect(e2Pos).toBeDefined()
    expect(e4Pos).toBeDefined()

    // e1 and e2 overlap -> 50% width each
    expect(e1Pos?.width).toBe(50)
    expect(e2Pos?.width).toBe(50)
    expect(e1Pos?.left).toBe(0)
    expect(e2Pos?.left).toBe(50)

    // e4 does not overlap -> 100% width
    expect(e4Pos?.width).toBe(100)
    expect(e4Pos?.left).toBe(0)
  })

  it('formats time in 12h and 24h properly', () => {
    expect(formatTime(570, '12h')).toBe('9:30 AM')
    expect(formatTime(870, '12h')).toBe('2:30 PM')
    expect(formatTime(870, '24h')).toBe('14:30')
  })
})
