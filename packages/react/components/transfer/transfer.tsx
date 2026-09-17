"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, GripVertical, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface TransferItem {
  key: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export type TransferSide = "left" | "right";

interface TransferDragPayload {
  keys: string[];
  fromSide: TransferSide;
}

interface TransferContextValue {
  disabled: boolean;
  showSearch: boolean;
  height: number | string;
  pageSize: number | null;
  filterFn: (query: string, item: TransferItem) => boolean;
  draggable: boolean;
  selectable: boolean;
  oneWay: boolean;
  dragPayload: TransferDragPayload | null;
  startDrag: (payload: TransferDragPayload) => void;
  endDrag: () => void;
  drop: (toSide: TransferSide, beforeKey: string | null) => void;
  /** Move left→right. Optional keys override the current left selection. */
  moveRight: (keys?: string[]) => void;
  /** Move right→left. Optional keys override the current right selection. */
  moveLeft: (keys?: string[]) => void;
}

const TransferContext = React.createContext<TransferContextValue | null>(null);

function useTransferContext(): TransferContextValue {
  const ctx = React.useContext(TransferContext);
  if (!ctx) throw new Error("TransferList must be used inside <Transfer>.");
  return ctx;
}

export interface TransferProps {
  targetKeys?: string[];
  /** Uncontrolled initial target keys. */
  defaultTargetKeys?: string[];
  dataSource: TransferItem[];
  titles?: [string, string];
  showSearch?: boolean;
  filterFn?: (query: string, item: TransferItem) => boolean;
  height?: number | string;
  pagination?: boolean | { pageSize: number };
  oneWay?: boolean;
  disabled?: boolean;
  draggable?: boolean;
  selectable?: boolean;
  className?: string;
  onTargetKeysChange?: (keys: string[]) => void;
  onChange?: (
    keys: string[],
    direction: "left" | "right",
    moved: string[],
  ) => void;
  onSearch?: (payload: { direction: "left" | "right"; query: string }) => void;
  onSelectChange?: (payload: { left: string[]; right: string[] }) => void;
  /** Footer rendered under the left list. */
  footerLeft?: React.ReactNode;
  /** Footer rendered under the right list. */
  footerRight?: React.ReactNode;
}

const defaultFilter = (q: string, item: TransferItem) =>
  item.label.toLowerCase().includes(q.toLowerCase());

