import { getContext, setContext } from 'svelte'

export interface MenuPosition {
  x: number
  y: number
}

export interface ContextMenuContextValue {
  readonly open: boolean
  openAt: (position: MenuPosition) => void
  close: () => void
  readonly position: MenuPosition
  registerMenuElement: (el: HTMLElement) => void
  unregisterMenuElement: (el: HTMLElement) => void
  registerTrigger: (el: HTMLElement | null) => void
  isInsideMenu: (target: EventTarget | null) => boolean
}

export interface ContextMenuSubContextValue {
  readonly open: boolean
  setOpen: (open: boolean) => void
  getTriggerElement: () => HTMLElement | null
  registerTriggerElement: (el: HTMLElement | null) => void
  registerContentElement: (el: HTMLElement | null) => void
  focusFirstItem: () => void
  focusTrigger: () => void
}

export interface ContextMenuRadioContextValue {
  readonly value: string
  setValue: (value: string) => void
}

const CONTEXT_MENU_CONTEXT_KEY = Symbol('uipkge-context-menu')
const CONTEXT_MENU_SUB_CONTEXT_KEY = Symbol('uipkge-context-menu-sub')
const CONTEXT_MENU_RADIO_CONTEXT_KEY = Symbol('uipkge-context-menu-radio')

export function setContextMenuContext(value: ContextMenuContextValue): void {
  setContext(CONTEXT_MENU_CONTEXT_KEY, value)
}

export function getContextMenuContext(): ContextMenuContextValue {
  const value = getContext<ContextMenuContextValue | undefined>(CONTEXT_MENU_CONTEXT_KEY)
  if (!value) throw new Error('ContextMenu parts must be used inside <ContextMenu>')
  return value
}

export function setContextMenuSubContext(value: ContextMenuSubContextValue): void {
  setContext(CONTEXT_MENU_SUB_CONTEXT_KEY, value)
}

export function getContextMenuSubContext(): ContextMenuSubContextValue {
  const value = getContext<ContextMenuSubContextValue | undefined>(CONTEXT_MENU_SUB_CONTEXT_KEY)
  if (!value) throw new Error('ContextMenuSub parts must be used inside <ContextMenuSub>')
  return value
}

export function setContextMenuRadioContext(value: ContextMenuRadioContextValue): void {
  setContext(CONTEXT_MENU_RADIO_CONTEXT_KEY, value)
}

export function getContextMenuRadioContext(): ContextMenuRadioContextValue {
  const value = getContext<ContextMenuRadioContextValue | undefined>(CONTEXT_MENU_RADIO_CONTEXT_KEY)
  if (!value) throw new Error('ContextMenuRadioItem must be used inside <ContextMenuRadioGroup>')
  return value
}

/** Enabled menu items within a menu container, in DOM order. */
export function menuItemsOf(container: HTMLElement): HTMLElement[] {
  return [...container.querySelectorAll<HTMLElement>('[data-context-menu-item]')].filter(
    (el) => !el.hasAttribute('data-disabled') && el.getAttribute('aria-disabled') !== 'true',
  )
}
