import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { cn } from '@/lib/utils'
import { spinnerVariants, type SpinnerVariants } from './spinner.variants'

export type SpinnerSize = NonNullable<SpinnerVariants['size']>

/**
 * Angular port of UIPKGE Spinner (React `Spinner`, which renders the Lucide `Loader2` svg
 * itself). The host is `display: contents`; the inline Loader2 svg carries data-slot,
 * role="status", aria-label="Loading" and the size / tone / spin classes, so the DOM a
 * parent sees (e.g. Button's `[&_svg]` rules) is the same svg React renders.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-spinner, [ui-spinner]',
  standalone: true,
  host: { class: 'contents' },
  template: `<svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    data-uipkge=""
    data-slot="spinner"
    role="status"
    [attr.aria-label]="ariaLabel"
    [attr.class]="svgClass"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>`,
})
export class UiSpinnerComponent {
  @Input() size: SpinnerSize = 'default'
  @Input('class') className?: string
  @Input('aria-label') ariaLabel = 'Loading'

  get svgClass(): string {
    return cn('lucide lucide-loader-circle', spinnerVariants({ size: this.size }), this.className)
  }
}

export { spinnerVariants, type SpinnerVariants }
