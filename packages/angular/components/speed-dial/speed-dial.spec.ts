// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component, TemplateRef, ViewChild, provideZonelessChangeDetection, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiSpeedDialComponent, type SpeedDialAction, type SpeedDialTrigger } from './speed-dial.component'

// Behaviour parity with the React SpeedDial (Fab + Radix Popover). If these break, users
// notice: the FAB does nothing (or opens when disabled), the actions render inline instead
// of floating beside the FAB, a disabled action still fires, the dial stays open after a
// pick (or closes with closeOnAction=false), and a hover dial never opens or never closes.

const tick = (ms = 0) => new Promise((r) => setTimeout(r, ms))

@Component({
  standalone: true,
  imports: [UiSpeedDialComponent],
  template: `
    <ng-template #mail><svg class="lucide lucide-mail"></svg></ng-template>
    <ng-template #star><svg class="lucide lucide-star"></svg></ng-template>
    <ui-speed-dial
      [actions]="actions"
      [trigger]="trigger()"
      [direction]="direction()"
      [closeOnAction]="closeOnAction()"
      [disabled]="disabled()"
      [icon]="customIcon() ? star : undefined"
      position="inline"
      label="Create"
    />
  `,
})
class HostComponent {
  @ViewChild('mail', { static: true }) mail!: TemplateRef<unknown>
  readonly trigger = signal<SpeedDialTrigger>('click')
  readonly direction = signal<'up' | 'down' | 'left' | 'right'>('up')
  readonly closeOnAction = signal(true)
  readonly disabled = signal(false)
  readonly customIcon = signal(false)
  fired: string[] = []
  actions: SpeedDialAction[] = []
}

async function setup(init: (h: HostComponent) => void = () => {}) {
  TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] })
  const fixture = TestBed.createComponent(HostComponent)
  const host = fixture.componentInstance
  host.actions = [
    { icon: host.mail, label: 'Email', handler: () => host.fired.push('Email') },
    { icon: host.mail, label: 'Send now', handler: () => host.fired.push('Send now'), disabled: true },
  ]
  init(host)
  document.body.appendChild(fixture.nativeElement)
  fixture.detectChanges()
  await fixture.whenStable()
  const settle = async (ms = 0) => {
    fixture.detectChanges()
    await tick(ms)
    await fixture.whenStable()
    fixture.detectChanges()
  }
  const root = () => fixture.nativeElement.querySelector('[data-slot="speed-dial"]') as HTMLElement
  const fab = () => fixture.nativeElement.querySelector('[data-slot="fab"]') as HTMLButtonElement
  const panel = () => document.querySelector<HTMLElement>('[data-uipkge-portal] [data-slot="popover-content"]')
  const items = () => Array.from(document.querySelectorAll<HTMLButtonElement>('[data-slot="speed-dial-action"]'))
  return { fixture, host, root, fab, panel, items, settle }
}

describe('SpeedDial (angular, 8 checks)', () => {
  it('1: renders a FAB with the plus icon, the label as aria-label and menu popup semantics', async () => {
    const t = await setup()
    expect(t.fab().getAttribute('aria-label')).toBe('Create')
    expect(t.fab().getAttribute('aria-haspopup')).toBe('menu')
    expect(t.fab().getAttribute('aria-expanded')).toBe('false')
    expect(t.fab().querySelector('svg.lucide-plus')).not.toBeNull()
    expect(t.panel()).toBeNull()
  })

  it('2: a custom icon template replaces the plus', async () => {
    const t = await setup((h) => h.customIcon.set(true))
    expect(t.fab().querySelector('svg.lucide-star')).not.toBeNull()
    expect(t.fab().querySelector('svg.lucide-plus')).toBeNull()
  })

  it('3: click opens a portalled panel with one button per action, rotating the FAB', async () => {
    const t = await setup((h) => h.direction.set('left'))
    t.fab().click()
    await t.settle()
    expect(t.panel()).not.toBeNull()
    expect(t.items().map((b) => b.getAttribute('aria-label'))).toEqual(['Email', 'Send now'])
    expect(t.items()[1].style.animationDelay).toBe('40ms')
    expect(t.panel()!.querySelector('.flex-row')).not.toBeNull()
    expect(t.fab().getAttribute('aria-expanded')).toBe('true')
    expect(t.fab().className).toContain('rotate-45')
  })

  it('4: an action runs its handler and closes the dial', async () => {
    const t = await setup()
    t.fab().click()
    await t.settle()
    t.items()[0].click()
    await t.settle(250)
    expect(t.host.fired).toEqual(['Email'])
    expect(t.fab().getAttribute('aria-expanded')).toBe('false')
  })

  it('5: a disabled action is a disabled button and never fires', async () => {
    const t = await setup()
    t.fab().click()
    await t.settle()
    const send = t.items()[1]
    expect(send.disabled).toBe(true)
    const dial = t.fixture.debugElement.children.find((d) => d.componentInstance instanceof UiSpeedDialComponent)!
      .componentInstance as UiSpeedDialComponent
    dial.runAction(t.host.actions[1])
    expect(t.host.fired).toEqual([])
  })

  it('6: closeOnAction=false keeps the dial open after a pick', async () => {
    const t = await setup((h) => h.closeOnAction.set(false))
    t.fab().click()
    await t.settle()
    t.items()[0].click()
    await t.settle()
    expect(t.host.fired).toEqual(['Email'])
    expect(t.fab().getAttribute('aria-expanded')).toBe('true')
  })

  it('7: disabled dial never opens', async () => {
    const t = await setup((h) => h.disabled.set(true))
    t.root().click()
    await t.settle()
    expect(t.panel()).toBeNull()
    expect(t.fab().disabled).toBe(true)
  })

  it('8: hover trigger opens on enter, ignores clicks, and closes 150ms after leaving', async () => {
    const t = await setup((h) => h.trigger.set('hover'))
    t.root().dispatchEvent(new Event('mouseenter'))
    await t.settle()
    expect(t.fab().getAttribute('aria-expanded')).toBe('true')
    t.fab().click()
    await t.settle()
    expect(t.fab().getAttribute('aria-expanded')).toBe('true')
    t.root().dispatchEvent(new Event('mouseleave'))
    await t.settle(50)
    expect(t.fab().getAttribute('aria-expanded')).toBe('true')
    await t.settle(150)
    expect(t.fab().getAttribute('aria-expanded')).toBe('false')
  })
})
