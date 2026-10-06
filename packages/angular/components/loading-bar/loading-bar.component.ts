import {
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  signal,
  type Signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'

// Copied verbatim from the React loading-bar (injected there as an inline <style>). Unscoped
// (ViewEncapsulation.None) so the class matches the template's indeterminate bar.
const LOADING_BAR_MOTION_STYLES = `
@media (prefers-reduced-motion: no-preference) {
  .loading-bar-indeterminate {
    animation: loading-bar-slide 1.2s ease-in-out infinite;
  }
}
@keyframes loading-bar-slide {
  0% { left: -33%; }
  100% { left: 100%; }
}
`

/** Imperative API — same shape as React's `LoadingBarHandle`. */
export interface LoadingBarHandle {
  start: (from?: number) => void
  finish: () => void
  error: () => void
  fail: () => void
  inc: (amount?: number) => void
  set: (value: number) => void
}

/**
 * Angular port of UIPKGE LoadingBar (React `LoadingBar`). NProgress-style bar fixed to the
 * top / bottom of the viewport. Drive it with `value` / `valueChange`, or imperatively
 * (`start` trickles toward 95 on animation frames, `finish` fills to 100 then fades and
 * resets, `error` / `fail` tints destructive then fades). State is signal-backed so timers
 * and frames repaint in zoneless apps.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-loading-bar, [ui-loading-bar]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  styles: [LOADING_BAR_MOTION_STYLES],
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"loading-bar"',
    '[attr.data-position]': 'position',
    '[attr.data-state]': 'isError ? "error" : indeterminate ? "indeterminate" : "determinate"',
    '[class]': 'hostClass',
    '[style.height.px]': 'height',
    '[attr.role]': '"progressbar"',
    '[attr.aria-valuemin]': '0',
    '[attr.aria-valuemax]': '100',
    '[attr.aria-valuenow]': 'indeterminate ? null : pct',
    '[attr.aria-busy]': 'visible && !isError ? "true" : null',
    '[attr.aria-hidden]': 'visible ? "false" : "true"',
    // `hidden` is an input (React prop), never the native attribute on the host.
    '[attr.hidden]': 'null',
  },
  template: `
    <div class="absolute inset-0 bg-transparent"></div>
    @if (indeterminate) {
      <div
        data-slot="loading-bar-indeterminate"
        class="loading-bar-indeterminate absolute inset-y-0 w-1/3"
        [style.background-color]="barColor"
      >
        @if (spinner) {
          <div
            data-slot="loading-bar-spinner"
            class="absolute top-1/2 right-0 size-3 translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-2 border-current border-t-transparent"
            [style.color]="barColor"
          ></div>
        }
      </div>
    } @else {
      <div
        data-slot="loading-bar-fill"
        class="absolute inset-y-0 left-0 transition-[width] duration-200 ease-out"
        [style.width.%]="pct"
        [style.background-color]="barColor"
      >
        @if (spinner) {
          <div
            data-slot="loading-bar-spinner"
            class="absolute top-1/2 right-0 size-3 translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-2 border-current border-t-transparent"
            [style.color]="barColor"
          ></div>
        }
      </div>
    }
  `,
})
export class UiLoadingBarComponent implements OnChanges, LoadingBarHandle {
  /** 0–100 progress value. Use with value / valueChange or drive it imperatively. */
  @Input() value = 0
  /** Bar color. Accepts any CSS color value. */
  @Input() color = ''
  /** Bar height in px. */
  @Input() height = 3
  /** Indeterminate sliding animation (ignores value). */
  @Input({ transform: booleanAttribute }) indeterminate = false
  /** Anchor the bar to the top or bottom of the viewport. */
  @Input() position: 'top' | 'bottom' = 'top'
  /** Show a spinner at the trailing edge of the bar. */
  @Input({ transform: booleanAttribute }) spinner = false
  /** Error state tints the bar (React `error` prop; the `error()` method is the imperative form). */
  @Input({ alias: 'error', transform: booleanAttribute }) errorState = false
  /** Hide the bar entirely (e.g. when finished). */
  @Input({ transform: booleanAttribute }) hidden = false
  @Input('class') className?: string
  /** Fired with the new value on every internal update. */
  @Output() readonly valueChange = new EventEmitter<number>()
  /** Fired when progress reaches 100 (finish / fail). */
  @Output('finish') readonly finished = new EventEmitter<void>()

  readonly internal = signal(0)
  /** Imperative fail() tints the bar without requiring the error input. */
  private readonly internalError = signal(false)
  /** After finish / fail, fade out then reset. */
  private readonly fading = signal(false)
  private raf: number | null = null
  private hideTimer: ReturnType<typeof setTimeout> | null = null
  /** Bumped on start / finish / fail so in-flight trickle frames abort. */
  private generation = 0

  constructor() {
    inject(DestroyRef).onDestroy(() => this.clearTimers())
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Keep internal in sync when the controlled value input changes.
    if (changes['value']) this.internal.set(this.value)
  }

  get pct(): number {
    return Math.min(100, Math.max(0, this.internal()))
  }

  get isError(): boolean {
    return this.errorState || this.internalError()
  }

  get barColor(): string {
    return this.color || (this.isError ? 'var(--destructive)' : 'var(--primary)')
  }

  get visible(): boolean {
    return !this.hidden && !this.fading() && (this.indeterminate || this.internal() > 0)
  }

  get hostClass(): string {
    return cn(
      'block pointer-events-none fixed left-0 z-[9999] w-full transition-opacity duration-300',
      this.position === 'top' ? 'top-0' : 'bottom-0',
      this.visible ? 'opacity-100' : 'opacity-0',
      this.className,
    )
  }

  private clearTimers(): void {
    if (this.raf !== null) {
      cancelAnimationFrame(this.raf)
      this.raf = null
    }
    if (this.hideTimer) {
      clearTimeout(this.hideTimer)
      this.hideTimer = null
    }
  }

  private emit(v: number): void {
    this.valueChange.emit(v)
  }

  set(v: number): void {
    this.internal.set(v)
    this.emit(v)
  }

  /** Slowly creep the bar toward a soft ceiling so progress feels alive. */
  private trickle(gen: number): void {
    if (this.raf !== null) cancelAnimationFrame(this.raf)
    const step = () => {
      if (gen !== this.generation) return
      const prev = this.internal()
      if (prev >= 95) return
      const next = Math.min(95, prev + (95 - prev) * 0.04 + 0.15)
      this.internal.set(next)
      this.emit(next)
      if (next < 95 && gen === this.generation) this.raf = requestAnimationFrame(step)
    }
    this.raf = requestAnimationFrame(step)
  }

  start(from = 20): void {
    this.clearTimers()
    this.generation += 1
    const gen = this.generation
    this.internalError.set(false)
    this.fading.set(false)
    this.set(from)
    this.trickle(gen)
  }

  inc(amount = 10): void {
    const next = Math.min(99, this.internal() + amount)
    this.internal.set(next)
    this.emit(next)
  }

  finish(): void {
    this.clearTimers()
    this.generation += 1
    this.internalError.set(false)
    this.set(100)
    this.finished.emit()
    // Hold full bar briefly, then fade + reset so the next start() is clean.
    this.hideTimer = setTimeout(() => {
      this.fading.set(true)
      this.hideTimer = setTimeout(() => {
        this.internal.set(0)
        this.emit(0)
        this.fading.set(false)
        this.hideTimer = null
      }, 300)
    }, 200)
  }

  fail(): void {
    this.clearTimers()
    this.generation += 1
    this.internalError.set(true)
    this.internal.set(100)
    this.emit(100)
    this.finished.emit()
    this.hideTimer = setTimeout(() => {
      this.fading.set(true)
      this.hideTimer = setTimeout(() => {
        this.internal.set(0)
        this.internalError.set(false)
        this.emit(0)
        this.fading.set(false)
        this.hideTimer = null
      }, 300)
    }, 400)
  }

  error(): void {
    this.fail()
  }
}

