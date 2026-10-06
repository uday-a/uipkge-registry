import { LitElement, css, html, nothing } from 'lit'
import { live } from 'lit/directives/live.js'
import { X } from 'lucide'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { icon } from '../../lib/icon'

const stringListConverter = {
  fromAttribute: (v: string | null): string[] => {
    if (!v) return []
    try {
      const parsed = JSON.parse(v)
      if (Array.isArray(parsed)) return parsed.map(String)
    } catch {
      // split by comma
    }
    return v.split(',').map((s) => s.trim()).filter(Boolean)
  },
  toAttribute: (v: string[] | undefined): string | null => (v ? JSON.stringify(v) : null),
}

const trueUnlessFalse = {
  fromAttribute: (v: string | null) => v !== 'false',
}

/**
 * <uip-tags-input> — the registry TagsInput as a web component.
 *
 * Form-associated: submits `name[]=val` per tag with its <form>.
 */
export class UipTagsInput extends LitElement {
  static formAssociated = true
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true }
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    value: { converter: stringListConverter },
    defaultValue: { attribute: 'default-value', converter: stringListConverter },
    placeholder: {},
    disabled: { type: Boolean, reflect: true },
    addOnKeys: { attribute: 'add-on-keys', converter: stringListConverter },
    addOnPaste: { type: Boolean, attribute: 'add-on-paste' },
    delimiter: {},
    unique: { converter: trueUnlessFalse },
    max: { type: Number },
    name: { reflect: true },
    draft: { state: true },
  }

  value: string[] = []
  defaultValue?: string[]
  placeholder = 'Add a tag...'
  disabled = false
  addOnKeys: string[] = ['Enter', ',']
  addOnPaste = false
  delimiter?: string
  unique = true
  max?: number
  name?: string
  private draft = ''

  private initialValue: string[] = []
  private internals = this.attachInternals()

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'tags-input')
    if (this.defaultValue !== undefined && this.getAttribute('value') === null) {
      this.value = [...this.defaultValue]
    }
    this.initialValue = [...this.value]
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has('value') || changed.has('name')) {
      if (!this.name) {
        this.internals.setFormValue(null)
      } else {
        const fd = new FormData()
        this.value.forEach((v) => fd.append(`${this.name}[]`, v))
        this.internals.setFormValue(fd)
      }
    }
  }

  formResetCallback() {
    this.commit([...this.initialValue])
  }

  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled
  }

  private get tags(): string[] {
    return Array.isArray(this.value) ? this.value : []
  }

  private get atMax(): boolean {
    return this.max !== undefined && this.tags.length >= this.max
  }

  private commit(next: string[]) {
    const capped = this.max !== undefined ? next.slice(0, this.max) : next
    this.value = capped
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
    this.dispatchEvent(new CustomEvent('value-change', { detail: { value: capped }, bubbles: true, composed: true }))
  }

  private addTag(raw: string) {
    const trimmed = raw.trim()
    if (!trimmed) return
    if (this.atMax) {
      this.draft = ''
      return
    }
    if (this.unique && this.tags.includes(trimmed)) {
      this.draft = ''
      return
    }
    this.commit([...this.tags, trimmed])
    this.draft = ''
  }

  private removeAt(index: number) {
    if (this.disabled) return
    this.commit(this.tags.filter((_, i) => i !== index))
  }

  private handleKeyDown(e: KeyboardEvent) {
    const commitKeys = this.delimiter ? [this.delimiter] : this.addOnKeys ?? ['Enter', ',']
    if (commitKeys.includes(e.key)) {
      e.preventDefault()
      this.addTag(this.draft)
    } else if (e.key === 'Backspace' && this.draft === '' && this.tags.length > 0) {
      this.removeAt(this.tags.length - 1)
    }
  }

  private handlePaste(e: ClipboardEvent) {
    if (!this.addOnPaste) return
    const text = e.clipboardData?.getData('text') ?? ''
    if (!text.trim()) return
    e.preventDefault()
    const tokens = text.split(/\s+/).map((t) => t.trim()).filter(Boolean)
    let next = [...this.tags]
    for (const token of tokens) {
      if (this.max !== undefined && next.length >= this.max) break
      if (this.unique && next.includes(token)) continue
      next.push(token)
    }
    this.commit(next)
    this.draft = ''
  }

  private focusInput() {
    if (!this.disabled) {
      this.renderRoot?.querySelector<HTMLInputElement>('input')?.focus()
    }
  }

  render() {
    const tags = this.tags

    return html`
      <div
        part="base"
        data-uipkge=""
        data-slot="tags-input"
        class=${cn(
          'border-input bg-background flex flex-wrap items-center gap-2 rounded-md border px-2 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none',
          'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          this.disabled && 'pointer-events-none opacity-50',
        )}
        @click=${this.focusInput}
      >
        ${tags.map(
          (tag, i) => html`
            <span
              key=${`${tag}-${i}`}
              data-uipkge=""
              data-slot="tags-input-item"
              class="bg-secondary data-[state=active]:ring-ring ring-offset-background flex h-5 items-center rounded-md data-[state=active]:ring-2 data-[state=active]:ring-offset-2"
            >
              <span data-slot="tags-input-item-text" class="rounded bg-transparent px-2 py-0.5 text-sm">
                ${tag}
              </span>
              <button
                type="button"
                aria-label=${`Remove ${tag}`}
                ?disabled=${this.disabled}
                data-slot="tags-input-item-delete"
                class="hover:text-foreground focus-visible:ring-ring mr-1 flex rounded bg-transparent focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none"
                @mousedown=${(e: MouseEvent) => e.preventDefault()}
                @click=${(e: MouseEvent) => {
                  e.stopPropagation()
                  this.removeAt(i)
                }}
              >
                ${icon(X, 'x', 'h-4 w-4')}
              </button>
            </span>
          `,
        )}

        ${!this.disabled
          ? html`
              <input
                data-slot="tags-input-input"
                .value=${live(this.draft)}
                placeholder=${this.atMax ? nothing : this.placeholder}
                ?disabled=${this.atMax}
                class="min-h-5 flex-1 bg-transparent px-1 text-sm focus:outline-none disabled:cursor-default"
                @input=${(e: Event) => (this.draft = (e.target as HTMLInputElement).value)}
                @keydown=${this.handleKeyDown}
                @paste=${this.handlePaste}
                @blur=${() => this.addTag(this.draft)}
              />
            `
          : nothing}
      </div>
    `
  }
}

customElements.get('uip-tags-input') || customElements.define('uip-tags-input', UipTagsInput)

declare global {
  interface HTMLElementTagNameMap {
    'uip-tags-input': UipTagsInput
  }
}
