"use client";

import * as React from "react";
import type {
  ColumnDef,
  ColumnFiltersState,
  ColumnPinningState,
  FilterFn,
  SortingState,
  VisibilityState,
  ExpandedState,
  GroupingState,
  Table as TanstackTable,
  Row,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { DateRange } from "react-day-picker";
// `valueUpdater` lives next to the low-level table primitive (which
// data-table depends on transitively via registryDependencies). Keep
// `@/lib/utils` reserved for the cn() helper shipped by the init
// bootstrap -- importing valueUpdater from there would force every
// consumer to hand-edit lib/utils.ts on install.
import { valueUpdater } from "@/components/ui/table/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Copy,
  Download,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import { DataTableToolbar } from "./DataTableToolbar";
import { DataTableFilterSheet } from "./DataTableFilterSheet";
import { DataTablePagination } from "./DataTablePagination";
import {
  type FilterDefinition,
  type FilterOption,
  resolveOption,
} from "./types";
import { isoToDate, dateToIso } from "./date-utils";

export type { FilterDefinition, FilterOption };

interface DateRangeValue {
  from?: string;
  to?: string;
}

export interface DataTableState {
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
  filters: Record<string, any>;
  search: string;
}

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterColumn?: string;
  filterPlaceholder?: string;
  filters?: FilterDefinition[];
  filterMode?: "inline" | "modal" | "popover";
  /** Show the global search input. Default true. */
  enableSearch?: boolean;
  /** Show the View column-visibility dropdown. Default false. */
  enableColumnVisibility?: boolean;
  /** Show the pagination footer. Default true. */
  enablePagination?: boolean;
  /** Hide the entire toolbar (search + filters + view). Default false. */
  hideToolbar?: boolean;
  /** Show Export-CSV button in toolbar. Default false. */
  enableExport?: boolean;
  /** Infinite-scroll mode: calls `onFetchMore` when last row enters viewport,
   *  hides the pagination footer. Combine with append-on-success on the
   *  consumer side. */
  infinite?: boolean;
  /** Allow drag-to-resize on column borders. */
  enableResize?: boolean;
  /** Initial column pinning. Each column id is pinned to the given side. */
  defaultColumnPinning?: { left?: string[]; right?: string[] };
  /** Allow drag-to-reorder on column headers. */
  enableReorder?: boolean;
  /** Initial column ids to group by. Pass an empty array to disable grouping. */
  defaultGrouping?: string[];
  /** Virtual-scrolling mode (CSS content-visibility based). Best with large
   *  datasets and `maxHeight` for a scroll container. */
  virtual?: boolean;
  /** Sticky header — keeps `<thead>` visible when scrolling. Pair with `maxHeight`. */
  stickyHeader?: boolean;
  /** Density of cell padding: 'compact' | 'cozy' | 'comfortable'. Default cozy.
   *  Treated as the INITIAL density when `enableDensityToggle` is on; the user
   *  can override it at runtime from the toolbar. */
  density?: "compact" | "cozy" | "comfortable";
  /** Show the density toggle in the toolbar. Default false. */
  enableDensityToggle?: boolean;
  /** Strip the DataTable's borders.
   *  - `'inner'` removes toolbar bottom-divider, pagination top-divider,
   *    and filter-sheet section bgs/borders. The outer container border
   *    is kept.
   *  - `'full'` additionally removes the outer container border + rounded
   *    corners so the table renders completely flat on the canvas. */
  borderless?: "inner" | "full";
  /** Where the toolbar renders. `'inside'` (default) lives inside the
   *  bordered container; `'above'` floats outside it. */
  toolbarPosition?: "inside" | "above";
  /** Where the pagination footer renders. `'inside'` (default) or `'below'`. */
  paginationPosition?: "inside" | "below";
  /** Max height; enables vertical scroll inside the card. */
  maxHeight?: string;
  /** Row click — when set, rows become clickable + cursor-pointer. */
  onRowClick?: (row: TData) => void;
  /** Server-side mode: total row count from API (enables manual pagination) */
  totalRows?: number;
  /** Server-side mode: loading state indicator */
  loading?: boolean;
  /** Emitted when server-side state changes (pagination, sorting, filters) */
  onStateChange?: (state: DataTableState) => void;
  /** Infinite-scroll: last row entered viewport, time to load more */
  onFetchMore?: () => void;
  /** Custom empty-state content (replaces "No results."). */
  emptyState?: React.ReactNode;
  /** Expanded-row content. Receives the original row + the TanStack row. */
  renderExpanded?: (row: TData, tanstackRow: Row<TData>) => React.ReactNode;
  /** Bulk action bar content (shown above the table when rows are selected). */
  renderBulkActions?: (
    rows: Row<TData>[],
    clear: () => void,
  ) => React.ReactNode;
  /** Footer (<tfoot>) content. */
  renderFooter?: (rows: Row<TData>[]) => React.ReactNode;
  /** Extra toolbar controls (e.g. group-by selector). */
  toolbarExtra?: React.ReactNode;
  /** Consumer-supplied custom filter UI inside the filter surface. */
  customFilters?: React.ReactNode;
  /** Enable keyboard navigation (Arrow keys, J/K, Space/X, Enter, Esc, Cmd+A, Cmd+C). Default true. */
  enableKeyboardNavigation?: boolean;
  /** Placement of the bulk actions dock: 'floating' (Linear/Raycast HUD dock at bottom-center) or 'inline' (top banner). Default 'floating'. */
  bulkActionPosition?: "floating" | "inline";
}

