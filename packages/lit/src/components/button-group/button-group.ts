import { LitElement, css, html } from 'lit'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

type Orientation = 'horizontal' | 'vertical'
export type ButtonGroupPosition = 'first' | 'middle' | 'last' | 'only'

const trueByDefault = { fromAttribute: (v: string | null) => v !== null && v !== 'false' }

/**
 * <uip-button-group> — the registry ButtonGroup as a web component.
 *
 * React joins its buttons with child selectors (`[&>[data-slot=button]]:rounded-none`,
 * `:first-child` → `rounded-l-md`, `:not(:first-child)` → `-ml-px` + a divider border).
 * Those can't reach the inner <button> inside uip-button's shadow root, so the group
 * tells each direct child where it sits instead: it sets
 * `data-group-position="first|middle|last|only"` and `data-group-orientation` on every
 * element child (on `slotchange` and whenever `orientation` / `attached` change), and
 * uip-button maps them to React's exact rounding / border / negative-margin classes on
 * its inner button. Native <button> children are not styled (use uip-button).
 *
 * Props: `orientation` (horizontal | vertical, default horizontal), `attached`
 * (default true; `attached="false"` spaces the buttons with React's gap instead).
 * The host has role="group" — give it an `aria-label`.
 */
export class UipButtonGroup extends LitElement {
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: inline-flex; }`]

  static properties = {
    orientation: { reflect: true },
    attached: { converter: trueByDefault },
  }

  orientation: Orientation = 'horizontal'
  attached = true

  private internals = this.attachInternals()
  private marked = new Set<Element>()

  constructor() {
    super()
    new ThemeController(this)
    this.internals.role = 'group'
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'button-group')
  }

  protected willUpdate() {
    this.setAttribute('data-orientation', this.orientation)
    this.toggleAttribute('data-attached', this.attached)
  }

  protected updated() {
    this.markChildren()
  }

  private markChildren() {
    const children = [...this.children]
    for (const el of this.marked) {
      if (children.includes(el)) continue
      el.removeAttribute('data-group-position')
      el.removeAttribute('data-group-orientation')
    }
    this.marked = new Set(this.attached ? children : [])
    children.forEach((el, i) => {
      if (!this.attached) {
        el.removeAttribute('data-group-position')
        el.removeAttribute('data-group-orientation')
        return
      }
      const last = children.length - 1
      const position: ButtonGroupPosition = last === 0 ? 'only' : i === 0 ? 'first' : i === last ? 'last' : 'middle'
      el.setAttribute('data-group-position', position)
      el.setAttribute('data-group-orientation', this.orientation === 'vertical' ? 'vertical' : 'horizontal')
    })
  }

  render() {
    const vertical = this.orientation === 'vertical'
    return html`<div
      part="base"
      data-slot="button-group"
      data-orientation=${vertical ? 'vertical' : 'horizontal'}
      ?data-attached=${this.attached}
      class=${cn(
        'inline-flex items-center',
        vertical ? 'flex-col items-stretch' : 'flex-row',
        !this.attached && (vertical ? 'gap-1' : 'gap-1.5'),
      )}
    >
      <slot @slotchange=${() => this.markChildren()}></slot>
    </div>`
  }
}

customElements.get('uip-button-group') || customElements.define('uip-button-group', UipButtonGroup)

declare global {
  interface HTMLElementTagNameMap {
    'uip-button-group': UipButtonGroup
  }
}
