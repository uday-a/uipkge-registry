import { Component, Input, signal } from '@angular/core'
import {
  UiGanttComponent,
  UiGanttContextMenuComponent,
  UiGanttHeaderComponent,
  UiGanttTreeComponent,
  UiGanttTimelineComponent,
  type GanttTask,
} from '../../../../../packages/registry-angular/components/gantt/index'
import { UiBadgeComponent } from '../../../../../packages/registry-angular/components/badge/badge.component'

const sampleTasks: GanttTask[] = [
  {
    id: 't-1',
    name: 'Discovery & System Architecture',
    startDate: '2026-08-01',
    endDate: '2026-08-08',
    progress: 100,
    status: 'done',
    priority: 'high',
    assignee: { name: 'Sarah Connor', initials: 'SC' },
  },
  {
    id: 't-2',
    name: 'Design Tokens & Component Specs',
    startDate: '2026-08-06',
    endDate: '2026-08-16',
    progress: 85,
    status: 'in-progress',
    priority: 'urgent',
    assignee: { name: 'Marcus Rivera', initials: 'MR' },
  },
  {
    id: 't-3',
    name: 'Core Primitives Implementation',
    startDate: '2026-08-12',
    endDate: '2026-08-24',
    progress: 50,
    status: 'in-progress',
    priority: 'high',
    dependencies: ['t-2'],
    assignee: { name: 'Priya Nair', initials: 'PN' },
  },
  {
    id: 't-4',
    name: 'Alpha Registry Release',
    startDate: '2026-08-25',
    endDate: '2026-08-25',
    isMilestone: true,
    status: 'todo',
    priority: 'urgent',
    dependencies: ['t-3'],
  },
  {
    id: 't-5',
    name: 'End-to-End Testing & Verification',
    startDate: '2026-08-26',
    endDate: '2026-09-06',
    progress: 10,
    status: 'todo',
    priority: 'medium',
    dependencies: ['t-4'],
    assignee: { name: 'Sundar Krishnan', initials: 'SK' },
  },
  {
    id: 't-6',
    name: 'Production Deployment',
    startDate: '2026-09-08',
    endDate: '2026-09-08',
    isMilestone: true,
    status: 'todo',
    dependencies: ['t-5'],
  },
]

const groupTasks: GanttTask[] = [
  {
    id: 'grp-1',
    name: 'Phase 1: Foundation',
    startDate: '2026-08-01',
    endDate: '2026-08-18',
    isGroup: true,
    progress: 90,
  },
  {
    id: 'sub-1',
    parentId: 'grp-1',
    name: 'Design System Tokens',
    startDate: '2026-08-01',
    endDate: '2026-08-09',
    progress: 100,
    status: 'done',
  },
  {
    id: 'sub-2',
    parentId: 'grp-1',
    name: 'Headless Primitive Setup',
    startDate: '2026-08-08',
    endDate: '2026-08-18',
    progress: 80,
    status: 'in-progress',
  },
  {
    id: 'grp-2',
    name: 'Phase 2: Productization',
    startDate: '2026-08-19',
    endDate: '2026-09-05',
    isGroup: true,
    progress: 25,
  },
  {
    id: 'sub-3',
    parentId: 'grp-2',
    name: 'Composed Dashboard Blocks',
    startDate: '2026-08-19',
    endDate: '2026-08-29',
    progress: 40,
    status: 'in-progress',
  },
  {
    id: 'sub-4',
    parentId: 'grp-2',
    name: 'Documentation Island Previews',
    startDate: '2026-08-28',
    endDate: '2026-09-05',
    progress: 0,
    status: 'todo',
  },
]

const statusTasks: GanttTask[] = [
  {
    id: 's-1',
    name: 'Security Audit & Pen-Testing',
    startDate: '2026-08-02',
    endDate: '2026-08-10',
    status: 'done',
    progress: 100,
  },
  {
    id: 's-2',
    name: 'Database Migration to Postgres',
    startDate: '2026-08-08',
    endDate: '2026-08-20',
    status: 'in-progress',
    progress: 65,
  },
  {
    id: 's-3',
    name: 'Payment Gateway Webhook Sync',
    startDate: '2026-08-14',
    endDate: '2026-08-26',
    status: 'at-risk',
    progress: 30,
  },
  {
    id: 's-4',
    name: 'SSO SAML Enterprise Auth',
    startDate: '2026-08-18',
    endDate: '2026-08-30',
    status: 'blocked',
    progress: 15,
  },
  {
    id: 's-5',
    name: 'Analytics Telemetry Pipeline',
    startDate: '2026-08-25',
    endDate: '2026-09-05',
    status: 'todo',
    progress: 0,
  },
]

