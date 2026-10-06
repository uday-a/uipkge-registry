// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import {
  UiListComponent,
  UiListItemComponent,
  UiListItemContentComponent,
  UiListItemTitleComponent,
  UiListSubheaderComponent,
} from './list.component'

// React List parity. If these break, users see hover affordances on static rows (or missing on
// links), a disabled row that still navigates/click-fires or stays in the tab order, the active
// row not highlighted, or structured rows (media + content + actions) no longer laid out in a row.

@Component({
  standalone: true,
  imports: [
    UiListComponent,
    UiListItemComponent,
    UiListItemContentComponent,
    UiListItemTitleComponent,
    UiListSubheaderComponent,
  ],
  template: `
    <ul ui-list class="max-w-md">
      <div ui-list-subheader>Account</div>
      <li id="plain" ui-list-item>Inbox</li>
      <li id="active" ui-list-item active>Drafts</li>
      <li id="off" ui-list-item disabled (click)="clicks = clicks + 1">Nope</li>
      <a id="link" ui-list-item href="#docs">Docs</a>
      <a id="offlink" ui-list-item href="#x" disabled>Off</a>
      <li id="btn" ui-list-item interactive (click)="clicks = clicks + 1">
        <div ui-list-item-content><div ui-list-item-title>T</div></div>
      </li>
    </ul>
  `,
})
class Host {
  clicks = 0
}

function render() {
  const f = TestBed.createComponent(Host)
  f.detectChanges()
  const q = (id: string) => (f.nativeElement as HTMLElement).querySelector('#' + id) as HTMLElement
  return { f, q, root: (f.nativeElement as HTMLElement).querySelector('[data-slot=list]') as HTMLElement }
}

const has = (el: Element, cls: string) => cls.split(' ').every((c) => el.classList.contains(c))

describe('List (angular, 7 checks)', () => {
  it('1: root keeps list-none + vertical rhythm and merges class', () => {
    const { root } = render()
    expect(root.tagName).toBe('UL')
    expect(has(root, 'list-none space-y-1')).toBe(true)
    expect(root.className).toContain('max-w-md')
  })
  it('2: static items get no hover/pointer affordance', () => {
    expect(render().q('plain').className).not.toContain('cursor-pointer')
  })
  it('3: anchors and interactive items get hover/pointer affordance', () => {
    const { q } = render()
    expect(q('link').className).toContain('hover:bg-accent')
    expect(q('link').getAttribute('href')).toBe('#docs')
    expect(q('btn').className).toContain('cursor-pointer')
  })
  it('4: active item is highlighted and marked aria-current', () => {
    const a = render().q('active')
    expect(has(a, 'bg-accent text-accent-foreground')).toBe(true)
    expect(a.getAttribute('aria-current')).toBe('true')
    expect(a.hasAttribute('data-active')).toBe(true)
  })
  it('5: disabled item is dimmed, untabbable and swallows clicks', () => {
    const { f, q } = render()
    const off = q('off')
    expect(off.getAttribute('aria-disabled')).toBe('true')
    expect(off.getAttribute('tabindex')).toBe('-1')
    expect(off.className).toContain('opacity-50')
    const ev = new MouseEvent('click', { bubbles: true, cancelable: true })
    off.dispatchEvent(ev)
    expect(ev.defaultPrevented).toBe(true)
    expect(f.componentInstance.clicks).toBe(0)
    q('btn').click()
    expect(f.componentInstance.clicks).toBe(1)
  })
  it('6: disabled anchors drop their href', () => {
    expect(render().q('offlink').hasAttribute('href')).toBe(false)
  })
  it('7: subheader uses React classes; structured row switches to flex via has-[]', () => {
    const { f, q } = render()
    const sub = (f.nativeElement as HTMLElement).querySelector('[data-slot=list-subheader]')!
    expect(has(sub, 'px-2 py-1 text-xs font-medium tracking-wider uppercase')).toBe(true)
    expect(q('btn').className).toContain('has-[>[data-slot=list-item-content]]:flex')
  })
})
