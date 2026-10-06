import { Component, Input } from '@angular/core'
import { UiKnobComponent } from '../../../../../packages/registry-angular/components/knob/knob.component'

/** Angular demo for the knob page. Mirrors demos/react/knob.tsx story by story. */
@Component({
  selector: 'angular-knob-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiKnobComponent],
  template: `
    @switch (story) {
      @case ('Default') {
        <div class="flex items-center gap-6">
          <ui-knob [(value)]="v1" />
          <span class="text-muted-foreground text-sm">value: {{ v1 }}</span>
        </div>
      }
      @case ('Custom range and step') {
        <div class="flex items-center gap-6">
          <ui-knob [(value)]="v2" [min]="0" [max]="10" [step]="1" />
          <span class="text-muted-foreground text-sm">value: {{ v2 }}</span>
        </div>
      }
      @case ('Sized') {
        <div class="flex items-end gap-6">
          <ui-knob [(value)]="v3" [size]="60" />
          <ui-knob [(value)]="v3" [size]="100" />
          <ui-knob [(value)]="v3" [size]="160" />
        </div>
      }
      @case ('Custom colors') {
        <div class="flex items-center gap-6">
          <ui-knob [(value)]="v4" valueColor="var(--chart-1)" rangeColor="var(--muted)" />
          <ui-knob [(value)]="v4" valueColor="var(--destructive)" />
        </div>
      }
      @case ('Readonly and disabled') {
        <div class="flex items-center gap-6">
          <ui-knob [(value)]="v5" readonly />
          <ui-knob [(value)]="v5" disabled />
        </div>
      }
      @case ('Custom value template') {
        <div class="flex items-center gap-6">
          <ui-knob [(value)]="v6" [renderValue]="percent" />
        </div>
      }
    }
    <ng-template #percent let-value
      ><svg:tspan>{{ value }}%</svg:tspan></ng-template
    >
  `,
})
export class AngularKnobDemoComponent {
  @Input() story = 'Default'
  v1 = 40
  v2 = 7
  v3 = 60
  v4 = 20
  v5 = 75
  v6 = 50
}
