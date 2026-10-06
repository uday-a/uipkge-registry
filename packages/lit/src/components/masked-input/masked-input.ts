import { LitElement, css, html, nothing } from 'lit'
import { live } from 'lit/directives/live.js'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

export type MaskTokens = Record<string, RegExp>

const DEFAULT_TOKENS: MaskTokens = {
  '#': /^[0-9]$/,
  A: /^[a-zA-Z]$/,
  '*': /^[a-zA-Z0-9]$/,
}

const trueUnlessFalse = {
  fromAttribute: (v: string | null) => v !== 'false',
}

/**
 * <uip-masked-input> — the registry MaskedInput as a web component.
 *
 * Form-associated: submits `name=value` with its <form>.
 */
export class UipMaskedInput extends LitElement {
  static formAssociated = true
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true }
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    value: { reflect: true },
    defaultValue: { attribute: 'default-value' },
    mask: {},
    replacement: {},
    tokens: { type: Object },
    placeholderChar: { attribute: 'placeholder-char' },
    placeholder: {},
    showMask: { converter: trueUnlessFalse, attribute: 'show-mask' },
    invalid: { type: Boolean, reflect: true },
    errorMessage: { attribute: 'error-message' },
    disabled: { type: Boolean, reflect: true },
    readOnly: { type: Boolean, attribute: 'readonly', reflect: true },
    name: { reflect: true },
    accessibleLabel: { attribute: 'aria-label' },
    isFocused: { state: true },
  }

  value = ''
  defaultValue?: string
  mask = ''
  replacement = '#'
  tokens?: MaskTokens
  placeholderChar = '_'
  placeholder?: string
  showMask = true
  invalid = false
  errorMessage?: string
  disabled = false
  readOnly = false
  name?: string
  accessibleLabel?: string

  private isFocused = false
  private initialValue = ''
  private internals = this.attachInternals()

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'masked-input')
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
    this.value = this.initialValue
    this.updateValue(this.initialValue)
  }

  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled
  }

  private get activeTokens(): MaskTokens {
    return { ...DEFAULT_TOKENS, ...(this.tokens ?? {}) }
  }

  private get editableSlots(): Array<{ index: number; tokenChar: string }> {
    const slots: Array<{ index: number; tokenChar: string }> = []
    const tokens = this.activeTokens
    for (let i = 0; i < this.mask.length; i++) {
      const char = this.mask[i]!
      if (char === this.replacement || tokens[char]) {
        slots.push({ index: i, tokenChar: char === this.replacement ? this.replacement : char })
      }
    }
    return slots
  }

  private get editablePositions(): number[] {
    return this.editableSlots.map((s) => s.index)
  }

  private get maxLength(): number {
    return this.editablePositions.length
  }

  private getSlotPattern(slotIndex: number): RegExp {
    const slot = this.editableSlots[slotIndex]
    if (!slot) return /.*/
    const tokens = this.activeTokens
    return tokens[slot.tokenChar] ?? tokens[this.replacement] ?? /.*/
  }

  private isValidCharForSlot(char: string, slotIndex: number): boolean {
    const regex = this.getSlotPattern(slotIndex)
    return regex.test(char)
  }

  private unmask(val: string): string {
    let result = ''
    let slotIndex = 0
    for (const char of val) {
      if (char === this.placeholderChar || char === ' ') continue
      if (slotIndex < this.maxLength && this.isValidCharForSlot(char, slotIndex)) {
        result += char
        slotIndex++
      }
    }
    return result
  }

  private applyMask(rawValue: string): string {
    let result = ''
    let rawIndex = 0
    const positions = this.editablePositions
    for (let i = 0; i < this.mask.length; i++) {
      const isEditable = positions.includes(i)
      if (isEditable) {
        const slotIdx = positions.indexOf(i)
        if (rawIndex < rawValue.length && this.isValidCharForSlot(rawValue[rawIndex]!, slotIdx)) {
          result += rawValue[rawIndex]
          rawIndex++
        } else if (this.showMask && (this.isFocused || !this.placeholder || this.value)) {
          result += this.placeholderChar
        } else {
          break
        }
      } else {
        result += this.mask[i]
      }
    }
    return result
  }

  private getNextEditablePos(currentPos: number): number {
    const positions = this.editablePositions
    for (const pos of positions) {
      if (pos >= currentPos) return pos
    }
    return positions[positions.length - 1] ?? this.mask.length
  }

  private getPrevEditablePos(currentPos: number): number {
    const positions = this.editablePositions
    for (let i = positions.length - 1; i >= 0; i--) {
      const p = positions[i]
      if (p !== undefined && p < currentPos) return p
    }
    return positions[0] ?? 0
  }

  private findRawIndexAtCursor(cursorPos: number): number {
    let rawIndex = 0
    const positions = this.editablePositions
    for (let i = 0; i < cursorPos && i < this.mask.length; i++) {
      if (positions.includes(i)) rawIndex++
    }
    return rawIndex
  }

  private findCursorPosFromRaw(rawIndex: number): number {
    const positions = this.editablePositions
    if (rawIndex >= positions.length) return this.mask.length
    return positions[rawIndex] ?? this.mask.length
  }

  private updateValue(next: string) {
    const prev = this.value
    this.value = next
    if (next !== prev) {
      this.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
      this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
      this.dispatchEvent(new CustomEvent('value-change', { detail: { value: next }, bubbles: true, composed: true }))

      const raw = this.unmask(next)
      const complete = raw.length === this.maxLength
      if (complete) {
        this.dispatchEvent(new CustomEvent('complete', { detail: { value: next }, bubbles: true, composed: true }))
      }
      this.dispatchEvent(
        new CustomEvent('validate', {
          detail: {
            isValid: !this.invalid,
            isComplete: complete,
            rawValue: raw,
            maskedValue: next,
          },
          bubbles: true,
          composed: true,
        }),
      )
    }
  }

  private get input(): HTMLInputElement | null {
    return this.renderRoot?.querySelector('input')
  }

  private handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    const oldValue = this.value ?? ''
    const newValue = target.value
    const cursorPos = target.selectionStart ?? 0

    const rawNew = this.unmask(newValue)
    const rawOld = this.unmask(oldValue)
    const clampedRaw = rawNew.slice(0, this.maxLength)
    const masked = this.applyMask(clampedRaw)

    let newCursorPos: number
    if (clampedRaw.length > rawOld.length) {
      const addedIndex = clampedRaw.length - 1
      newCursorPos = this.findCursorPosFromRaw(addedIndex) + 1
      newCursorPos = this.getNextEditablePos(newCursorPos)
    } else if (clampedRaw.length < rawOld.length) {
      newCursorPos = this.getPrevEditablePos(cursorPos) + 1
    } else {
      newCursorPos = cursorPos
    }

    this.updateValue(masked)

    requestAnimationFrame(() => {
      this.input?.setSelectionRange(newCursorPos, newCursorPos)
    })
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    const target = event.currentTarget as HTMLInputElement
    const cursorPos = target.selectionStart ?? 0

    // Block non-matching character immediately on keystroke
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const rawIndex = this.findRawIndexAtCursor(cursorPos)
      if (rawIndex >= this.maxLength || !this.isValidCharForSlot(event.key, rawIndex)) {
        event.preventDefault()
        return
      }
    }

    if (event.key === 'Backspace') {
      const raw = this.unmask(this.value ?? '')
      const rawIndex = this.findRawIndexAtCursor(cursorPos)
      if (rawIndex > 0) {
        const newRaw = raw.slice(0, rawIndex - 1) + raw.slice(rawIndex)
        const masked = this.applyMask(newRaw)
        this.updateValue(masked)
        const newPos = this.findCursorPosFromRaw(rawIndex - 1)
        requestAnimationFrame(() => {
          this.input?.setSelectionRange(newPos, newPos)
        })
      }
      event.preventDefault()
    } else if (event.key === 'Delete') {
      const raw = this.unmask(this.value ?? '')
      const rawIndex = this.findRawIndexAtCursor(cursorPos)
      if (rawIndex < raw.length) {
        const newRaw = raw.slice(0, rawIndex) + raw.slice(rawIndex + 1)
        const masked = this.applyMask(newRaw)
        this.updateValue(masked)
        const newPos = this.findCursorPosFromRaw(rawIndex)
        requestAnimationFrame(() => {
          this.input?.setSelectionRange(newPos, newPos)
        })
      }
      event.preventDefault()
    } else if (event.key === 'ArrowLeft') {
      const newPos = this.getPrevEditablePos(cursorPos)
      requestAnimationFrame(() => {
        this.input?.setSelectionRange(newPos, newPos)
      })
      event.preventDefault()
    } else if (event.key === 'ArrowRight') {
      const newPos = this.getNextEditablePos(cursorPos + 1)
      requestAnimationFrame(() => {
        this.input?.setSelectionRange(newPos, newPos)
      })
      event.preventDefault()
    }
  }

  private handlePaste = (event: ClipboardEvent) => {
    event.preventDefault()
    const pasted = event.clipboardData?.getData('text') ?? ''
    const raw = this.unmask(this.value ?? '')
    const cursorPos = this.input?.selectionStart ?? 0
    const rawIndex = this.findRawIndexAtCursor(cursorPos)

    let filteredPasted = ''
    let currSlot = rawIndex
    for (const char of pasted) {
      if (currSlot < this.maxLength && this.isValidCharForSlot(char, currSlot)) {
        filteredPasted += char
        currSlot++
      }
    }

    const newRaw = (raw.slice(0, rawIndex) + filteredPasted + raw.slice(rawIndex)).slice(0, this.maxLength)
    const masked = this.applyMask(newRaw)
    this.updateValue(masked)

    const newPos = this.findCursorPosFromRaw(Math.min(rawIndex + filteredPasted.length, this.maxLength))
    requestAnimationFrame(() => {
      this.input?.setSelectionRange(newPos, newPos)
    })
  }

  private handleFocus = () => {
    this.isFocused = true
    if (!this.value && this.showMask) {
      this.updateValue(this.applyMask(''))
    }
    requestAnimationFrame(() => {
      const firstEditable = this.editablePositions[0] ?? 0
      this.input?.setSelectionRange(firstEditable, firstEditable)
    })
  }

  private handleBlur = () => {
    this.isFocused = false
  }

  render() {
    const displayValue =
      !this.value && !this.isFocused && this.placeholder
        ? ''
        : !this.value && !this.showMask
          ? ''
          : (this.value ?? '')

    const isInvalid = this.invalid

    return html`
      <div part="base" class="relative w-full" data-slot="masked-input-wrapper">
        <input
          part="input"
          .value=${live(displayValue)}
          placeholder=${this.placeholder ?? nothing}
          data-uipkge=""
          data-slot="masked-input"
          name=${this.name ?? nothing}
          ?disabled=${this.disabled}
          ?readonly=${this.readOnly}
          aria-invalid=${isInvalid ? 'true' : nothing}
          aria-label=${this.accessibleLabel ?? nothing}
          class=${cn(
            'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
            isInvalid &&
              'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20 text-destructive',
          )}
          @input=${this.handleInput}
          @keydown=${this.handleKeyDown}
          @focus=${this.handleFocus}
          @blur=${this.handleBlur}
          @paste=${this.handlePaste}
        />
        ${this.errorMessage
          ? html`
              <p data-slot="masked-input-error" class="text-destructive mt-1.5 text-xs font-medium" role="alert">
                ${this.errorMessage}
              </p>
            `
          : nothing}
      </div>
    `
  }
}

customElements.get('uip-masked-input') || customElements.define('uip-masked-input', UipMaskedInput)

declare global {
  interface HTMLElementTagNameMap {
    'uip-masked-input': UipMaskedInput
  }
}
