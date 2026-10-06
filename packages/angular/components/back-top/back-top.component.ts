import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  AfterViewInit,
  Output,
  SimpleChanges,
  TemplateRef,
  booleanAttribute,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'
import { UiRenderTemplateDirective } from '@/ui/popper/popper'
import { backTopVariants, type BackTopVariants } from './back-top.variants'

export type BackTopSize = NonNullable<BackTopVariants['size']>
export type BackTopPosition = NonNullable<BackTopVariants['position']>
type ScrollTarget = HTMLElement | Window

/**
 * Angular port of UIPKGE BackTop (React `BackTop`). A scroll-to-top <button> that mounts once
 * the target (window by default, or a selector / element) scrolls past `threshold`, animates
 * out via `data-state="closed"` for 200ms before unmounting, and smooth-scrolls the target back
 * to the top on click (instant under prefers-reduced-motion). The `ui-back-top` host is
 * `display: contents`; `class` lands on the button. React's `icon` node is a TemplateRef input.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-back-top',
  standalone: true,
  imports: [UiRenderTemplateDirective],
  host: { '[attr.class]': '"contents"' },
  template: `@if (mounted()) {
    <button
      data-uipkge=""
      data-slot="back-top"
      [attr.data-state]="dataState()"
      [attr.data-size]="size"
      [attr.data-position]="position"
      type="button"
      [attr.aria-label]="ariaLabel"
      [class]="buttonClass"
      [style.right]="edge.right"
      [style.left]="edge.left"
      [style.top]="edge.top"
      [style.bottom]="edge.bottom"
      (click)="onClick()"
    >
      @if (icon) {
        <ng-container [uiRenderTemplate]="icon" />
      } @else {
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
          class="lucide lucide-arrow-up"
          aria-hidden="true"
        >
          <path d="m5 12 7-7 7 7" />
          <path d="M12 19V5" />
        </svg>
      }
    </button>
  }`,
})
export class UiBackTopComponent implements OnChanges, AfterViewInit, OnDestroy {
  /** Visibility threshold in pixels (shows at scrollTop >= threshold). */
  @Input() threshold = 200
  /** Scroll container: CSS selector, element or window (default). */
  @Input() target?: string | HTMLElement | Window
  @Input() behavior: ScrollBehavior = 'smooth'
  @Input() size: BackTopSize = 'default'
  @Input() position: BackTopPosition = 'bottom-right'
  /** Distance from the edge (px). */
  @Input() offset = 24
  /** Absolute (section-level) instead of fixed (viewport) positioning. */
  @Input({ transform: booleanAttribute }) absolute = false
  @Input() ariaLabel = 'Scroll to top'
  /** Replaces the default ArrowUp icon (React `icon`). */
  @Input() icon?: TemplateRef<unknown>
  @Input('class') className?: string
  /** Fires whenever visibility toggles (React `onVisible`). */
  @Output() visible = new EventEmitter<boolean>()

  readonly isVisible = signal(false)
  readonly mounted = signal(false)
  readonly dataState = signal<'open' | 'closed'>('closed')
  private current: ScrollTarget | null = null
  private exitTimer?: ReturnType<typeof setTimeout>
  private ready = false
  private readonly onScroll = () => this.check()

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.ready) return
    if (changes['target']) this.attach()
    else if (changes['threshold']) this.check()
  }

  ngAfterViewInit(): void {
    this.ready = true
    this.attach()
  }

  ngOnDestroy(): void {
    this.detach()
    clearTimeout(this.exitTimer)
  }

  private resolveTarget(): ScrollTarget | null {
    if (typeof window === 'undefined') return null
    const t = this.target
    if (t === undefined || t === null) return window
    if (typeof t === 'string') return document.querySelector<HTMLElement>(t) ?? window
    return t
  }

  private attach(): void {
    this.detach()
    this.current = this.resolveTarget()
    const current = this.current
    if (!current) return
    current.addEventListener('scroll', this.onScroll, { passive: true })
    if (current !== window) window.addEventListener('scroll', this.onScroll, { passive: true })
    this.check()
  }

  private detach(): void {
    const current = this.current
    if (!current) return
    current.removeEventListener('scroll', this.onScroll)
    if (current !== window) window.removeEventListener('scroll', this.onScroll)
    this.current = null
  }

  private scrollTop(el: ScrollTarget): number {
    if (el === window) return window.scrollY ?? document.documentElement.scrollTop ?? document.body.scrollTop ?? 0
    return (el as HTMLElement).scrollTop
  }

  private check(): void {
    if (!this.current) return
    const next = this.scrollTop(this.current) >= this.threshold
    if (next === this.isVisible()) return
    this.isVisible.set(next)
    this.visible.emit(next)
    clearTimeout(this.exitTimer)
    if (next) {
      this.mounted.set(true)
      this.dataState.set('open')
    } else if (this.mounted()) {
      this.dataState.set('closed')
      this.exitTimer = setTimeout(() => this.mounted.set(false), 200)
    }
  }

  onClick(): void {
    const el = this.current
    if (!el) return
    const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    el.scrollTo({ top: 0, behavior: reduce ? 'auto' : this.behavior })
  }

  get edge(): { left: string | null; right: string | null; top: string | null; bottom: string | null } {
    const o = `${this.offset}px`
    switch (this.position) {
      case 'bottom-left':
        return { left: o, bottom: o, right: null, top: null }
      case 'top-right':
        return { right: o, top: o, left: null, bottom: null }
      case 'top-left':
        return { left: o, top: o, right: null, bottom: null }
      default:
        return { right: o, bottom: o, left: null, top: null }
    }
  }

  get buttonClass(): string {
    return cn(
      backTopVariants({ size: this.size, position: this.position }),
      this.absolute ? 'absolute' : 'fixed',
      this.className,
    )
  }
}

export { backTopVariants, type BackTopVariants }