const Transfer = React.forwardRef<HTMLDivElement, TransferProps>(
  (
    {
      targetKeys,
      defaultTargetKeys,
      dataSource,
      titles = ["Source", "Target"],
      showSearch = false,
      filterFn,
      height = 320,
      pagination = false,
      oneWay = false,
      disabled = false,
      draggable = false,
      selectable = true,
      className,
      onTargetKeysChange,
      onChange,
      onSearch,
      onSelectChange,
      footerLeft,
      footerRight,
    },
    ref,
  ) => {
    const isControlled = targetKeys !== undefined;
    const [internalKeys, setInternalKeys] = React.useState<string[]>(
      defaultTargetKeys ?? [],
    );
    const resolvedTargetKeys = isControlled ? targetKeys : internalKeys;

    const setTargetKeys = React.useCallback(
      (next: string[]) => {
        if (!isControlled) setInternalKeys(next);
        onTargetKeysChange?.(next);
      },
      [isControlled, onTargetKeysChange],
    );

    const [selectedLeft, setSelectedLeft] = React.useState<string[]>([]);
    const [selectedRight, setSelectedRight] = React.useState<string[]>([]);
    const [dragPayload, setDragPayload] =
      React.useState<TransferDragPayload | null>(null);

    const dataMap = React.useMemo(
      () => new Map(dataSource.map((i) => [i.key, i])),
      [dataSource],
    );

    const sourceItems = React.useMemo(
      () => dataSource.filter((i) => !resolvedTargetKeys.includes(i.key)),
      [dataSource, resolvedTargetKeys],
    );

    // When draggable, target order follows targetKeys exactly so reorder persists.
    // Otherwise keep legacy dataSource ordering for backwards compat.
    const targetItems = React.useMemo<TransferItem[]>(() => {
      if (draggable) {
        const out: TransferItem[] = [];
        for (const k of resolvedTargetKeys) {
          const item = dataMap.get(k);
          if (item) out.push(item);
        }
        return out;
      }
      return dataSource.filter((i) => resolvedTargetKeys.includes(i.key));
    }, [draggable, resolvedTargetKeys, dataMap, dataSource]);

    const pageSize = React.useMemo<number | null>(() => {
      if (pagination === false) return null;
      if (pagination === true) return 10;
      return pagination.pageSize;
    }, [pagination]);

    const startDrag = React.useCallback((payload: TransferDragPayload) => {
      setDragPayload(payload);
    }, []);

    const endDrag = React.useCallback(() => {
      setDragPayload(null);
    }, []);

    // Refs so the stable `drop` callback always reads current values.
    const stateRef = React.useRef({
      resolvedTargetKeys,
      dragPayload,
      selectedLeft,
      selectedRight,
      dataMap,
      disabled,
      oneWay,
    });
    stateRef.current = {
      resolvedTargetKeys,
      dragPayload,
      selectedLeft,
      selectedRight,
      dataMap,
      disabled,
      oneWay,
    };

    const drop = React.useCallback(
      (toSide: TransferSide, beforeKey: string | null) => {
        const s = stateRef.current;
        const payload = s.dragPayload;
        setDragPayload(null);
        if (!payload || s.disabled) return;
        const keys = payload.keys.filter((k) => {
          const item = s.dataMap.get(k);
          return item && !item.disabled;
        });
        if (keys.length === 0) return;

        // left → left: reorder source not supported (parent owns dataSource order). No-op.
        if (payload.fromSide === "left" && toSide === "left") return;

        // right → left: remove from targetKeys (skip when oneWay).
        if (payload.fromSide === "right" && toSide === "left") {
          if (s.oneWay) return;
          const removeSet = new Set(keys);
          const next = s.resolvedTargetKeys.filter((k) => !removeSet.has(k));
          const nextRight = s.selectedRight.filter((k) => !removeSet.has(k));
          setSelectedRight(nextRight);
          setTargetKeys(next);
          onChange?.(next, "left", keys);
          onSelectChange?.({ left: s.selectedLeft, right: nextRight });
          return;
        }

        // → right: insert (cross-list move) or reorder (within-target).
        const movingSet = new Set(keys);
        const without = s.resolvedTargetKeys.filter((k) => !movingSet.has(k));
        let insertAt = without.length;
        if (beforeKey != null) {
          const idx = without.indexOf(beforeKey);
          if (idx >= 0) insertAt = idx;
        }
        const next = [
          ...without.slice(0, insertAt),
          ...keys,
          ...without.slice(insertAt),
        ];
        if (payload.fromSide === "left") {
          const movedSet = new Set(keys);
          const nextLeft = s.selectedLeft.filter((k) => !movedSet.has(k));
          setSelectedLeft(nextLeft);
          setTargetKeys(next);
          onChange?.(next, "right", keys);
          onSelectChange?.({ left: nextLeft, right: s.selectedRight });
        } else {
          // right → right: pure reorder, no change event (target set unchanged).
          setTargetKeys(next);
        }
      },
      [setTargetKeys, onChange, onSelectChange],
    );

    function onLeftSelected(keys: string[]) {
      setSelectedLeft(keys);
      onSelectChange?.({ left: keys, right: selectedRight });
    }

    function onRightSelected(keys: string[]) {
      setSelectedRight(keys);
      onSelectChange?.({ left: selectedLeft, right: keys });
    }

    const moveRight = React.useCallback(
      (keys?: string[]) => {
        if (disabled) return;
        const s = stateRef.current;
        const moved = keys?.length ? [...keys] : [...s.selectedLeft];
        if (moved.length === 0) return;
        const next = [
          ...s.resolvedTargetKeys,
          ...moved.filter((k) => !s.resolvedTargetKeys.includes(k)),
        ];
        const nextLeft = s.selectedLeft.filter((k) => !moved.includes(k));
        setSelectedLeft(nextLeft);
        setTargetKeys(next);
        onChange?.(next, "right", moved);
        onSelectChange?.({ left: nextLeft, right: s.selectedRight });
      },
      [disabled, setTargetKeys, onChange, onSelectChange],
    );

    const moveLeft = React.useCallback(
      (keys?: string[]) => {
        if (disabled || oneWay) return;
        const s = stateRef.current;
        const moved = keys?.length ? [...keys] : [...s.selectedRight];
        if (moved.length === 0) return;
        const remove = new Set(moved);
        const next = s.resolvedTargetKeys.filter((k) => !remove.has(k));
        const nextRight = s.selectedRight.filter((k) => !remove.has(k));
        setSelectedRight(nextRight);
        setTargetKeys(next);
        onChange?.(next, "left", moved);
        onSelectChange?.({ left: s.selectedLeft, right: nextRight });
      },
      [disabled, oneWay, setTargetKeys, onChange, onSelectChange],
    );

    const contextValue = React.useMemo<TransferContextValue>(
      () => ({
        disabled,
        showSearch,
        height,
        pageSize,
        filterFn: filterFn ?? defaultFilter,
        draggable,
        selectable,
        oneWay,
        dragPayload,
        startDrag,
        endDrag,
        drop,
        moveRight,
        moveLeft,
      }),
      [
        disabled,
        showSearch,
        height,
        pageSize,
        filterFn,
        draggable,
        selectable,
        oneWay,
        dragPayload,
        startDrag,
        endDrag,
        drop,
        moveRight,
        moveLeft,
      ],
    );

    return (
      <TransferContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn("flex items-stretch gap-3", className)}
          data-uipkge=""
          data-slot="transfer"
        >
          <div className="min-w-0 flex-1">
            <TransferList
              side="left"
              title={titles[0]}
              items={sourceItems}
              selected={selectedLeft}
              onSelectedChange={onLeftSelected}
              onSearch={(q) => onSearch?.({ direction: "left", query: q })}
              footer={footerLeft}
            />
          </div>
          <TransferOperation
            canMoveRight={selectedLeft.length > 0 && !disabled}
            canMoveLeft={selectedRight.length > 0 && !disabled}
            oneWay={oneWay}
            onMoveRight={moveRight}
            onMoveLeft={moveLeft}
          />
          <div className="min-w-0 flex-1">
            <TransferList
              side="right"
              title={titles[1]}
              items={targetItems}
              selected={selectedRight}
              onSelectedChange={onRightSelected}
              onSearch={(q) => onSearch?.({ direction: "right", query: q })}
              footer={footerRight}
            />
          </div>
        </div>
      </TransferContext.Provider>
    );
  },
);
Transfer.displayName = "Transfer";

