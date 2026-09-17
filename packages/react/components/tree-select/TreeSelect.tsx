'use client'

import * as React from 'react'
import { ChevronDown, Loader2, Search, X } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { treeSelectTriggerVariants } from './tree-select.variants'
import { TreeSelectNode } from './TreeSelectNode'
import type { TreeSelectNode as TreeNode } from './types'

export interface TreeSelectProps {
  value?: string | string[] | null
  defaultValue?: string | string[] | null
  data: TreeNode[]
  multiple?: boolean
  placeholder?: string
  searchable?: boolean
  disabled?: boolean
  loading?: boolean
  clearable?: boolean
  defaultExpandAll?: boolean
  size?: 'sm' | 'default' | 'lg'
  emptyText?: string
  searchPlaceholder?: string
  className?: string
  onValueChange?: (value: string | string[] | null) => void
  onChange?: (value: string | string[] | null) => void
  onSelect?: (node: TreeNode) => void
  onClear?: () => void
}

function collectAllExpandable(nodes: TreeNode[]): string[] {
  const ids: string[] = []
  const walk = (list: TreeNode[]) => {
    for (const n of list) {
      if (n.children?.length) {
        ids.push(n.value)
        walk(n.children)
      }
    }
  }
  walk(nodes)
  return ids
}

function findNode(nodes: TreeNode[], value: string): TreeNode | undefined {
  for (const n of nodes) {
    if (n.value === value) return n
    if (n.children) {
      const found = findNode(n.children, value)
      if (found) return found
    }
  }
  return undefined
}

function findLabels(nodes: TreeNode[], values: string[]): string[] {
  return values.map((v) => findNode(nodes, v)?.label ?? v)
}

function collectLeafValues(node: TreeNode): string[] {
  if (!node.children?.length) return [node.value]
  const vals: string[] = []
  for (const c of node.children) vals.push(...collectLeafValues(c))
  return vals
}

