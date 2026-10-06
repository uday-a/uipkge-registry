// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest'
import { Component, provideZonelessChangeDetection, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiRangeCalendarComponent, type DateRange } from './range-calendar.component'

// React RangeCalendar parity (react-day-picker mode="range"). If these break, users see:
// the second click not closing the range (or a click before the start not flipping it),
// no primary fill on the range ends / accent fill between them, dates outside the
// min / max window still selectable (or navigable into), month height jumping with
// fixedWeeks, and weeks starting on the wrong day.

const tick = (ms = 0) => new Promise((r) => setTimeout(r, ms))

@Component({
  standalone: true,
  imports: [UiRangeCalendarComponent],
  template: `
    <ui-range-calendar
      [selected]="range()"
      (select)="changes.push($any($event)); range.set($any($event))"
      [defaultMonth]="defaultMonth"
      [disabled]="disabled()"
      [startMonth]="startMonth()"
      [endMonth]="endMonth()"
      [fixedWeeks]="fixedWeeks()"
      [weekStartsOn]="weekStartsOn()"
    />
  `,
})
class Host {
  readonly range = signal<DateRange | undefined>(undefined)
  readonly disabled = signal<{ before: Date; after: Date } | undefined>(undefined)
  readonly startMonth = signal<Date | undefined>(undefined)
  readonly endMonth = signal<Date | undefined>(undefined)
  readonly fixedWeeks = signal(false)
  readonly weekStartsOn = signal<0 | 1>(0)
  readonly defaultMonth = new Date(2026, 4, 1)
  changes: (DateRange | undefined)[] = []
}

async function setup(init: (h: Host) => void = () => {}) {
  TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] })
  const fixture = TestBed.createComponent(Host)
  init(fixture.componentInstance)
  document.body.appendChild(fixture.nativeElement)
  fixture.detectChanges()
  await fixture.whenStable()
  const root = () => fixture.nativeElement.querySelector('[data-slot="range-calendar"]') as HTMLElement
  const cell = (iso: string) => root().querySelector<HTMLElement>(`td[data-day="${iso}"]:not([data-outside])`)!
  const btn = (iso: string) => cell(iso).querySelector('button')!
  const settle = async () => {
    fixture.detectChanges()
    await tick()
    await fixture.whenStable()
  }
  return { host: fixture.componentInstance, root, cell, btn, settle }
}

const day = (r: DateRange | undefined) => [r?.from?.getDate(), r?.to?.getDate()]

describe('RangeCalendar (angular, 7 checks)', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('1: always range mode: data-mode="range", aria-multiselectable grid, React nav buttons', async () => {
    const { root } = await setup()
    expect(root().getAttribute('data-mode')).toBe('range')
    expect(root().querySelector('table')!.getAttribute('aria-multiselectable')).toBe('true')
    expect(root().querySelector('nav')!.className).toContain('inset-x-1')
    expect(root().querySelector('nav button')!.className).toContain('size-7')
  })

  it('2: first click starts the range, second click closes it', async () => {
    const { host, btn, settle } = await setup()
    btn('2026-05-10').click()
    await settle()
    expect(day(host.changes[0])).toEqual([10, 10])
    btn('2026-05-17').click()
    await settle()
    expect(day(host.changes[1])).toEqual([10, 17])
  })

  it('3: ends get range_start / range_end (primary fill), days between get range_middle', async () => {
    const { cell } = await setup((h) => h.range.set({ from: new Date(2026, 4, 10), to: new Date(2026, 4, 17) }))
    expect(cell('2026-05-10').className).toContain('day-range-start')
    expect(cell('2026-05-10').className).toContain('[&>button]:bg-primary')
    expect(cell('2026-05-17').className).toContain('day-range-end')
    expect(cell('2026-05-13').className).toContain('aria-selected:bg-accent')
    expect(cell('2026-05-13').getAttribute('aria-selected')).toBe('true')
    expect(cell('2026-05-18').hasAttribute('aria-selected')).toBe(false)
  })

  it('4: clicking before the start extends the range backwards', async () => {
    const { host, btn, settle } = await setup((h) =>
      h.range.set({ from: new Date(2026, 4, 10), to: new Date(2026, 4, 17) }),
    )
    btn('2026-05-05').click()
    await settle()
    expect(day(host.changes[0])).toEqual([5, 17])
  })

  it('5: a min / max interval disables outside days; startMonth hides earlier days and locks prev', async () => {
    const { host, root, btn, settle } = await setup((h) => {
      h.disabled.set({ before: new Date(2026, 4, 8), after: new Date(2026, 4, 20) })
      h.startMonth.set(new Date(2026, 4, 8))
      h.endMonth.set(new Date(2026, 4, 20))
    })
    expect(btn('2026-05-07').disabled).toBe(true)
    expect(btn('2026-05-21').disabled).toBe(true)
    expect(btn('2026-05-12').disabled).toBe(false)
    const lead = root().querySelector<HTMLElement>('td[data-day="2026-04-30"]')!
    expect(lead.getAttribute('data-hidden')).toBe('true')
    expect(lead.className).toContain('invisible')
    expect(lead.querySelector('button')).toBeNull()
    expect(root().querySelector('nav button')!.getAttribute('aria-disabled')).toBe('true')
    btn('2026-05-07').click()
    await settle()
    expect(host.changes).toEqual([])
  })

  it('6: fixedWeeks always renders 6 weeks', async () => {
    const { root } = await setup((h) => h.fixedWeeks.set(true))
    expect(root().querySelectorAll('tbody tr').length).toBe(6)
  })

  it('7: weekStartsOn=1 starts weeks on Monday', async () => {
    const { root } = await setup((h) => h.weekStartsOn.set(1))
    expect(root().querySelector('th')!.getAttribute('aria-label')).toBe('Monday')
    expect(root().querySelector('tbody td')!.getAttribute('data-day')).toBe('2026-04-27')
  })
})
