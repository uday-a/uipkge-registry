// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest'
import { Component, provideZonelessChangeDetection, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import {
  UiAlertModalComponent,
  UiAlertModalTriggerDirective,
  type AlertModalIcon,
  type AlertModalTone,
} from './alert-modal.component'

// Behaviour parity with the React AlertModal (Radix Dialog with role=alertdialog).
// If these break, users notice: the trigger doesn't open the modal, a stray click on
// the backdrop silently cancels a destructive confirm, the icon shows as the word
// "error", Cancel doesn't close, the modal closes mid-request while `loading`, or
// screen readers don't announce it as an alert dialog with its title.

const tick = () => new Promise((r) => setTimeout(r, 0))

@Component({
  standalone: true,
  imports: [UiAlertModalComponent, UiAlertModalTriggerDirective],
  template: `
    <ui-alert-modal
      [open]="controlled() ? open() : undefined"
      (openChange)="changes.push($event); open.set($event)"
      title="Delete project?"
      description="This permanently deletes the project."
      [tone]="tone()"
      [icon]="icon()"
      [loading]="loading()"
      [cancelLabel]="cancelLabel()"
      [actions]="custom() ? customActions : null"
      class="sm:max-w-md"
      (action)="actions.push('action')"
      (cancel)="actions.push('cancel')"
    >
      <button id="trigger" ui-alert-modal-trigger>Delete</button>
      @if (body()) {
        <ul id="body">
          <li>Your data is preserved.</li>
        </ul>
      }
    </ui-alert-modal>
    <ng-template #customActions><button id="stay">Stay on plan</button></ng-template>
  `,
})
class HostComponent {
  readonly controlled = signal(false)
  readonly open = signal(false)
  readonly tone = signal<AlertModalTone>('default')
  readonly icon = signal<AlertModalIcon | null>(null)
  readonly loading = signal(false)
  readonly cancelLabel = signal<string | null>('Cancel')
  readonly custom = signal(false)
  readonly body = signal(false)
  changes: boolean[] = []
  actions: string[] = []
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
  const buttons = () => [...(content()?.querySelectorAll<HTMLButtonElement>('button') ?? [])]
  const settle = async () => {
    fixture.detectChanges()
    await tick()
    await fixture.whenStable()
    fixture.detectChanges()
  }
  const openIt = async () => {
    trigger.click()
    await settle()
  }
  return { fixture, host: fixture.componentInstance, trigger, content, overlay, buttons, settle, openIt }
}

const escape = () =>
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))

describe('AlertModal (angular, 10 checks)', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    document.body.style.overflow = ''
  })

  it('1: trigger directive opens a portalled role=alertdialog without the X close button', async () => {
    const { trigger, content, openIt } = await setup()
    expect(content()).toBeNull()
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog')
    // The title input must not leak onto the host as a native hover tooltip.
    expect(trigger.closest('ui-alert-modal')!.hasAttribute('title')).toBe(false)
    await openIt()
    const panel = content()!
    expect(panel.getAttribute('role')).toBe('alertdialog')
    expect(panel.querySelector('.sr-only')).toBeNull()
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
  })

  it('2: title / description are the dialog title + description (aria-labelledby / -describedby)', async () => {
    const { content, openIt } = await setup()
    await openIt()
    const panel = content()!
    const title = document.getElementById(panel.getAttribute('aria-labelledby')!)!
    expect(title.tagName).toBe('H2')
    expect(title.textContent).toBe('Delete project?')
    expect(document.getElementById(panel.getAttribute('aria-describedby')!)!.textContent).toBe(
      'This permanently deletes the project.',
    )
    expect(panel.classList.contains('sm:max-w-md')).toBe(true)
  })

  it('3: clicking the overlay does NOT dismiss (no soft-dismiss for alert dialogs)', async () => {
    const { content, overlay, openIt, settle, host } = await setup()
    await openIt()
    overlay()!.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    await settle()
    expect(content()!.getAttribute('data-state')).toBe('open')
    expect(host.changes).toEqual([true])
  })

  it('4: Escape still closes it', async () => {
    const { openIt, settle, host } = await setup()
    await openIt()
    escape()
    await settle()
    expect(host.changes).toEqual([true, false])
  })

  it('5: Cancel emits cancel then closes; the action button only emits (consumer closes)', async () => {
    const { buttons, openIt, settle, host } = await setup()
    await openIt()
    const [cancel, action] = buttons()
    expect(cancel!.textContent!.trim()).toBe('Cancel')
    expect(action!.textContent!.trim()).toBe('Continue')
    action!.click()
    await settle()
    expect(host.actions).toEqual(['action'])
    expect(host.changes).toEqual([true])
    cancel!.click()
    await settle()
    expect(host.actions).toEqual(['action', 'cancel'])
    expect(host.changes).toEqual([true, false])
  })

  it('6: loading disables both buttons, shows a spinner, and blocks Escape from closing', async () => {
    const { buttons, content, openIt, settle, host } = await setup((h) => h.loading.set(true))
    await openIt()
    const [cancel, action] = buttons()
    expect(cancel!.disabled).toBe(true)
    expect(action!.disabled).toBe(true)
    expect(action!.getAttribute('aria-busy')).toBe('true')
    expect(action!.querySelector('.animate-spin')!.classList.contains('size-3.5')).toBe(true)
    escape()
    await settle()
    expect(content()!.getAttribute('data-state')).toBe('open')
    expect(host.changes).toEqual([true])
  })

  it('7: icon="error" renders the lucide circle-alert svg in a tone-colored ring', async () => {
    const { content, openIt } = await setup((h) => {
      h.icon.set('error')
      h.tone.set('destructive')
    })
    await openIt()
    const svg = content()!.querySelector('svg.lucide-circle-alert')!
    expect(svg).not.toBeNull()
    const ring = svg.parentElement!
    expect(ring.classList.contains('size-10')).toBe(true)
    expect(ring.classList.contains('text-destructive')).toBe(true)
    expect(content()!.textContent).not.toContain('error')
  })

  it('8: tone colors the action button on top of the default button variant', async () => {
    const { buttons, openIt } = await setup((h) => h.tone.set('success'))
    await openIt()
    const action = buttons().at(-1)!
    expect(action.classList.contains('bg-success')).toBe(true)
    expect(action.classList.contains('bg-primary')).toBe(false)
    expect(action.classList.contains('focus-visible:ring-[3px]')).toBe(true)
  })

  it('9: cancelLabel=null hides Cancel; an actions template replaces the whole button row; body content projects', async () => {
    const hidden = await setup((h) => h.cancelLabel.set(null))
    await hidden.openIt()
    expect(hidden.buttons().map((b) => b.textContent!.trim())).toEqual(['Continue'])
    document.body.innerHTML = ''
    TestBed.resetTestingModule()
    const custom = await setup((h) => {
      h.custom.set(true)
      h.body.set(true)
    })
    await custom.openIt()
    expect(custom.buttons().map((b) => b.id)).toEqual(['stay'])
    expect(custom.content()!.querySelector('#body')!.parentElement!.classList.contains('text-sm')).toBe(true)
  })

  it('10: controlled open (no trigger click) renders it; closing reports through openChange', async () => {
    const { content, settle, host } = await setup((h) => {
      h.controlled.set(true)
      h.open.set(true)
    })
    await settle()
    expect(content()).not.toBeNull()
    escape()
    await settle()
    expect(host.changes).toEqual([false])
    expect(host.open()).toBe(false)
    await settle()
    await tick()
    expect(content()).toBeNull()
  })
})
