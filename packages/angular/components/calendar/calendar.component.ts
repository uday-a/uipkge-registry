import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/ui/button/button.component'
import {
  DAY_PICKER_TEMPLATE,
  UiDayContentDirective,
  UiDayPickerBase,
  narrowWeekday,
  type DayPickerClassNames,
  type DayPickerFormatters,
} from './day-picker'

// Keyframes the React Calendar injects into <head> (copied verbatim).
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

/** The React Calendar's `classNames` map (react-day-picker keys), before consumer overrides. */
export function calendarClassNames(classNames?: DayPickerClassNames): DayPickerClassNames {
  return {
    months: 'relative flex flex-col gap-y-4 sm:flex-row sm:gap-x-4 sm:gap-y-0',
    month: cn(
      'flex flex-1 flex-col gap-4 motion-safe:animate-[calendar-month-in_220ms_cubic-bezier(0.22,1,0.36,1)_both]',
      classNames?.['month'],
    ),
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
  }
}

/**
 * Angular port of the UIPKGE React Calendar (react-day-picker v10 + the registry's
 * classNames map). Same props with React names -- `mode`, `selected` + `(select)`,
 * `disabled` matchers, `numberOfMonths`, `captionLayout`, `locale`, `weekStartsOn`,
 * `startMonth` / `endMonth`, `fixedWeeks`, `showOutsideDays` (default true) -- the same
 * DOM and class strings, the same selection / navigation / keyboard behaviour, and the
 * same entrance keyframes. Pair it with a Popover or use it inline.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-calendar, [ui-calendar]',
  standalone: true,
  imports: [UiDayContentDirective],
  encapsulation: ViewEncapsulation.None,
  styles: [CAL_STYLE_CONTENT],
  host: {
    '[class]': 'hostClass',
    '[attr.lang]': 'lang ?? localeCode',
    '[attr.dir]': 'dir ?? null',
    '[attr.data-mode]': 'mode ?? null',
    '[attr.data-required]': 'required ? "true" : null',
    '[attr.data-multiple-months]': 'dataMultipleMonths',
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': 'slot',
  },
  template: DAY_PICKER_TEMPLATE,
})
export class UiCalendarComponent extends UiDayPickerBase {
  protected readonly slot = 'calendar'

  constructor() {
    super()
    // React Calendar defaults showOutsideDays to true.
    this.showOutsideDays = true
  }

  get hostClass(): string {
    // Custom-element host: display utility first; the rest is rdp's root class + cn('p-3', className).
    return cn('block', [this.cls['root'], cn('p-3', this.className)].join(' '))
  }

  protected componentClassNames(): DayPickerClassNames {
    return calendarClassNames(this.classNames)
  }

  protected override componentFormatters(): Partial<DayPickerFormatters> {
    return { formatWeekdayName: narrowWeekday }
  }
}
