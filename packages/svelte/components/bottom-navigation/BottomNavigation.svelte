<script lang="ts" module>
  import type { Component } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface BottomNavItem {
    /** Unique value identifying this tab. Used with bind:value. */
    value: string
    /** Label shown under the icon. */
    label: string
    /** Lucide icon component (from `@lucide/svelte`). */
    icon: Component
    /** Optional badge count or text shown on the icon. */
    badge?: string | number
    /** Link destination. Selected tabs navigate here: via `onnavigate` when
     *  provided (e.g. SvelteKit `goto`), otherwise a full page load. */
    to?: string
  }

  export interface BottomNavigationProps extends Omit<HTMLAttributes<HTMLElement>, 'onselect'> {
    /** Tab items. */
    items: BottomNavItem[]
    /** Active item value. Bind it (`bind:value`) for two-way updates. */
    value?: string
    /** Active item color — a Tailwind text color class. Default 'text-primary'. */
    activeColor?: string
    /** Fixed positioning at the viewport bottom. Default true. */
    fixed?: boolean
    /** Show a sliding active indicator pill behind the icon. Default true. */
    showIndicator?: boolean
    /** Safe-area padding for notched devices (iOS). Default true. */
    safeArea?: boolean
    /** Fires with the new value when a tab is selected. */
    onValueChange?: (value: string) => void
    /** Fires when a tab is selected. */
    onselect?: (item: BottomNavItem) => void
    /** Custom navigation for items with `to` (e.g. SvelteKit `goto`). When
     *  omitted, `to` falls back to `window.location.assign`. */
    onnavigate?: (to: string, item: BottomNavItem) => void
    /** The <nav> element, via `bind:ref`. */
    ref?: HTMLElement | null
  }
</script>

<script lang="ts">
  import { tick } from 'svelte'
  import { cn } from '$lib/utils'

  let {
    class: className,
    items,
    value = $bindable(''),
    activeColor = 'text-primary',
    fixed = true,
    showIndicator = true,
    safeArea = true,
    onValueChange,
    onselect,
    onnavigate,
    children,
    ref = $bindable(null),
    ...restProps
  }: BottomNavigationProps = $props()

  // Destructured (not rendered): items render from the `items` array, not a
  // slot — this keeps a stray `children` prop out of the nav's spread attributes.
  void children

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
    if (!showIndicator) return
    const root = ref
    if (!root) return

    const activeItem = root.querySelector<HTMLElement>('[data-slot="bottom-navigation-item"][data-active]')
    if (!activeItem) {
      indicatorStyle = { opacity: '0' }
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

    indicatorStyle = {
      width: `${pillW}px`,
      height: `${pillH}px`,
      transform: `translate3d(${left}px, ${top}px, 0)`,
      opacity: '1',
      transition,
    }
    firstPosition = false
  }

  // Observe layout while the indicator is on; hide it when off.
  $effect(() => {
    if (!showIndicator || !ref) {
      if (!showIndicator) {
        firstPosition = true
        indicatorStyle = { opacity: '0' }
      }
      return
    }
    firstPosition = true
    const root = ref
    const ro = new ResizeObserver(() => updateIndicator())
    ro.observe(root)
    root.querySelectorAll('[data-slot="bottom-navigation-item"]').forEach((el) => ro.observe(el))
    updateIndicator()
    return () => ro.disconnect()
  })

  // Slide the pill when the active tab changes (DOM must settle first).
  $effect(() => {
    void value
    void tick().then(() => updateIndicator())
  })

  // Remeasure without sliding when the item set changes (count/layout).
  $effect(() => {
    void items.length
    firstPosition = true
    void tick().then(() => updateIndicator())
  })

  function onSelect(item: BottomNavItem) {
    if (item.to) {
      if (onnavigate) {
        onnavigate(item.to, item)
      } else if (typeof window !== 'undefined') {
        window.location.assign(item.to)
      }
    }
    value = item.value
    onValueChange?.(item.value)
    onselect?.(item)
  }

  const indicatorStyleAttr = $derived(
    Object.entries(indicatorStyle)
      .map(([k, v]) => `${k}: ${v}`)
      .join('; '),
  )
</script>

<nav
  bind:this={ref}
  data-uipkge=""
  data-slot="bottom-navigation"
  aria-label="Bottom navigation"
  data-fixed={fixed ? '' : undefined}
  class={cn(
    'border-border bg-background/95 z-50 flex items-stretch justify-around border-t backdrop-blur-sm',
    // fixed establishes the containing block for the absolute indicator; relative when in-flow
    fixed ? 'fixed inset-x-0 bottom-0' : 'relative',
    safeArea && 'pb-[env(safe-area-inset-bottom)]',
    className,
  )}
  {...restProps}
>
  <!-- Single sliding pill; transform-only for cheap mobile paint -->
  {#if showIndicator}
    <span
      data-slot="bottom-navigation-indicator"
      aria-hidden="true"
      class="bg-primary/10 pointer-events-none absolute top-0 left-0 z-0 rounded-full will-change-transform"
      style={indicatorStyleAttr}
    ></span>
  {/if}

  {#each items as item (item.value)}
    {@const Icon = item.icon}
    {@const isActive = value === item.value}
    <button
      data-slot="bottom-navigation-item"
      data-active={isActive ? '' : undefined}
      aria-current={isActive ? 'page' : undefined}
      type="button"
      class={cn(
        'focus-visible:ring-ring/50 relative z-10 flex min-h-12 flex-1 flex-col items-center justify-center gap-0.5 pt-2 pb-1.5 text-xs transition-colors duration-200 outline-none focus-visible:ring-[3px] motion-reduce:transition-none',
        isActive ? activeColor : 'text-muted-foreground hover:text-foreground',
      )}
      onclick={() => onSelect(item)}
    >
      <span data-slot="bottom-navigation-icon" class="relative flex items-center justify-center">
        <Icon
          class={cn(
            'size-5 transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none',
            isActive ? 'scale-110' : 'scale-100',
          )}
        />
        {#if item.badge !== undefined && item.badge !== ''}
          <span
            class="bg-destructive text-destructive-foreground absolute -top-1.5 -right-2 flex min-w-4 items-center justify-center rounded-full px-1 text-xs leading-4 font-medium"
          >
            {item.badge}
          </span>
        {/if}
      </span>
      <span
        class={cn(
          'max-w-full truncate px-1 transition-[opacity,font-weight] duration-200 motion-reduce:transition-none',
          isActive ? 'font-medium' : 'font-normal',
        )}
      >
        {item.label}
      </span>
    </button>
  {/each}
</nav>
