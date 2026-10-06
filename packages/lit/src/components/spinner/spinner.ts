import { LitElement, css } from 'lit'
import { Loader2 } from 'lucide'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { icon } from '../../lib/icon'
import { spinnerVariants, type SpinnerVariants } from './spinner.variants'

type Size = NonNullable<SpinnerVariants['size']>

/**
 * <uip-spinner> — the registry Spinner (a spinning Loader2) as a web component.
 *
 * Class string is React's `spinnerVariants` verbatim. The icon is the same
 * Loader2 node lucide-react renders, so the `lucide lucide-loader-circle`
 * classes match. `role="status"` + `aria-label="Loading"` like React.
 *
 * React's `className` (size/color overrides) → style `part="base"` from the
 * host, e.g. `class="[&::part(base)]:size-8 [&::part(base)]:text-primary"`.
 */
export class UipSpinner extends LitElement {
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: inline-flex; }`]

  static properties = {
    size: { reflect: true },
  }

  size: Size = 'default'

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'spinner')
  }

  protected updated() {
    // icon() takes no extra attributes; stamp React's data/ARIA attributes and
    // the styling part onto the rendered svg.
    const svg = this.renderRoot.querySelector('svg')
    if (svg) {
      svg.setAttribute('part', 'base')
      svg.setAttribute('data-uipkge', '')
      svg.setAttribute('data-slot', 'spinner')
      svg.setAttribute('role', 'status')
      svg.setAttribute('aria-label', 'Loading')
    }
  }

  render() {
    return icon(Loader2, 'loader-circle', spinnerVariants({ size: this.size }))
  }
}

customElements.get('uip-spinner') || customElements.define('uip-spinner', UipSpinner)

declare global {
  interface HTMLElementTagNameMap {
    'uip-spinner': UipSpinner
  }
}
