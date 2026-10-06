<script lang="ts" module>
  import type { Snippet } from 'svelte'

  export interface DropdownMenuSubProps {
    /** Controlled sub-menu open state. Use `bind:open` for two-way binding. */
    open?: boolean
    /** Called whenever the sub-menu open state changes. */
    onOpenChange?: (open: boolean) => void
    children?: Snippet
  }
</script>

<script lang="ts">
  import { setSubContext } from './dropdown-menu-context'

  let { open = $bindable(false), onOpenChange, children }: DropdownMenuSubProps = $props()

  const uid = $props.id()
  const ids = { trigger: `${uid}-trigger`, content: `${uid}-content` }

  let closeTimer: ReturnType<typeof setTimeout> | null = null

  function clearTimer() {
    if (closeTimer) {
      clearTimeout(closeTimer)
      closeTimer = null
    }
  }

  function setSubOpen(next: boolean) {
    // Any explicit set wins over a pending scheduled close (e.g. entering
    // the panel while the trigger's grace timer is still running).
    clearTimer()
    if (open === next) return
    open = next
    onOpenChange?.(next)
  }

  function scheduleClose(delay = 120) {
    clearTimer()
    closeTimer = setTimeout(() => {
      closeTimer = null
      setSubOpen(false)
    }, delay)
  }

  setSubContext({ isSubOpen: () => open, setSubOpen, scheduleClose, ids })
</script>

{@render children?.()}
