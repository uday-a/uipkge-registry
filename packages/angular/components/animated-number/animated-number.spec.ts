// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest'
import { Component, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiAnimatedNumberComponent } from './animated-number.component'

// React AnimatedNumber parity. If these break, users see: a KPI stuck at its start value in a
// zoneless app, a retarget that jumps back to zero instead of easing from the shown figure,
// the `disabled` / reduced-motion path still animating, or figures that jitter (no tabular-nums).

@Component({
  standalone: true,
  imports: [UiAnimatedNumberComponent],
  template: `<ui-animated-number
    id="n"
    [value]="value()"
    [from]="10"
    [duration]="100"
    [disabled]="disabled()"
    [format]="fmt"
    class="text-lg"
  />`,
})
class Host {
  value = signal(110)
  disabled = signal(false)
  fmt = (v: number) => `#${Math.round(v)}`
}

function setup(reduce = false) {
  vi.useFakeTimers({
    toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame', 'performance'],
  })
  window.matchMedia = ((q: string) => ({ matches: reduce, media: q })) as unknown as typeof window.matchMedia
  const fixture = TestBed.createComponent(Host)
  fixture.detectChanges()
  const el = fixture.nativeElement.querySelector('#n') as HTMLElement
  const advance = (ms: number) => {
    vi.advanceTimersByTime(ms)
    fixture.detectChanges()
  }
  return { fixture, el, advance }
}

afterEach(() => {
  vi.useRealTimers()
})

describe('AnimatedNumber (angular, 6 checks)', () => {
  it('1: renders data-slot, tabular-nums and merges consumer classes', () => {
    const { el } = setup()
    expect(el.getAttribute('data-slot')).toBe('animated-number')
    expect(el.classList.contains('tabular-nums')).toBe(true)
    expect(el.classList.contains('text-lg')).toBe(true)
  })

  it('2: counts up from `from` on mount and lands exactly on the value', () => {
    const { el, advance } = setup()
    expect(el.textContent).toBe('#10')
    advance(50)
    const mid = Number(el.textContent!.slice(1))
    expect(mid).toBeGreaterThan(10)
    expect(mid).toBeLessThan(110)
    advance(60)
    expect(el.textContent).toBe('#110')
  })

  it('3: a new value retargets from the displayed value, not from `from`', () => {
    const { fixture, el, advance } = setup()
    advance(200)
    fixture.componentInstance.value.set(210)
    fixture.detectChanges()
    expect(el.textContent).toBe('#110')
    advance(200)
    expect(el.textContent).toBe('#210')
  })

  it('4: disabled renders the target instantly', () => {
    const { fixture, el } = setup()
    fixture.componentInstance.disabled.set(true)
    fixture.detectChanges()
    expect(el.textContent).toBe('#110')
  })

  it('5: prefers-reduced-motion skips the tween', () => {
    const { el } = setup(true)
    expect(el.textContent).toBe('#110')
  })

  it('6: default formatter rounds', () => {
    const fixture = TestBed.createComponent(UiAnimatedNumberComponent)
    fixture.componentRef.setInput('value', 42.6)
    fixture.componentRef.setInput('disabled', true)
    fixture.detectChanges()
    expect(fixture.nativeElement.textContent).toBe('43')
  })
})
