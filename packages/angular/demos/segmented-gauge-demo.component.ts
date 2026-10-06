import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { UiSegmentedGaugeComponent } from '../../../../../packages/registry-angular/components/charts/segmented-gauge/segmented-gauge.component'

const browsers = [
  { value: 76.1, label: 'Chrome' },
  { value: 13.4, label: 'Safari' },
  { value: 6.2, label: 'Firefox' },
  { value: 3.4, label: 'Edge' },
]

const regions = [
  { value: 42, color: 'var(--chart-1)', label: 'AMER' },
  { value: 31, color: 'var(--chart-2)', label: 'EMEA' },
  { value: 18, color: 'var(--chart-3)', label: 'APAC' },
  { value: 9, color: 'var(--chart-5)', label: 'LATAM' },
]

const sentiment = [
  { value: 64, color: '#34d399', label: 'Positive' },
  { value: 24, color: '#94a3b8', label: 'Neutral' },
  { value: 12, color: '#fb7185', label: 'Negative' },
]

const splitFifty = [
  { value: 1, color: 'var(--chart-1)' },
  { value: 1, color: 'var(--chart-2)' },
]

/**
 * Angular demo for the segmented-gauge page. Mirrors demos/react/segmented-gauge.tsx story by
 * story — projected content lands in the dish centre like React's `children` / Vue's `center` slot.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'angular-segmented-gauge-demo',
  standalone: true,
  imports: [UiSegmentedGaugeComponent],
  template: `
    @switch (story) {
      @case ('Regional split') {
        <div class="mx-auto max-w-sm">
          <ui-segmented-gauge [segments]="regions">
            <p class="text-3xl font-bold tracking-tight tabular-nums">12.4k</p>
            <p class="text-muted-foreground text-xs">Sessions</p>
          </ui-segmented-gauge>
        </div>
      }
      @case ('Sentiment tri-band') {
        <div class="mx-auto max-w-sm">
          <ui-segmented-gauge [segments]="sentiment">
            <p class="text-3xl font-bold tracking-tight tabular-nums">72%</p>
            <p class="text-muted-foreground text-xs">Positive</p>
          </ui-segmented-gauge>
        </div>
      }
      @case ('Wider stroke, no track') {
        <div class="mx-auto max-w-sm">
          <ui-segmented-gauge [segments]="splitFifty" [stroke]="28" [showTrack]="false" [gap]="6" />
        </div>
      }
      @case ('Compact') {
        <div class="mx-auto w-40">
          <ui-segmented-gauge [segments]="browsers" height="90" [stroke]="10" />
        </div>
      }
      @default {
        <div class="mx-auto max-w-sm">
          <ui-segmented-gauge [segments]="browsers">
            <p class="text-3xl font-bold tracking-tight tabular-nums">1,735</p>
            <p class="text-muted-foreground text-xs">Clicks</p>
          </ui-segmented-gauge>
        </div>
      }
    }
  `,
})
export class AngularSegmentedGaugeDemoComponent {
  @Input() story = 'Browser share'
  protected readonly browsers = browsers
  protected readonly regions = regions
  protected readonly sentiment = sentiment
  protected readonly splitFifty = splitFifty
}
