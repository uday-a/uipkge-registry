<script lang="ts" module>
  import type { HTMLTdAttributes } from 'svelte/elements'

  export interface TableEmptyProps extends HTMLTdAttributes {
    colspan?: number
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import TableCell from './TableCell.svelte'
  import TableRow from './TableRow.svelte'

  let { class: className, colspan = 1, children, ...restProps }: TableEmptyProps = $props()
</script>

<TableRow>
  <TableCell class={cn('text-foreground p-4 align-middle text-sm whitespace-nowrap', className)} {colspan} {...restProps}>
    <div class="flex items-center justify-center py-10">
      {@render children?.()}
    </div>
  </TableCell>
</TableRow>
