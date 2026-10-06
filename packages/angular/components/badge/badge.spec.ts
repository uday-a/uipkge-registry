// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiBadgeComponent } from './badge.component'
import { badgeVariants } from './badge.variants'
import { badgeVariants as reactBadgeVariants } from '../../../registry-react/components/badge/badge.variants'

// Angular icons are <lucide-icon><svg/></lucide-icon>, so the Angular variants also target
// `lucide-icon > svg` wherever React targets a direct `> svg` child. Fold that back before
// comparing; every other class must match React byte for byte.
const foldIcons = (s: string) =>
  s.replaceAll('[&>svg,&>lucide-icon>svg]:', '[&>svg]:').replaceAll('has-[>svg,>lucide-icon]:', 'has-[>svg]:')

// React Badge parity. If these break, users see: a bare `wrap` attribute ignored so long
// labels get clipped instead of flowing onto two lines, a badge on an <a> losing its hover
// tone, or colours / geometry that differ from the React page.

@Component({
  standalone: true,
  imports: [UiBadgeComponent],
  template: `
    <span ui-badge id="plain">New</span>
    <span ui-badge id="wrap" variant="warning" wrap>Long label</span>
    <a ui-badge id="link" href="#" variant="secondary" class="px-3">Link</a>
    <ui-badge id="el" variant="info">Info</ui-badge>
  `,
})
class Host {}

function render() {
  const fixture = TestBed.createComponent(Host)
  fixture.detectChanges()
  return (id: string) => (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(`#${id}`)!
}

describe('Badge (angular, 5 checks)', () => {
  it('1: renders data-slot="badge" with the default variant classes', () => {
    const el = render()('plain')
    expect(el.getAttribute('data-slot')).toBe('badge')
    for (const c of ['inline-flex', 'rounded-full', 'bg-primary']) expect(el.classList.contains(c), c).toBe(true)
  })

  it('2: a bare wrap attribute enables multi-line labels (whitespace-normal + rounded-lg)', () => {
    const el = render()('wrap')
    expect(el.classList.contains('whitespace-normal')).toBe(true)
    expect(el.classList.contains('rounded-lg')).toBe(true)
    expect(el.classList.contains('whitespace-nowrap')).toBe(false)
  })

  it('3: on an anchor (asChild form) it keeps href and merges consumer classes', () => {
    const el = render()('link')
    expect(el.getAttribute('href')).toBe('#')
    expect(el.classList.contains('px-3')).toBe(true)
    expect(el.classList.contains('px-2')).toBe(false)
  })

  it('4: the <ui-badge> element form is inline-flex, so it lays out like the React <span>', () => {
    expect(render()('el').classList.contains('inline-flex')).toBe(true)
  })

  it('5: every variant x wrap produces the same classes as React badgeVariants', () => {
    for (const variant of ['default', 'secondary', 'destructive', 'outline', 'success', 'warning', 'info'] as const)
      for (const wrap of [true, undefined])
        expect(foldIcons(badgeVariants({ variant, wrap }))).toBe(reactBadgeVariants({ variant, wrap }))
  })
})
