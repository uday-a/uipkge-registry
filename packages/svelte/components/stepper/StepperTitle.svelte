<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface StepperTitleProps extends HTMLAttributes<HTMLSpanElement> {
    ref?: HTMLSpanElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: StepperTitleProps = $props()
</script>

<span bind:this={ref} class={cn('text-foreground text-sm font-medium', className)} {...restProps}>
  {@render children?.()}
</span>
