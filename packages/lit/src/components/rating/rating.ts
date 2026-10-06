import { LitElement, css, html, nothing, svg } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

type Density = 'compact' | 'default' | 'comfortable'
type Size = 'x-small' | 'small' | 'medium' | 'large' | 'x-large'
type Variant = 'outlined' | 'filled' | 'soft'

// Star path shared by all three icon states.
const STAR_PATH = 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'

const variantClasses: Record<Variant, string> = {
  outlined: '',
  filled: 'bg-muted p-1 rounded-lg',
  soft: 'bg-accent p-1 rounded-lg',
}

// React applies these as inline styles; they stay runtime style bindings here.
const sizeIcon: Record<Size, { width: string; height: string }> = {
  'x-small': { width: '0.875rem', height: '0.875rem' },
  small: { width: '1.125rem', height: '1.125rem' },
  medium: { width: '1.375rem', height: '1.375rem' },
  large: { width: '1.625rem', height: '1.625rem' },
  'x-large': { width: '2rem', height: '2rem' },
}

const densityPad: Record<Density, string> = {
  compact: '0',
  default: '0.0625rem',
  comfortable: '0.125rem',
}

let uid = 0

/**
 * <uip-rating> — the registry Rating as a form-associated web component.
 *
 * Props match React's Rating (attributes are kebab-case): value, max,
 * readonly, disabled, density, color, clearable, hover, item-aria-label, size,
 * show-value, variant, half-increments, tooltips (property: string[];
 * attribute: comma-separated list).
 *
 * React injects a global <style> for the star "pop" keyframes and the hover
 * scale. Here both are utilities: the pop is tw-animate-css `animate-in
 * zoom-in-60 fade-in-40` with React's overshooting cubic-bezier (so the scale
 * passes ~1.18 like the keyframes' 60% step), and the hover scale is
 * `enabled:hover:scale-[1.12]`; both are motion-reduce safe.
 *
 * Form-associated: submits `name=value`, `required` fails on 0, resets with
 * the form. Events: `input` + `change` (value on `.value`) and
 * `value-change` (detail: { value }) — React's onValueChange.
 */
