<script setup lang="ts">
import type { DateValue } from "reka-ui";
import type { HTMLAttributes } from "vue";
import { computed, ref, watch } from "vue";
import { Calendar as CalendarIcon, X } from "lucide-vue-next";
import {
  CalendarDate,
  CalendarDateTime,
  getLocalTimeZone,
  parseDate,
  parseDateTime,
  today,
} from "@internationalized/date";
import { useDateFormatter } from "reka-ui";
import { toDate } from "reka-ui/date";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { RangeCalendar } from "@/components/ui/range-calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TimeColumns } from "@/components/ui/time-picker";
import { cn } from "@/lib/utils";

export type DatePickerType = "single" | "multiple" | "range";
export type DatePickerLayout =
  "default" | "month-and-year" | "month-only" | "year-only";
export type DatePickerPicker = "day" | "week" | "month" | "quarter" | "year";
export type DatePickerStatus = "error" | "warning";
export type DatePickerSize = "small" | "middle" | "large";
export type DatePickerPlacement =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight";

type SingleValue = string | DateValue | null;
type MultipleValue = (string | DateValue)[] | null;
type RangeValue = { start: string | DateValue; end: string | DateValue } | null;

export interface DatePickerPreset {
  label: string;
  value: SingleValue | MultipleValue | RangeValue;
  category?: string;
}

export interface DisabledTimeResult {
  disabledHours?: () => number[];
  disabledMinutes?: (selectedHour: number) => number[];
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[];
}

type FormatValue =
  "short" | "medium" | "long" | "full" | Intl.DateTimeFormatOptions;

interface Props {
  /** Controlled value. Shape depends on `type`. ISO `YYYY-MM-DD` (or `YYYY-MM-DDTHH:mm` when `show-time`). */
  modelValue?: SingleValue | MultipleValue | RangeValue;
  type?: DatePickerType;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  clearable?: boolean;
  /** Format for the trigger label. String presets or Intl.DateTimeFormatOptions for full flexibility. Ignored when `show-time` (always shows date + time). */
  format?: FormatValue;
  /** Backward-compat alias for `format`. */
  dateFormat?: FormatValue;
  locale?: string;
  numberOfMonths?: number;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  fixedWeeks?: boolean;
  minValue?: string | DateValue;
  maxValue?: string | DateValue;
  /** Header layout: control which parts (month/year) become dropdowns. */
  layout?: DatePickerLayout;
  /**
   * Granularity of selection.
   * - `day` (default): pick a single day from the calendar grid.
   * - `week`: pick a full week — value is the week's start date (Monday or per locale).
   * - `month`: pick a whole month — value snaps to the 1st day of the month.
   * - `quarter`: pick a quarter — value snaps to the quarter's start date.
   * - `year`: pick a whole year — value snaps to Jan 1 of the year.
   * Only honored for `type='single'`.
   */
  picker?: DatePickerPicker;
  /** Show "Today" shortcut at popover top (single + day picker only). */
  showCurrentDate?: boolean;
  /** Require clicking OK before applying the selected value. */
  needConfirm?: boolean;
  /** Validation status — applies colored border to the trigger. */
  status?: DatePickerStatus;
  /** Size variant of the trigger input. */
  size?: DatePickerSize;
  /** Placement of the popover relative to the trigger. */
  placement?: DatePickerPlacement;
  /** Pair the calendar with a time selector. Value becomes `YYYY-MM-DDTHH:mm`. */
  showTime?: boolean;
  /** Show seconds column in time picker. Only used when `show-time`. */
  showSeconds?: boolean;
  /** 24h vs AM/PM column. Only used when `show-time`. */
  use24Hour?: boolean;
  /** Minute step for the time column. Only used when `show-time`. */
  minuteStep?: number;
  /** Second step for the time column. Only used when `show-time` and `show-seconds`. */
  secondStep?: number;
  /** Default time for newly picked dates when `show-time` and no prior selection. `HH:mm` or `HH:mm:ss`. */
  defaultTime?: string;
  /** Preset shortcuts for quick selection. */
  presets?: DatePickerPreset[];
  /** Custom separator between range start and end dates. */
  separator?: string;
  /** Function to determine if a specific date should be disabled. */
  disabledDate?: (current: DateValue) => boolean;
  /** Function to determine if specific times should be disabled. Only used when `show-time`. */
  disabledTime?: (current?: DateValue) => DisabledTimeResult;
  triggerClass?: HTMLAttributes["class"];
  class?: HTMLAttributes["class"];
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  type: "single",
  placeholder: "Pick a date",
  disabled: false,
  readOnly: false,
  clearable: true,
  format: "medium",
  locale: "en-US",
  weekStartsOn: 0,
  fixedWeeks: false,
  layout: "default",
  picker: "day",
  showCurrentDate: false,
  needConfirm: false,
  status: undefined,
  size: "middle",
  placement: "bottomLeft",
  showTime: false,
  showSeconds: false,
  use24Hour: false,
  minuteStep: 5,
  secondStep: 1,
  defaultTime: "12:00",
  separator: "~",
});

