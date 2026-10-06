import { Component, Input, signal } from '@angular/core'
import { UiTreeSelectComponent } from '../../../../../packages/registry-angular/components/tree-select/tree-select.component'
import type { TreeSelectNode } from '../../../../../packages/registry-angular/components/tree-select/types'
import {
  UiCardComponent,
  UiCardContentComponent,
  UiCardDescriptionComponent,
  UiCardHeaderComponent,
  UiCardTitleComponent,
} from '../../../../../packages/registry-angular/components/card/card.component'

const fileTree: TreeSelectNode[] = [
  {
    value: 'src',
    label: 'src',
    children: [
      {
        value: 'src/components',
        label: 'components',
        children: [
          { value: 'src/components/Button.tsx', label: 'Button.tsx' },
          { value: 'src/components/Card.tsx', label: 'Card.tsx' },
          { value: 'src/components/Dialog.tsx', label: 'Dialog.tsx' },
        ],
      },
      {
        value: 'src/hooks',
        label: 'hooks',
        children: [
          { value: 'src/hooks/useToast.ts', label: 'useToast.ts' },
          { value: 'src/hooks/useTheme.ts', label: 'useTheme.ts' },
        ],
      },
      { value: 'src/App.tsx', label: 'App.tsx' },
      { value: 'src/main.tsx', label: 'main.tsx' },
    ],
  },
  { value: 'package.json', label: 'package.json' },
  { value: 'tsconfig.json', label: 'tsconfig.json' },
]

const orgTree: TreeSelectNode[] = [
  {
    value: 'engineering',
    label: 'Engineering',
    children: [
      { value: 'frontend', label: 'Frontend Team' },
      { value: 'backend', label: 'Backend Team' },
      { value: 'devops', label: 'DevOps Team' },
    ],
  },
  {
    value: 'design',
    label: 'Design',
    children: [
      { value: 'ux', label: 'UX Team' },
      { value: 'visual', label: 'Visual Team' },
    ],
  },
  {
    value: 'product',
    label: 'Product',
    children: [
      { value: 'pm', label: 'Product Managers' },
      { value: 'analytics', label: 'Analytics' },
    ],
  },
]

const restrictedTree: TreeSelectNode[] = [
  {
    value: 'folder1',
    label: 'Folder 1',
    children: [
      { value: 'file1', label: 'file1.txt' },
      { value: 'file2', label: 'file2.txt', disabled: true },
    ],
  },
  { value: 'locked', label: 'Locked folder', disabled: true, children: [] },
]

/** Angular demo for the tree-select page. Mirrors demos/react/tree-select.tsx story by story. */
@Component({
  selector: 'angular-tree-select-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiTreeSelectComponent,
    UiCardComponent,
    UiCardHeaderComponent,
    UiCardTitleComponent,
    UiCardDescriptionComponent,
    UiCardContentComponent,
  ],
  template: `
    @switch (story) {
      @case ('File picker') {
        <div class="max-w-md space-y-2">
          <ui-tree-select
            [value]="fileValue()"
            (valueChange)="fileValue.set($any($event))"
            [data]="fileTree"
            placeholder="Select a file..."
            class="w-full"
          />
          <p class="text-muted-foreground text-xs">Selected: {{ fileValue() ?? 'none' }}</p>
        </div>
      }
      @case ('Multi-select with checkboxes') {
        <div class="max-w-md space-y-2">
          <ui-tree-select
            [value]="multiValue()"
            (valueChange)="multiValue.set($any($event))"
            [data]="fileTree"
            multiple
            placeholder="Select files..."
            class="w-full"
          />
          <p class="text-muted-foreground text-xs">{{ multiValue().length }} file(s) selected</p>
        </div>
      }
      @case ('Size variants') {
        <div class="max-w-md space-y-3">
          <ui-tree-select
            [value]="smValue()"
            (valueChange)="smValue.set($any($event))"
            [data]="fileTree"
            size="sm"
            placeholder="Small..."
            class="w-full"
          />
          <ui-tree-select [data]="fileTree" placeholder="Default..." class="w-full" />
          <ui-tree-select
            [value]="lgValue()"
            (valueChange)="lgValue.set($any($event))"
            [data]="fileTree"
            size="lg"
            placeholder="Large..."
            class="w-full"
          />
        </div>
      }
      @case ('Loading & disabled states') {
        <div class="max-w-md space-y-3">
          <ui-tree-select [data]="fileTree" loading placeholder="Loading files..." class="w-full" />
          <ui-tree-select [data]="fileTree" disabled placeholder="Disabled" class="w-full" />
        </div>
      }
      @case ('Restricted nodes') {
        <div class="max-w-md">
          <ui-tree-select [data]="restrictedTree" placeholder="Select a file..." class="w-full" />
        </div>
      }
      @case ('In context: Team permissions') {
        <div ui-card class="max-w-md">
          <div ui-card-header>
            <h3 ui-card-title>Project access</h3>
            <p ui-card-description>Choose which teams can collaborate on this repository.</p>
          </div>
          <div ui-card-content class="space-y-4">
            <ui-tree-select
              [value]="orgValue()"
              (valueChange)="orgValue.set($any($event))"
              [data]="orgTree"
              multiple
              defaultExpandAll
              placeholder="Select teams..."
              class="w-full"
            />
            <div class="text-muted-foreground flex items-center justify-between text-xs">
              <span>{{ orgValue().length }} team(s) granted access</span>
              <span class="text-foreground font-medium">{{ orgValue().join(', ') || 'No access' }}</span>
            </div>
          </div>
        </div>
      }
    }
  `,
})
export class AngularTreeSelectDemoComponent {
  @Input() story = 'File picker'
  readonly fileTree = fileTree
  readonly orgTree = orgTree
  readonly restrictedTree = restrictedTree
  readonly fileValue = signal<string | null>(null)
  readonly multiValue = signal<string[]>([])
  readonly smValue = signal<string | null>(null)
  readonly lgValue = signal<string | null>(null)
  readonly orgValue = signal<string[]>(['frontend', 'backend'])
}
