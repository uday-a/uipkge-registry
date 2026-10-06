import { LitElement, css, html } from 'lit'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

/** React's Label class string, shared with elements that render their own label (textarea). */
export const labelClasses =
  'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50'

/**
 * <uip-label> — the registry Label (Radix Label) as a web component.
 *
 * Renders a native <label> with React's class string. React's `htmlFor` is the
 * `for` attribute / `htmlFor` property. A <label for> inside a shadow root
 * can't reach an id in the page, so the element does what the browser would:
 *  - clicking it focuses and clicks the control with that id (same root);
 *  - it names that control: `aria-label` is set on the target from the
 *    label's text, unless the target already has its own aria-label /
 *    aria-labelledby. Every uipkge control forwards its host `aria-label` to
 *    its inner focusable element, so this names uip-input / uip-textarea too.
 * Like Radix, a double-click doesn't select the label's text.
 *
 * `peer-disabled:` / `group-data-[disabled=true]:` stay in the class string
 * but can't match from inside the shadow root. Class overrides (React's
 * `className`) target the label through `::part(base)`; colour and font
 * utilities on the host are inherited.
 */
export class UipLabel extends LitElement {
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    htmlFor: { attribute: 'for', reflect: true },
  }

  htmlFor?: string
  private named?: { el: Element; text: string }

  constructor() {
    super()
    new ThemeController(this)
    this.addEventListener('click', this.onClick)
    this.addEventListener('mousedown', this.onMouseDown)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'label')
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.unname()
  }

  /** The labelled control, looked up by id in the label's own root. */
  get control(): HTMLElement | null {
    if (!this.htmlFor) return null
    const root = this.getRootNode() as Document | ShadowRoot
    return root.getElementById?.(this.htmlFor) ?? null
  }

  protected updated() {
    this.nameControl()
  }

  // The label's text, minus aria-hidden decoration (e.g. a required "*").
  private text() {
    const walk = (n: Node): string =>
      n.nodeType === Node.TEXT_NODE
        ? (n.textContent ?? '')
        : n instanceof Element && n.getAttribute('aria-hidden') === 'true'
          ? ''
          : [...n.childNodes].map(walk).join('')
    return walk(this).replace(/\s+/g, ' ').trim()
  }

  private nameControl() {
    const el = this.control
    if (this.named && this.named.el !== el) this.unname()
    if (!el) return
    const text = this.text()
    const current = el.getAttribute('aria-label')
    const ours = this.named?.el === el && current === this.named.text
    if ((current && !ours) || el.hasAttribute('aria-labelledby')) return
    if (text) {
      el.setAttribute('aria-label', text)
      this.named = { el, text }
    }
  }

  private unname() {
    if (!this.named) return
    const { el, text } = this.named
    if (el.getAttribute('aria-label') === text) el.removeAttribute('aria-label')
    this.named = undefined
  }

  private onClick = (e: MouseEvent) => {
    const el = this.control
    if (!el || (el as HTMLInputElement).disabled) return
    // Clicks on interactive content inside the label (or on the control
    // itself, when the label wraps it) keep their own behaviour.
    const path = e.composedPath()
    if (path.includes(el)) return
    const interactive = path.find(
      (n) => n instanceof HTMLElement && n !== this && n.matches('a[href], button, input, select, textarea, [tabindex]'),
    )
    if (interactive && this.contains(interactive as Node)) return
    el.focus()
    el.click()
  }

  // Radix Label: don't select the text on double-click.
  private onMouseDown = (e: MouseEvent) => {
    if (e.detail > 1) e.preventDefault()
  }

  render() {
    return html`<label part="base" data-slot="label" class=${labelClasses}
      ><slot @slotchange=${() => this.nameControl()}></slot
    ></label>`
  }
}

customElements.get('uip-label') || customElements.define('uip-label', UipLabel)

declare global {
  interface HTMLElementTagNameMap {
    'uip-label': UipLabel
  }
}
