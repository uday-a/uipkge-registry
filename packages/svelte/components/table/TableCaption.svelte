<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface TableCaptionProps extends HTMLAttributes<HTMLElement> {
    ref?: HTMLElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: TableCaptionProps = $props()
</script>

<caption bind:this={ref} data-uipkge="" data-slot="table-caption" class={cn('text-muted-foreground mt-4 text-sm', className)} {...restProps}>
  {@render children?.()}
</caption>
