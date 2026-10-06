<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface BreadcrumbSeparatorProps extends HTMLAttributes<HTMLLIElement> {
    ref?: HTMLLIElement | null
  }
</script>

<script lang="ts">
  import { ChevronRight } from '@lucide/svelte'
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: BreadcrumbSeparatorProps = $props()
</script>

<li
  bind:this={ref}
  data-uipkge
  data-slot="breadcrumb-separator"
  role="presentation"
  aria-hidden="true"
  class={cn('[&>svg]:size-3.5', className)}
  {...restProps}
>
  {#if children}
    {@render children()}
  {:else}
    <ChevronRight />
  {/if}
</li>
