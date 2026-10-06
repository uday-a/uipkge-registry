// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest'
import { Component, provideZonelessChangeDetection, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import {
  UiDialogCloseComponent,
  UiDialogComponent,
  UiDialogContentComponent,
  UiDialogDescriptionComponent,
  UiDialogFooterComponent,
  UiDialogHeaderComponent,
  UiDialogScrollContentComponent,
  UiDialogTitleComponent,
  UiDialogTriggerComponent,
  type DialogDismissEvent,
} from './dialog.component'

// Behaviour parity with the Radix Dialog the React registry wraps. If these break,
// users notice: the trigger does nothing, the dialog renders inline in the page
// instead of over it, Escape / overlay clicks stop closing (or close when a
// consumer vetoed it), screen readers lose the dialog's name, and keyboard focus
// is stranded in the page after closing.

const tick = () => new Promise((r) => setTimeout(r, 0))

@Component({
  standalone: true,
  imports: [
    UiDialogComponent,
    UiDialogTriggerComponent,
    UiDialogContentComponent,
    UiDialogScrollContentComponent,
    UiDialogHeaderComponent,
    UiDialogFooterComponent,
    UiDialogTitleComponent,
    UiDialogDescriptionComponent,
    UiDialogCloseComponent,
  ],
  template: `
    <ui-dialog [open]="controlled() ? open() : undefined" (openChange)="changes.push($event); open.set($event)">
      <button id="trigger" ui-dialog-trigger>Open</button>
      @if (scroll()) {
        <ui-dialog-scroll-content class="extra-class">
          <h2 ui-dialog-title>Terms</h2>
        </ui-dialog-scroll-content>
      } @else {
        <ui-dialog-content
          class="sm:max-w-md"
          (escapeKeyDown)="onEscape($event)"
          (pointerDownOutside)="onOutside($event)"
        >
          <ui-dialog-header>
            <h2 ui-dialog-title>Edit profile</h2>
            <p ui-dialog-description>Make changes.</p>
          </ui-dialog-header>
          <input id="name" />
          <ui-dialog-footer [showCloseButton]="true">
            <button id="cancel" ui-dialog-close>Cancel</button>
          </ui-dialog-footer>
        </ui-dialog-content>
      }
    </ui-dialog>
  `,
})
class HostComponent {
  readonly controlled = signal(false)
  readonly open = signal(false)
  readonly scroll = signal(false)
  blockEscape = false
  blockOutside = false
  changes: boolean[] = []
  onEscape(e: DialogDismissEvent): void {
    if (this.blockEscape) e.preventDefault()
  }
  onOutside(e: DialogDismissEvent): void {
    if (this.blockOutside) e.preventDefault()
  }
}

async function setup(init: (h: HostComponent) => void = () => {}) {
  TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] })
  const fixture = TestBed.createComponent(HostComponent)
  init(fixture.componentInstance)
  document.body.appendChild(fixture.nativeElement)
  fixture.detectChanges()
  await fixture.whenStable()
  const trigger = fixture.nativeElement.querySelector('#trigger') as HTMLButtonElement
  const content = () => document.querySelector<HTMLElement>('[data-uipkge-portal] [data-slot="dialog-content"]')
  const overlay = () => document.querySelector<HTMLElement>('[data-uipkge-portal] [data-slot="dialog-overlay"]')
  const settle = async () => {
    fixture.detectChanges()
    await tick()
    await fixture.whenStable()
  }
  return { fixture, host: fixture.componentInstance, trigger, content, overlay, settle }
}

const escape = () =>
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
const pointerDown = (el: Element) => el.dispatchEvent(new Event('pointerdown', { bubbles: true }))

