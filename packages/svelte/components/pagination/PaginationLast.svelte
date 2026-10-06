<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  export interface PaginationLastProps extends HTMLButtonAttributes {
    children?: Snippet
    ref?: HTMLButtonElement | null
  }
</script>

<script lang="ts">
  import { getContext } from 'svelte'
  import { ChevronsRight } from '@lucide/svelte'
  import { PAGINATION_CTX, type PaginationContext } from './Pagination.svelte'

  let { class: className, children, disabled = false, ref = $bindable(null), ...restProps }: PaginationLastProps =
    $props()

  const ctx = getContext<PaginationContext | undefined>(PAGINATION_CTX)
  if (!ctx) throw new Error('PaginationLast must be used inside <Pagination>')

  const isDisabled = $derived(disabled || ctx.disabled || ctx.page >= ctx.pageCount)
</script>

<button
  bind:this={ref}
  type="button"
  data-uipkge
  data-slot="pagination-last"
  aria-label="Go to last page"
  disabled={isDisabled}
  class={className}
  {...restProps}
  onclick={() => ctx.goLast()}
>
  {#if children}
    {@render children()}
  {:else}
    <ChevronsRight class="size-4" aria-hidden="true" />
  {/if}
</button>
