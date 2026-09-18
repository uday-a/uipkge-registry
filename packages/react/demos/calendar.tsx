import { useState } from 'react'
import Story from '../../components/story/Story'
import { Calendar } from '@react-registry/calendar'
import { enUS, ja } from 'react-day-picker/locale'

// react-day-picker v9/v10 works with native Date (the React mirror is
// react-day-picker based, unlike the reka-ui / @internationalized/date Vue
// version). Single-date selection is controlled via useState<Date>.
const minValue = new Date()
minValue.setDate(minValue.getDate() - 7)
const maxValue = new Date()
maxValue.setDate(maxValue.getDate() + 30)

function isWeekend(date: Date) {
  const day = date.getDay()
  return day === 0 || day === 6
}

export default function CalendarDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 4, 15))
  const [restrictedDate, setRestrictedDate] = useState<Date>()
  const [usDate, setUsDate] = useState<Date>()
  const [jaDate, setJaDate] = useState<Date>()
  const [sideBySideA, setSideBySideA] = useState<Date>()
  const [sideBySideB, setSideBySideB] = useState<Date>()
  const [todayDate, setTodayDate] = useState<Date | undefined>(new Date())
  const [multiDates, setMultiDates] = useState<Date[] | undefined>([
    new Date(2026, 4, 10),
    new Date(2026, 4, 15),
    new Date(2026, 4, 20),
  ])
  const [multiMonthDate, setMultiMonthDate] = useState<Date | undefined>(new Date(2026, 4, 15))
  const [unavailableDate, setUnavailableDate] = useState<Date>()

  return (
    <>
      <Story title="Default" description="Single-date calendar bound to a Date value.">
        <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
      </Story>

      <Story
        title="Min / max"
        description="Restrict selection to a window — here, 7 days back through 30 days forward."
      >
        <Calendar
          mode="single"
          selected={restrictedDate}
          onSelect={setRestrictedDate}
          disabled={[{ before: minValue }, { after: maxValue }]}
          className="rounded-md border"
        />
      </Story>

      <Story
        title="Disabled dates"
        description="disabled matcher disables specific days (weekends here). Unavailable cells stay focusable for a11y but cannot be selected."
      >
        <Calendar
          mode="single"
          selected={unavailableDate}
          onSelect={setUnavailableDate}
          disabled={isWeekend}
          className="rounded-md border"
        />
      </Story>

      <Story
        title="Multiple selection"
        description="mode='multiple' lets users pick several individual days. Value is an array of Date."
      >
        <Calendar mode="multiple" selected={multiDates} onSelect={setMultiDates} className="rounded-md border" />
        <p className="text-muted-foreground mt-2 text-xs">
          Selected: {multiDates?.length ? multiDates.map((d) => d.toLocaleDateString('en-CA')).join(', ') : 'none'}
        </p>
      </Story>

      <Story
        title="Two months"
        description="numberOfMonths=2 shows consecutive months in one calendar root (true multi-month, not two separate instances)."
      >
        <Calendar
          mode="single"
          selected={multiMonthDate}
          onSelect={setMultiMonthDate}
          numberOfMonths={2}
          className="rounded-md border"
        />
      </Story>

      <Story
        title="Month and year layout"
        description="react-day-picker caption layout — use captionLayout for month/year dropdowns when available."
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          captionLayout="dropdown"
          className="rounded-md border"
        />
      </Story>

      <Story
        title="Side-by-side months"
        description="Render two Calendar instances next to each other for parallel month browsing."
      >
        <div className="flex flex-col gap-4 sm:flex-row">
          <Calendar mode="single" selected={sideBySideA} onSelect={setSideBySideA} className="rounded-md border" />
          <Calendar mode="single" selected={sideBySideB} onSelect={setSideBySideB} className="rounded-md border" />
        </div>
      </Story>

      <Story
        title="Locale variants"
        description="Pass locale to localize weekday labels, month names, and first day of week."
      >
        <div className="flex flex-col gap-4 sm:flex-row">
          <Calendar mode="single" selected={usDate} onSelect={setUsDate} locale={enUS} className="rounded-md border" />
          <Calendar mode="single" selected={jaDate} onSelect={setJaDate} locale={ja} className="rounded-md border" />
        </div>
      </Story>

      <Story
        title="Pre-selected today"
        description="Initialize state with new Date() to mark today's cell as selected on mount."
      >
        <Calendar mode="single" selected={todayDate} onSelect={setTodayDate} className="rounded-md border" />
      </Story>

      <Story
        title="Keyboard"
        description="Focus the grid and use arrow keys to move, Space/Enter to select, PageUp/PageDown for months."
      >
        <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
      </Story>
    </>
  )
}
