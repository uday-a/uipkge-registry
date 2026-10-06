import { Component, Input, booleanAttribute, ChangeDetectionStrategy } from '@angular/core'
import { cn } from '@/lib/utils'

export type ButtonGroupOrientation = 'horizontal' | 'vertical'

/**
 * Angular port of UIPKGE ButtonGroup. Segmented toolbars and split buttons
 * with shared borders. Class strings identical to React ButtonGroup.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-button-group, [ui-button-group]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"button-group"',
    '[attr.data-uipkge]': '""',
    '[attr.role]': '"group"',
    '[attr.data-orientation]': 'orientation',
    '[attr.data-attached]': 'attachedAttr',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiButtonGroupComponent {
  @Input() orientation: ButtonGroupOrientation = 'horizontal'
  @Input({ transform: booleanAttribute }) attached = true
  @Input('class') className?: string

  get attachedAttr(): string | undefined {
    return this.attached ? '' : undefined
  }

  get hostClass(): string {
    const orientation = this.orientation
    const attached = this.attached
    return cn(
      'inline-flex items-center',
      orientation === 'vertical' ? 'flex-col items-stretch' : 'flex-row',
      // The `.contents>button` rules reach a trigger button inside a layout-transparent wrapper
      // root (<ui-dropdown-menu>, <ui-popover>, ...), which React's Radix roots don't render.
      // Its data-slot is the trigger's, as in React, so only the plain `button` rules apply.
      attached && [
        '[&>[data-slot=button]]:relative [&>[data-slot=button]:focus-visible]:z-20 [&>[data-slot=button]:hover]:z-10',
        '[&>button]:relative [&>button:focus-visible]:z-20 [&>button:hover]:z-10',
        '[&>.contents>button]:relative [&>.contents>button:focus-visible]:z-20 [&>.contents>button:hover]:z-10',
        orientation === 'horizontal' && [
          '[&>[data-slot=button]]:rounded-none [&>button]:rounded-none',
          '[&>.contents>button]:rounded-none',
          '[&>[data-slot=button]:first-child]:rounded-l-md [&>button:first-child]:rounded-l-md',
          '[&>.contents:first-child>button]:rounded-l-md',
          '[&>[data-slot=button]:last-child]:rounded-r-md [&>button:last-child]:rounded-r-md',
          '[&>.contents:last-child>button]:rounded-r-md',
          '[&>[data-slot=button]:only-child]:rounded-md [&>button:only-child]:rounded-md',
          '[&>.contents:only-child>button]:rounded-md',
          '[&>[data-slot=button]:not(:first-child)]:-ml-px [&>button:not(:first-child)]:-ml-px',
          '[&>.contents:not(:first-child)>button]:-ml-px',
          '[&>[data-slot=button][data-variant=default]:not(:first-child)]:border-primary-foreground/20 [&>[data-slot=button][data-variant=default]:not(:first-child)]:border-l',
          '[&>[data-slot=button]:not([data-variant]):not(:first-child)]:border-primary-foreground/20 [&>[data-slot=button]:not([data-variant]):not(:first-child)]:border-l',
          '[&>[data-slot=button][data-variant=secondary]:not(:first-child)]:border-border [&>[data-slot=button][data-variant=secondary]:not(:first-child)]:border-l',
          '[&>[data-slot=button][data-variant=destructive]:not(:first-child)]:border-l [&>[data-slot=button][data-variant=destructive]:not(:first-child)]:border-white/20',
        ],
        orientation === 'vertical' && [
          '[&>[data-slot=button]]:rounded-none [&>button]:rounded-none',
          '[&>.contents>button]:rounded-none',
          '[&>[data-slot=button]:first-child]:rounded-t-md [&>button:first-child]:rounded-t-md',
          '[&>.contents:first-child>button]:rounded-t-md',
          '[&>[data-slot=button]:last-child]:rounded-b-md [&>button:last-child]:rounded-b-md',
          '[&>.contents:last-child>button]:rounded-b-md',
          '[&>[data-slot=button]:only-child]:rounded-md [&>button:only-child]:rounded-md',
          '[&>.contents:only-child>button]:rounded-md',
          '[&>[data-slot=button]:not(:first-child)]:-mt-px [&>button:not(:first-child)]:-mt-px',
          '[&>.contents:not(:first-child)>button]:-mt-px',
          '[&>[data-slot=button][data-variant=default]:not(:first-child)]:border-primary-foreground/20 [&>[data-slot=button][data-variant=default]:not(:first-child)]:border-t',
          '[&>[data-slot=button]:not([data-variant]):not(:first-child)]:border-primary-foreground/20 [&>[data-slot=button]:not([data-variant]):not(:first-child)]:border-t',
          '[&>[data-slot=button][data-variant=secondary]:not(:first-child)]:border-border [&>[data-slot=button][data-variant=secondary]:not(:first-child)]:border-t',
          '[&>[data-slot=button][data-variant=destructive]:not(:first-child)]:border-t [&>[data-slot=button][data-variant=destructive]:not(:first-child)]:border-white/20',
        ],
      ],
      !attached && (orientation === 'vertical' ? 'gap-1' : 'gap-1.5'),
      this.className,
    )
  }
}
