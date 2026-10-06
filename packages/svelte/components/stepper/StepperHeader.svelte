<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface StepperHeaderProps extends HTMLAttributes<HTMLDivElement> {
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: StepperHeaderProps = $props()
</script>

<div bind:this={ref} class={cn('stepper-header flex items-center gap-0', className)} {...restProps}>
  {@render children?.()}
</div>
