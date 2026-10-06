import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { cn } from '@/lib/utils'

/**
 * Angular port of UIPKGE DataList. Vertical key/value list for read-only
 * metadata rows. Class strings mirror the Vue source.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-data-list, [ui-data-list]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"data-list"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiDataListComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('flex flex-col', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-data-list-item, [ui-data-list-item]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"data-list-item"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiDataListItemComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn(
      'flex flex-row items-center justify-between border-b py-4 transition-colors duration-200 first:pt-0 last:border-0 last:pb-0',
      this.className,
    )
  }
}
