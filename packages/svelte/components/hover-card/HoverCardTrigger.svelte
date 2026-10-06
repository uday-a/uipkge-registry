<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface HoverCardTriggerProps extends HTMLAttributes<HTMLSpanElement> {
    children?: Snippet
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { getHoverCardContext } from './HoverCard.svelte'

  let { class: className, children, ...restProps }: HoverCardTriggerProps = $props()

  const ctx = getHoverCardContext()
</script>

<span
  data-uipkge
  data-slot="hover-card-trigger"
  data-state={ctx.open ? 'open' : 'closed'}
  aria-expanded={ctx.open}
  aria-haspopup="dialog"
  {...restProps}
  class={cn(className)}
  onmouseenter={ctx.scheduleOpen}
  onmouseleave={ctx.scheduleClose}
  onfocusin={ctx.scheduleOpen}
  onfocusout={ctx.scheduleClose}
>
  {@render children?.()}
</span>
