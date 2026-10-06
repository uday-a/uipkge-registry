<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface TableFooterProps extends HTMLAttributes<HTMLElement> {
    ref?: HTMLTableSectionElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: TableFooterProps = $props()
</script>

<tfoot
  bind:this={ref}
  data-uipkge=""
  data-slot="table-footer"
  class={cn('bg-muted/50 border-t font-medium [&>tr]:last:border-b-0', className)}
  {...restProps}
>
  {@render children?.()}
</tfoot>