const emits = defineEmits<{
  "update:modelValue": [value: SingleValue | MultipleValue | RangeValue];
}>();

const open = ref(false);
const formatter = useDateFormatter(props.locale);

const effectiveFormat = computed(() => props.dateFormat ?? props.format);

const effectiveNumberOfMonths = computed(
  () => props.numberOfMonths ?? (props.type === "range" ? 2 : 1),
);

const effectivePresets = computed<DatePickerPreset[] | undefined>(() => {
  if (props.presets) return props.presets;
  if (props.type !== "range") return undefined;
  const t = today(getLocalTimeZone());
  return [
    { label: "Today", value: { start: t, end: t } },
    {
      label: "Yesterday",
      value: { start: t.subtract({ days: 1 }), end: t.subtract({ days: 1 }) },
    },
    { label: "Last 7 days", value: { start: t.subtract({ days: 6 }), end: t } },
    {
      label: "Last 30 days",
      value: { start: t.subtract({ days: 29 }), end: t },
    },
    { label: "This month", value: { start: t.set({ day: 1 }), end: t } },
    {
      label: "Last month",
      value: (() => {
        const lastMonthEnd = t.set({ day: 1 }).subtract({ days: 1 });
        const lastMonthStart = lastMonthEnd.set({ day: 1 });
        return { start: lastMonthStart, end: lastMonthEnd };
      })(),
    },
    {
      label: "Year to date",
      value: { start: t.set({ month: 1, day: 1 }), end: t },
    },
  ];
});

const presetGroups = computed(() => {
  const groups = new Map<string | undefined, DatePickerPreset[]>();
  for (const p of effectivePresets.value ?? []) {
    const cat = p.category;
    if (!groups.has(cat)) groups.set(cat, []);
    groups.get(cat)!.push(p);
  }
  return Array.from(groups.entries()).map(([category, presets]) => ({
    category,
    presets,
  }));
});

// ---- Need confirm: preview state ----
const previewValue = ref<typeof internal.value>(undefined);
const activeValue = computed(() =>
  props.needConfirm ? (previewValue.value ?? internal.value) : internal.value,
);

function commitPreview() {
  if (props.needConfirm && previewValue.value !== undefined) {
    handleUpdate(previewValue.value);
    previewValue.value = undefined;
  }
  open.value = false;
}

function cancelPreview() {
  previewValue.value = undefined;
  open.value = false;
}

watch(open, (v) => {
  if (!v) previewValue.value = undefined;
});

function coerce(v: string | DateValue | null | undefined): DateValue | null {
  if (!v) return null;
  if (typeof v === "string") {
    try {
      return v.includes("T") ? parseDateTime(v) : parseDate(v);
    } catch {
      return null;
    }
  }
  return v;
}

function coerceShape(v: Props["modelValue"]) {
  if (props.type === "multiple") {
    if (!Array.isArray(v)) return undefined;
    return v.map(coerce).filter((x): x is DateValue => x != null);
  }
  if (props.type === "range") {
    if (
      !v ||
      Array.isArray(v) ||
      typeof v === "string" ||
      !("start" in (v as object))
    )
      return undefined;
    const r = v as { start: string | DateValue; end: string | DateValue };
    const start = coerce(r.start);
    const end = coerce(r.end);
    if (!start) return undefined;
    return end ? { start, end } : { start };
  }
  return coerce(v as SingleValue) ?? undefined;
}

const internal = ref(coerceShape(props.modelValue));
watch(
  () => props.modelValue,
  (v) => {
    internal.value = coerceShape(v);
  },
  { deep: true },
);

const minDate = computed(() => coerce(props.minValue) ?? undefined);
const maxDate = computed(() => coerce(props.maxValue) ?? undefined);

function fmtDate(d: DateValue) {
  const fmt = effectiveFormat.value;
  if (typeof fmt === "object") {
    return formatter.custom(toDate(d), fmt);
  }
  return formatter.custom(toDate(d), { dateStyle: fmt });
}

function fmtMonth(d: DateValue) {
  return formatter.custom(toDate(d), { month: "long", year: "numeric" });
}

function fmtTime(d: DateValue) {
  if (!("hour" in d)) return "";
  const dt = d as CalendarDateTime;
  const h24 = String(dt.hour).padStart(2, "0");
  const m = String(dt.minute).padStart(2, "0");
  if (props.showSeconds) {
    const s = String(dt.second).padStart(2, "0");
    if (props.use24Hour) return `${h24}:${m}:${s}`;
    const h12 = dt.hour % 12 === 0 ? 12 : dt.hour % 12;
    const period = dt.hour >= 12 ? "PM" : "AM";
    return `${h12}:${m}:${s} ${period}`;
  }
  if (props.use24Hour) {
    return `${h24}:${m}`;
  }
  const h12 = dt.hour % 12 === 0 ? 12 : dt.hour % 12;
  const period = dt.hour >= 12 ? "PM" : "AM";
  return `${h12}:${m} ${period}`;
}

