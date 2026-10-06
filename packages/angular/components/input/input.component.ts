import {
  type AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
  booleanAttribute,
  forwardRef,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms'
import { cn } from '@/lib/utils'
import { UiRenderTemplateDirective } from '@/ui/popper/popper'

export type InputSize = 'small' | 'middle' | 'large'
export type InputVariant = 'outlined' | 'filled' | 'borderless'
export type InputStatus = 'error' | 'warning'
/** Text, or an <ng-template> (an icon, a node), for prefix / suffix / addons. */
export type InputSlot = string | TemplateRef<unknown> | null | undefined

const sizeClasses: Record<InputSize, string> = {
  small: 'h-8 text-xs',
  middle: 'h-9 text-base md:text-sm',
  large: 'h-11 text-base',
}

const variantMap: Record<InputVariant, string> = {
  outlined: 'border-input bg-transparent shadow-xs',
  filled: 'border-transparent bg-muted/50 shadow-none',
  borderless: 'border-transparent bg-transparent shadow-none',
}

const statusMap: Record<InputStatus, string> = {
  error:
    'border-destructive focus-within:border-destructive focus-within:ring-destructive/20 dark:focus-within:ring-destructive/40',
  warning: 'border-warning focus-within:border-warning focus-within:ring-warning/20',
}

function optionalBool(v: unknown): boolean | undefined {
  return v === undefined || v === null ? undefined : booleanAttribute(v)
}

/**
 * Angular port of the React Input. The `<ui-input>` host is React's outer `flex w-full`
 * row; inside it sit the optional addons and the bordered wrapper (`data-slot="input"`,
 * which receives `class`) around the native `<input>`.
 *
 * Model is React's `value` / `defaultValue` / `valueChange`: a bound `value` is controlled
 * (typing that the parent does not accept is reverted, like React), otherwise the input
 * keeps its own state. NG_VALUE_ACCESSOR is provided for formControl / ngModel.
 * `prefix` / `suffix` / `prefixIcon` / `suffixIcon` / `addonBefore` / `addonAfter` take
 * text or an <ng-template>.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-input, div[ui-input]',
  standalone: true,
  exportAs: 'uiInput',
  imports: [UiRenderTemplateDirective],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiInputComponent), multi: true }],
  host: {
    '[attr.class]': '"flex w-full"',
    // These belong to the native <input>; keep them off the host so ids stay unique.
    '[attr.id]': 'null',
    '[attr.aria-invalid]': 'null',
    '[attr.aria-label]': 'null',
    '[attr.aria-describedby]': 'null',
    '[attr.placeholder]': 'null',
  },
  template: `
    @if (addonBefore) {
      <div [class]="addonClasses('before')">
        @if (isTemplate(addonBefore)) {
          <ng-container [uiRenderTemplate]="addonBefore" />
        } @else {
          {{ addonBefore }}
        }
      </div>
    }
    <div
      data-uipkge=""
      data-slot="input"
      [class]="wrapperClasses"
      [attr.aria-invalid]="resolvedAriaInvalid"
      (mouseenter)="isHovered.set(true)"
      (mouseleave)="isHovered.set(false)"
      (click)="focus()"
    >
      @if (hasPrefix) {
        <span [class]="prefixClass">
          @if (isTemplate(prefixContent)) {
            <ng-container [uiRenderTemplate]="prefixContent" />
          } @else {
            {{ prefixContent }}
          }
        </span>
      }
      <input
        #inputEl
        [attr.id]="id ?? null"
        [value]="currentValue"
        [type]="computedType"
        [disabled]="disabled"
        [readOnly]="readOnly"
        [attr.maxlength]="maxLength ?? null"
        [attr.minlength]="minLength ?? null"
        [attr.aria-invalid]="resolvedAriaInvalid"
        [attr.aria-label]="ariaLabel ?? null"
        [attr.aria-describedby]="ariaDescribedby ?? null"
        [attr.placeholder]="placeholder ?? null"
        [attr.name]="name ?? null"
        [attr.autocomplete]="autoComplete ?? null"
        [attr.inputmode]="inputMode ?? null"
        [attr.pattern]="pattern ?? null"
        [attr.min]="min ?? null"
        [attr.max]="max ?? null"
        [attr.step]="step ?? null"
        [required]="required"
        [autofocus]="autoFocus"
        [class]="inputClass"
        (input)="onInput($event)"
        (focus)="onFocus($event)"
        (blur)="onBlur($event)"
      />
      @if (hasRight) {
        <div [class]="rightRailClass">
          @if (showClear) {
            <button
              type="button"
              aria-label="Clear input"
              class="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 shrink-0 rounded p-0.5 transition-colors focus-visible:ring-1 focus-visible:outline-none"
              (mousedown)="$event.preventDefault()"
              (click)="handleClear()"
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
                class="lucide lucide-x size-4"
                aria-hidden="true"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          }
          @if (hasPasswordToggle && !disabled && !readOnly) {
            <button
              type="button"
              [attr.aria-label]="passwordVisible() ? 'Hide password' : 'Show password'"
              [attr.aria-pressed]="passwordVisible()"
              class="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 shrink-0 rounded p-0.5 transition-colors focus-visible:ring-1 focus-visible:outline-none"
              (mousedown)="$event.preventDefault()"
              (click)="togglePassword()"
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
          }
          @if (hasCount) {
            <span class="text-muted-foreground pointer-events-none text-xs select-none"
              >{{ currentValue.length }}/{{ maxLength }}</span
            >
          }
          @if (hasSuffix) {
            <span class="text-muted-foreground pointer-events-none select-none">
              @if (isTemplate(suffixContent)) {
                <ng-container [uiRenderTemplate]="suffixContent" />
              } @else {
                {{ suffixContent }}
              }
            </span>
          }
        </div>
      }
    </div>
    @if (addonAfter) {
      <div [class]="addonClasses('after')">
        @if (isTemplate(addonAfter)) {
          <ng-container [uiRenderTemplate]="addonAfter" />
        } @else {
          {{ addonAfter }}
        }
      </div>
    }
  `,
})
export class UiInputComponent implements ControlValueAccessor, AfterViewChecked {
  // Zoneless-safe: form writes happen outside template events, so schedule a repaint.
  private readonly cdr = inject(ChangeDetectorRef)
  @ViewChild('inputEl', { static: true }) inputEl!: ElementRef<HTMLInputElement>

  private readonly _valueProp = signal<string | undefined>(undefined)
  private readonly _internal = signal<string | null>(null)

  /** Controlled value (React `value`). Reading it returns the resolved current value. */
  @Input()
  set value(v: string | number | null | undefined) {
    this._valueProp.set(v === undefined ? undefined : String(v ?? ''))
  }
  get value(): string {
    return this.currentValue
  }
  @Input() defaultValue?: string | number
  /** React `onChange`: emits the new text on every edit (and '' on clear). */
  @Output() valueChange = new EventEmitter<string>()
  /** React `onFocus` / `onBlur` (focus events do not bubble out of the host). */
  @Output('focus') focusEvent = new EventEmitter<FocusEvent>()
  @Output('blur') blurEvent = new EventEmitter<FocusEvent>()

  @Input() size: InputSize = 'middle'
  @Input() variant: InputVariant = 'outlined'
  @Input() status?: InputStatus
  @Input() prefix?: InputSlot
  @Input() suffix?: InputSlot
  @Input() prefixIcon?: InputSlot
  @Input() suffixIcon?: InputSlot
  @Input() addonBefore?: InputSlot
  @Input() addonAfter?: InputSlot
  @Input({ transform: booleanAttribute }) allowClear = false
  @Input({ transform: booleanAttribute }) showCount = false
  @Input({ transform: booleanAttribute }) showPasswordToggle = false
  @Input() type = 'text'
  @Input({ transform: booleanAttribute }) disabled = false
  @Input({ transform: booleanAttribute }) readOnly = false
  /** Lower-case HTML spelling of `readOnly`. */
  @Input({ alias: 'readonly', transform: booleanAttribute }) set readonlyAlias(v: boolean) {
    this.readOnly = v
  }
  @Input() maxLength?: number
  /** Lower-case HTML spelling of `maxLength`. */
  @Input('maxlength') set maxlengthAlias(v: number | string | undefined) {
    this.maxLength = v == null || v === '' ? undefined : Number(v)
  }
  @Input() minLength?: number
  @Input() id?: string
  @Input() name?: string
  @Input() placeholder?: string
  @Input() autoComplete?: string
  @Input() inputMode?: string
  @Input() pattern?: string
  @Input() min?: number | string
  @Input() max?: number | string
  @Input() step?: number | string
  @Input({ transform: booleanAttribute }) required = false
  @Input({ transform: booleanAttribute }) autoFocus = false
  @Input({ alias: 'aria-invalid', transform: optionalBool }) ariaInvalid?: boolean
  @Input('aria-label') ariaLabel?: string
  @Input('aria-describedby') ariaDescribedby?: string
  /** Wrapper className: lands on the bordered control, not the <input>. */
  @Input('class') className?: string

  readonly isFocused = signal(false)
  readonly isHovered = signal(false)
  readonly passwordVisible = signal(false)

  private onChange: (v: string) => void = () => {}
  private onTouched: () => void = () => {}

  get isControlled(): boolean {
    return this._valueProp() !== undefined
  }

  get currentValue(): string {
    return this._valueProp() ?? this._internal() ?? (this.defaultValue != null ? String(this.defaultValue) : '')
  }

  get isPassword(): boolean {
    return this.type === 'password'
  }
  get hasPrefix(): boolean {
    return !!this.prefix || !!this.prefixIcon
  }
  get hasSuffix(): boolean {
    return !!this.suffix || !!this.suffixIcon
  }
  /** A prefixIcon wins over the prefix text, like React's `prefixIcon ?? prefix`. */
  get prefixContent(): InputSlot {
    return this.prefixIcon ?? this.prefix
  }
  get suffixContent(): InputSlot {
    return this.suffixIcon ?? this.suffix
  }
  get hasPasswordToggle(): boolean {
    return this.showPasswordToggle && this.isPassword
  }
  get hasCount(): boolean {
    return this.showCount && this.maxLength != null
  }
  get hasRight(): boolean {
    return this.hasSuffix || this.allowClear || this.hasPasswordToggle || this.hasCount
  }
  get showClear(): boolean {
    return (
      this.allowClear &&
      this.currentValue.length > 0 &&
      (this.isFocused() || this.isHovered()) &&
      !this.disabled &&
      !this.readOnly
    )
  }
  get computedType(): string {
    return !this.isPassword ? this.type : this.passwordVisible() ? 'text' : 'password'
  }
  /** status=error implies invalid for AT; set on the wrapper and the native input. */
  get resolvedAriaInvalid(): 'true' | 'false' | null {
    const v = this.status === 'error' ? true : this.ariaInvalid
    return v === undefined ? null : v ? 'true' : 'false'
  }

  private get sidePad(): { l: string; r: string } {
    return this.size === 'small'
      ? { l: 'pl-2', r: 'pr-2' }
      : this.size === 'large'
        ? { l: 'pl-3', r: 'pr-3' }
        : { l: 'pl-2.5', r: 'pr-2.5' }
  }

  get wrapperClasses(): string {
    const hasBefore = !!this.addonBefore
    const hasAfter = !!this.addonAfter
    const wrapperRounded =
      hasBefore && hasAfter
        ? 'rounded-none'
        : hasBefore
          ? 'rounded-l-none rounded-r-md'
          : hasAfter
            ? 'rounded-r-none rounded-l-md'
            : 'rounded-md'
    return cn(
      'flex w-full items-center gap-1.5 overflow-hidden border transition-[color,box-shadow] outline-none',
      sizeClasses[this.size],
      variantMap[this.variant],
      this.status ? statusMap[this.status] : '',
      !this.status ? 'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]' : '',
      this.disabled ? 'pointer-events-none opacity-50 cursor-not-allowed bg-muted/30' : '',
      'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
      wrapperRounded,
      this.className,
    )
  }

  addonClasses(position: 'before' | 'after'): string {
    const roundedClass =
      position === 'before' ? 'rounded-l-md rounded-r-none border-r-0' : 'rounded-r-md rounded-l-none border-l-0'
    return cn(
      'flex items-center bg-muted px-3 text-sm text-muted-foreground border border-input',
      roundedClass,
      sizeClasses[this.size],
    )
  }

  get prefixClass(): string {
    return cn('text-muted-foreground pointer-events-none shrink-0 select-none', this.sidePad.l)
  }

  get rightRailClass(): string {
    return cn('flex shrink-0 items-center gap-1', this.sidePad.r)
  }

  get inputClass(): string {
    const { l, r } = this.sidePad
    const hasLeft = this.hasPrefix
    const hasRight = this.hasRight
    const inputPadding =
      !hasLeft && !hasRight
        ? cn(l, r)
        : hasLeft && !hasRight
          ? cn('pl-0', r)
          : !hasLeft && hasRight
            ? cn(l, 'pr-0')
            : 'px-0'
    return cn(
      'w-full min-w-0 flex-1 bg-transparent outline-none',
      'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground',
      'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',
      'disabled:cursor-not-allowed',
      inputPadding,
    )
  }

  isTemplate(v: InputSlot): v is TemplateRef<unknown> {
    return v instanceof TemplateRef
  }

  /** Focus the native input (React: the forwarded ref). */
  focus(): void {
    this.inputEl?.nativeElement.focus()
  }

  onInput(event: Event): void {
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

  onFocus(event: FocusEvent): void {
    this.isFocused.set(true)
    this.focusEvent.emit(event)
  }

  onBlur(event: FocusEvent): void {
    this.isFocused.set(false)
    this.onTouched()
    this.blurEvent.emit(event)
  }

  handleClear(): void {
    const el = this.inputEl.nativeElement
    // Go through a real input event so every listener (valueChange, forms, bubbling (input)) sees it.
    el.value = ''
    el.dispatchEvent(new Event('input', { bubbles: true }))
    el.focus()
  }

  togglePassword(): void {
    this.passwordVisible.update((v) => !v)
    this.focus()
  }

  writeValue(v: string | number | null): void {
    this._internal.set(v == null ? '' : String(v))
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

export type InputGroupSize = 'small' | 'middle' | 'large'

const groupSizeClasses: Record<InputGroupSize, string> = {
  small: 'h-8 text-xs',
  middle: 'h-9 text-sm',
  large: 'h-11 text-base',
}

/** React InputGroup: one bordered row that flattens nested Inputs, addons and buttons. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-input-group, div[ui-input-group]',
  standalone: true,
  host: {
    'data-uipkge': '',
    'data-slot': 'input-group',
    '[attr.data-size]': 'size',
    '[attr.data-disabled]': 'disabled ? "" : null',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiInputGroupComponent {
  @Input() size: InputGroupSize = 'middle'
  @Input({ transform: booleanAttribute }) disabled = false
  @Input('class') className?: string

  get hostClass(): string {
    return cn(
      'group/input-group border-input bg-background relative flex w-full items-stretch rounded-md border shadow-xs transition-[color,box-shadow]',
      'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px] focus-within:outline-none',
      '[&_[data-slot=input]]:rounded-none [&_[data-slot=input]]:border-0 [&_[data-slot=input]]:bg-transparent [&_[data-slot=input]]:shadow-none [&_[data-slot=input]]:focus-within:ring-0',
      '[&_input]:h-full [&_input]:flex-1 [&_input]:border-0 [&_input]:bg-transparent [&_input]:px-3 [&_input]:text-sm [&_input]:outline-none [&_input]:focus-visible:ring-0',
      this.disabled && 'bg-muted/30 pointer-events-none cursor-not-allowed opacity-50',
      groupSizeClasses[this.size],
      this.className,
    )
  }
}

/** React InputGroupAddon: static text / icon segment inside an InputGroup. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-input-group-addon, div[ui-input-group-addon]',
  standalone: true,
  host: {
    'data-uipkge': '',
    'data-slot': 'input-group-addon',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiInputGroupAddonComponent {
  /** Kept for React API parity (React accepts it but does not use it either). */
  @Input() align: 'inline' | 'block' = 'inline'
  @Input('class') className?: string

  get hostClass(): string {
    return cn(
      'text-muted-foreground flex shrink-0 items-center justify-center px-3 text-sm select-none',
      'border-input first:rounded-l-[calc(var(--radius)-1px)] last:rounded-r-[calc(var(--radius)-1px)]',
      'border-r first:border-l-0 last:border-r-0',
      this.className,
    )
  }
}

export type InputGroupButtonVariant = 'default' | 'secondary' | 'ghost' | 'outline'

const groupButtonVariants: Record<InputGroupButtonVariant, string> = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  outline: 'border-l border-input hover:bg-accent hover:text-accent-foreground',
}

/** React InputGroupButton: put it on a native button inside an InputGroup. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'button[ui-input-group-button]',
  standalone: true,
  host: {
    'data-uipkge': '',
    'data-slot': 'input-group-button',
    '[attr.type]': 'type',
    '[disabled]': 'disabled',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiInputGroupButtonComponent {
  @Input() variant: InputGroupButtonVariant = 'ghost'
  @Input() type: 'button' | 'submit' | 'reset' = 'button'
  @Input({ transform: booleanAttribute }) disabled = false
  @Input('class') className?: string

  get hostClass(): string {
    return cn(
      'inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 px-3 text-sm font-medium transition-colors select-none',
      'first:rounded-l-[calc(var(--radius)-1px)] last:rounded-r-[calc(var(--radius)-1px)]',
      'focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none',
      'disabled:pointer-events-none disabled:opacity-50',
      groupButtonVariants[this.variant],
      this.className,
    )
  }
}
