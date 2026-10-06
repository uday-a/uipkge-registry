// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiRelativeTimeComponent, formatRelativeTime } from './index'

// RelativeTime, as tables / audit logs use it. If these break, users see: a wrong or frozen
// "5 minutes ago" label, no full date on hover (title), screen readers / scrapers losing the
// machine-readable datetime, naive ISO strings shifting by the viewer's UTC offset, or a
// label that never ticks forward while the page stays open.

const now = new Date('2026-08-14T12:00:00.000Z')

@Component({
  standalone: true,
  imports: [UiRelativeTimeComponent],
  template: `<time
    ui-relative-time
    [date]="date"
    [now]="clock"
    locale="en"
    [formatStyle]="formatStyle"
    [display]="display"
    [timeZone]="timeZone"
    [parseAs]="parseAs"
    [updateInterval]="interval"
    class="text-xs"
  ></time>`,
})
class Host {
  date: Date | string | number = '2026-08-14T11:58:00.000Z'
  clock: Date | undefined = now
  formatStyle: 'long' | 'short' | 'narrow' = 'long'
  display: 'relative' | 'absolute' | 'both' = 'relative'
  timeZone?: string
  parseAs: 'local' | 'utc' = 'local'
  interval = 30_000
}

@Component({
  standalone: true,
  imports: [UiRelativeTimeComponent],
  template: `<time ui-relative-time [date]="d" [now]="n">custom label</time>`,
})
class Projected {
  d = '2026-08-14T11:00:00.000Z'
  n = now
}

function render(init: Partial<Host> = {}) {
  const f = TestBed.createComponent(Host)
  Object.assign(f.componentInstance, init)
  f.detectChanges()
  return { f, el: f.nativeElement.querySelector('time') as HTMLElement }
}

describe('RelativeTime (angular, 8 checks)', () => {
  afterEach(() => vi.useRealTimers())

  it('1: renders the relative label on the <time> host with React classes', () => {
    const { el } = render()
    expect(el.textContent).toBe('2 minutes ago')
    expect(el.className.split(' ').sort()).toEqual(['tabular-nums', 'text-muted-foreground', 'text-xs'])
    expect(el.getAttribute('data-slot')).toBe('relative-time')
  })

  it('2: exposes machine-readable datetime + full-date title + data attrs', () => {
    const { el } = render({ timeZone: 'UTC' })
    expect(el.getAttribute('datetime')).toBe('2026-08-14T11:58:00.000Z')
    expect(el.getAttribute('title')).toMatch(/2026/)
    expect(el.getAttribute('data-display')).toBe('relative')
    expect(el.getAttribute('data-timezone')).toBe('UTC')
    expect(el.getAttribute('data-parse-as')).toBe('local')
  })

  it('3: data-timezone falls back to "local"', () => {
    expect(render().el.getAttribute('data-timezone')).toBe('local')
  })

  it('4: future deltas and formatStyle short', () => {
    expect(render({ date: '2026-08-14T12:20:00.000Z' }).el.textContent).toBe('in 20 minutes')
    expect(render({ date: '2026-08-14T09:00:00.000Z', formatStyle: 'short' }).el.textContent).toBe('3 hr. ago')
  })

  it('5: display=absolute shows the clock in the given zone', () => {
    const { el } = render({ display: 'absolute', timeZone: 'UTC', date: '2026-08-14T15:30:00.000Z' })
    expect(el.textContent).toMatch(/3:30/)
  })

  it('6: parseAs=utc reads naive ISO as UTC', () => {
    const { el } = render({ date: '2026-08-14T12:00:00', parseAs: 'utc' })
    expect(el.getAttribute('datetime')).toBe('2026-08-14T12:00:00.000Z')
  })

  it('7: projected content replaces the label', () => {
    const f = TestBed.createComponent(Projected)
    f.detectChanges()
    expect((f.nativeElement as HTMLElement).querySelector('time')!.textContent).toBe('custom label')
  })

  it('8: without `now` it ticks every updateInterval; formatRelativeTime is exported', async () => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'Date'] })
    vi.setSystemTime(new Date('2026-08-14T12:00:00Z'))
    const { f, el } = render({ clock: undefined, interval: 1000 })
    expect(el.textContent).toBe('2 minutes ago')
    vi.setSystemTime(new Date('2026-08-14T12:10:00Z'))
    vi.advanceTimersByTime(1000)
    f.detectChanges()
    expect(el.textContent).toBe('12 minutes ago')
    expect(typeof formatRelativeTime).toBe('function')
  })

  it('keeps the same fallback instant while `date` is not bound yet', () => {
    // A new Date on every read made [attr.datetime] differ between change-detection passes,
    // which Angular reports as ExpressionChangedAfterItHasBeenChecked in development.
    vi.useFakeTimers()
    try {
      const c = new UiRelativeTimeComponent()
      const first = c.isoString
      vi.advanceTimersByTime(5)
      expect(c.isoString).toBe(first)
    } finally {
      vi.useRealTimers()
    }
  })
})
