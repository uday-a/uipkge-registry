// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import {
  MENUBAR_CONTENT_CLASS,
  UiMenubarCheckboxItemComponent,
  UiMenubarComponent,
  UiMenubarContentComponent,
  UiMenubarItemComponent,
  UiMenubarMenuComponent,
  UiMenubarRadioGroupComponent,
  UiMenubarRadioItemComponent,
  UiMenubarSeparatorComponent,
  UiMenubarShortcutComponent,
  UiMenubarSubComponent,
  UiMenubarSubContentComponent,
  UiMenubarSubTriggerComponent,
  UiMenubarTriggerComponent,
} from './menubar.component'

// Radix Menubar parity. What users notice when this breaks: clicking File does nothing
// (or opens every menu), moving along the bar with a menu open does not switch menus,
// ArrowLeft / ArrowRight neither rove the triggers nor jump to the neighbouring menu,
// Escape strands focus in the page, checkbox / radio choices do not stick, and a submenu
// ArrowRight jumps to the next top-level menu instead of opening the flyout.

@Component({
  standalone: true,
  imports: [
    UiMenubarComponent,
    UiMenubarMenuComponent,
    UiMenubarTriggerComponent,
    UiMenubarContentComponent,
    UiMenubarItemComponent,
    UiMenubarCheckboxItemComponent,
    UiMenubarRadioGroupComponent,
    UiMenubarRadioItemComponent,
    UiMenubarSeparatorComponent,
    UiMenubarShortcutComponent,
    UiMenubarSubComponent,
    UiMenubarSubTriggerComponent,
    UiMenubarSubContentComponent,
  ],
  template: `
    <button id="outside">outside</button>
    <ui-menubar class="max-w-md" (valueChange)="values.push($event)">
      <ui-menubar-menu value="file">
        <button ui-menubar-trigger>File</button>
        <ui-menubar-content>
          <ui-menubar-item (select)="selected = selected + 1"
            >New Tab <ui-menubar-shortcut>⌘T</ui-menubar-shortcut></ui-menubar-item
          >
          <ui-menubar-sub>
            <ui-menubar-sub-trigger>Share</ui-menubar-sub-trigger>
            <ui-menubar-sub-content>
              <ui-menubar-item>Slack</ui-menubar-item>
              <ui-menubar-item>Discord</ui-menubar-item>
            </ui-menubar-sub-content>
          </ui-menubar-sub>
          <ui-menubar-separator />
          <ui-menubar-item>Print</ui-menubar-item>
        </ui-menubar-content>
      </ui-menubar-menu>
      <ui-menubar-menu value="edit">
        <button ui-menubar-trigger>Edit</button>
        <ui-menubar-content>
          <ui-menubar-item>Undo</ui-menubar-item>
          <ui-menubar-item>Redo</ui-menubar-item>
        </ui-menubar-content>
      </ui-menubar-menu>
      <ui-menubar-menu value="view">
        <button ui-menubar-trigger>View</button>
        <ui-menubar-content>
          <ui-menubar-checkbox-item [(checked)]="bookmarks">Bookmarks</ui-menubar-checkbox-item>
          <ui-menubar-radio-group [(value)]="profile">
            <ui-menubar-radio-item value="andy">Andy</ui-menubar-radio-item>
            <ui-menubar-radio-item value="luis">Luis</ui-menubar-radio-item>
          </ui-menubar-radio-group>
        </ui-menubar-content>
      </ui-menubar-menu>
    </ui-menubar>
  `,
})
class Host {
  values: string[] = []
  selected = 0
  bookmarks = true
  profile = 'andy'
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
    button: 0,
    ctrlKey: false,
    clientX: 0,
    clientY: 0,
    ...props,
  })
const key = (k: string, init: KeyboardEventInit = {}) =>
  new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true, ...init })

