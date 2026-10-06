import { Component, ElementRef, Input, booleanAttribute, inject, ChangeDetectionStrategy } from '@angular/core'
import { cn } from '@/lib/utils'
import { buttonVariants, type ButtonVariants } from './button.variants'

export type ButtonVariant = NonNullable<ButtonVariants['variant']>
export type ButtonSize = NonNullable<ButtonVariants['size']>

/**
 * Angular port of UIPKGE Button (React `Button`). Put it on the element you want to render
 * (`<button ui-button>`, `<a ui-button>`): the attribute form is the Radix `asChild`
 * equivalent, so an anchor keeps its own semantics and never receives `type`. On a native
 * `<button>` the default `type="button"` avoids accidental form submits and `disabled` sets
 * the native attribute. The `<ui-button>` element form gets button semantics via
 * role + tabindex + Enter / Space (disabled there means aria-disabled + out of the tab order;
 * prefer `<button ui-button>` when you need a truly inert control). Class strings come from
 * shared `buttonVariants`.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-button, [ui-button]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"button"',
    '[attr.data-variant]': 'variant',
    '[attr.data-size]': 'size',
    '[attr.type]': 'isButton ? type : null',
    '[attr.disabled]': 'isButton && disabled ? "" : null',
    '[attr.role]': 'isCustom ? "button" : null',
    '[attr.tabindex]': 'isCustom ? (disabled ? -1 : 0) : null',
    '[attr.aria-disabled]': 'isCustom && disabled ? "true" : null',
    '[attr.data-disabled]': 'isCustom && disabled ? "" : null',
    '[class]': 'hostClass',
    '(keydown)': 'onKeydown($event)',
  },
  template: `<ng-content />`,
})
export class UiButtonComponent {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  /** Native `<button>` host: gets `type` + native `disabled`. */
  readonly isButton = this.el.tagName === 'BUTTON'
  /** `<ui-button>` custom element: needs role / tabindex / keyboard activation. */
  readonly isCustom = this.el.tagName === 'UI-BUTTON'

  @Input() variant: ButtonVariant = 'default'
  @Input() size: ButtonSize = 'default'
  @Input() type: 'button' | 'submit' | 'reset' = 'button'
  @Input({ transform: booleanAttribute }) disabled = false
  @Input('class') className?: string

  get hostClass(): string {
    return cn(buttonVariants({ variant: this.variant, size: this.size }), this.className)
  }

  onKeydown(event: KeyboardEvent): void {
    if (!this.isCustom || this.disabled) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      this.el.click()
    }
  }
}

export { buttonVariants, type ButtonVariants }
