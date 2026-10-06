// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ElementRef } from '@angular/core'
import { create, fakeViewContainer, providing } from '../../test-utils/inject'
import {
  UiDropdownMenuCheckboxItemComponent,
  UiDropdownMenuComponent,
  UiDropdownMenuContentComponent,
  UiDropdownMenuItemComponent,
  UiDropdownMenuRadioGroupComponent,
  UiDropdownMenuRadioItemComponent,
  UiDropdownMenuSubComponent,
  UiDropdownMenuSubTriggerComponent,
  UiDropdownMenuTriggerComponent,
} from './dropdown-menu.component'

// Behaviour parity with the Radix menu the React block uses: the trigger toggles a
// body-portalled menu, keyboard opens focus the first item, arrows / Home / End /
// typeahead rove, Escape and outside clicks close and hand focus back, and selecting
// an item closes the menu unless the handler prevents it.

const here = dirname(fileURLToPath(import.meta.url))
const strip = (s: string) => s.replace(/\/\/.*$/gm, '')
const vueVariants = readFileSync(
  resolve(here, '../../../registry-vue/components/dropdown-menu/dropdown-menu-content.variants.ts'),
  'utf8',
)
const ngVariants = readFileSync(resolve(here, './dropdown-menu-content.variants.ts'), 'utf8')
const tick = () => new Promise((r) => setTimeout(r, 0))

function buildPanel(): HTMLElement[] {
  const panel = document.createElement('div')
  panel.setAttribute('data-slot', 'dropdown-menu-content')
  panel.tabIndex = -1
  for (const [label, disabled] of [
    ['Alpha', false],
    ['Beta', true],
    ['Gamma', false],
    ['Delta', false],
  ] as const) {
    const item = document.createElement('div')
    item.setAttribute('role', 'menuitem')
    item.tabIndex = -1
    if (disabled) item.setAttribute('data-disabled', '')
    item.textContent = label
    panel.appendChild(item)
  }
  return [panel]
}

function setup() {
  const menu = create(UiDropdownMenuComponent)
  const menuInjector = providing(menu)
  const triggerEl = document.body.appendChild(document.createElement('button'))
  const trigger = create(
    UiDropdownMenuTriggerComponent,
    [{ provide: ElementRef, useValue: new ElementRef(triggerEl) }],
    menuInjector,
  )
  const content = create(UiDropdownMenuContentComponent, [fakeViewContainer(buildPanel)], menuInjector)
  const item = (
    cls: typeof UiDropdownMenuItemComponent = UiDropdownMenuItemComponent,
    extra = providing(content, menuInjector),
  ) => create(cls, [{ provide: ElementRef, useValue: new ElementRef(document.createElement('div')) }], extra)
  const panel = () => document.querySelector<HTMLElement>('[data-uipkge-portal] [data-slot="dropdown-menu-content"]')
  const focused = () => document.activeElement?.textContent
  const key = (k: string) => new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true })
  return { menu, trigger, triggerEl, content, item, panel, focused, key, menuInjector }
}

