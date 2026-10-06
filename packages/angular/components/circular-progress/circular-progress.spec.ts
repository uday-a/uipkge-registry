// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiCircularProgressComponent } from './circular-progress.component'

// React CircularProgress parity. If these break, users see: a ring whose arc starts at 3
// o'clock (missing -90° rotation), an indeterminate spinner that does not spin (no <g> +
// keyframes), custom centre content (e.g. "4/6") rendered beside the ring instead of inside
// it or alongside a duplicate percentage, no completion pulse, or a progressbar with no value.

@Component({
  standalone: true,
  imports: [UiCircularProgressComponent],
  template: `
    <ui-circular-progress id="v" [value]="value()" size="lg" showValue />
    <ui-circular-progress id="i" indeterminate size="sm" />
    <ui-circular-progress id="c" [value]="67" [size]="120" [thickness]="12" showValue
      ><span id="frac">4/6</span></ui-circular-progress
    >
    <ui-circular-progress id="n" [value]="30" />
  `,
})
class Host {
  value = signal(42.4)
}

function render() {
  const fixture = TestBed.createComponent(Host)
  fixture.detectChanges()
  const q = (id: string) => (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(`#${id}`)!
  return { fixture, q }
}

describe('CircularProgress (angular, 6 checks)', () => {
  it('1: progressbar host sized from the preset, with data-* state', () => {
    const { q } = render()
    const v = q('v')
    expect(v.getAttribute('role')).toBe('progressbar')
    expect(v.getAttribute('aria-valuenow')).toBe('42.4')
    expect(v.getAttribute('aria-label')).toBe('Progress')
    expect(v.getAttribute('data-size')).toBe('lg')
    expect(v.style.width).toBe('80px')
    expect(q('c').getAttribute('data-size')).toBe('custom')
    for (const c of ['relative', 'inline-flex', 'items-center', 'justify-center'])
      expect(v.classList.contains(c), c).toBe(true)
  })

  it('2: determinate arc is rotated -90° with a dashoffset for the value', () => {
    const { q } = render()
    const g = q('n').querySelector('g')!
    expect(g.getAttribute('transform')).toBe('rotate(-90 28 28)')
    const arc = g.querySelector('circle')!
    const circ = 2 * Math.PI * 24
    expect(Number(arc.getAttribute('stroke-dashoffset'))).toBeCloseTo(circ * 0.7)
    expect(arc.getAttribute('stroke')).toBe('var(--primary)')
  })

  it('3: indeterminate spins the arc group (class + transform-box), no aria-valuenow', () => {
    const { q } = render()
    const i = q('i')
    expect(i.hasAttribute('aria-valuenow')).toBe(false)
    expect(i.getAttribute('aria-busy')).toBe('true')
    const g = i.querySelector('g')!
    expect(g.getAttribute('class')).toBe('animate-spin-circular')
    expect(g.hasAttribute('transform')).toBe(false)
    expect(g.style.transformOrigin).toBe('center')
    const css = [...document.head.querySelectorAll('style')].map((s) => s.textContent).join('\n')
    expect(css).toContain('@keyframes spin-circular')
  })

  it('4: showValue centres the rounded value; no overlay without value / children', () => {
    const { q } = render()
    const overlay = q('v').querySelector('svg + div')!
    expect(overlay.textContent!.trim()).toBe('42%')
    expect(overlay.querySelector('span')!.classList.contains('text-base')).toBe(true)
    expect(q('n').querySelector('svg + div')!.hasAttribute('hidden')).toBe(true)
  })

  it('5: projected content replaces the value inside the centred overlay', () => {
    const { q } = render()
    const overlay = q('c').querySelector('svg + div')!
    expect(overlay.classList.contains('absolute')).toBe(true)
    expect(overlay.querySelector('#frac')).not.toBeNull()
    expect(overlay.textContent!.trim()).toBe('4/6')
  })

  it('6: crossing into 100 fires a one-shot completion pulse', async () => {
    const { fixture, q } = render()
    fixture.componentInstance.value.set(100)
    fixture.detectChanges()
    expect(q('v').getAttribute('data-complete')).toBe('true')
    await new Promise((r) => setTimeout(r, 50))
    fixture.detectChanges()
    expect(q('v').querySelector('g circle')!.getAttribute('class')).toContain('animate-circular-complete')
    await new Promise((r) => setTimeout(r, 650))
    fixture.detectChanges()
    expect(q('v').querySelector('g circle')!.getAttribute('class')).not.toContain('animate-circular-complete')
  })
})
