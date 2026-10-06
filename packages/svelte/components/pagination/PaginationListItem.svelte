<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  export interface PaginationListItemProps extends HTMLButtonAttributes {
    /** 1-based page number this item navigates to. */
    value: number
    children?: Snippet
    ref?: HTMLButtonElement | null
  }
</script>

<script lang="ts">
  import { getContext } from 'svelte'
  import { cn } from '$lib/utils'
  import { PAGINATION_CTX, type PaginationContext } from './Pagination.svelte'

  let {
    class: className,
    value,
    children,
    disabled = false,
    ref = $bindable(null),
    ...restProps
  }: PaginationListItemProps = $props()

  const ctx = getContext<PaginationContext | undefined>(PAGINATION_CTX)
  if (!ctx) throw new Error('PaginationListItem must be used inside <Pagination>')

  const isActive = $derived(ctx.page === value)
  const isDisabled = $derived(disabled || ctx.disabled)
</script>

<li>
  <button
    bind:this={ref}
    type="button"
    data-uipkge
    data-slot="pagination-list-item"
    data-selected={isActive ? true : undefined}
    aria-current={isActive ? 'page' : undefined}
    aria-label={`Page ${value}`}
    disabled={isDisabled}
    class={cn('shrink-0', className)}
    {...restProps}
    onclick={() => ctx.goTo(value)}
  >
    {@render children?.()}
  </button>
</li>
