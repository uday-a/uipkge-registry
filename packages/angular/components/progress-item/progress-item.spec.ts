// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiProgressItemComponent } from './progress-item.component'

// React ProgressItem parity. If these break, users see: a fill with no height / colour (the
// old inlined bar had no Progress track classes), a raw-vs-clamped percent mismatch in the
// label, per-row chart colours that stop cycling, or barClass losing to colorIndex.

@Component({
  standalone: true,
  imports: [UiProgressItemComponent],
  template: `
    <ui-progress-item id="a" label="Engineering" [value]="42" [colorIndex]="1" />
    <ui-progress-item id="b" label="Tasks" [value]="62" secondaryLabel="124 / 200" [colorIndex]="7" />
    <ui-progress-item
      id="c"
      label="Healthy"
      [value]="76"
      [colorIndex]="2"
      barClass="[&_[data-slot=progress-indicator]]:bg-emerald-500"
    />
  `,
})
class Host {}

function render() {
  const fixture = TestBed.createComponent(Host)
  fixture.detectChanges()
  return (id: string) => (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(`#${id}`)!
}

describe('ProgressItem (angular, 5 checks)', () => {
  it('1: block host with data-slot and the React class string', () => {
    const a = render()('a')
    expect(a.getAttribute('data-slot')).toBe('progress-item')
    expect(a.classList.contains('block')).toBe(true)
    expect(a.classList.contains('space-y-1.5')).toBe(true)
  })

  it('2: label row shows the label and the default `${value}%`', () => {
    const spans = render()('a').querySelectorAll('span')
    expect(spans[0]!.textContent).toBe('Engineering')
    expect(spans[1]!.textContent).toBe('42%')
  })

  it('3: renders a real ui-progress (track + translated indicator)', () => {
    const bar = render()('a').querySelector<HTMLElement>('[data-slot=progress]')!
    expect(bar.getAttribute('role')).toBe('progressbar')
    expect(bar.classList.contains('bg-primary/20')).toBe(true)
    expect(bar.classList.contains('h-2')).toBe(true)
    const ind = bar.querySelector<HTMLElement>('[data-slot=progress-indicator]')!
    expect(ind.style.transform).toBe('translateX(-58%)')
  })

  it('4: secondaryLabel replaces the percent; colorIndex cycles modulo 6', () => {
    const b = render()('b')
    expect(b.querySelectorAll('span')[1]!.textContent).toBe('124 / 200')
    expect(
      b
        .querySelector('[data-slot=progress]')!
        .classList.contains('[&_[data-slot=progress-indicator]]:bg-[var(--chart-1)]'),
    ).toBe(true)
  })

  it('5: barClass overrides the colorIndex colour (tailwind-merge)', () => {
    const cls = render()('c').querySelector('[data-slot=progress]')!.classList
    expect(cls.contains('[&_[data-slot=progress-indicator]]:bg-emerald-500')).toBe(true)
    expect(cls.contains('[&_[data-slot=progress-indicator]]:bg-[var(--chart-2)]')).toBe(false)
  })
})
