import { getContext, setContext } from 'svelte'

export const SIDEBAR_COOKIE_NAME = 'sidebar_state'
export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
export const SIDEBAR_WIDTH = '16rem'
export const SIDEBAR_WIDTH_MOBILE = '18rem'
export const SIDEBAR_WIDTH_ICON = '3rem'
export const SIDEBAR_KEYBOARD_SHORTCUT = 'b'

const SIDEBAR_CONTEXT_KEY = Symbol('uipkge-sidebar')

export interface SidebarContextValue {
  readonly state: 'expanded' | 'collapsed'
  readonly open: boolean
  setOpen: (value: boolean) => void
  readonly isMobile: boolean
  readonly openMobile: boolean
  setOpenMobile: (value: boolean) => void
  toggleSidebar: () => void
}

export function setSidebarContext(value: SidebarContextValue) {
  setContext(SIDEBAR_CONTEXT_KEY, value)
}

export function useSidebar(): SidebarContextValue {
  return getContext<SidebarContextValue>(SIDEBAR_CONTEXT_KEY)
}
