import { Component, Input } from '@angular/core'
import { UiRangeCalendarComponent } from '../../../../../packages/registry-angular/components/range-calendar/range-calendar.component'
import type { DateRange } from '../../../../../packages/registry-angular/components/calendar/day-picker'

const today = new Date()
const addDays = (d: Date, n: number) => {
  const next = new Date(d)
  next.setDate(next.getDate() + n)
  return next
}
const minValue = addDays(today, -14)
const maxValue = addDays(today, 60)

/** Angular demo for the range-calendar page. Mirrors demos/react/range-calendar.tsx story by story. */
@Component({
  selector: 'angular-range-calendar-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiRangeCalendarComponent],
  template: `
    @switch (story) {
      @case ('Default') {
        <ui-range-calendar
          [selected]="range"
          (select)="range = $any($event)"
          [defaultMonth]="defaultMonth"
          class="rounded-md border"
        />
      }
      @case ('Min / max') {
        <ui-range-calendar
          [selected]="constrainedRange"
          (select)="constrainedRange = $any($event)"
          [disabled]="minMax"
          [startMonth]="minValue"
          [endMonth]="maxValue"
          class="rounded-md border"
        />
      }
      @case ('Fixed weeks') {
        <ui-range-calendar
          [selected]="fixedWeeksRange"
          (select)="fixedWeeksRange = $any($event)"
          fixedWeeks
          class="rounded-md border"
        />
      }
      @case ('Week starts Monday') {
        <ui-range-calendar
          [selected]="mondayRange"
          (select)="mondayRange = $any($event)"
          [weekStartsOn]="1"
          class="rounded-md border"
        />
      }
      @case ('Pre-selected range') {
        <ui-range-calendar [selected]="presetRange" (select)="presetRange = $any($event)" class="rounded-md border" />
      }
    }
  `,
})
export class AngularRangeCalendarDemoComponent {
  @Input() story = 'Default'

  readonly defaultMonth = new Date(2026, 4, 10)
  readonly minValue = minValue
  readonly maxValue = maxValue
  readonly minMax = { before: minValue, after: maxValue }
  range: DateRange | undefined = { from: new Date(2026, 4, 10), to: new Date(2026, 4, 17) }
  constrainedRange: DateRange | undefined
  fixedWeeksRange: DateRange | undefined
  mondayRange: DateRange | undefined
  presetRange: DateRange | undefined = { from: today, to: addDays(today, 6) }
}
