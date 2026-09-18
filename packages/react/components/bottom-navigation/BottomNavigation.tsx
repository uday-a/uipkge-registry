'use client'

import * as React from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BottomNavItem {
  /** Unique value identifying this tab. Used with value/defaultValue. */
  value: string
  /** Label shown under the icon. */
  label: string
  /** Lucide icon component. */
  icon: LucideIcon
  /** Optional badge count or text shown on the icon. */
  badge?: string | number
  /** Link destination (renders an anchor instead of a button). */
  to?: string
}

export interface BottomNavigationProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onSelect'> {
  /** Tab items. */
  items: BottomNavItem[]
  /** Active item value (controlled). */
  value?: string
  /** Initial active item value (uncontrolled). */
  defaultValue?: string
  /** Active item color — a Tailwind text color class. Default 'text-primary'. */
  activeColor?: string
  /** Fixed positioning at the viewport bottom. Default true. */
  fixed?: boolean
  /** Show a sliding active indicator pill behind the icon. Default true. */
  showIndicator?: boolean
  /** Safe-area padding for notched devices (iOS). Default true. */
  safeArea?: boolean
  /** Called when the active item changes. */
  onValueChange?: (value: string) => void
  /** Called when an item is selected, receiving the full item. */
  onSelect?: (item: BottomNavItem) => void
}

