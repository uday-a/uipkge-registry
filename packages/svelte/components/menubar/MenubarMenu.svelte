<script lang="ts" module>
  import type { Snippet } from 'svelte'

  export interface MenubarMenuProps {
    /**
     * Stable id for this menu. Defaults to a generated id. Pass one when
     * controlling the open menu through the root `value` / `defaultValue`.
     */
    value?: string
    children?: Snippet
  }

  let menuCounter = 0
</script>

<script lang="ts">
  import { untrack } from 'svelte'
  import { getMenubarRootContext, setMenubarMenuContext, setMenubarScopeContext, createItemScope } from './MenubarContext'

  let { value, children }: MenubarMenuProps = $props()

  const root = getMenubarRootContext()
  // Computed once: ids must stay stable for the component's lifetime (aria
  // references + root tracking depend on it).
  const id = untrack(() => value ?? `menu-${++menuCounter}`)
  const triggerId = `menubar-trigger-${id}`
  const contentId = `menubar-content-${id}`

  // The root is the single source of open state (see its `value` prop).
  const isOpen = $derived(root?.getOpenMenu() === id)

  function setOpen(next: boolean, refocusTrigger = false) {
    root?.setOpenMenu(next ? id : null, refocusTrigger)
  }

  let triggerEl: HTMLElement | null = $state(null)
  let contentEl: HTMLElement | null = $state(null)

  setMenubarMenuContext({
    id,
    triggerId,
    contentId,
    isOpen: () => isOpen,
    getTriggerEl: () => triggerEl,
    setTriggerEl: (el) => {
      triggerEl = el
    },
    getContentEl: () => contentEl,
    setContentEl: (el) => {
      contentEl = el
    },
  })

  setMenubarScopeContext(createItemScope((refocusTrigger) => setOpen(false, refocusTrigger)))
</script>

<div data-uipkge="" data-slot="menubar-menu" data-state={isOpen ? 'open' : 'closed'} class="relative">
  {@render children?.()}
</div>
