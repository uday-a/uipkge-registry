import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
  booleanAttribute,
  forwardRef,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms'
import { cn } from '@/lib/utils'
import { uniqueId } from '@/ui/popper/popper'

// Copied verbatim from the React checkbox (injected there as a global <style>). Unscoped
// (ViewEncapsulation.None) so it reaches the indicator; Angular adds it once.
const CHECKBOX_MOTION_STYLES = `
@keyframes checkbox-check-in {
  0% { opacity: 0; transform: scale(0.55); }
  70% { opacity: 1; transform: scale(1.08); }
  100% { opacity: 1; transform: scale(1); }
}
[data-slot='checkbox-indicator'] .checkbox-indicator-icon {
  animation: checkbox-check-in 200ms cubic-bezier(0.22, 1.2, 0.36, 1) both;
}
@media (prefers-reduced-motion: reduce) {
  [data-slot='checkbox-indicator'] .checkbox-indicator-icon {
    animation: none !important;
  }
}
`

export type CheckedState = boolean | 'indeterminate'
export type CheckboxSize = 'sm' | 'md' | 'lg'
export type CheckboxColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | (string & {})
export type CheckboxDensity = 'compact' | 'default' | 'comfortable'
export interface CheckboxOption {
  label: string
  value: string
  disabled?: boolean
}

const SIZE_CLASSES: Record<CheckboxSize, string> = {
  sm: 'size-3.5',
  md: 'size-4',
  lg: 'size-5',
}

const ICON_SIZES: Record<CheckboxSize, string> = {
  sm: 'size-2.5',
  md: 'size-3.5',
  lg: 'size-4',
}

const COLOR_CLASSES: Record<string, string> = {
  primary:
    'data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary',
  secondary:
    'data-[state=checked]:bg-secondary data-[state=checked]:border-secondary data-[state=indeterminate]:bg-secondary data-[state=indeterminate]:border-secondary',
  success:
    'data-[state=checked]:bg-success data-[state=checked]:border-success data-[state=indeterminate]:bg-success data-[state=indeterminate]:border-success',
  warning:
    'data-[state=checked]:bg-warning data-[state=checked]:border-warning data-[state=indeterminate]:bg-warning data-[state=indeterminate]:border-warning',
  error:
    'data-[state=checked]:bg-destructive data-[state=checked]:border-destructive data-[state=indeterminate]:bg-destructive data-[state=indeterminate]:border-destructive',
  info: 'data-[state=checked]:bg-info data-[state=checked]:border-info data-[state=indeterminate]:bg-info data-[state=indeterminate]:border-info',
}

