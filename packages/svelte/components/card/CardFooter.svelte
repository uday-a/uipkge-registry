<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: CardFooterProps = $props()
</script>

<div
  bind:this={ref}
  data-uipkge
  data-slot="card-footer"
  class={cn('flex items-center p-6 pt-0', className)}
  {...restProps}
>
  {@render children?.()}
</div>
