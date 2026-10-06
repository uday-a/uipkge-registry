import { Component, Input } from '@angular/core'
import {
  UiOrganizationChartComponent,
  type OrgChartToggleEvent,
  type OrgNode,
} from '../../../../../packages/registry-angular/components/organization-chart/organization-chart.component'
import { UiBadgeComponent } from '../../../../../packages/registry-angular/components/badge/badge.component'
import {
  UiCardComponent,
  UiCardContentComponent,
  UiCardHeaderComponent,
  UiCardTitleComponent,
} from '../../../../../packages/registry-angular/components/card/card.component'

const acmeOrg: OrgNode = {
  id: '1',
  name: 'Sarah Johnson',
  title: 'Chief Executive Officer',
  avatar: 'https://i.pravatar.cc/80?img=47',
  department: 'Executive',
  children: [
    {
      id: '2',
      name: 'Michael Chen',
      title: 'VP of Engineering',
      avatar: 'https://i.pravatar.cc/80?img=12',
      department: 'Engineering',
      children: [
        {
          id: '5',
          name: 'Alex Rivera',
          title: 'Engineering Lead',
          avatar: 'https://i.pravatar.cc/80?img=33',
          department: 'Engineering',
          children: [
            { id: '8', name: 'Jordan Lee', title: 'Senior Engineer', department: 'Engineering' },
            { id: '9', name: 'Taylor Brooks', title: 'Frontend Engineer', department: 'Engineering' },
          ],
        },
        {
          id: '6',
          name: 'Sam Patel',
          title: 'DevOps Lead',
          department: 'Engineering',
        },
      ],
    },
    {
      id: '3',
      name: 'Emily Davis',
      title: 'VP of Sales',
      avatar: 'https://i.pravatar.cc/80?img=45',
      department: 'Sales',
      children: [
        { id: '7', name: 'Chris Brown', title: 'Sales Manager', department: 'Sales' },
        { id: '10', name: 'Maria Garcia', title: 'Account Executive', department: 'Sales' },
      ],
    },
    {
      id: '4',
      name: 'David Wilson',
      title: 'VP of Marketing',
      avatar: 'https://i.pravatar.cc/80?img=60',
      department: 'Marketing',
    },
  ],
}

const initialsOrg: OrgNode = {
  id: 'r',
  name: 'Robin Hayes',
  title: 'Director',
  children: [
    { id: 'a', name: 'Alice Carter', title: 'Team Lead' },
    { id: 'b', name: 'Ben Walsh', title: 'Team Lead' },
  ],
}

/** Angular demo for the organization-chart page. Mirrors demos/react/organization-chart.tsx story by story. */
@Component({
  selector: 'angular-organization-chart-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiOrganizationChartComponent,
    UiBadgeComponent,
    UiCardComponent,
    UiCardHeaderComponent,
    UiCardTitleComponent,
    UiCardContentComponent,
  ],
  template: `
    @switch (story) {
      @case ('Acme Inc. leadership') {
        <ui-organization-chart [data]="acmeOrg" (nodeClick)="selectedNode = $event" class="w-full" />
        @if (selectedNode) {
          <p class="text-muted-foreground mt-3 text-xs">
            Selected: <span class="text-foreground font-medium">{{ selectedNode.name }}</span> ·
            {{ selectedNode.title }}
          </p>
        }
      }
      @case ('With department badges') {
        <ng-template #badge let-node>
          @if (node.department) {
            <div class="mt-1">
              <ui-badge variant="secondary" class="text-xs">{{ node.department }}</ui-badge>
            </div>
          }
        </ng-template>
        <ui-organization-chart [data]="acmeOrg" class="w-full" [renderNode]="badge" />
      }
      @case ('Horizontal layout') {
        <ui-organization-chart [data]="acmeOrg" direction="left-right" class="w-full" />
      }
      @case ('Zoomable explorer') {
        <ui-organization-chart [data]="acmeOrg" zoomable class="w-full" />
      }
      @case ('Collapsed by default') {
        <ui-organization-chart [data]="acmeOrg" [defaultExpanded]="false" class="w-full" />
      }
      @case ('In a reporting card') {
        <ui-card class="max-w-3xl">
          <ui-card-header>
            <ui-card-title class="text-base">Reporting structure</ui-card-title>
          </ui-card-header>
          <ui-card-content>
            <ui-organization-chart
              [data]="acmeOrg"
              [defaultExpanded]="false"
              (toggle)="onToggle($event)"
              class="w-full"
            />
            @if (lastToggle) {
              <p class="text-muted-foreground mt-2 text-xs">{{ lastToggle }}</p>
            }
          </ui-card-content>
        </ui-card>
      }
      @case ('Initials fallback') {
        <ui-organization-chart [data]="initialsOrg" class="w-full" />
      }
    }
  `,
})
export class AngularOrganizationChartDemoComponent {
  @Input() story = 'Acme Inc. leadership'
  readonly acmeOrg = acmeOrg
  readonly initialsOrg = initialsOrg
  selectedNode: OrgNode | null = null
  lastToggle = ''

  onToggle(e: OrgChartToggleEvent): void {
    this.lastToggle = `${e.node.name}: ${e.expanded ? 'expanded' : 'collapsed'}`
  }
}
