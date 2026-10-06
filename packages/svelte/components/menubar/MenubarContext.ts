import { getContext, setContext } from 'svelte'

/** Root-level open-menu state + trigger registry for sibling navigation. */
export interface MenubarRootContextValue {
  getOpenMenu: () => string | null
  setOpenMenu: (id: string | null, refocusTrigger?: boolean) => void
  registerTrigger: (id: string, getEl: () => HTMLElement | null) => () => void
  /** Focus the sibling trigger in `dir`; returns the newly focused menu id. */
  focusSiblingTrigger: (id: string, dir: 1 | -1) => string | null
  getRootEl: () => HTMLElement | null
}

/** Trigger/content pairing for one top-level menu. */
export interface MenubarMenuContextValue {
  id: string
  triggerId: string
  contentId: string
  isOpen: () => boolean
  getTriggerEl: () => HTMLElement | null
  setTriggerEl: (el: HTMLElement | null) => void
  getContentEl: () => HTMLElement | null
  setContentEl: (el: HTMLElement | null) => void
}

/**
 * Roving-focus scope. Provided by MenubarMenu for its content and shadowed by
 * MenubarSub for its flyout, so arrow keys stay inside the nearest open menu.
 */
export interface MenubarScopeContextValue {
  registerItem: (el: HTMLElement, isDisabled: () => boolean) => () => void
  moveFocus: (current: HTMLElement | null, target: 1 | -1 | 'first' | 'last') => void
  closeScope: (refocusTrigger: boolean) => void
}

/** Open state for one submenu. */
export interface MenubarSubContextValue {
  isOpen: () => boolean
  setOpen: (open: boolean) => void
  getTriggerEl: () => HTMLElement | null
  setTriggerEl: (el: HTMLElement | null) => void
  /**
   * The scope enclosing the submenu (captured before the sub shadows it).
   * The sub trigger registers here so parent-menu arrows flow through it.
   */
  parentScope: MenubarScopeContextValue | null
}

/** Selected value for one radio group. */
export interface MenubarRadioContextValue {
  getValue: () => string | undefined
  setValue: (value: string) => void
}

const RootKey = Symbol('MenubarRoot')
const MenuKey = Symbol('MenubarMenu')
const ScopeKey = Symbol('MenubarScope')
const SubKey = Symbol('MenubarSub')
const RadioKey = Symbol('MenubarRadio')

export function setMenubarRootContext(v: MenubarRootContextValue) {
  setContext(RootKey, v)
}
export function getMenubarRootContext(): MenubarRootContextValue | null {
  return getContext<MenubarRootContextValue | null>(RootKey) ?? null
}

export function setMenubarMenuContext(v: MenubarMenuContextValue) {
  setContext(MenuKey, v)
}
export function getMenubarMenuContext(): MenubarMenuContextValue | null {
  return getContext<MenubarMenuContextValue | null>(MenuKey) ?? null
}

export function setMenubarScopeContext(v: MenubarScopeContextValue) {
  setContext(ScopeKey, v)
}
export function getMenubarScopeContext(): MenubarScopeContextValue | null {
  return getContext<MenubarScopeContextValue | null>(ScopeKey) ?? null
}

export function setMenubarSubContext(v: MenubarSubContextValue) {
  setContext(SubKey, v)
}
export function getMenubarSubContext(): MenubarSubContextValue | null {
  return getContext<MenubarSubContextValue | null>(SubKey) ?? null
}

export function setMenubarRadioContext(v: MenubarRadioContextValue) {
  setContext(RadioKey, v)
}
export function getMenubarRadioContext(): MenubarRadioContextValue | null {
  return getContext<MenubarRadioContextValue | null>(RadioKey) ?? null
}

/** Shared roving-focus list with wrap-around (reka `loop` default). */
export function createItemScope(closeScope: (refocusTrigger: boolean) => void): MenubarScopeContextValue {
  const entries: Array<{ el: HTMLElement; isDisabled: () => boolean }> = []
  return {
    registerItem(el, isDisabled) {
      const entry = { el, isDisabled }
      entries.push(entry)
      return () => {
        const i = entries.indexOf(entry)
        if (i >= 0) entries.splice(i, 1)
      }
    },
    moveFocus(current, target) {
      const enabled = entries.filter((e) => e.el.isConnected && !e.isDisabled())
      if (enabled.length === 0) return
      let index: number
      if (target === 'first') index = 0
      else if (target === 'last') index = enabled.length - 1
      else {
        const currentIndex = current ? enabled.findIndex((e) => e.el === current) : -1
        index = (currentIndex + target + enabled.length) % enabled.length
      }
      enabled[index]?.el.focus({ preventScroll: true })
    },
    closeScope,
  }
}
