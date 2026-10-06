<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface MenubarSeparatorProps extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, ref = $bindable(null), ...restProps }: MenubarSeparatorProps = $props()
</script>

<div
  bind:this={ref}
  role="separator"
  aria-orientation="horizontal"
  data-uipkge=""
  data-slot="menubar-separator"
  class={cn('bg-border -mx-1 my-1 h-px', className)}
  {...restProps}
></div>