function setup() {
  const fixture = TestBed.createComponent(Host)
  fixture.detectChanges()
  const root = fixture.nativeElement as HTMLElement
  const bar = root.querySelector<HTMLElement>('[data-slot="menubar"]')!
  const trigger = (label: string) =>
    [...root.querySelectorAll<HTMLElement>('[data-slot="menubar-trigger"]')].find(
      (t) => t.textContent?.trim() === label,
    )!
  const openMenus = () =>
    [...document.querySelectorAll<HTMLElement>('[data-uipkge-portal] [data-slot="menubar-content"]')].filter(
      (m) => m.getAttribute('data-state') === 'open',
    )
  const openLabel = () => {
    fixture.detectChanges()
    const [menu] = openMenus()
    return menu ? document.getElementById(menu.getAttribute('aria-labelledby')!)?.textContent?.trim() : null
  }
  const item = (text: string) =>
    [...document.querySelectorAll<HTMLElement>('[data-uipkge-portal] [role^="menuitem"]')].find(
      (el) => el.firstChild?.textContent?.trim() === text || el.textContent?.trim() === text,
    )!
  const focused = () => document.activeElement?.textContent?.trim()
  const press = async (label: string) => {
    const e = pointer('pointerdown')
    trigger(label).dispatchEvent(e)
    fixture.detectChanges()
    await flush()
    return e
  }
  const detect = () => fixture.detectChanges()
  return { fixture, host: fixture.componentInstance, bar, trigger, openMenus, openLabel, item, focused, press, detect }
}

