import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  booleanAttribute,
  forwardRef,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms'
import { cn } from '@/lib/utils'

export type RadioOption = string | { label: string; value: string; disabled?: boolean }
export type RadioOrientation = 'horizontal' | 'vertical'
export type RadioDensity = 'compact' | 'default' | 'comfortable'
/** Button-style radio sizes (group `size`, RadioButton `size`). */
export type RadioButtonSize = 'small' | 'middle' | 'large'
export type RadioItemDotSize = 'sm' | 'md' | 'lg'
export type RadioButtonVariant = 'outline' | 'solid'
export type RadioColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | (string & {})

export interface NormalizedRadioOption {
  label: string
  value: string
  disabled?: boolean
}

export function normalizeRadioOption(option: RadioOption): NormalizedRadioOption {
  if (typeof option === 'string') return { label: option, value: option }
  return option
}

function optionalBoolean(v: unknown): boolean | undefined {
  return v === undefined || v === null ? undefined : booleanAttribute(v)
}

function hasErrors(error: boolean, errorMessages: string | string[] | undefined): boolean {
  return (
    error || Boolean(errorMessages && (typeof errorMessages === 'string' ? errorMessages : errorMessages.length > 0))
  )
}

function toList(errorMessages: string | string[] | undefined): string[] {
  if (!errorMessages) return []
  return typeof errorMessages === 'string' ? [errorMessages] : errorMessages
}

const GROUP_DENSITY_CLASSES: Record<RadioDensity, string> = {
  compact: 'gap-1',
  default: 'gap-3',
  comfortable: 'gap-4',
}

const ITEM_DENSITY_CLASSES: Record<RadioDensity, string> = {
  compact: 'gap-1',
  default: 'gap-2',
  comfortable: 'gap-3',
}

const ITEM_SIZE_CLASSES: Record<RadioItemDotSize, string> = {
  sm: 'size-3.5',
  md: 'size-4',
  lg: 'size-5',
}

const INDICATOR_SIZES: Record<RadioItemDotSize, string> = {
  sm: 'size-1.5',
  md: 'size-2',
  lg: 'size-2.5',
}

const ITEM_COLOR_CLASSES: Record<string, string> = {
  primary: 'data-[state=checked]:border-primary',
  secondary: 'data-[state=checked]:border-secondary',
  success: 'data-[state=checked]:border-success data-[state=checked]:text-success',
  warning: 'data-[state=checked]:border-warning data-[state=checked]:text-warning',
  error: 'data-[state=checked]:border-destructive data-[state=checked]:text-destructive',
  info: 'data-[state=checked]:border-info data-[state=checked]:text-info',
}

const BUTTON_SIZE_CLASSES: Record<RadioButtonSize, string> = {
  small: 'h-7 px-2.5 text-xs',
  middle: 'h-8 px-4 text-sm',
  large: 'h-10 px-4.5 text-base',
}

const BUTTON_VARIANT_CLASSES: Record<RadioButtonVariant, string> = {
  outline: cn(
    'border border-input bg-transparent text-foreground hover:text-foreground hover:bg-muted/50',
    'data-[state=checked]:border-primary data-[state=checked]:text-primary',
    'disabled:hover:bg-transparent',
  ),
  solid: cn(
    'border border-input bg-transparent text-foreground hover:text-foreground hover:bg-muted/50',
    'data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
    'disabled:hover:bg-transparent',
  ),
}

/** Radix RovingFocusGroup key -> focus intent. */
const KEY_TO_INTENT: Record<string, 'first' | 'last' | 'prev' | 'next'> = {
  ArrowLeft: 'prev',
  ArrowUp: 'prev',
  ArrowRight: 'next',
  ArrowDown: 'next',
  PageUp: 'first',
  Home: 'first',
  PageDown: 'last',
  End: 'last',
}
const ARROW_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']

/** What the group needs from each radio (RadioGroupItem / RadioButton). */
interface RadioItem {
  readonly value: string
  readonly isDisabled: boolean
  readonly hostEl: HTMLElement
  focusTarget(): HTMLElement | null
}

