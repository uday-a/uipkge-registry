// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiImageCompareComponent } from './image-compare.component'

// React ImageCompare parity: the "after" image is clipped at the slider position, a divider
// carries a focusable role="slider" handle, dragging the frame or pressing arrows moves it,
// vertical orientation swaps axes, and disabled drops the divider behind a veil. If these
// broke, users would see a static image with no way to reveal the other side.

function render<T>(cmp: new () => T) {
  const fixture = TestBed.createComponent(cmp)
  fixture.detectChanges()
  const el = fixture.nativeElement as HTMLElement
  const handle = (sel = 'ui-image-compare') => el.querySelector<HTMLButtonElement>(`${sel} button[role="slider"]`)!
  const key = (target: Element, k: string, shiftKey = false) => {
    const e = new KeyboardEvent('keydown', { key: k, shiftKey, bubbles: true, cancelable: true })
    target.dispatchEvent(e)
    fixture.detectChanges()
    return e
  }
  return { fixture, el, handle, key, flush: () => fixture.detectChanges() }
}

describe('ImageCompare (angular, 7 checks)', () => {
  it('1: renders React DOM: block frame, before img, clipped after layer, labels, divider + handle icon', () => {
    @Component({
      standalone: true,
      imports: [UiImageCompareComponent],
      template: `<ui-image-compare beforeSrc="a.jpg" afterSrc="b.jpg" class="h-72" />`,
    })
    class Host {}
    const { el, handle } = render(Host)
    const host = el.querySelector<HTMLElement>('ui-image-compare')!
    for (const c of ['block', 'touch-none', 'bg-muted', 'relative', 'overflow-hidden', 'cursor-ew-resize', 'h-72'])
      expect(host.classList.contains(c), c).toBe(true)
    expect(host.getAttribute('data-orientation')).toBe('horizontal')
    const imgs = host.querySelectorAll('img')
    expect([...imgs].map((i) => i.getAttribute('alt'))).toEqual(['Before', 'After'])
    expect(imgs[1]!.parentElement!.style.clipPath).toBe('inset(0 0 0 50%)')
    expect([...host.querySelectorAll('span.bottom-2')].map((s) => s.textContent)).toEqual(['Before', 'After'])
    expect(handle().parentElement!.style.left).toBe('50%')
    expect(handle().getAttribute('aria-label')).toBe('Image comparison slider, 50 percent')
    expect(handle().querySelector('svg')!.getAttribute('class')).toContain('lucide-move-horizontal')
  })

  it('2: Arrow keys move 1%, Shift 10%, clamped to 0-100', () => {
    @Component({
      standalone: true,
      imports: [UiImageCompareComponent],
      template: `<ui-image-compare beforeSrc="a" afterSrc="b" [(value)]="v" />`,
    })
    class Host {
      v = 50
    }
    const { fixture, handle, key } = render(Host)
    expect(key(handle(), 'ArrowRight').defaultPrevented).toBe(true)
    expect(fixture.componentInstance.v).toBe(51)
    key(handle(), 'ArrowLeft', true)
    expect(fixture.componentInstance.v).toBe(41)
    for (let i = 0; i < 7; i++) key(handle(), 'ArrowRight', true)
    expect(fixture.componentInstance.v).toBe(100)
    expect(key(handle(), 'ArrowUp').defaultPrevented).toBe(false)
  })

  it('3: pointer drag on the frame sets the position from the pointer x', () => {
    @Component({
      standalone: true,
      imports: [UiImageCompareComponent],
      template: `<ui-image-compare beforeSrc="a" afterSrc="b" [(value)]="v" />`,
    })
    class Host {
      v = 50
    }
    const { fixture, el, flush } = render(Host)
    const host = el.querySelector<HTMLElement>('ui-image-compare')!
    host.getBoundingClientRect = () => ({ left: 0, top: 0, width: 400, height: 200 }) as DOMRect
    const ev = (type: string, x: number) =>
      Object.assign(new Event(type, { bubbles: true }), { clientX: x, clientY: 0, pointerId: 1 })
    host.dispatchEvent(ev('pointerdown', 100))
    flush()
    expect(fixture.componentInstance.v).toBe(25)
    host.dispatchEvent(ev('pointermove', 300))
    flush()
    expect(fixture.componentInstance.v).toBe(75)
    host.dispatchEvent(ev('pointerup', 300))
    host.dispatchEvent(ev('pointermove', 0))
    expect(fixture.componentInstance.v).toBe(75)
  })

  it('4: vertical: clip from the top, divider uses top, Up / Down keys, vertical icon', () => {
    @Component({
      standalone: true,
      imports: [UiImageCompareComponent],
      template: `<ui-image-compare beforeSrc="a" afterSrc="b" orientation="vertical" [defaultValue]="30" />`,
    })
    class Host {}
    const { el, handle, key } = render(Host)
    expect(el.querySelector<HTMLElement>('.absolute.inset-0.size-full:not(img)')!.style.clipPath).toBe(
      'inset(30% 0 0 0)',
    )
    expect(handle().parentElement!.style.top).toBe('30%')
    expect(handle().getAttribute('aria-orientation')).toBe('vertical')
    expect(handle().classList.contains('cursor-ns-resize')).toBe(true)
    expect(handle().querySelector('svg')!.getAttribute('class')).toContain('lucide-move-vertical')
    key(handle(), 'ArrowDown')
    expect(handle().getAttribute('aria-valuenow')).toBe('31')
  })

  it('5: custom handle template, showHandle=false and showLabels=false', () => {
    @Component({
      standalone: true,
      imports: [UiImageCompareComponent],
      template: `<ui-image-compare id="a" beforeSrc="a" afterSrc="b" [handle]="grip" />
        <ui-image-compare id="b" beforeSrc="a" afterSrc="b" [showHandle]="false" [showLabels]="false" />
        <ng-template #grip><i class="grip"></i></ng-template>`,
    })
    class Host {}
    const { el, handle } = render(Host)
    expect(handle('#a').querySelector('.grip')).not.toBeNull()
    expect(handle('#a').querySelector('svg')).toBeNull()
    expect(el.querySelector('#b button')).toBeNull()
    expect(el.querySelector('#b .bg-border')).not.toBeNull()
    expect(el.querySelector('#b span')).toBeNull()
  })

  it('6: disabled: data-disabled, no divider, veil overlay, pointer ignored', () => {
    @Component({
      standalone: true,
      imports: [UiImageCompareComponent],
      template: `<ui-image-compare
        beforeSrc="a"
        afterSrc="b"
        disabled
        [defaultValue]="30"
        (valueChange)="seen.push($event)"
      />`,
    })
    class Host {
      seen: number[] = []
    }
    const { fixture, el } = render(Host)
    const host = el.querySelector<HTMLElement>('ui-image-compare')!
    expect(host.hasAttribute('data-disabled')).toBe(true)
    expect(host.querySelector('.bg-border')).toBeNull()
    expect(host.querySelector('.bg-background\\/40')).not.toBeNull()
    host.dispatchEvent(Object.assign(new Event('pointerdown'), { clientX: 10, pointerId: 1 }))
    expect(fixture.componentInstance.seen).toEqual([])
  })

  it('7: uncontrolled defaultValue moves internally and rounds aria values', () => {
    @Component({
      standalone: true,
      imports: [UiImageCompareComponent],
      template: `<ui-image-compare beforeSrc="a" afterSrc="b" [defaultValue]="25.4" />`,
    })
    class Host {}
    const { handle, key } = render(Host)
    expect(handle().getAttribute('aria-valuenow')).toBe('25')
    key(handle(), 'ArrowRight')
    expect(handle().getAttribute('aria-valuenow')).toBe('26')
    expect(handle().parentElement!.style.left).toBe('26.4%')
  })
})
