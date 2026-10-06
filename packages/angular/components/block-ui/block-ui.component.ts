import { Component, Input, TemplateRef, booleanAttribute, ChangeDetectionStrategy } from '@angular/core'
import { cn } from '@/lib/utils'
import { UiRenderTemplateDirective } from '@/ui/popper/popper'
import { UiSpinnerComponent } from '@/ui/spinner/spinner.component'
import { blockUiVariants } from './block-ui.variants'

/**
 * Angular port of UIPKGE BlockUi (React `BlockUi`). Wraps content; while `blocking` the
 * content is inert + aria-hidden (optionally blurred) and an overlay shows a Spinner (or the
 * `icon` template) and the `message` (or the `messageSlot` template). `opacity` /
 * `overlayColor` only affect the backdrop layer, so the spinner and message stay opaque.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-block-ui, [ui-block-ui]',
  standalone: true,
  imports: [UiRenderTemplateDirective, UiSpinnerComponent],
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"block-ui"',
    '[attr.data-blocked]': 'blocking ? "" : null',
    '[class]': 'hostClass',
  },
  template: `
    <div [class]="contentClass" [attr.aria-hidden]="blocking ? 'true' : null" [attr.inert]="blocking ? '' : null">
      <ng-content />
    </div>
    @if (blocking) {
      <div
        class="absolute inset-0 z-50 flex flex-col items-center justify-center gap-3"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div [class]="backdropClass" [style.opacity]="opacity" [style.background-color]="overlayColor || null"></div>
        @if (icon) {
          <ng-container [uiRenderTemplate]="icon" />
        } @else if (showSpinner) {
          <ui-spinner size="lg" />
        }
        @if (messageSlot) {
          <div class="text-foreground text-sm font-medium"><ng-container [uiRenderTemplate]="messageSlot" /></div>
        } @else if (message) {
          <p class="text-foreground text-sm font-medium">{{ message }}</p>
        }
      </div>
    }
  `,
})
export class UiBlockUiComponent {
  /** When true, the overlay is shown and the wrapped content is blocked. */
  @Input({ transform: booleanAttribute }) blocking = false
  @Input() message = 'Loading...'
  @Input() opacity = 0.6
  @Input() overlayColor = ''
  @Input({ transform: booleanAttribute }) blur = false
  @Input({ transform: booleanAttribute }) showSpinner = true
  /** Custom icon template replacing the default Spinner (React `icon`). */
  @Input() icon?: TemplateRef<unknown> | null
  /** Custom message template replacing the `message` string (React `messageSlot`). */
  @Input() messageSlot?: TemplateRef<unknown> | null
  @Input('class') className?: string

  get hostClass(): string {
    return cn(blockUiVariants(), this.className)
  }

  get contentClass(): string {
    return cn(
      'block-ui-content',
      this.blocking && 'pointer-events-none',
      this.blur && this.blocking && 'blur-[2px] transition-[filter]',
    )
  }

  get backdropClass(): string {
    return cn('absolute inset-0', !this.overlayColor && 'bg-background')
  }
}

export { blockUiVariants }
