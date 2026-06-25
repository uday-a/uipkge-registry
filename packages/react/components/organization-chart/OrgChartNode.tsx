import * as React from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { OrgNode } from './types'

export interface OrgChartNodeProps {
  node: OrgNode
  depth: number
  isRoot?: boolean
  direction?: 'top-down' | 'left-right'
  showConnectors?: boolean
  isExpanded: (node: OrgNode) => boolean
  toggle: (node: OrgNode) => void
  onNodeClick?: (node: OrgNode) => void
  renderNode?: (node: OrgNode) => React.ReactNode
}

function initials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

const OrgChartNode = React.forwardRef<HTMLDivElement, OrgChartNodeProps>(
  (
    {
      node,
      depth,
      isRoot = false,
      direction = 'top-down',
      showConnectors = true,
      isExpanded,
      toggle,
      onNodeClick,
      renderNode,
    },
    ref,
  ) => {
    const open = isExpanded(node)
    const hasChildren = !!node.children?.length
    const isHorizontal = direction === 'left-right'
    const childCount = node.children?.length ?? 0
    const isOnlyChild = childCount <= 1

    function onClick() {
      onNodeClick?.(node)
    }

    function onToggle(e: React.MouseEvent) {
      e.stopPropagation()
      if (hasChildren) toggle(node)
    }

    function onCardKeyDown(e: React.KeyboardEvent) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onClick()
      }
    }

    const cardClass = cn(
      'group relative flex w-52 cursor-pointer flex-col rounded-lg border p-3 shadow-xs transition-colors',
      'border-border bg-card hover:bg-accent/50 focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
      isRoot && 'ring-2 ring-primary/20',
    )

    const cardLabel = node.title ? `${node.name}, ${node.title}` : node.name

    const avatarBlock = (
      <>
        {node.avatar ? (
          <img
            src={node.avatar}
            alt={node.name}
            className="border-border size-10 shrink-0 rounded-full border object-cover"
          />
        ) : (
          <div
            className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
            aria-hidden="true"
          >
            {initials(node.name)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{node.name}</p>
          {node.title && <p className="text-muted-foreground truncate text-xs">{node.title}</p>}
        </div>
        {hasChildren && (
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex size-5 shrink-0 items-center justify-center rounded"
            aria-expanded={open}
            aria-label={open ? 'Collapse' : 'Expand'}
            onClick={onToggle}
          >
            {open ? (
              <ChevronDown className="size-3.5" aria-hidden="true" />
            ) : (
              <ChevronRight className="size-3.5" aria-hidden="true" />
            )}
          </button>
        )}
      </>
    )

    // ══ Top-down (vertical) layout ══
    if (!isHorizontal) {
      return (
        <div ref={ref} className="org-v" data-root={isRoot ? '' : undefined}>
          {/* Node card */}
          <div className="org-v-card">
            <div
              role="button"
              tabIndex={0}
              aria-label={cardLabel}
              className={cardClass}
              onClick={onClick}
              onKeyDown={onCardKeyDown}
            >
              <div className="flex items-center gap-2.5">{avatarBlock}</div>
              {renderNode?.(node)}
            </div>
          </div>

          {/* Children */}
          {hasChildren && open && (
            <div className="org-v-children">
              {showConnectors && <div className="org-v-line-down" />}
              <div className="org-v-children-row" data-single={isOnlyChild ? '' : undefined}>
                {showConnectors && !isOnlyChild && <div className="org-v-line-across" />}
                {node.children!.map((child) => (
                  <OrgChartNode
                    key={child.id}
                    node={child}
                    depth={depth + 1}
                    isRoot={false}
                    direction={direction}
                    showConnectors={showConnectors}
                    isExpanded={isExpanded}
                    toggle={toggle}
                    onNodeClick={onNodeClick}
                    renderNode={renderNode}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )
    }

    // ══ Left-right (horizontal) layout ══
    return (
      <div ref={ref} className="org-h" data-root={isRoot ? '' : undefined}>
        <div className="flex items-start">
          {/* Node card */}
          <div className="org-h-card">
            <div
              role="button"
              tabIndex={0}
              aria-label={cardLabel}
              className={cardClass}
              onClick={onClick}
              onKeyDown={onCardKeyDown}
            >
              <div className="flex items-center gap-2.5">{avatarBlock}</div>
              {renderNode?.(node)}
            </div>
          </div>

          {/* Children */}
          {hasChildren && open && (
            <>
              {showConnectors && <div className="org-h-line-right" />}
              <div className="org-h-children">
                {node.children!.map((child) => (
                  <OrgChartNode
                    key={child.id}
                    node={child}
                    depth={depth + 1}
                    isRoot={false}
                    direction={direction}
                    showConnectors={showConnectors}
                    isExpanded={isExpanded}
                    toggle={toggle}
                    onNodeClick={onNodeClick}
                    renderNode={renderNode}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    )
  },
)
OrgChartNode.displayName = 'OrgChartNode'

export { OrgChartNode }
