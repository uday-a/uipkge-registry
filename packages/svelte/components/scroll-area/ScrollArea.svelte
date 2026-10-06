<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
    children?: Snippet
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import ScrollBar from './ScrollBar.svelte'

  let { class: className, children, ref = $bindable(null), ...restProps }: ScrollAreaProps = $props()
</script>

<div bind:this={ref} data-uipkge data-slot="scroll-area" class={cn('relative', className)} {...restProps}>
  <div
    data-uipkge
    data-slot="scroll-area-viewport"
    tabindex="0"
    class="focus-visible:ring-ring/50 size-full overflow-auto rounded-[inherit] transition-[color,box-shadow] outline-none [scrollbar-width:none] focus-visible:ring-[3px] focus-visible:outline-1 [&::-webkit-scrollbar]:hidden"
  >
    {@render children?.()}
  </div>
  <ScrollBar />
  <div data-uipkge data-slot="scroll-area-corner" class="absolute right-0 bottom-0 size-2.5"></div>
</div>
