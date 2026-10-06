<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  /** Selected range. `end` is undefined while the user has only picked the start. */
  export interface DateRange {
    start: Date
    end: Date | undefined
  }

  /**
   * React DayPicker-shaped range (`{ from, to }`) for the `selected`/`onSelect`
   * aliases. Converts to/from the internal `{ start, end }` shape. Both use
   * native `Date`, so conversion is a key rename plus midnight normalization.
   */
  export interface ReactDateRange {
    from: Date | undefined
    to?: Date | undefined
  }

  export interface CalendarDay {
    date: Date
    /** `y-m-d` key for focus management. */
    key: string
    dayNumber: number
    outsideView: boolean
    today: boolean
    disabled: boolean
    unavailable: boolean
    selected: boolean
    selectionStart: boolean
    selectionEnd: boolean
    highlighted: boolean
    tabbable: boolean
  }

  export interface CalendarMonth {
    key: string
    label: string
    weeks: CalendarDay[][]
  }

  /** Context shared with the range-calendar parts. Getters stay reactive in children. */
  export interface RangeCalendarContext {
    readonly months: CalendarMonth[]
    readonly weekDays: string[]
    readonly headingValue: string
    readonly disabled: boolean
    readonly readonly: boolean
    readonly canPrev: boolean
    readonly canNext: boolean
    select: (day: CalendarDay) => void
    hover: (day: CalendarDay | null) => void
    prev: () => void
    next: () => void
    focusDay: (fromKey: string, deltaDays: number) => void
    focusMonthStep: (fromKey: string, months: number) => void
    weekEdge: (fromKey: string, toStart: boolean) => void
  }

  // Omit `children`: the snippet carries months/weekDays, which narrows the base `Snippet` type.
  export interface RangeCalendarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    /** The controlled range. Bindable. When both `value` and `selected` are set, `value` wins. */
    value?: DateRange | undefined
    /** Initial range for uncontrolled use. */
    defaultValue?: DateRange | undefined
    /** Called with the new range after every commit. */
    onValueChange?: (value: DateRange) => void
    /**
     * React DayPicker-parity alias for `value`. Accepts `{ from, to }` and
     * converts to internal `{ start, end }`. Bindable. Stays in sync with
     * `value`: user selection updates both, and external updates to either
     * sync the other.
     */
    selected?: ReactDateRange | undefined
    /** React-parity alias for `onValueChange`. Fires with `{ from, to }` alongside `onValueChange`. */
    onSelect?: (range: ReactDateRange | undefined) => void
    /** Earliest selectable date. */
    minValue?: Date
    /** Latest selectable date. */
    maxValue?: Date
    /** When `true`, prevents the user from interacting with the calendar. */
    disabled?: boolean
    /** When `true`, dates cannot be selected but the calendar stays focusable. */
    readonly?: boolean
    /** Always render 6 week rows so the height never shifts month-to-month. */
    fixedWeeks?: boolean
    /** First day of the week: 0 = Sunday … 6 = Saturday. */
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
    /** How many months to render side by side. */
    numberOfMonths?: number
    /** BCP 47 locale for month and weekday names. Defaults to the runtime locale. */
    locale?: string
    /** Initial visible month. Defaults to the start of `value`/`defaultValue`, else today. */
    defaultPlaceholder?: Date
    /** Extra predicate to disable individual dates. */
    isDateDisabled?: (date: Date) => boolean
    /** Extra predicate to mark individual dates unavailable. */
    isDateUnavailable?: (date: Date) => boolean
    children?: Snippet<[{ months: CalendarMonth[]; weekDays: string[] }]>
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { setContext, tick } from 'svelte'
  import { cn } from '$lib/utils'
  import RangeCalendarCell from './RangeCalendarCell.svelte'
  import RangeCalendarCellTrigger from './RangeCalendarCellTrigger.svelte'
  import RangeCalendarGrid from './RangeCalendarGrid.svelte'
  import RangeCalendarGridBody from './RangeCalendarGridBody.svelte'
  import RangeCalendarGridHead from './RangeCalendarGridHead.svelte'
  import RangeCalendarGridRow from './RangeCalendarGridRow.svelte'
  import RangeCalendarHeadCell from './RangeCalendarHeadCell.svelte'
  import RangeCalendarHeader from './RangeCalendarHeader.svelte'
  import RangeCalendarHeading from './RangeCalendarHeading.svelte'
  import RangeCalendarNextButton from './RangeCalendarNextButton.svelte'
  import RangeCalendarPrevButton from './RangeCalendarPrevButton.svelte'

  let {
    class: className,
    value = $bindable(),
    defaultValue = undefined,
    onValueChange,
    selected = $bindable(),
    onSelect,
    minValue = undefined,
    maxValue = undefined,
    disabled = false,
    readonly = false,
    fixedWeeks = false,
    weekStartsOn = 0,
    numberOfMonths = 1,
    locale = undefined,
    defaultPlaceholder = undefined,
    isDateDisabled = undefined,
    isDateUnavailable = undefined,
    children,
    ref = $bindable(null),
    ...restProps
  }: RangeCalendarProps = $props()

  function atMidnight(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate())
  }

  function fromSelected(s: ReactDateRange | undefined): DateRange | undefined {
    if (!s?.from) return undefined
    return { start: atMidnight(s.from), end: s.to ? atMidnight(s.to) : undefined }
  }

  function toSelected(r: DateRange | undefined): ReactDateRange | undefined {
    if (!r) return undefined
    return { from: r.start, to: r.end }
  }

  function sameRange(a: DateRange | undefined, b: DateRange | undefined): boolean {
    if (a == null || b == null) return a == null && b == null
    return sameDay(a.start, b.start) && (a.end == null || b.end == null ? a.end == b.end : sameDay(a.end, b.end))
  }

  function sameSelected(a: ReactDateRange | undefined, b: ReactDateRange | undefined): boolean {
    if (a == null || b == null) return a == null && b == null
    const fromSame = a.from == null || b.from == null ? a.from == b.from : sameDay(a.from, b.from)
    const toSame = a.to == null || b.to == null ? a.to == b.to : sameDay(a.to, b.to)
    return fromSame && toSame
  }

  function dayKey(d: Date): string {
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
  }

  function sameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  }

  function compareDay(a: Date, b: Date): number {
    const t = atMidnight(a).getTime() - atMidnight(b).getTime()
    return t === 0 ? 0 : t < 0 ? -1 : 1
  }

  let root: HTMLDivElement | null = null
  // Uncontrolled seed: initial `value`/`selected` win over `defaultValue` so a
  // pre-selected controlled range shows its month on mount.
  // svelte-ignore state_referenced_locally
  let internal = $state<DateRange | undefined>(value ?? fromSelected(selected) ?? defaultValue)
  let hoverKey = $state<string | null>(null)

  // `value` wins when both aliases are set; `selected` converts `{ from, to }`.
  const current = $derived(value ?? fromSelected(selected) ?? internal)

  // Keep `value`/`selected` mirrors in sync on external updates (user selection
  // syncs via `commit` below). Last-write-wins, with `value` winning when both
  // change together. Guards prevent loops with `commit` (which updates all
  // three together, detected as already-in-sync with `internal`).
  let prevValue: DateRange | undefined = value
  let prevSelected: ReactDateRange | undefined = selected
  let didInitSync = false
  $effect(() => {
    const v = value
    const s = selected
    if (!didInitSync) {
      didInitSync = true
      prevValue = v
      prevSelected = s
      if (v !== undefined && s === undefined) {
        const toSel = toSelected(v)
        selected = toSel
        prevSelected = toSel
      } else if (s !== undefined && v === undefined) {
        const conv = fromSelected(s)
        value = conv
        prevValue = conv
      } else if (v !== undefined && s !== undefined) {
        if (!sameRange(v, fromSelected(s))) {
          const toSel = toSelected(v)
          selected = toSel
          prevSelected = toSel
        }
      }
      return
    }
    const vChanged = !sameRange(v, prevValue)
    const sChanged = !sameSelected(s, prevSelected)
    if (!vChanged && !sChanged) return
    if (vChanged && sChanged) {
      if (sameRange(v, internal) && sameSelected(s, toSelected(v))) {
        prevValue = v
        prevSelected = s
        return
      }
      if (v !== undefined) {
        internal = v
        const toSel = toSelected(v)
        if (!sameSelected(s, toSel)) selected = toSel
        prevValue = v
        prevSelected = toSel
      } else if (s !== undefined) {
        internal = fromSelected(s)
        prevValue = v
        prevSelected = s
      } else {
        internal = undefined
        prevValue = undefined
        prevSelected = undefined
      }
    } else if (vChanged) {
      internal = v
      const toSel = toSelected(v)
      if (!sameSelected(s, toSel)) selected = toSel
      prevValue = v
      prevSelected = toSel
    } else {
      const conv = fromSelected(s)
      internal = conv
      if (!sameRange(v, conv)) value = conv
      prevValue = conv
      prevSelected = s
    }
  })

  // Visible month (first of the rendered run). Seeded from the placeholder,
  // else the range start, else today — so a pre-selected value shows its month.
  function initialVisible(): { y: number; m: number } {
    const seed = defaultPlaceholder ?? current?.start ?? new Date()
    return { y: seed.getFullYear(), m: seed.getMonth() }
  }
  // Uncontrolled seed: intentionally the initial placeholder/value only.
  // svelte-ignore state_referenced_locally
  let visible = $state(initialVisible())

  $effect(() => {
    ref = root
  })

  const today = $derived.by(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), now.getDate())
  })

  function isOutOfBounds(d: Date): boolean {
    if (minValue && compareDay(d, minValue) < 0) return true
    if (maxValue && compareDay(d, maxValue) > 0) return true
    return false
  }

  const months = $derived.by((): CalendarMonth[] => {
    const labelFmt = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' })
    const range = current
    const start = range?.start ? atMidnight(range.start) : null
    const end = range?.end ? atMidnight(range.end) : null
    const hoverDate = hoverKey
      ? (() => {
          const [y, m, d] = hoverKey.split('-').map(Number)
          return new Date(y!, m!, d!)
        })()
      : null
    const inProgress = start && !end && hoverDate && !sameDay(start, hoverDate)

    const out: CalendarMonth[] = []
    for (let i = 0; i < Math.max(1, numberOfMonths); i++) {
      const first = new Date(visible.y, visible.m + i, 1)
      const y = first.getFullYear()
      const m = first.getMonth()
      const dim = new Date(y, m + 1, 0).getDate()
      const leading = (first.getDay() - weekStartsOn + 7) % 7
      let total = leading + dim
      const trailing = (7 - (total % 7)) % 7
      total += trailing
      if (fixedWeeks) total = 42

      const days: CalendarDay[] = []
      for (let c = 0; c < total; c++) {
        const date = new Date(y, m, 1 - leading + c)
        const key = dayKey(date)
        const outsideView = date.getMonth() !== m
        const isToday = sameDay(date, today)
        const isDisabled = disabled || isOutOfBounds(date) || (isDateDisabled?.(date) ?? false)
        const isUnavailable = isDateUnavailable?.(date) ?? false
        const geStart = start ? compareDay(date, start) >= 0 : false
        const leEnd = end ? compareDay(date, end) <= 0 : false
        const isStart = start ? sameDay(date, start) : false
        const isEnd = end ? sameDay(date, end) : false
        const isSelected = end ? geStart && leEnd : isStart
        let highlighted = false
        if (inProgress && start && hoverDate) {
          const lo = compareDay(start, hoverDate) <= 0 ? start : hoverDate
          const hi = lo === start ? hoverDate : start
          highlighted = compareDay(date, lo) > 0 && compareDay(date, hi) < 0
        }
        days.push({
          date,
          key,
          dayNumber: date.getDate(),
          outsideView,
          today: isToday,
          disabled: isDisabled,
          unavailable: isUnavailable,
          selected: isSelected,
          selectionStart: isStart,
          selectionEnd: isEnd,
          highlighted,
          tabbable: false,
        })
      }
      const weeks: CalendarDay[][] = []
      for (let w = 0; w < days.length; w += 7) weeks.push(days.slice(w, w + 7))
      out.push({ key: `${y}-${m}`, label: labelFmt.format(first), weeks })
    }

    // One tabbable day across the whole run: range start, else today, else first enabled day.
    const flat = out.flatMap((mo) => mo.weeks.flat())
    const pick =
      (start && flat.find((d) => sameDay(d.date, start) && !d.disabled)) ||
      flat.find((d) => d.today && !d.disabled) ||
      flat.find((d) => !d.disabled && !d.outsideView) ||
      flat.find((d) => !d.disabled)
    if (pick) pick.tabbable = true
    return out
  })

  const weekDays = $derived.by(() => {
    const fmt = new Intl.DateTimeFormat(locale, { weekday: 'narrow' })
    // 2024-01-07 was a Sunday; walk a full week from there.
    const names = Array.from({ length: 7 }, (_, i) => fmt.format(new Date(2024, 0, 7 + i)))
    return [...names.slice(weekStartsOn), ...names.slice(0, weekStartsOn)]
  })

  const headingValue = $derived(months.map((mo) => mo.label).join(' – '))

  const canPrev = $derived.by(() => {
    if (!minValue) return true
    const first = new Date(visible.y, visible.m, 1)
    const minMonth = new Date(minValue.getFullYear(), minValue.getMonth(), 1)
    return first > minMonth
  })

  const canNext = $derived.by(() => {
    if (!maxValue) return true
    const count = Math.max(1, numberOfMonths)
    const last = new Date(visible.y, visible.m + count - 1, 1)
    const maxMonth = new Date(maxValue.getFullYear(), maxValue.getMonth(), 1)
    return last < maxMonth
  })

  function commit(next: DateRange) {
    internal = next
    value = next
    const sel = toSelected(next)
    selected = sel
    onValueChange?.(next)
    onSelect?.(sel)
  }

  function select(day: CalendarDay) {
    if (disabled || readonly || day.disabled || day.unavailable) return
    const d = atMidnight(day.date)
    const range = current
    if (!range?.start || range.end) {
      commit({ start: d, end: undefined })
    } else if (compareDay(d, range.start) < 0) {
      commit({ start: d, end: atMidnight(range.start) })
    } else {
      commit({ start: atMidnight(range.start), end: d })
    }
  }

  function hover(day: CalendarDay | null) {
    hoverKey = day ? day.key : null
  }

  function prev() {
    if (!canPrev) return
    const d = new Date(visible.y, visible.m - 1, 1)
    visible = { y: d.getFullYear(), m: d.getMonth() }
  }

  function next() {
    if (!canNext) return
    const d = new Date(visible.y, visible.m + 1, 1)
    visible = { y: d.getFullYear(), m: d.getMonth() }
  }

  function focusKey(key: string) {
    const target = root?.querySelector<HTMLButtonElement>(`[data-day="${key}"]`)
    target?.focus()
  }

  function parseKey(key: string): Date {
    const [y, m, d] = key.split('-').map(Number)
    return new Date(y!, m!, d!)
  }

  /** Move focus by whole days, shifting the visible window when leaving it. */
  function focusDay(fromKey: string, deltaDays: number) {
    const target = parseKey(fromKey)
    target.setDate(target.getDate() + deltaDays)
    const count = Math.max(1, numberOfMonths)
    const firstVisible = new Date(visible.y, visible.m, 1)
    const lastVisible = new Date(visible.y, visible.m + count, 0)
    if (compareDay(target, firstVisible) < 0) {
      visible = { y: target.getFullYear(), m: target.getMonth() }
      tick().then(() => focusKey(dayKey(target)))
    } else if (compareDay(target, lastVisible) > 0) {
      visible = { y: target.getFullYear(), m: target.getMonth() - count + 1 }
      tick().then(() => focusKey(dayKey(target)))
    } else {
      focusKey(dayKey(target))
    }
  }

  /** Move focus by whole months (PageUp/PageDown), clamping the day number. */
  function focusMonthStep(fromKey: string, step: number) {
    const from = parseKey(fromKey)
    const target = new Date(from.getFullYear(), from.getMonth() + step, 1)
    const dim = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate()
    target.setDate(Math.min(from.getDate(), dim))
    visible = { y: target.getFullYear(), m: target.getMonth() }
    tick().then(() => focusKey(dayKey(target)))
  }

  /** Move focus to the start/end of the focused week row (Home/End). */
  function weekEdge(fromKey: string, toStart: boolean) {
    const from = parseKey(fromKey)
    const offset = (from.getDay() - weekStartsOn + 7) % 7
    focusDay(fromKey, toStart ? -offset : 6 - offset)
  }

  setContext<RangeCalendarContext>('rangeCalendar', {
    get months() {
      return months
    },
    get weekDays() {
      return weekDays
    },
    get headingValue() {
      return headingValue
    },
    get disabled() {
      return disabled
    },
    get readonly() {
      return readonly
    },
    get canPrev() {
      return canPrev
    },
    get canNext() {
      return canNext
    },
    select,
    hover,
    prev,
    next,
    focusDay,
    focusMonthStep,
    weekEdge,
  })
