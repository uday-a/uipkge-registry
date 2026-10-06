import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  Input,
  OnChanges,
  ViewChild,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'
import { circularProgressVariants, type CircularProgressVariants } from './circular-progress.variants'

export type CircularProgressSize = 'sm' | 'default' | 'lg' | number

const sizePxMap = { sm: 40, default: 56, lg: 80 } as const

// Copied verbatim from React CircularProgress (injected there as an inline <style>). Unscoped
// (ViewEncapsulation.None) so the animation classes match the svg nodes in the template.
const CIRCULAR_PROGRESS_STYLES = `
@media (prefers-reduced-motion: no-preference) {
  .animate-spin-circular {
    animation: spin-circular 1.4s linear infinite;
  }

  /* Soft acknowledge when the arc lands on 100 — one shot per enter. */
  .animate-circular-complete {
    animation: circular-progress-complete 0.55s ease-out 1;
  }
}

@keyframes spin-circular {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes circular-progress-complete {
  0%,
  100% {
    opacity: 1;
  }
  45% {
    opacity: 0.72;
  }
}
`

/**
 * Angular port of UIPKGE CircularProgress (React `CircularProgress`). Radial progressbar:
 * value 0-100 (clamped), size preset or pixels, stroke thickness, arc / track colors, an
 * indeterminate mode that spins a partial arc, `showValue` for a centered percentage, and a
 * one-shot pulse when the value crosses into 100. Projected content replaces the centered
 * value (React `children`).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-circular-progress, [ui-circular-progress]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  styles: [CIRCULAR_PROGRESS_STYLES],
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"circular-progress"',
    '[attr.data-size]': 'sizeLabel',
    '[attr.data-indeterminate]': 'indeterminate ? "true" : "false"',
    '[attr.data-complete]': 'isComplete ? "true" : "false"',
    '[class]': 'hostClass',
    '[style.width.px]': 'sizePx',
    '[style.height.px]': 'sizePx',
    '[attr.role]': '"progressbar"',
    '[attr.aria-valuemin]': '0',
    '[attr.aria-valuemax]': '100',
    '[attr.aria-valuenow]': 'indeterminate ? null : normalizedValue',
    '[attr.aria-busy]': 'indeterminate ? "true" : null',
    '[attr.aria-label]': 'ariaLabel',
  },
  template: `
    <svg [attr.width]="sizePx" [attr.height]="sizePx" [attr.viewBox]="viewBox" class="block">
      <circle
        [attr.cx]="center"
        [attr.cy]="center"
        [attr.r]="radius"
        fill="none"
        [attr.stroke]="resolvedTrackColor"
        [attr.stroke-width]="thickness"
      />
      <g
        [attr.transform]="indeterminate ? null : 'rotate(-90 ' + center + ' ' + center + ')'"
        [attr.class]="indeterminate ? 'animate-spin-circular' : ''"
        [style.transform-box]="indeterminate ? 'fill-box' : null"
        [style.transform-origin]="indeterminate ? 'center' : null"
      >
        <circle
          [attr.cx]="center"
          [attr.cy]="center"
          [attr.r]="radius"
          fill="none"
          [attr.stroke]="resolvedColor"
          [attr.stroke-width]="thickness"
          stroke-linecap="round"
          [attr.stroke-dasharray]="circumference"
          [attr.stroke-dashoffset]="strokeDashoffset"
          [attr.class]="arcClass"
        />
      </g>
    </svg>
    <div
      #overlay
      class="absolute inset-0 flex items-center justify-center"
      [attr.hidden]="showValue || hasChildren() ? null : ''"
    >
      <ng-content />
      @if (showValue && !hasChildren()) {
        <span #valueLabel [class]="valueClass">{{ roundedValue }}{{ suffix }}</span>
      }
    </div>
  `,
})
export class UiCircularProgressComponent implements OnChanges, AfterViewInit {
  @Input() value = 0
  @Input() size: CircularProgressSize = 'default'
  @Input() thickness = 8
  @Input() color?: string
  @Input() trackColor?: string
  @Input({ transform: booleanAttribute }) indeterminate = false
  @Input({ transform: booleanAttribute }) showValue = false
  @Input() suffix = '%'
  @Input() ariaLabel = 'Progress'
  @Input('class') className?: string

  @ViewChild('overlay', { static: true }) private overlay?: ElementRef<HTMLElement>
  @ViewChild('valueLabel') private valueLabel?: ElementRef<HTMLElement>

  /** True when content is projected (React `children`), which replaces the value label. */
  readonly hasChildren = signal(false)
  /** One-shot pulse only when value crosses into complete — not on static 100 mounts. */
  readonly pulseComplete = signal(false)
  private prevValue: number | undefined
  private raf = 0
  private timer: ReturnType<typeof setTimeout> | undefined

  constructor() {
    inject(DestroyRef).onDestroy(() => this.clearPulse())
  }

  ngAfterViewInit(): void {
    const own = this.valueLabel?.nativeElement
    const nodes = [...(this.overlay?.nativeElement.childNodes ?? [])].filter((n) => n !== own)
    this.hasChildren.set(
      nodes.some((n) => (n.nodeType === Node.TEXT_NODE ? !!n.textContent?.trim() : n.nodeType === Node.ELEMENT_NODE)),
    )
  }

  ngOnChanges(): void {
    const v = this.normalizedValue
    if (this.indeterminate || v < 100) {
      this.clearPulse()
      this.pulseComplete.set(false)
      this.prevValue = v
      return
    }
    const prev = this.prevValue
    this.prevValue = v
    if (prev === undefined || prev >= 100) return
    this.clearPulse()
    this.pulseComplete.set(false)
    if (typeof requestAnimationFrame !== 'undefined')
      this.raf = requestAnimationFrame(() => this.pulseComplete.set(true))
    this.timer = setTimeout(() => this.pulseComplete.set(false), 600)
  }

  private clearPulse(): void {
    if (this.raf && typeof cancelAnimationFrame !== 'undefined') cancelAnimationFrame(this.raf)
    this.raf = 0
    if (this.timer) clearTimeout(this.timer)
    this.timer = undefined
  }

  get sizePx(): number {
    if (typeof this.size === 'number') return this.size
    return sizePxMap[this.size] ?? 56
  }

  get sizeLabel(): string {
    return typeof this.size === 'string' ? this.size : 'custom'
  }

  get normalizedValue(): number {
    return Math.min(100, Math.max(0, this.value))
  }

  get isComplete(): boolean {
    return !this.indeterminate && this.normalizedValue >= 100
  }

  get radius(): number {
    return (this.sizePx - this.thickness) / 2
  }

  get circumference(): number {
    return 2 * Math.PI * this.radius
  }

  get strokeDashoffset(): number {
    if (this.indeterminate) return this.circumference * 0.25
    return this.circumference * (1 - this.normalizedValue / 100)
  }

  get resolvedColor(): string {
    return this.color || 'var(--primary)'
  }

  get resolvedTrackColor(): string {
    return this.trackColor || 'var(--muted)'
  }

  get viewBox(): string {
    return `0 0 ${this.sizePx} ${this.sizePx}`
  }

  get center(): number {
    return this.sizePx / 2
  }

  get roundedValue(): number {
    return Math.round(this.normalizedValue)
  }

  get valueClass(): string {
    const s = this.sizePx
    const font = s <= 40 ? 'text-xs' : s <= 56 ? 'text-sm' : 'text-base'
    return cn('text-foreground font-medium tabular-nums', font)
  }

  get hostClass(): string {
    return cn(circularProgressVariants({} as CircularProgressVariants), this.className)
  }

  get arcClass(): string {
    return cn(
      !this.indeterminate && 'transition-[stroke-dashoffset] duration-500 ease-out motion-reduce:transition-none',
      this.pulseComplete() && 'animate-circular-complete',
    )
  }
}

export { circularProgressVariants, type CircularProgressVariants }
