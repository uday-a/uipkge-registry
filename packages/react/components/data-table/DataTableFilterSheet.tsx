"use client";

import * as React from "react";
import type { Table } from "@tanstack/react-table";
import type { DateRange } from "react-day-picker";
import { Check, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
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

export interface DataTableFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  table: Table<any>;
  filters: FilterDefinition[];
  activeFilterCount: number;
  isAnyFilterActive: boolean;
  isServerSide: boolean;
  /** Strip section bgs / rings / dividers / SheetContent side border. */
  borderless?: boolean;
  getMultiSelectValue: (column: string) => string[];
  getDateRangeValue: (column: string) => { from?: string; to?: string };
  formatDateRange: (column: string) => string;
  getCalendarModel: (column: string) => DateRange | undefined;
  onApply: () => void;
  onClearAll: () => void;
  onToggleMultiselect: (column: string, value: string) => void;
  onClearFilter: (filter: FilterDefinition) => void;
  onClearDateFilter: (filter: FilterDefinition) => void;
  onCalendarUpdate: (column: string, value: DateRange | undefined) => void;
  onTextFilterUpdate: (column: string, value: string | undefined) => void;
  customFilters?: React.ReactNode;
}

export function DataTableFilterSheet({
  open,
  onOpenChange,
  table,
  filters,
  activeFilterCount,
  isAnyFilterActive,
  isServerSide,
  borderless = false,
  getMultiSelectValue,
  getDateRangeValue,
  formatDateRange,
  getCalendarModel,
  onApply,
  onClearAll,
  onToggleMultiselect,
  onClearFilter,
  onClearDateFilter,
  onCalendarUpdate,
  onTextFilterUpdate,
  customFilters,
}: DataTableFilterSheetProps) {
  const filterScrollRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (open) {
      setTimeout(() => {
        filterScrollRef.current?.scrollTo({ top: 0 });
      }, 50);
    }
  }, [open]);

  const filteredRowCount = table.getFilteredRowModel().rows.length;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className={[
          "flex flex-col gap-0 p-0 sm:max-w-[400px]",
          borderless ? "border-0" : "",
        ].join(" ")}
      >
        {/* Header */}
        <div
          className={borderless ? "px-5 pt-5 pb-2" : "border-b px-5 pt-5 pb-4"}
        >
          <div className="flex items-center gap-3">
            <div className="bg-muted flex size-9 items-center justify-center rounded-lg">
              <SlidersHorizontal className="text-muted-foreground size-4" />
            </div>
            <div className="flex-1">
              <SheetHeader className="space-y-0.5 p-0">
                <SheetTitle className="text-sm font-semibold">
                  Filters
                </SheetTitle>
                <SheetDescription className="text-xs">
                  {activeFilterCount > 0 ? (
                    <>
                      {activeFilterCount} active filter
                      {activeFilterCount > 1 ? "s" : ""}
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
                </SheetDescription>
              </SheetHeader>
            </div>
          </div>
        </div>

        {/* Scrollable filter sections */}
        <div ref={filterScrollRef} className="flex-1 overflow-y-auto">
          <div className="space-y-2 p-4">
            {filters.map((filter) => {
              const textValue =
                (table.getColumn(filter.column)?.getFilterValue() as string) ??
                "";
              const multi = getMultiSelectValue(filter.column);
              const dr = getDateRangeValue(filter.column);
              const hasDate = !!(dr.from || dr.to);

              if (filter.type === "text") {
                return (
                  <div
                    key={filter.column}
                    className={
                      borderless ? "py-2" : "bg-muted/40 rounded-lg p-3"
                    }
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <Label className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                        {filter.label}
                      </Label>
                      {textValue && (
                        <button
                          type="button"
                          className="text-muted-foreground hover:text-foreground text-xs transition-colors"
                          onClick={() =>
                            onTextFilterUpdate(filter.column, undefined)
                          }
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <Input
                      placeholder={`Filter by ${filter.label.toLowerCase()}...`}
                      value={textValue}
                      className="h-8 text-sm"
                      onChange={(e) =>
                        onTextFilterUpdate(
                          filter.column,
                          e.target.value || undefined,
                        )
                      }
                    />
                  </div>
                );
              }

              if (filter.type === "multiselect" || filter.type === "select") {
                return (
                  <div
                    key={filter.column}
                    className={
                      borderless
                        ? "py-2 transition-colors"
                        : [
                            "rounded-lg p-3 transition-colors",
                            multi.length > 0
                              ? "bg-primary/[0.04] ring-primary/20 ring-1"
                              : "bg-muted/40",
                          ].join(" ")
                    }
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
                          onClick={() => onClearFilter(filter)}
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
                                  onToggleMultiselect(filter.column, opt.value)
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
                return (
                  <div
                    key={filter.column}
                    className={
                      borderless
                        ? "py-2 transition-colors"
                        : [
                            "rounded-lg p-3 transition-colors",
                            hasDate
                              ? "bg-primary/[0.04] ring-primary/20 ring-1"
                              : "bg-muted/40",
                          ].join(" ")
                    }
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
                            {formatDateRange(filter.column)}
                          </Badge>
                        )}
                      </div>
                      {hasDate && (
                        <button
                          type="button"
                          className="text-muted-foreground hover:text-foreground text-xs transition-colors"
                          onClick={() => onClearDateFilter(filter)}
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <div
                      className={[
                        "flex justify-center overflow-hidden",
                        borderless ? "" : "rounded-md border",
                      ].join(" ")}
                    >
                      <RangeCalendar
                        selected={getCalendarModel(filter.column)}
                        numberOfMonths={1}
                        className="p-2"
                        onSelect={(range) =>
                          onCalendarUpdate(filter.column, range)
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
        <div
          className={[
            "flex gap-2 px-4 py-3",
            borderless ? "" : "border-t",
          ].join(" ")}
        >
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            disabled={!isAnyFilterActive}
            onClick={onClearAll}
          >
            <X className="size-3.5" />
            Reset All
          </Button>
          <Button size="sm" className="flex-1" onClick={onApply}>
            {isServerSide ? (
              "Apply Filters"
            ) : (
              <>
                Show {filteredRowCount} result
                {filteredRowCount !== 1 ? "s" : ""}
              </>
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
