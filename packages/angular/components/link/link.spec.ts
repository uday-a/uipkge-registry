// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiLinkComponent } from './link.component'
import { linkVariants } from './link.variants'
import { linkVariants as reactLinkVariants } from '../../../registry-react/components/link/link.variants'

// React Link parity. If these break, users see: external links opening in the same tab (or
// internal ones in a new tab), a disabled link that still navigates / is tabbable / opens a
// new tab, icon slots rendered in the wrong order, or a <ui-link> element you cannot reach
// with the keyboard.

@Component({
  standalone: true,
  imports: [UiLinkComponent],
  template: `
    <a ui-link id="ext" href="https://uipkge.dev">Ext</a>
    <a ui-link id="int" href="/about">Int</a>
    <a ui-link id="forced" href="https://uipkge.dev" [external]="false">Same tab</a>
    <div (click)="clicks = clicks + 1"><a ui-link id="dis" href="https://uipkge.dev" disabled>Off</a></div>
    <a ui-link id="to" href="/a" to="/b">To</a>
    <a ui-link id="icons" href="#"><i slot="right" id="r"></i>Label<i slot="left" id="l"></i></a>
    <ui-link id="el" href="/x">El</ui-link>
    <button ui-link id="child" href="#" class="px-2 py-1">Button</button>
  `,
})
class Host {
  clicks = 0
}

function render() {
  const fixture = TestBed.createComponent(Host)
  fixture.detectChanges()
  const q = (id: string) => (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(`#${id}`)!
  return { q, host: fixture.componentInstance }
}

describe('Link (angular, 7 checks)', () => {
  it('1: http(s) hrefs open in a new tab with rel=noopener; relative hrefs stay in-tab', () => {
    const { q } = render()
    expect(q('ext').getAttribute('target')).toBe('_blank')
    expect(q('ext').getAttribute('rel')).toBe('noopener noreferrer')
    expect(q('int').hasAttribute('target')).toBe(false)
    expect(q('forced').hasAttribute('target')).toBe(false)
  })

  it('2: disabled drops href, is not external, leaves the tab order and swallows clicks (no default, no bubbling)', () => {
    const { q, host } = render()
    const a = q('dis')
    expect(a.hasAttribute('href')).toBe(false)
    expect(a.hasAttribute('target')).toBe(false)
    expect(a.getAttribute('aria-disabled')).toBe('true')
    expect(a.getAttribute('tabindex')).toBe('-1')
    expect(a.hasAttribute('data-disabled')).toBe(true)
    expect(a.classList.contains('pointer-events-none')).toBe(true)
    const ev = new MouseEvent('click', { bubbles: true, cancelable: true })
    a.dispatchEvent(ev)
    expect(ev.defaultPrevented).toBe(true)
    expect(host.clicks).toBe(0)
  })

  it('3: a string `to` wins over href (router destination)', () => {
    expect(render().q('to').getAttribute('href')).toBe('/b')
  })

  it('4: left / right slots render around the label regardless of source order', () => {
    const ids = [...render().q('icons').children].map((c) => c.id)
    expect(ids).toEqual(['l', 'r'])
    expect(render().q('icons').textContent).toBe('Label')
  })

  it('5: data-* attributes only appear for props that were passed (React leaves them undefined)', () => {
    const a = render().q('int')
    expect(a.getAttribute('data-slot')).toBe('link')
    expect(a.hasAttribute('data-underline')).toBe(false)
    expect(a.hasAttribute('data-color')).toBe(false)
  })

  it('6: the <ui-link> element is a focusable role="link"; asChild form keeps the child element', () => {
    const { q } = render()
    expect(q('el').getAttribute('role')).toBe('link')
    expect(q('el').getAttribute('tabindex')).toBe('0')
    const b = q('child')
    expect(b.tagName).toBe('BUTTON')
    for (const c of ['px-2', 'py-1', 'text-primary']) expect(b.classList.contains(c), c).toBe(true)
  })

  it('7: every underline x color x size produces the same classes as React linkVariants', () => {
    for (const underline of ['none', 'always', 'hover', undefined] as const)
      for (const color of ['default', 'primary', 'muted', undefined] as const)
        for (const size of ['sm', 'default', 'lg', undefined] as const)
          expect(linkVariants({ underline, color, size })).toBe(reactLinkVariants({ underline, color, size }))
  })
})
