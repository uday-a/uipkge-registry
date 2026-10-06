// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest'
import { Component, Input } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import {
  UiScrollAreaComponent,
  UiScrollBarComponent,
  thumbOffsetFromScroll,
  thumbSize,
  type ScrollAreaType,
} from './scroll-area.component'

// What users notice if the scroll area breaks: a native scrollbar flashing next to the custom
// one, no scrollbar at all (default usage must render the vertical bar like React), a thumb
// that doesn't match the content length or doesn't follow scrolling, a thumb that can't be
// dragged, or a scrollbar that never hides / never shows for its `type`.

@Component({
  standalone: true,
  imports: [UiScrollAreaComponent, UiScrollBarComponent],
  template: `
    <ui-scroll-area [type]="type" [scrollHideDelay]="100" class="h-48 border">
      <p>content</p>
      @if (horizontal) {
        <ui-scroll-bar orientation="horizontal" />
      }
    </ui-scroll-area>
  `,
})
class Host {
  @Input() type: ScrollAreaType = 'always'
  @Input() horizontal = false
}

/** jsdom has no layout: give the viewport 100px of a 400px-tall content and the bar a 100px track. */
function layout(viewport: HTMLElement, bar: HTMLElement) {
  const def = (el: HTMLElement, props: Record<string, number>) => {
    for (const [k, v] of Object.entries(props)) Object.defineProperty(el, k, { configurable: true, value: v })
  }
  def(viewport, { offsetHeight: 100, scrollHeight: 400, offsetWidth: 100, scrollWidth: 100 })
  def(bar, { clientHeight: 100, clientWidth: 10 })
  bar.getBoundingClientRect = () => ({ top: 0, left: 0, width: 10, height: 100, right: 10, bottom: 100 }) as DOMRect
}

function render(inputs: Partial<Host> = {}) {
  const fixture = TestBed.createComponent(Host)
  for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v)
  fixture.detectChanges()
  const el = fixture.nativeElement as HTMLElement
  const root = el.querySelector<HTMLElement>('[data-slot="scroll-area"]')!
  const viewport = el.querySelector<HTMLElement>('[data-slot="scroll-area-viewport"]')!
  const barDebug = fixture.debugElement.queryAll(By.directive(UiScrollBarComponent))
  const vBar = barDebug[0]!
  const bar = vBar.componentInstance as UiScrollBarComponent
  const barEl = vBar.nativeElement as HTMLElement
  layout(viewport, barEl)
  bar.sync()
  fixture.detectChanges()
  const thumb = () => barEl.querySelector<HTMLElement>('[data-slot="scroll-area-thumb"]')
  return { fixture, root, viewport, bar, barEl, thumb, barDebug }
}

