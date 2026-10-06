import { LitElement, css, html, nothing } from 'lit'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { buttonVariants, type ButtonVariants } from './button.variants'

type Variant = NonNullable<ButtonVariants['variant']>
type Size = NonNullable<ButtonVariants['size']>

/**
 * <uip-button> — the registry Button as a web component.
 *
 * Class strings are React's `buttonVariants` verbatim. Two shadow-DOM
 * adaptations (a light-DOM <svg> is not a descendant of the inner <button>):
 *  - icon sizing moves from `[&_svg]:…` to `::slotted(svg)` on the <slot>;
 *  - React's `has-[>svg]:px-*` can't see slotted icons, so the element sets
 *    `data-icon` on the inner button when a slotted <svg> is present and the
 *    size padding is re-expressed as `data-[icon]:px-*`.
 * `href` renders an <a> (the web-component stand-in for React's `asChild`).
 *
 * Inside a <uip-button-group> the group sets `data-group-position`
 * (first | middle | last | only) and `data-group-orientation` on the host; the
 * button then applies React ButtonGroup's child rules to its inner element
 * (rounding, `-ml-px` / `-mt-px`, divider border per variant, hover/focus z-index).
 *
 * Form-associated (like React's <button>, which extends ButtonHTMLAttributes):
 * `type` (`button` | `submit` | `reset`) drives the ancestor form — `submit`
 * calls `requestSubmit()`, `reset` calls `reset()`. A shadow-DOM <button> can't
 * submit the host's form on its own, so the click is forwarded through
 * ElementInternals. `name` + `value` are submitted as name=value only on the
 * submission this button triggers (set just before requestSubmit, cleared
 * after). `formaction` / `formmethod` / `formenctype` / `formnovalidate` /
 * `formtarget` (React's formAction …) temporarily override the form's
 * attributes for that submission. The native `form` attribute (form id) works
 * as-is via form association — no property needed.
 */
const activeFormSubmissions = new WeakMap<HTMLFormElement, { count: number; saved: Map<string, string | null> }>()

