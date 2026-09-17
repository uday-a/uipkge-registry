"use client";

import * as React from "react";
import { Search, Braces, FoldVertical, UnfoldVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { JsonTreeNode } from "./JsonTreeNode";
import type { JsonValue } from "./types";

export type { JsonValue } from "./types";

export interface JsonTreeViewProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "data" | "onCopy"
> {
  data: JsonValue;
  expandDepth?: number;
  maxDepth?: number;
  showSearch?: boolean;
  showToolbar?: boolean;
  rootLabel?: string;
  onCopy?: (value: string, path: string) => void;
}

function pathKey(path: (string | number)[]): string {
  return path.length
    ? path.map((p) => (typeof p === "number" ? `[${p}]` : `.${p}`)).join("")
    : "$";
}

function typeOf(
  val: JsonValue,
): "object" | "array" | "string" | "number" | "boolean" | "null" {
  if (val === null) return "null";
  if (Array.isArray(val)) return "array";
  return typeof val as "object" | "string" | "number" | "boolean";
}

function formatValue(val: JsonValue): string {
  if (val === null) return "null";
  if (typeof val === "string") return JSON.stringify(val);
  return String(val);
}

const typeColor: Record<string, string> = {
  string: "text-emerald-600 dark:text-emerald-400",
  number: "text-blue-600 dark:text-blue-400",
  boolean: "text-amber-600 dark:text-amber-400",
  null: "text-muted-foreground italic",
  object: "text-foreground",
  array: "text-foreground",
};

const keyColor = "text-violet-600 dark:text-violet-400";

const JsonTreeView = React.forwardRef<HTMLDivElement, JsonTreeViewProps>(
  function JsonTreeView(props, ref) {
    const {
      data,
      expandDepth = 1,
      maxDepth = 100,
      showSearch = true,
      showToolbar = true,
      rootLabel = "root",
      onCopy,
      className,
      ...rest
    } = props;

    const [expanded, setExpanded] = React.useState<Set<string>>(
      () => new Set(),
    );
    const [search, setSearch] = React.useState("");
    const [copiedPath, setCopiedPath] = React.useState<string | null>(null);

    const dataRef = React.useRef(data);
    dataRef.current = data;
    const expandDepthRef = React.useRef(expandDepth);
    expandDepthRef.current = expandDepth;
    const maxDepthRef = React.useRef(maxDepth);
    maxDepthRef.current = maxDepth;

    function defaultExpanded(): Set<string> {
      const next = new Set<string>();
      const walk = (
        val: JsonValue,
        path: (string | number)[] = [],
        depth = 0,
      ) => {
        if (depth >= expandDepthRef.current) return;
        if (val !== null && typeof val === "object") {
          next.add(pathKey(path));
          const entries = Array.isArray(val)
            ? val.map((v, i) => [i, v] as const)
            : Object.entries(val);
          for (const [k, v] of entries) {
            walk(v as JsonValue, [...path, k], depth + 1);
          }
        }
      };
      walk(dataRef.current);
      return next;
    }

    // Reset expanded state when data or expandDepth changes
    React.useEffect(() => {
      setExpanded(defaultExpanded());
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, expandDepth]);

    function toggle(path: (string | number)[]) {
      const k = pathKey(path);
      setExpanded((prev) => {
        const next = new Set(prev);
        if (next.has(k)) next.delete(k);
        else next.add(k);
        return next;
      });
    }

    function isExpanded(path: (string | number)[]): boolean {
      return expanded.has(pathKey(path));
    }

    function expandAll() {
      const next = new Set<string>();
      const walk = (
        val: JsonValue,
        path: (string | number)[] = [],
        depth = 0,
      ) => {
        if (depth >= maxDepthRef.current) return;
        if (val !== null && typeof val === "object") {
          next.add(pathKey(path));
          const entries = Array.isArray(val)
            ? val.map((v, i) => [i, v] as const)
            : Object.entries(val);
          for (const [k, v] of entries) {
            walk(v as JsonValue, [...path, k], depth + 1);
          }
        }
      };
      walk(dataRef.current);
      setExpanded(next);
    }

    function collapseAll() {
      setExpanded(new Set());
    }

    function matchesSearch(val: JsonValue): boolean {
      if (!search) return true;
      const term = search.toLowerCase();
      const walk = (v: JsonValue): boolean => {
        if (v === null) return "null".includes(term);
        if (typeof v === "string") return v.toLowerCase().includes(term);
        if (typeof v === "number" || typeof v === "boolean")
          return String(v).includes(term);
        if (Array.isArray(v)) return v.some(walk);
        if (typeof v === "object")
          return Object.entries(v).some(
            ([k, value]) => k.toLowerCase().includes(term) || walk(value),
          );
        return false;
      };
      return walk(val);
    }

    // Auto-expand nodes that contain search matches
    React.useEffect(() => {
      if (!search) {
        setExpanded(defaultExpanded());
        return;
      }
      const next = new Set<string>();
      const walk = (
        val: JsonValue,
        path: (string | number)[] = [],
        depth = 0,
      ) => {
        if (depth >= maxDepthRef.current) return;
        if (val !== null && typeof val === "object") {
          if (matchesSearch(val)) next.add(pathKey(path));
          const entries = Array.isArray(val)
            ? val.map((v, i) => [i, v] as const)
            : Object.entries(val);
          for (const [k, v] of entries) {
            walk(v as JsonValue, [...path, k], depth + 1);
          }
        }
      };
      walk(dataRef.current);
      setExpanded(next);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    async function copyValue(val: JsonValue, path: (string | number)[]) {
      const str = typeof val === "string" ? val : JSON.stringify(val, null, 2);
      const p = pathKey(path);
      try {
        await navigator.clipboard.writeText(str);
        setCopiedPath(p);
        onCopy?.(str, p);
        setTimeout(() => {
          setCopiedPath((cur) => (cur === p ? null : cur));
        }, 1200);
      } catch {
        // clipboard unavailable
      }
    }

    const summary = React.useMemo(() => {
      const t = typeOf(data);
      if (t === "array") return `Array(${(data as JsonValue[]).length})`;
      if (t === "object")
        return `Object(${Object.keys(data as object).length})`;
      return t;
    }, [data]);

    const searchMatchCount = React.useMemo(() => {
      if (!search) return 0;
      let count = 0;
      const term = search.toLowerCase();
      const walk = (v: JsonValue) => {
        if (v === null) {
          if ("null".includes(term)) count++;
          return;
        }
        if (typeof v === "string") {
          if (v.toLowerCase().includes(term)) count++;
          return;
        }
        if (typeof v === "number" || typeof v === "boolean") {
          if (String(v).includes(term)) count++;
          return;
        }
        if (Array.isArray(v)) {
          v.forEach(walk);
          return;
        }
        if (typeof v === "object") {
          Object.entries(v).forEach(([k, val]) => {
            if (k.toLowerCase().includes(term)) count++;
            walk(val);
          });
        }
      };
      walk(data);
      return count;
    }, [search, data]);

    return (
      <div
        ref={ref}
        data-uipkge=""
        data-slot="json-tree-view"
        className={cn(
          "bg-background flex flex-col overflow-hidden rounded-lg border font-mono text-sm",
          className,
        )}
        {...rest}
      >
        {/* Toolbar */}
        {(showToolbar || showSearch) && (
          <div className="border-border flex items-center gap-2 border-b px-3 py-2">
            <div className="flex items-center gap-1.5">
              <Braces className="text-muted-foreground size-4" />
              <span className="text-muted-foreground text-xs">{summary}</span>
            </div>
            <div className="ml-auto flex items-center gap-1">
              {showSearch && (
                <div className="relative">
                  <Search className="text-muted-foreground absolute top-1/2 left-2 size-3.5 -translate-y-1/2" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Filter..."
                    aria-label="Filter JSON tree"
                    className="border-input bg-muted/40 focus:border-ring focus:ring-ring/30 h-7 w-32 rounded-md pr-2 pl-7 text-xs transition-[width] outline-none focus:w-44 focus:ring-2"
                  />
                </div>
              )}
              {search && (
                <span className="text-muted-foreground text-xs">
                  {searchMatchCount} match{searchMatchCount === 1 ? "" : "es"}
                </span>
              )}
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex size-7 items-center justify-center rounded-md transition-colors"
                title="Expand all"
                aria-label="Expand all"
                onClick={expandAll}
              >
                <UnfoldVertical className="size-4" />
              </button>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex size-7 items-center justify-center rounded-md transition-colors"
                title="Collapse all"
                aria-label="Collapse all"
                onClick={collapseAll}
              >
                <FoldVertical className="size-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tree */}
        <div
          className="min-h-0 flex-1 overflow-auto p-2"
          role="tree"
          aria-label={rootLabel}
        >
          <JsonTreeNode
            data={data}
            path={[]}
            label={rootLabel}
            isRoot
            search={search}
            maxDepth={maxDepth}
            matchesSearch={matchesSearch}
            isExpanded={isExpanded}
            toggle={toggle}
            typeOf={typeOf}
            formatValue={formatValue}
            typeColor={typeColor}
            keyColor={keyColor}
            copiedPath={copiedPath}
            onCopy={copyValue}
          />
        </div>
      </div>
    );
  },
);

JsonTreeView.displayName = "JsonTreeView";

export { JsonTreeView };
