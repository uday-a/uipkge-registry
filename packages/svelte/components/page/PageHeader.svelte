<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface PageHeaderProps extends HTMLAttributes<HTMLDivElement> {
    /** Action buttons rendered right of the heading (the Vue `#actions` slot). */
    actions?: Snippet
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, actions, children, ref = $bindable(null), ...restProps }: PageHeaderProps = $props()
</script>

<div
  bind:this={ref}
  data-uipkge
  data-slot="page-header"
  class={cn('flex flex-col justify-between gap-4 sm:flex-row sm:items-center', className)}
  {...restProps}
>
  <div class="flex-1">
    {@render children?.()}
  </div>
  {@render actions?.()}
</div>