@Component({
  selector: 'gantt-demo',
  standalone: true,
  imports: [
    UiGanttComponent,
    UiGanttContextMenuComponent,
    UiGanttHeaderComponent,
    UiGanttTreeComponent,
    UiGanttTimelineComponent,
    UiBadgeComponent,
  ],
  template: `
    @switch (story) {
      @case ('Interactive Project Timeline') {
        <ui-gantt [tasks]="sampleTasks" scale="day" class="h-96">
          <ui-gantt-header title="Product Engineering Q3" />
          <div class="flex min-h-0 flex-1 overflow-hidden">
            <ui-gantt-tree />
            <ui-gantt-timeline />
          </div>
        </ui-gantt>
      }
      @case ('Parent Deliverables & Subtask Rollups') {
        <ui-gantt [tasks]="groupTasks" scale="day" class="h-96">
          <ui-gantt-header title="Multi-Phase Project Breakdown" />
          <div class="flex min-h-0 flex-1 overflow-hidden">
            <ui-gantt-tree />
            <ui-gantt-timeline />
          </div>
        </ui-gantt>
      }
      @case ('Dependencies & Critical Path') {
        <ui-gantt [tasks]="sampleTasks" scale="day" class="h-96">
          <ui-gantt-header title="Task Prerequisites & Handoffs" />
          <div class="flex min-h-0 flex-1 overflow-hidden">
            <ui-gantt-tree />
            <ui-gantt-timeline [showDependencies]="true" />
          </div>
        </ui-gantt>
      }
      @case ('Week Scale View') {
        <ui-gantt [tasks]="sampleTasks" scale="week" class="h-80">
          <ui-gantt-header title="Sprint Overview (Week Scale)" />
          <div class="flex min-h-0 flex-1 overflow-hidden">
            <ui-gantt-tree />
            <ui-gantt-timeline />
          </div>
        </ui-gantt>
      }
      @case ('Month Scale View') {
        <ui-gantt [tasks]="sampleTasks" scale="month" class="h-80">
          <ui-gantt-header title="Quarterly Strategic Goals" />
          <div class="flex min-h-0 flex-1 overflow-hidden">
            <ui-gantt-tree />
            <ui-gantt-timeline />
          </div>
        </ui-gantt>
      }
      @case ('Health & Status Colors') {
        <ui-gantt [tasks]="statusTasks" scale="day" class="h-80">
          <ui-gantt-header title="System Health & Operational Status" />
          <div class="flex min-h-0 flex-1 overflow-hidden">
            <ui-gantt-tree />
            <ui-gantt-timeline />
          </div>
        </ui-gantt>
      }
      @case ('Compact Mini Widget') {
        <ui-gantt [tasks]="compactTasks" scale="day" [rowHeight]="32" [treeWidth]="220" class="h-64">
          <ui-gantt-header title="Active Sprint" [showScaleSwitcher]="false" />
          <div class="flex min-h-0 flex-1 overflow-hidden">
            <ui-gantt-tree [showPriority]="false" />
            <ui-gantt-timeline />
          </div>
        </ui-gantt>
      }
      @case ('Reactive Task Selection') {
        <div class="space-y-4">
          <ui-gantt [tasks]="sampleTasks" scale="day" class="h-80" (taskClick)="selectedTask.set($event)">
            <ui-gantt-header title="Click any task to inspect details" />
            <div class="flex min-h-0 flex-1 overflow-hidden">
              <ui-gantt-tree />
              <ui-gantt-timeline />
            </div>
          </ui-gantt>

          @if (selectedTask(); as task) {
            <div class="border-border bg-card flex items-center justify-between rounded-lg border p-4">
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-muted-foreground font-mono text-xs">{{ task.id }}</span>
                  <ui-badge variant="secondary">{{ task.status }}</ui-badge>
                </div>
                <p class="text-foreground mt-1 text-sm font-semibold">{{ task.name }}</p>
                <p class="text-muted-foreground text-xs">{{ task.startDate }} &rarr; {{ task.endDate }}</p>
              </div>
              <div class="text-right">
                <p class="text-muted-foreground text-xs">Progress</p>
                <p class="text-primary font-mono text-lg font-bold">{{ task.progress ?? 0 }}%</p>
              </div>
            </div>
          }
        </div>
      }
      @case ('Task Context Menu') {
        <div class="space-y-4">
          <ui-gantt-context-menu
            [task]="sampleTasks[0]!"
            (edit)="menuAction.set('View Details')"
            (statusChange)="menuAction.set('Status: ' + $event.status)"
            (priorityChange)="menuAction.set('Priority: ' + $event.priority)"
            (duplicate)="menuAction.set('Duplicate')"
            (delete)="menuAction.set('Delete')"
          >
            <div
              class="border-border bg-card hover:bg-muted/40 flex cursor-context-menu items-center justify-between rounded-lg border p-4"
            >
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-muted-foreground font-mono text-xs">{{ sampleTasks[0]!.id }}</span>
                  <ui-badge variant="secondary">{{ sampleTasks[0]!.status }}</ui-badge>
                </div>
                <p class="text-foreground mt-1 text-sm font-semibold">{{ sampleTasks[0]!.name }}</p>
                <p class="text-muted-foreground text-xs">Right-click for task actions</p>
              </div>
            </div>
          </ui-gantt-context-menu>

          <p class="text-muted-foreground text-xs">
            Last action: <span class="text-foreground font-mono">{{ menuAction() }}</span>
          </p>
        </div>
      }
      @default {
        <ui-gantt [tasks]="sampleTasks" scale="day" class="h-96">
          <ui-gantt-header title="Product Engineering Q3" />
          <div class="flex min-h-0 flex-1 overflow-hidden">
            <ui-gantt-tree />
            <ui-gantt-timeline />
          </div>
        </ui-gantt>
      }
    }
  `,
})
export class AngularGanttDemoComponent {
  @Input() story?: string

  readonly sampleTasks = sampleTasks
  readonly groupTasks = groupTasks
  readonly statusTasks = statusTasks
  readonly compactTasks = sampleTasks.slice(0, 4)
  readonly selectedTask = signal<GanttTask | null>(null)
  readonly menuAction = signal('none yet')
}
