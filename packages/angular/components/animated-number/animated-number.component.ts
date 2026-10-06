import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  booleanAttribute,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'

const defaultFormat = (v: number) => String(Math.round(v))

/** Inputs that restart the tween (React's effect dependency list). `format` / `class` do not. */
const TWEEN_INPUTS = ['value', 'from', 'duration', 'delay', 'disabled']

/**
 * Tweened number display (React `AnimatedNumber`). Counts up from `from` on mount, then smoothly
 * retargets from the currently displayed value whenever `value` changes. Ease-out cubic via
 * requestAnimationFrame; `disabled` or prefers-reduced-motion render the target instantly.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-animated-number, [ui-animated-number]',
  standalone: true,
  host: {
    'data-uipkge': '',
    'data-slot': 'animated-number',
    '[class]': 'hostClass',
  },
  template: `{{ formatted }}`,
})
export class UiAnimatedNumberComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) value = 0
  /** Value the first animation starts from. */
  @Input() from = 0
  /** ms per tween. */
  @Input() duration = 900
  /** ms before the first tween starts. */
  @Input() delay = 0
  @Input() format?: (value: number) => string
  /** Render the target value instantly, no tween. */
  @Input({ transform: booleanAttribute }) disabled = false
  @Input('class') className?: string

  // Signal-backed: written from rAF / timers, which never schedule change detection in zoneless apps.
  private readonly display = signal(0)
  private mounted = false
  private frame = 0
  private timer?: ReturnType<typeof setTimeout>

  get hostClass(): string {
    return cn('tabular-nums', this.className)
  }

  get formatted(): string {
    return (this.format ?? defaultFormat)(this.display())
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.mounted) this.display.set(this.value)
    if (this.mounted && !TWEEN_INPUTS.some((k) => k in changes)) return
    this.run()
  }

  ngOnDestroy(): void {
    this.cancel()
  }

  private cancel(): void {
    if (this.frame) cancelAnimationFrame(this.frame)
    this.frame = 0
    if (this.timer !== undefined) {
      clearTimeout(this.timer)
      this.timer = undefined
    }
  }

  private run(): void {
    this.cancel()
    const value = this.value
    const reduce = typeof window === 'undefined' || !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (this.disabled || reduce) {
      this.display.set(value)
      return
    }

    const firstRun = !this.mounted
    this.mounted = true
    const startValue = firstRun ? this.from : this.display()
    this.display.set(startValue)

    const duration = this.duration
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
    const tween = () => {
      const startTime = performance.now()
      const step = () => {
        const t = Math.min(1, (performance.now() - startTime) / duration)
        this.display.set(startValue + (value - startValue) * easeOutCubic(t))
        this.frame = t < 1 ? requestAnimationFrame(step) : 0
      }
      step()
    }

    if (firstRun && this.delay > 0) this.timer = setTimeout(tween, this.delay)
    else tween()
  }
}
