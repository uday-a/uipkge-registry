import { LitElement, css, html, nothing } from 'lit'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { toggleVariants, type ToggleVariants } from './toggle.variants'

type Variant = NonNullable<ToggleVariants['variant']>
type Size = NonNullable<ToggleVariants['size']>

/**
 * <uip-toggle> — the registry Toggle as a web component.
 *
 * Class strings are React's `toggleVariants` verbatim; the inner <button>
 * carries `aria-pressed` and `data-state="on|off"` like Radix's Toggle.
 * Slotted icons get React's `[&_svg]:…` sizing via `::slotted(svg)` on the
 * <slot> (a light-DOM <svg> isn't a descendant of the inner button).
 *
 * `pressed` property = live state; the `pressed` attribute is the initial
 * state (and drives it when changed). Form-associated: submits `name=value`
 * (value defaults to "on") while pressed, resets with its form.
 *
 * Events: `pressed-change` (React's `onPressedChange`, `detail` = `{ pressed }`,
 * the requested new state) fires first and is cancelable; then, unless it was
 * cancelled, `.pressed` flips and `input` + `change` fire (read `.pressed`).
 *
 * Controlled mode (React's `pressed` + `onPressedChange`): call
 * `preventDefault()` in the `pressed-change` listener and set `.pressed`
 * yourself — the toggle then only changes when you say so:
 *   toggle.addEventListener('pressed-change', (e) => {
 *     e.preventDefault()
 *     if (allowed) toggle.pressed = e.detail.pressed
 *   })
 */
export class UipToggle extends LitElement {
  static formAssociated = true
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true }
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: inline-flex; }`]

  static properties = {
    pressed: { type: Boolean, attribute: false },
    defaultPressed: { type: Boolean, attribute: 'pressed' },
    variant: { reflect: true },
    size: { reflect: true },
    disabled: { type: Boolean, reflect: true },
    name: { reflect: true },
    value: {},
    accessibleLabel: { attribute: 'aria-label' },
  }

  pressed = false
  defaultPressed = false
  variant: Variant = 'default'
  size: Size = 'default'
  disabled = false
  name?: string
  value = 'on'
  accessibleLabel?: string

  private internals = this.attachInternals()

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'toggle')
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has('defaultPressed') && (this.hasUpdated || this.defaultPressed)) this.pressed = this.defaultPressed
    this.setAttribute('data-state', this.pressed ? 'on' : 'off')
    if (changed.has('pressed') || changed.has('value')) this.internals.setFormValue(this.pressed ? this.value : null)
  }

  formResetCallback() {
    this.pressed = this.defaultPressed
  }
  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled
  }

  private onClick() {
    if (this.disabled) return
    const pressed = !this.pressed
    const ok = this.dispatchEvent(
      new CustomEvent('pressed-change', { detail: { pressed }, bubbles: true, composed: true, cancelable: true }),
    )
    if (!ok) return
    this.pressed = pressed
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
  }

  render() {
    return html`<button
      part="base"
      type="button"
      data-uipkge=""
      data-slot="toggle"
      class=${cn(toggleVariants({ variant: this.variant, size: this.size }))}
      aria-pressed=${this.pressed ? 'true' : 'false'}
      aria-label=${this.accessibleLabel ?? nothing}
      data-state=${this.pressed ? 'on' : 'off'}
      ?data-disabled=${this.disabled}
      ?disabled=${this.disabled}
      @click=${this.onClick}
    >
      <slot
        class="[&::slotted(svg)]:pointer-events-none [&::slotted(svg)]:shrink-0 [&::slotted(svg:not([class*='size-']))]:size-4"
      ></slot>
    </button>`
  }
}

customElements.get('uip-toggle') || customElements.define('uip-toggle', UipToggle)

declare global {
  interface HTMLElementTagNameMap {
    'uip-toggle': UipToggle
  }
}
