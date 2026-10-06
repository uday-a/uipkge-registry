// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiButtonComponent } from './button.component'
import { buttonVariants } from './button.variants'
import { buttonVariants as reactButtonVariants } from '../../../registry-react/components/button/button.variants'

// Angular icons are <lucide-icon><svg/></lucide-icon>, so the Angular variants also target
// `lucide-icon > svg` wherever React targets a direct `> svg` child. Fold that back before
// comparing; every other class must match React byte for byte.
const foldIcons = (s: string) =>
  s.replaceAll('[&>svg,&>lucide-icon>svg]:', '[&>svg]:').replaceAll('has-[>svg,>lucide-icon]:', 'has-[>svg]:')

// React Button parity, as the demos use it. If these break, users see: a button inside a
// form submits it on click (missing type="button"), a [disabled] button still clicks and
// never dims (input swallowed, native attribute never set), an <a ui-button> gets a bogus
// type attribute, the <ui-button> element is not reachable by keyboard, or the classes
// drift from React (different size / colours than the React page).

@Component({
  standalone: true,
  imports: [UiButtonComponent],
  template: `
    <form (submit)="submits = submits + 1; $event.preventDefault()">
      <button ui-button id="plain" (click)="clicks = clicks + 1">Save</button>
      <button ui-button id="submit" type="submit">Go</button>
      <button ui-button id="dis" [disabled]="disabled" (click)="clicks = clicks + 1">Off</button>
    </form>
    <a ui-button id="link" href="#x" variant="link">Docs</a>
    <ui-button id="custom" [disabled]="disabled" (click)="customClicks = customClicks + 1">Custom</ui-button>
    <button ui-button id="styled" variant="outline" size="sm" class="w-full">Styled</button>
  `,
})
class Host {
  readonly disabledSig = signal(true)
  get disabled(): boolean {
    return this.disabledSig()
  }
  set disabled(v: boolean) {
    this.disabledSig.set(v)
  }
  clicks = 0
  customClicks = 0
  submits = 0
}

function render(init: Partial<Host> = {}) {
  const fixture = TestBed.createComponent(Host)
  Object.assign(fixture.componentInstance, init)
  document.body.appendChild(fixture.nativeElement)
  fixture.detectChanges()
  const q = (id: string) => (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(`#${id}`)!
  return { fixture, host: fixture.componentInstance, q }
}

describe('Button (angular, 7 checks)', () => {
  it('1: a native button defaults to type="button", so clicking it inside a form does not submit', () => {
    const { q, host } = render()
    expect(q('plain').getAttribute('type')).toBe('button')
    q('plain').click()
    expect(host.clicks).toBe(1)
    expect(host.submits).toBe(0)
  })

  it('2: type="submit" is forwarded and submits the form', () => {
    const { q } = render()
    expect(q('submit').getAttribute('type')).toBe('submit')
  })

  it('3: [disabled] sets the native disabled attribute and toggles off again', () => {
    const { q, fixture, host } = render()
    const btn = q('dis') as HTMLButtonElement
    expect(btn.disabled).toBe(true)
    btn.click()
    expect(host.clicks).toBe(0)
    host.disabled = false
    fixture.detectChanges()
    expect(btn.disabled).toBe(false)
  })

  it('4: on an anchor (asChild form) no type / disabled attribute is added', () => {
    const { q } = render()
    const a = q('link')
    expect(a.hasAttribute('type')).toBe(false)
    expect(a.getAttribute('href')).toBe('#x')
    expect(a.getAttribute('data-variant')).toBe('link')
  })

  it('5: the <ui-button> element gets role=button, is focusable and activates with Enter / Space', () => {
    const { q, fixture, host } = render({ disabled: false })
    const el = q('custom')
    expect(el.getAttribute('role')).toBe('button')
    expect(el.getAttribute('tabindex')).toBe('0')
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    el.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
    expect(host.customClicks).toBe(2)
    host.disabled = true
    fixture.detectChanges()
    expect(el.getAttribute('aria-disabled')).toBe('true')
    expect(el.getAttribute('tabindex')).toBe('-1')
  })

  it('6: data-slot / data-variant / data-size and merged classes match React', () => {
    const { q } = render()
    const el = q('styled')
    expect(el.getAttribute('data-slot')).toBe('button')
    expect(el.getAttribute('data-variant')).toBe('outline')
    expect(el.getAttribute('data-size')).toBe('sm')
    for (const c of ['w-full', 'border', 'bg-background', 'h-8']) expect(el.classList.contains(c), c).toBe(true)
  })

  it('7: every variant x size produces the same classes as the React buttonVariants', () => {
    const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const
    const sizes = ['default', 'sm', 'lg', 'xs', 'icon', 'icon-sm', 'icon-lg', 'icon-xs', 'icon-2xs'] as const
    for (const variant of variants)
      for (const size of sizes)
        expect(foldIcons(buttonVariants({ variant, size }))).toBe(reactButtonVariants({ variant, size }))
  })
})
