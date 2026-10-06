import { getContext, setContext } from 'svelte'
import type { TreeViewItem } from './types'

export interface TreeViewContext {
  readonly expandedIds: Set<string>
  readonly selectedId: string | null
  readonly showIcons: boolean
  readonly showCheckboxes: boolean
  toggle: (item: TreeViewItem) => void
  select: (item: TreeViewItem) => void
}

const TREE_VIEW_CONTEXT_KEY = Symbol('uipkge-tree-view')

export function setTreeViewContext(ctx: TreeViewContext): void {
  setContext(TREE_VIEW_CONTEXT_KEY, ctx)
}

export function getTreeViewContext(): TreeViewContext {
  const ctx = getContext<TreeViewContext | undefined>(TREE_VIEW_CONTEXT_KEY)
  if (!ctx) throw new Error('TreeViewNode must be used inside <TreeView>')
  return ctx
}
