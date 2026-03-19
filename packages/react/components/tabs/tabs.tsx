'use client'

import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'
import { tabsListVariants, tabsTriggerVariants } from './tabs.variants'

// Make orientation reachable from descendants without each consumer having to
// pass it manually. TabsList / TabsTrigger read this to apply variant CSS.
const TabsOrientationContext = React.createContext<'horizontal' | 'vertical'>('horizontal')

export interface TabsProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {
  orientation?: 'horizontal' | 'vertical'
}

const Tabs = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Root>, TabsProps>(
  ({ className, orientation = 'horizontal', ...props }, ref) => (
    <TabsOrientationContext.Provider value={orientation}>
      <TabsPrimitive.Root
        ref={ref}
        data-uipkge=""
        data-slot="tabs"
        data-orientation={orientation}
        orientation={orientation}
        className={cn('flex w-full', orientation === 'vertical' ? 'flex-row gap-4' : 'flex-col gap-2', className)}
        {...props}
      />
    </TabsOrientationContext.Provider>
  ),
)
Tabs.displayName = 'Tabs'

export interface TabsListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  variant?: 'segmented' | 'pill' | 'underline'
  orientation?: 'horizontal' | 'vertical'
  /** Enable sliding active indicator (default true). When false, active surface paints on the trigger. */
  animated?: boolean
}

const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, TabsListProps>(
  ({ className, variant = 'segmented', orientation, animated = true, children, ...props }, ref) => {
    const inherited = React.useContext(TabsOrientationContext)
    const effectiveOrientation = orientation ?? inherited
    const listRef = React.useRef<HTMLDivElement | null>(null)
    const firstPosition = React.useRef(true)
    const [indicatorStyle, setIndicatorStyle] = React.useState<React.CSSProperties>({ opacity: 0 })

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        listRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
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
      if (!animated) return
      const root = listRef.current
      if (!root) return
      const active = root.querySelector<HTMLElement>('[data-slot="tabs-trigger"][data-state="active"]')
      if (!active) {
        setIndicatorStyle({ opacity: 0 })
        return
      }

      const listRect = root.getBoundingClientRect()
      const activeRect = active.getBoundingClientRect()
      const left = activeRect.left - listRect.left + root.scrollLeft
      const top = activeRect.top - listRect.top + root.scrollTop
      const transition = motionSafeTransition()

      if (variant === 'underline') {
        const thickness = 2
        if (effectiveOrientation === 'vertical') {
          setIndicatorStyle({
            width: thickness,
            height: activeRect.height,
            transform: `translate3d(${listRect.width - thickness}px, ${top}px, 0)`,
            opacity: 1,
            transition,
          })
        } else {
          setIndicatorStyle({
            width: activeRect.width,
            height: thickness,
            transform: `translate3d(${left}px, ${listRect.height - thickness}px, 0)`,
            opacity: 1,
            transition,
          })
        }
      } else {
        setIndicatorStyle({
          width: activeRect.width,
          height: activeRect.height,
          transform: `translate3d(${left}px, ${top}px, 0)`,
          opacity: 1,
          transition,
        })
      }
      firstPosition.current = false
    }, [animated, effectiveOrientation, motionSafeTransition, variant])

    // Bind observers once per animated/variant/orientation — NOT on every children identity
    // change (controlled tabs re-render parents constantly and would kill the slide).
    React.useLayoutEffect(() => {
      firstPosition.current = true
      if (!animated) {
        setIndicatorStyle({ opacity: 0 })
        return
      }
      updateIndicator()
      const root = listRef.current
      if (!root) return

      const ro = new ResizeObserver(() => updateIndicator())
      ro.observe(root)
      root.querySelectorAll('[data-slot="tabs-trigger"]').forEach((el) => ro.observe(el))

      const mo = new MutationObserver((mutations) => {
        for (const m of mutations) {
          if (m.type === 'childList') {
            root.querySelectorAll('[data-slot="tabs-trigger"]').forEach((el) => ro.observe(el))
          }
        }
        updateIndicator()
      })
      mo.observe(root, {
        attributes: true,
        attributeFilter: ['data-state'],
        subtree: true,
        childList: true,
      })

      return () => {
        ro.disconnect()
        mo.disconnect()
      }
    }, [animated, effectiveOrientation, updateIndicator, variant])

    const indicatorClass =
      variant === 'pill'
        ? 'pointer-events-none absolute top-0 left-0 z-0 rounded-full bg-primary shadow-xs will-change-transform'
        : variant === 'underline'
          ? 'pointer-events-none absolute top-0 left-0 z-0 bg-foreground will-change-transform'
          : 'pointer-events-none absolute top-0 left-0 z-0 rounded-sm bg-background shadow-xs will-change-transform'

    return (
      <TabsPrimitive.List
        ref={setRefs}
        data-uipkge=""
        data-slot="tabs-list"
        data-animated={animated ? 'true' : 'false'}
        className={cn(
          'group/list relative',
          tabsListVariants({ variant, orientation: effectiveOrientation }),
          className,
        )}
        {...props}
      >
        {animated && (
          <span data-slot="tabs-indicator" aria-hidden="true" className={indicatorClass} style={indicatorStyle} />
        )}
        {children}
      </TabsPrimitive.List>
    )
  },
)
TabsList.displayName = 'TabsList'

export interface TabsTriggerProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  size?: 'default' | 'sm' | 'lg'
  variant?: 'segmented' | 'pill' | 'underline'
  orientation?: 'horizontal' | 'vertical'
}

const TabsTrigger = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Trigger>, TabsTriggerProps>(
  ({ className, size, variant, orientation, ...props }, ref) => {
    const inherited = React.useContext(TabsOrientationContext)
    const effectiveOrientation = orientation ?? inherited
    return (
      <TabsPrimitive.Trigger
        ref={ref}
        data-uipkge=""
        data-slot="tabs-trigger"
        className={cn(tabsTriggerVariants({ size, variant, orientation: effectiveOrientation }), className)}
        {...props}
      />
    )
  },
)
TabsTrigger.displayName = 'TabsTrigger'

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    data-uipkge=""
    data-slot="tabs-content"
    className={cn(
      'ring-offset-background focus-visible:border-ring focus-visible:ring-ring/50 motion-safe:data-[state=active]:animate-in motion-safe:data-[state=active]:fade-in-0 flex-1 focus-visible:ring-2 focus-visible:ring-[3px] focus-visible:outline-none motion-safe:data-[state=active]:duration-200',
      className,
    )}
    {...props}
  />
))
TabsContent.displayName = 'TabsContent'

export { Tabs, TabsList, TabsTrigger, TabsContent }
