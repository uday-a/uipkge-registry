<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import type { CalendarDate } from '@internationalized/date'

  export interface CalendarCellTriggerProps extends HTMLButtonAttributes {
    day: CalendarDate
    month: CalendarDate
    /** Overrides the day content (defaults to the day number). Receives the same `{ day, month }`. */
    cell?: Snippet<[{ day: CalendarDate; month: CalendarDate }]>
    children?: Snippet
    ref?: HTMLButtonElement | null
  }
</script>

<script lang="ts">
  import { getContext } from 'svelte'
  import { cn } from '$lib/utils'
  import { buttonVariants } from '$lib/components/ui/button/button.variants'
  import { CALENDAR_CONTEXT_KEY, type CalendarState } from './calendar-state.svelte'

  let {
    class: className,
    day,
    month,
    cell,
    children,
    ref = $bindable(null),
    ...restProps
  }: CalendarCellTriggerProps = $props()

  const state = getContext<CalendarState | undefined>(CALENDAR_CONTEXT_KEY)

  const selected = $derived(state?.isSelected(day) ?? false)
  const selectionStart = $derived(state?.isSelectionStart(day) ?? false)
  const selectionEnd = $derived(state?.isSelectionEnd(day) ?? false)
  const highlighted = $derived(state?.isHighlighted(day) ?? false)
  const disabledDate = $derived(state?.isDisabledDate(day) ?? false)
  const unavailable = $derived(state?.isUnavailableDate(day) ?? false)
  const isToday = $derived(state?.isTodayDate(day) ?? false)
  const outsideView = $derived(state ? state.isOutsideView(day, month) : false)
  const isRange = $derived(state?.type === 'range')
  const hiddenOutside = $derived(outsideView && state?.showOutsideDays === false)
</script>

<button
  bind:this={ref}
  type="button"
  data-uipkge
  data-slot="calendar-cell-trigger"
  data-day={day.toString()}
  data-value={day.toString()}
  data-selected={selected ? '' : undefined}
  data-selection-start={selectionStart || undefined}
  data-selection-end={selectionEnd || undefined}
  data-highlighted={highlighted || undefined}
  data-disabled={disabledDate ? '' : undefined}
  data-unavailable={unavailable ? '' : undefined}
  data-today={isToday ? '' : undefined}
  data-outside-view={outsideView ? '' : undefined}
  aria-label={state?.formatDay(day)}
  aria-hidden={hiddenOutside || undefined}
  aria-disabled={unavailable && !disabledDate ? 'true' : undefined}
  disabled={disabledDate || hiddenOutside}
  tabindex={hiddenOutside || (state && !state.isTabbableDate(day)) ? -1 : 0}
  class={cn(
    buttonVariants({ variant: 'ghost' }),
    'size-9 cursor-pointer p-0 font-normal transition-[color,background-color,transform,box-shadow] duration-150 aria-selected:opacity-100',
    '[&[data-today]:not([data-selected])]:bg-accent [&[data-today]:not([data-selected])]:text-accent-foreground',
    // Single / multiple: selected day gets the primary fill.
    !isRange &&
      'data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[selected]:hover:bg-primary data-[selected]:hover:text-primary-foreground data-[selected]:focus:bg-primary data-[selected]:focus:text-primary-foreground data-[selected]:opacity-100 data-[selected]:shadow-sm motion-safe:data-[selected]:animate-[calendar-day-pop_220ms_cubic-bezier(0.22,1.4,0.36,1)_both]',
    // Range: middle days get the accent fill, start/end get primary + pop (mirrors RangeCalendar).
    isRange &&
      'data-[selected]:bg-accent data-[selected]:text-accent-foreground data-[selected]:opacity-100',
    isRange &&
      'data-[selection-start]:bg-primary data-[selection-start]:text-primary-foreground data-[selection-start]:hover:bg-primary data-[selection-start]:hover:text-primary-foreground data-[selection-start]:focus:bg-primary data-[selection-start]:focus:text-primary-foreground motion-safe:data-[selection-start]:animate-[calendar-day-pop_220ms_cubic-bezier(0.22,1.4,0.36,1)_both]',
    isRange &&
      'data-[selection-end]:bg-primary data-[selection-end]:text-primary-foreground data-[selection-end]:hover:bg-primary data-[selection-end]:hover:text-primary-foreground data-[selection-end]:focus:bg-primary data-[selection-end]:focus:text-primary-foreground motion-safe:data-[selection-end]:animate-[calendar-day-pop_220ms_cubic-bezier(0.22,1.4,0.36,1)_both]',
    // Disabled
    'data-[disabled]:text-muted-foreground data-[disabled]:opacity-50',
    // Unavailable
    'data-[unavailable]:text-destructive-foreground data-[unavailable]:line-through',
    // Outside months
    'data-[outside-view]:text-muted-foreground',
    hiddenOutside && 'invisible pointer-events-none',
    className,
  )}
  onclick={() => state?.select(day)}
  onkeydown={(e) => state?.handleDayKeydown(e, day)}
  onmouseenter={() => state?.hover(day)}
  onmouseleave={() => state?.hover(null)}
  onfocus={() => {
    if (state) {
      state.focusedDate = day
      state.hover(null)
    }
  }}
  {...restProps}
>
  {#if cell}
    {@render cell({ day, month })}
  {:else if children}
    {@render children()}
  {:else}
    {day.day}
  {/if}
</button>

<style>
  :global {
    @keyframes calendar-day-pop {
      0% {
        transform: scale(0.86);
      }
      70% {
        transform: scale(1.06);
      }
      100% {
        transform: scale(1);
      }
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :global([data-slot='calendar-cell-trigger']) {
      animation: none !important;
      transition: none !important;
    }
  }
</style>
