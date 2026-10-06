import { LitElement, css, html } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

/**
 * <uip-progress> — the registry Progress (Radix Progress Root + Indicator).
 *
 * The track (`part="base"`, role=progressbar) and the indicator
 * (`part="indicator"`) carry React's class strings and Radix's ARIA/data
 * attributes. `value` is clamped to 0–100 like React. The host's
 * `aria-label` is forwarded to the progressbar (default "Progress").
 *
 * React's `className` → style the parts from outside, e.g.
 * `class="[&::part(base)]:h-3 [&::part(indicator)]:bg-success"`.
 */
export class UipProgress extends LitElement {
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    value: { type: Number },
    max: { type: Number },
    accessibleLabel: { attribute: 'aria-label' },
  }

  value?: number | null
  max = 100
  accessibleLabel?: string

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'progress')
  }

  render() {
    // Clamp so out-of-range value cannot push the indicator past the track.
    const clamped = Math.min(100, Math.max(0, this.value ?? 0))
    // Radix: an invalid max falls back to 100.
    const max = this.max > 0 ? this.max : 100
    const state = clamped === max ? 'complete' : 'loading'
    return html`<div
      part="base"
      role="progressbar"
      aria-valuemax=${max}
      aria-valuemin="0"
      aria-valuenow=${clamped}
      aria-valuetext=${`${Math.round((clamped / max) * 100)}%`}
      aria-label=${this.accessibleLabel ?? 'Progress'}
      data-state=${state}
      data-value=${clamped}
      data-max=${max}
      data-uipkge=""
      data-slot="progress"
      class="bg-primary/20 relative h-2 w-full overflow-hidden rounded-full"
    >
      <div
        part="indicator"
        data-state=${state}
        data-value=${clamped}
        data-max=${max}
        data-uipkge=""
        data-slot="progress-indicator"
        class="bg-primary h-full w-full flex-1 transition-transform duration-500 ease-out motion-reduce:transition-none"
        style=${styleMap({ transform: `translateX(-${100 - clamped}%)` })}
      ></div>
    </div>`
  }
}

customElements.get('uip-progress') || customElements.define('uip-progress', UipProgress)

declare global {
  interface HTMLElementTagNameMap {
    'uip-progress': UipProgress
  }
}
