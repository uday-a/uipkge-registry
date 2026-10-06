import { Component, Input } from '@angular/core'
import {
  UiRangeSliderComponent,
  type RangeSliderValue,
} from '../../../../../packages/registry-angular/components/range-slider/range-slider.component'

const currency = (n: number) => `$${n}`
const percent = (n: number) => `${n}%`

/** Angular demo for the range-slider page. Mirrors demos/react/range-slider.tsx story by story. */
@Component({
  selector: 'angular-range-slider-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiRangeSliderComponent],
  template: `
    @switch (story) {
      @case ('Default') {
        <div class="max-w-md space-y-3">
          <ui-range-slider [(value)]="value" [max]="100" [step]="1" />
          <p class="text-muted-foreground text-xs">
            Value: <code class="text-foreground">{{ value.join(' – ') }}</code>
          </p>
        </div>
      }
      @case ('With ticks') {
        <div class="max-w-md space-y-3">
          <ui-range-slider [(value)]="ticked" [max]="100" [step]="1" showTicks [tickInterval]="25" />
        </div>
      }
      @case ('Custom step + tick interval') {
        <div class="max-w-md space-y-3">
          <ui-range-slider [(value)]="stepped" [min]="0" [max]="50" [step]="5" showTicks [tickInterval]="10" />
          <p class="text-muted-foreground text-xs">
            Value: <code class="text-foreground">{{ stepped.join(' – ') }}</code>
          </p>
        </div>
      }
      @case ('Always-visible thumb labels') {
        <div class="max-w-md space-y-6">
          <ui-range-slider [(value)]="labeled" [max]="100" thumbLabel />
        </div>
      }
      @case ('Custom format (currency)') {
        <div class="max-w-md space-y-6">
          <ui-range-slider
            [(value)]="priced"
            [min]="0"
            [max]="1000"
            [step]="50"
            thumbLabel
            [thumbLabelFormat]="currency"
          />
        </div>
      }
      @case ('Color variants') {
        <div class="max-w-md space-y-4">
          <ui-range-slider [(value)]="colored" [max]="100" color="primary" />
          <ui-range-slider [(value)]="colored" [max]="100" color="success" />
          <ui-range-slider [(value)]="colored" [max]="100" color="warning" />
          <ui-range-slider [(value)]="colored" [max]="100" color="error" />
          <ui-range-slider [(value)]="colored" [max]="100" color="info" />
        </div>
      }
      @case ('Sizes') {
        <div class="max-w-md space-y-4">
          <ui-range-slider [(value)]="small" [max]="100" thumbSize="sm" trackHeight="sm" />
          <ui-range-slider [(value)]="value" [max]="100" thumbSize="md" trackHeight="md" />
          <ui-range-slider [(value)]="large" [max]="100" thumbSize="lg" trackHeight="lg" />
        </div>
      }
      @case ('With label and hint') {
        <div class="max-w-md space-y-3">
          <ui-range-slider
            [(value)]="labeled"
            [max]="100"
            label="Volume"
            hint="Drag either handle to set the range."
            thumbLabel
            [thumbLabelFormat]="percent"
          />
        </div>
      }
      @case ('Error state') {
        <div class="max-w-md space-y-3">
          <ui-range-slider
            [(value)]="errored"
            [max]="100"
            label="Acceptable range"
            error
            errorMessages="Lower bound must be below upper bound."
          />
        </div>
      }
      @case ('Disabled') {
        <div class="max-w-md space-y-3">
          <ui-range-slider [(value)]="locked" [max]="100" disabled />
        </div>
      }
      @case ('Inverted') {
        <div class="max-w-md space-y-3">
          <ui-range-slider [(value)]="inverted" [max]="100" inverted />
        </div>
      }
    }
  `,
})
export class AngularRangeSliderDemoComponent {
  @Input() story = 'Default'
  readonly currency = currency
  readonly percent = percent
  value: RangeSliderValue = [20, 80]
  ticked: RangeSliderValue = [25, 75]
  stepped: RangeSliderValue = [10, 40]
  labeled: RangeSliderValue = [30, 70]
  priced: RangeSliderValue = [100, 750]
  colored: RangeSliderValue = [20, 80]
  small: RangeSliderValue = [20, 80]
  large: RangeSliderValue = [20, 80]
  errored: RangeSliderValue = [60, 40]
  locked: RangeSliderValue = [25, 75]
  inverted: RangeSliderValue = [20, 80]
}
