// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import {
  UiBreadcrumbComponent,
  UiBreadcrumbEllipsisComponent,
  UiBreadcrumbItemComponent,
  UiBreadcrumbLinkComponent,
  UiBreadcrumbListComponent,
  UiBreadcrumbPageComponent,
  UiBreadcrumbSeparatorComponent,
} from './breadcrumb.component'

// Breadcrumb parity with the React parts (nav > ol > li > a / span). If these break, users see:
// screen readers lose the "breadcrumb" landmark or the current-page marker, the default chevron
// separator disappears (or doubles up next to a custom one), separators get announced, the
// collapsed "More" ellipsis loses its label, or consumer classes (hidden md:inline-flex) stop
// overriding the base layout.

@Component({
  standalone: true,
  imports: [
    UiBreadcrumbComponent,
    UiBreadcrumbListComponent,
    UiBreadcrumbItemComponent,
    UiBreadcrumbLinkComponent,
    UiBreadcrumbPageComponent,
    UiBreadcrumbSeparatorComponent,
    UiBreadcrumbEllipsisComponent,
  ],
  template: `
    <nav ui-breadcrumb>
      <ol ui-breadcrumb-list class="extra-list">
        <li ui-breadcrumb-item><a ui-breadcrumb-link href="/docs">Docs</a></li>
        <li ui-breadcrumb-separator id="auto"></li>
        <li ui-breadcrumb-item class="hidden md:inline-flex"><span ui-breadcrumb-ellipsis></span></li>
        <li ui-breadcrumb-separator id="custom">·</li>
        <li ui-breadcrumb-item><span ui-breadcrumb-page>Routing</span></li>
      </ol>
    </nav>
  `,
})
class Host {}

function render() {
  const fixture = TestBed.createComponent(Host)
  fixture.detectChanges()
  const root = fixture.nativeElement as HTMLElement
  const q = <T extends HTMLElement>(sel: string) => root.querySelector<T>(sel)!
  return { root, q }
}

describe('Breadcrumb (angular, 8 checks)', () => {
  it('1: root is a nav landmark labelled "breadcrumb"', () => {
    const nav = render().q('[data-slot="breadcrumb"]')
    expect(nav.tagName).toBe('NAV')
    expect(nav.getAttribute('aria-label')).toBe('breadcrumb')
  })

  it('2: list keeps the React class string and merges consumer classes', () => {
    const list = render().q('[data-slot="breadcrumb-list"]')
    expect(list.tagName).toBe('OL')
    const cls = list.className.split(' ')
    for (const t of 'text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5 extra-list'.split(
      ' ',
    ))
      expect(cls).toContain(t)
  })

  it('3: link is a real anchor with its href', () => {
    const a = render().q<HTMLAnchorElement>('[data-slot="breadcrumb-link"]')
    expect(a.tagName).toBe('A')
    expect(a.getAttribute('href')).toBe('/docs')
    expect(a.className).toContain('hover:underline')
  })

  it('4: page is marked aria-current="page"', () => {
    const page = render().q('[data-slot="breadcrumb-page"]')
    expect(page.getAttribute('aria-current')).toBe('page')
    expect(page.textContent).toBe('Routing')
  })

  it('5: empty separator falls back to the ChevronRight icon', () => {
    const sep = render().q('#auto')
    expect(sep.querySelector('svg.lucide-chevron-right')).not.toBeNull()
    expect(sep.className.split(' ')).toContain('[&>svg,&>lucide-icon>svg]:size-3.5')
  })

  it('6: projected separator content replaces the chevron', () => {
    const sep = render().q('#custom')
    expect(sep.querySelector('svg')).toBeNull()
    expect(sep.textContent).toBe('·')
  })

  it('7: separators are hidden from assistive tech', () => {
    const { root } = render()
    for (const sep of root.querySelectorAll('[data-slot="breadcrumb-separator"]')) {
      expect(sep.getAttribute('role')).toBe('presentation')
      expect(sep.getAttribute('aria-hidden')).toBe('true')
    }
  })

  it('8: ellipsis renders the More icon + sr-only label; item classes override display', () => {
    const { q } = render()
    const ell = q('[data-slot="breadcrumb-ellipsis"]')
    expect(ell.querySelector('svg.lucide-ellipsis')).not.toBeNull()
    expect(ell.querySelector('.sr-only')?.textContent).toBe('More')
    const item = ell.parentElement!
    expect(item.className.split(' ')).toContain('hidden')
    expect(item.className.split(' ')).not.toContain('inline-flex')
  })
})
