<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface PageProps extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: PageProps = $props()
</script>

<div bind:this={ref} data-uipkge data-slot="page" class={cn('space-y-6', className)} {...restProps}>
  {@render children?.()}
</div>
