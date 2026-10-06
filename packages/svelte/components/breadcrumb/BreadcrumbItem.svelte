<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface BreadcrumbItemProps extends HTMLAttributes<HTMLLIElement> {
    ref?: HTMLLIElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: BreadcrumbItemProps = $props()
</script>

<li
  bind:this={ref}
  data-uipkge
  data-slot="breadcrumb-item"
  class={cn('inline-flex items-center gap-1.5', className)}
  {...restProps}
>
  {@render children?.()}
</li>
