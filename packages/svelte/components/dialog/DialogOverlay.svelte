<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface DialogOverlayProps extends HTMLAttributes<HTMLDivElement> {
    /** Fired on pointer-down outside the panel, before close. Call
     *  `preventDefault()` to keep the dialog open (Radix parity). */
    onPointerDownOutside?: (e: PointerEvent) => void
    /** Override the `data-slot` value (e.g. `command-dialog-overlay`). Default `'dialog-overlay'`. */
    dataSlot?: string
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { getDialogContext } from './context'
  import { portal } from './portal'

  type OnClick = NonNullable<HTMLAttributes<HTMLDivElement>['onclick']>
  type OnPointerDown = NonNullable<HTMLAttributes<HTMLDivElement>['onpointerdown']>

  let {
    class: className,
    children,
    dataSlot = 'dialog-overlay',
    ref = $bindable(null),
    onclick,
    onpointerdown,
    onPointerDownOutside,
    ...restProps
  }: DialogOverlayProps = $props()

  const ctx = getDialogContext()

  // Set by the pointerdown that precedes a backdrop click; when the outside
  // handler prevents default, the matching click must not close.
  let outsidePrevented = false

  const firePointerDownOutside: OnPointerDown = (e) => {
    onpointerdown?.(e)
    onPointerDownOutside?.(e)
    outsidePrevented = e.defaultPrevented
  }

  const closeOnBackdrop: OnClick = (e) => {
    onclick?.(e)
    if (e.defaultPrevented || outsidePrevented) {
      outsidePrevented = false
      return
    }
    outsidePrevented = false
    ctx.setOpen(false)
  }
</script>

{#if ctx.open}
  <div
    bind:this={ref}
    use:portal
    data-uipkge
    data-slot={dataSlot}
    data-state="open"
    class={cn(
      'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:ease-emphasized data-[state=open]:blur-in-2 data-[state=closed]:blur-out-2 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 bg-foreground/50 fixed inset-0 z-50 data-[state=closed]:duration-[var(--dur-exit)] data-[state=open]:duration-200',
      !ctx.modal && 'pointer-events-none',
      className,
    )}
    {...restProps}
    onclick={closeOnBackdrop}
    onpointerdown={firePointerDownOutside}
  >
    {@render children?.()}
  </div>
{/if}
