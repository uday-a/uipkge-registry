"use client";

import * as React from "react";
import { ChevronRight, File, Folder, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { TreeViewContext, type TreeViewContextValue } from "./context";
import type { TreeViewItem } from "./types";

export interface TreeViewProps {
  items: TreeViewItem[];
  className?: string;
  showIcons?: boolean;
  showCheckboxes?: boolean;
  defaultExpanded?: boolean;
  selectedId?: string | null;
  onSelect?: (item: TreeViewItem) => void;
  onToggle?: (item: TreeViewItem) => void;
  onSelectedIdChange?: (id: string | null) => void;
}

function collectExpandable(items: TreeViewItem[], acc: Set<string>) {
  for (const it of items) {
    if (it.children?.length) {
      acc.add(it.id);
      collectExpandable(it.children, acc);
    }
  }
}

const TreeView = React.forwardRef<HTMLDivElement, TreeViewProps>(
  (
    {
      items,
      className,
      showIcons = true,
      showCheckboxes = false,
      defaultExpanded = false,
      selectedId: selectedIdProp = null,
      onSelect,
      onToggle,
      onSelectedIdChange,
    },
    ref,
  ) => {
    const [expandedIds, setExpandedIds] = React.useState<Set<string>>(() => {
      if (!defaultExpanded) return new Set();
      const next = new Set<string>();
      collectExpandable(items, next);
      return next;
    });
    const [selectedId, setSelectedId] = React.useState<string | null>(
      selectedIdProp,
    );

    // Mirror the Vue `watch(() => props.selectedId)` — keep internal state in
    // sync when the controlled prop changes.
    React.useEffect(() => {
      setSelectedId(selectedIdProp);
    }, [selectedIdProp]);

    const toggle = React.useCallback(
      (item: TreeViewItem) => {
        if (item.disabled) return;
        setExpandedIds((prev) => {
          const next = new Set(prev);
          if (next.has(item.id)) next.delete(item.id);
          else next.add(item.id);
          return next;
        });
        onToggle?.(item);
      },
      [onToggle],
    );

    const select = React.useCallback(
      (item: TreeViewItem) => {
        if (item.disabled) return;
        setSelectedId(item.id);
        onSelect?.(item);
        onSelectedIdChange?.(item.id);
      },
      [onSelect, onSelectedIdChange],
    );

    const ctx = React.useMemo<TreeViewContextValue>(
      () => ({
        expandedIds,
        selectedId,
        showIcons,
        showCheckboxes,
        toggle,
        select,
      }),
      [expandedIds, selectedId, showIcons, showCheckboxes, toggle, select],
    );

    return (
      <TreeViewContext.Provider value={ctx}>
        <div ref={ref} className={cn("text-sm", className)} role="tree">
          {items.map((item, i) => (
            <TreeViewNode
              key={item.id}
              item={item}
              depth={0}
              isLast={i === items.length - 1}
            />
          ))}
        </div>
      </TreeViewContext.Provider>
    );
  },
);
TreeView.displayName = "TreeView";

export interface TreeViewNodeProps {
  item: TreeViewItem;
  depth: number;
  isLast?: boolean;
  parentId?: string | null;
}

// 20px per level. Connector lives in parent's gutter (depth - 1).
const INDENT = 20;

function getTreeRows(from: HTMLElement): HTMLElement[] {
  const tree = from.closest('[role="tree"]');
  if (!tree) return [];
  return Array.from(
    tree.querySelectorAll<HTMLElement>(
      '[data-tree-row]:not([data-disabled="true"])',
    ),
  );
}

function focusRow(row: HTMLElement | null | undefined) {
  row?.focus();
}

function TreeViewNode({
  item,
  depth,
  isLast = false,
  parentId = null,
}: TreeViewNodeProps) {
  const ctx = React.useContext(TreeViewContext);
  if (!ctx) throw new Error("TreeViewNode must be used inside <TreeView>");

  const isExpanded = ctx.expandedIds.has(item.id);
  const isSelected = ctx.selectedId === item.id;
  const hasChildren = !!(item.children && item.children.length);

  let Icon: typeof File | null = null;
  if (ctx.showIcons) {
    if (item.icon) Icon = item.icon;
    else if (!hasChildren) Icon = File;
    else Icon = isExpanded ? FolderOpen : Folder;
  }

  const rowPadLeft = `${depth * INDENT + 4}px`;
  const connectorLeft = `${(depth - 1) * INDENT + 10}px`;

  const handleToggle = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    ctx.toggle(item);
  };

  const handleSelect = () => {
    if (item.disabled) return;
    ctx.select(item);
  };

  const handleRowKeydown = (e: React.KeyboardEvent) => {
    if (item.disabled) return;
    const target = e.currentTarget as HTMLElement;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect();
      return;
    }

    if (e.key === "ArrowRight") {
      e.preventDefault();
      if (hasChildren && !isExpanded) {
        handleToggle();
      } else if (hasChildren && isExpanded) {
        const rows = getTreeRows(target);
        const idx = rows.indexOf(target);
        if (idx >= 0 && idx < rows.length - 1) focusRow(rows[idx + 1]);
      }
      return;
    }

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (hasChildren && isExpanded) {
        handleToggle();
      } else if (parentId) {
        const tree = target.closest('[role="tree"]');
        const parent = tree?.querySelector<HTMLElement>(
          `[data-tree-row][data-tree-id="${CSS.escape(parentId)}"]`,
        );
        focusRow(parent);
      }
      return;
    }

    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const rows = getTreeRows(target);
      const idx = rows.indexOf(target);
      if (idx < 0) return;
      focusRow(e.key === "ArrowDown" ? rows[idx + 1] : rows[idx - 1]);
      return;
    }

    if (e.key === "Home") {
      e.preventDefault();
      focusRow(getTreeRows(target)[0]);
      return;
    }

    if (e.key === "End") {
      e.preventDefault();
      const rows = getTreeRows(target);
      focusRow(rows[rows.length - 1]);
    }
  };

  return (
    <div
      role="treeitem"
      aria-expanded={hasChildren ? isExpanded : undefined}
      aria-selected={isSelected}
      className="relative"
    >
      {/* Discord-style elbow + trunk for non-root nodes. The elbow points
          from the parent's chevron column down to this row's center; the
          trunk continues to the next sibling at this depth (omitted on the
          last sibling). */}
      {depth > 0 && (
        <span
          aria-hidden="true"
          className="border-border pointer-events-none absolute top-0 h-4 w-3 rounded-bl-md border-b border-l"
          style={{ left: connectorLeft }}
        />
      )}
      {depth > 0 && !isLast && (
        <span
          aria-hidden="true"
          className="bg-border pointer-events-none absolute top-4 bottom-0 w-px"
          style={{ left: connectorLeft }}
        />
      )}

      {/* Row */}
      <div
        data-tree-row
        data-tree-id={item.id}
        data-tree-parent={parentId ?? undefined}
        data-disabled={item.disabled ? "true" : undefined}
        className={cn(
          "group relative flex h-8 cursor-pointer items-center gap-1.5 rounded-md pr-2 text-sm transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:ring-ring/50 focus-visible:ring-2 focus-visible:outline-none",
          item.disabled && "cursor-not-allowed opacity-50",
          isSelected && "bg-accent text-accent-foreground font-medium",
        )}
        style={{ paddingLeft: rowPadLeft }}
        tabIndex={item.disabled ? -1 : 0}
        onClick={handleSelect}
        onKeyDown={handleRowKeydown}
      >
        {/* Chevron (or 16px spacer for leaves so labels align) */}
        {hasChildren ? (
          <button
            type="button"
            className={cn(
              "focus-visible:ring-ring flex size-4 shrink-0 items-center justify-center rounded transition-transform duration-150 focus-visible:ring-2 focus-visible:outline-none",
              "hover:bg-foreground/10",
              isExpanded && "rotate-90",
            )}
            aria-label={isExpanded ? "Collapse" : "Expand"}
            tabIndex={-1}
            onClick={handleToggle}
          >
            <ChevronRight
              className="text-muted-foreground size-3.5"
              aria-hidden="true"
            />
          </button>
        ) : (
          <span className="size-4 shrink-0" />
        )}

        {/* Checkbox: reflect live selection, not the static item.selected seed field */}
        {ctx.showCheckboxes && (
          <input
            type="checkbox"
            checked={isSelected}
            disabled={item.disabled}
            aria-label={item.label}
            className="border-input bg-background text-primary focus:ring-ring focus-visible:ring-ring size-3.5 shrink-0 rounded focus:ring-1 focus-visible:ring-2 focus-visible:outline-none"
            onChange={handleSelect}
            onClick={(e) => e.stopPropagation()}
          />
        )}

        {/* Icon */}
        {Icon && (
          <Icon
            className={cn(
              "size-4 shrink-0",
              hasChildren ? "text-primary" : "text-muted-foreground",
            )}
          />
        )}

        {/* Label */}
        <span className="flex-1 truncate">{item.label}</span>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div role="group">
          {item.children!.map((child, j) => (
            <TreeViewNode
              key={child.id}
              item={child}
              depth={depth + 1}
              parentId={item.id}
              isLast={j === (item.children?.length ?? 0) - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
TreeViewNode.displayName = "TreeViewNode";

export { TreeView, TreeViewNode };
