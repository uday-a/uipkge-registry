import {
  Component,
  EventEmitter,
  Input,
  Output,
  booleanAttribute,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'
import { UiButtonComponent } from '@/ui/button/button.component'
import { UiButtonGroupComponent } from '@/ui/button/button-group.component'
import {
  UiContextMenuComponent,
  UiContextMenuTriggerComponent,
  UiContextMenuContentComponent,
  UiContextMenuItemComponent,
  UiContextMenuLabelComponent,
  UiContextMenuRadioGroupComponent,
  UiContextMenuRadioItemComponent,
  UiContextMenuSeparatorComponent,
  UiContextMenuShortcutComponent,
  UiContextMenuSubComponent,
  UiContextMenuSubContentComponent,
  UiContextMenuSubTriggerComponent,
} from '@/ui/context-menu/context-menu.component'
import type { GanttTask, GanttScale, GanttTaskStatus, GanttTaskPriority } from './types'

/* ------------------------------------------------------------------ */
/* Helpers & Color Lookups                                            */
/* ------------------------------------------------------------------ */

const priorityColors: Record<string, string> = {
  urgent: 'text-destructive',
  high: 'text-amber-500',
  medium: 'text-primary',
  low: 'text-muted-foreground/60',
}

function calculateDays(startDate: string, endDate: string): string {
  const diff = new Date(endDate).getTime() - new Date(startDate).getTime()
  const days = Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  return `${days}d`
}

const statusColors: Record<string, string> = {
  done: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40',
  'in-progress': 'bg-primary/20 text-primary border-primary/40',
  'at-risk': 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40',
  todo: 'bg-muted/80 text-muted-foreground border-border',
  blocked: 'bg-destructive/20 text-destructive border-destructive/40',
}

const progressColors: Record<string, string> = {
  done: 'bg-emerald-500/40',
  'in-progress': 'bg-primary/40',
  'at-risk': 'bg-amber-500/40',
  todo: 'bg-muted-foreground/20',
  blocked: 'bg-destructive/40',
}

/* ------------------------------------------------------------------ */
/* UiGanttComponent (Root Provider)                                   */
/* ------------------------------------------------------------------ */

/**
 * Angular port of UIPKGE Gantt. Multi-scale timeline, collapsible tree,
 * progress fill, milestones, dependency lines. 1:1 React parity.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-gantt, [ui-gantt]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"gantt"',
    '[attr.data-scale]': 'currentScale',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiGanttComponent {
  @Input() tasks: GanttTask[] = []
  @Input() scale?: GanttScale
  @Input() startDate?: string
  @Input() endDate?: string
  @Input() rowHeight = 40
  @Input() headerHeight = 48
  @Input() treeWidth = 280
  @Input('class') className?: string
  @Output() scaleChange = new EventEmitter<GanttScale>()
  @Output() taskClick = new EventEmitter<GanttTask>()
  @Output() taskChange = new EventEmitter<GanttTask>()

  readonly internalScale = signal<GanttScale>('day')

  get currentScale(): GanttScale {
    return this.scale ?? this.internalScale()
  }

  get hostClass(): string {
    return cn(
      'block border-border bg-card text-card-foreground relative w-full overflow-hidden rounded-xl border shadow-xs',
      this.className,
    )
  }

  setScale(scale: GanttScale): void {
    this.internalScale.set(scale)
    this.scale = scale
    this.scaleChange.emit(scale)
  }

  onTaskClick(task: GanttTask): void {
    this.taskClick.emit(task)
  }

  get resolvedStartDate(): Date {
    if (this.startDate) return new Date(this.startDate)
    if (this.tasks.length === 0) return new Date()
    const dates = this.tasks.map((t) => new Date(t.startDate).getTime())
    const min = Math.min(...dates)
    const d = new Date(min)
    d.setDate(d.getDate() - 3)
    return d
  }

  get resolvedEndDate(): Date {
    if (this.endDate) return new Date(this.endDate)
    if (this.tasks.length === 0) {
      const d = new Date()
      d.setDate(d.getDate() + 30)
      return d
    }
    const dates = this.tasks.map((t) => new Date(t.endDate).getTime())
    const max = Math.max(...dates)
    const d = new Date(max)
    d.setDate(d.getDate() + 7)
    return d
  }

  get totalDays(): number {
    const diff = this.resolvedEndDate.getTime() - this.resolvedStartDate.getTime()
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  get columnWidth(): number {
    switch (this.currentScale) {
      case 'day':
        return 44
      case 'week':
        return 120
      case 'month':
        return 180
      case 'year':
        return 240
      default:
        return 44
    }
  }

  barLeft(task: GanttTask): number {
    const range = this.range()
    if (!range) return 0
    const start = new Date(task.startDate ?? new Date()).getTime()
    return Math.max(0, Math.min(100, ((start - range.min) / (range.max - range.min)) * 100))
  }

  barWidth(task: GanttTask): number {
    const range = this.range()
    if (!range) return 10
    const start = new Date(task.startDate ?? new Date()).getTime()
    const end = new Date(task.endDate ?? new Date(start + 86400000)).getTime()
    return Math.max(2, Math.min(100, ((end - start) / (range.max - range.min)) * 100))
  }

  private range(): { min: number; max: number } | null {
    if (this.startDate && this.endDate) {
      return { min: new Date(this.startDate).getTime(), max: new Date(this.endDate).getTime() }
    }
    return { min: this.resolvedStartDate.getTime(), max: this.resolvedEndDate.getTime() }
  }
}

/* ------------------------------------------------------------------ */
/* UiGanttHeaderComponent                                             */
/* ------------------------------------------------------------------ */

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-gantt-header, [ui-gantt-header]',
  standalone: true,
  imports: [UiButtonComponent, UiButtonGroupComponent],
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"gantt-header"',
    '[class]': 'hostClass',
  },
  template: `
    <div class="flex items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-calendar text-primary size-4"
        aria-hidden="true"
      >
        <path d="M8 2v4" />
        <path d="M16 2v4" />
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <path d="M3 10h18" />
      </svg>
      <span class="text-foreground text-sm font-semibold">{{ title }}</span>
    </div>

    <div class="flex items-center gap-3">
      <ng-content />

      @if (showScaleSwitcher && gantt) {
        <ui-button-group>
          <button
            ui-button
            size="xs"
            [variant]="gantt.currentScale === 'day' ? 'default' : 'outline'"
            (click)="gantt.setScale('day')"
          >
            Day
          </button>
          <button
            ui-button
            size="xs"
            [variant]="gantt.currentScale === 'week' ? 'default' : 'outline'"
            (click)="gantt.setScale('week')"
          >
            Week
          </button>
          <button
            ui-button
            size="xs"
            [variant]="gantt.currentScale === 'month' ? 'default' : 'outline'"
            (click)="gantt.setScale('month')"
          >
            Month
          </button>
          <button
            ui-button
            size="xs"
            [variant]="gantt.currentScale === 'year' ? 'default' : 'outline'"
            (click)="gantt.setScale('year')"
          >
            Year
          </button>
        </ui-button-group>
      }
    </div>
  `,
})
export class UiGanttHeaderComponent {
  readonly gantt = inject(UiGanttComponent, { optional: true })

