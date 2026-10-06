import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { cn } from '@/lib/utils'
import { cardVariants, type CardVariants } from './card.variants'

export type CardVariant = NonNullable<CardVariants['variant']>

/**
 * Angular port of UIPKGE Card. Standalone, signals-ready.
 * Class strings come from shared `cardVariants` — identical to Vue/React.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-card, [ui-card]',
  standalone: true,
  host: {
    '[attr.data-slot]': 'dataSlot',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiCardComponent {
  @Input() variant: CardVariant = 'default'
  /** A consumer's data-slot wins, as React spreads its props after data-slot="card". */
  @Input('data-slot') dataSlot = 'card'
  @Input('class') className?: string

  get hostClass(): string {
    return cn('block', cardVariants({ variant: this.variant }), 'overflow-hidden', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-card-header, [ui-card-header]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"card-header"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiCardHeaderComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn(
      'grid auto-rows-min grid-cols-[minmax(0,1fr)] grid-rows-[auto_auto] items-start gap-1.5 p-6 has-data-[slot=card-action]:grid-cols-[minmax(0,1fr)_auto]',
      this.className,
    )
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-card-title, [ui-card-title]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"card-title"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiCardTitleComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('block leading-none font-semibold tracking-tight', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-card-description, [ui-card-description]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"card-description"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiCardDescriptionComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('block text-muted-foreground text-sm', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-card-content, [ui-card-content]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"card-content"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiCardContentComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('block p-6 pt-0', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-card-footer, [ui-card-footer]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"card-footer"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiCardFooterComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('flex items-center p-6 pt-0', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-card-action, [ui-card-action]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"card-action"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiCardActionComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('block col-start-2 row-span-2 row-start-1 self-start justify-self-end', this.className)
  }
}

export { cardVariants, type CardVariants }
