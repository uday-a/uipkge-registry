// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiAlertComponent, UiAlertDescriptionComponent, UiAlertTitleComponent } from './alert.component'
import { alertVariants } from './alert.variants'
import { alertVariants as reactAlertVariants } from '../../../registry-react/components/alert/alert.variants'

// Angular icons are <lucide-icon><svg/></lucide-icon>, so the Angular variants also target
// `lucide-icon > svg` wherever React targets a direct `> svg` child. Fold that back before
// comparing; every other class must match React byte for byte.
const foldIcons = (s: string) =>
  s.replaceAll('[&>svg,&>lucide-icon>svg]:', '[&>svg]:').replaceAll('has-[>svg,>lucide-icon]:', 'has-[>svg]:')

// React Alert parity. If these break, users see: `icon="error"` rendering no glyph (and the
// text no longer indented by the [&>svg] layout), the `title` shorthand popping up as a native
// browser tooltip, a title / description that is inline (mb-1 ignored), or custom-element
// titles that screen readers do not treat as headings.

@Component({
  standalone: true,
  imports: [UiAlertComponent, UiAlertTitleComponent, UiAlertDescriptionComponent],
  template: `
    <div ui-alert id="short" variant="destructive" icon="error" title="Error" text="Session expired"></div>
    <ui-alert id="comp">
      <svg id="own"></svg>
      <ui-alert-title id="t">Heads up</ui-alert-title>
      <ui-alert-description id="d">Body</ui-alert-description>
    </ui-alert>
    <div ui-alert id="h">
      <h5 ui-alert-title id="h5">T</h5>
      <ui-alert-title id="t2" as="h2">T2</ui-alert-title>
    </div>
  `,
})
class Host {}

function render() {
  const fixture = TestBed.createComponent(Host)
  fixture.detectChanges()
  return (id: string) => (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(`#${id}`)!
}

describe('Alert (angular, 6 checks)', () => {
  it('1: role="alert" + data-slot, block-level host with the variant classes', () => {
    const a = render()('short')
    expect(a.getAttribute('role')).toBe('alert')
    expect(a.getAttribute('data-slot')).toBe('alert')
    for (const c of ['block', 'relative', 'w-full', 'text-destructive']) expect(a.classList.contains(c), c).toBe(true)
  })

  it('2: icon renders the built-in Lucide glyph as the FIRST direct child (for [&>svg] layout)', () => {
    const a = render()('short')
    const first = a.firstElementChild!
    expect(first.tagName.toLowerCase()).toBe('svg')
    expect(first.getAttribute('class')).toContain('lucide-circle-alert')
    expect(first.getAttribute('aria-hidden')).toBe('true')
  })

  it('3: title / text shorthands render title + description and never a native tooltip', () => {
    const a = render()('short')
    expect(a.hasAttribute('title')).toBe(false)
    expect(a.querySelector('[data-slot=alert-title]')!.textContent!.trim()).toBe('Error')
    expect(a.querySelector('[data-slot=alert-description]')!.textContent!.trim()).toBe('Session expired')
  })

  it('4: composition children stay direct children (own svg first, then title / description)', () => {
    const q = render()
    const kids = [...q('comp').children].map((c) => c.id)
    expect(kids).toEqual(['own', 't', 'd'])
  })

  it('5: title / description custom elements are block-level; the title is a level-5 heading by default', () => {
    const q = render()
    expect(q('t').classList.contains('block')).toBe(true)
    expect(q('d').classList.contains('block')).toBe(true)
    expect(q('t').getAttribute('role')).toBe('heading')
    expect(q('t').getAttribute('aria-level')).toBe('5')
    expect(q('t2').getAttribute('aria-level')).toBe('2')
    expect(q('h5').hasAttribute('role')).toBe(false)
  })

  it('6: every variant produces the same classes as React alertVariants', () => {
    for (const variant of ['default', 'destructive'] as const)
      expect(foldIcons(alertVariants({ variant }))).toBe(reactAlertVariants({ variant }))
  })
})