  @Input() title = 'Project Timeline'
  @Input({ transform: booleanAttribute }) showScaleSwitcher = true
  @Input('class') className?: string

  get hostClass(): string {
    return cn('border-border bg-muted/30 flex items-center justify-between border-b px-4 py-2.5', this.className)
  }
}

/* ------------------------------------------------------------------ */
/* UiGanttTreeComponent                                               */
/* ------------------------------------------------------------------ */

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-gantt-tree, [ui-gantt-tree]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"gantt-tree"',
    '[style.width.px]': 'treeWidth',
    '[class]': 'hostClass',
  },
  template: `
    <div
      [style.height.px]="headerHeight"
      class="border-border bg-muted/20 text-muted-foreground flex items-center justify-between border-b px-3 text-xs font-semibold tracking-wider uppercase"
    >
      <span class="flex-1 truncate">Deliverable</span>
      @if (showPriority) {
        <span class="w-12 shrink-0 text-center">Pri</span>
      }
      <span class="w-16 shrink-0 text-right">Duration</span>
    </div>

    <div class="divide-border/40 flex-1 divide-y overflow-y-auto">
      @for (task of tasks; track task.id) {
        <div
          [style.height.px]="rowHeight"
          class="group/row text-foreground hover:bg-muted/40 flex cursor-pointer items-center justify-between px-3 text-xs transition-colors"
          [class.bg-muted/10]="task.isGroup"
          [class.font-semibold]="task.isGroup"
          (click)="onRowClick(task)"
        >
          <div class="flex min-w-0 flex-1 items-center gap-1.5 pr-2">
            @if (task.parentId) {
              <span class="w-4 shrink-0"></span>
            }

            @if (task.status) {
              <span
                class="size-2 shrink-0 rounded-full"
                [class.bg-emerald-500]="task.status === 'done'"
                [class.ring-2]="
                  task.status === 'done' ||
                  task.status === 'in-progress' ||
                  task.status === 'at-risk' ||
                  task.status === 'blocked'
                "
                [class.ring-emerald-500/20]="task.status === 'done'"
                [class.bg-primary]="task.status === 'in-progress'"
                [class.ring-primary/20]="task.status === 'in-progress'"
                [class.bg-amber-500]="task.status === 'at-risk'"
                [class.ring-amber-500/20]="task.status === 'at-risk'"
                [class.bg-muted-foreground/40]="task.status === 'todo'"
                [class.bg-destructive]="task.status === 'blocked'"
                [class.ring-destructive/20]="task.status === 'blocked'"
              ></span>
            }

            <span class="truncate font-medium">{{ task.name }}</span>
          </div>

          @if (showPriority) {
            <div class="flex w-12 shrink-0 items-center justify-center">
              @if (task.priority) {
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-flag size-3"
                  [class]="priorityColors[task.priority]"
                  aria-hidden="true"
                >
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" x2="4" y1="22" y2="15" />
                </svg>
              }
            </div>
          }

          <div class="text-muted-foreground w-16 shrink-0 text-right font-mono text-xs">
            @if (task.isMilestone) {
              <span class="text-xs font-semibold text-amber-500">Milestone</span>
            } @else {
              <span>{{ calculateDays(task.startDate, task.endDate) }}</span>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class UiGanttTreeComponent {
  readonly gantt = inject(UiGanttComponent)

  @Input({ transform: booleanAttribute }) showAssignee = true
  @Input({ transform: booleanAttribute }) showPriority = true
  @Input('class') className?: string
  @Output() taskClick = new EventEmitter<GanttTask>()

  readonly priorityColors = priorityColors
  readonly calculateDays = calculateDays

  get treeWidth() {
    return this.gantt.treeWidth
  }
  get headerHeight() {
    return this.gantt.headerHeight
  }
  get rowHeight() {
    return this.gantt.rowHeight
  }
  get tasks() {
    return this.gantt.tasks
  }

  get hostClass(): string {
    return cn('border-border bg-card flex shrink-0 flex-col border-r transition-[width] select-none', this.className)
  }

  onRowClick(task: GanttTask): void {
    this.taskClick.emit(task)
    this.gantt.taskClick.emit(task)
  }
}

/* ------------------------------------------------------------------ */
/* UiGanttMilestoneComponent                                          */
/* ------------------------------------------------------------------ */

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-gantt-milestone, [ui-gantt-milestone]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"gantt-milestone"',
    '[style.left.px]': 'left - size / 2',
    '[style.top.px]': 'top - size / 2',
    '[style.width.px]': 'size',
    '[style.height.px]': 'size',
    '[attr.title]': 'task ? task.name + " (" + task.startDate + ")" : null',
    '[class]': 'hostClass',
    '(click)': 'onClick()',
  },
  template: ``,
})
export class UiGanttMilestoneComponent {
  @Input({ required: true }) task!: GanttTask
  @Input({ required: true }) left!: number
  @Input({ required: true }) top!: number
  @Input() size = 16
  @Input('class') className?: string
  @Output() taskClick = new EventEmitter<GanttTask>()

  get hostClass(): string {
    return cn(
      'border-primary bg-primary absolute z-20 rotate-45 cursor-pointer rounded-xs border-2 shadow-sm transition-transform hover:scale-125',
      this.className,
    )
  }

  onClick(): void {
    this.taskClick.emit(this.task)
  }
}

/* ------------------------------------------------------------------ */
/* UiGanttBarComponent                                                */
/* ------------------------------------------------------------------ */

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-gantt-bar, [ui-gantt-bar]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': 'task?.isGroup ? "gantt-group-bar" : "gantt-bar"',
    '[style.left.px]': 'left',
    '[style.width.px]': 'mathMax(24, width)',
    '[style.top.px]': 'task?.isGroup ? top + 4 : top',
    '[style.height.px]': 'task?.isGroup ? height - 8 : height',
    '[class]': 'hostClass',
    '(click)': 'onClick()',
  },
  template: `
    @if (task) {
      @if (task.isGroup) {
        <span class="truncate">{{ task.name }}</span>
        @if (task.progress != null) {
          <span class="font-mono text-xs opacity-80">{{ task.progress }}%</span>
        }
      } @else {
        @if (task.progress != null && task.progress > 0) {
          <div
            [style.width.%]="task.progress"
            [class]="'absolute inset-y-0 left-0 transition-[left] ' + progressColors[task.status ?? 'in-progress']"
          ></div>
        }

        <div class="relative z-10 flex w-full min-w-0 items-center justify-between px-2">
          <span class="truncate font-medium">{{ task.name }}</span>
          @if (task.progress != null) {
            <span class="ml-1 shrink-0 font-mono text-xs opacity-80">{{ task.progress }}%</span>
          }
        </div>

        <div
          aria-hidden="true"
          class="bg-foreground/20 absolute inset-y-0 left-0 w-1.5 cursor-ew-resize opacity-0 transition-opacity group-hover/bar:opacity-100"
        ></div>
        <div
          aria-hidden="true"
          class="bg-foreground/20 absolute inset-y-0 right-0 w-1.5 cursor-ew-resize opacity-0 transition-opacity group-hover/bar:opacity-100"
        ></div>
      }
    }
  `,
})
export class UiGanttBarComponent {
  @Input({ required: true }) task!: GanttTask
  @Input({ required: true }) left!: number
  @Input({ required: true }) width!: number
  @Input({ required: true }) top!: number
  @Input({ required: true }) height!: number
  @Input('class') className?: string
  @Output() taskClick = new EventEmitter<GanttTask>()

  readonly mathMax = Math.max
  readonly progressColors = progressColors

  get hostClass(): string {
    if (this.task?.isGroup) {
      return cn(
        'group/bar bg-foreground/80 text-background hover:bg-foreground absolute z-10 flex cursor-pointer items-center justify-between rounded-xs px-2 text-xs font-semibold shadow-xs select-none',
        this.className,
      )
    }
    return cn(
      'group/bar absolute z-10 flex cursor-pointer items-center overflow-hidden rounded-md border text-xs font-medium shadow-xs transition-[box-shadow,transform] select-none hover:scale-[1.01] hover:shadow-md',
      this.task?.color ? this.task.color : statusColors[this.task?.status ?? 'in-progress'],
      this.className,
    )
  }

  onClick(): void {
    this.taskClick.emit(this.task)
  }
}

/* ------------------------------------------------------------------ */
/* UiGanttTimelineComponent                                           */
/* ------------------------------------------------------------------ */

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-gantt-timeline, [ui-gantt-timeline]',
  standalone: true,
  imports: [UiGanttBarComponent, UiGanttMilestoneComponent],
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"gantt-timeline"',
    '[class]': 'hostClass',
  },
  template: `
    <div [style.width.px]="timelineWidth" class="relative">
      <div [style.height.px]="headerHeight" class="border-border bg-muted/10 sticky top-0 z-20 flex border-b">
        @for (col of columns; track $index) {
          <div
            [style.width.px]="columnWidth"
            class="border-border/50 text-muted-foreground flex flex-col items-center justify-center border-r text-xs"
            [class.bg-muted/20]="col.isWeekend"
            [class.text-muted-foreground/60]="col.isWeekend"
          >
            <span class="text-foreground font-medium">{{ col.label }}</span>
            <span class="text-xs">{{ col.subLabel }}</span>
          </div>
        }
      </div>

      <div class="relative">
        <div class="pointer-events-none absolute inset-0 flex">
          @for (col of columns; track $index) {
            <div
              [style.width.px]="columnWidth"
              class="border-border/30 h-full border-r"
              [class.bg-muted/15]="col.isWeekend"
            ></div>
          }
        </div>

        @if (showTodayLine && todayPosition != null) {
          <div
            [style.left.px]="todayPosition"
            class="pointer-events-none absolute inset-y-0 z-30 flex flex-col items-center"
          >
            <div
              class="bg-destructive text-destructive-foreground rounded-full px-1.5 py-0.5 text-xs font-bold shadow-xs"
            >
              Today
            </div>
            <div class="bg-destructive/60 h-full w-[1.5px] border-r border-dashed"></div>
          </div>
        }

        @if (dependencyPaths.length > 0) {
          <svg
            [attr.width]="timelineWidth"
            [attr.height]="tasks.length * rowHeight"
            class="pointer-events-none absolute inset-0 z-10"
          >
            <defs>
              <marker
                id="gantt-arrow-angular"
                viewBox="0 0 6 6"
                refX="5"
                refY="3"
                markerWidth="6"
                markerHeight="6"
                orient="auto"
              >
                <path d="M 0 0 L 6 3 L 0 6 z" class="fill-primary/60" />
              </marker>
            </defs>
            @for (p of dependencyPaths; track $index) {
              <path
                [attr.d]="p.d"
                fill="none"
                class="stroke-primary/50"
                stroke-width="1.5"
                stroke-dasharray="3,3"
                marker-end="url(#gantt-arrow-angular)"
              />
            }
          </svg>
        }

        @for (task of tasks; track task.id; let idx = $index) {
          @let coords = getTaskCoordinates(task, idx);
          <div
            [style.height.px]="rowHeight"
            class="border-border/40 hover:bg-muted/10 relative border-b transition-colors"
          >
            @if (task.isMilestone) {
              <ui-gantt-milestone
                [task]="task"
                [left]="coords.left"
                [top]="rowHeight / 2"
                (taskClick)="onTaskClick(task)"
              />
            } @else {
              <ui-gantt-bar
                [task]="task"
                [left]="coords.left"
                [width]="coords.width"
                [top]="(coords.height - 28) / 2 + 6"
                [height]="28"
                (taskClick)="onTaskClick(task)"
              />
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class UiGanttTimelineComponent {
  readonly gantt = inject(UiGanttComponent)

  @Input({ transform: booleanAttribute }) showTodayLine = true
  @Input({ transform: booleanAttribute }) showDependencies = true
  @Input('class') className?: string
  @Output() taskClick = new EventEmitter<GanttTask>()

  get headerHeight() {
    return this.gantt.headerHeight
  }
  get rowHeight() {
    return this.gantt.rowHeight
  }
  get columnWidth() {
    return this.gantt.columnWidth
  }
  get tasks() {
    return this.gantt.tasks
  }

  get hostClass(): string {
    return cn('bg-background relative flex-1 overflow-x-auto overflow-y-hidden select-none', this.className)
  }

  get columns(): { date: Date; label: string; subLabel: string; isWeekend: boolean }[] {
    const list: { date: Date; label: string; subLabel: string; isWeekend: boolean }[] = []
    const start = new Date(this.gantt.resolvedStartDate)
    const totalDays = this.gantt.totalDays

    for (let i = 0; i < totalDays; i++) {
      const d = new Date(start)
      d.setDate(d.getDate() + i)
      const dayOfWeek = d.getDay()
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

      list.push({
        date: d,
        label: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        subLabel: d.toLocaleDateString(undefined, { weekday: 'narrow' }),
        isWeekend,
      })
    }
    return list
  }

  get timelineWidth(): number {
    return this.columns.length * this.columnWidth
  }

  getTaskCoordinates(task: GanttTask, index: number): { left: number; width: number; top: number; height: number } {
    const start = new Date(this.gantt.resolvedStartDate).getTime()
    const taskStart = new Date(task.startDate).getTime()
    const taskEnd = new Date(task.endDate).getTime()
    const oneDay = 1000 * 60 * 60 * 24

    const startDiffDays = Math.max(0, (taskStart - start) / oneDay)
    const durationDays = Math.max(1, (taskEnd - taskStart) / oneDay)

    const left = startDiffDays * this.columnWidth
    const width = durationDays * this.columnWidth
    const top = index * this.rowHeight + (this.rowHeight - 28) / 2

    return { left, width, top, height: 28 }
  }

  get todayPosition(): number | null {
    const start = new Date(this.gantt.resolvedStartDate).getTime()
    const today = new Date().setHours(0, 0, 0, 0)
    const oneDay = 1000 * 60 * 60 * 24
    const diffDays = (today - start) / oneDay

    if (diffDays < 0 || diffDays > this.gantt.totalDays) return null
    return diffDays * this.columnWidth + this.columnWidth / 2
  }

  get dependencyPaths(): { d: string; fromId: string; toId: string }[] {
    if (!this.showDependencies) return []
    const taskMap = new Map<string, { task: GanttTask; index: number }>()
    this.tasks.forEach((t, i) => taskMap.set(t.id, { task: t, index: i }))

    const paths: { d: string; fromId: string; toId: string }[] = []

    this.tasks.forEach((toTask, toIdx) => {
      if (!toTask.dependencies || toTask.dependencies.length === 0) return
      toTask.dependencies.forEach((fromId) => {
        const fromEntry = taskMap.get(fromId)
        if (!fromEntry) return

        const fromCoords = this.getTaskCoordinates(fromEntry.task, fromEntry.index)
        const toCoords = this.getTaskCoordinates(toTask, toIdx)

        const startX = fromEntry.task.isMilestone ? fromCoords.left : fromCoords.left + fromCoords.width
        const startY = fromCoords.top + 14

        const endX = toCoords.left
        const endY = toCoords.top + 14

        const deltaX = Math.max(16, (endX - startX) / 2)
        const d = `M ${startX} ${startY} C ${startX + deltaX} ${startY}, ${endX - deltaX} ${endY}, ${endX} ${endY}`
        paths.push({ d, fromId, toId: toTask.id })
      })
    })

    return paths
  }

  onTaskClick(task: GanttTask): void {
    this.taskClick.emit(task)
    this.gantt.taskClick.emit(task)
  }
}

/* ------------------------------------------------------------------ */
/* UiGanttContextMenuComponent                                        */
/* ------------------------------------------------------------------ */

/**
 * React `GanttContextMenu`: right-click menu for a task — task label header, View Details,
 * Change Status / Set Priority submenus (radio groups), Copy Task ID, Duplicate, Delete.
 * React's `asChild` trigger becomes the projected content inside the trigger element.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-gantt-context-menu, [ui-gantt-context-menu]',
  standalone: true,
  imports: [
    UiContextMenuComponent,
    UiContextMenuTriggerComponent,
    UiContextMenuContentComponent,
    UiContextMenuItemComponent,
    UiContextMenuLabelComponent,
    UiContextMenuRadioGroupComponent,
    UiContextMenuRadioItemComponent,
    UiContextMenuSeparatorComponent,
    UiContextMenuShortcutComponent,
    UiContextMenuSubComponent,
    UiContextMenuSubContentComponent,
    UiContextMenuSubTriggerComponent,
  ],
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"gantt-context-menu"',
    '[attr.class]': '"contents"',
  },
  template: `
    <ui-context-menu>
      <ui-context-menu-trigger><ng-content /></ui-context-menu-trigger>
      <ui-context-menu-content class="w-56">
        <ui-context-menu-label class="flex items-center justify-between text-xs">
          <span class="truncate font-semibold">{{ task?.name }}</span>
          <span class="text-muted-foreground font-mono text-xs">{{ task?.id }}</span>
        </ui-context-menu-label>
        <ui-context-menu-separator />

        <ui-context-menu-item (select)="edit.emit(task)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-pen mr-2 size-3.5"
            aria-hidden="true"
          >
            <path
              d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
            />
          </svg>
          <span>View Details</span>
          <ui-context-menu-shortcut>↵</ui-context-menu-shortcut>
        </ui-context-menu-item>

        <ui-context-menu-sub>
          <ui-context-menu-sub-trigger>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-clock text-primary mr-2 size-3.5"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span>Change Status</span>
          </ui-context-menu-sub-trigger>
          <ui-context-menu-sub-content class="w-44">
            <ui-context-menu-radio-group [value]="task?.status ?? 'todo'">
              <ui-context-menu-radio-item value="done" (select)="statusChange.emit({ task, status: 'done' })">
                <span class="mr-2 size-2 rounded-full bg-emerald-500"></span>
                <span>Completed</span>
              </ui-context-menu-radio-item>
              <ui-context-menu-radio-item
                value="in-progress"
                (select)="statusChange.emit({ task, status: 'in-progress' })"
              >
                <span class="bg-primary mr-2 size-2 rounded-full"></span>
                <span>In Progress</span>
              </ui-context-menu-radio-item>
              <ui-context-menu-radio-item value="at-risk" (select)="statusChange.emit({ task, status: 'at-risk' })">
                <span class="mr-2 size-2 rounded-full bg-amber-500"></span>
                <span>At Risk</span>
              </ui-context-menu-radio-item>
              <ui-context-menu-radio-item value="blocked" (select)="statusChange.emit({ task, status: 'blocked' })">
                <span class="bg-destructive mr-2 size-2 rounded-full"></span>
                <span>Blocked</span>
              </ui-context-menu-radio-item>
              <ui-context-menu-radio-item value="todo" (select)="statusChange.emit({ task, status: 'todo' })">
                <span class="bg-muted-foreground/40 mr-2 size-2 rounded-full"></span>
                <span>To Do</span>
              </ui-context-menu-radio-item>
            </ui-context-menu-radio-group>
          </ui-context-menu-sub-content>
        </ui-context-menu-sub>

        <ui-context-menu-sub>
          <ui-context-menu-sub-trigger>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-flag mr-2 size-3.5 text-amber-500"
              aria-hidden="true"
            >
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
              <line x1="4" x2="4" y1="22" y2="15" />
            </svg>
            <span>Set Priority</span>
          </ui-context-menu-sub-trigger>
          <ui-context-menu-sub-content class="w-40">
            <ui-context-menu-radio-group [value]="task?.priority ?? 'medium'">
              <ui-context-menu-radio-item
                value="urgent"
                (select)="priorityChange.emit({ task, priority: 'urgent' })"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-flag text-destructive mr-2 size-3"
                  aria-hidden="true"
                >
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" x2="4" y1="22" y2="15" />
                </svg>
                <span>Urgent</span>
              </ui-context-menu-radio-item>
              <ui-context-menu-radio-item value="high" (select)="priorityChange.emit({ task, priority: 'high' })">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-flag mr-2 size-3 text-amber-500"
                  aria-hidden="true"
                >
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" x2="4" y1="22" y2="15" />
                </svg>
                <span>High</span>
              </ui-context-menu-radio-item>
              <ui-context-menu-radio-item
                value="medium"
                (select)="priorityChange.emit({ task, priority: 'medium' })"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-flag text-primary mr-2 size-3"
                  aria-hidden="true"
                >
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" x2="4" y1="22" y2="15" />
                </svg>
                <span>Medium</span>
              </ui-context-menu-radio-item>
              <ui-context-menu-radio-item value="low" (select)="priorityChange.emit({ task, priority: 'low' })">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-flag text-muted-foreground mr-2 size-3"
                  aria-hidden="true"
                >
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" x2="4" y1="22" y2="15" />
                </svg>
                <span>Low</span>
              </ui-context-menu-radio-item>
            </ui-context-menu-radio-group>
          </ui-context-menu-sub-content>
        </ui-context-menu-sub>

        <ui-context-menu-separator />

        <ui-context-menu-item (select)="copyTaskId()">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-copy mr-2 size-3.5"
            aria-hidden="true"
          >
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
          <span>Copy Task ID</span>
          <ui-context-menu-shortcut>⌘C</ui-context-menu-shortcut>
        </ui-context-menu-item>

        <ui-context-menu-item (select)="duplicate.emit(task)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-layers mr-2 size-3.5"
            aria-hidden="true"
          >
            <path
              d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"
            />
            <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" />
            <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" />
          </svg>
          <span>Duplicate</span>
          <ui-context-menu-shortcut>⌘D</ui-context-menu-shortcut>
        </ui-context-menu-item>

        <ui-context-menu-separator />

        <ui-context-menu-item class="text-destructive focus:text-destructive" (select)="deleteTask.emit(task)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-trash-2 mr-2 size-3.5"
            aria-hidden="true"
          >
            <path d="M10 11v6" />
            <path d="M14 11v6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
            <path d="M3 6h18" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          <span>Delete Deliverable</span>
          <ui-context-menu-shortcut>⌫</ui-context-menu-shortcut>
        </ui-context-menu-item>
      </ui-context-menu-content>
    </ui-context-menu>
  `,
})
export class UiGanttContextMenuComponent {
  @Input() task?: GanttTask
  /** React `onEdit`. */
  @Output() edit = new EventEmitter<GanttTask>()
  /** React `onStatusChange(task, status)`. */
  @Output() statusChange = new EventEmitter<{ task: GanttTask; status: GanttTaskStatus }>()
  /** React `onPriorityChange(task, priority)`. */
  @Output() priorityChange = new EventEmitter<{ task: GanttTask; priority: GanttTaskPriority }>()
  /** React `onDuplicate`. */
  @Output() duplicate = new EventEmitter<GanttTask>()
  /** React `onDelete` (aliased: `delete` is a reserved word in template expressions). */
  @Output('delete') deleteTask = new EventEmitter<GanttTask>()

  copyTaskId(): void {
    if (this.task?.id && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(this.task.id)
    }
  }
}
