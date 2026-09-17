"use client";

/**
 * Popover variant of DataTableFilterSheet. Same filter UI (text /
 * multiselect / date) packed into a Popover instead of a side Sheet.
 * Slot in via `filterMode="popover"` on <DataTable>.
 *
 * Trigger button is rendered inline by the toolbar; this component owns
 * the popover surface and content.
 *
 * ── Draft semantics ──────────────────────────────────────────────────
 * Unlike the Sheet (which mutates live TanStack column filters and rolls
 * back on cancel via a parent snapshot), this popover stages every edit
 * inside a local `draft` map. Real `columnFilters` are never touched
 * until the user clicks Apply -- at which point we emit `onCommitDraft`
 * with the full draft and the parent walks the entries calling
 * `setFilterValue` per column. Closing the popover (Escape / click out)
 * simply discards the draft.
 */
import * as React from "react";
import type { Table } from "@tanstack/react-table";
import type { DateRange } from "react-day-picker";
import { Check, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RangeCalendar } from "@/components/ui/range-calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { type FilterDefinition, resolveOption } from "./types";
import { isoToDate, dateToIso } from "./date-utils";

type DraftDateValue = { from?: string; to?: string };
type DraftValue = string[] | string | DraftDateValue | undefined;
type Draft = Record<string, DraftValue>;

export interface DataTableFilterPopoverProps {
  table: Table<any>;
  filters: FilterDefinition[];
  activeFilterCount: number;
  isAnyFilterActive: boolean;
  isServerSide: boolean;
  getMultiSelectValue: (column: string) => string[];
  getDateRangeValue: (column: string) => { from?: string; to?: string };
  formatDateRange: (column: string) => string;
  getCalendarModel: (column: string) => DateRange | undefined;
  // Committed draft on Apply -- a `Record<columnId, value>` where each
  // value is the final shape TanStack's `setFilterValue` expects.
  onCommitDraft: (draft: Draft) => void;
  onClearAll: () => void;
  customFilters?: React.ReactNode;
}