export interface UseLoadingBar {
  /** Pass the bar instance (e.g. from a `@ViewChild` setter). */
  setRef: (bar: UiLoadingBarComponent | null | undefined) => void
  loading: Signal<boolean>
  isError: Signal<boolean>
  start: (from?: number) => void
  finish: () => void
  error: () => void
  inc: (amount?: number) => void
  set: (value: number) => void
}

/**
 * Angular counterpart of React's `useLoadingBar` hook: drives a `<ui-loading-bar>` through
 * `setRef` and tracks `loading` / `isError` as signals.
 *
 *   bar = useLoadingBar()
 *   @ViewChild(UiLoadingBarComponent) set barRef(b: UiLoadingBarComponent) { this.bar.setRef(b) }
 *   this.bar.start(); await fetch(...); this.bar.finish()
 */
export function useLoadingBar(initial?: UiLoadingBarComponent | null): UseLoadingBar {
  let handle: UiLoadingBarComponent | null = initial ?? null
  const loading = signal(false)
  const isError = signal(false)
  return {
    setRef: (bar) => {
      handle = bar ?? null
    },
    loading: loading.asReadonly(),
    isError: isError.asReadonly(),
    start(from = 20) {
      isError.set(false)
      loading.set(true)
      handle?.start(from)
    },
    finish() {
      loading.set(false)
      handle?.finish()
    },
    error() {
      isError.set(true)
      loading.set(false)
      handle?.error()
    },
    inc(amount = 10) {
      handle?.inc(amount)
    },
    set(value: number) {
      handle?.set(value)
    },
  }
}
