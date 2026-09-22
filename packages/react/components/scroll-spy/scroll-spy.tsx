'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export type ScrollSpyTurn = 'straight' | 'sharp' | 'rounded'
export type ScrollSpyVariant =
  'default' | 'line' | 'angle' | 'sharp' | 'rounded' | 'stepper' | 'scrollspy' | 'tabs' | 'pills'
export type ScrollSpyIndicatorMode = 'segment' | 'fill' | 'progress' | 'pill' | 'dot' | 'line'
export type ScrollSpyPosition = 'right' | 'left' | 'top' | 'bottom'
export type ScrollSpyRailPosition = 'left' | 'right'

export interface ScrollSpyItem {
  href: string
  title: string
  depth?: number
  children?: ScrollSpyItem[]
}

export interface RegisteredItem {
  value: string
  depth: number
  el: HTMLElement | null
  title?: string
  parentValue?: string | null
}

function flattenItems(rawItems: ScrollSpyItem[]): RegisteredItem[] {
  const result: RegisteredItem[] = []
  function walk(list: ScrollSpyItem[], depth = 1, parentVal: string | null = null) {
    for (const it of list) {
      result.push({
        value: it.href,
        depth: it.depth ?? depth,
        el: null,
        title: it.title,
        parentValue: parentVal,
      })
      if (it.children && it.children.length > 0) {
        walk(it.children, depth + 1, it.href)
      }
    }
  }
  walk(rawItems)
  return result
}

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

interface ScrollSpyContextValue {
  activeValue: string
  setActiveValue: (value: string) => void
  scrollProgress: number
  registerItem: (item: RegisteredItem) => void
  unregisterItem: (value: string) => void
  getItems: () => RegisteredItem[]
  variant: ScrollSpyVariant
  turn: ScrollSpyTurn
  indicator: ScrollSpyIndicatorMode
  keepScrolled: boolean
  highlightParent: boolean
  lineWidth: ScrollSpyLineWidth
  resolvedLineWidth: number
  color: ScrollSpyColor
  position: ScrollSpyPosition
  railPosition: ScrollSpyRailPosition
  scrollContainerRef: React.MutableRefObject<HTMLElement | Window | null>
  offsetTopRef: React.MutableRefObject<number>
  getListEl: () => HTMLElement | null
  setListEl: (el: HTMLElement | null) => void
  subscribe: (listener: () => void) => () => void
  scrollToHref: (href: string) => void
  goToPrev: () => void
  goToNext: () => void
  isItemActive: (value: string) => boolean
  isItemParentActive: (value: string) => boolean
  isItemScrolled: (value: string) => boolean
}

const ScrollSpyContext = React.createContext<ScrollSpyContextValue | null>(null)
const ScrollSpyItemDepthContext = React.createContext<number>(0)

export interface ScrollSpyProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onProgress'> {
  title?: string
  items?: ScrollSpyItem[]
  value?: string
  defaultValue?: string
  offsetTop?: number
  bounds?: number
  scrollContainer?: HTMLElement | string | null
  affix?: boolean
  variant?: ScrollSpyVariant
  turn?: ScrollSpyTurn
  indicator?: ScrollSpyIndicatorMode
  keepScrolled?: boolean
  highlightParent?: boolean
  lineWidth?: ScrollSpyLineWidth
  color?: ScrollSpyColor
  position?: ScrollSpyPosition
  railPosition?: ScrollSpyRailPosition
  onChange?: (value: string) => void
  onProgress?: (progress: number) => void
}

interface Marker {
  value: string
  depth: number
  x: number
  y: number
  top: number
  bottom: number
}

function depthX(relDepth: number, isRightRail: boolean, listWidth: number): number {
  if (!isRightRail) {
    if (relDepth <= 1) return 1
    if (relDepth === 2) return 13
    if (relDepth === 3) return 21
    return 21 + (relDepth - 3) * 8
  }
  const base = listWidth - 1
  if (relDepth <= 1) return base
  if (relDepth === 2) return base - 12
  if (relDepth === 3) return base - 20
  return base - 20 - (relDepth - 3) * 8
}

function buildCircuitPath(markers: Marker[], endIndex: number, rounded: boolean, edge: 'top' | 'bottom'): string {
  if (markers.length === 0 || endIndex < 0) return ''

  const end = Math.min(endIndex, markers.length - 1)
  const first = markers[0]!
  const parts: string[] = [`M ${first.x} ${first.top}`]

  for (let i = 0; i <= end; i++) {
    const curr = markers[i]!

    if (i === end) {
      const targetY = edge === 'top' ? curr.top : curr.bottom
      parts.push(`L ${curr.x} ${targetY}`)
      break
    }

    const next = markers[i + 1]
    if (!next) {
      parts.push(`L ${curr.x} ${curr.bottom}`)
      break
    }

    // Always draw down the full height of curr at curr.x first
    parts.push(`L ${curr.x} ${curr.bottom}`)

    if (curr.x === next.x) {
      parts.push(`L ${curr.x} ${next.top}`)
      continue
    }

    // Smooth monotonic depth transition strictly bounded within [curr.bottom, next.top]
    const gap = Math.max(0, next.top - curr.bottom)
    const absDx = Math.abs(next.x - curr.x)
    const transitionH = Math.min(gap, absDx)

    if (transitionH <= 1) {
      parts.push(`L ${next.x} ${next.top}`)
      continue
    }

    const y1 = curr.bottom + (gap - transitionH) / 2
    let y2 = y1 + transitionH
    if (next.top - y2 <= 0.5) {
      y2 = next.top
    }

    // 1. Straight rail down to y1 at curr.x
    if (y1 - curr.bottom > 0.5) {
      parts.push(`L ${curr.x} ${y1}`)
    }

    // 2. Transition from (curr.x, y1) to (next.x, y2)
    if (rounded) {
      const midY = (y1 + y2) / 2
      parts.push(`C ${curr.x} ${midY}, ${next.x} ${midY}, ${next.x} ${y2}`)
    } else {
      parts.push(`L ${next.x} ${y2}`)
    }

    // 3. Connect to next.top if next.top > y2
    if (next.top - y2 > 0.5) {
      parts.push(`L ${next.x} ${next.top}`)
    }
  }

  return parts.join(' ')
}

