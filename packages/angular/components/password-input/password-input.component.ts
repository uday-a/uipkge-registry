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
  forwardRef,
  inject,
  numberAttribute,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms'
import { cn } from '@/lib/utils'
import { passwordInputVariants, type PasswordInputVariants } from './password-input.variants'

export type PasswordInputSize = NonNullable<PasswordInputVariants['size']>
export type PasswordInputVariant = NonNullable<PasswordInputVariants['variant']>
export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong'

export interface PasswordStrengthResult {
  score: number
  label: PasswordStrength
  color: string
  barColor: string
  percent: number
}

/** Same scoring as React: length >= 6 / >= 10, mixed case, a digit, a symbol. */
export function computeStrength(pwd: string): PasswordStrengthResult {
  if (!pwd) return { score: 0, label: 'weak', color: '', barColor: 'bg-transparent', percent: 0 }
  let score = 0
  if (pwd.length >= 6) score++
  if (pwd.length >= 10) score++
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++
  if (/\d/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++
  if (score <= 1) return { score, label: 'weak', color: 'text-destructive', barColor: 'bg-destructive', percent: 25 }
  if (score <= 2) return { score, label: 'fair', color: 'text-warning', barColor: 'bg-warning', percent: 50 }
  if (score <= 3) return { score, label: 'good', color: 'text-info', barColor: 'bg-info', percent: 75 }
  return { score, label: 'strong', color: 'text-success', barColor: 'bg-success', percent: 100 }
}

/**
 * Angular port of the React PasswordInput. `<ui-password-input>` is React's outer
 * `flex w-full flex-col gap-2` column: the bordered control (`data-slot="password-input"`,
 * which receives `class`) with the native input and the Eye / EyeOff toggle, then the
 * optional strength meter (role=status) or the minimum-length hint.
 *
 * Model is React's `value` / `defaultValue`, with `valueChange` (React `onChange`) emitting
 * the text. NG_VALUE_ACCESSOR is provided for formControl / ngModel.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-password-input',
  standalone: true,
  exportAs: 'uiPasswordInput',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiPasswordInputComponent), multi: true }],
  host: {
    '[attr.class]': '"flex w-full flex-col gap-2"',
    // These belong to the native <input>.
    '[attr.id]': 'null',
    '[attr.placeholder]': 'null',
    '[attr.aria-label]': 'null',
    '[attr.aria-describedby]': 'null',
    '[attr.aria-invalid]': 'null',
  },
  template: `
    <div
      data-uipkge=""
      data-slot="password-input"
      [attr.data-size]="size"
      [attr.data-variant]="variant"
      [class]="wrapperClasses"
    >
      <input
        #inputEl
        [attr.id]="id ?? null"
        [value]="currentValue"
        [type]="passwordVisible() ? 'text' : 'password'"
        [disabled]="disabled"
        [readOnly]="readOnly"
        [attr.maxlength]="maxLength ?? null"
        [attr.placeholder]="placeholder"
        [attr.name]="name ?? null"
        [attr.autocomplete]="autoComplete"
        [attr.aria-label]="ariaLabel ?? null"
        [attr.aria-describedby]="ariaDescribedby ?? null"
        [attr.aria-invalid]="ariaInvalid ?? null"
        [required]="required"
        [class]="inputClass"
        (input)="handleInput($event)"
        (focus)="focusEvent.emit($event)"
        (blur)="onTouched(); blurEvent.emit($event)"
      />
      @if (showToggle) {
        <div [class]="toggleWrapClass">
          <button
            type="button"
            [attr.aria-label]="passwordVisible() ? 'Hide password' : 'Show password'"
            [attr.aria-pressed]="passwordVisible()"
            [disabled]="disabled || readOnly"
            class="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 shrink-0 rounded p-0.5 transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed"
            (mousedown)="$event.preventDefault()"
            (click)="toggleVisibility()"
          >
            @if (passwordVisible()) {
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
                class="lucide lucide-eye-off size-4"
                aria-hidden="true"
              >
                <path
                  d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"
                />
                <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                <path
                  d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"
                />
                <path d="m2 2 20 20" />
              </svg>
            } @else {
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
                class="lucide lucide-eye size-4"
                aria-hidden="true"
              >
                <path
                  d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
                />
                <circle cx="12" cy="12" r="3" />
              </svg>
            }
          </button>
        </div>
      }
    </div>
    @if (showStrength && currentValue) {
      <div
        class="flex flex-col gap-1.5"
        role="status"
        aria-live="polite"
        [attr.aria-label]="'Password strength: ' + strength.label"
      >
        <div class="bg-muted h-1.5 w-full overflow-hidden rounded-full" aria-hidden="true">
          <div [class]="barClass" [style.width.%]="strength.percent"></div>
        </div>
        <div class="flex items-center justify-between text-xs">
          <span [class]="labelClass">{{ strength.label }}</span>
          @if (minLength > 0) {
            <span [class]="meetsMinLength ? 'text-success' : 'text-muted-foreground'"
              >{{ currentValue.length }} / {{ minLength }} chars</span
            >
          }
        </div>
      </div>
    }
    @if (minLength > 0 && !showStrength && currentValue) {
      <p class="text-muted-foreground text-xs">Minimum {{ minLength }} characters</p>
    }
  `,
})
export class UiPasswordInputComponent implements ControlValueAccessor, AfterViewChecked {
  // Zoneless-safe: form writes happen outside template events, so schedule a repaint.
  private readonly cdr = inject(ChangeDetectorRef)
  @ViewChild('inputEl', { static: true }) inputEl!: ElementRef<HTMLInputElement>

  private readonly _valueProp = signal<string | undefined>(undefined)
  private readonly _internal = signal<string | null>(null)
  readonly passwordVisible = signal(false)

  /** Controlled value (React `value`). Reading it returns the resolved current value. */
  @Input()
  set value(v: string | null | undefined) {
    this._valueProp.set(v === undefined ? undefined : String(v ?? ''))
  }
  get value(): string {
    return this.currentValue
  }
  @Input() defaultValue?: string
  /** React `onChange`: emits the new text on every edit. */
  @Output() valueChange = new EventEmitter<string>()
  @Output('focus') focusEvent = new EventEmitter<FocusEvent>()
  @Output('blur') blurEvent = new EventEmitter<FocusEvent>()

  @Input() placeholder = 'Enter password'
  @Input() size: PasswordInputSize = 'default'
  @Input() variant: PasswordInputVariant = 'outlined'
  @Input({ transform: booleanAttribute }) disabled = false
  @Input({ transform: booleanAttribute }) readOnly = false
  /** Lower-case HTML spelling of `readOnly`. */
  @Input({ alias: 'readonly', transform: booleanAttribute }) set readonlyAlias(v: boolean) {
    this.readOnly = v
  }
  @Input({ transform: booleanAttribute }) showStrength = false
  @Input({ transform: booleanAttribute }) showToggle = true
  @Input({ transform: numberAttribute }) minLength = 0
  @Input() maxLength?: number
  @Input() id?: string
  @Input() name?: string
  @Input() autoComplete = 'current-password'
  @Input({ transform: booleanAttribute }) required = false
  @Input('aria-label') ariaLabel?: string
  @Input('aria-describedby') ariaDescribedby?: string
  @Input('aria-invalid') ariaInvalid?: string | boolean
  /** Wrapper className: lands on the bordered control, not the <input>. */
  @Input('class') className?: string

  private onChange: (v: string) => void = () => {}
  onTouched: () => void = () => {}

  get isControlled(): boolean {
    return this._valueProp() !== undefined
  }
  get currentValue(): string {
    return this._valueProp() ?? this._internal() ?? (this.defaultValue != null ? String(this.defaultValue) : '')
  }
  get strength(): PasswordStrengthResult {
    return computeStrength(this.currentValue)
  }
  get meetsMinLength(): boolean {
    return this.currentValue.length >= this.minLength
  }

  get wrapperClasses(): string {
    return cn(
      passwordInputVariants({ size: this.size, variant: this.variant }),
      'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
      this.disabled && 'pointer-events-none opacity-50 cursor-not-allowed bg-muted/30',
      this.className,
    )
  }

  get inputClass(): string {
    const pad = this.size === 'sm' ? 'px-2.5' : this.size === 'lg' ? 'px-4' : 'px-3'
    return cn('placeholder:text-muted-foreground w-full min-w-0 flex-1 bg-transparent outline-none', pad)
  }

  get toggleWrapClass(): string {
    return cn('flex shrink-0 items-center', this.size === 'sm' ? 'pr-2' : this.size === 'lg' ? 'pr-3' : 'pr-2.5')
  }

  get barClass(): string {
    return cn('h-full rounded-full transition-[width] duration-300', this.strength.barColor)
  }

  get labelClass(): string {
    return cn('font-medium capitalize', this.strength.color)
  }

  toggleVisibility(): void {
    if (this.disabled || this.readOnly) return
    this.passwordVisible.update((v) => !v)
    this.inputEl?.nativeElement.focus()
  }

  handleInput(event: Event): void {
    const next = (event.target as HTMLInputElement).value
    if (!this.isControlled) this._internal.set(next)
    this.onChange(next)
    this.valueChange.emit(next)
  }

  /** A controlled parent that did not take the edit wins: put its value back (React semantics). */
  ngAfterViewChecked(): void {
    const el = this.inputEl?.nativeElement
    if (el && this.isControlled && el.value !== this.currentValue) el.value = this.currentValue
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