</script>

<div
  bind:this={root}
  data-uipkge=""
  data-slot="range-calendar"
  data-disabled={disabled || undefined}
  class={cn('p-3', className)}
  {...restProps}
>
  <RangeCalendarHeader>
    <RangeCalendarHeading />

    <div class="flex items-center gap-1">
      <RangeCalendarPrevButton />
      <RangeCalendarNextButton />
    </div>
  </RangeCalendarHeader>

  <div class="mt-4 flex flex-col gap-y-4 sm:flex-row sm:gap-x-4 sm:gap-y-0">
    {#each months as month (month.key)}
      <RangeCalendarGrid label={month.label}>
        <RangeCalendarGridHead>
          <RangeCalendarGridRow>
            {#each weekDays as day, di (di)}
              <RangeCalendarHeadCell>
                {day}
              </RangeCalendarHeadCell>
            {/each}
          </RangeCalendarGridRow>
        </RangeCalendarGridHead>
        <RangeCalendarGridBody>
          {#each month.weeks as week, index (index)}
            <RangeCalendarGridRow class="mt-2 w-full">
              {#each week as weekDate (weekDate.key)}
                <RangeCalendarCell>
                  <RangeCalendarCellTrigger day={weekDate} />
                </RangeCalendarCell>
              {/each}
            </RangeCalendarGridRow>
          {/each}
        </RangeCalendarGridBody>
      </RangeCalendarGrid>
    {/each}
  </div>

  {@render children?.({ months, weekDays })}
</div>
