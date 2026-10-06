import { getContext } from 'svelte'
import type { GanttScale, GanttTask } from './types'

export const GANTT_CONTEXT_KEY = Symbol('gantt')

export interface GanttContext {
  scale: GanttScale
  /** React-parity setter (the Svelte-idiomatic path is assigning `scale`). */
  setScale: (scale: GanttScale) => void
  startDate: Date
  endDate: Date
  totalDays: number
  columnWidth: number
  rowHeight: number
  headerHeight: number
  treeWidth: number
  tasks: GanttTask[]
  onTaskClick: (task: GanttTask) => void
  onTaskChange: (task: GanttTask) => void
  toggleExpand?: (id: string) => void
}

/** React's context-value name, kept as an alias (shapes match: Svelte's
 *  `onTaskClick`/`onTaskChange` are required because `<Gantt>` always
 *  provides them; React's are optional). */
export type GanttContextValue = GanttContext

export function getGanttContext(): GanttContext | undefined {
  return getContext<GanttContext | undefined>(GANTT_CONTEXT_KEY)
}

/** React's `useGantt` name — like React, throws outside `<Gantt>`.
 *  Prefer `getGanttContext()` when a missing provider is not an error. */
export function useGantt(): GanttContext {
  const ctx = getGanttContext()
  if (!ctx) throw new Error('useGantt must be used within a <Gantt /> component')
  return ctx
}
