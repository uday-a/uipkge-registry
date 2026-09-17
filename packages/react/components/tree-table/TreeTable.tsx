"use client";

import * as React from "react";
import { ChevronRight, FileBox } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TreeTableColumn, TreeTableRow } from "./types";

export interface TreeTableProps {
  /** Tree-structured row data. */
  data: TreeTableRow[];
  /** Column configuration. */
  columns: TreeTableColumn[];
  /** Indent per nesting level in pixels. Default 24. */
  indent?: number;
  /** Expand all rows on mount. Default false. */
  defaultExpanded?: boolean;
  /** Show row selection checkboxes. Default false. */
  selectable?: boolean;
  /** Loading state — shows a spinner overlay. Default false. */
  loading?: boolean;
  /** Empty state message. Default 'No data.'. */
  emptyText?: string;
  /** Controlled selected row ids (v-model:selected parity). */
  selected?: string[];
  /** Called when the selected set changes. */
  onSelectedChange?: (ids: string[]) => void;
  /** Called when the selected set changes (alias of onSelectedChange). */
  onSelect?: (ids: string[]) => void;
  /** Called when a row is expanded or collapsed. */
  onExpand?: (id: string, expanded: boolean) => void;
  /** Replace the default expand/collapse chevron. */
  expandIcon?: (expanded: boolean) => React.ReactNode;
  /** Per-cell renderer keyed by column — mirrors the Vue `cell-<key>` slot. */
  renderCell?: (
    col: TreeTableColumn,
    row: TreeTableRow,
    depth: number,
  ) => React.ReactNode;
  className?: string;
}

interface FlatRow {
  row: TreeTableRow;
  depth: number;
  hasChildren: boolean;
  parentId: string | null;
}

