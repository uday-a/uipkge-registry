<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface SheetHeaderProps extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: SheetHeaderProps = $props()
</script>

<div
  bind:this={ref}
  data-uipkge=""
  data-slot="sheet-header"
  class={cn('flex flex-col gap-1.5 p-4', className)}
  {...restProps}
>
  {@render children?.()}
</div>
