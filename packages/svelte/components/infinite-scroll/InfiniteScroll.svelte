<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface InfiniteScrollProps<T = unknown> extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    /** Rendered list. The component does not mutate it; the parent appends
     *  new items in response to the `onload` callback. */
    items?: T[]
    /** When false, the sentinel never fires `onload` (end of data reached). */
    hasMore?: boolean
    /** True while the parent is fetching. While true the sentinel is paused
     *  so duplicate loads are not emitted. */
    loading?: boolean
    /** Distance (px) from the boundary at which `onload` fires. Larger = earlier. */
    distance?: number
    /** Scroll container. `"window"` listens on the viewport; pass an element
     *  (HTMLElement) or a CSS selector string to listen on a scrollable
     *  element instead. */
    scrollTarget?: 'window' | HTMLElement | string
    /** Reverse mode: prepend items at the top. The sentinel is anchored to the
     *  top edge and `onload` fires when the user scrolls near the top. */
    reverse?: boolean
    /** Hard pause independent of `loading`/`hasMore`. */
    disabled?: boolean
    /** Hide the default loading spinner (use the `loading` snippet instead). */
    hideSpinner?: boolean
    /** Row content. Receives the current `items`. */
    children?: Snippet<[{ items: T[] }]>
    /** Custom loading indicator. */
    loadingSnippet?: Snippet
    /** Custom end-of-list content. */
    endSnippet?: Snippet
    /** Fired when the sentinel crosses the distance threshold. */
    onload?: () => void
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts" generics="T">
  import { untrack } from 'svelte'
  import { cn } from '$lib/utils'
  import { Loader2 } from '@lucide/svelte'

  let {
    class: className,
    items = [],
    hasMore = true,
    loading = false,
    distance = 0,
    scrollTarget = 'window',
    reverse = false,
    disabled = false,
    hideSpinner = false,
    children,
    loadingSnippet,
    endSnippet,
    onload,
    ref = $bindable(null),
    ...restProps
  }: InfiniteScrollProps<T> = $props()

  let sentinel: HTMLElement | null = $state(null)
  let scrollEl: HTMLElement | Window | null = null

  const showSpinner = $derived(loading && !hideSpinner)

  function getScrollElement(): HTMLElement | Window | null {
    if (scrollTarget === 'window') return window
    if (typeof scrollTarget === 'string') {
      return (document.querySelector(scrollTarget) as HTMLElement | null) ?? window
    }
    return scrollTarget
  }

  function check() {
    if (disabled || loading || !hasMore || !sentinel) return
    const sentinelRect = sentinel.getBoundingClientRect()
    // When listening on a scrollable element, use that element's visible box —
    // not the window — otherwise a short/offset container never (or always)
    // trips the threshold relative to the viewport.
    let edgeTop = 0
    let edgeBottom = window.innerHeight || document.documentElement.clientHeight
    if (scrollEl && scrollEl !== window) {
      const r = (scrollEl as HTMLElement).getBoundingClientRect()
      edgeTop = r.top
      edgeBottom = r.bottom
    }
    if (reverse) {
      // Reverse: fire when the sentinel (anchored at top) approaches the top edge.
      if (sentinelRect.bottom >= edgeTop - distance && sentinelRect.top <= edgeBottom) {
        onload?.()
      }
    } else {
      // Forward: fire when the sentinel approaches the bottom edge.
      if (sentinelRect.top <= edgeBottom + distance && sentinelRect.bottom >= edgeTop - distance) {
        onload?.()
      }
    }
  }

  function onScroll() {
    check()
  }

  $effect(() => {
    // Re-bind the listener when the scroll target changes.
    void scrollTarget
    scrollEl?.removeEventListener('scroll', onScroll)
    scrollEl = getScrollElement()
    scrollEl?.addEventListener('scroll', onScroll, { passive: true })
    // Fire once on mount so an initially-empty list starts loading immediately.
    // Untracked so gating-prop changes don't re-bind the listener.
    untrack(check)
    return () => {
      scrollEl?.removeEventListener('scroll', onScroll)
    }
  })

  // When a load completes (loading flips false) and there is still more data,
  // re-check in case the viewport is still larger than the content (short list).
  let wasLoading = $state(false)
  $effect(() => {
    const now = loading
    if (wasLoading && !now && hasMore) {
      requestAnimationFrame(check)
    }
    wasLoading = now
  })
</script>

<div bind:this={ref} data-uipkge="" data-slot="infinite-scroll" class={cn('w-full', className)} {...restProps}>
  <!-- Reverse mode: spinner + sentinel sit above the items so new rows
       prepend naturally without shifting the scroll position. -->
  {#if reverse}
    {#if showSpinner}
      <div data-slot="infinite-scroll-loading" class="flex w-full justify-center py-3">
        {#if loadingSnippet}
          {@render loadingSnippet()}
        {:else}
          <Loader2 class="text-muted-foreground size-5 animate-spin" aria-label="Loading" />
        {/if}
      </div>
    {/if}
    <div bind:this={sentinel} data-slot="infinite-scroll-sentinel" class="h-px w-full" aria-hidden="true"></div>
    {@render children?.({ items })}
  {:else}
    {@render children?.({ items })}
    <div bind:this={sentinel} data-slot="infinite-scroll-sentinel" class="h-px w-full" aria-hidden="true"></div>
    {#if showSpinner}
      <div data-slot="infinite-scroll-loading" class="flex w-full justify-center py-3">
        {#if loadingSnippet}
          {@render loadingSnippet()}
        {:else}
          <Loader2 class="text-muted-foreground size-5 animate-spin" aria-label="Loading" />
        {/if}
      </div>
    {/if}
    {#if !hasMore && !loading}
      <div data-slot="infinite-scroll-end" class="text-muted-foreground w-full py-3 text-center text-xs">
        {#if endSnippet}
          {@render endSnippet()}
        {:else}
          No more items
        {/if}
      </div>
    {/if}
  {/if}
</div>
