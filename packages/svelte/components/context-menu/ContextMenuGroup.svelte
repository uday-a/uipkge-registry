<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface ContextMenuGroupProps extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  let { class: className, children, ref = $bindable(null), ...restProps }: ContextMenuGroupProps = $props()
</script>

<div bind:this={ref} data-uipkge data-slot="context-menu-group" role="group" class={className} {...restProps}>
  {@render children?.()}
</div>
