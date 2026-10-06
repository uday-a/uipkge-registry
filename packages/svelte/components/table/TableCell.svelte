<script lang="ts" module>
  import type { HTMLTdAttributes } from 'svelte/elements'

  export interface TableCellProps extends HTMLTdAttributes {
    ref?: HTMLTableCellElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: TableCellProps = $props()
</script>

<td
  bind:this={ref}
  data-uipkge=""
  data-slot="table-cell"
  class={cn(
    'px-3 py-2 align-middle text-sm whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
    className,
  )}
  {...restProps}
>
  {@render children?.()}
</td>
