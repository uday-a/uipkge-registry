// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest'
import { Component, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiLazyImageComponent } from './lazy-image.component'

// React Img parity. If these break, users see images that never load (skeleton forever because
// nothing observes the viewport), images that load before they scroll near (no lazy hold),
// no fade-in, a swapped src that keeps the old "loaded" state, or no fallback on a broken URL.

type IOCallback = (entries: { isIntersecting: boolean }[]) => void
let ioCallback: IOCallback | null = null
let ioOptions: IntersectionObserverInit | undefined
class FakeIO {
  constructor(cb: IOCallback, opts?: IntersectionObserverInit) {
    ioCallback = cb
    ioOptions = opts
  }
  observe() {}
  disconnect() {}
}

@Component({
  standalone: true,
  imports: [UiLazyImageComponent],
  template: `
    <ng-template #fb><div id="custom">Failed</div></ng-template>
    <div
      ui-lazy-image
      [src]="src()"
      alt="Pic"
      aspectRatio="16/9"
      [eager]="eager"
      [fallback]="fallback"
      [fallbackContent]="useSlot ? fb : undefined"
      class="rounded-md"
      (load)="events.push('load')"
      (error)="events.push('error')"
    ></div>
  `,
})
class Host {
  src = signal('a.jpg')
  eager = false
  fallback?: string
  useSlot = false
  events: string[] = []
}

function render(patch: Partial<Host> = {}) {
  const f = TestBed.createComponent(Host)
  Object.assign(f.componentInstance, patch)
  f.detectChanges()
  const host = (f.nativeElement as HTMLElement).querySelector('[data-slot=lazy-image]') as HTMLElement
  const tick = () => f.detectChanges()
  return { f, host, tick, img: () => host.querySelector('img') as HTMLImageElement | null }
}

describe('LazyImage (angular, 7 checks)', () => {
  afterEach(() => {
    ioCallback = null
    delete (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver
  })
  const withIO = () => ((globalThis as { IntersectionObserver?: unknown }).IntersectionObserver = FakeIO)

  it('1: reserves the aspect ratio and shows the skeleton while idle', () => {
    withIO()
    const { host } = render()
    expect(host.style.aspectRatio).toContain('16')
    expect(host.querySelector('[data-slot=skeleton]')).not.toBeNull()
  })
  it('2: holds the <img> until the host nears the viewport (rootMargin 200px)', () => {
    withIO()
    const { img, tick } = render()
    expect(img()).toBeNull()
    expect(ioOptions?.rootMargin).toBe('200px')
    ioCallback!([{ isIntersecting: true }])
    tick()
    expect(img()!.getAttribute('loading')).toBe('lazy')
  })
  it('3: renders immediately when IntersectionObserver is unavailable', () => {
    const { img, tick } = render()
    tick()
    expect(img()).not.toBeNull()
  })
  it('4: eager skips the hold and uses loading=eager + decoding=sync', () => {
    withIO()
    const { img, tick } = render({ eager: true })
    tick()
    expect(img()!.getAttribute('loading')).toBe('eager')
    expect(img()!.getAttribute('decoding')).toBe('sync')
  })
  it('5: load fades the image in, drops the skeleton and emits load', () => {
    const { f, host, img, tick } = render()
    tick()
    expect(img()!.classList.contains('opacity-0')).toBe(true)
    img()!.dispatchEvent(new Event('load'))
    tick()
    expect(img()!.classList.contains('opacity-100')).toBe(true)
    expect(host.querySelector('[data-slot=skeleton]')).toBeNull()
    expect(f.componentInstance.events).toEqual(['load'])
  })
  it('6: error shows the fallback URL, else the unavailable placeholder, else the custom template', () => {
    for (const [patch, check] of [
      [{ fallback: 'fb.jpg' }, (h: HTMLElement) => expect(h.querySelector('img')!.getAttribute('src')).toBe('fb.jpg')],
      [
        {},
        (h: HTMLElement) =>
          expect(h.querySelector('[role=img]')!.getAttribute('aria-label')).toBe('Image failed to load'),
      ],
      [{ useSlot: true }, (h: HTMLElement) => expect(h.querySelector('#custom')!.textContent).toBe('Failed')],
    ] as const) {
      const { f, host, img, tick } = render(patch as Partial<Host>)
      tick()
      img()!.dispatchEvent(new Event('error'))
      tick()
      check(host)
      expect(f.componentInstance.events).toEqual(['error'])
      f.destroy()
    }
  })
  it('7: changing src resets to loading (fade + skeleton run again)', () => {
    const { f, host, img, tick } = render()
    tick()
    img()!.dispatchEvent(new Event('load'))
    tick()
    f.componentInstance.src.set('b.jpg')
    tick()
    tick()
    expect(img()!.getAttribute('src')).toBe('b.jpg')
    expect(img()!.classList.contains('opacity-0')).toBe(true)
    expect(host.querySelector('[data-slot=skeleton]')).not.toBeNull()
  })
})
