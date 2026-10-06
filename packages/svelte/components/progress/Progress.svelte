<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
    /** Current value. Clamped to 0..max so the indicator can't overshoot the track. */
    value?: number | null
    max?: number
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let {
    class: className,
    value = 0,
    max = 100,
    ref = $bindable(null),
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    ...restProps
  }: ProgressProps = $props()

  // Clamp so out-of-range value cannot push the indicator past the track.
  const clampedValue = $derived(Math.min(max, Math.max(0, value ?? 0)))
  const percentage = $derived(max > 0 ? (clampedValue / max) * 100 : 0)
</script>

<div
  {...restProps}
  bind:this={ref}
  data-uipkge=""
  data-slot="progress"
  role="progressbar"
  aria-valuemin={0}
  aria-valuemax={max}
  aria-valuenow={clampedValue}
  aria-label={ariaLabel ?? (ariaLabelledby === undefined ? 'Progress' : undefined)}
  aria-labelledby={ariaLabelledby}
  class={cn('bg-primary/20 relative h-2 w-full overflow-hidden rounded-full', className)}
>
  <div
    data-uipkge=""
    data-slot="progress-indicator"
    class="bg-primary h-full w-full flex-1 transition-transform duration-500 ease-out motion-reduce:transition-none"
    style={`transform: translateX(-${100 - percentage}%);`}
  ></div>
</div>
