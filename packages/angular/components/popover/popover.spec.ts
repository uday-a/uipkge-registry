// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest'
import { Component, provideZonelessChangeDetection, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import {
  UiPopoverAnchorComponent,
  UiPopoverComponent,
  UiPopoverContentComponent,
  UiPopoverTriggerComponent,
  type PopoverCloseBehavior,
} from './popover.component'

// Behaviour parity with the Radix Popover the React registry wraps. If these break,
// users notice: the trigger does nothing, the panel renders inline instead of floating
// next to its trigger (or anchor), Escape / outside clicks stop dismissing -- or
// dismiss despite closeBehavior -- keyboard focus is lost after closing, and a
// `persist` popover forgets its state on reload.

const tick = (ms = 0) => new Promise((r) => setTimeout(r, ms))

@Component({
  standalone: true,
  imports: [UiPopoverComponent, UiPopoverTriggerComponent, UiPopoverContentComponent, UiPopoverAnchorComponent],
  template: `
    <button id="outside">Outside</button>
    <ui-popover
      [open]="controlled() ? open() : undefined"
      [closeBehavior]="closeBehavior()"
      [persist]="persist()"
      (openChange)="changes.push($event); open.set($event)"
    >
      @if (anchored()) {
        <div id="anchor" ui-popover-anchor>Anchor</div>
      }
      <button id="trigger" ui-popover-trigger>Open</button>
      <ui-popover-content class="w-80" side="bottom" align="start">
        <input id="width" />
        <button id="inner-close" ui-popover-trigger>Close</button>
      </ui-popover-content>
    </ui-popover>
  `,
})
class HostComponent {
  readonly controlled = signal(false)
  readonly open = signal(false)
  readonly closeBehavior = signal<PopoverCloseBehavior>('auto')
  readonly persist = signal<string | boolean>(false)
  readonly anchored = signal(false)
  changes: boolean[] = []
}

async function setup(init: (h: HostComponent) => void = () => {}) {
  TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] })
  const fixture = TestBed.createComponent(HostComponent)
  init(fixture.componentInstance)
  document.body.appendChild(fixture.nativeElement)
  fixture.detectChanges()
  await fixture.whenStable()
  const $ = <T extends HTMLElement>(sel: string) => fixture.nativeElement.querySelector(sel) as T
  const panel = () => document.querySelector<HTMLElement>('[data-uipkge-portal] [data-slot="popover-content"]')
  const settle = async () => {
    fixture.detectChanges()
    await tick()
    await fixture.whenStable()
  }
  return { fixture, host: fixture.componentInstance, trigger: $<HTMLButtonElement>('#trigger'), $, panel, settle }
}

const escape = () =>
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
const pointerDown = (el: Element) => el.dispatchEvent(new Event('pointerdown', { bubbles: true }))

