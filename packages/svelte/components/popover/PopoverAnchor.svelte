<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface PopoverAnchorProps extends HTMLAttributes<HTMLSpanElement> {
    ref?: HTMLSpanElement | null
  }
</script>

<script lang="ts">
  import { getContext } from 'svelte'
  import { cn } from '$lib/utils'
  import { POPOVER_CONTEXT_KEY, type PopoverContextValue } from './context'

  const ctx = getContext<PopoverContextValue>(POPOVER_CONTEXT_KEY)

  let { class: className, children, ref = $bindable(null), ...restProps }: PopoverAnchorProps = $props()

  function registerAnchor(node: HTMLElement) {
    ctx.registerAnchor(node)
    return {
      destroy: () => ctx.unregisterAnchor(node),
    }
  }
</script>

<!-- Positioning needs a measurable box, so unlike the headless reka anchor
     this renders a shrink-wrap span. Content prefers it over the trigger. -->
<span
  use:registerAnchor
  {...restProps}
  bind:this={ref}
  data-uipkge=""
  data-slot="popover-anchor"
  class={cn('inline-block', className)}
>
  {@render children?.()}
</span>
