import { LitElement, css, html, isServer } from 'lit'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

const defaultFormat = (v: number) => String(Math.round(v))

/**
 * <uip-animated-number> — tweened number display.
 *
 * Counts up on mount, then smoothly retargets from the currently displayed
 * value whenever `value` changes. Server render outputs the final value so
 * hydration always matches.
 */
export class UipAnimatedNumber extends LitElement {
  static styles = [tailwind, css`:host { display: inline; }`]

  static properties = {
    value: { type: Number },
    from: { type: Number },
    duration: { type: Number },
    delay: { type: Number },
    disabled: { type: Boolean },
    format: { attribute: false },
    display: { state: true },
  }

  value = 0
  from = 0
  duration = 900
  delay = 0
  disabled = false
  format?: (value: number) => string
  private display = 0

  private mounted = false
  private frame = 0
  private timer?: number

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'animated-number')
    if (isServer) {
      this.display = this.value
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.cancel()
  }

  private cancel() {
    if (this.frame) {
      cancelAnimationFrame(this.frame)
      this.frame = 0
    }
    if (this.timer !== undefined) {
      clearTimeout(this.timer)
      this.timer = undefined
    }
  }

  protected updated(changedProps: Map<string, unknown>) {
    super.updated(changedProps)
    if (isServer) return

    if (changedProps.has('value') || changedProps.has('from') || changedProps.has('disabled')) {
      this.cancel()

      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (this.disabled || reduce) {
        this.display = this.value
        return
      }

      const firstRun = !this.mounted
      this.mounted = true
      const startValue = firstRun ? this.from : this.display
      this.display = startValue

      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

      const run = () => {
        const startTime = performance.now()
        const duration = this.duration
        const targetValue = this.value
        const step = () => {
          const t = Math.min(1, (performance.now() - startTime) / duration)
          this.display = startValue + (targetValue - startValue) * easeOutCubic(t)
          if (t < 1) {
            this.frame = requestAnimationFrame(step)
          } else {
            this.frame = 0
          }
        }
        step()
      }

      if (firstRun && this.delay > 0) {
        this.timer = window.setTimeout(run, this.delay)
      } else {
        run()
      }
    }
  }

  render() {
    const fmt = this.format ?? defaultFormat
    return html`<span part="base" data-slot="animated-number" class="tabular-nums">${fmt(this.display)}</span>`
  }
}

customElements.get('uip-animated-number') || customElements.define('uip-animated-number', UipAnimatedNumber)

declare global {
  interface HTMLElementTagNameMap {
    'uip-animated-number': UipAnimatedNumber
  }
}
