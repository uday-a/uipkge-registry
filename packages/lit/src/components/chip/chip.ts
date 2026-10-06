import { LitElement, css, html, nothing } from 'lit'
import { X } from 'lucide'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { icon } from '../../lib/icon'
import { chipVariants, type ChipVariants } from './chip.variants'

type Variant = NonNullable<ChipVariants['variant']>
type Size = NonNullable<ChipVariants['size']>

/*
 * Enter/leave keyframes — React's injected `chip-motion-styles` verbatim.
 * Keyframes have no utility equivalent (same exception as skeleton's shimmer).
 */
const motion = css`
  @keyframes chip-enter {
    from {
      opacity: 0;
      transform: scale(0.88);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  @keyframes chip-leave {
    to {
      opacity: 0;
      transform: scale(0.88);
    }
  }
  [data-slot='chip'].chip-enter {
    animation: chip-enter 180ms cubic-bezier(0.22, 1.2, 0.36, 1) both;
  }
  [data-slot='chip'].chip-leave {
    animation: chip-leave 160ms ease-in both;
    pointer-events: none;
  }
  @media (prefers-reduced-motion: reduce) {
    [data-slot='chip'].chip-enter,
    [data-slot='chip'].chip-leave {
      animation: none !important;
    }
  }
`

/**
 * <uip-chip> — the registry Chip.
 *
 * Class strings are React's `chipVariants` verbatim, except `[&>span]:min-w-0`
 * becomes `[&::slotted(span)]:min-w-0` on the <slot> (a light-DOM <span> isn't
 * a shadow-tree child).
 *
 * Events: `close` (no detail) — React's `onClose`, fired after the 160ms
 * leave animation when the built-in dismiss button is clicked. Like React,
 * the chip does not remove itself; the listener does.
 */
export class UipChip extends LitElement {
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, motion, css`:host { display: inline-flex; }`]

  static properties = {
    variant: { reflect: true },
    size: { reflect: true },
    wrap: { type: Boolean, reflect: true },
    closable: { type: Boolean, reflect: true },
    leaving: { state: true },
  }

  variant: Variant = 'default'
  size: Size = 'default'
  wrap = false
  closable = false
  private leaving = false

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'chip')
  }

  willUpdate() {
    if (this.leaving) this.setAttribute('data-leaving', 'true')
    else this.removeAttribute('data-leaving')
  }

  private handleClose(e: MouseEvent) {
    e.stopPropagation()
    if (this.leaving) return
    this.leaving = true
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    setTimeout(() => this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true })), reduce ? 0 : 160)
  }

  render() {
    return html`<span
      part="base"
      data-slot="chip"
      data-leaving=${this.leaving ? 'true' : nothing}
      class=${cn(
        chipVariants({ variant: this.variant, size: this.size, wrap: this.wrap || undefined }),
        'chip-enter',
        this.leaving && 'chip-leave',
      )}
    >
      <slot class="[&::slotted(span)]:min-w-0"></slot>
      ${this.closable
        ? html`<button
            type="button"
            aria-label="Remove item"
            class="focus-visible:ring-ring hover:bg-foreground/10 ml-1 inline-flex min-h-6 min-w-6 items-center justify-center rounded-full transition-transform duration-150 focus-visible:ring-1 focus-visible:outline-none active:scale-90"
            @click=${this.handleClose}
          >
            ${icon(X, 'x', 'size-3')}
          </button>`
        : nothing}
    </span>`
  }
}

/**
 * <uip-chip-group> — the registry ChipGroup (`role="group"` flex wrapper).
 *
 * React's render-prop (`isSelected` / `toggle`) becomes the `isSelected(value)`
 * and `toggle(value)` methods with React's selection rules (multiple, max,
 * mandatory, disabled). `selected` is a string[] property. Unlike React's
 * controlled-only prop, `toggle` also updates `selected` before emitting.
 *
 * Events: `selected-change` (detail: { value: string[] }) — React's
 * `onSelectedChange`.
 */
export class UipChipGroup extends LitElement {
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    selected: { type: Array },
    multiple: { type: Boolean, reflect: true },
    filter: { type: Boolean, reflect: true },
    column: { type: Boolean, reflect: true },
    mandatory: { type: Boolean },
    max: { type: Number },
    disabled: { type: Boolean, reflect: true },
  }

  selected: string[] = []
  multiple = false
  filter = false
  column = false
  mandatory = false
  max?: number
  disabled = false

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-chip-group', 'true')
  }

  isSelected(value: string) {
    return this.selected.includes(value)
  }

  toggle(value: string) {
    if (this.disabled) return
    const selected = this.selected
    let next: string[]
    if (this.multiple) {
      if (this.isSelected(value)) next = selected.filter((v) => v !== value)
      else if (this.max && selected.length >= this.max) next = [...selected.slice(1), value]
      else next = [...selected, value]
    } else {
      next = this.isSelected(value) && !this.mandatory ? [] : [value]
    }
    this.selected = next
    this.dispatchEvent(new CustomEvent('selected-change', { detail: { value: next }, bubbles: true, composed: true }))
  }

  render() {
    return html`<div
      part="base"
      role="group"
      class=${cn('flex flex-wrap gap-2', this.column && 'flex-col')}
      data-chip-group="true"
      data-multiple=${this.multiple ? 'true' : nothing}
      data-filter=${this.filter ? 'true' : nothing}
    >
      <slot></slot>
    </div>`
  }
}

customElements.get('uip-chip') || customElements.define('uip-chip', UipChip)
customElements.get('uip-chip-group') || customElements.define('uip-chip-group', UipChipGroup)

declare global {
  interface HTMLElementTagNameMap {
    'uip-chip': UipChip
    'uip-chip-group': UipChipGroup
  }
}
