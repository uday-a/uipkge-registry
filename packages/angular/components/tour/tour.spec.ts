// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component, provideZonelessChangeDetection, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiTourComponent, type TourStep } from './tour.component'

// Behaviour parity with the React Tour. If these break, users notice: starting the tour
// shows nothing (or renders inside the page instead of over it), Next / Previous / Finish
// don't move through the steps, Escape and the X don't dismiss, the page isn't dimmed (or
// can't be un-dimmed per step), keyboard focus isn't moved into the card or isn't given
// back afterwards, and a target-less step isn't centered.

const tick = (ms = 0) => new Promise((r) => setTimeout(r, ms))

@Component({
  standalone: true,
  imports: [UiTourComponent],
  template: `
    <button id="start">Start</button>
    <button id="a">A</button>
    <button id="b">B</button>
    <ui-tour
      [open]="open()"
      [current]="current()"
      [steps]="steps"
      [type]="type()"
      (openChange)="open.set($event)"
      (currentChange)="current.set($event)"
      (change)="changes.push($event)"
      (finish)="events.push('finish')"
      (close)="events.push('close')"
    />
  `,
})
class HostComponent {
  readonly open = signal(false)
  readonly current = signal(0)
  readonly type = signal<'default' | 'primary'>('default')
  steps: TourStep[] = [
    { target: '#a', title: 'First', description: 'Step one' },
    { target: () => document.getElementById('b'), title: 'Second', mask: false, nextButtonText: 'Onward' },
    { title: 'Centered', finishButtonText: 'Done' },
  ]
  changes: number[] = []
  events: string[] = []
}

async function setup(init: (h: HostComponent) => void = () => {}) {
  TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] })
  const fixture = TestBed.createComponent(HostComponent)
  init(fixture.componentInstance)
  document.body.appendChild(fixture.nativeElement)
  fixture.detectChanges()
  await fixture.whenStable()
  const settle = async (ms = 0) => {
    fixture.detectChanges()
    await tick(ms)
    await fixture.whenStable()
    fixture.detectChanges()
  }
  const card = () => document.querySelector<HTMLElement>('[data-uipkge-portal] [data-slot="tour-card"]')
  const button = (text: string) =>
    Array.from(card()!.querySelectorAll('button')).find((b) => b.textContent!.trim() === text) as HTMLButtonElement
  const mask = () => document.querySelector('[data-uipkge-portal] svg mask')
  const start = async () => {
    ;(fixture.nativeElement.querySelector('#start') as HTMLElement).focus()
    fixture.componentInstance.open.set(true)
    await settle(20)
  }
  return { fixture, host: fixture.componentInstance, settle, card, button, mask, start }
}

describe('Tour (angular, 8 checks)', () => {
  it('1: renders nothing until open, then a portalled aria-modal dialog labelled by the step title', async () => {
    const t = await setup()
    expect(t.card()).toBeNull()
    expect((t.fixture.nativeElement.querySelector('ui-tour') as HTMLElement).hidden).toBe(true)
    await t.start()
    const card = t.card()!
    expect(card.getAttribute('role')).toBe('dialog')
    expect(card.getAttribute('aria-modal')).toBe('true')
    expect(document.getElementById(card.getAttribute('aria-labelledby')!)?.textContent).toBe('First')
    expect(document.getElementById(card.getAttribute('aria-describedby')!)?.textContent).toBe('Step one')
    expect(card.textContent).toContain('1 / 3')
  })

  it('2: moves focus into the card on open and restores it on close', async () => {
    const t = await setup()
    await t.start()
    expect(document.activeElement).toBe(t.card())
    t.host.open.set(false)
    await t.settle()
    expect(t.card()).toBeNull()
    expect(document.activeElement?.id).toBe('start')
  })

  it('3: Next / Previous walk the steps and emit currentChange + change; custom button text', async () => {
    const t = await setup()
    await t.start()
    expect(t.button('Previous')).toBeUndefined()
    t.button('Next').click()
    await t.settle()
    expect(t.card()!.textContent).toContain('Second')
    expect(t.button('Onward')).toBeDefined()
    t.button('Previous').click()
    await t.settle()
    expect(t.card()!.textContent).toContain('First')
    expect(t.host.changes).toEqual([1, 0])
    expect(t.host.current()).toBe(0)
  })

  it('4: the last step shows Finish, which emits finish and openChange(false)', async () => {
    const t = await setup((h) => h.current.set(2))
    await t.start()
    t.button('Done').click()
    await t.settle()
    expect(t.host.events).toEqual(['finish'])
    expect(t.card()).toBeNull()
  })

  it('5: Escape and the close button emit close and dismiss', async () => {
    const t = await setup()
    await t.start()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await t.settle()
    expect(t.host.events).toEqual(['close'])
    expect(t.card()).toBeNull()
    await t.start()
    ;(t.card()!.querySelector('[aria-label="Close tour"]') as HTMLButtonElement).click()
    await t.settle()
    expect(t.host.events).toEqual(['close', 'close'])
    expect(t.card()).toBeNull()
  })

  it('6: the mask dims the page with a cutout over the target; a step can turn it off', async () => {
    const t = await setup()
    await t.start()
    expect(t.mask()).not.toBeNull()
    expect(t.mask()!.querySelectorAll('rect').length).toBe(2) // full sheet + cutout
    t.host.current.set(1)
    await t.settle(20)
    expect(t.mask()).toBeNull()
  })

  it('7: a step without a target is centered; with a target the card is placed next to it', async () => {
    const t = await setup((h) => h.current.set(2))
    await t.start()
    expect(t.card()!.style.transform).toBe('translate(-50%, -50%)')
    expect(t.card()!.style.width).toBe('320px')
    t.host.current.set(0)
    await t.settle(20)
    expect(t.card()!.style.transform).toBe('')
    expect(t.card()!.style.top).toMatch(/px$/)
  })

  it('8: type=primary inverts the card and uses secondary buttons', async () => {
    const t = await setup((h) => h.type.set('primary'))
    await t.start()
    expect(t.card()!.className).toContain('bg-primary')
    expect(t.button('Next').getAttribute('data-variant')).toBe('secondary')
  })
})
