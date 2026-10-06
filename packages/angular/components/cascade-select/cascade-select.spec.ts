// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component, provideZonelessChangeDetection, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiCascadeSelectComponent } from './cascade-select.component'
import type { CascadeOption } from './types'

// Behaviour parity with the React CascadeSelect (Popover + level columns). If these break,
// users notice: the trigger does not show the chosen path, clicking a parent does not open
// its children column, a leaf click does not commit and close, disabled options can be
// picked, search does not list leaf paths, the X / Escape no longer clear, or the component
// ignores defaultValue when used without a binding.

const tick = (ms = 0) => new Promise((r) => setTimeout(r, ms))

const regions: CascadeOption[] = [
  {
    value: 'zj',
    label: 'Zhejiang',
    children: [
      {
        value: 'hz',
        label: 'Hangzhou',
        children: [
          { value: 'xihu', label: 'West Lake' },
          { value: 'bj', label: 'Binjiang' },
        ],
      },
      { value: 'nb', label: 'Ningbo', disabled: true, children: [{ value: 'hs', label: 'Haishu' }] },
    ],
  },
  { value: 'js', label: 'Jiangsu', children: [{ value: 'nj', label: 'Nanjing' }] },
]

@Component({
  standalone: true,
  imports: [UiCascadeSelectComponent],
  template: `
    @if (controlled()) {
      <ui-cascade-select
        [value]="value()"
        (valueChange)="value.set($event); changes.push($event)"
        (clear)="cleared = cleared + 1"
        [options]="options"
        [separator]="separator()"
        class="w-full"
      />
    } @else {
      <ui-cascade-select [defaultValue]="['js', 'nj']" [options]="options" (valueChange)="changes.push($event)" />
    }
  `,
})
class HostComponent {
  readonly controlled = signal(true)
  readonly value = signal<string[] | null>(null)
  readonly separator = signal(' / ')
  readonly options = regions
  changes: (string[] | null)[] = []
  cleared = 0
}

async function setup(init: (h: HostComponent) => void = () => {}) {
  TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] })
  const fixture = TestBed.createComponent(HostComponent)
  init(fixture.componentInstance)
  document.body.appendChild(fixture.nativeElement)
  fixture.detectChanges()
  await fixture.whenStable()
  const trigger = () => fixture.nativeElement.querySelector('[data-slot="cascade-select"]') as HTMLButtonElement
  const panel = () => document.querySelector<HTMLElement>('[data-uipkge-portal] [data-slot="popover-content"]')
  const columns = () => [...(panel()?.querySelectorAll<HTMLElement>('.min-w-44') ?? [])]
  const buttonIn = (col: HTMLElement, label: string) =>
    [...col.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent!.trim() === label)!
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
  return { fixture, host: fixture.componentInstance, trigger, panel, columns, buttonIn, settle, open }
}

describe('CascadeSelect (angular, 8 checks)', () => {
  it('1: trigger is a combobox (aria-haspopup=listbox) with muted placeholder and React classes', async () => {
    const { trigger } = await setup()
    const t = trigger()
    expect(t.getAttribute('role')).toBe('combobox')
    expect(t.getAttribute('aria-haspopup')).toBe('listbox')
    for (const c of ['border-input', 'bg-transparent', 'shadow-xs', 'h-9', 'px-3', 'hover:border-ring/50']) {
      expect(t.classList).toContain(c)
    }
    const label = t.querySelector('span')!
    expect(label.textContent!.trim()).toBe('Select...')
    expect(label.classList).toContain('text-muted-foreground')
    expect(t.querySelector('svg.lucide-chevron-down')).not.toBeNull()
  })

  it('2: opening shows the first level; a parent click opens its children column', async () => {
    const { open, columns, buttonIn, settle, trigger } = await setup()
    await open()
    expect(trigger().getAttribute('aria-expanded')).toBe('true')
    expect(columns().length).toBe(1)
    buttonIn(columns()[0], 'Zhejiang').click()
    await settle()
    expect(columns().length).toBe(2)
    expect(columns()[1].textContent).toContain('Hangzhou')
    expect(buttonIn(columns()[0], 'Zhejiang').className).toContain('bg-accent')
  })

  it('3: a leaf click commits the full path, closes, and shows the joined labels', async () => {
    const { host, open, columns, buttonIn, settle, trigger, fixture } = await setup()
    await open()
    buttonIn(columns()[0], 'Zhejiang').click()
    await settle()
    buttonIn(columns()[1], 'Hangzhou').click()
    await settle()
    buttonIn(columns()[2], 'West Lake').click()
    await settle()
    await tick(250)
    fixture.detectChanges()
    expect(host.changes).toEqual([['zj', 'hz', 'xihu']])
    expect(trigger().getAttribute('aria-expanded')).toBe('false')
    expect(trigger().querySelector('span')!.textContent!.trim()).toBe('Zhejiang / Hangzhou / West Lake')
  })

  it('4: disabled options are disabled buttons and never open or commit', async () => {
    const { host, open, columns, buttonIn, settle } = await setup()
    await open()
    buttonIn(columns()[0], 'Zhejiang').click()
    await settle()
    const ningbo = buttonIn(columns()[1], 'Ningbo')
    expect(ningbo.disabled).toBe(true)
    expect(columns().length).toBe(2)
    expect(host.changes).toEqual([])
  })

  it('5: search lists matching leaf paths only and commits on click', async () => {
    const { host, open, panel, settle } = await setup()
    await open()
    const input = panel()!.querySelector<HTMLInputElement>('input[aria-label="Search options"]')!
    input.value = 'an'
    input.dispatchEvent(new Event('input'))
    await settle()
    const results = [...panel()!.querySelectorAll<HTMLButtonElement>('button')].map((b) => b.textContent!.trim())
    // "Jiangsu"/"Hangzhou" are parents: only leaves are listed, as full paths.
    expect(results).toEqual(['Zhejiang / Hangzhou / Binjiang', 'Jiangsu / Nanjing'])
    panel()!.querySelectorAll<HTMLButtonElement>('button')[1].click()
    await settle()
    expect(host.changes).toEqual([['js', 'nj']])
  })

  it('6: the X clears (without opening) and fires clear', async () => {
    const { host, trigger, settle, panel } = await setup((h) => h.value.set(['js', 'nj']))
    trigger().querySelector<HTMLElement>('span[aria-hidden="true"]')!.click()
    await settle()
    expect(host.changes).toEqual([null])
    expect(host.cleared).toBe(1)
    expect(panel()).toBeNull()
  })

  it('7: Escape on the closed trigger clears the value', async () => {
    const { host, trigger, settle } = await setup((h) => h.value.set(['js', 'nj']))
    trigger().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await settle()
    expect(host.changes).toEqual([null])
  })

  it('8: uncontrolled: defaultValue shows, and a new pick updates the label without a binding', async () => {
    const { host, trigger, open, columns, buttonIn, settle } = await setup((h) => h.controlled.set(false))
    expect(trigger().querySelector('span')!.textContent!.trim()).toBe('Jiangsu / Nanjing')
    await open()
    // Opening syncs the active path with the value: Jiangsu's column is already open.
    expect(columns().length).toBe(2)
    buttonIn(columns()[0], 'Zhejiang').click()
    await settle()
    buttonIn(columns()[1], 'Hangzhou').click()
    await settle()
    buttonIn(columns()[2], 'Binjiang').click()
    await settle()
    expect(host.changes).toEqual([['zj', 'hz', 'bj']])
    expect(trigger().querySelector('span')!.textContent!.trim()).toBe('Zhejiang / Hangzhou / Binjiang')
  })
})
