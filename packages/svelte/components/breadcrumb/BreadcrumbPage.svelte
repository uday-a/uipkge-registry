<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface BreadcrumbPageProps extends HTMLAttributes<HTMLSpanElement> {
    ref?: HTMLSpanElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: BreadcrumbPageProps = $props()
</script>

<span
  bind:this={ref}
  data-uipkge
  data-slot="breadcrumb-page"
  aria-current="page"
  class={cn('text-foreground cursor-default font-normal', className)}
  {...restProps}
>
  {@render children?.()}
</span>
