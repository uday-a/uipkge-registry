<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface VerticalTabsSectionProps extends HTMLAttributes<HTMLDivElement> {
    label: string
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { label, class: className, ...restProps }: VerticalTabsSectionProps = $props()
</script>

<div
  data-uipkge
  data-slot="vertical-tabs-section"
  class={cn('text-muted-foreground mt-3 mb-1 px-2 text-xs font-medium tracking-wider uppercase first:mt-0', className)}
  {...restProps}
>
  {label}
</div>
