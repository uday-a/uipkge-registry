<script lang="ts" module>
  import { getContext } from 'svelte'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface HoverCardProps extends HTMLAttributes<HTMLDivElement> {
    /** Controlled open state. Bind with `bind:open`. */
    open?: boolean
    /** Delay before opening on hover/focus, in ms. Default 700. */
    openDelay?: number
    /** Delay before closing after leaving, in ms. Default 300. */
    closeDelay?: number
    /** Called whenever the card opens or closes. */
    onOpenChange?: (open: boolean) => void
    children?: Snippet
  }

  export interface HoverCardContext {
    readonly open: boolean
    scheduleOpen: () => void
    scheduleClose: () => void
    cancelClose: () => void
  }

  export const HOVER_CARD_CONTEXT_KEY = Symbol('uipkge:hover-card')

  export function getHoverCardContext(): HoverCardContext {
    return getContext<HoverCardContext>(HOVER_CARD_CONTEXT_KEY)
  }
</script>

<script lang="ts">
  import { onDestroy, setContext } from 'svelte'
  import { cn } from '$lib/utils'

  let {
    class: className,
    open = $bindable(false),
    openDelay = 700,
    closeDelay = 300,
    onOpenChange,
    children,
    ...restProps
  }: HoverCardProps = $props()

  let openTimer: ReturnType<typeof setTimeout> | null = null
  let closeTimer: ReturnType<typeof setTimeout> | null = null

  function setOpen(next: boolean) {
    if (open === next) return
    open = next
    onOpenChange?.(next)
  }

  function scheduleOpen() {
    if (closeTimer) {
      clearTimeout(closeTimer)
      closeTimer = null
    }
    if (open || openTimer) return
    if (openDelay <= 0) {
      setOpen(true)
      return
    }
    openTimer = setTimeout(() => {
      openTimer = null
      setOpen(true)
    }, openDelay)
  }

  function scheduleClose() {
    if (openTimer) {
      clearTimeout(openTimer)
      openTimer = null
    }
    if (!open || closeTimer) return
    if (closeDelay <= 0) {
      setOpen(false)
      return
    }
    closeTimer = setTimeout(() => {
      closeTimer = null
      setOpen(false)
    }, closeDelay)
  }

  function cancelClose() {
    if (closeTimer) {
      clearTimeout(closeTimer)
      closeTimer = null
    }
  }

  onDestroy(() => {
    if (openTimer) clearTimeout(openTimer)
    if (closeTimer) clearTimeout(closeTimer)
  })

  setContext<HoverCardContext>(HOVER_CARD_CONTEXT_KEY, {
    get open() {
      return open
    },
    scheduleOpen,
    scheduleClose,
    cancelClose,
  })
</script>

<div
  data-uipkge
  data-slot="hover-card"
  data-state={open ? 'open' : 'closed'}
  {...restProps}
  class={cn('relative inline-block', className)}
>
  {@render children?.()}
</div>
