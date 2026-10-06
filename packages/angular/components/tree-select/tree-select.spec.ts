// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component, provideZonelessChangeDetection, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiTreeSelectComponent, type TreeSelectValue } from './tree-select.component'
import { treeSelectTriggerVariants } from './tree-select.variants'
import type { TreeSelectNode } from './types'

// Behaviour parity with the React TreeSelect (Popover + role=tree). If these break, users
// notice: the trigger label is wrong, folders do not expand, single mode does not commit +
// close, a parent checkbox does not cascade to its leaves (or shows no partial state),
// search hides the path to a match, the footer "Clear all" / X stop working, or arrow keys
// no longer move between rows.

const tick = (ms = 0) => new Promise((r) => setTimeout(r, ms))

const files: TreeSelectNode[] = [
  {
    value: 'src',
    label: 'src',
    children: [
      { value: 'src/a.ts', label: 'a.ts' },
      { value: 'src/b.ts', label: 'b.ts' },
    ],
  },
  { value: 'readme', label: 'README.md' },
  { value: 'locked', label: 'locked', disabled: true },
]

@Component({
  standalone: true,
  imports: [UiTreeSelectComponent],
  template: `
    <ui-tree-select
      [value]="value()"
      (valueChange)="value.set($event); changes.push($event)"
      [data]="data"
      [multiple]="multiple()"
      [defaultExpandAll]="expandAll()"
      class="w-full"
    />
  `,
})
class HostComponent {
  readonly value = signal<TreeSelectValue>(null)
  readonly multiple = signal(false)
  readonly expandAll = signal(false)
  readonly data = files
  changes: TreeSelectValue[] = []
}

async function setup(init: (h: HostComponent) => void = () => {}) {
  TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] })
  const fixture = TestBed.createComponent(HostComponent)
  init(fixture.componentInstance)
  document.body.appendChild(fixture.nativeElement)
  fixture.detectChanges()
  await fixture.whenStable()
  const trigger = () => fixture.nativeElement.querySelector('[data-slot="tree-select"]') as HTMLButtonElement
  const panel = () => document.querySelector<HTMLElement>('[data-uipkge-portal] [data-slot="popover-content"]')
  const rows = () => [...(panel()?.querySelectorAll<HTMLElement>('[data-tree-row]') ?? [])]
  const row = (id: string) => panel()!.querySelector<HTMLElement>(`[data-tree-row][data-tree-id="${id}"]`)!
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
  return { fixture, host: fixture.componentInstance, trigger, panel, rows, row, settle, open }
}

describe('TreeSelect (angular, 8 checks)', () => {
  it('1: trigger is a combobox using treeSelectTriggerVariants with a muted placeholder', async () => {
    const { trigger } = await setup()
    const t = trigger()
    expect(t.getAttribute('role')).toBe('combobox')
    for (const c of treeSelectTriggerVariants({ size: 'default' }).split(' ')) expect(t.classList).toContain(c)
    expect(t.querySelector('span')!.classList).toContain('text-muted-foreground')
    expect(t.querySelector('span')!.textContent!.trim()).toBe('Select...')
  })

  it('2: opens a role=tree with top-level rows; the chevron expands a folder', async () => {
    const { open, panel, rows, row, settle } = await setup()
    await open()
    expect(panel()!.querySelector('[role="tree"]')).not.toBeNull()
    expect(rows().map((r) => r.dataset['treeId'])).toEqual(['src', 'readme', 'locked'])
    row('src').querySelector<HTMLButtonElement>('button[aria-label="Expand"]')!.click()
    await settle()
    expect(rows().map((r) => r.dataset['treeId'])).toEqual(['src', 'src/a.ts', 'src/b.ts', 'readme', 'locked'])
    expect(row('src').parentElement!.getAttribute('aria-expanded')).toBe('true')
  })

  it('3: single mode: a row click commits, closes, and shows the label', async () => {
    const { host, open, row, settle, trigger, fixture } = await setup()
    await open()
    row('readme').click()
    await settle()
    await tick(250)
    fixture.detectChanges()
    expect(host.changes).toEqual(['readme'])
    expect(trigger().getAttribute('aria-expanded')).toBe('false')
    expect(trigger().querySelector('span')!.textContent!.trim()).toBe('README.md')
  })

  it('4: disabled rows are not focusable and never commit', async () => {
    const { host, open, row, settle } = await setup()
    await open()
    expect(row('locked').getAttribute('tabindex')).toBe('-1')
    row('locked').click()
    await settle()
    expect(host.changes).toEqual([])
  })

  it('5: multiple: a parent toggles all leaves; a partial parent is indeterminate', async () => {
    const { host, open, row, settle, panel } = await setup((h) => {
      h.multiple.set(true)
      h.expandAll.set(true)
      h.value.set([])
    })
    await open()
    row('src').click()
    await settle()
    expect(host.value()).toEqual(['src/a.ts', 'src/b.ts'])
    row('src/a.ts').click()
    await settle()
    expect(host.value()).toEqual(['src/b.ts'])
    const box = row('src').querySelector<HTMLInputElement>('input[type="checkbox"]')!
    expect(box.indeterminate).toBe(true)
    expect(panel()!.textContent).toContain('1 selected')
  })

  it('6: search keeps matches and their ancestors, expanding the ancestors', async () => {
    const { open, panel, rows, settle } = await setup()
    await open()
    const input = panel()!.querySelector<HTMLInputElement>('input[aria-label="Search tree"]')!
    input.value = 'b.ts'
    input.dispatchEvent(new Event('input'))
    await settle()
    expect(rows().map((r) => r.dataset['treeId'])).toEqual(['src', 'src/b.ts'])
    input.value = 'zzz'
    input.dispatchEvent(new Event('input'))
    await settle()
    expect(panel()!.textContent).toContain('No results found.')
  })

  it('7: Clear X and the footer "Clear all" empty the value', async () => {
    const { host, trigger, settle, open, panel } = await setup((h) => {
      h.multiple.set(true)
      h.value.set(['readme'])
    })
    expect(trigger().querySelector('span')!.textContent!.trim()).toBe('README.md')
    await open()
    const clearAll = [...panel()!.querySelectorAll('button')].find((b) => b.textContent!.trim() === 'Clear all')!
    clearAll.click()
    await settle()
    expect(host.changes).toEqual([[]])
    host.value.set('readme')
    host.multiple.set(false)
    await settle()
    trigger().querySelector<HTMLElement>('[aria-label="Clear"]')!.click()
    await settle()
    expect(host.changes).toEqual([[], null])
  })

  it('8: arrow keys move focus between rows; ArrowRight expands a folder', async () => {
    const { open, row, settle } = await setup()
    await open()
    row('src').focus()
    row('src').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    expect(document.activeElement).toBe(row('readme'))
    row('readme').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))
    expect(document.activeElement).toBe(row('src'))
    row('src').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await settle()
    expect(row('src/a.ts')).not.toBeNull()
  })
})
