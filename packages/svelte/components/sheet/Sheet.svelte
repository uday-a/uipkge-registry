<script lang="ts" module>
  import type { Snippet } from 'svelte'

  export interface SheetProps {
    open?: boolean
    /** When false the sheet is non-modal: content skips the focus trap,
     *  body scroll-lock, and autofocus, and the overlay stops intercepting
     *  pointer events so the page stays interactive (Radix `modal` parity). */
    modal?: boolean
    onOpenChange?: (open: boolean) => void
    children?: Snippet
  }
</script>

<script lang="ts">
  import { setSheetContext } from './context'

  let { open = $bindable(false), modal = true, onOpenChange, children }: SheetProps = $props()

  let titleId: string | undefined = $state(undefined)
  let descriptionId: string | undefined = $state(undefined)

  function setOpen(next: boolean) {
    if (next === open) return
    open = next
    onOpenChange?.(next)
  }

  // Getters over $state keep every consumer reactive without runes in context.ts.
  setSheetContext({
    get open() {
      return open
    },
    setOpen,
    get titleId() {
      return titleId
    },
    setTitleId: (id) => (titleId = id),
    get descriptionId() {
      return descriptionId
    },
    setDescriptionId: (id) => (descriptionId = id),
    get modal() {
      return modal
    },
  })
</script>

{@render children?.()}
