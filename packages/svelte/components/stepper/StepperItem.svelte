<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'
  import type { StepperStep } from './types'

  export interface StepperItemProps extends HTMLAttributes<HTMLLIElement> {
    step: StepperStep
    index: number
    ref?: HTMLLIElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { getStepperContext, type StepperContextValue } from './context'
  import StepperIndicator from './StepperIndicator.svelte'

  let { class: className, step, index, ref = $bindable(null), ...restProps }: StepperItemProps = $props()

  const maybeCtx = getStepperContext()
  if (!maybeCtx) throw new Error('StepperItem must be used inside <Stepper>')
  const ctx: StepperContextValue = maybeCtx

  const status = $derived(ctx.getStatus(index))
  const orientation = $derived(ctx.orientation())
  const size = $derived(ctx.size())
  const isFirst = $derived(index === 0)
  const isLast = $derived(index === ctx.steps().length - 1)
  const clickable = $derived(ctx.isClickable(index) && !step.disabled)

  // Indicator row must match stepperIndicatorVariants sizes (sm 7 / default 9 / lg 11).
  // Full class strings so Tailwind's scanner keeps them.
  const indicatorAxisClass = $derived.by(() => {
    if (orientation === 'horizontal') {
      return { sm: 'h-7 w-full items-center justify-center', default: 'h-9 w-full items-center justify-center', lg: 'h-11 w-full items-center justify-center' }[size]
    }
    return { sm: 'w-7 flex-col items-center justify-start self-stretch', default: 'w-9 flex-col items-center justify-start self-stretch', lg: 'w-11 flex-col items-center justify-start self-stretch' }[size]
  })

  // A connector "segment" is the line drawn between this indicator and the
  // adjacent one. We split it into left/right halves so each item owns its
  // own piece — they butt up at item boundaries for pixel alignment.
  const leftSegmentCompleted = $derived(index < ctx.activeStep())
  const rightSegmentCompleted = $derived(index < ctx.activeStep() - 1)

  function handleNavigate() {
    if (clickable) ctx.goToStep(index + 1)
  }
</script>

<li
  bind:this={ref}
  data-uipkge=""
  data-slot="stepper-item"
  class={cn(
    'group/stepper-item relative min-w-0',
    orientation === 'horizontal' ? 'flex flex-1 flex-col items-center gap-2' : 'flex flex-row items-start gap-3 pb-6 last:pb-0',
    step.disabled && 'opacity-50',
    className,
  )}
  role="tab"
  aria-selected={status === 'active'}
  aria-disabled={step.disabled || undefined}
  data-status={status}
  {...restProps}
>
  <div class={cn('relative flex shrink-0', indicatorAxisClass)}>
    {#if !isFirst}
      <span
        aria-hidden="true"
        data-slot="stepper-connector"
        data-orientation={orientation}
        data-edge={orientation === 'horizontal' ? 'left' : 'top'}
        class={cn(
          'bg-border pointer-events-none absolute overflow-hidden',
          orientation === 'horizontal' ? 'top-1/2 right-1/2 left-0 h-px -translate-y-1/2' : 'top-0 bottom-1/2 left-1/2 w-px -translate-x-1/2',
        )}
      >
        <span data-slot="stepper-connector-fill" data-completed={leftSegmentCompleted ? 'true' : 'false'} data-orientation={orientation} class="bg-primary absolute inset-0"></span>
      </span>
    {/if}
    {#if !isLast}
      <span
        aria-hidden="true"
        data-slot="stepper-connector"
        data-orientation={orientation}
        data-edge={orientation === 'horizontal' ? 'right' : 'bottom'}
        class={cn(
          'bg-border pointer-events-none absolute overflow-hidden',
          orientation === 'horizontal' ? 'top-1/2 right-0 left-1/2 h-px -translate-y-1/2' : 'top-1/2 bottom-0 left-1/2 w-px -translate-x-1/2',
        )}
      >
        <span data-slot="stepper-connector-fill" data-completed={rightSegmentCompleted ? 'true' : 'false'} data-orientation={orientation} class="bg-primary absolute inset-0"></span>
      </span>
    {/if}

    <StepperIndicator
      {status}
      {size}
      index={index + 1}
      icon={step.icon}
      {clickable}
      class="focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none"
      onclick={handleNavigate}
    />
  </div>

  <div data-slot="stepper-item-content" class={cn('min-w-0', orientation === 'horizontal' ? 'max-w-[12rem] text-center' : 'flex-1 pt-1.5')}>
    <button
      type="button"
      class={cn(
        'text-foreground text-sm font-medium text-balance transition-colors duration-200 outline-none',
        clickable && 'hover:text-primary focus-visible:text-primary focus-visible:ring-ring cursor-pointer focus-visible:ring-2 focus-visible:outline-none',
        !clickable && 'cursor-default',
        status === 'pending' && 'text-muted-foreground',
        status === 'error' && 'text-destructive',
      )}
      disabled={!clickable}
      onclick={handleNavigate}
    >
      {step.title}
    </button>
    {#if step.description}
      <p class="text-muted-foreground mt-0.5 text-xs text-balance">{step.description}</p>
    {/if}
  </div>
</li>

<style>
  /* Connector progress: fill scales along the track with a soft ease. */
  [data-slot='stepper-connector-fill'] {
    transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  [data-slot='stepper-connector-fill'][data-orientation='horizontal'] {
    transform-origin: left center;
    transform: scaleX(0);
  }

  [data-slot='stepper-connector-fill'][data-orientation='horizontal'][data-completed='true'] {
    transform: scaleX(1);
  }

  [data-slot='stepper-connector-fill'][data-orientation='vertical'] {
    transform-origin: center top;
    transform: scaleY(0);
  }

  [data-slot='stepper-connector-fill'][data-orientation='vertical'][data-completed='true'] {
    transform: scaleY(1);
  }

  @media (prefers-reduced-motion: reduce) {
    [data-slot='stepper-connector-fill'] {
      transition: none !important;
    }
  }
</style>
