<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface DialogFooterProps extends HTMLAttributes<HTMLDivElement> {
    showCloseButton?: boolean
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { Button } from '$lib/components/ui/button'
  import { cn } from '$lib/utils'
  import DialogClose from './DialogClose.svelte'

  let {
    class: className,
    showCloseButton = false,
    children,
    ref = $bindable(null),
    ...restProps
  }: DialogFooterProps = $props()
</script>

<div
  bind:this={ref}
  data-uipkge
  data-slot="dialog-footer"
  class={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
  {...restProps}
>
  {@render children?.()}
  {#if showCloseButton}
    <DialogClose>
      {#snippet child({ props })}
        <Button variant="outline" {...props}>Close</Button>
      {/snippet}
    </DialogClose>
  {/if}
</div>
