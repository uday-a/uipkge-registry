<script lang="ts" module>
  import type { Snippet } from 'svelte'

  export interface TooltipProviderProps {
    /** ms before a hovered tooltip opens. Default 700. */
    delayDuration?: number
    /** Window after a close during which the next tooltip skips the delay. Default 300. */
    skipDelayDuration?: number
    children?: Snippet
  }
</script>

<script lang="ts">
  import { TooltipProviderState, setTooltipProviderState } from './context.svelte'

  let { delayDuration = 700, skipDelayDuration = 300, children }: TooltipProviderProps = $props()

  const state = new TooltipProviderState()
  setTooltipProviderState(state)

  $effect(() => {
    state.delayDuration = delayDuration
    state.skipDelayDuration = skipDelayDuration
  })
</script>

{@render children?.()}
