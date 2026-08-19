"use client";

import * as React from "react";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Loader2,
  Search,
  X,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { CascadeOption } from "./types";

export interface CascadeSelectProps {
  value?: string[] | null;
  defaultValue?: string[] | null;
  onValueChange?: (value: string[] | null) => void;
  onChange?: (value: string[] | null, path: CascadeOption[]) => void;
  onClear?: () => void;
  options: CascadeOption[];
  placeholder?: string;
  searchable?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  loading?: boolean;
  size?: "sm" | "default" | "lg";
  separator?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
}

function findPathIndices(options: CascadeOption[], values: string[]): number[] {
  const indices: number[] = [];
  let current = options;
  for (const val of values) {
    const idx = current.findIndex((o) => o.value === val);
    if (idx === -1) return indices;
    indices.push(idx);
    const next = current[idx].children;
    if (!next?.length) break;
    current = next;
  }
  return indices;
}

function buildPathFromIndices(
  options: CascadeOption[],
  indices: number[],
): CascadeOption[] {
  const path: CascadeOption[] = [];
  let current = options;
  for (const idx of indices) {
    if (idx == null || !current[idx]) break;
    const opt = current[idx];
    path.push(opt);
    if (!opt.children?.length) break;
    current = opt.children;
  }
  return path;
}

const sizeClasses = {
  sm: "h-8 text-xs px-2.5",
  default: "h-9 text-sm px-3",
  lg: "h-11 text-base px-4",
};