describe('Menubar (angular, 11 checks)', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('1: pressing a trigger opens its menu in a portal under it; pressing it again closes', async () => {
    const { press, openLabel, trigger, host, detect, openMenus } = setup()
    const e = await press('File')
    expect(e.defaultPrevented).toBe(true)
    expect(openLabel()).toBe('File')
    expect(trigger('File').getAttribute('aria-expanded')).toBe('true')
    expect(trigger('File').getAttribute('data-state')).toBe('open')
    expect(host.values).toEqual(['file'])
    await new Promise((r) => setTimeout(r, 20))
    // sideOffset 8 below the trigger (jsdom rects are 0x0 at the origin).
    expect(openMenus()[0]!.style.top).toBe('8px')
    await press('File')
    detect()
    expect(openLabel()).toBeNull()
    expect(host.values).toEqual(['file', ''])
  })

  it('2: with a menu open, hovering another trigger switches to it (and focuses it); closed bars ignore hover', async () => {
    const { press, openLabel, trigger, focused, detect } = setup()
    trigger('Edit').dispatchEvent(pointer('pointerenter'))
    expect(openLabel()).toBeNull()
    await press('File')
    trigger('Edit').dispatchEvent(pointer('pointerenter'))
    detect()
    expect(openLabel()).toBe('Edit')
    expect(focused()).toBe('Edit')
  })

  it('3: Enter / ArrowDown on a trigger open the menu on its first item', async () => {
    const { trigger, openLabel, focused, detect } = setup()
    trigger('Edit').focus()
    trigger('Edit').dispatchEvent(key('ArrowDown'))
    detect()
    await flush()
    expect(openLabel()).toBe('Edit')
    expect(focused()).toBe('Undo')
  })

  it('4: ArrowLeft / ArrowRight / Home / End rove the triggers (looping) with one tab stop', () => {
    const { trigger, focused, detect } = setup()
    trigger('File').focus()
    trigger('File').dispatchEvent(key('ArrowRight'))
    expect(focused()).toBe('Edit')
    document.activeElement!.dispatchEvent(key('End'))
    expect(focused()).toBe('View')
    document.activeElement!.dispatchEvent(key('ArrowRight'))
    expect(focused()).toBe('File')
    document.activeElement!.dispatchEvent(key('ArrowLeft'))
    expect(focused()).toBe('View')
    detect()
    expect(trigger('View').getAttribute('tabindex')).toBe('0')
    expect(trigger('File').getAttribute('tabindex')).toBe('-1')
  })

  it('5: inside an open menu ArrowRight / ArrowLeft move to the next / previous menu (wrapping)', async () => {
    const { trigger, openLabel, focused, detect } = setup()
    trigger('File').focus()
    trigger('File').dispatchEvent(key('Enter'))
    detect()
    await flush()
    expect(document.activeElement?.getAttribute('role')).toBe('menuitem')
    expect(focused()).toContain('New Tab')
    document.activeElement!.dispatchEvent(key('ArrowRight'))
    detect()
    await flush()
    expect(openLabel()).toBe('Edit')
    document.activeElement!.dispatchEvent(key('ArrowLeft'))
    detect()
    await flush()
    expect(openLabel()).toBe('File')
    document.activeElement!.dispatchEvent(key('ArrowLeft'))
    detect()
    await flush()
    expect(openLabel()).toBe('View')
  })

  it('6: Escape closes and returns focus to the trigger; an outside press closes without stealing focus', async () => {
    const { press, trigger, openLabel, focused, fixture, detect } = setup()
    trigger('File').focus()
    trigger('File').dispatchEvent(key('Enter'))
    detect()
    await flush()
    document.dispatchEvent(key('Escape'))
    expect(openLabel()).toBeNull()
    expect(focused()).toBe('File')
    await press('Edit')
    const outside = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('#outside')!
    outside.dispatchEvent(pointer('pointerdown'))
    outside.focus()
    await flush()
    expect(openLabel()).toBeNull()
    expect(document.activeElement).toBe(outside)
  })

  it('7: selecting an item closes the bar and hands focus back to its trigger', async () => {
    const { trigger, item, openLabel, focused, host, detect } = setup()
    trigger('File').focus()
    trigger('File').dispatchEvent(key('Enter'))
    detect()
    await flush()
    item('New Tab').dispatchEvent(key('Enter'))
    expect(host.selected).toBe(1)
    expect(openLabel()).toBeNull()
    expect(focused()).toBe('File')
  })

  it('8: checkbox items toggle [(checked)], radio items set the group [(value)]', async () => {
    const { press, item, host, detect } = setup()
    await press('View')
    item('Bookmarks').click()
    detect()
    expect(host.bookmarks).toBe(false)
    await press('View')
    expect(item('Andy').getAttribute('data-state')).toBe('checked')
    item('Luis').click()
    detect()
    expect(host.profile).toBe('luis')
  })

  it('9: ArrowRight on a sub-trigger opens the flyout (no menu switch); ArrowLeft in it closes back', async () => {
    const { trigger, item, openLabel, focused, detect } = setup()
    trigger('File').focus()
    trigger('File').dispatchEvent(key('Enter'))
    detect()
    await flush()
    item('Share').focus()
    item('Share').dispatchEvent(key('ArrowRight'))
    detect()
    await flush()
    expect(focused()).toBe('Slack')
    expect(openLabel()).toBe('File')
    document.activeElement!.dispatchEvent(key('ArrowLeft'))
    detect()
    expect(focused()).toBe('Share')
    expect(openLabel()).toBe('File')
  })

  it('10: the bar is one tab stop that forwards focus to a trigger; Shift+Tab leaves it', () => {
    const { bar, trigger, focused, detect } = setup()
    expect(bar.getAttribute('role')).toBe('menubar')
    expect(bar.getAttribute('tabindex')).toBe('0')
    bar.focus()
    expect(focused()).toBe('File')
    trigger('File').dispatchEvent(key('Tab', { shiftKey: true }))
    expect(bar.getAttribute('tabindex')).toBe('-1')
    trigger('File').dispatchEvent(new FocusEvent('focusout', { bubbles: true }))
    detect()
    expect(bar.getAttribute('tabindex')).toBe('0')
  })

  it('11: React class strings: bar, trigger, content, separator', async () => {
    const { bar, trigger, press, openMenus } = setup()
    const has = (el: Element, cls: string) => {
      const actual = new Set(el.className.split(/\s+/))
      for (const t of cls.split(' ')) expect(actual, t).toContain(t)
    }
    has(bar, 'bg-background flex h-9 items-center gap-1 rounded-md border p-1 shadow-xs max-w-md')
    has(
      trigger('File'),
      'focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex items-center rounded-sm px-2 py-1 text-sm font-medium outline-hidden select-none',
    )
    await press('File')
    has(openMenus()[0]!, MENUBAR_CONTENT_CLASS)
    has(document.querySelector('[data-slot="menubar-separator"]')!, 'block bg-border -mx-1 my-1 h-px')
    expect(trigger('File').getAttribute('type')).toBe('button')
  })
})
