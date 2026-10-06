import { Component, Input } from '@angular/core'
import { UiProgressItemComponent } from '../../../../../packages/registry-angular/components/progress-item/progress-item.component'

/** Angular demo for the progress-item page. Mirrors demos/react/progress-item.tsx story by story. */
@Component({
  selector: 'angular-progress-item-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiProgressItemComponent],
  template: `
    @switch (story) {
      @case ('Default') {
        <div class="max-w-md space-y-3">
          <ui-progress-item label="Engineering" [value]="42" secondaryLabel="42%" [colorIndex]="0" />
          <ui-progress-item label="Product" [value]="22" secondaryLabel="22%" [colorIndex]="1" />
          <ui-progress-item label="Design" [value]="14" secondaryLabel="14%" [colorIndex]="2" />
          <ui-progress-item label="Sales" [value]="12" secondaryLabel="12%" [colorIndex]="3" />
          <ui-progress-item label="Marketing" [value]="10" secondaryLabel="10%" [colorIndex]="4" />
        </div>
      }
      @case ('Single item') {
        <div class="max-w-md">
          <ui-progress-item label="Profile completion" [value]="68" />
        </div>
      }
      @case ('Custom barClass') {
        <div class="max-w-md space-y-3">
          <ui-progress-item label="Healthy" [value]="76" barClass="[&_[data-slot=progress-indicator]]:bg-emerald-500" />
          <ui-progress-item label="At risk" [value]="48" barClass="[&_[data-slot=progress-indicator]]:bg-amber-500" />
          <ui-progress-item label="Critical" [value]="22" barClass="[&_[data-slot=progress-indicator]]:bg-red-500" />
        </div>
      }
      @case ('Custom secondary labels') {
        <div class="max-w-md space-y-3">
          <ui-progress-item label="Tasks completed" [value]="62" secondaryLabel="124 / 200" [colorIndex]="1" />
          <ui-progress-item label="Storage used" [value]="34" secondaryLabel="3.4 GB / 10 GB" [colorIndex]="2" />
          <ui-progress-item label="Time elapsed" [value]="80" secondaryLabel="48m left" [colorIndex]="3" />
        </div>
      }
      @case ('Compact stack') {
        <div class="grid max-w-2xl grid-cols-2 gap-x-6 gap-y-3">
          <ui-progress-item label="API uptime" [value]="99" [colorIndex]="0" />
          <ui-progress-item label="DB uptime" [value]="97" [colorIndex]="1" />
          <ui-progress-item label="Cache hit rate" [value]="84" [colorIndex]="2" />
          <ui-progress-item label="Error budget" [value]="62" [colorIndex]="3" />
          <ui-progress-item label="P95 latency" [value]="78" secondaryLabel="78ms" [colorIndex]="4" />
          <ui-progress-item label="Throughput" [value]="55" secondaryLabel="5.5k/s" [colorIndex]="5" />
        </div>
      }
    }
  `,
})
export class AngularProgressItemDemoComponent {
  @Input() story = 'Default'
}
