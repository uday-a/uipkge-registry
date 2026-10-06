<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface TableBodyProps extends HTMLAttributes<HTMLElement> {
    ref?: HTMLTableSectionElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: TableBodyProps = $props()
</script>

<tbody bind:this={ref} data-uipkge="" data-slot="table-body" class={cn('[&_tr:last-child]:border-0', className)} {...restProps}>
  {@render children?.()}
</tbody>