const TreeTable = React.forwardRef<HTMLDivElement, TreeTableProps>(
  (
    {
      data,
      columns,
      indent = 24,
      defaultExpanded = false,
      selectable = false,
      loading = false,
      emptyText = "No data.",
      selected,
      onSelectedChange,
      onSelect,
      onExpand,
      expandIcon,
      renderCell,
      className,
    },
    ref,
  ) => {
    const [expandedSet, setExpandedSet] = React.useState<Set<string>>(
      new Set(),
    );
    const [internalSelected, setInternalSelected] = React.useState<Set<string>>(
      new Set(),
    );

    // Controlled `selected` wins when provided; otherwise fall back to internal state.
    const selectedSet = React.useMemo(
      () => (selected ? new Set(selected) : internalSelected),
      [selected, internalSelected],
    );

    const expandAll = React.useCallback(() => {
      const next = new Set<string>();
      const walk = (rows: TreeTableRow[]) => {
        for (const row of rows) {
          if (row.children?.length) {
            next.add(row.id);
            walk(row.children);
          }
        }
      };
      walk(data);
      setExpandedSet(next);
    }, [data]);

    // Expand all on mount (and when data identity changes) if requested.
    React.useEffect(() => {
      if (defaultExpanded) expandAll();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultExpanded]);

    React.useEffect(() => {
      if (defaultExpanded) expandAll();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const flatRows = React.useMemo<FlatRow[]>(() => {
      const out: FlatRow[] = [];
      const walk = (
        rows: TreeTableRow[],
        depth: number,
        parentId: string | null,
      ) => {
        for (const row of rows) {
          const hasChildren = !!row.children?.length;
          out.push({ row, depth, hasChildren, parentId });
          if (hasChildren && expandedSet.has(row.id)) {
            walk(row.children!, depth + 1, row.id);
          }
        }
      };
      walk(data, 0, null);
      return out;
    }, [data, expandedSet]);

    const isExpanded = (id: string) => expandedSet.has(id);
    const isSelected = (id: string) => selectedSet.has(id);

    const toggleExpand = (row: TreeTableRow) => {
      setExpandedSet((prev) => {
        const next = new Set(prev);
        if (next.has(row.id)) next.delete(row.id);
        else next.add(row.id);
        onExpand?.(row.id, next.has(row.id));
        return next;
      });
    };

    const toggleSelect = (row: TreeTableRow) => {
      const next = new Set(selectedSet);
      if (next.has(row.id)) next.delete(row.id);
      else next.add(row.id);
      const ids = [...next];
      if (selected === undefined) setInternalSelected(next);
      onSelectedChange?.(ids);
      onSelect?.(ids);
    };

    const getTreeRows = (from: HTMLElement): HTMLElement[] => {
      const root = from.closest('[data-slot="tree-table"]');
      if (!root) return [];
      return Array.from(root.querySelectorAll<HTMLElement>("[data-tree-row]"));
    };

    const focusRow = (row: HTMLElement | null | undefined) => {
      row?.focus();
    };

    const onRowKeydown = (e: React.KeyboardEvent, fr: FlatRow) => {
      const target = e.currentTarget as HTMLElement;

      if (e.key === "Enter" || e.key === " ") {
        if (selectable) {
          e.preventDefault();
          toggleSelect(fr.row);
        } else if (fr.hasChildren) {
          e.preventDefault();
          toggleExpand(fr.row);
        }
        return;
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        if (fr.hasChildren && !isExpanded(fr.row.id)) {
          toggleExpand(fr.row);
        } else if (fr.hasChildren && isExpanded(fr.row.id)) {
          const rows = getTreeRows(target);
          const idx = rows.indexOf(target);
          if (idx >= 0 && idx < rows.length - 1) focusRow(rows[idx + 1]);
        }
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (fr.hasChildren && isExpanded(fr.row.id)) {
          toggleExpand(fr.row);
        } else if (fr.parentId) {
          const root = target.closest('[data-slot="tree-table"]');
          const parent = root?.querySelector<HTMLElement>(
            `[data-tree-row][data-tree-id="${CSS.escape(fr.parentId)}"]`,
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

    const isEmpty = flatRows.length === 0;

    return (
      <div
        ref={ref}
        data-uipkge
        data-slot="tree-table"
        role="treegrid"
        className={cn("relative w-full", className)}
      >
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-10">
                  <span className="sr-only">Select</span>
                </TableHead>
              )}
              {columns.map((col) => (
                <TableHead key={col.key} className={cn(col.headerClass)}>
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {flatRows.map((fr) => (
              <TableRow
                key={fr.row.id}
                data-tree-row
                data-tree-id={fr.row.id}
                data-tree-parent={fr.parentId ?? undefined}
                data-depth={fr.depth}
                data-expanded={
                  fr.hasChildren ? isExpanded(fr.row.id) : undefined
                }
                data-selected={isSelected(fr.row.id) ? "" : undefined}
                role="row"
                aria-expanded={
                  fr.hasChildren ? isExpanded(fr.row.id) : undefined
                }
                aria-selected={selectable ? isSelected(fr.row.id) : undefined}
                tabIndex={0}
                className="focus-visible:bg-muted/50 focus-visible:outline-none"
                onKeyDown={(e) => onRowKeydown(e, fr)}
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest("button, input, a"))
                    return;
                  if (selectable) {
                    toggleSelect(fr.row);
                  } else if (fr.hasChildren) {
                    toggleExpand(fr.row);
                  }
                }}
              >
                {selectable && (
                  <TableCell className="w-10">
                    <Checkbox
                      checked={isSelected(fr.row.id)}
                      aria-label={`Select ${String(fr.row[columns[0]?.key ?? "id"] ?? fr.row.id)}`}
                      onCheckedChange={() => toggleSelect(fr.row)}
                    />
                  </TableCell>
                )}

                {columns.map((col, ci) => (
                  <TableCell
                    key={col.key}
                    className={cn(ci === 0 && "font-medium", col.cellClass)}
                  >
                    <div
                      className="flex items-center"
                      style={
                        ci === 0
                          ? { paddingLeft: `${fr.depth * indent}px` }
                          : undefined
                      }
                    >
                      {ci === 0 && fr.hasChildren && (
                        <button
                          type="button"
                          className="text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring mr-1.5 flex size-6 shrink-0 cursor-pointer items-center justify-center rounded focus-visible:ring-2 focus-visible:outline-none"
                          aria-label={
                            isExpanded(fr.row.id) ? "Collapse" : "Expand"
                          }
                          aria-expanded={isExpanded(fr.row.id)}
                          tabIndex={-1}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand(fr.row);
                          }}
                        >
                          {expandIcon ? (
                            expandIcon(isExpanded(fr.row.id))
                          ) : (
                            <ChevronRight
                              className={cn(
                                "size-4 transition-transform duration-150",
                                isExpanded(fr.row.id) && "rotate-90",
                              )}
                            />
                          )}
                        </button>
                      )}
                      {ci === 0 && !fr.hasChildren && (
                        <span className="mr-1.5 w-5 shrink-0" />
                      )}

                      {renderCell
                        ? (renderCell(col, fr.row, fr.depth) ??
                          (col.render ? col.render(fr.row) : fr.row[col.key]))
                        : col.render
                          ? col.render(fr.row)
                          : fr.row[col.key]}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}

            {isEmpty && !loading && (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="h-24 text-center"
                >
                  <div className="text-muted-foreground flex flex-col items-center gap-2">
                    <FileBox className="size-8" />
                    <span className="text-sm">{emptyText}</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {loading && (
          <div className="bg-background/60 absolute inset-0 flex items-center justify-center backdrop-blur-sm">
            <Spinner size="lg" />
          </div>
        )}
      </div>
    );
  },
);
TreeTable.displayName = "TreeTable";

export { TreeTable };
export type { TreeTableColumn, TreeTableRow } from "./types";
