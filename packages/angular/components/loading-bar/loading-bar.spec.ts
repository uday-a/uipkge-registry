// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest'
import { Component, ViewChild, provideZonelessChangeDetection, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiLoadingBarComponent, useLoadingBar } from './loading-bar.component'

// React LoadingBar parity. If these break, users see: a bar that jumps to 100 and vanishes
// with no fade (the old done()), no trickle after start() so long requests look frozen, a
// declarative [value] that does nothing, an error state that never clears, a bar that stays
// visible (or announced) when idle, or an indeterminate bar that never slides.

@Component({
  standalone: true,
  imports: [UiLoadingBarComponent],
  template: `
    <ui-loading-bar id="imp" (valueChange)="last = $event" (finish)="finished = finished + 1" />
    <ui-loading-bar id="ctl" [value]="value()" [height]="6" color="#10b981" position="bottom" />
    <ui-loading-bar id="ind" indeterminate spinner />
    <ui-loading-bar id="err" [value]="85" [error]="true" hidden />
  `,
})
class Host {
  @ViewChild(UiLoadingBarComponent) bar!: UiLoadingBarComponent
  value = signal(40)
  last = -1
  finished = 0
}

function render() {
  TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] })
  const fixture = TestBed.createComponent(Host)
  fixture.detectChanges()
  const root = fixture.nativeElement as HTMLElement
  return { fixture, host: fixture.componentInstance, q: (id: string) => root.querySelector<HTMLElement>(`#${id}`)! }
}

describe('LoadingBar (angular, 7 checks)', () => {
  afterEach(() => vi.useRealTimers())

  it('1: idle bar is a fixed, transparent, aria-hidden progressbar at the top', () => {
    const { q } = render()
    const imp = q('imp')
    expect(imp.getAttribute('role')).toBe('progressbar')
    for (const c of ['block', 'fixed', 'top-0', 'left-0', 'z-[9999]', 'w-full', 'opacity-0', 'pointer-events-none'])
      expect(imp.classList.contains(c), c).toBe(true)
    expect(imp.getAttribute('aria-hidden')).toBe('true')
    expect(imp.hasAttribute('aria-busy')).toBe(false)
    expect(imp.getAttribute('data-state')).toBe('determinate')
    expect(imp.style.height).toBe('3px')
  })

  it('2: declarative value drives the fill (and follows input changes)', async () => {
    const { fixture, q, host } = render()
    const ctl = q('ctl')
    expect(ctl.classList.contains('bottom-0')).toBe(true)
    expect(ctl.classList.contains('opacity-100')).toBe(true)
    expect(ctl.getAttribute('aria-valuenow')).toBe('40')
    const fill = ctl.querySelector<HTMLElement>('[data-slot=loading-bar-fill]')!
    expect(fill.style.width).toBe('40%')
    expect(fill.style.backgroundColor).toBe('rgb(16, 185, 129)')
    host.value.set(75)
    await fixture.whenStable()
    expect(fill.style.width).toBe('75%')
  })

  it('3: start() shows the bar busy and trickles toward (never past) 95 on animation frames', async () => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'setTimeout', 'clearTimeout'] })
    const { fixture, q, host } = render()
    host.bar.start()
    await vi.advanceTimersByTimeAsync(16 * 10)
    fixture.detectChanges()
    const v = Number(q('imp').getAttribute('aria-valuenow'))
    expect(v).toBeGreaterThan(20)
    expect(q('imp').getAttribute('aria-busy')).toBe('true')
    await vi.advanceTimersByTimeAsync(16 * 2000)
    expect(host.bar.internal()).toBeLessThanOrEqual(95)
    expect(host.last).toBe(host.bar.internal())
  })

  it('4: finish() fills to 100, emits finish, then fades and resets to 0', async () => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'setTimeout', 'clearTimeout'] })
    const { fixture, q, host } = render()
    host.bar.start()
    host.bar.finish()
    fixture.detectChanges()
    expect(q('imp').getAttribute('aria-valuenow')).toBe('100')
    expect(q('imp').classList.contains('opacity-100')).toBe(true)
    expect(host.finished).toBe(1)
    await vi.advanceTimersByTimeAsync(250)
    fixture.detectChanges()
    expect(q('imp').classList.contains('opacity-0')).toBe(true)
    await vi.advanceTimersByTimeAsync(300)
    expect(host.bar.internal()).toBe(0)
    expect(host.last).toBe(0)
  })

  it('5: error() tints destructive, then clears after fading; inc() caps at 99', async () => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'setTimeout', 'clearTimeout'] })
    const { fixture, q, host } = render()
    host.bar.set(95)
    host.bar.inc()
    expect(host.bar.internal()).toBe(99)
    host.bar.error()
    fixture.detectChanges()
    expect(q('imp').getAttribute('data-state')).toBe('error')
    expect(q('imp').querySelector<HTMLElement>('[data-slot=loading-bar-fill]')!.style.backgroundColor).toBe(
      'var(--destructive)',
    )
    await vi.advanceTimersByTimeAsync(800)
    fixture.detectChanges()
    expect(q('imp').getAttribute('data-state')).toBe('determinate')
    expect(host.bar.internal()).toBe(0)
  })

  it('6: indeterminate slides a third-width bar with a trailing spinner; no aria-valuenow', () => {
    const { q } = render()
    const ind = q('ind')
    expect(ind.getAttribute('data-state')).toBe('indeterminate')
    expect(ind.hasAttribute('aria-valuenow')).toBe(false)
    const bar = ind.querySelector<HTMLElement>('[data-slot=loading-bar-indeterminate]')!
    expect(bar.classList.contains('loading-bar-indeterminate')).toBe(true)
    expect(bar.querySelector('[data-slot=loading-bar-spinner]')).not.toBeNull()
    const css = [...document.head.querySelectorAll('style')].map((s) => s.textContent).join('\n')
    expect(css).toContain('@keyframes loading-bar-slide')
  })

  it('7: error input tints; hidden input hides without the native attribute; useLoadingBar tracks state', () => {
    const { q, host } = render()
    const err = q('err')
    expect(err.getAttribute('data-state')).toBe('error')
    expect(err.classList.contains('opacity-0')).toBe(true)
    expect(err.hasAttribute('hidden')).toBe(false)
    const api = useLoadingBar()
    api.setRef(host.bar)
    api.start()
    expect(api.loading()).toBe(true)
    api.error()
    expect(api.loading()).toBe(false)
    expect(api.isError()).toBe(true)
  })
})
