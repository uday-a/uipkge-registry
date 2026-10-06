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

  // Month cells group events by their START date only (no multi-day spanning) and
  // collapse overflow into "+N more" where N = total - (maxEventsPerDay - 1).
  // Locks the per-cell grouping so the precomputed day map stays equivalent.
  describe('month view day grouping', () => {
    const cellFor = (wrapper: ReturnType<typeof mount>, day: number, inMonth = true) =>
      wrapper
        .findAll('.min-h-\\[96px\\]')
        .filter((c) => c.classes().includes('bg-card') === inMonth)
        .find((c) => c.find('span').text() === String(day))!

    const busyDay: CalendarEvent[] = [
      { id: 'a', title: 'Alpha', start: '2026-05-12 08:00' },
      { id: 'b', title: 'Bravo', start: '2026-05-12T09:15' },
      { id: 'c', title: 'Charlie', start: new Date(2026, 4, 12, 13, 5) },
      { id: 'd', title: 'Delta', start: '2026-05-12', allDay: true },
      { id: 'm', title: 'Multi-day Offsite', start: '2026-05-20 10:00', end: '2026-05-22 16:00' },
      { id: 'j', title: 'June Kickoff', start: '2026-06-01 09:00' },
    ]

    it('places events on their start day, in input order, and not on other days', () => {
      const wrapper = mount(EventCalendar, { props: { modelValue: '2026-05-18', events: busyDay, maxEventsPerDay: 5 } })
      const cards = cellFor(wrapper, 12).findAll('[data-slot="event-card"]')
      expect(cards.map((c) => c.text())).toEqual(['8:00 AMAlpha', '9:15 AMBravo', '1:05 PMCharlie', 'Delta'])
      expect(cellFor(wrapper, 13).findAll('[data-slot="event-card"]')).toHaveLength(0)
    })

    it('shows a multi-day event on its start day only', () => {
      const wrapper = mount(EventCalendar, { props: { modelValue: '2026-05-18', events: busyDay } })
      expect(cellFor(wrapper, 20).text()).toContain('Multi-day Offsite')
      expect(cellFor(wrapper, 21).text()).not.toContain('Multi-day Offsite')
      expect(cellFor(wrapper, 22).text()).not.toContain('Multi-day Offsite')
    })

    it('shows next-month events in the trailing out-of-month cells', () => {
      const wrapper = mount(EventCalendar, { props: { modelValue: '2026-05-18', events: busyDay } })
      expect(cellFor(wrapper, 1, false).text()).toContain('June Kickoff')
    })

    it('collapses overflow into "+N more" and emits the full day list', async () => {
      const wrapper = mount(EventCalendar, { props: { modelValue: '2026-05-18', events: busyDay, maxEventsPerDay: 3 } })
      const cell = cellFor(wrapper, 12)
      expect(cell.findAll('[data-slot="event-card"]').map((c) => c.text())).toEqual(['8:00 AMAlpha', '9:15 AMBravo'])
      const more = cell.find('button')
      expect(more.text()).toBe('+2 more')
      await more.trigger('click')
      const payload = wrapper.emitted('click:more')![0][0] as { date: string; events: CalendarEvent[] }
      expect(payload.date).toBe('2026-05-12')
      expect(payload.events.map((e) => e.id)).toEqual(['a', 'b', 'c', 'd'])
    })

    it('renders all events without "+more" when count equals maxEventsPerDay', () => {
      const wrapper = mount(EventCalendar, { props: { modelValue: '2026-05-18', events: busyDay, maxEventsPerDay: 4 } })
      const cell = cellFor(wrapper, 12)
      expect(cell.findAll('[data-slot="event-card"]')).toHaveLength(4)
      expect(cell.text()).not.toContain('more')
    })

    it('updates time labels when timeFormat changes', async () => {
      const wrapper = mount(EventCalendar, { props: { modelValue: '2026-05-18', events: busyDay, maxEventsPerDay: 5 } })
      await wrapper.setProps({ timeFormat: '24h' })
      expect(cellFor(wrapper, 12).findAll('[data-slot="event-card"]')[2].text()).toBe('13:05Charlie')
    })

    it('re-groups when the events prop changes', async () => {
      const wrapper = mount(EventCalendar, { props: { modelValue: '2026-05-18', events: busyDay } })
      await wrapper.setProps({ events: [{ id: 'n', title: 'Moved', start: '2026-05-13 10:00' }] })
      expect(cellFor(wrapper, 12).findAll('[data-slot="event-card"]')).toHaveLength(0)
      expect(cellFor(wrapper, 13).text()).toContain('Moved')
    })
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
