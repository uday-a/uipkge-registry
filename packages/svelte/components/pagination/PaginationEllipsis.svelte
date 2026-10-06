<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface PaginationEllipsisProps extends HTMLAttributes<HTMLSpanElement> {
    children?: Snippet
  }
</script>

<script lang="ts">
  import { MoreHorizontal } from '@lucide/svelte'
  import { cn } from '$lib/utils'

  let { class: className, children, ...restProps }: PaginationEllipsisProps = $props()
</script>

<li>
  <span aria-hidden="true" data-uipkge data-slot="pagination-ellipsis" class={cn('shrink-0', className)} {...restProps}>
    {#if children}
      {@render children()}
    {:else}
      <MoreHorizontal class="size-4" aria-hidden="true" />
    {/if}
  </span>
</li>
