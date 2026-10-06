import { getContext, setContext } from 'svelte'

/**
 * Hand-rolled menu state (no headless dependency installed in the Svelte
 * registry yet). If bits-ui (the shadcn-svelte standard) is ever adopted,
 * these parts should be rebuilt on top of it.
 */

export interface DropdownMenuContextValue {
  readonly ids: { trigger: string; content: string }
  isOpen: () => boolean
  setOpen: (open: boolean) => void
  closeAndFocusTrigger: () => void
}

const MENU_KEY = Symbol('uipkge:dropdown-menu')

export function setMenuContext(value: DropdownMenuContextValue): void {
  setContext(MENU_KEY, value)
}

export function getMenuContext(): DropdownMenuContextValue {
  return getContext<DropdownMenuContextValue>(MENU_KEY)
}

export interface DropdownMenuRadioContextValue {
  getValue: () => string
  setValue: (value: string) => void
}

const RADIO_KEY = Symbol('uipkge:dropdown-menu-radio')

export function setRadioContext(value: DropdownMenuRadioContextValue): void {
  setContext(RADIO_KEY, value)
}

export function getRadioContext(): DropdownMenuRadioContextValue {
  return getContext<DropdownMenuRadioContextValue>(RADIO_KEY)
}

export interface DropdownMenuSubContextValue {
  isSubOpen: () => boolean
  setSubOpen: (open: boolean) => void
  /** Close after a grace period so the pointer can travel between the
   *  trigger and the panel. Any setSubOpen call cancels the pending close. */
  scheduleClose: (delay?: number) => void
  readonly ids: { trigger: string; content: string }
}

const SUB_KEY = Symbol('uipkge:dropdown-menu-sub')

export function setSubContext(value: DropdownMenuSubContextValue): void {
  setContext(SUB_KEY, value)
}

export function getSubContext(): DropdownMenuSubContextValue {
  return getContext<DropdownMenuSubContextValue>(SUB_KEY)
}

const ITEM_SELECTOR =
  '[role="menuitem"]:not([data-disabled]), [role="menuitemcheckbox"]:not([data-disabled]), [role="menuitemradio"]:not([data-disabled])'

/** Arrow-key / Home / End focus movement scoped to one menu container. */
export function focusMenuItem(containerId: string, where: 'first' | 'last' | 'next' | 'prev'): void {
  const container = document.getElementById(containerId)
  if (!container) return
  const items = [...container.querySelectorAll(ITEM_SELECTOR)].filter(
    (el) => el instanceof HTMLElement,
  ) as HTMLElement[]
  if (items.length === 0) {
    container.focus()
    return
  }
  const current = items.indexOf(document.activeElement as HTMLElement)
  const next =
    where === 'first'
      ? items[0]
      : where === 'last'
        ? items[items.length - 1]
        : where === 'next'
          ? items[(current + 1) % items.length]
          : items[(current - 1 + items.length) % items.length]
  next?.focus()
}
