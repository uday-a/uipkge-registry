'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

/**
 * Single-month calendar grid for date selection, built on react-day-picker v9.
 * This is the React mirror of the reka-ui-based Vue Calendar — the cell sizes,
 * selected / today / outside / range states, and outline nav chevrons are mapped
 * 1:1 from the Vue registry's Tailwind class strings via react-day-picker's
 * `classNames` map. Pair it with a Popover or use it inline.
 */
const CAL_STYLE_ID = 'calendar-motion-styles'
const CAL_STYLE_CONTENT = `
@keyframes calendar-day-pop {
  0% { transform: scale(0.86); }
  70% { transform: scale(1.06); }
  100% { transform: scale(1); }
}
@keyframes calendar-month-in {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
@media (prefers-reduced-motion: reduce) {
  [data-slot='calendar'] [class*='animate-\\[calendar-'] {
    animation: none !important;
  }
}
`

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  React.useLayoutEffect(() => {
    if (typeof document === 'undefined') return
    let el = document.getElementById(CAL_STYLE_ID) as HTMLStyleElement | null
    if (!el) {
      el = document.createElement('style')
      el.id = CAL_STYLE_ID
      document.head.appendChild(el)
    }
    if (el.textContent !== CAL_STYLE_CONTENT) el.textContent = CAL_STYLE_CONTENT
  }, [])

  return (
    <DayPicker
      data-uipkge=""
      data-slot="calendar"
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        // react-day-picker v10 renders <Nav> as the FIRST child of .rdp-months
        // (a sibling of the month, NOT inside month_caption). The nav is
        // `absolute inset-x-0 top-0`, so .rdp-months MUST be `relative` or the
        // chevrons escape to the nearest positioned ancestor (Popover / Story
        // card) and float away from the calendar. With months relative + an h-9
        // caption, the nav overlays the caption row, prev/next pinned to the
        // inset-x edges — matching the Vue header (CalendarHeader > absolute nav).
        // No mt-4 here: in Vue that margin sits on the grid wrapper (below the
        // header), but rdp's .rdp-months wraps the nav + caption too, so a top
        // margin would push the whole header down 16px. The caption→grid gap is
        // the Month's gap-4 below.
        months: 'relative flex flex-col gap-y-4 sm:flex-row sm:gap-x-4 sm:gap-y-0',
        // `flex-1`: react-day-picker wraps the grid in an extra Month div
        // (Months > Month > grid) that Vue doesn't have (Vue's grid table is the
        // direct flex child with w-full). Without flex-1 the Month collapses to
        // the grid's intrinsic width in the sm:flex-row track, so the grid stays
        // narrow and the centered caption drifts left of the calendar. flex-1
        // makes the Month fill its track → full-width grid + truly centered label,
        // matching Vue, and splits evenly for a multi-month calendar.
        month: cn(
          'flex flex-1 flex-col gap-4 motion-safe:animate-[calendar-month-in_220ms_cubic-bezier(0.22,1,0.36,1)_both]',
          classNames?.month,
        ),
        // Label-height (no h-9): Vue's CalendarHeader is sized to the heading and
        // the size-9 nav buttons overflow below it. Matching that height aligns the
        // nav's top-0 with the caption label (Vue parity) instead of the buttons
        // sitting 8px high against a 36px caption box.
        month_caption: 'flex items-center justify-center',
        caption_label: 'text-sm font-medium',
        nav: 'absolute inset-x-0 top-0 flex items-center justify-between gap-1',
        button_previous: cn(
          buttonVariants({ variant: 'outline' }),
          'size-9 bg-transparent p-0 opacity-70 hover:opacity-100 focus-visible:opacity-100',
        ),
        button_next: cn(
          buttonVariants({ variant: 'outline' }),
          'size-9 bg-transparent p-0 opacity-70 hover:opacity-100 focus-visible:opacity-100',
        ),
        month_grid: 'w-full border-collapse space-y-1',
        weekdays: 'flex',
        weekday: 'text-muted-foreground flex-1 rounded-md text-xs font-normal',
        week: 'mt-2 flex w-full',
        day: cn(
          'relative flex-1 p-0 text-center text-sm focus-within:relative focus-within:z-20',
          '[&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md',
          '[&:has([aria-selected].day-outside)]:bg-accent/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md',
        ),
        day_button: cn(
          buttonVariants({ variant: 'ghost' }),
          'size-9 cursor-pointer p-0 font-normal transition-[color,background-color,transform,box-shadow] duration-150 aria-selected:opacity-100',
        ),
        selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground shadow-sm motion-safe:animate-[calendar-day-pop_220ms_cubic-bezier(0.22,1.4,0.36,1)_both] [&>button]:bg-primary [&>button]:text-primary-foreground [&>button:hover]:bg-primary [&>button:hover]:text-primary-foreground',
        today: '[&:not([aria-selected])]:bg-accent [&:not([aria-selected])]:text-accent-foreground',
        outside: 'day-outside text-muted-foreground aria-selected:text-muted-foreground',
        disabled: 'text-muted-foreground opacity-50',
        range_start:
          'day-range-start rounded-l-md motion-safe:animate-[calendar-day-pop_220ms_cubic-bezier(0.22,1.4,0.36,1)_both]',
        range_end:
          'day-range-end rounded-r-md motion-safe:animate-[calendar-day-pop_220ms_cubic-bezier(0.22,1.4,0.36,1)_both]',
        range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground transition-colors duration-200',
        hidden: 'invisible',
        ...classNames,
      }}
      formatters={{
        // Vue's reka-ui calendar renders narrow (single-letter) weekday labels;
        // react-day-picker defaults to short 'cccccc' (two-letter "Mo"). Emit the
        // locale's narrow name so weekdays match Vue across locales (incl. ja).
        formatWeekdayName: (weekday, options) =>
          weekday.toLocaleDateString(options?.locale?.code, { weekday: 'narrow' }),
        ...props.formatters,
      }}
      components={{
        Chevron: ({ orientation, className: chevronClassName, ...chevronProps }) =>
          orientation === 'left' ? (
            <ChevronLeft className={cn('size-4', chevronClassName)} aria-hidden="true" {...chevronProps} />
          ) : (
            <ChevronRight className={cn('size-4', chevronClassName)} aria-hidden="true" {...chevronProps} />
          ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = 'Calendar'

export { Calendar }
