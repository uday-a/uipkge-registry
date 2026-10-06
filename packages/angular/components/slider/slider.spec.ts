// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest'
import { Component, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiSliderComponent } from './slider.component'

// What users notice if the slider breaks: thumbs that don't render or don't move, the
// track fill not following the value, arrow / page / home / end keys doing nothing, a range
// whose thumbs cross, a disabled slider that still moves, or a value tooltip that never shows.

function render(inputs: Record<string, unknown> = {}) {
  const fixture = TestBed.createComponent(UiSliderComponent)
  for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v)
  fixture.detectChanges()
  const el = fixture.nativeElement as HTMLElement
  document.body.appendChild(el)
  const root = el.querySelector<HTMLElement>('[data-slot="slider"]')!
  const thumbs = () => [...el.querySelectorAll<HTMLElement>('[data-slot="slider-thumb"]')]
  const range = () => el.querySelector<HTMLElement>('[data-slot="slider-range"]')
  const key = (k: string, extra: KeyboardEventInit = {}) => {
    thumbs()[0]!.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, ...extra }))
    fixture.detectChanges()
  }
  return { fixture, cmp: fixture.componentInstance, el, root, thumbs, range, key }
}

/** jsdom has no layout / PointerEvent: give the root a 200px box and dispatch plain events with coordinates. */
function pointer(target: HTMLElement, type: string, clientX: number) {
  const e = new Event(type, { bubbles: true, cancelable: true })
  Object.assign(e, { clientX, clientY: 0, pointerId: 1, pointerType: 'mouse' })
  target.dispatchEvent(e)
}
/** Angular's [class] binding may reorder tokens; compare as sets (CSS doesn't care about order). */
const tokens = (el: Element) => [...el.classList].sort()
const expectClasses = (el: Element, classes: string) =>
  expect(tokens(el)).toEqual(expect.arrayContaining(classes.split(' ')))

function withBox(root: HTMLElement) {
  root.getBoundingClientRect = () => ({ left: 0, top: 0, width: 200, height: 200, right: 200, bottom: 200 }) as DOMRect
}

