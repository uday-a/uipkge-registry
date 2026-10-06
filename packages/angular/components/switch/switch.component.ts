import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  booleanAttribute,
  forwardRef,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms'
import { cn } from '@/lib/utils'
import { UiRenderTemplateDirective } from '@/ui/popper/popper'

export type SwitchSize = 'sm' | 'default' | 'lg'
export type SwitchColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | (string & {})
/** Text, or an <ng-template> (icons), shown inside the track. */
export type SwitchChildren = string | TemplateRef<unknown> | null | undefined

const COLOR_MAP: Record<string, string> = {
  primary: 'var(--primary)',
  secondary: 'var(--secondary)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  error: 'var(--destructive)',
  info: 'var(--info)',
}

const THUMB_SIZES: Record<SwitchSize, string> = {
  sm: 'size-3',
  default: 'size-4',
  lg: 'size-5',
}

const THUMB_TRANSLATE: Record<SwitchSize, string> = {
  sm: 'data-[state=checked]:translate-x-[calc(100%-2px)]',
  default: 'data-[state=checked]:translate-x-[calc(100%-2px)]',
  lg: 'data-[state=checked]:translate-x-[calc(100%-5px)]',
}

const TEXT_SIZES: Record<SwitchSize, string> = {
  sm: 'text-[0.5rem]',
  default: 'text-xs',
  lg: 'text-xs',
}

const THUMB_ICON_SIZES: Record<SwitchSize, string> = {
  sm: 'size-2',
  default: 'size-3',
  lg: 'size-3',
}

const HEIGHTS: Record<SwitchSize, string> = { sm: 'h-4', default: 'h-5', lg: 'h-6' }
const WIDTHS: Record<SwitchSize, string> = { sm: 'w-6', default: 'w-8', lg: 'w-11' }
const WIDTHS_WITH_CHILDREN: Record<SwitchSize, string> = {
  sm: 'min-w-8 w-fit',
  default: 'min-w-10 w-fit',
  lg: 'min-w-13 w-fit',
}

