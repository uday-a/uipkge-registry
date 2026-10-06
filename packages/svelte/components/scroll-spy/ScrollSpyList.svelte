<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface ScrollSpyListProps extends HTMLAttributes<HTMLUListElement> {
    children?: Snippet
    ref?: HTMLUListElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { getScrollSpyContextOptional } from './context'

  let { class: className, children, ref = $bindable(null), ...restProps }: ScrollSpyListProps = $props()

  const ctx = getScrollSpyContextOptional()
  const isStraight = $derived(ctx?.turn === 'straight')
  const isRightRail = $derived(ctx?.position === 'left' && ctx?.railPosition === 'right')
  const lineWidthPx = $derived(`${ctx?.resolvedLineWidth ?? 2.5}px`)

  $effect(() => {
    if (ctx && ref) ctx.setListEl(ref)
  })
</script>

<ul
  bind:this={ref}
  data-slot="scroll-spy-list"
  style="border-left-width: {isStraight && !isRightRail ? lineWidthPx : '0'}; border-right-width: {isStraight && isRightRail ? lineWidthPx : '0'};"
  class={cn(
    'relative flex flex-col space-y-1 text-sm',
    isStraight && (isRightRail ? 'border-border border-r' : 'border-border border-l'),
    className,
  )}
  {...restProps}
>
  {@render children?.()}
</ul>
