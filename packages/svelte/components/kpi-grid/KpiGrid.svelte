<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface KpiGridProps extends HTMLAttributes<HTMLDivElement> {
    columns?: 2 | 3 | 4
    children?: Snippet
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, columns = 4, children, ref = $bindable(null), ...restProps }: KpiGridProps = $props()
</script>

<div
  bind:this={ref}
  data-uipkge=""
  data-slot="kpi-grid"
  class={cn(
    'grid gap-4 md:grid-cols-2',
    columns === 3 ? 'lg:grid-cols-3' : columns === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-4',
    className,
  )}
  {...restProps}
>
  {@render children?.()}
</div>