const TreeSelect = React.forwardRef<HTMLButtonElement, TreeSelectProps>(
  (
    {
      value,
      defaultValue,
      data,
      multiple = false,
      placeholder = 'Select...',
      searchable = true,
      disabled = false,
      loading = false,
      clearable = true,
      defaultExpandAll = false,
      size = 'default',
      emptyText = 'No results found.',
      searchPlaceholder = 'Search...',
      className,
      onValueChange,
      onChange,
      onSelect,
      onClear,
    },
    ref,
  ) => {
    const isControlled = value !== undefined
    const [internalValue, setInternalValue] = React.useState<string | string[] | null>(defaultValue ?? null)
    const currentValue = isControlled ? value : internalValue

    const [isOpen, setIsOpen] = React.useState(false)
    const [search, setSearch] = React.useState('')
    const [expandedIds, setExpandedIds] = React.useState<Set<string>>(() => {
      if (defaultExpandAll) return new Set(collectAllExpandable(data))
      return new Set()
    })

    // Re-collect expandable when defaultExpandAll toggles or data changes.
    React.useEffect(() => {
      if (defaultExpandAll) setExpandedIds(new Set(collectAllExpandable(data)))
    }, [defaultExpandAll, data])

    // Clear search when popover closes.
    React.useEffect(() => {
      if (!isOpen) setSearch('')
    }, [isOpen])

    const selectedValues = React.useMemo<Set<string>>(() => {
      if (currentValue == null) return new Set()
      if (Array.isArray(currentValue)) return new Set(currentValue)
      return new Set([currentValue])
    }, [currentValue])

    const displayLabel = React.useMemo(() => {
      if (multiple) {
        const vals = Array.isArray(currentValue) ? currentValue : []
        if (vals.length === 0) return placeholder
        const labels = findLabels(data, vals)
        if (labels.length <= 3) return labels.join(', ')
        return `${labels.slice(0, 3).join(', ')} +${labels.length - 3}`
      }
      if (currentValue == null) return placeholder
      const node = findNode(data, currentValue as string)
      return node?.label ?? String(currentValue)
    }, [multiple, currentValue, placeholder, data])

    const hasValue = React.useMemo(() => {
      if (multiple) return Array.isArray(currentValue) && currentValue.length > 0
      return currentValue != null
    }, [multiple, currentValue])

    // Search filtering: a node is visible if it or any descendant matches.
    // Expand-on-match is applied in an effect — never setState inside useMemo.
    const filteredIds = React.useMemo<Set<string> | null>(() => {
      const q = search.trim().toLowerCase()
      if (!q) return null
      const visible = new Set<string>()
      const walk = (nodes: TreeNode[]): boolean => {
        let anyMatch = false
        for (const n of nodes) {
          const selfMatch = n.label.toLowerCase().includes(q)
          let childMatch = false
          if (n.children?.length) {
            childMatch = walk(n.children)
          }
          if (selfMatch || childMatch) {
            visible.add(n.value)
            anyMatch = true
          }
        }
        return anyMatch
      }
      walk(data)
      return visible
    }, [search, data])

    // Auto-expand ancestors of search matches.
    React.useEffect(() => {
      if (!filteredIds || filteredIds.size === 0) return
      const q = search.trim().toLowerCase()
      if (!q) return
      setExpandedIds((prev) => {
        const next = new Set(prev)
        let changed = false
        const walk = (nodes: TreeNode[]): boolean => {
          let anyMatch = false
          for (const n of nodes) {
            const selfMatch = n.label.toLowerCase().includes(q)
            let childMatch = false
            if (n.children?.length) childMatch = walk(n.children)
            if (selfMatch || childMatch) {
              anyMatch = true
              if (childMatch && !next.has(n.value)) {
                next.add(n.value)
                changed = true
              }
            }
          }
          return anyMatch
        }
        walk(data)
        return changed ? next : prev
      })
    }, [filteredIds, search, data])

    function commit(next: string | string[] | null) {
      if (!isControlled) setInternalValue(next)
      onValueChange?.(next)
      onChange?.(next)
    }

    function toggleNode(node: TreeNode) {
      if (node.disabled) return
      setExpandedIds((prev) => {
        const next = new Set(prev)
        if (next.has(node.value)) next.delete(node.value)
        else next.add(node.value)
        return next
      })
    }

    function selectNode(node: TreeNode) {
      if (node.disabled) return
      if (!multiple) {
        commit(node.value)
        onSelect?.(node)
        setIsOpen(false)
        return
      }
      // Multi-select: toggle. For parent nodes, toggle all leaf descendants.
      const current = Array.isArray(currentValue) ? [...currentValue] : []
      const leaves = collectLeafValues(node)
      const allSelected = leaves.every((v) => current.includes(v))
      let next: string[]
      if (allSelected) {
        next = current.filter((v) => !leaves.includes(v))
      } else {
        next = [...current, ...leaves.filter((v) => !current.includes(v))]
      }
      commit(next)
      onSelect?.(node)
    }

    function clearAll(event?: React.MouseEvent | React.KeyboardEvent) {
      event?.stopPropagation()
      if (disabled) return
      onClear?.()
      if (multiple) {
        commit([])
      } else {
        commit(null)
      }
    }

    const triggerClasses = cn(treeSelectTriggerVariants({ size }), className)

    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            ref={ref}
            type="button"
            role="combobox"
            aria-expanded={isOpen}
            disabled={disabled || loading}
            data-uipkge=""
            data-slot="tree-select"
            className={triggerClasses}
          >
            <span className={cn('flex-1 truncate text-left', hasValue ? 'text-foreground' : 'text-muted-foreground')}>
              {displayLabel}
            </span>
            <span className="flex shrink-0 items-center gap-1">
              {loading ? (
                <Loader2 className="text-muted-foreground size-4 animate-spin" />
              ) : clearable && hasValue && !disabled ? (
                <span
                  role="button"
                  tabIndex={0}
                  aria-label="Clear"
                  className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 flex size-4 items-center justify-center rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  onClick={(e) => clearAll(e)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      clearAll(e)
                    }
                  }}
                >
                  <X className="size-4" />
                </span>
              ) : (
                <ChevronDown
                  className={cn(
                    'text-muted-foreground size-4 shrink-0 transition-transform duration-200',
                    isOpen && 'rotate-180',
                  )}
                />
              )}
            </span>
          </button>
        </PopoverTrigger>

        <PopoverContent
          className="p-0"
          align="start"
          sideOffset={4}
          style={{ width: 'var(--radix-popover-trigger-width)' }}
        >
          <div className="flex max-h-80 flex-col">
            {searchable && (
              <div className="border-b p-2">
                <div className="relative">
                  <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={searchPlaceholder}
                    aria-label="Search tree"
                    className="border-input focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent pl-8 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                  />
                </div>
              </div>
            )}

            {loading ? (
              <div className="text-muted-foreground flex items-center justify-center gap-2 py-6 text-sm">
                <Loader2 className="size-4 animate-spin" />
                Loading...
              </div>
            ) : data.length === 0 || (filteredIds && filteredIds.size === 0) ? (
              <div className="text-muted-foreground py-6 text-center text-sm">{emptyText}</div>
            ) : (
              <div className="flex-1 overflow-y-auto p-1" role="tree">
                {data.map((node) => (
                  <TreeSelectNode
                    key={node.value}
                    node={node}
                    depth={0}
                    multiple={multiple}
                    expandedIds={expandedIds}
                    selectedValues={selectedValues}
                    filteredIds={filteredIds}
                    onToggle={toggleNode}
                    onSelect={selectNode}
                  />
                ))}
              </div>
            )}

            {multiple && Array.isArray(currentValue) && currentValue.length > 0 && (
              <div className="flex items-center justify-between border-t px-2 py-1.5 text-xs">
                <span className="text-muted-foreground">{currentValue.length} selected</span>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 rounded focus-visible:ring-2 focus-visible:outline-none"
                  onClick={() => clearAll()}
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    )
  },
)
TreeSelect.displayName = 'TreeSelect'

export { TreeSelect }
