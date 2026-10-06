// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component, ElementRef } from '@angular/core'
import { create, elementRef } from '../../test-utils/inject'
import { TestBed } from '@angular/core/testing'
import { UiWatermarkComponent, buildWatermarkUrl } from './watermark.component'

// Watermark, as the demos use it. If these break, users see: the CONFIDENTIAL / DRAFT stamp
// disappears (no tiled background), the overlay swallows clicks on the content behind it
// (or stops blocking in "preview only" mode), screen readers read the stamp, or the text in
// the SVG breaks on characters like < & ".

@Component({
  standalone: true,
  imports: [UiWatermarkComponent],
  template: `<ui-watermark [content]="content" [interactive]="interactive" [zIndex]="z" class="rounded-lg border p-6"
    ><p id="child">Report</p></ui-watermark
  >`,
})
class Host {
  content = 'CONFIDENTIAL'
  interactive = false
  z = 9
}

function decode(url: string): string {
  return decodeURIComponent(escape(atob(url.replace('data:image/svg+xml;base64,', ''))))
}

function render(init: Partial<Host> = {}) {
  const f = TestBed.createComponent(Host)
  Object.assign(f.componentInstance, init)
  f.detectChanges()
  const host = f.nativeElement.querySelector('ui-watermark') as HTMLElement
  const cmp = f.debugElement.children[0].componentInstance as UiWatermarkComponent
  const overlay = () => host.querySelector('[data-slot=watermark-overlay]') as HTMLElement
  return { f, host, cmp, overlay }
}

describe('Watermark (angular, 8 checks)', () => {
  it('1: defaults match React (-22deg, gap 100, 0.08, 16px, currentColor, sans-serif, z 9)', () => {
    const c = create(UiWatermarkComponent, [{ provide: ElementRef, useValue: elementRef('div') }])
    expect([
      c.rotate,
      c.gap,
      c.opacity,
      c.fontSize,
      c.color,
      c.fontFamily,
      c.fontWeight,
      c.zIndex,
      c.interactive,
    ]).toEqual([-22, 100, 0.08, 16, 'currentColor', 'sans-serif', 'normal', 9, false])
  })

  it('2: projects content and renders an aria-hidden overlay after it', () => {
    const { host, overlay } = render()
    expect(host.getAttribute('data-slot')).toBe('watermark')
    expect(host.className).toContain('relative')
    expect(host.className).toContain('p-6')
    expect(host.firstElementChild?.id).toBe('child')
    expect(overlay().getAttribute('aria-hidden')).toBe('true')
    expect(overlay().className).toBe('absolute inset-0 overflow-hidden')
  })

  it('3: no background until the host has a measured size (jsdom has no layout)', () => {
    const { overlay } = render()
    expect(overlay().style.backgroundImage).toBe('')
  })

  it('4: once measured the overlay tiles an SVG with the text', () => {
    const { f, cmp, overlay } = render()
    cmp.size.set({ width: 400, height: 200 })
    f.detectChanges()
    const bg = overlay().style.backgroundImage
    expect(bg).toContain('data:image/svg+xml;base64,')
    expect(decode(cmp.url)).toContain('>CONFIDENTIAL</text>')
    expect(overlay().style.backgroundRepeat).toBe('repeat')
  })

  it('5: overlay lets clicks through by default, blocks them when interactive', () => {
    expect(render().overlay().style.pointerEvents).toBe('none')
    expect(render({ interactive: true }).overlay().style.pointerEvents).toBe('auto')
  })

  it('6: zIndex lands on the overlay', () => {
    expect(render({ z: 42 }).overlay().style.zIndex).toBe('42')
  })

  it('7: text is XML-escaped and rotated around the tile origin', () => {
    const svg = decode(
      buildWatermarkUrl({
        width: 1,
        height: 1,
        content: `<A & "B">`,
        rotate: -30,
        gap: 100,
        opacity: 0.1,
        fontSize: 20,
        color: 'red',
        fontFamily: 'serif',
        fontWeight: 700,
      }),
    )
    expect(svg).toContain('&lt;A &amp; &quot;B&quot;&gt;')
    expect(svg).toContain('rotate(-30 50 60)')
    expect(svg).toContain('fill="red"')
    expect(svg).toContain('font-weight="700"')
  })

  it('8: image mode tiles the image and ignores text; empty content draws nothing', () => {
    const base = {
      width: 1,
      height: 1,
      rotate: -15,
      gap: 120,
      opacity: 0.3,
      fontSize: 16,
      color: 'currentColor',
      fontFamily: 'sans-serif',
      fontWeight: 'normal',
    }
    const svg = decode(buildWatermarkUrl({ ...base, content: 'X', image: 'https://x/logo.png' }))
    expect(svg).toContain('<image href="https://x/logo.png"')
    expect(svg).not.toContain('<text')
    expect(buildWatermarkUrl({ ...base, content: '' })).toBe('')
  })
})
