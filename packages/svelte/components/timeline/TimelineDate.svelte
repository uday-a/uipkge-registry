<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface TimelineDateProps extends HTMLAttributes<HTMLElement> {
    ref?: HTMLElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: TimelineDateProps = $props()

  function setRef(node: HTMLElement) {
    ref = node
  }
</script>

<time
  use:setRef
  data-uipkge=""
  data-slot="timeline-date"
  class={cn('text-muted-foreground text-xs', className)}
  {...restProps}
>
  {@render children?.()}
</time>