describe('Popover (angular, 10 checks)', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    localStorage.clear()
  })

  it('1: closed by default; trigger advertises a dialog popup', async () => {
    const { trigger, panel } = await setup()
    expect(panel()).toBeNull()
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(trigger.getAttribute('data-state')).toBe('closed')
  })

  it('2: trigger click portals a role=dialog panel with the React classes (consumer width wins)', async () => {
    const { trigger, panel, settle, host } = await setup()
    trigger.click()
    await settle()
    const el = panel()!
    expect(el.getAttribute('role')).toBe('dialog')
    expect(el.getAttribute('data-state')).toBe('open')
    expect(el.classList.contains('w-80')).toBe(true)
    expect(el.classList.contains('w-72')).toBe(false)
    expect(el.classList.contains('origin-(--radix-popover-content-transform-origin)')).toBe(true)
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(trigger.getAttribute('aria-controls')).toBe(el.id)
    expect(host.changes).toEqual([true])
  })

  it('3: panel is placed against the anchor when a PopoverAnchor exists (side / align / sideOffset)', async () => {
    const { $, trigger, panel, settle } = await setup((h) => h.anchored.set(true))
    $<HTMLElement>('#anchor').getBoundingClientRect = () =>
      ({ top: 100, bottom: 120, left: 50, right: 150, width: 100, height: 20, x: 50, y: 100 }) as DOMRect
    trigger.click()
    await settle()
    await tick(30)
    const el = panel()!
    expect(el.style.position).toBe('fixed')
    expect(el.style.top).toBe('124px') // anchor bottom + default sideOffset 4
    expect(el.style.left).toBe('50px') // align="start"
    expect(el.getAttribute('data-side')).toBe('bottom')
    expect(el.getAttribute('data-align')).toBe('start')
  })

  it('4: focus moves to the first field on open and back to the trigger on Escape', async () => {
    const { trigger, panel, settle } = await setup()
    trigger.focus()
    trigger.click()
    await settle()
    expect(document.activeElement?.id).toBe('width')
    escape()
    await settle()
    await tick()
    expect(panel()).toBeNull()
    expect(document.activeElement).toBe(trigger)
  })

  it('5: outside pointer-down dismisses; pointer-downs inside the panel or on the trigger do not', async () => {
    const { $, trigger, panel, settle, host } = await setup()
    trigger.click()
    await settle()
    pointerDown(panel()!.querySelector('#width')!)
    pointerDown(trigger)
    await settle()
    expect(host.changes).toEqual([true])
    pointerDown($('#outside'))
    await settle()
    expect(host.changes).toEqual([true, false])
  })

  it('6: closeBehavior="manual" ignores Escape and outside clicks; a trigger inside the panel closes it', async () => {
    const { $, trigger, panel, settle, host } = await setup((h) => h.closeBehavior.set('manual'))
    trigger.click()
    await settle()
    escape()
    pointerDown($('#outside'))
    await settle()
    expect(panel()!.getAttribute('data-state')).toBe('open')
    panel()!.querySelector<HTMLButtonElement>('#inner-close')!.click()
    await settle()
    expect(host.changes).toEqual([true, false])
  })

  it('7: closeBehavior="click-outside" suppresses Escape but still closes on outside click', async () => {
    const { $, trigger, settle, host } = await setup((h) => h.closeBehavior.set('click-outside'))
    trigger.click()
    await settle()
    escape()
    await settle()
    expect(host.changes).toEqual([true])
    pointerDown($('#outside'))
    await settle()
    expect(host.changes).toEqual([true, false])
  })

  it('8: closeBehavior="esc" suppresses outside clicks but still closes on Escape', async () => {
    const { $, trigger, settle, host } = await setup((h) => h.closeBehavior.set('esc'))
    trigger.click()
    await settle()
    pointerDown($('#outside'))
    await settle()
    expect(host.changes).toEqual([true])
    escape()
    await settle()
    expect(host.changes).toEqual([true, false])
  })

  it('9: focus leaving the panel (Tab out) dismisses, like Radix onFocusOutside', async () => {
    const { $, trigger, settle, host } = await setup()
    trigger.click()
    await settle()
    $<HTMLButtonElement>('#outside').focus()
    await settle()
    expect(host.changes).toEqual([true, false])
  })

  it('10: persist writes localStorage and a fresh popover with the same key reopens', async () => {
    const first = await setup((h) => h.persist.set('demo-persist-1'))
    first.trigger.click()
    await first.settle()
    expect(localStorage.getItem('demo-persist-1')).toBe('1')
    first.fixture.destroy()
    document.body.innerHTML = ''
    TestBed.resetTestingModule()
    const second = await setup((h) => h.persist.set('demo-persist-1'))
    await second.settle()
    expect(second.panel()).not.toBeNull()
    expect(second.trigger.getAttribute('aria-expanded')).toBe('true')
    escape()
    await second.settle()
    expect(localStorage.getItem('demo-persist-1')).toBeNull()
  })
})
