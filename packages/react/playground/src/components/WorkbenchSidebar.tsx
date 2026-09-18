import React, { useState, useMemo, useEffect, useRef } from 'react'
import { Search, X, Layers, LayoutGrid, ChevronRight, ChevronDown, PanelLeftClose } from 'lucide-react'

export interface SidebarItem {
  id: string
  name: string
  type: string
  category: string
  categories?: string[]
}

export interface WorkbenchSidebarProps {
  items: SidebarItem[]
  selectedId: string
  onSelect: (id: string) => void
  collapsed?: boolean
  onToggleCollapse?: () => void
}

export default function WorkbenchSidebar({
  items,
  selectedId,
  onSelect,
  collapsed = false,
  onToggleCollapse,
}: WorkbenchSidebarProps) {
  const [search, setSearch] = useState('')
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({})
  const searchInputRef = useRef<HTMLInputElement | null>(null)

  const isBlockItem = (item: SidebarItem) =>
    item.type === 'registry:block' || item.category === 'Blocks' || item.id === 'cloud-backup-schedule'

  const componentsList = useMemo(() => items.filter((i) => !isBlockItem(i)), [items])
  const blocksList = useMemo(() => items.filter((i) => isBlockItem(i)), [items])

  const [activeTab, setActiveTab] = useState<'components' | 'blocks'>(() => {
    const match = items.find((i) => i.id === selectedId)
    return match && isBlockItem(match) ? 'blocks' : 'components'
  })

  // Sync active tab with selected component
  useEffect(() => {
    if (selectedId) {
      const match = items.find((i) => i.id === selectedId)
      if (match) {
        setActiveTab(isBlockItem(match) ? 'blocks' : 'components')
      }
    }
  }, [selectedId, items])

  const switchTab = (tab: 'components' | 'blocks') => {
    setActiveTab(tab)
    setSearch('')
    if (tab === 'blocks') {
      if (!blocksList.some((b) => b.id === selectedId)) {
        if (blocksList.length > 0) {
          onSelect(blocksList[0].id)
        }
      }
    } else {
      if (!componentsList.some((c) => c.id === selectedId)) {
        const defaultComp = componentsList.some((c) => c.id === 'button') ? 'button' : componentsList[0]?.id
        if (defaultComp) onSelect(defaultComp)
      }
    }
  }

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault()
        searchInputRef.current?.focus()
      } else if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        setSearch('')
        searchInputRef.current?.blur()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Items for the current active tab
  const currentTabItems = useMemo(() => {
    return activeTab === 'blocks' ? blocksList : componentsList
  }, [activeTab, blocksList, componentsList])

  // Filter items by search query
  const filteredItems = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return currentTabItems
    return currentTabItems.filter(
      (i) =>
        i.id.toLowerCase().includes(q) ||
        i.name.toLowerCase().includes(q) ||
        i.categories?.some((c) => c.toLowerCase().includes(q)),
    )
  }, [currentTabItems, search])

  // Group items by category
  const groupedItems = useMemo(() => {
    const groups: Record<string, SidebarItem[]> = {}
    for (const item of filteredItems) {
      const cat = item.category || 'General'
      const formattedCat = cat.charAt(0).toUpperCase() + cat.slice(1)
      if (!groups[formattedCat]) groups[formattedCat] = []
      groups[formattedCat].push(item)
    }
    return groups
  }, [filteredItems])

  const sortedCategories = useMemo(() => {
    return Object.keys(groupedItems).sort((a, b) => {
      if (a === 'Blocks') return -1
      if (b === 'Blocks') return 1
      if (a === 'Charts') return -1
      if (b === 'Charts') return 1
      return a.localeCompare(b)
    })
  }, [groupedItems])

  const toggleCategory = (cat: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [cat]: !prev[cat],
    }))
  }

  return (
    <aside
      className={`border-border bg-card flex shrink-0 flex-col border-r transition-[width,opacity,border-right-width] duration-200 select-none ${
        collapsed ? 'pointer-events-none w-0 overflow-hidden border-r-0 p-0 opacity-0' : 'w-[300px]'
      }`}
    >
      {/* Brand Header: UIPKGE Registry Logo, Title & Collapse Action */}
      <div className="border-border bg-card/80 flex h-14 shrink-0 items-center justify-between border-b px-3.5">
        <div className="flex min-w-0 items-center gap-2.5">
          {/* UIPKGE Official Brand Icon */}
          <svg width="24" height="24" viewBox="0 0 32 32" className="shrink-0" aria-hidden="true">
            <rect x="0.5" y="0.5" width="31" height="31" rx="7" className="fill-card stroke-border" strokeWidth="1" />
            <rect x="6" y="6" width="8" height="8" rx="1.6" className="fill-foreground" />
            <rect x="18" y="6" width="8" height="8" rx="1.6" className="fill-primary" />
            <rect x="6" y="18" width="8" height="8" rx="1.6" className="fill-muted" />
            <rect x="18" y="18" width="8" height="8" rx="1.6" className="fill-foreground" />
          </svg>
          <div className="flex min-w-0 items-baseline gap-1.5">
            <span className="text-foreground font-display text-sm font-bold tracking-tight">UIPKGE</span>
            <span className="text-muted-foreground text-xs font-semibold">Registry</span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="border-border bg-muted/60 text-muted-foreground inline-flex items-center rounded border px-1.5 py-0.5 font-mono text-[10px] font-medium">
            v1.0
          </span>
          {onToggleCollapse && (
            <button
              type="button"
              className="border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md border shadow-2xs transition"
              onClick={onToggleCollapse}
              title="Close sidebar (⌘B)"
            >
              <PanelLeftClose className="size-3.5 shrink-0" />
            </button>
          )}
        </div>
      </div>

      {/* Top Header: Components & Blocks Tabs Side by Side + Search Bar */}
      <div className="border-border space-y-2.5 border-b p-3">
        {/* Tabs Side by Side: Flexible Components tab + snug Blocks tab */}
        <div className="bg-muted/60 border-border/50 flex items-center gap-1 rounded-lg border p-0.5 text-xs font-medium">
          <button
            type="button"
            id="tab-components"
            title="Components (UI Primitives)"
            className={`flex min-w-0 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md px-2 py-1.5 whitespace-nowrap transition select-none ${
              activeTab === 'components'
                ? 'bg-background text-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => switchTab('components')}
          >
            <Layers className="size-3.5 shrink-0" />
            <span className="text-xs font-medium">Components</span>
            <span
              className={`shrink-0 rounded-full px-1.5 py-0.5 font-mono text-[10px] leading-none tabular-nums ${
                activeTab === 'components' ? 'bg-muted text-foreground' : 'text-muted-foreground'
              }`}
            >
              {componentsList.length}
            </span>
          </button>

          <button
            type="button"
            id="tab-blocks"
            title="Blocks (Composed Layouts)"
            className={`flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-md px-2.5 py-1.5 whitespace-nowrap transition select-none ${
              activeTab === 'blocks'
                ? 'bg-background text-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => switchTab('blocks')}
          >
            <LayoutGrid className="size-3.5 shrink-0" />
            <span className="text-xs font-medium">Blocks</span>
            <span
              className={`shrink-0 rounded-full px-1.5 py-0.5 font-mono text-[10px] leading-none tabular-nums ${
                activeTab === 'blocks' ? 'bg-muted text-foreground' : 'text-muted-foreground'
              }`}
            >
              {blocksList.length}
            </span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="text-muted-foreground pointer-events-none absolute top-2.5 left-2.5 size-3.5" />
          <input
            ref={searchInputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={activeTab === 'blocks' ? 'Search blocks... (/)' : 'Search components... (/)'}
            className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary w-full rounded-md border py-1.5 pr-7 pl-8 font-sans text-xs shadow-xs focus:ring-1 focus:outline-none"
          />
          {search && (
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground absolute top-2.5 right-2.5 cursor-pointer"
              onClick={() => setSearch('')}
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 space-y-3 overflow-y-auto p-2">
        {sortedCategories.map((cat) => (
          <div key={cat} className="space-y-1">
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground flex w-full cursor-pointer items-center justify-between px-2 py-1 text-xs font-semibold tracking-tight transition"
              onClick={() => toggleCategory(cat)}
            >
              <div className="flex items-center gap-1.5">
                {collapsedCategories[cat] ? (
                  <ChevronRight className="text-muted-foreground/70 size-3 shrink-0" />
                ) : (
                  <ChevronDown className="text-muted-foreground/70 size-3 shrink-0" />
                )}
                <span>{cat}</span>
              </div>
              <span className="text-muted-foreground font-mono text-[10px]">{groupedItems[cat]?.length || 0}</span>
            </button>

            {!collapsedCategories[cat] && (
              <div className="space-y-0.5 pl-1">
                {groupedItems[cat]?.map((item) => (
                  <button
                    key={item.id}
                    id={`sidebar-item-${item.id}`}
                    type="button"
                    onClick={() => onSelect(item.id)}
                    className={`group flex w-full cursor-pointer items-center justify-between rounded-md px-2.5 py-1.5 text-left text-xs transition ${
                      selectedId === item.id
                        ? 'bg-primary text-primary-foreground font-medium shadow-xs'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <span className="truncate pr-2">{item.name}</span>
                    {(item.id.includes('chart') || item.category === 'Charts') && (
                      <span className="shrink-0 font-mono text-[10px] opacity-70">chart</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="text-muted-foreground py-8 text-center text-xs">
            No {activeTab === 'blocks' ? 'blocks' : 'components'} match &quot;{search}&quot;
          </div>
        )}
      </div>

      {/* Footer Counter */}
      <div className="border-border bg-muted/20 text-muted-foreground flex items-center justify-between border-t p-3 font-mono text-xs">
        <span>
          {filteredItems.length}{' '}
          {activeTab === 'blocks' ? (filteredItems.length === 1 ? 'block' : 'blocks') : 'components'}
        </span>
        <span>UIPKGE v1.0</span>
      </div>
    </aside>
  )
}
