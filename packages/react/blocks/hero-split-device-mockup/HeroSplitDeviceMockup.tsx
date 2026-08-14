import * as React from 'react'
import { ArrowRight, Monitor, Moon, Smartphone, Sparkles, Sun, Tablet } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface HeroSplitDeviceMockupProps {
  title?: string
  description?: string
  className?: string
}

type DeviceMode = 'desktop' | 'tablet' | 'mobile'

const MOCK_KPIS = [
  { label: 'Active Sessions', value: '24,892', change: '+14.2%', status: 'up' },
  { label: 'Conversion Rate', value: '4.82%', change: '+0.6%', status: 'up' },
  { label: 'Avg TTFB', value: '18ms', change: '-4ms', status: 'optimal' },
]

export function HeroSplitDeviceMockup({
  title = 'Responsive components with identical fidelity on every device.',
  description = 'Every primitive and block is engineered with fluid container queries and zero layout shift across desktop, tablet, and mobile displays.',
  className,
}: HeroSplitDeviceMockupProps) {
  const [activeMode, setActiveMode] = React.useState<DeviceMode>('desktop')
  const [isDarkMode, setIsDarkMode] = React.useState(true)
  const [activeTab, setActiveTab] = React.useState<'overview' | 'analytics' | 'activity'>('overview')

  const viewportWidthClass = React.useMemo(() => {
    if (activeMode === 'desktop') return 'w-full max-w-2xl'
    if (activeMode === 'tablet') return 'w-full max-w-md'
    return 'w-full max-w-[320px]'
  }, [activeMode])

  return (
    <section
      data-slot="hero-split-device-mockup"
      className={cn('bg-background relative overflow-hidden py-16 sm:py-24 lg:py-28', className)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Title & Badge Area */}
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <a
            href="#device-preview"
            className="group border-border/80 bg-secondary/60 hover:bg-secondary text-foreground inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-medium shadow-2xs transition-colors"
          >
            <Sparkles className="text-primary size-3.5" />
            <span>Fluid Container Queries &bull; Tailwind v4 Ready</span>
            <ArrowRight className="text-muted-foreground size-3 transition-transform group-hover:translate-x-0.5" />
          </a>

          <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{title}</h1>

          <p className="text-muted-foreground text-base sm:text-lg">{description}</p>

          {/* Viewport Controls & Interactive Triggers */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <div className="border-border bg-muted/50 inline-flex rounded-lg border p-1 shadow-2xs">
              <button
                type="button"
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all',
                  activeMode === 'desktop'
                    ? 'bg-background text-foreground shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground',
                )}
                onClick={() => setActiveMode('desktop')}
              >
                <Monitor className="size-3.5" />
                <span>Desktop (1440px)</span>
              </button>

              <button
                type="button"
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all',
                  activeMode === 'tablet'
                    ? 'bg-background text-foreground shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground',
                )}
                onClick={() => setActiveMode('tablet')}
              >
                <Tablet className="size-3.5" />
                <span>Tablet (768px)</span>
              </button>

              <button
                type="button"
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all',
                  activeMode === 'mobile'
                    ? 'bg-background text-foreground shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground',
                )}
                onClick={() => setActiveMode('mobile')}
              >
                <Smartphone className="size-3.5" />
                <span>Mobile (375px)</span>
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="border-border gap-1.5 text-xs"
              onClick={() => setIsDarkMode((prev) => !prev)}
            >
              {isDarkMode ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
              <span>{isDarkMode ? 'Dark Frame' : 'Light Frame'}</span>
            </Button>
          </div>
        </div>

        {/* Split Device Mockup Canvas */}
        <div className="mt-12 flex justify-center">
          <div
            className={cn(
              'border-border bg-card rounded-xl border p-2 shadow-md transition-all duration-300 ease-out sm:p-3',
              viewportWidthClass,
              isDarkMode ? 'dark' : '',
            )}
          >
            {/* Browser / Device Chrome Header */}
            <div className="border-border/80 flex items-center justify-between border-b px-2 pt-1 pb-2.5">
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-rose-500/80" />
                <span className="size-2.5 rounded-full bg-amber-500/80" />
                <span className="size-2.5 rounded-full bg-emerald-500/80" />
              </div>

              {/* URL Bar */}
              <div className="border-border/60 bg-muted/60 text-muted-foreground mx-auto flex h-6 w-1/2 items-center justify-center truncate rounded-md border px-2 font-mono text-xs">
                https://uipkge.dev/demo/dashboard-kpis
              </div>

              <div className="text-muted-foreground flex items-center gap-1">
                <span className="size-2 rounded-full bg-emerald-500" />
                <span className="font-mono text-xs">LIVE</span>
              </div>
            </div>

            {/* Inside Interactive Device Application */}
            <div className="bg-background space-y-4 rounded-lg p-4 pt-4">
              {/* App Header Inside Frame */}
              <div className="border-border flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md text-xs font-bold">
                    UI
                  </div>
                  <div>
                    <div className="text-foreground text-xs font-semibold">Platform Metrics</div>
                    <div className="text-muted-foreground text-xs">Production Cluster (us-east-1)</div>
                  </div>
                </div>

                {/* Inner App Tabs */}
                <div className="border-border bg-muted/40 flex gap-1 rounded-md border p-0.5">
                  <button
                    type="button"
                    className={cn(
                      'rounded px-2 py-0.5 text-xs font-medium transition-colors',
                      activeTab === 'overview'
                        ? 'bg-background text-foreground shadow-2xs'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                    onClick={() => setActiveTab('overview')}
                  >
                    Overview
                  </button>
                  <button
                    type="button"
                    className={cn(
                      'rounded px-2 py-0.5 text-xs font-medium transition-colors',
                      activeTab === 'analytics'
                        ? 'bg-background text-foreground shadow-2xs'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                    onClick={() => setActiveTab('analytics')}
                  >
                    Analytics
                  </button>
                </div>
              </div>

              {/* KPI Metric Grid in Frame */}
              <div className={cn('grid gap-2.5', activeMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-3')}>
                {MOCK_KPIS.map((kpi, idx) => (
                  <Card key={idx} className="border-border bg-card/60 shadow-2xs">
                    <CardContent className="space-y-1 p-3">
                      <div className="text-muted-foreground text-xs font-medium">{kpi.label}</div>
                      <div className="text-foreground text-lg font-bold tracking-tight">{kpi.value}</div>
                      <div className="flex items-center gap-1 text-xs font-medium text-emerald-500">
                        <span>{kpi.change}</span>
                        <span className="text-muted-foreground">&bull; vs last week</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Interactive Wave / Chart Preview */}
              <div className="border-border/80 bg-muted/20 space-y-2 rounded-lg border p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-foreground font-medium">Real-time Telemetry Stream</span>
                  <Badge variant="outline" className="border-border font-mono text-xs text-emerald-500">
                    Synced: 0.2ms
                  </Badge>
                </div>

                {/* SVG Mock Sparkline Chart */}
                <svg
                  className="stroke-primary fill-primary/10 h-16 w-full"
                  viewBox="0 0 300 60"
                  preserveAspectRatio="none"
                >
                  <path d="M0 45 Q 25 20, 50 35 T 100 25 T 150 15 T 200 30 T 250 10 T 300 20 L 300 60 L 0 60 Z" />
                  <path
                    d="M0 45 Q 25 20, 50 35 T 100 25 T 150 15 T 200 30 T 250 10 T 300 20"
                    fill="none"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
