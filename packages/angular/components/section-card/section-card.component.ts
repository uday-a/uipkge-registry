import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { cn } from '@/lib/utils'
import { cardVariants } from '@/ui/card/card.variants'
import {
  UiCardContentComponent,
  UiCardDescriptionComponent,
  UiCardHeaderComponent,
  UiCardTitleComponent,
} from '@/ui/card/card.component'

/**
 * Angular port of UIPKGE SectionCard (React `SectionCard`): a Card with a title/description
 * header, a content well and an optional footer. The host is the Card itself (same classes and
 * data-slot as React's `<Card>`). React's `headerAction` / `footer` props are the
 * `[slot=header-action]` / `[slot=footer]` projections, rendered verbatim with no wrapper.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-section-card, [ui-section-card]',
  standalone: true,
  imports: [UiCardHeaderComponent, UiCardTitleComponent, UiCardDescriptionComponent, UiCardContentComponent],
  host: {
    '[attr.data-slot]': 'dataSlot',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `<div ui-card-header class="pb-4">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div class="min-w-0">
          <h3 ui-card-title class="text-base font-semibold">{{ title }}</h3>
          @if (description) {
            <p ui-card-description class="mt-0.5">{{ description }}</p>
          }
        </div>
        <ng-content select="[slot=header-action]" />
      </div>
    </div>
    <div ui-card-content [class]="contentClass"><ng-content /></div>
    <ng-content select="[slot=footer]" />`,
})
export class UiSectionCardComponent {
  @Input() title = ''
  /** A consumer's data-slot wins, as React spreads its props after data-slot="card". */
  @Input('data-slot') dataSlot = 'card'
  @Input() description?: string
  @Input() contentClassName?: string
  @Input('class') className?: string

  get hostClass(): string {
    return cn(cardVariants({ variant: 'default' }), 'overflow-hidden', 'flex flex-col', this.className)
  }

  get contentClass(): string {
    return cn('flex-1', this.contentClassName)
  }
}
