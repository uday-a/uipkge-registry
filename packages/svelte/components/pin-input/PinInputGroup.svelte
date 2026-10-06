<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface PinInputGroupProps extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: PinInputGroupProps = $props()
</script>

<div bind:this={ref} data-uipkge data-slot="pin-input-group" class={cn('flex items-center', className)} {...restProps}>
  {@render children?.()}
</div>
