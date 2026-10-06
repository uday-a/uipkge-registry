import {
  Component,
  ElementRef,
  Injector,
  Input,
  afterNextRender,
  booleanAttribute,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'
import { uniqueId } from '@/ui/popper/popper'

type FieldEl = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement

/**
 * Angular port of the React FloatLabel. `<ui-float-label>` is React's `relative flex flex-col`
 * wrapper: the floating <label> first, then the projected field. The label floats (top-0,
 * scale-75) while the field is focused or has a value; a pre-filled / bound value is
 * detected after the first render, and the label is linked to the nested
 * input / textarea / select (its id, or a generated one assigned to it).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-float-label',
  standalone: true,
  host: {
    'data-uipkge': '',
    'data-slot': 'float-label',
    '[attr.data-floating]': 'isFloating ? "true" : "false"',
    '[class]': 'hostClass',
    '(focusin)': 'handleFocusIn($event)',
    '(focusout)': 'handleFocusOut($event)',
    '(input)': 'checkValue($event.target)',
    '(change)': 'checkValue($event.target)',
  },
  template: `<label [attr.for]="controlId()" [class]="labelClass">{{ label }}</label
    ><ng-content />`,
})
export class UiFloatLabelComponent {
  private readonly host = inject(ElementRef).nativeElement as HTMLElement
  private readonly fallbackId = uniqueId('float-label')

  @Input({ required: true }) label = ''
  @Input({ transform: booleanAttribute }) required = false
  @Input({ transform: booleanAttribute }) disabled = false
  @Input('class') className?: string

  readonly controlId = signal(this.fallbackId)
  readonly isFocused = signal(false)
  readonly hasValue = signal(false)

  constructor() {
    // Prefill detection + associate the floating label with the nested control (React layout effect).
    afterNextRender(
      () => {
        const input = this.host.querySelector<FieldEl>('input, textarea, select')
        if (!input) return
        this.hasValue.set(!!input.value)
        if (input.id) {
          this.controlId.set(input.id)
        } else {
          input.id = this.fallbackId
          this.controlId.set(this.fallbackId)
        }
      },
      { injector: inject(Injector) },
    )
  }

  get isFloating(): boolean {
    return this.isFocused() || this.hasValue()
  }

  get hostClass(): string {
    return cn('relative flex flex-col', this.disabled && 'opacity-50 cursor-not-allowed', this.className)
  }

  get labelClass(): string {
    const floating = this.isFloating
    return cn(
      'text-muted-foreground pointer-events-none absolute left-3 z-10 bg-transparent px-1 text-sm transition-[color,background-color,top,translate,scale] duration-200',
      !floating && 'top-1/2 -translate-y-1/2',
      floating && 'top-0 -translate-y-1/2 scale-75 bg-background text-foreground',
      this.isFocused() && 'text-ring',
      this.required && "after:text-destructive after:ml-0.5 after:content-['*']",
    )
  }

  checkValue(target: EventTarget | null): void {
    const el = target as HTMLElement | null
    if (!el) return
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) {
      this.hasValue.set(!!el.value)
    } else {
      const input = el.querySelector?.<FieldEl>('input, textarea, select')
      if (input) this.hasValue.set(!!input.value)
    }
  }

  handleFocusIn(event: FocusEvent): void {
    this.isFocused.set(true)
    this.checkValue(event.target)
  }

  handleFocusOut(event: FocusEvent): void {
    this.isFocused.set(false)
    this.checkValue(event.target)
  }
}
