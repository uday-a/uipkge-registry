<script lang="ts" module>
  import type { Snippet } from 'svelte'

  export interface DropdownMenuProps {
    /** Controlled open state. Use `bind:open` for two-way binding. */
    open?: boolean
    /** Called whenever the open state changes. */
    onOpenChange?: (open: boolean) => void
    children?: Snippet
  }
</script>

<script lang="ts">
  import { focusMenuItem, setMenuContext } from './dropdown-menu-context'

  let { open = $bindable(false), onOpenChange, children }: DropdownMenuProps = $props()

  const uid = $props.id()
  const ids = { trigger: `${uid}-trigger`, content: `${uid}-content` }

  function setOpen(next: boolean) {
    if (open === next) return
    open = next
    onOpenChange?.(next)
  }

  function closeAndFocusTrigger() {
    setOpen(false)
    document.getElementById(ids.trigger)?.focus()
  }

  setMenuContext({
    ids,
    isOpen: () => open,
    setOpen,
    closeAndFocusTrigger,
  })

  $effect(() => {
    if (!open) return
    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node | null
      if (!target || !(target instanceof Element)) return
      // Clicks inside the trigger, content, or any sub-content keep the menu open.
      if (target.closest(`#${CSS.escape(ids.trigger)}, #${CSS.escape(ids.content)}, [data-slot="dropdown-menu-sub-content"]`))
        return
      setOpen(false)
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') closeAndFocusTrigger()
      // Tabbing away dismisses; focus continues naturally.
      if (e.key === 'Tab') setOpen(false)
      // Arrowing from a focused trigger jumps into the menu (covers both the
      // default button and `child` triggers like Button).
      if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && document.activeElement?.id === ids.trigger) {
        e.preventDefault()
        focusMenuItem(ids.content, e.key === 'ArrowDown' ? 'first' : 'last')
      }
    }
    // Capture phase so a trigger toggle click (bubble) doesn't instantly re-close.
    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true)
      document.removeEventListener('keydown', onKeyDown)
    }
  })
</script>

{@render children?.()}
