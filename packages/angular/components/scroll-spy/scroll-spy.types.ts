/**
 * Angular port of the scroll-spy context types. Same exported names as the
 * Vue `context.ts` but framework-free (no vue/reka imports) so registry
 * consumers and vitest stay dependency-light.
 */

export type ScrollSpyTurn = 'straight' | 'sharp' | 'rounded'
export type ScrollSpyVariant =
  'default' | 'line' | 'angle' | 'sharp' | 'rounded' | 'stepper' | 'scrollspy' | 'tabs' | 'pills'
export type ScrollSpyIndicatorMode = 'segment' | 'fill' | 'progress' | 'pill' | 'dot' | 'line'
export type ScrollSpyPosition = 'right' | 'left' | 'top' | 'bottom'
export type ScrollSpyRailPosition = 'left' | 'right'

export type ScrollSpyLineWidth = 'thin' | 'default' | 'thick' | number
export type ScrollSpyColor = 'primary' | 'foreground' | 'destructive' | 'secondary' | (string & {})

export interface ScrollSpyItem {
  href?: string
  value?: string
  title: string
  depth?: number
  children?: ScrollSpyItem[]
}

export interface RegisteredItem {
  value: string
  depth: number
  el?: HTMLElement | null
  title?: string
}

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
  return { bgClass: '', strokeClass: '', borderClass: '', customColor: color }
}