const DENSITY_CLASSES: Record<CheckboxDensity, string> = {
  compact: 'gap-1',
  default: 'gap-2',
  comfortable: 'gap-3',
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

function optionalChecked(v: unknown): CheckedState | undefined {
  return v === undefined || v === null ? undefined : v === 'indeterminate' ? 'indeterminate' : booleanAttribute(v)
}

/**
 * Angular port of the React Checkbox (Radix Checkbox). The host is React's layout wrapper;
 * inside it the control is a real `<button role="checkbox">` (so `<label for>`, :disabled,
 * Space activation and focus behave natively), with the check / minus indicator, label
 * before / after, hint and error messages.
 *
 * Model is React's `checked` / `defaultChecked` / `checkedChange` (`[(checked)]`,
 * `true | false | 'indeterminate'`) plus NG_VALUE_ACCESSOR. `value` is the form value
 * (Radix default 'on'). `class` / `id` go to the button, as React's className / id do.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-checkbox, [ui-checkbox]',
  standalone: true,
  exportAs: 'uiCheckbox',
  encapsulation: ViewEncapsulation.None,
  styles: [CHECKBOX_MOTION_STYLES],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiCheckboxComponent), multi: true }],
  host: {
    // [attr.class], not [class]: [class] merges in the consumer's static class attribute, so
    // it would land on the wrapper as well as the button.
    '[attr.class]': 'wrapperClass',
    // id / class / aria-label / tabindex belong to the button; keep static attributes off the host.
    '[attr.id]': 'null',
    '[attr.aria-label]': 'null',
    '[attr.tabindex]': 'null',
  },
  template: `
    @if (label && labelPosition === 'before') {
      <label [attr.for]="resolvedId" [class]="labelClass('mr-2')">{{ label }}</label>
    }
    <div class="flex items-center">
      <button
        type="button"
        role="checkbox"
        data-slot="checkbox"
        [attr.id]="resolvedId"
        [attr.value]="value"
        [attr.name]="name"
        [attr.aria-label]="ariaLabel || null"
        [attr.tabindex]="tabIndex ?? null"
        [attr.aria-checked]="state === 'indeterminate' ? 'mixed' : state"
        [attr.aria-required]="required || null"
        [attr.aria-invalid]="hasError || null"
        [attr.data-state]="dataState"
        [attr.data-disabled]="disabled ? '' : null"
        [disabled]="disabled"
        [class]="checkboxClass"
        (click)="toggle()"
        (keydown)="onKeydown($event)"
        (blur)="onTouched()"
      >
        @if (dataState !== 'unchecked' || forceMountIndicator) {
          <span
            data-uipkge=""
            data-slot="checkbox-indicator"
            [attr.data-state]="dataState"
            [attr.data-disabled]="disabled ? '' : null"
            class="grid place-content-center text-current transition-none"
          >
            @if (loading) {
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
                [attr.class]="iconClass('lucide lucide-loader-circle', 'animate-spin')"
                aria-hidden="true"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            } @else if (isIndeterminate) {
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
                [attr.class]="iconClass('lucide lucide-minus', 'checkbox-indicator-icon')"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
              </svg>
            } @else if (!hideIcon) {
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
                [attr.class]="iconClass('lucide lucide-check', 'checkbox-indicator-icon')"
                aria-hidden="true"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            }
          </span>
        }
      </button>
      @if (label && labelPosition === 'after') {
        <label [attr.for]="resolvedId" [class]="labelClass('ml-2')">{{ label }}</label>
      }
    </div>
    @if (hint && !hasError) {
      <p class="text-muted-foreground mt-1 text-xs">{{ hint }}</p>
    }
    @if (hasError) {
      <div class="mt-1 flex flex-col gap-0.5">
        @for (msg of errorList; track $index) {
          <p class="text-destructive text-xs">{{ msg }}</p>
        }
      </div>
    }
  `,
})
export class UiCheckboxComponent implements ControlValueAccessor {
  // Zoneless-safe: form writes happen outside template events, so schedule a repaint.
  private readonly cdr = inject(ChangeDetectorRef)
  private readonly autoId = uniqueId('checkbox')

  private readonly _checkedProp = signal<CheckedState | undefined>(undefined)
  private readonly _internal = signal<CheckedState | null>(null)

  /** Controlled state (React `checked`). Reading it returns the resolved state. */
  @Input({ transform: optionalChecked })
  set checked(v: CheckedState | undefined) {
    this._checkedProp.set(v)
  }
  get checked(): CheckedState {
    return this._checkedProp() ?? this._internal() ?? this.defaultChecked
  }
  @Input({ transform: (v: unknown) => optionalChecked(v) ?? false }) defaultChecked: CheckedState = false
  @Output() checkedChange = new EventEmitter<CheckedState>()

  /** Form value submitted when checked (Radix default 'on'). */
  @Input() value = 'on'
  @Input() id?: string
  @Input() size: CheckboxSize = 'md'
  @Input() color: CheckboxColor = 'primary'
  @Input() label?: string
  @Input() hint?: string
  @Input() errorMessages?: string | string[]
  @Input({ transform: booleanAttribute }) error = false
  @Input({ transform: booleanAttribute }) disabled = false
  @Input({ transform: booleanAttribute }) indeterminate = false
  @Input() density: CheckboxDensity = 'default'
  @Input({ transform: booleanAttribute }) hideIcon = false
  @Input({ transform: booleanAttribute }) loading = false
  @Input() labelPosition: 'before' | 'after' = 'after'
  @Input({ transform: booleanAttribute }) flat = false
  @Input({ transform: booleanAttribute }) inline = false
  @Input({ transform: booleanAttribute }) required = false
  @Input() name?: string
  @Input('aria-label') ariaLabel?: string
  @Input('class') className?: string
  /** React's `tabIndex` on the Radix button, e.g. -1 inside a clickable row. */
  @Input('tabindex') tabIndex?: number | string

  private onChange: (v: CheckedState) => void = () => {}
  onTouched: () => void = () => {}

  get isIndeterminate(): boolean {
    return this.indeterminate || this.checked === 'indeterminate'
  }

  /** What Radix Root receives: the `indeterminate` prop forces the mixed state. */
  get state(): CheckedState {
    return this.isIndeterminate ? 'indeterminate' : this.checked
  }

  get dataState(): 'checked' | 'unchecked' | 'indeterminate' {
    return this.state === 'indeterminate' ? 'indeterminate' : this.state ? 'checked' : 'unchecked'
  }

  /** React force-mounts the Indicator when indeterminate or hideIcon. */
  get forceMountIndicator(): boolean {
    return this.isIndeterminate || this.hideIcon
  }

  get resolvedId(): string | undefined {
    return this.id ?? (this.label ? this.autoId : undefined)
  }

  get hasError(): boolean {
    return hasErrors(this.error, this.errorMessages)
  }

  get errorList(): string[] {
    return toList(this.errorMessages)
  }

  get wrapperClass(): string {
    return cn('flex items-start', DENSITY_CLASSES[this.density], this.inline ? 'inline-flex' : 'flex-col')
  }

  get checkboxClass(): string {
    return cn(
      'peer border-input data-[state=checked]:text-primary-foreground data-[state=indeterminate]:text-primary-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive shrink-0 rounded-[4px] border shadow-xs transition-colors duration-200 outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
      SIZE_CLASSES[this.size],
      COLOR_CLASSES[this.color] || COLOR_CLASSES['primary'],
      this.hasError &&
        'border-destructive data-[state=checked]:!bg-destructive data-[state=checked]:!border-destructive data-[state=indeterminate]:!bg-destructive data-[state=indeterminate]:!border-destructive',
      this.flat && 'shadow-none',
      this.className,
    )
  }

  labelClass(side: string): string {
    return cn(
      side,
      cn(
        'cursor-pointer text-sm leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        this.hasError ? 'text-destructive' : '',
        this.disabled && 'cursor-not-allowed opacity-50',
      ),
    )
  }

  iconClass(lucide: string, extra: string): string {
    return cn(lucide, ICON_SIZES[this.size], extra)
  }

  /** Radix: indeterminate -> checked, otherwise flip. */
  toggle(): void {
    if (this.disabled) return
    this.setChecked(this.state === 'indeterminate' ? true : !this.state)
  }

  /** WAI-ARIA: checkboxes don't activate on Enter (Radix prevents it). */
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') event.preventDefault()
  }

  setChecked(next: CheckedState): void {
    this._internal.set(next)
    this.onChange(next)
    this.checkedChange.emit(next)
  }

  writeValue(v: CheckedState | null): void {
    this._internal.set(v ?? false)
    this.cdr.markForCheck()
  }

  registerOnChange(fn: (v: CheckedState) => void): void {
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

const normalizeOption = (option: string | CheckboxOption): CheckboxOption =>
  typeof option === 'string' ? { label: option, value: option } : option

/**
 * Angular port of the React CheckboxGroup. Renders `options` as Checkboxes bound to the
 * selected `value` array (`[(value)]` / `defaultValue` / NG_VALUE_ACCESSOR); projected
 * children render as-is, exactly like React (they are not wired to the group's value).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-checkbox-group, [ui-checkbox-group]',
  standalone: true,
  imports: [UiCheckboxComponent],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiCheckboxGroupComponent), multi: true }],
  host: {
    '[attr.data-slot]': '"checkbox-group"',
    '[attr.role]': '"group"',
    '[attr.data-orientation]': 'actualOrientation',
    '[class]': 'hostClass',
  },
  template: `
    @if (label) {
      <label class="text-sm font-medium">{{ label }}</label>
    }
    @if (hint && !error) {
      <p class="text-muted-foreground text-xs">{{ hint }}</p>
    }
    <div [class]="itemsClass">
      @if (normalizedOptions.length > 0) {
        @for (opt of normalizedOptions; track $index) {
          <ui-checkbox
            [value]="opt.value"
            [label]="opt.label"
            [disabled]="disabled || !!opt.disabled"
            [name]="name"
            [density]="density"
            [checked]="selected.includes(opt.value)"
            (checkedChange)="toggle(opt.value, $event)"
          />
        }
      } @else {
        <ng-content />
      }
    </div>
    @if (error || errorMessages) {
      <div class="flex flex-col gap-0.5">
        @for (msg of errorList; track $index) {
          <p class="text-destructive text-xs">{{ msg }}</p>
        }
      </div>
    }
  `,
})
export class UiCheckboxGroupComponent implements ControlValueAccessor {
  private readonly cdr = inject(ChangeDetectorRef)
  private readonly _valueProp = signal<string[] | undefined>(undefined)
  private readonly _internal = signal<string[] | null>(null)

  /** Controlled selection (React `value`). Reading it returns the resolved selection. */
  @Input()
  set value(v: string[] | undefined | null) {
    this._valueProp.set(v ?? undefined)
  }
  get value(): string[] {
    return this.selected
  }
  @Input() defaultValue?: string[]
  @Output() valueChange = new EventEmitter<string[]>()
  @Input({ transform: booleanAttribute }) disabled = false
  @Input({ transform: booleanAttribute }) error = false
  @Input() errorMessages?: string | string[]
  @Input() label?: string
  @Input() hint?: string
  @Input() orientation: 'horizontal' | 'vertical' = 'vertical'
  @Input({ transform: booleanAttribute }) bordered = false
  @Input() density: CheckboxDensity = 'default'
  @Input() options?: (string | CheckboxOption)[]
  @Input() name?: string
  @Input({ transform: booleanAttribute }) inline = false
  @Input('class') className?: string

  private onChange: (v: string[]) => void = () => {}
  private onTouched: () => void = () => {}

  get selected(): string[] {
    return this._valueProp() ?? this._internal() ?? this.defaultValue ?? []
  }

  get actualOrientation(): 'horizontal' | 'vertical' {
    return this.inline ? 'horizontal' : this.orientation
  }

  get normalizedOptions(): CheckboxOption[] {
    return (this.options ?? []).map(normalizeOption)
  }

  get errorList(): string[] {
    return toList(this.errorMessages)
  }

  get hostClass(): string {
    return cn(
      'flex flex-col gap-2',
      this.actualOrientation === 'horizontal' ? 'flex-row items-center' : 'flex-col',
      this.bordered && 'rounded-lg border p-4',
      this.className,
    )
  }

  get itemsClass(): string {
    return cn('flex gap-4', this.actualOrientation === 'horizontal' ? 'flex-row flex-wrap items-center' : 'flex-col')
  }

  toggle(optionValue: string, checked: CheckedState): void {
    const next = checked === true ? [...this.selected, optionValue] : this.selected.filter((v) => v !== optionValue)
    this._internal.set(next)
    this.onChange(next)
    this.onTouched()
    this.valueChange.emit(next)
  }

  writeValue(v: string[] | null): void {
    this._internal.set(v ?? [])
    this.cdr.markForCheck()
  }

  registerOnChange(fn: (v: string[]) => void): void {
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
