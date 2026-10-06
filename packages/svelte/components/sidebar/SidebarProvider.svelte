<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface SidebarProviderProps extends HTMLAttributes<HTMLDivElement> {
    /** Uncontrolled initial open state (defaults to true). Use this when you do not need to bind or control open. */
    defaultOpen?: boolean
    /** Controlled open state. Bind with `bind:open` for two-way binding or pass `defaultOpen` for initial-only. */
    open?: boolean
    onOpenChange?: (open: boolean) => void
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import {
    setSidebarContext,
    SIDEBAR_COOKIE_MAX_AGE,
    SIDEBAR_COOKIE_NAME,
    SIDEBAR_KEYBOARD_SHORTCUT,
    SIDEBAR_WIDTH,
    SIDEBAR_WIDTH_ICON,
  } from './utils'

  let {
    class: className,
    defaultOpen = true,
    open = $bindable(defaultOpen),
    onOpenChange,
    children,
    ref = $bindable(null),
    ...restProps
  }: SidebarProviderProps = $props()

  // `matchMedia` doesn't exist during SSR. Gating on `mounted` makes both the
  // server and the client's first synchronous render produce the desktop
  // branch unconditionally; `onMount` then flips the flag and `Sidebar`'s
  // mobile branch re-runs against the real matchMedia signal. Cost: a brief
  // desktop-layout flash for mobile users on first paint. That's the
  // universal tradeoff for SSR-without-viewport-detection.
  let mounted: boolean = $state(false)
  let mobileQuery: boolean = $state(false)
  let openMobile: boolean = $state(false)

  $effect(() => {
    mounted = true
    if (typeof window === 'undefined' || !('matchMedia' in window)) return
    const mq = window.matchMedia('(max-width: 768px)')
    const sync = () => (mobileQuery = mq.matches)
    sync()
    mq.addEventListener('change', sync)

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        toggleSidebar()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      mq.removeEventListener('change', sync)
      document.removeEventListener('keydown', onKeyDown)
    }
  })

  const isMobile = $derived(mounted && mobileQuery)

  function setOpen(value: boolean) {
    open = value
    onOpenChange?.(value)
    if (typeof document !== 'undefined') {
      // This sets the cookie to keep the sidebar state.
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${open}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
    }
  }

  function setOpenMobile(value: boolean) {
    openMobile = value
  }

  // Helper to toggle the sidebar.
  function toggleSidebar() {
    return isMobile ? setOpenMobile(!openMobile) : setOpen(!open)
  }

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  // Named `sidebarState`, not `state`: a `state` binding in this scope would
  // make the compiler read every `$state(...)` below as a store subscription.
  const sidebarState: 'expanded' | 'collapsed' = $derived(open ? 'expanded' : 'collapsed')

  // Getters over $state keep every consumer reactive without runes in utils.ts.
  // Consumers must read via `sidebar.open` (not destructured) to stay subscribed.
  setSidebarContext({
    get state() {
      return sidebarState
    },
    get open() {
      return open
    },
    setOpen,
    get isMobile() {
      return isMobile
    },
    get openMobile() {
      return openMobile
    },
    setOpenMobile,
    toggleSidebar,
  })
</script>

<div
  bind:this={ref}
  data-uipkge=""
  data-slot="sidebar-wrapper"
  style="--sidebar-width:{SIDEBAR_WIDTH};--sidebar-width-icon:{SIDEBAR_WIDTH_ICON}"
  class={cn('group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full', className)}
  {...restProps}
>
  {@render children?.()}
</div>
