// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import {
  CONTEXT_MENU_CONTENT_CLASS,
  UiContextMenuCheckboxItemComponent,
  UiContextMenuComponent,
  UiContextMenuContentComponent,
  UiContextMenuItemComponent,
  UiContextMenuLabelComponent,
  UiContextMenuRadioGroupComponent,
  UiContextMenuRadioItemComponent,
  UiContextMenuSeparatorComponent,
  UiContextMenuSubComponent,
  UiContextMenuSubContentComponent,
  UiContextMenuSubTriggerComponent,
  UiContextMenuTriggerComponent,
} from './context-menu.component'

// Radix ContextMenu parity. What users notice when this breaks: right-click shows the
// browser menu (or nothing), the menu opens in the corner instead of at the pointer,
// touch users cannot long-press, arrows / typeahead do nothing, Escape leaves it open,
// checkbox / radio items do not stick, or submenus never open (or open and trap focus).

@Component({
  standalone: true,
  imports: [
    UiContextMenuComponent,
    UiContextMenuTriggerComponent,
    UiContextMenuContentComponent,
    UiContextMenuItemComponent,
    UiContextMenuCheckboxItemComponent,
    UiContextMenuRadioGroupComponent,
    UiContextMenuRadioItemComponent,
    UiContextMenuLabelComponent,
    UiContextMenuSeparatorComponent,
    UiContextMenuSubComponent,
    UiContextMenuSubTriggerComponent,
    UiContextMenuSubContentComponent,
  ],
  template: `
    <button id="before">before</button>
    <ui-context-menu (openChange)="changes.push($event)">
      <ui-context-menu-trigger class="grid h-32 w-72" [disabled]="disabled">Right-click here</ui-context-menu-trigger>
      <ui-context-menu-content class="w-48">
        <ui-context-menu-label>View</ui-context-menu-label>
        <ui-context-menu-item (select)="onSelect($event)">Back</ui-context-menu-item>
        <ui-context-menu-item disabled>Forward</ui-context-menu-item>
        <ui-context-menu-item>Reload</ui-context-menu-item>
        <ui-context-menu-separator />
        <ui-context-menu-checkbox-item [(checked)]="bookmarks">Bookmarks</ui-context-menu-checkbox-item>
        <ui-context-menu-radio-group [(value)]="person">
          <ui-context-menu-radio-item value="pedro">Pedro</ui-context-menu-radio-item>
          <ui-context-menu-radio-item value="colm">Colm</ui-context-menu-radio-item>
        </ui-context-menu-radio-group>
        <ui-context-menu-sub>
          <ui-context-menu-sub-trigger>Share</ui-context-menu-sub-trigger>
          <ui-context-menu-sub-content>
            <ui-context-menu-item>Email link</ui-context-menu-item>
            <ui-context-menu-item>Slack</ui-context-menu-item>
          </ui-context-menu-sub-content>
        </ui-context-menu-sub>
      </ui-context-menu-content>
    </ui-context-menu>
  `,
})
class Host {
  disabled = false
  keepOpen = false
  bookmarks = true
  person = 'pedro'
  changes: boolean[] = []
  selected = 0
  onSelect(event: Event): void {
    this.selected++
    if (this.keepOpen) event.preventDefault()
  }
}

const flush = async () => {
  for (let i = 0; i < 5; i++) await Promise.resolve()
}
const withProps = <T extends Event>(e: T, props: Record<string, unknown>): T => {
  for (const [k, v] of Object.entries(props)) Object.defineProperty(e, k, { value: v })
  return e
}
const pointer = (type: string, props: Record<string, unknown> = {}) =>
  withProps(new Event(type, { bubbles: true, cancelable: true }), {
    pointerType: 'mouse',
    clientX: 0,
    clientY: 0,
    ...props,
  })
/** cn() normalises token order, so compare class lists as sets. */
const tokens = (cls: string) => new Set(cls.split(/\s+/).filter(Boolean))
const expectClasses = (el: Element, expected: string) => {
  const actual = tokens(el.className)
  for (const t of tokens(expected)) expect(actual, t).toContain(t)
}
const key = (k: string) => new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true })

