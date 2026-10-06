import { LitElement, css, html } from 'lit'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { gradientTextPresets, type GradientPreset } from './gradient-text.variants'

const gradientKeyframes = css`
  @media (prefers-reduced-motion: no-preference) {
    @keyframes gradient-text-shift {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }
  }
`

type Direction =
  | 'to right'
  | 'to left'
  | 'to top'
  | 'to bottom'
  | 'to top right'
  | 'to top left'
  | 'to bottom right'
  | 'to bottom left'

/**
 * <uip-gradient-text> — renders text with a CSS gradient fill.
 */
export class UipGradientText extends LitElement {
  static styles = [
    tailwind,
    gradientKeyframes,
    css`
      :host {
        display: inline-block;
      }
    `,
  ]

  static properties = {
    preset: { reflect: true },
    from: { reflect: true },
    to: { reflect: true },
    direction: { reflect: true },
    gradient: { reflect: true },
    animated: { type: Boolean, reflect: true },
    animationDuration: { type: Number, attribute: 'animation-duration', reflect: true },
  }

  preset?: GradientPreset
  from?: string
  to?: string
  direction: Direction = 'to right'
  gradient?: string
  animated = false
  animationDuration = 4

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'gradient-text')
  }

  willUpdate() {
    if (this.preset) this.setAttribute('data-preset', this.preset)
    if (this.animated) this.setAttribute('data-animated', 'true')
  }

  render() {
    let g = this.gradient
    if (!g && this.preset) g = gradientTextPresets[this.preset]
    if (!g && this.from && this.to) g = `linear-gradient(${this.direction}, ${this.from}, ${this.to})`
    if (!g) g = 'linear-gradient(to right, var(--primary), var(--primary))'

    const style = `background-image: ${g}; background-clip: text; -webkit-background-clip: text; color: transparent; -webkit-text-fill-color: transparent; ${
      this.animated
        ? `background-size: 200% 200%; animation: gradient-text-shift ${this.animationDuration}s ease infinite;`
        : ''
    }`

    return html`<span part="base" data-slot="gradient-text" class="inline-block" style=${style}><slot></slot></span>`
  }
}

customElements.get('uip-gradient-text') || customElements.define('uip-gradient-text', UipGradientText)

declare global {
  interface HTMLElementTagNameMap {
    'uip-gradient-text': UipGradientText
  }
}
