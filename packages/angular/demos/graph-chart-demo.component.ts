import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { UiGraphChartComponent } from '../../../../../packages/registry-angular/components/charts/graph-chart/graph-chart.component'

/** Angular demo for the graph-chart primitive page. Mirrors demos/react/graph-chart.tsx. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'angular-graph-chart-demo',
  standalone: true,
  imports: [UiGraphChartComponent],
  template: `
    @switch (story) {
      @case ('Ring (circular layout)') {
        <ui-graph-chart [nodes]="ring" [links]="ringLinks" layout="circular" [directed]="false" [height]="380" />
      }
      @case ('With roam (pan + zoom)') {
        <ui-graph-chart
          [nodes]="services"
          [links]="serviceLinks"
          [categories]="serviceCategories"
          [roam]="true"
          [height]="420"
        />
      }
      @case ('Knowledge graph (undirected, weighted)') {
        <ui-graph-chart
          [nodes]="concepts"
          [links]="conceptLinks"
          [categories]="conceptCategories"
          [directed]="false"
          [roam]="true"
          [height]="420"
        />
      }
      @case ('Compact') {
        <ui-graph-chart [nodes]="services" [links]="serviceLinks" [categories]="serviceCategories" [height]="240" />
      }
      @default {
        <ui-graph-chart [nodes]="services" [links]="serviceLinks" [categories]="serviceCategories" [height]="420" />
      }
    }
  `,
})
export class AngularGraphChartDemoComponent {
  @Input() story = 'Service dependency map'

  readonly services = [
    { id: 'API', name: 'API', category: 0 },
    { id: 'Worker', name: 'Worker', category: 1 },
    { id: 'DB', name: 'DB', category: 2 },
    { id: 'Cache', name: 'Cache', category: 3 },
    { id: 'Queue', name: 'Queue', category: 4 },
    { id: 'CDN', name: 'CDN', category: 0 },
  ]

  readonly serviceLinks = [
    { source: 'API', target: 'DB' },
    { source: 'API', target: 'Cache' },
    { source: 'API', target: 'Queue' },
    { source: 'Queue', target: 'Worker' },
    { source: 'Worker', target: 'DB' },
    { source: 'CDN', target: 'API' },
  ]

  readonly serviceCategories = ['Edge', 'Compute', 'Storage', 'Cache', 'Messaging']

  readonly ring = [
    { id: 'A', name: 'A', category: 0 },
    { id: 'B', name: 'B', category: 0 },
    { id: 'C', name: 'C', category: 1 },
    { id: 'D', name: 'D', category: 1 },
    { id: 'E', name: 'E', category: 2 },
    { id: 'F', name: 'F', category: 2 },
  ]

  readonly ringLinks = [
    { source: 'A', target: 'B' },
    { source: 'B', target: 'C' },
    { source: 'C', target: 'D' },
    { source: 'D', target: 'E' },
    { source: 'E', target: 'F' },
    { source: 'F', target: 'A' },
    { source: 'A', target: 'D' },
    { source: 'C', target: 'F' },
  ]

  readonly concepts = [
    { id: 'Vue', name: 'Vue', category: 0 },
    { id: 'Reactivity', name: 'Reactivity', category: 0 },
    { id: 'Composition API', name: 'Composition API', category: 0 },
    { id: 'Pinia', name: 'Pinia', category: 1 },
    { id: 'Nuxt', name: 'Nuxt', category: 1 },
    { id: 'Vite', name: 'Vite', category: 2 },
    { id: 'Tailwind', name: 'Tailwind', category: 3 },
    { id: 'OKLCH tokens', name: 'OKLCH tokens', category: 3 },
  ]

  readonly conceptLinks = [
    { source: 'Vue', target: 'Reactivity', value: 5 },
    { source: 'Vue', target: 'Composition API', value: 5 },
    { source: 'Vue', target: 'Pinia', value: 3 },
    { source: 'Vue', target: 'Nuxt', value: 5 },
    { source: 'Nuxt', target: 'Vite', value: 4 },
    { source: 'Nuxt', target: 'Tailwind', value: 3 },
    { source: 'Tailwind', target: 'OKLCH tokens', value: 4 },
  ]

  readonly conceptCategories = ['Core', 'State', 'Tooling', 'Styling']
}
