<script lang="ts" module>
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import type { StepperSize, StepperStatus } from './context'
  import type { IconComponent } from './types'

  export interface StepperIndicatorProps extends HTMLButtonAttributes {
    status?: StepperStatus
    size?: StepperSize
    index?: number
    icon?: IconComponent
    clickable?: boolean
    ref?: HTMLButtonElement | null
  }
</script>

<script lang="ts">
  import { Check, X } from '@lucide/svelte'
  import { cn } from '$lib/utils'
  import { stepperIndicatorVariants } from './stepper.variants'

  let {
    class: className,
    status = 'pending',
    size = 'default',
    index,
    icon,
    clickable = false,
    children,
    ref = $bindable(null),
    onclick,
    ...restProps
  }: StepperIndicatorProps = $props()

  const FallbackIcon = $derived(icon ?? (status === 'completed' ? Check : status === 'error' ? X : null))
</script>

<button
  bind:this={ref}
  type="button"
  data-uipkge=""
  data-slot="stepper-indicator"
  data-status={status}
  class={cn(
    stepperIndicatorVariants({ status, size }),
    'ring-background relative z-10 ring-4 transition-[color,background-color,box-shadow,transform] duration-200 outline-none',
    clickable && 'focus-visible:ring-ring cursor-pointer focus-visible:ring-2 focus-visible:outline-none',
    !clickable && 'cursor-default',
    className,
  )}
  disabled={!clickable}
  aria-current={status === 'active' ? 'step' : undefined}
  {onclick}
  {...restProps}
>
  {#if children}
    {@render children()}
  {:else if FallbackIcon}
    <FallbackIcon class="size-4" data-slot="stepper-indicator-icon" aria-hidden="true" />
  {:else if index !== undefined}
    <span class="font-medium" data-slot="stepper-indicator-label">{index}</span>
  {/if}
</button>

<style>
  @keyframes stepper-indicator-pop {
    0% {
      transform: scale(0.92);
    }
    55% {
      transform: scale(1.06);
    }
    100% {
      transform: scale(1);
    }
  }

  /* Same curve as pop; distinct name so status changes re-trigger. */
  @keyframes stepper-indicator-fill {
    0% {
      transform: scale(0.92);
    }
    55% {
      transform: scale(1.06);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes stepper-indicator-error {
    0% {
      transform: scale(0.92);
    }
    55% {
      transform: scale(1.06);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes stepper-icon-in {
    from {
      opacity: 0;
      transform: scale(0.6);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* One-shot pop when a step becomes active / completed / error.
     Distinct animation names so active→completed restarts the pop. */
  [data-slot='stepper-indicator'][data-status='active'] {
    animation: stepper-indicator-pop 280ms cubic-bezier(0.22, 1.4, 0.36, 1) both;
  }

  [data-slot='stepper-indicator'][data-status='completed'] {
    animation: stepper-indicator-fill 280ms cubic-bezier(0.22, 1.4, 0.36, 1) both;
  }

  [data-slot='stepper-indicator'][data-status='error'] {
    animation: stepper-indicator-error 280ms cubic-bezier(0.22, 1.4, 0.36, 1) both;
  }

  /* Check / error / custom icon settles in with the fill. The icon renders
     inside a child component, so its half of the selector is :global — the
     indicator half stays scoped. */
  [data-slot='stepper-indicator'][data-status='completed'] :global([data-slot='stepper-indicator-icon']),
  [data-slot='stepper-indicator'][data-status='error'] :global([data-slot='stepper-indicator-icon']),
  [data-slot='stepper-indicator'][data-status='active'] :global([data-slot='stepper-indicator-icon']) {
    animation: stepper-icon-in 220ms cubic-bezier(0.22, 1.2, 0.36, 1) both;
  }

  @media (prefers-reduced-motion: reduce) {
    [data-slot='stepper-indicator'],
    [data-slot='stepper-indicator'] :global([data-slot='stepper-indicator-icon']),
    [data-slot='stepper-indicator'] [data-slot='stepper-indicator-label'] {
      animation: none !important;
      transition: none !important;
    }
  }
</style>
