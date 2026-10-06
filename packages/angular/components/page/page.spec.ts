// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import {
  UiPageBodyComponent,
  UiPageComponent,
  UiPageHeaderComponent,
  UiPageHeaderHeadingComponent,
} from './page.component'

// React Page parity. If these break, users see header actions wrapped in an extra div (an empty
// gap when there are none), the page title demoted/promoted to the wrong heading level, a stray
// empty description paragraph, or sections losing their vertical rhythm.

@Component({
  standalone: true,
  imports: [UiPageComponent, UiPageBodyComponent, UiPageHeaderComponent, UiPageHeaderHeadingComponent],
  template: `
    <div ui-page>
      <div id="h1" ui-page-header>
        <div ui-page-header-heading title="Reports" description="Sales"></div>
        <ng-container ngProjectAs="[slot=actions]"><button id="a1">A</button><button id="a2">B</button></ng-container>
      </div>
      <div id="h2" ui-page-header><div ui-page-header-heading title="Settings"></div></div>
      <div ui-page-body class="mt-2">Body</div>
    </div>
  `,
})
class Host {}

function render() {
  const f = TestBed.createComponent(Host)
  f.detectChanges()
  return f.nativeElement as HTMLElement
}
const has = (el: Element, cls: string) => cls.split(' ').every((c) => el.classList.contains(c))

describe('Page (angular, 5 checks)', () => {
  it('1: page root stacks sections with space-y-6', () => {
    expect(has(render().querySelector('[data-slot=page]')!, 'space-y-6')).toBe(true)
  })
  it('2: header renders heading column then the actions directly (no wrapper)', () => {
    const h = render().querySelector('#h1')!
    expect([...h.children].map((c) => c.tagName + (c.id ? '#' + c.id : ''))).toEqual(['DIV', 'BUTTON#a1', 'BUTTON#a2'])
    expect(h.children[0].className).toBe('flex-1')
    expect(has(h, 'flex flex-col justify-between gap-4 sm:flex-row sm:items-center')).toBe(true)
  })
  it('3: header without actions renders only the heading column', () => {
    expect(render().querySelector('#h2')!.children.length).toBe(1)
  })
  it('4: heading is an h2 plus optional description', () => {
    const el = render()
    const [withDesc, noDesc] = [...el.querySelectorAll('[data-slot=page-header-heading]')]
    expect(withDesc.querySelector('h2')!.textContent).toBe('Reports')
    expect(withDesc.querySelector('h2')!.className).toBe('text-xl font-bold tracking-tight')
    expect(withDesc.querySelector('p')!.textContent!.trim()).toBe('Sales')
    expect(noDesc.querySelector('p')).toBeNull()
  })
  it('5: body is a plain region that merges class', () => {
    const b = render().querySelector('[data-slot=page-body]')!
    expect(b.classList.contains('mt-2')).toBe(true)
    expect(b.textContent).toBe('Body')
  })
})
