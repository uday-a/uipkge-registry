<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  export interface PaginationFirstProps extends HTMLButtonAttributes {
    children?: Snippet
    ref?: HTMLButtonElement | null
  }
</script>

<script lang="ts">
  import { getContext } from 'svelte'
  import { ChevronsLeft } from '@lucide/svelte'
  import { PAGINATION_CTX, type PaginationContext } from './Pagination.svelte'

  let { class: className, children, disabled = false, ref = $bindable(null), ...restProps }: PaginationFirstProps =
    $props()

  const ctx = getContext<PaginationContext | undefined>(PAGINATION_CTX)
  if (!ctx) throw new Error('PaginationFirst must be used inside <Pagination>')

  const isDisabled = $derived(disabled || ctx.disabled || ctx.page <= 1)
</script>

<button
  bind:this={ref}
  type="button"
  data-uipkge
  data-slot="pagination-first"
  aria-label="Go to first page"
  disabled={isDisabled}
  class={className}
  {...restProps}
  onclick={() => ctx.goFirst()}
>
  {#if children}
    {@render children()}
  {:else}
    <ChevronsLeft class="size-4" aria-hidden="true" />
  {/if}
</button>
