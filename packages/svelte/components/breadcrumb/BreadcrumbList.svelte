<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface BreadcrumbListProps extends HTMLAttributes<HTMLOListElement> {
    ref?: HTMLOListElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: BreadcrumbListProps = $props()
</script>

<ol
  bind:this={ref}
  data-uipkge
  data-slot="breadcrumb-list"
  class={cn('text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5', className)}
  {...restProps}
>
  {@render children?.()}
</ol>
