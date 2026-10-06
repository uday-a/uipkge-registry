import {
  Component,
  Directive,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
  ViewEncapsulation,
  booleanAttribute,
  forwardRef,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'
import { UiRenderTemplateDirective } from '@/ui/popper/popper'
import { organizationChartVariants, type OrganizationChartVariants } from './organization-chart.variants'
import type { OrgNode } from './types'

export type OrgChartDirection = 'top-down' | 'left-right'
export interface OrgNodeContext {
  $implicit: OrgNode
  node: OrgNode
}
export interface OrgChartToggleEvent {
  node: OrgNode
  expanded: boolean
}

/* Connector lines, verbatim from React's organization-chart.css. */
const ORG_CHART_CSS = `
/* ══ Vertical (top-down) layout ══ */
.org-v {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Vertical line from horizontal bar up to each child card */
.org-v:not([data-root]) .org-v-card {
  position: relative;
  padding-top: 20px;
}
.org-v:not([data-root]) .org-v-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  width: 1px;
  height: 20px;
  background: var(--color-border, hsl(var(--border)));
}

.org-v-children {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Vertical line from parent down to the sibling bar */
.org-v-line-down {
  width: 1px;
  height: 20px;
  background: var(--color-border, hsl(var(--border)));
}

.org-v-children-row {
  display: flex;
  flex-direction: row;
  gap: 24px;
  position: relative;
  padding-top: 20px;
}

/* Horizontal bar: spans from the center of the first child to the center
   of the last child. We use a full-width bar with the first/last child
   vertical lines connecting to it. The bar itself is positioned using
   the half-width of the first and last cards (w-52 = 208px, half = 104px). */
.org-v-line-across {
  position: absolute;
  top: 0;
  left: 104px; /* half of w-52 (208px) — center of first child */
  right: 104px; /* half of w-52 — center of last child */
  height: 1px;
  background: var(--color-border, hsl(var(--border)));
}

/* When single child, no horizontal bar needed — just the vertical line */
.org-v-children-row[data-single] .org-v-line-across {
  display: none;
}

/* ══ Horizontal (left-right) layout ══ */
.org-h {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Horizontal line from parent to children column */
.org-h-line-right {
  width: 20px;
  height: 1px;
  background: var(--color-border, hsl(var(--border)));
  margin-top: 40px;
  flex-shrink: 0;
}

.org-h-children {
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
}

/* Vertical line connecting siblings in horizontal mode */
.org-h-children::before {
  content: '';
  position: absolute;
  left: 0;
  top: 40px;
  bottom: 40px;
  width: 1px;
  background: var(--color-border, hsl(var(--border)));
}

/* Horizontal line from vertical bar to each child */
.org-h:not([data-root]) .org-h-card {
  position: relative;
  padding-left: 20px;
}
.org-h:not([data-root]) .org-h-card::before {
  content: '';
  position: absolute;
  top: 40px;
  left: 0;
  width: 20px;
  height: 1px;
  background: var(--color-border, hsl(var(--border)));
}
`

function collectIds(node: OrgNode, acc: string[] = []): string[] {
  acc.push(node.id)
  if (node.children) for (const c of node.children) collectIds(c, acc)
  return acc
}

function initials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

/** Renders the `renderNode` template with the node as context. */
@Directive({ selector: '[uiOrgChartNodeOutlet]', standalone: true })
export class UiOrgChartNodeOutletDirective implements OnChanges, OnDestroy {
  @Input('uiOrgChartNodeOutlet') template: TemplateRef<OrgNodeContext> | null | undefined = null
  @Input('uiOrgChartNodeOutletNode') node!: OrgNode
  private readonly vcr = inject(ViewContainerRef)

  ngOnChanges(): void {
    this.vcr.clear()
    if (this.template) this.vcr.createEmbeddedView(this.template, { $implicit: this.node, node: this.node })
  }

  ngOnDestroy(): void {
    this.vcr.clear()
  }
}

/**
 * One node of the chart (React OrgChartNode): the card (role=button, Enter / Space
 * activate), avatar or initials, an expand toggle, and its children, recursively, with
 * the `org-v-*` / `org-h-*` connector classes. Put it on a <div> for React's DOM.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-org-chart-node, [ui-org-chart-node]',
  standalone: true,
  imports: [forwardRef(() => UiOrgChartNodeComponent), UiRenderTemplateDirective, UiOrgChartNodeOutletDirective],
  host: {
    '[class]': 'isHorizontal ? "org-h" : "org-v"',
    '[attr.data-root]': 'isRoot ? "" : null',
  },
  template: `
    <ng-template #card>
      <div
        role="button"
        tabindex="0"
        [attr.aria-label]="cardLabel"
        [class]="cardClass"
        (click)="onClick()"
        (keydown)="onCardKeyDown($event)"
      >
        <div class="flex items-center gap-2.5">
          @if (current?.avatar) {
            <img
              [src]="node.avatar"
              [alt]="node.name"
              class="border-border size-10 shrink-0 rounded-full border object-cover"
            />
          } @else {
            <div
              class="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
              aria-hidden="true"
            >
              {{ initials }}
            </div>
          }
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-semibold">{{ current?.name }}</p>
            @if (current?.title) {
              <p class="text-muted-foreground truncate text-xs">{{ node.title }}</p>
            }
          </div>
          @if (hasChildren) {
            <button
              type="button"
              class="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex size-5 shrink-0 items-center justify-center rounded"
              [attr.aria-expanded]="open"
              [attr.aria-label]="open ? 'Collapse' : 'Expand'"
              (click)="onToggle($event)"
            >
              @if (open) {
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
                  class="lucide lucide-chevron-down size-3.5"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              } @else {
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
                  class="lucide lucide-chevron-right size-3.5"
                  aria-hidden="true"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              }
            </button>
          }
        </div>
        <ng-container [uiOrgChartNodeOutlet]="renderNode" [uiOrgChartNodeOutletNode]="node" />
      </div>
    </ng-template>

    @if (!isHorizontal) {
      <div class="org-v-card"><ng-container [uiRenderTemplate]="card" /></div>
      @if (hasChildren && open) {
        <div class="org-v-children">
          @if (showConnectors) {
            <div class="org-v-line-down"></div>
          }
          <div class="org-v-children-row" [attr.data-single]="isOnlyChild ? '' : null">
            @if (showConnectors && !isOnlyChild) {
              <div class="org-v-line-across"></div>
            }
            @for (child of current?.children; track child.id) {
              <div
                ui-org-chart-node
                [node]="child"
                [depth]="depth + 1"
                [direction]="direction"
                [showConnectors]="showConnectors"
                [isExpanded]="isExpanded"
                [toggle]="toggle"
                [renderNode]="renderNode"
                (nodeClick)="nodeClick.emit($event)"
              ></div>
            }
          </div>
        </div>
      }
    } @else {
      <div class="flex items-start">
        <div class="org-h-card"><ng-container [uiRenderTemplate]="card" /></div>
        @if (hasChildren && open) {
          @if (showConnectors) {
            <div class="org-h-line-right"></div>
          }
          <div class="org-h-children">
            @for (child of current?.children; track child.id) {
              <div
                ui-org-chart-node
                [node]="child"
                [depth]="depth + 1"
                [direction]="direction"
                [showConnectors]="showConnectors"
                [isExpanded]="isExpanded"
                [toggle]="toggle"
                [renderNode]="renderNode"
                (nodeClick)="nodeClick.emit($event)"
              ></div>
            }
          </div>
        }
      </div>
    }
  `,
})
export class UiOrgChartNodeComponent {
  @Input({ required: true }) node!: OrgNode
  /** `node` may still be unset on first render; the template reads it through this. */
  get current(): OrgNode | undefined {
    return this.node
  }
  @Input() depth = 0
  @Input({ transform: booleanAttribute }) isRoot = false
  @Input() direction: OrgChartDirection = 'top-down'
  @Input({ transform: booleanAttribute }) showConnectors = true
  @Input() isExpanded: (node: OrgNode) => boolean = () => true
  @Input() toggle: (node: OrgNode) => void = () => {}
  @Input() renderNode?: TemplateRef<OrgNodeContext> | null
  /** React `onNodeClick`. */
  @Output() nodeClick = new EventEmitter<OrgNode>()

  get open(): boolean {
    return this.node ? this.isExpanded(this.node) : false
  }
  get hasChildren(): boolean {
    return !!this.node?.children?.length
  }
  get isHorizontal(): boolean {
    return this.direction === 'left-right'
  }
  get isOnlyChild(): boolean {
    return (this.node?.children?.length ?? 0) <= 1
  }
  get initials(): string {
    return this.node ? initials(this.node.name) : ''
  }
  get cardLabel(): string {
    if (!this.node) return ''
    return this.node.title ? `${this.node.name}, ${this.node.title}` : this.node.name
  }
  get cardClass(): string {
    return cn(
      'group relative flex w-52 cursor-pointer flex-col rounded-lg border p-3 shadow-xs transition-colors',
      'border-border bg-card hover:bg-accent/50 focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
      this.isRoot && 'ring-2 ring-primary/20',
    )
  }

  onClick(): void {
    this.nodeClick.emit(this.node)
  }

  onToggle(event: MouseEvent): void {
    event.stopPropagation()
    if (this.hasChildren) this.toggle(this.node)
  }

  onCardKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      this.onClick()
    }
  }
}

