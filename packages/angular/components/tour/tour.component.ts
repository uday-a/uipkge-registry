import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  booleanAttribute,
  computed,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'
import { UiButtonComponent } from '@/ui/button/button.component'
import { BodyPortal, uniqueId } from '@/ui/popper/popper'

export type TourTarget = string | (() => HTMLElement | null) | HTMLElement | null

export interface TargetRect {
  x: number
  y: number
  width: number
  height: number
}

export interface TourStep {
  target?: TourTarget
  title: string
  description?: string
  cover?: string
  mask?: boolean
  nextButtonText?: string
  prevButtonText?: string
  finishButtonText?: string
}

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function resolveTarget(t: TourTarget | undefined): HTMLElement | null {
  if (!t) return null
  if (typeof t === 'string') return document.querySelector(t) as HTMLElement | null
  if (typeof t === 'function') return t()
  return t
}

/**
 * Angular port of UIPKGE Tour (React parity). While `open`, renders into <body> a dimming
 * SVG mask with a rounded cutout over the current step's target (plus a click-blocking
 * layer whose clip-path leaves the target clickable) and a 320px step card placed below
 * the target (above when there's no room, centered when the step has no target). The
 * card is an aria-modal dialog: focus moves into it, Tab cycles inside, Escape or the X
 * skips, and focus returns to where it was when the tour closes. The target rect tracks
 * scroll / resize. `current` mirrors into the step index; `openChange`, `currentChange`,
 * `change`, `finish` and `close` mirror React's callbacks.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-tour, [ui-tour]',
  standalone: true,
  imports: [UiButtonComponent],
  // Renders nothing in place (React portals everything to <body>).
  host: { '[attr.hidden]': '""' },
  template: `
    <ng-template #tpl>
      @if (currentStep(); as step) {
        @if (showMask()) {
          <svg
            class="pointer-events-none fixed inset-0"
            [style.z-index]="zIndex"
            width="100%"
            height="100%"
            aria-hidden="true"
          >
            <defs>
              <mask [attr.id]="maskId">
                <rect width="100%" height="100%" fill="white" />
                @if (cutout(); as c) {
                  <rect [attr.x]="c.x" [attr.y]="c.y" [attr.width]="c.w" [attr.height]="c.h" rx="6" fill="black" />
                }
              </mask>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="rgba(0, 0, 0, 0.5)"
              [attr.mask]="'url(#' + maskId + ')'"
              [style.transition]="reduceMotion ? null : 'all 200ms ease'"
            />
          </svg>
          <div
            class="fixed inset-0 bg-transparent"
            aria-hidden="true"
            [style.z-index]="zIndex"
            [style.clip-path]="hitClipPath()"
          ></div>
        }
        <div
          data-slot="tour-card"
          role="dialog"
          aria-modal="true"
          [attr.aria-labelledby]="titleId"
          [attr.aria-describedby]="step.description ? descriptionId : null"
          tabindex="-1"
          [class]="cardClass"
          [style]="cardStyle()"
          (keydown)="onCardKeydown($event)"
        >
          <button
            type="button"
            class="hover:bg-foreground/10 focus-visible:ring-ring absolute top-2 right-2 inline-flex size-6 items-center justify-center rounded focus-visible:ring-2 focus-visible:outline-none"
            aria-label="Close tour"
            (click)="skip()"
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
              class="lucide lucide-x size-4"
              aria-hidden="true"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
          @if (step.cover) {
            <img [src]="step.cover" alt="" class="w-full rounded-md" />
          }
          <div>
            <div [id]="titleId" class="pr-6 font-semibold">{{ step.title }}</div>
            @if (step.description) {
              <div [id]="descriptionId" class="mt-1 text-sm opacity-90">{{ step.description }}</div>
            }
          </div>
          <div class="flex items-center justify-between gap-2 pt-2">
            <div class="text-xs tabular-nums opacity-70" aria-live="polite" aria-atomic="true">
              {{ stepIndex() + 1 }} / {{ steps.length }}
            </div>
            <div class="flex gap-2">
              @if (stepIndex() !== 0) {
                <button ui-button size="sm" [variant]="type === 'primary' ? 'secondary' : 'outline'" (click)="prev()">
                  {{ step.prevButtonText ?? 'Previous' }}
                </button>
              }
              @if (stepIndex() !== steps.length - 1) {
                <button ui-button size="sm" [variant]="type === 'primary' ? 'secondary' : 'default'" (click)="next()">
                  {{ step.nextButtonText ?? 'Next' }}
                </button>
              } @else {
                <button
                  ui-button
                  size="sm"
                  [variant]="type === 'primary' ? 'secondary' : 'default'"
                  (click)="finishTour()"
                >
                  {{ step.finishButtonText ?? 'Finish' }}
                </button>
              }
            </div>
          </div>
        </div>
      }
    </ng-template>
  `,
})
export class UiTourComponent implements OnChanges, OnDestroy {
  @Input({ transform: booleanAttribute }) open = false
  @Input() current = 0
  @Input() steps: TourStep[] = []
  @Input({ transform: booleanAttribute }) mask = true
  @Input() type: 'default' | 'primary' = 'default'
  @Input() zIndex = 1000
  /** Controlled open updates (React `onOpenChange`). */
  @Output() openChange = new EventEmitter<boolean>()
  /** Controlled current-step updates (React `onCurrentChange`). */
  @Output() currentChange = new EventEmitter<number>()
  /** Fired whenever the active step changes (React `onChange`). */
  @Output() change = new EventEmitter<number>()
  /** Fired when the user presses Finish on the last step. */
  @Output() finish = new EventEmitter<void>()
  /** Fired when the user dismisses the tour (close button / Escape). */
  @Output() close = new EventEmitter<void>()

  @ViewChild('tpl', { static: true }) tpl!: TemplateRef<unknown>

  readonly maskId = uniqueId('uipkge-tour-mask')
  readonly titleId = uniqueId('tour-title')
  readonly descriptionId = uniqueId('tour-description')
  readonly reduceMotion = prefersReducedMotion()

  readonly stepIndex = signal(0)
  readonly rect = signal<TargetRect | null>(null)
  readonly measuredHeight = signal(0)
  private readonly stepsSig = signal<TourStep[]>([])
  private readonly maskSig = signal(true)
  private readonly zIndexSig = signal(1000)

  readonly currentStep = computed(() => this.stepsSig()[this.stepIndex()] ?? null)
  readonly showMask = computed(() => {
    const step = this.currentStep()
    return step?.mask !== undefined ? step.mask : this.maskSig()
  })
  readonly cutout = computed(() => {
    const r = this.rect()
    const padding = 4
    return r ? { x: r.x - padding, y: r.y - padding, w: r.width + padding * 2, h: r.height + padding * 2 } : null
  })
  /** Clip-path leaves a hole over the target so pointer events reach it (the SVG mask doesn't). */
  readonly hitClipPath = computed(() => {
    const c = this.cutout()
    return c
      ? `polygon(evenodd, 0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, ${c.x}px ${c.y}px, ${c.x}px ${c.y + c.h}px, ${c.x + c.w}px ${c.y + c.h}px, ${c.x + c.w}px ${c.y}px, ${c.x}px ${c.y}px)`
      : null
  })
  readonly cardStyle = computed<Record<string, string | number>>(() => {
    const cardWidth = 320
    const margin = 12
    const edgePadding = 8
    const zIndex = this.zIndexSig() + 1
    const rect = this.rect()
    // Prefer measured height; estimate only before first layout (cover makes card taller).
    const cardHeight = this.measuredHeight() || (this.currentStep()?.cover ? 320 : 200)
    if (!rect) {
      const style: Record<string, string | number> = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: `${cardWidth}px`,
        'z-index': zIndex,
      }
      return style
    }
    const viewportH = window.innerHeight
    const viewportW = window.innerWidth
    const placeBelow = rect.y + rect.height + margin + cardHeight < viewportH
    const top = placeBelow ? rect.y + rect.height + margin : Math.max(edgePadding, rect.y - margin - cardHeight)
    let left = rect.x
    if (left + cardWidth > viewportW - edgePadding) left = viewportW - cardWidth - edgePadding
    if (left < edgePadding) left = edgePadding
    const style: Record<string, string | number> = {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      width: `${cardWidth}px`,
      'z-index': zIndex,
    }
    return style
  })

  private readonly portal = new BodyPortal(inject(ViewContainerRef))
  private previousFocus: HTMLElement | null = null
  private wasOpen = false
  private targetEl: HTMLElement | null = null
  private targetObserver: ResizeObserver | null = null
  private cardObserver: ResizeObserver | null = null
  private raf = 0
  private settleTimer: ReturnType<typeof setTimeout> | null = null
  private readonly measure = () => {
    cancelAnimationFrame(this.raf)
    this.raf = requestAnimationFrame(() => {
      if (!this.targetEl) return this.rect.set(null)
      const r = this.targetEl.getBoundingClientRect()
      this.rect.set({ x: r.left, y: r.top, width: r.width, height: r.height })
    })
  }
  private readonly onDocKeydown = (e: KeyboardEvent) => {
    if (e.key !== 'Escape') return
    e.preventDefault()
    this.skip()
  }

  get cardClass(): string {
    return cn(
      'relative space-y-3 rounded-lg border p-4 shadow-lg outline-none',
      this.type === 'primary'
        ? 'bg-primary text-primary-foreground border-primary'
        : 'bg-popover text-popover-foreground',
    )
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.stepsSig.set(this.steps)
    this.maskSig.set(this.mask)
    this.zIndexSig.set(this.zIndex)
    // Mirror the `current` input into local state (Vue `watch(() => props.current)`).
    if (changes['current']) this.stepIndex.set(this.current)
    if (changes['open'] || changes['current'] || changes['steps']) this.sync()
  }

  /** Attach + scroll the target into view on open / step change; tear down + restore focus on close. */
  private sync(): void {
    this.clearSettle()
    if (!this.open || !this.currentStep()) {
      this.detachTarget()
      this.teardownPortal()
      if (!this.open && this.wasOpen) {
        this.previousFocus?.focus?.()
        this.previousFocus = null
        this.wasOpen = false
      }
      return
    }
    if (!this.wasOpen) {
      this.previousFocus = (document.activeElement as HTMLElement | null) ?? null
      this.wasOpen = true
    }
    this.attachTarget()
    if (!this.portal.attached) {
      const host = this.portal.attach(this.tpl)
      document.addEventListener('keydown', this.onDocKeydown)
      const card = host.querySelector<HTMLElement>('[data-slot="tour-card"]')
      if (card && typeof ResizeObserver !== 'undefined') {
        this.cardObserver = new ResizeObserver(() => this.measuredHeight.set(card.getBoundingClientRect().height))
        this.cardObserver.observe(card)
      }
    }
    // Move focus into the card on open and on every step change.
    queueMicrotask(() => this.cardEl()?.focus())
    const el = this.targetEl
    if (el) {
      const reduce = prefersReducedMotion()
      el.scrollIntoView?.({ behavior: reduce ? 'auto' : 'smooth', block: 'center' })
      // Re-measure after smooth scroll settles.
      this.settleTimer = setTimeout(this.measure, reduce ? 0 : 320)
    }
  }

  private cardEl(): HTMLElement | null {
    return document.querySelector<HTMLElement>(`[aria-labelledby="${this.titleId}"]`)
  }

  private attachTarget(): void {
    this.detachTarget()
    this.targetEl = resolveTarget(this.currentStep()?.target)
    if (!this.targetEl) {
      this.rect.set(null)
      return
    }
    this.measure()
    if (typeof ResizeObserver !== 'undefined') {
      this.targetObserver = new ResizeObserver(this.measure)
      this.targetObserver.observe(this.targetEl)
      this.targetObserver.observe(document.documentElement)
    }
    window.addEventListener('scroll', this.measure, { passive: true, capture: true })
    window.addEventListener('resize', this.measure, { passive: true })
  }

  private detachTarget(): void {
    this.targetObserver?.disconnect()
    this.targetObserver = null
    window.removeEventListener('scroll', this.measure, true)
    window.removeEventListener('resize', this.measure)
    cancelAnimationFrame(this.raf)
    this.targetEl = null
  }

  private teardownPortal(): void {
    if (!this.portal.attached) return
    document.removeEventListener('keydown', this.onDocKeydown)
    this.cardObserver?.disconnect()
    this.cardObserver = null
    this.measuredHeight.set(0)
    this.portal.detach()
  }

  private clearSettle(): void {
    if (this.settleTimer) clearTimeout(this.settleTimer)
    this.settleTimer = null
  }

  private setStep(i: number): void {
    this.stepIndex.set(i)
    this.currentChange.emit(i)
    this.change.emit(i)
    this.sync()
  }

  next(): void {
    if (this.stepIndex() < this.steps.length - 1) this.setStep(this.stepIndex() + 1)
  }

  prev(): void {
    if (this.stepIndex() > 0) this.setStep(this.stepIndex() - 1)
  }

  finishTour(): void {
    this.finish.emit()
    this.openChange.emit(false)
  }

  skip(): void {
    this.close.emit()
    this.openChange.emit(false)
  }

  /** Keep Tab cycling inside the dialog while aria-modal is asserted. */
  onCardKeydown(e: KeyboardEvent): void {
    const card = e.currentTarget as HTMLElement
    if (e.key !== 'Tab') return
    // getClientRects over offsetParent: fixed-position descendants report a null offsetParent.
    const list = Array.from(card.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.getClientRects().length > 0,
    )
    if (list.length === 0) return
    const first = list[0]
    const last = list[list.length - 1]
    if (e.shiftKey) {
      if (document.activeElement === first || document.activeElement === card) {
        e.preventDefault()
        last.focus()
      }
    } else if (document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  ngOnDestroy(): void {
    this.clearSettle()
    this.detachTarget()
    this.teardownPortal()
  }
}
