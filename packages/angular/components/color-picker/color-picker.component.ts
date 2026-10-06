import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  booleanAttribute,
  forwardRef,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms'
import { cn } from '@/lib/utils'

const DEFAULT_PRESETS = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#14b8a6',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#ffffff',
  '#d4d4d4',
  '#737373',
  '#171717',
]

/**
 * Angular port of the React ColorPicker: a native colour input hidden over a swatch
 * (the swatch shows the current value), an optional hex text field, and a row of
 * preset swatches. Controlled like React: `value` / `valueChange` (`[(value)]`), plus
 * NG_VALUE_ACCESSOR for forms.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-color-picker, [ui-color-picker]',
  standalone: true,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiColorPickerComponent), multi: true }],
  host: {
    'data-uipkge': '',
    'data-slot': 'color-picker',
    '[class]': 'hostClass',
  },
  template: `
    <div class="flex items-center gap-2">
      <div
        class="border-input relative h-10 w-10 shrink-0 overflow-hidden rounded-md border shadow-xs"
        [style.background-color]="value || '#ffffff'"
      >
        <input
          type="color"
          [value]="safeColorValue"
          [disabled]="disabled"
          aria-label="Pick color"
          class="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          (input)="emit($any($event.target).value)"
        />
      </div>
      @if (!hideHexInput) {
        <input
          type="text"
          [value]="value || ''"
          placeholder="#000000"
          spellcheck="false"
          autocomplete="off"
          [disabled]="disabled"
          aria-label="Hex color"
          class="bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 flex-1 rounded-md border px-3 text-sm uppercase shadow-xs outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
          (input)="emit($any($event.target).value)"
          (blur)="onTouched()"
        />
      }
    </div>
    @if (swatches.length > 0) {
      <div class="flex flex-wrap gap-1.5">
        @for (color of swatches; track color) {
          <button
            type="button"
            [disabled]="disabled"
            [attr.aria-label]="'Select ' + color"
            [style.background-color]="color"
            [class]="swatchClass(color)"
            (click)="emit(color)"
          ></button>
        }
      </div>
    }
  `,
})
export class UiColorPickerComponent implements ControlValueAccessor {
  // Zoneless-safe: form writes happen outside template events, so schedule a repaint.
  private readonly cdr = inject(ChangeDetectorRef)
  private readonly _value = signal<string | undefined>(undefined)
  private formBound = false

  /** Current hex value (React `value`). */
  @Input()
  set value(v: string | null | undefined) {
    this._value.set(v ?? undefined)
  }
  get value(): string | undefined {
    return this._value()
  }
  @Output() valueChange = new EventEmitter<string>()
  @Input({ transform: booleanAttribute }) disabled = false
  /** Override the swatches shown below the color input. Pass [] to hide entirely. */
  @Input() presets: string[] = DEFAULT_PRESETS
  /** Hide the hex text field next to the color trigger. */
  @Input({ transform: booleanAttribute }) hideHexInput = false
  @Input('class') className?: string

  onTouched: () => void = () => {}
  private onChange: (v: string) => void = () => {}

  get hostClass(): string {
    return cn('block space-y-3', this.className)
  }

  get swatches(): string[] {
    return this.presets ?? []
  }

  /** Native <input type="color"> only accepts #rrggbb — keep a safe value while typing free-form hex. */
  get safeColorValue(): string {
    return /^#[0-9a-fA-F]{6}$/.test(this.value || '') ? (this.value as string) : '#ffffff'
  }

  swatchClass(color: string): string {
    return cn(
      'ring-offset-background focus-visible:ring-ring/40 size-6 shrink-0 rounded-md shadow-sm transition-transform outline-none hover:scale-110 focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100',
      this.value?.toLowerCase() === color.toLowerCase()
        ? 'ring-foreground ring-2 ring-offset-2'
        : 'ring-border/50 ring-1',
      color.toLowerCase() === '#ffffff' && 'ring-border',
    )
  }

  emit(next: string): void {
    if (this.disabled) return
    // Controlled like React; a bound form control owns the value, so reflect it locally.
    if (this.formBound) this._value.set(next)
    this.valueChange.emit(next)
    this.onChange(next)
  }

  writeValue(v: string | null): void {
    this._value.set(v ?? undefined)
    this.cdr.markForCheck()
  }
  registerOnChange(fn: (v: string) => void): void {
    this.formBound = true
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
