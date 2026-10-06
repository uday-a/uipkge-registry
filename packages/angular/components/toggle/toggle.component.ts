import {
  ChangeDetectorRef,
  Component,
  ElementRef,
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
import { toggleVariants, type ToggleVariants } from './toggle.variants'

export type ToggleVariant = NonNullable<ToggleVariants['variant']>
export type ToggleSize = NonNullable<ToggleVariants['size']>

/**
 * Angular port of UIPKGE Toggle (React `Toggle` on Radix Toggle). Radix semantics: controlled
 * `pressed` or uncontrolled `defaultPressed` + `pressedChange`, `aria-pressed`,
 * `data-state="on" | "off"`, `data-disabled` and native `disabled` (so the `disabled:*`
 * variant styles apply and a disabled toggle is skipped by Tab). Put it on a `<button>`
 * (`<button ui-toggle>`, which also gets `type="button"`); the `<ui-toggle>` custom element
 * gets button semantics via role + tabindex + Enter / Space. Also a ControlValueAccessor,
 * so `[formControl]` / `ngModel` bind the pressed state.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-toggle, [ui-toggle]',
  standalone: true,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiToggleComponent), multi: true }],
  host: {
    '[attr.type]': 'isButton ? "button" : null',
    '[attr.role]': 'isButton ? null : "button"',
    '[attr.tabindex]': 'isButton ? null : disabled ? -1 : 0',
    '[attr.aria-pressed]': 'pressed',
    '[attr.data-state]': 'pressed ? "on" : "off"',
    '[attr.data-disabled]': 'disabled ? "" : null',
    '[attr.disabled]': 'disabled && isButton ? "" : null',
    '[attr.aria-disabled]': 'disabled && !isButton ? "true" : null',
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"toggle"',
    '[class]': 'hostClass',
    '(click)': 'toggle()',
    '(keydown)': 'onKeydown($event)',
  },
  template: `<ng-content />`,
})
export class UiToggleComponent implements ControlValueAccessor {
  // Zoneless-safe: form writes happen outside template events, so schedule a repaint.
  private readonly cdr = inject(ChangeDetectorRef)
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  readonly isButton = this.el.tagName === 'BUTTON'

  /** Internal state; null until set (then `defaultPressed` applies). */
  private readonly state = signal<boolean | null>(null)
  private controlled = false

  /** Controlled pressed state. Leave unbound for uncontrolled use with `defaultPressed`. */
  @Input({ transform: booleanAttribute })
  set pressed(v: boolean) {
    this.controlled = true
    this.state.set(v)
  }
  get pressed(): boolean {
    return this.state() ?? this.defaultPressed
  }
  @Input({ transform: booleanAttribute }) defaultPressed = false
  @Output() pressedChange = new EventEmitter<boolean>()

  @Input() variant?: ToggleVariant
  @Input() size?: ToggleSize
  @Input({ transform: booleanAttribute }) disabled = false
  @Input('class') className?: string

  private onChange: (v: boolean) => void = () => {}
  private onTouched: () => void = () => {}

  get hostClass(): string {
    return cn(toggleVariants({ variant: this.variant, size: this.size }), this.className)
  }

  toggle(): void {
    if (this.disabled) return
    const next = !this.pressed
    if (!this.controlled) this.state.set(next)
    this.onChange(next)
    this.onTouched()
    this.pressedChange.emit(next)
  }

  onKeydown(event: KeyboardEvent): void {
    if (this.isButton) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      this.toggle()
    }
  }

  writeValue(v: boolean | null): void {
    this.state.set(!!v)
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

export { toggleVariants, type ToggleVariants }