function fmtDateTime(d: DateValue) {
  return `${fmtDate(d)} ${fmtTime(d)}`.trim();
}

const display = computed(() => {
  const v = internal.value;
  if (!v) return "";
  if (props.type === "multiple") {
    const arr = v as DateValue[];
    if (!arr.length) return "";
    if (arr.length === 1) return fmtDate(arr[0]!);
    if (arr.length <= 3) return arr.map(fmtDate).join(", ");
    return `${arr.length} dates selected`;
  }
  if (props.type === "range") {
    const r = v as { start?: DateValue; end?: DateValue };
    const fmt = props.showTime ? fmtDateTime : fmtDate;
    if (r.start && r.end)
      return `${fmt(r.start)} ${props.separator} ${fmt(r.end)}`;
    if (r.start) return `${fmt(r.start)} ${props.separator} …`;
    return "";
  }
  if (props.picker === "week") {
    const ws = weekStart(v as DateValue);
    return `Week ${weekNumber(ws)}, ${ws.year}`;
  }
  if (props.picker === "month") return fmtMonth(v as DateValue);
  if (props.picker === "quarter") {
    const q = Math.ceil((v as DateValue).month / 3);
    return `Q${q} ${(v as DateValue).year}`;
  }
  if (props.picker === "year") return String((v as DateValue).year);
  return props.showTime ? fmtDateTime(v as DateValue) : fmtDate(v as DateValue);
});

const hasValue = computed(() => {
  const v = internal.value;
  if (!v) return false;
  if (props.type === "multiple") return (v as DateValue[]).length > 0;
  if (props.type === "range")
    return Boolean((v as { start?: DateValue }).start);
  return true;
});

function emitOut(v: typeof internal.value) {
  if (props.type === "multiple") {
    const arr = (v as DateValue[]) ?? [];
    emits(
      "update:modelValue",
      arr.map((d) => d.toString()),
    );
    return;
  }
  if (props.type === "range") {
    // Clear must emit null. Incomplete ranges (start only) stay local until both ends exist.
    if (!v) {
      emits("update:modelValue", null);
      return;
    }
    const r = v as { start?: DateValue; end?: DateValue };
    if (!r.start || !r.end) return;
    emits("update:modelValue", {
      start: r.start.toString(),
      end: r.end.toString(),
    });
    return;
  }
  emits("update:modelValue", v ? (v as DateValue).toString() : null);
}

function handleUpdate(v: typeof internal.value) {
  internal.value = v;
  emitOut(v);
  if (props.needConfirm) return;
  // Don't close on day click when show-time is on — user still needs to pick the time.
  if (props.type === "single" && v && !props.showTime) open.value = false;
  if (props.type === "range") {
    const r = v as { start?: DateValue; end?: DateValue } | undefined;
    if (r?.start && r?.end && !props.showTime) open.value = false;
  }
}

function clear(event: Event) {
  event.stopPropagation();
  if (props.disabled || props.readOnly) return;
  if (props.type === "multiple") handleUpdate([]);
  else handleUpdate(undefined);
}

function applyPreset(preset: DatePickerPreset) {
  if (props.disabled || props.readOnly) return;
  const v = preset.value;
  if (!v) {
    handleUpdate(undefined);
    open.value = false;
    return;
  }
  if (props.type === "multiple") {
    const arr = (v as MultipleValue) ?? [];
    handleUpdate(
      arr.map(coerce).filter((x): x is DateValue => x != null) as never,
    );
    open.value = false;
    return;
  }
  if (props.type === "range") {
    const r = v as RangeValue;
    if (!r?.start) {
      handleUpdate(undefined);
      open.value = false;
      return;
    }
    const start = coerce(r.start);
    const end = coerce(r.end);
    if (!start) {
      handleUpdate(undefined);
      open.value = false;
      return;
    }
    handleUpdate(end ? { start, end } : ({ start } as never));
    open.value = false;
    return;
  }
  handleUpdate(coerce(v as SingleValue) as never);
  open.value = false;
}

const placeholderDate = today(getLocalTimeZone());
const calendarLayout = computed(() =>
  props.layout === "default" ? undefined : props.layout,
);

function pickToday() {
  if (props.type !== "single") return;
  const t = today(getLocalTimeZone());
  if (props.picker === "week") {
    handleUpdate(weekStart(t));
    return;
  }
  handleUpdate(t);
}

