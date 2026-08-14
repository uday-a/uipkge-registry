import * as React from 'react'
import {
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Check,
  Copy,
  Eye,
  EyeOff,
  Layers,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface LayoutWidget {
  id: string
  name: string
  category: string
  visible: boolean
  colSpan: number
  previewSnippet: string
}

export interface FeatureDragDropOrganizerProps {
  title?: string
  description?: string
  className?: string
}

const INITIAL_WIDGETS: LayoutWidget[] = [
  {
    id: 'widget-kpi',
    name: 'Real-time KPI Metrics',
    category: 'Analytics',
    visible: true,
    colSpan: 12,
    previewSnippet: '3 Cards: $124.5k MRR • 18ms Latency • 99.99% Uptime',
  },
  {
    id: 'widget-chart',
    name: 'Traffic Sparkline Chart',
    category: 'Telemetry',
    visible: true,
    colSpan: 8,
    previewSnippet: 'SVG Real-time stream (35,000 req/s live)',
  },
  {
    id: 'widget-nodes',
    name: 'Edge PoP Status',
    category: 'Infrastructure',
    visible: true,
    colSpan: 4,
    previewSnippet: '8 global edge regions active (optimal)',
  },
  {
    id: 'widget-feed',
    name: 'Deployment Activity Feed',
    category: 'Workflows',
    visible: true,
    colSpan: 12,
    previewSnippet: 'sha-a81f9c deployed to edge via CLI (2 mins ago)',
  },
]

export function FeatureDragDropOrganizer({
  title = 'Arrange dashboard layouts intuitively with zero boilerplate.',
  description = 'Customize widget order, toggle component visibility, and export clean declarative JSON layout schemas for your application.',
  className,
}: FeatureDragDropOrganizerProps) {
  const [widgets, setWidgets] = React.useState<LayoutWidget[]>([...INITIAL_WIDGETS])
  const [copied, setCopied] = React.useState(false)

  function moveWidget(index: number, direction: 'up' | 'down') {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= widgets.length) return

    const updated = [...widgets]
    const [removed] = updated.splice(index, 1)
    updated.splice(targetIndex, 0, removed)
    setWidgets(updated)
  }

  function toggleVisibility(index: number) {
    setWidgets((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], visible: !next[index].visible }
      return next
    })
  }

  function resetLayout() {
    setWidgets(JSON.parse(JSON.stringify(INITIAL_WIDGETS)))
  }

  const exportJson = React.useMemo(() => {
    return JSON.stringify(
      widgets.map((w, idx) => ({
        order: idx,
        id: w.id,
        name: w.name,
        visible: w.visible,
        colSpan: w.colSpan,
      })),
      null,
      2,
    )
  }, [widgets])

  async function copyJson() {
    try {
      await navigator.clipboard.writeText(exportJson)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch {
      // fallback
    }
  }

  return (
    <section
      data-slot="feature-drag-drop-organizer"
      className={cn('bg-background relative overflow-hidden py-16 sm:py-24', className)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <a
            href="#layout-organizer"
            className="group border-border/80 bg-secondary/60 hover:bg-secondary text-foreground inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-medium shadow-2xs transition-colors"
          >
            <Sparkles className="text-primary size-3.5" />
            <span>Composable Layout Workbench</span>
            <ArrowRight className="text-muted-foreground size-3 transition-transform group-hover:translate-x-0.5" />
          </a>

          <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>

          <p className="text-muted-foreground text-base sm:text-lg">{description}</p>
        </div>

        {/* Workbench Grid (2 Columns: Controls & Live Canvas) */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left: Widget Re-ordering Controls (6 Cols) */}
          <Card className="border-border bg-card/80 flex flex-col justify-between shadow-xs backdrop-blur-xs lg:col-span-6">
            <CardContent className="space-y-5 p-6">
              <div className="border-border flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="text-primary size-4" />
                  <span className="text-foreground text-sm font-semibold">Widget Hierarchy</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground h-7 gap-1 px-2 font-mono text-xs"
                  onClick={resetLayout}
                >
                  <RotateCcw className="size-3" />
                  <span>Reset</span>
                </Button>
              </div>

              {/* Reorderable List of Widgets */}
              <div className="space-y-2">
                {widgets.map((widget, idx) => (
                  <div
                    key={widget.id}
                    className={cn(
                      'flex items-center justify-between rounded-lg border p-3 transition-all',
                      widget.visible ? 'border-border bg-background' : 'border-border/60 bg-muted/30 opacity-60',
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="text-muted-foreground flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          className="hover:bg-muted rounded p-1 transition-colors disabled:opacity-30"
                          onClick={() => moveWidget(idx, 'up')}
                        >
                          <ArrowUp className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === widgets.length - 1}
                          className="hover:bg-muted rounded p-1 transition-colors disabled:opacity-30"
                          onClick={() => moveWidget(idx, 'down')}
                        >
                          <ArrowDown className="size-3.5" />
                        </button>
                      </div>

                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-foreground text-xs font-bold">{widget.name}</span>
                          <Badge variant="outline" className="border-border text-muted-foreground text-xs">
                            {widget.category}
                          </Badge>
                        </div>
                        <div className="text-muted-foreground truncate text-xs">{widget.previewSnippet}</div>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-foreground size-8 shrink-0"
                      onClick={() => toggleVisibility(idx)}
                    >
                      {widget.visible ? <Eye className="text-primary size-3.5" /> : <EyeOff className="size-3.5" />}
                    </Button>
                  </div>
                ))}
              </div>

              {/* Export JSON Box */}
              <div className="border-border space-y-2 border-t pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-foreground font-medium">Generated Layout JSON</span>
                  <Button variant="ghost" size="sm" className="h-6 gap-1 px-2 font-mono text-xs" onClick={copyJson}>
                    {copied ? <Check className="text-primary size-3" /> : <Copy className="size-3" />}
                    <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                  </Button>
                </div>
                <pre className="border-border bg-muted/40 text-muted-foreground max-h-32 overflow-y-auto rounded-lg border p-2.5 font-mono text-xs">
                  <code>{exportJson}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Right: Live Canvas Preview (6 Cols) */}
          <Card className="border-border bg-card/80 flex flex-col justify-between shadow-xs backdrop-blur-xs lg:col-span-6">
            <CardContent className="space-y-4 p-6">
              <div className="border-border flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="size-4 text-emerald-500" />
                  <span className="text-foreground text-sm font-semibold">Rendered Canvas Preview</span>
                </div>
                <span className="font-mono text-xs text-emerald-500">Live Synchronized</span>
              </div>

              {/* Simulated Dashboard Canvas with Reordered Components */}
              <div className="border-border/80 bg-background/80 space-y-3 rounded-lg border p-4">
                {widgets.map((widget) =>
                  widget.visible ? (
                    <div
                      key={widget.id}
                      className="border-border bg-muted/30 space-y-1 rounded-lg border p-3 transition-all"
                    >
                      <div className="text-foreground flex items-center justify-between text-xs font-semibold">
                        <span>{widget.name}</span>
                        <span className="text-muted-foreground font-mono text-xs">col-span-{widget.colSpan}</span>
                      </div>
                      <div className="text-muted-foreground text-xs">{widget.previewSnippet}</div>
                    </div>
                  ) : null,
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
