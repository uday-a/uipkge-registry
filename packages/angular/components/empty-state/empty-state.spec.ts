// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiEmptyStateComponent } from './empty-state.component'

// React EmptyState parity. If these break, users see: the icon rendered as literal text (or
// unsized / announced by screen readers), the heading level ignoring `headingTag` (broken
// document outline), error states that are not announced assertively, a native tooltip showing
// the title, or actions dropped.

@Component({
  standalone: true,
  imports: [UiEmptyStateComponent],
  template: `
    <ng-template #inbox><svg id="svg" class="lucide lucide-inbox"></svg></ng-template>
    <ui-empty-state id="a" title="No messages" description="Nothing yet." [icon]="inbox">
      <button id="act">New</button>
    </ui-empty-state>
    <div ui-empty-state id="b" title="Broken" role="alert" headingTag="h2" class="py-8"></div>
  `,
})
class Host {}

function render() {
  const fixture = TestBed.createComponent(Host)
  fixture.detectChanges()
  return (id: string) => (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(`#${id}`)!
}

describe('EmptyState (angular, 5 checks)', () => {
  it('1: centered flex column with the React class string; className merges', () => {
    const q = render()
    for (const c of ['flex', 'flex-col', 'items-center', 'py-12', 'text-center'])
      expect(q('a').classList.contains(c), c).toBe(true)
    expect(q('b').classList.contains('py-8')).toBe(true)
    expect(q('b').classList.contains('py-12')).toBe(false)
  })

  it('2: status + polite by default, alert + assertive for errors', () => {
    const q = render()
    expect(q('a').getAttribute('role')).toBe('status')
    expect(q('a').getAttribute('aria-live')).toBe('polite')
    expect(q('b').getAttribute('role')).toBe('alert')
    expect(q('b').getAttribute('aria-live')).toBe('assertive')
  })

  it('3: icon template renders first, sized + muted + aria-hidden (own classes kept)', () => {
    const a = render()('a')
    const svg = a.firstElementChild!
    expect(svg.id).toBe('svg')
    for (const c of ['text-muted-foreground', 'mx-auto', 'mb-3', 'size-10', 'lucide-inbox'])
      expect(svg.classList.contains(c), c).toBe(true)
    expect(svg.getAttribute('aria-hidden')).toBe('true')
  })

  it('4: heading uses headingTag (h3 default); description + projected actions render', () => {
    const q = render()
    expect(q('a').querySelector('h3')!.textContent).toBe('No messages')
    expect(q('b').querySelector('h2')!.textContent).toBe('Broken')
    expect(q('b').querySelector('h3')).toBeNull()
    expect(q('a').querySelector('p')!.textContent).toBe('Nothing yet.')
    expect(q('a').querySelector('#act')).not.toBeNull()
  })

  it('5: title never becomes a native tooltip', () => {
    expect(render()('a').hasAttribute('title')).toBe(false)
  })
})