describe('ScrollArea (angular, 10 checks)', () => {
  afterEach(() => vi.useRealTimers())

  it('1: renders React DOM: root > viewport[data-radix-scroll-area-viewport] > content, plus a vertical scrollbar', () => {
    const { root, viewport, barEl } = render()
    expect(root.className).toContain('relative')
    expect(root.className).toContain('h-48')
    expect(viewport.hasAttribute('data-radix-scroll-area-viewport')).toBe(true)
    expect(viewport.firstElementChild!.textContent).toContain('content')
    expect(barEl.getAttribute('data-orientation')).toBe('vertical')
    expect(barEl.parentElement).toBe(root)
  })

  it('2: viewport scrolls only on axes that have a scrollbar (native bar hidden by the injected style)', () => {
    const { viewport, fixture } = render()
    expect(viewport.style.overflowY).toBe('scroll')
    expect(viewport.style.overflowX).toBe('hidden')
    fixture.componentRef.setInput('horizontal', true)
    fixture.detectChanges()
    expect(viewport.style.overflowX).toBe('scroll')
    const styles = [...document.querySelectorAll('style')].map((s) => s.textContent).join('')
    expect(styles).toContain('[data-radix-scroll-area-viewport]::-webkit-scrollbar{display:none}')
  })

  it('3: thumb length is viewport/content of the track (min 18px); offset maps scroll range to track range', () => {
    const sizes = { content: 400, viewport: 100, scrollbar: { size: 102, paddingStart: 1, paddingEnd: 1 } }
    expect(thumbSize(sizes)).toBe(25)
    expect(thumbSize({ ...sizes, content: 10_000 })).toBe(18)
    expect(thumbOffsetFromScroll(0, sizes)).toBe(0)
    expect(thumbOffsetFromScroll(300, sizes)).toBe(75)
    expect(thumbOffsetFromScroll(9999, sizes)).toBe(75) // clamped (overscroll / momentum)
  })

  it('4: overflowing content shows a thumb sized through --radix-scroll-area-thumb-height', () => {
    const { barEl, thumb } = render()
    expect(thumb()).not.toBeNull()
    expect(barEl.style.getPropertyValue('--radix-scroll-area-thumb-height')).toBe('25px')
    expect(thumb()!.className).toContain('bg-border relative flex-1 rounded-full')
  })

  it('5: the thumb follows viewport scrolling', () => {
    const { viewport, thumb } = render()
    viewport.scrollTop = 150
    viewport.dispatchEvent(new Event('scroll'))
    expect(thumb()!.style.transform).toBe('translate3d(0, 37.5px, 0)')
  })

  it('6: pressing / dragging on the track scrolls the viewport to that point', () => {
    const { barEl, viewport } = render()
    const press = (type: string, clientY: number) => {
      const e = new Event(type, { bubbles: true })
      Object.assign(e, { button: 0, clientX: 5, clientY, pointerId: 1 })
      barEl.dispatchEvent(e)
    }
    press('pointerdown', 50) // track centre -> middle of the scroll range
    expect(viewport.scrollTop).toBe(150)
    press('pointermove', 87.5) // thumb bottom edge reaches the track end
    expect(viewport.scrollTop).toBe(300)
    press('pointerup', 87.5)
    press('pointermove', 0) // released: no more drag
    expect(viewport.scrollTop).toBe(300)
  })

  it('7: type="hover" (default) shows the bar while hovered and hides it scrollHideDelay after leaving', () => {
    vi.useFakeTimers()
    const { root, barEl, fixture } = render({ type: 'hover' })
    expect(barEl.hasAttribute('hidden')).toBe(true)
    expect(barEl.getAttribute('data-state')).toBe('hidden')
    root.dispatchEvent(new Event('pointerenter'))
    fixture.detectChanges()
    expect(barEl.hasAttribute('hidden')).toBe(false)
    expect(barEl.getAttribute('data-state')).toBe('visible')
    root.dispatchEvent(new Event('pointerleave'))
    vi.advanceTimersByTime(100)
    fixture.detectChanges()
    expect(barEl.hasAttribute('hidden')).toBe(true)
  })

  it('8: type="scroll" shows the bar while scrolling and hides it after scroll end + delay', () => {
    vi.useFakeTimers()
    const { viewport, barEl, fixture } = render({ type: 'scroll' })
    expect(barEl.hasAttribute('hidden')).toBe(true)
    viewport.scrollTop = 20
    viewport.dispatchEvent(new Event('scroll'))
    fixture.detectChanges()
    expect(barEl.getAttribute('data-state')).toBe('visible')
    vi.advanceTimersByTime(100) // scroll end -> idle
    vi.advanceTimersByTime(100) // idle -> hidden
    fixture.detectChanges()
    expect(barEl.hasAttribute('hidden')).toBe(true)
  })

  it('9: type="auto" hides the bar when content fits', () => {
    const { bar, barEl, viewport, fixture } = render({ type: 'auto' })
    expect(barEl.hasAttribute('hidden')).toBe(false)
    Object.defineProperty(viewport, 'scrollHeight', { configurable: true, value: 100 })
    bar.sync()
    fixture.detectChanges()
    expect(barEl.hasAttribute('hidden')).toBe(true)
  })

  it('10: wheel over the scrollbar scrolls the viewport', () => {
    const { barEl, viewport } = render()
    const wheel = new Event('wheel', { bubbles: true, cancelable: true })
    Object.assign(wheel, { deltaY: 40, deltaX: 0 })
    barEl.dispatchEvent(wheel)
    expect(viewport.scrollTop).toBe(40)
    expect(wheel.defaultPrevented).toBe(true)
  })
})
