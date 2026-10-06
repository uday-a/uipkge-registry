import {
  type AfterViewChecked,
  type AfterViewInit,
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
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms'
import { cn } from '@/lib/utils'
import { uniqueId } from '@/ui/popper/popper'
import { UiLabelComponent } from '@/ui/label/label.component'

export type TextareaVariant = 'outlined' | 'filled' | 'solo' | 'underlined' | 'plain'
export type TextareaColor = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'
export type TextareaDensity = 'compact' | 'comfortable' | 'default'
export type TextareaRounded = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'pill' | 'circle' | 'full'
export type TextareaValidateOn = 'blur' | 'input' | 'submit' | 'lazy' | 'blurlazy' | 'inputlazy'
export type TextareaRule = (value: any) => true | string
export interface TextareaAutoSize {
  minRows?: number
  maxRows?: number
}
export interface TextareaShowCount {
  formatter?: (count: number, maxLength?: number) => string
}

function optionalBool(v: unknown): boolean | undefined {
  return v === undefined || v === null ? undefined : booleanAttribute(v)
}
/** `autoSize` (bare attribute = true) or a { minRows, maxRows } object. */
function autoSizeAttr(v: unknown): boolean | TextareaAutoSize | undefined {
  return v === undefined || v === null
    ? undefined
    : typeof v === 'object'
      ? (v as TextareaAutoSize)
      : booleanAttribute(v)
}
function showCountAttr(v: unknown): boolean | TextareaShowCount | undefined {
  return v === undefined || v === null
    ? undefined
    : typeof v === 'object'
      ? (v as TextareaShowCount)
      : booleanAttribute(v)
}

/**
 * Angular port of the React Textarea (Vuetify-style variants + Ant Design autoSize /
 * showCount / allowClear). `<ui-textarea>` is React's outer `relative space-y-2` div:
 * label, the variant control wrapper around the native <textarea>, then the
 * description block (hint / error / success / legacy counter), then projected content.
 *
 * Model is React's `value` / `defaultValue` / `valueChange` (React `onValueChange`):
 * a bound `value` is controlled, otherwise the textarea keeps its own state.
 * NG_VALUE_ACCESSOR is provided for formControl / ngModel.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-textarea',
  standalone: true,
  exportAs: 'uiTextarea',
  imports: [UiLabelComponent],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiTextareaComponent), multi: true }],
  host: {
    '[class]': 'hostClass',
    // The id / placeholder belong to the native <textarea>.
    '[attr.id]': 'null',
    '[attr.placeholder]': 'null',
  },
  template: `
    @if (label) {
      <label ui-label [for]="textareaId" [class]="labelClass"
        >{{ label }}
        @if (required) {
          <span class="text-destructive ml-0.5">*</span>
        }
      </label>
    }
    <div [class]="controlClass" [style.background-color]="bgColor || null">
      @if (prefix) {
        <span [class]="prefixClass">{{ prefix }}</span>
      }
      <textarea
        #textareaEl
        [attr.id]="textareaId"
        [value]="currentValue"
        [attr.placeholder]="placeholder ?? null"
        [disabled]="disabled"
        [readOnly]="readOnly"
        [required]="required"
        [attr.name]="name ?? null"
        [attr.autocomplete]="autoComplete ?? null"
        [autofocus]="autoFocus"
        [attr.spellcheck]="spellCheck === undefined ? null : spellCheck"
        [attr.maxlength]="maxLength ?? null"
        [rows]="computedRows"
        [attr.aria-describedby]="hasError || hasSuccess || hint ? descriptionId : null"
        [attr.aria-invalid]="hasError ? 'true' : null"
        [class]="textareaClass"
        (input)="handleInput($event)"
        (focus)="handleFocus()"
        (blur)="handleBlur()"
        (keydown)="keyDown.emit($event)"
        (keyup)="keyUp.emit($event)"
      ></textarea>
      @if (suffix) {
        <span [class]="suffixClass">{{ suffix }}</span>
      }
      @if (showClear) {
        <button type="button" tabindex="-1" aria-label="Clear" [class]="clearClass" (click)="handleClear()">
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
      @if (loading) {
        <div class="absolute top-3 right-3 flex items-center justify-center">
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
            class="lucide lucide-loader text-muted-foreground size-4 animate-spin"
            aria-hidden="true"
          >
            <path d="M12 2v4" />
            <path d="m16.2 7.8 2.9-2.9" />
            <path d="M18 12h4" />
            <path d="m16.2 16.2 2.9 2.9" />
            <path d="M12 18v4" />
            <path d="m4.9 19.1 2.9-2.9" />
            <path d="M2 12h4" />
            <path d="m4.9 4.9 2.9 2.9" />
          </svg>
        </div>
      }
      @if (hasSuccess && !loading) {
        <div class="text-success absolute top-3 right-3 flex items-center justify-center">
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
            class="lucide lucide-check size-4"
            aria-hidden="true"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
      }
      @if (hasError && !loading) {
        <div class="text-destructive absolute top-3 right-3 flex items-center justify-center">
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
            class="lucide lucide-circle-alert size-4"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
          </svg>
        </div>
      }
      @if (showCountEnabled) {
        <div [class]="countClass">{{ countText }}</div>
      }
    </div>
    <div [attr.id]="descriptionId" class="mt-1.5">
      @if (hint && (!hasError || persistentHint) && !focused()) {
        <p [class]="hintClass">{{ hint }}</p>
      }
      @for (msg of computedErrorMessages; track $index) {
        <p class="text-destructive flex items-center gap-1 text-sm" role="alert">
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
            class="lucide lucide-circle-alert size-3 shrink-0"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" /></svg
          >{{ msg }}
        </p>
      }
      @for (msg of computedSuccessMessages; track $index) {
        <p class="text-success flex items-center gap-1 text-sm">
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
            class="lucide lucide-check size-3 shrink-0"
            aria-hidden="true"
          >
            <path d="M20 6 9 17l-5-5" /></svg
          >{{ msg }}
        </p>
      }
      @if (computedCounter !== null) {
        <div [class]="counterClass">{{ currentLength }} / {{ computedCounter }}</div>
      }
    </div>
    <ng-content />
  `,
})
export class UiTextareaComponent implements ControlValueAccessor, AfterViewInit, AfterViewChecked {
  // Zoneless-safe: form writes happen outside template events, so schedule a repaint.
  private readonly cdr = inject(ChangeDetectorRef)
  @ViewChild('textareaEl', { static: true }) textareaEl!: ElementRef<HTMLTextAreaElement>

  private readonly autoId = uniqueId('textarea')
  private readonly _valueProp = signal<string | number | undefined>(undefined)
  private readonly _internal = signal<string | number | null>(null)
  private readonly _errors = signal<string[]>([])
  readonly focused = signal(false)

  // Core
  /** Controlled value (React `value`). Reading it returns the resolved current value. */
  @Input()
  set value(v: string | number | null | undefined) {
    this._valueProp.set(v === undefined ? undefined : (v ?? ''))
  }
  get value(): string | number {
    return this.currentValue
  }
  @Input() defaultValue?: string | number
  /** React `onValueChange`. */
  @Output() valueChange = new EventEmitter<string>()
  @Input() label?: string
  @Input() placeholder?: string
  @Input() hint?: string
  @Input() error?: string
  @Input() success?: string
  @Input() messages?: string[]
  @Input({ transform: booleanAttribute }) disabled = false
  @Input({ transform: booleanAttribute }) readOnly = false
  /** Lower-case HTML spelling of `readOnly`. */
  @Input({ alias: 'readonly', transform: booleanAttribute }) set readonlyAlias(v: boolean) {
    this.readOnly = v
  }
  @Input({ transform: booleanAttribute }) required = false
  @Input({ transform: booleanAttribute }) autoFocus = false
  @Input() name?: string
  @Input() id?: string

  // Variants
  @Input() variant: TextareaVariant = 'outlined'
  @Input() color?: TextareaColor
  @Input() density: TextareaDensity = 'default'
  @Input() rounded: TextareaRounded = 'none'

  // Sizing
  @Input({ transform: autoSizeAttr }) autoSize?: boolean | TextareaAutoSize
  @Input({ transform: booleanAttribute }) autoGrow = false
  @Input({ transform: booleanAttribute }) noResize = false
  @Input({ transform: booleanAttribute }) autoResize = false
  @Input() rows: number | string = 3
  @Input() rowHeight = 24

  // Adornments / counters
  @Input() prefix?: string
  @Input() suffix?: string
  @Input() counter?: boolean | number
  @Input({ transform: showCountAttr }) showCount?: boolean | TextareaShowCount
  @Input() maxLength?: number
  /** Lower-case HTML spelling of `maxLength`. */
  @Input('maxlength') set maxlengthAlias(v: number | string | undefined) {
    this.maxLength = v == null || v === '' ? undefined : Number(v)
  }
  @Input({ transform: booleanAttribute }) allowClear = false

  // Validation
  @Input() rules?: TextareaRule[]
  @Input() errorMessages?: string | string[]
  @Input() successMessages?: string | string[]
  @Input() validateOn?: TextareaValidateOn

  // States
  @Input({ transform: booleanAttribute }) loading = false
  @Input({ transform: booleanAttribute }) persistentHint = false
  @Input({ transform: optionalBool }) persistentError?: boolean
  @Input({ transform: optionalBool }) persistentPlaceholder?: boolean
  @Input({ transform: optionalBool }) persistentPrefix?: boolean
  @Input({ transform: optionalBool }) persistentSuffix?: boolean

  // Misc
  @Input('class') className?: string
  @Input() inputClassName?: string
  @Input() labelClassName?: string
  @Input() hintClassName?: string
  @Input() bgColor?: string
  @Input({ transform: optionalBool }) flat?: boolean
  @Input({ transform: optionalBool }) bordered?: boolean
  @Input({ transform: optionalBool }) spellCheck?: boolean
  @Input() autoComplete?: string
  @Input() direction?: 'ltr' | 'rtl'

  // Events
  @Output() clear = new EventEmitter<void>()
  @Output('focus') focusEvent = new EventEmitter<void>()
  @Output('blur') blurEvent = new EventEmitter<void>()
  @Output() keyDown = new EventEmitter<KeyboardEvent>()
  @Output() keyUp = new EventEmitter<KeyboardEvent>()

  private minHeightPx = 0
  private maxHeightPx = Infinity
  private lastResizedValue: string | null = null

  private onChange: (v: string) => void = () => {}
  private onTouched: () => void = () => {}

  get textareaId(): string {
    return this.id ?? this.autoId
  }
  get descriptionId(): string {
    return `${this.textareaId}-description`
  }
  get isControlled(): boolean {
    return this._valueProp() !== undefined
  }
  get currentValue(): string | number {
    return this._valueProp() ?? this._internal() ?? this.defaultValue ?? ''
  }
  get currentLength(): number {
    return String(this.currentValue ?? '').length
  }
  get autoSizeEnabled(): boolean {
    return this.autoSize !== undefined
  }
  get anyAutoResize(): boolean {
    return this.autoSizeEnabled || this.autoResize || this.autoGrow
  }
  private get autoSizeConfig(): TextareaAutoSize {
    return typeof this.autoSize === 'object' ? this.autoSize : {}
  }
  get rowsNum(): number {
    return Number(this.rows) || 3
  }
  /** Legacy autoGrow: grow `rows` to fit the content. */
  get computedRows(): number {
    if (this.autoSizeEnabled || this.autoResize) return this.rowsNum
    if (!this.autoGrow) return this.rowsNum
    const el = this.textareaEl?.nativeElement
    if (!el) return this.rowsNum
    const lineHeight = this.rowHeight
    const newRows = Math.ceil((el.scrollHeight - lineHeight) / lineHeight) + 1
    return Math.max(this.rowsNum, newRows)
  }

  get computedErrorMessages(): string[] {
    if (this.errorMessages) return Array.isArray(this.errorMessages) ? this.errorMessages : [this.errorMessages]
    if (this.error) return [this.error]
    return this._errors()
  }
  get computedSuccessMessages(): string[] {
    if (this.successMessages) return Array.isArray(this.successMessages) ? this.successMessages : [this.successMessages]
    if (this.success) return [this.success]
    return []
  }
  get hasError(): boolean {
    return this.computedErrorMessages.length > 0
  }
  get hasSuccess(): boolean {
    return this.computedSuccessMessages.length > 0
  }
  get computedCounter(): number | null {
    if (typeof this.counter === 'number') return this.counter
    if (this.counter) return this.maxLength ?? 100
    return null
  }
  get showCountEnabled(): boolean {
    return this.showCount !== undefined && this.showCount !== false
  }
  get countText(): string {
    const formatter = typeof this.showCount === 'object' ? this.showCount.formatter : undefined
    if (formatter) return formatter(this.currentLength, this.maxLength)
    if (this.maxLength !== undefined) return `${this.currentLength} / ${this.maxLength}`
    return `${this.currentLength}`
  }
  get showClear(): boolean {
    return this.allowClear && !this.disabled && !this.readOnly && this.currentLength > 0
  }

  get hostClass(): string {
    return cn('block relative space-y-2', this.className)
  }

  get labelClass(): string {
    return cn(
      'text-foreground text-sm font-medium',
      this.labelClassName,
      this.focused() && 'text-primary',
      this.hasError && 'text-destructive',
    )
  }

  private get variantClasses(): string {
    const base = 'w-full transition-colors duration-200'
    const focused = this.focused()
    const hasError = this.hasError
    switch (this.variant) {
      case 'outlined':
        return cn(
          base,
          'border-2 rounded-lg',
          focused ? 'border-primary ring-2 ring-primary/20' : 'border-input',
          hasError && 'border-destructive focus:border-destructive focus:ring-destructive/20',
        )
      case 'filled':
        return cn(
          base,
          'border-b-2 bg-muted/50 rounded-t-lg',
          focused ? 'border-primary bg-muted' : 'border-transparent',
          hasError && 'border-destructive',
        )
      case 'solo':
        return cn(
          base,
          'rounded-lg shadow-sm',
          focused ? 'shadow-md' : 'shadow-sm',
          'bg-card border border-transparent',
        )
      case 'underlined':
        return cn(
          base,
          'border-b-2 rounded-none border-x-0 border-t-0 px-0',
          focused ? 'border-primary' : 'border-muted-foreground/30',
          hasError && 'border-destructive',
        )
      case 'plain':
        return cn(base, 'border-0 bg-transparent')
      default:
        return base
    }
  }

  private get densityClasses(): string {
    switch (this.density) {
      case 'compact':
        return 'text-sm min-h-[32px]'
      case 'comfortable':
        return 'text-base min-h-[40px]'
      default:
        return 'text-base min-h-[48px]'
    }
  }

  private get resizeClasses(): string {
    if (this.noResize) return 'resize-none'
    if (this.anyAutoResize) return 'resize-none'
    return 'resize-y'
  }

  get controlClass(): string {
    return cn(
      'relative flex items-center',
      this.variantClasses,
      this.densityClasses,
      this.disabled && 'pointer-events-none opacity-50',
      this.readOnly && !this.disabled && 'cursor-default',
      this.rounded !== 'none' && `rounded-${this.rounded}`,
    )
  }

  get prefixClass(): string {
    return cn(
      'text-muted-foreground pointer-events-none absolute top-3 left-3 text-sm',
      !this.persistentPrefix && !this.focused() && 'opacity-50',
    )
  }

  get suffixClass(): string {
    return cn(
      'text-muted-foreground pointer-events-none absolute top-3 right-3 text-sm',
      !this.persistentSuffix && !this.focused() && 'opacity-50',
    )
  }

  get textareaClass(): string {
    return cn(
      'w-full flex-1 resize-y bg-transparent outline-none',
      this.densityClasses,
      this.resizeClasses,
      this.prefix ? 'pl-16' : 'pl-3',
      this.suffix ? 'pr-16' : this.showClear ? 'pr-10' : 'pr-3',
      this.showCountEnabled && 'pb-6',
      'py-2',
      this.inputClassName,
    )
  }

  get clearClass(): string {
    return cn(
      'text-muted-foreground hover:text-foreground focus-visible:ring-ring absolute top-3 flex items-center justify-center rounded-sm transition-colors focus-visible:ring-2 focus-visible:outline-none',
      this.suffix ? 'right-10' : 'right-3',
    )
  }

  get countClass(): string {
    return cn(
      'text-muted-foreground pointer-events-none absolute right-3 bottom-1.5 text-xs',
      this.maxLength !== undefined && this.currentLength > this.maxLength && 'text-destructive',
    )
  }

  get hintClass(): string {
    return cn('text-muted-foreground text-sm', this.hintClassName)
  }

  get counterClass(): string {
    return cn(
      'text-muted-foreground mt-1 text-right text-xs',
      this.computedCounter !== null && this.currentLength > this.computedCounter && 'text-destructive',
    )
  }

  ngAfterViewInit(): void {
    requestAnimationFrame(() => {
      this.measureHeights()
      if (this.anyAutoResize) this.autoResizeFn()
    })
  }

  ngAfterViewChecked(): void {
    const el = this.textareaEl?.nativeElement
    if (!el) return
    const current = String(this.currentValue ?? '')
    // A controlled parent that did not take the edit wins (React semantics).
    if (this.isControlled && el.value !== current) el.value = current
    // Programmatic value changes re-fit the height, like React's effect on the value.
    if (this.anyAutoResize && this.lastResizedValue !== current) {
      this.lastResizedValue = current
      requestAnimationFrame(() => this.autoResizeFn())
    }
  }

  /** Fit the height to the content, clamped to the measured autoSize min / max rows. */
  autoResizeFn(): void {
    const el = this.textareaEl?.nativeElement
    if (!el || !this.anyAutoResize) return
    el.style.height = 'auto'
    let newHeight = el.scrollHeight
    if (this.minHeightPx && newHeight < this.minHeightPx) newHeight = this.minHeightPx
    if (newHeight > this.maxHeightPx) {
      newHeight = this.maxHeightPx
      el.style.overflowY = 'auto'
    } else {
      el.style.overflowY = 'hidden'
    }
    el.style.height = `${newHeight}px`
  }

  private measureHeights(): void {
    const el = this.textareaEl?.nativeElement
    if (!el || !this.autoSizeEnabled) return
    const originalValue = el.value
    const originalRows = el.rows
    const originalOverflow = el.style.overflowY
    el.value = ''
    el.style.overflowY = 'hidden'
    const { minRows, maxRows } = this.autoSizeConfig
    if (minRows) {
      el.rows = minRows
      this.minHeightPx = el.scrollHeight
    } else {
      this.minHeightPx = 0
    }
    if (maxRows) {
      el.rows = maxRows
      this.maxHeightPx = el.scrollHeight
    } else {
      this.maxHeightPx = Infinity
    }
    el.value = originalValue
    el.rows = originalRows
    el.style.overflowY = originalOverflow
    this.autoResizeFn()
  }

  private runRules(v: unknown): string[] {
    const out: string[] = []
    for (const rule of this.rules ?? []) {
      const result = rule(v)
      if (result !== true) out.push(result as string)
    }
    return out
  }

  /** Run `rules` against the current value (React `validate`); true when all pass. */
  validate(): boolean {
    const next = this.runRules(this.currentValue)
    this._errors.set(next)
    return next.length === 0
  }

  private setValue(next: string): void {
    if (!this.isControlled) this._internal.set(next)
    this.onChange(next)
    this.valueChange.emit(next)
  }

  handleInput(event: Event): void {
    const next = (event.target as HTMLTextAreaElement).value
    this.setValue(next)
    if (this.anyAutoResize) this.autoResizeFn()
    if (this.validateOn === 'input' || this.validateOn === 'inputlazy') this._errors.set(this.runRules(next))
  }

  handleClear(): void {
    this.setValue('')
    this.clear.emit()
    requestAnimationFrame(() => {
      this.autoResizeFn()
      this.textareaEl?.nativeElement.focus()
    })
  }

  handleFocus(): void {
    this.focused.set(true)
    this.focusEvent.emit()
  }

  handleBlur(): void {
    this.focused.set(false)
    if (this.validateOn === 'blur' || this.validateOn === 'blurlazy') this.validate()
    this.onTouched()
    this.blurEvent.emit()
  }

  writeValue(v: string | number | null): void {
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
