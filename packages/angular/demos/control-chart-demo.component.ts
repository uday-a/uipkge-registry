import { Component, Input } from '@angular/core'
import { UiControlChartComponent } from '../../../../../packages/registry-angular/components/charts/control-chart/control-chart.component'

/** Angular demo for the control-chart page. Mirrors demos/react/control-chart.tsx story by story. */
@Component({
  selector: 'angular-control-chart-demo',
  standalone: true,
  imports: [UiControlChartComponent],
  template: `
    @switch (story) {
      @case ('Build times') {
        <ui-control-chart [data]="builds" xField="b" yField="mins" height="300" />
      }
      @case ('Fixed spec limits') {
        <ui-control-chart [data]="builds" xField="b" yField="mins" [ucl]="12" [lcl]="6" height="300" />
      }
      @case ('Clearance hours') {
        <ui-control-chart [data]="clearance" xField="awb" yField="hrs" height="300" />
      }
      @default {
        <ui-control-chart [data]="builds" xField="b" yField="mins" height="300" />
      }
    }
  `,
})
export class AngularControlChartDemoComponent {
  @Input() story = 'Build times'

  builds = [
    { b: '#101', mins: 8.2 },
    { b: '#102', mins: 7.8 },
    { b: '#103', mins: 8.5 },
    { b: '#104', mins: 8.1 },
    { b: '#105', mins: 14.6 },
    { b: '#106', mins: 8.3 },
    { b: '#107', mins: 7.9 },
    { b: '#108', mins: 8.4 },
  ]

  clearance = [
    { awb: 'B1', hrs: 11.2 },
    { awb: 'B2', hrs: 13.1 },
    { awb: 'B3', hrs: 12.4 },
    { awb: 'B4', hrs: 14.0 },
    { awb: 'B5', hrs: 26.5 },
    { awb: 'B6', hrs: 12.8 },
    { awb: 'B7', hrs: 13.6 },
    { awb: 'B8', hrs: 11.9 },
  ]
}
