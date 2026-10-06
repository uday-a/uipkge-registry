import { getContext } from 'svelte'

export interface SelectItemData {
  value: string
  label: string
  disabled: boolean
}

/**
 * Shared select state, provided by `Select` and consumed by the parts.
 * Readonly fields are implemented as getters over runes state in `Select`,
 * so `$derived(ctx.open)` in a part stays reactive.
 */
export interface SelectContext {
  readonly open: boolean
  readonly value: string | undefined
  readonly highlighted: string | undefined
  readonly disabled: boolean
  readonly items: SelectItemData[]
  readonly triggerId: string
  readonly contentId: string
  readonly triggerEl: HTMLElement | null
  setOpen: (open: boolean) => void
  selectValue: (value: string) => void
  setHighlighted: (value: string | undefined) => void
  moveHighlight: (direction: 1 | -1) => void
  highlightFirst: () => void
  highlightLast: () => void
  registerItem: (item: SelectItemData) => void
  unregisterItem: (value: string) => void
  registerTrigger: (el: HTMLElement | null) => void
  focusTrigger: () => void
}

export const SELECT_CONTEXT_KEY = Symbol('uipkge-select-context')

export function getSelectContext(component: string): SelectContext {
  const ctx = getContext<SelectContext | undefined>(SELECT_CONTEXT_KEY)
  if (!ctx) throw new Error(`${component} must be used inside <Select>.`)
  return ctx
}
