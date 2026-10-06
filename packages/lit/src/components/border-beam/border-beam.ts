import { LitElement, css, html, isServer } from 'lit'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

if (!isServer && typeof CSS !== 'undefined' && 'registerProperty' in CSS) {
  try {
    CSS.registerProperty({
      name: '--uipkge-border-angle',
      syntax: '<angle>',
      inherits: false,
      initialValue: '0deg',
    })
  } catch {
    // already registered
  }
}

const beamStyles = css`
  @keyframes uipkge-border-beam {
    to {
      --uipkge-border-angle: 360deg;
    }
  }
`

/**
 * <uip-border-beam> — a conic highlight that traces an element's border ring.
 */
export class UipBorderBeam extends LitElement {
  static styles = [
    tailwind,
    beamStyles,
    css`
      :host {
        display: block;
        position: absolute;
        inset: 0;
        pointer-events: none;
        border-radius: inherit;
      }
    `,
  ]

  static properties = {
    size: { type: Number, reflect: true },
    duration: { type: Number, reflect: true },
    delay: { type: Number, reflect: true },
    color: { reflect: true },
    paused: { type: Boolean, reflect: true },
    reducedMotion: { state: true },
  }

  size = 2
  duration = 6
  delay = 0
  color = 'var(--primary)'
  paused = false
  private reducedMotion = false
  private mediaQueryHandler?: (e: MediaQueryListEvent) => void

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'border-beam')
    this.setAttribute('aria-hidden', 'true')

    if (!isServer) {
      const query = window.matchMedia('(prefers-reduced-motion: reduce)')
      this.reducedMotion = query.matches
      this.mediaQueryHandler = (e: MediaQueryListEvent) => {
        this.reducedMotion = e.matches
      }
      query.addEventListener('change', this.mediaQueryHandler)
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    if (!isServer && this.mediaQueryHandler) {
      window.matchMedia('(prefers-reduced-motion: reduce)').removeEventListener('change', this.mediaQueryHandler)
    }
  }

  render() {
    const background = this.reducedMotion
      ? `conic-gradient(from 45deg, transparent 0deg, transparent 290deg, ${this.color} 330deg, transparent 360deg)`
      : `conic-gradient(from var(--uipkge-border-angle), transparent 0deg, transparent 290deg, ${this.color} 330deg, transparent 360deg)`
    const animation = this.reducedMotion ? 'none' : `uipkge-border-beam ${this.duration}s linear infinite ${this.delay}s`
    const playState = !this.reducedMotion && this.paused ? 'paused' : 'running'
    const style = `padding: ${this.size}px; background: ${background}; animation: ${animation}; animation-play-state: ${playState}; -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); mask-composite: exclude;`

    return html`
      <span
        part="base"
        data-slot="border-beam"
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 rounded-[inherit]"
        style=${style}
      ></span>
    `
  }
}

customElements.get('uip-border-beam') || customElements.define('uip-border-beam', UipBorderBeam)

declare global {
  interface HTMLElementTagNameMap {
    'uip-border-beam': UipBorderBeam
  }
}
