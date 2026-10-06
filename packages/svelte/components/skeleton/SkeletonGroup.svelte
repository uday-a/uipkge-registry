<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface SkeletonGroupProps extends HTMLAttributes<HTMLElement> {
    tag?: string
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, tag = 'div', children, ...restProps }: SkeletonGroupProps = $props()
</script>

<svelte:element this={tag} data-uipkge="" data-slot="skeleton-group" class={cn('space-y-2', className)} {...restProps}>
  {@render children?.()}
</svelte:element>
