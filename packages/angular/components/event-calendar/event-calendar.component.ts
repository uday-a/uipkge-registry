import {
  Component,
  Directive,
  EmbeddedViewRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
  booleanAttribute,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'
import { UiButtonComponent } from '@/ui/button/button.component'
import {
  UiPopoverComponent,
  UiPopoverContentComponent,
  UiPopoverTriggerComponent,
} from '@/ui/popover/popover.component'
import {
  calculateTimedEventPositions,
  formatDateKey,
  formatHourLabel,
  formatTime,
  getCurrentTimePosition,
  getEventMinutes,
  getMonthDays,
  getWeekDays,
  getWorkWeekDays,
  isToday,
  parseDate,
} from './date-utils'
import { calendarEventVariants, type CalendarEventVariants } from './event-calendar.variants'
import type { CalendarCategory, CalendarEvent, CalendarView, TimeClickPayload } from './types'

/* Render-prop contexts (React's `renderX` params; `$implicit` is the whole object). */
export interface EventCalendarHeaderContext {
  currentDate: Date
  view: CalendarView
  title: string
  prev: () => void
  next: () => void
  today: () => void
  setView: (view: CalendarView) => void
}
export interface EventCalendarEventContext {
  event: CalendarEvent
  view: CalendarView
  isAllDay: boolean
}
export interface EventCalendarDayHeaderContext {
  date: Date
  dateKey: string
  isToday: boolean
  view: CalendarView
}
export interface EventCalendarAllDayContext {
  date: Date
  dateKey: string
  events: CalendarEvent[]
}
export interface EventCalendarIntervalContext {
  hour: number
  time: string
  label: string
}
export interface EventCalendarMoreClick {
  date: string
  events: CalendarEvent[]
}

/** Renders a render-prop template with `{ $implicit: ctx, ...ctx }` as its context. */
@Directive({ selector: '[uiEventCalendarOutlet]', standalone: true })
export class UiEventCalendarOutletDirective implements OnChanges, OnDestroy {
  @Input('uiEventCalendarOutlet') template: TemplateRef<unknown> | null | undefined = null
  @Input('uiEventCalendarOutletContext') context: object = {}
  private readonly vcr = inject(ViewContainerRef)
  private view: EmbeddedViewRef<Record<string, unknown>> | null = null
  private rendered: TemplateRef<unknown> | null = null

  ngOnChanges(): void {
    const ctx = { $implicit: this.context, ...this.context }
    // Same template, new context values: update in place (keeps DOM, hover and focus).
    if (this.view && this.rendered === this.template) {
      Object.assign(this.view.context, ctx)
      return
    }
    this.vcr.clear()
    this.view = null
    this.rendered = this.template ?? null
    if (this.template)
      this.view = this.vcr.createEmbeddedView(this.template as TemplateRef<Record<string, unknown>>, ctx)
  }

  ngOnDestroy(): void {
    this.vcr.clear()
  }
}

const EVENT_COLORS = ['primary', 'secondary', 'success', 'warning', 'destructive', 'info', 'purple', 'rose']
type EventVariant = NonNullable<CalendarEventVariants['variant']>

const TOGGLE_ACTIVE = 'bg-background text-foreground shadow-xs'
const TOGGLE_IDLE = 'text-muted-foreground hover:text-foreground'

/**
 * Angular port of UIPKGE EventCalendar (React parity): month grid with "+N more" popovers,
 * week / work-week / day time grids with a pinned all-day row, overlap-aware event lanes and
 * a live now-indicator, plus a category (resource) view. Controlled or uncontrolled date
 * (`value` / `defaultValue` + `dateChange`) and view (`view` / `defaultView` +
 * `viewChange`); `eventClick`, `dateClick`, `timeClick`, `moreClick` outputs; React's
 * `renderX` props are TemplateRef inputs; `headerActions` is `[slot=header-actions]` content.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-event-calendar, [ui-event-calendar]',
  standalone: true,
  imports: [
    UiButtonComponent,
    UiPopoverComponent,
    UiPopoverTriggerComponent,
    UiPopoverContentComponent,
    UiEventCalendarOutletDirective,
  ],
  host: {
    '[attr.data-slot]': '"event-calendar"',
    '[class]': 'hostClass',
  },
  template: `
    @if (showHeader) {
      @if (renderHeader) {
        <ng-container
          [uiEventCalendarOutlet]="renderHeader"
          [uiEventCalendarOutletContext]="{
            currentDate: activeDate,
            view: activeView,
            title: formattedTitle,
            prev: prev,
            next: next,
            today: today,
            setView: setView,
          }"
        />
      } @else {
        <header
          class="border-border bg-card/60 flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 backdrop-blur-xs"
        >
          <div class="flex items-center gap-2">
            <button ui-button variant="outline" size="sm" class="h-8 px-2.5 text-xs font-medium" (click)="today()">
              Today
            </button>
            <div class="flex items-center gap-0.5">
              <button
                ui-button
                variant="ghost"
                size="icon"
                class="size-8"
                aria-label="Previous period"
                (click)="prev()"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-chevron-left size-4"
                  aria-hidden="true"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <button ui-button variant="ghost" size="icon" class="size-8" aria-label="Next period" (click)="next()">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-chevron-right size-4"
                  aria-hidden="true"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
            <h2 class="text-foreground ml-1 text-base font-semibold tracking-tight sm:text-lg">{{ formattedTitle }}</h2>
          </div>
          <div class="flex items-center gap-1.5">
            <ng-content select="[slot=header-actions]" />
            <div class="border-border bg-muted/40 flex items-center rounded-lg border p-0.5">
              <button type="button" [class]="toggleClass('month')" (click)="setView('month')">Month</button>
              <button type="button" [class]="toggleClass('week')" (click)="setView('week')">Week</button>
              <button type="button" [class]="toggleClass('work-week')" (click)="setView('work-week')">Work</button>
              <button type="button" [class]="toggleClass('day')" (click)="setView('day')">Day</button>
              @if (normalizedCategories.length > 0) {
                <button type="button" [class]="toggleClass('category')" (click)="setView('category')">Category</button>
              }
            </div>
          </div>
        </header>
      }
    }

    <ng-template #eventChip let-evt let-truncate="truncate">
      <div data-slot="event-card" [class]="chipClass(evt, truncate)" (click)="onEventClick(evt, $event)">
        <div class="flex items-center gap-1 truncate font-medium">
          @if (!evt.allDay) {
            <span class="shrink-0 font-mono text-[10px] opacity-75">{{ eventTime(evt) }}</span>
          }
          <span class="truncate">{{ evt.title }}</span>
        </div>
      </div>
    </ng-template>

    @if (activeView === 'month') {
      <div class="flex flex-1 flex-col">
        <div
          class="border-border bg-muted/20 text-muted-foreground grid grid-cols-7 border-b text-center text-xs font-medium"
        >
          @for (dayName of weekdayHeaderLabels; track $index) {
            <div class="border-border/40 border-r py-2 last:border-r-0">{{ dayName }}</div>
          }
        </div>
        <div class="divide-border/40 grid min-h-[580px] flex-1 grid-cols-7 grid-rows-6 divide-x divide-y">
          @for (cell of monthDays; track cell.dateKey) {
            @let dayEvents = getEventsForDay(cell.dateKey);
            <div [class]="cellClass(cell.inMonth)" (click)="dateClick.emit(cell.dateKey)">
              <div class="mb-1 flex items-center justify-between">
                <span [class]="dayNumberClass(cell.isToday, cell.inMonth)">{{ cell.date.getDate() }}</span>
              </div>
              <div class="flex flex-1 flex-col gap-1 overflow-hidden">
                @for (evt of dayEvents; track evt.id || $index; let idx = $index) {
                  @if (dayEvents.length <= maxEventsPerDay || idx < maxEventsPerDay - 1) {
                    @if (renderEvent) {
                      <ng-container
                        [uiEventCalendarOutlet]="renderEvent"
                        [uiEventCalendarOutletContext]="{ event: evt, view: 'month', isAllDay: !!evt.allDay }"
                      />
                    } @else {
                      <ng-container
                        [uiEventCalendarOutlet]="eventChip"
                        [uiEventCalendarOutletContext]="{ $implicit: evt, truncate: true }"
                      />
                    }
                  }
                }
                @if (dayEvents.length > maxEventsPerDay) {
                  <div class="mt-auto pt-0.5">
                    <ui-popover>
                      <button
                        type="button"
                        ui-popover-trigger
                        class="text-primary hover:text-primary/80 hover:bg-primary/10 flex items-center gap-0.5 rounded-sm px-1 py-0.5 text-[11px] font-semibold transition-colors hover:underline"
                        (click)="$event.stopPropagation(); moreClick.emit({ date: cell.dateKey, events: dayEvents })"
                      >
                        +{{ dayEvents.length - (maxEventsPerDay - 1) }} more
                      </button>
                      <ui-popover-content class="w-64 p-2 shadow-lg" align="start">
                        <div
                          class="border-border mb-1.5 flex items-center justify-between border-b pb-1.5 text-xs font-semibold"
                        >
                          <span>{{ popoverDate(cell.date) }}</span>
                          <span class="text-muted-foreground text-[11px] font-normal"
                            >{{ dayEvents.length }} events</span
                          >
                        </div>
                        <div class="flex max-h-48 flex-col gap-1 overflow-y-auto">
                          @for (evt of dayEvents; track evt.id || $index) {
                            <ng-container
                              [uiEventCalendarOutlet]="eventChip"
                              [uiEventCalendarOutletContext]="{ $implicit: evt, truncate: false }"
                            />
                          }
                        </div>
                      </ui-popover-content>
                    </ui-popover>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </div>
    }

    @if (activeView === 'week' || activeView === 'work-week' || activeView === 'day') {
      <div class="flex flex-1 flex-col overflow-hidden">
        <div class="border-border bg-muted/20 flex border-b select-none">
          <div
            class="border-border/50 text-muted-foreground w-16 shrink-0 border-r py-2.5 text-center text-xs font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-clock mx-auto size-3.5 opacity-60"
              aria-hidden="true"
            >
              <path d="M12 6v6l4 2" />
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
          <div [class]="gridColsClass()">
            @for (d of visibleDays; track dateKey(d)) {
              <div [class]="dayHeaderClass(d)" (click)="dateClick.emit(dateKey(d))">
                @if (renderDayHeader) {
                  <ng-container
                    [uiEventCalendarOutlet]="renderDayHeader"
                    [uiEventCalendarOutletContext]="{
                      date: d,
                      dateKey: dateKey(d),
                      isToday: isToday(d),
                      view: activeView,
                    }"
                  />
                } @else {
                  <span class="text-muted-foreground text-[11px] font-medium tracking-wider uppercase">{{
                    weekdayName(d)
                  }}</span>
                  <span [class]="dayHeaderNumberClass(d)">{{ d.getDate() }}</span>
                }
              </div>
            }
          </div>
        </div>

        <div class="border-border bg-muted/10 flex border-b text-xs">
          <div
            class="border-border/50 text-muted-foreground w-16 shrink-0 border-r p-2 text-right text-[10px] font-semibold tracking-wider uppercase"
          >
            All-day
          </div>
          <div [class]="gridColsClass()">
            @for (d of visibleDays; track dateKey(d)) {
              @let dayAllDay = getAllDayEventsForDay(d);
              <div class="flex min-h-[32px] flex-col gap-1 p-1">
                @if (renderAllDay) {
                  <ng-container
                    [uiEventCalendarOutlet]="renderAllDay"
                    [uiEventCalendarOutletContext]="{ date: d, dateKey: dateKey(d), events: dayAllDay }"
                  />
                } @else {
                  @for (evt of dayAllDay; track evt.id || evt.title) {
                    <div data-slot="event-card" [class]="allDayClass(evt)" (click)="onEventClick(evt, $event)">
                      <span class="truncate font-medium">{{ evt.title }}</span>
                    </div>
                  }
                }
              </div>
            }
          </div>
        </div>

        <div class="relative flex max-h-[640px] min-h-[480px] flex-1 overflow-y-auto">
          <ng-container [uiEventCalendarOutlet]="gutter" />
          <div [class]="gridColsClass(true)">
            @for (d of visibleDays; track dateKey(d)) {
              <div class="relative flex flex-col">
                @for (interval of intervals; track interval.time) {
                  <div
                    [style.height.px]="intervalHeight"
                    class="border-border/30 hover:bg-muted/20 cursor-pointer border-b transition-colors"
                    (click)="onTimeSlotClick(d, interval.hour, 0)"
                  ></div>
                }
                <div class="pointer-events-none absolute inset-0 p-0.5">
                  @for (item of positionedFor(events, d); track item.event.id || item.event.title) {
                    <ng-container
                      [uiEventCalendarOutlet]="timedEvent"
                      [uiEventCalendarOutletContext]="{ item: item, view: activeView, location: true }"
                    />
                  }
                  @if (isToday(d) && nowPosition() !== null) {
                    <ng-container [uiEventCalendarOutlet]="nowLine" />
                  }
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    }

    @if (activeView === 'category') {
      <div class="flex flex-1 flex-col overflow-hidden">
        <div class="border-border bg-muted/20 flex border-b select-none">
          <div
            class="border-border/50 text-muted-foreground w-16 shrink-0 border-r py-2.5 text-center text-xs font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-clock mx-auto size-3.5 opacity-60"
              aria-hidden="true"
            >
              <path d="M12 6v6l4 2" />
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
          <div class="divide-border/50 grid flex-1 divide-x" [style.grid-template-columns]="categoryColumns">
            @for (cat of normalizedCategories; track cat.id) {
              <div
                class="text-foreground flex items-center justify-center gap-1.5 px-2 py-2.5 text-center text-xs font-semibold"
              >
                @if (cat.color) {
                  <span class="size-2 shrink-0 rounded-full" [style.background-color]="cat.color"></span>
                }
                <span class="truncate">{{ cat.name }}</span>
              </div>
            }
          </div>
        </div>
        <div class="relative flex max-h-[640px] min-h-[480px] flex-1 overflow-y-auto">
          <ng-container [uiEventCalendarOutlet]="gutter" [uiEventCalendarOutletContext]="{ plain: true }" />
          <div class="divide-border/50 relative grid flex-1 divide-x" [style.grid-template-columns]="categoryColumns">
            @for (cat of normalizedCategories; track cat.id) {
              <div class="relative flex flex-col">
                @for (interval of intervals; track interval.time) {
                  <div
                    [style.height.px]="intervalHeight"
                    class="border-border/30 hover:bg-muted/20 cursor-pointer border-b transition-colors"
                    (click)="onTimeSlotClick(activeDate, interval.hour, 0, cat.id)"
                  ></div>
                }
                <div class="pointer-events-none absolute inset-0 p-0.5">
                  @for (
                    item of positionedFor(categoryEvents(cat), activeDate);
                    track item.event.id || item.event.title
                  ) {
                    <ng-container
                      [uiEventCalendarOutlet]="timedEvent"
                      [uiEventCalendarOutletContext]="{ item: item, view: 'category', location: false }"
                    />
                  }
                  @if (isToday(activeDate) && nowPosition() !== null) {
                    <ng-container [uiEventCalendarOutlet]="nowLine" />
                  }
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    }

    <ng-template #gutter let-plain="plain">
      <div class="border-border/50 bg-card w-16 shrink-0 border-r select-none">
        @for (interval of intervals; track interval.time) {
          <div
            [style.height.px]="intervalHeight"
            class="border-border/30 text-muted-foreground relative border-b pr-2.5 text-right text-[11px] font-medium"
          >
            @if (renderInterval && !plain) {
              <ng-container
                [uiEventCalendarOutlet]="renderInterval"
                [uiEventCalendarOutletContext]="{ hour: interval.hour, time: interval.time, label: interval.label }"
              />
            } @else if (interval.label) {
              <span class="relative -top-2 block">{{ interval.label }}</span>
            }
          </div>
        }
      </div>
    </ng-template>

    <ng-template #timedEvent let-item="item" let-view="view" let-location="location">
      <div
        [style.top.%]="item.top"
        [style.height.%]="item.height"
        [style.left]="'calc(' + item.left + '% + 2px)'"
        [style.width]="'calc(' + item.width + '% - 4px)'"
        class="pointer-events-auto absolute z-10"
      >
        @if (renderEvent) {
          <ng-container
            [uiEventCalendarOutlet]="renderEvent"
            [uiEventCalendarOutletContext]="{ event: item.event, view: view, isAllDay: false }"
          />
        } @else {
          <div data-slot="event-card" [class]="timedClass(item.event)" (click)="onEventClick(item.event, $event)">
            <span class="truncate text-xs font-semibold">{{ item.event.title }}</span>
            <span class="truncate font-mono text-[10px] opacity-80"
              >{{ fmt(item.startMinutes) }} – {{ fmt(item.endMinutes) }}</span
            >
            @if (location && item.event.location) {
              <span class="mt-auto truncate text-[10px] opacity-70">📍 {{ item.event.location }}</span>
            }
          </div>
        }
      </div>
    </ng-template>

    <ng-template #nowLine>
      <div [style.top.%]="nowPosition()" class="pointer-events-none absolute right-0 left-0 z-20">
        <div class="relative w-full border-t-2 border-red-500 dark:border-red-400">
          <div
            class="ring-background absolute -top-1 -left-1 size-2 rounded-full bg-red-500 ring-2 dark:bg-red-400"
          ></div>
        </div>
      </div>
    </ng-template>
  `,
})
export class UiEventCalendarComponent implements OnInit, OnChanges, OnDestroy {
  /** Controlled active date. */
  @Input() value?: string | Date
  @Input() defaultValue?: string | Date
  /** Controlled active view. */
  @Input() view?: CalendarView
  @Input() defaultView: CalendarView = 'month'
  private readonly eventsSig = signal<CalendarEvent[]>([])
  @Input() set events(v: CalendarEvent[]) {
    this.eventsSig.set(v ?? [])
  }
  get events(): CalendarEvent[] {
    return this.eventsSig()
  }
  @Input() categories: (string | CalendarCategory)[] = []
  @Input() weekStartsOn: 0 | 1 = 0
  @Input() firstInterval = 0
  @Input() intervalCount = 24
  @Input() intervalMinutes = 60
  @Input() intervalHeight = 52
  @Input() timeFormat: '12h' | '24h' = '12h'
  @Input() maxEventsPerDay = 3
  @Input({ transform: booleanAttribute }) showNowIndicator = true
  @Input({ transform: booleanAttribute }) showHeader = true
  @Input('class') className?: string
  @Input() renderHeader?: TemplateRef<EventCalendarHeaderContext> | null
  @Input() renderEvent?: TemplateRef<EventCalendarEventContext> | null
  @Input() renderDayHeader?: TemplateRef<EventCalendarDayHeaderContext> | null
  @Input() renderAllDay?: TemplateRef<EventCalendarAllDayContext> | null
  @Input() renderInterval?: TemplateRef<EventCalendarIntervalContext> | null
  @Output() dateChange = new EventEmitter<Date>()
  @Output() viewChange = new EventEmitter<CalendarView>()
  @Output() eventClick = new EventEmitter<CalendarEvent>()
  @Output() dateClick = new EventEmitter<string>()
  @Output() timeClick = new EventEmitter<TimeClickPayload>()
  @Output() moreClick = new EventEmitter<EventCalendarMoreClick>()

  readonly isToday = isToday
  readonly dateKey = formatDateKey
  private readonly internalDate = signal<Date>(new Date())
  private readonly internalView = signal<CalendarView | null>(null)
  readonly nowPosition = signal<number | null>(null)
  private nowTimer: ReturnType<typeof setInterval> | null = null

  ngOnInit(): void {
    this.internalDate.set(parseDate(this.value ?? this.defaultValue ?? new Date()))
    if (this.nowTimer === null) this.startNowTimer()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['showNowIndicator'] ||
      changes['firstInterval'] ||
      changes['intervalCount'] ||
      changes['intervalMinutes']
    ) {
      this.startNowTimer()
    }
  }

  ngOnDestroy(): void {
    if (this.nowTimer) clearInterval(this.nowTimer)
  }

  private startNowTimer(): void {
    if (this.nowTimer) clearInterval(this.nowTimer)
    this.nowTimer = null
    if (!this.showNowIndicator) {
      this.nowPosition.set(null)
      return
    }
    const update = () =>
      this.nowPosition.set(getCurrentTimePosition(this.firstInterval, this.intervalCount, this.intervalMinutes))
    update()
    this.nowTimer = setInterval(update, 30000)
  }

  get hostClass(): string {
    return cn(
      'border-border bg-card text-foreground flex w-full flex-col overflow-hidden rounded-xl border shadow-xs',
      this.className,
    )
  }

  get activeDate(): Date {
    return this.value ? parseDate(this.value) : this.internalDate()
  }

  get activeView(): CalendarView {
    return this.view ?? this.internalView() ?? this.defaultView
  }

  private setDate(d: Date): void {
    this.internalDate.set(d)
    this.dateChange.emit(d)
  }

  readonly setView = (v: CalendarView): void => {
    this.internalView.set(v)
    this.viewChange.emit(v)
  }

  private step(sign: 1 | -1): void {
    const d = new Date(this.activeDate)
    const v = this.activeView
    if (v === 'month') d.setMonth(d.getMonth() + sign)
    else if (v === 'week' || v === 'work-week') d.setDate(d.getDate() + 7 * sign)
    else d.setDate(d.getDate() + sign)
    this.setDate(d)
  }

  readonly prev = (): void => this.step(-1)
  readonly next = (): void => this.step(1)
  readonly today = (): void => this.setDate(new Date())

  get normalizedCategories(): CalendarCategory[] {
    return this.categories.map((c, idx) =>
      typeof c === 'string'
        ? { id: c, name: c }
        : { id: c.id || `cat-${idx}`, name: c.name || `Category ${idx + 1}`, color: c.color },
    )
  }

  get categoryColumns(): string {
    return `repeat(${Math.max(1, this.normalizedCategories.length)}, minmax(0, 1fr))`
  }

  get formattedTitle(): string {
    const d = this.activeDate
    const v = this.activeView
    if (v === 'month') return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    if (v === 'week') {
      const days = getWeekDays(d, this.weekStartsOn)
      const first = days[0]
      const last = days[6]
      if (first.getMonth() === last.getMonth()) {
        return `${first.toLocaleDateString('en-US', { month: 'short' })} ${first.getDate()} – ${last.getDate()}, ${first.getFullYear()}`
      }
      return `${first.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${last.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
    }
    if (v === 'work-week') {
      const days = getWorkWeekDays(d)
      return `${days[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${days[4].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
    }
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  }

  get monthDays() {
    return getMonthDays(this.activeDate, this.weekStartsOn)
  }

  get weekdayHeaderLabels(): string[] {
    return this.weekStartsOn === 1
      ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  }

  get intervals(): { hour: number; label: string; time: string }[] {
    const list: { hour: number; label: string; time: string }[] = []
    for (let i = 0; i < this.intervalCount; i++) {
      const hour = (this.firstInterval + Math.floor((i * this.intervalMinutes) / 60)) % 24
      const min = (i * this.intervalMinutes) % 60
      const time = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`
      list.push({ hour, label: min === 0 ? formatHourLabel(hour, this.timeFormat) : '', time })
    }
    return list
  }

  get visibleDays(): Date[] {
    const v = this.activeView
    if (v === 'week') return getWeekDays(this.activeDate, this.weekStartsOn)
    if (v === 'work-week') return getWorkWeekDays(this.activeDate)
    return [this.activeDate]
  }

  private startKey(e: CalendarEvent): string {
    return typeof e.start === 'string' && /^\d{4}-\d{2}-\d{2}/.test(e.start)
      ? e.start.slice(0, 10)
      : formatDateKey(parseDate(e.start))
  }

  /** Events grouped by start-date key, rebuilt only when `events` changes. Preserves input order per day. */
  private readonly eventsByDay = computed(() => {
    const map = new Map<string, CalendarEvent[]>()
    for (const e of this.eventsSig()) {
      const key = this.startKey(e)
      const list = map.get(key)
      if (list) list.push(e)
      else map.set(key, [e])
    }
    return map
  })

  getEventsForDay(dateKey: string): CalendarEvent[] {
    return this.eventsByDay().get(dateKey) ?? []
  }

  getAllDayEventsForDay(day: Date): CalendarEvent[] {
    const key = formatDateKey(day)
    return this.events.filter((e) => e.allDay && this.startKey(e) === key)
  }

  categoryEvents(cat: CalendarCategory): CalendarEvent[] {
    return this.events.filter((e) => e.category === cat.id || e.category === cat.name)
  }

  positionedFor(events: CalendarEvent[], day: Date) {
    return calculateTimedEventPositions(events, day, this.firstInterval, this.intervalCount, this.intervalMinutes)
  }

  private variantOf(event: CalendarEvent): EventVariant {
    return (EVENT_COLORS.includes(event.color as string) ? event.color : 'default') as EventVariant
  }

  fmt(minutes: number): string {
    return formatTime(minutes, this.timeFormat)
  }

  eventTime(evt: CalendarEvent): string {
    return formatTime(getEventMinutes(evt.start, 540), this.timeFormat)
  }

  popoverDate(d: Date): string {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' })
  }

  weekdayName(d: Date): string {
    return d.toLocaleDateString('en-US', { weekday: this.activeView === 'day' ? 'long' : 'short' })
  }

  toggleClass(v: CalendarView): string {
    return cn(
      'rounded-md px-2.5 py-1 text-xs font-medium transition-[color,background-color,box-shadow]',
      this.activeView === v ? TOGGLE_ACTIVE : TOGGLE_IDLE,
    )
  }

  cellClass(inMonth: boolean): string {
    return cn(
      'group relative flex min-h-[96px] cursor-pointer flex-col p-1.5 transition-colors',
      inMonth ? 'bg-card hover:bg-muted/15' : 'bg-muted/10 text-muted-foreground/50 hover:bg-muted/20',
    )
  }

  dayNumberClass(today: boolean, inMonth: boolean): string {
    return cn(
      'inline-flex min-w-[20px] items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-medium transition-colors',
      today
        ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
        : inMonth
          ? 'text-foreground/90'
          : 'text-muted-foreground/60',
    )
  }

  chipClass(evt: CalendarEvent, truncate: boolean): string {
    return cn(
      calendarEventVariants({ variant: this.variantOf(evt), size: 'sm' }),
      truncate ? 'w-full truncate' : 'w-full',
    )
  }

  allDayClass(evt: CalendarEvent): string {
    return cn(calendarEventVariants({ variant: this.variantOf(evt), size: 'sm' }), 'w-full truncate py-0.5')
  }

  timedClass(evt: CalendarEvent): string {
    return cn(
      calendarEventVariants({ variant: this.variantOf(evt) }),
      'flex h-full w-full flex-col justify-start overflow-hidden rounded-md p-1.5 leading-tight shadow-xs',
    )
  }

  gridColsClass(relative = false): string {
    const v = this.activeView
    return cn(
      relative ? 'divide-border/50 relative grid flex-1 divide-x' : 'divide-border/50 grid flex-1 divide-x',
      v === 'week' ? 'grid-cols-7' : v === 'work-week' ? 'grid-cols-5' : 'grid-cols-1',
    )
  }

  dayHeaderClass(d: Date): string {
    return cn(
      'hover:bg-muted/30 flex cursor-pointer flex-col items-center justify-center py-2 transition-colors',
      isToday(d) && 'bg-primary/5',
    )
  }

  dayHeaderNumberClass(d: Date): string {
    return cn(
      'mt-0.5 inline-flex size-7 items-center justify-center rounded-full text-xs font-semibold transition-[color,background-color,box-shadow]',
      isToday(d) ? 'bg-primary text-primary-foreground shadow-xs' : 'text-foreground',
    )
  }

  onEventClick(event: CalendarEvent, e: MouseEvent): void {
    e.stopPropagation()
    this.eventClick.emit(event)
  }

  onTimeSlotClick(day: Date, hour: number, minute: number, category?: string): void {
    this.timeClick.emit({
      date: formatDateKey(day),
      time: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
      hour,
      minute,
      category,
    })
  }
}

export { calendarEventVariants, type CalendarEventVariants }
export type { CalendarCategory, CalendarEvent, CalendarView, TimeClickPayload }
