import { getContext, hasContext } from 'svelte'

export type AccordionVariant = 'default' | 'separated' | 'ghost'
export type AccordionType = 'single' | 'multiple'

/**
 * Root state shared with items via `setContext` / `getContext` (Svelte
 * counterpart of Vue's provide/inject). Implemented with plain getters that
 * close over the root component's `$state`, so reads inside a child's
 * `$derived` stay reactive without a `.svelte.ts` module.
 */
export interface AccordionRootContext {
  readonly variant: AccordionVariant
  readonly type: AccordionType
  readonly collapsible: boolean
  readonly disabled: boolean
  readonly orientation: 'horizontal' | 'vertical'
  isOpen: (value: string) => boolean
  toggle: (value: string) => void
  registerTrigger: (el: HTMLElement) => void
  unregisterTrigger: (el: HTMLElement) => void
  focusSiblingTrigger: (current: HTMLElement, target: 1 | -1 | 'first' | 'last') => void
}

export interface AccordionItemContext {
  readonly value: string
  readonly triggerId: string
  readonly contentId: string
  readonly open: boolean
  readonly disabled: boolean
}

export const ACCORDION_ROOT_KEY = Symbol('uipkge-accordion-root')
export const ACCORDION_ITEM_KEY = Symbol('uipkge-accordion-item')

export function getAccordionRoot(): AccordionRootContext | undefined {
  return hasContext(ACCORDION_ROOT_KEY) ? getContext<AccordionRootContext>(ACCORDION_ROOT_KEY) : undefined
}

export function getAccordionItem(): AccordionItemContext | undefined {
  return hasContext(ACCORDION_ITEM_KEY) ? getContext<AccordionItemContext>(ACCORDION_ITEM_KEY) : undefined
}
