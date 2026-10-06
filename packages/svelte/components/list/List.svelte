<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface ListProps extends HTMLAttributes<HTMLElement> {
    as?: 'ul' | 'ol' | 'div'
    children?: Snippet
    ref?: HTMLElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, as = 'ul', children, ref = $bindable(null), ...restProps }: ListProps = $props()

  const listClass = $derived(cn('list-none space-y-1', className))
</script>

{#if as === 'ol'}
  <ol bind:this={ref} data-uipkge="" data-slot="list" class={listClass} {...restProps}>
    {@render children?.()}
  </ol>
{:else if as === 'div'}
  <div bind:this={ref} data-uipkge="" data-slot="list" class={listClass} {...restProps}>
    {@render children?.()}
  </div>
{:else}
  <ul bind:this={ref} data-uipkge="" data-slot="list" class={listClass} {...restProps}>
    {@render children?.()}
  </ul>
{/if}
