import { getContext, setContext } from 'svelte'

export type TabsOrientation = 'horizontal' | 'vertical'

/**
 * Tabs state shared from <Tabs> to its descendants. Exposed as functions so
 * reads inside child templates/`$derived` track the parent's runes state.
 */
export interface TabsContextValue {
  current: () => string | undefined
  orientation: () => TabsOrientation
  select: (value: string) => void
  triggerId: (value: string) => string
  contentId: (value: string) => string
}

const KEY = Symbol.for('uipkge:tabs')

export function setTabsContext(value: TabsContextValue): TabsContextValue {
  setContext(KEY, value)
  return value
}

export function getTabsContext(): TabsContextValue | null {
  return getContext<TabsContextValue | null>(KEY) ?? null
}

let uid = 0

/** Instance-unique id prefix for trigger/content aria linking. */
export function nextTabsId(): string {
  uid += 1
  return `uipkge-tabs-${uid}`
}
