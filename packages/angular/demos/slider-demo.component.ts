import { Component, Input, signal } from '@angular/core'
import {
  UiSliderComponent,
  type SliderMark,
} from '../../../../../packages/registry-angular/components/slider/slider.component'

/** Angular demo for the slider page. Mirrors demos/react/slider.tsx story by story. */
@Component({
  selector: 'angular-slider-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiSliderComponent],
  template: `
    @switch (story) {
      @case ('Default (single thumb)') {
        <div class="max-w-md space-y-3">
          <ui-slider [value]="single()" (valueChange)="single.set($event)" [max]="100" [step]="1" />
          <p class="text-muted-foreground text-xs">
            Value:<code class="text-foreground">{{ single()[0] }}</code>
          </p>
        </div>
      }
      @case ('Backward-compat array') {
        <div class="max-w-md space-y-3">
          <ui-slider [value]="singleArray()" (valueChange)="singleArray.set($event)" [max]="100" [step]="1" />
          <p class="text-muted-foreground text-xs">
            Value:<code class="text-foreground">{{ singleArray()[0] }}</code>
          </p>
        </div>
      }
      @case ('Range') {
        <div class="max-w-md space-y-3">
          <ui-slider [value]="rangeValue()" (valueChange)="rangeValue.set($event)" range [max]="100" [step]="1" />
          <p class="text-muted-foreground text-xs">
            Value:<code class="text-foreground">{{ rangeValue().join(' – ') }}</code>
          </p>
        </div>
      }
      @case ('With step') {
        <div class="max-w-md space-y-3">
          <ui-slider [value]="stepped()" (valueChange)="stepped.set($event)" [max]="100" [step]="10" />
          <p class="text-muted-foreground text-xs">
            Value:<code class="text-foreground">{{ stepped()[0] }}</code>
          </p>
        </div>
      }
      @case ('Disabled') {
        <div class="max-w-md">
          <ui-slider [value]="disabledVal()" (valueChange)="disabledVal.set($event)" [max]="100" [step]="1" disabled />
        </div>
      }
      @case ('Small size') {
        <div class="max-w-md space-y-3">
          <ui-slider [value]="smallVal()" (valueChange)="smallVal.set($event)" size="small" [max]="100" [step]="1" />
          <p class="text-muted-foreground text-xs">
            Value:<code class="text-foreground">{{ smallVal()[0] }}</code>
          </p>
        </div>
      }
      @case ('Reverse') {
        <div class="max-w-md space-y-3">
          <ui-slider [value]="reversed()" (valueChange)="reversed.set($event)" reverse [max]="100" [step]="1" />
          <p class="text-muted-foreground text-xs">
            Value:<code class="text-foreground">{{ reversed()[0] }}</code>
          </p>
        </div>
      }
      @case ('Included = false') {
        <div class="max-w-md space-y-3">
          <ui-slider
            [value]="includedOff()"
            (valueChange)="includedOff.set($event)"
            [included]="false"
            [max]="100"
            [step]="1"
          />
          <p class="text-muted-foreground text-xs">
            Value:<code class="text-foreground">{{ includedOff()[0] }}</code>
          </p>
        </div>
      }
      @case ('Dots') {
        <div class="max-w-md space-y-3">
          <ui-slider [value]="dotsValue()" (valueChange)="dotsValue.set($event)" dots [max]="100" [step]="10" />
          <p class="text-muted-foreground text-xs">
            Value:<code class="text-foreground">{{ dotsValue()[0] }}</code>
          </p>
        </div>
      }
      @case ('Marks') {
        <div class="max-w-md space-y-6">
          <ui-slider
            [value]="marksValue()"
            (valueChange)="marksValue.set($event)"
            [marks]="marks"
            [max]="100"
            [step]="1"
          />
          <p class="text-muted-foreground text-xs">
            Value:<code class="text-foreground">{{ marksValue()[0] }}</code>
          </p>
        </div>
      }
      @case ('Marks + dots + included') {
        <div class="max-w-md space-y-6">
          <ui-slider
            [value]="marksValue()"
            (valueChange)="marksValue.set($event)"
            dots
            [marks]="marks"
            [max]="100"
            [step]="10"
          />
        </div>
      }
      @case ('Tooltip formatter') {
        <div class="max-w-md space-y-3">
          <ui-slider
            [value]="tooltipCustom()"
            (valueChange)="tooltipCustom.set($event)"
            [tooltip]="formatter"
            [max]="100"
            [step]="1"
          />
          <p class="text-muted-foreground text-xs">
            Value:<code class="text-foreground">{{ tooltipCustom()[0] }}</code>
          </p>
        </div>
      }
      @case ('No tooltip') {
        <div class="max-w-md">
          <ui-slider [value]="single()" (valueChange)="single.set($event)" [tooltip]="false" [max]="100" [step]="1" />
        </div>
      }
      @case ('Vertical') {
        <div class="flex gap-8">
          <ui-slider
            [value]="verticalVal()"
            (valueChange)="verticalVal.set($event)"
            vertical
            [height]="160"
            [max]="100"
            [step]="1"
          />
          <p class="text-muted-foreground self-end text-xs">
            Value:<code class="text-foreground">{{ verticalVal()[0] }}</code>
          </p>
        </div>
      }
      @case ('Vertical with marks') {
        <div class="flex gap-8">
          <ui-slider
            [value]="verticalVal()"
            (valueChange)="verticalVal.set($event)"
            vertical
            dots
            [height]="160"
            [marks]="verticalMarks"
            [max]="100"
            [step]="10"
          />
          <p class="text-muted-foreground self-end text-xs">
            Value:<code class="text-foreground">{{ verticalVal()[0] }}</code>
          </p>
        </div>
      }
    }
  `,
})
export class AngularSliderDemoComponent {
  @Input() story = 'Default (single thumb)'

  readonly single = signal([50])
  readonly singleArray = signal([40])
  readonly rangeValue = signal([20, 80])
  readonly stepped = signal([30])
  readonly disabledVal = signal([60])
  readonly reversed = signal([30])
  readonly includedOff = signal([40])
  readonly marksValue = signal([37])
  readonly dotsValue = signal([30])
  readonly verticalVal = signal([30])
  readonly smallVal = signal([25])
  readonly tooltipCustom = signal([50])

  readonly marks: Record<number, string | SliderMark> = {
    0: '0°C',
    26: '26°C',
    37: '37°C',
    50: '50°C',
    100: { label: '100°C', style: { color: '#f50' } },
  }
  readonly verticalMarks: Record<number, string> = { 0: '0', 50: '50', 100: '100' }

  readonly formatter = (val: number) => `${val}%`
}
