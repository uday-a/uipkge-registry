import { useState } from 'react'
import Story from '../../components/story/Story'
import { Button } from '@react-registry/button'
import { Calendar } from '@react-registry/calendar'
import { DatePicker } from '@react-registry/date-picker'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@react-registry/sheet'

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

export default function DatePickerDemo() {
  const todayD = isoToday()
  const minDate = isoToday(-7)
  const maxDate = isoToday(7)

  const [date, setDate] = useState<string | null>(null)
  const [multipleDates, setMultipleDates] = useState<string[] | null>(null)
  const [weekDate, setWeekDate] = useState<string | null>(null)
  const [monthDate, setMonthDate] = useState<string | null>(null)
  const [quarterDate, setQuarterDate] = useState<string | null>(null)
  const [yearDate, setYearDate] = useState<string | null>(null)
  const [range, setRange] = useState<{ start: string; end?: string } | null>(null)
  const [weekRange, setWeekRange] = useState<{ start: string; end?: string } | null>(null)
  const [monthRange, setMonthRange] = useState<{ start: string; end?: string } | null>(null)
  const [quarterRange, setQuarterRange] = useState<{ start: string; end?: string } | null>(null)
  const [yearRange, setYearRange] = useState<{ start: string; end?: string } | null>(null)
  const [timeDate, setTimeDate] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<{ start: string; end?: string } | null>(null)
  const [secondsDate, setSecondsDate] = useState<string | null>(null)
  const [formatDate, setFormatDate] = useState<string | null>(null)
  const [rangeDate, setRangeDate] = useState<string | null>(null)
  const [disabledDateVal, setDisabledDateVal] = useState<string | null>(null)
  const [disabledTimeDate, setDisabledTimeDate] = useState<string | null>(null)
  const [confirmDate, setConfirmDate] = useState<string | null>(null)
  const [confirmRange, setConfirmRange] = useState<{ start: string; end?: string } | null>(null)
  const [statusDate, setStatusDate] = useState<string | null>(null)
  const [statusRange, setStatusRange] = useState<{ start: string; end?: string } | null>(null)
  const [sizeDate, setSizeDate] = useState<string | null>(null)
  const [placementDate, setPlacementDate] = useState<string | null>(null)
  const [presetRange, setPresetRange] = useState<{ start: string; end?: string } | null>(null)
  const [presetSingle, setPresetSingle] = useState<string | null>(null)

  const customPresets = [
    { label: 'Today', value: { start: todayD, end: todayD } },
    { label: 'Last 7 Days', value: { start: addDays(todayD, -6), end: todayD } },
    { label: 'Last 30 Days', value: { start: addDays(todayD, -29), end: todayD } },
    { label: 'This Month', value: { start: monthStart(todayD), end: todayD } },
  ]

  const categorizedPresets = [
    { label: 'Today', value: todayD, category: 'Quick' },
    { label: 'Tomorrow', value: addDays(todayD, 1), category: 'Quick' },
    { label: 'Next Week', value: addDays(todayD, 7), category: 'Future' },
    { label: 'Next Month', value: addDays(todayD, 30), category: 'Future' },
  ]

  // Relative to today so dots are visible in the open month
  const events = [isoToday(0), isoToday(3), isoToday(7)]

  function disabledDateFn(current: Date) {
    const dow = current.getDay()
    return dow === 0 || dow === 6
  }

  function disabledTimeFn() {
    return {
      disabledHours: () => [0, 1, 2, 3, 4, 5, 6, 7, 20, 21, 22, 23],
      disabledMinutes: (hour: number) => (hour === 12 ? [0, 1, 2, 3, 4, 5] : []),
      disabledSeconds: (hour: number, minute: number) => (hour === 12 && minute === 0 ? [0, 1, 2] : []),
    }
  }

  function hasEvent(day: Date) {
    const iso = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`
    return events.includes(iso)
  }

  return (
    <>
      <Story title="Default" description="Single-date picker bound to an optional CalendarDate value.">
        <DatePicker value={date} onValueChange={setDate} className="max-w-xs" />
      </Story>

      <Story title="Multiple Dates" description="Select multiple individual dates.">
        <DatePicker value={multipleDates} onValueChange={setMultipleDates} type="multiple" className="max-w-xs" />
      </Story>

      <Story title="Week Picker" description="Select an entire week. Value is the week's start date.">
        <DatePicker value={weekDate} onValueChange={setWeekDate} picker="week" className="max-w-xs" />
      </Story>

      <Story title="Month Picker" description="Select a month.">
        <DatePicker value={monthDate} onValueChange={setMonthDate} picker="month" className="max-w-xs" />
      </Story>

      <Story title="Quarter Picker" description="Select a fiscal quarter.">
        <DatePicker value={quarterDate} onValueChange={setQuarterDate} picker="quarter" className="max-w-xs" />
      </Story>

      <Story title="Year Picker" description="Select a year.">
        <DatePicker value={yearDate} onValueChange={setYearDate} picker="year" className="max-w-xs" />
      </Story>

      <Story title="Date Range" description="Picker for a start and end date in one popover.">
        <DatePicker value={range} onValueChange={setRange} type="range" className="max-w-sm" />
      </Story>

      <Story title="Two Months" description="Display two months side by side for easier range selection.">
        <DatePicker value={range} onValueChange={setRange} type="range" numberOfMonths={2} className="max-w-sm" />
      </Story>

      <Story title="Week Range" description="Select ranges of full weeks.">
        <DatePicker value={weekRange} onValueChange={setWeekRange} type="range" picker="week" className="max-w-sm" />
      </Story>

      <Story title="Month Range" description="Select ranges of months.">
        <DatePicker value={monthRange} onValueChange={setMonthRange} type="range" picker="month" className="max-w-sm" />
      </Story>

      <Story title="Quarter Range" description="Select ranges of quarters.">
        <DatePicker
          value={quarterRange}
          onValueChange={setQuarterRange}
          type="range"
          picker="quarter"
          className="max-w-sm"
        />
      </Story>

      <Story title="Year Range" description="Select ranges of years.">
        <DatePicker value={yearRange} onValueChange={setYearRange} type="range" picker="year" className="max-w-sm" />
      </Story>

      <Story title="Date with Time" description="Pick both date and time.">
        <DatePicker value={timeDate} onValueChange={setTimeDate} showTime className="max-w-xs" />
      </Story>

      <Story title="Date-Time Range" description="Range picker with time selection.">
        <DatePicker value={timeRange} onValueChange={setTimeRange} type="range" showTime className="max-w-sm" />
      </Story>

      <Story title="24-Hour Time" description="Time picker in 24-hour format.">
        <DatePicker value={timeDate} onValueChange={setTimeDate} showTime use24Hour className="max-w-xs" />
      </Story>

      <Story title="Date with Seconds" description="Time picker including seconds.">
        <DatePicker value={secondsDate} onValueChange={setSecondsDate} showTime showSeconds className="max-w-xs" />
      </Story>

      <Story title="Size Variants" description="Small, middle (default), and large trigger sizes.">
        <div className="flex max-w-xs flex-col gap-3">
          <DatePicker value={sizeDate} onValueChange={setSizeDate} size="small" placeholder="Small" />
          <DatePicker value={sizeDate} onValueChange={setSizeDate} size="middle" placeholder="Middle" />
          <DatePicker value={sizeDate} onValueChange={setSizeDate} size="large" placeholder="Large" />
        </div>
      </Story>

      <Story title="Placement" description="Control where the popover appears relative to the trigger.">
        <div className="flex max-w-md flex-wrap gap-3">
          <DatePicker
            value={placementDate}
            onValueChange={setPlacementDate}
            placement="topLeft"
            placeholder="topLeft"
          />
          <DatePicker value={placementDate} onValueChange={setPlacementDate} placement="top" placeholder="top" />
          <DatePicker
            value={placementDate}
            onValueChange={setPlacementDate}
            placement="topRight"
            placeholder="topRight"
          />
          <DatePicker
            value={placementDate}
            onValueChange={setPlacementDate}
            placement="bottomLeft"
            placeholder="bottomLeft"
          />
          <DatePicker value={placementDate} onValueChange={setPlacementDate} placement="bottom" placeholder="bottom" />
          <DatePicker
            value={placementDate}
            onValueChange={setPlacementDate}
            placement="bottomRight"
            placeholder="bottomRight"
          />
          <DatePicker value={placementDate} onValueChange={setPlacementDate} placement="left" placeholder="left" />
          <DatePicker value={placementDate} onValueChange={setPlacementDate} placement="right" placeholder="right" />
        </div>
      </Story>

      <Story title="Range with Presets" description="Quick-select common date ranges with preset shortcuts.">
        <DatePicker
          value={presetRange}
          onValueChange={setPresetRange}
          type="range"
          presets={customPresets}
          className="max-w-sm"
        />
      </Story>

      <Story title="Single with Presets" description="Preset shortcuts work for single-date mode too.">
        <DatePicker
          value={presetSingle}
          onValueChange={setPresetSingle}
          presets={categorizedPresets}
          className="max-w-xs"
        />
      </Story>

      <Story title="Categorized Presets" description="Presets grouped by category labels in the sidebar.">
        <DatePicker
          value={presetSingle}
          onValueChange={setPresetSingle}
          presets={categorizedPresets}
          className="max-w-xs"
        />
      </Story>

      <Story title="Format Options" description="Different date display formats.">
        <div className="flex max-w-xs flex-col gap-3">
          <DatePicker value={formatDate} onValueChange={setFormatDate} format="short" placeholder="Short format" />
          <DatePicker value={formatDate} onValueChange={setFormatDate} format="medium" placeholder="Medium format" />
          <DatePicker value={formatDate} onValueChange={setFormatDate} format="long" placeholder="Long format" />
          <DatePicker value={formatDate} onValueChange={setFormatDate} format="full" placeholder="Full format" />
        </div>
      </Story>

      <Story title="Custom Intl Format" description="Use Intl.DateTimeFormatOptions for fully custom formatting.">
        <DatePicker
          value={formatDate}
          onValueChange={setFormatDate}
          format={{ year: 'numeric', month: '2-digit', day: '2-digit' }}
          placeholder="YYYY-MM-DD style"
          className="max-w-xs"
        />
      </Story>

      <Story title="Range Separator" description="Custom separator between start and end dates.">
        <DatePicker value={range} onValueChange={setRange} type="range" separator="→" className="max-w-sm" />
      </Story>

      <Story title="Min / Max Dates" description="Restrict selection to a date range.">
        <DatePicker
          value={rangeDate}
          onValueChange={setRangeDate}
          minValue={minDate}
          maxValue={maxDate}
          className="max-w-xs"
        />
      </Story>

      <Story title="Disabled Date" description="Disable specific dates via a function (weekends disabled here).">
        <DatePicker
          value={disabledDateVal}
          onValueChange={setDisabledDateVal}
          disabledDate={disabledDateFn}
          className="max-w-xs"
        />
      </Story>

      <Story title="Disabled Time" description="Disable specific hours, minutes, or seconds.">
        <DatePicker
          value={disabledTimeDate}
          onValueChange={setDisabledTimeDate}
          showTime
          disabledTime={disabledTimeFn}
          className="max-w-xs"
        />
      </Story>

      <Story title="Disabled" description="Disabled state prevents interaction.">
        <DatePicker value={disabledDateVal} onValueChange={setDisabledDateVal} disabled className="max-w-xs" />
      </Story>

      <Story title="Need Confirm" description="Selections only apply after clicking OK.">
        <DatePicker value={confirmDate} onValueChange={setConfirmDate} needConfirm className="max-w-xs" />
      </Story>

      <Story title="Range with Confirm" description="Range selections require confirmation.">
        <DatePicker
          value={confirmRange}
          onValueChange={setConfirmRange}
          type="range"
          needConfirm
          className="max-w-sm"
        />
      </Story>

      <Story title="Status States" description="Error and warning validation states.">
        <div className="flex max-w-xs flex-col gap-3">
          <DatePicker value={statusDate} onValueChange={setStatusDate} status="error" placeholder="Error state" />
          <DatePicker value={statusDate} onValueChange={setStatusDate} status="warning" placeholder="Warning state" />
        </div>
      </Story>

      <Story title="Range Status" description="Validation states for range picker.">
        <div className="flex max-w-sm flex-col gap-3">
          <DatePicker
            value={statusRange}
            onValueChange={setStatusRange}
            type="range"
            status="error"
            placeholder="Error state"
          />
          <DatePicker
            value={statusRange}
            onValueChange={setStatusRange}
            type="range"
            status="warning"
            placeholder="Warning state"
          />
        </div>
      </Story>

      <Story title="Custom Cell Render" description="Add badges and dots to calendar cells.">
        <DatePicker
          value={date}
          onValueChange={setDate}
          className="max-w-xs"
          renderCell={(day) => (
            <div className="relative">
              {day.getDate()}
              {hasEvent(day) && (
                <span className="bg-primary absolute -bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full" />
              )}
            </div>
          )}
        />
      </Story>

      <Story
        title="Mobile sheet pattern"
        description="On small screens, compose Sheet + Calendar instead of a floating popover. Date Picker stays for desktop; this pattern is the touch-friendly alternative."
      >
        <MobileSheetDate />
      </Story>
    </>
  )
}

function MobileSheetDate() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Date | undefined>(new Date())
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full max-w-xs justify-start font-normal">
          {selected ? selected.toLocaleDateString('en-CA') : 'Pick a date'}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-xl">
        <SheetHeader>
          <SheetTitle>Select date</SheetTitle>
        </SheetHeader>
        <div className="flex justify-center py-2">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={(d) => {
              setSelected(d)
              if (d) setOpen(false)
            }}
            className="rounded-md border"
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
