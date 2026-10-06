import { Component, Input } from '@angular/core'
import {
  UiCardComponent,
  UiCardContentComponent,
} from '../../../../../packages/registry-angular/components/card/card.component'
import { UiGridComponent } from '../../../../../packages/registry-angular/components/grid/grid.component'

/** Angular demo for the grid page. Mirrors demos/react/grid.tsx story by story. */
@Component({
  selector: 'angular-grid-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiCardComponent, UiCardContentComponent, UiGridComponent],
  template: `
    @switch (story) {
      @case ('3 columns') {
        <div ui-grid [cols]="3" [gap]="3">
          @for (i of range(6); track i) {
            <div ui-card>
              <div ui-card-content class="p-4 text-center text-sm">{{ i + 1 }}</div>
            </div>
          }
        </div>
      }
      @case ('4 columns') {
        <div ui-grid [cols]="4" [gap]="6">
          @for (i of range(8); track i) {
            <div ui-card>
              <div ui-card-content class="p-3 text-center text-sm">{{ i + 1 }}</div>
            </div>
          }
        </div>
      }
      @case ('Responsive') {
        <div ui-grid [cols]="{ base: 1, sm: 2, lg: 4 }" [gap]="4">
          @for (i of range(8); track i) {
            <div ui-card>
              <div ui-card-content class="p-3 text-center text-sm">{{ i + 1 }}</div>
            </div>
          }
        </div>
      }
    }
  `,
})
export class AngularGridDemoComponent {
  @Input() story = '3 columns'
  range = (n: number) => Array.from({ length: n }, (_, i) => i)
}
