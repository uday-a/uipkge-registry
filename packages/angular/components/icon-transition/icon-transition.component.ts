import {
  Component,
  Directive,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  TemplateRef,
  ViewContainerRef,
  ViewEncapsulation,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { UiRenderTemplateDirective } from '@/ui/popper/popper'
import { cn } from '@/lib/utils'

// Copied verbatim from the React icon-transition (injected there into <head>). Unscoped
// (ViewEncapsulation.None) so it reaches the slots and the consumer's icons.
const STYLES = `
.icon-transition .icon-transition-slot {
  grid-area: 1 / 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.icon-transition .icon-transition-enter-active,
.icon-transition .icon-transition-leave-active {
  transform-origin: center;
}
.icon-transition .icon-transition-enter-active {
  animation: icon-transition-pop var(--it-duration, 240ms) cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
.icon-transition .icon-transition-leave-active {
  animation: icon-transition-fade calc(var(--it-duration, 240ms) * 0.66) ease-in both;
}
@keyframes icon-transition-pop {
  0% {
    opacity: 0;
    transform: scale(0.5) rotate(-12deg);
  }
  60% {
    opacity: 1;
    transform: scale(1.18) rotate(2deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}
@keyframes icon-transition-fade {
  to {
    opacity: 0;
    transform: scale(0.85);
  }
}
@media (prefers-reduced-motion: reduce) {
  .icon-transition .icon-transition-enter-active,
  .icon-transition .icon-transition-leave-active {
    animation-duration: 0ms !important;
  }
}
`

/**
 * Stamps an icon template and styles its root element(s) the way React styles the icon
 * component it receives (`className={iconClass}` + aria-hidden), so consumers pass a bare svg.
 */
@Directive({ selector: '[uiIconTransitionIcon]', standalone: true })
export class UiIconTransitionIconDirective implements OnChanges, OnDestroy {
  @Input('uiIconTransitionIcon') template: TemplateRef<unknown> | null | undefined = null
  @Input() iconClass?: string
  private readonly vcr = inject(ViewContainerRef)

  ngOnChanges(): void {
    this.vcr.clear()
    if (!this.template) return
    const view = this.vcr.createEmbeddedView(this.template)
    view.detectChanges()
    for (const node of view.rootNodes) {
      if (!(node instanceof Element)) continue
      node.setAttribute('class', cn(node.getAttribute('class') ?? '', this.iconClass))
      node.setAttribute('aria-hidden', 'true')
    }
  }

  ngOnDestroy(): void {
    this.vcr.clear()
  }
}

/**
 * Self-contained icon-swap control (React `IconTransition`). Click runs an optional async
 * `action`, then flips from `defaultIcon` to `activeIcon` with a spring pop (the outgoing icon
 * fades out underneath). Auto-reverts after `resetAfter` ms; `resetAfter=0` keeps it active
 * until `reset()` is called. Pass `active` to drive it externally. Icons are templates:
 * `<ng-template #copy><svg …/></ng-template>` + `[defaultIcon]="copy"`.
 *
 * Renders a real `<button type="button">` (or a passive `<span>` with `as="span"`); the
 * `<ui-icon-transition>` host itself is `display: contents`.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-icon-transition',
  standalone: true,
  exportAs: 'uiIconTransition',
  encapsulation: ViewEncapsulation.None,
  styles: [STYLES],
  imports: [UiRenderTemplateDirective, UiIconTransitionIconDirective],
  host: { class: 'contents' },
  template: `
    <ng-template #slots>
      @if (leaving() !== null && leaving() !== isActive) {
        <span class="icon-transition-slot icon-transition-leave-active">
          <ng-container [uiIconTransitionIcon]="leaving() ? activeIcon : defaultIcon" [iconClass]="iconClass" />
        </span>
      }
      @if (isActive) {
        <span class="icon-transition-slot icon-transition-enter-active">
          <ng-container [uiIconTransitionIcon]="activeIcon" [iconClass]="iconClass" />
        </span>
      } @else {
        <span class="icon-transition-slot icon-transition-enter-active">
          <ng-container [uiIconTransitionIcon]="defaultIcon" [iconClass]="iconClass" />
        </span>
      }
    </ng-template>
    @if (tag === 'button') {
      <button
        data-uipkge=""
        data-slot="icon-transition"
        type="button"
        [attr.aria-label]="ariaLabel"
        [attr.aria-live]="isActive ? 'polite' : null"
        [class]="rootClass"
        [style.--it-duration]="duration + 'ms'"
        (click)="trigger()"
      >
        <ng-container [uiRenderTemplate]="slots" />
      </button>
    } @else {
      <span
        data-uipkge=""
        data-slot="icon-transition"
        [attr.aria-label]="ariaLabel"
        [attr.aria-live]="isActive ? 'polite' : null"
        [class]="rootClass"
        [style.--it-duration]="duration + 'ms'"
      >
        <ng-container [uiRenderTemplate]="slots" />
      </span>
    }
  `,
})
export class UiIconTransitionComponent implements OnChanges, OnDestroy {
  @Input() defaultIcon?: TemplateRef<unknown> | null
  @Input() activeIcon?: TemplateRef<unknown> | null
  /** Tailwind size/color applied to the icons. */
  @Input() iconClass = 'size-4'
  /** Async work executed on click before the icon flips. Return `false` to skip the flip. */
  @Input() action?: () => boolean | void | Promise<boolean | void>
  /** ms before reverting to defaultIcon. Set to `0` (or null) to stay active. */
  @Input() resetAfter: number | null = 1500
  /** Pop animation duration in ms (also scales the leave fade). */
  @Input() duration = 240
  /** aria-label shown in default state. */
  @Input() label?: string
  /** aria-label shown after activation; falls back to `label`. */
  @Input() activeLabel?: string
  /** Tailwind class applied while active (e.g. "text-success"). */
  @Input() activeClass = 'text-success'
  /** Render element. `button` adds click handler + focus styling; `span` is purely visual. */
  @Input('as') tag: 'button' | 'span' = 'button'
  /** External control. When provided, this input wins over internal state. */
  @Input() active?: boolean
  @Input('class') className?: string

  @Output() activate = new EventEmitter<void>()
  /** React `onReset`. (The class member `reset()` is the imperative handle.) */
  @Output('reset') resetEvent = new EventEmitter<void>()

  // Signals: flipped from timers and awaited actions, outside any template event.
  private readonly internalActive = signal(false)
  /** The outgoing icon's state while its leave animation runs (React `prevActive`). */
  readonly leaving = signal<boolean | null>(null)
  private readonly activeInput = signal<boolean | undefined>(undefined)
  private lastActive = false
  private initialized = false
  private resetTimer?: ReturnType<typeof setTimeout>
  private leaveTimer?: ReturnType<typeof setTimeout>

  get isActive(): boolean {
    const external = this.activeInput()
    return external !== undefined ? external : this.internalActive()
  }

  get ariaLabel(): string | null {
    return (this.isActive ? (this.activeLabel ?? this.label) : this.label) ?? null
  }

  get rootClass(): string {
    return [
      'icon-transition focus-visible:ring-ring inline-grid place-items-center transition-colors focus-visible:ring-2 focus-visible:outline-none',
      this.isActive ? this.activeClass : '',
      this.className ?? '',
    ]
      .filter(Boolean)
      .join(' ')
  }

  ngOnChanges(): void {
    this.activeInput.set(this.active)
    if (this.initialized) this.syncLeaving()
    else this.lastActive = this.isActive
    this.initialized = true
  }

  ngOnDestroy(): void {
    this.clearTimer()
    clearTimeout(this.leaveTimer)
  }

  async trigger(): Promise<void> {
    if (this.action) {
      const result = await this.action()
      if (result === false) return
    }
    this.internalActive.set(true)
    this.syncLeaving()
    this.activate.emit()
    this.clearTimer()
    if (this.resetAfter && this.resetAfter > 0) this.resetTimer = setTimeout(() => this.reset(), this.resetAfter)
  }

  reset(): void {
    this.internalActive.set(false)
    this.syncLeaving()
    this.resetEvent.emit()
    this.clearTimer()
  }

  /** Keep the outgoing icon mounted for `duration` ms after a flip, for the cross-fade. */
  private syncLeaving(): void {
    const current = this.isActive
    if (current === this.lastActive) return
    this.leaving.set(this.lastActive)
    this.lastActive = current
    clearTimeout(this.leaveTimer)
    this.leaveTimer = setTimeout(() => this.leaving.set(null), this.duration)
  }

  private clearTimer(): void {
    if (this.resetTimer) clearTimeout(this.resetTimer)
    this.resetTimer = undefined
  }
}
