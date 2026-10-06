import { LitElement, css, html, nothing } from 'lit'
import { live } from 'lit/directives/live.js'
import { styleMap } from 'lit/directives/style-map.js'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

const DEFAULT_PRESETS = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#14b8a6',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#ffffff',
  '#d4d4d4',
  '#737373',
  '#171717',
]

const stringListConverter = {
  fromAttribute: (v: string | null): string[] => {
    if (!v) return []
    try {
      const parsed = JSON.parse(v)
      if (Array.isArray(parsed)) return parsed
    } catch {
      // split by comma
    }
    return v.split(',').map((s) => s.trim()).filter(Boolean)
  },
  toAttribute: (v: string[] | undefined): string | null => (v ? JSON.stringify(v) : null),
}

/**
 * <uip-color-picker> — the registry ColorPicker as a web component.
 *
 * Form-associated: submits `name=value` with its <form>, supports reset.
 */
export class UipColorPicker extends LitElement {
  static formAssociated = true
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true }
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    value: { reflect: true },
    defaultValue: { attribute: 'default-value' },
    name: { reflect: true },
    disabled: { type: Boolean, reflect: true },
    hideHexInput: { type: Boolean, attribute: 'hide-hex-input', reflect: true },
    presets: { converter: stringListConverter },
    accessibleLabel: { attribute: 'aria-label' },
  }

  value = '#3b82f6'
  defaultValue?: string
  name?: string
  disabled = false
  hideHexInput = false
  presets: string[] = DEFAULT_PRESETS
  accessibleLabel?: string

  private initialValue = ''
  private internals = this.attachInternals()

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'color-picker')
    if (this.defaultValue !== undefined && this.getAttribute('value') === null) {
      this.value = this.defaultValue
    }
    this.initialValue = this.value
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has('value')) {
      this.internals.setFormValue(this.value ?? '')
    }
  }

  formResetCallback() {
    this.setValue(this.initialValue)
  }

  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled
  }

  private setValue(next: string) {
    const changed = this.value !== next
    this.value = next
    if (changed) {
      this.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
      this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
      this.dispatchEvent(new CustomEvent('value-change', { detail: { value: next }, bubbles: true, composed: true }))
    }
  }

  private onColorInput(e: Event) {
    this.setValue((e.target as HTMLInputElement).value)
  }

  private onColorChange(e: Event) {
    this.setValue((e.target as HTMLInputElement).value)
  }

  private onTextInput(e: Event) {
    this.setValue((e.target as HTMLInputElement).value)
  }

  private onTextChange(e: Event) {
    this.setValue((e.target as HTMLInputElement).value)
  }

  private selectPreset(color: string) {
    if (this.disabled) return
    this.setValue(color)
  }

  render() {
    const swatches = this.presets ?? []
    const safeColorValue = /^#[0-9a-fA-F]{6}$/.test(this.value || '') ? this.value : '#ffffff'

    return html`
      <div part="base" class="space-y-3">
        <div class="flex items-center gap-2">
          <div
            part="preview"
            class="border-input relative h-10 w-10 shrink-0 overflow-hidden rounded-md border shadow-xs"
            style=${styleMap({ backgroundColor: this.value || '#ffffff' })}
          >
            <input
              type="color"
              .value=${live(safeColorValue)}
              ?disabled=${this.disabled}
              aria-label=${this.accessibleLabel ?? 'Pick color'}
              class="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
              @input=${this.onColorInput}
              @change=${this.onColorChange}
            />
          </div>
          ${!this.hideHexInput
            ? html`<input
                type="text"
                part="input"
                .value=${live(this.value || '')}
                placeholder="#000000"
                spellcheck="false"
                autocomplete="off"
                ?disabled=${this.disabled}
                aria-label="Hex color"
                class="bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 flex-1 rounded-md border px-3 text-sm uppercase shadow-xs outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
                @input=${this.onTextInput}
                @change=${this.onTextChange}
              />`
            : nothing}
        </div>

        ${swatches.length > 0
          ? html`<div part="swatches" class="flex flex-wrap gap-1.5">
              ${swatches.map(
                (color) => html`
                  <button
                    type="button"
                    part="swatch"
                    ?disabled=${this.disabled}
                    aria-label=${`Select ${color}`}
                    style=${styleMap({ backgroundColor: color })}
                    class=${cn(
                      'ring-offset-background focus-visible:ring-ring/40 size-6 shrink-0 rounded-md shadow-sm transition-transform outline-none hover:scale-110 focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100',
                      (this.value ?? '').toLowerCase() === color.toLowerCase()
                        ? 'ring-foreground ring-2 ring-offset-2'
                        : 'ring-border/50 ring-1',
                      color.toLowerCase() === '#ffffff' && 'ring-border',
                    )}
                    @click=${() => this.selectPreset(color)}
                  ></button>
                `,
              )}
            </div>`
          : nothing}
      </div>
    `
  }
}

customElements.get('uip-color-picker') || customElements.define('uip-color-picker', UipColorPicker)

declare global {
  interface HTMLElementTagNameMap {
    'uip-color-picker': UipColorPicker
  }
}