export class UipButton extends LitElement {
  static formAssociated = true
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true }
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: inline-flex; }`]

  static properties = {
    variant: { reflect: true },
    size: { reflect: true },
    type: { reflect: true },
    name: { reflect: true },
    value: {},
    formAction: { attribute: 'formaction' },
    formMethod: { attribute: 'formmethod' },
    formEnctype: { attribute: 'formenctype' },
    formNoValidate: { type: Boolean, attribute: 'formnovalidate' },
    formTarget: { attribute: 'formtarget' },
    disabled: { type: Boolean, reflect: true },
    href: {},
    // The focusable element is the inner <button>, so the host's aria-label
    // must be forwarded or icon-only buttons have no accessible name.
    accessibleLabel: { attribute: 'aria-label' },
    // Popup-trigger state must reach the inner <button> too, or assistive tech
    // never hears it when a uip-button is a menu / popover / collapsible trigger.
    fwdExpanded: { attribute: 'aria-expanded' },
    fwdHaspopup: { attribute: 'aria-haspopup' },
    fwdDescription: { attribute: 'aria-description' },
    fwdControls: { attribute: 'aria-controls' },
    target: {},
    groupPosition: { attribute: 'data-group-position' },
    groupOrientation: { attribute: 'data-group-orientation' },
    hasIcon: { state: true },
  }

  variant: Variant = 'default'
  size: Size = 'default'
  type: 'button' | 'submit' | 'reset' = 'button'
  name?: string
  value?: string
  formAction?: string
  formMethod?: string
  formEnctype?: string
  formNoValidate = false
  formTarget?: string
  disabled = false
  href?: string
  accessibleLabel?: string
  fwdExpanded?: string
  fwdHaspopup?: string
  fwdDescription?: string
  fwdControls?: string
  target?: string
  groupPosition?: 'first' | 'middle' | 'last' | 'only'
  groupOrientation?: 'horizontal' | 'vertical'
  private hasIcon = false

  private internals = this.attachInternals()

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'button')
  }

  willUpdate() {
    this.setAttribute('data-variant', this.variant)
    this.setAttribute('data-size', this.size)
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

  private onSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement
    this.hasIcon = slot.assignedElements().some((el) => el.localName === 'svg')
  }

  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled
  }

  // A <button> inside a shadow root can't submit the host's form on its own,
  // so submit/reset are forwarded through ElementInternals. The inner button
  // keeps the real `type` for semantics/inspection; the outer form action
  // happens here.
  private onClick() {
    if (this.disabled || this.href) return
    const form = this.internals.form
    if (!form) return
    if (this.type === 'reset') {
      form.reset()
      return
    }
    if (this.type !== 'submit') return
    // Native submit buttons send name=value only when they are the submitter.
    // Emulate that: publish the value just for this submission, then clear it
    // once the form data has been captured (formdata) or on the next tick as
    // a fallback (submit prevented / no data).
    if (this.name != null && this.value != null) this.internals.setFormValue(this.value)
    else this.internals.setFormValue(null)
    // form* overrides: stash the form's attributes, apply the button's, and
    // restore after capture. Guard against rapid re-entrant clicks so initial
    // attributes are never clobbered by in-flight overrides.
    let entry = activeFormSubmissions.get(form)
    if (!entry) {
      const saved = new Map<string, string | null>()
      const stash = (attr: string) => saved.set(attr, form.getAttribute(attr))
      stash('action')
      stash('method')
      stash('enctype')
      stash('target')
      stash('novalidate')
      entry = { count: 1, saved }
      activeFormSubmissions.set(form, entry)
    } else {
      entry.count += 1
    }

    if (this.formAction != null) form.setAttribute('action', this.formAction)
    if (this.formMethod != null) form.setAttribute('method', this.formMethod)
    if (this.formEnctype != null) form.setAttribute('enctype', this.formEnctype)
    if (this.formTarget != null) form.setAttribute('target', this.formTarget)
    if (this.formNoValidate) form.setAttribute('novalidate', '')

    let restored = false
    const restore = () => {
      if (restored) return
      restored = true
      const currentEntry = activeFormSubmissions.get(form)
      if (currentEntry) {
        currentEntry.count -= 1
        if (currentEntry.count <= 0) {
          activeFormSubmissions.delete(form)
          for (const [attr, val] of currentEntry.saved) {
            if (val == null) form.removeAttribute(attr)
            else form.setAttribute(attr, val)
          }
        }
      }
      this.internals.setFormValue(null)
      form.removeEventListener('formdata', restore)
    }
    form.addEventListener('formdata', restore, { once: true })
    setTimeout(restore, 0)
    form.requestSubmit()
  }

  // React ButtonGroup's `[&>[data-slot=button]…]` rules, applied from inside.
  private groupClasses() {
    const pos = this.groupPosition
    if (!pos) return ''
    const v = this.groupOrientation === 'vertical'
    const rounding = {
      first: v ? 'rounded-t-md rounded-b-none' : 'rounded-l-md rounded-r-none',
      middle: 'rounded-none',
      last: v ? 'rounded-t-none rounded-b-md' : 'rounded-l-none rounded-r-md',
      only: 'rounded-md',
    }[pos]
    const joined = pos === 'middle' || pos === 'last'
    const divider = joined
      ? ({ default: 'border-primary-foreground/20', secondary: 'border-border', destructive: 'border-white/20' } as Record<string, string>)[
          this.variant
        ]
      : undefined
    return cn(
      'relative hover:z-10 focus-visible:z-20',
      rounding,
      joined && (v ? '-mt-px' : '-ml-px'),
      divider && [divider, v ? 'border-t' : 'border-l'],
    )
  }

  render() {
    const classes = cn(
      buttonVariants({ variant: this.variant, size: this.size }),
      // `grow`: fill the host when a layout stretches it (flex-col, w-full).
      'grow data-[size=default]:data-[icon]:px-3 data-[size=sm]:data-[icon]:px-2.5 data-[size=lg]:data-[icon]:px-4 data-[size=xs]:data-[icon]:px-1.5',
      this.groupClasses(),
    )
    const slot = html`<slot
      class="[&::slotted(svg)]:pointer-events-none [&::slotted(svg)]:shrink-0 [&::slotted(svg:not([class*='size-']))]:size-4"
      @slotchange=${this.onSlotChange}
    ></slot>`
    if (this.href) {
      return html`<a
        part="base"
        class=${classes}
        href=${this.disabled ? nothing : this.href}
        target=${this.target ?? nothing}
        aria-disabled=${this.disabled ? 'true' : nothing}
        aria-expanded=${this.fwdExpanded ?? nothing}
        aria-haspopup=${this.fwdHaspopup ?? nothing}
        aria-description=${this.fwdDescription ?? nothing}
        aria-label=${this.accessibleLabel ?? nothing}
        data-size=${this.size}
        ?data-icon=${this.hasIcon}
        >${slot}</a
      >`
    }
    return html`<button
      part="base"
      class=${classes}
      type=${this.type}
      name=${this.name ?? nothing}
      value=${this.value ?? nothing}
      formaction=${this.formAction ?? nothing}
      formmethod=${this.formMethod ?? nothing}
      formenctype=${this.formEnctype ?? nothing}
      ?formnovalidate=${this.formNoValidate}
      formtarget=${this.formTarget ?? nothing}
      ?disabled=${this.disabled}
      aria-expanded=${this.fwdExpanded ?? nothing}
      aria-haspopup=${this.fwdHaspopup ?? nothing}
      aria-description=${this.fwdDescription ?? nothing}
      aria-label=${this.accessibleLabel ?? nothing}
      data-size=${this.size}
      ?data-icon=${this.hasIcon}
      @click=${this.onClick}
    >
      ${slot}
    </button>`
  }
}

customElements.get('uip-button') || customElements.define('uip-button', UipButton)

declare global {
  interface HTMLElementTagNameMap {
    'uip-button': UipButton
  }
}
