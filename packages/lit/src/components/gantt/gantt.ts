import { LitElement, css, html, nothing, svg, type PropertyDeclarations } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { Calendar, Clock, Copy, Edit2, Flag, Layers, Trash2 } from 'lucide'
import { cn } from '../../lib/utils'
import { icon } from '../../lib/icon'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import '../button/button'
import '../button-group/button-group'
import '../context-menu/context-menu'
import type { GanttScale, GanttTask, GanttTaskPriority, GanttTaskStatus } from './types'

export type * from './types'

// React's class strings, verbatim (packages/registry-react/components/gantt).
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

const priorityColors: Record<string, string> = {
  urgent: 'text-destructive',
  high: 'text-amber-500',
  medium: 'text-primary',
  low: 'text-muted-foreground/60',
}

const ONE_DAY = 1000 * 60 * 60 * 24

function calculateDays(startDate: string, endDate: string) {
  const diff = new Date(endDate).getTime() - new Date(startDate).getTime()
  const days = Math.max(1, Math.ceil(diff / ONE_DAY))
  return `${days}d`
}

const statusItems: { value: GanttTaskStatus; label: string; dot: string }[] = [
  { value: 'done', label: 'Completed', dot: 'mr-2 size-2 rounded-full bg-emerald-500' },
  { value: 'in-progress', label: 'In Progress', dot: 'bg-primary mr-2 size-2 rounded-full' },
  { value: 'at-risk', label: 'At Risk', dot: 'mr-2 size-2 rounded-full bg-amber-500' },
  { value: 'blocked', label: 'Blocked', dot: 'bg-destructive mr-2 size-2 rounded-full' },
  { value: 'todo', label: 'To Do', dot: 'bg-muted-foreground/40 mr-2 size-2 rounded-full' },
]

const priorityItems: { value: GanttTaskPriority; label: string; flag: string }[] = [
  { value: 'urgent', label: 'Urgent', flag: 'text-destructive mr-2 size-3' },
  { value: 'high', label: 'High', flag: 'mr-2 size-3 text-amber-500' },
  { value: 'medium', label: 'Medium', flag: 'text-primary mr-2 size-3' },
  { value: 'low', label: 'Low', flag: 'text-muted-foreground mr-2 size-3' },
]

const boolDefaultTrue = { type: Boolean, converter: { fromAttribute: (v: string | null) => v !== null && v !== 'false' } }

/**
 * <uip-gantt> — the registry Gantt (Gantt + GanttHeader + GanttTree +
 * GanttTimeline, and optionally GanttContextMenu) as ONE web component, laid
 * out like the React demo: header on top, tree on the left, horizontally
 * scrolling timeline on the right.
 *
 *   <uip-gantt class="h-96" scale="day" header-title="Product Engineering Q3"
 *     tasks='[{"id":"t-1","name":"Discovery","startDate":"2026-08-01","endDate":"2026-08-08"}]'>
 *     <uip-button slot="actions" size="xs" variant="outline">Export</uip-button>
 *   </uip-gantt>
 *
 * Properties / attributes (React prop → attribute):
 *   tasks (JSON), scale (`day` | `week` | `month` | `year`), startDate → `start-date`,
 *   endDate → `end-date`, rowHeight → `row-height` (40), headerHeight → `header-height` (48),
 *   treeWidth → `tree-width` (280).
 *   GanttHeader: title → `header-title` ("Project Timeline"), showScaleSwitcher →
 *   `show-scale-switcher` (true; `="false"` turns it off), `actions` → `slot="actions"`.
 *   GanttTree: showPriority → `show-priority` (true), showAssignee → `show-assignee` (true, unused — as in React).
 *   GanttTimeline: showTodayLine → `show-today-line` (true), showDependencies → `show-dependencies` (true).
 *   `context-menu`: wrap every task row and bar in React's GanttContextMenu.
 *
 * Events (bubble, composed; payload in `detail`):
 *   `task-click` { task } (onTaskClick), `scale-change` { scale } (onScaleChange —
 *   the scale switcher also updates `scale` itself; preventDefault to keep it controlled),
 *   and with `context-menu`: `edit` { task }, `status-change` { task, status },
 *   `priority-change` { task, priority }, `duplicate` { task }, `delete` { task }
 *   (GanttContextMenu's onEdit / onStatusChange / onPriorityChange / onDuplicate / onDelete).
 *
 * Styling: `class` on the host (e.g. `h-96`) sizes it; `::part(base)` is the
 * card, plus parts `header`, `body`, `tree`, `timeline`.
 *
 * Intentionally data-driven: React's composable GanttHeader/Tree/Timeline/Bar
 * parts render here from `tasks` + props (`actions` slot + parts cover the
 * common customizations); custom row/bar renderers are niche next to the main
 * props and stay out of the web-component API.
 */
