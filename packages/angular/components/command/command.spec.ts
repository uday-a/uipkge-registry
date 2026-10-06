// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { Component, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import {
  UiCommandComponent,
  UiCommandDialogComponent,
  UiCommandEmptyComponent,
  UiCommandGroupComponent,
  UiCommandInputComponent,
  UiCommandItemComponent,
  UiCommandListComponent,
  UiCommandSeparatorComponent,
  UiCommandShortcutComponent,
  commandScore,
} from './command.component'

// Behaviour parity with cmdk (what the React Command wraps). If this broke, users would
// see: typing not narrowing the list (or not ranking the best match first), no highlighted
// row / arrow keys doing nothing, Enter not running the command, empty groups and
// separators left on screen while searching, "No results" missing (or always showing),
// the input not announcing the active option, and the Cmd-K dialog not opening over the
// page, not focusing the search field, or not closing on Escape / backdrop.

const PARTS = [
  UiCommandComponent,
  UiCommandDialogComponent,
  UiCommandInputComponent,
  UiCommandListComponent,
  UiCommandEmptyComponent,
  UiCommandGroupComponent,
  UiCommandItemComponent,
  UiCommandSeparatorComponent,
  UiCommandShortcutComponent,
]

@Component({
  standalone: true,
  imports: PARTS,
  template: `
    <ui-command class="max-w-md" [loop]="loop">
      <ui-command-input placeholder="Type a command" class="input-extra" />
      <ui-command-list>
        <ui-command-empty>No results found.</ui-command-empty>
        <ui-command-group heading="Suggestions">
          <ui-command-item value="calendar" (select)="ran.push($event)">Calendar</ui-command-item>
          <ui-command-item value="emoji" disabled>Search emoji</ui-command-item>
          <ui-command-item value="calculator" (select)="ran.push($event)">Calculator</ui-command-item>
        </ui-command-group>
        <ui-command-separator />
        <ui-command-group heading="Settings">
          <ui-command-item value="profile" (select)="ran.push($event)"
            >Profile<ui-command-shortcut>⌘P</ui-command-shortcut></ui-command-item
          >
          <ui-command-item value="settings">Settings</ui-command-item>
        </ui-command-group>
      </ui-command-list>
    </ui-command>
  `,
})
class Host {
  loop = false
  ran: string[] = []
}

@Component({
  standalone: true,
  imports: PARTS,
  template: `
    <button id="opener">open</button>
    <ui-command-dialog [open]="open()" (openChange)="open.set($event)">
      <ui-command-input placeholder="Search" />
      <ui-command-list>
        <ui-command-empty>No results found.</ui-command-empty>
        <ui-command-group heading="Suggestions">
          <ui-command-item value="calendar" (select)="open.set(false)">Calendar</ui-command-item>
          <ui-command-item value="emoji">Search emoji</ui-command-item>
        </ui-command-group>
      </ui-command-list>
    </ui-command-dialog>
  `,
})
class DialogHost {
  open = signal(false)
}

const tick = () => new Promise((r) => setTimeout(r, 0))

function setup(patch: Partial<Host> = {}) {
  const fixture = TestBed.createComponent(Host)
  Object.assign(fixture.componentInstance, patch)
  fixture.detectChanges()
  const el = fixture.nativeElement as HTMLElement
  const root = el.querySelector('[cmdk-root]') as HTMLElement
  const input = el.querySelector('input[cmdk-input]') as HTMLInputElement
  const item = (v: string) => el.querySelector<HTMLElement>(`[cmdk-item][data-value="${v}"]`)!
  const selected = () => el.querySelector('[cmdk-item][data-selected="true"]')?.getAttribute('data-value')
  const type = (q: string) => {
    input.value = q
    input.dispatchEvent(new Event('input'))
    fixture.detectChanges()
  }
  const key = (k: string, init: KeyboardEventInit = {}) => {
    input.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true, ...init }))
    fixture.detectChanges()
  }
  return { fixture, host: fixture.componentInstance, el, root, input, item, selected, type, key }
}

