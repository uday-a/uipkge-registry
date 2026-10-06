// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component, provideZonelessChangeDetection, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiEventCalendarComponent } from './event-calendar.component'
import type { CalendarEvent, CalendarView, TimeClickPayload } from './types'

// Behaviour parity with the React EventCalendar. If these break, users notice: the month
// grid is empty or starts on the wrong weekday, busy days don't collapse into "+N more",
// Prev / Next jump by the wrong amount for the view, the view switcher does nothing,
// timed events land in the wrong slot (or overlap instead of sharing the column), the
// category view loses its resource columns, and clicks on events / slots aren't reported.

const events: CalendarEvent[] = [
  { id: '1', title: 'Roadmap', start: '2026-05-18 09:00', end: '2026-05-18 10:30', color: 'primary', category: 'a' },
  { id: '2', title: 'Design', start: '2026-05-18 10:00', end: '2026-05-18 11:30', color: 'purple', category: 'b' },
  { id: '3', title: 'Sync', start: '2026-05-18 14:00', end: '2026-05-18 15:00', color: 'info', category: 'a' },
  { id: '4', title: 'Hackathon', start: '2026-05-18', allDay: true, color: 'success' },
  { id: '5', title: 'Maintenance', start: '2026-05-19 11:00', end: '2026-05-19 12:30', color: 'nope' },
]

@Component({
  standalone: true,
  imports: [UiEventCalendarComponent],
  template: `
    <ng-template #custom let-event="event" let-view="view"
      ><span class="custom">{{ view }}:{{ event.title }}</span></ng-template
    >
    <ui-event-calendar
      [value]="value()"
      [defaultView]="view()"
      [events]="events"
      [categories]="categories"
      [firstInterval]="8"
      [intervalCount]="11"
      [renderEvent]="useCustom() ? custom : null"
      (dateChange)="dates.push($event); value.set(iso($event))"
      (viewChange)="views.push($event)"
      (eventClick)="clicked.push($event.title)"
      (dateClick)="dateClicks.push($event)"
      (timeClick)="times.push($event)"
    />
  `,
})
class HostComponent {
  readonly value = signal('2026-05-18')
  readonly view = signal<CalendarView>('month')
  readonly useCustom = signal(false)
  events = events
  categories = [{ id: 'a', name: 'Room A', color: 'rgb(59, 130, 246)' }, 'b']
  dates: Date[] = []
  views: CalendarView[] = []
  clicked: string[] = []
  dateClicks: string[] = []
  times: TimeClickPayload[] = []
  iso(d: Date) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }
}

async function setup(init: (h: HostComponent) => void = () => {}) {
  TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] })
  const fixture = TestBed.createComponent(HostComponent)
  init(fixture.componentInstance)
  document.body.appendChild(fixture.nativeElement)
  fixture.detectChanges()
  await fixture.whenStable()
  const root = fixture.nativeElement.querySelector('[data-slot="event-calendar"]') as HTMLElement
  const settle = async () => {
    fixture.detectChanges()
    await fixture.whenStable()
    fixture.detectChanges()
  }
  const button = (label: string) =>
    Array.from(root.querySelectorAll<HTMLButtonElement>('button')).find(
      (b) => b.textContent!.trim() === label || b.getAttribute('aria-label') === label,
    )!
  const title = () => root.querySelector('h2')!.textContent!.trim()
  const cards = () => Array.from(root.querySelectorAll<HTMLElement>('[data-slot="event-card"]'))
  return { fixture, host: fixture.componentInstance, root, settle, button, title, cards }
}

