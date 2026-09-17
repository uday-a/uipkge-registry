/**
 * ISO-string ↔ native Date helpers shared across the DataTable filter
 * surfaces. The Vue registry leaned on `@internationalized/date`'s
 * CalendarDate because its RangeCalendar (reka-ui) speaks DateValue; the
 * React RangeCalendar wraps react-day-picker, which speaks native `Date`.
 * So instead of pulling `@internationalized/date` into the React tree we
 * keep these two tiny converters local. Column filter values are still
 * stored as `YYYY-MM-DD` ISO strings on the wire, identical to Vue, so
 * server-side payloads match 1:1.
 */
export function isoToDate(str: string | undefined): Date | undefined {
  if (!str) return undefined
  const [y, m, d] = str.split('-').map(Number)
  if (y === undefined || m === undefined || d === undefined) return undefined
  return new Date(y, m - 1, d)
}

export function dateToIso(date: Date | undefined): string {
  if (!date) return ''
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
