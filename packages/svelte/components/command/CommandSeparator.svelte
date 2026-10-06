<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface CommandSeparatorProps extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: CommandSeparatorProps = $props()
</script>

<div
  bind:this={ref}
  data-uipkge
  data-slot="command-separator"
  role="separator"
  class={cn('bg-border -mx-1 h-px', className)}
  {...restProps}
>
  {@render children?.()}
</div>
