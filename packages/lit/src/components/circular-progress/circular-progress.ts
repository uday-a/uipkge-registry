import { LitElement, css, html, nothing } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { circularProgressVariants } from './circular-progress.variants'

export type CircularProgressSize = 'sm' | 'default' | 'lg' | number

const sizePxMap = {
  sm: 40,
  default: 56,
  lg: 80,
} as const

/**
 * <uip-circular-progress> — the registry CircularProgress as a web component.
 *
 * Class strings are React's verbatim, on the same elements (root div,
 * track/arc circles, center overlay). React's injected keyframes
 * (spin-circular, circular-progress-complete) are copied verbatim into the
 * static styles — the one allowed CSS exception for React-injected keyframes.
 *
 * `size` is sm | default | lg or a pixel number (`size="120"`). `value` is
 * clamped to 0–100; reaching 100 fires the same one-shot completion pulse as
 * React (only when the value crosses into complete, not on static mounts).
 * The default slot replaces the center label (React's `children`); `suffix`
 * defaults to `%`.
 *
 * Parts: `base` (the progressbar root), `track`, `arc`, `label`.
 */
export class UipCircularProgress extends LitElement {
  static styles = [
    tailwind,
    css`:host { display: inline-flex; }`,
    // React's injected <style>, verbatim (shadow-scoped: the classes match the
    // inner elements directly).
    css`
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
    `,
  ]

  static properties = {
    value: { type: Number },
    size: {
      converter: {
        fromAttribute: (v: string | null) => {
          if (v === null || v === '') return 'default'
          const n = Number(v)
          return Number.isNaN(n) ? v : n
        },
        toAttribute: (v: unknown) => String(v),
      },
    },
    thickness: { type: Number },
    color: {},
    trackColor: { attribute: 'track-color' },
    indeterminate: { type: Boolean, reflect: true },
    showValue: { type: Boolean, attribute: 'show-value' },
    suffix: {},
    accessibleLabel: { attribute: 'aria-label' },
    pulseComplete: { state: true },
    hasSlotted: { state: true },
  }

  value = 0
  size: CircularProgressSize = 'default'
  thickness = 8
  color?: string
  trackColor?: string
  indeterminate = false
  showValue = false
  suffix = '%'
  accessibleLabel = 'Progress'
  private pulseComplete = false
  private hasSlotted = false
  private prevValue: number | undefined = undefined
  private raf = 0
  private timer?: ReturnType<typeof setTimeout>

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'circular-progress')
    // The slot only renders when there is content to show, so detect light-DOM
    // children here too (frameworks may add them after connect).
    this.syncSlotted()
    this.childObserver = new MutationObserver(() => this.syncSlotted())
    this.childObserver.observe(this, { childList: true })
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    cancelAnimationFrame(this.raf)
    clearTimeout(this.timer)
    this.childObserver?.disconnect()
  }

  private childObserver?: MutationObserver

  private syncSlotted() {
    this.hasSlotted = [...this.childNodes].some((n) => n.nodeType === 1 || (n.textContent?.trim() ?? '') !== '')
  }

  private get sizePx() {
    if (typeof this.size === 'number') return this.size
    return sizePxMap[this.size] ?? 56
  }

  private get normalizedValue() {
    return Math.min(100, Math.max(0, this.value))
  }

  protected willUpdate(changed: Map<string, unknown>) {
    // One-shot pulse only when value crosses into complete — not on static
    // 100 mounts (mirrors React's prevValueRef effect).
    if (!changed.has('value') && !changed.has('indeterminate')) return
    const v = this.normalizedValue
    if (this.indeterminate || v < 100) {
      this.pulseComplete = false
      this.prevValue = v
      return
    }
    const prev = this.prevValue
    this.prevValue = v
    if (prev === undefined || prev >= 100) return
    this.pulseComplete = false
    cancelAnimationFrame(this.raf)
    clearTimeout(this.timer)
    this.raf = requestAnimationFrame(() => (this.pulseComplete = true))
    this.timer = setTimeout(() => (this.pulseComplete = false), 600)
  }

  render() {
    const sizePx = this.sizePx
    const thickness = this.thickness
    const normalizedValue = this.normalizedValue
    const radius = (sizePx - thickness) / 2
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = this.indeterminate ? circumference * 0.25 : circumference * (1 - normalizedValue / 100)
    const resolvedColor = this.color || 'var(--primary)'
    const resolvedTrackColor = this.trackColor || 'var(--muted)'
    const center = sizePx / 2
    const isComplete = !this.indeterminate && normalizedValue >= 100
    const fontSize = sizePx <= 40 ? 'text-xs' : sizePx <= 56 ? 'text-sm' : 'text-base'

    return html`<div
      part="base"
      data-uipkge=""
      data-slot="circular-progress"
      data-size=${typeof this.size === 'string' ? this.size : 'custom'}
      data-indeterminate=${this.indeterminate ? 'true' : 'false'}
      data-complete=${isComplete ? 'true' : 'false'}
      class=${circularProgressVariants()}
      style=${styleMap({ width: `${sizePx}px`, height: `${sizePx}px` })}
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow=${this.indeterminate ? nothing : normalizedValue}
      aria-busy=${this.indeterminate ? 'true' : nothing}
      aria-label=${this.accessibleLabel}
    >
      <svg width=${sizePx} height=${sizePx} viewBox=${`0 0 ${sizePx} ${sizePx}`} class="block">
        <circle
          part="track"
          cx=${center}
          cy=${center}
          r=${radius}
          fill="none"
          stroke=${resolvedTrackColor}
          stroke-width=${thickness}
        ></circle>
        <g
          transform=${this.indeterminate ? nothing : `rotate(-90 ${center} ${center})`}
          class=${this.indeterminate ? 'animate-spin-circular' : ''}
          style=${this.indeterminate ? styleMap({ transformBox: 'fill-box', transformOrigin: 'center' }) : nothing}
        >
          <circle
            part="arc"
            cx=${center}
            cy=${center}
            r=${radius}
            fill="none"
            stroke=${resolvedColor}
            stroke-width=${thickness}
            stroke-linecap="round"
            stroke-dasharray=${circumference}
            stroke-dashoffset=${strokeDashoffset}
            class=${cn(
              !this.indeterminate && 'transition-[stroke-dashoffset] duration-500 ease-out motion-reduce:transition-none',
              this.pulseComplete && 'animate-circular-complete',
            )}
          ></circle>
        </g>
      </svg>
      ${this.showValue || this.hasSlotted
        ? html`<div class="absolute inset-0 flex items-center justify-center">
            <slot>
              <span part="label" class=${cn('text-foreground font-medium tabular-nums', fontSize)}>
                ${Math.round(normalizedValue)}${this.suffix}
              </span>
            </slot>
          </div>`
        : nothing}
    </div>`
  }
}

customElements.get('uip-circular-progress') || customElements.define('uip-circular-progress', UipCircularProgress)

declare global {
  interface HTMLElementTagNameMap {
    'uip-circular-progress': UipCircularProgress
  }
}
