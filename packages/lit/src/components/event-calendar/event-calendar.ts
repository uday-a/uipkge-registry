import { LitElement, css, html, nothing } from 'lit'
import { ChevronLeft, ChevronRight, Clock } from 'lucide'
import { cn } from '../../lib/utils'
import { icon } from '../../lib/icon'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import type { CalendarCategory, CalendarEvent, CalendarView, PositionedEvent, TimeClickPayload } from './types'
import {
  calculateTimedEventPositions,
  formatDateKey,
  formatHourLabel,
  formatTime,
  getMonthDays,
  getWeekDays,
  getWorkWeekDays,
  isSameDay,
  isToday,
  parseDate,
} from './date-utils'
import { calendarEventVariants } from './event-calendar.variants'

export type { CalendarCategory, CalendarEvent, CalendarView, TimeClickPayload } from './types'

/**
 * <uip-event-calendar> — Full-featured event calendar supporting month, week,
 * work-week, day, and category/resource views with timed event positioning.
 */
export class UipEventCalendar extends LitElement {
  static styles = [
    tailwind,
    css`
      :host {
        display: block;
        width: 100%;
      }
    `,
  ]

  static properties = {
    value: { attribute: false },
    defaultValue: { attribute: false },
    view: { type: String },
    defaultView: { type: String, attribute: 'default-view' },
    events: { type: Array, attribute: false },
    categories: { type: Array, attribute: false },
    weekStartsOn: { type: Number, attribute: 'week-starts-on' },
    firstInterval: { type: Number, attribute: 'first-interval' },
    intervalCount: { type: Number, attribute: 'interval-count' },
    intervalMinutes: { type: Number, attribute: 'interval-minutes' },
    intervalHeight: { type: Number, attribute: 'interval-height' },
    timeFormat: { type: String, attribute: 'time-format' },
    maxEventsPerDay: { type: Number, attribute: 'max-events-per-day' },
    showNowIndicator: { type: Boolean, attribute: 'show-now-indicator' },
    showHeader: {
      type: Boolean,
      attribute: 'show-header',
      converter: { fromAttribute: (v: string | null) => v !== null && v !== 'false' },
    },
    renderEvent: { attribute: false },
    activeDate: { state: true },
    activeView: { state: true },
  }

  value?: string | Date
  defaultValue?: string | Date
  view?: CalendarView
  defaultView: CalendarView = 'month'
  events: CalendarEvent[] = []
  categories: (string | CalendarCategory)[] = []
  weekStartsOn: 0 | 1 = 0
  firstInterval = 0
  intervalCount = 24
  intervalMinutes = 60
  intervalHeight = 52
  timeFormat: '12h' | '24h' = '12h'
  maxEventsPerDay = 3
  showNowIndicator = true
  showHeader = true
  renderEvent?: (params: { event: CalendarEvent; view: CalendarView; isAllDay: boolean }) => unknown

