<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface MenubarGroupProps extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: MenubarGroupProps = $props()
</script>

<div bind:this={ref} role="group" data-uipkge="" data-slot="menubar-group" class={cn(className)} {...restProps}>
  {@render children?.()}
</div>