export const ScrollSpyRoot = React.forwardRef<HTMLElement, ScrollSpyProps>(
  (
    {
      className,
      title,
      items = [],
      value,
      defaultValue,
      offsetTop = 0,
      bounds = 5,
      scrollContainer = null,
      affix = false,
      variant,
      turn,
      indicator = 'line',
      keepScrolled = false,
      highlightParent = true,
      lineWidth = 'default',
      color = 'primary',
      position = 'right',
      railPosition,
      onChange,
      onProgress,
      style,
      children,
      ...props
    },
    forwardedRef,
  ) => {
    const resolvedPosition: ScrollSpyPosition = position ?? 'right'
    const resolvedRailPosition: ScrollSpyRailPosition = railPosition ?? (position === 'left' ? 'right' : 'left')

    const resolvedLineWidth = React.useMemo(() => {
      if (typeof lineWidth === 'number') return Math.max(1, lineWidth)
      if (lineWidth === 'thin') return 1.5
      if (lineWidth === 'thick') return 3.5
      return 2.5
    }, [lineWidth])

    const resolvedTurn: ScrollSpyTurn =
      turn ?? (variant === 'angle' || variant === 'rounded' ? 'rounded' : variant === 'sharp' ? 'sharp' : 'straight')
    const resolvedVariant: ScrollSpyVariant =
      variant && variant !== 'default'
        ? variant
        : turn === 'sharp'
          ? 'angle'
          : turn === 'rounded'
            ? 'rounded'
            : position === 'top' || position === 'bottom'
              ? 'stepper'
              : 'line'
    const resolvedIndicator: ScrollSpyIndicatorMode = indicator ?? 'line'

    const [internalActive, setInternalActive] = React.useState<string>(defaultValue || (items[0]?.href ?? ''))
    const activeValue = value !== undefined ? value : internalActive
    const activeValueRef = React.useRef(activeValue)
    activeValueRef.current = activeValue

    const registeredItemsMap = React.useRef<Map<string, RegisteredItem>>(
      new Map(items && items.length > 0 ? flattenItems(items).map((it) => [it.value, it]) : []),
    )
    const listenersRef = React.useRef<Set<() => void>>(new Set())

    const notifyListeners = React.useCallback(() => {
      for (const listener of listenersRef.current) {
        listener()
      }
    }, [])

    React.useEffect(() => {
      if (items && items.length > 0) {
        const flattened = flattenItems(items)
        for (const item of flattened) {
          const existing = registeredItemsMap.current.get(item.value)
          registeredItemsMap.current.set(item.value, {
            ...item,
            el: existing?.el ?? null,
            title: item.title ?? existing?.title,
          })
        }
        notifyListeners()
        if (!activeValueRef.current && flattened.length > 0) {
          activeValueRef.current = flattened[0]!.value
          setInternalActive(flattened[0]!.value)
        }
      }
    }, [items, notifyListeners])

    const subscribe = React.useCallback((listener: () => void) => {
      listenersRef.current.add(listener)
      return () => {
        listenersRef.current.delete(listener)
      }
    }, [])

    const registerItem = React.useCallback(
      (item: RegisteredItem) => {
        const existing = registeredItemsMap.current.get(item.value)
        registeredItemsMap.current.set(item.value, {
          ...existing,
          ...item,
          title: item.title ?? existing?.title,
        })
        notifyListeners()
        if (!activeValueRef.current) {
          activeValueRef.current = item.value
          setInternalActive(item.value)
        }
      },
      [notifyListeners],
    )

    const unregisterItem = React.useCallback(
      (val: string) => {
        registeredItemsMap.current.delete(val)
        notifyListeners()
      },
      [notifyListeners],
    )

    const getItems = React.useCallback(() => Array.from(registeredItemsMap.current.values()), [])

    const [readingProgress, setReadingProgress] = React.useState<number>(0)
    const readingProgressRef = React.useRef(0)
    readingProgressRef.current = readingProgress

    const listElRef = React.useRef<HTMLElement | null>(null)
    const scrollContainerRef = React.useRef<HTMLElement | Window | null>(null)
    const offsetTopRef = React.useRef(offsetTop)
    offsetTopRef.current = offsetTop
    const boundsRef = React.useRef(bounds)
    boundsRef.current = bounds
    const onChangeRef = React.useRef(onChange)
    onChangeRef.current = onChange
    const onProgressRef = React.useRef(onProgress)
    onProgressRef.current = onProgress

    const resolveContainer = React.useCallback((): HTMLElement | Window | null => {
      if (typeof window === 'undefined') return null
      if (!scrollContainer) return window
      if (typeof scrollContainer === 'string') {
        return (document.querySelector(scrollContainer) as HTMLElement) ?? window
      }
      return scrollContainer
    }, [scrollContainer])

    const setActiveValue = React.useCallback((val: string) => {
      setInternalActive(val)
      onChangeRef.current?.(val)
    }, [])

    const scrollToHref = React.useCallback(
      (href: string) => {
        setActiveValue(href)
        const container = scrollContainerRef.current
        const offset = offsetTopRef.current
        const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const behavior: ScrollBehavior = smooth ? 'smooth' : 'auto'

        if (container && container !== window) {
          const cEl = container as HTMLElement
          const target = cEl.querySelector(href) as HTMLElement | null
          if (target) {
            const cRect = cEl.getBoundingClientRect()
            const tRect = target.getBoundingClientRect()
            const top = cEl.scrollTop + (tRect.top - cRect.top) - offset
            cEl.scrollTo({ top, behavior })
          }
        } else {
          const target = document.querySelector(href) as HTMLElement | null
          if (target) {
            const top = window.scrollY + target.getBoundingClientRect().top - offset
            window.scrollTo({ top, behavior })
          }
        }

        if (typeof history !== 'undefined') {
          history.replaceState(null, '', href)
        }
      },
      [setActiveValue],
    )

    const goToPrev = React.useCallback(() => {
      const list = Array.from(registeredItemsMap.current.values())
      const active = activeValueRef.current
      const idx = list.findIndex((i) => i.value === active || i.value.replace(/^#/, '') === active.replace(/^#/, ''))
      if (idx > 0 && list[idx - 1]) {
        scrollToHref(list[idx - 1]!.value)
      }
    }, [scrollToHref])

    const goToNext = React.useCallback(() => {
      const list = Array.from(registeredItemsMap.current.values())
      const active = activeValueRef.current
      const idx = list.findIndex((i) => i.value === active || i.value.replace(/^#/, '') === active.replace(/^#/, ''))
      if (idx >= 0 && idx < list.length - 1 && list[idx + 1]) {
        scrollToHref(list[idx + 1]!.value)
      }
    }, [scrollToHref])

    const getListEl = React.useCallback(() => listElRef.current, [])
    const setListEl = React.useCallback((el: HTMLElement | null) => {
      listElRef.current = el
    }, [])

    // Scroll spy and progress tracking
    const recomputeActive = React.useCallback(() => {
      const container = scrollContainerRef.current
      const currentItems = Array.from(registeredItemsMap.current.values())
      if (!container || currentItems.length === 0) return

      const isWin = container === window
      let currentScroll = 0
      let maxScroll = 0

      if (isWin) {
        currentScroll = window.scrollY
        maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      } else {
        const cEl = container as HTMLElement
        currentScroll = cEl.scrollTop
        maxScroll = Math.max(1, cEl.scrollHeight - cEl.clientHeight)
      }

      const prog = Math.min(1, Math.max(0, currentScroll / maxScroll))
      setReadingProgress(prog)
      onProgressRef.current?.(prog)

      const containerTop = isWin ? 0 : (container as HTMLElement).getBoundingClientRect().top
      const triggerThreshold = containerTop + offsetTopRef.current + boundsRef.current + 40

      let currentTarget = ''

      for (const item of currentItems) {
        const selector = item.value.startsWith('#') ? item.value : `#${item.value}`
        const target = isWin ? document.querySelector(selector) : (container as HTMLElement).querySelector(selector)

        if (!target) continue
        const targetRect = target.getBoundingClientRect()
        if (targetRect.top <= triggerThreshold) {
          currentTarget = item.value
        } else if (currentTarget) {
          break
        }
      }

      const atBottom = isWin
        ? document.documentElement.scrollHeight > window.innerHeight &&
          window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 6
        : (container as HTMLElement).scrollHeight > (container as HTMLElement).clientHeight &&
          (container as HTMLElement).scrollTop + (container as HTMLElement).clientHeight >=
            (container as HTMLElement).scrollHeight - 6

      if (atBottom && currentItems.length > 0) {
        currentTarget = currentItems[currentItems.length - 1]!.value
      }

      if (!currentTarget && currentItems.length > 0) {
        currentTarget = currentItems[0]!.value
      }

      if (currentTarget && currentTarget !== activeValueRef.current) {
        setActiveValue(currentTarget)
      }
    }, [setActiveValue])

    React.useEffect(() => {
      scrollContainerRef.current = resolveContainer()
      const c = scrollContainerRef.current
      if (!c) return

      let raf = 0
      const onScroll = () => {
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(recomputeActive)
      }

      c.addEventListener('scroll', onScroll, { passive: true })
      recomputeActive()
      const t = setTimeout(recomputeActive, 100)

      return () => {
        cancelAnimationFrame(raf)
        clearTimeout(t)
        c.removeEventListener('scroll', onScroll)
      }
    }, [resolveContainer, recomputeActive])

    const isItemActive = React.useCallback(
      (val: string) => {
        if (!val || !activeValue) return false
        const cleanVal = val.replace(/^#/, '')
        const cleanActive = activeValue.replace(/^#/, '')
        return cleanVal === cleanActive
      },
      [activeValue],
    )

    const isItemParentActive = React.useCallback(
      (val: string) => {
        if (!highlightParent || !val || !activeValue) return false
        const cleanVal = val.replace(/^#/, '')
        const cleanActive = activeValue.replace(/^#/, '')
        if (cleanVal === cleanActive) return false

        const itemsList = getItems()
        const activeItem = itemsList.find((i) => i.value === activeValue || i.value.replace(/^#/, '') === cleanActive)
        let parent = activeItem?.parentValue
        while (parent) {
          if (parent === val || parent.replace(/^#/, '') === cleanVal) return true
          const pItem = itemsList.find(
            (i) => i.value === parent || i.value.replace(/^#/, '') === parent!.replace(/^#/, ''),
          )
          parent = pItem?.parentValue
        }
        return false
      },
      [highlightParent, activeValue, getItems],
    )

    const isItemScrolled = React.useCallback(
      (val: string) => {
        if (!keepScrolled) return false
        const itemsList = getItems()
        const cleanActive = activeValue.replace(/^#/, '')
        const activeIdx = itemsList.findIndex(
          (i) => i.value === activeValue || i.value.replace(/^#/, '') === cleanActive,
        )
        if (activeIdx < 0) return false
        const cleanVal = val.replace(/^#/, '')
        const idx = itemsList.findIndex((i) => i.value === val || i.value.replace(/^#/, '') === cleanVal)
        return idx >= 0 && idx <= activeIdx
      },
      [keepScrolled, activeValue, getItems],
    )

    const ctxValue = React.useMemo<ScrollSpyContextValue>(
      () => ({
        activeValue,
        setActiveValue,
        scrollProgress: readingProgress,
        registerItem,
        unregisterItem,
        getItems,
        variant: resolvedVariant,
        turn: resolvedTurn,
        indicator: resolvedIndicator,
        keepScrolled,
        highlightParent,
        lineWidth,
        resolvedLineWidth,
        color,
        position: resolvedPosition,
        railPosition: resolvedRailPosition,
        scrollContainerRef,
        offsetTopRef,
        getListEl,
        setListEl,
        subscribe,
        scrollToHref,
        goToPrev,
        goToNext,
        isItemActive,
        isItemParentActive,
        isItemScrolled,
      }),
      [
        activeValue,
        setActiveValue,
        readingProgress,
        registerItem,
        unregisterItem,
        getItems,
        resolvedVariant,
        resolvedTurn,
        resolvedIndicator,
        keepScrolled,
        highlightParent,
        lineWidth,
        resolvedLineWidth,
        color,
        resolvedPosition,
        resolvedRailPosition,
        getListEl,
        setListEl,
        subscribe,
        scrollToHref,
        goToPrev,
        goToNext,
        isItemActive,
        isItemParentActive,
        isItemScrolled,
      ],
    )

    const isTopOrBottom = resolvedPosition === 'top' || resolvedPosition === 'bottom'

    return (
      <ScrollSpyContext.Provider value={ctxValue}>
        <ScrollSpyItemDepthContext.Provider value={0}>
          <nav
            ref={forwardedRef}
            data-uipkge=""
            data-slot="scroll-spy"
            data-position={resolvedPosition}
            data-rail-position={resolvedRailPosition}
            data-variant={resolvedVariant}
            data-turn={resolvedTurn}
            data-indicator={resolvedIndicator}
            data-keep-scrolled={keepScrolled ? 'true' : undefined}
            data-highlight-parent={highlightParent ? 'true' : undefined}
            data-line-width={lineWidth}
            data-color={color}
            aria-label="Scroll spy navigation"
            className={cn(
              'relative flex text-sm',
              isTopOrBottom ? 'w-full flex-col' : 'flex-col',
              affix && (resolvedPosition === 'bottom' ? 'sticky bottom-4' : 'sticky'),
              className,
            )}
            style={affix && resolvedPosition !== 'bottom' ? { top: `${offsetTop}px`, ...style } : style}
            {...props}
          >
            {items && items.length > 0 ? (
              <>
                {resolvedPosition === 'top' && <ScrollSpyStepper />}
                {resolvedPosition !== 'top' && resolvedPosition !== 'bottom' && (
                  <>
                    {title && <ScrollSpyTitle>{title}</ScrollSpyTitle>}
                    <ScrollSpyList>
                      <ScrollSpyIndicator />
                      {items.map((item, itemIdx) => {
                        const prevHadChildren = Boolean(itemIdx > 0 && items[itemIdx - 1]?.children?.length)
                        return (
                          <React.Fragment key={item.href}>
                            <ScrollSpyItem
                              value={item.href}
                              depth={item.depth ?? 1}
                              className={prevHadChildren ? 'mt-2' : undefined}
                            >
                              <ScrollSpyLink href={item.href} title={item.title} />
                            </ScrollSpyItem>
                            {(item.children ?? []).map((child, childIdx) => {
                              const prevChildHadChildren = Boolean(
                                childIdx > 0 && item.children?.[childIdx - 1]?.children?.length,
                              )
                              return (
                                <React.Fragment key={child.href}>
                                  <ScrollSpyItem
                                    value={child.href}
                                    depth={child.depth ?? 2}
                                    className={childIdx === 0 || prevChildHadChildren ? 'mt-2' : undefined}
                                  >
                                    <ScrollSpyLink href={child.href} title={child.title} />
                                  </ScrollSpyItem>
                                  {(child.children ?? []).map((grandchild, gIdx) => (
                                    <ScrollSpyItem
                                      key={grandchild.href}
                                      value={grandchild.href}
                                      depth={grandchild.depth ?? 3}
                                      className={gIdx === 0 ? 'mt-2' : undefined}
                                    >
                                      <ScrollSpyLink href={grandchild.href} title={grandchild.title} />
                                    </ScrollSpyItem>
                                  ))}
                                </React.Fragment>
                              )
                            })}
                          </React.Fragment>
                        )
                      })}
                    </ScrollSpyList>
                  </>
                )}
                {resolvedPosition === 'bottom' && <ScrollSpyStepper />}
              </>
            ) : (
              children
            )}
          </nav>
        </ScrollSpyItemDepthContext.Provider>
      </ScrollSpyContext.Provider>
    )
  },
)
ScrollSpyRoot.displayName = 'ScrollSpyRoot'

export interface ScrollSpyTitleProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const ScrollSpyTitle = React.forwardRef<HTMLParagraphElement, ScrollSpyTitleProps>(
  ({ className, children, ...props }, ref) => {
    const ctx = React.useContext(ScrollSpyContext)
    const isRightRail = ctx?.position === 'left' && ctx?.railPosition === 'right'

    return (
      <p
        ref={ref}
        data-slot="scroll-spy-title"
        className={cn(
          'text-foreground mb-3 text-sm font-semibold tracking-tight',
          isRightRail && 'pr-3 text-right',
          className,
        )}
        {...props}
      >
        {children}
      </p>
    )
  },
)
ScrollSpyTitle.displayName = 'ScrollSpyTitle'

export interface ScrollSpyListProps extends React.HTMLAttributes<HTMLUListElement> {}

export const ScrollSpyList = React.forwardRef<HTMLUListElement, ScrollSpyListProps>(
  ({ className, children, ...props }, ref) => {
    const ctx = React.useContext(ScrollSpyContext)
    const localRef = React.useRef<HTMLUListElement | null>(null)

    React.useEffect(() => {
      if (localRef.current && ctx) {
        ctx.setListEl(localRef.current)
      }
    }, [ctx])

    const isStraight = ctx?.turn === 'straight'
    const isRightRail = ctx?.position === 'left' && ctx?.railPosition === 'right'

    return (
      <ul
        ref={(node) => {
          localRef.current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) ref.current = node
        }}
        data-slot="scroll-spy-list"
        style={{
          borderLeftWidth: isStraight && !isRightRail ? `${ctx?.resolvedLineWidth ?? 2.5}px` : undefined,
          borderRightWidth: isStraight && isRightRail ? `${ctx?.resolvedLineWidth ?? 2.5}px` : undefined,
          ...props.style,
        }}
        className={cn(
          'relative flex flex-col space-y-1 text-sm',
          isStraight && (isRightRail ? 'border-border border-r' : 'border-border border-l'),
          className,
        )}
        {...props}
      >
        {children}
      </ul>
    )
  },
)
ScrollSpyList.displayName = 'ScrollSpyList'

export interface ScrollSpyIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: ScrollSpyColor
}

export const ScrollSpyIndicator = React.forwardRef<HTMLDivElement, ScrollSpyIndicatorProps>(
  ({ className, color, ...props }, ref) => {
    const ctx = React.useContext(ScrollSpyContext)
    if (!ctx) throw new Error('ScrollSpyIndicator must be used inside <ScrollSpy>.')

    const resolvedColor = color ?? ctx.color ?? 'primary'
    const handleColor = resolveScrollSpyColor(resolvedColor)

    const measurePathRef = React.useRef<SVGPathElement | null>(null)
    const [trackPath, setTrackPath] = React.useState('')
    const [pathLength, setPathLength] = React.useState(0)
    const [activeStart, setActiveStart] = React.useState(0)
    const [activeEnd, setActiveEnd] = React.useState(0)
    const [activeMarker, setActiveMarker] = React.useState<Marker | null>(null)
    const [straightHighlight, setStraightHighlight] = React.useState({ top: 0, height: 0, visible: false })
    const [canAnimate, setCanAnimate] = React.useState(false)

    const enableAnimation = React.useCallback(() => {
      if (!canAnimate) {
        if (typeof requestAnimationFrame !== 'undefined') {
          requestAnimationFrame(() => {
            setCanAnimate(true)
          })
        } else {
          setCanAnimate(true)
        }
      }
    }, [canAnimate])

    const measureLength = React.useCallback((pathD: string): number => {
      const el = measurePathRef.current
      if (!el || !pathD) return 0
      el.setAttribute('d', pathD)
      if (typeof el.getTotalLength === 'function') {
        try {
          return el.getTotalLength()
        } catch {
          // ignore
        }
      }
      return 100
    }, [])

    const updateGeometry = React.useCallback(() => {
      const list = ctx.getListEl()
      if (!list) return
      const listRect = list.getBoundingClientRect()
      const validItems = ctx.getItems().filter((i) => i.el && i.el.isConnected)

      if (validItems.length === 0) {
        setTrackPath('')
        setPathLength(0)
        setActiveStart(0)
        setActiveEnd(0)
        setActiveMarker(null)
        setStraightHighlight({ top: 0, height: 0, visible: false })
        return
      }

      const isRightRail = ctx.position === 'left' && ctx.railPosition === 'right'
      const listWidth = listRect.width || 180

      const minDepth = Math.min(...validItems.map((i) => i.depth))
      const markers: Marker[] = []

      for (const item of validItems) {
        if (!item.el) continue
        const rect = item.el.getBoundingClientRect()
        const relDepth = Math.max(1, item.depth - minDepth + 1)
        const top = rect.top - listRect.top
        const bottom = rect.bottom - listRect.top
        markers.push({
          value: item.value,
          depth: item.depth,
          x: depthX(relDepth, isRightRail, listWidth),
          y: top + rect.height / 2,
          top,
          bottom,
        })
      }

      markers.sort((a, b) => a.y - b.y)
      if (markers.length === 0) return

      const first = markers[0]!
      const last = markers[markers.length - 1]!
      const activeIdx = markers.findIndex(
        (m) => m.value === ctx.activeValue || m.value.replace(/^#/, '') === ctx.activeValue.replace(/^#/, ''),
      )

      if (ctx.turn === 'straight') {
        const railX = isRightRail ? first.x : 1
        setTrackPath(`M ${railX} ${first.top} L ${railX} ${last.bottom}`)
        setPathLength(0)
        setActiveStart(0)
        setActiveEnd(0)

        if (ctx.indicator === 'progress') {
          const totalHeight = list.clientHeight || last.bottom - first.top
          setStraightHighlight({
            top: first.top,
            height: Math.max(0, totalHeight * ctx.scrollProgress),
            visible: true,
          })
          setActiveMarker(null)
          enableAnimation()
          return
        }

        if (activeIdx < 0) {
          setStraightHighlight({ top: 0, height: 0, visible: false })
          setActiveMarker(null)
          return
        }

        const active = markers[activeIdx]!
        setActiveMarker(active)

        const isFillMode = ctx.indicator === 'fill' || ctx.keepScrolled

        if (isFillMode) {
          setStraightHighlight({
            top: first.top,
            height: Math.max(active.bottom - first.top, 14),
            visible: true,
          })
        } else {
          setStraightHighlight({
            top: active.top,
            height: Math.max(active.bottom - active.top, 14),
            visible: true,
          })
        }
        enableAnimation()
        return
      }

      // Circuit Mode: sharp 45° angle or rounded curves
      const rounded = ctx.turn === 'rounded'
      const fullPath = buildCircuitPath(markers, markers.length - 1, rounded, 'bottom')
      setTrackPath(fullPath)
      setStraightHighlight({ top: 0, height: 0, visible: false })

      const total = measureLength(fullPath)
      setPathLength(total)

      if (total === 0) {
        setActiveStart(0)
        setActiveEnd(0)
        setActiveMarker(null)
        return
      }

      if (ctx.indicator === 'progress') {
        setActiveStart(0)
        setActiveEnd(total * ctx.scrollProgress)
        setActiveMarker(null)
        enableAnimation()
        return
      }

      if (activeIdx < 0) {
        setActiveStart(0)
        setActiveEnd(0)
        setActiveMarker(null)
        return
      }

      const active = markers[activeIdx]!
      setActiveMarker(active)

      const isFillMode = ctx.indicator === 'fill' || ctx.keepScrolled
      const startLen = isFillMode ? 0 : measureLength(buildCircuitPath(markers, activeIdx, rounded, 'top'))
      const endLen = measureLength(buildCircuitPath(markers, activeIdx, rounded, 'bottom'))

      setActiveStart(startLen)
      setActiveEnd(endLen)
      enableAnimation()
    }, [ctx, measureLength, enableAnimation])

    React.useEffect(() => {
      let raf = 0
      const schedule = () => {
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(updateGeometry)
      }
      schedule()
      const unsubscribe = ctx.subscribe(schedule)
      window.addEventListener('resize', schedule)
      return () => {
        cancelAnimationFrame(raf)
        unsubscribe()
        window.removeEventListener('resize', schedule)
      }
    }, [
      updateGeometry,
      ctx,
      ctx.activeValue,
      ctx.turn,
      ctx.indicator,
      ctx.keepScrolled,
      ctx.resolvedLineWidth,
      ctx.position,
      ctx.railPosition,
      ctx.scrollProgress,
    ])

    const isLeftWithRightRail = ctx.position === 'left' && ctx.railPosition === 'right'

    return (
      <div
        ref={ref}
        data-slot="scroll-spy-indicator"
        className={cn('pointer-events-none absolute inset-0 overflow-visible', className)}
        aria-hidden="true"
        {...props}
      >
        {ctx.turn !== 'straight' && (
          <svg className="absolute inset-0 size-full overflow-visible" fill="none">
            <path ref={measurePathRef} className="invisible" fill="none" />
            <path
              d={trackPath}
              className="stroke-border"
              strokeWidth={ctx.resolvedLineWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {trackPath && activeEnd > 0 && (
              <path
                d={trackPath}
                className={handleColor.strokeClass}
                strokeWidth={ctx.resolvedLineWidth}
                strokeLinecap="butt"
                strokeLinejoin="round"
                style={{
                  stroke: handleColor.customColor,
                  strokeDasharray: `${Math.max(activeEnd - activeStart, 0)} ${Math.max(pathLength, 1)}`,
                  strokeDashoffset: -activeStart,
                  transition:
                    canAnimate && ctx.indicator !== 'progress'
                      ? 'stroke-dashoffset 260ms cubic-bezier(0.16, 1, 0.3, 1), stroke-dasharray 260ms cubic-bezier(0.16, 1, 0.3, 1)'
                      : 'none',
                }}
              />
            )}
          </svg>
        )}

        {ctx.turn === 'straight' && straightHighlight.visible && (ctx.indicator !== 'segment' || ctx.keepScrolled) && (
          <div
            className={cn('absolute z-10 rounded-none', handleColor.bgClass)}
            style={{
              top: `${straightHighlight.top}px`,
              height: `${straightHighlight.height}px`,
              width: `${ctx.resolvedLineWidth}px`,
              backgroundColor: handleColor.customColor,
              left: isLeftWithRightRail ? undefined : `-${ctx.resolvedLineWidth}px`,
              right: isLeftWithRightRail ? `-${ctx.resolvedLineWidth}px` : undefined,
              transition:
                canAnimate && ctx.indicator !== 'progress'
                  ? 'top 260ms cubic-bezier(0.16, 1, 0.3, 1), height 260ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms ease-out'
                  : 'none',
            }}
          />
        )}
      </div>
    )
  },
)
ScrollSpyIndicator.displayName = 'ScrollSpyIndicator'

export interface ScrollSpyItemProps extends React.HTMLAttributes<HTMLLIElement> {
  value: string
  title?: string
  depth?: number
}

export const ScrollSpyItem = React.forwardRef<HTMLLIElement, ScrollSpyItemProps>(
  ({ value, title, depth, className, children, ...props }, ref) => {
    const ctx = React.useContext(ScrollSpyContext)
    const parentDepth = React.useContext(ScrollSpyItemDepthContext)
    const computedDepth = depth ?? parentDepth + 1

    const localRef = React.useRef<HTMLLIElement | null>(null)

    React.useEffect(() => {
      if (!ctx) return
      ctx.registerItem({
        value,
        title,
        depth: computedDepth,
        el: localRef.current,
      })
      return () => {
        ctx.unregisterItem(value)
      }
    }, [value, title, computedDepth])

    return (
      <ScrollSpyItemDepthContext.Provider value={computedDepth}>
        <li
          ref={(node) => {
            localRef.current = node
            if (typeof ref === 'function') ref(node)
            else if (ref) ref.current = node
          }}
          data-slot="scroll-spy-item"
          data-depth={computedDepth}
          className={cn('relative flex flex-col', className)}
          {...props}
        >
          {children}
        </li>
      </ScrollSpyItemDepthContext.Provider>
    )
  },
)
ScrollSpyItem.displayName = 'ScrollSpyItem'

export interface ScrollSpyLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  title?: string
  depth?: number
}

export const ScrollSpyLink = React.forwardRef<HTMLAnchorElement, ScrollSpyLinkProps>(
  ({ href, title, depth, className, children, style, onClick: userOnClick, ...props }, ref) => {
    const ctx = React.useContext(ScrollSpyContext)
    const itemDepth = React.useContext(ScrollSpyItemDepthContext)
    const selfDepth = depth ?? itemDepth ?? 1

    const isActive = ctx ? ctx.isItemActive(href) : false
    const isParentActive = ctx ? ctx.isItemParentActive(href) : false
    const isScrolled = ctx ? ctx.isItemScrolled(href) : false

    const isCircuit = ctx?.turn !== 'straight'
    const isLeftWithRightRail = ctx?.position === 'left' && ctx?.railPosition === 'right'

    const hasIndicatorBar = ctx?.turn === 'straight' && (ctx?.indicator !== 'segment' || ctx?.keepScrolled)
    const handleColor = resolveScrollSpyColor(ctx?.color ?? 'primary')

    const borderActiveClass = hasIndicatorBar
      ? isActive || isParentActive
        ? 'text-foreground font-medium'
        : isScrolled
          ? 'text-foreground/85'
          : 'text-muted-foreground hover:text-foreground'
      : isActive
        ? cn(handleColor.borderClass, 'text-foreground font-medium')
        : isParentActive
          ? 'border-border/50 text-foreground font-medium'
          : isScrolled
            ? 'border-border/70 text-foreground/85'
            : 'text-muted-foreground hover:border-foreground/40 hover:text-foreground'

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      userOnClick?.(e)
      if (e.defaultPrevented) return
      e.preventDefault()
      if (!ctx) return
      ctx.scrollToHref(href)
    }

    const linkBorderActiveStyle =
      !isCircuit && !hasIndicatorBar && (isActive || isParentActive || isScrolled)
        ? {
            borderLeftWidth: isLeftWithRightRail ? undefined : `${ctx?.resolvedLineWidth ?? 2.5}px`,
            borderRightWidth: isLeftWithRightRail ? `${ctx?.resolvedLineWidth ?? 2.5}px` : undefined,
            marginLeft: isLeftWithRightRail ? undefined : `-${ctx?.resolvedLineWidth ?? 2.5}px`,
            marginRight: isLeftWithRightRail ? `-${ctx?.resolvedLineWidth ?? 2.5}px` : undefined,
            borderColor: isActive ? handleColor.customColor : undefined,
          }
        : undefined

    return (
      <a
        ref={ref}
        href={href}
        data-slot="scroll-spy-link"
        aria-current={isActive ? 'location' : undefined}
        data-active={isActive ? 'true' : 'false'}
        data-parent-active={isParentActive ? 'true' : 'false'}
        data-scrolled={isScrolled ? 'true' : 'false'}
        data-depth={selfDepth}
        style={{ ...linkBorderActiveStyle, ...style }}
        className={cn(
          'group block rounded-none leading-snug no-underline transition-[color,border-color,background-color,opacity,border-width,margin] duration-200 ease-out',
          'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          isCircuit
            ? [
                'py-1',
                isLeftWithRightRail
                  ? [
                      'text-right',
                      selfDepth <= 1 && 'pr-4 pl-2 text-sm',
                      selfDepth === 2 && 'pr-7 pl-2 text-xs',
                      selfDepth === 3 && 'pr-10 pl-2 text-xs',
                      selfDepth >= 4 && 'pr-12 pl-2 text-xs',
                    ]
                  : [
                      selfDepth <= 1 && 'pr-2 pl-4 text-sm',
                      selfDepth === 2 && 'pr-2 pl-7 text-xs',
                      selfDepth === 3 && 'pr-2 pl-10 text-xs',
                      selfDepth >= 4 && 'pr-2 pl-12 text-xs',
                    ],
                isActive || isParentActive
                  ? 'text-foreground font-medium'
                  : isScrolled
                    ? 'text-foreground/85'
                    : 'text-muted-foreground hover:text-foreground',
              ]
            : isLeftWithRightRail
              ? [
                  '-mr-px border-r border-transparent py-0.5 pr-3 pl-2 text-right',
                  selfDepth <= 1 && 'text-sm',
                  selfDepth === 2 && 'pr-6 text-xs',
                  selfDepth === 3 && 'pr-9 text-xs',
                  selfDepth >= 4 && 'pr-11 text-xs',
                  borderActiveClass,
                ]
              : [
                  '-ml-px border-l border-transparent py-0.5 pr-2 pl-3',
                  selfDepth <= 1 && 'text-sm',
                  selfDepth === 2 && 'pl-6 text-xs',
                  selfDepth === 3 && 'pl-9 text-xs',
                  selfDepth >= 4 && 'pl-11 text-xs',
                  borderActiveClass,
                ],
          className,
        )}
        onClick={handleClick}
        {...props}
      >
        {children ?? title}
      </a>
    )
  },
)
ScrollSpyLink.displayName = 'ScrollSpyLink'

export interface ScrollSpyStepperProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ScrollSpyStepper = React.forwardRef<HTMLDivElement, ScrollSpyStepperProps>(
  ({ className, ...props }, ref) => {
    const ctx = React.useContext(ScrollSpyContext)
    if (!ctx) throw new Error('ScrollSpyStepper must be used inside <ScrollSpy>.')

    const items = ctx.getItems()
    const activeValue = ctx.activeValue
    const activeIndex = Math.max(
      0,
      items.findIndex((i) => i.value === activeValue || i.value.replace(/^#/, '') === activeValue.replace(/^#/, '')),
    )
    const activeItem = items[activeIndex]
    const activeTitle = activeItem
      ? activeItem.title ||
        activeItem.value
          .replace(/^#/, '')
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase())
      : ''

    if (ctx.position === 'top') {
      const isScrollSpy =
        ctx.variant === 'scrollspy' ||
        ctx.variant === 'tabs' ||
        ctx.variant === 'pills' ||
        ctx.indicator === 'pill' ||
        ctx.indicator === 'dot'

      if (isScrollSpy) {
        return (
          <div
            ref={ref}
            data-slot="scroll-spy-top"
            className={cn(
              'border-border/70 bg-card/85 scrollbar-none relative sticky top-0 z-20 flex w-full items-center gap-1 overflow-x-auto rounded-xl border p-1.5 shadow-xs backdrop-blur-md',
              className,
            )}
            {...props}
          >
            {items.map((item, idx) => {
              const isCurrent = idx === activeIndex
              const label =
                item.title ||
                item.value
                  .replace(/^#/, '')
                  .replace(/[-_]/g, ' ')
                  .replace(/\b\w/g, (c) => c.toUpperCase())

              return (
                <button
                  key={item.value}
                  type="button"
                  data-active={isCurrent ? 'true' : 'false'}
                  className={cn(
                    'group relative flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 outline-none select-none',
                    'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-1 active:scale-[0.98]',
                    isCurrent
                      ? 'bg-primary/10 text-primary font-semibold shadow-2xs'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                  )}
                  onClick={() => ctx.scrollToHref(item.value)}
                >
                  {isCurrent && (
                    <span className="bg-primary animate-in fade-in zoom-in-75 size-1.5 shrink-0 rounded-full duration-150" />
                  )}
                  <span className="truncate">{label}</span>
                </button>
              )
            })}

            <div className="bg-border/20 absolute inset-x-0 bottom-0 h-0.5 overflow-hidden rounded-b-xl">
              <div
                className="bg-primary h-full transition-[width] duration-150 ease-out"
                style={{ width: `${Math.round(ctx.scrollProgress * 100)}%` }}
              />
            </div>
          </div>
        )
      }

      return (
        <div
          ref={ref}
          data-slot="scroll-spy-stepper-top"
          className={cn(
            'border-border/70 bg-card/85 scrollbar-none sticky top-0 z-20 flex w-full items-center gap-1.5 overflow-x-auto rounded-xl border p-2 shadow-xs backdrop-blur-md',
            className,
          )}
          {...props}
        >
          {items.map((item, idx) => {
            const isCurrent = idx === activeIndex
            const isCompleted = idx < activeIndex
            const label =
              item.title ||
              item.value
                .replace(/^#/, '')
                .replace(/[-_]/g, ' ')
                .replace(/\b\w/g, (c) => c.toUpperCase())

            return (
              <React.Fragment key={item.value}>
                <button
                  type="button"
                  data-active={isCurrent ? 'true' : 'false'}
                  className={cn(
                    'group flex shrink-0 items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium transition-[color,background-color,transform] duration-150 outline-none select-none',
                    'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-1 active:scale-[0.98]',
                    isCurrent
                      ? 'bg-primary/10 text-foreground font-medium shadow-2xs'
                      : isCompleted
                        ? 'text-foreground/80 hover:bg-muted/50'
                        : 'text-muted-foreground hover:bg-muted/30 hover:text-foreground',
                  )}
                  onClick={() => ctx.scrollToHref(item.value)}
                >
                  <span
                    className={cn(
                      'flex size-5 shrink-0 items-center justify-center rounded-full font-mono text-[10px] transition-all duration-200',
                      isCurrent
                        ? 'bg-primary text-primary-foreground scale-105 font-semibold shadow-2xs'
                        : isCompleted
                          ? 'bg-primary/15 text-primary font-medium'
                          : 'bg-muted text-muted-foreground/70',
                    )}
                  >
                    {isCompleted ? (
                      <svg className="size-3 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    ) : (
                      idx + 1
                    )}
                  </span>
                  <span className="max-w-[120px] truncate">{label}</span>
                </button>

                {idx < items.length - 1 && (
                  <div
                    className={cn(
                      'bg-border/70 h-0.5 max-w-10 min-w-4 flex-1 rounded-full transition-colors duration-200',
                      isCompleted && 'bg-primary',
                    )}
                  />
                )}
              </React.Fragment>
            )
          })}
        </div>
      )
    }

    if (ctx.position === 'bottom') {
      return (
        <div
          ref={ref}
          data-slot="scroll-spy-stepper-bottom"
          className={cn(
            'border-border/80 bg-background/95 sticky bottom-3 z-30 mx-auto flex items-center gap-2 rounded-full border px-3 py-1.5 shadow-md backdrop-blur-md select-none',
            className,
          )}
          {...props}
        >
          <button
            type="button"
            aria-label="Previous section"
            disabled={activeIndex <= 0}
            className="text-muted-foreground hover:bg-muted/80 hover:text-foreground flex size-7 items-center justify-center rounded-full transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-25"
            onClick={ctx.goToPrev}
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <div className="flex items-center gap-1.5 px-1">
            {items.map((item, idx) => (
              <button
                key={item.value}
                type="button"
                aria-label={`Jump to section ${idx + 1}`}
                className={cn(
                  'h-1.5 cursor-pointer rounded-full transition-all duration-200',
                  idx === activeIndex
                    ? 'bg-primary w-5'
                    : idx < activeIndex
                      ? 'bg-primary/40 hover:bg-primary/60 w-2'
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50 w-2',
                )}
                onClick={() => ctx.scrollToHref(item.value)}
              />
            ))}
          </div>

          <div className="border-border/60 flex items-center gap-2 border-l pl-2">
            <span className="text-foreground max-w-[130px] truncate text-xs font-medium tracking-tight">
              {activeTitle}
            </span>
            <span className="bg-muted text-muted-foreground rounded-md px-1.5 py-0.5 font-mono text-[10px] tabular-nums">
              {Math.round(ctx.scrollProgress * 100)}%
            </span>
          </div>

          <button
            type="button"
            aria-label="Next section"
            disabled={activeIndex >= items.length - 1}
            className="text-muted-foreground hover:bg-muted/80 hover:text-foreground flex size-7 items-center justify-center rounded-full transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-25"
            onClick={ctx.goToNext}
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      )
    }

    return null
  },
)
ScrollSpyStepper.displayName = 'ScrollSpyStepper'

// Compound ScrollSpy with attached static subcomponents
export const ScrollSpy = Object.assign(ScrollSpyRoot, {
  Root: ScrollSpyRoot,
  Title: ScrollSpyTitle,
  List: ScrollSpyList,
  Indicator: ScrollSpyIndicator,
  Item: ScrollSpyItem,
  Link: ScrollSpyLink,
  Stepper: ScrollSpyStepper,
})

export default ScrollSpy
