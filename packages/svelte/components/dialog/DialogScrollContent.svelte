<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface DialogScrollContentProps extends HTMLAttributes<HTMLDivElement> {
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

  type OnClick = NonNullable<HTMLAttributes<HTMLDivElement>['onclick']>

  let { class: className, children, ref = $bindable(null), ...restProps }: DialogScrollContentProps = $props()

  const ctx = getDialogContext()

  function handleBackdropClick(e: MouseEvent) {
    // Only backdrop clicks close — clicks inside the panel bubble with a
    // different target. Scrollbar clicks land on the container itself, so
    // exclude them like the Vue twin does.
    if (e.target !== e.currentTarget) return
    const el = e.currentTarget as HTMLElement
    if (e.offsetX > el.clientWidth || e.offsetY > el.clientHeight) return
    ctx.setOpen(false)
  }

  const onBackdropClick: OnClick = (e) => handleBackdropClick(e)

  $effect(() => {
    if (!ctx.open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        ctx.setOpen(false)
        return
      }
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
  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions: backdrop click-catcher; keyboard users dismiss with Escape -->
  <div
    use:portal
    data-uipkge
    data-slot="dialog-overlay"
    data-state="open"
    class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:ease-emphasized data-[state=open]:blur-in-2 data-[state=closed]:blur-out-2 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 bg-foreground/50 fixed inset-0 z-50 grid place-items-center overflow-y-auto data-[state=closed]:duration-[var(--dur-exit)] data-[state=open]:duration-200"
    onclick={onBackdropClick}
  >
    <div
      bind:this={ref}
      data-uipkge
      data-slot="dialog-content"
      role="dialog"
      aria-modal="true"
      aria-labelledby={ctx.titleId}
      aria-describedby={ctx.descriptionId}
      tabindex="-1"
      class={cn(
        'bg-background relative z-50 my-8 grid w-full max-w-lg gap-4 border p-6 shadow-lg duration-200 sm:rounded-lg md:w-full',
        className,
      )}
      {...restProps}
    >
      {@render children?.()}

      <DialogClose class="hover:bg-secondary absolute top-4 right-4 rounded-md p-0.5 transition-colors duration-200">
        <X class="h-4 w-4" aria-hidden="true" />
        <span class="sr-only">Close</span>
      </DialogClose>
    </div>
  </div>
{/if}