export class UipGantt extends LitElement {
  // Flex host so the card stretches to a height set on the host (`h-96`).
  static styles = [tailwind, css`:host { display: flex; width: 100%; }`]

  static properties: PropertyDeclarations = {
    tasks: { type: Array },
    scale: { reflect: true },
    startDate: { attribute: 'start-date' },
    endDate: { attribute: 'end-date' },
    rowHeight: { type: Number, attribute: 'row-height' },
    headerHeight: { type: Number, attribute: 'header-height' },
    treeWidth: { type: Number, attribute: 'tree-width' },
    headerTitle: { attribute: 'header-title' },
    showScaleSwitcher: { ...boolDefaultTrue, attribute: 'show-scale-switcher' },
    showPriority: { ...boolDefaultTrue, attribute: 'show-priority' },
    showAssignee: { ...boolDefaultTrue, attribute: 'show-assignee' },
    showTodayLine: { ...boolDefaultTrue, attribute: 'show-today-line' },
    showDependencies: { ...boolDefaultTrue, attribute: 'show-dependencies' },
    contextMenu: { type: Boolean, attribute: 'context-menu' },
    menuTask: { state: true },
  }

  tasks: GanttTask[] = []
  scale: GanttScale = 'day'
  startDate?: string
  endDate?: string
  rowHeight = 40
  headerHeight = 48
  treeWidth = 280
  headerTitle = 'Project Timeline'
  showScaleSwitcher = true
  showPriority = true
  showAssignee = true
  showTodayLine = true
  showDependencies = true
  contextMenu = false
  private menuTask: GanttTask | null = null

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'gantt')
  }

  // --- derived (Gantt.tsx) -------------------------------------------------------
  private get resolvedStartDate() {
    const tasks = this.tasks ?? []
    if (this.startDate) return new Date(this.startDate)
    if (tasks.length === 0) return new Date()
    const min = Math.min(...tasks.map((t) => new Date(t.startDate).getTime()))
    const d = new Date(min)
    d.setDate(d.getDate() - 3)
    return d
  }

  private get resolvedEndDate() {
    const tasks = this.tasks ?? []
    if (this.endDate) return new Date(this.endDate)
    if (tasks.length === 0) {
      const d = new Date()
      d.setDate(d.getDate() + 30)
      return d
    }
    const max = Math.max(...tasks.map((t) => new Date(t.endDate).getTime()))
    const d = new Date(max)
    d.setDate(d.getDate() + 7)
    return d
  }

  private get columnWidth() {
    switch (this.scale) {
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

  private setScale(scale: GanttScale) {
    const ok = this.dispatchEvent(
      new CustomEvent('scale-change', { detail: { scale }, bubbles: true, composed: true, cancelable: true }),
    )
    if (ok) this.scale = scale
  }

  private emit(type: string, detail: Record<string, unknown>) {
    this.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }))
  }

  private onTaskClick(task: GanttTask) {
    this.emit('task-click', { task })
  }

  // --- context menu ----------------------------------------------------------------
  /** Right-click on a task row/bar picks the menu's task; anywhere else keeps the native menu. */
  private onBodyContextMenu(e: MouseEvent) {
    const el = e
      .composedPath()
      .find((n): n is HTMLElement => n instanceof HTMLElement && n.hasAttribute('data-task-id'))
    const task = el ? this.tasks.find((t) => t.id === el.getAttribute('data-task-id')) : undefined
    if (!task) {
      e.stopPropagation()
      return
    }
    this.menuTask = task
  }

  private copyTaskId(task: GanttTask) {
    if (typeof navigator !== 'undefined' && navigator.clipboard) navigator.clipboard.writeText(task.id)
  }

  private renderMenu() {
    const task = this.menuTask
    return html`<uip-context-menu-content>
      ${task
        ? html`<uip-context-menu-label part="task-label"
              ><span class="truncate font-semibold">${task.name}</span
              ><span class="text-muted-foreground font-mono text-xs">${task.id}</span></uip-context-menu-label
            >
            <uip-context-menu-separator></uip-context-menu-separator>
            <uip-context-menu-item @select=${() => this.emit('edit', { task })}
              >${icon(Edit2, 'pen-line', 'mr-2 size-3.5')}<span>View Details</span
              ><uip-context-menu-shortcut>↵</uip-context-menu-shortcut></uip-context-menu-item
            >
            <uip-context-menu-sub>
              <uip-context-menu-sub-trigger
                >${icon(Clock, 'clock', 'text-primary mr-2 size-3.5')}<span>Change Status</span></uip-context-menu-sub-trigger
              >
              <uip-context-menu-sub-content part="status-menu">
                <uip-context-menu-radio-group
                  value=${task.status ?? 'todo'}
                  @value-change=${(e: Event) => e.preventDefault()}
                >
                  ${statusItems.map(
                    (s) =>
                      html`<uip-context-menu-radio-item
                        value=${s.value}
                        @select=${() => this.emit('status-change', { task, status: s.value })}
                        ><span class=${s.dot}></span><span>${s.label}</span></uip-context-menu-radio-item
                      >`,
                  )}
                </uip-context-menu-radio-group>
              </uip-context-menu-sub-content>
            </uip-context-menu-sub>
            <uip-context-menu-sub>
              <uip-context-menu-sub-trigger
                >${icon(Flag, 'flag', 'mr-2 size-3.5 text-amber-500')}<span>Set Priority</span></uip-context-menu-sub-trigger
              >
              <uip-context-menu-sub-content part="priority-menu">
                <uip-context-menu-radio-group
                  value=${task.priority ?? 'medium'}
                  @value-change=${(e: Event) => e.preventDefault()}
                >
                  ${priorityItems.map(
                    (p) =>
                      html`<uip-context-menu-radio-item
                        value=${p.value}
                        @select=${() => this.emit('priority-change', { task, priority: p.value })}
                        >${icon(Flag, 'flag', p.flag)}<span>${p.label}</span></uip-context-menu-radio-item
                      >`,
                  )}
                </uip-context-menu-radio-group>
              </uip-context-menu-sub-content>
            </uip-context-menu-sub>
            <uip-context-menu-separator></uip-context-menu-separator>
            <uip-context-menu-item @select=${() => this.copyTaskId(task)}
              >${icon(Copy, 'copy', 'mr-2 size-3.5')}<span>Copy Task ID</span
              ><uip-context-menu-shortcut>⌘C</uip-context-menu-shortcut></uip-context-menu-item
            >
            <uip-context-menu-item @select=${() => this.emit('duplicate', { task })}
              >${icon(Layers, 'layers', 'mr-2 size-3.5')}<span>Duplicate</span
              ><uip-context-menu-shortcut>⌘D</uip-context-menu-shortcut></uip-context-menu-item
            >
            <uip-context-menu-separator></uip-context-menu-separator>
            <uip-context-menu-item
              class="text-destructive focus:text-destructive"
              @select=${() => this.emit('delete', { task })}
              >${icon(Trash2, 'trash-2', 'mr-2 size-3.5')}<span>Delete Deliverable</span
              ><uip-context-menu-shortcut>⌫</uip-context-menu-shortcut></uip-context-menu-item
            >`
        : nothing}
    </uip-context-menu-content>`
  }

  // --- GanttHeader -----------------------------------------------------------------
  private renderHeader() {
    const scales: [GanttScale, string][] = [
      ['day', 'Day'],
      ['week', 'Week'],
      ['month', 'Month'],
      ['year', 'Year'],
    ]
    return html`<div
      part="header"
      data-uipkge=""
      data-slot="gantt-header"
      class="border-border bg-muted/30 flex items-center justify-between border-b px-4 py-2.5"
    >
      <div class="flex items-center gap-2">
        ${icon(Calendar, 'calendar', 'text-primary size-4')}
        <span class="text-foreground text-sm font-semibold">${this.headerTitle}</span>
      </div>

      <div class="flex items-center gap-3">
        <slot name="actions"></slot>
        ${this.showScaleSwitcher
          ? html`<uip-button-group>
              ${scales.map(
                ([s, label]) =>
                  html`<uip-button
                    size="xs"
                    variant=${this.scale === s ? 'default' : 'outline'}
                    @click=${() => this.setScale(s)}
                    >${label}</uip-button
                  >`,
              )}
            </uip-button-group>`
          : nothing}
      </div>
    </div>`
  }

  // --- GanttTree -------------------------------------------------------------------
  private renderTree() {
    const tasks = this.tasks ?? []
    return html`<div
      part="tree"
      data-uipkge=""
      data-slot="gantt-tree"
      style=${styleMap({ width: `${this.treeWidth}px` })}
      class="border-border bg-card flex shrink-0 flex-col border-r transition-[width] select-none"
    >
      <div
        style=${styleMap({ height: `${this.headerHeight}px` })}
        class="border-border bg-muted/20 text-muted-foreground flex items-center justify-between border-b px-3 text-xs font-semibold tracking-wider uppercase"
      >
        <span class="flex-1 truncate">Deliverable</span>
        ${this.showPriority ? html`<span class="w-12 shrink-0 text-center">Pri</span>` : nothing}
        <span class="w-16 shrink-0 text-right">Duration</span>
      </div>

      <div class="divide-border/40 flex-1 divide-y overflow-y-auto">
        ${tasks.map(
          (task) => html`<div
            data-task-id=${task.id}
            style=${styleMap({ height: `${this.rowHeight}px` })}
            class=${cn(
              'group/row text-foreground hover:bg-muted/40 flex cursor-pointer items-center justify-between px-3 text-xs transition-colors',
              task.isGroup && 'bg-muted/10 font-semibold',
            )}
            @click=${() => this.onTaskClick(task)}
          >
            <div class="flex min-w-0 flex-1 items-center gap-1.5 pr-2">
              ${task.parentId ? html`<span class="w-4 shrink-0"></span>` : nothing}
              ${task.status
                ? html`<span
                    class=${cn(
                      'size-2 shrink-0 rounded-full',
                      task.status === 'done' && 'bg-emerald-500 ring-2 ring-emerald-500/20',
                      task.status === 'in-progress' && 'bg-primary ring-primary/20 ring-2',
                      task.status === 'at-risk' && 'bg-amber-500 ring-2 ring-amber-500/20',
                      task.status === 'todo' && 'bg-muted-foreground/40',
                      task.status === 'blocked' && 'bg-destructive ring-destructive/20 ring-2',
                    )}
                  ></span>`
                : nothing}
              <span class="truncate font-medium">${task.name}</span>
            </div>

            ${this.showPriority
              ? html`<div class="flex w-12 shrink-0 items-center justify-center">
                  ${task.priority ? icon(Flag, 'flag', cn('size-3', priorityColors[task.priority])) : nothing}
                </div>`
              : nothing}

            <div class="text-muted-foreground w-16 shrink-0 text-right font-mono text-xs">
              ${task.isMilestone
                ? html`<span class="text-xs font-semibold text-amber-500">Milestone</span>`
                : html`<span>${calculateDays(task.startDate, task.endDate)}</span>`}
            </div>
          </div>`,
        )}
      </div>
    </div>`
  }

  // --- GanttTimeline -----------------------------------------------------------------
  private taskCoordinates(task: GanttTask, index: number, start: number) {
    const taskStart = new Date(task.startDate).getTime()
    const taskEnd = new Date(task.endDate).getTime()
    const startDiffDays = Math.max(0, (taskStart - start) / ONE_DAY)
    const durationDays = Math.max(1, (taskEnd - taskStart) / ONE_DAY)
    const left = startDiffDays * this.columnWidth
    const width = durationDays * this.columnWidth
    const top = index * this.rowHeight + (this.rowHeight - 28) / 2
    return { left, width, top, height: 28 }
  }

  private renderBar(task: GanttTask, left: number, width: number, top: number, height: number) {
    if (task.isGroup) {
      return html`<div
        data-uipkge=""
        data-slot="gantt-group-bar"
        data-task-id=${task.id}
        style=${styleMap({
          left: `${left}px`,
          width: `${Math.max(24, width)}px`,
          top: `${top + 4}px`,
          height: `${height - 8}px`,
        })}
        class="group/bar bg-foreground/80 text-background hover:bg-foreground absolute z-10 flex cursor-pointer items-center justify-between rounded-xs px-2 text-xs font-semibold shadow-xs select-none"
        @click=${() => this.onTaskClick(task)}
      >
        <span class="truncate">${task.name}</span>
        ${task.progress != null ? html`<span class="font-mono text-xs opacity-80">${task.progress}%</span>` : nothing}
      </div>`
    }
    return html`<div
      data-uipkge=""
      data-slot="gantt-bar"
      data-task-id=${task.id}
      style=${styleMap({ left: `${left}px`, width: `${Math.max(24, width)}px`, top: `${top}px`, height: `${height}px` })}
      class=${cn(
        'group/bar absolute z-10 flex cursor-pointer items-center overflow-hidden rounded-md border text-xs font-medium shadow-xs transition-[box-shadow,transform] select-none hover:scale-[1.01] hover:shadow-md',
        task.color ? task.color : statusColors[task.status ?? 'in-progress'],
      )}
      @click=${() => this.onTaskClick(task)}
    >
      ${task.progress != null && task.progress > 0
        ? html`<div
            style=${styleMap({ width: `${task.progress}%` })}
            class=${cn('absolute inset-y-0 left-0 transition-[left]', progressColors[task.status ?? 'in-progress'])}
          ></div>`
        : nothing}

      <div class="relative z-10 flex w-full min-w-0 items-center justify-between px-2">
        <span class="truncate font-medium">${task.name}</span>
        ${task.progress != null
          ? html`<span class="ml-1 shrink-0 font-mono text-xs opacity-80">${task.progress}%</span>`
          : nothing}
      </div>

      <div
        aria-hidden="true"
        class="bg-foreground/20 absolute inset-y-0 left-0 w-1.5 cursor-ew-resize opacity-0 transition-opacity group-hover/bar:opacity-100"
      ></div>
      <div
        aria-hidden="true"
        class="bg-foreground/20 absolute inset-y-0 right-0 w-1.5 cursor-ew-resize opacity-0 transition-opacity group-hover/bar:opacity-100"
      ></div>
    </div>`
  }

  private renderMilestone(task: GanttTask, left: number, top: number, size = 16) {
    return html`<div
      data-uipkge=""
      data-slot="gantt-milestone"
      data-task-id=${task.id}
      style=${styleMap({
        left: `${left - size / 2}px`,
        top: `${top - size / 2}px`,
        width: `${size}px`,
        height: `${size}px`,
      })}
      title=${`${task.name} (${task.startDate})`}
      class="border-primary bg-primary absolute z-20 rotate-45 cursor-pointer rounded-xs border-2 shadow-sm transition-transform hover:scale-125"
      @click=${() => this.onTaskClick(task)}
    ></div>`
  }

  private renderTimeline() {
    const tasks = this.tasks ?? []
    const startDate = this.resolvedStartDate
    const endDate = this.resolvedEndDate
    const totalDays = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / ONE_DAY))
    const columnWidth = this.columnWidth
    const rowHeight = this.rowHeight
    const start = startDate.getTime()

    const columns: { label: string; subLabel: string; isWeekend: boolean }[] = []
    for (let i = 0; i < totalDays; i++) {
      const d = new Date(startDate)
      d.setDate(d.getDate() + i)
      const dayOfWeek = d.getDay()
      columns.push({
        label: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        subLabel: d.toLocaleDateString(undefined, { weekday: 'narrow' }),
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      })
    }
    const timelineWidth = columns.length * columnWidth

    const diffDays = (new Date().setHours(0, 0, 0, 0) - start) / ONE_DAY
    const todayPosition = diffDays < 0 || diffDays > totalDays ? null : diffDays * columnWidth + columnWidth / 2

    const paths: string[] = []
    if (this.showDependencies) {
      const taskMap = new Map<string, { task: GanttTask; index: number }>()
      tasks.forEach((t, i) => taskMap.set(t.id, { task: t, index: i }))
      tasks.forEach((toTask, toIdx) => {
        toTask.dependencies?.forEach((fromId) => {
          const fromEntry = taskMap.get(fromId)
          if (!fromEntry) return
          const fromCoords = this.taskCoordinates(fromEntry.task, fromEntry.index, start)
          const toCoords = this.taskCoordinates(toTask, toIdx, start)
          const startX = fromEntry.task.isMilestone ? fromCoords.left : fromCoords.left + fromCoords.width
          const startY = fromCoords.top + 14
          const endX = toCoords.left
          const endY = toCoords.top + 14
          const deltaX = Math.max(16, (endX - startX) / 2)
          paths.push(`M ${startX} ${startY} C ${startX + deltaX} ${startY}, ${endX - deltaX} ${endY}, ${endX} ${endY}`)
        })
      })
    }

    return html`<div
      part="timeline"
      data-uipkge=""
      data-slot="gantt-timeline"
      class="bg-background relative flex-1 overflow-x-auto overflow-y-hidden select-none"
    >
      <div style=${styleMap({ width: `${timelineWidth}px` })} class="relative">
        <div
          style=${styleMap({ height: `${this.headerHeight}px` })}
          class="border-border bg-muted/10 sticky top-0 z-20 flex border-b"
        >
          ${columns.map(
            (col) => html`<div
              style=${styleMap({ width: `${columnWidth}px` })}
              class=${cn(
                'border-border/50 text-muted-foreground flex flex-col items-center justify-center border-r text-xs',
                col.isWeekend && 'bg-muted/20 text-muted-foreground/60',
              )}
            >
              <span class="text-foreground font-medium">${col.label}</span>
              <span class="text-xs">${col.subLabel}</span>
            </div>`,
          )}
        </div>

        <div class="relative">
          <div class="pointer-events-none absolute inset-0 flex">
            ${columns.map(
              (col) => html`<div
                style=${styleMap({ width: `${columnWidth}px` })}
                class=${cn('border-border/30 h-full border-r', col.isWeekend && 'bg-muted/15')}
              ></div>`,
            )}
          </div>

          ${this.showTodayLine && todayPosition != null
            ? html`<div
                style=${styleMap({ left: `${todayPosition}px` })}
                class="pointer-events-none absolute inset-y-0 z-30 flex flex-col items-center"
              >
                <div
                  class="bg-destructive text-destructive-foreground rounded-full px-1.5 py-0.5 text-xs font-bold shadow-xs"
                >
                  Today
                </div>
                <div class="bg-destructive/60 h-full w-[1.5px] border-r border-dashed"></div>
              </div>`
            : nothing}
          ${paths.length > 0
            ? html`<svg
                width=${timelineWidth}
                height=${tasks.length * rowHeight}
                class="pointer-events-none absolute inset-0 z-10"
              >
                <defs>
                  <marker
                    id="gantt-arrow"
                    viewBox="0 0 6 6"
                    refX="5"
                    refY="3"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto"
                  >
                    <path d="M 0 0 L 6 3 L 0 6 z" class="fill-primary/60"></path>
                  </marker>
                </defs>
                ${paths.map(
                  (d) =>
                    svg`<path d=${d} fill="none" class="stroke-primary/50" stroke-width="1.5" stroke-dasharray="3,3" marker-end="url(#gantt-arrow)"></path>`,
                )}
              </svg>`
            : nothing}
          ${tasks.map((task, idx) => {
            const coords = this.taskCoordinates(task, idx, start)
            return html`<div
              style=${styleMap({ height: `${rowHeight}px` })}
              class="border-border/40 hover:bg-muted/10 relative border-b transition-colors"
            >
              ${task.isMilestone
                ? this.renderMilestone(task, coords.left, rowHeight / 2)
                : this.renderBar(task, coords.left, coords.width, (coords.height - 28) / 2 + 6, 28)}
            </div>`
          })}
        </div>
      </div>
    </div>`
  }

  render() {
    const body = html`<div
      part="body"
      slot=${this.contextMenu ? 'trigger' : nothing}
      class="flex min-h-0 flex-1 overflow-hidden"
      @contextmenu=${this.contextMenu ? this.onBodyContextMenu : nothing}
    >
      ${this.renderTree()}${this.renderTimeline()}
    </div>`

    return html`<div
      part="base"
      class="border-border bg-card text-card-foreground relative flex w-full flex-col overflow-hidden rounded-xl border shadow-xs"
    >
      ${this.renderHeader()}
      ${this.contextMenu ? html`<uip-context-menu
            class="[&::part(content)]:w-56 [&::part(task-label)]:flex [&::part(task-label)]:items-center [&::part(task-label)]:justify-between [&::part(task-label)]:text-xs [&::part(status-menu)]:w-44 [&::part(priority-menu)]:w-40"
            >${body}${this.renderMenu()}</uip-context-menu
          >` : body}
    </div>`
  }
}

customElements.get('uip-gantt') || customElements.define('uip-gantt', UipGantt)

declare global {
  interface HTMLElementTagNameMap {
    'uip-gantt': UipGantt
  }
}
