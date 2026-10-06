import { LitElement, css, html, nothing } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

// Boolean props whose React default is `true`: `attr="false"` turns them off.
const trueByDefault = { fromAttribute: (v: string | null) => v !== 'false', toAttribute: () => null }

/**
 * <uip-scroll-progress> — the registry ScrollProgress as a web component.
 *
 * Class string is React's verbatim, on the same single element (the bar
 * itself, scaled with `scaleX(progress)`). The host is `display: contents` —
 * the bar is `fixed` (viewport) or `absolute` (contained) like React's.
 *
 * `container` is the scrollable element to measure (property only — an
 * HTMLElement, like React; defaults to the window/document). `smooth`
 * lerp-eases the bar toward its target each frame (factor 0.18, settling
 * within a thousandth); under `prefers-reduced-motion` it tracks raw scroll
 * regardless of the prop, like React.
 *
 * Multiple fixed instances on one page stack into lanes — offset each with a
 * host class (e.g. `class="top-2"`), exactly like the React demo.
 */
export class UipScrollProgress extends LitElement {
  // The bar positions itself (fixed/absolute); the host adds no box.
  static styles = [tailwind, css`:host { display: contents; }`]

  static properties = {
    height: { type: Number },
    color: {},
    position: { reflect: true },
    container: { attribute: false },
    smooth: { converter: trueByDefault },
    progress: { state: true },
  }

  height = 3
  color = 'var(--primary)'
  position: 'fixed' | 'absolute' = 'fixed'
  container?: HTMLElement | null
  smooth = true
  private progress = 0

  private display = 0
  private target = 0
  private raf: number | null = null

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'scroll-progress')
    this.attach()
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.detach()
  }

  protected updated(changed: Map<string, unknown>) {
    // Swap container at runtime: re-attach listeners to the new element.
    if (changed.has('container')) {
      this.detach()
      this.attach()
    }
  }

  private get bound(): EventTarget | null {
    if (typeof window === 'undefined') return null
    return this.container ?? window
  }

  private read() {
    const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
    if (this.container) {
      const max = this.container.scrollHeight - this.container.clientHeight
      return max > 0 ? clamp01(this.container.scrollTop / max) : 0
    }
    const doc = document.documentElement
    const scrollTop = window.scrollY || doc.scrollTop || document.body.scrollTop || 0
    const max = doc.scrollHeight - doc.clientHeight
    return max > 0 ? clamp01(scrollTop / max) : 0
  }

  private stopLoop() {
    if (this.raf !== null) {
      cancelAnimationFrame(this.raf)
      this.raf = null
    }
  }

  private tick = () => {
    this.display += (this.target - this.display) * 0.18
    this.progress = this.display
    if (Math.abs(this.target - this.display) < 0.001) {
      this.display = this.target
      this.progress = this.target
      this.raf = null
      return
    }
    this.raf = requestAnimationFrame(this.tick)
  }

  private sync = () => {
    this.target = this.read()
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Read `smooth` through the field so toggling it does not re-attach
    // listeners (mirrors React's smoothRef).
    if (!this.smooth || reducedMotion) {
      this.stopLoop()
      this.display = this.target
      this.progress = this.target
      return
    }
    if (this.raf === null) this.raf = requestAnimationFrame(this.tick)
  }

  private attach() {
    const bound = this.bound
    if (!bound) return
    bound.addEventListener('scroll', this.sync, { passive: true })
    window.addEventListener('resize', this.sync)
    // Sync instantly on mount / container swap so the bar never animates up
    // from zero.
    this.target = this.read()
    this.display = this.target
    this.progress = this.target
  }

  private detach() {
    this.bound?.removeEventListener('scroll', this.sync)
    if (typeof window !== 'undefined') window.removeEventListener('resize', this.sync)
    this.stopLoop()
  }

  render() {
    return html`<div
      part="base"
      data-uipkge=""
      data-slot="scroll-progress"
      aria-hidden="true"
      data-position=${this.position}
      data-smooth=${this.smooth ? '' : nothing}
      class=${cn('pointer-events-none top-0 left-0 z-50 w-full origin-left', this.position === 'fixed' ? 'fixed' : 'absolute')}
      style=${styleMap({
        height: `${this.height}px`,
        background: this.color,
        transform: `scaleX(${this.progress})`,
        willChange: 'transform',
      })}
    ></div>`
  }
}

customElements.get('uip-scroll-progress') || customElements.define('uip-scroll-progress', UipScrollProgress)

declare global {
  interface HTMLElementTagNameMap {
    'uip-scroll-progress': UipScrollProgress
  }
}
