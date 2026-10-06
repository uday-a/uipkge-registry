<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import type { CalendarDay, RangeCalendarContext } from './RangeCalendar.svelte'

  // Omit `children`: the snippet carries the day, which narrows the base `Snippet` type.
  export interface RangeCalendarCellTriggerProps extends Omit<HTMLButtonAttributes, 'children'> {
    day: CalendarDay
    children?: Snippet<[{ day: CalendarDay }]>
    ref?: HTMLButtonElement | null
  }
</script>

<script lang="ts">
  import { getContext } from 'svelte'
  import { cn } from '$lib/utils'
  import { buttonVariants } from '$lib/components/ui/button/button.variants'

  let {
    class: className,
    day,
    children,
    disabled = undefined,
    onclick: onclickProp,
    onkeydown: onkeydownProp,
    ref = $bindable(null),
    ...restProps
  }: RangeCalendarCellTriggerProps = $props()

  const calendar = getContext<RangeCalendarContext | undefined>('rangeCalendar')
  const effectiveDisabled = $derived(disabled ?? day.disabled ?? false)

  function handleKeydown(event: KeyboardEvent) {
    if (!calendar) return
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      calendar.focusDay(day.key, 1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      calendar.focusDay(day.key, -1)
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      calendar.focusDay(day.key, 7)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      calendar.focusDay(day.key, -7)
    } else if (event.key === 'Home') {
      event.preventDefault()
      calendar.weekEdge(day.key, true)
    } else if (event.key === 'End') {
      event.preventDefault()
      calendar.weekEdge(day.key, false)
    } else if (event.key === 'PageUp') {
      event.preventDefault()
      calendar.focusMonthStep(day.key, event.shiftKey ? -12 : -1)
    } else if (event.key === 'PageDown') {
      event.preventDefault()
      calendar.focusMonthStep(day.key, event.shiftKey ? 12 : 1)
    }
  }
</script>

<button
  bind:this={ref}
  type="button"
  data-uipkge=""
  data-slot="range-calendar-trigger"
  data-day={day.key}
  data-selected={day.selected || undefined}
  data-selection-start={day.selectionStart || undefined}
  data-selection-end={day.selectionEnd || undefined}
  data-highlighted={day.highlighted || undefined}
  data-today={day.today || undefined}
  data-outside-view={day.outsideView || undefined}
  data-unavailable={day.unavailable || undefined}
  disabled={effectiveDisabled}
  tabindex={day.tabbable ? 0 : -1}
  aria-label={day.date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
  aria-pressed={day.selected || undefined}
  class={cn(
    buttonVariants({ variant: 'ghost' }),
    'size-9 cursor-pointer p-0 font-normal transition-[color,background-color,transform,box-shadow] duration-150 data-[selected]:opacity-100',
    '[&[data-today]:not([data-selected])]:bg-accent [&[data-today]:not([data-selected])]:text-accent-foreground',
    // Selection Start / End — subtle pop
    'data-[selection-start]:bg-primary data-[selection-start]:text-primary-foreground data-[selection-start]:hover:bg-primary data-[selection-start]:hover:text-primary-foreground data-[selection-start]:focus:bg-primary data-[selection-start]:focus:text-primary-foreground motion-safe:data-[selection-start]:animate-[calendar-day-pop_220ms_cubic-bezier(0.22,1.4,0.36,1)_both]',
    'data-[selection-end]:bg-primary data-[selection-end]:text-primary-foreground data-[selection-end]:hover:bg-primary data-[selection-end]:hover:text-primary-foreground data-[selection-end]:focus:bg-primary data-[selection-end]:focus:text-primary-foreground motion-safe:data-[selection-end]:animate-[calendar-day-pop_220ms_cubic-bezier(0.22,1.4,0.36,1)_both]',
    // Outside months
    'data-[outside-view]:text-muted-foreground',
    // Disabled
    'data-[disabled]:text-muted-foreground data-[disabled]:opacity-50',
    // Unavailable
    'data-[unavailable]:text-destructive-foreground data-[unavailable]:line-through',
    className,
  )}
  {...restProps}
  onclick={(e) => {
    calendar?.select(day)
    onclickProp?.(e)
  }}
  onkeydown={(e) => {
    handleKeydown(e)
    onkeydownProp?.(e)
  }}
  onmouseenter={() => calendar?.hover(day)}
  onmouseleave={() => calendar?.hover(null)}
  onfocus={() => calendar?.hover(null)}
>
  {#if children}
    {@render children({ day })}
  {:else}
    {day.dayNumber}
  {/if}
</button>

<style>
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

  @media (prefers-reduced-motion: reduce) {
    [data-slot='range-calendar-trigger'] {
      animation: none !important;
      transition: none !important;
    }
  }
</style>
