<script lang="ts" module>
  import type { HTMLTdAttributes } from 'svelte/elements'

  export interface TableHeadProps extends HTMLTdAttributes {
    ref?: HTMLTableCellElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: TableHeadProps = $props()
</script>

<th
  bind:this={ref}
  data-uipkge=""
  data-slot="table-head"
  class={cn(
    'text-foreground h-10 px-3 text-left align-middle text-sm font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
    className,
  )}
  {...restProps}
>
  {@render children?.()}
</th>
