import { LitElement, css, html, isServer, nothing, svg } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { X } from 'lucide'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { icon } from '../../lib/icon'
import { buttonVariants } from '../button/button.variants'

export interface TourStep {
  target?: string | HTMLElement | null
  title: string
  description?: string
  cover?: string
  mask?: boolean
  nextButtonText?: string
  prevButtonText?: string
  finishButtonText?: string
  /** Optional link button shown in the card, e.g. { label: 'Star on GitHub', href }. */
  action?: { label: string; href: string }
}

export interface TargetRect {
  x: number
  y: number
  width: number
  height: number
}

let tourMaskUid = 0
const trueByDefault = { fromAttribute: (v: string | null) => v !== 'false', toAttribute: () => null }

/**
 * <uip-tour> — Guided product tour overlay with spotlight cutout and anchored step cards.
 *
 * Each step's target is scrolled into view (instantly under reduced motion)
 * before it is measured; scroll/resize re-measure as it moves. The card sits
 * below the target (above when there's no room); targets hugging the left
 * edge (sidebar items) get it beside them instead. `step.action`
 * ({ label, href }) renders an outline link button in the card. The mask dims
 * 50% in light and 75% in dark, with a primary ring around the spotlight.
 */
export class UipTour extends LitElement {
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    open: { type: Boolean, reflect: true },
    current: { type: Number, reflect: true },
    steps: { type: Array },
    mask: { converter: trueByDefault },
    type: { type: String },
    zIndex: { type: Number, attribute: 'z-index' },
    targetRect: { state: true },
  }

  open = false
  current = 0
  steps: TourStep[] = []
  mask = true
  type: 'default' | 'primary' = 'default'
  zIndex = 1000

  private targetRect: TargetRect | null = null
  private maskId = `uip-tour-mask-${++tourMaskUid}`
  private targetEl: HTMLElement | null = null
  private ro?: ResizeObserver
  private scrollHandler?: () => void

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'tour')
    this.scrollHandler = () => this.measure()
    window.addEventListener('scroll', this.scrollHandler, { passive: true, capture: true })
    window.addEventListener('resize', this.scrollHandler, { passive: true })
    window.addEventListener('keydown', this.onKeyDown.bind(this))
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler, true)
      window.removeEventListener('resize', this.scrollHandler)
    }
    this.ro?.disconnect()
  }

  protected updated(changed: Map<string, unknown>) {
    if (isServer) return
    if (changed.has('open') || changed.has('current') || changed.has('steps')) {
      if (this.open) {
        this.attachTarget()
      } else {
        this.targetRect = null
      }
    }
  }

  private onKeyDown(e: KeyboardEvent) {
    if (!this.open) return
    if (e.key === 'Escape') {
      e.preventDefault()
      this.close()
    }
  }

  private attachTarget() {
    this.ro?.disconnect()
    const step = this.steps[this.current]
    if (!step || !step.target) {
      this.targetEl = null
      this.targetRect = null
      return
    }

    let el: HTMLElement | null = null
    if (typeof step.target === 'string') {
      el = document.querySelector(step.target) as HTMLElement | null
    } else if (step.target instanceof HTMLElement) {
      el = step.target
    }

    this.targetEl = el
    if (el) {
      const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' })
      this.measure()
      if (typeof ResizeObserver !== 'undefined') {
        this.ro = new ResizeObserver(() => this.measure())
        this.ro.observe(el)
      }
    } else {
      this.targetRect = null
    }
  }

  private measure() {
    if (!this.targetEl) {
      this.targetRect = null
      return
    }
    const r = this.targetEl.getBoundingClientRect()
    this.targetRect = { x: r.left, y: r.top, width: r.width, height: r.height }
  }

  next() {
    if (this.current < this.steps.length - 1) {
      this.current++
      this.dispatchEvent(new CustomEvent('current-change', { detail: { current: this.current }, bubbles: true, composed: true }))
    }
  }

  prev() {
    if (this.current > 0) {
      this.current--
      this.dispatchEvent(new CustomEvent('current-change', { detail: { current: this.current }, bubbles: true, composed: true }))
    }
  }

  finish() {
    this.open = false
    this.dispatchEvent(new CustomEvent('finish', { detail: { current: this.current }, bubbles: true, composed: true }))
    this.dispatchEvent(new CustomEvent('open-change', { detail: { open: false }, bubbles: true, composed: true }))
  }

  close() {
    this.open = false
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }))
    this.dispatchEvent(new CustomEvent('open-change', { detail: { open: false }, bubbles: true, composed: true }))
  }

  render() {
    if (!this.open || this.steps.length === 0) return nothing
    const step = this.steps[this.current]
    if (!step) return nothing

    const showMask = step.mask !== undefined ? step.mask : this.mask
    const rect = this.targetRect
    const padding = 4
    const radius = 6

    const cutout = rect
      ? {
          x: rect.x - padding,
          y: rect.y - padding,
          w: rect.width + padding * 2,
          h: rect.height + padding * 2,
        }
      : null

    const hitClipPath = cutout
      ? `polygon(evenodd, 0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, ${cutout.x}px ${cutout.y}px, ${cutout.x}px ${cutout.y + cutout.h}px, ${cutout.x + cutout.w}px ${cutout.y + cutout.h}px, ${cutout.x + cutout.w}px ${cutout.y}px, ${cutout.x}px ${cutout.y}px)`
      : undefined

    const cardWidth = 320
    const margin = 12
    const edgePadding = 8
    const cardHeight = step.cover ? 320 : 200

    let cardTop = 0
    let cardLeft = 0
    let cardTransform = ''

    if (!rect) {
      cardTop = 50
      cardLeft = 50
      cardTransform = 'translate(-50%, -50%)'
    } else {
      const vh = typeof window !== 'undefined' ? window.innerHeight : 768
      const vw = typeof window !== 'undefined' ? window.innerWidth : 1024
      const clampTop = (v: number) => Math.min(Math.max(edgePadding, v), vh - cardHeight - edgePadding)
      // Targets hugging the left edge (sidebar items) get the card beside them,
      // so it doesn't cover the neighbouring items.
      const right = rect.x + rect.width
      const placeRight = right < vw * 0.35 && right + margin + cardWidth <= vw - edgePadding
      if (placeRight) {
        cardTop = clampTop(rect.y + rect.height / 2 - cardHeight / 2)
        cardLeft = right + margin
      } else {
        const placeBelow = rect.y + rect.height + margin + cardHeight < vh
        cardTop = clampTop(placeBelow ? rect.y + rect.height + margin : rect.y - margin - cardHeight)
        cardLeft = rect.x
        if (cardLeft + cardWidth > vw - edgePadding) {
          cardLeft = vw - cardWidth - edgePadding
        }
        if (cardLeft < edgePadding) cardLeft = edgePadding
      }
    }

    const cardStyle = {
      position: 'fixed',
      top: rect ? `${cardTop}px` : `${cardTop}%`,
      left: rect ? `${cardLeft}px` : `${cardLeft}%`,
      width: `${cardWidth}px`,
      transform: cardTransform || undefined,
      zIndex: String(this.zIndex + 1),
    }

    const isFirst = this.current === 0
    const isLast = this.current === this.steps.length - 1

    return html`
      <!-- Mask -->
      ${showMask
        ? html`
            <svg
              class="pointer-events-none fixed inset-0"
              style=${styleMap({ zIndex: String(this.zIndex) })}
              width="100%"
              height="100%"
              aria-hidden="true"
            >
              <defs>
                <mask id=${this.maskId}>
                  <rect width="100%" height="100%" fill="white" />
                  <!-- Nested SVG children need the svg tag: an html-tagged <rect> is an HTML element and never paints. -->
                  ${cutout
                    ? svg`<rect
                        x=${cutout.x}
                        y=${cutout.y}
                        width=${cutout.w}
                        height=${cutout.h}
                        rx=${radius}
                        fill="black"
                      />`
                    : nothing}
                </mask>
              </defs>
              <!-- 50% black barely changes an already-dark UI, so dark dims 75%. -->
              <rect
                width="100%"
                height="100%"
                class="fill-black/50 dark:fill-black/75"
                mask=${`url(#${this.maskId})`}
                style="transition: all 200ms ease;"
              />
              <!-- Ring around the spotlight so the focus reads in both themes. -->
              ${cutout
                ? svg`<rect
                    x=${cutout.x}
                    y=${cutout.y}
                    width=${cutout.w}
                    height=${cutout.h}
                    rx=${radius}
                    class="stroke-primary/70 fill-none transition-all duration-200 motion-reduce:transition-none"
                    stroke-width="2"
                  />`
                : nothing}
            </svg>
            <div
              class="fixed inset-0"
              aria-hidden="true"
              style=${styleMap({
                zIndex: String(this.zIndex),
                clipPath: hitClipPath,
                background: 'transparent',
              })}
            ></div>
          `
        : nothing}

      <!-- Card -->
      <div
        part="card"
        data-slot="tour-card"
        role="dialog"
        aria-modal="true"
        tabindex="-1"
        class=${cn(
          'relative space-y-3 rounded-lg border p-4 shadow-lg outline-none',
          this.type === 'primary'
            ? 'bg-primary text-primary-foreground border-primary'
            : 'bg-popover text-popover-foreground',
        )}
        style=${styleMap(cardStyle)}
      >
        <button
          type="button"
          class="hover:bg-foreground/10 focus-visible:ring-ring absolute top-2 right-2 inline-flex size-6 items-center justify-center rounded focus-visible:ring-2 focus-visible:outline-none"
          aria-label="Close tour"
          @click=${() => this.close()}
        >
          ${icon(X, 'x', 'size-4')}
        </button>

        ${step.cover ? html`<img src=${step.cover} alt="" class="w-full rounded-md" />` : nothing}

        <div>
          <div class="pr-6 font-semibold">${step.title}</div>
          ${step.description
            ? html`<div class="mt-1 text-sm opacity-90">${step.description}</div>`
            : nothing}
          ${step.action
            ? html`<a
                href=${step.action.href}
                target="_blank"
                rel="noopener noreferrer"
                data-slot="tour-action"
                class=${cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'text-foreground mt-3 w-full')}
                >${step.action.label}</a
              >`
            : nothing}
        </div>

        <div class="flex items-center justify-between gap-2 pt-2">
          <div class="text-xs tabular-nums opacity-70" aria-live="polite">
            ${this.current + 1} / ${this.steps.length}
          </div>
          <div class="flex gap-2">
            ${!isFirst
              ? html`
                  <button
                    type="button"
                    class=${cn(
                      'inline-flex h-8 items-center justify-center rounded-md px-3 text-xs font-medium transition-colors',
                      this.type === 'primary'
                        ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
                    )}
                    @click=${() => this.prev()}
                  >
                    ${step.prevButtonText || 'Previous'}
                  </button>
                `
              : nothing}
            ${!isLast
              ? html`
                  <button
                    type="button"
                    class=${cn(
                      'inline-flex h-8 items-center justify-center rounded-md px-3 text-xs font-medium transition-colors',
                      this.type === 'primary'
                        ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90',
                    )}
                    @click=${() => this.next()}
                  >
                    ${step.nextButtonText || 'Next'}
                  </button>
                `
              : html`
                  <button
                    type="button"
                    class=${cn(
                      'inline-flex h-8 items-center justify-center rounded-md px-3 text-xs font-medium transition-colors',
                      this.type === 'primary'
                        ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90',
                    )}
                    @click=${() => this.finish()}
                  >
                    ${step.finishButtonText || 'Finish'}
                  </button>
                `}
          </div>
        </div>
      </div>
    `
  }
}

customElements.get('uip-tour') || customElements.define('uip-tour', UipTour)

declare global {
  interface HTMLElementTagNameMap {
    'uip-tour': UipTour
  }
}
