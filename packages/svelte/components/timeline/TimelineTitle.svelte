<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface TimelineTitleProps extends HTMLAttributes<HTMLElement> {
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div'
    ref?: HTMLElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { as: tag = 'h3', class: className, children, ref = $bindable(null), ...restProps }: TimelineTitleProps =
    $props()

  function setRef(node: HTMLElement) {
    ref = node
  }
</script>

<svelte:element
  this={tag}
  use:setRef
  data-uipkge=""
  data-slot="timeline-title"
  class={cn('text-sm leading-none font-semibold tracking-tight', className)}
  {...restProps}
>
  {@render children?.()}
</svelte:element>
