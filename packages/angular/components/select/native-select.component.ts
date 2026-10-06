import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  booleanAttribute,
  forwardRef,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core'
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms'
import { cn } from '@/lib/utils'

export interface NativeSelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

export type NativeSelectSize = 'sm' | 'md' | 'lg'

const sizeClasses: Record<NativeSelectSize, string> = {
  sm: 'h-8 text-xs pl-2.5 pr-8',
  md: 'h-9 text-sm pl-3 pr-9',
  lg: 'h-11 text-base pl-4 pr-10',
}

const iconSizes: Record<NativeSelectSize, string> = {
  sm: 'size-3.5 right-2.5',
  md: 'size-4 right-3',
  lg: 'size-5 right-3.5',
}

/**
 * Angular port of UIPKGE NativeSelect: a zero-JS styled native `<select>` with a chevron,
 * the lightweight sibling of the Radix-style `ui-select`. The host is the wrapper
 * (`native-select-wrapper`); `class` styles the wrapper and `selectClassName` the
 * `<select>`, as in React. Options come from `options`, or projected `<option>`s when
 * `options` is empty. Registers NG_VALUE_ACCESSOR so [formControl] / ngModel bind.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-native-select, [ui-native-select]',
  standalone: true,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiNativeSelectComponent), multi: true }],
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"native-select-wrapper"',
    '[class]': 'hostClass',
  },
  template: `
    <select
      data-slot="native-select"
      [disabled]="disabled"
      [attr.id]="id ?? null"
      [attr.name]="name ?? null"
      [required]="required"
      [attr.aria-label]="ariaLabel ?? null"
      [class]="selectClasses"
      (change)="onSelect($event)"
      (blur)="onTouched()"
    >
      @if (normalizedOptions.length) {
        @for (opt of normalizedOptions; track opt.value) {
          <option [value]="opt.value" [disabled]="!!opt.disabled" [selected]="isSelected(opt.value)">
            {{ opt.label }}
          </option>
        }
      } @else {
        <ng-content />
      }
    </select>
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
      data-slot="native-select-icon"
      aria-hidden="true"
      [attr.class]="iconClasses"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  `,
})
export class UiNativeSelectComponent implements ControlValueAccessor {
  // Zoneless-safe: form writes happen outside template events, so schedule a repaint.
  private readonly cdr = inject(ChangeDetectorRef)

  @Input() value?: string | number | null
  @Input() defaultValue?: string | number
  @Output() valueChange = new EventEmitter<string>()
  @Input() options: (NativeSelectOption | string)[] = []
  @Input() sizeVariant: NativeSelectSize = 'md'
  @Input({ transform: booleanAttribute }) disabled = false
  @Input({ transform: booleanAttribute }) required = false
  @Input() name?: string
  @Input() id?: string
  @Input() ariaLabel?: string
  @Input() selectClassName?: string
  @Input('class') className?: string

  private onChange: (v: string) => void = () => {}
  onTouched: () => void = () => {}

  get normalizedOptions(): NativeSelectOption[] {
    return (this.options ?? []).map((opt) => (typeof opt === 'string' ? { label: opt, value: opt } : opt))
  }

  get hostClass(): string {
    return cn('relative inline-flex w-full items-center', this.className)
  }

  get selectClasses(): string {
    return cn(
      'border-input bg-background w-full appearance-none rounded-md border shadow-xs transition-[color,box-shadow]',
      'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none',
      'disabled:bg-muted/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
      sizeClasses[this.sizeVariant],
      this.selectClassName,
    )
  }

  get iconClasses(): string {
    return cn(
      'lucide lucide-chevron-down',
      'text-muted-foreground pointer-events-none absolute transition-opacity',
      this.disabled && 'opacity-50',
      iconSizes[this.sizeVariant],
    )
  }

  isSelected(v: string | number): boolean {
    const current = this.value ?? this.defaultValue
    return current !== undefined && current !== null && String(current) === String(v)
  }

  onSelect(event: Event): void {
    if (this.disabled) return
    const v = (event.target as HTMLSelectElement).value
    this.value = v
    this.onChange(v)
    this.valueChange.emit(v)
  }

  writeValue(v: string | number | null): void {
    this.value = v ?? null
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