describe('EventCalendar (angular, 8 checks)', () => {
  it('1: month view renders a 6x7 Sunday-first grid titled by month', async () => {
    const t = await setup()
    expect(t.title()).toBe('May 2026')
    const grid = t.root.querySelector('.grid-rows-6')!
    expect(grid.children.length).toBe(42)
    expect(t.root.querySelector('.grid-cols-7')!.textContent).toContain('SunMonTue')
    expect(grid.children[0].textContent).toContain('26') // Apr 26 leads the first week
  })

  it('2: a busy day shows maxEventsPerDay-1 chips plus a "+N more" trigger; chips use the colour variant', async () => {
    const t = await setup()
    const more = t.button('+2 more')
    expect(more).toBeDefined()
    const chips = t.cards().map((c) => c.textContent!.trim())
    expect(chips).toContain('9:00 AMRoadmap')
    const roadmap = t.cards().find((c) => c.textContent!.includes('Roadmap'))!
    expect(roadmap.className).toContain('bg-primary/10')
    const maintenance = t.cards().find((c) => c.textContent!.includes('Maintenance'))!
    expect(maintenance.className).toContain('bg-secondary/80') // unknown colour -> default
  })

  it('3: Prev / Next step by the unit of the view and emit dateChange', async () => {
    const t = await setup()
    t.button('Next period').click()
    await t.settle()
    expect(t.title()).toBe('June 2026')
    t.button('Week').click()
    await t.settle()
    expect(t.host.views).toEqual(['week'])
    t.button('Previous period').click()
    await t.settle()
    expect(t.host.dates.map((d) => t.host.iso(d))).toEqual(['2026-06-18', '2026-06-11'])
  })

  it('4: week view shows the all-day row and places timed events by time, splitting overlaps', async () => {
    const t = await setup((h) => h.view.set('week'))
    expect(t.title()).toBe('May 17 – 23, 2026')
    const allDay = t.cards().find((c) => c.textContent!.includes('Hackathon'))!
    expect(allDay.className).toContain('py-0.5')
    const box = (name: string) => t.cards().find((c) => c.textContent!.includes(name))!.parentElement as HTMLElement
    expect(box('Roadmap').style.top).toBe(`${(60 / 660) * 100}%`)
    expect(box('Roadmap').style.width).toContain('50%')
    expect(box('Design').style.left).toContain('50%')
    expect(t.cards().find((c) => c.textContent!.includes('Roadmap'))!.textContent).toContain('9:00 AM – 10:30 AM')
  })

  it('5: day and work-week views render one / five columns', async () => {
    const t = await setup((h) => h.view.set('day'))
    expect(t.title()).toBe('Monday, May 18, 2026')
    expect(t.root.querySelectorAll('.grid-cols-1').length).toBeGreaterThan(0)
    t.button('Work').click()
    await t.settle()
    expect(t.title()).toBe('May 18 – May 22, 2026')
    expect(t.root.querySelectorAll('.grid-cols-5').length).toBe(3)
  })

  it('6: category view renders one column per category and routes events by category', async () => {
    const t = await setup((h) => h.view.set('category'))
    const header = t.root.querySelector<HTMLElement>('[style*="grid-template-columns"]')!
    expect(header.style.gridTemplateColumns).toBe('repeat(2, minmax(0, 1fr))')
    expect(header.textContent).toContain('Room A')
    expect(header.querySelector<HTMLElement>('.rounded-full')!.style.backgroundColor).toBe('rgb(59, 130, 246)')
    const titles = t.cards().map((c) => c.textContent!)
    expect(titles.some((x) => x.includes('Roadmap'))).toBe(true)
    expect(titles.some((x) => x.includes('Maintenance'))).toBe(false)
  })

  it('7: event, date and time-slot clicks are reported (event clicks do not bubble to the day)', async () => {
    const t = await setup()
    t.cards()
      .find((c) => c.textContent!.includes('Roadmap'))!
      .click()
    expect(t.host.clicked).toEqual(['Roadmap'])
    expect(t.host.dateClicks).toEqual([])
    ;(t.root.querySelector('.grid-rows-6')!.children[0] as HTMLElement).click()
    expect(t.host.dateClicks).toEqual(['2026-04-26'])

    t.button('Day').click()
    await t.settle()
    const slot = t.root.querySelector<HTMLElement>('.hover\\:bg-muted\\/20.cursor-pointer')!
    slot.click()
    expect(t.host.times[0]).toEqual({ date: '2026-05-18', time: '08:00', hour: 8, minute: 0, category: undefined })
  })

  it('8: renderEvent template replaces the built-in chip with event + view context', async () => {
    const t = await setup((h) => h.useCustom.set(true))
    const custom = Array.from(t.root.querySelectorAll('.custom')).map((c) => c.textContent)
    expect(custom).toContain('month:Roadmap')
  })
})
