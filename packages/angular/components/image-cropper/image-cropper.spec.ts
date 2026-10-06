// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component, ViewChild } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiImageCropperComponent } from './image-cropper.component'

// React ImageCropper parity: once the image loads it is cover-scaled into the viewport and
// centred, dragging / arrow keys pan it but never past the image edge, wheel / + / - / the
// range zoom within [minZoom, maxZoom], and disabled ignores all of it. If these broke, the
// image would sit uncropped, drift out of the frame, or zoom without limits.

function render<T>(cmp: new () => T) {
  const fixture = TestBed.createComponent(cmp)
  fixture.detectChanges()
  const el = fixture.nativeElement as HTMLElement
  const viewport = () => el.querySelector<HTMLElement>('[data-slot="image-cropper-viewport"]')!
  const img = () => el.querySelector<HTMLImageElement>('[data-slot="image-cropper-image"]')!
  /** jsdom has no layout: give the viewport 200x200 and the image 400x200 natural pixels, then "load" it. */
  const load = () => {
    Object.defineProperty(viewport(), 'clientWidth', { value: 200 })
    Object.defineProperty(viewport(), 'clientHeight', { value: 200 })
    Object.defineProperty(img(), 'naturalWidth', { value: 400 })
    Object.defineProperty(img(), 'naturalHeight', { value: 200 })
    img().dispatchEvent(new Event('load'))
    fixture.detectChanges()
  }
  const key = (k: string) => {
    viewport().dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }))
    fixture.detectChanges()
  }
  return { fixture, el, viewport, img, load, key, flush: () => fixture.detectChanges() }
}