  activeDate: Date = new Date()
  activeView: CalendarView = 'month'

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'event-calendar')
    this.activeDate = parseDate(this.value ?? this.defaultValue ?? new Date())
    this.activeView = this.view ?? this.defaultView
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('value') && this.value !== undefined) {
      this.activeDate = parseDate(this.value)
    }
    if (changedProperties.has('view') && this.view !== undefined) {
      this.activeView = this.view
    }
  }

  private setDate(d: Date) {
    this.activeDate = d
    this.dispatchEvent(new CustomEvent('date-change', { detail: { date: d }, bubbles: true, composed: true }))
    this.requestUpdate()
  }

  private setView(v: CalendarView) {
    this.activeView = v
    this.dispatchEvent(new CustomEvent('view-change', { detail: { view: v }, bubbles: true, composed: true }))
    this.requestUpdate()
  }

  private prev() {
    const d = new Date(this.activeDate)
    if (this.activeView === 'month') d.setMonth(d.getMonth() - 1)
    else if (this.activeView === 'week' || this.activeView === 'work-week') d.setDate(d.getDate() - 7)
    else d.setDate(d.getDate() - 1)
    this.setDate(d)
  }

  private next() {
    const d = new Date(this.activeDate)
    if (this.activeView === 'month') d.setMonth(d.getMonth() + 1)
    else if (this.activeView === 'week' || this.activeView === 'work-week') d.setDate(d.getDate() + 7)
    else d.setDate(d.getDate() + 1)
    this.setDate(d)
  }

  private today() {
    this.setDate(new Date())
  }

  private onEventClick(event: CalendarEvent, e: Event) {
    e.stopPropagation()
    this.dispatchEvent(new CustomEvent('event-click', { detail: { event }, bubbles: true, composed: true }))
  }

  private onDateClick(dateKey: string) {
    this.dispatchEvent(new CustomEvent('date-click', { detail: { date: dateKey }, bubbles: true, composed: true }))
  }

  private renderCalendarHeader() {
    const title = (() => {
      const locale = 'en-US'
      if (this.activeView === 'month') {
        return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(this.activeDate)
      }
      if (this.activeView === 'week' || this.activeView === 'work-week') {
        const days = this.activeView === 'week' ? getWeekDays(this.activeDate, this.weekStartsOn) : getWorkWeekDays(this.activeDate)
        const first = days[0]!
        const last = days[days.length - 1]!
        return `${first.toLocaleDateString(locale, { month: 'short', day: 'numeric' })} – ${last.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })}`
      }
      return new Intl.DateTimeFormat(locale, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(this.activeDate)
    })()

    const views: CalendarView[] = ['month', 'week', 'day', 'category']

    return html`
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div class="flex items-center gap-2">
          <div class="flex items-center gap-1">
            <button
              type="button"
              class="border border-input hover:bg-accent text-foreground size-8 inline-flex items-center justify-center rounded-md transition-colors"
              aria-label="Previous"
              @click=${this.prev}
            >
              ${icon(ChevronLeft, 'chevron-left', 'size-4')}
            </button>
            <button
              type="button"
              class="border border-input hover:bg-accent text-foreground size-8 inline-flex items-center justify-center rounded-md transition-colors"
              aria-label="Next"
              @click=${this.next}
            >
              ${icon(ChevronRight, 'chevron-right', 'size-4')}
            </button>
          </div>
          <button
            type="button"
            class="border border-input hover:bg-accent text-foreground h-8 px-2.5 rounded-md text-xs font-medium transition-colors"
            @click=${this.today}
          >
            Today
          </button>
          <span class="text-base font-semibold tracking-tight ml-2">${title}</span>
        </div>

        <div class="flex items-center rounded-md border border-input p-0.5 text-xs font-medium bg-muted/30">
          ${views.map(
            (v) => html`
              <button
                type="button"
                class=${cn(
                  'rounded px-2.5 py-1 capitalize transition-colors',
                  this.activeView === v
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                )}
                @click=${() => this.setView(v)}
              >
                ${v}
              </button>
            `,
          )}
        </div>
      </div>
    `
  }

  private renderMonthView() {
    const days = getMonthDays(this.activeDate, this.weekStartsOn)
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      .slice(this.weekStartsOn)
      .concat(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].slice(0, this.weekStartsOn))

    return html`
      <div class="flex flex-col">
        <!-- Weekday header -->
        <div class="grid grid-cols-7 border-b border-border bg-muted/40 text-center text-xs font-medium text-muted-foreground">
          ${weekdays.map((wd) => html`<div class="py-2">${wd}</div>`)}
        </div>

        <!-- Month Grid -->
        <div class="grid grid-cols-7 border-b border-l border-border">
          ${days.map(({ date, dateKey, inMonth, isToday: today }) => {
            const dayEvents = this.events.filter((e) => {
              const sKey = typeof e.start === 'string' ? e.start.slice(0, 10) : formatDateKey(parseDate(e.start))
              return sKey === dateKey
            })

            const visible = dayEvents.slice(0, this.maxEventsPerDay)
            const remaining = dayEvents.length - visible.length

            return html`
              <div
                class=${cn(
                  'min-h-[100px] border-r border-t border-border p-1.5 flex flex-col gap-1 transition-colors',
                  !inMonth && 'bg-muted/20 text-muted-foreground/50',
                )}
                @click=${() => this.onDateClick(dateKey)}
              >
                <div class="flex items-center justify-between">
                  <span
                    class=${cn(
                      'size-6 flex items-center justify-center rounded-full text-xs font-medium select-none',
                      today && 'bg-primary text-primary-foreground font-bold',
                    )}
                  >
                    ${date.getDate()}
                  </span>
                </div>

                <div class="flex flex-col gap-1 flex-1">
                  ${visible.map((event) => {
                    if (this.renderEvent) {
                      return html`<div @click=${(e: Event) => this.onEventClick(event, e)}>
                        ${this.renderEvent({ event, view: 'month', isAllDay: Boolean(event.allDay) })}
                      </div>`
                    }
                    const variant = (event.color as any) ?? 'default'
                    return html`
                      <button
                        type="button"
                        class=${cn(calendarEventVariants({ variant, size: 'sm' }), 'truncate')}
                        @click=${(e: Event) => this.onEventClick(event, e)}
                      >
                        <span class="truncate font-medium">${event.title}</span>
                      </button>
                    `
                  })}
                  ${remaining > 0
                    ? html`<span class="text-[10px] text-muted-foreground font-medium pl-1">+${remaining} more</span>`
                    : nothing}
                </div>
              </div>
            `
          })}
        </div>
      </div>
    `
  }

  private renderTimeGrid(days: Date[]) {
    const intervals = Array.from({ length: this.intervalCount }, (_, i) => this.firstInterval + i)

    return html`
      <div class="flex flex-col overflow-x-auto">
        <!-- Day header row -->
        <div class="flex border-b border-border bg-muted/40">
          <div class="w-16 shrink-0 border-r border-border"></div>
          ${days.map(
            (d) => html`
              <div class="flex-1 py-2 text-center text-xs font-medium border-r border-border last:border-r-0">
                <span class=${cn(isToday(d) && 'text-primary font-bold')}>
                  ${d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' })}
                </span>
              </div>
            `,
          )}
        </div>

        <!-- Interval rows -->
        <div class="relative flex">
          <!-- Time labels column -->
          <div class="w-16 shrink-0 flex flex-col text-right pr-2 text-xs text-muted-foreground border-r border-border select-none">
            ${intervals.map(
              (hour) => html`
                <div style="height: ${this.intervalHeight}px;" class="flex items-start justify-end pt-1">
                  ${formatHourLabel(hour, this.timeFormat)}
                </div>
              `,
            )}
          </div>

          <!-- Day columns with positioned events -->
          ${days.map((day) => {
            const positioned = calculateTimedEventPositions(
              this.events,
              day,
              this.firstInterval,
              this.intervalCount,
              this.intervalMinutes,
            )

            return html`
              <div class="relative flex-1 border-r border-border last:border-r-0">
                <!-- Interval grid lines -->
                ${intervals.map(
                  () => html`
                    <div
                      style="height: ${this.intervalHeight}px;"
                      class="border-b border-border/50 hover:bg-muted/10 cursor-pointer"
                    ></div>
                  `,
                )}

                <!-- Positioned Events -->
                ${positioned.map(({ event, top, height, left, width }) => {
                  const variant = (event.color as any) ?? 'default'
                  return html`
                    <button
                      type="button"
                      class=${cn(
                        calendarEventVariants({ variant, size: 'sm' }),
                        'absolute rounded p-1 text-xs transition-opacity',
                      )}
                      style="top: ${top}%; height: ${height}%; left: ${left}%; width: calc(${width}% - 2px);"
                      @click=${(e: Event) => this.onEventClick(event, e)}
                    >
                      <p class="font-semibold truncate">${event.title}</p>
                      ${event.location
                        ? html`<p class="truncate opacity-75 text-[10px]">${event.location}</p>`
                        : nothing}
                    </button>
                  `
                })}
              </div>
            `
          })}
        </div>
      </div>
    `
  }

  private renderCategoryView() {
    const cats: CalendarCategory[] = this.categories.map((c, idx) =>
      typeof c === 'string' ? { id: c, name: c } : c,
    )
    const intervals = Array.from({ length: this.intervalCount }, (_, i) => this.firstInterval + i)
    const day = this.activeDate

    return html`
      <div class="flex flex-col overflow-x-auto">
        <!-- Category header row -->
        <div class="flex border-b border-border bg-muted/40">
          <div class="w-16 shrink-0 border-r border-border"></div>
          ${cats.map(
            (cat) => html`
              <div class="flex-1 py-2 text-center text-xs font-medium border-r border-border last:border-r-0">
                <span style="color: ${cat.color ?? 'inherit'};" class="font-bold">${cat.name}</span>
              </div>
            `,
          )}
        </div>

        <!-- Interval rows -->
        <div class="relative flex">
          <!-- Time labels -->
          <div class="w-16 shrink-0 flex flex-col text-right pr-2 text-xs text-muted-foreground border-r border-border select-none">
            ${intervals.map(
              (hour) => html`
                <div style="height: ${this.intervalHeight}px;" class="flex items-start justify-end pt-1">
                  ${formatHourLabel(hour, this.timeFormat)}
                </div>
              `,
            )}
          </div>

          <!-- Category columns -->
          ${cats.map((cat) => {
            const catEvents = this.events.filter((e) => e.category === cat.id)
            const positioned = calculateTimedEventPositions(
              catEvents,
              day,
              this.firstInterval,
              this.intervalCount,
              this.intervalMinutes,
            )

            return html`
              <div class="relative flex-1 border-r border-border last:border-r-0">
                ${intervals.map(
                  () => html`
                    <div
                      style="height: ${this.intervalHeight}px;"
                      class="border-b border-border/50 hover:bg-muted/10 cursor-pointer"
                    ></div>
                  `,
                )}

                <!-- Positioned Events -->
                ${positioned.map(({ event, top, height, left, width }) => {
                  const variant = (event.color as any) ?? 'default'
                  return html`
                    <button
                      type="button"
                      class=${cn(
                        calendarEventVariants({ variant, size: 'sm' }),
                        'absolute rounded p-1 text-xs transition-opacity',
                      )}
                      style="top: ${top}%; height: ${height}%; left: ${left}%; width: calc(${width}% - 2px);"
                      @click=${(e: Event) => this.onEventClick(event, e)}
                    >
                      <p class="font-semibold truncate">${event.title}</p>
                      ${event.location
                        ? html`<p class="truncate opacity-75 text-[10px]">${event.location}</p>`
                        : nothing}
                    </button>
                  `
                })}
              </div>
            `
          })}
        </div>
      </div>
    `
  }

  render() {
    return html`
      <div part="base" class="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 text-card-foreground shadow-xs">
        ${this.showHeader ? this.renderCalendarHeader() : nothing}
        ${this.activeView === 'month'
          ? this.renderMonthView()
          : this.activeView === 'category'
            ? this.renderCategoryView()
            : this.activeView === 'work-week'
              ? this.renderTimeGrid(getWorkWeekDays(this.activeDate))
              : this.activeView === 'day'
                ? this.renderTimeGrid([this.activeDate])
                : this.renderTimeGrid(getWeekDays(this.activeDate, this.weekStartsOn))}
      </div>
    `
  }
}

customElements.get('uip-event-calendar') || customElements.define('uip-event-calendar', UipEventCalendar)

declare global {
  interface HTMLElementTagNameMap {
    'uip-event-calendar': UipEventCalendar
  }
}