function setup(patch: Partial<Host> = {}) {
  const fixture = TestBed.createComponent(Host)
  Object.assign(fixture.componentInstance, patch)
  fixture.detectChanges()
  const root = fixture.nativeElement as HTMLElement
  const trigger = root.querySelector('[data-slot="context-menu-trigger"]') as HTMLElement
  const menu = () => document.querySelector<HTMLElement>('[data-uipkge-portal] [data-slot="context-menu-content"]')
  const subMenu = () =>
    document.querySelector<HTMLElement>('[data-uipkge-portal] [data-slot="context-menu-sub-content"]')
  const item = (text: string) =>
    [...document.querySelectorAll<HTMLElement>('[data-uipkge-portal] [role^="menuitem"]')].find(
      (el) => el.textContent?.trim() === text,
    )!
  const state = (el: Element | null = menu()) => {
    fixture.detectChanges()
    return el?.getAttribute('data-state') ?? null
  }
  const focused = () => document.activeElement?.textContent?.trim()
  const rightClick = async (x = 40, y = 60) => {
    const e = new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: x, clientY: y })
    trigger.dispatchEvent(e)
    fixture.detectChanges()
    await flush()
    return e
  }
  return { fixture, host: fixture.componentInstance, trigger, menu, subMenu, item, state, focused, rightClick }
}