// ---- Week picker utilities ----
function weekStart(d: DateValue): CalendarDate {
  // ISO week starts on Monday (1), but respect weekStartsOn prop
  const jsDate = toDate(d);
  const dayOfWeek = jsDate.getDay();
  const offset = (dayOfWeek - props.weekStartsOn + 7) % 7;
  return new CalendarDate(d.year, d.month, d.day).subtract({ days: offset });
}

function weekNumber(d: DateValue): number {
  const jsDate = toDate(d);
  const target = new Date(jsDate.valueOf());
  const dayNr = (jsDate.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
  }
  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
}

function weekAnchorForMonth(year: number, month: number): CalendarDate {
  const firstOfMonth = new CalendarDate(year, month, 1);
  return weekStart(firstOfMonth);
}

const weekGrid = computed(() => {
  const anchor = monthYearAnchor.value;
  const start = weekAnchorForMonth(anchor.year, anchor.month);
  // Generate 6 weeks to cover the month
  return Array.from({ length: 6 }, (_, i) => {
    const weekStartDate = start.add({ weeks: i });
    const weekEndDate = weekStartDate.add({ days: 6 });
    return {
      start: weekStartDate,
      end: weekEndDate,
      weekNum: weekNumber(weekStartDate),
    };
  });
});

function isWeekSelected(ws: CalendarDate) {
  const v = activeValue.value as DateValue | undefined;
  if (!v) return false;
  const selectedWeekStart = weekStart(v);
  return selectedWeekStart.compare(ws) === 0;
}

function isWeekDisabled(ws: CalendarDate) {
  if (minDate.value && ws.compare(minDate.value) < 0) return true;
  const weekEnd = ws.add({ days: 6 });
  if (maxDate.value && weekEnd.compare(maxDate.value) > 0) return true;
  if (props.disabledDate && props.disabledDate(ws)) return true;
  return false;
}

function pickWeek(ws: CalendarDate) {
  if (isWeekDisabled(ws)) return;
  if (props.needConfirm) {
    previewValue.value = ws;
    return;
  }
  handleUpdate(ws);
}

// ---- Quarter picker utilities ----
const quarterLabels = ["Q1", "Q2", "Q3", "Q4"];
const quarterMonths = [1, 4, 7, 10] as const;

function quarterStart(year: number, quarterIdx: number): CalendarDate {
  return new CalendarDate(year, quarterMonths[quarterIdx]!, 1);
}

function isQuarterSelected(qIdx: number) {
  const v = activeValue.value as DateValue | undefined;
  if (!v) return false;
  return (
    v.year === monthYearAnchor.value.year && Math.ceil(v.month / 3) === qIdx + 1
  );
}

function isQuarterDisabled(qIdx: number) {
  const d = quarterStart(monthYearAnchor.value.year, qIdx);
  if (minDate.value && d.compare(minDate.value) < 0) return true;
  const lastMonth = d.add({ months: 2 });
  const lastDay = lastMonth.add({ months: 1 }).subtract({ days: 1 });
  if (maxDate.value && lastDay.compare(maxDate.value) > 0) return true;
  if (props.disabledDate && props.disabledDate(d)) return true;
  return false;
}

function pickQuarter(qIdx: number) {
  const d = quarterStart(monthYearAnchor.value.year, qIdx);
  if (isQuarterDisabled(qIdx)) return;
  if (props.needConfirm) {
    previewValue.value = d;
    return;
  }
  handleUpdate(d);
}

// ---- Calendar value passed to Reka must be a CalendarDate (no time component),
// so it doesn't refuse the value or repaint with a stale time.
function stripTime(d?: DateValue) {
  if (!d) return d;
  return new CalendarDate(d.year, d.month, d.day);
}

const calendarValue = computed(() => {
  // Use activeValue so needConfirm preview highlights on the grid (not only internal).
  const v = activeValue.value;
  if (props.type === "multiple")
    return (v as DateValue[] | undefined)?.map(stripTime) as never;
  if (props.type === "range") {
    const r = v as { start?: DateValue; end?: DateValue } | undefined;
    if (!r) return undefined as never;
    return { start: stripTime(r.start), end: stripTime(r.end) } as never;
  }
  return stripTime(v as DateValue | undefined) as never;
});

// Wrap update from calendar — re-attach time component if show-time is on.
type TimeShape = { h: number; m: number; s: number };

const lastTime = computed<TimeShape>(() => {
  // Prefer preview (confirm mode) so time columns track the uncommitted selection.
  const v = activeValue.value;
  if (props.type === "single" && v && "hour" in (v as object)) {
    const dt = v as CalendarDateTime;
    return { h: dt.hour, m: dt.minute, s: dt.second };
  }
  if (props.type === "range") {
    const r = v as { start?: DateValue } | undefined;
    if (r?.start && "hour" in (r.start as object)) {
      const dt = r.start as CalendarDateTime;
      return { h: dt.hour, m: dt.minute, s: dt.second };
    }
  }
  const m = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(props.defaultTime);
  if (!m) return { h: 12, m: 0, s: 0 };
  return { h: Number(m[1]), m: Number(m[2]), s: m[3] ? Number(m[3]) : 0 };
});

