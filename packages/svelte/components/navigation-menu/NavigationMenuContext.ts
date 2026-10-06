import type { Snippet } from 'svelte'
import type { ClassValue } from 'clsx'
import { getContext, setContext } from 'svelte'

/** Panel payload one item hands to the shared viewport for rendering. */
export interface RegisteredContent {
  snippet: Snippet | undefined
  contentId: string
  triggerId: string
  className?: ClassValue | null
}

/** Root open-value state, trigger registry, and shared-viewport content map. */
export interface NavigationMenuRootContextValue {
  getValue: () => string | undefined
  setValue: (value: string | undefined, refocusTrigger?: boolean) => void
  isViewportEnabled: () => boolean
  getRootEl: () => HTMLElement | null
  getContentEl: () => HTMLElement | null
  setContentEl: (el: HTMLElement | null) => void
  registerTrigger: (value: string, getEl: () => HTMLElement | null) => () => void
  /** Focus the sibling trigger in `dir`; returns the newly focused value. */
  focusSiblingTrigger: (value: string, dir: 1 | -1 | 'first' | 'last') => string | null
  registerContent: (value: string, content: RegisteredContent) => () => void
  getContent: (value: string) => RegisteredContent | undefined
  /** Enter direction for the active panel (viewport motion classes). */
  getMotion: (value: string) => 'from-start' | 'from-end' | undefined
  openWithDelay: (value: string) => void
  cancelDelayedOpen: () => void
}

/** One item's identity + trigger/content pairing. */
export interface NavigationMenuItemContextValue {
  value: string
  triggerId: string
  contentId: string
  isOpen: () => boolean
  getTriggerEl: () => HTMLElement | null
  setTriggerEl: (el: HTMLElement | null) => void
}

const RootKey = Symbol('NavigationMenuRoot')
const ItemKey = Symbol('NavigationMenuItem')

export function setNavigationMenuRootContext(v: NavigationMenuRootContextValue) {
  setContext(RootKey, v)
}
export function getNavigationMenuRootContext(): NavigationMenuRootContextValue | null {
  return getContext<NavigationMenuRootContextValue | null>(RootKey) ?? null
}

export function setNavigationMenuItemContext(v: NavigationMenuItemContextValue) {
  setContext(ItemKey, v)
}
export function getNavigationMenuItemContext(): NavigationMenuItemContextValue | null {
  return getContext<NavigationMenuItemContextValue | null>(ItemKey) ?? null
}
