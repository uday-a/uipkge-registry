<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface TimelineHeaderProps extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: TimelineHeaderProps = $props()
</script>

<div
  bind:this={ref}
  data-uipkge=""
  data-slot="timeline-header"
  class={cn('flex flex-wrap items-center justify-between gap-2', className)}
  {...restProps}
>
  {@render children?.()}
</div>
