<script lang="ts" module>
  import type { Snippet } from 'svelte'

  export interface ContextMenuProps {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    children?: Snippet
  }
</script>

<script lang="ts">
  import { setContextMenuContext, type MenuPosition } from './context'

  let { open = $bindable(false), onOpenChange, children }: ContextMenuProps = $props()

  let position = $state<MenuPosition>({ x: 0, y: 0 })
  const menuElements = new Set<HTMLElement>()
  let triggerEl: HTMLElement | null = null

  function setOpen(next: boolean) {
    if (next === open) return
    open = next
    onOpenChange?.(next)
  }

  function isInsideMenu(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) return false
    if (triggerEl?.contains(target)) return true
    for (const el of menuElements) {
      if (el.contains(target)) return true
    }
    return false
  }

  $effect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (!isInsideMenu(e.target)) setOpen(false)
    }
    const onContextMenu = (e: MouseEvent) => {
      // Right-clicking elsewhere moves or closes the menu; the new trigger (if
      // any) reopens at its own position.
      if (!isInsideMenu(e.target)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
      }
    }
    window.addEventListener('pointerdown', onPointerDown, true)
    window.addEventListener('contextmenu', onContextMenu, true)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('pointerdown', onPointerDown, true)
      window.removeEventListener('contextmenu', onContextMenu, true)
      window.removeEventListener('keydown', onKeyDown)
    }
  })

  setContextMenuContext({
    get open() {
      return open
    },
    openAt(pos) {
      position = pos
      setOpen(true)
    },
    close() {
      setOpen(false)
    },
    get position() {
      return position
    },
    registerMenuElement(el) {
      menuElements.add(el)
    },
    unregisterMenuElement(el) {
      menuElements.delete(el)
    },
    registerTrigger(el) {
      triggerEl = el
    },
    isInsideMenu,
  })
</script>

{@render children?.()}
