<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface TableHeaderProps extends HTMLAttributes<HTMLElement> {
    ref?: HTMLTableSectionElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: TableHeaderProps = $props()
</script>

<thead bind:this={ref} data-uipkge="" data-slot="table-header" class={cn('bg-muted/50 [&_tr]:border-b', className)} {...restProps}>
  {@render children?.()}
</thead>
