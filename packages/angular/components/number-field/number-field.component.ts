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
  numberAttribute,
  forwardRef,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms'
import { cn } from '@/lib/utils'

export type NumberFieldSize = 'small' | 'middle' | 'large'
export type NumberFieldStatus = 'error' | 'warning'
export type NumberFieldControlsPosition = 'default' | 'right'

const decrementIncrementBase =
  'focus-visible:ring-ring inline-flex shrink-0 items-center justify-center transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-30'

function clamp(value: number, min?: number, max?: number): number {
  let next = value
  if (min !== undefined) next = Math.max(min, next)
  if (max !== undefined) next = Math.min(max, next)
  return next
}

function optionalNumber(v: unknown): number | undefined {
  return v === undefined || v === null || v === '' ? undefined : Number(v)
}

/**
 * Angular port of the React NumberField: one self-contained control -- the `<ui-number-field>`
 * host (`inline-flex`) wraps the content row with the decrement button, the input block
 * (prefix / role=spinbutton input / suffix) and the increment button. `controlsPosition="right"`
 * stacks both steppers in a grid on the right.
 *
 * Model is React's `value` / `defaultValue` / `valueChange` (React `onValueChange`, emits
 * `undefined` for an empty field). Typing is free text committed on blur / Enter through
 * `parser` (default Number) and clamped to min / max; the display goes through `formatter`,
 * or Intl with `formatOptions` / `precision`. Arrow / Page / Home / End step when `keyboard`,
 * and the wheel steps while focused. NG_VALUE_ACCESSOR is provided for formControl / ngModel.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-number-field',
  standalone: true,
  exportAs: 'uiNumberField',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiNumberFieldComponent), multi: true }],
  host: {
    'data-uipkge': '',
    'data-slot': 'number-field',
    '[class]': 'hostClass',
    // The id / aria-label belong to the native <input>.
    '[attr.id]': 'null',
    '[attr.aria-label]': 'null',
    '[attr.placeholder]': 'null',
  },
  template: `
    <div [class]="contentClasses">
      <button
        type="button"
        data-uipkge=""
        data-slot="decrement"
        tabindex="-1"
        aria-label="Decrease"
        [disabled]="decrementDisabled"
        [class]="decrementClass"
        (click)="handleDecrease()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          [attr.class]="iconClass('minus')"
          aria-hidden="true"
        >
          <path d="M5 12h14" />
        </svg>
      </button>
      <div data-uipkge="" data-slot="input" [class]="inputBlockClass">
        @if (prefix) {
          <span class="text-muted-foreground pointer-events-none absolute top-1/2 left-2 -translate-y-1/2 text-sm">{{
            prefix
          }}</span>
        }
        <input
          #inputEl
          [attr.id]="id ?? null"
          [value]="displayValue()"
          type="text"
          role="spinbutton"
          [attr.aria-label]="ariaLabel ?? null"
          [attr.aria-valuenow]="currentValue !== undefined && !isNaN(currentValue) ? currentValue : null"
          [attr.aria-valuemin]="min ?? null"
          [attr.aria-valuemax]="max ?? null"
          [attr.aria-invalid]="status === 'error' ? 'true' : null"
          [attr.inputmode]="precision !== undefined ? 'decimal' : 'numeric'"
          [disabled]="disabled"
          [readOnly]="readOnly"
          [attr.placeholder]="placeholder ?? null"
          autocomplete="off"
          autocorrect="off"
          spellcheck="false"
          aria-roledescription="Number field"
          [class]="inputClass"
          (focus)="isUserTyping.set(true)"
          (input)="displayValue.set($any($event.target).value)"
          (blur)="commitValue(); onTouched()"
          (keydown)="handleKeyDown($event)"
          (wheel)="handleWheel($event)"
        />
        @if (suffix) {
          <span class="text-muted-foreground pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-sm">{{
            suffix
          }}</span>
        }
      </div>
      <button
        type="button"
        data-uipkge=""
        data-slot="increment"
        tabindex="-1"
        aria-label="Increase"
        [disabled]="incrementDisabled"
        [class]="incrementClass"
        (click)="handleIncrease()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          [attr.class]="iconClass('plus')"
          aria-hidden="true"
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
      </button>
    </div>
  `,
})
export class UiNumberFieldComponent implements ControlValueAccessor, AfterViewChecked {
  // Zoneless-safe: form writes happen outside template events, so schedule a repaint.
  private readonly cdr = inject(ChangeDetectorRef)
  @ViewChild('inputEl', { static: true }) inputEl!: ElementRef<HTMLInputElement>

  private readonly _valueProp = signal<number | undefined>(undefined)
  private readonly _internal = signal<number | undefined>(undefined)
  private readonly _hasInternal = signal(false)
  /** Bumped when a display-affecting input (formatter / precision / ...) changes. */
  private readonly _formatVersion = signal(0)

  /** Controlled value (React `value`); `undefined` = uncontrolled. Reading returns the current value. */
  @Input({ transform: optionalNumber })
  set value(v: number | undefined) {
    this._valueProp.set(v)
  }
  get value(): number | undefined {
    return this.currentValue
  }
  @Input({ transform: optionalNumber }) defaultValue?: number
  /** React `onValueChange`. */
  @Output() valueChange = new EventEmitter<number | undefined>()

  @Input({ transform: optionalNumber }) min?: number
  @Input({ transform: optionalNumber }) max?: number
  @Input({ transform: numberAttribute }) step = 1
  @Input({ transform: optionalNumber })
  set precision(v: number | undefined) {
    this._precision = v
    this._formatVersion.update((n) => n + 1)
  }
  get precision(): number | undefined {
    return this._precision
  }
  private _precision?: number
  @Input({ transform: booleanAttribute }) disabled = false
  @Input({ transform: booleanAttribute }) readOnly = false
  /** Lower-case HTML spelling of `readOnly`. */
  @Input({ alias: 'readonly', transform: booleanAttribute }) set readonlyAlias(v: boolean) {
    this.readOnly = v
  }
  @Input() size: NumberFieldSize = 'middle'
  @Input() status?: NumberFieldStatus
  @Input() controlsPosition: NumberFieldControlsPosition = 'default'
  @Input({ transform: booleanAttribute }) keyboard = true
  @Input()
  set formatOptions(v: Intl.NumberFormatOptions | undefined) {
    this._formatOptions = v
    this._formatVersion.update((n) => n + 1)
  }
  get formatOptions(): Intl.NumberFormatOptions | undefined {
    return this._formatOptions
  }
  private _formatOptions?: Intl.NumberFormatOptions
  @Input()
  set formatter(v: ((value: number | undefined) => string) | undefined) {
    this._formatter = v
    this._formatVersion.update((n) => n + 1)
  }
  get formatter(): ((value: number | undefined) => string) | undefined {
    return this._formatter
  }
  private _formatter?: (value: number | undefined) => string
  @Input() parser?: (displayValue: string) => number | undefined
  @Input() prefix?: string
  @Input() suffix?: string
  @Input() placeholder?: string
  @Input() id?: string
  @Input('class') className?: string
  @Input('aria-label') ariaLabel?: string

  readonly displayValue = signal('')
  readonly isUserTyping = signal(false)

  private onChange: (v: number | undefined) => void = () => {}
  onTouched: () => void = () => {}

  constructor() {
    // Keep the display in sync with the value whenever the user isn't typing (React effect).
    effect(() => {
      this._formatVersion()
      const v = this.currentValue
      if (!this.isUserTyping()) this.displayValue.set(this.formatValue(v))
    })
  }

  readonly isNaN = Number.isNaN

  /**
   * The display can be reset to the text it had before an edit (invalid input on commit);
   * the [value] binding sees no change then, so write the DOM directly.
   */
  ngAfterViewChecked(): void {
    const el = this.inputEl?.nativeElement
    if (el && el.value !== this.displayValue()) el.value = this.displayValue()
  }

  get isControlled(): boolean {
    return this._valueProp() !== undefined
  }
  get currentValue(): number | undefined {
    if (this.isControlled) return this._valueProp()
    return this._hasInternal() ? this._internal() : this.defaultValue
  }
  get isRight(): boolean {
    return this.controlsPosition === 'right'
  }

  private get intlOptions(): Intl.NumberFormatOptions | undefined {
    if (this.precision !== undefined) {
      return { ...this.formatOptions, minimumFractionDigits: this.precision, maximumFractionDigits: this.precision }
    }
    return this.formatOptions
  }

  formatValue(val: number | undefined): string {
    if (this.formatter) return this.formatter(val)
    if (val === undefined || Number.isNaN(val)) return ''
    const opts = this.intlOptions
    if (opts) return new Intl.NumberFormat(undefined, opts).format(val)
    return String(val)
  }

  private emit(next: number | undefined): void {
    if (!this.isControlled) {
      this._internal.set(next)
      this._hasInternal.set(true)
    }
    this.onChange(next)
    this.valueChange.emit(next)
  }

  private stepBy(delta: number): void {
    if (this.disabled || this.readOnly) return
    const base = this.currentValue ?? 0
    const next = clamp(base + delta, this.min, this.max)
    this.emit(next)
    this.isUserTyping.set(false)
    this.displayValue.set(this.formatValue(next))
  }

  handleIncrease(mult = 1): void {
    this.stepBy(this.step * mult)
  }

  handleDecrease(mult = 1): void {
    this.stepBy(-this.step * mult)
  }

  private setTo(v: number): void {
    this.emit(v)
    this.isUserTyping.set(false)
    this.displayValue.set(this.formatValue(v))
  }

  commitValue(): void {
    this.isUserTyping.set(false)
    const raw = this.displayValue().trim()
    if (raw === '') {
      this.emit(undefined)
      this.displayValue.set('')
      return
    }
    const num = this.parser ? this.parser(raw) : Number(raw)
    if (num !== undefined && !Number.isNaN(num)) {
      const next = clamp(num, this.min, this.max)
      this.emit(next)
      this.displayValue.set(this.formatValue(next))
    } else {
      this.displayValue.set(this.formatValue(this.currentValue))
    }
  }

  handleKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowUp':
        if (this.keyboard) {
          event.preventDefault()
          this.handleIncrease()
        }
        break
      case 'ArrowDown':
        if (this.keyboard) {
          event.preventDefault()
          this.handleDecrease()
        }
        break
      case 'PageUp':
        if (this.keyboard) {
          event.preventDefault()
          this.handleIncrease(10)
        }
        break
      case 'PageDown':
        if (this.keyboard) {
          event.preventDefault()
          this.handleDecrease(10)
        }
        break
      case 'Home':
        if (this.keyboard && this.min !== undefined) {
          event.preventDefault()
          this.setTo(this.min)
        }
        break
      case 'End':
        if (this.keyboard && this.max !== undefined) {
          event.preventDefault()
          this.setTo(this.max)
        }
        break
      case 'Enter':
        this.commitValue()
        break
    }
  }

  handleWheel(event: WheelEvent): void {
    if (event.currentTarget !== document.activeElement) return
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return
    event.preventDefault()
    if (event.deltaY > 0) this.handleDecrease()
    else this.handleIncrease()
  }

  get decrementDisabled(): boolean {
    return this.disabled || this.readOnly || (this.min !== undefined && (this.currentValue ?? 0) <= this.min)
  }
  get incrementDisabled(): boolean {
    return this.disabled || this.readOnly || (this.max !== undefined && (this.currentValue ?? 0) >= this.max)
  }

  get hostClass(): string {
    return cn('inline-flex', this.className)
  }

  iconClass(name: 'minus' | 'plus'): string {
    const size = this.size === 'small' ? 'h-3 w-3' : this.size === 'large' ? 'h-5 w-5' : 'h-4 w-4'
    return `lucide lucide-${name} ${size}`
  }

  private get buttonPadding(): string {
    return !this.isRight ? (this.size === 'small' ? 'p-1.5' : this.size === 'large' ? 'p-4' : 'p-3') : ''
  }

  get contentClasses(): string {
    return cn(
      'relative',
      this.isRight &&
        'border-input focus-within:ring-ring inline-grid grid-cols-[1fr_auto] grid-rows-[1fr_1fr] items-stretch overflow-hidden rounded-md border focus-within:ring-1',
    )
  }

  get decrementClass(): string {
    return cn(
      decrementIncrementBase,
      !this.isRight && 'absolute top-1/2 left-0 z-10 -translate-y-1/2',
      this.buttonPadding,
      this.isRight && 'hover:bg-accent col-start-2 row-start-2 h-full w-auto rounded-none border-t border-l p-0 px-2',
    )
  }

  get incrementClass(): string {
    return cn(
      decrementIncrementBase,
      !this.isRight && 'absolute top-1/2 right-0 z-10 -translate-y-1/2',
      this.buttonPadding,
      this.isRight && 'hover:bg-accent col-start-2 row-start-1 h-full w-auto rounded-none border-l p-0 px-2',
    )
  }

  get inputBlockClass(): string {
    return cn(
      'relative flex-1',
      this.isRight && 'col-span-1 row-span-2',
      !this.isRight && '[&>input]:pr-9 [&>input]:pl-9',
    )
  }

  get inputClass(): string {
    const inputSizeClasses =
      this.size === 'small'
        ? 'h-7 text-xs px-2 py-0.5'
        : this.size === 'large'
          ? 'h-11 text-base px-4 py-2'
          : 'h-9 text-sm px-3 py-1'
    const inputStatusClasses = !this.isRight
      ? this.status === 'error'
        ? 'border-destructive focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 aria-invalid:border-destructive'
        : this.status === 'warning'
          ? 'border-warning focus-visible:ring-warning/20'
          : ''
      : ''
    return cn(
      'placeholder:text-muted-foreground w-full bg-transparent text-center shadow-sm transition-colors outline-none disabled:cursor-not-allowed disabled:opacity-50',
      !this.isRight && 'border-input focus-visible:ring-ring rounded-md border focus-visible:ring-1',
      this.isRight && 'rounded-none border-0 focus-visible:ring-0',
      this.prefix && 'pl-6',
      this.suffix && 'pr-6',
      inputSizeClasses,
      inputStatusClasses,
    )
  }

  writeValue(v: number | null | undefined): void {
    this._internal.set(v == null ? undefined : Number(v))
    this._hasInternal.set(true)
    this.cdr.markForCheck()
  }

  registerOnChange(fn: (v: number | undefined) => void): void {
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
