<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface TimelineDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
    ref?: HTMLParagraphElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: TimelineDescriptionProps = $props()
</script>

<p
  bind:this={ref}
  data-uipkge=""
  data-slot="timeline-description"
  class={cn('text-muted-foreground text-sm', className)}
  {...restProps}
>
  {@render children?.()}
</p>
