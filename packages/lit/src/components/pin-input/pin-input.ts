import { LitElement, css, html, nothing, type PropertyValues } from 'lit'
import { live } from 'lit/directives/live.js'
import { Minus } from 'lucide'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { icon } from '../../lib/icon'

type PinInputStatus = 'error' | 'warning' | 'success' | 'default'
type PinInputSize = 'sm' | 'md' | 'lg'

const sizeClassMap: Record<PinInputSize, string> = {
  sm: 'h-8 w-8 text-sm',
  lg: 'h-12 w-12 text-xl',
  md: 'h-10 w-10 text-base',
}

const statusClassMap: Record<PinInputStatus, string> = {
  error: 'border-destructive focus-within:border-destructive focus-within:ring-destructive/40 text-destructive',
  warning: 'border-warning focus-within:border-warning focus-within:ring-warning/40 text-warning',
  success: 'border-success focus-within:border-success focus-within:ring-success/40 text-success',
  default: '',
}

// React's injected @keyframes, played with the Web Animations API (no custom CSS).
const POP_EASE = 'cubic-bezier(0.22, 1.25, 0.36, 1)'
const slotPop: Keyframe[] = [
  { transform: 'scale(1)', zIndex: 1 },
  { transform: 'scale(1.06)', zIndex: 1, offset: 0.4 },
  { transform: 'scale(1)', zIndex: 1 },
]
const charPop: Keyframe[] = [
  { opacity: 0.55, transform: 'scale(0.88)' },
  { opacity: 1, transform: 'scale(1.06)', offset: 0.55 },
  { opacity: 1, transform: 'scale(1)' },
]
const shake: Keyframe[] = [
  { transform: 'translateX(0)' },
  { transform: 'translateX(-5px)', offset: 0.2 },
  { transform: 'translateX(5px)', offset: 0.4 },
  { transform: 'translateX(-3px)', offset: 0.6 },
  { transform: 'translateX(3px)', offset: 0.8 },
  { transform: 'translateX(0)' },
]

/** Layout marker: a run of slots (React `PinInputGroup`). Read by <uip-pin-input>, not rendered. */
export class UipPinInputGroup extends HTMLElement {}
/** Layout marker: one slot (React `PinInputSlot`); `index`, optional `mask` override. */
export class UipPinInputSlot extends HTMLElement {}
/** Layout marker: a separator (React `PinInputSeparator`); its children replace the default minus icon. */
export class UipPinInputSeparator extends HTMLElement {}

type Part =
  | { kind: 'group'; slots: { index: number; mask?: boolean }[] }
  | { kind: 'separator'; el: UipPinInputSeparator; custom: boolean }

/**
 * <uip-pin-input> — the registry PinInput (input-otp) as ONE web component.
 *
 * One real <input> (transparent, over the slots — input-otp's model) owns the value,
 * so auto-advance, backspace, arrow keys, paste and SMS autofill (`autocomplete=one-time-code`)
 * all work, and the slots are just the visible rendering.
 *
 * Layout: with no children, one group of `max-length` slots. For React's composed layout
 * add marker children (read, not rendered — like <option> in <uip-select>):
 *
 *   <uip-pin-input max-length="6">
 *     <uip-pin-input-group><uip-pin-input-slot index="0"></uip-pin-input-slot>…</uip-pin-input-group>
 *     <uip-pin-input-separator></uip-pin-input-separator>
 *     <uip-pin-input-group>…</uip-pin-input-group>
 *   </uip-pin-input>
 *
 * Props: `value`, `max-length` (6), `mask`, `status`, `size` ('sm' | 'md' | 'lg'), `disabled`,
 * `pattern` (regex source), `autocomplete`, `inputmode` (native attribute; default numeric),
 * `name`, `required`.
 *
 * Events (bubble, composed): `input` and `change` on every edit (React `onChange`),
 * `complete` (detail: string) once every slot is filled (React `onComplete`).
 * Form-associated: submits `name=value`; `required` = every slot filled.
 */