export interface DataTableHandle<TData> {
  table: TanstackTable<TData>;
  exportCsv: () => void;
  exportJson: () => void;
  copyTsv: (rows?: Row<TData>[]) => string;
  copyMarkdown: (rows?: Row<TData>[]) => string;
}

function DataTableInner<TData, TValue>(
  props: DataTableProps<TData, TValue>,
  forwardedRef: React.Ref<DataTableHandle<TData>>,
) {
  const {
    columns,
    data,
    filterColumn = "",
    filterPlaceholder = "Filter...",
    filters = [],
    // Industry default (shadcn / Linear / Airtable): faceted filter chips in the
    // toolbar. Use `modal` for a right Sheet when you have many complex filters.
    filterMode = "inline",
    enableSearch = true,
    enableColumnVisibility = false,
    enablePagination = true,
    hideToolbar = false,
    enableExport = false,
    infinite = false,
    enableResize = false,
    defaultColumnPinning = { left: [], right: [] },
    enableReorder = false,
    defaultGrouping = [],
    virtual = false,
    stickyHeader = false,
    density = "cozy",
    enableDensityToggle = false,
    borderless,
    toolbarPosition = "inside",
    paginationPosition = "inside",
    maxHeight = "",
    onRowClick,
    totalRows = -1,
    loading = false,
    onStateChange,
    onFetchMore,
    emptyState,
    renderExpanded,
    renderBulkActions,
    renderFooter,
    toolbarExtra,
    customFilters,
    enableKeyboardNavigation = true,
    bulkActionPosition = "floating",
  } = props;

  // User-mutable density -- initial value from prop, toggleable via toolbar
  // when `enableDensityToggle` is on.
  const [densityOverride, setDensityOverride] = React.useState<
    "compact" | "cozy" | "comfortable" | null
  >(null);
  const currentDensity = densityOverride ?? density;

  // `borderless` is an enum (`'inner'` vs `'full'`); children only need a
  // boolean "should I drop my borders?".
  const dropInnerBorders = !!borderless;

  const densityClass =
    currentDensity === "compact"
      ? "[&_td]:py-2 [&_td]:px-3 [&_td]:text-xs [&_th]:h-8 [&_th]:px-3 [&_th]:text-xs"
      : currentDensity === "comfortable"
        ? "[&_td]:py-3 [&_th]:h-12"
        : // cozy -- tightens TableCell/TableHead defaults (py-3 / h-12)
          "[&_td]:py-2 [&_th]:h-10";

  const isServerSide = totalRows >= 0;
  const [isFilterSheetOpen, setIsFilterSheetOpen] = React.useState(false);

  // ── Filter snapshot (restore on close without apply) ───────────────────
  const filterSnapshot = React.useRef<ColumnFiltersState | null>(null);
  const dateRangeSnapshot = React.useRef<Record<string, DateRangeValue> | null>(
    null,
  );
  const filterApplied = React.useRef(false);

  // ── Timers ──────────────────────────────────────────────────────────────
  const searchDebounceTimer = React.useRef<ReturnType<
    typeof setTimeout
  > | null>(null);
  const paginationEmitTimer = React.useRef<ReturnType<
    typeof setTimeout
  > | null>(null);
  const isMounted = React.useRef(false);

  React.useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (searchDebounceTimer.current)
        clearTimeout(searchDebounceTimer.current);
      if (paginationEmitTimer.current)
        clearTimeout(paginationEmitTimer.current);
    };
  }, []);

  // Custom filter functions for multiselect and date range
  const multiSelectFilterFn: FilterFn<TData> = (
    row,
    columnId,
    filterValue: string[],
  ) => {
    if (!filterValue || filterValue.length === 0) return true;
    const cellValue = String(row.getValue(columnId)).toLowerCase();
    return filterValue.some((v: string) => v.toLowerCase() === cellValue);
  };

  const dateRangeFilterFn: FilterFn<TData> = (
    row,
    columnId,
    filterValue: DateRangeValue,
  ) => {
    if (!filterValue) return true;
    const { from, to } = filterValue;
    if (!from && !to) return true;
    const cellValue = String(row.getValue(columnId));
    if (from && cellValue < from) return false;
    if (to && cellValue > to) return false;
    return true;
  };

  // Augment columns with custom filter functions based on filter definitions
  const processedColumns = React.useMemo(() => {
    return columns.map((col) => {
      const colId = (col as any).accessorKey || (col as any).id;
      const filter = filters.find((f) => f.column === colId);
      if (!filter) return col;
      if (filter.type === "multiselect")
        return { ...col, filterFn: multiSelectFilterFn };
      if (filter.type === "date")
        return { ...col, filterFn: dateRangeFilterFn };
      return col;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns, filters]);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [expanded, setExpanded] = React.useState<ExpandedState>({});
  const [columnPinning, setColumnPinning] = React.useState<ColumnPinningState>({
    left: defaultColumnPinning.left ?? [],
    right: defaultColumnPinning.right ?? [],
  });
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [grouping, setGrouping] =
    React.useState<GroupingState>(defaultGrouping);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Per-filter reactive range calendar model (ISO strings), keyed by column.
  const [dateRangeModels, setDateRangeModels] = React.useState<
    Record<string, DateRangeValue>
  >({});

  const table = useReactTable({
    data,
    columns: processedColumns,
    getCoreRowModel: getCoreRowModel(),
    // Skip client pagination entirely when disabled (not just hide the footer UI).
    getPaginationRowModel:
      isServerSide || !enablePagination ? undefined : getPaginationRowModel(),
    getSortedRowModel: isServerSide ? undefined : getSortedRowModel(),
    getFilteredRowModel: isServerSide ? undefined : getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    enableColumnResizing: enableResize,
    columnResizeMode: "onChange",
    manualPagination: isServerSide,
    manualSorting: isServerSide,
    manualFiltering: isServerSide,
    rowCount: isServerSide ? totalRows : undefined,
    onSortingChange: (updaterOrValue) => {
      if (isMounted.current) {
        valueUpdater(updaterOrValue, setSorting);
        if (isServerSide) {
          setTimeout(() => emitStateUpdate(), 0);
        }
      }
    },
    onColumnFiltersChange: (updaterOrValue) => {
      // Server-side: never auto-emit on filter change — handled by Apply / search debounce
      // Client-side inline: filters apply locally via TanStack, no emit needed
      if (isMounted.current) valueUpdater(updaterOrValue, setColumnFilters);
    },
    onColumnVisibilityChange: (updaterOrValue) => {
      if (isMounted.current) valueUpdater(updaterOrValue, setColumnVisibility);
    },
    onRowSelectionChange: (updaterOrValue) => {
      if (isMounted.current) valueUpdater(updaterOrValue, setRowSelection);
    },
    onExpandedChange: (updaterOrValue) => {
      if (isMounted.current) valueUpdater(updaterOrValue, setExpanded);
    },
    onPaginationChange: (updaterOrValue) => {
      if (isMounted.current) {
        valueUpdater(updaterOrValue, setPagination);
        if (isServerSide) {
          if (paginationEmitTimer.current)
            clearTimeout(paginationEmitTimer.current);
          paginationEmitTimer.current = setTimeout(() => emitStateUpdate(), 0);
        }
      }
    },
    onColumnPinningChange: (updaterOrValue) => {
      if (isMounted.current) valueUpdater(updaterOrValue, setColumnPinning);
    },
    onColumnOrderChange: (updaterOrValue) => {
      if (isMounted.current) valueUpdater(updaterOrValue, setColumnOrder);
    },
    onGroupingChange: (updaterOrValue) => {
      if (isMounted.current) valueUpdater(updaterOrValue, setGrouping);
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
      rowSelection,
      expanded,
      columnPinning,
      columnOrder,
      grouping,
    },
  });

  /** Build and emit current server-side state */
  function emitStateUpdate() {
    if (!isMounted.current) return;
    const s = sorting[0];
    const filterMap: Record<string, any> = {};
    for (const cf of columnFilters) {
      filterMap[cf.id] = cf.value;
    }
    onStateChange?.({
      page: table.getState().pagination.pageIndex + 1,
      pageSize: table.getState().pagination.pageSize,
      sortBy: s?.id || "",
      sortOrder: s?.desc ? "desc" : "asc",
      filters: filterMap,
      search:
        (filterColumn &&
          (table.getColumn(filterColumn)?.getFilterValue() as string)) ||
        "",
    });
  }

  function onSearchInput(val: string) {
    if (!filterColumn || !table.getColumn(filterColumn)) return;
    table.getColumn(filterColumn)?.setFilterValue(val || undefined);
    if (isServerSide) {
      if (searchDebounceTimer.current)
        clearTimeout(searchDebounceTimer.current);
      searchDebounceTimer.current = setTimeout(() => {
        table.setPageIndex(0);
        emitStateUpdate();
      }, 500);
    }
  }

  // ── Filter snapshot helpers ──────────────────────────────────────────────
  function snapshotFilters() {
    filterApplied.current = false;
    filterSnapshot.current = JSON.parse(JSON.stringify(columnFilters));
    dateRangeSnapshot.current = JSON.parse(JSON.stringify(dateRangeModels));
  }

  function maybeRestoreFilters() {
    if (!filterApplied.current && filterSnapshot.current) {
      setColumnFilters(filterSnapshot.current);
      setDateRangeModels(dateRangeSnapshot.current ?? {});
    }
    filterSnapshot.current = null;
    dateRangeSnapshot.current = null;
  }

  function onFilterSheetOpen() {
    snapshotFilters();
    setIsFilterSheetOpen(true);
  }

  function onFilterSheetClose(open: boolean) {
    if (!open) maybeRestoreFilters();
    setIsFilterSheetOpen(open);
  }

  // ── Filter helpers ─────────────────────────────────────────────────────
  function getMultiSelectValue(column: string): string[] {
    return (table.getColumn(column)?.getFilterValue() as string[]) ?? [];
  }

  function getDateRangeValue(column: string): DateRangeValue {
    return (table.getColumn(column)?.getFilterValue() as DateRangeValue) ?? {};
  }

  function getCalendarModel(column: string): DateRange | undefined {
    const dr = getDateRangeValue(column);
    if (!dr.from && !dr.to) return undefined;
    return { from: isoToDate(dr.from), to: isoToDate(dr.to) };
  }

  function onCalendarUpdate(column: string, val: DateRange | undefined) {
    const from = val?.from ? dateToIso(val.from) : undefined;
    const to = val?.to ? dateToIso(val.to) : undefined;
    setDateRangeModels((m) => ({ ...m, [column]: { from, to } }));
    const hasValue = from || to;
    table
      .getColumn(column)
      ?.setFilterValue(hasValue ? { from, to } : undefined);
  }

  function formatDateRange(column: string): string {
    const dr = getDateRangeValue(column);
    if (dr.from && dr.to) return `${dr.from} - ${dr.to}`;
    if (dr.from) return `From ${dr.from}`;
    if (dr.to) return `Until ${dr.to}`;
    return "";
  }

  function toggleMultiSelectValue(column: string, option: string) {
    const current = getMultiSelectValue(column);
    const next = current.includes(option)
      ? current.filter((v) => v !== option)
      : [...current, option];
    table.getColumn(column)?.setFilterValue(next.length > 0 ? next : undefined);
  }

  function clearAllFilters() {
    filterApplied.current = true;
    if (searchDebounceTimer.current) clearTimeout(searchDebounceTimer.current);
    filters.forEach((f) => {
      table.getColumn(f.column)?.setFilterValue(undefined);
      if (f.type === "date") {
        setDateRangeModels((m) => ({ ...m, [f.column]: {} }));
      }
    });
    if (filterColumn && table.getColumn(filterColumn)) {
      table.getColumn(filterColumn)?.setFilterValue(undefined);
    }
    if (isServerSide) {
      table.setPageIndex(0);
      queueMicrotask(() => emitStateUpdate());
    }
  }

  function isFilterActive(filter: FilterDefinition): boolean {
    const value = table.getColumn(filter.column)?.getFilterValue();
    if (value === undefined || value === "") return false;
    if (filter.type === "multiselect")
      return Array.isArray(value) && value.length > 0;
    if (filter.type === "date") {
      const d = value as DateRangeValue;
      return !!(d.from || d.to);
    }
    return true;
  }

  const hasSearchValue = !!(
    filterColumn && (table.getColumn(filterColumn)?.getFilterValue() as string)
  );
  const isAnyFilterActive = hasSearchValue || filters.some(isFilterActive);

  function getFilterSelectedLabels(filter: FilterDefinition): string[] {
    const vals = getMultiSelectValue(filter.column);
    return vals.map((v) => {
      const opt = filter.options?.find((o) => resolveOption(o).value === v);
      return opt ? resolveOption(opt).label : v;
    });
  }

  function clearFilter(filter: FilterDefinition) {
    table.getColumn(filter.column)?.setFilterValue(undefined);
  }

  const activeFilterCount = filters.filter(isFilterActive).length;

  function clearDateFilter(filter: FilterDefinition) {
    clearFilter(filter);
    setDateRangeModels((m) => ({ ...m, [filter.column]: {} }));
  }

  function onApplyFilters() {
    filterApplied.current = true;
    if (isServerSide) {
      if (table.getState().pagination.pageIndex === 0) {
        emitStateUpdate();
      } else {
        table.setPageIndex(0);
      }
    }
    setIsFilterSheetOpen(false);
  }

  /**
   * Popover filter mode: handle the staged-edit commit. Walk the draft,
   * write each column's value via `setFilterValue`, and sync the calendar
   * model for date filters so a subsequent reopen reflects the just-applied
   * range.
   */
  function onCommitDraft(draft: Record<string, any>) {
    for (const f of filters) {
      if (!(f.column in draft)) continue;
      const val = draft[f.column];
      if (f.type === "date") {
        const dr = (val ?? {}) as DateRangeValue;
        setDateRangeModels((m) => ({
          ...m,
          [f.column]: { from: dr.from, to: dr.to },
        }));
        table.getColumn(f.column)?.setFilterValue(val);
      } else {
        table.getColumn(f.column)?.setFilterValue(val);
      }
    }
    onApplyFilters();
  }

  // ── Column reorder (HTML5 drag/drop swaps dragged column with drop target) ──
  const [dragColId, setDragColId] = React.useState<string | null>(null);
  const [dragOverColId, setDragOverColId] = React.useState<string | null>(null);

  function onColDragStart(id: string, e: React.DragEvent) {
    setDragColId(id);
    document.body.style.cursor = "grabbing";
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", id);
    }
  }

  function onColDragOver(targetId: string, e: React.DragEvent) {
    if (!enableReorder || !dragColId) return;
    e.preventDefault();
    setDragOverColId(targetId);
    if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
  }

  function onColDragEnd() {
    document.body.style.cursor = "";
    setDragColId(null);
    setDragOverColId(null);
  }

  function onColDrop(targetId: string) {
    const src = dragColId;
    onColDragEnd();
    if (!src || src === targetId) return;
    const order = (
      columnOrder.length
        ? columnOrder
        : table.getAllLeafColumns().map((c) => c.id)
    ).slice();
    const from = order.indexOf(src);
    const to = order.indexOf(targetId);
    if (from === -1 || to === -1) return;
    order.splice(to, 0, ...order.splice(from, 1));
    setColumnOrder(order);
  }

  // ── Pinning — return style for sticky pinned cells (header or body) ──
  function pinStyle(col: any): React.CSSProperties | undefined {
    const side = col.getIsPinned();
    if (!side) return undefined;
    if (side === "left")
      return {
        position: "sticky",
        left: `${col.getStart("left")}px`,
        zIndex: 2,
      };
    return {
      position: "sticky",
      right: `${col.getAfter("right")}px`,
      zIndex: 2,
    };
  }

  // ── Infinite scroll — sentinel row triggers fetch-more when visible ──
  // Callback ref so the observer attaches when the sentinel mounts (not only
  // when `infinite` flips), avoiding a missed attach on first paint.
  const [sentinelNode, setSentinelNode] = React.useState<HTMLDivElement | null>(
    null,
  );
  React.useEffect(() => {
    if (!infinite || !sentinelNode) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onFetchMore?.();
      },
      { rootMargin: "100px" },
    );
    io.observe(sentinelNode);
    return () => io.disconnect();
  }, [infinite, sentinelNode, onFetchMore]);

  // ── CSV export — currently filtered + visible data, skips select/actions/expander cols. ──
  function exportCsv() {
    const visibleCols = table
      .getVisibleLeafColumns()
      .filter(
        (c) => c.id !== "select" && c.id !== "actions" && c.id !== "expander",
      );
    const headers = visibleCols.map((c) =>
      String(
        c.columnDef.header && typeof c.columnDef.header === "string"
          ? c.columnDef.header
          : c.id,
      ),
    );
    const rows = table.getFilteredRowModel().rows.map((row) =>
      visibleCols.map((c) => {
        const v = row.getValue(c.id);
        const s = v == null ? "" : String(v);
        return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
      }),
    );
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    downloadBlob(csv, "text/csv;charset=utf-8;", `export-${Date.now()}.csv`);
  }

  // ── JSON export — same scope as CSV, but emits underlying row.original objects ──
  function exportJson() {
    const visibleColIds = table
      .getVisibleLeafColumns()
      .filter(
        (c) => c.id !== "select" && c.id !== "actions" && c.id !== "expander",
      )
      .map((c) => c.id);
    const rows = table.getFilteredRowModel().rows.map((row) => {
      const original = row.original as Record<string, unknown>;
      const out: Record<string, unknown> = {};
      for (const id of visibleColIds) {
        out[id] = id in original ? original[id] : row.getValue(id);
      }
      return out;
    });
    const json = JSON.stringify(rows, null, 2);
    downloadBlob(
      json,
      "application/json;charset=utf-8;",
      `export-${Date.now()}.json`,
    );
  }

  function downloadBlob(content: string, type: string, filename: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ── TSV clipboard copy — formatted for instant paste into Excel / Sheets / Notion ──
  function copyTsv(rowsToCopy?: Row<TData>[]) {
    const visibleCols = table
      .getVisibleLeafColumns()
      .filter(
        (c) => c.id !== "select" && c.id !== "actions" && c.id !== "expander",
      );
    const headers = visibleCols.map((c) =>
      String(
        c.columnDef.header && typeof c.columnDef.header === "string"
          ? c.columnDef.header
          : c.id,
      ),
    );
    const targetRows =
      rowsToCopy && rowsToCopy.length > 0
        ? rowsToCopy
        : table.getSelectedRowModel().rows.length > 0
          ? table.getSelectedRowModel().rows
          : table.getFilteredRowModel().rows;
    const rowData = targetRows.map((row) =>
      visibleCols.map((c) => {
        const v = row.getValue(c.id);
        return v == null ? "" : String(v).replace(/[\t\n\r]/g, " ");
      }),
    );
    const tsv = [headers.join("\t"), ...rowData.map((r) => r.join("\t"))].join(
      "\n",
    );
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(tsv).catch(() => {});
    }
    return tsv;
  }

  // ── Markdown table copy — formatted for PR descriptions, issues, and docs ──
  function copyMarkdown(rowsToCopy?: Row<TData>[]) {
    const visibleCols = table
      .getVisibleLeafColumns()
      .filter(
        (c) => c.id !== "select" && c.id !== "actions" && c.id !== "expander",
      );
    const headers = visibleCols.map((c) =>
      String(
        c.columnDef.header && typeof c.columnDef.header === "string"
          ? c.columnDef.header
          : c.id,
      ),
    );
    const targetRows =
      rowsToCopy && rowsToCopy.length > 0
        ? rowsToCopy
        : table.getSelectedRowModel().rows.length > 0
          ? table.getSelectedRowModel().rows
          : table.getFilteredRowModel().rows;
    const rowData = targetRows.map((row) =>
      visibleCols.map((c) => {
        const v = row.getValue(c.id);
        return v == null ? "" : String(v).replace(/[|\n\r]/g, " ");
      }),
    );
    const sep = visibleCols.map(() => "---");
    const md = [
      `| ${headers.join(" | ")} |`,
      `| ${sep.join(" | ")} |`,
      ...rowData.map((r) => `| ${r.join(" | ")} |`),
    ].join("\n");
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(md).catch(() => {});
    }
    return md;
  }

  // ── Keyboard ergonomics & focused row tracking (Linear / Raycast craft) ───────
  const [focusedRowIndex, setFocusedRowIndex] = React.useState<number>(-1);
  const [lastSelectedRowIndex, setLastSelectedRowIndex] =
    React.useState<number>(-1);

  function onTableKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (!enableKeyboardNavigation) return;
    const target = e.target as HTMLElement | null;
    if (
      target &&
      (target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable)
    ) {
      return;
    }

    const rows = table.getRowModel().rows;
    if (!rows || rows.length === 0) return;

    const isDown = e.key === "ArrowDown" || e.key === "j";
    const isUp = e.key === "ArrowUp" || e.key === "k";
    const isSpace = e.key === " " || e.key === "x";
    const isEnter = e.key === "Enter";
    const isEscape = e.key === "Escape";
    const isSelectAll = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "a";
    const isCopy = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "c";

    if (isDown) {
      e.preventDefault();
      const nextIdx = Math.min(focusedRowIndex + 1, rows.length - 1);
      if (e.shiftKey && focusedRowIndex >= 0) {
        const start = Math.min(focusedRowIndex, nextIdx);
        const end = Math.max(focusedRowIndex, nextIdx);
        for (let i = start; i <= end; i++) {
          rows[i]?.toggleSelected(true);
        }
      }
      setFocusedRowIndex(nextIdx);
    } else if (isUp) {
      e.preventDefault();
      const prevIdx = Math.max(focusedRowIndex - 1, 0);
      if (e.shiftKey && focusedRowIndex >= 0) {
        const start = Math.min(focusedRowIndex, prevIdx);
        const end = Math.max(focusedRowIndex, prevIdx);
        for (let i = start; i <= end; i++) {
          rows[i]?.toggleSelected(true);
        }
      }
      setFocusedRowIndex(prevIdx);
    } else if (isSpace) {
      if (focusedRowIndex >= 0 && focusedRowIndex < rows.length) {
        e.preventDefault();
        rows[focusedRowIndex].toggleSelected();
        setLastSelectedRowIndex(focusedRowIndex);
      }
    } else if (isEnter) {
      if (focusedRowIndex >= 0 && focusedRowIndex < rows.length) {
        e.preventDefault();
        onRowClick?.(rows[focusedRowIndex].original);
      }
    } else if (isEscape) {
      if (table.getSelectedRowModel().rows.length > 0) {
        e.preventDefault();
        table.toggleAllRowsSelected(false);
      }
      setFocusedRowIndex(-1);
    } else if (isSelectAll) {
      e.preventDefault();
      table.toggleAllRowsSelected(true);
    } else if (isCopy) {
      const selected = table.getSelectedRowModel().rows;
      if (selected.length > 0) {
        e.preventDefault();
        copyTsv(selected);
      } else if (focusedRowIndex >= 0 && focusedRowIndex < rows.length) {
        e.preventDefault();
        copyTsv([rows[focusedRowIndex]]);
      }
    }
  }

  function onRowClicked(row: Row<TData>, idx: number, event: React.MouseEvent) {
    setFocusedRowIndex(idx);
    if (event.shiftKey && lastSelectedRowIndex >= 0) {
      const rows = table.getRowModel().rows;
      const start = Math.min(lastSelectedRowIndex, idx);
      const end = Math.max(lastSelectedRowIndex, idx);
      for (let i = start; i <= end; i++) {
        rows[i]?.toggleSelected(true);
      }
    } else {
      setLastSelectedRowIndex(idx);
    }
    onRowClick?.(row.original);
  }

  React.useImperativeHandle(forwardedRef, () => ({
    table,
    exportCsv,
    exportJson,
    copyTsv,
    copyMarkdown,
  }));

  const selectedRows = table.getSelectedRowModel().rows;

  const toolbarProps = {
    table: table as TanstackTable<any>,
    filterColumn,
    filterPlaceholder,
    filters,
    filterMode,
    enableSearch,
    enableColumnVisibility,
    enableExport,
    enableDensityToggle,
    density: currentDensity,
    activeFilterCount,
    isAnyFilterActive,
    isServerSide,
    getMultiSelectValue,
    getDateRangeValue,
    getFilterSelectedLabels,
    formatDateRange,
    getCalendarModel,
    onSearch: onSearchInput,
    onOpenFilterSheet: onFilterSheetOpen,
    onApplyFilters,
    onClearAllFilters: clearAllFilters,
    onToggleMultiselect: toggleMultiSelectValue,
    onClearFilter: clearFilter,
    onClearDateFilter: clearDateFilter,
    onCalendarUpdate,
    onTextFilterUpdate: (col: string, val: string | undefined) =>
      table.getColumn(col)?.setFilterValue(val),
    onCommitFilters: onCommitDraft,
    onExportCsv: exportCsv,
    onExportJson: exportJson,
    onCopyTsv: () => copyTsv(),
    onCopyMarkdown: () => copyMarkdown(),
    onDensityChange: setDensityOverride,
    toolbarExtra,
    customFilters,
  };

  return (
    <div
      data-uipkge=""
      data-slot="data-table"
      className="focus-visible:ring-border/50 relative w-full outline-none focus-visible:ring-1"
      tabIndex={0}
      onKeyDown={onTableKeyDown}
    >
      {/* Toolbar (above-mode: floats outside the bordered card). */}
      {!hideToolbar && toolbarPosition === "above" && (
        <DataTableToolbar {...toolbarProps} borderless />
      )}

      <div
        className={[
          "bg-card text-card-foreground overflow-hidden",
          borderless === "full" ? "" : "rounded-md border",
        ].join(" ")}
      >
        {/* Toolbar (inside-mode, default). */}
        {!hideToolbar && toolbarPosition === "inside" && (
          <DataTableToolbar {...toolbarProps} borderless={dropInnerBorders} />
        )}

        {/* Filter Sheet (modal mode) */}
        <DataTableFilterSheet
          open={isFilterSheetOpen}
          onOpenChange={onFilterSheetClose}
          table={table as TanstackTable<any>}
          filters={filters}
          activeFilterCount={activeFilterCount}
          isAnyFilterActive={isAnyFilterActive}
          isServerSide={isServerSide}
          borderless={dropInnerBorders}
          getMultiSelectValue={getMultiSelectValue}
          getDateRangeValue={getDateRangeValue}
          formatDateRange={formatDateRange}
          getCalendarModel={getCalendarModel}
          onApply={onApplyFilters}
          onClearAll={clearAllFilters}
          onToggleMultiselect={toggleMultiSelectValue}
          onClearFilter={clearFilter}
          onClearDateFilter={clearDateFilter}
          onCalendarUpdate={onCalendarUpdate}
          onTextFilterUpdate={(col, val) =>
            table.getColumn(col)?.setFilterValue(val)
          }
          customFilters={customFilters}
        />

        {/* Bulk action bar (inline mode) */}
        {bulkActionPosition === "inline" &&
          renderBulkActions &&
          selectedRows.length > 0 && (
            <div className="bg-primary/5 border-primary/15 flex items-center gap-3 border-b px-4 py-2">
              <span className="bg-primary/10 text-primary rounded-md px-2 py-0.5 text-xs font-semibold tabular-nums">
                {selectedRows.length} selected
              </span>
              <div className="flex min-w-0 flex-1 items-center gap-2">
                {renderBulkActions(selectedRows, () =>
                  table.toggleAllRowsSelected(false),
                )}
              </div>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground shrink-0 text-xs font-medium transition"
                onClick={() => table.toggleAllRowsSelected(false)}
              >
                Clear
              </button>
            </div>
          )}

        {/* Table. The Table primitive wraps the <table> in its own overflow-auto
            div; neutralize that inner overflow and let the outer scroll
            container own the scroll region. */}
        <div
          className={[
            densityClass,
            "relative [&_[data-slot=table-container]]:overflow-visible",
            maxHeight ? "overflow-auto" : "",
          ].join(" ")}
          style={maxHeight ? { maxHeight } : undefined}
        >
          <Table>
            <TableHeader
              className={
                stickyHeader
                  ? "bg-card/95 sticky top-0 z-10 shadow-[0_1px_0_0_var(--border)] backdrop-blur-sm"
                  : undefined
              }
            >
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const reorderable =
                      enableReorder &&
                      header.column.id !== "select" &&
                      header.column.id !== "actions" &&
                      header.column.id !== "expander";
                    return (
                      <TableHead
                        key={header.id}
                        className={[
                          "relative transition-colors duration-150",
                          reorderable
                            ? "cursor-grab active:cursor-grabbing"
                            : "",
                          dragColId === header.column.id ? "opacity-50" : "",
                          dragOverColId === header.column.id &&
                          dragColId !== header.column.id
                            ? "border-foreground/60 border-l-2"
                            : "",
                        ].join(" ")}
                        style={{
                          ...(enableResize
                            ? { width: `${header.getSize()}px` }
                            : {}),
                          ...(pinStyle(header.column) ?? {}),
                        }}
                        draggable={reorderable}
                        onDragStart={
                          reorderable
                            ? (e) => onColDragStart(header.column.id, e)
                            : undefined
                        }
                        onDragOver={
                          reorderable
                            ? (e) => onColDragOver(header.column.id, e)
                            : undefined
                        }
                        onDragEnd={
                          reorderable ? () => onColDragEnd() : undefined
                        }
                        onDrop={
                          reorderable
                            ? () => onColDrop(header.column.id)
                            : undefined
                        }
                      >
                        {!header.isPlaceholder &&
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        {enableResize && header.column.getCanResize() && (
                          <div
                            className={[
                              "hover:bg-foreground/30 absolute top-0 right-0 h-full w-1 cursor-col-resize touch-none transition-colors select-none",
                              header.column.getIsResizing()
                                ? "bg-foreground/60"
                                : "",
                            ].join(" ")}
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                          />
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody
              className={
                loading && table.getRowModel().rows?.length
                  ? "pointer-events-none opacity-60"
                  : undefined
              }
              aria-busy={loading || undefined}
            >
              {loading && !table.getRowModel().rows?.length ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={`sk-${i}`} className="hover:bg-transparent">
                    {Array.from({ length: Math.max(columns.length, 1) }).map(
                      (__, j) => (
                        <TableCell key={`sk-${i}-${j}`}>
                          <div
                            className="bg-muted h-4 animate-pulse rounded"
                            style={{
                              width: `${48 + ((i * 17 + j * 23) % 40)}%`,
                              maxWidth: "12rem",
                            }}
                          />
                        </TableCell>
                      ),
                    )}
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, idx) => (
                  <React.Fragment key={row.id}>
                    {row.getIsGrouped() ? (
                      <TableRow
                        className="bg-muted/50 hover:bg-muted/70 cursor-pointer"
                        onClick={() => row.toggleExpanded()}
                      >
                        <TableCell colSpan={row.getVisibleCells().length}>
                          <button
                            type="button"
                            className="flex items-center gap-2 text-sm font-medium"
                          >
                            {row.getIsExpanded() ? (
                              <ChevronDown className="size-4" />
                            ) : (
                              <ChevronRight className="size-4" />
                            )}
                            <span>{String(row.groupingValue ?? "")}</span>
                            <span className="text-muted-foreground font-normal">
                              {row.subRows.length}
                            </span>
                          </button>
                        </TableCell>
                      </TableRow>
                    ) : (
                      <>
                        <TableRow
                          data-state={
                            row.getIsSelected() ? "selected" : undefined
                          }
                          data-focused={
                            focusedRowIndex === idx ? "true" : undefined
                          }
                          className={
                            [
                              onRowClick ? "cursor-pointer" : "",
                              focusedRowIndex === idx
                                ? "ring-primary/60 bg-muted/40 ring-1 ring-inset"
                                : "",
                            ]
                              .filter(Boolean)
                              .join(" ") || undefined
                          }
                          style={
                            virtual
                              ? {
                                  contentVisibility: "auto",
                                  containIntrinsicSize: "auto 48px",
                                }
                              : undefined
                          }
                          onClick={(e) => onRowClicked(row, idx, e)}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell
                              key={cell.id}
                              className={
                                row.getIsSelected() ? "bg-muted" : "bg-card"
                              }
                              style={pinStyle(cell.column)}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                        {row.getIsExpanded() && renderExpanded && (
                          <TableRow>
                            <TableCell
                              colSpan={row.getVisibleCells().length}
                              className="bg-muted/30 px-6 py-4"
                            >
                              {renderExpanded(row.original, row)}
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={columns.length}
                    className="h-36 text-center"
                  >
                    {emptyState ?? (
                      <div className="text-muted-foreground flex flex-col items-center justify-center gap-2 py-8">
                        <div className="bg-muted/80 text-muted-foreground grid size-10 place-items-center rounded-full">
                          <Search className="size-4" aria-hidden="true" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-foreground text-sm font-medium">
                            No results
                          </p>
                          <p className="text-muted-foreground max-w-[28ch] text-xs leading-relaxed">
                            Try adjusting search or filters to find what you
                            need.
                          </p>
                        </div>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            {renderFooter && (
              <tfoot className="bg-muted/20 sticky bottom-0 border-t">
                {renderFooter(table.getRowModel().rows)}
              </tfoot>
            )}
          </Table>
          {/* Infinite scroll sentinel */}
          {infinite && <div ref={setSentinelNode} className="h-1" />}
          {infinite && loading && (
            <div className="border-border text-muted-foreground border-t px-4 py-3 text-center text-sm">
              Loading more…
            </div>
          )}
        </div>

        {/* Pagination (inside-mode, default) */}
        {enablePagination && !infinite && paginationPosition === "inside" && (
          <DataTablePagination
            table={table as TanstackTable<any>}
            totalRows={totalRows}
            isServerSide={isServerSide}
            borderless={dropInnerBorders}
          />
        )}
      </div>

      {/* Pagination (below-mode: floats outside the bordered card). */}
      {enablePagination && !infinite && paginationPosition === "below" && (
        <DataTablePagination
          table={table as TanstackTable<any>}
          totalRows={totalRows}
          isServerSide={isServerSide}
          borderless
        />
      )}

      {/* Floating Bulk Actions HUD Dock — Linear/Raycast craft dock */}
      {bulkActionPosition === "floating" && selectedRows.length > 0 && (
        <div
          data-slot="data-table-bulk-dock"
          className="border-border/80 bg-background/95 text-foreground fixed bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2.5 rounded-full border px-3.5 py-1.5 shadow-xl backdrop-blur-md select-none sm:absolute"
        >
          <span className="bg-primary/10 text-primary flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-xs font-semibold tabular-nums">
            {selectedRows.length} selected
          </span>

          <div className="bg-border h-3.5 w-px" />

          <button
            type="button"
            className="text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors"
            title="Copy selected rows as TSV (Excel / Sheets)"
            onClick={() => copyTsv(selectedRows)}
          >
            <Copy className="size-3" />
            Copy TSV
          </button>

          <button
            type="button"
            className="text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors"
            title="Export table as CSV"
            onClick={exportCsv}
          >
            <Download className="size-3" />
            Export
          </button>

          {renderBulkActions?.(selectedRows, () =>
            table.toggleAllRowsSelected(false),
          )}

          <div className="bg-border h-3.5 w-px" />

          <button
            type="button"
            className="text-muted-foreground hover:text-foreground hover:bg-muted flex size-5 items-center justify-center rounded-full transition-colors"
            title="Deselect all (Esc)"
            aria-label="Clear selection"
            onClick={() => table.toggleAllRowsSelected(false)}
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

// forwardRef + generics: cast the wrapped component back to a generic-aware
// signature so consumers keep `<DataTable<Row>>` inference.
export const DataTable = React.forwardRef(DataTableInner) as <
  TData,
  TValue = unknown,
>(
  props: DataTableProps<TData, TValue> & {
    ref?: React.Ref<DataTableHandle<TData>>;
  },
) => React.ReactElement;