function withTime(d: DateValue, t: TimeShape = lastTime.value) {
  return new CalendarDateTime(d.year, d.month, d.day, t.h, t.m, t.s);
}

function handleCalendarUpdate(v: unknown) {
  if (props.needConfirm) {
    if (props.type === "multiple") {
      previewValue.value =
        ((v as DateValue[])?.map((d) => withTime(d)) as never) ?? [];
    } else if (props.type === "range") {
      const r = v as { start?: DateValue; end?: DateValue } | undefined;
      if (!r?.start) {
        previewValue.value = undefined;
      } else {
        const start = props.showTime ? withTime(r.start) : r.start;
        const end = r.end
          ? props.showTime
            ? withTime(r.end)
            : r.end
          : undefined;
        previewValue.value = end ? { start, end } : ({ start } as never);
      }
    } else {
      previewValue.value = v
        ? ((props.showTime
            ? withTime(v as DateValue)
            : (v as DateValue)) as never)
        : undefined;
    }
    return;
  }
  if (!props.showTime) {
    handleUpdate(v as typeof internal.value);
    return;
  }
  if (props.type === "multiple") {
    const arr = (v as DateValue[]) ?? [];
    handleUpdate(arr.map((d) => withTime(d)) as never);
    return;
  }
  if (props.type === "range") {
    const r = v as { start?: DateValue; end?: DateValue } | undefined;
    if (!r?.start) return handleUpdate(undefined);
    const start = withTime(r.start);
    const end = r.end ? withTime(r.end) : undefined;
    handleUpdate(end ? { start, end } : ({ start } as never));
    return;
  }
  if (v) handleUpdate(withTime(v as DateValue) as never);
}

// Time column for show-time mode.
const timeForColumns = computed(() => {
  const t = lastTime.value;
  if (props.showSeconds) {
    return `${String(t.h).padStart(2, "0")}:${String(t.m).padStart(2, "0")}:${String(t.s).padStart(2, "0")}`;
  }
  return `${String(t.h).padStart(2, "0")}:${String(t.m).padStart(2, "0")}`;
});

const timeFormat = computed(() => {
  if (props.showSeconds) return "HH:mm:ss";
  return "HH:mm";
});

function handleTimeUpdate(value: string) {
  const base = props.needConfirm
    ? (previewValue.value ?? internal.value)
    : internal.value;
  if (!base) return;
  const m = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(value);
  if (!m) return;
  const t: TimeShape = {
    h: Number(m[1]),
    m: Number(m[2]),
    s: m[3] ? Number(m[3]) : 0,
  };
  if (props.type === "single") {
    const next = withTime(base as DateValue, t) as never;
    if (props.needConfirm) {
      previewValue.value = next;
      return;
    }
    handleUpdate(next);
    return;
  }
  if (props.type === "range") {
    const r = base as { start?: DateValue; end?: DateValue };
    if (!r.start) return;
    const start = withTime(r.start, t);
    const end = r.end ? withTime(r.end, t) : undefined;
    const next = (end ? { start, end } : { start }) as never;
    if (props.needConfirm) {
      previewValue.value = next;
      return;
    }
    handleUpdate(next);
  }
}

const disabledTimeConfig = computed(() => {
  if (!props.disabledTime) return undefined;
  let current: DateValue | undefined;
  if (props.type === "range") {
    const r = activeValue.value as { start?: DateValue } | undefined;
    current = r?.start;
  } else {
    current = activeValue.value as DateValue | undefined;
  }
  return props.disabledTime(current);
});

// ---- Month / year picker mode ----
const monthYearAnchor = ref<DateValue>(
  (internal.value as DateValue) ?? today(getLocalTimeZone()),
);
watch(open, (v) => {
  if (v)
    monthYearAnchor.value =
      (internal.value as DateValue) ?? today(getLocalTimeZone());
});

const monthLabels = computed(() => {
  const base = today(getLocalTimeZone());
  return Array.from({ length: 12 }, (_, m) => {
    const d = new CalendarDate(base.year, m + 1, 1);
    return formatter.custom(toDate(d), { month: "short" });
  });
});

const yearGrid = computed(() => {
  const y = monthYearAnchor.value.year;
  const start = y - (y % 12);
  return Array.from({ length: 12 }, (_, i) => start + i);
});

function shiftAnchor(dir: -1 | 1) {
  const a = monthYearAnchor.value;
  if (props.picker === "month" || props.picker === "week") {
    monthYearAnchor.value = new CalendarDate(a.year + dir, a.month, 1);
  } else if (props.picker === "year" || props.picker === "quarter") {
    monthYearAnchor.value = new CalendarDate(a.year + dir, 1, 1);
  }
}

