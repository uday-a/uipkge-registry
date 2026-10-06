import { Component, Input, booleanAttribute, ChangeDetectionStrategy } from '@angular/core'
import { cn } from '@/lib/utils'

export type SeparatorOrientation = 'horizontal' | 'vertical'

/**
 * Angular port of UIPKGE Separator (React `Separator` on Radix Separator). Radix semantics:
 * `decorative` (default true) renders role="none" so assistive tech skips it; a semantic
 * separator gets role="separator" and `aria-orientation` only when vertical (horizontal is
 * the ARIA default). `data-orientation` always drives the sizing classes. The host puts
 * `block` first so the h-px / w-px sizing applies on the custom element.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-separator, [ui-separator]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"separator"',
    '[attr.role]': 'decorative ? "none" : "separator"',
    '[attr.aria-orientation]': '!decorative && orientation === "vertical" ? "vertical" : null',
    '[attr.data-orientation]': 'orientation',
    '[class]': 'hostClass',
  },
  template: ``,
})
export class UiSeparatorComponent {
  @Input() orientation: SeparatorOrientation = 'horizontal'
  @Input({ transform: booleanAttribute }) decorative = true
  @Input('class') className?: string

  get hostClass(): string {
    return cn(
      'block bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
      this.className,
    )
  }
}