/**
 * Angular port of UIPKGE OrganizationChart (React parity): renders the `data` tree
 * top-down or left-right with connector lines, expand / collapse per branch (all
 * expanded, or only the root with `defaultExpanded=false`), an optional zoom +
 * expand/collapse-all toolbar, `nodeClick` / `toggle` outputs, and a `renderNode`
 * template (`<ng-template let-node>`) rendered inside each card. `expandAll`,
 * `collapseAll`, `zoomIn`, `zoomOut` and `resetZoom` are public (React's ref handle).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-organization-chart, [ui-organization-chart]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  styles: [ORG_CHART_CSS],
  imports: [UiOrgChartNodeComponent],
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"organization-chart"',
    '[attr.data-direction]': 'direction',
    '[class]': 'hostClass',
  },
  template: `
    @if (zoomable) {
      <div class="border-border flex items-center gap-2 border-b px-3 py-2">
        <button
          type="button"
          class="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex size-7 items-center justify-center rounded-md text-sm"
          aria-label="Zoom out"
          (click)="zoomOut()"
        >
          −
        </button>
        <span class="text-muted-foreground w-12 text-center text-xs tabular-nums">{{ zoomPercent }}%</span>
        <button
          type="button"
          class="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex size-7 items-center justify-center rounded-md text-sm"
          aria-label="Zoom in"
          (click)="zoomIn()"
        >
          +
        </button>
        <button
          type="button"
          class="text-muted-foreground hover:text-foreground hover:bg-accent ml-1 rounded-md px-2 py-1 text-xs"
          aria-label="Reset zoom"
          (click)="resetZoom()"
        >
          Reset
        </button>
        <div class="ml-auto flex gap-1">
          <button
            type="button"
            class="text-muted-foreground hover:text-foreground hover:bg-accent rounded-md px-2 py-1 text-xs"
            aria-label="Expand all"
            (click)="expandAll()"
          >
            Expand all
          </button>
          <button
            type="button"
            class="text-muted-foreground hover:text-foreground hover:bg-accent rounded-md px-2 py-1 text-xs"
            aria-label="Collapse all"
            (click)="collapseAll()"
          >
            Collapse all
          </button>
        </div>
      </div>
    }
    <div class="overflow-auto p-4">
      <div [style.transform]="'scale(' + zoom() + ')'" class="origin-top transition-transform duration-200">
        @if (data) {
          <div
            ui-org-chart-node
            [node]="data"
            [depth]="0"
            [isRoot]="true"
            [direction]="direction"
            [showConnectors]="showConnectors"
            [isExpanded]="isExpandedFn"
            [toggle]="toggleFn"
            [renderNode]="renderNode"
            (nodeClick)="nodeClick.emit($event)"
          ></div>
        }
      </div>
    </div>
  `,
})
export class UiOrganizationChartComponent implements OnChanges {
  @Input({ required: true }) data!: OrgNode
  @Input() direction: OrgChartDirection = 'top-down'
  @Input({ transform: booleanAttribute }) defaultExpanded = true
  @Input({ transform: booleanAttribute }) showConnectors = true
  @Input({ transform: booleanAttribute }) zoomable = false
  /** Rendered inside each card below the name (React `renderNode`). */
  @Input() renderNode?: TemplateRef<OrgNodeContext> | null
  @Input('class') className?: string
  /** React `onNodeClick`. */
  @Output() nodeClick = new EventEmitter<OrgNode>()
  /** React `onToggle(node, expanded)`. */
  @Output() toggle = new EventEmitter<OrgChartToggleEvent>()

  readonly expanded = signal<Set<string>>(new Set())
  readonly zoom = signal(1)

  readonly isExpandedFn = (node: OrgNode): boolean => this.expanded().has(node.id)
  readonly toggleFn = (node: OrgNode): void => this.toggleNode(node)

  get hostClass(): string {
    return cn('block', organizationChartVariants(), this.className)
  }

  get zoomPercent(): number {
    return Math.round(this.zoom() * 100)
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Re-sync expanded state when data or defaultExpanded changes.
    if (changes['data'] || changes['defaultExpanded']) this.resetToDefault()
  }

  private resetToDefault(): void {
    if (!this.data) return
    this.expanded.set(this.defaultExpanded ? new Set(collectIds(this.data)) : new Set([this.data.id]))
  }

  toggleNode(node: OrgNode): void {
    const next = new Set(this.expanded())
    if (next.has(node.id)) next.delete(node.id)
    else next.add(node.id)
    this.expanded.set(next)
    this.toggle.emit({ node, expanded: next.has(node.id) })
  }

  expandAll(): void {
    this.expanded.set(new Set(collectIds(this.data)))
  }

  collapseAll(): void {
    this.expanded.set(new Set([this.data.id]))
  }

  zoomIn(): void {
    this.zoom.update((z) => Math.min(2, z + 0.1))
  }

  zoomOut(): void {
    this.zoom.update((z) => Math.max(0.5, z - 0.1))
  }

  resetZoom(): void {
    this.zoom.set(1)
  }
}

export { organizationChartVariants, type OrganizationChartVariants, type OrgNode }
