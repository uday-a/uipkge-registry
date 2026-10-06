<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  export interface PaginationNextProps extends HTMLButtonAttributes {
    children?: Snippet
    ref?: HTMLButtonElement | null
  }
</script>

<script lang="ts">
  import { getContext } from 'svelte'
  import { ChevronRight } from '@lucide/svelte'
  import { PAGINATION_CTX, type PaginationContext } from './Pagination.svelte'

  let { class: className, children, disabled = false, ref = $bindable(null), ...restProps }: PaginationNextProps =
    $props()

  const ctx = getContext<PaginationContext | undefined>(PAGINATION_CTX)
  if (!ctx) throw new Error('PaginationNext must be used inside <Pagination>')

  const isDisabled = $derived(disabled || ctx.disabled || ctx.page >= ctx.pageCount)
</script>

<button
  bind:this={ref}
  type="button"
  data-uipkge
  data-slot="pagination-next"
  aria-label="Go to next page"
  disabled={isDisabled}
  class={className}
  {...restProps}
  onclick={() => ctx.goNext()}
>
  {#if children}
    {@render children()}
  {:else}
    <ChevronRight class="size-4" aria-hidden="true" />
  {/if}
</button>
