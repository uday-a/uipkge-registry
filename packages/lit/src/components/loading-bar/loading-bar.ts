import { LitElement, css, html, nothing } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

/**
 * <uip-loading-bar> — the registry LoadingBar as a web component.
 *
 * Class strings are React's verbatim, on the same elements (viewport-pinned
 * root, track, determinate fill / indeterminate slider, trailing spinner).
 * The host is `display: contents` — the bar positions itself `fixed`, like
 * React. React's injected keyframes (loading-bar-slide) are copied verbatim
 * into the static styles — the one allowed CSS exception for React-injected
 * keyframes.
 *
 * Drive it imperatively (`start()` / `finish()` / `fail()` / `inc()` / `set()` —
 * React's `useLoadingBar` handle, minus the hook) or bind `value` directly.
 * React's `hidden` prop is the native `hidden` attribute (the bar fades out,
 * like React's opacity-0). One rename: the boolean state prop keeps the name
 * `error`, so React's `error()` handle method is `fail()` only (React aliases
 * `error: fail` anyway).
 *
 * Events (bubble, composed): `value-change` (detail: { value } — React's
 * `onValueChange`), `input` + `change` (value on `.value`, like other
 * value-bearing elements), `finish` (detail: { value } — React's `onFinish`).
 *
 * Parts: `base` (the bar root), `fill` (determinate fill / indeterminate
 * slider), `spinner`.
 */
export class UipLoadingBar extends LitElement {
  // The bar positions itself (fixed); the host adds no box.
  static styles = [
    tailwind,
    css`:host { display: contents; }`,
    // React's injected <style>, verbatim.
    css`
      @media (prefers-reduced-motion: no-preference) {
        .loading-bar-indeterminate {
          animation: loading-bar-slide 1.2s ease-in-out infinite;
        }
      }
      @keyframes loading-bar-slide {
        0% {
          left: -33%;
        }
        100% {
          left: 100%;
        }
      }
    `,
  ]

  static properties = {
    value: { type: Number },
    color: {},
    height: { type: Number },
    indeterminate: { type: Boolean, reflect: true },
    position: { reflect: true },
    spinner: { type: Boolean, reflect: true },
    error: { type: Boolean, reflect: true },
    internal: { state: true },
    internalError: { state: true },
    fading: { state: true },
  }

