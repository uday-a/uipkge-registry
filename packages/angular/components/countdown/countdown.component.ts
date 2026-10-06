import {
  Component,
  ContentChild,
  DestroyRef,
  Directive,
  EmbeddedViewRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'

export type CountdownFormat = 'DD:HH:MM:SS' | 'HH:MM:SS' | 'MM:SS' | 'SS'

/** Context of the whole-display template (React `children` render prop). */
export interface CountdownRenderProps {
  days: number
  hours: number
  minutes: number
  seconds: number
  display: string
  finished: boolean
}

/** Context of a per-unit template (React `renderDays` / `renderHours` / …): `let-days`. */
export interface CountdownUnitContext {
  $implicit: number
}

// Copied verbatim from React Countdown (injected there once into <head>). Unscoped
// (ViewEncapsulation.None) so the `[data-slot='countdown'] .countdown-digit` selectors match.
const COUNTDOWN_STYLES = `
@keyframes countdown-digit-flip {
  0% { opacity: 0; transform: translateY(45%) scale(0.92); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
[data-slot='countdown'] .countdown-digit {
  display: inline-block;
  animation: countdown-digit-flip 280ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
@media (prefers-reduced-motion: reduce) {
  [data-slot='countdown'] .countdown-digit {
    animation: none !important;
  }
}
`

/** Renders a template with a context and keeps one view, updating its context on change. */
@Directive({ selector: '[uiCountdownOutlet]', standalone: true })
export class UiCountdownOutletDirective<C extends object> implements OnChanges, OnDestroy {
  @Input('uiCountdownOutlet') template: TemplateRef<C> | null = null
  @Input('uiCountdownOutletContext') context!: C
  private readonly vcr = inject(ViewContainerRef)
  private view?: EmbeddedViewRef<C>

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['template'] || !this.view) {
      this.vcr.clear()
      this.view = this.template ? this.vcr.createEmbeddedView(this.template, { ...this.context }) : undefined
      return
    }
    Object.assign(this.view.context, this.context)
    this.view.markForCheck()
  }

  ngOnDestroy(): void {
    this.vcr.clear()
  }
}

