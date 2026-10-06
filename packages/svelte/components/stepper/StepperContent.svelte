<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface StepperContentProps extends HTMLAttributes<HTMLDivElement> {
    step?: number
    activeStep?: number
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className, step = 1, activeStep = 1, children, ref = $bindable(null), ...restProps }: StepperContentProps =
    $props()

  const isActive = $derived(step === activeStep)
</script>

<div
  bind:this={ref}
  hidden={!isActive || undefined}
  data-slot="stepper-content"
  class={cn(
    'stepper-content motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-1 motion-safe:duration-200 motion-safe:ease-out',
    className,
  )}
  role="tabpanel"
  aria-hidden={!isActive}
  {...restProps}
>
  {@render children?.()}
</div>