export class UipPinInput extends LitElement {
  static formAssociated = true
  static shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
    slotAssignment: 'manual',
  }
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: inline-block; }`]

  static properties = {
    value: {},
    maxLength: { type: Number, attribute: 'max-length' },
    mask: { type: Boolean, reflect: true },
    status: { reflect: true },
    size: { reflect: true },
    disabled: { type: Boolean, reflect: true },
    pattern: {},
    autocomplete: {},
    name: { reflect: true },
    required: { type: Boolean, reflect: true },
    accessibleLabel: { attribute: 'aria-label' },
    parts: { state: true },
    focused: { state: true },
    mss: { state: true },
    mse: { state: true },
  }

  value = ''
  maxLength = 6
  mask = false
  status: PinInputStatus = 'default'
  size: PinInputSize = 'md'
  disabled = false
  pattern?: string
  autocomplete?: string
  name?: string
  required = false
  accessibleLabel?: string
  private parts: Part[] = []
  private focused = false
  private mss: number | null = null
  private mse: number | null = null

  private defaultValue = ''
  private popping = new Set<number>()
  private shakeNext = false
  private internals = this.attachInternals()
  private childObserver?: MutationObserver

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'pin-input')
    this.defaultValue = this.value
    this.readParts()
    this.childObserver = new MutationObserver(() => this.readParts())
    this.childObserver.observe(this, { childList: true, subtree: true, attributes: true, attributeFilter: ['index', 'mask'] })
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.childObserver?.disconnect()
  }

  private readParts() {
    const parts: Part[] = []
    for (const el of this.children) {
      if (el.localName === 'uip-pin-input-group') {
        parts.push({
          kind: 'group',
          slots: [...el.querySelectorAll('uip-pin-input-slot')].map((s) => ({
            index: Number(s.getAttribute('index') ?? 0),
            mask: s.hasAttribute('mask') ? s.getAttribute('mask') !== 'false' : undefined,
          })),
        })
      } else if (el.localName === 'uip-pin-input-separator') {
        parts.push({ kind: 'separator', el: el as UipPinInputSeparator, custom: el.childNodes.length > 0 })
      }
    }
    this.parts = parts
  }

  private get layout(): Part[] {
    if (this.parts.some((p) => p.kind === 'group')) return this.parts
    return [{ kind: 'group', slots: Array.from({ length: this.maxLength }, (_, index) => ({ index })) }]
  }

  private get input() {
    return this.renderRoot?.querySelector<HTMLInputElement>('input')
  }

  protected willUpdate(changed: PropertyValues<this>) {
    if (changed.has('value')) {
      const prev = (changed.get('value') as string | undefined) ?? ''
      if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength)
      if (this.hasUpdated) {
        for (let i = 0; i < this.value.length; i++) if (this.value[i] !== prev[i]) this.popping.add(i)
      }
    }
    // One-shot shake when status transitions into error (not on mount).
    if (changed.has('status') && this.hasUpdated && this.status === 'error' && changed.get('status') !== 'error') {
      this.shakeNext = true
    }
    if (changed.has('value') || changed.has('required') || changed.has('maxLength')) {
      this.internals.setFormValue(this.value || null)
      if (this.required && !this.value) {
        this.internals.setValidity({ valueMissing: true }, 'Please fill in this field.', this.input ?? undefined)
      } else if (this.required && this.value.length < this.maxLength) {
        this.internals.setValidity({ tooShort: true }, `Please enter all ${this.maxLength} characters.`, this.input ?? undefined)
      } else this.internals.setValidity({})
    }
  }

  protected updated() {
    const custom = this.renderRoot.querySelectorAll<HTMLSlotElement>('slot[data-separator]')
    const seps = this.layout.filter((p): p is Extract<Part, { kind: 'separator' }> => p.kind === 'separator' && p.custom)
    custom.forEach((slot, i) => seps[i] && slot.assign(seps[i].el))

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (this.popping.size && !reduce) {
      for (const i of this.popping) {
        const slot = this.renderRoot.querySelector<HTMLElement>(`[data-slot=pin-input-slot][data-index="${i}"]`)
        slot?.animate(slotPop, { duration: 200, easing: POP_EASE })
        slot?.firstElementChild?.animate(charPop, { duration: 200, easing: POP_EASE })
      }
    }
    this.popping.clear()
    if (this.shakeNext && !reduce) {
      this.renderRoot
        .querySelector('[data-input-otp-container]')
        ?.animate(shake, { duration: 380, easing: 'cubic-bezier(0.36, 0.07, 0.19, 0.97)' })
    }
    this.shakeNext = false
  }

  // --- form callbacks -------------------------------------------------------
  formResetCallback() {
    this.value = this.defaultValue
  }
  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled
  }

  // --- selection model (input-otp): one character selected, or the caret after the last ---
  private select(p: number) {
    const input = this.input
    if (!input) return
    const len = this.value.length
    const max = this.maxLength
    let start: number
    let end: number
    if (len >= max && p >= max - 1) [start, end] = [max - 1, max]
    else if (p < len) [start, end] = [Math.max(0, p), Math.max(0, p) + 1]
    else [start, end] = [len, len]
    input.setSelectionRange(start, end)
    this.mss = start
    this.mse = end
  }

  private commit(next: string) {
    if (next === this.value) return
    this.value = next
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
    if (next.length === this.maxLength) {
      this.dispatchEvent(new CustomEvent('complete', { detail: next, bubbles: true, composed: true }))
    }
  }

  private fitsPattern(v: string) {
    if (!this.pattern || !v.length) return true
    try {
      return new RegExp(this.pattern).test(v)
    } catch {
      return true
    }
  }

  private onInput(e: Event) {
    // The inner input's own `input` event is composed; re-dispatch ours instead.
    e.stopPropagation()
    const input = e.target as HTMLInputElement
    const next = input.value.slice(0, this.maxLength)
    if (!this.fitsPattern(next)) {
      input.value = this.value
      this.select(this.mss ?? this.value.length)
      return
    }
    this.commit(next)
    this.select(input.selectionStart ?? next.length)
  }

  private onPaste(e: ClipboardEvent) {
    const input = e.target as HTMLInputElement
    const content = e.clipboardData?.getData('text/plain') ?? ''
    e.preventDefault()
    const start = input.selectionStart ?? this.value.length
    const end = input.selectionEnd ?? start
    const v = this.value
    const next = (start !== end ? v.slice(0, start) + content + v.slice(end) : v.slice(0, start) + content + v.slice(start)).slice(
      0,
      this.maxLength,
    )
    if (!this.fitsPattern(next)) return
    input.value = next
    this.commit(next)
    this.select(next.length)
  }

  private onKeyDown(e: KeyboardEvent) {
    const start = this.mss ?? 0
    const len = this.value.length
    let p: number
    switch (e.key) {
      case 'ArrowLeft':
        p = start - 1
        break
      case 'ArrowRight':
        p = start + 1
        break
      case 'Home':
      case 'ArrowUp':
        p = 0
        break
      case 'End':
      case 'ArrowDown':
        p = len
        break
      default:
        return
    }
    e.preventDefault()
    this.select(Math.max(0, Math.min(len, p)))
  }

  private onFocus() {
    this.focused = true
    this.select(this.value.length)
  }

  private onBlur() {
    this.focused = false
  }

  private renderSlot(index: number, maskOverride?: boolean) {
    const char = this.value[index] ?? null
    const { mss, mse } = this
    const isActive = this.focused && mss !== null && mse !== null && ((mss === mse && index === mss) || (index >= mss && index < mse))
    const effectiveMask = maskOverride ?? this.mask
    return html`<div
      data-uipkge=""
      data-slot="pin-input-slot"
      data-index=${index}
      ?data-active=${isActive}
      class=${cn(
        'border-input bg-background text-foreground relative -ml-px flex items-center justify-center border text-center shadow-xs outline-none first:ml-0 first:rounded-l-md last:rounded-r-md',
        'transition-[border-color,box-shadow,color,transform] duration-150 ease-out',
        'focus-within:border-ring focus-within:ring-ring/40 focus-within:relative focus-within:z-10 focus-within:ring-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        isActive && 'border-ring ring-ring/40 z-10 ring-2',
        sizeClassMap[this.size] ?? sizeClassMap.md,
        statusClassMap[this.status] ?? '',
      )}
    >
      ${char != null
        ? effectiveMask
          ? html`<span class="bg-foreground size-2 rounded-full"></span>`
          : html`<span>${char}</span>`
        : nothing}
    </div>`
  }

  render() {
    const inputMode = this.getAttribute('inputmode') ?? 'numeric'
    return html`<div
      part="container"
      data-input-otp-container
      translate="no"
      class=${cn(
        'flex items-center gap-2 has-disabled:opacity-50',
        // input-otp's container inline styles, as utilities.
        'relative select-none pointer-events-none',
        this.disabled ? 'cursor-default' : 'cursor-text',
      )}
    >
      ${this.layout.map((part) =>
        part.kind === 'group'
          ? html`<div data-uipkge="" data-slot="pin-input-group" class="flex items-center">
              ${part.slots.map((s) => this.renderSlot(s.index, s.mask))}
            </div>`
          : html`<div data-uipkge="" data-slot="pin-input-separator" role="separator">
              ${part.custom ? html`<slot data-separator></slot>` : icon(Minus, 'minus')}
            </div>`,
      )}
      <div class="absolute inset-0 pointer-events-none">
        <input
          part="input"
          data-uipkge=""
          data-slot="pin-input"
          data-status=${this.status === 'default' ? nothing : this.status}
          data-input-otp="true"
          ?data-input-otp-placeholder-shown=${this.value.length === 0}
          data-input-otp-mss=${this.mss ?? nothing}
          data-input-otp-mse=${this.mse ?? nothing}
          autocomplete=${this.autocomplete ?? 'one-time-code'}
          inputmode=${inputMode}
          pattern=${this.pattern ?? nothing}
          maxlength=${this.maxLength}
          spellcheck="false"
          aria-label=${this.accessibleLabel ?? nothing}
          aria-required=${this.required ? 'true' : nothing}
          ?disabled=${this.disabled}
          .value=${live(this.value)}
          class=${cn(
            'disabled:cursor-not-allowed',
            // input-otp's input inline styles, as utilities.
            'absolute inset-0 flex h-full w-full border-0 border-solid border-transparent bg-transparent text-left font-mono text-[length:var(--root-height,16px)] leading-none tracking-[-.5em] text-transparent tabular-nums caret-transparent opacity-100 shadow-none outline-0 outline-transparent pointer-events-auto',
          )}
          @input=${this.onInput}
          @paste=${this.onPaste}
          @keydown=${this.onKeyDown}
          @focus=${this.onFocus}
          @blur=${this.onBlur}
          @click=${() => this.select(this.value.length)}
        />
      </div>
    </div>`
  }
}

customElements.get('uip-pin-input-group') || customElements.define('uip-pin-input-group', UipPinInputGroup)
customElements.get('uip-pin-input-slot') || customElements.define('uip-pin-input-slot', UipPinInputSlot)
customElements.get('uip-pin-input-separator') || customElements.define('uip-pin-input-separator', UipPinInputSeparator)
customElements.get('uip-pin-input') || customElements.define('uip-pin-input', UipPinInput)

declare global {
  interface HTMLElementTagNameMap {
    'uip-pin-input': UipPinInput
    'uip-pin-input-group': UipPinInputGroup
    'uip-pin-input-slot': UipPinInputSlot
    'uip-pin-input-separator': UipPinInputSeparator
  }
}
