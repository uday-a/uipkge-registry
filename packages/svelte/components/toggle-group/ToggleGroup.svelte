<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  type ToggleGroupKeydownEvent = Parameters<NonNullable<HTMLAttributes<HTMLDivElement>['onkeydown']>>[0]

  export interface ToggleGroupProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'outline'
    size?: 'default' | 'sm' | 'lg'
    spacing?: number
    type?: 'single' | 'multiple'
    /** Controlled value: a string for single-select, an array for multi-select. */
    value?: string | string[]
    disabled?: boolean
    loop?: boolean
    orientation?: 'horizontal' | 'vertical'
    rovingFocus?: boolean
    /** Sliding selection indicator for single-select (default true). Multi-select keeps item chrome. */
    animated?: boolean
    /** Called with the new value after every selection change. */
    onValueChange?: (value: string | string[]) => void
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { tick } from 'svelte'
  import { cn } from '$lib/utils'
  import { ToggleGroupContextState, setToggleGroupContext } from './context.svelte'

  let {
    class: className,
    variant,
    size,
    spacing = 0,
    type,
    value = $bindable(),
    disabled = false,
    loop = true,
    orientation = 'horizontal',
    rovingFocus = true,
    dir,
    animated = true,
    onValueChange,
    children,
    ref = $bindable(null),
    onkeydown,
    ...restProps
  }: ToggleGroupProps = $props()

  const ctx = new ToggleGroupContextState()
  ctx.select = (itemValue: string) => {
    if (disabled) return
    if (type === 'multiple') {
      const current = Array.isArray(value) ? value : []
      const next = current.includes(itemValue) ? current.filter((v) => v !== itemValue) : [...current, itemValue]
      value = next
      onValueChange?.(next)
    } else {
      const next = value === itemValue ? '' : itemValue
      value = next
      onValueChange?.(next)
    }
  }
  setToggleGroupContext(ctx)

  $effect(() => {
    ctx.variant = variant
    ctx.size = size
    ctx.spacing = spacing
    ctx.type = type
    ctx.value = value
  })

  // Sliding pill only for single-select. Multi-select paints per-item surfaces.
  const indicatorActive = $derived(animated !== false && type !== 'multiple')

  let rootEl: HTMLDivElement | null = $state(null)
  let indicatorStyle = $state<Record<string, string>>({ opacity: '0' })

  function motionSafeTransition(firstPosition: boolean) {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return 'none'
    }
    return firstPosition
      ? 'none'
      : 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1), width 220ms cubic-bezier(0.22, 1, 0.36, 1), height 220ms cubic-bezier(0.22, 1, 0.36, 1), border-radius 220ms cubic-bezier(0.22, 1, 0.36, 1)'
  }

  function updateIndicator(firstPosition: boolean) {
    const root = rootEl
    if (!root) return false
    const active = root.querySelector<HTMLElement>('[data-slot="toggle-group-item"][data-state="on"]')
    if (!active) {
      indicatorStyle = { opacity: '0' }
      return false
    }
    const listRect = root.getBoundingClientRect()
    const activeRect = active.getBoundingClientRect()
    const left = activeRect.left - listRect.left + root.scrollLeft
    const top = activeRect.top - listRect.top + root.scrollTop
    indicatorStyle = {
      width: `${activeRect.width}px`,
      height: `${activeRect.height}px`,
      transform: `translate3d(${left}px, ${top}px, 0)`,
      borderRadius: getComputedStyle(active).borderRadius,
      opacity: '1',
      transition: motionSafeTransition(firstPosition),
    }
    return true
  }

  $effect(() => {
    const active = indicatorActive
    // Re-seat the pill when layout inputs change.
    void spacing
    void size
    void variant
    void orientation
    void rootEl
    if (!active || !rootEl) {
      indicatorStyle = { opacity: '0' }
      return
    }
    const root = rootEl
    let firstPosition = true
    const ro = new ResizeObserver(() => {
      firstPosition = !updateIndicator(firstPosition) ? firstPosition : false
    })
    ro.observe(root)
    root.querySelectorAll('[data-slot="toggle-group-item"]').forEach((el) => ro.observe(el))
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'childList') {
          root.querySelectorAll('[data-slot="toggle-group-item"]').forEach((el) => ro.observe(el))
        }
      }
      tick().then(() => {
        firstPosition = !updateIndicator(firstPosition) ? firstPosition : false
      })
    })
    mo.observe(root, {
      attributes: true,
      attributeFilter: ['data-state'],
      subtree: true,
      childList: true,
    })
    firstPosition = !updateIndicator(firstPosition) ? firstPosition : false
    return () => {
      ro.disconnect()
      mo.disconnect()
    }
  })

  /** Arrow-key navigation between items (focus moves; selection stays on click/space). */
  function handleKeydown(event: ToggleGroupKeydownEvent) {
    onkeydown?.(event)
    if (!rovingFocus || !rootEl || event.defaultPrevented) return
    const items = Array.from(
      rootEl.querySelectorAll<HTMLElement>('[data-slot="toggle-group-item"]:not(:disabled)'),
    )
    if (items.length < 2) return
    const current = items.indexOf(document.activeElement as HTMLElement)
    if (current === -1) return
    const horizontal = orientation !== 'vertical'
    let next = -1
    if ((horizontal && event.key === 'ArrowRight') || (!horizontal && event.key === 'ArrowDown')) next = current + 1
    else if ((horizontal && event.key === 'ArrowLeft') || (!horizontal && event.key === 'ArrowUp')) next = current - 1
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = items.length - 1
    else return
    event.preventDefault()
    if (next < 0) next = loop ? items.length - 1 : 0
    if (next >= items.length) next = loop ? 0 : items.length - 1
    items[next]?.focus()
  }
</script>

<div
  bind:this={rootEl}
  role="group"
  data-uipkge=""
  data-slot="toggle-group"
  data-size={size}
  data-variant={variant}
  data-spacing={spacing}
  data-animated={indicatorActive ? 'true' : 'false'}
  data-orientation={orientation}
  data-disabled={disabled ? '' : undefined}
  style:--gap={spacing}
  dir={dir}
  class={cn(
    'group/toggle-group relative flex w-fit items-center gap-[--spacing(var(--gap))] rounded-md data-[spacing=default]:data-[variant=outline]:shadow-xs',
    className,
  )}
  onkeydown={handleKeydown}
  {...restProps}
>
  {#if indicatorActive}
    <span
      data-slot="toggle-group-indicator"
      aria-hidden="true"
      class="bg-accent pointer-events-none absolute top-0 left-0 z-0 shadow-xs will-change-transform"
      style={Object.entries(indicatorStyle)
        .map(([k, v]) => `${k}: ${v}`)
        .join('; ')}
    ></span>
  {/if}
  {@render children?.()}
</div>
