import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { UiRadarChartComponent } from '../../../../../packages/registry-angular/components/charts/radar-chart/radar-chart.component'

const carIndicators = [
  { name: 'Speed', max: 100 },
  { name: 'Reliability', max: 100 },
  { name: 'Comfort', max: 100 },
  { name: 'Safety', max: 100 },
  { name: 'Efficiency', max: 100 },
]

const carData = [
  { name: 'Model A', value: [85, 90, 70, 95, 80] },
  { name: 'Model B', value: [70, 85, 90, 80, 75] },
]

const skillIndicators = [
  { name: 'TypeScript', max: 10 },
  { name: 'Vue', max: 10 },
  { name: 'CSS', max: 10 },
  { name: 'Testing', max: 10 },
  { name: 'Tooling', max: 10 },
  { name: 'Design', max: 10 },
]

const skillData = [{ name: 'You', value: [9, 8, 7, 6, 9, 5] }]

// Heavier fill — emphasise the shape over the outline.
// (Per-index series merge keeps the computed radar type, so only data is overridden here.)
const filledOption = {
  series: [
    {
      data: [
        {
          name: 'Model A',
          value: [85, 90, 70, 95, 80],
          areaStyle: { opacity: 0.45 },
          lineStyle: { width: 1 },
        },
        {
          name: 'Model B',
          value: [70, 85, 90, 80, 75],
          areaStyle: { opacity: 0.45 },
          lineStyle: { width: 1 },
        },
      ],
    },
  ],
}

// Polygon grid instead of circular — gives the radar a more "tactical" look.
const polygonOption = {
  radar: {
    shape: 'polygon',
    radius: '62%',
    splitNumber: 4,
    splitArea: { areaStyle: { color: ['rgba(245,245,245,0.4)', 'rgba(220,220,220,0.05)'] } },
  },
}

/** Angular demo for the radar-chart page. Mirrors demos/react/radar-chart.tsx 1:1. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'angular-radar-chart-demo',
  standalone: true,
  imports: [UiRadarChartComponent],
  template: `
    @switch (story) {
      @case ('Single series') {
        <ui-radar-chart [indicators]="skillIndicators" [data]="skillData" [height]="340" />
      }
      @case ('Heavy fill') {
        <ui-radar-chart [indicators]="carIndicators" [data]="carData" [option]="filledOption" [height]="340" />
      }
      @case ('Polygon grid') {
        <ui-radar-chart [indicators]="carIndicators" [data]="carData" [option]="polygonOption" [height]="340" />
      }
      @case ('Compact scorecard') {
        <div class="mx-auto max-w-[360px]">
          <ui-radar-chart [indicators]="skillIndicators" [data]="skillData" [height]="220" />
        </div>
      }
      @default {
        <ui-radar-chart [indicators]="carIndicators" [data]="carData" [height]="340" />
      }
    }
  `,
})
export class AngularRadarChartDemoComponent {
  protected readonly carIndicators = carIndicators
  protected readonly carData = carData
  protected readonly skillIndicators = skillIndicators
  protected readonly skillData = skillData
  protected readonly filledOption = filledOption
  protected readonly polygonOption = polygonOption
  @Input() story = 'Basic radar'
}
