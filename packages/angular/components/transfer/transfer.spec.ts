// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component, provideZonelessChangeDetection, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiTransferComponent, type TransferItem } from './transfer.component'

// Behaviour parity with the React Transfer. If these break, users notice: items do not
// split between Source and Target, checking rows does not enable the move buttons, moving
// does not update targetKeys, disabled rows can be moved, search / pagination stop
// narrowing a column, oneWay still offers the way back, keyboard transfer shortcuts do
// nothing, or selectable=false loses the desktop click / Cmd / Shift selection model.

const tick = (ms = 0) => new Promise((r) => setTimeout(r, ms))

const data: TransferItem[] = [
  { key: 'a', label: 'Alpha' },
  { key: 'b', label: 'Beta' },
  { key: 'c', label: 'Gamma', disabled: true },
  { key: 'd', label: 'Delta', description: 'Group D' },
]

@Component({
  standalone: true,
  imports: [UiTransferComponent],
  template: `
    <ui-transfer
      [targetKeys]="target()"
      (targetKeysChange)="target.set($event)"
      (transferChange)="moves.push($event)"
      [dataSource]="source()"
      [showSearch]="showSearch()"
      [pagination]="pagination()"
      [oneWay]="oneWay()"
      [selectable]="selectable()"
    />
  `,
})
class HostComponent {
  readonly target = signal<string[]>(['d'])
  readonly source = signal<TransferItem[]>(data)
  readonly showSearch = signal(false)
  readonly pagination = signal<boolean | { pageSize: number }>(false)
  readonly oneWay = signal(false)
  readonly selectable = signal(true)
  moves: { keys: string[]; direction: string; moved: string[] }[] = []
}

async function setup(init: (h: HostComponent) => void = () => {}) {
  TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] })
  const fixture = TestBed.createComponent(HostComponent)
  init(fixture.componentInstance)
  document.body.appendChild(fixture.nativeElement)
  fixture.detectChanges()
  await fixture.whenStable()
  const el = fixture.nativeElement as HTMLElement
  const lists = () => [...el.querySelectorAll<HTMLElement>('ul[role="listbox"]')]
  const labels = (i: number) =>
    [...lists()[i].querySelectorAll('li[role="option"] .truncate:first-child')].map((n) => n.textContent)
  const option = (i: number, label: string) =>
    [...lists()[i].querySelectorAll<HTMLElement>('li[role="option"]')].find((li) => li.textContent!.includes(label))!
  const moveRight = () => el.querySelector<HTMLButtonElement>('[aria-label="Move selected to right"]')!
  const moveLeft = () => el.querySelector<HTMLButtonElement>('[aria-label="Move selected to left"]')
  const settle = async () => {
    fixture.detectChanges()
    await fixture.whenStable()
    await tick()
  }
  return { fixture, host: fixture.componentInstance, el, lists, labels, option, moveRight, moveLeft, settle }
}

describe('Transfer (angular, 8 checks)', () => {
  it('1: splits dataSource into Source / Target lists with "selected/total" counts', async () => {
    const { el, labels } = await setup()
    expect(el.querySelector('ui-transfer')!.getAttribute('data-slot')).toBe('transfer')
    expect(labels(0)).toEqual(['Alpha', 'Beta', 'Gamma'])
    expect(labels(1)).toEqual(['Delta'])
    const headers = [...el.querySelectorAll('.tabular-nums')].map((n) => n.textContent!.trim())
    expect(headers).toEqual(['0/3', '0/1'])
  })

  it('2: checking a row enables the move button; moving updates targetKeys and emits transferChange', async () => {
    const { host, option, moveRight, settle, labels } = await setup()
    expect(moveRight().disabled).toBe(true)
    option(0, 'Alpha').click()
    await settle()
    expect(option(0, 'Alpha').getAttribute('aria-selected')).toBe('true')
    expect(moveRight().disabled).toBe(false)
    moveRight().click()
    await settle()
    expect(host.target()).toEqual(['d', 'a'])
    expect(host.moves).toEqual([{ keys: ['d', 'a'], direction: 'right', moved: ['a'] }])
    expect(labels(1)).toEqual(['Alpha', 'Delta'])
  })

  it('3: disabled rows are not focusable and cannot be selected; select-all skips them', async () => {
    const { option, settle, lists, el } = await setup()
    expect(option(0, 'Gamma').getAttribute('tabindex')).toBe('-1')
    option(0, 'Gamma').click()
    await settle()
    expect(option(0, 'Gamma').getAttribute('aria-selected')).toBe('false')
    // Header select-all checkbox (first checkbox in the left column).
    el.querySelector<HTMLButtonElement>('button[role="checkbox"]')!.click()
    await settle()
    const selected = [...lists()[0].querySelectorAll('li[aria-selected="true"]')].map((li) => li.textContent!.trim())
    expect(selected).toEqual(['Alpha', 'Beta'])
  })

  it('4: search filters each column independently', async () => {
    const { el, labels, settle } = await setup((h) => h.showSearch.set(true))
    const inputs = el.querySelectorAll<HTMLInputElement>('input')
    expect(inputs[0].getAttribute('aria-label')).toBe('Search Source')
    inputs[0].value = 'be'
    inputs[0].dispatchEvent(new Event('input'))
    await settle()
    expect(labels(0)).toEqual(['Beta'])
    expect(labels(1)).toEqual(['Delta'])
  })

  it('5: pagination slices the list and Prev / Next move between pages', async () => {
    const { el, labels, settle } = await setup((h) => {
      h.target.set([])
      h.pagination.set({ pageSize: 2 })
    })
    expect(labels(0)).toEqual(['Alpha', 'Beta'])
    el.querySelector<HTMLButtonElement>('[aria-label="Next page of Source"]')!.click()
    await settle()
    expect(labels(0)).toEqual(['Gamma', 'Delta'])
    expect(el.querySelector('[aria-live="polite"]')!.textContent!.trim()).toBe('2 / 2')
  })

  it('6: oneWay hides the move-left button', async () => {
    const { moveLeft } = await setup((h) => h.oneWay.set(true))
    expect(moveLeft()).toBeNull()
  })

  it('7: keyboard: arrows move focus; Alt+ArrowRight transfers the focused row', async () => {
    const { host, option, settle } = await setup()
    option(0, 'Alpha').focus()
    option(0, 'Alpha').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    expect(document.activeElement).toBe(option(0, 'Beta'))
    option(0, 'Beta').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', altKey: true, bubbles: true }))
    await settle()
    expect(host.target()).toEqual(['d', 'b'])
  })

  it('8: selectable=false: no checkboxes; click replaces, Cmd toggles, Shift selects a range', async () => {
    const { el, option, settle, lists } = await setup((h) => {
      h.selectable.set(false)
      h.target.set([])
    })
    expect(el.querySelector('button[role="checkbox"]')).toBeNull()
    const selected = () =>
      [...lists()[0].querySelectorAll('li[aria-selected="true"] .truncate:first-child')].map((n) => n.textContent)
    option(0, 'Alpha').click()
    await settle()
    expect(selected()).toEqual(['Alpha'])
    option(0, 'Beta').dispatchEvent(new MouseEvent('click', { bubbles: true, metaKey: true }))
    await settle()
    expect(selected()).toEqual(['Alpha', 'Beta'])
    option(0, 'Delta').dispatchEvent(new MouseEvent('click', { bubbles: true, shiftKey: true }))
    await settle()
    // Range from the last anchor (Beta) to Delta over enabled rows only.
    expect(selected()).toEqual(['Beta', 'Delta'])
    expect(option(0, 'Beta').className).toContain('bg-accent')
  })
})
