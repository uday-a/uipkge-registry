<script lang="ts" module>
  import type { Snippet } from 'svelte'

  export interface TooltipProps {
    /** Controlled open state. Bind it for two-way updates. */
    open?: boolean
    /** Initial open state for uncontrolled use. */
    defaultOpen?: boolean
    /** Called whenever the open state changes. */
    onOpenChange?: (open: boolean) => void
    /** Extra classes for the positioning wrapper (e.g. `w-full` when the
     *  trigger child is full-width, like a sidebar menu button). */
    class?: string
    children?: Snippet
  }
</script>

<script lang="ts">
  import { untrack } from 'svelte'
  import { cn } from '$lib/utils'
  import { TooltipRootState, getTooltipProviderState, setTooltipRootState } from './context.svelte'

  let { defaultOpen = false, open = $bindable(defaultOpen), onOpenChange, class: className, children }: TooltipProps = $props()

  const root = new TooltipRootState()
  root.provider = getTooltipProviderState()
  root.onOpenChange = (next) => {
    open = next
    onOpenChange?.(next)
  }
  setTooltipRootState(root)

  // Controlled mode: reflect the bound value. Untracked so internal
  // trigger/content updates (which already write through to `open`) don't
  // ping-pong back into the root.
  $effect(() => {
    const next = open
    untrack(() => {
      if (next !== root.open) root.setOpen(next)
    })
  })
</script>

<!-- Relative anchor for the absolutely-positioned content (no portal: the
     hand-rolled content renders inline and positions against this box). -->
<span data-uipkge="" data-slot="tooltip" data-state={root.open ? 'open' : 'closed'} class={cn('relative inline-block', className)}>
  {@render children?.()}
</span>
