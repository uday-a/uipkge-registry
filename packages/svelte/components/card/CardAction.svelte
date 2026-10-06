<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface CardActionProps extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: CardActionProps = $props()
</script>

<div
  bind:this={ref}
  data-uipkge
  data-slot="card-action"
  class={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
  {...restProps}
>
  {@render children?.()}
</div>
