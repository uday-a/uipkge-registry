import { Component, Input, ChangeDetectionStrategy } from '@angular/core'

/**
 * Angular port of UIPKGE AspectRatio (React `AspectRatio` over Radix AspectRatio). Same DOM as
 * Radix: the host is the padding-bottom wrapper (`data-radix-aspect-ratio-wrapper`), and the inner
 * absolutely-positioned div carries `data-slot="aspect-ratio"` and the consumer `class`.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-aspect-ratio, [ui-aspect-ratio]',
  standalone: true,
  host: {
    // The consumer `class` is forwarded to the inner box; an attribute binding (not [class]) replaces the
    // static class="..." Angular stamps on the host, so it isn't applied twice.
    '[attr.class]': 'hostClass',
    'data-radix-aspect-ratio-wrapper': '',
    '[style.position]': '"relative"',
    '[style.width]': '"100%"',
    '[style.padding-bottom]': 'paddingBottom',
  },
  template: `<div
    data-uipkge=""
    data-slot="aspect-ratio"
    [class]="className ?? ''"
    style="position: absolute; top: 0; right: 0; bottom: 0; left: 0"
  >
    <ng-content />
  </div>`,
})
export class UiAspectRatioComponent {
  /** Width:height ratio (e.g. 16/9, 1, 4/3). Radix default: 1. */
  @Input() ratio = 1
  @Input('class') className?: string

  readonly hostClass = 'block'

  get paddingBottom(): string {
    return `${100 / (Number(this.ratio) || 1)}%`
  }
}
