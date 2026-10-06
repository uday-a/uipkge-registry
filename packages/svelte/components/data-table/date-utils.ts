import type { DateRange } from '$lib/components/ui/range-calendar'

/**
 * ISO-string ↔ native Date helpers shared across the DataTable filter
 * surfaces. The Svelte RangeCalendar speaks native `Date` (as a
 * `{ start, end }` range), so -- like the React twin -- we keep these tiny
 * converters local instead of pulling `@internationalized/date`. Column
 * filter values are still stored as `YYYY-MM-DD` ISO strings on the wire,
 * identical to Vue/React, so server-side payloads match 1:1.
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

/** `{ from, to }` ISO filter value -> RangeCalendar model (`undefined` when empty). */
export function isoRangeToCalendar(v: { from?: string; to?: string } | undefined): DateRange | undefined {
  if (!v?.from && !v?.to) return undefined
  const from = isoToDate(v.from)
  const to = isoToDate(v.to)
  // The Svelte range model needs a start; an until-only filter anchors on `to`.
  if (!from) return to ? { start: to, end: to } : undefined
  return { start: from, end: to }
}
