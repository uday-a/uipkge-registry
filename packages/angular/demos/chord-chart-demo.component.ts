import { Component, Input } from '@angular/core'
import { UiChordChartComponent } from '../../../../../packages/registry-angular/components/charts/chord-chart/chord-chart.component'

/** Angular demo for the chord-chart page. Mirrors demos/react/chord-chart.tsx 1:1. */
@Component({
  selector: 'angular-chord-chart-demo',
  standalone: true,
  imports: [UiChordChartComponent],
  template: `
    @switch (story) {
      @default {
        <ui-chord-chart [nodes]="nodes" [links]="links" height="380" />
      }
    }
  `,
})
export class AngularChordChartDemoComponent {
  @Input() story = 'Default'

  nodes = [{ name: 'API' }, { name: 'Worker' }, { name: 'DB' }, { name: 'Cache' }, { name: 'Queue' }]

  links = [
    { source: 'API', target: 'DB', value: 42 },
    { source: 'API', target: 'Cache', value: 30 },
    { source: 'API', target: 'Queue', value: 24 },
    { source: 'Queue', target: 'Worker', value: 24 },
    { source: 'Worker', target: 'DB', value: 18 },
    { source: 'Worker', target: 'Cache', value: 8 },
  ]
}
