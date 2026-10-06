// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiQRCodeComponent, type QRCodeStatus, type QRCodeType } from './qr-code.component'

// QrCode, as sign-in / share pages use it. If these break, users see: an empty frame instead
// of a scannable code, the SVG variant blank (sanitised away), no "Expired" / "Scanned" /
// "Loading..." overlay (or a Refresh button that does nothing), no Download link, or the
// frame / border not matching the requested size.

@Component({
  standalone: true,
  imports: [UiQRCodeComponent],
  template: `
    <ng-template #extraTpl><button id="extra">Change URL</button></ng-template>
    @if (withRefresh) {
      <ui-qr-code
        [value]="value"
        [type]="type"
        [size]="120"
        [status]="status"
        [bordered]="bordered"
        [icon]="icon"
        (refresh)="refreshes = refreshes + 1"
      />
    } @else {
      <ui-qr-code
        [value]="value"
        [type]="type"
        [size]="120"
        [status]="status"
        [bordered]="bordered"
        [extra]="useExtra ? extraTpl : undefined"
      />
    }
  `,
})
class Host {
  value = 'https://uipkge.dev'
  type: QRCodeType = 'canvas'
  status: QRCodeStatus = 'active'
  bordered = true
  icon?: string
  withRefresh = false
  useExtra = false
  refreshes = 0
}

async function render(init: Partial<Host> = {}) {
  const f = TestBed.createComponent(Host)
  Object.assign(f.componentInstance, init)
  f.detectChanges()
  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 10))
    f.detectChanges()
    const el = f.nativeElement.querySelector('ui-qr-code') as HTMLElement
    if (el.querySelector('img[src^="data:"], svg path') || init.status === 'loading') break
  }
  const el = f.nativeElement.querySelector('ui-qr-code') as HTMLElement
  return { f, el, frame: el.firstElementChild as HTMLElement }
}

describe('QrCode (angular, 8 checks)', () => {
  it('1: canvas type renders a PNG data URL image sized to the frame', async () => {
    const { el, frame } = await render()
    const img = frame.querySelector('img')!
    expect(img.getAttribute('src')).toMatch(/^data:image\/png;base64,/)
    expect(img.alt).toBe('QR Code for https://uipkge.dev')
    expect(frame.style.width).toBe('120px')
    expect(frame.style.height).toBe('120px')
    expect(el.getAttribute('data-slot')).toBe('qr-code')
  })

  it('2: svg type injects real SVG markup (not sanitised away)', async () => {
    const { frame } = await render({ type: 'svg' })
    expect(frame.querySelector('svg')).not.toBeNull()
    expect(frame.querySelector('img')).toBeNull()
  })

  it('3: bordered adds React frame classes; bordered=false removes them', async () => {
    const on = (await render()).el.classList
    expect(['bg-background', 'rounded-lg', 'border', 'p-4'].every((c) => on.contains(c))).toBe(true)
    const off = (await render({ bordered: false })).el.classList
    expect(off.contains('border') || off.contains('p-4')).toBe(false)
  })

  it('4: active canvas shows a Download link; extra template replaces it', async () => {
    const plain = await render()
    expect([...plain.el.querySelectorAll('button')].map((b) => b.textContent?.trim())).toEqual(['Download'])
    const withExtra = await render({ useExtra: true })
    expect(withExtra.el.querySelector('#extra')).not.toBeNull()
    expect(withExtra.el.textContent).not.toContain('Download')
  })

  it('5: expired overlay offers Refresh only when (refresh) is bound, and emits', async () => {
    const unbound = await render({ status: 'expired' })
    expect(unbound.el.textContent).toContain('Expired')
    expect(unbound.el.textContent).not.toContain('Refresh')
    const { el, f } = await render({ status: 'expired', withRefresh: true })
    const btn = [...el.querySelectorAll('button')].find((b) => b.textContent?.includes('Refresh'))!
    btn.click()
    expect(f.componentInstance.refreshes).toBe(1)
  })

  it('6: scanned shows a check overlay and no Download', async () => {
    const { el } = await render({ status: 'scanned' })
    expect(el.textContent).toContain('Scanned')
    expect(el.querySelector('svg.lucide-check')).not.toBeNull()
    expect(el.textContent).not.toContain('Download')
  })

  it('7: loading sets aria-busy and a spinning loader', async () => {
    const { el } = await render({ status: 'loading' })
    expect(el.getAttribute('aria-busy')).toBe('true')
    expect(el.querySelector('svg.animate-spin')).not.toBeNull()
    expect(el.textContent).toContain('Loading...')
  })

  it('8: icon overlay renders centred while active', async () => {
    const { frame } = await render({ icon: 'https://x/logo.png', withRefresh: true })
    const icon = frame.querySelector('img[src="https://x/logo.png"]')!
    expect((icon.parentElement as HTMLElement).style.width).toBe('40px')
  })
})
