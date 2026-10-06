<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface SheetFooterProps extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: SheetFooterProps = $props()
</script>

<div
  bind:this={ref}
  data-uipkge=""
  data-slot="sheet-footer"
  class={cn('mt-auto flex flex-col gap-2 p-4', className)}
  {...restProps}
>
  {@render children?.()}
</div>
