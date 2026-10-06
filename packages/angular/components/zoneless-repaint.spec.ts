// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest'
import { provideZonelessChangeDetection } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiAnimatedNumberComponent } from './animated-number/animated-number.component'
import { UiLoadingBarComponent } from './loading-bar/loading-bar.component'
import { UiRelativeTimeComponent } from './relative-time/relative-time.component'

// The site previews (and modern Angular apps) run zoneless: state changed from a timer or
// an animation frame only repaints if it is signal-backed or explicitly marked for check.
// These components tween / tick outside template events, so they must repaint on their own.

function zoneless<T>(cmp: new () => T) {
  TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] })
  const fixture = TestBed.createComponent(cmp)
  return { fixture, instance: fixture.componentInstance, el: fixture.nativeElement as HTMLElement }
}

describe('Zoneless repaint (angular, 3 checks)', () => {
  afterEach(() => vi.useRealTimers())

  it('1: animated-number repaints while tweening from animation frames', async () => {
    const { fixture, el } = zoneless(UiAnimatedNumberComponent)
    fixture.componentRef.setInput('duration', 10)
    fixture.componentRef.setInput('value', 50)
    await fixture.whenStable()
    await new Promise((r) => setTimeout(r, 60))
    await fixture.whenStable()
    expect(el.textContent?.trim()).toBe('50')
  })

  it('2: loading-bar repaints when driven imperatively (start / set outside events)', async () => {
    const { fixture, instance, el } = zoneless(UiLoadingBarComponent)
    await fixture.whenStable()
    const bar = () =>
      el.getAttribute('aria-valuenow') ?? el.querySelector('[role=progressbar]')?.getAttribute('aria-valuenow')
    expect(bar()).not.toBe('40')
    instance.set(40)
    await fixture.whenStable()
    expect(bar()).toBe('40')
  })

  it('3: relative-time re-renders its label on the update interval', async () => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'Date'] })
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))
    const { fixture, el } = zoneless(UiRelativeTimeComponent)
    fixture.componentRef.setInput('date', new Date('2026-01-01T00:00:00Z'))
    fixture.componentRef.setInput('updateInterval', 1000)
    await fixture.whenStable()
    const before = el.textContent
    vi.setSystemTime(new Date('2026-01-01T02:00:00Z'))
    vi.advanceTimersByTime(1000)
    await fixture.whenStable()
    expect(el.textContent).not.toBe(before)
  })
})
