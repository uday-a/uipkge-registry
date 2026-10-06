<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface BreadcrumbEllipsisProps extends HTMLAttributes<HTMLSpanElement> {
    ref?: HTMLSpanElement | null
  }
</script>

<script lang="ts">
  import { MoreHorizontal } from '@lucide/svelte'
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: BreadcrumbEllipsisProps = $props()
</script>

<span
  bind:this={ref}
  data-uipkge
  data-slot="breadcrumb-ellipsis"
  class={cn('flex size-11 items-center justify-center', className)}
  {...restProps}
>
  {#if children}
    {@render children()}
  {:else}
    <MoreHorizontal class="size-4" aria-hidden="true" />
  {/if}
  <span class="sr-only">More</span>
</span>
