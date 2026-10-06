// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component, provideZonelessChangeDetection, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiAdvanceSelectComponent, type AdvanceSelectMode } from './advance-select.component'
import { readKey } from './types'

// Behaviour parity with the React AdvanceSelect (Popover + Command). If these break, users
// notice: the trigger shows a stale or unstyled label, the list does not open next to the
// trigger, picking an option does not update the value (or the popover stays open in single
// mode), tag chips cannot be removed, the clear X is missing, typing does not filter, tags
// mode cannot create entries, maxCount lets users over-select, and Escape does not close.

const tick = (ms = 0) => new Promise((r) => setTimeout(r, ms))

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry', group: 'Stone' },
]

@Component({
  standalone: true,
  imports: [UiAdvanceSelectComponent],
  template: `
    <ui-advance-select
      [value]="value()"
      (valueChange)="value.set($event); changes.push($event)"
      (clear)="cleared = cleared + 1"
      [mode]="mode()"
      [options]="options()"
      [showSearch]="showSearch()"
      [loading]="loading()"
      [maxCount]="maxCount()"
      [maxTagCount]="maxTagCount()"
      placeholder="Pick"
      class="w-64"
    />
  `,
})
class HostComponent {
  readonly value = signal<unknown>(undefined)
  readonly mode = signal<AdvanceSelectMode>('single')
  readonly options = signal<Record<string, unknown>[]>(fruits)
  readonly showSearch = signal(false)
  readonly loading = signal(false)
  readonly maxCount = signal<number | undefined>(undefined)
  readonly maxTagCount = signal<number | undefined>(undefined)
  changes: unknown[] = []
  cleared = 0
}

async function setup(init: (h: HostComponent) => void = () => {}) {
  TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] })
  const fixture = TestBed.createComponent(HostComponent)
  init(fixture.componentInstance)
  document.body.appendChild(fixture.nativeElement)
  fixture.detectChanges()
  await fixture.whenStable()
  const host = fixture.componentInstance
  const trigger = () => fixture.nativeElement.querySelector('[data-slot="advance-select"]') as HTMLButtonElement
  const panel = () => document.querySelector<HTMLElement>('[data-uipkge-portal] [data-slot="popover-content"]')
  const items = () => [...(panel()?.querySelectorAll<HTMLElement>('[cmdk-item]:not([hidden])') ?? [])]
  const settle = async () => {
    fixture.detectChanges()
    await fixture.whenStable()
    await tick()
    fixture.detectChanges()
  }
  const open = async () => {
    trigger().click()
    await settle()
  }
  const type = async (text: string) => {
    const input = panel()!.querySelector<HTMLInputElement>('[cmdk-input]')!
    input.value = text
    input.dispatchEvent(new Event('input'))
    await settle()
    return input
  }
  return { fixture, host, trigger, panel, items, settle, open, type }
}

