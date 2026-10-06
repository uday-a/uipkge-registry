import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  booleanAttribute,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'

export type ScrollProgressPosition = 'fixed' | 'absolute'

/**
 * Angular port of UIPKGE ScrollProgress (React `ScrollProgress`). A single aria-hidden bar
 * scaled horizontally by scroll depth of the window (default) or of `container`. Listens to
 * scroll + resize, syncs instantly on mount / container swap, lerps toward the target each
 * frame (0.18) when `smooth`, and tracks 1:1 under prefers-reduced-motion. Progress is a
 * signal: scroll handlers and animation frames repaint in zoneless apps.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-scroll-progress, [ui-scroll-progress]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"scroll-progress"',
    '[attr.aria-hidden]': '"true"',
    '[attr.data-position]': 'position',
    '[attr.data-smooth]': 'smooth ? "true" : null',
    '[class]': 'hostClass',
    '[style.height.px]': 'height',
    '[style.background]': 'color',
    '[style.transform]': '"scaleX(" + progress() + ")"',
    '[style.will-change]': '"transform"',
  },
  template: ``,
})
export class UiScrollProgressComponent implements OnInit, OnChanges, OnDestroy {
  /** Bar thickness in pixels. */
  @Input() height = 3
  /** Any CSS color or gradient — applied to `background` verbatim. */
  @Input() color = 'var(--primary)'
  /** `fixed` pins to the viewport; `absolute` fills a positioned scrollable parent. */
  @Input() position: ScrollProgressPosition = 'fixed'
  /** Scrollable element to measure. Defaults to the window/document. */
  @Input() container: HTMLElement | null = null
  /** Lerp-smooth the displayed value toward the real progress each frame. */
  @Input({ transform: booleanAttribute }) smooth = true
  @Input('class') className?: string

  readonly progress = signal(0)
  private display = 0
  private target = 0
  private raf: number | null = null
  private detach: (() => void) | null = null
  private attached = false

  get hostClass(): string {
    return cn(
      'block pointer-events-none top-0 left-0 z-50 w-full origin-left',
      this.position === 'fixed' ? 'fixed' : 'absolute',
      this.className,
    )
  }

  ngOnInit(): void {
    this.attach()
  }

  /** Swapping `container` re-attaches the listeners to the new element. */
  ngOnChanges(changes: SimpleChanges): void {
    if (this.attached && changes['container']) this.attach()
  }

  ngOnDestroy(): void {
    this.detach?.()
    this.detach = null
  }

  private read(): number {
    const clamp01 = (value: number) => Math.min(1, Math.max(0, value))
    const el = this.container
    if (el) {
      const max = el.scrollHeight - el.clientHeight
      return max > 0 ? clamp01(el.scrollTop / max) : 0
    }
    const doc = document.documentElement
    const scrollTop = window.scrollY || doc.scrollTop || document.body.scrollTop || 0
    const max = doc.scrollHeight - doc.clientHeight
    return max > 0 ? clamp01(scrollTop / max) : 0
  }

  private stopLoop(): void {
    if (this.raf !== null) {
      cancelAnimationFrame(this.raf)
      this.raf = null
    }
  }

  private readonly tick = (): void => {
    this.display += (this.target - this.display) * 0.18
    this.progress.set(this.display)
    if (Math.abs(this.target - this.display) < 0.001) {
      this.display = this.target
      this.progress.set(this.target)
      this.raf = null
      return
    }
    this.raf = requestAnimationFrame(this.tick)
  }

  private readonly sync = (): void => {
    this.target = this.read()
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    if (!this.smooth || reducedMotion) {
      this.stopLoop()
      this.display = this.target
      this.progress.set(this.target)
      return
    }
    if (this.raf === null) this.raf = requestAnimationFrame(this.tick)
  }

  private attach(): void {
    this.attached = true
    this.detach?.()
    this.detach = null
    if (typeof window === 'undefined') return
    // EventTarget union keeps addEventListener compatible across HTMLElement | Window.
    const bound: EventTarget = this.container ?? window
    bound.addEventListener('scroll', this.sync, { passive: true })
    window.addEventListener('resize', this.sync)
    // Sync instantly on mount / container swap so the bar never animates up from zero.
    this.target = this.read()
    this.display = this.target
    this.progress.set(this.target)
    this.detach = () => {
      bound.removeEventListener('scroll', this.sync)
      window.removeEventListener('resize', this.sync)
      this.stopLoop()
    }
  }
}
