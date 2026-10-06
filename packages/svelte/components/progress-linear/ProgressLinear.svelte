<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'
  import type { ProgressLinearVariants } from './progress-linear.variants'

  export interface ProgressLinearProps extends HTMLAttributes<HTMLDivElement> {
    value?: number
    bgColor?: string
    buffer?: number
    color?: string
    height?: number | string
    indeterminate?: boolean
    reverse?: boolean
    rounded?: ProgressLinearVariants['rounded']
    stream?: boolean
    striped?: boolean
    active?: boolean
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { progressLinearVariants } from './progress-linear.variants'

  let {
    class: className,
    value = 0,
    bgColor,
    buffer,
    color,
    height,
    indeterminate = false,
    reverse = false,
    rounded,
    stream = false,
    striped = false,
    active = true,
    ref = $bindable(null),
    ...restProps
  }: ProgressLinearProps = $props()

  const normalizedValue = $derived(Math.min(100, Math.max(0, value)))
  const normalizedBuffer = $derived(Math.min(100, Math.max(0, buffer || 0)))
  const heightValue = $derived(
    typeof height === 'number' ? `${height}px` : typeof height === 'string' ? height : '4px',
  )
  const bgColorValue = $derived(bgColor || 'currentColor')
  const progressColorValue = $derived(color || 'currentColor')
  const containerClasses = $derived(cn(progressLinearVariants({ rounded }), className))
</script>

<div
  {...restProps}
  bind:this={ref}
  data-uipkge=""
  data-slot="progress-linear"
  role="progressbar"
  aria-valuemin={0}
  aria-valuemax={100}
  aria-valuenow={indeterminate ? undefined : normalizedValue}
  class={containerClasses}
  style:height={heightValue}
>
  <!-- Background -->
  <div
    class={cn('absolute inset-0 transition-colors duration-300', striped && 'progress-striped-light')}
    class:opacity-30={!indeterminate && normalizedBuffer > 0}
    class:opacity-100={indeterminate || normalizedBuffer <= 0}
    style:background-color={bgColorValue}
    style:width={normalizedBuffer > 0 ? `${normalizedBuffer}%` : '100%'}
  ></div>

  <!-- Buffer (if buffer > 0) -->
  {#if !indeterminate && normalizedBuffer > 0 && normalizedBuffer < 100}
    <div
      class={cn(
        'absolute inset-0 transition-colors duration-300',
        reverse ? 'right-0 left-auto' : 'right-auto left-0',
        striped && 'progress-striped-medium',
      )}
      style:background-color={bgColorValue}
      style:width={`${normalizedBuffer}%`}
      style:opacity={0.3}
    ></div>
  {/if}

  <!-- Stream lines (when stream is true) -->
  {#if stream && !indeterminate && active}
    <div class={cn('absolute inset-0 overflow-hidden', reverse ? 'right-0 left-auto' : 'right-auto left-0')}>
      <div class="animate-stream progress-stream absolute inset-0" style:width={`${normalizedBuffer || 100}%`}></div>
    </div>
  {/if}

  <!-- Progress bar -->
  <div
    class={cn(
      'absolute inset-y-0 transition-colors duration-300',
      reverse ? 'right-0 left-auto' : 'right-auto left-0',
      indeterminate && 'motion-safe:animate-indeterminate',
      striped && !indeterminate && 'progress-striped-heavy',
    )}
    style:width={indeterminate ? '100%' : `${normalizedValue}%`}
    style:background-color={indeterminate ? undefined : progressColorValue}
  >
    <!-- Indeterminate animations -->
    {#if indeterminate}
      <div
        class="motion-safe:animate-indeterminate1 absolute inset-y-0 w-full bg-inherit"
        style:background-color={progressColorValue}
      ></div>
      <div
        class="motion-safe:animate-indeterminate2 absolute inset-y-0 w-full bg-inherit"
        style:background-color={progressColorValue}
      ></div>
    {/if}
  </div>
</div>

<style>
  /* Gradient utilities */
  .progress-striped-light {
    background-image: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 8px,
      rgba(255, 255, 255, 0.1) 8px,
      rgba(255, 255, 255, 0.1) 16px
    );
  }

  .progress-striped-medium {
    background-image: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 8px,
      rgba(255, 255, 255, 0.15) 8px,
      rgba(255, 255, 255, 0.15) 16px
    );
  }

  .progress-striped-heavy {
    background-image: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 8px,
      rgba(255, 255, 255, 0.25) 8px,
      rgba(255, 255, 255, 0.25) 16px
    );
  }

  .progress-stream {
    background-image: repeating-linear-gradient(
      90deg,
      transparent,
      transparent 10px,
      rgba(255, 255, 255, 0.2) 10px,
      rgba(255, 255, 255, 0.2) 20px
    );
    background-size: 40px 40px;
  }

  @media (prefers-reduced-motion: no-preference) {
    .animate-indeterminate {
      animation: indeterminate 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    .animate-indeterminate1 {
      animation: indeterminate1 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    .animate-indeterminate2 {
      animation: indeterminate2 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    .animate-stream {
      animation: stream 1s linear infinite;
    }
  }

  @keyframes indeterminate {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(400%);
    }
  }

  @keyframes indeterminate1 {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(400%);
    }
  }

  @keyframes indeterminate2 {
    0% {
      transform: translateX(-100%);
      opacity: 1;
    }
    100% {
      transform: translateX(400%);
      opacity: 0;
    }
  }

  @keyframes stream {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(40px);
    }
  }
</style>
