export type PopoverCloseBehavior = 'auto' | 'click-outside' | 'esc' | 'manual' | 'none'

export type PopoverSide = 'top' | 'right' | 'bottom' | 'left'

export type PopoverAlign = 'start' | 'center' | 'end'

export interface PopoverContextValue {
  id: string
  contentId: string
  triggerId: string
  isOpen: () => boolean
  setOpen: (open: boolean) => void
  toggle: () => void
  isModal: () => boolean
  getCloseBehavior: () => PopoverCloseBehavior
  getTriggerEl: () => HTMLElement | null
  getAnchorEl: () => HTMLElement | null
  registerTrigger: (el: HTMLElement) => void
  unregisterTrigger: (el: HTMLElement) => void
  registerAnchor: (el: HTMLElement) => void
  unregisterAnchor: (el: HTMLElement) => void
}

export const POPOVER_CONTEXT_KEY = Symbol('uipkge-popover')
