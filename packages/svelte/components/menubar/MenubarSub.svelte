<script lang="ts" module>
  import type { Snippet } from 'svelte'

  export interface MenubarSubProps {
    open?: boolean
    defaultOpen?: boolean
    children?: Snippet
  }
</script>

<script lang="ts">
  import { tick } from 'svelte'
  import {
    createItemScope,
    getMenubarScopeContext,
    setMenubarScopeContext,
    setMenubarSubContext,
  } from './MenubarContext'

  let { open = $bindable(false), defaultOpen = false, children }: MenubarSubProps = $props()

  let seeded = false
  $effect.pre(() => {
    if (!seeded && !open && defaultOpen) open = true
    seeded = true
  })

  let triggerEl: HTMLElement | null = $state(null)

  function setOpen(next: boolean, refocusTrigger = false) {
    open = next
    if (refocusTrigger && !next) tick().then(() => triggerEl?.focus({ preventScroll: true }))
  }

  // Capture the enclosing scope BEFORE shadowing it below.
  const parentScope = getMenubarScopeContext()

  setMenubarSubContext({
    isOpen: () => open,
    setOpen,
    getTriggerEl: () => triggerEl,
    setTriggerEl: (el) => {
      triggerEl = el
    },
    parentScope,
  })

  // Shadow the parent menu's roving scope so arrows stay inside the flyout.
  setMenubarScopeContext(createItemScope((refocusTrigger) => setOpen(false, refocusTrigger)))
</script>

<div data-uipkge="" data-slot="menubar-sub" data-state={open ? 'open' : 'closed'} class="relative">
  {@render children?.()}
</div>
