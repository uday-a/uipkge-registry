'use client'

import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

const VerticalTabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Root
    ref={ref}
    data-uipkge=""
    data-slot="vertical-tabs"
    orientation="vertical"
    className={cn('flex w-full gap-6', className)}
    {...props}
  />
))
VerticalTabs.displayName = 'VerticalTabs'

export interface VerticalTabsListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  /** Enable sliding active indicator (default true). When false, active chrome paints on the trigger. */
  animated?: boolean
}

const VerticalTabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, VerticalTabsListProps>(
  ({ className, animated = true, children, ...props }, ref) => {
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
      const active = root.querySelector<HTMLElement>('[data-slot="vertical-tabs-trigger"][data-state="active"]')
      if (!active) {
        setIndicatorStyle({ opacity: 0 })
        return
      }

      const listRect = root.getBoundingClientRect()
      const activeRect = active.getBoundingClientRect()
      const left = activeRect.left - listRect.left + root.scrollLeft
      const top = activeRect.top - listRect.top + root.scrollTop
      const transition = motionSafeTransition()

      // Full active surface slides (muted pill); primary rail is nested absolute so it stays inset-y-1.
      setIndicatorStyle({
        width: activeRect.width,
        height: activeRect.height,
        transform: `translate3d(${left}px, ${top}px, 0)`,
        opacity: 1,
        transition,
      })
      firstPosition.current = false
    }, [animated, motionSafeTransition])

    // Bind observers once per animated flip — NOT on every children identity change
    // (controlled tabs re-render parents constantly and would kill the slide).
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
      root.querySelectorAll('[data-slot="vertical-tabs-trigger"]').forEach((el) => ro.observe(el))

      const mo = new MutationObserver((mutations) => {
        for (const m of mutations) {
          if (m.type === 'childList') {
            root.querySelectorAll('[data-slot="vertical-tabs-trigger"]').forEach((el) => ro.observe(el))
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
    }, [animated, updateIndicator])

    return (
      <TabsPrimitive.List
        ref={setRefs}
        data-uipkge=""
        data-slot="vertical-tabs-list"
        data-animated={animated ? 'true' : 'false'}
        className={cn('group/list border-border relative flex w-56 shrink-0 flex-col gap-0.5 border-r pr-3', className)}
        {...props}
      >
        {animated && (
          <span
            data-slot="vertical-tabs-indicator"
            aria-hidden="true"
            className="bg-muted pointer-events-none absolute top-0 left-0 z-0 rounded-md will-change-transform"
            style={indicatorStyle}
          >
            {/* Primary rail stays inset relative to the sliding surface (matches prior trigger chrome). */}
            <span className="bg-primary absolute inset-y-1 left-0 w-0.5 rounded-full" />
          </span>
        )}
        {children}
      </TabsPrimitive.List>
    )
  },
)
VerticalTabsList.displayName = 'VerticalTabsList'

export interface VerticalTabsSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
}

const VerticalTabsSection = React.forwardRef<HTMLDivElement, VerticalTabsSectionProps>(
  ({ className, label, ...props }, ref) => (
    <div
      ref={ref}
      data-uipkge=""
      data-slot="vertical-tabs-section"
      className={cn(
        'text-muted-foreground mt-3 mb-1 px-2 text-xs font-medium tracking-wider uppercase first:mt-0',
        className,
      )}
      {...props}
    >
      {label}
    </div>
  ),
)
VerticalTabsSection.displayName = 'VerticalTabsSection'

const VerticalTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    data-uipkge=""
    data-slot="vertical-tabs-trigger"
    className={cn(
      // z-10 keeps label above the sliding indicator; active surface paints on the list
      // indicator when the parent list has data-animated="true". Static active chrome
      // restores when data-animated="false" (group-data variants below).
      'group/trigger text-muted-foreground relative z-10 flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium transition-[color,background-color] duration-150',
      'hover:bg-muted/60 hover:text-foreground',
      'focus-visible:ring-ring/50 focus-visible:ring-2 focus-visible:outline-none',
      'disabled:pointer-events-none disabled:opacity-50',
      'data-[state=active]:text-foreground',
      'group-data-[animated=false]/list:data-[state=active]:bg-muted',
      // Static primary rail (only when list animation is off).
      "before:bg-primary before:pointer-events-none before:absolute before:inset-y-1 before:left-0 before:w-0.5 before:rounded-full before:opacity-0 before:content-['']",
      'group-data-[animated=false]/list:data-[state=active]:before:opacity-100',
      '[&>svg]:size-4 [&>svg]:shrink-0',
      className,
    )}
    {...props}
  />
))
VerticalTabsTrigger.displayName = 'VerticalTabsTrigger'

const VerticalTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    data-uipkge=""
    data-slot="vertical-tabs-content"
    className={cn(
      'ring-offset-background focus-visible:ring-ring/50 flex-1 focus-visible:ring-2 focus-visible:outline-none',
      className,
    )}
    {...props}
  />
))
VerticalTabsContent.displayName = 'VerticalTabsContent'

export { VerticalTabs, VerticalTabsList, VerticalTabsSection, VerticalTabsTrigger, VerticalTabsContent }
