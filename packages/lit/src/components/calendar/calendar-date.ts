/**
 * Local-date helpers for <uip-calendar> — the subset of date-fns / react-day-picker's
 * DateLib the React Calendar relies on, on native Date (local time, no deps).
 */

export interface DateRange {
  from?: Date
  to?: Date
}

/** react-day-picker's Matcher union. */
export type Matcher =
  | boolean
  | Date
  | Date[]
  | DateRange
  | { dayOfWeek: number | number[] }
  | { before: Date; after: Date }
  | { before: Date }
  | { after: Date }
  | ((date: Date) => boolean)

export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
export const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1)
export const endOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0)
export const startOfYear = (d: Date) => new Date(d.getFullYear(), 0, 1)
export const endOfYear = (d: Date) => new Date(d.getFullYear(), 11, 31)
export const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
export const addWeeks = (d: Date, n: number) => addDays(d, n * 7)
/** date-fns semantics: the day is clamped to the target month's length. */
export function addMonths(d: Date, n: number) {
  const target = new Date(d.getFullYear(), d.getMonth() + n, 1)
  const last = endOfMonth(target).getDate()
  return new Date(target.getFullYear(), target.getMonth(), Math.min(d.getDate(), last))
}
export const addYears = (d: Date, n: number) => addMonths(d, n * 12)
export const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
export const isSameMonth = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
export const differenceInCalendarDays = (a: Date, b: Date) =>
  Math.round((startOfDay(a).getTime() - startOfDay(b).getTime()) / 86_400_000)
export const differenceInCalendarMonths = (a: Date, b: Date) =>
  (a.getFullYear() - b.getFullYear()) * 12 + (a.getMonth() - b.getMonth())
export function startOfWeek(d: Date, weekStartsOn: number) {
  const diff = (d.getDay() - weekStartsOn + 7) % 7
  return addDays(d, -diff)
}
export const endOfWeek = (d: Date, weekStartsOn: number) => addDays(startOfWeek(d, weekStartsOn), 6)