describe('ContextMenu (angular, 13 checks)', () => {
  afterEach(() => {
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  it('1: right-click opens a body-portalled menu anchored at the pointer, not the browser menu', async () => {
    const { rightClick, menu, state, trigger, host, fixture } = setup()
    const e = await rightClick(40, 60)
    expect(e.defaultPrevented).toBe(true)
    expect(state()).toBe('open')
    expect(state(trigger)).toBe('open')
    expect(host.changes).toEqual([true])
    expect((fixture.nativeElement as HTMLElement).contains(menu())).toBe(false)
    await new Promise((r) => setTimeout(r, 20))
    // side=right, align=start, sideOffset=2 against a zero-size anchor at (40, 60).
    expect(menu()!.style.left).toBe('42px')
    expect(menu()!.style.top).toBe('60px')
    expect(menu()!.getAttribute('data-side')).toBe('right')
  })

  it('2: a disabled trigger leaves the native context menu alone', async () => {
    const { rightClick, menu, trigger, fixture } = setup({ disabled: true })
    const e = await rightClick()
    fixture.detectChanges()
    expect(e.defaultPrevented).toBe(false)
    expect(menu()).toBeNull()
    expect(trigger.hasAttribute('data-disabled')).toBe(true)
  })

  it('3: touch long-press (700ms) opens; moving the finger cancels it', () => {
    vi.useFakeTimers()
    const { trigger, menu } = setup()
    trigger.dispatchEvent(pointer('pointerdown', { pointerType: 'touch', clientX: 5, clientY: 5 }))
    trigger.dispatchEvent(pointer('pointermove', { pointerType: 'touch' }))
    vi.advanceTimersByTime(800)
    expect(menu()).toBeNull()
    trigger.dispatchEvent(pointer('pointerdown', { pointerType: 'touch', clientX: 5, clientY: 5 }))
    vi.advanceTimersByTime(700)
    expect(menu()).not.toBeNull()
  })

  it('4: pointer open focuses the menu; arrows enter the list, skip disabled items, and do not loop', async () => {
    const { rightClick, menu, focused } = setup()
    await rightClick()
    expect(document.activeElement).toBe(menu())
    menu()!.dispatchEvent(key('ArrowDown'))
    expect(focused()).toBe('Back')
    document.activeElement!.dispatchEvent(key('ArrowDown'))
    expect(focused()).toBe('Reload')
    document.activeElement!.dispatchEvent(key('End'))
    expect(focused()).toBe('Share')
    document.activeElement!.dispatchEvent(key('ArrowDown'))
    expect(focused()).toBe('Share')
  })

  it('5: a keyboard open (Shift+F10 / menu key) lands on the first item', async () => {
    const { trigger, rightClick, focused } = setup()
    trigger.dispatchEvent(key('F10'))
    await rightClick()
    expect(focused()).toBe('Back')
  })

  it('6: typeahead jumps to the next item starting with the typed text', async () => {
    const { rightClick, menu, focused } = setup()
    await rightClick()
    menu()!.dispatchEvent(key('r'))
    await new Promise((r) => setTimeout(r, 0))
    expect(focused()).toBe('Reload')
  })

  it('7: Enter selects and closes; select.preventDefault() keeps the menu open', async () => {
    const { rightClick, item, state, host } = setup()
    await rightClick()
    item('Back').dispatchEvent(key('Enter'))
    expect(host.selected).toBe(1)
    expect(state()).toBe('closed')
    host.keepOpen = true
    await flush()
    await rightClick()
    item('Back').click()
    expect(host.selected).toBe(2)
    expect(state()).toBe('open')
  })

  it('8: checkbox items toggle through [(checked)], radio items set the group [(value)]', async () => {
    const { rightClick, item, host, fixture, state } = setup()
    await rightClick()
    const box = item('Bookmarks')
    expect(box.getAttribute('aria-checked')).toBe('true')
    expect(box.querySelector('svg.lucide-check')).not.toBeNull()
    box.click()
    fixture.detectChanges()
    expect(host.bookmarks).toBe(false)
    expect(state()).toBe('closed')
    await flush()
    await rightClick()
    item('Colm').click()
    fixture.detectChanges()
    expect(host.person).toBe('colm')
  })

  it('9: Escape and outside pointer-downs dismiss; focus returns to where it was', async () => {
    const { rightClick, state, fixture } = setup()
    const before = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('#before')!
    before.focus()
    await rightClick()
    document.dispatchEvent(key('Escape'))
    expect(state()).toBe('closed')
    await flush()
    expect(document.activeElement).toBe(before)
    await rightClick()
    document.body.dispatchEvent(pointer('pointerdown'))
    expect(state()).toBe('closed')
  })

  it('10: ArrowRight opens the submenu on its first item; ArrowLeft closes back to the trigger; Escape closes all', async () => {
    const { rightClick, item, subMenu, state, focused, menu } = setup()
    await rightClick()
    item('Share').focus()
    item('Share').dispatchEvent(key('ArrowRight'))
    await flush()
    expect(state(subMenu())).toBe('open')
    expect(focused()).toBe('Email link')
    expect(item('Share').getAttribute('aria-expanded')).toBe('true')
    document.activeElement!.dispatchEvent(key('ArrowLeft'))
    expect(state(subMenu())).toBe('closed')
    expect(focused()).toBe('Share')
    await flush()
    item('Share').dispatchEvent(key('ArrowRight'))
    await flush()
    document.dispatchEvent(key('Escape'))
    expect(state(menu())).toBe('closed')
  })

  it('11: hovering the sub-trigger opens the submenu after 100ms; hovering a sibling closes it', async () => {
    const { rightClick, item, subMenu, state } = setup()
    await rightClick()
    vi.useFakeTimers()
    item('Share').dispatchEvent(pointer('pointermove'))
    vi.advanceTimersByTime(99)
    expect(subMenu()).toBeNull()
    vi.advanceTimersByTime(1)
    expect(state(subMenu())).toBe('open')
    item('Reload').dispatchEvent(pointer('pointermove'))
    expect(state(subMenu())).toBe('closed')
  })

  it('12: React class strings verbatim; display utilities lead on custom-element hosts', async () => {
    const { rightClick, menu, item, fixture } = setup()
    await rightClick()
    expectClasses(menu()!, CONTEXT_MENU_CONTENT_CLASS + ' w-48')
    const label = document.querySelector('[data-slot="context-menu-label"]')!
    expectClasses(label, 'block text-foreground px-2 py-1.5 text-sm font-medium data-[inset]:pl-8')
    expectClasses(document.querySelector('[data-slot="context-menu-separator"]')!, 'block bg-border -mx-1 my-1 h-px')
    expect(item('Back').getAttribute('data-variant')).toBe('default')
    expect(item('Forward').getAttribute('aria-disabled')).toBe('true')
    // Right-drag-release: a pointerup on an item that never saw the pointerdown selects it.
    item('Back').dispatchEvent(pointer('pointerup'))
    fixture.detectChanges()
    expect(fixture.componentInstance.selected).toBe(1)
  })

  it('13: defaultOpen opens uncontrolled; controlled open wins; setOpen sticks', () => {
    const menu = new UiContextMenuComponent()
    expect(menu.isOpen).toBe(false)
    menu.defaultOpen = true
    expect(menu.isOpen).toBe(true)
    menu.open = false
    expect(menu.isOpen).toBe(false)
    menu.open = undefined
    menu.setOpen(false)
    expect(menu.isOpen).toBe(false)
    menu.setOpen(true)
    expect(menu.isOpen).toBe(true)
  })
})
