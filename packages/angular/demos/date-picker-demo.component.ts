import { Component, Input } from '@angular/core'
import { UiButtonComponent } from '../../../../../packages/registry-angular/components/button/button.component'
import { UiCalendarComponent } from '../../../../../packages/registry-angular/components/calendar/calendar.component'
import type { DayPickerSelected } from '../../../../../packages/registry-angular/components/calendar/day-picker'
import { UiDatePickerComponent } from '../../../../../packages/registry-angular/components/date-picker/date-picker.component'
import {
  UiSheetComponent,
  UiSheetContentComponent,
  UiSheetHeaderComponent,
  UiSheetTitleComponent,
  UiSheetTriggerComponent,
} from '../../../../../packages/registry-angular/components/sheet/sheet.component'

function isoToday(offsetDays = 0) {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function addDays(iso: string, days: number) {
  const d = new Date(iso + 'T12:00:00')
  d.setDate(d.getDate() + days)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function monthStart(iso: string) {
  const d = new Date(iso + 'T12:00:00')
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
}

type Range = { start: string; end?: string } | null

/** Angular demo for the date-picker page. Mirrors demos/react/date-picker.tsx story by story. */
@Component({
  selector: 'angular-date-picker-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiDatePickerComponent,
    UiButtonComponent,
    UiCalendarComponent,
    UiSheetComponent,
    UiSheetTriggerComponent,
    UiSheetContentComponent,
    UiSheetHeaderComponent,
    UiSheetTitleComponent,
  ],
  template: `
    @switch (story) {
      @case ('Default') {
        <button ui-date-picker [value]="date" (valueChange)="date = $any($event)" class="max-w-xs"></button>
      }
      @case ('Multiple Dates') {
        <button
          ui-date-picker
          [value]="multipleDates"
          (valueChange)="multipleDates = $any($event)"
          type="multiple"
          class="max-w-xs"
        ></button>
      }
      @case ('Week Picker') {
        <button
          ui-date-picker
          [value]="weekDate"
          (valueChange)="weekDate = $any($event)"
          picker="week"
          class="max-w-xs"
        ></button>
      }
      @case ('Month Picker') {
        <button
          ui-date-picker
          [value]="monthDate"
          (valueChange)="monthDate = $any($event)"
          picker="month"
          class="max-w-xs"
        ></button>
      }
      @case ('Quarter Picker') {
        <button
          ui-date-picker
          [value]="quarterDate"
          (valueChange)="quarterDate = $any($event)"
          picker="quarter"
          class="max-w-xs"
        ></button>
      }
      @case ('Year Picker') {
        <button
          ui-date-picker
          [value]="yearDate"
          (valueChange)="yearDate = $any($event)"
          picker="year"
          class="max-w-xs"
        ></button>
      }
      @case ('Date Range') {
        <button
          ui-date-picker
          [value]="range"
          (valueChange)="range = $any($event)"
          type="range"
          class="max-w-sm"
        ></button>
      }
      @case ('Two Months') {
        <button
          ui-date-picker
          [value]="range"
          (valueChange)="range = $any($event)"
          type="range"
          [numberOfMonths]="2"
          class="max-w-sm"
        ></button>
      }
      @case ('Week Range') {
        <button
          ui-date-picker
          [value]="weekRange"
          (valueChange)="weekRange = $any($event)"
          type="range"
          picker="week"
          class="max-w-sm"
        ></button>
      }
      @case ('Month Range') {
        <button
          ui-date-picker
          [value]="monthRange"
          (valueChange)="monthRange = $any($event)"
          type="range"
          picker="month"
          class="max-w-sm"
        ></button>
      }
      @case ('Quarter Range') {
        <button
          ui-date-picker
          [value]="quarterRange"
          (valueChange)="quarterRange = $any($event)"
          type="range"
          picker="quarter"
          class="max-w-sm"
        ></button>
      }
      @case ('Year Range') {
        <button
          ui-date-picker
          [value]="yearRange"
          (valueChange)="yearRange = $any($event)"
          type="range"
          picker="year"
          class="max-w-sm"
        ></button>
      }
      @case ('Date with Time') {
        <button
          ui-date-picker
          [value]="timeDate"
          (valueChange)="timeDate = $any($event)"
          showTime
          class="max-w-xs"
        ></button>
      }
      @case ('Date-Time Range') {
        <button
          ui-date-picker
          [value]="timeRange"
          (valueChange)="timeRange = $any($event)"
          type="range"
          showTime
          class="max-w-sm"
        ></button>
      }
      @case ('24-Hour Time') {
        <button
          ui-date-picker
          [value]="timeDate"
          (valueChange)="timeDate = $any($event)"
          showTime
          use24Hour
          class="max-w-xs"
        ></button>
      }
      @case ('Date with Seconds') {
        <button
          ui-date-picker
          [value]="secondsDate"
          (valueChange)="secondsDate = $any($event)"
          showTime
          showSeconds
          class="max-w-xs"
        ></button>
      }
      @case ('Size Variants') {
        <div class="flex max-w-xs flex-col gap-3">
          <button
            ui-date-picker
            [value]="sizeDate"
            (valueChange)="sizeDate = $any($event)"
            size="small"
            placeholder="Small"
          ></button>
          <button
            ui-date-picker
            [value]="sizeDate"
            (valueChange)="sizeDate = $any($event)"
            size="middle"
            placeholder="Middle"
          ></button>
          <button
            ui-date-picker
            [value]="sizeDate"
            (valueChange)="sizeDate = $any($event)"
            size="large"
            placeholder="Large"
          ></button>
        </div>
      }
      @case ('Placement') {
        <div class="flex max-w-md flex-wrap gap-3">
          <button
            ui-date-picker
            [value]="placementDate"
            (valueChange)="placementDate = $any($event)"
            placement="topLeft"
            placeholder="topLeft"
          ></button>
          <button
            ui-date-picker
            [value]="placementDate"
            (valueChange)="placementDate = $any($event)"
            placement="top"
            placeholder="top"
          ></button>
          <button
            ui-date-picker
            [value]="placementDate"
            (valueChange)="placementDate = $any($event)"
            placement="topRight"
            placeholder="topRight"
          ></button>
          <button
            ui-date-picker
            [value]="placementDate"
            (valueChange)="placementDate = $any($event)"
            placement="bottomLeft"
            placeholder="bottomLeft"
          ></button>
          <button
            ui-date-picker
            [value]="placementDate"
            (valueChange)="placementDate = $any($event)"
            placement="bottom"
            placeholder="bottom"
          ></button>
          <button
            ui-date-picker
            [value]="placementDate"
            (valueChange)="placementDate = $any($event)"
            placement="bottomRight"
            placeholder="bottomRight"
          ></button>
          <button
            ui-date-picker
            [value]="placementDate"
            (valueChange)="placementDate = $any($event)"
            placement="left"
            placeholder="left"
          ></button>
          <button
            ui-date-picker
            [value]="placementDate"
            (valueChange)="placementDate = $any($event)"
            placement="right"
            placeholder="right"
          ></button>
        </div>
      }
      @case ('Range with Presets') {
        <button
          ui-date-picker
          [value]="presetRange"
          (valueChange)="presetRange = $any($event)"
          type="range"
          [presets]="customPresets"
          class="max-w-sm"
        ></button>
      }
      @case ('Single with Presets') {
        <button
          ui-date-picker
          [value]="presetSingle"
          (valueChange)="presetSingle = $any($event)"
          [presets]="categorizedPresets"
          class="max-w-xs"
        ></button>
      }
      @case ('Categorized Presets') {
        <button
          ui-date-picker
          [value]="presetSingle"
          (valueChange)="presetSingle = $any($event)"
          [presets]="categorizedPresets"
          class="max-w-xs"
        ></button>
      }
      @case ('Format Options') {
        <div class="flex max-w-xs flex-col gap-3">
          <button
            ui-date-picker
            [value]="formatDate"
            (valueChange)="formatDate = $any($event)"
            format="short"
            placeholder="Short format"
          ></button>
          <button
            ui-date-picker
            [value]="formatDate"
            (valueChange)="formatDate = $any($event)"
            format="medium"
            placeholder="Medium format"
          ></button>
          <button
            ui-date-picker
            [value]="formatDate"
            (valueChange)="formatDate = $any($event)"
            format="long"
            placeholder="Long format"
          ></button>
          <button
            ui-date-picker
            [value]="formatDate"
            (valueChange)="formatDate = $any($event)"
            format="full"
            placeholder="Full format"
          ></button>
        </div>
      }
      @case ('Custom Intl Format') {
        <button
          ui-date-picker
          [value]="formatDate"
          (valueChange)="formatDate = $any($event)"
          [format]="customFormat"
          placeholder="YYYY-MM-DD style"
          class="max-w-xs"
        ></button>
      }
      @case ('Range Separator') {
        <button
          ui-date-picker
          [value]="range"
          (valueChange)="range = $any($event)"
          type="range"
          separator="→"
          class="max-w-sm"
        ></button>
      }
      @case ('Min / Max Dates') {
        <button
          ui-date-picker
          [value]="rangeDate"
          (valueChange)="rangeDate = $any($event)"
          [minValue]="minDate"
          [maxValue]="maxDate"
          class="max-w-xs"
        ></button>
      }
      @case ('Disabled Date') {
        <button
          ui-date-picker
          [value]="disabledDateVal"
          (valueChange)="disabledDateVal = $any($event)"
          [disabledDate]="disabledDateFn"
          class="max-w-xs"
        ></button>
      }
      @case ('Disabled Time') {
        <button
          ui-date-picker
          [value]="disabledTimeDate"
          (valueChange)="disabledTimeDate = $any($event)"
          showTime
          [disabledTime]="disabledTimeFn"
          class="max-w-xs"
        ></button>
      }
      @case ('Disabled') {
        <button
          ui-date-picker
          [value]="disabledDateVal"
          (valueChange)="disabledDateVal = $any($event)"
          disabled
          class="max-w-xs"
        ></button>
      }
      @case ('Need Confirm') {
        <button
          ui-date-picker
          [value]="confirmDate"
          (valueChange)="confirmDate = $any($event)"
          needConfirm
          class="max-w-xs"
        ></button>
      }
      @case ('Range with Confirm') {
        <button
          ui-date-picker
          [value]="confirmRange"
          (valueChange)="confirmRange = $any($event)"
          type="range"
          needConfirm
          class="max-w-sm"
        ></button>
      }
      @case ('Status States') {
        <div class="flex max-w-xs flex-col gap-3">
          <button
            ui-date-picker
            [value]="statusDate"
            (valueChange)="statusDate = $any($event)"
            status="error"
            placeholder="Error state"
          ></button>
          <button
            ui-date-picker
            [value]="statusDate"
            (valueChange)="statusDate = $any($event)"
            status="warning"
            placeholder="Warning state"
          ></button>
        </div>
      }
      @case ('Range Status') {
        <div class="flex max-w-sm flex-col gap-3">
          <button
            ui-date-picker
            [value]="statusRange"
            (valueChange)="statusRange = $any($event)"
            type="range"
            status="error"
            placeholder="Error state"
          ></button>
          <button
            ui-date-picker
            [value]="statusRange"
            (valueChange)="statusRange = $any($event)"
            type="range"
            status="warning"
            placeholder="Warning state"
          ></button>
        </div>
      }
      @case ('Custom Cell Render') {
        <button
          ui-date-picker
          [value]="date"
          (valueChange)="date = $any($event)"
          class="max-w-xs"
          [renderCell]="eventCell"
        ></button>
        <ng-template #eventCell let-day
          ><div class="relative">
            {{ day.getDate() }}
            @if (hasEvent(day)) {
              <span class="bg-primary absolute -bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full"></span>
            }</div
        ></ng-template>
      }
      @case ('Mobile sheet pattern') {
        <ui-sheet [open]="sheetOpen" (openChange)="sheetOpen = $event">
          <button ui-button variant="outline" ui-sheet-trigger class="w-full max-w-xs justify-start font-normal">
            {{ sheetLabel }}
          </button>
          <ui-sheet-content side="bottom" class="rounded-t-xl">
            <ui-sheet-header>
              <ui-sheet-title>Select date</ui-sheet-title>
            </ui-sheet-header>
            <div class="flex justify-center py-2">
              <ui-calendar
                mode="single"
                [selected]="sheetSelected"
                (select)="onSheetSelect($event)"
                class="rounded-md border"
              />
            </div>
          </ui-sheet-content>
        </ui-sheet>
      }
    }
  `,
})
export class AngularDatePickerDemoComponent {
  @Input() story = 'Default'

  readonly todayD = isoToday()
  readonly minDate = isoToday(-7)
  readonly maxDate = isoToday(7)

  date: string | null = null
  multipleDates: string[] | null = null
  weekDate: string | null = null
  monthDate: string | null = null
  quarterDate: string | null = null
  yearDate: string | null = null
  range: Range = null
  weekRange: Range = null
  monthRange: Range = null
  quarterRange: Range = null
  yearRange: Range = null
  timeDate: string | null = null
  timeRange: Range = null
  secondsDate: string | null = null
  formatDate: string | null = null
  rangeDate: string | null = null
  disabledDateVal: string | null = null
  disabledTimeDate: string | null = null
  confirmDate: string | null = null
  confirmRange: Range = null
  statusDate: string | null = null
  statusRange: Range = null
  sizeDate: string | null = null
  placementDate: string | null = null
  presetRange: Range = null
  presetSingle: string | null = null

  readonly customFormat: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' }

  readonly customPresets = [
    { label: 'Today', value: { start: this.todayD, end: this.todayD } },
    { label: 'Last 7 Days', value: { start: addDays(this.todayD, -6), end: this.todayD } },
    { label: 'Last 30 Days', value: { start: addDays(this.todayD, -29), end: this.todayD } },
    { label: 'This Month', value: { start: monthStart(this.todayD), end: this.todayD } },
  ]

  readonly categorizedPresets = [
    { label: 'Today', value: this.todayD, category: 'Quick' },
    { label: 'Tomorrow', value: addDays(this.todayD, 1), category: 'Quick' },
    { label: 'Next Week', value: addDays(this.todayD, 7), category: 'Future' },
    { label: 'Next Month', value: addDays(this.todayD, 30), category: 'Future' },
  ]

  // Relative to today so dots are visible in the open month
  private readonly events = [isoToday(0), isoToday(3), isoToday(7)]

  readonly disabledDateFn = (current: Date) => {
    const dow = current.getDay()
    return dow === 0 || dow === 6
  }

  readonly disabledTimeFn = () => ({
    disabledHours: () => [0, 1, 2, 3, 4, 5, 6, 7, 20, 21, 22, 23],
    disabledMinutes: (hour: number) => (hour === 12 ? [0, 1, 2, 3, 4, 5] : []),
    disabledSeconds: (hour: number, minute: number) => (hour === 12 && minute === 0 ? [0, 1, 2] : []),
  })

  hasEvent(day: Date): boolean {
    const iso = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`
    return this.events.includes(iso)
  }

  // Mobile sheet pattern
  sheetOpen = false
  sheetSelected: DayPickerSelected = new Date()

  get sheetLabel(): string {
    return this.sheetSelected instanceof Date ? this.sheetSelected.toLocaleDateString('en-CA') : 'Pick a date'
  }

  onSheetSelect(d: DayPickerSelected): void {
    this.sheetSelected = d
    if (d) this.sheetOpen = false
  }
}
