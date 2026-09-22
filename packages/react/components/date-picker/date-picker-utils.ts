export type DatePickerType = 'single' | 'multiple' | 'range'
export type DatePickerLayout = 'default' | 'month-and-year' | 'month-only' | 'year-only'
export type DatePickerPicker = 'day' | 'week' | 'month' | 'quarter' | 'year'
export type DatePickerStatus = 'error' | 'warning'
export type DatePickerSize = 'small' | 'middle' | 'large'
export type DatePickerPlacement =
  'top' | 'bottom' | 'left' | 'right' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'

export type FormatValue = 'short' | 'medium' | 'long' | 'full' | Intl.DateTimeFormatOptions

export type SingleValue = string | Date | null
export type MultipleValue = (string | Date)[] | null
export type RangeValue = { start: string | Date; end?: string | Date } | null

export interface DatePickerPreset {
  label: string
  value: SingleValue | MultipleValue | RangeValue
  category?: string
}

export interface DisabledTimeResult {
  disabledHours?: () => number[]
  disabledMinutes?: (selectedHour: number) => number[]
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[]
}

export type TimeShape = { h: number; m: number; s: number }

export type InternalSingle = Date | undefined
export type InternalMultiple = Date[]
export type InternalRange = { start?: Date; end?: Date }

export function coerceDate(v: string | Date | null | undefined): Date | null {
  if (!v) return null
  if (v instanceof Date) return Number.isNaN(v.getTime()) ? null : v
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(v)
  if (m) {
    const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
    return Number.isNaN(d.getTime()) ? null : d
  }
  const dt = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?/.exec(v)
  if (dt) {
    const d = new Date(
      Number(dt[1]),
      Number(dt[2]) - 1,
      Number(dt[3]),
      Number(dt[4]),
      Number(dt[5]),
      dt[6] ? Number(dt[6]) : 0,
    )
    return Number.isNaN(d.getTime()) ? null : d
  }
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? null : d
}

export function toISODate(d: Date): string {
  const y = d.getFullYear()
  const mo = String(d.getMonth() + 1).padStart(2, '0')
  const da = String(d.getDate()).padStart(2, '0')
  return `${y}-${mo}-${da}`
}

export function toISODateTime(d: Date, showSeconds: boolean): string {
  const date = toISODate(d)
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  if (showSeconds) {
    const s = String(d.getSeconds()).padStart(2, '0')
    return `${date}T${h}:${m}:${s}`
  }
  return `${date}T${h}:${m}`
}

export function stripTime(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export function parseTimeShape(value: string, fallback: TimeShape): TimeShape {
  const m = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(value)
  if (!m) return fallback
  return { h: Number(m[1]), m: Number(m[2]), s: m[3] ? Number(m[3]) : 0 }
}

export function withTime(d: Date, t: TimeShape): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), t.h, t.m, t.s)
}

export function weekStart(d: Date, weekStartsOn: number): Date {
  const dayOfWeek = d.getDay()
  const offset = (dayOfWeek - weekStartsOn + 7) % 7
  const out = new Date(d)
  out.setDate(out.getDate() - offset)
  return stripTime(out)
}

export function weekNumber(d: Date): number {
  const jsDate = new Date(d)
  const target = new Date(jsDate.valueOf())
  const dayNr = (jsDate.getDay() + 6) % 7
  target.setDate(target.getDate() - dayNr + 3)
  const firstThursday = target.valueOf()
  target.setMonth(0, 1)
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7))
  }
  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000)
}

export function defaultRangePresets(): DatePickerPreset[] {
  const t = stripTime(new Date())
  const yesterday = new Date(t)
  yesterday.setDate(yesterday.getDate() - 1)
  const last7 = new Date(t)
  last7.setDate(last7.getDate() - 6)
  const last30 = new Date(t)
  last30.setDate(last30.getDate() - 29)
  const monthStart = new Date(t.getFullYear(), t.getMonth(), 1)
  const lastMonthEnd = new Date(t.getFullYear(), t.getMonth(), 0)
  const lastMonthStart = new Date(lastMonthEnd.getFullYear(), lastMonthEnd.getMonth(), 1)
  const ytd = new Date(t.getFullYear(), 0, 1)
  return [
    { label: 'Today', value: { start: t, end: t } },
    { label: 'Yesterday', value: { start: yesterday, end: yesterday } },
    { label: 'Last 7 days', value: { start: last7, end: t } },
    { label: 'Last 30 days', value: { start: last30, end: t } },
    { label: 'This month', value: { start: monthStart, end: t } },
    { label: 'Last month', value: { start: lastMonthStart, end: lastMonthEnd } },
    { label: 'Year to date', value: { start: ytd, end: t } },
  ]
}

export function coerceShape(
  type: DatePickerType,
  v: SingleValue | MultipleValue | RangeValue | undefined,
): InternalSingle | InternalMultiple | InternalRange | undefined {
  if (type === 'multiple') {
    if (!Array.isArray(v)) return undefined
    return v.map(coerceDate).filter((x): x is Date => x != null)
  }
  if (type === 'range') {
    if (!v || Array.isArray(v) || typeof v === 'string' || !('start' in (v as object))) return undefined
    const r = v as { start: string | Date; end?: string | Date }
    const start = coerceDate(r.start)
    const end = r.end ? coerceDate(r.end) : undefined
    if (!start) return undefined
    return end ? { start, end } : { start }
  }
  return coerceDate(v as SingleValue) ?? undefined
}

export function fmtDate(d: Date, locale: string, format: FormatValue) {
  const opts: Intl.DateTimeFormatOptions = typeof format === 'object' ? format : { dateStyle: format }
  return new Intl.DateTimeFormat(locale, opts).format(d)
}

export function fmtMonth(d: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(d)
}

export function fmtTime(d: Date, showSeconds: boolean, use24Hour: boolean) {
  const opts: Intl.DateTimeFormatOptions = showSeconds
    ? { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: !use24Hour }
    : { hour: '2-digit', minute: '2-digit', hour12: !use24Hour }
  return new Intl.DateTimeFormat(undefined, opts).format(d)
}
