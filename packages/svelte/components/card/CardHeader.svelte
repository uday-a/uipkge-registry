<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: CardHeaderProps = $props()
</script>

<div
  bind:this={ref}
  data-uipkge
  data-slot="card-header"
  class={cn(
    'grid auto-rows-min grid-cols-[minmax(0,1fr)] grid-rows-[auto_auto] items-start gap-1.5 p-6 has-data-[slot=card-action]:grid-cols-[minmax(0,1fr)_auto]',
    className,
  )}
  {...restProps}
>
  {@render children?.()}
</div>