export function DataTableFilterPopover({
  table,
  filters,
  activeFilterCount,
  isAnyFilterActive: _isAnyFilterActive,
  isServerSide,
  getMultiSelectValue,
  getDateRangeValue,
  formatDateRange: _formatDateRange,
  getCalendarModel: _getCalendarModel,
  onCommitDraft,
  onClearAll: _onClearAll,
  customFilters,
}: DataTableFilterPopoverProps) {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<Draft>({});
  const filterScrollRef = React.useRef<HTMLDivElement | null>(null);

  function seedDraft(): Draft {
    const next: Draft = {};
    for (const f of filters) {
      if (f.type === "multiselect" || f.type === "select") {
        next[f.column] = [...getMultiSelectValue(f.column)];
      } else if (f.type === "date") {
        const dr = getDateRangeValue(f.column);
        next[f.column] = { from: dr.from, to: dr.to };
      } else if (f.type === "text") {
        const v = table.getColumn(f.column)?.getFilterValue() as
          string | undefined;
        next[f.column] = v ?? "";
      }
    }
    return next;
  }

  function getDraftMulti(column: string): string[] {
    const v = draft[column];
    return Array.isArray(v) ? v : [];
  }

  function getDraftText(column: string): string {
    const v = draft[column];
    return typeof v === "string" ? v : "";
  }

  function getDraftDate(column: string): DraftDateValue {
    const v = draft[column];
    if (v && typeof v === "object" && !Array.isArray(v))
      return v as DraftDateValue;
    return {};
  }

  function toggleDraftMulti(column: string, option: string) {
    const current = getDraftMulti(column);
    const next = current.includes(option)
      ? current.filter((v) => v !== option)
      : [...current, option];
    setDraft((d) => ({ ...d, [column]: next }));
  }

  function setDraftText(column: string, value: string) {
    setDraft((d) => ({ ...d, [column]: value }));
  }

  function clearDraftSection(filter: FilterDefinition) {
    if (filter.type === "multiselect" || filter.type === "select") {
      setDraft((d) => ({ ...d, [filter.column]: [] }));
    } else if (filter.type === "date") {
      setDraft((d) => ({ ...d, [filter.column]: {} }));
    } else if (filter.type === "text") {
      setDraft((d) => ({ ...d, [filter.column]: "" }));
    }
  }

  function resetDraft() {
    const next: Draft = {};
    for (const f of filters) {
      if (f.type === "multiselect" || f.type === "select") next[f.column] = [];
      else if (f.type === "date") next[f.column] = {};
      else if (f.type === "text") next[f.column] = "";
    }
    setDraft(next);
  }

  // ── Date helpers (local; popover is fully self-contained for draft) ──
  function getDraftCalendarModel(column: string): DateRange | undefined {
    const dr = getDraftDate(column);
    if (!dr.from && !dr.to) return undefined;
    return {
      from: isoToDate(dr.from),
      to: isoToDate(dr.to),
    };
  }

  function onDraftCalendarUpdate(column: string, val: DateRange | undefined) {
    const from = val?.from ? dateToIso(val.from) : undefined;
    const to = val?.to ? dateToIso(val.to) : undefined;
    setDraft((d) => ({ ...d, [column]: { from, to } }));
  }

  function formatDraftDateRange(column: string): string {
    const dr = getDraftDate(column);
    if (dr.from && dr.to) return `${dr.from} - ${dr.to}`;
    if (dr.from) return `From ${dr.from}`;
    if (dr.to) return `Until ${dr.to}`;
    return "";
  }

  function isDraftSectionActive(filter: FilterDefinition): boolean {
    if (filter.type === "multiselect" || filter.type === "select") {
      return getDraftMulti(filter.column).length > 0;
    }
    if (filter.type === "date") {
      const dr = getDraftDate(filter.column);
      return !!(dr.from || dr.to);
    }
    if (filter.type === "text") {
      return !!getDraftText(filter.column);
    }
    return false;
  }

  // `Reset` is disabled when the draft has nothing to clear.
  const isDraftDirty = filters.some(isDraftSectionActive);

  function handleOpenChange(isOpen: boolean) {
    if (isOpen) {
      setDraft(seedDraft());
      setOpen(true);
      setTimeout(() => filterScrollRef.current?.scrollTo({ top: 0 }), 50);
    } else {
      // Close-without-apply: nothing to commit. Real column filters were never
      // mutated by the popover; the draft is local and discarded.
      setDraft({});
      setOpen(false);
    }
  }

  function applyAndClose() {
    const snapshot: Draft = {};
    for (const f of filters) {
      const v = draft[f.column];
      if (f.type === "multiselect" || f.type === "select") {
        const arr = Array.isArray(v) ? v : [];
        snapshot[f.column] = arr.length > 0 ? arr : undefined;
      } else if (f.type === "date") {
        const dr =
          v && typeof v === "object" && !Array.isArray(v)
            ? (v as DraftDateValue)
            : {};
        snapshot[f.column] =
          dr.from || dr.to ? { from: dr.from, to: dr.to } : undefined;
      } else if (f.type === "text") {
        const s = typeof v === "string" ? v : "";
        snapshot[f.column] = s || undefined;
      }
    }
    onCommitDraft(snapshot);
    setOpen(false);
  }

  const filteredRowCount = table.getFilteredRowModel().rows.length;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={[
            "h-8 gap-2",
            activeFilterCount > 0
              ? "border-primary/40 bg-primary/5 text-primary hover:bg-primary/10"
              : "",
          ].join(" ")}
        >
          <SlidersHorizontal className="size-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge className="bg-primary text-primary-foreground ml-0.5 size-5 rounded-full p-0 text-xs font-semibold">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="flex max-h-[min(560px,80vh)] w-[380px] flex-col overflow-hidden p-0"
      >
        {/* Header */}
        <div className="border-b px-4 pt-3.5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="bg-muted flex size-7 items-center justify-center rounded-md">
              <SlidersHorizontal className="text-muted-foreground size-3.5" />
            </div>
            <div className="flex-1">
              <p className="text-sm leading-none font-semibold">Filters</p>
              <p className="text-muted-foreground mt-1 text-xs">
                {activeFilterCount > 0 ? (
                  <>
                    {activeFilterCount} active
                    {!isServerSide && (
                      <>
                        {" "}
                        &middot; {filteredRowCount} result
                        {filteredRowCount !== 1 ? "s" : ""}
                      </>
                    )}
                  </>
                ) : (
                  "Narrow down results"
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable filter sections */}
        <div ref={filterScrollRef} className="flex-1 overflow-y-auto">
          <div className="space-y-2 p-3">
            {filters.map((filter) => {
              if (filter.type === "text") {
                return (
                  <div
                    key={filter.column}
                    className="bg-muted/40 rounded-lg p-2.5"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <Label className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                        {filter.label}
                      </Label>
                      {getDraftText(filter.column) && (
                        <button
                          type="button"
                          className="text-muted-foreground hover:text-foreground text-xs transition-colors"
                          onClick={() => clearDraftSection(filter)}
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <Input
                      placeholder={`Filter by ${filter.label.toLowerCase()}...`}
                      value={getDraftText(filter.column)}
                      className="h-8 text-sm"
                      onChange={(e) =>
                        setDraftText(filter.column, e.target.value ?? "")
                      }
                    />
                  </div>
                );
              }

              if (filter.type === "multiselect" || filter.type === "select") {
                const multi = getDraftMulti(filter.column);
                return (
                  <div
                    key={filter.column}
                    className={[
                      "rounded-lg p-2.5 transition-colors",
                      multi.length > 0
                        ? "bg-primary/[0.04] ring-primary/20 ring-1"
                        : "bg-muted/40",
                    ].join(" ")}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Label className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                          {filter.label}
                        </Label>
                        {multi.length > 0 && (
                          <Badge
                            variant="secondary"
                            className="bg-primary/15 text-primary h-4 rounded-full px-1.5 text-xs font-semibold"
                          >
                            {multi.length}
                          </Badge>
                        )}
                      </div>
                      {multi.length > 0 && (
                        <button
                          type="button"
                          className="text-muted-foreground hover:text-foreground text-xs transition-colors"
                          onClick={() => clearDraftSection(filter)}
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <Command className="[&_[data-slot=command-input-wrapper]]:border-input overflow-visible bg-transparent [&_[data-slot=command-input-wrapper]]:h-8 [&_[data-slot=command-input-wrapper]]:rounded-md [&_[data-slot=command-input-wrapper]]:border [&_[data-slot=command-input-wrapper]]:px-2.5">
                      <CommandInput
                        className="h-7 text-sm"
                        placeholder={`Search ${filter.label.toLowerCase()}...`}
                      />
                      <CommandList className="mt-1 max-h-[132px]">
                        <CommandEmpty>No results.</CommandEmpty>
                        <CommandGroup className="p-0">
                          {filter.options?.map((rawOpt) => {
                            const opt = resolveOption(rawOpt);
                            const OptIcon = opt.icon;
                            return (
                              <CommandItem
                                key={opt.value}
                                value={opt.label}
                                className="rounded-md px-2 py-1.5 text-sm"
                                onSelect={() =>
                                  toggleDraftMulti(filter.column, opt.value)
                                }
                              >
                                <div
                                  className={[
                                    "flex size-4 shrink-0 items-center justify-center rounded-sm border transition-colors",
                                    multi.includes(opt.value)
                                      ? "border-primary bg-primary text-primary-foreground"
                                      : "border-muted-foreground/40 [&_svg]:invisible",
                                  ].join(" ")}
                                >
                                  <Check className="size-3" />
                                </div>
                                {OptIcon && (
                                  <OptIcon className="text-muted-foreground size-4" />
                                )}
                                <span>{opt.label}</span>
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </div>
                );
              }

              if (filter.type === "date") {
                const dr = getDraftDate(filter.column);
                const hasDate = !!(dr.from || dr.to);
                return (
                  <div
                    key={filter.column}
                    className={[
                      "rounded-lg p-2.5 transition-colors",
                      hasDate
                        ? "bg-primary/[0.04] ring-primary/20 ring-1"
                        : "bg-muted/40",
                    ].join(" ")}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Label className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                          {filter.label}
                        </Label>
                        {hasDate && (
                          <Badge
                            variant="secondary"
                            className="bg-primary/15 text-primary h-auto rounded-full px-1.5 py-0 text-xs font-medium"
                          >
                            {formatDraftDateRange(filter.column)}
                          </Badge>
                        )}
                      </div>
                      {hasDate && (
                        <button
                          type="button"
                          className="text-muted-foreground hover:text-foreground text-xs transition-colors"
                          onClick={() => clearDraftSection(filter)}
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <div className="flex justify-center overflow-hidden rounded-md border">
                      <RangeCalendar
                        selected={getDraftCalendarModel(filter.column)}
                        numberOfMonths={1}
                        className="p-2"
                        onSelect={(range) =>
                          onDraftCalendarUpdate(filter.column, range)
                        }
                      />
                    </div>
                  </div>
                );
              }

              return null;
            })}

            {/* Consumer-supplied custom filter UI */}
            {customFilters}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 border-t px-3 py-2.5">
          <Button
            variant="outline"
            size="sm"
            className="h-8 flex-1"
            disabled={!isDraftDirty}
            onClick={resetDraft}
          >
            <X className="size-3.5" />
            Reset
          </Button>
          <Button size="sm" className="h-8 flex-1" onClick={applyAndClose}>
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
