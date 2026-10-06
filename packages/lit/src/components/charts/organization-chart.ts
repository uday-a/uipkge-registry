import { LitElement, css, html, type PropertyValues } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { ChevronDown, ChevronRight } from 'lucide'
import { cva, type VariantProps } from 'class-variance-authority'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { icon } from '../../lib/icon'
import { cn } from '../../lib/utils'
import { defaultTrue } from './lib/chart-element'

// Variants (verbatim copy of React's organization-chart.variants.ts; inlined
// because charts/ items ship as one flat file).
export const organizationChartVariants = cva('bg-background rounded-lg border')

export type OrganizationChartVariants = VariantProps<typeof organizationChartVariants>

// Connector CSS (verbatim copy of React's organization-chart.css; inlined
// because charts/ items ship as one flat file — the one allowed extra-CSS
// exception beyond :host display, same as React-injected keyframes).
const orgConnectors = css`
  .org-v {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
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
  .org-v-line-across {
    position: absolute;
    top: 0;
    left: 104px;
    right: 104px;
    height: 1px;
    background: var(--color-border, hsl(var(--border)));
  }
  .org-v-children-row[data-single] .org-v-line-across {
    display: none;
  }
  .org-h {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
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
  .org-h-children::before {
    content: '';
    position: absolute;
    left: 0;
    top: 40px;
    bottom: 40px;
    width: 1px;
    background: var(--color-border, hsl(var(--border)));
  }
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

export interface OrgNode {
  id: string
  name: string
  title?: string
  avatar?: string
  department?: string
  children?: OrgNode[]
  [key: string]: unknown
}

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

/**
 * <uip-organization-chart> — the registry OrganizationChart (React
 * `OrganizationChart` + `OrgChartNode`) as a web component. Same cards,
 * connectors, directions, zoom toolbar and expand/collapse as React.
 *
 * Properties (React props): `data` (the root OrgNode; property or JSON
 * attribute), `direction` ('top-down' | 'left-right'; default 'top-down'),
 * `default-expanded` (default true; `default-expanded="false"` starts
 * collapsed), `show-connectors` (default true;
 * `show-connectors="false"` hides them), `zoomable` (default false),
 * `render-node` (property only — (node) => TemplateResult, React's
 * `renderNode`). React's `className` → host classes.
 *
 * Events: `node-click` (detail: the OrgNode — React's `onNodeClick`),
 * `toggle` (detail: { node, expanded } — React's `onToggle`).
 *
 * Methods (React's OrganizationChartHandle): `expandAll()`, `collapseAll()`,
 * `zoomIn()`, `zoomOut()`, `resetZoom()`.
 */
export class UipOrganizationChart extends LitElement {
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, orgConnectors, css`:host { display: block; }`]

  static properties = {
    data: { type: Object },
    direction: {},
    defaultExpanded: { attribute: 'default-expanded', converter: defaultTrue },
    showConnectors: { attribute: 'show-connectors', converter: defaultTrue },
    zoomable: { type: Boolean },
    renderNode: { attribute: false },
    expanded: { state: true },
    zoom: { state: true },
  }

  data?: OrgNode
  direction: 'top-down' | 'left-right' = 'top-down'
  defaultExpanded = true
  showConnectors = true
  zoomable = false
  renderNode?: (node: OrgNode) => unknown
  private expanded: Set<string> = new Set()
  private zoom = 1

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'organization-chart')
  }

  protected willUpdate(changed: PropertyValues) {
    // React re-syncs the expanded set whenever data or defaultExpanded changes.
    if ((changed.has('data') || changed.has('defaultExpanded')) && this.data) {
      if (this.defaultExpanded) {
        this.expanded = new Set(collectIds(this.data))
      } else {
        this.expanded = new Set([this.data.id])
      }
    }
  }

  private toggleNode(node: OrgNode) {
    const next = new Set(this.expanded)
    if (next.has(node.id)) next.delete(node.id)
    else next.add(node.id)
    this.expanded = next
    this.dispatchEvent(
      new CustomEvent('toggle', { detail: { node, expanded: next.has(node.id) }, bubbles: true, composed: true }),
    )
  }

  private isExpanded(node: OrgNode): boolean {
    return this.expanded.has(node.id)
  }

  expandAll() {
    if (this.data) this.expanded = new Set(collectIds(this.data))
  }

  collapseAll() {
    if (this.data) this.expanded = new Set([this.data.id])
  }

  zoomIn() {
    this.zoom = Math.min(2, this.zoom + 0.1)
  }

  zoomOut() {
    this.zoom = Math.max(0.5, this.zoom - 0.1)
  }

  resetZoom() {
    this.zoom = 1
  }

  private nodeCard(node: OrgNode, isRoot: boolean): unknown {
    const open = this.isExpanded(node)
    const hasChildren = !!node.children?.length
    const cardClass = cn(
      'group relative flex w-52 cursor-pointer flex-col rounded-lg border p-3 shadow-xs transition-colors',
      'border-border bg-card hover:bg-accent/50 focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
      isRoot && 'ring-2 ring-primary/20',
    )
    const cardLabel = node.title ? `${node.name}, ${node.title}` : node.name
    return html`<div
      role="button"
      tabindex="0"
      aria-label=${cardLabel}
      class=${cardClass}
      @click=${() => this.dispatchEvent(new CustomEvent('node-click', { detail: node, bubbles: true, composed: true }))}
      @keydown=${(e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          this.dispatchEvent(new CustomEvent('node-click', { detail: node, bubbles: true, composed: true }))
        }
      }}
    >
      <div class="flex items-center gap-2.5">
        ${node.avatar
          ? html`<img src=${node.avatar} alt=${node.name} class="border-border size-10 shrink-0 rounded-full border object-cover" />`
          : html`<div
              class="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
              aria-hidden="true"
            >
              ${initials(node.name)}
            </div>`}
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-semibold">${node.name}</p>
          ${node.title ? html`<p class="text-muted-foreground truncate text-xs">${node.title}</p>` : null}
        </div>
        ${hasChildren
          ? html`<button
              type="button"
              class="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex size-5 shrink-0 items-center justify-center rounded"
              aria-expanded=${String(open)}
              aria-label=${open ? 'Collapse' : 'Expand'}
              @click=${(e: Event) => {
                e.stopPropagation()
                this.toggleNode(node)
              }}
            >
              ${open ? icon(ChevronDown, 'chevron-down', 'size-3.5') : icon(ChevronRight, 'chevron-right', 'size-3.5')}
            </button>`
          : null}
      </div>
      ${this.renderNode?.(node)}
    </div>`
  }

  private orgNode(node: OrgNode, depth: number, isRoot: boolean): unknown {
    const open = this.isExpanded(node)
    const hasChildren = !!node.children?.length
    const isHorizontal = this.direction === 'left-right'
    const childCount = node.children?.length ?? 0
    const isOnlyChild = childCount <= 1

    if (!isHorizontal) {
      return html`<div class="org-v" data-root=${isRoot ? '' : null}>
        <div class="org-v-card">${this.nodeCard(node, isRoot)}</div>
        ${hasChildren && open
          ? html`<div class="org-v-children">
              ${this.showConnectors ? html`<div class="org-v-line-down"></div>` : null}
              <div class="org-v-children-row" data-single=${isOnlyChild ? '' : null}>
                ${this.showConnectors && !isOnlyChild ? html`<div class="org-v-line-across"></div>` : null}
                ${(node.children ?? []).map((child) => this.orgNode(child, depth + 1, false))}
              </div>
            </div>`
          : null}
      </div>`
    }

    return html`<div class="org-h" data-root=${isRoot ? '' : null}>
      <div class="flex items-start">
        <div class="org-h-card">${this.nodeCard(node, isRoot)}</div>
        ${hasChildren && open
          ? html`${this.showConnectors ? html`<div class="org-h-line-right"></div>` : null}
              <div class="org-h-children">
                ${(node.children ?? []).map((child) => this.orgNode(child, depth + 1, false))}
              </div>`
          : null}
      </div>
    </div>`
  }

  render() {
    if (!this.data) return html``
    return html`<div part="base" data-direction=${this.direction} class=${cn(organizationChartVariants())}>
      ${this.zoomable
        ? html`<div class="border-border flex items-center gap-2 border-b px-3 py-2">
            <button
              type="button"
              class="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex size-7 items-center justify-center rounded-md text-sm"
              aria-label="Zoom out"
              @click=${this.zoomOut}
            >
              −
            </button>
            <span class="text-muted-foreground w-12 text-center text-xs tabular-nums">${Math.round(this.zoom * 100)}%</span>
            <button
              type="button"
              class="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex size-7 items-center justify-center rounded-md text-sm"
              aria-label="Zoom in"
              @click=${this.zoomIn}
            >
              +
            </button>
            <button
              type="button"
              class="text-muted-foreground hover:text-foreground hover:bg-accent ml-1 rounded-md px-2 py-1 text-xs"
              aria-label="Reset zoom"
              @click=${this.resetZoom}
            >
              Reset
            </button>
            <div class="ml-auto flex gap-1">
              <button
                type="button"
                class="text-muted-foreground hover:text-foreground hover:bg-accent rounded-md px-2 py-1 text-xs"
                aria-label="Expand all"
                @click=${this.expandAll}
              >
                Expand all
              </button>
              <button
                type="button"
                class="text-muted-foreground hover:text-foreground hover:bg-accent rounded-md px-2 py-1 text-xs"
                aria-label="Collapse all"
                @click=${this.collapseAll}
              >
                Collapse all
              </button>
            </div>
          </div>`
        : null}
      <div class="overflow-auto p-4">
        <div
          style=${styleMap({ transform: `scale(${this.zoom})`, transformOrigin: 'top center' })}
          class="transition-transform duration-200"
        >
          ${this.orgNode(this.data, 0, true)}
        </div>
      </div>
    </div>`
  }
}

customElements.get('uip-organization-chart') || customElements.define('uip-organization-chart', UipOrganizationChart)

declare global {
  interface HTMLElementTagNameMap {
    'uip-organization-chart': UipOrganizationChart
  }
}
