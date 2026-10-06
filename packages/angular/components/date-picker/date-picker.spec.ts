// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest'
import { Component, provideZonelessChangeDetection, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import {
  UiDatePickerComponent,
  type DatePickerPicker,
  type DatePickerType,
  type DatePickerValue,
} from './date-picker.component'
import { coerceDate } from './date-picker-utils'

// React DatePicker parity. If these break, users see: a trigger that does not show the
// formatted date (or placeholder), picking a day that does not update / close the picker,
// ranges emitting half-finished values, month / week / quarter grids snapping to the wrong
// date, confirm mode applying before OK, showTime losing the chosen time, presets doing
// nothing, min / max days still pickable, a clear control that opens the popover, and
// [formControl] bindings not flowing.

Element.prototype.scrollIntoView ??= function () {}
const tick = (ms = 0) => new Promise((r) => setTimeout(r, ms))

@Component({
  standalone: true,
  imports: [UiDatePickerComponent, ReactiveFormsModule],
  template: `
    <button
      id="dp"
      ui-date-picker
      [value]="value()"
      (valueChange)="changes.push($event); value.set($event)"
      [type]="type()"
      [picker]="picker()"
      [needConfirm]="confirm()"
      [showTime]="showTime()"
      [minValue]="min()"
      [presets]="presets()"
      [disabled]="disabled()"
    ></button>
    <button id="form" ui-date-picker [formControl]="control"></button>
  `,
})
class Host {
  readonly value = signal<DatePickerValue>(null)
  readonly type = signal<DatePickerType>('single')
  readonly picker = signal<DatePickerPicker>('day')
  readonly confirm = signal(false)
  readonly showTime = signal(false)
  readonly min = signal<string | undefined>(undefined)
  readonly presets = signal<{ label: string; value: DatePickerValue }[] | undefined>(undefined)
  readonly disabled = signal(false)
  readonly control = new FormControl<DatePickerValue>('2026-03-04')
  changes: DatePickerValue[] = []
}

const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const now = new Date()
const dayIso = (n: number) => iso(new Date(now.getFullYear(), now.getMonth(), n))

async function setup(init: (h: Host) => void = () => {}) {
  TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] })
  const fixture = TestBed.createComponent(Host)
  init(fixture.componentInstance)
  document.body.appendChild(fixture.nativeElement)
  fixture.detectChanges()
  await fixture.whenStable()
  const $ = (sel: string) => fixture.nativeElement.querySelector(sel) as HTMLButtonElement
  const label = (sel = '#dp') => $(sel).querySelector('.flex-1.truncate')!.textContent
  const panel = () => document.querySelector<HTMLElement>('[data-uipkge-portal] [data-slot="popover-content"]')
  const day = (n: number) =>
    panel()!.querySelector<HTMLButtonElement>(`td[data-day="${dayIso(n)}"]:not([data-outside]) button`)!
  const button = (text: string) => [...panel()!.querySelectorAll('button')].find((b) => b.textContent!.trim() === text)!
  const settle = async (ms = 0) => {
    fixture.detectChanges()
    await tick(ms)
    await fixture.whenStable()
    fixture.detectChanges()
  }
  const open = async () => {
    $('#dp').click()
    await settle()
  }
  const isOpen = () => $('#dp').getAttribute('aria-expanded') === 'true'
  return { host: fixture.componentInstance, $, label, panel, day, button, settle, open, isOpen }
}

