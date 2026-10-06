<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface StepperDescriptionProps extends HTMLAttributes<HTMLSpanElement> {
    ref?: HTMLSpanElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: StepperDescriptionProps = $props()
</script>

<span bind:this={ref} class={cn('text-muted-foreground text-xs', className)} {...restProps}>
  {@render children?.()}
</span>
