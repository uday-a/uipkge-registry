"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, type DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

// `selected`/`onSelect` are re-declared explicitly: a bare
// Omit<ComponentProps<DayPicker>, 'mode'> distributes over DayPicker's prop
// union and drops `selected` (not common to every mode), so consumers couldn't
// pass a range. Forcing mode="range" makes the range shape exact.
export interface RangeCalendarProps extends Omit<
  React.ComponentProps<typeof DayPicker>,
  "mode" | "selected" | "onSelect"
> {
  selected?: DateRange;
  onSelect?: (range: DateRange | undefined) => void;
}

/**
 * Date-range calendar — click two dates and the range fills in between. The
 * React mirror of the reka-ui-based Vue RangeCalendar: range start/end cells
 * get the primary fill, the middle gets the accent fill, with the same cell
 * sizes, today / outside / disabled states, and outline nav chevrons mapped
 * 1:1 from the Vue registry's Tailwind class strings. Forces `mode="range"`.
 */
function RangeCalendar({
  className,
  classNames,
  showOutsideDays = true,
  selected,
  onSelect,
  ...props
}: RangeCalendarProps) {
  return (
    <DayPicker
      mode="range"
      selected={selected}
      onSelect={onSelect}
      data-uipkge=""
      data-slot="range-calendar"
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        // react-day-picker v10 renders <Nav> as the FIRST child of .rdp-months
        // (a sibling of the month, NOT inside month_caption). The nav is
        // `absolute inset-x-0 top-0`, so .rdp-months MUST be `relative` or the
        // chevrons escape to the nearest positioned ancestor and float away from
        // the calendar. months relative + an h-9 caption overlays the nav on the
        // caption row, prev/next pinned to the inset-x edges — matching Vue.
        // No mt-4: rdp's .rdp-months wraps the nav + caption, so a top margin
        // would push the header down 16px vs Vue (where mt-4 sits on the grid
        // wrapper). Caption→grid gap is the Month's gap-4.
        months:
          "relative flex flex-col gap-y-4 sm:flex-row sm:gap-x-4 sm:gap-y-0",
        // flex-1: the extra Month wrapper (Months > Month > grid) collapses to the
        // grid's intrinsic width in the sm:flex-row track, leaving the grid narrow
        // and the centered caption drifting left. flex-1 makes Month fill its track
        // → full-width grid + centered label, matching Vue.
        month: "flex flex-1 flex-col gap-4",
        // Label-height (no h-9) so the nav's top-0 aligns with the caption label,
        // matching Vue (size-9 buttons overflow below the heading-sized header).
        month_caption: "flex items-center justify-center",
        caption_label: "text-sm font-medium",
        // Vue's RangeCalendar nav is NOT the single Calendar's nav: it uses the
        // smaller size-7 / opacity-50 buttons pinned 4px in (left-1 / right-1),
        // not size-9 / opacity-70 at the inset-x-0 edge. inset-x-1 reproduces the
        // left-1 / right-1 offset; the buttons match RangeCalendarPrev/NextButton.
        nav: "absolute inset-x-1 top-0 flex items-center justify-between",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex",
        weekday: "text-muted-foreground flex-1 rounded-md text-xs font-normal",
        week: "mt-2 flex w-full",
        day: cn(
          "relative flex-1 p-0 text-center text-sm focus-within:relative focus-within:z-20",
          "[&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md",
          "[&:has([aria-selected].day-outside)]:bg-accent/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
        ),
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "size-9 cursor-pointer p-0 font-normal aria-selected:opacity-100",
        ),
        today:
          "[&:not([aria-selected])]:bg-accent [&:not([aria-selected])]:text-accent-foreground",
        outside:
          "day-outside text-muted-foreground aria-selected:text-muted-foreground",
        disabled: "text-muted-foreground opacity-50",
        // Range start / end → primary fill (mirrors Vue's data-[selection-start] / -end)
        range_start:
          "day-range-start rounded-l-md [&>button]:bg-primary [&>button]:text-primary-foreground [&>button:hover]:bg-primary [&>button:hover]:text-primary-foreground [&>button:focus]:bg-primary [&>button:focus]:text-primary-foreground",
        range_end:
          "day-range-end rounded-r-md [&>button]:bg-primary [&>button]:text-primary-foreground [&>button:hover]:bg-primary [&>button:hover]:text-primary-foreground [&>button:focus]:bg-primary [&>button:focus]:text-primary-foreground",
        // Range middle → accent fill
        range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground [&>button]:hover:bg-accent",
        hidden: "invisible",
        ...classNames,
      }}
      formatters={{
        // Match Vue's narrow (single-letter) weekday labels; react-day-picker
        // defaults to short 'cccccc' (two-letter "Mo"). Locale-aware narrow.
        formatWeekdayName: (weekday, options) =>
          weekday.toLocaleDateString(options?.locale?.code, {
            weekday: "narrow",
          }),
        ...props.formatters,
      }}
      components={{
        Chevron: ({
          orientation,
          className: chevronClassName,
          ...chevronProps
        }) =>
          orientation === "left" ? (
            <ChevronLeft
              className={cn("size-4", chevronClassName)}
              aria-hidden="true"
              {...chevronProps}
            />
          ) : (
            <ChevronRight
              className={cn("size-4", chevronClassName)}
              aria-hidden="true"
              {...chevronProps}
            />
          ),
      }}
      {...props}
    />
  );
}
RangeCalendar.displayName = "RangeCalendar";

export { RangeCalendar };