function isMonthSelected(monthIdx: number) {
  const v = activeValue.value as DateValue | undefined;
  if (!v) return false;
  return v.year === monthYearAnchor.value.year && v.month === monthIdx + 1;
}

function isYearSelected(year: number) {
  const v = activeValue.value as DateValue | undefined;
  return !!v && v.year === year;
}

function pickMonth(monthIdx: number) {
  const d = new CalendarDate(monthYearAnchor.value.year, monthIdx + 1, 1);
  if (isMonthDisabled(monthIdx)) return;
  if (props.needConfirm) {
    previewValue.value = d;
    return;
  }
  handleUpdate(d);
}

function pickYear(year: number) {
  const d = new CalendarDate(year, 1, 1);
  if (isYearDisabled(year)) return;
  if (props.picker === "year") {
    if (props.needConfirm) {
      previewValue.value = d;
      return;
    }
    handleUpdate(d);
  } else {
    monthYearAnchor.value = d;
  }
}

function isMonthDisabled(monthIdx: number) {
  const d = new CalendarDate(monthYearAnchor.value.year, monthIdx + 1, 1);
  if (minDate.value && d.compare(minDate.value) < 0) return true;
  if (maxDate.value && d.compare(maxDate.value) > 0) return true;
  if (props.disabledDate && props.disabledDate(d)) return true;
  return false;
}

function isYearDisabled(year: number) {
  const d = new CalendarDate(year, 1, 1);
  if (
    minDate.value &&
    new CalendarDate(year, 12, 31).compare(minDate.value) < 0
  )
    return true;
  if (maxDate.value && d.compare(maxDate.value) > 0) return true;
  if (props.disabledDate && props.disabledDate(d)) return true;
  return false;
}

// ---- Popover placement ----
const popoverPlacement = computed(() => {
  const map: Record<
    string,
    {
      side: "top" | "bottom" | "left" | "right";
      align: "start" | "center" | "end";
    }
  > = {
    top: { side: "top", align: "center" },
    bottom: { side: "bottom", align: "center" },
    left: { side: "left", align: "center" },
    right: { side: "right", align: "center" },
    topLeft: { side: "top", align: "start" },
    topRight: { side: "top", align: "end" },
    bottomLeft: { side: "bottom", align: "start" },
    bottomRight: { side: "bottom", align: "end" },
  };
  return map[props.placement] ?? { side: "bottom", align: "start" };
});

// ---- Size ----
const buttonSize = computed(() => {
  if (props.size === "small") return "sm";
  if (props.size === "large") return "lg";
  return "default";
});

const triggerClasses = computed(() =>
  cn(
    props.showTime ? "min-w-[280px]" : "min-w-[240px]",
    "justify-start gap-2 text-left font-normal",
    !hasValue.value && "text-muted-foreground",
    props.status === "error" &&
      "border-destructive focus-visible:ring-destructive",
    props.status === "warning" && "border-warning focus-visible:ring-warning",
    props.triggerClass,
    props.class,
  ),
);

