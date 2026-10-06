<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface DropdownMenuGroupProps extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  let { children, ref = $bindable(null), ...restProps }: DropdownMenuGroupProps = $props()
</script>

<div bind:this={ref} role="group" data-uipkge data-slot="dropdown-menu-group" {...restProps}>
  {@render children?.()}
</div>