/**
 * Angular port of the React Switch (Radix Switch). Put it on a native button for exact
 * React DOM (`<button ui-switch>` -- labelable, native :disabled), or use `<ui-switch>`,
 * which becomes a focusable role="switch" element with Enter / Space activation.
 *
 * Model is React's `checked` / `defaultChecked` / `checkedChange` (`[(checked)]`), plus
 * NG_VALUE_ACCESSOR for formControl / ngModel. `checkedChildren` / `unCheckedChildren`
 * take text or an <ng-template>; `thumb` takes an <ng-template> rendered inside the thumb
 * (read the state through `#sw="uiSwitch"` -> `sw.checked`).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-switch, [ui-switch]',
  standalone: true,
  exportAs: 'uiSwitch',
  imports: [UiRenderTemplateDirective],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiSwitchComponent), multi: true }],
  host: {
    '[attr.type]': 'isNativeButton ? "button" : null',
    '[attr.role]': '"switch"',
    '[attr.aria-checked]': 'checked',
    '[attr.aria-required]': 'required || null',
    '[attr.aria-disabled]': '!isNativeButton && isDisabled ? "true" : null',
    '[attr.data-state]': 'dataState',
    '[attr.data-disabled]': 'isDisabled ? "" : null',
    '[attr.disabled]': 'isNativeButton && isDisabled ? "" : null',
    '[attr.tabindex]': '!isNativeButton ? (isDisabled ? null : 0) : null',
    '[attr.value]': 'value',
    '[attr.data-slot]': '"switch"',
    '[class]': 'hostClass',
    '[style.--switch-checked-bg]': 'checkedBg',
    '(click)': 'toggle()',
    '(keydown)': 'onKeydown($event)',
    '(blur)': 'onTouched()',
  },
  template: `
    @if (hasChildren) {
      <div [class]="checkedChildrenClass">
        <span class="text-primary-foreground truncate font-medium">
          @if (isTemplate(checkedChildren)) {
            <ng-container [uiRenderTemplate]="checkedChildren" />
          } @else {
            {{ checkedChildren }}
          }
        </span>
      </div>
      <div [class]="unCheckedChildrenClass">
        <span class="text-muted-foreground truncate font-medium">
          @if (isTemplate(unCheckedChildren)) {
            <ng-container [uiRenderTemplate]="unCheckedChildren" />
          } @else {
            {{ unCheckedChildren }}
          }
        </span>
      </div>
    }
    <span
      data-uipkge=""
      data-slot="switch-thumb"
      [attr.data-state]="dataState"
      [attr.data-disabled]="isDisabled ? '' : null"
      [class]="thumbClass"
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
          [attr.class]="loaderClass"
          aria-hidden="true"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      } @else if (thumb) {
        <ng-container [uiRenderTemplate]="thumb" />
      }
    </span>
  `,
})
export class UiSwitchComponent implements ControlValueAccessor {
  // Zoneless-safe: form writes happen outside template events, so schedule a repaint.
  private readonly cdr = inject(ChangeDetectorRef)
  readonly isNativeButton = inject(ElementRef).nativeElement.tagName === 'BUTTON'

  private readonly _checkedProp = signal<boolean | undefined>(undefined)
  private readonly _internal = signal<boolean | null>(null)

  /** Controlled checked state (React `checked`). Reading it returns the resolved state. */
  @Input({ transform: (v: unknown) => (v === undefined || v === null ? undefined : booleanAttribute(v)) })
  set checked(v: boolean | undefined) {
    this._checkedProp.set(v)
  }
  get checked(): boolean {
    return this._checkedProp() ?? this._internal() ?? this.defaultChecked
  }
  @Input({ transform: booleanAttribute }) defaultChecked = false
  @Output() checkedChange = new EventEmitter<boolean>()

  @Input() size: SwitchSize = 'default'
  @Input() checkedChildren: SwitchChildren
  @Input() unCheckedChildren: SwitchChildren
  @Input({ transform: booleanAttribute }) loading = false
  @Input() color?: SwitchColor
  @Input() thumb?: TemplateRef<unknown> | null
  @Input({ transform: booleanAttribute }) disabled = false
  @Input({ transform: booleanAttribute }) required = false
  @Input() name?: string
  /** Form value when checked (Radix default 'on'). */
  @Input() value = 'on'
  @Input('class') className?: string

  private onChange: (v: boolean) => void = () => {}
  onTouched: () => void = () => {}

  get isDisabled(): boolean {
    return this.disabled || this.loading
  }

  get dataState(): 'checked' | 'unchecked' {
    return this.checked ? 'checked' : 'unchecked'
  }

  get hasChildren(): boolean {
    return Boolean(this.checkedChildren || this.unCheckedChildren)
  }

  get checkedBg(): string {
    return this.color ? COLOR_MAP[this.color] || this.color : 'var(--primary)'
  }

  isTemplate(v: SwitchChildren): v is TemplateRef<unknown> {
    return v instanceof TemplateRef
  }

  get hostClass(): string {
    const width = this.hasChildren ? WIDTHS_WITH_CHILDREN[this.size] : WIDTHS[this.size]
    return cn(
      'peer focus-visible:ring-ring/50 focus-visible:border-ring data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80 relative inline-flex shrink-0 items-center overflow-hidden rounded-full border border-transparent shadow-xs outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[var(--switch-checked-bg)]',
      'touch-manipulation enabled:active:scale-[0.97] enabled:active:duration-100 motion-safe:transition-[background-color,border-color,box-shadow,transform,scale] motion-safe:duration-200 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
      `${HEIGHTS[this.size]} ${width}`,
      // A custom-element host never matches :disabled, so mirror the disabled look via data-disabled.
      !this.isNativeButton && 'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
      this.className,
    )
  }

  get checkedChildrenClass(): string {
    return cn(
      'pointer-events-none absolute inset-y-0 left-0 flex items-center pl-1 motion-safe:transition-[opacity,transform] motion-safe:duration-200 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
      this.checked ? 'translate-x-0 opacity-100' : '-translate-x-0.5 opacity-0',
      TEXT_SIZES[this.size],
    )
  }

  get unCheckedChildrenClass(): string {
    return cn(
      'pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1 motion-safe:transition-[opacity,transform] motion-safe:duration-200 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
      !this.checked ? 'translate-x-0 opacity-100' : 'translate-x-0.5 opacity-0',
      TEXT_SIZES[this.size],
    )
  }

  get thumbClass(): string {
    return cn(
      'bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none z-10 flex items-center justify-center rounded-full shadow-sm ring-0 data-[state=unchecked]:translate-x-0 motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-[cubic-bezier(0.22,1.15,0.36,1)] motion-reduce:transition-none',
      THUMB_SIZES[this.size],
      THUMB_TRANSLATE[this.size],
    )
  }

  get loaderClass(): string {
    return cn(
      'lucide lucide-loader-circle',
      THUMB_ICON_SIZES[this.size],
      'text-muted-foreground motion-safe:animate-spin',
    )
  }

  toggle(): void {
    if (this.isDisabled) return
    this.setChecked(!this.checked)
  }

  /** Native buttons activate on Enter / Space themselves; the custom-element host needs it. */
  onKeydown(event: KeyboardEvent): void {
    if (this.isNativeButton) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      this.toggle()
    }
  }

  setChecked(next: boolean): void {
    if (next === this.checked) return
    this._internal.set(next)
    this.onChange(next)
    this.checkedChange.emit(next)
  }

  writeValue(v: boolean | null): void {
    this._internal.set(!!v)
    this.cdr.markForCheck()
  }

  registerOnChange(fn: (v: boolean) => void): void {
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
