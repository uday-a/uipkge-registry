import type { ReactNode } from 'react'

export type CalendarView = 'month' | 'week' | 'day' | 'work-week' | 'category'

export interface CalendarCategory {
  id: string
  name: string
  color?: string
}

export interface CalendarEvent {
  id?: string
  title: string
  /** YYYY-MM-DD or YYYY-MM-DD HH:mm or ISO string or Date */
  start: string | Date
  /** YYYY-MM-DD or YYYY-MM-DD HH:mm or ISO string or Date */
  end?: string | Date
  allDay?: boolean
  color?:
    'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'destructive' | 'info' | 'purple' | 'rose' | string
  category?: string
  description?: string
  location?: string
  [key: string]: any
}

export interface TimeClickPayload {
  date: string
  time: string
  hour: number
  minute: number
  category?: string
}

export interface PositionedEvent {
  event: CalendarEvent
  top: number
  height: number
  left: number
  width: number
  startMinutes: number
  endMinutes: number
}

export interface CalendarDayCell {
  date: Date
  dateKey: string
  dayNumber: number
  inMonth: boolean
  isToday: boolean
  events: CalendarEvent[]
  allDayEvents: CalendarEvent[]
  timedEvents: CalendarEvent[]
}

export interface EventCalendarProps {
  value?: string | Date
  defaultValue?: string | Date
  view?: CalendarView
  defaultView?: CalendarView
  events?: CalendarEvent[]
  categories?: (string | CalendarCategory)[]
  weekStartsOn?: 0 | 1
  firstInterval?: number
  intervalCount?: number
  intervalMinutes?: number
  intervalHeight?: number
  timeFormat?: '12h' | '24h'
  maxEventsPerDay?: number
  showNowIndicator?: boolean
  showHeader?: boolean
  className?: string
  onDateChange?: (date: Date) => void
  onViewChange?: (view: CalendarView) => void
  onEventClick?: (event: CalendarEvent) => void
  onDateClick?: (date: string) => void
  onTimeClick?: (payload: TimeClickPayload) => void
  onMoreClick?: (payload: { date: string; events: CalendarEvent[] }) => void
  renderHeader?: (params: {
    currentDate: Date
    view: CalendarView
    title: string
    prev: () => void
    next: () => void
    today: () => void
    setView: (view: CalendarView) => void
  }) => ReactNode
  renderEvent?: (params: { event: CalendarEvent; view: CalendarView; isAllDay: boolean }) => ReactNode
  renderDayHeader?: (params: { date: Date; dateKey: string; isToday: boolean; view: CalendarView }) => ReactNode
  renderAllDay?: (params: { date: Date; dateKey: string; events: CalendarEvent[] }) => ReactNode
  renderInterval?: (params: { hour: number; time: string; label: string }) => ReactNode
  headerActions?: ReactNode
}
