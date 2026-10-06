import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { cn } from '@/lib/utils'

/**
 * Angular port of UIPKGE Page (React `Page`, `PageBody`, `PageHeader`, `PageHeaderHeading`).
 * Page-level layout shell. React's `PageHeader actions` prop is the `[slot=actions]` projection:
 * `<div slot="actions">…</div>` renders right after the heading column, with no wrapper.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-page, [ui-page]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"page"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiPageComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('block space-y-6', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-page-body, [ui-page-body]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"page-body"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiPageBodyComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('block', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-page-header, [ui-page-header]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"page-header"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `
    <div class="flex-1"><ng-content /></div>
    <ng-content select="[slot=actions]" />
  `,
})
export class UiPageHeaderComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('flex flex-col justify-between gap-4 sm:flex-row sm:items-center', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-page-header-heading, [ui-page-header-heading]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"page-header-heading"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: ` <h2 class="text-xl font-bold tracking-tight">{{ title }}</h2>
    @if (description) {
      <p class="text-muted-foreground mt-1 text-sm leading-relaxed">
        {{ description }}
      </p>
    }`,
})
export class UiPageHeaderHeadingComponent {
  @Input({ required: true }) title!: string
  @Input() description?: string
  @Input('class') className?: string

  get hostClass(): string {
    return cn('block', this.className)
  }
}
