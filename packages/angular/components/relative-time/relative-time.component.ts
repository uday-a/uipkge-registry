import {
  Component,
  Input,
  type OnChanges,
  type OnDestroy,
  type OnInit,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'
import {
  formatAbsoluteTime,
  formatVisibleTime,
  toDate,
  type RelativeTimeDisplay,
  type RelativeTimeNumeric,
  type RelativeTimeParseAs,
  type RelativeTimeStyle,
} from './format-relative-time'

/**
 * Angular port of UIPKGE RelativeTime (React `RelativeTime`). Put it on a `<time>` element
 * (`<time ui-relative-time [date]="…">`) so the host IS the semantic `<time>` like React; the
 * `<ui-relative-time>` element form works too. Live relative label ("2 minutes ago") via
 * Intl.RelativeTimeFormat that ticks every `updateInterval` ms unless `now` is given (a
 * signal tick, so it repaints zoneless). `display` switches relative / absolute / both,
 * `timeZone` formats the clock + title tooltip, `parseAs` treats naive ISO strings as local
 * or UTC. Projected content replaces the label (React `children ?? label`).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-relative-time, [ui-relative-time]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"relative-time"',
    '[attr.data-display]': 'display',
    '[attr.data-timezone]': 'timeZone || "local"',
    '[attr.data-parse-as]': 'parseAs',
    '[attr.datetime]': 'isoString',
    '[attr.title]': 'absolute',
    '[class]': 'hostClass',
  },
  template: `<ng-content>{{ label }}</ng-content>`,
})
export class UiRelativeTimeComponent implements OnInit, OnChanges, OnDestroy {
  /** Instant to display. Accepts a Date, ISO string, or epoch ms. */
  @Input({ required: true }) date!: Date | string | number
  /** Clock used for the delta. Pass in tests and SSR to keep output stable. */
  @Input() now?: Date | string | number
  /** Intl relative style. */
  @Input() formatStyle: RelativeTimeStyle = 'long'
  /** `auto` yields "yesterday"; `always` yields "1 day ago". */
  @Input() numeric: RelativeTimeNumeric = 'auto'
  /** BCP 47 locale. Defaults to the runtime locale. */
  @Input() locale?: string
  /** Visible label: relative (default), absolute clock, or both. */
  @Input() display: RelativeTimeDisplay = 'relative'
  /** IANA zone for absolute text and the title tooltip. Omit for the browser local zone. */
  @Input() timeZone?: string
  /** How to parse date strings with no offset. */
  @Input() parseAs: RelativeTimeParseAs = 'local'
  /** Tick interval in ms. `0` freezes the clock. */
  @Input() updateInterval = 30_000
  @Input('class') className?: string

  private timer: ReturnType<typeof setInterval> | null = null
  private readonly _tick = signal(0)

  /** Created once: a fresh Date on every read changed [attr.datetime] between checks (NG0100). */
  private fallbackDate?: Date

  get resolvedDate(): Date {
    // `date` is required (as in React); the fallback only keeps a missing binding (e.g. data
    // still loading) from throwing.
    return toDate(this.date ?? (this.fallbackDate ??= new Date()), this.parseAs)
  }

  get resolvedNow(): Date {
    // Reading the tick signal re-evaluates the label every updateInterval (zoneless-safe).
    this._tick()
    return this.now === undefined ? new Date() : toDate(this.now, this.parseAs)
  }

  get label(): string {
    return formatVisibleTime(this.resolvedDate, this.resolvedNow, {
      display: this.display,
      style: this.formatStyle,
      numeric: this.numeric,
      locale: this.locale,
      timeZone: this.timeZone,
    })
  }

  get absolute(): string {
    return formatAbsoluteTime(this.resolvedDate, this.locale, this.timeZone)
  }

  get isoString(): string {
    return this.resolvedDate.toISOString()
  }

  get hostClass(): string {
    return cn('text-muted-foreground text-sm tabular-nums', this.className)
  }

  private initialized = false

  ngOnInit(): void {
    this.initialized = true
    this.startClock()
  }

  /** Restart the clock when updateInterval / now change (React effect deps). */
  ngOnChanges(): void {
    if (this.initialized) this.startClock()
  }

  private startClock(): void {
    this.stopClock()
    if (this.updateInterval <= 0 || this.now !== undefined) return
    this.timer = setInterval(() => this._tick.update((t) => t + 1), this.updateInterval)
  }

  private stopClock(): void {
    if (this.timer) clearInterval(this.timer)
    this.timer = null
  }

  ngOnDestroy(): void {
    this.stopClock()
  }
}

export {
  formatAbsoluteTime,
  formatRelativeTime,
  formatVisibleTime,
  toDate,
  type RelativeTimeDisplay,
  type RelativeTimeNumeric,
  type RelativeTimeParseAs,
  type RelativeTimeStyle,
} from './format-relative-time'
