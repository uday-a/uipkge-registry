import { LitElement, css, html, nothing } from 'lit'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'inherit'
export type IconFlip = 'horizontal' | 'vertical' | 'both'

const sizeClasses: Record<IconSize, string> = {
  xs: 'size-3',
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-6',
  xl: 'size-8',
  '2xl': 'size-12',
  inherit: 'size-full',
}

/**
 * <uip-icon> — universal icon wrapper.
 */
export class UipIcon extends LitElement {
  static styles = [
    tailwind,
    css`
      :host {
        display: inline-flex;
      }
    `,
  ]

  static properties = {
    size: { reflect: true },
    color: { reflect: true },
    src: { reflect: true },
    alt: { reflect: true },
    rotation: { reflect: true },
    flip: { reflect: true },
    label: { reflect: true },
    ariaLabel: { attribute: 'aria-label', reflect: true },
    inline: { type: Boolean, reflect: true },
  }

  size: IconSize = 'md'
  color?: string
  src?: string
  alt?: string
  rotation?: number | string
  flip?: IconFlip
  label?: string
  override ariaLabel: string | null = null
  inline = true

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'icon')
  }

  render() {
    const rotationDeg = this.rotation ? (typeof this.rotation === 'string' ? parseInt(this.rotation) : this.rotation) : undefined
    const accessibleName = this.ariaLabel || this.label

    const flipClasses =
      this.flip === 'horizontal'
        ? '-scale-x-100'
        : this.flip === 'vertical'
          ? '-scale-y-100'
          : this.flip === 'both'
            ? '-scale-x-100 -scale-y-100'
            : ''

    const transform = rotationDeg ? `rotate(${rotationDeg}deg)` : undefined
    const style = [
      this.color ? `color: ${this.color};` : '',
      transform ? `transform: ${transform};` : '',
    ].filter(Boolean).join(' ')

    if (this.src) {
      return html`
        <img
          part="base"
          data-slot="icon"
          src=${this.src}
          alt=${this.alt || this.label || ''}
          class=${cn(
            'shrink-0 object-contain',
            this.inline ? 'inline-block' : 'block',
            this.size !== 'inherit' ? sizeClasses[this.size] : '',
            flipClasses,
          )}
          style=${style || nothing}
          aria-label=${accessibleName || nothing}
          role="img"
        />
      `
    }

    return html`
      <span
        part="base"
        data-slot="icon"
        class=${cn(
          'shrink-0 items-center justify-center',
          this.inline ? 'inline-flex' : 'flex',
          this.size !== 'inherit' ? sizeClasses[this.size] : '',
          flipClasses,
        )}
        style=${style || nothing}
        role=${accessibleName ? 'img' : nothing}
        aria-label=${accessibleName || nothing}
        aria-hidden=${accessibleName ? nothing : 'true'}
      >
        <slot class="[&::slotted(svg)]:size-full [&::slotted(svg)]:shrink-0"></slot>
      </span>
    `
  }
}

customElements.get('uip-icon') || customElements.define('uip-icon', UipIcon)

declare global {
  interface HTMLElementTagNameMap {
    'uip-icon': UipIcon
  }
}