interface TransferOperationProps {
  canMoveRight: boolean;
  canMoveLeft: boolean;
  oneWay?: boolean;
  onMoveRight: () => void;
  onMoveLeft: () => void;
}

function TransferOperation({
  canMoveRight,
  canMoveLeft,
  oneWay,
  onMoveRight,
  onMoveLeft,
}: TransferOperationProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-2">
      <Button
        size="icon-sm"
        variant="outline"
        disabled={!canMoveRight}
        aria-label="Move selected to right"
        onClick={onMoveRight}
      >
        <ChevronRight aria-hidden="true" />
      </Button>
      {!oneWay && (
        <Button
          size="icon-sm"
          variant="outline"
          disabled={!canMoveLeft}
          aria-label="Move selected to left"
          onClick={onMoveLeft}
        >
          <ChevronLeft aria-hidden="true" />
        </Button>
      )}
    </div>
  );
}

interface TransferListProps {
  side: TransferSide;
  title: string;
  items: TransferItem[];
  selected: string[];
  onSelectedChange: (keys: string[]) => void;
  onSearch: (query: string) => void;
  footer?: React.ReactNode;
}

function TransferList({
  side,
  title,
  items,
  selected,
  onSelectedChange,
  onSearch,
  footer,
}: TransferListProps) {
  const ctx = useTransferContext();

  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(1);

  const filtered = React.useMemo(() => {
    if (!query) return items;
    return items.filter((i) => ctx.filterFn(query, i));
  }, [query, items, ctx]);

  const effectivePageSize = ctx.pageSize ?? Math.max(1, filtered.length);
  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / effectivePageSize),
  );

  const visible = React.useMemo(() => {
    if (!ctx.pageSize) return filtered;
    const start = (page - 1) * effectivePageSize;
    return filtered.slice(start, start + effectivePageSize);
  }, [ctx.pageSize, filtered, page, effectivePageSize]);

  React.useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const visibleEnabledKeys = React.useMemo(
    () => visible.filter((i) => !i.disabled).map((i) => i.key),
    [visible],
  );
  const selectedSet = React.useMemo(() => new Set(selected), [selected]);

  const visibleSelectedCount = visibleEnabledKeys.filter((k) =>
    selectedSet.has(k),
  ).length;

  const masterChecked =
    visibleEnabledKeys.length > 0 &&
    visibleSelectedCount === visibleEnabledKeys.length;
  const masterIndeterminate =
    visibleSelectedCount > 0 &&
    visibleSelectedCount < visibleEnabledKeys.length;

  const [lastAnchor, setLastAnchor] = React.useState<string | null>(null);

  function toggleAll(checked: boolean) {
    let next = [...selected];
    if (checked) {
      for (const k of visibleEnabledKeys) {
        if (!selectedSet.has(k)) next.push(k);
      }
    } else {
      next = next.filter((k) => !visibleEnabledKeys.includes(k));
    }
    onSelectedChange(next);
  }

  function toggleItem(item: TransferItem, checked: boolean) {
    if (item.disabled || ctx.disabled) return;
    let next = [...selected];
    if (checked) {
      if (!next.includes(item.key)) next.push(item.key);
    } else {
      next = next.filter((k) => k !== item.key);
    }
    onSelectedChange(next);
    setLastAnchor(item.key);
  }

  function onRowClick(e: React.MouseEvent, item: TransferItem) {
    if (item.disabled || ctx.disabled) return;
    // With checkbox visible, click toggles (matches checkbox UX).
    if (ctx.selectable) {
      toggleItem(item, !selectedSet.has(item.key));
      return;
    }
    // No checkbox: desktop list pattern — plain=replace, cmd/ctrl=toggle, shift=range.
    const enabledKeys = visible.filter((i) => !i.disabled).map((i) => i.key);
    if (e.shiftKey && lastAnchor && enabledKeys.includes(lastAnchor)) {
      const start = enabledKeys.indexOf(lastAnchor);
      const end = enabledKeys.indexOf(item.key);
      const [lo, hi] = start < end ? [start, end] : [end, start];
      onSelectedChange(enabledKeys.slice(lo, hi + 1));
      return;
    }
    if (e.metaKey || e.ctrlKey) {
      let next = [...selected];
      if (selectedSet.has(item.key)) next = next.filter((k) => k !== item.key);
      else next.push(item.key);
      onSelectedChange(next);
      setLastAnchor(item.key);
      return;
    }
    onSelectedChange([item.key]);
    setLastAnchor(item.key);
  }

  function getOptionRows(from: HTMLElement): HTMLElement[] {
    const list = from.closest('[role="listbox"]');
    if (!list) return [];
    return Array.from(
      list.querySelectorAll<HTMLElement>(
        '[role="option"]:not([aria-disabled="true"])',
      ),
    );
  }

  function focusOption(el: HTMLElement | null | undefined) {
    el?.focus();
  }

  function onRowKeydown(e: React.KeyboardEvent, item: TransferItem) {
    const target = e.currentTarget as HTMLElement;

    // Arrow navigation within the list.
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const rows = getOptionRows(target);
      const idx = rows.indexOf(target);
      if (idx < 0) return;
      focusOption(e.key === "ArrowDown" ? rows[idx + 1] : rows[idx - 1]);
      return;
    }

    if (e.key === "Home") {
      e.preventDefault();
      focusOption(getOptionRows(target)[0]);
      return;
    }

    if (e.key === "End") {
      e.preventDefault();
      const rows = getOptionRows(target);
      focusOption(rows[rows.length - 1]);
      return;
    }

    // Keys to transfer: current multi-selection, or just the focused item.
    const keysToTransfer = (): string[] => {
      if (selectedSet.has(item.key) && selected.length > 0) {
        return selected.filter((k) => {
          const i = items.find((x) => x.key === k);
          return i && !i.disabled;
        });
      }
      return item.disabled ? [] : [item.key];
    };

    // Ctrl/Cmd+Enter transfers selected items (or the focused item if none selected).
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (item.disabled || ctx.disabled) return;
      const keys = keysToTransfer();
      if (!keys.length) return;
      if (side === "left") ctx.moveRight(keys);
      else if (!ctx.oneWay) ctx.moveLeft(keys);
      return;
    }

    // Alt+Arrow transfers without redesigning the button strip.
    if (e.key === "ArrowRight" && e.altKey && side === "left") {
      e.preventDefault();
      if (item.disabled || ctx.disabled) return;
      const keys = keysToTransfer();
      if (keys.length) ctx.moveRight(keys);
      return;
    }

    if (e.key === "ArrowLeft" && e.altKey && side === "right" && !ctx.oneWay) {
      e.preventDefault();
      if (item.disabled || ctx.disabled) return;
      const keys = keysToTransfer();
      if (keys.length) ctx.moveLeft(keys);
      return;
    }

    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    if (item.disabled || ctx.disabled) return;
    if (ctx.selectable) {
      toggleItem(item, !selectedSet.has(item.key));
      return;
    }
    // Keyboard without modifiers: toggle single-item selection (desktop replace).
    onSelectedChange(
      selectedSet.has(item.key) && selected.length === 1 ? [] : [item.key],
    );
    setLastAnchor(item.key);
  }

  function handleSearch(v: string) {
    setQuery(v);
    setPage(1);
    onSearch(v);
  }

  function prevPage() {
    if (page > 1) setPage((p) => p - 1);
  }

  function nextPage() {
    if (page < totalPages) setPage((p) => p + 1);
  }

  const heightStyle: React.CSSProperties = {
    height: typeof ctx.height === "number" ? ctx.height + "px" : ctx.height,
  };

  // ----- DnD -----

  const [dropIndicator, setDropIndicator] = React.useState<{
    key: string;
    position: "before" | "after";
  } | null>(null);
  const [draggingKeys, setDraggingKeys] = React.useState<Set<string>>(
    new Set(),
  );

  const isDropTarget = React.useMemo(() => {
    const p = ctx.dragPayload;
    if (!p) return false;
    // left list rejects drops when oneWay
    if (side === "left" && ctx.oneWay && p.fromSide === "right") return false;
    // left → left is a no-op (parent owns dataSource order)
    if (side === "left" && p.fromSide === "left") return false;
    return true;
  }, [ctx.dragPayload, ctx.oneWay, side]);

  function onItemDragStart(e: React.DragEvent, item: TransferItem) {
    if (!ctx.draggable || item.disabled || ctx.disabled) {
      e.preventDefault();
      return;
    }
    // If the dragged row is part of the current selection, drag the whole selection.
    // Else, drag just this row (and clear selection visually for clarity).
    const keys = selectedSet.has(item.key)
      ? selected.filter((k) => {
          const i = items.find((x) => x.key === k);
          return i && !i.disabled;
        })
      : [item.key];
    setDraggingKeys(new Set(keys));
    ctx.startDrag({ keys, fromSide: side });
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
      // Required by Firefox to actually start the drag.
      try {
        e.dataTransfer.setData("text/plain", keys.join(","));
      } catch {
        /* noop */
      }
    }
  }

  function onItemDragEnd() {
    setDraggingKeys(new Set());
    setDropIndicator(null);
    ctx.endDrag();
  }

  function onItemDragOver(e: React.DragEvent, item: TransferItem) {
    if (!isDropTarget) return;
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
    if (side !== "right") {
      // left list: no insertion indicator, drop just removes from target
      return;
    }
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const after = e.clientY > rect.top + rect.height / 2;
    setDropIndicator({ key: item.key, position: after ? "after" : "before" });
  }

  function onItemDrop(e: React.DragEvent, item: TransferItem) {
    if (!isDropTarget) return;
    e.preventDefault();
    e.stopPropagation();
    if (side === "right") {
      const after = dropIndicator?.position === "after";
      const idx = items.findIndex((x) => x.key === item.key);
      const beforeKey = after ? (items[idx + 1]?.key ?? null) : item.key;
      ctx.drop("right", beforeKey);
    } else {
      ctx.drop("left", null);
    }
    setDropIndicator(null);
  }

  function onListDragOver(e: React.DragEvent) {
    if (!isDropTarget) return;
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
  }

  function onListDrop(e: React.DragEvent) {
    if (!isDropTarget) return;
    e.preventDefault();
    // Empty zone or below all items → append (right) / remove (left).
    ctx.drop(side, null);
    setDropIndicator(null);
  }

  function onListDragLeave(e: React.DragEvent) {
    // Clear indicator only when leaving the list container, not when crossing item rows.
    const related = e.relatedTarget as Node | null;
    const current = e.currentTarget as Node;
    if (!related || !current.contains(related)) {
      setDropIndicator(null);
    }
  }

  return (
    <div
      className={cn(
        "bg-card flex flex-col overflow-hidden rounded-md border transition-colors",
        ctx.dragPayload && isDropTarget && "ring-ring/40 ring-1",
      )}
    >
      <div className="bg-muted/40 flex items-center justify-between gap-2 border-b px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          {ctx.selectable && (
            <Checkbox
              checked={masterIndeterminate ? "indeterminate" : masterChecked}
              disabled={ctx.disabled || visibleEnabledKeys.length === 0}
              aria-label={`Select all in ${title}`}
              onCheckedChange={(c) => toggleAll(c === true)}
            />
          )}
          <span className="truncate text-sm font-medium">{title}</span>
        </div>
        <span className="text-muted-foreground text-xs tabular-nums">
          {" "}
          {selected.length}/{items.length}{" "}
        </span>
      </div>

      {ctx.showSearch && (
        <div className="border-b p-2">
          <div className="relative">
            <Search
              className="text-muted-foreground pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2"
              aria-hidden="true"
            />
            <Input
              value={query}
              placeholder="Search"
              aria-label={`Search ${title}`}
              className="h-8 pl-8"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
      )}

      <ScrollArea
        style={heightStyle}
        className="flex-1"
        onDragOver={onListDragOver}
        onDrop={onListDrop}
        onDragLeave={onListDragLeave}
      >
        <ul
          role="listbox"
          aria-label={title}
          aria-multiselectable="true"
          className="py-1"
        >
          {visible.map((item) => (
            <li
              key={item.key}
              role="option"
              aria-selected={selectedSet.has(item.key)}
              aria-disabled={item.disabled || undefined}
              tabIndex={item.disabled || ctx.disabled ? -1 : 0}
              draggable={ctx.draggable && !item.disabled && !ctx.disabled}
              className={cn(
                "hover:bg-accent focus-visible:ring-ring relative flex min-h-11 cursor-pointer items-start gap-2 px-3 py-3 text-sm select-none focus-visible:ring-2 focus-visible:outline-none",
                item.disabled && "cursor-not-allowed opacity-50",
                draggingKeys.has(item.key) && "opacity-40",
                !ctx.selectable && selectedSet.has(item.key) && "bg-accent",
              )}
              onClick={(e) => onRowClick(e, item)}
              onKeyDown={(e) => onRowKeydown(e, item)}
              onDragStart={(e) => onItemDragStart(e, item)}
              onDragEnd={onItemDragEnd}
              onDragOver={(e) => onItemDragOver(e, item)}
              onDrop={(e) => onItemDrop(e, item)}
            >
              {dropIndicator &&
                dropIndicator.key === item.key &&
                dropIndicator.position === "before" &&
                side === "right" && (
                  <span
                    className="bg-primary pointer-events-none absolute -top-px right-2 left-2 h-0.5 rounded-full"
                    aria-hidden="true"
                  />
                )}
              {dropIndicator &&
                dropIndicator.key === item.key &&
                dropIndicator.position === "after" &&
                side === "right" && (
                  <span
                    className="bg-primary pointer-events-none absolute right-2 -bottom-px left-2 h-0.5 rounded-full"
                    aria-hidden="true"
                  />
                )}
              {ctx.selectable && (
                <Checkbox
                  checked={selectedSet.has(item.key)}
                  disabled={item.disabled || ctx.disabled}
                  onCheckedChange={(c) => toggleItem(item, c === true)}
                  onClick={(e) => e.stopPropagation()}
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="truncate">{item.label}</div>
                {item.description && (
                  <div className="text-muted-foreground truncate text-xs">
                    {item.description}
                  </div>
                )}
              </div>
              {ctx.draggable && !item.disabled && (
                <GripVertical
                  className="text-muted-foreground/60 mt-0.5 size-3.5 shrink-0"
                  aria-hidden="true"
                />
              )}
            </li>
          ))}
          {visible.length === 0 && (
            <li className="text-muted-foreground px-3 py-6 text-center text-sm">
              No items
            </li>
          )}
        </ul>
      </ScrollArea>

      {ctx.pageSize && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 border-t p-2 text-xs">
          <button
            type="button"
            className="hover:bg-accent focus-visible:ring-ring rounded px-2 py-1 focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            disabled={page <= 1}
            aria-label={`Previous page of ${title}`}
            onClick={prevPage}
          >
            Prev
          </button>
          <span className="tabular-nums" aria-live="polite">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            className="hover:bg-accent focus-visible:ring-ring rounded px-2 py-1 focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            disabled={page >= totalPages}
            aria-label={`Next page of ${title}`}
            onClick={nextPage}
          >
            Next
          </button>
        </div>
      )}

      {footer && <div className="border-t p-2">{footer}</div>}
    </div>
  );
}

export { Transfer, TransferList, TransferOperation };
