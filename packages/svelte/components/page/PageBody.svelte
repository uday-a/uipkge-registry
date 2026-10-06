<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface PageBodyProps extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: PageBodyProps = $props()
</script>

<div bind:this={ref} data-uipkge data-slot="page-body" class={cn('', className)} {...restProps}>
  {@render children?.()}
</div>
