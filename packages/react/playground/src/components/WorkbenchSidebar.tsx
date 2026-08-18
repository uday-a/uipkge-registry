import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Search,
  X,
  Layers,
  LayoutGrid,
  BarChart3,
  Sparkles,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

export interface SidebarItem {
  id: string;
  name: string;
  type: string;
  category: string;
  categories?: string[];
}

export interface WorkbenchSidebarProps {
  items: SidebarItem[];
  selectedId: string;
  onSelect: (id: string) => void;
}

type FilterTab = "all" | "ui" | "charts";

export default function WorkbenchSidebar({
  items,
  selectedId,
  onSelect,
}: WorkbenchSidebarProps) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [collapsedCategories, setCollapsedCategories] = useState<
    Record<string, boolean>
  >({});
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (
        e.key === "Escape" &&
        document.activeElement === searchInputRef.current
      ) {
        setSearch("");
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter items by search query and type tab
  const filteredItems = useMemo(() => {
    let list = items;

    if (activeTab === "ui") {
      list = list.filter(
        (i) =>
          i.type === "registry:ui" &&
          !i.id.includes("chart") &&
          !i.categories?.includes("chart"),
      );
    } else if (activeTab === "charts") {
      list = list.filter(
        (i) =>
          i.id.includes("chart") ||
          i.category === "Charts" ||
          i.categories?.some(
            (c) => c.includes("chart") || c.includes("visualization"),
          ),
      );
    }

    const q = search.toLowerCase().trim();
    if (!q) return list;
    return list.filter(
      (i) =>
        i.id.toLowerCase().includes(q) ||
        i.name.toLowerCase().includes(q) ||
        i.categories?.some((c) => c.toLowerCase().includes(q)),
    );
  }, [items, activeTab, search]);

  // Group items by category
  const groupedItems = useMemo(() => {
    const groups: Record<string, SidebarItem[]> = {};
    for (const item of filteredItems) {
      const cat = item.category || "General";
      const formattedCat = cat.charAt(0).toUpperCase() + cat.slice(1);
      if (!groups[formattedCat]) groups[formattedCat] = [];
      groups[formattedCat].push(item);
    }
    return groups;
  }, [filteredItems]);

  const sortedCategories = useMemo(() => {
    return Object.keys(groupedItems).sort((a, b) => {
      if (a === "Blocks") return -1;
      if (b === "Blocks") return 1;
      if (a === "Charts") return -1;
      if (b === "Charts") return 1;
      return a.localeCompare(b);
    });
  }, [groupedItems]);

  const toggleCategory = (cat: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  return (
    <aside className="flex w-64 flex-col border-r border-border bg-card shrink-0 select-none">
      {/* Search Header */}
      <div className="border-b border-border p-3 space-y-2.5">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search components... (/)"
            className="w-full rounded-md border border-border bg-background pl-8 pr-7 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary font-sans"
          />
          {search && (
            <button
              type="button"
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
              onClick={() => setSearch("")}
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Filter Segmented Control */}
        <div className="grid grid-cols-3 rounded-lg border border-border bg-muted/40 p-0.5 text-xs">
          <button
            type="button"
            className={`rounded-md py-1 font-medium transition ${
              activeTab === "all"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("all")}
          >
            All
          </button>
          <button
            type="button"
            className={`rounded-md py-1 font-medium transition ${
              activeTab === "ui"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("ui")}
          >
            UI
          </button>
          <button
            type="button"
            className={`rounded-md py-1 font-medium transition ${
              activeTab === "charts"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("charts")}
          >
            Charts
          </button>
        </div>
      </div>

      {/* Component Navigation List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        {sortedCategories.map((cat) => (
          <div key={cat} className="space-y-1">
            {/* Category Header Accordion */}
            <button
              type="button"
              className="flex w-full items-center justify-between px-2 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground tracking-tight transition"
              onClick={() => toggleCategory(cat)}
            >
              <div className="flex items-center gap-1.5">
                {collapsedCategories[cat] ? (
                  <ChevronRight className="size-3 text-muted-foreground/60" />
                ) : (
                  <ChevronDown className="size-3 text-muted-foreground/60" />
                )}
                <span>{cat}</span>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground/60 font-normal">
                {groupedItems[cat].length}
              </span>
            </button>

            {/* Category Items */}
            {!collapsedCategories[cat] && (
              <div className="space-y-0.5 pl-2">
                {groupedItems[cat].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`group flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs text-left transition font-sans ${
                      selectedId === item.id
                        ? "bg-foreground text-background font-medium shadow-xs"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    }`}
                    onClick={() => onSelect(item.id)}
                  >
                    <span className="truncate">{item.name}</span>
                    <span
                      className={`text-[9px] font-mono uppercase px-1 py-0.2 rounded transition ${
                        selectedId === item.id
                          ? "bg-background/20 text-background"
                          : item.type === "registry:block"
                            ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                            : "text-muted-foreground/50 group-hover:text-muted-foreground"
                      }`}
                    >
                      {item.type === "registry:block" ? "block" : "ui"}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="py-8 text-center text-xs text-muted-foreground">
            No components match "{search}"
          </div>
        )}
      </div>

      {/* Footer info */}
      <div className="border-t border-border p-3 text-[11px] font-mono text-muted-foreground flex items-center justify-between">
        <span>{filteredItems.length} items shown</span>
        <span>UIPKGE v1.0</span>
      </div>
    </aside>
  );
}
