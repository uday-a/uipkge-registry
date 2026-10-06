import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { UiGanttChartComponent } from '../../../../../packages/registry-angular/components/charts/gantt-chart/gantt-chart.component'

/** Angular demo for the gantt-chart primitive page. Mirrors demos/react/gantt-chart.tsx. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'angular-gantt-chart-demo',
  standalone: true,
  imports: [UiGanttChartComponent],
  template: `
    @switch (story) {
      @case ('Milestones') {
        <ui-gantt-chart [tasks]="launch" [height]="320" />
      }
      @case ('Today line') {
        <ui-gantt-chart [tasks]="launch" [height]="300" />
      }
      @case ('Peak charter program') {
        <ui-gantt-chart [tasks]="peak" [height]="280" />
      }
      @default {
        <ui-gantt-chart [tasks]="launch" [height]="300" />
      }
    }
  `,
})
export class AngularGanttChartDemoComponent {
  @Input() story = 'Launch plan'

  readonly launch = [
    { label: 'Design', start: '2026-09-01', end: '2026-09-18', progress: 1, group: 'Product' },
    { label: 'API build', start: '2026-09-10', end: '2026-10-09', progress: 0.65, group: 'Eng' },
    { label: 'Mobile app', start: '2026-09-22', end: '2026-10-23', progress: 0.3, group: 'Eng' },
    { label: 'QA & launch', start: '2026-10-12', end: '2026-10-30', progress: 0.1, group: 'Product' },
  ]

  readonly peak = [
    { label: 'PVG–LAX extra rotation', start: '2026-09-08', end: '2026-12-20', progress: 0.4, group: 'Transpacific' },
    { label: 'ICN–ORD upgrade', start: '2026-10-01', end: '2026-12-15', progress: 0.15, group: 'Transpacific' },
    { label: 'DXB–SIN charter', start: '2026-09-15', end: '2026-11-30', progress: 0.55, group: 'Intra-Asia' },
  ]
}
