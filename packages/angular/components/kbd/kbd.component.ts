import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { cn } from '@/lib/utils'

/**
 * Angular port of UIPKGE Kbd. Standalone, signals-ready.
 * Pure presentational: inline keyboard-key chip with the registry classes —
 * identical to Vue.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-kbd, [ui-kbd]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"kbd"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiKbdComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn(
      'bg-muted text-muted-foreground pointer-events-none inline-flex h-5 min-w-5 items-center justify-center gap-1 rounded border px-1.5 font-mono text-xs font-medium select-none',
      this.className,
    )
  }
}