const CascadeSelect = React.forwardRef<HTMLButtonElement, CascadeSelectProps>(
  (
    {
      value: modelValue,
      defaultValue = null,
      onValueChange,
      onChange,
      onClear,
      options,
      placeholder = "Select...",
      searchable = true,
      clearable = true,
      disabled = false,
      loading = false,
      size = "default",
      separator = " / ",
      searchPlaceholder = "Search...",
      emptyText = "No options.",
      className,
    },
    ref,
  ) => {
    const isControlled = modelValue !== undefined;
    const [internalValue, setInternalValue] = React.useState<string[] | null>(
      defaultValue,
    );
    const currentValue = isControlled ? modelValue : internalValue;

    const [isOpen, setIsOpen] = React.useState(false);
    const [activePath, setActivePath] = React.useState<number[]>([]);
    const [search, setSearch] = React.useState("");

    // Sync active path with value when opened
    React.useEffect(() => {
      if (isOpen && currentValue?.length) {
        setActivePath(findPathIndices(options, currentValue));
      } else if (isOpen) {
        setActivePath([]);
      }
      if (!isOpen) setSearch("");
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    function commitValue(values: string[] | null, path: CascadeOption[]) {
      if (!isControlled) setInternalValue(values);
      onValueChange?.(values);
      onChange?.(values, path);
    }

    function getOptionsAtLevel(level: number): CascadeOption[] {
      let current = options;
      for (let i = 0; i < level; i++) {
        const idx = activePath[i];
        if (idx == null || !current[idx]?.children?.length) return [];
        current = current[idx].children!;
      }
      return current;
    }

    function selectAtLevel(level: number, index: number) {
      const option = getOptionsAtLevel(level)[index];
      if (option?.disabled) return;
      const next = [...activePath];
      next[level] = index;
      next.splice(level + 1);
      setActivePath(next);

      // If leaf node, emit the value
      if (!option?.children?.length) {
        const path = buildPathFromIndices(options, next);
        const values = path.map((p) => p.value);
        commitValue(values, path);
        setIsOpen(false);
      }
    }

    const selectedPath = React.useMemo<CascadeOption[]>(() => {
      if (!currentValue?.length) return [];
      return buildPathFromIndices(
        options,
        findPathIndices(options, currentValue),
      );
    }, [currentValue, options]);

    const displayLabel = React.useMemo(() => {
      if (selectedPath.length === 0) return placeholder;
      return selectedPath.map((p) => p.label).join(separator);
    }, [selectedPath, placeholder, separator]);

    const hasValue = selectedPath.length > 0;

    function clearAll(event?: React.MouseEvent | React.KeyboardEvent) {
      event?.stopPropagation();
      if (disabled) return;
      onClear?.();
      commitValue(null, []);
      setActivePath([]);
    }

    function onTriggerKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
      // Escape clears when closed (open Escape is handled by Popover).
      // Replaces the old nested clear button for keyboard users.
      if (e.key === "Escape" && !isOpen && clearable && hasValue && !disabled) {
        e.preventDefault();
        clearAll(e);
      }
    }

    // Search: flatten the tree and match
    const searchResults = React.useMemo<
      { path: CascadeOption[]; values: string[] }[] | null
    >(() => {
      const q = search.trim().toLowerCase();
      if (!q) return null;
      const results: { path: CascadeOption[]; values: string[] }[] = [];
      const walk = (
        opts: CascadeOption[],
        path: CascadeOption[],
        values: string[],
      ) => {
        for (const opt of opts) {
          const newPath = [...path, opt];
          const newValues = [...values, opt.value];
          if (opt.label.toLowerCase().includes(q) && !opt.children?.length) {
            results.push({ path: newPath, values: newValues });
          }
          if (opt.children?.length) {
            walk(opt.children, newPath, newValues);
          }
        }
      };
      walk(options, [], []);
      return results;
    }, [search, options]);

    function selectSearchResult(result: {
      path: CascadeOption[];
      values: string[];
    }) {
      commitValue(result.values, result.path);
      setIsOpen(false);
      setSearch("");
    }

    const levels = React.useMemo<
      { options: CascadeOption[]; level: number }[]
    >(() => {
      const result: { options: CascadeOption[]; level: number }[] = [
        { options, level: 0 },
      ];
      for (let i = 0; i < activePath.length; i++) {
        const idx = activePath[i];
        const current = result[i].options;
        if (idx == null || !current[idx]?.children?.length) break;
        result.push({ options: current[idx].children!, level: i + 1 });
      }
      return result;
    }, [activePath, options]);

    const triggerClasses = cn(
      "flex w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent text-sm shadow-xs transition-[color,box-shadow] outline-none",
      "hover:border-ring/50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
      "disabled:cursor-not-allowed disabled:opacity-50",
      sizeClasses[size],
      className,
    );

    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            ref={ref}
            type="button"
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            disabled={disabled || loading}
            data-uipkge=""
            data-slot="cascade-select"
            className={triggerClasses}
            onKeyDown={onTriggerKeyDown}
          >
            <span
              className={cn(
                "flex-1 truncate text-left",
                hasValue ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {displayLabel}
            </span>
            <span className="flex shrink-0 items-center gap-1">
              {loading ? (
                <Loader2 className="text-muted-foreground size-4 animate-spin" />
              ) : clearable && hasValue && !disabled ? (
                // Decorative clear affordance — not a nested interactive control.
                // Nested role=button inside the combobox is invalid HTML.
                <span
                  aria-hidden="true"
                  className="text-muted-foreground hover:text-foreground flex size-4 items-center justify-center rounded transition-colors"
                  onClick={(e) => clearAll(e)}
                >
                  <X className="size-4" />
                </span>
              ) : (
                <ChevronDown
                  className={cn(
                    "text-muted-foreground size-4 shrink-0 transition-transform duration-200",
                    isOpen && "rotate-180",
                  )}
                />
              )}
            </span>
          </button>
        </PopoverTrigger>

        <PopoverContent
          className="p-0"
          align="start"
          sideOffset={4}
          style={{ width: "var(--radix-popover-trigger-width)" }}
        >
          <div className="flex max-h-80 flex-col">
            {searchable && (
              <div className="border-b p-2">
                <div className="relative">
                  <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={searchPlaceholder}
                    aria-label="Search options"
                    className="border-input focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent pl-8 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                  />
                </div>
              </div>
            )}

            {loading ? (
              <div className="text-muted-foreground flex items-center justify-center gap-2 py-6 text-sm">
                <Loader2 className="size-4 animate-spin" />
                Loading...
              </div>
            ) : searchResults ? (
              <div className="flex-1 overflow-y-auto p-1">
                {searchResults.length === 0 ? (
                  <div className="text-muted-foreground py-6 text-center text-sm">
                    {emptyText}
                  </div>
                ) : (
                  searchResults.map((result, i) => (
                    <button
                      key={i}
                      type="button"
                      className="hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring/50 flex w-full items-center gap-1.5 rounded-sm px-2 py-1.5 text-left text-sm outline-none focus-visible:ring-2 focus-visible:outline-none"
                      onClick={() => selectSearchResult(result)}
                    >
                      <span className="flex-1 truncate">
                        {result.path.map((p) => p.label).join(separator)}
                      </span>
                    </button>
                  ))
                )}
              </div>
            ) : (
              <div className="flex flex-1 overflow-x-auto overflow-y-hidden">
                {levels.map((lvl) => (
                  <div
                    key={lvl.level}
                    className="max-w-56 min-w-44 shrink-0 overflow-y-auto border-r p-1 last:border-r-0"
                  >
                    {lvl.options.map((opt, idx) => (
                      <button
                        key={opt.value}
                        type="button"
                        disabled={opt.disabled}
                        className={cn(
                          "flex w-full items-center justify-between gap-1.5 rounded-sm px-2 py-1.5 text-left text-sm outline-none",
                          "hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring/50 focus-visible:ring-2 focus-visible:outline-none",
                          "disabled:cursor-not-allowed disabled:opacity-50",
                          activePath[lvl.level] === idx &&
                            "bg-accent text-accent-foreground font-medium",
                        )}
                        onClick={() => selectAtLevel(lvl.level, idx)}
                      >
                        <span className="flex-1 truncate">{opt.label}</span>
                        {activePath[lvl.level] === idx &&
                        !opt.children?.length ? (
                          <Check className="size-4 shrink-0" />
                        ) : opt.children?.length ? (
                          <ChevronRight className="text-muted-foreground size-3.5 shrink-0" />
                        ) : null}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    );
  },
);
CascadeSelect.displayName = "CascadeSelect";

export { CascadeSelect };
