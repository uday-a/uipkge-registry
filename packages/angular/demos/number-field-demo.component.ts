import { Component, Input, signal } from '@angular/core'
import { UiNumberFieldComponent } from '../../../../../packages/registry-angular/components/number-field/number-field.component'
import { UiLabelComponent } from '../../../../../packages/registry-angular/components/label/label.component'

/** Angular demo for the number-field page. Mirrors demos/react/number-field.tsx story by story. */
@Component({
  selector: 'angular-number-field-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiNumberFieldComponent, UiLabelComponent],
  template: `
    @switch (story) {
      @case ('Default') {
        <div class="max-w-xs space-y-2">
          <label ui-label for="qty">Quantity</label>
          <ui-number-field id="qty" [(value)]="basic" [min]="0" [max]="20" />
        </div>
      }
      @case ('Sizes') {
        <div class="flex items-center gap-4">
          <ui-number-field [(value)]="sized" size="small" [min]="0" />
          <ui-number-field [(value)]="sized" size="middle" [min]="0" />
          <ui-number-field [(value)]="sized" size="large" [min]="0" />
        </div>
      }
      @case ('Status') {
        <div class="flex items-center gap-4">
          <ui-number-field [(value)]="statused" status="error" [min]="0" />
          <ui-number-field [(value)]="statused" status="warning" [min]="0" />
        </div>
      }
      @case ('Formatter / Parser') {
        <div class="max-w-xs space-y-2">
          <label ui-label>Price</label>
          <ui-number-field [(value)]="formatted" prefix="$" [formatter]="formatter" [parser]="parser" />
        </div>
      }
      @case ('Precision') {
        <div class="max-w-xs space-y-2">
          <label ui-label>Pi (3 decimals)</label>
          <ui-number-field [(value)]="precisioned" [precision]="3" [step]="0.001" />
        </div>
      }
      @case ('Controls position right') {
        <div class="max-w-xs space-y-2">
          <label ui-label>Amount</label>
          <ui-number-field [(value)]="rightControls" controlsPosition="right" [min]="0" />
        </div>
      }
      @case ('Keyboard disabled') {
        <div class="max-w-xs space-y-2">
          <label ui-label>Manual only</label>
          <ui-number-field [(value)]="keyboardOff" [keyboard]="false" [min]="0" />
        </div>
      }
      @case ('Prefix & Suffix') {
        <div class="flex items-center gap-4">
          <ui-number-field [(value)]="prefixed" prefix="$" />
          <ui-number-field [(value)]="prefixed" suffix="%" />
        </div>
      }
      @case ('Min / Max bounds') {
        <div class="max-w-xs space-y-2">
          <label ui-label>Bounded (0 – 10)</label>
          <ui-number-field [(value)]="bounded" [min]="0" [max]="10" />
        </div>
      }
      @case ('Disabled & Read-only') {
        <div class="flex items-center gap-4">
          <ui-number-field [defaultValue]="42" disabled />
          <ui-number-field [defaultValue]="42" readOnly />
        </div>
      }
    }
  `,
})
export class AngularNumberFieldDemoComponent {
  @Input() story = 'Default'
  readonly basic = signal<number | undefined>(5)
  readonly sized = signal<number | undefined>(10)
  readonly statused = signal<number | undefined>(20)
  readonly formatted = signal<number | undefined>(1000)
  readonly precisioned = signal<number | undefined>(3.14159)
  readonly rightControls = signal<number | undefined>(50)
  readonly keyboardOff = signal<number | undefined>(25)
  readonly prefixed = signal<number | undefined>(100)
  readonly bounded = signal<number | undefined>(5)
  readonly formatter = (v: number | undefined) => v?.toLocaleString() ?? ''
  readonly parser = (v: string) => Number(v.replace(/[^0-9.-]/g, ''))
}
