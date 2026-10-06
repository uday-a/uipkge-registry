import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { cn } from '@/lib/utils'

/**
 * Angular port of the React Label (Radix Label). Put it on a native label for the real
 * control association (`<label ui-label for="email">`); `<ui-label>` is kept for
 * wrapper-only use. React's `htmlFor` is accepted as an alias of `for`.
 *
 * Radix behaviour: a double-click on the label text does not select it (mousedown with
 * detail > 1 is prevented), except when the press lands on a nested form control.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-label, label[ui-label]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"label"',
    '[attr.for]': 'htmlFor ?? null',
    '[class]': 'hostClass',
    '(mousedown)': 'onMouseDown($event)',
  },
  template: `<ng-content />`,
})
export class UiLabelComponent {
  /** Id of the control this label describes (React `htmlFor`). */
  @Input('for') htmlFor?: string
  /** React prop name, same as `for`. */
  @Input('htmlFor') set htmlForAlias(v: string | undefined) {
    this.htmlFor = v
  }
  @Input('class') className?: string

  get hostClass(): string {
    return cn(
      'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
      this.className,
    )
  }

  onMouseDown(event: MouseEvent): void {
    const target = event.target as HTMLElement | null
    if (target?.closest?.('button, input, select, textarea')) return
    // Prevent text selection when double clicking the label.
    if (!event.defaultPrevented && event.detail > 1) event.preventDefault()
  }
}
