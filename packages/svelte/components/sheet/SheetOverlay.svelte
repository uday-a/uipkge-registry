<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface SheetOverlayProps extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { getSheetContext } from './context'
  import { portal } from './portal'

  let { class: className, ref = $bindable(null), onclick, ...restProps }: SheetOverlayProps = $props()

  const ctx = getSheetContext()

  function handleClick(e: MouseEvent & { currentTarget: EventTarget & HTMLDivElement }) {
    ctx?.setOpen(false)
    onclick?.(e)
  }
</script>

<div
  use:portal
  bind:this={ref}
  data-uipkge=""
  data-slot="sheet-overlay"
  data-state={ctx?.open ? 'open' : 'closed'}
  class={cn(
    'motion-safe:data-[state=open]:animate-in motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=closed]:fade-out-0 motion-safe:data-[state=open]:fade-in-0 bg-foreground/50 fixed inset-0 z-50',
    ctx?.modal === false && 'pointer-events-none opacity-0',
    className,
  )}
  onclick={handleClick}
  {...restProps}
></div>
