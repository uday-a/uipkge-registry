<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import type { PaginationItem } from './Pagination.svelte'

  export interface PaginationListSlotProps {
    items: PaginationItem[]
  }

  export interface PaginationListProps extends Omit<HTMLAttributes<HTMLUListElement>, 'children'> {
    children?: Snippet<[PaginationListSlotProps]>
    ref?: HTMLUListElement | null
  }
</script>

<script lang="ts">
  import { getContext } from 'svelte'
  import { cn } from '$lib/utils'
  import { PAGINATION_CTX, type PaginationContext } from './Pagination.svelte'

  let { class: className, children, ref = $bindable(null), ...restProps }: PaginationListProps = $props()

  const ctx = getContext<PaginationContext | undefined>(PAGINATION_CTX)
  if (!ctx) throw new Error('PaginationList must be used inside <Pagination>')
</script>

<ul
  bind:this={ref}
  data-uipkge
  data-slot="pagination-list"
  class={cn('flex items-center gap-1', className)}
  {...restProps}
>
  {@render children?.({ items: ctx.items })}
</ul>
