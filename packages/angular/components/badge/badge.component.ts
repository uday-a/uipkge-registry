import { Component, Input, booleanAttribute, ChangeDetectionStrategy } from '@angular/core'
import { cn } from '@/lib/utils'
import { badgeVariants, type BadgeVariants } from './badge.variants'

export type BadgeVariant = NonNullable<BadgeVariants['variant']>

/**
 * Angular port of UIPKGE Badge (React `Badge`, a <span>). Use the attribute form on the
 * element you want (`<span ui-badge>`, `<a ui-badge>` for the Radix `asChild` link case, which
 * picks up the `[a&]:hover` styles); `<ui-badge>` works too since the variants start with
 * `inline-flex`. Class strings identical to React via shared variants.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-badge, [ui-badge]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"badge"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiBadgeComponent {
  @Input() variant: BadgeVariant = 'default'
  @Input({ transform: booleanAttribute }) wrap = false
  @Input('class') className?: string

  get hostClass(): string {
    return cn(badgeVariants({ variant: this.variant, wrap: this.wrap ? true : undefined }), this.className)
  }
}

export { badgeVariants, type BadgeVariants }