/**
 * Angular port of UIPKGE Countdown (React `Countdown`). Ticks every second toward `target`
 * (Date, ISO string or epoch ms): DD:HH:MM:SS / HH:MM:SS / MM:SS / SS (compact formats roll
 * larger units up) or a custom token format, optional label, leading-zero padding, custom
 * separator, `paused`, `tick` (remaining ms) and a one-shot `finish` — fired immediately when
 * the target is already past. Digits re-mount on change to replay the flip keyframes.
 * Per-unit templates (`renderDays` …) replace a unit; a projected `<ng-template let-p>`
 * replaces the whole display (React `children`). State is signal-backed (zoneless timers).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-countdown, [ui-countdown]',
  standalone: true,
  imports: [UiCountdownOutletDirective],
  encapsulation: ViewEncapsulation.None,
  styles: [COUNTDOWN_STYLES],
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"countdown"',
    '[attr.data-finished]': 'finished() ? "true" : "false"',
    '[attr.data-paused]': 'paused ? "true" : "false"',
    '[class]': 'hostClass',
  },
  template: `
    @if (label) {
      <span data-slot="countdown-label" class="text-muted-foreground text-xs font-medium tracking-wide uppercase">{{
        label
      }}</span>
    }
    <div
      data-slot="countdown-display"
      class="flex items-baseline gap-1 font-mono tabular-nums"
      role="timer"
      [attr.aria-live]="finished() || paused ? 'off' : 'polite'"
      aria-atomic="true"
    >
      @if (childrenTemplate) {
        <ng-container [uiCountdownOutlet]="childrenTemplate" [uiCountdownOutletContext]="renderContext" />
      } @else {
        @if (has('DD')) {
          @if (renderDays) {
            <ng-container [uiCountdownOutlet]="renderDays" [uiCountdownOutletContext]="{ $implicit: parts.days }" />
          } @else {
            <span data-slot="countdown-days" class="text-foreground inline-flex text-2xl font-semibold">
              @for (ch of digits(displayParts.days); track $index + '-' + ch) {
                <span class="countdown-digit tabular-nums">{{ ch }}</span>
              }
            </span>
          }
        }
        @if (has('DD') && has('HH')) {
          <span class="text-muted-foreground text-2xl">{{ separator }}</span>
        }
        @if (has('HH')) {
          @if (renderHours) {
            <ng-container [uiCountdownOutlet]="renderHours" [uiCountdownOutletContext]="{ $implicit: parts.hours }" />
          } @else {
            <span data-slot="countdown-hours" class="text-foreground inline-flex text-2xl font-semibold">
              @for (ch of digits(displayParts.hours); track $index + '-' + ch) {
                <span class="countdown-digit tabular-nums">{{ ch }}</span>
              }
            </span>
          }
        }
        @if (has('HH') && has('MM')) {
          <span class="text-muted-foreground text-2xl">{{ separator }}</span>
        }
        @if (has('MM')) {
          @if (renderMinutes) {
            <ng-container
              [uiCountdownOutlet]="renderMinutes"
              [uiCountdownOutletContext]="{ $implicit: parts.minutes }"
            />
          } @else {
            <span data-slot="countdown-minutes" class="text-foreground inline-flex text-2xl font-semibold">
              @for (ch of digits(displayParts.minutes); track $index + '-' + ch) {
                <span class="countdown-digit tabular-nums">{{ ch }}</span>
              }
            </span>
          }
        }
        @if (has('MM') && has('SS')) {
          <span class="text-muted-foreground text-2xl">{{ separator }}</span>
        }
        @if (has('SS')) {
          @if (renderSeconds) {
            <ng-container
              [uiCountdownOutlet]="renderSeconds"
              [uiCountdownOutletContext]="{ $implicit: parts.seconds }"
            />
          } @else {
            <span data-slot="countdown-seconds" class="text-foreground inline-flex text-2xl font-semibold">
              @for (ch of digits(displayParts.seconds); track $index + '-' + ch) {
                <span class="countdown-digit tabular-nums">{{ ch }}</span>
              }
            </span>
          }
        }
      }
    </div>
  `,
})
export class UiCountdownComponent implements OnChanges {
  /** Target date/time. Accepts a Date, ISO string, or epoch ms number. */
  @Input({ required: true }) target!: Date | string | number
  /** Display format. Custom tokens: DD days, HH hours, MM minutes, SS seconds. */
  @Input() format: CountdownFormat | string = 'DD:HH:MM:SS'
  /** Pause the countdown. */
  @Input({ transform: booleanAttribute }) paused = false
  /** Optional label rendered above the countdown. */
  @Input() label = ''
  /** Show leading zeros (e.g. 05 vs 5). */
  @Input({ transform: booleanAttribute }) pad = true
  /** Separator between units. */
  @Input() separator = ':'
  /** Per-unit template overrides (`<ng-template #d let-days>`). */
  @Input() renderDays?: TemplateRef<CountdownUnitContext> | null
  @Input() renderHours?: TemplateRef<CountdownUnitContext> | null
  @Input() renderMinutes?: TemplateRef<CountdownUnitContext> | null
  @Input() renderSeconds?: TemplateRef<CountdownUnitContext> | null
  @Input('class') className?: string
  /** Fired once when the countdown reaches zero. */
  @Output() readonly finish = new EventEmitter<void>()
  /** Fired every tick with the remaining ms. */
  @Output() readonly tick = new EventEmitter<number>()

  /** Whole-display override (React `children` render prop): a projected `<ng-template let-p>`. */
  @ContentChild(TemplateRef) childrenTemplate?: TemplateRef<{ $implicit: CountdownRenderProps }>

  readonly now = signal(Date.now())
  readonly finished = signal(false)
  private finishedFlag = false
  private timer: ReturnType<typeof setInterval> | null = null
  private lastTargetMs: number | undefined

  constructor() {
    inject(DestroyRef).onDestroy(() => this.stop())
  }

  get hostClass(): string {
    return cn('inline-flex flex-col gap-1', this.className)
  }

  get targetMs(): number {
    const t = this.target
    if (t instanceof Date) return t.getTime()
    if (typeof t === 'number') return t
    return new Date(t).getTime()
  }

  get remainingMs(): number {
    return Math.max(0, this.targetMs - this.now())
  }

  get parts(): { days: number; hours: number; minutes: number; seconds: number } {
    const total = this.remainingMs
    return {
      days: Math.floor(total / 86_400_000),
      hours: Math.floor((total % 86_400_000) / 3_600_000),
      minutes: Math.floor((total % 3_600_000) / 60_000),
      seconds: Math.floor((total % 60_000) / 1000),
    }
  }

  /** Values painted for each unit under the active format (rolled-up totals for compact formats). */
  get displayParts(): { days: number; hours: number; minutes: number; seconds: number } {
    const { days, hours, minutes, seconds } = this.parts
    if (this.format === 'HH:MM:SS') return { days, hours: days * 24 + hours, minutes, seconds }
    if (this.format === 'MM:SS') return { days, hours, minutes: days * 24 * 60 + hours * 60 + minutes, seconds }
    if (this.format === 'SS') return { days, hours, minutes, seconds: Math.floor(this.remainingMs / 1000) }
    return { days, hours, minutes, seconds }
  }

  get display(): string {
    const f = this.format
    const { days, hours, minutes, seconds } = this.displayParts
    const sep = this.separator
    const p = (n: number) => this.pad2(n)
    if (f === 'DD:HH:MM:SS') return `${p(days)}${sep}${p(hours)}${sep}${p(minutes)}${sep}${p(seconds)}`
    if (f === 'HH:MM:SS') return `${p(hours)}${sep}${p(minutes)}${sep}${p(seconds)}`
    if (f === 'MM:SS') return `${p(minutes)}${sep}${p(seconds)}`
    if (f === 'SS') return p(seconds)
    const parts = this.parts
    return f
      .replace('DD', p(parts.days))
      .replace('HH', p(parts.hours))
      .replace('MM', p(parts.minutes))
      .replace('SS', p(parts.seconds))
  }

  get renderContext(): { $implicit: CountdownRenderProps } {
    return { $implicit: { ...this.parts, display: this.display, finished: this.finished() } }
  }

  has(token: 'DD' | 'HH' | 'MM' | 'SS'): boolean {
    return this.format.includes(token)
  }

  pad2(n: number): string {
    return this.pad ? String(n).padStart(2, '0') : String(n)
  }

  digits(n: number): string[] {
    return [...this.pad2(n)]
  }

  ngOnChanges(changes: SimpleChanges): void {
    const targetMs = this.targetMs
    if (targetMs !== this.lastTargetMs) {
      // Reset finished state only when the target changes.
      this.lastTargetMs = targetMs
      this.finishedFlag = false
      this.finished.set(false)
      this.now.set(Date.now())
      this.restart()
    } else if (changes['paused']) {
      this.restart()
    }
  }

  private stop(): void {
    if (this.timer !== null) clearInterval(this.timer)
    this.timer = null
  }

  private markFinished(): void {
    if (this.finishedFlag) return
    this.finishedFlag = true
    this.finished.set(true)
    this.finish.emit()
  }

  private restart(): void {
    this.stop()
    const targetMs = this.targetMs
    // Fire finish immediately when the target is already past (don't wait for first tick).
    if (Math.max(0, targetMs - Date.now()) <= 0) {
      this.markFinished()
      return
    }
    if (this.paused) return
    this.timer = setInterval(() => {
      const next = Date.now()
      const remaining = Math.max(0, targetMs - next)
      this.tick.emit(remaining)
      this.now.set(next)
      if (remaining <= 0) {
        this.markFinished()
        this.stop()
      }
    }, 1000)
  }
}