describe('DatePicker (angular, 12 checks)', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('1: the host button is the outline trigger: calendar icon, placeholder, min width', async () => {
    const { $, label } = await setup()
    const dp = $('#dp')
    expect(dp.getAttribute('data-slot')).toBe('date-picker')
    expect(dp.getAttribute('aria-haspopup')).toBe('dialog')
    expect(dp.querySelector('svg.lucide-calendar')).not.toBeNull()
    expect(label()).toBe('Pick a date')
    expect(dp.className).toContain('min-w-[240px]')
    expect(dp.className).toContain('text-muted-foreground')
    expect(dp.querySelector('[aria-label="Clear date"]')).toBeNull()
  })

  it('2: picking a day emits the ISO date, shows it formatted and closes', async () => {
    const { host, label, day, open, settle, isOpen } = await setup()
    await open()
    expect(isOpen()).toBe(true)
    day(10).click()
    await settle(250)
    expect(host.changes).toEqual([dayIso(10)])
    expect(label()).toBe(
      new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(now.getFullYear(), now.getMonth(), 10)),
    )
    expect(isOpen()).toBe(false)
  })

  it('3: range mode shows two months and emits {start, end} once both ends exist', async () => {
    const { host, panel, day, open, settle } = await setup((h) => {
      h.type.set('range')
      h.value.set({ start: dayIso(3), end: dayIso(5) })
    })
    await open()
    expect(panel()!.querySelectorAll('table[role="grid"]').length).toBe(2)
    day(8).click()
    await settle()
    expect(host.changes[0]).toEqual({ start: dayIso(3), end: dayIso(8) })
  })

  it('4: multiple mode summarises the selection in the trigger', async () => {
    const { label } = await setup((h) => {
      h.type.set('multiple')
      h.value.set(['2026-05-01', '2026-05-02', '2026-05-03', '2026-05-04'])
    })
    expect(label()).toBe('4 dates selected')
  })

  it('5: picker="month" shows a month grid and snaps the value to the 1st', async () => {
    const { host, panel, button, open, settle } = await setup((h) => h.picker.set('month'))
    await open()
    expect(panel()!.querySelectorAll('[data-slot="month-picker-cell"]').length).toBe(12)
    button('Mar').click()
    await settle()
    expect(host.changes).toEqual([`${now.getFullYear()}-03-01`])
  })

  it('6: picker="quarter" navigates years and emits the quarter start', async () => {
    const { host, label, panel, button, open, settle } = await setup((h) => h.picker.set('quarter'))
    await open()
    panel()!.querySelector<HTMLButtonElement>('button[aria-label="Next"]')!.click()
    await settle()
    button('Q2').click()
    await settle()
    expect(host.changes).toEqual([`${now.getFullYear() + 1}-04-01`])
    expect(label()).toBe(`Q2 ${now.getFullYear() + 1}`)
  })

  it('7: needConfirm previews on the grid and only emits on OK', async () => {
    const { host, day, button, open, settle } = await setup((h) => h.confirm.set(true))
    await open()
    day(12).click()
    await settle()
    expect(host.changes).toEqual([])
    expect(day(12).closest('td')!.getAttribute('aria-selected')).toBe('true')
    button('OK').click()
    await settle()
    expect(host.changes).toEqual([dayIso(12)])
  })

  it('8: showTime emits YYYY-MM-DDTHH:mm (default 12:00), stays open, and keeps a picked hour', async () => {
    const { host, day, panel, label, open, settle, isOpen } = await setup((h) => h.showTime.set(true))
    await open()
    day(10).click()
    await settle()
    expect(host.changes).toEqual([`${dayIso(10)}T12:00`])
    expect(isOpen()).toBe(true)
    const hour = [...panel()!.querySelectorAll<HTMLButtonElement>('[data-slot="time-columns"] button')].find(
      (b) => b.textContent!.trim() === '14',
    )!
    hour.click()
    await settle()
    expect(host.changes[1]).toBe(`${dayIso(10)}T14:00`)
    expect(label()).toContain('02:00 PM')
    // coerceDate keeps the time of a date-time string (the React util drops it).
    expect(coerceDate('2026-05-01T09:30')!.getHours()).toBe(9)
  })

  it('9: presets apply and close; range mode ships default presets', async () => {
    const a = await setup((h) => h.presets.set([{ label: 'Pick 2026-01-02', value: '2026-01-02' }]))
    await a.open()
    a.button('Pick 2026-01-02').click()
    await a.settle(250)
    expect(a.host.changes).toEqual(['2026-01-02'])
    expect(a.isOpen()).toBe(false)
    document.body.innerHTML = ''
    TestBed.resetTestingModule()
    const b = await setup((h) => h.type.set('range'))
    await b.open()
    expect([...b.panel()!.querySelectorAll('aside button')].map((x) => x.textContent!.trim())).toContain('Last 7 days')
  })

  it('10: minValue disables earlier days', async () => {
    const { day, open } = await setup((h) => h.min.set(dayIso(15)))
    await open()
    expect(day(14).disabled).toBe(true)
    expect(day(15).disabled).toBe(false)
  })

  it('11: clear empties the value without opening; disabled never opens', async () => {
    const a = await setup((h) => h.value.set('2026-05-01'))
    a.$('#dp').querySelector<HTMLElement>('[aria-label="Clear date"]')!.click()
    await a.settle()
    expect(a.host.changes).toEqual([null])
    expect(a.isOpen()).toBe(false)
    document.body.innerHTML = ''
    TestBed.resetTestingModule()
    const b = await setup((h) => h.disabled.set(true))
    expect(b.$('#dp').disabled).toBe(true)
    b.$('#dp').click()
    await b.settle()
    expect(b.panel()).toBeNull()
  })

  it('12: [formControl] writes the value in and disables the trigger', async () => {
    const { host, $, label, settle } = await setup()
    expect(label('#form')).toBe('Mar 4, 2026')
    host.control.setValue('2026-12-25')
    await settle()
    expect(label('#form')).toBe('Dec 25, 2026')
    host.control.disable()
    await settle()
    expect($('#form').disabled).toBe(true)
  })
})
