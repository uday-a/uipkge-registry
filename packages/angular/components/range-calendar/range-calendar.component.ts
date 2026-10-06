import { Component, ChangeDetectionStrategy } from '@angular/core'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/ui/button/button.component'
import {
  DAY_PICKER_TEMPLATE,
  UiDayContentDirective,
  UiDayPickerBase,
  narrowWeekday,
  type DateRange,
  type DayPickerClassNames,
  type DayPickerFormatters,
  type DayPickerMode,
} from '@/ui/calendar/day-picker'

export type { DateRange }

/** The React RangeCalendar's `classNames` map (react-day-picker keys), before consumer overrides. */
export function rangeCalendarClassNames(classNames?: DayPickerClassNames): DayPickerClassNames {
  return {
    months: 'relative flex flex-col gap-y-4 sm:flex-row sm:gap-x-4 sm:gap-y-0',
    month: 'flex flex-1 flex-col gap-4',
    month_caption: 'flex items-center justify-center',
    caption_label: 'text-sm font-medium',
    nav: 'absolute inset-x-1 top-0 flex items-center justify-between',
    button_previous: cn(
      buttonVariants({ variant: 'outline' }),
      'size-7 bg-transparent p-0 opacity-50 hover:opacity-100',
    ),
    button_next: cn(buttonVariants({ variant: 'outline' }), 'size-7 bg-transparent p-0 opacity-50 hover:opacity-100'),
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
      'size-9 cursor-pointer p-0 font-normal aria-selected:opacity-100',
    ),
    today: '[&:not([aria-selected])]:bg-accent [&:not([aria-selected])]:text-accent-foreground',
    outside: 'day-outside text-muted-foreground aria-selected:text-muted-foreground',
    disabled: 'text-muted-foreground opacity-50',
    range_start:
      'day-range-start rounded-l-md [&>button]:bg-primary [&>button]:text-primary-foreground [&>button:hover]:bg-primary [&>button:hover]:text-primary-foreground [&>button:focus]:bg-primary [&>button:focus]:text-primary-foreground',
    range_end:
      'day-range-end rounded-r-md [&>button]:bg-primary [&>button]:text-primary-foreground [&>button:hover]:bg-primary [&>button:hover]:text-primary-foreground [&>button:focus]:bg-primary [&>button:focus]:text-primary-foreground',
    range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground [&>button]:hover:bg-accent',
    hidden: 'invisible',
    ...classNames,
  }
}

/**
 * Angular port of the UIPKGE React RangeCalendar: react-day-picker forced to
 * `mode="range"`. Click two dates and the range fills in between -- start / end cells get
 * the primary fill, the middle the accent fill. `selected` is a `{ from, to }` range and
 * `(select)` emits the next range (or undefined). Same props, DOM and class strings as
 * React; the day-picker engine is shared with Calendar.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-range-calendar, [ui-range-calendar]',
  standalone: true,
  imports: [UiDayContentDirective],
  host: {
    '[class]': 'hostClass',
    '[attr.lang]': 'lang ?? localeCode',
    '[attr.dir]': 'dir ?? null',
    '[attr.data-mode]': 'mode',
    '[attr.data-required]': 'required ? "true" : null',
    '[attr.data-multiple-months]': 'dataMultipleMonths',
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': 'slot',
  },
  template: DAY_PICKER_TEMPLATE,
})
export class UiRangeCalendarComponent extends UiDayPickerBase {
  protected readonly slot = 'range-calendar'
  override mode: DayPickerMode = 'range'

  constructor() {
    super()
    this.showOutsideDays = true
  }

  get hostClass(): string {
    return cn('block', [this.cls['root'], cn('p-3', this.className)].join(' '))
  }

  protected componentClassNames(): DayPickerClassNames {
    return rangeCalendarClassNames(this.classNames)
  }

  protected override componentFormatters(): Partial<DayPickerFormatters> {
    return { formatWeekdayName: narrowWeekday }
  }
}
