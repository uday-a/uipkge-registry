<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { PopoverCloseBehavior } from './context'

  export interface PopoverProps {
    /** Controlled open state (`bind:open`). Omit for uncontrolled. */
    open?: boolean
    defaultOpen?: boolean
    /** Modal popovers trap Tab focus while open. Default false. */
    modal?: boolean
    /** Persist open state to localStorage. `true` auto-keys, a string sets the key. */
    persist?: string | boolean
    closeBehavior?: PopoverCloseBehavior
    onOpenChange?: (open: boolean) => void
    children?: Snippet
  }
</script>

<script lang="ts">
  import { setContext } from 'svelte'
  import { POPOVER_CONTEXT_KEY, type PopoverContextValue } from './context'

  let {
    defaultOpen = false,
    open = $bindable(defaultOpen),
    modal = false,
    persist = false,
    closeBehavior = 'auto',
    onOpenChange,
    children,
  }: PopoverProps = $props()

  const autoId = $props.id()

  const storageKey = $derived(
    persist === false || persist === undefined
      ? null
      : persist === true
        ? `uipkge-popover-${autoId}`
        : persist,
  )

  // Read the persisted value on the first client pass, then write on change.
  // Runs only in the browser ($effect never fires during SSR), matching the
  // Vue twin's onMounted read (no hydration mismatch from a server read).
  let didInitPersist = false
  $effect(() => {
    const key = storageKey
    if (key && typeof localStorage !== 'undefined') {
      if (!didInitPersist) {
        didInitPersist = true
        if (localStorage.getItem(key) === '1') {
          setOpen(true)
          return
        }
      }
      if (open) localStorage.setItem(key, '1')
      else localStorage.removeItem(key)
    }
  })

  function setOpen(value: boolean) {
    open = value
    onOpenChange?.(value)
  }

  let triggerEl: HTMLElement | null = null
  let anchorEl: HTMLElement | null = null

  const ctx: PopoverContextValue = {
    id: autoId,
    contentId: `${autoId}-content`,
    triggerId: `${autoId}-trigger`,
    isOpen: () => open,
    setOpen,
    toggle: () => setOpen(!open),
    isModal: () => modal,
    getCloseBehavior: () => closeBehavior,
    getTriggerEl: () => triggerEl,
    getAnchorEl: () => anchorEl,
    // First registration wins: a Close trigger nested inside the content must
    // not steal the positioning anchor from the outer trigger.
    registerTrigger: (el) => {
      if (!triggerEl) triggerEl = el
    },
    unregisterTrigger: (el) => {
      if (triggerEl === el) triggerEl = null
    },
    registerAnchor: (el) => {
      if (!anchorEl) anchorEl = el
    },
    unregisterAnchor: (el) => {
      if (anchorEl === el) anchorEl = null
    },
  }
  setContext(POPOVER_CONTEXT_KEY, ctx)
</script>

<span data-uipkge="" data-slot="popover" class="contents">
  {@render children?.()}
</span>
