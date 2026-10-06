<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface DropdownMenuSeparatorProps extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, ref = $bindable(null), ...restProps }: DropdownMenuSeparatorProps = $props()
</script>

<div
  bind:this={ref}
  role="separator"
  data-uipkge
  data-slot="dropdown-menu-separator"
  class={cn('bg-border -mx-1 my-1 h-px', className)}
  {...restProps}
></div>
