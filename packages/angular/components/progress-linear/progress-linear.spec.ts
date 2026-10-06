// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiProgressLinearComponent, progressLinearVariants } from './progress-linear.component'
import { progressLinearVariants as reactVariants } from '../../../registry-react/components/progress-linear/progress-linear.variants'

// React ProgressLinear parity. If these break, users see: a bar with no height (inline host /
// height on the wrong layer), no visible track behind the fill, a buffered track that is not
// dimmed, `reverse` still filling from the left, indeterminate bars that never slide (missing
// inner bars / keyframes), or a progressbar that screen readers cannot read.

@Component({
  standalone: true,
  imports: [UiProgressLinearComponent],
  template: `
    <ui-progress-linear id="d" [value]="60" color="red" />
    <ui-progress-linear id="i" indeterminate color="blue" [height]="8" />
    <ui-progress-linear id="b" [value]="35" [buffer]="65" stream reverse />
    <ui-progress-linear id="o" [value]="140" striped rounded="lg" height="1rem" />
  `,
})
class Host {}

function render() {
  const fixture = TestBed.createComponent(Host)
  fixture.detectChanges()
  return (id: string) => (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(`#${id}`)!
}

describe('ProgressLinear (angular, 6 checks)', () => {
  it('1: block progressbar host with height, rounded variant and uipkge-pl scope', () => {
    const q = render()
    const d = q('d')
    expect(d.getAttribute('role')).toBe('progressbar')
    expect(d.getAttribute('aria-valuenow')).toBe('60')
    for (const c of ['block', 'uipkge-pl', 'relative', 'overflow-hidden', 'w-full', 'rounded-full'])
      expect(d.classList.contains(c), c).toBe(true)
    expect(d.style.height).toBe('4px')
    expect(q('i').style.height).toBe('8px')
    expect(q('o').style.height).toBe('1rem')
    expect(q('o').classList.contains('rounded-lg')).toBe(true)
  })

  it('2: determinate: full-width track + value bar coloured and sized by value', () => {
    const d = render()('d')
    const [track, bar] = [...d.children] as HTMLElement[]
    expect(track!.style.width).toBe('100%')
    expect(track!.classList.contains('opacity-100')).toBe(true)
    expect(bar!.style.width).toBe('60%')
    expect(bar!.style.backgroundColor).toBe('red')
    expect(bar!.classList.contains('left-0')).toBe(true)
  })

  it('3: indeterminate: no aria-valuenow, full-width bar with two sliding inner bars', () => {
    const i = render()('i')
    expect(i.hasAttribute('aria-valuenow')).toBe(false)
    const bar = i.lastElementChild as HTMLElement
    // The plain class names are what the component's keyframe rules target (they gate reduced
    // motion themselves). A `motion-safe:` prefix renames the class and the bars sit still.
    expect(bar.classList.contains('animate-indeterminate')).toBe(true)
    expect(bar.style.backgroundColor).toBe('')
    const inner = [...bar.children] as HTMLElement[]
    expect(inner.map((e) => e.className.split(' ')[0])).toEqual(['animate-indeterminate1', 'animate-indeterminate2'])
    expect(inner[0]!.style.backgroundColor).toBe('blue')
  })

  it('4: buffer dims the track, adds a buffer fill and the stream overlay; reverse anchors right', () => {
    const b = render()('b')
    const kids = [...b.children] as HTMLElement[]
    expect(kids.length).toBe(4)
    expect(kids[0]!.classList.contains('opacity-30')).toBe(true)
    expect(kids[0]!.style.width).toBe('65%')
    expect(kids[1]!.style.width).toBe('65%')
    expect(kids[1]!.style.opacity).toBe('0.3')
    expect(kids[2]!.querySelector('.animate-stream')).not.toBeNull()
    expect(kids[3]!.classList.contains('right-0')).toBe(true)
    expect(kids[3]!.classList.contains('left-auto')).toBe(true)
  })

  it('5: value clamps to 100; striped hatch on track + bar', () => {
    const o = render()('o')
    expect(o.getAttribute('aria-valuenow')).toBe('100')
    const bar = o.lastElementChild as HTMLElement
    expect(bar.style.width).toBe('100%')
    expect(bar.className).toContain('rgba(255,255,255,0.25)')
    expect((o.firstElementChild as HTMLElement).className).toContain('rgba(255,255,255,0.1)')
  })

  it('6: keyframes ship unscoped; variants identical to React', () => {
    render()
    const css = [...document.head.querySelectorAll('style')].map((s) => s.textContent).join('\n')
    expect(css).toContain('@keyframes uipkge-pl-indeterminate1')
    for (const rounded of ['none', 'sm', 'default', 'lg', 'full'] as const)
      expect(progressLinearVariants({ rounded })).toBe(reactVariants({ rounded }))
  })
})