function applyAndClose() {
  // In confirm mode, "Done" on the time panel must commit the preview — closing alone
  // would discard it via the open→false watcher.
  if (props.needConfirm) {
    commitPreview();
    return;
  }
  open.value = false;
}
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        type="button"
        variant="outline"
        :size="buttonSize"
        :disabled="disabled"
        :class="triggerClasses"
        data-uipkge
        data-slot="date-picker"
      >
        <CalendarIcon class="size-4" aria-hidden="true" />
        <span class="flex-1 truncate">{{ display || placeholder }}</span>
        <!-- span + role=button: nested <button> inside PopoverTrigger Button is invalid HTML -->
        <span
          v-if="clearable && hasValue && !disabled && !readOnly"
          role="button"
          tabindex="0"
          class="text-muted-foreground hover:text-foreground focus-visible:ring-ring -mr-1 inline-flex size-9 cursor-pointer items-center justify-center rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
          aria-label="Clear date"
          @click.stop="clear"
          @keydown.enter.prevent.stop="clear"
          @keydown.space.prevent.stop="clear"
        >
          <X class="size-3.5" aria-hidden="true" />
        </span>
      </Button>
    </PopoverTrigger>
    <PopoverContent
      class="w-auto p-0"
      :side="
        popoverPlacement.side as 'top' | 'bottom' | 'left' | 'right' | undefined
      "
      :align="popoverPlacement.align as 'center' | 'end' | 'start' | undefined"
    >
      <div
        v-if="
          showCurrentDate &&
          type === 'single' &&
          (picker === 'day' || picker === 'week')
        "
        class="flex justify-end border-b px-3 py-2"
      >
        <button
          type="button"
          class="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded px-2 py-1.5 text-xs focus-visible:ring-2 focus-visible:outline-none"
          @click="pickToday"
        >
          Today
        </button>
      </div>
      <div
        v-if="picker !== 'day' && type === 'single'"
        class="w-[260px] p-3"
        data-uipkge
        data-slot="month-year-picker"
      >
        <!-- Week picker -->
        <template v-if="picker === 'week'">
          <div class="mb-3 flex items-center justify-between">
            <button
              type="button"
              class="hover:bg-accent focus-visible:ring-ring inline-flex size-9 items-center justify-center rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
              aria-label="Previous"
              @click="shiftAnchor(-1)"
            >
              <span class="text-muted-foreground text-sm">‹</span>
            </button>
            <span class="text-sm font-medium">
              {{
                formatter.custom(toDate(monthYearAnchor as DateValue), {
                  month: "short",
                  year: "numeric",
                })
              }}
            </span>
            <button
              type="button"
              class="hover:bg-accent focus-visible:ring-ring inline-flex size-9 items-center justify-center rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
              aria-label="Next"
              @click="shiftAnchor(1)"
            >
              <span class="text-muted-foreground text-sm">›</span>
            </button>
          </div>
          <div class="flex flex-col gap-1">
            <button
              type="button"
              v-for="(week, i) in weekGrid"
              :key="i"
              data-uipkge
              data-slot="week-picker-cell"
              :data-active="isWeekSelected(week.start)"
              :disabled="isWeekDisabled(week.start)"
              :aria-pressed="isWeekSelected(week.start)"
              :aria-disabled="isWeekDisabled(week.start) || undefined"
              class="hover:bg-accent focus-visible:ring-ring flex items-center justify-between rounded px-3 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-30 disabled:hover:bg-transparent"
              :class="
                isWeekSelected(week.start)
                  ? 'bg-primary text-primary-foreground hover:bg-primary'
                  : ''
              "
              @click="pickWeek(week.start)"
            >
              <span class="font-medium">Week {{ week.weekNum }}</span>
              <span
                class="text-muted-foreground text-xs"
                :class="
                  isWeekSelected(week.start) ? 'text-primary-foreground' : ''
                "
              >
                {{ week.start.day }}
                {{ formatter.custom(toDate(week.start), { month: "short" }) }} –
                {{ week.end.day }}
                {{ formatter.custom(toDate(week.end), { month: "short" }) }}
              </span>
            </button>
          </div>
        </template>

        <!-- Quarter picker -->
        <template v-else-if="picker === 'quarter'">
          <div class="mb-3 flex items-center justify-between">
            <button
              type="button"
              class="hover:bg-accent focus-visible:ring-ring inline-flex size-9 items-center justify-center rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
              aria-label="Previous"
              @click="shiftAnchor(-1)"
            >
              <span class="text-muted-foreground text-sm">‹</span>
            </button>
            <span class="text-sm font-medium">{{ monthYearAnchor.year }}</span>
            <button
              type="button"
              class="hover:bg-accent focus-visible:ring-ring inline-flex size-9 items-center justify-center rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
              aria-label="Next"
              @click="shiftAnchor(1)"
            >
              <span class="text-muted-foreground text-sm">›</span>
            </button>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <button
              type="button"
              v-for="(label, q) in quarterLabels"
              :key="q"
              data-uipkge
              data-slot="quarter-picker-cell"
              :data-active="isQuarterSelected(q)"
              :disabled="isQuarterDisabled(q)"
              :aria-pressed="isQuarterSelected(q)"
              :aria-disabled="isQuarterDisabled(q) || undefined"
              class="hover:bg-accent focus-visible:ring-ring rounded px-4 py-6 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-30 disabled:hover:bg-transparent"
              :class="
                isQuarterSelected(q)
                  ? 'bg-primary text-primary-foreground hover:bg-primary'
                  : ''
              "
              @click="pickQuarter(q)"
            >
              {{ label }}
            </button>
          </div>
        </template>

        <!-- Month / Year picker -->
        <template v-else>
          <div class="mb-3 flex items-center justify-between">
            <button
              type="button"
              class="hover:bg-accent focus-visible:ring-ring inline-flex size-9 items-center justify-center rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
              aria-label="Previous"
              @click="shiftAnchor(-1)"
            >
              <span class="text-muted-foreground text-sm">‹</span>
            </button>
            <span class="text-sm font-medium">
              {{
                picker === "month"
                  ? monthYearAnchor.year
                  : `${yearGrid[0]} – ${yearGrid[yearGrid.length - 1]}`
              }}
            </span>
            <button
              type="button"
              class="hover:bg-accent focus-visible:ring-ring inline-flex size-9 items-center justify-center rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
              aria-label="Next"
              @click="shiftAnchor(1)"
            >
              <span class="text-muted-foreground text-sm">›</span>
            </button>
          </div>
          <div v-if="picker === 'month'" class="grid grid-cols-3 gap-2">
            <button
              type="button"
              v-for="(label, m) in monthLabels"
              :key="m"
              :disabled="isMonthDisabled(m)"
              data-uipkge
              data-slot="month-picker-cell"
              :data-active="isMonthSelected(m)"
              :aria-pressed="isMonthSelected(m)"
              :aria-disabled="isMonthDisabled(m) || undefined"
              class="hover:bg-accent focus-visible:ring-ring rounded px-2 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-30 disabled:hover:bg-transparent"
              :class="
                isMonthSelected(m)
                  ? 'bg-primary text-primary-foreground hover:bg-primary'
                  : ''
              "
              @click="pickMonth(m)"
            >
              {{ label }}
            </button>
          </div>
          <div v-else class="grid grid-cols-3 gap-2">
            <button
              type="button"
              v-for="y in yearGrid"
              :key="y"
              :disabled="isYearDisabled(y)"
              data-uipkge
              data-slot="year-picker-cell"
              :data-active="isYearSelected(y)"
              :aria-pressed="isYearSelected(y)"
              :aria-disabled="isYearDisabled(y) || undefined"
              class="hover:bg-accent focus-visible:ring-ring rounded px-2 py-2 text-sm tabular-nums transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-30 disabled:hover:bg-transparent"
              :class="
                isYearSelected(y)
                  ? 'bg-primary text-primary-foreground hover:bg-primary'
                  : ''
              "
              @click="pickYear(y)"
            >
              {{ y }}
            </button>
          </div>
        </template>
      </div>
      <div v-else class="flex">
        <aside
          v-if="presetGroups.length"
          class="flex w-40 flex-col gap-1 border-r p-2"
        >
          <template v-for="(group, gIdx) in presetGroups" :key="gIdx">
            <div
              v-if="group.category"
              class="text-muted-foreground px-2 pt-1 text-xs font-semibold tracking-wider uppercase"
            >
              {{ group.category }}
            </div>
            <button
              type="button"
              v-for="p in group.presets"
              :key="p.label"
              class="hover:bg-accent focus-visible:ring-ring rounded-md px-2 py-1.5 text-left text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
              @click="applyPreset(p)"
            >
              {{ p.label }}
            </button>
          </template>
        </aside>
        <RangeCalendar
          v-if="type === 'range'"
          :model-value="calendarValue"
          :placeholder="placeholderDate"
          :number-of-months="effectiveNumberOfMonths"
          :week-starts-on="weekStartsOn"
          :fixed-weeks="fixedWeeks"
          :min-value="minDate"
          :max-value="maxDate"
          :readonly="readOnly"
          :is-date-disabled="disabledDate"
          @update:model-value="handleCalendarUpdate"
        />
        <Calendar
          v-else
          :model-value="calendarValue"
          :multiple="type === 'multiple'"
          :placeholder="placeholderDate"
          :number-of-months="effectiveNumberOfMonths"
          :week-starts-on="weekStartsOn"
          :fixed-weeks="fixedWeeks"
          :min-value="minDate"
          :max-value="maxDate"
          :readonly="readOnly"
          :layout="calendarLayout"
          :is-date-disabled="disabledDate"
          @update:model-value="handleCalendarUpdate"
        >
          <template #cell="{ day, month }">
            <slot name="cell" :day="day" :month="month">
              {{ day.day }}
            </slot>
          </template>
        </Calendar>
        <div v-if="showTime" class="flex flex-col border-l">
          <div class="flex items-center justify-between border-b px-3 py-2">
            <span
              class="text-muted-foreground text-xs tracking-widest uppercase"
              >Time</span
            >
            <button
              type="button"
              class="text-primary focus-visible:ring-ring rounded px-2 py-1.5 text-xs font-medium focus-visible:ring-2 focus-visible:outline-none"
              @click="applyAndClose"
            >
              Done
            </button>
          </div>
          <TimeColumns
            :model-value="timeForColumns"
            :format="timeFormat"
            :use24-hour="use24Hour"
            :minute-step="minuteStep"
            :second-step="secondStep"
            :visible="open"
            :disabled-hours="disabledTimeConfig?.disabledHours"
            :disabled-minutes="disabledTimeConfig?.disabledMinutes"
            :disabled-seconds="disabledTimeConfig?.disabledSeconds"
            @update:model-value="handleTimeUpdate"
          />
        </div>
      </div>

      <!-- Need confirm footer -->
      <div
        v-if="needConfirm"
        class="flex items-center justify-end gap-2 border-t px-3 py-2"
      >
        <button
          type="button"
          class="hover:bg-accent focus-visible:ring-ring rounded px-3 py-1.5 text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
          @click="cancelPreview"
        >
          Cancel
        </button>
        <button
          type="button"
          class="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring rounded px-3 py-1.5 text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
          @click="commitPreview"
        >
          OK
        </button>
      </div>
    </PopoverContent>
  </Popover>
</template>
