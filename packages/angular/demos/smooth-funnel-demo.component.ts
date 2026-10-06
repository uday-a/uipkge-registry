import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { UiSmoothFunnelComponent } from '../../../../../packages/registry-angular/components/charts/smooth-funnel/smooth-funnel.component'

const acquisition = [
  { name: 'Visits', value: 8420 },
  { name: 'Sign-ups', value: 2442 },
  { name: 'Purchases', value: 185 },
]
const checkout = [
  { name: 'Cart', value: 5200 },
  { name: 'Checkout', value: 3100 },
  { name: 'Payment', value: 2400 },
  { name: 'Confirmed', value: 2050 },
]
const fiveStage = [
  { name: 'Visitors', value: 24850 },
  { name: 'Sign-ups', value: 14910 },
  { name: 'Activated', value: 5964 },
  { name: 'Paid', value: 1789 },
  { name: 'Retained', value: 447 },
]
const brandPalette = ['#2e6642', '#4c9160', '#7ab98c', '#a9dcb8', '#d9a441']

/** Angular demo for the smooth-funnel page. Mirrors demos/react/smooth-funnel.tsx 1:1. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'angular-smooth-funnel-demo',
  standalone: true,
  imports: [UiSmoothFunnelComponent],
  template: `
    @switch (story) {
      @case ('Four-stage checkout') {
        <div class="mx-auto max-w-md">
          <ui-smooth-funnel [data]="checkout" />
        </div>
      }
      @case ('Five stages, custom palette') {
        <div class="mx-auto max-w-md">
          <ui-smooth-funnel [data]="fiveStage" [colors]="brandPalette" />
        </div>
      }
      @case ('No labels') {
        <div class="mx-auto max-w-md">
          <ui-smooth-funnel [data]="acquisition" [showLabels]="false" />
        </div>
      }
      @case ('Compact') {
        <div class="mx-auto max-w-md">
          <ui-smooth-funnel [data]="acquisition" height="120" [showLabels]="false" />
        </div>
      }
      @default {
        <div class="mx-auto max-w-md">
          <ui-smooth-funnel [data]="acquisition" />
        </div>
      }
    }
  `,
})
export class AngularSmoothFunnelDemoComponent {
  @Input() story = 'Basic three-stage funnel'
  protected readonly acquisition = acquisition
  protected readonly checkout = checkout
  protected readonly fiveStage = fiveStage
  protected readonly brandPalette = brandPalette
}
