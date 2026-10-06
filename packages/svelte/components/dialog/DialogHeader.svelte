<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface DialogHeaderProps extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: DialogHeaderProps = $props()
</script>

<div
  bind:this={ref}
  data-uipkge
  data-slot="dialog-header"
  class={cn('flex flex-col gap-2 text-center sm:text-left', className)}
  {...restProps}
>
  {@render children?.()}
</div>
