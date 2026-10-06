import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { UiPieChartComponent } from '../../../../../packages/registry-angular/components/charts/pie-chart/pie-chart.component'

const devices = [
  { name: 'Desktop', value: 45 },
  { name: 'Mobile', value: 35 },
  { name: 'Tablet', value: 15 },
  { name: 'Other', value: 5 },
]

// Air cargo: weekly freighter capacity share by carrier.
const capacityShare = [
  { name: 'SQ', value: 22 },
  { name: 'CX', value: 19 },
  { name: 'LH', value: 15 },
  { name: 'EK', value: 13 },
  { name: 'QR', value: 11 },
  { name: 'KE', value: 10 },
  { name: 'Other', value: 10 },
]

const traffic = [
  { name: 'Organic', value: 4200 },
  { name: 'Paid', value: 2800 },
  { name: 'Referral', value: 1900 },
  { name: 'Direct', value: 1400 },
  { name: 'Email', value: 900 },
]

// Center-label donut: bigger inner ring + percentage in the hole.
const centerLabelOption = {
  series: [
    {
      radius: ['55%', '75%'],
      label: {
        show: true,
        position: 'center',
        formatter: '45%\nDesktop',
        fontSize: 16,
        fontWeight: 700,
      },
    },
  ],
}

// Rose (Nightingale) — radius scales with value.
const roseOption = {
  series: [{ roseType: 'radius', radius: ['20%', '70%'] }],
}

// Outside labels with leader lines.
const labeledOption = {
  series: [
    {
      label: { show: true, formatter: '{b}\n{d}%', fontSize: 11 },
      labelLine: { show: true, length: 8, length2: 12 },
    },
  ],
}

/** Angular demo for the pie-chart page. Mirrors demos/react/pie-chart.tsx 1:1. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'angular-pie-chart-demo',
  standalone: true,
  imports: [UiPieChartComponent],
  template: `
    @switch (story) {
      @case ('Donut') {
        <ui-pie-chart [data]="devices" donut [height]="320" />
      }
      @case ('Donut with center label') {
        <ui-pie-chart [data]="devices" donut [option]="centerLabelOption" [height]="320" />
      }
      @case ('Rose (Nightingale)') {
        <ui-pie-chart [data]="traffic" [option]="roseOption" [height]="340" />
      }
      @case ('Outside labels') {
        <ui-pie-chart [data]="traffic" [option]="labeledOption" [height]="340" />
      }
      @case ('Carrier capacity') {
        <ui-pie-chart [data]="capacityShare" nameField="name" valueField="value" donut [height]="320" />
      }
      @default {
        <ui-pie-chart [data]="devices" [height]="320" />
      }
    }
  `,
})
export class AngularPieChartDemoComponent {
  protected readonly devices = devices
  protected readonly capacityShare = capacityShare
  protected readonly traffic = traffic
  protected readonly centerLabelOption = centerLabelOption
  protected readonly roseOption = roseOption
  protected readonly labeledOption = labeledOption
  @Input() story = 'Basic pie'
}
