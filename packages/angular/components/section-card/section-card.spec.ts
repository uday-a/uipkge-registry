// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiSectionCardComponent } from './section-card.component'

// React SectionCard parity (a Card with header/content/footer). If these break, users see a
// section without the card border/background, header actions or footer wrapped in invented
// divs, a missing description gap, or content that no longer stretches (flex-1).

@Component({
  standalone: true,
  imports: [UiSectionCardComponent],
  template: `
    <div id="a" ui-section-card title="Team" description="People" contentClassName="pt-2" class="max-w-md">
      <button slot="header-action" id="act">Invite</button>
      <p id="body">Body</p>
      <div slot="footer" id="foot">Footer</div>
    </div>
    <div id="b" ui-section-card title="About"><p>Plain</p></div>
  `,
})
class Host {}

function render() {
  const f = TestBed.createComponent(Host)
  f.detectChanges()
  const el = f.nativeElement as HTMLElement
  return { a: el.querySelector('#a') as HTMLElement, b: el.querySelector('#b') as HTMLElement }
}
const has = (el: Element, cls: string) => cls.split(' ').every((c) => el.classList.contains(c))

describe('SectionCard (angular, 6 checks)', () => {
  it('1: host is the Card (card classes, data-slot=card) with flex-col + consumer class', () => {
    const { a } = render()
    expect(a.getAttribute('data-slot')).toBe('card')
    expect(
      has(a, 'bg-card text-card-foreground rounded-xl border shadow-sm overflow-hidden flex flex-col max-w-md'),
    ).toBe(true)
  })
  it('2: header is a CardHeader (pb-4) with an h3 CardTitle', () => {
    const { a } = render()
    const header = a.querySelector('[data-slot=card-header]')!
    expect(header.classList.contains('pb-4')).toBe(true)
    const title = header.querySelector('h3[data-slot=card-title]')!
    expect(title.textContent).toBe('Team')
    expect(has(title, 'text-base font-semibold')).toBe(true)
  })
  it('3: description renders only when set', () => {
    const { a, b } = render()
    expect(a.querySelector('[data-slot=card-description]')!.textContent).toBe('People')
    expect(b.querySelector('[data-slot=card-description]')).toBeNull()
  })
  it('4: header action is projected next to the title block with no wrapper', () => {
    const act = render().a.querySelector('#act')!
    expect(act.parentElement!.className).toBe('flex flex-wrap items-center justify-between gap-2')
  })
  it('5: content is a CardContent with flex-1 + contentClassName', () => {
    const content = render().a.querySelector('[data-slot=card-content]')!
    expect(has(content, 'flex-1 pt-2')).toBe(true)
    expect(content.querySelector('#body')).not.toBeNull()
  })
  it('6: footer renders verbatim after the content, as a direct card child', () => {
    const { a } = render()
    expect(a.lastElementChild!.id).toBe('foot')
  })
})
