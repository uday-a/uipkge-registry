'use client'

import * as React from 'react'
import { ChevronDown, ChevronRight, Copy, Check } from 'lucide-react'
import type { JsonValue } from './types'

export interface JsonTreeNodeProps {
  data: JsonValue
  path: (string | number)[]
  label: string
  isRoot?: boolean
  search?: string
  maxDepth?: number
  matchesSearch: (val: JsonValue) => boolean
  isExpanded: (path: (string | number)[]) => boolean
  toggle: (path: (string | number)[]) => void
  typeOf: (val: JsonValue) => 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null'
  formatValue: (val: JsonValue) => string
  typeColor: Record<string, string>
  keyColor: string
  copiedPath?: string | null
  onCopy?: (value: JsonValue, path: (string | number)[]) => void
}

function pathKey(path: (string | number)[]): string {
  return path.length ? path.map((p) => (typeof p === 'number' ? `[${p}]` : `.${p}`)).join('') : '$'
}

function JsonTreeNode(props: JsonTreeNodeProps): React.ReactElement {
  const {
    data,
    path,
    label,
    isRoot = false,
    search = '',
    maxDepth = 100,
    matchesSearch,
    isExpanded,
    toggle,
    typeOf,
    formatValue,
    typeColor,
    keyColor,
    copiedPath = null,
    onCopy,
  } = props

  const key = pathKey(path)
  const type = typeOf(data)
  const open = isExpanded(path)
  const isContainer = type === 'object' || type === 'array'
  const dimmed = !!search && !matchesSearch(data)

  const entries: [string | number, JsonValue][] = React.useMemo(() => {
    if (Array.isArray(data)) return data.map((v, i) => [i, v] as [number, JsonValue])
    if (data !== null && typeof data === 'object') return Object.entries(data) as [string, JsonValue][]
    return []
  }, [data])

  const count = entries.length
  const indent = isRoot ? 0 : 20

  // Collapsed preview: show first few items inline
  const collapsedPreview = React.useMemo(() => {
    if (open || !isContainer) return ''
    const items = entries.slice(0, 3)
    const parts = items.map(([k, v]) => {
      const vt = typeOf(v)
      let valStr: string
      if (vt === 'string') valStr = `"${String(v).slice(0, 20)}"`
      else if (vt === 'array') valStr = '[…]'
      else if (vt === 'object') valStr = '{…}'
      else valStr = formatValue(v)
      return `${Array.isArray(data) ? '' : `"${k}": `}${valStr}`
    })
    const suffix = count > 3 ? ', …' : ''
    const open2 = type === 'array' ? '[' : '{'
    const close = type === 'array' ? ']' : '}'
    return `${open2}${parts.join(', ')}${suffix}${close}`
  }, [open, isContainer, entries, count, type, typeOf, formatValue, data])

  const parentKey = path.length ? pathKey(path.slice(0, -1)) : null

  function handleCopy() {
    onCopy?.(data, path)
  }

  function getTreeRows(from: HTMLElement): HTMLElement[] {
    const tree = from.closest('[role="tree"]')
    if (!tree) return []
    return Array.from(tree.querySelectorAll<HTMLElement>('[data-tree-row]'))
  }

  function focusRow(row: HTMLElement | null | undefined) {
    row?.focus()
  }

  function handleRowKeydown(e: React.KeyboardEvent) {
    const target = e.currentTarget as HTMLElement

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (isContainer) toggle(path)
      else handleCopy()
      return
    }

    if (e.key === 'ArrowRight') {
      e.preventDefault()
      if (isContainer && !open) {
        toggle(path)
      } else if (isContainer && open) {
        const rows = getTreeRows(target)
        const idx = rows.indexOf(target)
        if (idx >= 0 && idx < rows.length - 1) focusRow(rows[idx + 1])
      }
      return
    }

    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      if (isContainer && open) {
        toggle(path)
      } else if (parentKey) {
        const tree = target.closest('[role="tree"]')
        const parent = tree?.querySelector<HTMLElement>(`[data-tree-row][data-tree-id="${CSS.escape(parentKey)}"]`)
        focusRow(parent)
      }
      return
    }

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const rows = getTreeRows(target)
      const idx = rows.indexOf(target)
      if (idx < 0) return
      focusRow(e.key === 'ArrowDown' ? rows[idx + 1] : rows[idx - 1])
      return
    }

    if (e.key === 'Home') {
      e.preventDefault()
      focusRow(getTreeRows(target)[0])
      return
    }

    if (e.key === 'End') {
      e.preventDefault()
      const rows = getTreeRows(target)
      focusRow(rows[rows.length - 1])
    }
  }

  return (
    <div
      data-dimmed={dimmed ? '' : undefined}
      className={dimmed ? 'opacity-30' : ''}
      role="treeitem"
      aria-expanded={isContainer ? open : undefined}
    >
      {/* Container header row (object/array) */}
      {isContainer && (
        <div
          data-tree-row
          data-tree-id={key}
          data-tree-parent={parentKey ?? undefined}
          tabIndex={0}
          className="group hover:bg-accent/40 focus-visible:ring-ring/50 -mx-1 flex items-center gap-0.5 rounded px-1 py-0.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
          style={{ paddingLeft: `${indent}px` }}
          onClick={() => toggle(path)}
          onKeyDown={handleRowKeydown}
        >
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex size-4 shrink-0 items-center justify-center rounded"
            aria-expanded={open}
            aria-label={open ? 'Collapse' : 'Expand'}
            tabIndex={-1}
            onClick={(e) => {
              e.stopPropagation()
              toggle(path)
            }}
          >
            {open ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
          </button>
          <span className={`${keyColor} select-none`}>{isRoot ? label : `"${label}"`}</span>
          <span className="text-muted-foreground">:</span>
          {open ? (
            <span className="text-muted-foreground select-none">{type === 'array' ? '[' : '{'}</span>
          ) : (
            <span className="text-muted-foreground select-none">{collapsedPreview}</span>
          )}
          {open && (
            <span className="text-muted-foreground ml-0.5 text-xs">
              {count} {count === 1 ? 'item' : 'items'}
            </span>
          )}
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring ml-auto inline-flex size-5 items-center justify-center rounded opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-1"
            title="Copy value"
            aria-label="Copy value"
            tabIndex={-1}
            onClick={(e) => {
              e.stopPropagation()
              handleCopy()
            }}
          >
            {copiedPath === key ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
          </button>
        </div>
      )}

      {/* Container children */}
      {isContainer && open && (
        <div role="group">
          {entries.map(([k, v]) => (
            <JsonTreeNode
              key={String(k)}
              data={v}
              path={[...path, k]}
              label={String(k)}
              isRoot={false}
              search={search}
              maxDepth={maxDepth}
              matchesSearch={matchesSearch}
              isExpanded={isExpanded}
              toggle={toggle}
              typeOf={typeOf}
              formatValue={formatValue}
              typeColor={typeColor}
              keyColor={keyColor}
              copiedPath={copiedPath}
              onCopy={onCopy}
            />
          ))}
          <div className="text-muted-foreground py-0.5 select-none" style={{ paddingLeft: `${indent}px` }}>
            {type === 'array' ? ']' : '}'}
          </div>
        </div>
      )}

      {/* Primitive leaf */}
      {!isContainer && (
        <div
          data-tree-row
          data-tree-id={key}
          data-tree-parent={parentKey ?? undefined}
          tabIndex={0}
          className="group hover:bg-accent/40 focus-visible:ring-ring/50 -mx-1 flex items-center gap-0.5 rounded px-1 py-0.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
          style={{ paddingLeft: `${indent}px` }}
          onClick={handleCopy}
          onKeyDown={handleRowKeydown}
        >
          <span className="inline-flex size-4 shrink-0" />
          {isRoot ? (
            <span className="text-muted-foreground select-none">{label}</span>
          ) : (
            <span className={`${keyColor} select-none`}>"{label}"</span>
          )}
          <span className="text-muted-foreground">:</span>
          <span className={`${typeColor[type] ?? 'text-foreground'} rounded text-left font-mono`}>
            {formatValue(data)}
          </span>
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring ml-auto inline-flex size-5 items-center justify-center rounded opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-1"
            title="Copy value"
            aria-label="Copy value"
            tabIndex={-1}
            onClick={(e) => {
              e.stopPropagation()
              handleCopy()
            }}
          >
            {copiedPath === key ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
          </button>
        </div>
      )}
    </div>
  )
}

export { JsonTreeNode }
