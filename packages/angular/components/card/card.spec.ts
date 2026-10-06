// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import {
  UiCardActionComponent,
  UiCardComponent,
  UiCardContentComponent,
  UiCardDescriptionComponent,
  UiCardFooterComponent,
  UiCardHeaderComponent,
  UiCardTitleComponent,
} from './card.component'
import { cardVariants } from './card.variants'
import { cardVariants as reactCardVariants } from '../../../registry-react/components/card/card.variants'

// React Card parity. If these break, users see: a card whose border / padding collapse
// because a custom-element part renders inline, a header action that no longer sits in the
// top-right column, or card surfaces that differ from the React page.

@Component({
  standalone: true,
  imports: [
    UiCardComponent,
    UiCardHeaderComponent,
    UiCardTitleComponent,
    UiCardDescriptionComponent,
    UiCardActionComponent,
    UiCardContentComponent,
    UiCardFooterComponent,
  ],
  template: `
    <ui-card id="card" variant="elevated" class="max-w-md">
      <ui-card-header id="header">
        <ui-card-title id="title">Title</ui-card-title>
        <ui-card-description id="desc">Desc</ui-card-description>
        <ui-card-action id="action">A</ui-card-action>
      </ui-card-header>
      <ui-card-content id="content">Body</ui-card-content>
      <ui-card-footer id="footer">Foot</ui-card-footer>
    </ui-card>
    <div ui-card id="native"><h3 ui-card-title id="h3">T</h3></div>
  `,
})
class Host {}

function render() {
  const fixture = TestBed.createComponent(Host)
  fixture.detectChanges()
  return (id: string) => (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(`#${id}`)!
}

describe('Card (angular, 5 checks)', () => {
  it('1: every part carries its React data-slot', () => {
    const q = render()
    const slots = [
      'card',
      'card-header',
      'card-title',
      'card-description',
      'card-action',
      'card-content',
      'card-footer',
    ]
    ;['card', 'header', 'title', 'desc', 'action', 'content', 'footer'].forEach((id, i) =>
      expect(q(id).getAttribute('data-slot')).toBe(slots[i]),
    )
  })

  it('2: custom-element parts are block-level like React div / h3 / p (padding and borders apply)', () => {
    const q = render()
    for (const id of ['card', 'title', 'desc', 'content', 'action'])
      expect(q(id).classList.contains('block'), id).toBe(true)
    expect(q('header').classList.contains('grid')).toBe(true)
    expect(q('footer').classList.contains('flex')).toBe(true)
  })

  it('3: the header reserves an action column (has-data-[slot=card-action]) and the action sits top-right', () => {
    const q = render()
    expect(q('header').className).toContain('has-data-[slot=card-action]:grid-cols-[minmax(0,1fr)_auto]')
    for (const c of ['col-start-2', 'row-start-1', 'justify-self-end'])
      expect(q('action').classList.contains(c)).toBe(true)
  })

  it('4: variant + consumer class merge on the root, overflow-hidden kept', () => {
    const card = render()('card')
    for (const c of ['shadow-md', 'border-transparent', 'overflow-hidden', 'max-w-md'])
      expect(card.classList.contains(c), c).toBe(true)
  })

  it('5: every variant produces the same classes as React cardVariants', () => {
    for (const variant of ['default', 'elevated', 'outline', 'ghost'] as const)
      expect(cardVariants({ variant })).toBe(reactCardVariants({ variant }))
  })
})

describe('Card data-slot', () => {
  // Blocks tag their root card (data-slot="onboarding-wizard") and style or query it by that
  // slot; React keeps the consumer's value, so Angular must not reset it to "card".
  it('keeps "card" by default and a consumer data-slot when given', () => {
    @Component({
      standalone: true,
      imports: [UiCardComponent],
      template: `<ui-card id="a"></ui-card><ui-card id="b" data-slot="my-block"></ui-card>`,
    })
    class Host {}
    const fixture = TestBed.createComponent(Host)
    fixture.detectChanges()
    const el = fixture.nativeElement as HTMLElement
    expect(el.querySelector('#a')!.getAttribute('data-slot')).toBe('card')
    expect(el.querySelector('#b')!.getAttribute('data-slot')).toBe('my-block')
  })
})
