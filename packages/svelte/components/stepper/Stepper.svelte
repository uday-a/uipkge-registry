<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import type { StepperOrientation, StepperSize } from './context'
  import type { StepperStep } from './types'

  // Omit children: ours takes render params, the base Snippet takes none.
  export interface StepperProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    steps?: StepperStep[]
    /** Controlled active step (1-based). Bind with `bind:value`. */
    value?: number
    orientation?: StepperOrientation
    size?: StepperSize
    /** Override the header strip (defaults to the steps list). */
    stepsSnippet?: Snippet
    children?: Snippet<[{ activeStep: number; steps: StepperStep[] }]>
    ref?: HTMLDivElement | null
    onValueChange?: (value: number) => void
    /** Fires with the 1-based step index on every step click that navigates (alongside `onValueChange`). */
    onStepClick?: (stepIndex: number) => void
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { setStepperContext, type StepperStatus } from './context'
  import StepperItem from './StepperItem.svelte'

  let {
    class: className,
    steps = [],
    value = $bindable(1),
    orientation = 'horizontal',
    size = 'default',
    stepsSnippet,
    children,
    ref = $bindable(null),
    onValueChange,
    onStepClick,
    ...restProps
  }: StepperProps = $props()

  function getStatus(index: number): StepperStatus {
    const step = steps[index]
    if (step?.error) return 'error'
    if (index + 1 === value) return 'active'
    if (index + 1 < value) return 'completed'
    return 'pending'
  }

  function isClickable(index: number): boolean {
    return index + 1 < value
  }

  export function goToStep(stepIndex: number) {
    if (stepIndex < 1 || stepIndex > steps.length) return
    const step = steps[stepIndex - 1]
    if (step?.disabled) return
    value = stepIndex
    onValueChange?.(stepIndex)
    onStepClick?.(stepIndex)
  }

  setStepperContext({
    orientation: () => orientation,
    size: () => size,
    activeStep: () => value,
    steps: () => steps,
    goToStep,
    isClickable,
    getStatus,
  })
</script>

<div
  bind:this={ref}
  class={cn('w-full', className)}
  role="tablist"
  aria-orientation={orientation}
  data-orientation={orientation}
  data-uipkge=""
  data-slot="stepper"
  {...restProps}
>
  {#if stepsSnippet}
    {@render stepsSnippet()}
  {:else if steps.length > 0}
    <ol class={cn('flex', orientation === 'horizontal' ? 'flex-row items-start' : 'flex-col items-stretch')}>
      {#each steps as step, index (step.id)}
        <StepperItem {step} {index} />
      {/each}
    </ol>
  {/if}

  {#if children}
    <div class="mt-6 flex-1">
      {@render children({ activeStep: value, steps })}
    </div>
  {/if}
</div>
