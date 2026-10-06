<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface SheetContentProps extends HTMLAttributes<HTMLDivElement> {
    side?: 'top' | 'right' | 'bottom' | 'left'
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { X } from '@lucide/svelte'
  import { cn } from '$lib/utils'
  import { getSheetContext } from './context'
  import SheetOverlay from './SheetOverlay.svelte'

  let { class: className, side = 'right', children, ref = $bindable(null), ...restProps }: SheetContentProps = $props()

  const ctx = getSheetContext()
  const open = $derived(ctx?.open ?? false)

  let panel: HTMLDivElement | null = $state(null)

  $effect(() => {
    ref = panel
  })

  // Hand-rolled dialog behavior (no headless dep yet — see the bits-ui
  // proposal in the port report): Escape to close, body scroll lock,
  // autofocus + focus trap while open, and focus restore on close.
  $effect(() => {
    if (!open || !ctx) return
    const node = panel
    if (!node || typeof document === 'undefined') return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const previouslyFocused = document.activeElement as HTMLElement | null

    const focusables = () =>
      [...node.querySelectorAll<HTMLElement>('a[href], button, input, select, textarea, [tabindex]')].filter(
        (el) => !el.hasAttribute('disabled') && el.tabIndex !== -1 && el.offsetParent !== null,
      )

    // Focus the first control (or the panel itself) so keyboard users land inside.
    const first = focusables()[0]
    if (first) first.focus()
    else {
      node.tabIndex = -1
      node.focus({ preventScroll: true })
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        ctx.setOpen(false)
        return
      }
      if (e.key !== 'Tab') return
      const items = focusables()
      if (items.length === 0) {
        e.preventDefault()
        return
      }
      const firstItem = items[0]!
      const lastItem = items[items.length - 1]!
      if (e.shiftKey && document.activeElement === firstItem) {
        e.preventDefault()
        lastItem.focus()
      } else if (!e.shiftKey && document.activeElement === lastItem) {
        e.preventDefault()
        firstItem.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus?.({ preventScroll: true })
    }
  })
</script>

{#if open}
  <SheetOverlay />
  <div
    bind:this={panel}
    role="dialog"
    aria-modal="true"
    aria-labelledby={ctx?.titleId}
    aria-describedby={ctx?.descriptionId}
    data-uipkge=""
    data-slot="sheet-content"
    data-state="open"
    data-side={side}
    class={cn(
      'bg-background motion-safe:data-[state=open]:animate-in motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=open]:ease-emphasized motion-safe:data-[state=open]:blur-in-2 motion-safe:data-[state=closed]:blur-out-2 fixed z-50 flex flex-col gap-4 overflow-hidden shadow-lg transition ease-in-out motion-safe:data-[state=closed]:duration-200 motion-safe:data-[state=open]:duration-300',
      side === 'right' &&
        'motion-safe:data-[state=closed]:slide-out-to-right motion-safe:data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
      side === 'left' &&
        'motion-safe:data-[state=closed]:slide-out-to-left motion-safe:data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
      side === 'top' &&
        'motion-safe:data-[state=closed]:slide-out-to-top motion-safe:data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b',
      side === 'bottom' &&
        'motion-safe:data-[state=closed]:slide-out-to-bottom motion-safe:data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t',
      className,
    )}
    {...restProps}
  >
    {@render children?.()}

    <button
      type="button"
      onclick={() => ctx?.setOpen(false)}
      class="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none"
    >
      <X class="size-4" aria-hidden="true" />
      <span class="sr-only">Close</span>
    </button>
  </div>
{/if}