describe('ImageCropper (angular, 7 checks)', () => {
  it('1: renders React DOM: flex column host, focusable application viewport at aspect 1, centred image', () => {
    @Component({
      standalone: true,
      imports: [UiImageCropperComponent],
      template: `<ui-image-cropper src="a.jpg" alt="Coast" />`,
    })
    class Host {}
    const { el, viewport, img } = render(Host)
    const host = el.querySelector('ui-image-cropper')!
    for (const c of ['flex', 'w-full', 'max-w-md', 'flex-col', 'gap-3'])
      expect(host.classList.contains(c), c).toBe(true)
    expect(viewport().getAttribute('role')).toBe('application')
    expect(viewport().getAttribute('tabindex')).toBe('0')
    expect(viewport().style.aspectRatio).toBe('1')
    expect(viewport().classList.contains('cursor-grab')).toBe(true)
    expect(img().getAttribute('alt')).toBe('Coast')
    expect(img().style.transform).toBe('translate(-50%, -50%)')
    expect(el.querySelector('[data-slot="image-cropper-zoom"]')).toBeNull()
  })

  it('2: on load the image is cover-scaled (height fills, width overflows)', () => {
    @Component({ standalone: true, imports: [UiImageCropperComponent], template: `<ui-image-cropper src="a.jpg" />` })
    class Host {}
    const { img, load } = render(Host)
    load()
    expect(img().style.width).toBe('400px')
    expect(img().style.height).toBe('200px')
  })

  it('3: arrow keys pan by 8px, clamped to the overflow (100px each side, none vertically)', () => {
    @Component({ standalone: true, imports: [UiImageCropperComponent], template: `<ui-image-cropper src="a.jpg" />` })
    class Host {}
    const { img, load, key } = render(Host)
    load()
    key('ArrowRight')
    expect(img().style.transform).toBe('translate(calc(-50% + 8px), calc(-50% + 0px))')
    key('ArrowDown')
    expect(img().style.transform).toBe('translate(calc(-50% + 8px), calc(-50% + 0px))')
    for (let i = 0; i < 20; i++) key('ArrowRight')
    expect(img().style.transform).toBe('translate(calc(-50% + 100px), calc(-50% + 0px))')
  })

  it('4: pointer drag pans the image (clamped)', () => {
    @Component({ standalone: true, imports: [UiImageCropperComponent], template: `<ui-image-cropper src="a.jpg" />` })
    class Host {}
    const { viewport, img, load, flush } = render(Host)
    load()
    const ev = (type: string, x: number) =>
      Object.assign(new Event(type, { bubbles: true }), { clientX: x, clientY: 0, pointerId: 1 })
    viewport().dispatchEvent(ev('pointerdown', 50))
    viewport().dispatchEvent(ev('pointermove', 20))
    flush()
    expect(img().style.transform).toBe('translate(calc(-50% + -30px), calc(-50% + 0px))')
    viewport().dispatchEvent(ev('pointerup', 20))
    viewport().dispatchEvent(ev('pointermove', 500))
    flush()
    expect(img().style.transform).toBe('translate(calc(-50% + -30px), calc(-50% + 0px))')
  })

  it('5: wheel / + / - / range zoom within [minZoom, maxZoom]; [(zoom)] binds', () => {
    @Component({
      standalone: true,
      imports: [UiImageCropperComponent],
      template: `<ui-image-cropper src="a.jpg" showZoom [maxZoom]="2" [(zoom)]="z" />`,
    })
    class Host {
      z = 1
    }
    const { fixture, el, viewport, load, key, flush } = render(Host)
    load()
    const wheel = new WheelEvent('wheel', { deltaY: -1, cancelable: true })
    viewport().dispatchEvent(wheel)
    flush()
    expect(wheel.defaultPrevented).toBe(true)
    expect(fixture.componentInstance.z).toBeCloseTo(1.12)
    key('+')
    expect(fixture.componentInstance.z).toBeCloseTo(1.32)
    const range = el.querySelector<HTMLInputElement>('input[type=range]')!
    expect(range.step).toBe('0.05')
    range.value = '2'
    range.dispatchEvent(new Event('input'))
    flush()
    key('=')
    expect(fixture.componentInstance.z).toBe(2)
    expect(el.querySelector('.tabular-nums')!.textContent).toBe('2.0×')
    key('-')
    expect(fixture.componentInstance.z).toBeCloseTo(1.8)
  })

  it('6: disabled ignores keys, wheel and drag; viewport dims', () => {
    @Component({
      standalone: true,
      imports: [UiImageCropperComponent],
      template: `<ui-image-cropper src="a.jpg" disabled showZoom />`,
    })
    class Host {}
    const { el, viewport, img, load, key } = render(Host)
    load()
    expect(viewport().hasAttribute('data-disabled')).toBe(true)
    expect(viewport().classList.contains('opacity-60')).toBe(true)
    key('ArrowRight')
    key('+')
    const wheel = new WheelEvent('wheel', { deltaY: -1, cancelable: true })
    viewport().dispatchEvent(wheel)
    expect(wheel.defaultPrevented).toBe(false)
    expect(img().style.transform).toBe('translate(calc(-50% + 0px), calc(-50% + 0px))')
    expect(el.querySelector('.tabular-nums')!.textContent).toBe('1.0×')
  })

  it('7: getCroppedCanvas / getCroppedBlob are null before the image loads; rounded=full circles the viewport', async () => {
    @Component({
      standalone: true,
      imports: [UiImageCropperComponent],
      template: `<ui-image-cropper src="a.jpg" rounded="full" [aspectRatio]="16 / 9" />`,
    })
    class Host {
      @ViewChild(UiImageCropperComponent) cropper!: UiImageCropperComponent
    }
    const { fixture, viewport } = render(Host)
    expect(viewport().classList.contains('rounded-full')).toBe(true)
    expect(viewport().style.aspectRatio).toContain('1.77')
    expect(fixture.componentInstance.cropper.getCroppedCanvas()).toBeNull()
    await expect(fixture.componentInstance.cropper.getCroppedBlob()).resolves.toBeNull()
  })
})
