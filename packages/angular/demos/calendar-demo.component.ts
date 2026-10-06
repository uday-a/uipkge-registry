import { Component, Input } from '@angular/core'
import { UiCalendarComponent } from '../../../../../packages/registry-angular/components/calendar/calendar.component'
import type {
  DayPickerSelected,
  Matcher,
} from '../../../../../packages/registry-angular/components/calendar/day-picker'

const minValue = new Date()
minValue.setDate(minValue.getDate() - 7)
const maxValue = new Date()
maxValue.setDate(maxValue.getDate() + 30)

/** Angular demo for the calendar page. Mirrors demos/react/calendar.tsx story by story. */
@Component({
  selector: 'angular-calendar-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiCalendarComponent],
  template: `
    @switch (story) {
      @case ('Default') {
        <ui-calendar mode="single" [selected]="date" (select)="date = $event" class="rounded-md border" />
      }
      @case ('Min / max') {
        <ui-calendar
          mode="single"
          [selected]="restrictedDate"
          (select)="restrictedDate = $event"
          [disabled]="minMax"
          class="rounded-md border"
        />
      }
      @case ('Disabled dates') {
        <ui-calendar
          mode="single"
          [selected]="unavailableDate"
          (select)="unavailableDate = $event"
          [disabled]="isWeekend"
          class="rounded-md border"
        />
      }
      @case ('Multiple selection') {
        <ui-calendar mode="multiple" [selected]="multiDates" (select)="multiDates = $event" class="rounded-md border" />
        <p class="text-muted-foreground mt-2 text-xs">Selected: {{ multiLabel }}</p>
      }
      @case ('Two months') {
        <ui-calendar
          mode="single"
          [selected]="multiMonthDate"
          (select)="multiMonthDate = $event"
          [numberOfMonths]="2"
          class="rounded-md border"
        />
      }
      @case ('Month and year layout') {
        <ui-calendar
          mode="single"
          [selected]="date"
          (select)="date = $event"
          captionLayout="dropdown"
          class="rounded-md border"
        />
      }
      @case ('Side-by-side months') {
        <div class="flex flex-col gap-4 sm:flex-row">
          <ui-calendar
            mode="single"
            [selected]="sideBySideA"
            (select)="sideBySideA = $event"
            class="rounded-md border"
          />
          <ui-calendar
            mode="single"
            [selected]="sideBySideB"
            (select)="sideBySideB = $event"
            class="rounded-md border"
          />
        </div>
      }
      @case ('Locale variants') {
        <div class="flex flex-col gap-4 sm:flex-row">
          <ui-calendar
            mode="single"
            [selected]="usDate"
            (select)="usDate = $event"
            locale="en-US"
            class="rounded-md border"
          />
          <ui-calendar
            mode="single"
            [selected]="jaDate"
            (select)="jaDate = $event"
            locale="ja"
            class="rounded-md border"
          />
        </div>
      }
      @case ('Pre-selected today') {
        <ui-calendar mode="single" [selected]="todayDate" (select)="todayDate = $event" class="rounded-md border" />
      }
      @case ('Keyboard') {
        <ui-calendar mode="single" [selected]="date" (select)="date = $event" class="rounded-md border" />
      }
    }
  `,
})
export class AngularCalendarDemoComponent {
  @Input() story = 'Default'

  date: DayPickerSelected = new Date(2026, 4, 15)
  restrictedDate: DayPickerSelected
  usDate: DayPickerSelected
  jaDate: DayPickerSelected
  sideBySideA: DayPickerSelected
  sideBySideB: DayPickerSelected
  todayDate: DayPickerSelected = new Date()
  multiDates: DayPickerSelected = [new Date(2026, 4, 10), new Date(2026, 4, 15), new Date(2026, 4, 20)]
  multiMonthDate: DayPickerSelected = new Date(2026, 4, 15)
  unavailableDate: DayPickerSelected

  readonly minMax: Matcher[] = [{ before: minValue }, { after: maxValue }]
  readonly isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6

  get multiLabel(): string {
    const d = this.multiDates as Date[] | undefined
    return d?.length ? d.map((x) => x.toLocaleDateString('en-CA')).join(', ') : 'none'
  }
}
