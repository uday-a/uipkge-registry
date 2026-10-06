import {
  type AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  booleanAttribute,
  effect,
  forwardRef,
  inject,
  signal,
  untracked,
  ChangeDetectionStrategy,
} from '@angular/core'
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms'
import { cn } from '@/lib/utils'

export type MaskTokens = Record<string, RegExp>

export interface MaskedInputValidatePayload {
  isValid: boolean
  isComplete: boolean
  rawValue: string
  maskedValue: string
}

const DEFAULT_TOKENS: MaskTokens = {
  '#': /^[0-9]$/,
  A: /^[a-zA-Z]$/,
  '*': /^[a-zA-Z0-9]$/,
}

/**
 * Angular port of the React MaskedInput. `<ui-masked-input>` is React's
 * `relative w-full` wrapper (data-slot="masked-input-wrapper") around the fully styled
 * native input and the role=alert error line.
 *
 * Mask engine as React: `replacement` (or token) chars in `mask` are editable slots, the
 * rest are literals; keystrokes that do not match the slot's token are blocked, Backspace /
 * Delete skip literals, arrows jump between slots, paste is filtered slot by slot, and the
 * caret is placed after every edit. With a `placeholder` the mask only shows while focused.
 *
 * Model is React's `value` / `defaultValue` / `valueChange` (React `onValueChange`, the
 * masked string); `complete` fires once every slot is filled, `validation` (React
 * `onValidate`) reports validity. NG_VALUE_ACCESSOR is provided for formControl / ngModel.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-masked-input',
  standalone: true,
  exportAs: 'uiMaskedInput',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiMaskedInputComponent), multi: true }],
  host: {
    '[attr.class]': '"block relative w-full"',
    'data-slot': 'masked-input-wrapper',
    // These belong to the native <input>.
    '[attr.id]': 'null',
    '[attr.placeholder]': 'null',
    '[attr.aria-label]': 'null',
    '[attr.aria-describedby]': 'null',
  },
  template: `
    <input
      #inputEl
      [value]="displayValue"
      [attr.placeholder]="placeholder ?? null"
      data-uipkge="true"
      data-slot="masked-input"
      [disabled]="disabled"
      [readOnly]="readOnly"
      [attr.aria-invalid]="isInvalid ? 'true' : null"
      [attr.id]="id ?? null"
      [attr.name]="name ?? null"
      [attr.autocomplete]="autoComplete ?? null"
      [attr.inputmode]="inputMode ?? null"
      [attr.aria-label]="ariaLabel ?? null"
      [attr.aria-describedby]="ariaDescribedby ?? null"
      [required]="required"
      [class]="inputClass"
      (input)="handleInput($event)"
      (keydown)="handleKeyDown($event)"
      (focus)="handleFocus($event)"
      (blur)="handleBlur($event)"
      (paste)="handlePaste($event)"
    />
    @if (displayErrorMessage) {
      <p data-slot="masked-input-error" class="text-destructive mt-1.5 text-xs font-medium" role="alert">
        {{ displayErrorMessage }}
      </p>
    }
  `,
})
export class UiMaskedInputComponent implements ControlValueAccessor, AfterViewChecked {
  // Zoneless-safe: form writes happen outside template events, so schedule a repaint.
  private readonly cdr = inject(ChangeDetectorRef)
  @ViewChild('inputEl', { static: true }) inputEl!: ElementRef<HTMLInputElement>

  private readonly _valueProp = signal<string | undefined>(undefined)
  private readonly _internal = signal<string | null>(null)
  readonly isFocused = signal(false)

  /** Controlled masked value (React `value`, e.g. `(212) 555-____`). Reading returns the current value. */
  @Input()
  set value(v: string | null | undefined) {
    this._valueProp.set(v === undefined ? undefined : (v ?? ''))
  }
  get value(): string {
    return this.modelValue
  }
  @Input() defaultValue?: string
  /** React `onValueChange`: the masked string on every edit. */
  @Output() valueChange = new EventEmitter<string>()
  /** React `onComplete`: the masked string once every editable slot is filled. */
  @Output() complete = new EventEmitter<string>()
  /** React `onValidate` (renamed: `validate` is the validator input, as in React). */
  @Output() validation = new EventEmitter<MaskedInputValidatePayload>()

  /** Mask template -- `replacement` chars are editable, everything else is literal. */
  @Input() mask = ''
  @Input() replacement = '#'
  @Input() tokens?: MaskTokens
  @Input() placeholderChar = '_'
  @Input() placeholder?: string
  @Input({ transform: booleanAttribute }) showMask = true
  @Input({ transform: booleanAttribute }) invalid = false
  @Input() error?: string | boolean
  @Input() errorMessage?: string
  /** Custom validation (React `validate` prop): true / false / an error message. */
  @Input() validate?: (masked: string, raw: string) => boolean | string
  @Input({ transform: booleanAttribute }) disabled = false
  @Input({ transform: booleanAttribute }) readOnly = false
  /** Lower-case HTML spelling of `readOnly`. */
  @Input({ alias: 'readonly', transform: booleanAttribute }) set readonlyAlias(v: boolean) {
    this.readOnly = v
  }
  @Input({ transform: booleanAttribute }) required = false
  @Input() id?: string
  @Input() name?: string
  @Input() autoComplete?: string
  @Input() inputMode?: string
  @Input('aria-label') ariaLabel?: string
  @Input('aria-describedby') ariaDescribedby?: string
  @Input('class') className?: string
  @Output('focus') focusEvent = new EventEmitter<FocusEvent>()
  @Output('blur') blurEvent = new EventEmitter<FocusEvent>()

  private onChange: (v: string) => void = () => {}
  private onTouched: () => void = () => {}
  private lastValidateKey: string | null = null

  constructor() {
    // React effects: onComplete once complete (and on each edit while complete), onValidate on change.
    effect(() => {
      const current = this.modelValue
      untracked(() => {
        const complete = this.isComplete
        if (complete) this.complete.emit(current)
        const payload: MaskedInputValidatePayload = {
          isValid: !this.isInvalid,
          isComplete: complete,
          rawValue: this.unmask(current),
          maskedValue: current,
        }
        const key = JSON.stringify(payload)
        if (key !== this.lastValidateKey) {
          this.lastValidateKey = key
          this.validation.emit(payload)
        }
      })
    })
  }

  get isControlled(): boolean {
    return this._valueProp() !== undefined
  }
  /** The current masked string (React `modelValue`). */
  get modelValue(): string {
    return this._valueProp() ?? this._internal() ?? this.defaultValue ?? ''
  }

  private get activeTokens(): MaskTokens {
    return { ...DEFAULT_TOKENS, ...(this.tokens ?? {}) }
  }

  private get editableSlots(): Array<{ index: number; tokenChar: string }> {
    const tokens = this.activeTokens
    const slots: Array<{ index: number; tokenChar: string }> = []
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

  private isValidCharForSlot(char: string, slotIndex: number): boolean {
    const slot = this.editableSlots[slotIndex]
    const tokens = this.activeTokens
    const regex = !slot ? /.*/ : (tokens[slot.tokenChar] ?? tokens[this.replacement] ?? /.*/)
    return regex.test(char)
  }

  unmask(val: string): string {
    let result = ''
    let slotIndex = 0
    const max = this.maxLength
    for (const char of val) {
      if (char === this.placeholderChar || char === ' ') continue
      if (slotIndex < max && this.isValidCharForSlot(char, slotIndex)) {
        result += char
        slotIndex++
      }
    }
    return result
  }

  applyMask(rawValue: string, focused = this.isFocused()): string {
    const positions = this.editablePositions
    let result = ''
    let rawIndex = 0
    for (let i = 0; i < this.mask.length; i++) {
      if (positions.includes(i)) {
        const slotIdx = positions.indexOf(i)
        if (rawIndex < rawValue.length && this.isValidCharForSlot(rawValue[rawIndex]!, slotIdx)) {
          result += rawValue[rawIndex]
          rawIndex++
        } else if (this.showMask && (focused || !this.placeholder || this.modelValue)) {
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

  get isComplete(): boolean {
    return this.unmask(this.modelValue).length === this.maxLength
  }

  get validationError(): string | null {
    if (!this.validate) return null
    const current = this.modelValue
    const res = this.validate(current, this.unmask(current))
    if (typeof res === 'string') return res
    if (res === false) return 'Invalid format'
    return null
  }

  get isInvalid(): boolean {
    const e = this.error
    return Boolean(this.invalid || e === true || (typeof e === 'string' && e.length > 0) || this.validationError)
  }

  get displayErrorMessage(): string | null | undefined {
    const e = this.error
    return typeof e === 'string' && e.length > 0 ? e : this.errorMessage || this.validationError
  }

  get displayValue(): string {
    const mv = this.modelValue
    return !mv && !this.isFocused() && this.placeholder ? '' : !mv && !this.showMask ? '' : mv
  }

  get inputClass(): string {
    return cn(
      'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
      'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
      this.isInvalid &&
        'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20 text-destructive',
      this.className,
    )
  }

  private getNextEditablePos(currentPos: number): number {
    const positions = this.editablePositions
    for (const pos of positions) if (pos >= currentPos) return pos
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
    const positions = this.editablePositions
    let rawIndex = 0
    for (let i = 0; i < cursorPos && i < this.mask.length; i++) if (positions.includes(i)) rawIndex++
    return rawIndex
  }

  private findCursorPosFromRaw(rawIndex: number): number {
    const positions = this.editablePositions
    if (rawIndex >= positions.length) return this.mask.length
    return positions[rawIndex] ?? this.mask.length
  }

  private setCaret(pos: number): void {
    requestAnimationFrame(() => this.inputEl?.nativeElement.setSelectionRange(pos, pos))
  }

  private updateValue(next: string): void {
    if (!this.isControlled) this._internal.set(next)
    this.onChange(next)
    this.valueChange.emit(next)
  }

  handleInput(event: Event): void {
    const target = event.target as HTMLInputElement
    const oldValue = this.modelValue
    const cursorPos = target.selectionStart ?? 0
    const rawNew = this.unmask(target.value)
    const rawOld = this.unmask(oldValue)
    const clampedRaw = rawNew.slice(0, this.maxLength)
    const masked = this.applyMask(clampedRaw)

    let newCursorPos: number
    if (clampedRaw.length > rawOld.length) {
      newCursorPos = this.getNextEditablePos(this.findCursorPosFromRaw(clampedRaw.length - 1) + 1)
    } else if (clampedRaw.length < rawOld.length) {
      newCursorPos = this.getPrevEditablePos(cursorPos) + 1
    } else {
      newCursorPos = cursorPos
    }
    this.updateValue(masked)
    this.setCaret(newCursorPos)
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.defaultPrevented) return
    const cursorPos = (event.currentTarget as HTMLInputElement).selectionStart ?? 0

    // Block a non-matching character immediately on keystroke.
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const rawIndex = this.findRawIndexAtCursor(cursorPos)
      if (rawIndex >= this.maxLength || !this.isValidCharForSlot(event.key, rawIndex)) {
        event.preventDefault()
        return
      }
    }

    if (event.key === 'Backspace') {
      const raw = this.unmask(this.modelValue)
      const rawIndex = this.findRawIndexAtCursor(cursorPos)
      if (rawIndex > 0) {
        this.updateValue(this.applyMask(raw.slice(0, rawIndex - 1) + raw.slice(rawIndex)))
        this.setCaret(this.findCursorPosFromRaw(rawIndex - 1))
      }
      event.preventDefault()
    } else if (event.key === 'Delete') {
      const raw = this.unmask(this.modelValue)
      const rawIndex = this.findRawIndexAtCursor(cursorPos)
      if (rawIndex < raw.length) {
        this.updateValue(this.applyMask(raw.slice(0, rawIndex) + raw.slice(rawIndex + 1)))
        this.setCaret(this.findCursorPosFromRaw(rawIndex))
      }
      event.preventDefault()
    } else if (event.key === 'ArrowLeft') {
      this.setCaret(this.getPrevEditablePos(cursorPos))
      event.preventDefault()
    } else if (event.key === 'ArrowRight') {
      this.setCaret(this.getNextEditablePos(cursorPos + 1))
      event.preventDefault()
    }
  }

  handlePaste(event: ClipboardEvent): void {
    if (event.defaultPrevented) return
    event.preventDefault()
    const pasted = event.clipboardData?.getData('text') ?? ''
    const raw = this.unmask(this.modelValue)
    const rawIndex = this.findRawIndexAtCursor(this.inputEl?.nativeElement.selectionStart ?? 0)
    let filtered = ''
    let slot = rawIndex
    for (const char of pasted) {
      if (slot < this.maxLength && this.isValidCharForSlot(char, slot)) {
        filtered += char
        slot++
      }
    }
    const newRaw = (raw.slice(0, rawIndex) + filtered + raw.slice(rawIndex)).slice(0, this.maxLength)
    this.updateValue(this.applyMask(newRaw))
    this.setCaret(this.findCursorPosFromRaw(Math.min(rawIndex + filtered.length, this.maxLength)))
  }

  handleFocus(event: FocusEvent): void {
    this.isFocused.set(true)
    if (!this.modelValue && this.showMask) this.updateValue(this.applyMask('', true))
    this.setCaret(this.editablePositions[0] ?? 0)
    this.focusEvent.emit(event)
  }

  handleBlur(event: FocusEvent): void {
    this.isFocused.set(false)
    this.onTouched()
    this.blurEvent.emit(event)
  }

  /** The [value] binding misses edits that mask back to the previous string; sync the DOM. */
  ngAfterViewChecked(): void {
    const el = this.inputEl?.nativeElement
    if (el && el.value !== this.displayValue) el.value = this.displayValue
  }

  writeValue(v: string | null): void {
    this._internal.set(v ?? '')
    this.cdr.markForCheck()
  }

  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled
    this.cdr.markForCheck()
  }
}
