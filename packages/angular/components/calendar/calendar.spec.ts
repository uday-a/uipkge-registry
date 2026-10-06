// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest'
import { Component, provideZonelessChangeDetection, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiCalendarComponent } from './calendar.component'
import type { CaptionLayout, DayPickerMode, DayPickerSelected, Matcher } from './day-picker'

// react-day-picker parity (what the React Calendar wraps). If these break, users see: the
// wrong month or weekday headers, clicks that do not select (or cannot be undone), disabled
// days that still accept clicks, prev/next escaping the startMonth / endMonth window, arrow
// keys / PageUp-Down that no longer move focus through the grid, a multi-month calendar
// collapsing to one month, dropdown captions that do not navigate, and locales rendering
// English captions.

const tick = (ms = 0) => new Promise((r) => setTimeout(r, ms))

@Component({
  standalone: true,
  imports: [UiCalendarComponent],
  template: `
    @if (bound()) {
      <ui-calendar
        [mode]="mode()"
        [selected]="selected()"
        (select)="changes.push($event); selected.set($event)"
        [disabled]="disabled()"
        [defaultMonth]="defaultMonth"
        [startMonth]="startMonth()"
        [endMonth]="endMonth()"
        [numberOfMonths]="months()"
        [captionLayout]="caption()"
        [locale]="locale()"
        [dayContent]="custom() ? cell : null"
        class="rounded-md border"
      />
    } @else {
      <ui-calendar [mode]="mode()" [selected]="selected()" [defaultMonth]="defaultMonth" />
    }
    <ng-template #cell let-day
      ><b class="custom">{{ day.getDate() }}*</b></ng-template
    >
  `,
})
class Host {
  readonly bound = signal(true)
  readonly mode = signal<DayPickerMode | undefined>('single')
  readonly selected = signal<DayPickerSelected>(undefined)
  readonly disabled = signal<Matcher | Matcher[] | undefined>(undefined)
  readonly startMonth = signal<Date | undefined>(undefined)
  readonly endMonth = signal<Date | undefined>(undefined)
  readonly months = signal(1)
  readonly caption = signal<CaptionLayout>('label')
  readonly locale = signal('en-US')
  readonly custom = signal(false)
  readonly defaultMonth = new Date(2026, 4, 1)
  changes: DayPickerSelected[] = []
}

async function setup(init: (h: Host) => void = () => {}) {
  TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] })
  const fixture = TestBed.createComponent(Host)
  init(fixture.componentInstance)
  document.body.appendChild(fixture.nativeElement)
  fixture.detectChanges()
  await fixture.whenStable()
  const root = () => fixture.nativeElement.querySelector('[data-slot="calendar"]') as HTMLElement
  const cell = (iso: string) => root().querySelector<HTMLElement>(`td[data-day="${iso}"]:not([data-outside])`)!
  const btn = (iso: string) => cell(iso).querySelector('button')!
  const caption = () => [...root().querySelectorAll('[role="status"]')].map((e) => e.textContent!.trim())
  const settle = async () => {
    fixture.detectChanges()
    await tick()
    await fixture.whenStable()
  }
  return { fixture, host: fixture.componentInstance, root, cell, btn, caption, settle }
}

const key = (el: Element, k: string, shiftKey = false) =>
  el.dispatchEvent(new KeyboardEvent('keydown', { key: k, shiftKey, bubbles: true, cancelable: true }))

