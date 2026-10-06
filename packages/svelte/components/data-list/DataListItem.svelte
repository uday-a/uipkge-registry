<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface DataListItemProps extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: DataListItemProps = $props()
</script>

<div
  bind:this={ref}
  data-uipkge
  data-slot="data-list-item"
  class={cn(
    'flex flex-row items-center justify-between border-b py-4 transition-colors duration-200 first:pt-0 last:border-0 last:pb-0',
    className,
  )}
  {...restProps}
>
  {@render children?.()}
</div>
