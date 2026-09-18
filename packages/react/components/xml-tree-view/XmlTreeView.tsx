'use client'

import * as React from 'react'
import { Search, CodeXml, FoldVertical, UnfoldVertical, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { XmlTreeNode } from './XmlTreeNode'
import { parseXml, countElements, pathKey, walkExpandable, type XmlNode } from './types'

export type { XmlNode } from './types'

export interface XmlTreeViewProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'data' | 'onCopy'> {
  /** Raw XML string to parse and display. */
  data: string
  expandDepth?: number
  maxDepth?: number
  showSearch?: boolean
  showToolbar?: boolean
  /** Override path root label; defaults to the document element name. */
  rootLabel?: string
  onCopy?: (value: string, path: string) => void
}

const tagColor = 'text-violet-600 dark:text-violet-400'
const attrNameColor = 'text-blue-600 dark:text-blue-400'
const attrValueColor = 'text-emerald-600 dark:text-emerald-400'
const textColor = 'text-emerald-600 dark:text-emerald-400'
const commentColor = 'text-muted-foreground'
const punctColor = 'text-muted-foreground'

const XmlTreeView = React.forwardRef<HTMLDivElement, XmlTreeViewProps>(function XmlTreeView(props, ref) {
  const {
    data,
    expandDepth = 1,
    maxDepth = 100,
    showSearch = true,
    showToolbar = true,
    rootLabel,
    onCopy,
    className,
    ...rest
  } = props

  const [expanded, setExpanded] = React.useState<Set<string>>(() => new Set())
  const [search, setSearch] = React.useState('')
  const [copiedPath, setCopiedPath] = React.useState<string | null>(null)

  const parsed = React.useMemo(() => parseXml(data), [data])
  const root = parsed.root
  const parseError = parsed.error

  const expandDepthRef = React.useRef(expandDepth)
  expandDepthRef.current = expandDepth
  const maxDepthRef = React.useRef(maxDepth)
  maxDepthRef.current = maxDepth
  const rootRef = React.useRef(root)
  rootRef.current = root

  function defaultExpanded(): Set<string> {
    const next = new Set<string>()
    const r = rootRef.current
    if (!r) return next
    walkExpandable(r, [], 0, expandDepthRef.current, (path) => {
      next.add(pathKey(path))
    })
    return next
  }

  React.useEffect(() => {
    setExpanded(defaultExpanded())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, expandDepth])

  function toggle(path: string[]) {
    const k = pathKey(path)
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(k)) next.delete(k)
      else next.add(k)
      return next
    })
  }

  function isExpanded(path: string[]): boolean {
    return expanded.has(pathKey(path))
  }

  function expandAll() {
    const next = new Set<string>()
    const r = rootRef.current
    if (r) {
      walkExpandable(r, [], 0, maxDepthRef.current, (path) => {
        next.add(pathKey(path))
      })
    }
    setExpanded(next)
  }

  function collapseAll() {
    setExpanded(new Set())
  }

  function matchesSearch(node: XmlNode): boolean {
    if (!search) return true
    const term = search.toLowerCase()
    const walk = (n: XmlNode): boolean => {
      if (n.type === 'element') {
        if (n.name.toLowerCase().includes(term)) return true
        if (n.attributes.some((a) => a.name.toLowerCase().includes(term) || a.value.toLowerCase().includes(term)))
          return true
        return n.children.some(walk)
      }
      return n.text.toLowerCase().includes(term)
    }
    return walk(node)
  }

  React.useEffect(() => {
    if (!search) {
      setExpanded(defaultExpanded())
      return
    }
    const next = new Set<string>()
    const r = rootRef.current
    if (r) {
      walkExpandable(r, [], 0, maxDepthRef.current, (path, node) => {
        if (matchesSearch(node)) next.add(pathKey(path))
      })
    }
    setExpanded(next)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  async function copyValue(value: string, path: string[]) {
    const p = pathKey(path)
    try {
      await navigator.clipboard.writeText(value)
      setCopiedPath(p)
      onCopy?.(value, p)
      setTimeout(() => {
        setCopiedPath((cur) => (cur === p ? null : cur))
      }, 1200)
    } catch {
      // clipboard unavailable
    }
  }

  const effectiveRootLabel = rootLabel ?? root?.name ?? 'xml'

  const summary = React.useMemo(() => {
    if (parseError) return 'Parse error'
    if (!root) return 'Empty'
    const n = countElements(root)
    return `${root.name} · ${n} element${n === 1 ? '' : 's'}`
  }, [parseError, root])

  const searchMatchCount = React.useMemo(() => {
    if (!search || !root) return 0
    let count = 0
    const term = search.toLowerCase()
    const walk = (n: XmlNode) => {
      if (n.type === 'element') {
        if (n.name.toLowerCase().includes(term)) count++
        for (const a of n.attributes) {
          if (a.name.toLowerCase().includes(term) || a.value.toLowerCase().includes(term)) count++
        }
        n.children.forEach(walk)
        return
      }
      if (n.text.toLowerCase().includes(term)) count++
    }
    walk(root)
    return count
  }, [search, root])

  return (
    <div
      ref={ref}
      data-uipkge=""
      data-slot="xml-tree-view"
      className={cn('bg-background flex flex-col overflow-hidden rounded-lg border font-mono text-sm', className)}
      {...rest}
    >
      {(showToolbar || showSearch) && (
        <div className="border-border flex items-center gap-2 border-b px-3 py-2">
          <div className="flex items-center gap-1.5">
            <CodeXml className="text-muted-foreground size-4" />
            <span className="text-muted-foreground text-xs">{summary}</span>
          </div>
          <div className="ml-auto flex items-center gap-1">
            {showSearch && !parseError && (
              <div className="relative">
                <Search className="text-muted-foreground absolute top-1/2 left-2 size-3.5 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter..."
                  aria-label="Filter XML tree"
                  className="border-input bg-muted/40 focus:border-ring focus:ring-ring/30 h-7 w-32 rounded-md pr-2 pl-7 text-xs transition-[width] outline-none focus:w-44 focus:ring-2"
                />
              </div>
            )}
            {search && !parseError && (
              <span className="text-muted-foreground text-xs">
                {searchMatchCount} match{searchMatchCount === 1 ? '' : 'es'}
              </span>
            )}
            {!parseError && (
              <>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex size-7 items-center justify-center rounded-md transition-colors"
                  title="Expand all"
                  aria-label="Expand all"
                  onClick={expandAll}
                >
                  <UnfoldVertical className="size-4" />
                </button>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex size-7 items-center justify-center rounded-md transition-colors"
                  title="Collapse all"
                  aria-label="Collapse all"
                  onClick={collapseAll}
                >
                  <FoldVertical className="size-4" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {parseError ? (
        <div className="text-destructive flex items-start gap-2 p-4 text-sm">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <div className="min-w-0">
            <p className="font-sans font-medium">Invalid XML</p>
            <p className="text-muted-foreground mt-1 font-mono text-xs break-words">{parseError}</p>
          </div>
        </div>
      ) : root ? (
        <div className="min-h-0 flex-1 overflow-auto p-2" role="tree" aria-label={effectiveRootLabel}>
          <XmlTreeNode
            node={root}
            path={[]}
            isRoot
            search={search}
            maxDepth={maxDepth}
            matchesSearch={matchesSearch}
            isExpanded={isExpanded}
            toggle={toggle}
            tagColor={tagColor}
            attrNameColor={attrNameColor}
            attrValueColor={attrValueColor}
            textColor={textColor}
            commentColor={commentColor}
            punctColor={punctColor}
            copiedPath={copiedPath}
            onCopy={copyValue}
          />
        </div>
      ) : null}
    </div>
  )
})

XmlTreeView.displayName = 'XmlTreeView'

export { XmlTreeView }
