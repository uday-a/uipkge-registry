import type { LucideIcon } from 'lucide-react'

/**
 * Single event on the calendar. `type` is a free-form string (e.g. `'meeting'`,
 * `'task'`, anything) -- the matching key must exist in the `eventTypes` map
 * passed to <EventCalendar>. Unknown types fall through to a neutral style.
 */
export interface CalendarEvent {
  id: string
  title: string
  /** YYYY-MM-DD */
  date: string
  /** HH:mm */
  start: string
  /** HH:mm */
  end: string
  type: string
  description?: string
  location?: string
  attendees?: string[]
  /** Free-form status tag rendered next to the type label in the dialog. */
  status?: string
}

/**
 * Visual + semantic config per event type. The default theme uses OKLCH
 * tokens (chart-1..4, success, warning) so consumers get sensible colors
 * out of the box, but you can override per-type to wire any palette.
 */
export interface EventTypeMeta {
  label: string
  /** Lucide icon component for the stat tile + chip + dialog header. */
  icon: LucideIcon
  /** Tailwind classes for the colored chip on event rows + dialog header.
   *  Shape: `bg-X/10 text-X ring-X/20` is what the default theme uses. */
  chip: string
  /** Tailwind class for the vertical bar to the left of side-rail rows. */
  bar: string
  /** Tailwind class for the legend / stat-tile dot. */
  dot: string
  /** Tailwind class for the soft watermark glow behind stat tiles. */
  glow: string
  /** Tailwind class for the small text accent on "Next: ..." date labels. */
  text: string
  /** Tailwind class for the stat-tile hover ring. */
  ring: string
}
