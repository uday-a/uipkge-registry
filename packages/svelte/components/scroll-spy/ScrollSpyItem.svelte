<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface ScrollSpyItemProps extends HTMLAttributes<HTMLLIElement> {
    value: string
    title?: string
    depth?: number
    children?: Snippet
    ref?: HTMLLIElement | null
  }
</script>

<script lang="ts">
  import { getContext, setContext } from 'svelte'
  import { cn } from '$lib/utils'
  import { SCROLL_SPY_CONTEXT_KEY, SCROLL_SPY_ITEM_DEPTH_KEY, type ScrollSpyContext } from './context'

  let { class: className, value, title, depth, children, ref = $bindable(null), ...restProps }: ScrollSpyItemProps =
    $props()

  const ctx = getContext<ScrollSpyContext | undefined>(SCROLL_SPY_CONTEXT_KEY) ?? null
  const parentDepth = getContext<number | undefined>(SCROLL_SPY_ITEM_DEPTH_KEY) ?? 0
  const computedDepth = depth ?? parentDepth + 1
  setContext(SCROLL_SPY_ITEM_DEPTH_KEY, computedDepth)

  $effect(() => {
    const v = value
    if (!ctx) return
    ctx.registerItem({ value: v, title, depth: computedDepth, el: ref })
    return () => ctx.unregisterItem(v)
  })
</script>

<li bind:this={ref} data-slot="scroll-spy-item" data-depth={computedDepth} class={cn('relative flex flex-col', className)} {...restProps}>
  {@render children?.()}
</li>
