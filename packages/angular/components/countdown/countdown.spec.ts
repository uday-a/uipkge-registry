// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest'
import { Component, provideZonelessChangeDetection, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiCountdownComponent } from './countdown.component'

// React Countdown parity. If these break, users see: a frozen timer (the old port had no
// interval), wrong totals in compact formats (HH:MM:SS must roll days into hours), finish
// never firing (or firing every tick), a paused timer that keeps ticking, custom unit tiles
// ignored, or screen readers announcing every second after the countdown ended.

const T0 = new Date('2026-01-01T00:00:00Z').getTime()
const TWO_DAYS = T0 + 86_400_000 * 2 + 3_600_000 * 4 + 60_000 * 30 + 5_000

@Component({
  standalone: true,
  imports: [UiCountdownComponent],
  template: `
    <ui-countdown id="full" [target]="event" label="Starts in" />
    <ui-countdown id="hh" [target]="event" format="HH:MM:SS" [pad]="false" separator="—" />
    <ui-countdown id="ss" [target]="soon()" format="SS" (finish)="finished = finished + 1" (tick)="lastTick = $event" />
    <ui-countdown id="paused" [target]="soon()" format="MM:SS" [paused]="paused()" />
    <ng-template #tile let-days
      ><b id="tile">{{ days }}d</b></ng-template
    >
    <ui-countdown id="custom" [target]="event" [renderDays]="tile" />
    <ui-countdown id="kids" [target]="event"
      ><ng-template let-p
        ><i id="disp">{{ p.display }}</i></ng-template
      ></ui-countdown
    >
    <ui-countdown id="past" [target]="0" (finish)="pastFinished = true" />
  `,
})
class Host {
  event = TWO_DAYS
  soon = signal(T0 + 3_000)
  paused = signal(false)
  finished = 0
  lastTick = -1
  pastFinished = false
}

function render() {
  vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'setTimeout', 'clearTimeout', 'Date'] })
  vi.setSystemTime(T0)
  TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] })
  const fixture = TestBed.createComponent(Host)
  fixture.detectChanges()
  const root = fixture.nativeElement as HTMLElement
  return { fixture, host: fixture.componentInstance, q: (id: string) => root.querySelector<HTMLElement>(`#${id}`)! }
}

const text = (el: HTMLElement) => el.querySelector('[data-slot=countdown-display]')!.textContent!.replace(/\s+/g, '')

describe('Countdown (angular, 7 checks)', () => {
  afterEach(() => vi.useRealTimers())

  it('1: DD:HH:MM:SS renders label, role=timer display, per-unit slots and digit spans', () => {
    const full = render().q('full')
    expect(full.querySelector('[data-slot=countdown-label]')!.textContent).toBe('Starts in')
    const disp = full.querySelector('[data-slot=countdown-display]')!
    expect(disp.getAttribute('role')).toBe('timer')
    expect(disp.getAttribute('aria-live')).toBe('polite')
    expect(text(full)).toBe('02:04:30:05')
    expect(full.querySelector('[data-slot=countdown-days]')!.querySelectorAll('.countdown-digit').length).toBe(2)
    expect(full.getAttribute('data-finished')).toBe('false')
  })

  it('2: compact formats roll larger units up; pad=false + custom separator', () => {
    expect(text(render().q('hh'))).toBe('52—30—5')
  })

  it('3: ticks every second (tick emits remaining ms) and repaints zoneless', async () => {
    const { fixture, host, q } = render()
    expect(text(q('ss'))).toBe('03')
    vi.advanceTimersByTime(1000)
    fixture.detectChanges()
    expect(text(q('ss'))).toBe('02')
    expect(host.lastTick).toBe(2000)
  })

  it('4: finish fires exactly once at zero; display goes quiet (aria-live off)', () => {
    const { fixture, host, q } = render()
    vi.advanceTimersByTime(6000)
    fixture.detectChanges()
    expect(host.finished).toBe(1)
    expect(q('ss').getAttribute('data-finished')).toBe('true')
    expect(q('ss').querySelector('[role=timer]')!.getAttribute('aria-live')).toBe('off')
  })

  it('5: paused freezes the timer; resuming continues', () => {
    const { fixture, host, q } = render()
    host.paused.set(true)
    fixture.detectChanges()
    vi.advanceTimersByTime(2000)
    fixture.detectChanges()
    expect(text(q('paused'))).toBe('00:03')
    expect(q('paused').getAttribute('data-paused')).toBe('true')
    host.paused.set(false)
    fixture.detectChanges()
    vi.advanceTimersByTime(1000)
    fixture.detectChanges()
    expect(text(q('paused'))).toBe('00:00')
  })

  it('6: renderDays template replaces the days unit; a projected template replaces the display', () => {
    const { q } = render()
    expect(q('custom').querySelector('#tile')!.textContent).toBe('2d')
    expect(q('custom').querySelector('[data-slot=countdown-days]')).toBeNull()
    expect(q('custom').querySelector('[data-slot=countdown-hours]')).not.toBeNull()
    expect(q('kids').querySelector('#disp')!.textContent).toBe('02:04:30:05')
  })

  it('7: a target in the past finishes immediately without waiting for a tick', () => {
    const { host, q } = render()
    expect(host.pastFinished).toBe(true)
    expect(text(q('past'))).toBe('00:00:00:00')
  })
})
