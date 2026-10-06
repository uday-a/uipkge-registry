<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import type { RangeCalendarContext } from './RangeCalendar.svelte'

  export interface RangeCalendarNextButtonProps extends HTMLButtonAttributes {
    children?: Snippet
    ref?: HTMLButtonElement | null
  }
</script>

<script lang="ts">
  import { getContext } from 'svelte'
  import { ChevronRight } from '@lucide/svelte'
  import { cn } from '$lib/utils'
  import { buttonVariants } from '$lib/components/ui/button/button.variants'

  let {
    class: className,
    children,
    disabled = undefined,
    onclick: onclickProp,
    ref = $bindable(null),
    ...restProps
  }: RangeCalendarNextButtonProps = $props()

  const calendar = getContext<RangeCalendarContext | undefined>('rangeCalendar')
  const effectiveDisabled = $derived(disabled ?? (calendar ? calendar.disabled || !calendar.canNext : true))
</script>

<button
  bind:this={ref}
  type="button"
  data-uipkge=""
  data-slot="range-calendar-next-button"
  aria-label="Next month"
  disabled={effectiveDisabled}
  class={cn(
    buttonVariants({ variant: 'outline' }),
    'absolute right-1',
    'size-7 bg-transparent p-0 opacity-50 hover:opacity-100',
    className,
  )}
  {...restProps}
  onclick={(e) => {
    calendar?.next()
    onclickProp?.(e)
  }}
>
  {#if children}
    {@render children()}
  {:else}
    <ChevronRight class="size-4" aria-hidden="true" />
  {/if}
</button>
