import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { UiTreeChartComponent } from '../../../../../packages/registry-angular/components/charts/tree-chart/tree-chart.component'

const fileTree = {
  name: 'src',
  children: [
    {
      name: 'components',
      children: [{ name: 'Button.vue' }, { name: 'Card.vue' }, { name: 'Input.vue' }],
    },
    {
      name: 'composables',
      children: [{ name: 'useTheme.ts' }, { name: 'useRegistry.ts' }],
    },
    {
      name: 'pages',
      children: [{ name: 'index.vue' }, { name: 'about.vue' }],
    },
    { name: 'main.ts' },
  ],
}
const orgTree = {
  name: 'CEO',
  children: [
    {
      name: 'CTO',
      children: [{ name: 'VP Eng', children: [{ name: 'EM Backend' }, { name: 'EM Frontend' }] }, { name: 'VP Data' }],
    },
    { name: 'CFO', children: [{ name: 'Controller' }, { name: 'FP&A' }] },
    { name: 'CMO', children: [{ name: 'VP Brand' }, { name: 'VP Growth' }] },
  ],
}
// Larger tree with one branch pre-collapsed via the `collapsed` flag.
const decisionTree = {
  name: 'Should we ship?',
  children: [
    {
      name: 'CI green?',
      children: [
        {
          name: 'Yes',
          children: [
            {
              name: 'Risk score < 5?',
              children: [
                { name: 'Ship' },
                {
                  name: 'Review needed',
                  collapsed: true,
                  children: [{ name: 'Tech lead approves' }, { name: 'Eng manager approves' }],
                },
              ],
            },
          ],
        },
        { name: 'No', children: [{ name: 'Block + retry' }] },
      ],
    },
  ],
}

/** Angular demo for the tree-chart page. Mirrors demos/react/tree-chart.tsx 1:1. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'angular-tree-chart-demo',
  standalone: true,
  imports: [UiTreeChartComponent],
  template: `
    @switch (story) {
      @case ('Top-down org chart') {
        <ui-tree-chart [data]="orgTree" orient="TB" height="400" />
      }
      @case ('Radial') {
        <ui-tree-chart [data]="orgTree" layout="radial" height="420" />
      }
      @case ('With roam (decision tree)') {
        <ui-tree-chart [data]="decisionTree" [roam]="true" height="420" />
      }
      @case ('Right-to-left compact') {
        <ui-tree-chart [data]="fileTree" orient="RL" height="300" />
      }
      @default {
        <ui-tree-chart [data]="fileTree" height="420" />
      }
    }
  `,
})
export class AngularTreeChartDemoComponent {
  @Input() story = 'Left-to-right (file tree)'
  protected readonly fileTree = fileTree
  protected readonly orgTree = orgTree
  protected readonly decisionTree = decisionTree
}
