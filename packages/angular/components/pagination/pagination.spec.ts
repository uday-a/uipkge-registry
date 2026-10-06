// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import {
  UiPaginationComponent,
  UiPaginationEllipsisComponent,
  UiPaginationFirstComponent,
  UiPaginationLastComponent,
  UiPaginationListComponent,
  UiPaginationListItemComponent,
  UiPaginationNextComponent,
  UiPaginationPrevComponent,
} from './pagination.component'

// Pagination parity with the React (presentational) parts. If these break, users see: the bar
// loses its "Pagination" navigation landmark or list semantics, the icon-only edge buttons
// have no accessible name, clicking Next does nothing (or submits a surrounding form), a
// disabled bar stays clickable, or the default chevron / ellipsis icons vanish.

@Component({
  standalone: true,
  imports: [
    UiPaginationComponent,
    UiPaginationListComponent,
    UiPaginationListItemComponent,
    UiPaginationFirstComponent,
    UiPaginationPrevComponent,
    UiPaginationNextComponent,
    UiPaginationLastComponent,
    UiPaginationEllipsisComponent,
  ],
  template: `
    <form (submit)="submitted = true; $event.preventDefault()">
      <nav ui-pagination>
        <ul ui-pagination-list class="gap-2">
          <li ui-pagination-list-item>
            <button ui-pagination-first [disabled]="disabled" (click)="page = 1"></button>
          </li>
          <li ui-pagination-list-item>
            <button ui-pagination-prev [disabled]="disabled" (click)="page = page - 1"></button>
          </li>
          <li ui-pagination-list-item><span ui-pagination-ellipsis class="px-2"></span></li>
          <li ui-pagination-list-item><span ui-pagination-ellipsis id="text-ell">…</span></li>
          <li ui-pagination-list-item>
            <button ui-pagination-next class="nav-btn" [disabled]="disabled" (click)="page = page + 1">Next</button>
          </li>
          <li ui-pagination-list-item><button ui-pagination-last aria-label="Last" (click)="page = 10"></button></li>
        </ul>
      </nav>
    </form>
  `,
})
class Host {
  page = 3
  disabled = false
  submitted = false
}

function render(init: Partial<Host> = {}) {
  const fixture = TestBed.createComponent(Host)
  Object.assign(fixture.componentInstance, init)
  fixture.detectChanges()
  const root = fixture.nativeElement as HTMLElement
  const btn = (kind: string) => root.querySelector<HTMLButtonElement>(`[ui-pagination-${kind}]`)!
  return { fixture, root, host: fixture.componentInstance, btn }
}

describe('Pagination (angular, 8 checks)', () => {
  it('1: root is a nav labelled "Pagination" with the React base class', () => {
    const nav = render().root.querySelector('[data-slot="pagination"]')!
    expect(nav.tagName).toBe('NAV')
    expect(nav.getAttribute('aria-label')).toBe('Pagination')
    expect(nav.className.split(' ')).toEqual(expect.arrayContaining(['flex', 'items-center', 'gap-1']))
  })

  it('2: list is a ul whose gap can be overridden; items are shrink-0 li', () => {
    const { root } = render()
    const list = root.querySelector('[data-slot="pagination-list"]')!
    expect(list.tagName).toBe('UL')
    expect(list.className.split(' ')).toContain('gap-2')
    expect(list.className.split(' ')).not.toContain('gap-1')
    const item = root.querySelector('[data-slot="pagination-list-item"]')!
    expect(item.tagName).toBe('LI')
    expect(item.className).toBe('shrink-0')
  })

  it('3: edge buttons carry the React default aria-labels; consumer label wins', () => {
    const { btn } = render()
    expect(btn('first').getAttribute('aria-label')).toBe('Go to first page')
    expect(btn('prev').getAttribute('aria-label')).toBe('Go to previous page')
    expect(btn('next').getAttribute('aria-label')).toBe('Go to next page')
    expect(btn('last').getAttribute('aria-label')).toBe('Last')
  })

  it('4: edge buttons are type="button" so they never submit a form', () => {
    const { btn, host, fixture } = render()
    btn('next').click()
    fixture.detectChanges()
    expect(btn('next').getAttribute('type')).toBe('button')
    expect(host.submitted).toBe(false)
    expect(host.page).toBe(4)
  })

  it('5: empty edge buttons fall back to the chevron icons; projected content replaces them', () => {
    const { btn } = render()
    expect(btn('first').querySelector('svg.lucide-chevrons-left.size-4')).not.toBeNull()
    expect(btn('prev').querySelector('svg.lucide-chevron-left')).not.toBeNull()
    expect(btn('last').querySelector('svg.lucide-chevrons-right')).not.toBeNull()
    expect(btn('next').querySelector('svg')).toBeNull()
    expect(btn('next').textContent).toBe('Next')
    expect(btn('next').className).toBe('nav-btn')
  })

  it('6: disabled edge buttons are natively disabled and ignore clicks', () => {
    const { btn, host, fixture } = render({ disabled: true })
    expect(btn('prev').disabled).toBe(true)
    btn('prev').click()
    fixture.detectChanges()
    expect(host.page).toBe(3)
  })

  it('7: ellipsis is aria-hidden with the MoreHorizontal fallback', () => {
    const { root } = render()
    const [icon, text] = [...root.querySelectorAll<HTMLElement>('[ui-pagination-ellipsis]')]
    expect(icon!.getAttribute('aria-hidden')).toBe('true')
    expect(icon!.querySelector('svg.lucide-ellipsis')).not.toBeNull()
    expect(icon!.className).toBe('px-2')
    expect(text!.querySelector('svg')).toBeNull()
    expect(text!.textContent).toBe('…')
  })

  it('8: previous button moves the caller-owned page back', () => {
    const { btn, host, fixture } = render()
    btn('prev').click()
    btn('prev').click()
    fixture.detectChanges()
    expect(host.page).toBe(1)
    btn('last').click()
    expect(host.page).toBe(10)
  })
})
