<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
    ref?: HTMLTableRowElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: TableRowProps = $props()
</script>

<tr
  bind:this={ref}
  data-uipkge=""
  data-slot="table-row"
  class={cn('hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors duration-150', className)}
  {...restProps}
>
  {@render children?.()}
</tr>
