// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import {
  HOVER_CARD_CONTENT_CLASS,
  UiHoverCardComponent,
  UiHoverCardContentComponent,
  UiHoverCardTriggerComponent,
} from './hover-card.component'

// Radix HoverCard parity. What users notice when this breaks: the card flashes open on a
// drive-by hover (no open delay), vanishes while they move onto it to click a link (no
// cancel on content enter), never shows for keyboard users (no focus open), sits inline
// inside a paragraph instead of floating (no portal), or cannot be dismissed with Escape.

@Component({
  standalone: true,
  imports: [UiHoverCardComponent, UiHoverCardTriggerComponent, UiHoverCardContentComponent],
  template: `
    <ui-hover-card [openDelay]="openDelay" [closeDelay]="closeDelay" (openChange)="changes.push($event)">
      <a ui-hover-card-trigger href="#">@uipkge</a>
      <ui-hover-card-content class="w-72" [side]="side">
        <p>Card body</p>
        <a href="#">Profile link</a>
      </ui-hover-card-content>
    </ui-hover-card>
  `,
})
class Host {
  openDelay = 700
  closeDelay = 300
  side: 'top' | 'bottom' = 'bottom'
  changes: boolean[] = []
}

const pointer = (type: string, pointerType = 'mouse') => {
  const e = new Event(type, { bubbles: true })
  Object.defineProperty(e, 'pointerType', { value: pointerType })
  return e
}

function setup(patch: Partial<Host> = {}) {
  const fixture = TestBed.createComponent(Host)
  Object.assign(fixture.componentInstance, patch)
  fixture.detectChanges()
  const trigger = fixture.nativeElement.querySelector('[data-slot="hover-card-trigger"]') as HTMLElement
  const card = () => document.querySelector<HTMLElement>('[data-uipkge-portal] [data-slot="hover-card-content"]')
  /** data-state after a change-detection pass (the app would run one on the next tick). */
  const state = (el: Element | null = card()) => {
    fixture.detectChanges()
    return el?.getAttribute('data-state')
  }
  return { fixture, host: fixture.componentInstance, trigger, card, state }
}

describe('HoverCard (angular, 10 checks)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  it('1: hover opens only after openDelay (700ms default), not on a drive-by', () => {
    const { trigger, card, host, state } = setup()
    trigger.dispatchEvent(pointer('pointerenter'))
    vi.advanceTimersByTime(699)
    expect(card()).toBeNull()
    vi.advanceTimersByTime(1)
    expect(state()).toBe('open')
    expect(state(trigger)).toBe('open')
    expect(host.changes).toEqual([true])
  })

  it('2: leaving before the delay elapses cancels the open', () => {
    const { trigger, card } = setup()
    trigger.dispatchEvent(pointer('pointerenter'))
    vi.advanceTimersByTime(300)
    trigger.dispatchEvent(pointer('pointerleave'))
    vi.advanceTimersByTime(2000)
    expect(card()).toBeNull()
  })

  it('3: touch pointers never open the card (excludeTouch)', () => {
    const { trigger, card } = setup()
    trigger.dispatchEvent(pointer('pointerenter', 'touch'))
    vi.advanceTimersByTime(1000)
    expect(card()).toBeNull()
  })

  it('4: keyboard focus opens it too, blur closes after closeDelay', () => {
    const { trigger, state } = setup({ openDelay: 0, closeDelay: 200 })
    trigger.dispatchEvent(new FocusEvent('focus'))
    vi.advanceTimersByTime(0)
    expect(state()).toBe('open')
    trigger.dispatchEvent(new FocusEvent('blur'))
    vi.advanceTimersByTime(199)
    expect(state()).toBe('open')
    vi.advanceTimersByTime(1)
    expect(state()).toBe('closed')
  })

  it('5: moving from the trigger onto the card cancels the pending close', () => {
    const { trigger, card, state } = setup({ openDelay: 0 })
    trigger.dispatchEvent(pointer('pointerenter'))
    vi.advanceTimersByTime(0)
    trigger.dispatchEvent(pointer('pointerleave'))
    vi.advanceTimersByTime(100)
    card()!.dispatchEvent(pointer('pointerenter'))
    vi.advanceTimersByTime(1000)
    expect(state()).toBe('open')
    card()!.dispatchEvent(pointer('pointerleave'))
    vi.advanceTimersByTime(300)
    expect(state()).toBe('closed')
  })

  it('6: content is portalled to <body>, outside the trigger paragraph', () => {
    const { trigger, card, fixture } = setup({ openDelay: 0 })
    trigger.dispatchEvent(pointer('pointerenter'))
    vi.advanceTimersByTime(0)
    expect((fixture.nativeElement as HTMLElement).contains(card())).toBe(false)
    expect(card()!.parentElement!.parentElement).toBe(document.body)
    expect(card()!.textContent).toContain('Card body')
  })

  it('7: Escape dismisses immediately (no close delay)', () => {
    const { trigger, state } = setup({ openDelay: 0, closeDelay: 5000 })
    trigger.dispatchEvent(pointer('pointerenter'))
    vi.advanceTimersByTime(0)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(state()).toBe('closed')
  })

  it('8: a pointer-down outside dismisses, one on the card does not', () => {
    const { trigger, card, state } = setup({ openDelay: 0 })
    trigger.dispatchEvent(pointer('pointerenter'))
    vi.advanceTimersByTime(0)
    card()!
      .querySelector('p')!
      .dispatchEvent(new Event('pointerdown', { bubbles: true }))
    expect(state()).toBe('open')
    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    expect(state()).toBe('closed')
  })

  it('9: React class string verbatim + user class merged; positioned fixed by the popper', () => {
    const { trigger, card } = setup({ openDelay: 0 })
    trigger.dispatchEvent(pointer('pointerenter'))
    vi.advanceTimersByTime(0)
    const cls = card()!.className
    for (const token of HOVER_CARD_CONTENT_CLASS.split(' ').filter((t) => t !== 'w-64')) expect(cls).toContain(token)
    expect(cls).toContain('w-72')
    expect(cls).not.toMatch(/(^| )w-64( |$)/)
    vi.advanceTimersByTime(20)
    expect(card()!.style.position).toBe('fixed')
  })

  it('10: links inside the card leave the tab order (preview, not a tab stop)', async () => {
    const { trigger, card } = setup({ openDelay: 0 })
    trigger.dispatchEvent(pointer('pointerenter'))
    vi.advanceTimersByTime(0)
    await Promise.resolve()
    expect(card()!.querySelector('a')!.getAttribute('tabindex')).toBe('-1')
  })
})
