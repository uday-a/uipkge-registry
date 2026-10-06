<script lang="ts" module>
  import type { Snippet } from 'svelte'

  export interface ContextMenuSubProps {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    children?: Snippet
  }
</script>

<script lang="ts">
  import { tick } from 'svelte'
  import { menuItemsOf, setContextMenuSubContext } from './context'

  let { open = $bindable(false), onOpenChange, children }: ContextMenuSubProps = $props()

  let triggerEl: HTMLElement | null = null
  let contentEl: HTMLElement | null = null

  function setOpen(next: boolean) {
    if (next === open) return
    open = next
    onOpenChange?.(next)
  }

  setContextMenuSubContext({
    get open() {
      return open
    },
    setOpen,
    getTriggerElement() {
      return triggerEl
    },
    registerTriggerElement(el) {
      triggerEl = el
    },
    registerContentElement(el) {
      contentEl = el
    },
    focusFirstItem() {
      tick().then(() => {
        if (contentEl) menuItemsOf(contentEl)[0]?.focus()
      })
    },
    focusTrigger() {
      triggerEl?.focus()
    },
  })
</script>

{@render children?.()}
