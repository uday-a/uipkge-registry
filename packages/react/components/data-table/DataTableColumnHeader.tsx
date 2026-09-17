"use client";

/**
 * Sortable / hideable header cell for TanStack DataTable columns. Use it from
 * a column definition like:
 *   header: ({ column }) => <DataTableColumnHeader column={column} label="Email" />
 *
 * Click on the label cycles sort asc → desc → none.
 *
 * Optional per-column filter:
 *   header: ({ column }) => (
 *     <DataTableColumnHeader
 *       column={column}
 *       label="Status"
 *       filter={{ column: 'status', label: 'Status', type: 'multiselect', options: [...] }}
 *     />
 *   )
 *
 * When `filter` is provided, a funnel icon renders next to the sort button.
 * Click opens a popover with the right filter UI for the type (text / select
 * / multiselect / date). The funnel shows a primary-coloured dot when the
 * column has an active filter.
 */
import * as React from "react";
import type { Column } from "@tanstack/react-table";
import { ArrowUp, ArrowUpDown, Check, Filter, FilterX } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { isoToDate, dateToIso } from "./date-utils";

interface FilterOption {
  value: string;
  label: string;
}
interface FilterDefinition {
  column: string;
  label: string;
  type: "text" | "select" | "multiselect" | "date";
  options?: (string | FilterOption)[];
}

export interface DataTableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  label: string;
  align?: "left" | "right" | "center";
  filter?: FilterDefinition;
  className?: string;
}