/**
 * Angular port of the React RadioGroupItem: a Radix radio `<button role="radio">` with the
 * circle indicator, plus optional label (before / after), hint and error messages. Reads
 * checked / disabled state from the enclosing RadioGroup. `class` / `id` go to the button.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-radio-group-item, [ui-radio-group-item], ui-radio-item',
  standalone: true,
  host: {
    // [attr.class], not [class]: [class] merges in the consumer's static class attribute, which
    // belongs to the inner root only.
    '[attr.class]': 'wrapperClass',
    // id belongs to the button; keep a static id off the host so <label for> finds the button.
    '[attr.id]': 'null',
  },
  template: `
    <div class="flex items-center">
      @if (label && labelPosition === 'before') {
        <label [attr.for]="id" [class]="labelClass('mr-2')">{{ label }}</label>
      }
      <button
        type="button"
        role="radio"
        data-uipkge=""
        data-slot="radio-group-item"
        [attr.id]="id"
        [attr.value]="value"
        [attr.aria-checked]="checked"
        [attr.aria-busy]="loading || null"
        [attr.aria-invalid]="hasError || null"
        [attr.data-state]="checked ? 'checked' : 'unchecked'"
        [attr.data-disabled]="isDisabled ? '' : null"
        [attr.data-orientation]="group?.orientation"
        [attr.tabindex]="group ? group.tabIndexFor(this) : null"
        [disabled]="isDisabled"
        [class]="buttonClass"
        (click)="onClick()"
        (focus)="group?.onItemFocus(this)"
        (keydown)="onKeydown($event)"
      >
        @if (checked) {
          <span
            data-uipkge=""
            data-slot="radio-group-indicator"
            data-state="checked"
            [attr.data-disabled]="isDisabled ? '' : null"
            class="relative flex items-center justify-center"
          >
            @if (!hideIcon) {
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
                [attr.class]="indicatorClass"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
              </svg>
            }
          </span>
        }
      </button>
      @if (label && labelPosition === 'after') {
        <label [attr.for]="id" [class]="labelClass('ml-2')">{{ label }}</label>
      }
    </div>
    @if (hint && !hasError) {
      <p class="text-muted-foreground ml-6 text-xs">{{ hint }}</p>
    }
    @if (hasError) {
      <div class="ml-6 flex flex-col gap-0.5">
        @for (msg of errorList; track $index) {
          <p class="text-destructive text-xs">{{ msg }}</p>
        }
      </div>
    }
  `,
})
export class UiRadioGroupItemComponent implements RadioItem, OnDestroy {
  // The group class is declared below (it imports these parts); resolved at construction time.
  readonly group: UiRadioGroupComponent | null = inject(
    forwardRef(() => UiRadioGroupComponent),
    { optional: true },
  )
  readonly hostEl: HTMLElement = inject(ElementRef).nativeElement

  @Input() value = ''
  @Input() id?: string
  @Input({ transform: optionalBoolean }) disabled?: boolean
  @Input() size: RadioItemDotSize = 'md'
  @Input() color: RadioColor = 'primary'
  @Input() label?: string
  @Input() hint?: string
  @Input() errorMessages?: string | string[]
  @Input({ transform: booleanAttribute }) error = false
  @Input() density: RadioDensity = 'default'
  @Input() labelPosition: 'before' | 'after' = 'after'
  @Input({ transform: booleanAttribute }) loading = false
  @Input({ transform: booleanAttribute }) hideIcon = false
  @Input('class') className?: string

  constructor() {
    this.group?.register(this)
  }

  ngOnDestroy(): void {
    this.group?.unregister(this)
  }

  get checked(): boolean {
    return this.group?.isChecked(this.value) ?? false
  }

  /** React: loading || (disabled ?? group.disabled); Radix also ORs the group's disabled. */
  get isDisabled(): boolean {
    return this.loading || (this.disabled ?? this.group?.disabled ?? false) || !!this.group?.disabled
  }

  get hasError(): boolean {
    return hasErrors(this.error, this.errorMessages)
  }

  get errorList(): string[] {
    return toList(this.errorMessages)
  }

  get wrapperClass(): string {
    return cn('flex flex-col', ITEM_DENSITY_CLASSES[this.density])
  }

  get buttonClass(): string {
    return cn(
      'border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square shrink-0 rounded-full border shadow-sm transition-colors duration-200 outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
      ITEM_SIZE_CLASSES[this.size],
      ITEM_COLOR_CLASSES[this.color] || ITEM_COLOR_CLASSES['primary'],
      this.hasError && 'border-destructive',
      this.loading && 'opacity-50',
      this.className,
    )
  }

  get indicatorClass(): string {
    return cn(
      'lucide lucide-circle',
      'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fill-current text-current',
      INDICATOR_SIZES[this.size],
    )
  }

  labelClass(side: string): string {
    return cn(
      side,
      cn(
        'cursor-pointer text-sm leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        this.hasError ? 'text-destructive' : '',
        this.isDisabled && 'cursor-not-allowed opacity-50',
      ),
    )
  }

  focusTarget(): HTMLElement | null {
    return this.hostEl.querySelector<HTMLElement>('button[role="radio"]')
  }

  onClick(): void {
    if (!this.isDisabled && !this.checked) this.group?.select(this.value)
  }

  onKeydown(event: KeyboardEvent): void {
    this.group?.onItemKeydown(this, event)
  }
}

