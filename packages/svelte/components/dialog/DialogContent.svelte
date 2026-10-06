<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface DialogContentProps extends HTMLAttributes<HTMLDivElement> {
    showCloseButton?: boolean
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { tick } from 'svelte'
  import { X } from '@lucide/svelte'
  import { cn } from '$lib/utils'
  import { getDialogContext } from './context'
  import { portal } from './portal'
  import DialogClose from './DialogClose.svelte'
  import DialogOverlay from './DialogOverlay.svelte'

  let {
    class: className,
    showCloseButton = true,
    children,
    ref = $bindable(null),
    ...restProps
  }: DialogContentProps = $props()

  const ctx = getDialogContext()

  $effect(() => {
    if (!ctx.open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        ctx.setOpen(false)
        return
      }
      // Minimal focus trap: cycle Tab within the panel.
      if (e.key !== 'Tab' || !ref) return
      const focusables = ref.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      )
      if (!focusables.length) return
      const first = focusables[0]!
      const last = focusables[focusables.length - 1]!
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    tick().then(() => ref?.focus({ preventScroll: true }))
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
    }
  })
</script>

{#if ctx.open}
  <div use:portal>
    <DialogOverlay />
    <div
      bind:this={ref}
      data-uipkge
      data-slot="dialog-content"
      role="dialog"
      aria-modal="true"
      aria-labelledby={ctx.titleId}
      aria-describedby={ctx.descriptionId}
      tabindex="-1"
      data-state="open"
      class={cn(
        'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:ease-emphasized data-[state=open]:blur-in-2 data-[state=closed]:blur-out-2 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 data-[state=closed]:duration-[var(--dur-exit)] data-[state=open]:duration-200 sm:max-w-lg',
        className,
      )}
      {...restProps}
    >
      {@render children?.()}

      {#if showCloseButton}
        <DialogClose
          class="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
        >
          <X aria-hidden="true" />
          <span class="sr-only">Close</span>
        </DialogClose>
      {/if}
    </div>
  </div>
{/if}
