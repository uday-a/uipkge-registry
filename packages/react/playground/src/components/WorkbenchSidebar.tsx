import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Search,
  X,
  Layers,
  LayoutGrid,
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
  collapsed?: boolean;
}

export default function WorkbenchSidebar({
  items,
  selectedId,
  onSelect,
  collapsed = false,
}: WorkbenchSidebarProps) {
  const [search, setSearch] = useState("");
  const [collapsedCategories, setCollapsedCategories] = useState<
    Record<string, boolean>
  >({});
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const isBlockItem = (item: SidebarItem) =>
    item.type === "registry:block" ||
    item.category === "Blocks" ||
    item.id === "cloud-backup-schedule";

  const componentsList = useMemo(
    () => items.filter((i) => !isBlockItem(i)),
    [items]
  );
  const blocksList = useMemo(
    () => items.filter((i) => isBlockItem(i)),
    [items]
  );

  const [activeTab, setActiveTab] = useState<"components" | "blocks">(() => {
    const match = items.find((i) => i.id === selectedId);
    return match && isBlockItem(match) ? "blocks" : "components";
  });

  // Sync active tab with selected component
  useEffect(() => {
    if (selectedId) {
      const match = items.find((i) => i.id === selectedId);
      if (match) {
        setActiveTab(isBlockItem(match) ? "blocks" : "components");
      }
    }
  }, [selectedId, items]);

  const switchTab = (tab: "components" | "blocks") => {
    setActiveTab(tab);
    setSearch("");
    if (tab === "blocks") {
      if (!blocksList.some((b) => b.id === selectedId)) {
        if (blocksList.length > 0) {
          onSelect(blocksList[0].id);
        }
      }
    } else {
      if (!componentsList.some((c) => c.id === selectedId)) {
        const defaultComp = componentsList.some((c) => c.id === "button")
          ? "button"
          : componentsList[0]?.id;
        if (defaultComp) onSelect(defaultComp);
      }
    }
  };

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

  // Items for the current active tab
  const currentTabItems = useMemo(() => {
    return activeTab === "blocks" ? blocksList : componentsList;
  }, [activeTab, blocksList, componentsList]);

  // Filter items by search query
  const filteredItems = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return currentTabItems;
    return currentTabItems.filter(
      (i) =>
        i.id.toLowerCase().includes(q) ||
        i.name.toLowerCase().includes(q) ||
        i.categories?.some((c) => c.toLowerCase().includes(q))
    );
  }, [currentTabItems, search]);

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
    <aside
      className={`flex shrink-0 flex-col border-r border-border bg-card select-none transition-all duration-200 ${
        collapsed
          ? "w-0 overflow-hidden border-r-0 p-0 opacity-0 pointer-events-none"
          : "w-64"
      }`}
    >
      {/* Top Header: Components & Blocks Tabs Side by Side + Search Bar */}
      <div className="border-b border-border p-3 space-y-2.5">
        {/* Tabs Side by Side */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-muted/60 rounded-lg text-xs font-medium border border-border/50">
          <button
            type="button"
            id="tab-components"
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md transition cursor-pointer ${
              activeTab === "components"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => switchTab("components")}
          >
            <Layers className="size-3.5 shrink-0" />
            <span>Components</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono shrink-0 ${
                activeTab === "components"
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {componentsList.length}
            </span>
          </button>

          <button
            type="button"
            id="tab-blocks"
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md transition cursor-pointer ${
              activeTab === "blocks"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => switchTab("blocks")}
          >
            <LayoutGrid className="size-3.5 shrink-0" />
            <span>Blocks</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono shrink-0 ${
                activeTab === "blocks"
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {blocksList.length}
            </span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              activeTab === "blocks"
                ? "Search blocks... (/)"
                : "Search components... (/)"
            }
            className="w-full rounded-md border border-border bg-background pl-8 pr-7 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary font-sans shadow-xs"
          />
          {search && (
            <button
              type="button"
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={() => setSearch("")}
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        {sortedCategories.map((cat) => (
          <div key={cat} className="space-y-1">
            <button
              type="button"
              className="flex w-full items-center justify-between px-2 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground tracking-tight transition cursor-pointer"
              onClick={() => toggleCategory(cat)}
            >
              <div className="flex items-center gap-1.5">
                {collapsedCategories[cat] ? (
                  <ChevronRight className="size-3 text-muted-foreground/70 shrink-0" />
                ) : (
                  <ChevronDown className="size-3 text-muted-foreground/70 shrink-0" />
                )}
                <span>{cat}</span>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">
                {groupedItems[cat]?.length || 0}
              </span>
            </button>

            {!collapsedCategories[cat] && (
              <div className="space-y-0.5 pl-1">
                {groupedItems[cat]?.map((item) => (
                  <button
                    key={item.id}
                    id={`sidebar-item-${item.id}`}
                    type="button"
                    onClick={() => onSelect(item.id)}
                    className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-xs transition group cursor-pointer ${
                      selectedId === item.id
                        ? "bg-primary text-primary-foreground font-medium shadow-xs"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <span className="truncate pr-2">{item.name}</span>
                    {(item.id.includes("chart") ||
                      item.category === "Charts") && (
                      <span className="text-[10px] opacity-70 shrink-0 font-mono">
                        chart
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="py-8 text-center text-xs text-muted-foreground">
            No {activeTab === "blocks" ? "blocks" : "components"} match &quot;{search}&quot;
          </div>
        )}
      </div>

      {/* Footer Counter */}
      <div className="border-t border-border p-3 bg-muted/20 flex items-center justify-between text-xs text-muted-foreground font-mono">
        <span>
          {filteredItems.length}{" "}
          {activeTab === "blocks"
            ? filteredItems.length === 1
              ? "block"
              : "blocks"
            : "components"}
        </span>
        <span>UIPKGE v1.0</span>
      </div>
    </aside>
  );
}
