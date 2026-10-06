import { LitElement, css, html, nothing } from 'lit'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { fabVariants, type FabVariants } from './fab.variants'

type Variant = NonNullable<FabVariants['variant']>
type Size = NonNullable<FabVariants['size']>
type Position = NonNullable<FabVariants['position']>

/**
 * <uip-fab> — the registry Fab as a web component.
 *
 * Class strings are React's `fabVariants` verbatim. One shadow-DOM adaptation
 * (a light-DOM <svg> is not a descendant of the inner button): icon sizing
 * moves from `[&_svg]:…` to `::slotted(svg)` on the <slot>, with the size-4 /
 * size-6 / size-7 default per resolved size. `href` renders an <a> (the
 * web-component stand-in for React's `asChild`).
 *
 * `label` renders an extended (pill) FAB — the resolved size is forced to
 * `extended`, like React. `absolute` swaps the fixed anchor for absolute
 * positioning (contained FABs). The accessible name resolves exactly like
 * React: `aria-label` attribute → `label` → `'Floating action'` (React's
 * `ariaLabel` prop maps to the native `aria-label` attribute).
 *
 * Form-associated (React extends ButtonHTMLAttributes): `type` (`button` |
 * `submit` | `reset`) drives the ancestor form through ElementInternals, like
 * <uip-button>. React's `onClick` is the native `click` event.
 *
 * Popup-trigger state (`aria-expanded`, `aria-haspopup`, `aria-description`,
 * `aria-controls` set by a wrapping popover/menu) is forwarded to the inner
 * button, like <uip-button>.
 *
 * Parts: `base` (the button), `label`.
 */
export class UipFab extends LitElement {
  static formAssociated = true
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true }
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: inline-flex; }`]

  static properties = {
    variant: { reflect: true },
    size: { reflect: true },
    position: { reflect: true },
    label: {},
    absolute: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    type: { reflect: true },
    name: { reflect: true },
    value: {},
    href: {},
    target: {},
    accessibleLabel: { attribute: 'aria-label' },
    fwdExpanded: { attribute: 'aria-expanded' },
    fwdHaspopup: { attribute: 'aria-haspopup' },
    fwdDescription: { attribute: 'aria-description' },
    fwdControls: { attribute: 'aria-controls' },
  }

  variant: Variant = 'default'
  size: Size = 'default'
  position: Position = 'bottom-right'
  label?: string
  absolute = false
  disabled = false
  type: 'button' | 'submit' | 'reset' = 'button'
  name?: string
  value?: string
  href?: string
  target?: string
  accessibleLabel?: string
  fwdExpanded?: string
  fwdHaspopup?: string
  fwdDescription?: string
  fwdControls?: string

  private internals = this.attachInternals()

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'fab')
  }

  /** React forces `extended` whenever a label is present. */
  private get resolvedSize(): Size {
    return this.label ? 'extended' : this.size
  }

  protected willUpdate() {
    this.setAttribute('data-variant', this.variant)
    this.setAttribute('data-size', this.resolvedSize)
    this.setAttribute('data-position', this.position)
  }

  // aria-controls is an id in the host's tree; an id can't be referenced from
  // inside the shadow root, so point the inner control at the element itself.
  protected updated() {
    const inner = this.renderRoot.querySelector<HTMLElement>('[part=base]')
    if (!inner) return
    const root = this.getRootNode() as Document | ShadowRoot
    const target = this.fwdControls ? root.getElementById?.(this.fwdControls) : null
    inner.ariaControlsElements = target ? [target] : null
  }

  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled
  }

  // A <button> inside a shadow root can't submit the host's form on its own,
  // so submit/reset are forwarded through ElementInternals (like <uip-button>).
  private onClick() {
    if (this.disabled || this.href) return
    const form = this.internals.form
    if (!form) return
    if (this.type === 'reset') {
      form.reset()
      return
    }
    if (this.type !== 'submit') return
    if (this.name != null && this.value != null) this.internals.setFormValue(this.value)
    else this.internals.setFormValue(null)
    const restore = () => this.internals.setFormValue(null)
    form.addEventListener('formdata', restore, { once: true })
    setTimeout(restore, 0)
    form.requestSubmit()
  }

  render() {
    const resolvedSize = this.resolvedSize
    const classes = cn(
      fabVariants({ variant: this.variant, size: resolvedSize, position: this.position }),
      // React: `absolute && position !== 'inline' && 'absolute'` (raw prop).
      this.absolute && this.position !== 'inline' && 'absolute',
      // `grow`: fill the host when a layout stretches it (like <uip-button>).
      'grow',
    )
    // React's `[&_svg]:…` sizing, re-expressed for slotted icons: mini → size-4,
    // large → size-7, everything else (default, extended) → size-6.
    const slottedIconSize =
      resolvedSize === 'mini'
        ? "[&::slotted(svg:not([class*='size-']))]:size-4"
        : resolvedSize === 'large'
          ? "[&::slotted(svg:not([class*='size-']))]:size-7"
          : "[&::slotted(svg:not([class*='size-']))]:size-6"
    const body = html`<slot class=${cn('[&::slotted(svg)]:pointer-events-none [&::slotted(svg)]:shrink-0', slottedIconSize)}></slot>
      ${this.label ? html`<span part="label" class="pr-1">${this.label}</span>` : nothing}`
    const ariaLabel = this.accessibleLabel || this.label || 'Floating action'
    const shared = {
      'part': 'base',
      'class': classes,
      'aria-label': ariaLabel,
      'aria-expanded': this.fwdExpanded ?? nothing,
      'aria-haspopup': this.fwdHaspopup ?? nothing,
      'aria-description': this.fwdDescription ?? nothing,
      'data-variant': this.variant,
      'data-size': resolvedSize,
      'data-position': this.position,
    }
    if (this.href) {
      return html`<a
        part="base"
        class=${shared.class}
        href=${this.disabled ? nothing : this.href}
        target=${this.target ?? nothing}
        aria-disabled=${this.disabled ? 'true' : nothing}
        aria-label=${shared['aria-label']}
        aria-expanded=${shared['aria-expanded']}
        aria-haspopup=${shared['aria-haspopup']}
        aria-description=${shared['aria-description']}
        data-variant=${shared['data-variant']}
        data-size=${shared['data-size']}
        data-position=${shared['data-position']}
        >${body}</a
      >`
    }
    return html`<button
      part="base"
      class=${shared.class}
      type=${this.type}
      name=${this.name ?? nothing}
      value=${this.value ?? nothing}
      ?disabled=${this.disabled}
      aria-label=${shared['aria-label']}
      aria-expanded=${shared['aria-expanded']}
      aria-haspopup=${shared['aria-haspopup']}
      aria-description=${shared['aria-description']}
      data-variant=${shared['data-variant']}
      data-size=${shared['data-size']}
      data-position=${shared['data-position']}
      @click=${this.onClick}
    >
      ${body}
    </button>`
  }
}

customElements.get('uip-fab') || customElements.define('uip-fab', UipFab)

declare global {
  interface HTMLElementTagNameMap {
    'uip-fab': UipFab
  }
}