function resolveOption(opt: string | FilterOption): FilterOption {
  return typeof opt === "string" ? { value: opt, label: opt } : opt;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  label,
  align = "left",
  filter,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const [open, setOpen] = React.useState(false);

  function next() {
    const current = column.getIsSorted();
    if (!current) column.toggleSorting(false);
    else if (current === "asc") column.toggleSorting(true);
    else column.clearSorting();
  }

  const filterValue = column.getFilterValue();

  const isFilterActive = (() => {
    const v = filterValue;
    if (v === undefined || v === null || v === "") return false;
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === "object") return Object.keys(v).length > 0;
    return true;
  })();

  // Text-input bound separately so we can apply on blur / Enter rather than
  // thrashing the column filter on every keystroke.
  const [textDraft, setTextDraft] = React.useState("");
  React.useEffect(() => {
    if (open && filter?.type === "text") {
      setTextDraft((filterValue as string) ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function applyText() {
    column.setFilterValue(textDraft || undefined);
  }

  function clearText() {
    setTextDraft("");
    column.setFilterValue(undefined);
  }

  function toggleMultiselect(value: string) {
    const current = (filterValue as string[]) ?? [];
    const nextVal = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    column.setFilterValue(nextVal.length > 0 ? nextVal : undefined);
  }

  function selectOne(value: string) {
    column.setFilterValue(value || undefined);
    setOpen(false);
  }

  function clearFilter() {
    column.setFilterValue(undefined);
    setTextDraft("");
  }

  // Date-range bridging. The column stores ISO strings; the calendar wants
  // native Date instances. Reads/writes both shapes.
  const dateModel: DateRange | undefined = (() => {
    const v = filterValue as { from?: string; to?: string } | undefined;
    if (!v?.from && !v?.to) return undefined;
    return {
      from: v.from ? isoToDate(v.from) : undefined,
      to: v.to ? isoToDate(v.to) : undefined,
    };
  })();

  function onDateSelect(range: DateRange | undefined) {
    const isoFrom = range?.from ? dateToIso(range.from) : undefined;
    const isoTo = range?.to ? dateToIso(range.to) : undefined;
    if (!isoFrom && !isoTo) {
      column.setFilterValue(undefined);
    } else {
      column.setFilterValue({ from: isoFrom, to: isoTo });
    }
  }

  function selectedLabels(): string[] {
    if (!filter?.options) return [];
    const selected = (filterValue as string[]) ?? [];
    return filter.options
      .map(resolveOption)
      .filter((o) => selected.includes(o.value))
      .map((o) => o.label);
  }

  return (
    <div
      className={cn(
        "flex items-center gap-0.5",
        align === "right" && "justify-end",
        align === "center" && "justify-center",
        className,
      )}
    >
      {column.getCanSort() ? (
        <button
          type="button"
          className="group text-muted-foreground hover:text-foreground hover:bg-muted/60 -mx-2 inline-flex items-center gap-1.5 rounded px-2 py-1 text-sm font-medium transition-colors duration-150"
          aria-label={`Sort by ${label}`}
          onClick={next}
        >
          <span>{label}</span>
          {column.getIsSorted() ? (
            <ArrowUp
              className={cn(
                "text-foreground size-3.5 transition-transform duration-200 ease-in-out",
                column.getIsSorted() === "desc" ? "rotate-180" : "rotate-0",
              )}
            />
          ) : (
            <ArrowUpDown className="size-3.5 opacity-40 transition-opacity duration-150 group-hover:opacity-70" />
          )}
        </button>
      ) : (
        <span className="text-muted-foreground text-sm font-medium">
          {label}
        </span>
      )}

      {/* Optional per-column header filter */}
      {filter && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "text-muted-foreground relative inline-flex size-6 items-center justify-center rounded transition-colors",
                "hover:text-foreground hover:bg-muted/60",
                isFilterActive && "text-foreground",
              )}
              aria-label={`Filter ${label}`}
            >
              <Filter className="size-3.5" />
              {isFilterActive && (
                <span
                  aria-hidden
                  className="bg-primary absolute -top-0.5 -right-0.5 size-1.5 rounded-full"
                />
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-0" align="start">
            <div className="border-border flex items-center justify-between border-b px-3 py-2 text-xs font-medium">
              <span>Filter · {filter.label}</span>
              {isFilterActive && (
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
                  onClick={clearFilter}
                >
                  <FilterX className="size-3" />
                  Clear
                </button>
              )}
            </div>

            {/* TEXT */}
            {filter.type === "text" && (
              <div className="space-y-2 p-3">
                <Input
                  value={textDraft}
                  placeholder={`Search ${filter.label.toLowerCase()}…`}
                  className="h-8"
                  onChange={(e) => setTextDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      applyText();
                      setOpen(false);
                    }
                  }}
                  onBlur={applyText}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="h-8 flex-1"
                    onClick={() => {
                      applyText();
                      setOpen(false);
                    }}
                  >
                    Apply
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8"
                    onClick={clearText}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            )}

            {/* SELECT / MULTISELECT */}
            {(filter.type === "select" || filter.type === "multiselect") && (
              <Command className="max-h-[280px]">
                <CommandInput
                  placeholder={`Search ${filter.label.toLowerCase()}…`}
                  className="h-8"
                />
                <CommandList>
                  <CommandEmpty>No matches.</CommandEmpty>
                  <CommandGroup>
                    {(filter.options ?? []).map((opt) => {
                      const o = resolveOption(opt);
                      return (
                        <CommandItem
                          key={o.value}
                          value={o.value}
                          onSelect={() =>
                            filter.type === "multiselect"
                              ? toggleMultiselect(o.value)
                              : selectOne(o.value)
                          }
                        >
                          {filter.type === "multiselect" ? (
                            <div
                              className={cn(
                                "border-primary/50 mr-2 flex size-4 items-center justify-center rounded-sm border transition-colors",
                                ((filterValue as string[]) ?? []).includes(
                                  o.value,
                                )
                                  ? "bg-primary text-primary-foreground"
                                  : "opacity-50",
                              )}
                            >
                              <Check className="size-3" />
                            </div>
                          ) : (
                            <Check
                              className={cn(
                                "mr-2 size-4",
                                filterValue === o.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                          )}
                          <span>{o.label}</span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            )}

            {/* DATE RANGE */}
            {filter.type === "date" && (
              <div className="p-2">
                <RangeCalendar selected={dateModel} onSelect={onDateSelect} />
                <div className="flex gap-2 px-1 pt-2">
                  <Button
                    size="sm"
                    className="h-8 flex-1"
                    onClick={() => setOpen(false)}
                  >
                    Apply
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8"
                    onClick={clearFilter}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            )}

            {/* Active selection summary */}
            {isFilterActive &&
              (filter.type === "multiselect" || filter.type === "select") && (
                <div className="border-border text-muted-foreground border-t px-3 py-2 text-xs">
                  {filter.type === "multiselect" ? (
                    <span>
                      {selectedLabels().length} selected:{" "}
                      <span className="text-foreground">
                        {selectedLabels().join(", ")}
                      </span>
                    </span>
                  ) : (
                    <span>
                      <span className="text-foreground">
                        {filterValue as string}
                      </span>
                    </span>
                  )}
                </div>
              )}
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
