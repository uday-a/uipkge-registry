<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface DataListProps extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: DataListProps = $props()
</script>

<div bind:this={ref} data-uipkge data-slot="data-list" class={cn('flex flex-col', className)} {...restProps}>
  {@render children?.()}
</div>