describe('AdvanceSelect (angular, 10 checks)', () => {
  it('1: closed trigger is a combobox button with muted placeholder, chevron and React classes', async () => {
    const { trigger, panel } = await setup()
    const t = trigger()
    expect(t.tagName).toBe('BUTTON')
    expect(t.getAttribute('role')).toBe('combobox')
    expect(t.getAttribute('aria-expanded')).toBe('false')
    for (const c of ['h-9', 'text-sm', 'px-3', 'py-1.5', 'border-input', 'bg-transparent', 'shadow-xs', 'w-64']) {
      expect(t.classList).toContain(c)
    }
    expect(t.classList).not.toContain('w-full')
    const label = t.querySelector('span')!
    expect(label.textContent!.trim()).toBe('Pick')
    expect(label.className).toContain('text-muted-foreground')
    expect(t.querySelector('svg.lucide-chevron-down')).not.toBeNull()
    expect(panel()).toBeNull()
  })

  it('2: clicking the trigger opens the list in a body portal with one item per option', async () => {
    const { trigger, open, panel, items } = await setup()
    await open()
    expect(trigger().getAttribute('aria-expanded')).toBe('true')
    expect(panel()).not.toBeNull()
    expect(items().map((i) => i.textContent!.trim())).toEqual(['Apple', 'Banana', 'Cherry'])
    expect(panel()!.style.width).toBe('var(--radix-popover-trigger-width)')
  })

  it('3: single mode: picking an option emits it, closes, and shows its label + clear X', async () => {
    const { host, trigger, open, items, settle, fixture } = await setup()
    await open()
    items()[1].click()
    await settle()
    await tick(250)
    fixture.detectChanges()
    expect(host.changes).toEqual(['banana'])
    expect(trigger().getAttribute('aria-expanded')).toBe('false')
    expect(trigger().querySelector('span')!.textContent!.trim()).toBe('Banana')
    expect(trigger().querySelector('span')!.className).toContain('text-foreground')
    expect(trigger().querySelector('[aria-label="Clear selection"]')).not.toBeNull()
  })

  it('4: clear X empties the value, fires clear, and does not open the popover', async () => {
    const { host, trigger, settle, panel } = await setup((h) => h.value.set('apple'))
    trigger().querySelector<HTMLElement>('[aria-label="Clear selection"]')!.click()
    await settle()
    expect(host.changes).toEqual([null])
    expect(host.cleared).toBe(1)
    expect(panel()).toBeNull()
  })

  it('5: multiple mode renders removable Badge chips; the chip X removes only that value', async () => {
    const { host, trigger, settle, panel } = await setup((h) => {
      h.mode.set('multiple')
      h.value.set(['apple', 'banana'])
    })
    const chips = trigger().querySelectorAll('[data-slot="badge"]')
    expect(chips.length).toBe(2)
    chips[0].querySelector<HTMLElement>('[aria-label="Remove Apple"]')!.click()
    await settle()
    expect(host.changes).toEqual([['banana']])
    expect(panel()).toBeNull()
  })

  it('6: multiple mode toggles options, keeps the popover open, and shows the "N selected" footer', async () => {
    const { host, open, items, settle, panel } = await setup((h) => h.mode.set('multiple'))
    await open()
    items()[0].click()
    await settle()
    items()[2].click()
    await settle()
    expect(host.value()).toEqual(['apple', 'cherry'])
    expect(panel()).not.toBeNull()
    expect(panel()!.textContent).toContain('2 selected')
    items()[0].click()
    await settle()
    expect(host.value()).toEqual(['cherry'])
  })

  it('7: showSearch filters by label; no match shows the empty text', async () => {
    const { open, type, items, panel } = await setup((h) => h.showSearch.set(true))
    await open()
    await type('an')
    expect(items().map((i) => i.textContent!.trim())).toEqual(['Banana'])
    await type('zzz')
    expect(items().length).toBe(0)
    expect(panel()!.querySelector('[cmdk-empty]')!.textContent!.trim()).toBe('No results.')
  })

  it('8: tags mode always shows search and Enter creates a new tag from the query', async () => {
    const { host, open, type, settle } = await setup((h) => {
      h.mode.set('tags')
      h.value.set([])
    })
    await open()
    const input = await type('mango')
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
    await settle()
    expect(host.value()).toEqual(['mango'])
  })

  it('9: maxCount disables unselected options; maxTagCount collapses the rest into +N', async () => {
    const { open, items, trigger } = await setup((h) => {
      h.mode.set('multiple')
      h.value.set(['apple', 'banana'])
      h.maxCount.set(2)
      h.maxTagCount.set(1)
    })
    const chips = [...trigger().querySelectorAll('[data-slot="badge"]')].map((c) => c.textContent!.trim())
    expect(chips).toEqual(['Apple', '+1'])
    await open()
    expect(items().map((i) => i.getAttribute('data-disabled'))).toEqual(['false', 'false', 'true'])
  })

  it('10: grouped options render headings + separator; Escape closes the list', async () => {
    const { open, panel, settle, trigger } = await setup()
    await open()
    expect(panel()!.querySelectorAll('[cmdk-separator]').length).toBe(1)
    expect(panel()!.querySelector('[cmdk-group-heading]')!.textContent).toBe('Stone')
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await settle()
    expect(trigger().getAttribute('aria-expanded')).toBe('false')
    expect(readKey({ name: 'x' }, 'name')).toBe('x')
  })
})
