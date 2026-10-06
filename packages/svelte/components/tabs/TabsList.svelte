<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'
  import type { TabsOrientation } from './context'
  import type { TabsListVariants } from './tabs.variants'

  export interface TabsListProps extends HTMLAttributes<HTMLDivElement> {
    variant?: TabsListVariants['variant']
    orientation?: TabsOrientation
    /** Enable sliding active indicator (default true). When false, active surface paints on the trigger. */
    animated?: boolean
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import type { KeyboardEventHandler } from 'svelte/elements'
  import { cn } from '$lib/utils'
  import { getTabsContext } from './context'
  import { tabsListVariants } from './tabs.variants'

  let {
    class: className,
    variant,
    orientation,
    animated = true,
    children,
    ref = $bindable(null),
    onkeydown,
    ...restProps
  }: TabsListProps = $props()

  const ctx = getTabsContext()
  // Inherit orientation from <Tabs> when not set explicitly.
  const effectiveOrientation = $derived(orientation ?? ctx?.orientation() ?? 'horizontal')
  const effectiveVariant = $derived(variant ?? 'segmented')

  let listEl = $state<HTMLDivElement | null>(null)
  let indicatorStyle = $state<Record<string, string>>({ opacity: '0' })
  let firstPosition = true

  $effect(() => {
    ref = listEl
  })

  function motionSafeTransition(): string {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return 'none'
    }
    return firstPosition
      ? 'none'
      : 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1), width 220ms cubic-bezier(0.22, 1, 0.36, 1), height 220ms cubic-bezier(0.22, 1, 0.36, 1)'
  }

  function updateIndicator() {
    const root = listEl ?? ref
    if (!root || typeof window === 'undefined') return
    const active = root.querySelector<HTMLElement>('[data-slot="tabs-trigger"][data-state="active"]')
    if (!active) {
      indicatorStyle = { opacity: '0' }
      return
    }
    const listRect = root.getBoundingClientRect()
    const activeRect = active.getBoundingClientRect()
    const left = activeRect.left - listRect.left + root.scrollLeft
    const top = activeRect.top - listRect.top + root.scrollTop
    const transition = motionSafeTransition()
    if (effectiveVariant === 'underline') {
      const thickness = 2
      if (effectiveOrientation === 'vertical') {
        indicatorStyle = {
          width: `${thickness}px`,
          height: `${activeRect.height}px`,
          transform: `translate3d(${listRect.width - thickness}px, ${top}px, 0)`,
          opacity: '1',
          transition,
        }
      } else {
        indicatorStyle = {
          width: `${activeRect.width}px`,
          height: `${thickness}px`,
          transform: `translate3d(${left}px, ${listRect.height - thickness}px, 0)`,
          opacity: '1',
          transition,
        }
      }
    } else {
      indicatorStyle = {
        width: `${activeRect.width}px`,
        height: `${activeRect.height}px`,
        transform: `translate3d(${left}px, ${top}px, 0)`,
        opacity: '1',
        transition,
      }
    }
    firstPosition = false
  }

  // Observe size + active-trigger changes while animated. Re-binds when the
  // variant, orientation, or animated flag changes (first paint has no slide).
  $effect(() => {
    if (!animated) {
      indicatorStyle = { opacity: '0' }
      return
    }
    // Tracked reads: re-run the effect when these change.
    void effectiveVariant
    void effectiveOrientation
    void ctx?.current()
    const root = listEl ?? ref
    if (!root || typeof window === 'undefined') return
    firstPosition = true
    // Defer past layout so getBoundingClientRect reads settled geometry.
    const raf = requestAnimationFrame(() => updateIndicator())
    const ro = new ResizeObserver(() => updateIndicator())
    ro.observe(root)
    root.querySelectorAll('[data-slot="tabs-trigger"]').forEach((el) => ro.observe(el))
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'childList') root.querySelectorAll('[data-slot="tabs-trigger"]').forEach((el) => ro.observe(el))
      }
      updateIndicator()
    })
    mo.observe(root, { attributes: true, attributeFilter: ['data-state'], subtree: true, childList: true })
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      mo.disconnect()
    }
  })

  const indicatorClass = $derived(
    effectiveVariant === 'pill'
      ? 'pointer-events-none absolute top-0 left-0 z-0 rounded-full bg-primary shadow-xs will-change-transform'
      : effectiveVariant === 'underline'
        ? 'pointer-events-none absolute top-0 left-0 z-0 bg-foreground will-change-transform'
        : 'pointer-events-none absolute top-0 left-0 z-0 rounded-sm bg-background shadow-xs will-change-transform',
  )

  function indicatorStyleAttr(): string {
    return Object.entries(indicatorStyle)
      .map(([k, v]) => `${k}: ${v}`)
      .join('; ')
  }

  // Roving keyboard navigation with automatic activation (matches reka-ui
  // Tabs defaults): arrows move + select, Home/End jump.
  const handleKeydown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    onkeydown?.(event)
    if (event.defaultPrevented) return
    const root = listEl ?? ref
    if (!root) return
    const vertical = effectiveOrientation === 'vertical'
    const nextKeys = vertical ? ['ArrowDown', 'ArrowRight'] : ['ArrowRight', 'ArrowDown']
    const prevKeys = vertical ? ['ArrowUp', 'ArrowLeft'] : ['ArrowLeft', 'ArrowUp']
    if (![...nextKeys, ...prevKeys, 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const triggers = [...root.querySelectorAll<HTMLElement>('[data-slot="tabs-trigger"]:not([disabled])')]
    if (triggers.length === 0) return
    const current = triggers.indexOf(document.activeElement as HTMLElement)
    let next: number
    if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = triggers.length - 1
    else if (nextKeys.includes(event.key)) next = (current + 1 + triggers.length) % triggers.length
    else next = (current - 1 + triggers.length) % triggers.length
    triggers[next]?.focus()
    triggers[next]?.click()
  }

</script>

<div
  bind:this={listEl}
  role="tablist"
  aria-orientation={effectiveOrientation}
  data-uipkge=""
  data-slot="tabs-list"
  data-animated={animated ? 'true' : 'false'}
  class={cn(
    'group/list relative',
    tabsListVariants({ variant: effectiveVariant, orientation: effectiveOrientation }),
    className,
  )}
  onkeydown={handleKeydown}
  {...restProps}
>
  {#if animated}
    <span data-slot="tabs-indicator" aria-hidden="true" class={indicatorClass} style={indicatorStyleAttr()}></span>
  {/if}
  {@render children?.()}
</div>
