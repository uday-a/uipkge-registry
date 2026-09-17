import { Video, CheckCircle2, AlertCircle, Plane } from 'lucide-react'
import type { EventTypeMeta } from './types'

/**
 * Default event-type theme. Mirrors the boilerplate dashboard but routes
 * every color through OKLCH tokens (chart-1..4, success, warning) so it
 * follows light/dark mode and any consumer theme override.
 *
 * Override per-type or replace the whole map via `<EventCalendar eventTypes={...} />`.
 */
export const defaultEventTypes: Record<string, EventTypeMeta> = {
  meeting: {
    label: 'Meeting',
    icon: Video,
    chip: 'bg-chart-1/10 text-chart-1 ring-chart-1/20',
    bar: 'bg-chart-1',
    dot: 'bg-chart-1',
    glow: 'bg-chart-1/10',
    text: 'text-chart-1',
    ring: 'hover:ring-chart-1/30',
  },
  task: {
    label: 'Task',
    icon: CheckCircle2,
    chip: 'bg-success/10 text-success ring-success/20',
    bar: 'bg-success',
    dot: 'bg-success',
    glow: 'bg-success/10',
    text: 'text-success',
    ring: 'hover:ring-success/30',
  },
  reminder: {
    label: 'Reminder',
    icon: AlertCircle,
    chip: 'bg-warning/10 text-warning ring-warning/20',
    bar: 'bg-warning',
    dot: 'bg-warning',
    glow: 'bg-warning/10',
    text: 'text-warning',
    ring: 'hover:ring-warning/30',
  },
  travel: {
    label: 'Travel',
    icon: Plane,
    chip: 'bg-chart-3/10 text-chart-3 ring-chart-3/20',
    bar: 'bg-chart-3',
    dot: 'bg-chart-3',
    glow: 'bg-chart-3/10',
    text: 'text-chart-3',
    ring: 'hover:ring-chart-3/30',
  },
}
