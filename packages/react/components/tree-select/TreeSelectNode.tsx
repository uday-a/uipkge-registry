"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TreeSelectNode as TreeSelectNodeData } from "./types";

export interface TreeSelectNodeProps {
  node: TreeSelectNodeData;
  depth: number;
  multiple: boolean;
  expandedIds: Set<string>;
  selectedValues: Set<string>;
  filteredIds: Set<string> | null;
  parentValue?: string | null;
  onToggle: (node: TreeSelectNodeData) => void;
  onSelect: (node: TreeSelectNodeData) => void;
}

function collectValues(node: TreeSelectNodeData): string[] {
  const vals: string[] = [];
  const walk = (n: TreeSelectNodeData) => {
    if (n.children?.length) {
      for (const c of n.children) walk(c);
    } else {
      vals.push(n.value);
    }
  };
  walk(node);
  return vals;
}

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

export const TreeSelectNode = React.memo(
  React.forwardRef<HTMLDivElement, TreeSelectNodeProps>(
    (
      {
        node,
        depth,
        multiple,
        expandedIds,
        selectedValues,
        filteredIds,
        parentValue = null,
        onToggle,
        onSelect,
      },
      ref,
    ) => {
      const hasChildren = !!(node.children && node.children.length);
      const isExpanded = expandedIds.has(node.value);
      const isChecked = React.useMemo(() => {
        if (!multiple) return selectedValues.has(node.value);
        if (selectedValues.has(node.value)) return true;
        if (!hasChildren) return false;
        const descendants = collectValues(node);
        const selected = descendants.filter((v) => selectedValues.has(v));
        return selected.length > 0 && selected.length < descendants.length;
      }, [multiple, selectedValues, node, hasChildren]);
      const isFullyChecked = React.useMemo(() => {
        if (!multiple) return false;
        if (selectedValues.has(node.value)) return true;
        if (!hasChildren) return false;
        const descendants = collectValues(node);
        return (
          descendants.length > 0 &&
          descendants.every((v) => selectedValues.has(v))
        );
      }, [multiple, selectedValues, node, hasChildren]);
      const isVisible = !filteredIds || filteredIds.has(node.value);
      const isSelected = !multiple
        ? selectedValues.has(node.value)
        : isFullyChecked || isChecked;

      const indent = `${depth * 20 + 8}px`;

      function handleToggle(e: React.MouseEvent) {
        e.stopPropagation();
        onToggle(node);
      }

      function handleSelect() {
        if (node.disabled) return;
        onSelect(node);
      }

      function handleCheckboxChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.stopPropagation();
        if (node.disabled) return;
        onSelect(node);
      }

      function handleRowKeydown(e: React.KeyboardEvent) {
        if (node.disabled) return;
        const target = e.currentTarget as HTMLElement;

        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleSelect();
          return;
        }

        if (e.key === "ArrowRight") {
          e.preventDefault();
          if (hasChildren && !isExpanded) {
            onToggle(node);
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
            onToggle(node);
          } else if (parentValue) {
            const tree = target.closest('[role="tree"]');
            const parent = tree?.querySelector<HTMLElement>(
              `[data-tree-row][data-tree-id="${CSS.escape(parentValue)}"]`,
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
      }

      if (!isVisible) return null;

      return (
        <div
          ref={ref}
          role="treeitem"
          aria-expanded={hasChildren ? isExpanded : undefined}
          aria-selected={isSelected}
        >
          <div
            data-tree-row
            data-tree-id={node.value}
            data-tree-parent={parentValue ?? undefined}
            data-disabled={node.disabled ? "true" : undefined}
            className={cn(
              "group relative flex h-8 cursor-pointer items-center gap-1.5 rounded-md pr-2 text-sm transition-colors",
              "hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring/50 focus-visible:ring-2 focus-visible:outline-none",
              node.disabled && "cursor-not-allowed opacity-50",
              !multiple &&
                selectedValues.has(node.value) &&
                "bg-accent text-accent-foreground font-medium",
            )}
            style={{ paddingLeft: indent }}
            tabIndex={node.disabled ? -1 : 0}
            onClick={handleSelect}
            onKeyDown={handleRowKeydown}
          >
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

            {multiple && (
              <input
                type="checkbox"
                checked={isFullyChecked || isChecked}
                ref={(el) => {
                  if (el) el.indeterminate = isChecked && !isFullyChecked;
                }}
                disabled={node.disabled}
                className="border-input text-primary focus:ring-ring size-3.5 shrink-0 rounded focus:ring-1"
                onChange={handleCheckboxChange}
                onClick={(e) => e.stopPropagation()}
              />
            )}

            <span className="flex-1 truncate">{node.label}</span>
          </div>

          {hasChildren && isExpanded && (
            <div role="group">
              {node.children!.map((child) => (
                <TreeSelectNode
                  key={child.value}
                  node={child}
                  depth={depth + 1}
                  multiple={multiple}
                  expandedIds={expandedIds}
                  selectedValues={selectedValues}
                  filteredIds={filteredIds}
                  parentValue={node.value}
                  onToggle={onToggle}
                  onSelect={onSelect}
                />
              ))}
            </div>
          )}
        </div>
      );
    },
  ),
);
TreeSelectNode.displayName = "TreeSelectNode";
