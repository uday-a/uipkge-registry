<script lang="ts" module>
  import type { Snippet } from 'svelte'

  export interface DialogProps {
    /** Controlled open state. The initial value doubles as `defaultOpen` —
     *  pass `open` once for an uncontrolled dialog with a custom default. */
    open?: boolean
    /** When false the dialog is non-modal: content skips the focus trap,
     *  body scroll-lock, and autofocus, and the overlay stops intercepting
     *  pointer events so the page stays interactive (Radix `modal` parity). */
    modal?: boolean
    onOpenChange?: (open: boolean) => void
    children?: Snippet
  }

  let dialogIdCounter = 0
</script>

<script lang="ts">
  import { setDialogContext } from './context'

  let { open = $bindable(false), modal = true, onOpenChange, children }: DialogProps = $props()

  dialogIdCounter += 1
  const titleId = `uipkge-dialog-title-${dialogIdCounter}`
  const descriptionId = `uipkge-dialog-description-${dialogIdCounter}`

  function setOpen(next: boolean) {
    if (next === open) return
    open = next
    onOpenChange?.(next)
  }

  setDialogContext({
    get open() {
      return open
    },
    setOpen,
    get titleId() {
      return titleId
    },
    get descriptionId() {
      return descriptionId
    },
    get modal() {
      return modal
    },
  })
</script>

{@render children?.()}
