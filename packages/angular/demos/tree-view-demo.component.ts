import { Component, Input } from '@angular/core'
import {
  UiTreeViewComponent,
  type TreeViewItem,
} from '../../../../../packages/registry-angular/components/tree-view/tree-view.component'

const fileTree: TreeViewItem[] = [
  {
    id: '1',
    label: 'src',
    icon: 'folder',
    children: [
      {
        id: '1-1',
        label: 'components',
        icon: 'folder',
        children: [
          { id: '1-1-1', label: 'Button.tsx', icon: 'file-code' },
          { id: '1-1-2', label: 'Card.tsx', icon: 'file-code' },
          { id: '1-1-3', label: 'Dialog.tsx', icon: 'file-code' },
        ],
      },
      {
        id: '1-2',
        label: 'hooks',
        icon: 'folder',
        children: [
          { id: '1-2-1', label: 'useToast.ts', icon: 'file-code' },
          { id: '1-2-2', label: 'useTheme.ts', icon: 'file-code' },
        ],
      },
      { id: '1-3', label: 'App.tsx', icon: 'file-code' },
      { id: '1-4', label: 'main.ts', icon: 'file-code' },
    ],
  },
  { id: '2', label: 'package.json', icon: 'file-text' },
  { id: '3', label: 'tsconfig.json', icon: 'file-text' },
  { id: '4', label: 'README.md', icon: 'file-text', disabled: true },
]

const channels: TreeViewItem[] = [
  {
    id: 'general',
    label: 'General',
    icon: 'hash',
    children: [
      { id: 'general-announcements', label: 'announcements', icon: 'hash' },
      { id: 'general-random', label: 'random', icon: 'hash' },
      { id: 'general-help', label: 'help', icon: 'hash', selected: true },
    ],
  },
  {
    id: 'design',
    label: 'Design',
    icon: 'hash',
    children: [
      { id: 'design-feedback', label: 'feedback', icon: 'hash' },
      { id: 'design-shipped', label: 'shipped', icon: 'hash' },
    ],
  },
]

const settingsTree: TreeViewItem[] = [
  {
    id: 'account',
    label: 'Account',
    icon: 'user',
    children: [
      { id: 'account-profile', label: 'Profile' },
      { id: 'account-security', label: 'Security' },
      { id: 'account-notifications', label: 'Notifications' },
    ],
  },
  {
    id: 'workspace',
    label: 'Workspace',
    icon: 'settings',
    children: [
      { id: 'workspace-members', label: 'Members' },
      { id: 'workspace-billing', label: 'Billing' },
      { id: 'workspace-integrations', label: 'Integrations' },
    ],
  },
]

@Component({
  selector: 'angular-tree-view-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiTreeViewComponent],
  template: `
    @switch (story) {
      @case ('Default') {
        <ui-tree-view
          [items]="fileTree"
          [defaultExpanded]="true"
          [selectedId]="selectedId"
          class="max-w-sm"
          (select)="selectedId = $event.id"
        />
      }
      @case ('Collapsed by default') {
        <ui-tree-view [items]="fileTree" class="max-w-sm" />
      }
      @case ('With checkboxes') {
        <ui-tree-view
          [items]="settingsTree"
          [defaultExpanded]="true"
          [showCheckboxes]="true"
          [selectedId]="checkSelected"
          class="max-w-sm"
          (select)="checkSelected = $event.id"
        />
      }
      @case ('Without icons') {
        <ui-tree-view [items]="settingsTree" [defaultExpanded]="true" [showIcons]="false" class="max-w-sm" />
      }
      @case ('Channel-style') {
        <ui-tree-view [items]="channels" [defaultExpanded]="true" class="max-w-sm" />
      }
    }
  `,
})
export class AngularTreeViewDemoComponent {
  @Input() story = 'Default'

  readonly fileTree = fileTree
  readonly channels = channels
  readonly settingsTree = settingsTree

  selectedId: string | null = null
  checkSelected: string | null = null
}
