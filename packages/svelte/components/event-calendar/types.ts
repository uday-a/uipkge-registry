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