describe('DropdownMenu (angular, 11 checks)', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('1: content variants stay byte-identical to the Vue registry copy', () => {
    expect(strip(ngVariants)).toBe(strip(vueVariants))
  })
  it('2: trigger click toggles open state and emits openChange', () => {
    const { menu, trigger } = setup()
    const seen: boolean[] = []
    menu.openChange.subscribe((v) => seen.push(v))
    trigger.onClick()
    expect(menu.isOpen).toBe(true)
    trigger.onClick()
    expect(menu.isOpen).toBe(false)
    expect(seen).toEqual([true, false])
  })
  it('3: opening portals the menu to <body> with data-state=open; closing removes it', async () => {
    const { menu, content, panel } = setup()
    menu.setOpen(true)
    expect(panel()?.closest('[data-uipkge-portal]')?.parentElement).toBe(document.body)
    expect(content.state()).toBe('open')
    menu.setOpen(false)
    expect(content.state()).toBe('closed')
    await tick()
    expect(panel()).toBeNull()
  })
  it('4: keyboard open focuses the first enabled item; ArrowUp opens on the last', async () => {
    const { menu, trigger, focused, key } = setup()
    trigger.onKeydown(key('Enter'))
    await tick()
    expect(focused()).toBe('Alpha')
    menu.setOpen(false)
    await tick()
    trigger.onKeydown(key('ArrowUp'))
    await tick()
    expect(focused()).toBe('Delta')
  })
  it('5: arrows / Home / End rove, skip disabled items, and stop at the ends unless loop', async () => {
    const { trigger, content, focused, key } = setup()
    trigger.onKeydown(key('ArrowDown'))
    await tick()
    content.onKeydown(key('ArrowDown'))
    expect(focused()).toBe('Gamma')
    content.onKeydown(key('End'))
    expect(focused()).toBe('Delta')
    content.onKeydown(key('ArrowDown'))
    expect(focused()).toBe('Delta') // Radix default: no wrap
    content.loop = true
    content.onKeydown(key('ArrowDown'))
    expect(focused()).toBe('Alpha')
    content.onKeydown(key('Home'))
    expect(focused()).toBe('Alpha')
  })
  it('6: typeahead jumps to the next item starting with the typed letter', async () => {
    const { trigger, content, focused, key } = setup()
    trigger.onKeydown(key('Enter'))
    await tick()
    content.onKeydown(key('d'))
    expect(focused()).toBe('Delta')
  })
  it('7: Escape closes and returns focus to the trigger', async () => {
    const { menu, trigger, triggerEl, key } = setup()
    trigger.onKeydown(key('Enter'))
    await tick()
    document.activeElement!.dispatchEvent(key('Escape'))
    expect(menu.isOpen).toBe(false)
    await tick()
    expect(document.activeElement).toBe(triggerEl)
  })
  it('8: outside pointer-down closes; pressing the trigger does not count as outside', () => {
    const { menu, triggerEl } = setup()
    menu.setOpen(true)
    triggerEl.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    expect(menu.isOpen).toBe(true)
    document.body.appendChild(document.createElement('main')).dispatchEvent(new Event('pointerdown', { bubbles: true }))
    expect(menu.isOpen).toBe(false)
  })
  it('9: selecting an item emits select and closes; preventDefault keeps it open', () => {
    const { menu, item } = setup()
    const plain = item()
    menu.setOpen(true)
    let selected = 0
    plain.select.subscribe(() => selected++)
    plain.onSelect()
    expect(selected).toBe(1)
    expect(menu.isOpen).toBe(false)
    const sticky = item()
    sticky.select.subscribe((e) => e.preventDefault())
    menu.setOpen(true)
    sticky.onSelect()
    expect(menu.isOpen).toBe(true)
  })
  it('10: radio items drive their group value; checkbox items toggle and emit', () => {
    const { item, content, menuInjector } = setup()
    const group = create(UiDropdownMenuRadioGroupComponent)
    const inGroup = providing(group, providing(content, menuInjector))
    const dark = create(
      UiDropdownMenuRadioItemComponent,
      [{ provide: ElementRef, useValue: new ElementRef(document.createElement('div')) }],
      inGroup,
    )
    dark.value = 'dark'
    let picked = ''
    group.valueChange.subscribe((v) => (picked = v))
    dark.onSelect()
    expect(group.value).toBe('dark')
    expect(picked).toBe('dark')
    expect(dark.isChecked).toBe(true)
    const box = item(UiDropdownMenuCheckboxItemComponent) as UiDropdownMenuCheckboxItemComponent
    const states: boolean[] = []
    box.checkedChange.subscribe((v) => states.push(v))
    box.onSelect()
    expect(states).toEqual([true])
  })
  it('11: disabled sub-triggers do not open via pointer, click, or keyboard', () => {
    const { menuInjector, key } = setup()
    const sub = create(UiDropdownMenuSubComponent, [], menuInjector)
    const trig = create(
      UiDropdownMenuSubTriggerComponent,
      [{ provide: ElementRef, useValue: new ElementRef(document.createElement('div')) }],
      providing(sub, menuInjector),
    )
    trig.disabled = true
    trig.onPointerMove()
    trig.openSub('pointer')
    trig.onKeydown(key('ArrowRight'))
    expect(sub.isOpen).toBe(false)
    trig.disabled = false
    trig.onKeydown(key('ArrowRight'))
    expect(sub.isOpen).toBe(true)
  })
})