describe('Slider (angular, 12 checks)', () => {
  afterEach(() => (document.body.innerHTML = ''))

  it('1: renders React DOM: wrapper > root span > track > range + one role=slider thumb with aria values', () => {
    const { el, root, thumbs, range } = render({ value: [50] })
    expectClasses(el, 'relative w-full')
    expectClasses(root, 'relative flex touch-none select-none data-[disabled]:opacity-50 w-full items-center')
    expect(root.getAttribute('data-orientation')).toBe('horizontal')
    expect(tokens(range()!)).toEqual(['absolute', 'bg-primary', 'h-full'])
    expect(thumbs()).toHaveLength(1)
    const t = thumbs()[0]!
    expect(t.getAttribute('role')).toBe('slider')
    expect(t.getAttribute('aria-valuenow')).toBe('50')
    expect(t.getAttribute('aria-valuemin')).toBe('0')
    expect(t.getAttribute('aria-valuemax')).toBe('100')
    expect(t.getAttribute('tabindex')).toBe('0')
    expectClasses(t, 'border-primary bg-background ring-ring/50 block shrink-0 rounded-full border size-4')
  })

  it('2: range fill runs from start to the value (single) and between thumbs (range)', () => {
    const single = render({ value: [30] })
    expect(single.range()!.style.left).toBe('0%')
    expect(single.range()!.style.right).toBe('70%')
    const dual = render({ value: [20, 80] })
    expect(dual.thumbs()).toHaveLength(2)
    expect(dual.range()!.style.left).toBe('20%')
    expect(dual.range()!.style.right).toBe('20%')
    expect(dual.thumbs().map((t) => t.getAttribute('aria-label'))).toEqual(['Minimum', 'Maximum'])
  })

  it('3: uncontrolled defaults: [min] for single, [min, max] for range; defaultValue wins', () => {
    expect(render().cmp.values).toEqual([0])
    expect(render({ range: true }).cmp.values).toEqual([0, 100])
    expect(render({ defaultValue: [25] }).cmp.values).toEqual([25])
  })

  it('4: arrow keys step by `step`, Shift+Arrow and PageUp/PageDown by 10 steps, Home/End jump', () => {
    const s = render({ defaultValue: [50], step: 5 })
    const seen: number[][] = []
    s.cmp.valueChange.subscribe((v) => seen.push(v))
    s.key('ArrowRight')
    expect(s.cmp.values).toEqual([55])
    s.key('ArrowLeft', { shiftKey: true })
    expect(s.cmp.values).toEqual([5])
    s.key('PageUp')
    expect(s.cmp.values).toEqual([55])
    s.key('Home')
    expect(s.cmp.values).toEqual([0])
    s.key('End')
    expect(s.cmp.values).toEqual([100])
    expect(seen).toEqual([[55], [5], [55], [0], [100]])
  })

  it('5: values clamp to min/max and snap to step decimals', () => {
    const s = render({ defaultValue: [0.2], min: 0, max: 1, step: 0.1 })
    s.key('ArrowUp')
    expect(s.cmp.values).toEqual([0.3])
    s.key('End')
    s.key('ArrowUp')
    expect(s.cmp.values).toEqual([1])
  })

  it('6: key steps emit valueCommit; reverse flips which arrow increases', () => {
    const s = render({ defaultValue: [50], reverse: true })
    const commits: number[][] = []
    s.cmp.valueCommit.subscribe((v) => commits.push(v))
    s.key('ArrowRight')
    expect(s.cmp.values).toEqual([49])
    expect(commits).toEqual([[49]])
    expect(s.range()!.style.right).toBe('0%') // fill anchored to the right edge
  })

  it('7: pointer-down on the track moves the closest thumb there, drag follows, pointer-up commits', () => {
    const s = render({ defaultValue: [20, 80] })
    withBox(s.root)
    const track = s.el.querySelector<HTMLElement>('[data-slot="slider-track"]')!
    const commits: number[][] = []
    s.cmp.valueCommit.subscribe((v) => commits.push(v))
    pointer(track, 'pointerdown', 140) // 70 -> closest is 80
    s.fixture.detectChanges()
    expect(s.cmp.values).toEqual([20, 70])
    pointer(track, 'pointermove', 180)
    expect(s.cmp.values).toEqual([20, 90])
    pointer(track, 'pointerup', 180)
    expect(commits).toEqual([[20, 90]])
  })

  it('8: range thumbs stay sorted when one is dragged past the other', () => {
    const s = render({ defaultValue: [40, 60] })
    withBox(s.root)
    const track = s.el.querySelector<HTMLElement>('[data-slot="slider-track"]')!
    pointer(track, 'pointerdown', 100) // 50: tie -> first thumb
    pointer(track, 'pointermove', 160) // 80: passes 60
    expect(s.cmp.values).toEqual([60, 80])
  })

  it('9: disabled blocks keys and pointer, sets data-disabled and drops tabindex', () => {
    const s = render({ defaultValue: [50], disabled: true })
    s.key('ArrowRight')
    withBox(s.root)
    pointer(s.root, 'pointerdown', 10)
    expect(s.cmp.values).toEqual([50])
    expect(s.root.hasAttribute('data-disabled')).toBe(true)
    expect(s.thumbs()[0]!.hasAttribute('tabindex')).toBe(false)
  })

  it('10: controlled [value] + (valueChange) round-trips; without an update it stays put (Radix controlled)', () => {
    @Component({
      standalone: true,
      imports: [UiSliderComponent],
      template: `<ui-slider [value]="v()" (valueChange)="v.set($event)" /><ui-slider [value]="[10]" />`,
    })
    class Host {
      v = signal([30])
    }
    const f = TestBed.createComponent(Host)
    f.detectChanges()
    const [a, b] = [...(f.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('[data-slot="slider-thumb"]')]
    a!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))
    b!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))
    f.detectChanges()
    expect(f.componentInstance.v()).toEqual([31])
    expect(a!.getAttribute('aria-valuenow')).toBe('31')
    expect(b!.getAttribute('aria-valuenow')).toBe('10')
  })

  it('11: vertical sets orientation, height, and positions from the bottom; dots and marks render', () => {
    const s = render({
      value: [30],
      vertical: true,
      height: 160,
      dots: true,
      step: 25,
      marks: { 0: '0', 100: { label: 'Max', style: { color: 'red' } } },
    })
    expect(s.el.style.height).toBe('160px')
    expect(s.root.getAttribute('data-orientation')).toBe('vertical')
    expect(tokens(s.range()!)).toEqual(['absolute', 'bg-primary', 'w-full'])
    expect(s.range()!.style.bottom).toBe('0%')
    expect(s.range()!.style.top).toBe('70%')
    expect(s.el.querySelectorAll('.border-primary\\/40')).toHaveLength(5)
    const labels = [...s.el.querySelectorAll<HTMLElement>('.text-muted-foreground.absolute')]
    expect(labels.map((l) => l.textContent)).toEqual(['0', 'Max'])
    expect(labels[1]!.style.color).toBe('red')
  })

  it('12: focusing a thumb opens the value tooltip (formatter applied); blur closes; tooltip=false has none', () => {
    const s = render({ value: [42], tooltip: (v: number) => `${v}%` })
    const t = s.thumbs()[0]!
    t.dispatchEvent(new Event('focus'))
    s.fixture.detectChanges()
    const tip = document.querySelector('[role="tooltip"]')!
    expect(tip.textContent).toContain('42%')
    expect(t.getAttribute('data-state')).toBe('instant-open')
    expect(t.getAttribute('aria-describedby')).toBe(tip.id)
    t.dispatchEvent(new Event('blur'))
    s.fixture.detectChanges()
    expect(document.querySelector('[role="tooltip"]')).toBeNull()
    expect(t.getAttribute('data-state')).toBe('closed')
    const none = render({ value: [42], tooltip: false })
    none.thumbs()[0]!.dispatchEvent(new Event('focus'))
    expect(document.querySelectorAll('[role="tooltip"]')).toHaveLength(0)
    expect(none.thumbs()[0]!.hasAttribute('data-state')).toBe(false)
  })
})

describe('Slider class forwarding', () => {
  // React forwards className to the Radix root only. If it also stayed on the wrapper,
  // padding such as py-1 would apply twice and the slider would sit lower than in React.
  it('a static class goes to the root, not the wrapper', () => {
    @Component({ standalone: true, imports: [UiSliderComponent], template: `<ui-slider class="w-full py-1" />` })
    class Host {}
    const fixture = TestBed.createComponent(Host)
    fixture.detectChanges()
    const host = (fixture.nativeElement as HTMLElement).querySelector('ui-slider')!
    expect(host.classList.contains('py-1')).toBe(false)
    expect(host.querySelector('.py-1')).not.toBeNull()
  })
})