export class UipRating extends LitElement {
  static formAssociated = true
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true }
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: inline-flex; }`]

  static properties = {
    value: { type: Number },
    max: { type: Number },
    readonly: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    required: { type: Boolean, reflect: true },
    name: { reflect: true },
    density: { reflect: true },
    color: {},
    clearable: { type: Boolean },
    hover: { type: Boolean },
    itemAriaLabel: { attribute: 'item-aria-label' },
    size: { reflect: true },
    showValue: { type: Boolean, attribute: 'show-value' },
    variant: { reflect: true },
    halfIncrements: { type: Boolean, attribute: 'half-increments' },
    tooltips: {
      converter: {
        fromAttribute: (v: string | null) => (v ? v.split(',').map((s) => s.trim()) : undefined),
      },
    },
  }

  value = 0
  max = 5
  readonly = false
  disabled = false
  required = false
  name?: string
  density: Density = 'default'
  color = 'var(--warning)'
  clearable = false
  hover = false
  itemAriaLabel = 'rating'
  size: Size = 'medium'
  showValue = false
  variant: Variant = 'outlined'
  halfIncrements = false
  tooltips?: string[]

  private defaultValue = 0
  private readonly uidBase = `uip-rating-${++uid}`
  private internals = this.attachInternals()

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'rating')
    this.defaultValue = this.value
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has('value') || changed.has('required')) {
      this.internals.setFormValue(this.value ? String(this.value) : null)
      if (this.required && !this.value) {
        this.internals.setValidity({ valueMissing: true }, 'Please select a rating.', this.focusTarget ?? undefined)
      } else {
        this.internals.setValidity({})
      }
    }
  }

  formResetCallback() {
    this.value = this.defaultValue
  }
  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled
  }

  private get focusTarget() {
    return this.renderRoot?.querySelector<HTMLButtonElement>('button[tabindex="0"]')
  }

  private emit(next: number) {
    if (next === this.value) return
    this.value = next
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
    this.dispatchEvent(new CustomEvent('value-change', { detail: { value: next }, bubbles: true, composed: true }))
    // Keep focus on the (new) roving star after keyboard moves.
    this.updateComplete.then(() => {
      if (this.renderRoot.contains((this.renderRoot as ShadowRoot).activeElement)) this.focusTarget?.focus()
    })
  }

  private resolveClickValue(e: MouseEvent, star: number) {
    if (!this.halfIncrements) return star
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const isLeft = e.clientX - rect.left < rect.width / 2
    const next = isLeft ? star - 0.5 : star
    return next < 0.5 ? 0.5 : next
  }

  private handleClick(e: MouseEvent, star: number) {
    if (this.disabled || this.readonly) return
    const next = this.resolveClickValue(e, star)
    if (this.clearable && next === this.value) this.emit(0)
    else this.emit(next)
  }

  private handleKeydown(e: KeyboardEvent, star: number) {
    const current = this.value
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (this.disabled || this.readonly) return
      if (this.clearable && star === current) this.emit(0)
      else this.emit(star)
      return
    }
    const step = this.halfIncrements ? 0.5 : 1
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault()
      this.emit(Math.min(this.max, current + step))
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault()
      this.emit(Math.max(0, current - step))
    } else if (e.key === 'Home') {
      e.preventDefault()
      this.emit(this.halfIncrements ? 0.5 : 1)
    } else if (e.key === 'End') {
      e.preventDefault()
      this.emit(this.max)
    }
  }

  private renderStar(n: number) {
    const current = this.value
    const iconStyle = sizeIcon[this.size] ?? sizeIcon.medium
    if (current >= n) {
      return html`<svg
        class="rating-star-full-icon motion-safe:animate-in motion-safe:zoom-in-60 motion-safe:fade-in-40 motion-safe:duration-[280ms] motion-safe:ease-[cubic-bezier(0.22,1.4,0.36,1)] motion-safe:fill-mode-both motion-safe:delay-[var(--star-delay)]"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        style=${styleMap({ ...iconStyle, color: this.color })}
      >
        <path d=${STAR_PATH} />
      </svg>`
    }
    if (current >= n - 0.5 && this.halfIncrements) {
      const halfId = `${this.uidBase}-half-${n}`
      return html`<svg viewBox="0 0 24 24" aria-hidden="true" style=${styleMap({ ...iconStyle, color: this.color })}>
        ${svg`<defs>
          <linearGradient id=${halfId}>
            <stop offset="50%" stop-color="currentColor" />
            <stop offset="50%" stop-color="transparent" />
          </linearGradient>
        </defs>
        <path d=${STAR_PATH} fill=${`url(#${halfId})`} stroke="currentColor" stroke-width="1" />`}
      </svg>`
    }
    return html`<svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      aria-hidden="true"
      style=${styleMap({ ...iconStyle, color: 'var(--muted-foreground)' })}
    >
      <path d=${STAR_PATH} />
    </svg>`
  }

  render() {
    const current = this.value
    const max = this.max
    const focusStar = Math.ceil(current || 1)
    const inert = this.readonly || this.disabled
    return html`<div
      part="base"
      data-slot="rating"
      class=${cn(
        'inline-flex items-center gap-0.5',
        variantClasses[this.variant],
        this.disabled && 'cursor-not-allowed opacity-50',
        this.readonly && 'cursor-default',
        this.showValue && 'flex items-center gap-1',
      )}
      role="radiogroup"
      aria-valuenow=${current}
      aria-valuemin="0"
      aria-valuemax=${max}
      aria-label=${`Rating: ${current} of ${max}`}
      aria-required=${this.required ? 'true' : nothing}
    >
      ${Array.from({ length: max }, (_, i) => i + 1).map((n) => {
        const filled = current >= n
        const tip = this.tooltips?.[n - 1]
        return html`<button
          type="button"
          role="radio"
          ?disabled=${inert}
          aria-label=${tip ?? `${this.itemAriaLabel} ${n} of ${max}`}
          aria-checked=${Math.ceil(current || 0) === n ? 'true' : 'false'}
          title=${tip ?? nothing}
          tabindex=${inert ? -1 : focusStar === n ? 0 : -1}
          style=${styleMap({
            padding: densityPad[this.density] ?? densityPad.default,
            outlineColor: this.color,
            '--star-delay': filled ? `${(n - 1) * 45}ms` : '0ms',
          })}
          class=${cn(
            'inline-flex items-center justify-center border-none bg-none leading-none transition-transform duration-150',
            'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
            'enabled:hover:scale-[1.12] motion-reduce:transition-none motion-reduce:enabled:hover:scale-100',
            this.clearable && 'cursor-pointer',
            this.hover && 'hover:scale-[1.15]',
          )}
          @click=${(e: MouseEvent) => this.handleClick(e, n)}
          @keydown=${(e: KeyboardEvent) => this.handleKeydown(e, n)}
        >
          ${this.renderStar(n)}
        </button>`
      })}
      ${this.showValue ? html`<span class="text-foreground ml-2 font-semibold">${current}</span>` : nothing}
    </div>`
  }
}

customElements.get('uip-rating') || customElements.define('uip-rating', UipRating)

declare global {
  interface HTMLElementTagNameMap {
    'uip-rating': UipRating
  }
}
