// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest'
import { Component, provideZonelessChangeDetection, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { UiTimePickerComponent, UiTimeRangePickerComponent, type TimeFormat } from './time-picker.component'

// React TimePicker / TimeRangePicker / TimeColumns parity. If these break, users see: the
// trigger not showing the formatted time (or placeholder), the popover not opening, clicks
// in the hour / minute columns not updating the value, 12-hour mode flipping AM/PM wrong,
// disabled hours still pickable (or hidden ones still listed), the clear control opening
// the popover instead of clearing, presets not closing it, the range picker losing one end,
// and [formControl] bindings not flowing.

// jsdom has no layout: TimeColumns centres the active rows with scrollIntoView.
Element.prototype.scrollIntoView ??= function () {}

const tick = (ms = 0) => new Promise((r) => setTimeout(r, ms))

@Component({
  standalone: true,
  imports: [UiTimePickerComponent, UiTimeRangePickerComponent, ReactiveFormsModule],
  template: `
    <button
      id="tp"
      ui-time-picker
      [value]="value()"
      (valueChange)="changes.push($event); value.set($event)"
      [format]="format()"
      [use12Hours]="use12()"
      [disabledHours]="disabledHours()"
      [hideDisabledOptions]="hide()"
      [minuteStep]="15"
      [presets]="presets"
      [disabled]="disabled()"
    ></button>
    <button
      id="range"
      ui-time-range-picker
      [value]="range()"
      (valueChange)="rangeChanges.push($event); range.set($event)"
    ></button>
    <button id="form" ui-time-picker [formControl]="control"></button>
  `,
})
class Host {
  readonly value = signal<string | undefined>('09:30')
  readonly format = signal<TimeFormat>('HH:mm')
  readonly use12 = signal(false)
  readonly disabledHours = signal<(() => number[]) | undefined>(undefined)
  readonly hide = signal(false)
  readonly disabled = signal(false)
  readonly range = signal<[string, string] | null>(null)
  readonly presets = [{ label: 'Noon', value: '12:00' }]
  readonly control = new FormControl<string>('07:15')
  changes: string[] = []
  rangeChanges: ([string, string] | null)[] = []
}

async function setup(init: (h: Host) => void = () => {}) {
  TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] })
  const fixture = TestBed.createComponent(Host)
  init(fixture.componentInstance)
  document.body.appendChild(fixture.nativeElement)
  fixture.detectChanges()
  await fixture.whenStable()
  const $ = (sel: string) => fixture.nativeElement.querySelector(sel) as HTMLButtonElement
  const panel = () => document.querySelector<HTMLElement>('[data-uipkge-portal] [data-slot="popover-content"]')
  const columns = () => [...(panel()?.querySelectorAll('[data-slot="scroll-area"]') ?? [])]
  const cells = (col: number) => [...columns()[col]!.querySelectorAll('button')]
  const cell = (col: number, text: string) => cells(col).find((b) => b.textContent!.trim() === text)!
  const settle = async () => {
    fixture.detectChanges()
    await tick()
    await fixture.whenStable()
    fixture.detectChanges()
  }
  return { fixture, host: fixture.componentInstance, $, panel, columns, cells, cell, settle }
}