  value = 0
  color = ''
  height = 3
  indeterminate = false
  position: 'top' | 'bottom' = 'top'
  spinner = false
  error = false
  private internal = 0
  /** Imperative fail() tints the bar without requiring the error prop. */
  private internalError = false
  /** After finish/fail, fade out then reset. */
  private fading = false
  private raf: number | null = null
  private hideTimer?: ReturnType<typeof setTimeout>
  /** Bumped on start/finish/fail so in-flight trickle frames abort. */
  private generation = 0

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'loading-bar')
    this.internal = this.value
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.clearTimers()
  }

  protected willUpdate(changed: Map<string, unknown>) {
    // Keep internal in sync when the controlled value prop changes.
    if (changed.has('value')) this.internal = this.value
  }

  private clearTimers() {
    if (this.raf !== null) {
      cancelAnimationFrame(this.raf)
      this.raf = null
    }
    if (this.hideTimer) {
      clearTimeout(this.hideTimer)
      this.hideTimer = undefined
    }
  }

  private emit(v: number) {
    this.internal = v
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
    this.dispatchEvent(new CustomEvent('value-change', { detail: { value: v }, bubbles: true, composed: true }))
  }

  /** Slowly creep the bar toward a soft ceiling so progress feels alive. */
  private trickle(gen: number) {
    if (this.raf !== null) cancelAnimationFrame(this.raf)
    const step = () => {
      if (gen !== this.generation) return
      if (this.internal >= 95) return
      const next = Math.min(95, this.internal + (95 - this.internal) * 0.04 + 0.15)
      this.emit(next)
      if (next < 95 && gen === this.generation) this.raf = requestAnimationFrame(step)
      else this.raf = null
    }
    this.raf = requestAnimationFrame(step)
  }

  /** Start the bar at `from` (default 20) and trickle toward 95. */
  start(from = 20) {
    this.clearTimers()
    this.generation += 1
    const gen = this.generation
    this.internalError = false
    this.fading = false
    this.emit(from)
    this.trickle(gen)
  }

  /** Nudge the bar forward by `amount` (default 10), capped at 99. */
  inc(amount = 10) {
    this.emit(Math.min(99, this.internal + amount))
  }

  /** Set the bar to an exact value. */
  set(v: number) {
    this.emit(v)
  }

  /** Complete the bar: fill to 100, hold briefly, fade out, reset. */
  finish() {
    this.clearTimers()
    this.generation += 1
    this.internalError = false
    this.emit(100)
    this.dispatchEvent(new CustomEvent('finish', { detail: { value: 100 }, bubbles: true, composed: true }))
    // Hold full bar briefly, then fade + reset so the next start() is clean.
    this.hideTimer = setTimeout(() => {
      this.fading = true
      this.hideTimer = setTimeout(() => {
        this.emit(0)
        this.fading = false
        this.hideTimer = undefined
      }, 300)
    }, 200)
  }

  /** Fail the bar: tint destructive, hold, fade out, reset. */
  fail() {
    this.clearTimers()
    this.generation += 1
    this.internalError = true
    this.emit(100)
    this.dispatchEvent(new CustomEvent('finish', { detail: { value: 100 }, bubbles: true, composed: true }))
    this.hideTimer = setTimeout(() => {
      this.fading = true
      this.hideTimer = setTimeout(() => {
        this.emit(0)
        this.internalError = false
        this.fading = false
        this.hideTimer = undefined
      }, 300)
    }, 400)
  }

  render() {
    const pct = Math.min(100, Math.max(0, this.internal))
    const isError = this.error || this.internalError
    const barColor = this.color || (isError ? 'var(--destructive)' : 'var(--primary)')
    // `hidden` is the native host attribute (no `hidden` property — it already
    // exists on HTMLElement); like React it fades the bar out.
    const visible = !this.hasAttribute('hidden') && !this.fading && (this.indeterminate || this.internal > 0)
    const spin = this.spinner
      ? html`<div
          part="spinner"
          data-slot="loading-bar-spinner"
          class="absolute top-1/2 right-0 size-3 translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-2 border-current border-t-transparent"
          style=${styleMap({ color: barColor })}
        ></div>`
      : nothing

    return html`<div
      part="base"
      data-uipkge=""
      data-slot="loading-bar"
      data-position=${this.position}
      data-state=${isError ? 'error' : this.indeterminate ? 'indeterminate' : 'determinate'}
      class=${cn(
        'pointer-events-none fixed left-0 z-[9999] w-full transition-opacity duration-300',
        this.position === 'top' ? 'top-0' : 'bottom-0',
        visible ? 'opacity-100' : 'opacity-0',
      )}
      style=${styleMap({ height: `${this.height}px` })}
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow=${this.indeterminate ? nothing : pct}
      aria-busy=${visible && !isError ? 'true' : nothing}
      aria-hidden=${!visible ? 'true' : nothing}
    >
      <div class="absolute inset-0 bg-transparent"></div>
      ${this.indeterminate
        ? html`<div
            part="fill"
            data-slot="loading-bar-indeterminate"
            class="loading-bar-indeterminate absolute inset-y-0 w-1/3"
            style=${styleMap({ backgroundColor: barColor })}
          >
            ${spin}
          </div>`
        : html`<div
            part="fill"
            data-slot="loading-bar-fill"
            class="absolute inset-y-0 left-0 transition-[width] duration-200 ease-out"
            style=${styleMap({ width: `${pct}%`, backgroundColor: barColor })}
          >
            ${spin}
          </div>`}
    </div>`
  }
}

customElements.get('uip-loading-bar') || customElements.define('uip-loading-bar', UipLoadingBar)

declare global {
  interface HTMLElementTagNameMap {
    'uip-loading-bar': UipLoadingBar
  }
}