const pad = (n: number) => String(n).padStart(2, '0')
/** `yyyy-MM-dd` (react-day-picker's `data-day`). */
export const isoDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
/** `yyyy-MM` (react-day-picker's `data-month`). */
export const isoMonth = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}`

/** Date, `yyyy-MM-dd` (read as a LOCAL date, not UTC midnight) or any Date-parsable string. */
export function toDate(v: unknown): Date | undefined {
  if (v == null || v === '') return undefined
  if (v instanceof Date) return isNaN(v.getTime()) ? undefined : startOfDay(v)
  if (typeof v === 'number') return startOfDay(new Date(v))
  if (typeof v === 'string') {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v.trim())
    if (m) return new Date(+m[1], +m[2] - 1, +m[3])
    const d = new Date(v)
    return isNaN(d.getTime()) ? undefined : startOfDay(d)
  }
  return undefined
}

export function rangeIncludesDate(range: DateRange, date: Date, excludeEnds = false) {
  let { from, to } = range
  if (from && to) {
    if (differenceInCalendarDays(to, from) < 0) [from, to] = [to, from]
    const e = excludeEnds ? 1 : 0
    return differenceInCalendarDays(date, from) >= e && differenceInCalendarDays(to, date) >= e
  }
  if (!excludeEnds && to) return isSameDay(to, date)
  if (!excludeEnds && from) return isSameDay(from, date)
  return false
}

/** react-day-picker's `dateMatchModifiers`. */
export function matches(date: Date, matchers: Matcher | Matcher[] | undefined): boolean {
  if (matchers === undefined) return false
  const list = Array.isArray(matchers) && !matchers.every((m) => m instanceof Date) ? matchers : [matchers as Matcher]
  return list.some((m) => {
    if (typeof m === 'boolean') return m
    if (m instanceof Date) return isSameDay(date, m)
    if (Array.isArray(m)) return m.some((d) => isSameDay(date, d))
    if (typeof m === 'function') return m(date)
    if (!m || typeof m !== 'object') return false
    if ('from' in m || 'to' in m) return rangeIncludesDate(m as DateRange, date)
    if ('dayOfWeek' in m) {
      const dow = m.dayOfWeek
      return Array.isArray(dow) ? dow.includes(date.getDay()) : dow === date.getDay()
    }
    const before = 'before' in m ? m.before : undefined
    const after = 'after' in m ? m.after : undefined
    if (before && after) {
      const isDayBefore = differenceInCalendarDays(before, date) > 0
      const isDayAfter = differenceInCalendarDays(after, date) < 0
      return differenceInCalendarDays(before, after) > 0 ? isDayAfter && isDayBefore : isDayBefore || isDayAfter
    }
    if (after) return differenceInCalendarDays(date, after) > 0
    if (before) return differenceInCalendarDays(before, date) > 0
    return false
  })
}

const isoRe = /^\d{4}-\d{2}-\d{2}/
function revive(v: unknown): unknown {
  if (typeof v === 'string' && isoRe.test(v)) return toDate(v)
  if (Array.isArray(v)) return v.map(revive)
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, revive(x)]))
  return v
}

/**
 * Attribute form of react-day-picker's `modifiers` prop: a JSON object mapping
 * custom names to matchers, with ISO date strings (`{"booked":["2026-09-21"],
 * "weekend":{"dayOfWeek":[0,6]}}`). Anything else → undefined.
 */
export function parseModifiersMap(value: string | null): Record<string, Matcher | Matcher[]> | undefined {
  if (value === null) return undefined
  const v = value.trim()
  if (v === '' || v === 'false') return undefined
  try {
    const obj = revive(JSON.parse(v))
    if (obj && typeof obj === 'object' && !Array.isArray(obj)) return obj as Record<string, Matcher | Matcher[]>
  } catch {
    /* not JSON */
  }
  return undefined
}

/**
 * Attribute form of a Matcher: empty/`true` → every day; JSON with ISO date
 * strings (`{"dayOfWeek":[0,6]}`, `[{"before":"2026-09-21"}]`); or a
 * comma/space-separated list of `yyyy-MM-dd` dates.
 */
export function parseMatcher(value: string | null): Matcher | Matcher[] | undefined {
  if (value === null) return undefined
  const v = value.trim()
  if (v === '' || v === 'true') return true
  if (v === 'false') return undefined
  if (v.startsWith('{') || v.startsWith('[')) {
    try {
      return revive(JSON.parse(v)) as Matcher | Matcher[]
    } catch {
      return undefined
    }
  }
  return v
    .split(/[\s,]+/)
    .map(toDate)
    .filter((d): d is Date => !!d)
}

/**
 * date-fns `getWeek` port (what react-day-picker's week numbers use):
 * weekStartsOn-aware with firstWeekContainsDate = 1 (the date-fns default).
 * RDP's `ISOWeek` opt-in is not supported — ISO behaviour is approximated by
 * `week-starts-on="1"` (the year-boundary rule still differs: ISO counts the
 * week with the first Thursday as week 1).
 */
export function getWeekNumber(d: Date, weekStartsOn: number): number {
  const diff = startOfWeek(d, weekStartsOn).getTime() - startOfWeekYear(d, weekStartsOn).getTime()
  // Round: a week is not a constant number of ms across a DST shift.
  return Math.round(diff / 604_800_000) + 1
}

/** date-fns `getWeekYear` port: the week-numbering year a date belongs to. */
function getWeekYear(d: Date, weekStartsOn: number): number {
  const year = d.getFullYear()
  const startOfNextYear = startOfWeek(new Date(year + 1, 0, 1), weekStartsOn)
  const startOfThisYear = startOfWeek(new Date(year, 0, 1), weekStartsOn)
  if (d.getTime() >= startOfNextYear.getTime()) return year + 1
  if (d.getTime() >= startOfThisYear.getTime()) return year
  return year - 1
}

/** date-fns `startOfWeekYear` port. */
function startOfWeekYear(d: Date, weekStartsOn: number): Date {
  return startOfWeek(new Date(getWeekYear(d, weekStartsOn), 0, 1), weekStartsOn)
}

/** First day of week for a locale: Intl week info when available, Sunday otherwise. */
export function localeWeekStart(locale: string): number {
  try {
    const loc = new Intl.Locale(locale) as Intl.Locale & {
      getWeekInfo?: () => { firstDay: number }
      weekInfo?: { firstDay: number }
    }
    const info = loc.getWeekInfo?.() ?? loc.weekInfo
    if (info) return info.firstDay % 7
  } catch {
    /* unknown locale */
  }
  return 0
}

/** Locales react-day-picker renders year-first ("2026年5月"). */
const yearFirst = new Set(['eu', 'hu', 'ja', 'ja-Hira', 'ja-JP', 'ko', 'ko-KR', 'lt', 'lt-LT', 'lv', 'lv-LV', 'mn', 'mn-MN', 'zh', 'zh-CN', 'zh-HK', 'zh-TW'])
export const isYearFirst = (locale: string) => yearFirst.has(locale)

const ordinal = (n: number) => {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

/** date-fns `PPPP` (react-day-picker's day/gridcell label). */
export function formatFull(d: Date, locale: string) {
  if (locale.startsWith('en')) {
    const weekday = d.toLocaleDateString(locale, { weekday: 'long' })
    const month = d.toLocaleDateString(locale, { month: 'long' })
    return `${weekday}, ${month} ${ordinal(d.getDate())}, ${d.getFullYear()}`
  }
  return new Intl.DateTimeFormat(locale, { dateStyle: 'full' }).format(d)
}

/** `LLLL y` / year-first (react-day-picker's caption + grid label). */
export const formatMonthYear = (d: Date, locale: string) =>
  new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(d)
