import * as React from 'react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
})
import { EventCalendar } from '../event-calendar'
import { calculateTimedEventPositions, formatTime } from '../date-utils'
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

describe('EventCalendar (React)', () => {
  it('renders root container with data-slot="event-calendar"', () => {
    const { container } = render(<EventCalendar value="2026-05-18" events={sampleEvents} />)
    expect(container.querySelector('[data-slot="event-calendar"]')).toBeTruthy()
  })

  it('renders month view by default with day cells and events', () => {
    render(<EventCalendar value="2026-05-18" events={sampleEvents} view="month" />)
    expect(screen.getByText('May 2026')).toBeTruthy()
    expect(screen.getByText('Sprint Planning')).toBeTruthy()
  })

  it('switches to week view and renders all-day header and events', () => {
    render(<EventCalendar value="2026-05-18" events={sampleEvents} view="week" />)
    expect(screen.getByText('All-day')).toBeTruthy()
    expect(screen.getByText('All-day Hackathon')).toBeTruthy()
    expect(screen.getByText('Sprint Planning')).toBeTruthy()
  })

  it('switches to day view and renders hourly schedule', () => {
    render(<EventCalendar value="2026-05-18" events={sampleEvents} view="day" />)
    expect(screen.getByText('Sprint Planning')).toBeTruthy()
    expect(screen.getByText('Design Review')).toBeTruthy()
  })

  it('renders category view when categories are provided', () => {
    render(
      <EventCalendar
        value="2026-05-18"
        events={sampleEvents}
        view="category"
        categories={[
          { id: 'room-a', name: 'Conference Room A' },
          { id: 'room-b', name: 'Conference Room B' },
        ]}
      />,
    )
    expect(screen.getByText('Conference Room A')).toBeTruthy()
    expect(screen.getByText('Conference Room B')).toBeTruthy()
    expect(screen.getByText('One-on-One')).toBeTruthy()
  })

  it('calls onEventClick when clicking an event card', () => {
    const onEventClick = vi.fn()
    const { container } = render(
      <EventCalendar value="2026-05-18" events={sampleEvents} view="month" onEventClick={onEventClick} />,
    )
    const card = container.querySelector('[data-slot="event-card"]')
    if (card) {
      fireEvent.click(card)
      expect(onEventClick).toHaveBeenCalled()
    }
  })

  it('calls onDateClick when clicking a day cell in month view', () => {
    const onDateClick = vi.fn()
    const { container } = render(
      <EventCalendar value="2026-05-18" events={sampleEvents} view="month" onDateClick={onDateClick} />,
    )
    const cell = container.querySelector('.min-h-\\[96px\\]')
    if (cell) {
      fireEvent.click(cell)
      expect(onDateClick).toHaveBeenCalled()
    }
  })

  it('places events in the cell of their start date and counts the +N more overflow', () => {
    // Day placement drives what users see in month view, and the "+N more" count is
    // derived from maxEventsPerDay - 1 visible rows. Both must survive the per-day
    // bucketing optimisation unchanged.
    const busyDay: CalendarEvent[] = [
      { id: 'b1', title: 'Busy 1', start: '2026-05-20 08:00', end: '2026-05-20 09:00' },
      { id: 'b2', title: 'Busy 2', start: '2026-05-20 09:00', end: '2026-05-20 10:00' },
      { id: 'b3', title: 'Busy 3', start: '2026-05-20 10:00', end: '2026-05-20 11:00' },
      { id: 'b4', title: 'Busy 4', start: '2026-05-20 11:00', end: '2026-05-20 12:00' },
      { id: 'b5', title: 'Busy 5', start: '2026-05-20 13:00', end: '2026-05-20 14:00' },
      { id: 'q1', title: 'Quiet Day Event', start: new Date(2026, 4, 21, 9, 0), end: new Date(2026, 4, 21, 10, 0) },
    ]
    const onMoreClick = vi.fn()
    render(
      <EventCalendar
        value="2026-05-18"
        events={busyDay}
        view="month"
        maxEventsPerDay={3}
        onMoreClick={onMoreClick}
      />,
    )

    const cellFor = (title: string) => screen.getByText(title).closest('.min-h-\\[96px\\]') as HTMLElement
    const busyCell = cellFor('Busy 1')
    // Only maxEventsPerDay - 1 cards are shown, in original order; the rest overflow.
    expect(busyCell.querySelectorAll('[data-slot="event-card"]').length).toBe(2)
    expect(busyCell.textContent).toContain('Busy 2')
    expect(busyCell.textContent).not.toContain('Busy 3')
    expect(busyCell.textContent).toContain('20')

    const more = screen.getByRole('button', { name: '+3 more' })
    expect(busyCell.contains(more)).toBe(true)
    fireEvent.click(more)
    expect(onMoreClick).toHaveBeenCalledWith({
      date: '2026-05-20',
      events: busyDay.slice(0, 5),
    })

    // A Date-object start lands on its own day, with no overflow there.
    const quietCell = cellFor('Quiet Day Event')
    expect(quietCell).not.toBe(busyCell)
    expect(quietCell.textContent).toContain('21')
    expect(quietCell.textContent).not.toContain('more')
  })

  it('calculates overlapping timed event positions into split columns', () => {
    const date = new Date(2026, 4, 18)
    const positions = calculateTimedEventPositions(sampleEvents, date, 0, 24, 60)

    const e1Pos = positions.find((p) => p.event.id === 'e1')
    const e2Pos = positions.find((p) => p.event.id === 'e2')
    const e4Pos = positions.find((p) => p.event.id === 'e4')

    expect(e1Pos).toBeDefined()
    expect(e2Pos).toBeDefined()
    expect(e4Pos).toBeDefined()

    expect(e1Pos?.width).toBe(50)
    expect(e2Pos?.width).toBe(50)
    expect(e1Pos?.left).toBe(0)
    expect(e2Pos?.left).toBe(50)

    expect(e4Pos?.width).toBe(100)
    expect(e4Pos?.left).toBe(0)
  })

  it('formats time in 12h and 24h properly', () => {
    expect(formatTime(570, '12h')).toBe('9:30 AM')
    expect(formatTime(870, '12h')).toBe('2:30 PM')
    expect(formatTime(870, '24h')).toBe('14:30')
  })
})