describe('Command (angular, 11 checks)', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('1: command-score ranks contiguous / word-start matches and rejects non-matches', () => {
    expect(commandScore('calendar', 'cal')).toBeGreaterThan(commandScore('calculator', 'clr'))
    expect(commandScore('Search emoji', 'emo')).toBeGreaterThan(0)
    expect(commandScore('profile', 'xyz')).toBe(0)
    expect(commandScore('settings', 'pref', ['preferences'])).toBeGreaterThan(0)
  })
  it('2: renders the cmdk DOM: root, labelled input combobox wired to the list, sizer', () => {
    const { root, input, el } = setup()
    const list = el.querySelector('[cmdk-list]') as HTMLElement
    expect(root.getAttribute('tabindex')).toBe('-1')
    expect(root.querySelector('label[cmdk-label]')!.getAttribute('for')).toBe(input.id)
    expect(input.getAttribute('role')).toBe('combobox')
    expect(input.getAttribute('aria-controls')).toBe(list.id)
    expect(list.getAttribute('role')).toBe('listbox')
    expect(list.querySelector(':scope > [cmdk-list-sizer]')).not.toBeNull()
    expect(el.querySelector('[cmdk-input-wrapper] > svg.lucide-search')).not.toBeNull()
    expect(input.classList.contains('input-extra')).toBe(true)
    expect(el.querySelector('[cmdk-input-wrapper]')!.classList.contains('input-extra')).toBe(false)
  })
  it('3: the first item is highlighted on mount and announced via aria-activedescendant', () => {
    const { input, item, selected } = setup()
    expect(selected()).toBe('calendar')
    expect(item('calendar').getAttribute('aria-selected')).toBe('true')
    expect(input.getAttribute('aria-activedescendant')).toBe(item('calendar').id)
  })
  it('4: typing filters items, hides emptied groups, hides separators and re-highlights the first match', () => {
    const { el, item, selected, type } = setup()
    type('prof')
    expect(item('profile').hasAttribute('hidden')).toBe(false)
    expect(item('calendar').hasAttribute('hidden')).toBe(true)
    expect(el.querySelector('[cmdk-group][data-value="Suggestions"]')!.hasAttribute('hidden')).toBe(true)
    expect(el.querySelector('[cmdk-separator]')!.hasAttribute('hidden')).toBe(true)
    expect(selected()).toBe('profile')
    type('')
    expect(item('calendar').hasAttribute('hidden')).toBe(false)
    expect(el.querySelector('[cmdk-separator]')!.hasAttribute('hidden')).toBe(false)
  })
  it('clearing the search puts the list back in source order', () => {
    // sort() moves real DOM nodes while searching; cmdk's React list re-renders in source
    // order once the query empties, so the Angular list must too (it used to stay reordered).
    const { el, type } = setup()
    const order = () => [...el.querySelectorAll('[cmdk-item]:not([hidden])')].map((n) => n.getAttribute('data-value'))
    const groups = () => [...el.querySelectorAll('[cmdk-group]')].map((n) => n.getAttribute('data-value'))
    const source = order()
    const sourceGroups = groups()
    type('se')
    expect(order()).not.toEqual(source)
    type('')
    expect(order()).toEqual(source)
    expect(groups()).toEqual(sourceGroups)
  })
  it('5: matches are ranked: the better-scoring group and item move first', () => {
    const { el, type } = setup()
    type('se')
    const order = [...el.querySelectorAll('[cmdk-item]:not([hidden])')].map((n) => n.getAttribute('data-value'))
    // "settings" (contiguous prefix) outranks the Suggestions group's fuzzy hits.
    expect(order[0]).toBe('settings')
  })
  it('6: CommandEmpty shows only when nothing matches', () => {
    const { el, type } = setup()
    const empty = el.querySelector('[cmdk-empty]') as HTMLElement
    expect(empty.classList.contains('hidden')).toBe(true)
    type('zzzz')
    expect(empty.classList.contains('hidden')).toBe(false)
    expect(empty.className).toContain('py-6 text-center text-sm')
  })
  it('7: arrows move the highlight across groups, skip disabled items and stop at the ends (loop=false)', () => {
    const { selected, key } = setup()
    key('ArrowDown')
    expect(selected()).toBe('calculator')
    key('ArrowDown')
    expect(selected()).toBe('profile')
    key('End')
    expect(selected()).toBe('settings')
    key('ArrowDown')
    expect(selected()).toBe('settings')
    key('Home')
    expect(selected()).toBe('calendar')
    key('ArrowUp')
    expect(selected()).toBe('calendar')
    key('j', { ctrlKey: true })
    expect(selected()).toBe('calculator')
  })
  it('8: loop wraps; Alt+Arrow jumps to the next group', () => {
    const { selected, key } = setup({ loop: true })
    key('ArrowUp')
    expect(selected()).toBe('settings')
    key('ArrowDown')
    expect(selected()).toBe('calendar')
    key('ArrowDown', { altKey: true })
    expect(selected()).toBe('profile')
  })
  it('9: Enter and click run the item select handler; pointer move highlights', () => {
    const { host, fixture, item, selected, key } = setup()
    key('Enter')
    expect(host.ran).toEqual(['calendar'])
    item('profile').dispatchEvent(new Event('pointermove'))
    fixture.detectChanges()
    expect(selected()).toBe('profile')
    item('calculator').click()
    expect(host.ran).toEqual(['calendar', 'calculator'])
    item('emoji').dispatchEvent(new Event('pointermove'))
    fixture.detectChanges()
    expect(selected()).toBe('calculator')
  })
  it('10: CommandDialog portals an overlay + labelled dialog and focuses the search input', async () => {
    const fixture = TestBed.createComponent(DialogHost)
    fixture.detectChanges()
    expect(document.querySelector('[data-slot="command-dialog"]')).toBeNull()
    fixture.componentInstance.open.set(true)
    fixture.detectChanges()
    await tick()
    const dialog = document.querySelector<HTMLElement>('[data-uipkge-portal] [data-slot="command-dialog"]')!
    expect(document.querySelector('[data-uipkge-portal] [data-slot="command-dialog-overlay"]')).not.toBeNull()
    expect(dialog.getAttribute('role')).toBe('dialog')
    expect(document.getElementById(dialog.getAttribute('aria-labelledby')!)!.textContent).toBe('Command Palette')
    expect(document.getElementById(dialog.getAttribute('aria-describedby')!)!.textContent).toBe(
      'Search for a command to run...',
    )
    expect(document.activeElement).toBe(dialog.querySelector('input[cmdk-input]'))
    expect(dialog.querySelector('[cmdk-item][data-selected="true"]')!.getAttribute('data-value')).toBe('calendar')
  })
  it('11: CommandDialog closes on Escape (openChange false) and on item select', async () => {
    const fixture = TestBed.createComponent(DialogHost)
    fixture.componentInstance.open.set(true)
    fixture.detectChanges()
    await tick()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    fixture.detectChanges()
    expect(fixture.componentInstance.open()).toBe(false)
    await tick()
    expect(document.querySelector('[data-slot="command-dialog"]')).toBeNull()
    fixture.componentInstance.open.set(true)
    fixture.detectChanges()
    await tick()
    const input = document.querySelector<HTMLInputElement>('input[cmdk-input]')!
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
    fixture.detectChanges()
    expect(fixture.componentInstance.open()).toBe(false)
  })
})
