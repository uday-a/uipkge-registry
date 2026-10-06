import { AfterViewInit, Component, ElementRef, Input, inject, signal, ChangeDetectionStrategy } from '@angular/core'
import { cn } from '@/lib/utils'

/**
 * Angular port of UIPKGE LabeledValue (React `LabeledValue`). Read-only label/value pair for
 * surface details. Projected content replaces the value span, like React's `children ?? value`.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-labeled-value, [ui-labeled-value]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"labeled-value"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `<span data-slot="labeled-value-label" class="text-muted-foreground shrink-0">{{ label }}</span
    ><ng-content />
    @if (!hasContent()) {
      <span data-slot="labeled-value-value" class="min-w-0 text-right font-medium">{{ value }}</span>
    }`,
})
export class UiLabeledValueComponent implements AfterViewInit {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef)
  @Input() label = ''
  @Input() value?: string
  @Input('class') className?: string

  /** True when the consumer projected content (React `children`), which then replaces the value span. */
  readonly hasContent = signal(false)

  ngAfterViewInit(): void {
    const projected = [...this.host.nativeElement.childNodes].some((n) => {
      if (n instanceof HTMLElement) {
        const slot = n.getAttribute('data-slot')
        return slot !== 'labeled-value-label' && slot !== 'labeled-value-value'
      }
      return n.nodeType === Node.TEXT_NODE && !!n.textContent?.trim()
    })
    if (projected) this.hasContent.set(true)
  }

  get hostClass(): string {
    return cn('flex items-center justify-between gap-3 text-sm', this.className)
  }
}
