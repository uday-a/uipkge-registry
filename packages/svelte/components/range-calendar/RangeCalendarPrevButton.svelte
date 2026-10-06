<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import type { RangeCalendarContext } from './RangeCalendar.svelte'

  export interface RangeCalendarPrevButtonProps extends HTMLButtonAttributes {
    children?: Snippet
    ref?: HTMLButtonElement | null
  }
</script>

<script lang="ts">
  import { getContext } from 'svelte'
  import { ChevronLeft } from '@lucide/svelte'
  import { cn } from '$lib/utils'
  import { buttonVariants } from '$lib/components/ui/button/button.variants'

  let {
    class: className,
    children,
    disabled = undefined,
    onclick: onclickProp,
    ref = $bindable(null),
    ...restProps
  }: RangeCalendarPrevButtonProps = $props()

  const calendar = getContext<RangeCalendarContext | undefined>('rangeCalendar')
  const effectiveDisabled = $derived(disabled ?? (calendar ? calendar.disabled || !calendar.canPrev : true))
</script>

<button
  bind:this={ref}
  type="button"
  data-uipkge=""
  data-slot="range-calendar-prev-button"
  aria-label="Previous month"
  disabled={effectiveDisabled}
  class={cn(
    buttonVariants({ variant: 'outline' }),
    'absolute left-1',
    'size-7 bg-transparent p-0 opacity-50 hover:opacity-100',
    className,
  )}
  {...restProps}
  onclick={(e) => {
    calendar?.prev()
    onclickProp?.(e)
  }}
>
  {#if children}
    {@render children()}
  {:else}
    <ChevronLeft class="size-4" aria-hidden="true" />
  {/if}
</button>
