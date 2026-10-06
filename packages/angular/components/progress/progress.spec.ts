// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiProgressComponent } from './progress.component'

// React / Radix Progress parity. If these break, users see: a bar that collapses to nothing
// (inline custom-element host), an indicator that overshoots the track for values > 100, screen
// readers announcing an unlabelled / value-less progressbar, or `data-state=complete` styling
// that never kicks in.

@Component({
  standalone: true,
  imports: [UiProgressComponent],
  template: `
    <ui-progress id="a" [value]="33" />
    <ui-progress id="over" [value]="140" />
    <ui-progress id="done" [value]="100" aria-label="Upload" />
    <div ui-progress id="lb" [value]="10" aria-labelledby="x" class="h-4"></div>
  `,
})
class Host {}

function render() {
  const fixture = TestBed.createComponent(Host)
  fixture.detectChanges()
  return (id: string) => (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(`#${id}`)!
}

describe('Progress (angular, 6 checks)', () => {
  it('1: host is the progressbar root with Radix aria + data attributes', () => {
    const a = render()('a')
    expect(a.getAttribute('role')).toBe('progressbar')
    expect(a.getAttribute('aria-valuemin')).toBe('0')
    expect(a.getAttribute('aria-valuemax')).toBe('100')
    expect(a.getAttribute('aria-valuenow')).toBe('33')
    expect(a.getAttribute('aria-valuetext')).toBe('33%')
    expect(a.getAttribute('data-state')).toBe('loading')
    expect(a.getAttribute('data-value')).toBe('33')
    expect(a.getAttribute('data-slot')).toBe('progress')
  })

  it('2: block-level track with the React class string (display utility first)', () => {
    const a = render()('a')
    expect(a.classList.contains('block')).toBe(true)
    for (const c of ['bg-primary/20', 'relative', 'h-2', 'w-full', 'overflow-hidden', 'rounded-full'])
      expect(a.classList.contains(c), c).toBe(true)
  })

  it('3: indicator is translated by the remaining percentage', () => {
    const ind = render()('a').querySelector<HTMLElement>('[data-slot=progress-indicator]')!
    expect(ind.style.transform).toBe('translateX(-67%)')
    expect(ind.getAttribute('data-state')).toBe('loading')
  })

  it('4: out-of-range values clamp so the indicator never overshoots', () => {
    const over = render()('over')
    expect(over.getAttribute('aria-valuenow')).toBe('100')
    expect(over.querySelector<HTMLElement>('[data-slot=progress-indicator]')!.style.transform).toBe('translateX(-0%)')
  })

  it('5: value === max reports data-state="complete"', () => {
    expect(render()('done').getAttribute('data-state')).toBe('complete')
  })

  it('6: aria-label falls back to "Progress" only when the bar is unlabelled', () => {
    const q = render()
    expect(q('a').getAttribute('aria-label')).toBe('Progress')
    expect(q('done').getAttribute('aria-label')).toBe('Upload')
    expect(q('lb').hasAttribute('aria-label')).toBe(false)
    expect(q('lb').getAttribute('aria-labelledby')).toBe('x')
    expect(q('lb').classList.contains('h-4')).toBe(true)
  })
})
