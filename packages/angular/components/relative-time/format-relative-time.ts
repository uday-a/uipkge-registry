export type RelativeTimeStyle = 'long' | 'short' | 'narrow'
export type RelativeTimeNumeric = 'always' | 'auto'
export type RelativeTimeParseAs = 'local' | 'utc'
export type RelativeTimeDisplay = 'relative' | 'absolute' | 'both'

const DIVISIONS: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
  { amount: 60, unit: 'second' },
  { amount: 60, unit: 'minute' },
  { amount: 24, unit: 'hour' },
  { amount: 7, unit: 'day' },
  { amount: 4.34524, unit: 'week' },
  { amount: 12, unit: 'month' },
  { amount: Number.POSITIVE_INFINITY, unit: 'year' },
]

const NAIVE_ISO = /^(\d{4}-\d{2}-\d{2})(?:T(\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?))?$/

export function toDate(value: Date | string | number, parseAs: RelativeTimeParseAs = 'local'): Date {
  if (value instanceof Date) return value
  if (typeof value === 'number') return new Date(value)
  if (parseAs === 'utc') {
    const naive = value.match(NAIVE_ISO)
    if (naive) return new Date(`${naive[1]}T${naive[2] ?? '00:00:00.000'}Z`)
  }
  return new Date(value)
}

export function formatRelativeTime(
  date: Date,
  now: Date,
  options?: { style?: RelativeTimeStyle; numeric?: RelativeTimeNumeric; locale?: string },
): string {
  const rtf = new Intl.RelativeTimeFormat(options?.locale, {
    numeric: options?.numeric ?? 'auto',
    style: options?.style ?? 'long',
  })
  let duration = (date.getTime() - now.getTime()) / 1000
  for (const division of DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return rtf.format(Math.round(duration), division.unit)
    }
    duration /= division.amount
  }
  return rtf.format(0, 'second')
}

export function formatAbsoluteTime(date: Date, locale?: string, timeZone?: string): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone,
  }).format(date)
}

export function formatVisibleTime(
  date: Date,
  now: Date,
  options?: {
    display?: RelativeTimeDisplay
    style?: RelativeTimeStyle
    numeric?: RelativeTimeNumeric
    locale?: string
    timeZone?: string
  },
): string {
  const relative = formatRelativeTime(date, now, options)
  if ((options?.display ?? 'relative') === 'relative') return relative
  const absolute = formatAbsoluteTime(date, options?.locale, options?.timeZone)
  if (options?.display === 'absolute') return absolute
  return `${relative} · ${absolute}`
}
