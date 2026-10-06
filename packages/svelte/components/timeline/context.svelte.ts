import { getContext, setContext } from 'svelte'

export type TimelineDirection = 'vertical' | 'horizontal'
export type TimelineAlign = 'start' | 'center'
export type TimelineSide = 'left' | 'right' | 'top' | 'bottom'
export type TimelineStatus = 'default' | 'current' | 'success' | 'warning' | 'error' | 'info' | 'muted'
export type TimelineDensity = 'compact' | 'default' | 'comfortable'

export class TimelineContextState {
  direction = $state<TimelineDirection>('vertical')
  align = $state<TimelineAlign>('start')
  side = $state<TimelineSide>('left')
  density = $state<TimelineDensity>('default')
  itemIds = $state<symbol[]>([])

  register(id: symbol) {
    if (!this.itemIds.includes(id)) this.itemIds.push(id)
  }

  unregister(id: symbol) {
    this.itemIds = this.itemIds.filter((i) => i !== id)
  }
}

const TIMELINE_KEY = Symbol('TimelineContext')

export function setTimelineContext(ctx: TimelineContextState) {
  setContext(TIMELINE_KEY, ctx)
}

export function getTimelineContext(): TimelineContextState | undefined {
  return getContext<TimelineContextState | undefined>(TIMELINE_KEY)
}

export class TimelineItemContextState {
  index = $state(0)
  isFirst = $state(true)
  isLast = $state(false)
  side = $state<TimelineSide>('left')
  status = $state<TimelineStatus>('default')
  direction = $state<TimelineDirection>('vertical')
  density = $state<TimelineDensity>('default')
}

const TIMELINE_ITEM_KEY = Symbol('TimelineItemContext')

export function setTimelineItemContext(ctx: TimelineItemContextState) {
  setContext(TIMELINE_ITEM_KEY, ctx)
}

export function getTimelineItemContext(): TimelineItemContextState | undefined {
  return getContext<TimelineItemContextState | undefined>(TIMELINE_ITEM_KEY)
}
