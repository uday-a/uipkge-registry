<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface TimelineContentProps extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: TimelineContentProps = $props()
</script>

<div bind:this={ref} data-uipkge="" data-slot="timeline-content" class={cn('flex-1 space-y-1', className)} {...restProps}>
  {@render children?.()}
</div>
