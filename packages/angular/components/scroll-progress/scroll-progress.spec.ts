// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest'
import { Component, provideZonelessChangeDetection, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiScrollProgressComponent } from './scroll-progress.component'

// React ScrollProgress parity. If these break, users see: a bar that never moves (no scroll
// listener — the old port), a contained bar tracking the page instead of its box, a bar that
// animates up from zero on mount, listeners leaking after unmount, or a bar announced to
// screen readers.

function metrics(el: HTMLElement, scrollTop: number, scrollHeight: number, clientHeight: number) {
  Object.defineProperty(el, 'scrollHeight', { configurable: true, value: scrollHeight })
  Object.defineProperty(el, 'clientHeight', { configurable: true, value: clientHeight })
  el.scrollTop = scrollTop
}

@Component({
  standalone: true,
  imports: [UiScrollProgressComponent],
  template: `
    <div #box id="box"></div>
    @if (show()) {
      <ui-scroll-progress
        id="p"
        position="absolute"
        [container]="box"
        [smooth]="false"
        [height]="6"
        color="red"
        class="top-2"
      />
    }
    <ui-scroll-progress id="w" />
  `,
})
class Host {
  show = signal(true)
}

function render() {
  TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] })
  const fixture = TestBed.createComponent(Host)
  const root = fixture.nativeElement as HTMLElement
  const box = root.querySelector<HTMLElement>('#box')!
  metrics(box, 50, 300, 100)
  fixture.detectChanges()
  return { fixture, box, q: (id: string) => root.querySelector<HTMLElement>(`#${id}`) }
}

describe('ScrollProgress (angular, 5 checks)', () => {
  afterEach(() => vi.restoreAllMocks())

  it('1: single aria-hidden bar with height / background / origin-left classes', () => {
    const { q } = render()
    const p = q('p')!
    expect(p.getAttribute('aria-hidden')).toBe('true')
    expect(p.children.length).toBe(0)
    expect(p.style.height).toBe('6px')
    expect(p.style.background).toContain('red')
    expect(p.style.willChange).toBe('transform')
    for (const c of ['block', 'absolute', 'origin-left', 'z-50', 'w-full', 'top-2'])
      expect(p.classList.contains(c), c).toBe(true)
    expect(p.classList.contains('top-0')).toBe(false)
    expect(q('w')!.classList.contains('fixed')).toBe(true)
    expect(q('w')!.getAttribute('data-smooth')).toBe('true')
  })

  it('2: syncs instantly on mount from the container depth', async () => {
    const { fixture, q } = render()
    await fixture.whenStable()
    expect(q('p')!.style.transform).toBe('scaleX(0.25)')
  })

  it('3: container scroll events update the bar (signal repaint, zoneless)', async () => {
    const { fixture, box, q } = render()
    metrics(box, 200, 300, 100)
    box.dispatchEvent(new Event('scroll'))
    await fixture.whenStable()
    expect(q('p')!.style.transform).toBe('scaleX(1)')
  })

  it('4: divide-by-zero guard: content shorter than the box stays at 0', async () => {
    const { fixture, box, q } = render()
    metrics(box, 0, 100, 100)
    box.dispatchEvent(new Event('scroll'))
    await fixture.whenStable()
    expect(q('p')!.style.transform).toBe('scaleX(0)')
  })

  it('5: listeners are removed on unmount', async () => {
    const { fixture, box } = render()
    const remove = vi.spyOn(box, 'removeEventListener')
    fixture.componentInstance.show.set(false)
    await fixture.whenStable()
    expect(remove).toHaveBeenCalledWith('scroll', expect.any(Function))
  })
})