const BottomNavigation = React.forwardRef<HTMLElement, BottomNavigationProps>(
  (
    {
      className,
      items,
      value,
      defaultValue = '',
      activeColor = 'text-primary',
      fixed = true,
      showIndicator = true,
      safeArea = true,
      onValueChange,
      onSelect,
      ...props
    },
    ref,
  ) => {
    const isControlled = value !== undefined
    const [internal, setInternal] = React.useState(defaultValue)
    const active = isControlled ? value : internal

    const navRef = React.useRef<HTMLElement | null>(null)
    const firstPosition = React.useRef(true)
    const [indicatorStyle, setIndicatorStyle] = React.useState<React.CSSProperties>({ opacity: 0 })

    const setRefs = React.useCallback(
      (node: HTMLElement | null) => {
        navRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = node
      },
      [ref],
    )

    const motionSafeTransition = React.useCallback(() => {
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return 'none'
      }
      return firstPosition.current
        ? 'none'
        : 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1), width 220ms cubic-bezier(0.22, 1, 0.36, 1), height 220ms cubic-bezier(0.22, 1, 0.36, 1)'
    }, [])

    const updateIndicator = React.useCallback(() => {
      if (!showIndicator) return
      const root = navRef.current
      if (!root) return

      const activeItem = root.querySelector<HTMLElement>('[data-slot="bottom-navigation-item"][data-active]')
      if (!activeItem) {
        setIndicatorStyle({ opacity: 0 })
        return
      }

      const iconWrap = activeItem.querySelector<HTMLElement>('[data-slot="bottom-navigation-icon"]') ?? activeItem
      const rootRect = root.getBoundingClientRect()
      const iconRect = iconWrap.getBoundingClientRect()

      // Compact pill centered on the icon — fixed height keeps motion light; width tracks icon + pad.
      const padX = 14
      const pillH = 32
      const pillW = Math.max(iconRect.width + padX * 2, 56)
      const left = iconRect.left - rootRect.left + root.scrollLeft + (iconRect.width - pillW) / 2
      const top = iconRect.top - rootRect.top + root.scrollTop + (iconRect.height - pillH) / 2
      const transition = motionSafeTransition()

      setIndicatorStyle({
        width: pillW,
        height: pillH,
        transform: `translate3d(${left}px, ${top}px, 0)`,
        opacity: 1,
        transition,
      })
      firstPosition.current = false
    }, [motionSafeTransition, showIndicator])

    // Track item identity so layout swaps remount without a false slide.
    const itemsKey = items.map((i) => i.value).join('\0')
    const prevItemsKey = React.useRef(itemsKey)
    const prevShowIndicator = React.useRef(showIndicator)

    React.useLayoutEffect(() => {
      if (prevItemsKey.current !== itemsKey || prevShowIndicator.current !== showIndicator) {
        firstPosition.current = true
        prevItemsKey.current = itemsKey
        prevShowIndicator.current = showIndicator
      }

      if (!showIndicator) {
        setIndicatorStyle({ opacity: 0 })
        return
      }

      updateIndicator()
      const root = navRef.current
      if (!root) return

      const ro = new ResizeObserver(() => updateIndicator())
      ro.observe(root)
      root.querySelectorAll('[data-slot="bottom-navigation-item"]').forEach((el) => ro.observe(el))

      return () => {
        ro.disconnect()
      }
    }, [active, itemsKey, showIndicator, updateIndicator])

    const handleSelect = (item: BottomNavItem) => {
      if (!isControlled) setInternal(item.value)
      onValueChange?.(item.value)
      onSelect?.(item)
    }

    return (
      <nav
        data-uipkge=""
        data-slot="bottom-navigation"
        aria-label="Bottom navigation"
        data-fixed={fixed ? '' : undefined}
        ref={setRefs}
        className={cn(
          'border-border bg-background/95 z-50 flex items-stretch justify-around border-t backdrop-blur-sm',
          // fixed establishes the containing block for the absolute indicator; relative when in-flow
          fixed ? 'fixed inset-x-0 bottom-0' : 'relative',
          safeArea && 'pb-[env(safe-area-inset-bottom)]',
          className,
        )}
        {...props}
      >
        {showIndicator ? (
          <span
            data-slot="bottom-navigation-indicator"
            aria-hidden="true"
            className="bg-primary/10 pointer-events-none absolute top-0 left-0 z-0 rounded-full will-change-transform"
            style={indicatorStyle}
          />
        ) : null}

        {items.map((item) => {
          const isActive = active === item.value
          const Icon = item.icon
          const itemClass = cn(
            'focus-visible:ring-ring/50 relative z-10 flex min-h-12 flex-1 flex-col items-center justify-center gap-0.5 pt-2 pb-1.5 text-xs transition-colors duration-200 outline-none focus-visible:ring-[3px] motion-reduce:transition-none',
            isActive ? activeColor : 'text-muted-foreground hover:text-foreground',
          )
          const inner = (
            <>
              <span data-slot="bottom-navigation-icon" className="relative flex items-center justify-center">
                <Icon
                  className={cn(
                    'size-5 transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none',
                    isActive ? 'scale-110' : 'scale-100',
                  )}
                />
                {item.badge !== undefined && item.badge !== '' ? (
                  <span className="bg-destructive text-destructive-foreground absolute -top-1.5 -right-2 flex min-w-4 items-center justify-center rounded-full px-1 text-xs leading-4 font-medium">
                    {item.badge}
                  </span>
                ) : null}
              </span>
              <span
                className={cn(
                  'max-w-full truncate px-1 transition-[opacity,font-weight] duration-200 motion-reduce:transition-none',
                  isActive ? 'font-medium' : 'font-normal',
                )}
              >
                {item.label}
              </span>
            </>
          )
          if (item.to) {
            return (
              <a
                key={item.value}
                data-slot="bottom-navigation-item"
                data-active={isActive ? '' : undefined}
                aria-current={isActive ? 'page' : undefined}
                href={item.to}
                className={itemClass}
                onClick={(e) => {
                  // Let the browser handle the navigation; still notify state.
                  handleSelect(item)
                  // Consumers using a router can call preventDefault in onSelect.
                  if (e.defaultPrevented) return
                }}
              >
                {inner}
              </a>
            )
          }
          return (
            <button
              key={item.value}
              data-slot="bottom-navigation-item"
              data-active={isActive ? '' : undefined}
              aria-current={isActive ? 'page' : undefined}
              type="button"
              className={itemClass}
              onClick={() => handleSelect(item)}
            >
              {inner}
            </button>
          )
        })}
      </nav>
    )
  },
)
BottomNavigation.displayName = 'BottomNavigation'

export { BottomNavigation }
