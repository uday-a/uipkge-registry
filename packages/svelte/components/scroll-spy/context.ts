import { getContext } from 'svelte'

export type ScrollSpyTurn = 'straight' | 'sharp' | 'rounded'
export type ScrollSpyVariant =
  'default' | 'line' | 'angle' | 'sharp' | 'rounded' | 'stepper' | 'scrollspy' | 'tabs' | 'pills'
export type ScrollSpyIndicatorMode = 'segment' | 'fill' | 'progress' | 'pill' | 'dot' | 'line'
export type ScrollSpyPosition = 'right' | 'left' | 'top' | 'bottom'
export type ScrollSpyRailPosition = 'left' | 'right'

export type ScrollSpyLineWidth = 'thin' | 'default' | 'thick' | number
export type ScrollSpyColor = 'primary' | 'foreground' | 'destructive' | 'secondary' | (string & {})

export interface HandleColorResolved {
  bgClass: string
  strokeClass: string
  borderClass: string
  customColor?: string
}

export function resolveScrollSpyColor(color: ScrollSpyColor = 'primary'): HandleColorResolved {
  if (color === 'primary')
    return {
      bgClass: 'bg-primary',
      strokeClass: 'stroke-primary',
      borderClass: 'border-primary',
      customColor: undefined,
    }
  if (color === 'foreground')
    return {
      bgClass: 'bg-foreground',
      strokeClass: 'stroke-foreground',
      borderClass: 'border-foreground',
      customColor: undefined,
    }
  if (color === 'destructive')
    return {
      bgClass: 'bg-destructive',
      strokeClass: 'stroke-destructive',
      borderClass: 'border-destructive',
      customColor: undefined,
    }
  if (color === 'secondary')
    return {
      bgClass: 'bg-secondary',
      strokeClass: 'stroke-secondary',
      borderClass: 'border-secondary',
      customColor: undefined,
    }
  if (color.startsWith('bg-')) {
    const raw = color.replace(/^bg-/, '')
    return { bgClass: color, strokeClass: `stroke-${raw}`, borderClass: `border-${raw}`, customColor: undefined }
  }
  if (
    color.startsWith('#') ||
    color.startsWith('oklch') ||
    color.startsWith('rgb') ||
    color.startsWith('hsl') ||
    color.startsWith('var(')
  ) {
    return { bgClass: '', strokeClass: '', borderClass: '', customColor: color }
  }
  return {
    bgClass: `bg-${color}`,
    strokeClass: `stroke-${color}`,
    borderClass: `border-${color}`,
    customColor: undefined,
  }
}

export interface RegisteredItem {
  value: string
  depth: number
  el: HTMLElement | null
  title?: string
  parentValue?: string | null
}

/**
 * Shared scroll-spy state, provided by `ScrollSpy` and consumed by the parts.
 * Readonly fields are implemented as getters over runes state in `ScrollSpy`,
 * so `$derived(ctx.activeValue)` in a part stays reactive.
 */
export interface ScrollSpyContext {
  readonly activeValue: string
  setActiveValue: (value: string) => void
  readonly scrollProgress: number
  registerItem: (item: RegisteredItem) => void
  unregisterItem: (value: string) => void
  readonly variant: ScrollSpyVariant
  readonly turn: ScrollSpyTurn
  readonly indicator: ScrollSpyIndicatorMode
  readonly keepScrolled: boolean
  readonly highlightParent: boolean
  readonly lineWidth: ScrollSpyLineWidth
  readonly resolvedLineWidth: number
  readonly color: ScrollSpyColor
  readonly position: ScrollSpyPosition
  readonly railPosition: ScrollSpyRailPosition
  readonly scrollContainer: HTMLElement | Window | null
  readonly offsetTop: number
  readonly items: RegisteredItem[]
  getListEl: () => HTMLElement | null
  setListEl: (el: HTMLElement | null) => void
  scrollToHref: (href: string) => void
  goToPrev: () => void
  goToNext: () => void
  isItemActive: (value: string) => boolean
  isItemParentActive: (value: string) => boolean
  isItemScrolled: (value: string) => boolean
}

export const SCROLL_SPY_CONTEXT_KEY = Symbol('uipkge-scroll-spy-context')
export const SCROLL_SPY_ITEM_DEPTH_KEY = Symbol('uipkge-scroll-spy-depth')

export function getScrollSpyContext(component: string): ScrollSpyContext {
  const ctx = getContext<ScrollSpyContext | undefined>(SCROLL_SPY_CONTEXT_KEY)
  if (!ctx) throw new Error(`${component} must be used inside <ScrollSpy>.`)
  return ctx
}

export function getScrollSpyContextOptional(): ScrollSpyContext | null {
  return getContext<ScrollSpyContext | undefined>(SCROLL_SPY_CONTEXT_KEY) ?? null
}