/**
 * Angular port of the React RadioButton (Ant-style button radio). The host is the Radix
 * radio itself: use `<button ui-radio-button>` for React's exact DOM, or `<ui-radio-button>`
 * (focusable role="radio", Space selects). Size / variant / disabled default to the group's.
 * Content: projected children, else `label`, else `value` (React `children ?? label ?? value`).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-radio-button, [ui-radio-button]',
  standalone: true,
  host: {
    '[attr.type]': 'isNativeButton ? "button" : null',
    '[attr.role]': '"radio"',
    '[attr.aria-checked]': 'checked',
    '[attr.aria-disabled]': '!isNativeButton && isDisabled ? "true" : null',
    '[attr.data-state]': 'checked ? "checked" : "unchecked"',
    '[attr.data-disabled]': 'isDisabled ? "" : null',
    '[attr.data-orientation]': 'group?.orientation',
    '[attr.disabled]': 'isNativeButton && isDisabled ? "" : null',
    '[attr.value]': 'value',
    '[attr.tabindex]': 'group ? group.tabIndexFor(this) : isNativeButton ? null : 0',
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"radio-button"',
    '[class]': 'hostClass',
    '(click)': 'onClick()',
    '(focus)': 'group?.onItemFocus(this)',
    '(keydown)': 'onKeydown($event)',
  },
  template: `<ng-content>{{ label ?? value }}</ng-content>`,
})
export class UiRadioButtonComponent implements RadioItem, OnDestroy {
  // The group class is declared below (it imports these parts); resolved at construction time.
  readonly group: UiRadioGroupComponent | null = inject(
    forwardRef(() => UiRadioGroupComponent),
    { optional: true },
  )
  readonly hostEl: HTMLElement = inject(ElementRef).nativeElement
  readonly isNativeButton = this.hostEl.tagName === 'BUTTON'

  @Input() value = ''
  @Input({ transform: optionalBoolean }) disabled?: boolean
  @Input() size?: RadioButtonSize
  @Input() variant?: RadioButtonVariant
  @Input() label?: string
  @Input('class') className?: string

  constructor() {
    this.group?.register(this)
  }

  ngOnDestroy(): void {
    this.group?.unregister(this)
  }

  get checked(): boolean {
    return this.group?.isChecked(this.value) ?? false
  }

  get isDisabled(): boolean {
    return (this.disabled ?? this.group?.disabled ?? false) || !!this.group?.disabled
  }

  get hostClass(): string {
    const size = this.size ?? this.group?.size ?? 'middle'
    const variant = this.variant ?? this.group?.buttonVariant ?? 'outline'
    const groupClasses =
      this.group?.orientation === 'vertical'
        ? 'rounded-md w-full justify-start'
        : cn('rounded-none first:rounded-l-md last:rounded-r-md', 'border-l-0 first:border-l', '-ml-px first:ml-0')
    return cn(
      'inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap transition-colors duration-200',
      'focus-visible:border-ring focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]',
      'disabled:cursor-not-allowed disabled:opacity-50',
      BUTTON_SIZE_CLASSES[size],
      BUTTON_VARIANT_CLASSES[variant],
      groupClasses,
      // A custom-element host never matches :disabled, so mirror the disabled look via data-disabled.
      !this.isNativeButton && 'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
      this.className,
    )
  }

  focusTarget(): HTMLElement {
    return this.hostEl
  }

  onClick(): void {
    if (!this.isDisabled && !this.checked) this.group?.select(this.value)
  }

  onKeydown(event: KeyboardEvent): void {
    // Native buttons turn Space into a click; the custom-element host needs it done here.
    if (!this.isNativeButton && event.key === ' ') {
      event.preventDefault()
      this.onClick()
      return
    }
    this.group?.onItemKeydown(this, event)
  }
}

/**
 * Angular port of the React RadioGroup (Radix RadioGroup). The host is React's outer
 * `flex flex-col gap-2` wrapper (label, hint, errors); inside it the `role="radiogroup"`
 * root holds `options` or projected RadioGroupItem / RadioButton parts, which read the
 * group's value / disabled / size / variant / orientation through DI.
 *
 * Model is React's `value` / `defaultValue` / `valueChange` (`[(value)]`) plus
 * NG_VALUE_ACCESSOR. Keyboard is Radix roving focus: arrow keys move focus and select
 * (Left/Right ignored when vertical, Up/Down when horizontal, rtl flips), Home / End /
 * PageUp / PageDown move focus only, `loop` wraps, disabled items are skipped, and only
 * the checked (or first enabled) radio is in the Tab order. `class` goes to the root.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-radio-group, [ui-radio-group]',
  standalone: true,
  exportAs: 'uiRadioGroup',
  imports: [UiRadioGroupItemComponent, UiRadioButtonComponent],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiRadioGroupComponent), multi: true }],
  host: { '[attr.class]': '"flex flex-col gap-2"' },
  template: `
    @if (label) {
      <label class="text-sm font-medium">{{ label }}</label>
    }
    @if (hint && !hasError) {
      <p class="text-muted-foreground text-xs">{{ hint }}</p>
    }
    <div
      role="radiogroup"
      data-slot="radio-group"
      [attr.aria-required]="required || null"
      [attr.aria-orientation]="orientation"
      [attr.data-orientation]="orientation"
      [attr.data-disabled]="disabled ? '' : null"
      [attr.dir]="dir"
      [class]="rootClass"
    >
      @if (normalizedOptions.length > 0) {
        @if (optionType === 'button') {
          @for (opt of normalizedOptions; track opt.value) {
            <button ui-radio-button [value]="opt.value" [disabled]="opt.disabled" [label]="opt.label"></button>
          }
        } @else {
          @for (opt of normalizedOptions; track opt.value) {
            <div class="flex items-center gap-2">
              <ui-radio-group-item [id]="opt.value" [value]="opt.value" [disabled]="opt.disabled" />
              <label [attr.for]="opt.value" [class]="optionLabelClass(opt)">{{ opt.label }}</label>
            </div>
          }
        }
      } @else {
        <ng-content />
      }
    </div>
    @if (hasError) {
      <div class="flex flex-col gap-0.5">
        @for (msg of errorList; track $index) {
          <p class="text-destructive text-xs">{{ msg }}</p>
        }
      </div>
    }
  `,
})
export class UiRadioGroupComponent implements ControlValueAccessor {
  // Zoneless-safe: form writes happen outside template events, so schedule a repaint.
  private readonly cdr = inject(ChangeDetectorRef)
  private readonly _valueProp = signal<string | undefined>(undefined)
  private readonly _internal = signal<string | null>(null)
  private readonly items: RadioItem[] = []
  /** Radix RovingFocusGroup currentTabStopId: the last focused radio. */
  private currentTabStop: RadioItem | null = null

  /** Controlled value (React `value`). Reading it returns the resolved value. */
  @Input()
  set value(v: string | null | undefined) {
    this._valueProp.set(v ?? undefined)
  }
  get value(): string | undefined {
    return this._valueProp() ?? this._internal() ?? this.defaultValue
  }
  @Input() defaultValue?: string
  @Output() valueChange = new EventEmitter<string>()

  // Signal-backed: projected items live in the parent's view, so a form's disable() must
  // reach them without a parent re-render (zoneless).
  private readonly _disabled = signal(false)
  @Input({ transform: booleanAttribute })
  set disabled(v: boolean) {
    this._disabled.set(v)
  }
  get disabled(): boolean {
    return this._disabled()
  }
  @Input() orientation: RadioOrientation = 'vertical'
  @Input({ transform: booleanAttribute }) loop = true
  @Input() label?: string
  @Input() hint?: string
  @Input() errorMessages?: string | string[]
  @Input({ transform: booleanAttribute }) error = false
  @Input() density: RadioDensity = 'default'
  @Input({ transform: booleanAttribute }) flat = false
  @Input({ transform: booleanAttribute }) bordered = false
  @Input() dir: 'ltr' | 'rtl' = 'ltr'
  @Input() options?: RadioOption[]
  @Input() size: RadioButtonSize = 'middle'
  @Input() optionType: 'default' | 'button' = 'default'
  @Input() buttonVariant: RadioButtonVariant = 'outline'
  @Input({ transform: booleanAttribute }) required = false
  @Input() name?: string
  @Input('class') className?: string

  private onChange: (v: string) => void = () => {}
  private onTouched: () => void = () => {}

  get normalizedOptions(): NormalizedRadioOption[] {
    return (this.options ?? []).map(normalizeRadioOption)
  }

  get hasError(): boolean {
    return hasErrors(this.error, this.errorMessages)
  }

  get errorList(): string[] {
    return toList(this.errorMessages)
  }

  get rootClass(): string {
    return cn(
      'grid gap-3',
      this.orientation === 'horizontal' && 'flex flex-row items-center gap-4',
      this.optionType === 'button' && this.orientation === 'horizontal' && 'flex flex-row items-stretch gap-0',
      this.optionType === 'button' && this.orientation === 'vertical' && 'flex flex-col items-stretch gap-0',
      this.optionType !== 'button' && GROUP_DENSITY_CLASSES[this.density],
      this.bordered && 'rounded-lg border p-4',
      this.className,
    )
  }

  optionLabelClass(opt: NormalizedRadioOption): string {
    return cn('cursor-pointer text-sm font-medium select-none', opt.disabled && 'cursor-not-allowed opacity-50')
  }

  isChecked(value: string): boolean {
    return this.value !== undefined && this.value === value
  }

  select(value: string): void {
    if (this.disabled || value === this.value) return
    this._internal.set(value)
    this.onChange(value)
    this.onTouched()
    this.valueChange.emit(value)
  }

  // ---- roving focus (Radix RovingFocusGroup) ----

  register(item: RadioItem): void {
    this.items.push(item)
  }

  unregister(item: RadioItem): void {
    const i = this.items.indexOf(item)
    if (i >= 0) this.items.splice(i, 1)
    if (this.currentTabStop === item) this.currentTabStop = null
  }

  private ordered(): RadioItem[] {
    return [...this.items].sort((a, b) =>
      a.hostEl.compareDocumentPosition(b.hostEl) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
    )
  }

  /** 0 for the one radio in the Tab order (last focused, else checked, else first enabled). */
  tabIndexFor(item: RadioItem): number {
    if (item.isDisabled) return -1
    const enabled = this.ordered().filter((i) => !i.isDisabled)
    const stop =
      (this.currentTabStop && enabled.includes(this.currentTabStop) ? this.currentTabStop : null) ??
      enabled.find((i) => this.isChecked(i.value)) ??
      enabled[0]
    return stop === item ? 0 : -1
  }

  onItemFocus(item: RadioItem): void {
    this.currentTabStop = item
  }

  onItemKeydown(item: RadioItem, event: KeyboardEvent): void {
    // WAI-ARIA: radio groups don't activate items on Enter.
    if (event.key === 'Enter') {
      event.preventDefault()
      return
    }
    if (event.target !== event.currentTarget) return
    const key =
      this.dir === 'rtl' && event.key === 'ArrowLeft'
        ? 'ArrowRight'
        : this.dir === 'rtl' && event.key === 'ArrowRight'
          ? 'ArrowLeft'
          : event.key
    if (this.orientation === 'vertical' && (key === 'ArrowLeft' || key === 'ArrowRight')) return
    if (this.orientation === 'horizontal' && (key === 'ArrowUp' || key === 'ArrowDown')) return
    const intent = KEY_TO_INTENT[key]
    if (!intent || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return
    event.preventDefault()
    let candidates = this.ordered().filter((i) => !i.isDisabled)
    if (intent === 'last') candidates.reverse()
    if (intent === 'prev' || intent === 'next') {
      if (intent === 'prev') candidates.reverse()
      const start = candidates.indexOf(item) + 1
      candidates = this.loop
        ? candidates.map((_, i) => candidates[(start + i) % candidates.length]!)
        : candidates.slice(start)
    }
    const target = candidates[0]?.focusTarget()
    if (!target) return
    target.focus()
    // Radix RadioGroupItem: focus that arrives from an arrow key also checks the radio.
    if (ARROW_KEYS.includes(event.key)) target.click()
  }

  writeValue(v: string | null): void {
    this._internal.set(v ?? null)
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
