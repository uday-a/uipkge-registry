import Story from "../../components/story/Story";
import { useState } from "react";
import { RangeCalendar } from "@react-registry/range-calendar";
import type { DateRange } from "react-day-picker";

// react-day-picker uses native JS Date and a {from, to} DateRange shape
// (the React mirror of reka-ui's {start, end}). Min/max selectable window is
// expressed via the `disabled` matcher rather than separate minValue/maxValue.
const today = new Date();
const addDays = (d: Date, n: number) => {
  const next = new Date(d);
  next.setDate(next.getDate() + n);
  return next;
};

const minValue = addDays(today, -14);
const maxValue = addDays(today, 60);

export default function RangeCalendarDemo() {
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(2026, 4, 10),
    to: new Date(2026, 4, 17),
  });
  const [constrainedRange, setConstrainedRange] = useState<
    DateRange | undefined
  >();
  const [fixedWeeksRange, setFixedWeeksRange] = useState<
    DateRange | undefined
  >();
  const [mondayRange, setMondayRange] = useState<DateRange | undefined>();
  const [presetRange, setPresetRange] = useState<DateRange | undefined>({
    from: today,
    to: addDays(today, 6),
  });

  return (
    <>
      <Story
        title="Default"
        description="Calendar that selects a start and end date inclusive of the range between them."
      >
        <RangeCalendar
          selected={range}
          onSelect={setRange}
          defaultMonth={new Date(2026, 4, 10)}
          className="rounded-md border"
        />
      </Story>

      <Story
        title="Min / max"
        description="Constrain the selectable window — here, 14 days back through 60 days forward."
      >
        <RangeCalendar
          selected={constrainedRange}
          onSelect={setConstrainedRange}
          disabled={{ before: minValue, after: maxValue }}
          startMonth={minValue}
          endMonth={maxValue}
          className="rounded-md border"
        />
      </Story>

      <Story
        title="Fixed weeks"
        description="fixed-weeks always renders 6 rows so the calendar height never shifts month-to-month."
      >
        <RangeCalendar
          selected={fixedWeeksRange}
          onSelect={setFixedWeeksRange}
          fixedWeeks
          className="rounded-md border"
        />
      </Story>

      <Story
        title="Week starts Monday"
        description="weekStartsOn=1 (Monday) for ISO/EU calendars instead of the default Sunday start."
      >
        <RangeCalendar
          selected={mondayRange}
          onSelect={setMondayRange}
          weekStartsOn={1}
          className="rounded-md border"
        />
      </Story>

      <Story
        title="Pre-selected range"
        description="Initialize v-model with a {start, end} pair to highlight a default range on mount."
      >
        <RangeCalendar
          selected={presetRange}
          onSelect={setPresetRange}
          className="rounded-md border"
        />
      </Story>
    </>
  );
}