describe('Calendar (angular, 12 checks)', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('1: renders the react-day-picker DOM: nav, caption, narrow weekdays, weeks with outside days', async () => {
    const { root, caption } = await setup()
    expect(root().className).toContain('rdp-root')
    expect(root().className).toContain('p-3')
    expect(root().getAttribute('data-mode')).toBe('single')
    expect(root().getAttribute('lang')).toBe('en-US')
    const nav = root().querySelector('nav')!
    expect(nav.getAttribute('aria-label')).toBe('Navigation bar')
    expect([...nav.querySelectorAll('button')].map((b) => b.getAttribute('aria-label'))).toEqual([
      'Go to the Previous Month',
      'Go to the Next Month',
    ])
    expect(caption()).toEqual(['May 2026'])
    expect([...root().querySelectorAll('th')].map((t) => t.textContent!.trim())).toEqual([
      'S',
      'M',
      'T',
      'W',
      'T',
      'F',
      'S',
    ])
    expect(root().querySelector('th')!.getAttribute('aria-label')).toBe('Sunday')
    // May 2026 starts on a Friday: Apr 26-30 lead in as outside days (showOutsideDays defaults to true).
    const first = root().querySelector('tbody td')!
    expect(first.getAttribute('data-day')).toBe('2026-04-26')
    expect(first.getAttribute('data-outside')).toBe('true')
    expect(first.className).toContain('day-outside')
  })

  it('2: clicking a day selects it (aria-selected + primary fill); clicking again clears it', async () => {
    const { host, cell, btn, settle } = await setup()
    btn('2026-05-15').click()
    await settle()
    expect((host.changes[0] as Date).getDate()).toBe(15)
    expect(cell('2026-05-15').getAttribute('aria-selected')).toBe('true')
    expect(cell('2026-05-15').className).toContain('bg-primary')
    expect(btn('2026-05-15').getAttribute('aria-label')).toBe('Friday, May 15th, 2026, selected')
    btn('2026-05-15').click()
    await settle()
    expect(host.changes[1]).toBeUndefined()
    expect(cell('2026-05-15').hasAttribute('aria-selected')).toBe(false)
  })

  it('3: without a (select) binding the calendar keeps its own selection (uncontrolled)', async () => {
    const { btn, cell, settle } = await setup((h) => h.bound.set(false))
    btn('2026-05-20').click()
    await settle()
    expect(cell('2026-05-20').getAttribute('aria-selected')).toBe('true')
  })

  it('4: disabled matchers disable the day button and block selection', async () => {
    const { host, btn, cell, settle } = await setup((h) => h.disabled.set([{ dayOfWeek: [0, 6] }]))
    expect(btn('2026-05-16').disabled).toBe(true)
    expect(cell('2026-05-16').getAttribute('data-disabled')).toBe('true')
    expect(cell('2026-05-16').className).toContain('opacity-50')
    btn('2026-05-16').click()
    await settle()
    expect(host.changes).toEqual([])
    expect(btn('2026-05-15').disabled).toBe(false)
  })

  it('5: prev / next move the month; startMonth / endMonth bound navigation', async () => {
    const { host, root, caption, settle } = await setup((h) => {
      h.startMonth.set(new Date(2026, 4, 1))
      h.endMonth.set(new Date(2026, 5, 30))
    })
    const [prev, next] = [...root().querySelectorAll<HTMLButtonElement>('nav button')]
    expect(prev!.getAttribute('aria-disabled')).toBe('true')
    expect(prev!.getAttribute('tabindex')).toBe('-1')
    next!.click()
    await settle()
    expect(caption()).toEqual(['June 2026'])
    expect(root().querySelectorAll<HTMLButtonElement>('nav button')[1]!.getAttribute('aria-disabled')).toBe('true')
    root().querySelectorAll<HTMLButtonElement>('nav button')[0]!.click()
    await settle()
    expect(caption()).toEqual(['May 2026'])
    expect(host.changes).toEqual([])
  })

  it('6: arrow keys move focus day by day / week by week; PageDown moves a month', async () => {
    const { btn, caption, root, settle } = await setup()
    btn('2026-05-15').focus()
    btn('2026-05-15').dispatchEvent(new FocusEvent('focus'))
    await settle()
    key(btn('2026-05-15'), 'ArrowRight')
    await settle()
    expect(document.activeElement).toBe(btn('2026-05-16'))
    key(btn('2026-05-16'), 'ArrowDown')
    await settle()
    expect(document.activeElement).toBe(btn('2026-05-23'))
    key(btn('2026-05-23'), 'PageDown')
    await settle()
    expect(caption()).toEqual(['June 2026'])
    expect((document.activeElement as HTMLElement).closest('td')!.getAttribute('data-day')).toBe('2026-06-23')
    expect(root().querySelector('td[data-focused]')!.getAttribute('data-day')).toBe('2026-06-23')
  })

  it('7: the focus target (tabindex 0) is the selected day, else today / first day', async () => {
    const { btn, root } = await setup((h) => h.selected.set(new Date(2026, 4, 12)))
    expect(btn('2026-05-12').getAttribute('tabindex')).toBe('0')
    expect(root().querySelectorAll('td > button[tabindex="0"]').length).toBe(1)
  })

  it('8: mode="multiple" toggles individual days in an array', async () => {
    const { host, btn, settle } = await setup((h) => h.mode.set('multiple'))
    btn('2026-05-10').click()
    await settle()
    btn('2026-05-12').click()
    await settle()
    expect((host.changes[1] as Date[]).map((d) => d.getDate())).toEqual([10, 12])
    btn('2026-05-10').click()
    await settle()
    expect((host.changes[2] as Date[]).map((d) => d.getDate())).toEqual([12])
  })

  it('9: numberOfMonths=2 renders consecutive months in one root', async () => {
    const { root, caption } = await setup((h) => h.months.set(2))
    expect(root().getAttribute('data-multiple-months')).toBe('true')
    expect(root().querySelectorAll('table[role="grid"]').length).toBe(2)
    expect(caption()).toEqual(['May 2026', 'June 2026'])
  })

  it('10: captionLayout="dropdown" renders month / year selects that navigate', async () => {
    const { root, caption, settle } = await setup((h) => h.caption.set('dropdown'))
    const [month, year] = [...root().querySelectorAll('select')]
    expect(month!.getAttribute('aria-label')).toBe('Choose the Month')
    expect(year!.getAttribute('aria-label')).toBe('Choose the Year')
    expect(month!.value).toBe('4')
    month!.value = '7'
    month!.dispatchEvent(new Event('change'))
    await settle()
    expect(caption()).toEqual(['August 2026'])
  })

  it('11: locale="ja" localizes the caption (year-first), weekdays and labels', async () => {
    const { root, caption } = await setup((h) => h.locale.set('ja'))
    expect(root().getAttribute('lang')).toBe('ja')
    expect(caption()[0]).toBe('2026年5月')
    expect(root().querySelector('th')!.textContent!.trim()).toBe('日')
    expect(root().querySelector('nav')!.getAttribute('aria-label')).toBe('ナビゲーションバー')
  })

  it('12: dayContent replaces the day button label with a custom template', async () => {
    const { btn } = await setup((h) => h.custom.set(true))
    expect(btn('2026-05-09').querySelector('b.custom')!.textContent).toBe('9*')
  })
})
