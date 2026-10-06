<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import type { RangeCalendarContext } from './RangeCalendar.svelte'

  // Omit `children`: the snippet carries headingValue, which narrows the base `Snippet` type.
  export interface RangeCalendarHeadingProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    children?: Snippet<[{ headingValue: string }]>
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { getContext } from 'svelte'
  import { cn } from '$lib/utils'

  let { class: className, children, ref = $bindable(null), ...restProps }: RangeCalendarHeadingProps = $props()

  const calendar = getContext<RangeCalendarContext | undefined>('rangeCalendar')
  const headingValue = $derived(calendar?.headingValue ?? '')
</script>

<div
  bind:this={ref}
  data-uipkge=""
  data-slot="range-calendar-heading"
  aria-live="polite"
  class={cn('text-sm font-medium', className)}
  {...restProps}
>
  {#if children}
    {@render children({ headingValue })}
  {:else}
    {headingValue}
  {/if}
</div>