describe('TimePicker (angular, 10 checks)', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('1: the host button is the outline trigger showing the clock, value and clear control', async () => {
    const { $ } = await setup()
    const tp = $('#tp')
    expect(tp.getAttribute('data-slot')).toBe('time-picker')
    expect(tp.getAttribute('aria-haspopup')).toBe('dialog')
    expect(tp.getAttribute('aria-expanded')).toBe('false')
    expect(tp.className).toContain('min-w-[160px]')
    expect(tp.querySelector('svg.lucide-clock')).not.toBeNull()
    expect(tp.querySelector('.flex-1.truncate')!.textContent).toBe('09:30')
    expect(tp.querySelector('[aria-label="Clear time"]')).not.toBeNull()
  })

  it('2: empty value shows the placeholder muted, with no clear control', async () => {
    const { $ } = await setup((h) => h.value.set(''))
    expect($('#tp').querySelector('.flex-1.truncate')!.textContent).toBe('Pick a time')
    expect($('#tp').className).toContain('text-muted-foreground')
    expect($('#tp').querySelector('[aria-label="Clear time"]')).toBeNull()
  })

  it('3: clicking opens the popover with hour / minute columns; active rows are marked', async () => {
    const { $, panel, columns, cell, settle } = await setup()
    $('#tp').click()
    await settle()
    expect($('#tp').getAttribute('aria-expanded')).toBe('true')
    expect(panel()).not.toBeNull()
    expect(columns().length).toBe(2)
    expect(cell(0, '09').getAttribute('data-active')).toBe('true')
    expect(cell(1, '30').getAttribute('data-active')).toBe('true')
    expect(cell(1, '15')).toBeDefined() // minuteStep 15 -> 00 15 30 45
    expect(columns()[1]!.querySelectorAll('button').length).toBe(4)
  })

  it('4: picking an hour / minute emits 24h HH:mm and keeps the popover open', async () => {
    const { host, panel, cell, $, settle } = await setup()
    $('#tp').click()
    await settle()
    cell(0, '14').click()
    await settle()
    expect(host.changes).toEqual(['14:30'])
    cell(1, '45').click()
    await settle()
    expect(host.changes).toEqual(['14:30', '14:45'])
    expect(panel()).not.toBeNull()
    expect($('#tp').querySelector('.flex-1.truncate')!.textContent).toBe('14:45')
  })

  it('5: format "hh:mm A" shows 12h labels and an AM/PM column that flips the half-day', async () => {
    const { host, $, panel, cells, settle } = await setup((h) => {
      h.value.set('14:30')
      h.format.set('hh:mm A')
    })
    expect($('#tp').querySelector('.flex-1.truncate')!.textContent).toBe('02:30 PM')
    $('#tp').click()
    await settle()
    expect(cells(0).map((b) => b.textContent!.trim())[0]).toBe('01')
    const am = [...panel()!.querySelectorAll('button')].find((b) => b.textContent!.trim() === 'AM')!
    am.click()
    await settle()
    expect(host.changes).toEqual(['02:30'])
  })

  it('6: disabledHours greys hours out; hideDisabledOptions removes them', async () => {
    const off = () => [0, 1, 2, 3, 4, 5, 6, 7, 8]
    const a = await setup((h) => h.disabledHours.set(off))
    a.$('#tp').click()
    await a.settle()
    expect(a.cell(0, '08').disabled).toBe(true)
    expect(a.cell(0, '09').disabled).toBe(false)
    document.body.innerHTML = ''
    TestBed.resetTestingModule()
    const b = await setup((h) => {
      h.disabledHours.set(off)
      h.hide.set(true)
    })
    b.$('#tp').click()
    await b.settle()
    expect(b.cells(0)[0]!.textContent!.trim()).toBe('09')
  })

  it('7: the clear control empties the value without opening the popover', async () => {
    const { host, $, panel, settle } = await setup()
    $('#tp').querySelector<HTMLElement>('[aria-label="Clear time"]')!.click()
    await settle()
    expect(host.changes).toEqual([''])
    expect(panel()).toBeNull()
  })

  it('8: presets apply their value and close the popover', async () => {
    const { host, $, panel, settle } = await setup()
    $('#tp').click()
    await settle()
    const noon = [...panel()!.querySelectorAll('button')].find((b) => b.textContent!.trim() === 'Noon')!
    noon.click()
    await settle()
    await new Promise((r) => setTimeout(r, 250))
    await settle()
    expect(host.changes).toEqual(['12:00'])
    expect($('#tp').getAttribute('aria-expanded')).toBe('false')
  })

  it('9: disabled trigger does not open', async () => {
    const { $, panel, settle } = await setup((h) => h.disabled.set(true))
    expect($('#tp').disabled).toBe(true)
    $('#tp').click()
    await settle()
    expect(panel()).toBeNull()
  })

  it('10: TimeRangePicker emits [start, end] (filling the missing end); [formControl] flows both ways', async () => {
    const { host, $, cell, settle } = await setup()
    expect($('#range').querySelector('.flex-1.truncate')!.textContent).toBe('Pick a time range')
    $('#range').click()
    await settle()
    cell(0, '09').click() // start column hours
    await settle()
    expect(host.rangeChanges[0]).toEqual(['09:00', '09:00'])
    expect($('#range').querySelector('.flex-1.truncate')!.textContent).toBe('09:00 ~ 09:00')
    expect($('#form').querySelector('.flex-1.truncate')!.textContent).toBe('07:15')
    host.control.setValue('18:05')
    await settle()
    expect($('#form').querySelector('.flex-1.truncate')!.textContent).toBe('18:05')
    host.control.disable()
    await settle()
    expect($('#form').disabled).toBe(true)
  })
})