describe('Dialog (angular, 10 checks)', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    document.body.style.overflow = ''
  })

  it('1: closed by default -- nothing is portalled and the trigger reports collapsed', async () => {
    const { trigger, content } = await setup()
    expect(content()).toBeNull()
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(trigger.getAttribute('data-state')).toBe('closed')
    expect(trigger.getAttribute('type')).toBe('button')
  })

  it('2: trigger click opens a body-portalled dialog over an overlay, with React classes', async () => {
    const { trigger, content, overlay, settle, host } = await setup()
    trigger.click()
    await settle()
    const panel = content()!
    expect(panel).not.toBeNull()
    expect(panel.getAttribute('data-state')).toBe('open')
    expect(overlay()!.getAttribute('data-state')).toBe('open')
    const hasAll = (el: Element, tokens: string) => tokens.split(' ').every((t) => el.classList.contains(t))
    expect(hasAll(overlay()!, 'bg-foreground/50 fixed inset-0 z-50')).toBe(true)
    // cn() merges the consumer width over the default sm:max-w-lg.
    expect(panel.className).toContain('sm:max-w-md')
    expect(panel.className).not.toContain('sm:max-w-lg')
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(trigger.getAttribute('aria-controls')).toBe(panel.id)
    expect(host.changes).toEqual([true])
  })

  it('3: content is named and described by Title / Description (role=dialog)', async () => {
    const { trigger, content, settle } = await setup()
    trigger.click()
    await settle()
    const panel = content()!
    expect(panel.getAttribute('role')).toBe('dialog')
    const title = document.getElementById(panel.getAttribute('aria-labelledby')!)!
    const description = document.getElementById(panel.getAttribute('aria-describedby')!)!
    expect(title.textContent).toBe('Edit profile')
    expect(title.tagName).toBe('H2')
    expect(description.textContent).toBe('Make changes.')
  })

  it('4: focus moves into the dialog on open and returns to the trigger on close', async () => {
    const { trigger, content, settle } = await setup()
    trigger.focus()
    trigger.click()
    await settle()
    expect(content()!.contains(document.activeElement)).toBe(true)
    escape()
    await settle()
    await tick()
    expect(content()).toBeNull()
    expect(document.activeElement).toBe(trigger)
  })

  it('5: Escape closes; a consumer preventDefault on escapeKeyDown keeps it open', async () => {
    const { trigger, content, settle, host } = await setup((h) => (h.blockEscape = true))
    trigger.click()
    await settle()
    escape()
    await settle()
    expect(content()).not.toBeNull()
    host.blockEscape = false
    escape()
    await settle()
    expect(host.changes).toEqual([true, false])
  })

  it('6: overlay pointer-down dismisses; clicks inside the content do not', async () => {
    const { trigger, content, overlay, settle, host } = await setup()
    trigger.click()
    await settle()
    pointerDown(content()!.querySelector('#name')!)
    await settle()
    expect(host.changes).toEqual([true])
    pointerDown(overlay()!)
    await settle()
    expect(host.changes).toEqual([true, false])
  })

  it('7: pointerDownOutside preventDefault vetoes the overlay dismiss (AlertModal relies on this)', async () => {
    const { trigger, overlay, content, settle, host } = await setup((h) => (h.blockOutside = true))
    trigger.click()
    await settle()
    pointerDown(overlay()!)
    await settle()
    expect(content()!.getAttribute('data-state')).toBe('open')
    expect(host.changes).toEqual([true])
  })

  it('8: Close directive, the built-in X and the footer Close button all close', async () => {
    const { trigger, content, settle, host } = await setup()
    for (const selector of ['#cancel', 'button.absolute', '[data-slot="dialog-footer"] [data-variant="outline"]']) {
      trigger.click()
      await settle()
      const btn = content()!.querySelector<HTMLButtonElement>(selector)!
      expect(btn).not.toBeNull()
      btn.click()
      await settle()
    }
    expect(host.changes).toEqual([true, false, true, false, true, false])
  })

  it('9: modal open locks page scroll and releases it on close', async () => {
    const { trigger, settle } = await setup()
    trigger.click()
    await settle()
    expect(document.body.style.overflow).toBe('hidden')
    escape()
    await settle()
    expect(document.body.style.overflow).toBe('')
  })

  it('10: controlled open renders without a click; ScrollContent nests content inside a scrolling overlay', async () => {
    const { content, overlay, settle } = await setup((h) => {
      h.controlled.set(true)
      h.open.set(true)
      h.scroll.set(true)
    })
    await settle()
    const panel = content()!
    expect(panel).not.toBeNull()
    expect(overlay()!.contains(panel)).toBe(true)
    expect(['grid', 'place-items-center', 'overflow-y-auto'].every((t) => overlay()!.classList.contains(t))).toBe(true)
    expect(panel.className).toContain('extra-class')
    expect(panel.querySelector('svg')!.getAttribute('class')).toContain('h-4 w-4')
  })
})
