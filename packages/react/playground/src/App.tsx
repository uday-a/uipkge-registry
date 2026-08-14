import React, { useState, useEffect, useMemo } from 'react'
import { Search, Sun, Moon, Check, Copy } from 'lucide-react'

// Discover all demos in packages/react/demos
const demoModules = import.meta.glob('../../demos/*.tsx')

interface DemoEntry {
  id: string
  name: string
  loader: () => Promise<any>
}

const demos: DemoEntry[] = Object.entries(demoModules).map(([path, loader]) => {
  const filename = path.split('/').pop()?.replace('.tsx', '') || ''
  return {
    id: filename,
    name: filename
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' '),
    loader: loader as () => Promise<any>,
  }
}).sort((a, b) => a.name.localeCompare(b.name))

export default function App() {
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(demos[0]?.id || 'button')
  const [ActiveComponent, setActiveComponent] = useState<React.ComponentType | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isDark, setIsDark] = useState(false)

  const filteredDemos = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return demos
    return demos.filter((d) => d.id.toLowerCase().includes(q) || d.name.toLowerCase().includes(q))
  }, [search])

  useEffect(() => {
    const target = demos.find((d) => d.id === selectedId)
    if (!target) return
    setLoading(true)
    target.loader()
      .then((mod) => {
        setActiveComponent(() => mod.default)
      })
      .catch((err) => {
        console.error('Failed to load React demo:', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [selectedId])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    if (next) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const copyCommand = (id: string) => {
    navigator.clipboard.writeText(`npx shadcn add https://uipkge.dev/r/react/${id}.json`)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const currentItem = demos.find((d) => d.id === selectedId)

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground font-sans antialiased">
      {/* Sidebar */}
      <aside className="flex w-72 shrink-0 flex-col border-r border-border bg-card">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground font-mono text-xs font-bold shadow-xs">
              UI
            </div>
            <div>
              <h1 className="text-xs font-bold tracking-tight">UIPKGE React</h1>
              <p className="text-[10px] text-muted-foreground font-mono">dev playground</p>
            </div>
          </div>
          <button
            type="button"
            className="flex size-7 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light' : 'Switch to Dark'}
          >
            {isDark ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Filter components..."
              className="w-full rounded-md border border-border bg-background pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Component List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          <div className="px-2 py-1 text-[11px] font-medium text-muted-foreground flex items-center justify-between">
            <span>Components & Blocks</span>
            <span className="font-mono text-[10px]">{filteredDemos.length}</span>
          </div>
          {filteredDemos.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-xs transition cursor-pointer ${
                selectedId === item.id
                  ? 'bg-primary text-primary-foreground font-medium shadow-xs'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
              onClick={() => setSelectedId(item.id)}
            >
              <span className="truncate">{item.name}</span>
              <span className="font-mono text-[10px] opacity-70 ml-2">{item.id}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col overflow-hidden bg-background">
        {/* Top Navigation Bar */}
        <header className="flex h-13 items-center justify-between border-b border-border px-6 bg-card/50 backdrop-blur">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold tracking-tight">{currentItem?.name}</h2>
            <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              @uipkge/{selectedId}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
              onClick={() => copyCommand(selectedId)}
            >
              {copied ? <Check className="size-3 text-success" /> : <Copy className="size-3" />}
              <span>npx shadcn add @uipkge/{selectedId}</span>
            </button>
          </div>
        </header>

        {/* Preview Canvas */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-4xl">
            {loading ? (
              <div className="flex items-center justify-center py-20 text-muted-foreground text-xs font-mono">
                Loading preview...
              </div>
            ) : ActiveComponent ? (
              <ActiveComponent />
            ) : (
              <div className="text-center py-20 text-muted-foreground text-xs">
                Select a component from the sidebar to preview
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
