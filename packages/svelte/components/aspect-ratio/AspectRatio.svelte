<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface AspectRatioProps extends HTMLAttributes<HTMLDivElement> {
    /** Width / height. `16 / 9` for video, `1` for squares, `4 / 3` for cards. */
    ratio?: number
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { ratio = 1, class: className, children, ref = $bindable(null), ...restProps }: AspectRatioProps = $props()

  const paddingBottom = $derived(`${100 / (ratio > 0 ? ratio : 1)}%`)
</script>

<div
  bind:this={ref}
  data-uipkge=""
  data-slot="aspect-ratio"
  style:position="relative"
  style:width="100%"
  style:padding-bottom={paddingBottom}
  class={cn(className)}
  {...restProps}
>
  <div style:position="absolute" style:inset="0">
    {@render children?.()}
  </div>
</div>
