<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface VerticalTabsListProps extends HTMLAttributes<HTMLDivElement> {
    children?: Snippet
    /** Wrap keyboard focus from last trigger to first (and vice versa). Default true. */
    loop?: boolean
    /** Enable sliding active indicator (default true). When false, active chrome paints on the trigger. */
    animated?: boolean
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { getVerticalTabsContext } from './VerticalTabs.svelte'

  let { children, loop = true, animated = true, class: className, ...restProps }: VerticalTabsListProps = $props()

  const ctx = getVerticalTabsContext('VerticalTabsList')

  let listEl: HTMLDivElement | null = $state(null)
  let indicatorStyle = $state<Record<string, string>>({ opacity: '0' })
  let firstPosition = true

  function motionSafeTransition() {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return 'none'
    }
    return firstPosition
      ? 'none'
      : 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1), width 220ms cubic-bezier(0.22, 1, 0.36, 1), height 220ms cubic-bezier(0.22, 1, 0.36, 1)'
  }

  function updateIndicator() {
    if (!animated) return
    const root = listEl
    if (!root) return
    const active = root.querySelector<HTMLElement>('[data-slot="vertical-tabs-trigger"][data-state="active"]')
    if (!active) {
      indicatorStyle = { opacity: '0' }
      return
    }

    const listRect = root.getBoundingClientRect()
    const activeRect = active.getBoundingClientRect()
    const left = activeRect.left - listRect.left + root.scrollLeft
    const top = activeRect.top - listRect.top + root.scrollTop
    const transition = motionSafeTransition()

    // Full active surface slides (muted pill); primary rail is nested absolute so it stays inset-y-1.
    indicatorStyle = {
      width: `${activeRect.width}px`,
      height: `${activeRect.height}px`,
      transform: `translate3d(${left}px, ${top}px, 0)`,
      opacity: '1',
      transition,
    }
    firstPosition = false
  }

  function styleAttr(style: Record<string, string>): string {
    return Object.entries(style)
      .map(([k, v]) => `${k.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}: ${v}`)
      .join('; ')
  }

  $effect(() => {
    const root = listEl
    const on = animated
    firstPosition = true
    if (!root || !on) {
      indicatorStyle = { opacity: '0' }
      return
    }

    const ro = new ResizeObserver(() => updateIndicator())
    ro.observe(root)
    root.querySelectorAll('[data-slot="vertical-tabs-trigger"]').forEach((el) => ro.observe(el))

    const mo = new MutationObserver((mutations) => {
      // Re-observe new triggers without treating parent re-renders as first paint.
      for (const m of mutations) {
        if (m.type === 'childList') {
          root.querySelectorAll('[data-slot="vertical-tabs-trigger"]').forEach((el) => ro.observe(el))
        }
      }
      queueMicrotask(updateIndicator)
    })
    mo.observe(root, {
      attributes: true,
      attributeFilter: ['data-state'],
      subtree: true,
      childList: true,
    })

    updateIndicator()
    // The scroll container may settle a frame after mount (fonts, layout).
    const raf = requestAnimationFrame(() => updateIndicator())

    return () => {
      ro.disconnect()
      mo.disconnect()
      cancelAnimationFrame(raf)
    }
  })

  function enabledTriggers(root: HTMLElement): HTMLElement[] {
    return Array.from(
      root.querySelectorAll<HTMLElement>('[data-slot="vertical-tabs-trigger"]:not([data-disabled])'),
    ).filter((el) => !el.hasAttribute('disabled'))
  }

  function handleKeydown(e: KeyboardEvent) {
    const root = listEl
    if (!root) return
    const target = e.target as HTMLElement | null
    if (!target?.closest('[data-slot="vertical-tabs-trigger"]')) return

    const triggers = enabledTriggers(root)
    const idx = triggers.indexOf(target.closest('[data-slot="vertical-tabs-trigger"]') as HTMLElement)
    if (idx < 0) return

    let next = -1
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = idx + 1
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = idx - 1
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = triggers.length - 1
    else return

    e.preventDefault()
    if (next < 0) next = loop ? triggers.length - 1 : 0
    if (next >= triggers.length) next = loop ? 0 : triggers.length - 1
    const el = triggers[next]
    if (!el) return
    el.focus()
    // Automatic activation, like reka-ui tabs: focus selects.
    const v = el.getAttribute('data-value')
    if (v) ctx.select(v)
  }
</script>

<div
  bind:this={listEl}
  data-uipkge
  data-slot="vertical-tabs-list"
  data-animated={animated ? 'true' : 'false'}
  role="tablist"
  aria-orientation="vertical"
  class={cn('group/list border-border relative flex w-56 shrink-0 flex-col gap-0.5 border-r pr-3', className)}
  onkeydown={handleKeydown}
  {...restProps}
>
  {#if animated}
    <span
      data-slot="vertical-tabs-indicator"
      aria-hidden="true"
      class="bg-muted pointer-events-none absolute top-0 left-0 z-0 rounded-md will-change-transform"
      style={styleAttr(indicatorStyle)}
    >
      <!-- Primary rail stays inset relative to the sliding surface (matches prior trigger chrome). -->
      <span class="bg-primary absolute inset-y-1 left-0 w-0.5 rounded-full"></span>
    </span>
  {/if}
  {@render children?.()}
</div>
