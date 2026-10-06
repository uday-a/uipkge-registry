// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiAspectRatioComponent } from './aspect-ratio.component'

// Radix AspectRatio parity. If these break, media boxes collapse to 0 height or letterbox at the
// wrong ratio (layout shift while images/videos load), or the consumer's bg/rounded/grid classes
// land on the wrapper instead of the positioned box (so `place-items-center` stops centring).

@Component({
  standalone: true,
  imports: [UiAspectRatioComponent],
  template: `<div ui-aspect-ratio [ratio]="ratio()" class="bg-muted grid place-items-center"><span>16:9</span></div>`,
})
class Host {
  ratio = signal(16 / 9)
}

function render(ratio?: number) {
  const f = TestBed.createComponent(Host)
  if (ratio !== undefined) f.componentInstance.ratio.set(ratio)
  f.detectChanges()
  const wrapper = (f.nativeElement as HTMLElement).querySelector('[data-radix-aspect-ratio-wrapper]') as HTMLElement
  return { f, wrapper, inner: wrapper.querySelector('[data-slot=aspect-ratio]') as HTMLElement }
}

describe('AspectRatio (angular, 5 checks)', () => {
  it('1: wrapper reserves height with padding-bottom = 100 / ratio', () => {
    const { wrapper } = render()
    expect(wrapper.style.position).toBe('relative')
    expect(wrapper.style.width).toBe('100%')
    expect(parseFloat(wrapper.style.paddingBottom)).toBeCloseTo(56.25, 2)
  })
  it('2: default ratio is 1 (square)', () => {
    const f = TestBed.createComponent(UiAspectRatioComponent)
    f.detectChanges()
    expect(f.componentInstance.ratio).toBe(1)
    expect((f.nativeElement as HTMLElement).style.paddingBottom).toBe('100%')
  })
  it('3: inner box is absolutely positioned over the wrapper', () => {
    const { inner } = render()
    expect(inner.style.position).toBe('absolute')
    expect([inner.style.top, inner.style.right, inner.style.bottom, inner.style.left]).toEqual([
      '0px',
      '0px',
      '0px',
      '0px',
    ])
  })
  it('4: consumer class lands on the inner box, not the wrapper', () => {
    const { wrapper, inner } = render()
    expect(inner.className).toBe('bg-muted grid place-items-center')
    expect(wrapper.classList.contains('grid')).toBe(false)
    expect(inner.hasAttribute('data-uipkge')).toBe(true)
  })
  it('5: ratio changes update the reserved height and content is projected', () => {
    const { f, wrapper, inner } = render()
    f.componentInstance.ratio.set(4 / 3)
    f.detectChanges()
    expect(wrapper.style.paddingBottom).toBe('75%')
    expect(inner.textContent).toBe('16:9')
  })
})
