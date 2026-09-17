'use client'

import * as React from 'react'
import { Globe, X } from 'lucide-react'
import { DottedMapChart, type MapPin, type MapRoute } from '@/components/ui/charts/dotted-map-chart'
import { cn } from '@/lib/utils'

export interface EdgeNode {
  id: string
  name: string
  code: string
  region: 'Americas' | 'Europe' | 'APAC'
  city: string
  country: string
  role: string
  lat: number
  lng: number
  latencyMs: number
  throughput: string
  status: 'optimal' | 'degraded'
}

const REGIONS = ['All', 'Americas', 'Europe', 'APAC'] as const
type RegionFilter = (typeof REGIONS)[number]

const ALL_NODES: EdgeNode[] = [
  {
    id: 'sfo-01',
    name: 'SFO-Edge-1',
    code: 'SFO',
    region: 'Americas',
    city: 'San Francisco',
    country: 'United States',
    role: 'Tier-1 Gateway',
    lat: 37.7749,
    lng: -122.4194,
    latencyMs: 18,
    throughput: '340 Gbps',
    status: 'optimal',
  },
  {
    id: 'iad-01',
    name: 'IAD-Edge-1',
    code: 'IAD',
    region: 'Americas',
    city: 'Ashburn',
    country: 'United States',
    role: 'Primary Transit Core',
    lat: 39.0438,
    lng: -77.4874,
    latencyMs: 12,
    throughput: '520 Gbps',
    status: 'optimal',
  },
  {
    id: 'ord-01',
    name: 'ORD-Edge-1',
    code: 'ORD',
    region: 'Americas',
    city: 'Chicago',
    country: 'United States',
    role: 'Midwest Exchange',
    lat: 41.8781,
    lng: -87.6298,
    latencyMs: 19,
    throughput: '280 Gbps',
    status: 'optimal',
  },
  {
    id: 'gru-01',
    name: 'GRU-Edge-1',
    code: 'GRU',
    region: 'Americas',
    city: 'São Paulo',
    country: 'Brazil',
    role: 'LATAM Core Transit',
    lat: -23.5505,
    lng: -46.6333,
    latencyMs: 44,
    throughput: '140 Gbps',
    status: 'degraded',
  },
  {
    id: 'lhr-01',
    name: 'LHR-Edge-1',
    code: 'LHR',
    region: 'Europe',
    city: 'London',
    country: 'United Kingdom',
    role: 'EMEA Backbone Core',
    lat: 51.5074,
    lng: -0.1278,
    latencyMs: 14,
    throughput: '480 Gbps',
    status: 'optimal',
  },
  {
    id: 'fra-01',
    name: 'FRA-Edge-1',
    code: 'FRA',
    region: 'Europe',
    city: 'Frankfurt',
    country: 'Germany',
    role: 'DE-CIX Direct Peer',
    lat: 50.1109,
    lng: 8.6821,
    latencyMs: 16,
    throughput: '410 Gbps',
    status: 'optimal',
  },
  {
    id: 'ams-01',
    name: 'AMS-Edge-1',
    code: 'AMS',
    region: 'Europe',
    city: 'Amsterdam',
    country: 'Netherlands',
    role: 'AMS-IX Transit Ring',
    lat: 52.3676,
    lng: 4.9041,
    latencyMs: 15,
    throughput: '390 Gbps',
    status: 'optimal',
  },
  {
    id: 'nrt-01',
    name: 'NRT-Edge-1',
    code: 'NRT',
    region: 'APAC',
    city: 'Tokyo',
    country: 'Japan',
    role: 'East Asia Gateway',
    lat: 35.6762,
    lng: 139.6503,
    latencyMs: 22,
    throughput: '360 Gbps',
    status: 'optimal',
  },
  {
    id: 'sin-01',
    name: 'SIN-Edge-1',
    code: 'SIN',
    region: 'APAC',
    city: 'Singapore',
    country: 'Singapore',
    role: 'South Asia Gateway',
    lat: 1.3521,
    lng: 103.8198,
    latencyMs: 26,
    throughput: '290 Gbps',
    status: 'optimal',
  },
  {
    id: 'syd-01',
    name: 'SYD-Edge-1',
    code: 'SYD',
    region: 'APAC',
    city: 'Sydney',
    country: 'Australia',
    role: 'Oceania Anycast POP',
    lat: -33.8688,
    lng: 151.2093,
    latencyMs: 31,
    throughput: '170 Gbps',
    status: 'optimal',
  },
]

interface CorridorDefinition {
  fromNodeId: string
  toNodeId: string
  color?: string
  duration?: number
  curvature?: number
  dashed?: boolean
  label: string
}

const CORRIDORS: CorridorDefinition[] = [
  {
    fromNodeId: 'sfo-01',
    toNodeId: 'iad-01',
    color: 'var(--chart-1)',
    duration: 2.6,
    curvature: 0.2,
    label: 'Trans-US Backbone (SFO ↔ IAD)',
  },
  {
    fromNodeId: 'sfo-01',
    toNodeId: 'ord-01',
    color: 'var(--chart-1)',
    duration: 2.2,
    curvature: 0.16,
    dashed: true,
    label: 'Central Overland (SFO ↔ ORD)',
  },
  {
    fromNodeId: 'ord-01',
    toNodeId: 'iad-01',
    color: 'var(--chart-1)',
    duration: 1.8,
    curvature: 0.14,
    label: 'Great Lakes Trunk (ORD ↔ IAD)',
  },
  {
    fromNodeId: 'iad-01',
    toNodeId: 'lhr-01',
    color: 'var(--chart-2)',
    duration: 3.2,
    curvature: 0.28,
    label: 'Transatlantic Express (IAD ↔ LHR)',
  },
  {
    fromNodeId: 'lhr-01',
    toNodeId: 'fra-01',
    color: 'var(--chart-3)',
    duration: 1.9,
    curvature: 0.15,
    label: 'Channel Link (LHR ↔ FRA)',
  },
  {
    fromNodeId: 'fra-01',
    toNodeId: 'ams-01',
    color: 'var(--chart-3)',
    duration: 1.7,
    curvature: 0.14,
    dashed: true,
    label: 'Rhine Valley Ring (FRA ↔ AMS)',
  },
  {
    fromNodeId: 'lhr-01',
    toNodeId: 'ams-01',
    color: 'var(--chart-3)',
    duration: 1.8,
    curvature: 0.16,
    label: 'North Sea Subsea (LHR ↔ AMS)',
  },
  {
    fromNodeId: 'fra-01',
    toNodeId: 'sin-01',
    color: 'var(--chart-4)',
    duration: 3.6,
    curvature: 0.22,
    label: 'Eurasia Optical Trunk (FRA ↔ SIN)',
  },
  {
    fromNodeId: 'sin-01',
    toNodeId: 'nrt-01',
    color: 'var(--chart-4)',
    duration: 2.5,
    curvature: 0.18,
    label: 'East Asia Marine Cable (SIN ↔ NRT)',
  },
  {
    fromNodeId: 'sin-01',
    toNodeId: 'syd-01',
    color: 'var(--chart-5)',
    duration: 3.0,
    curvature: 0.22,
    dashed: true,
    label: 'Southern Cross Link (SIN ↔ SYD)',
  },
  {
    fromNodeId: 'nrt-01',
    toNodeId: 'sfo-01',
    color: 'var(--chart-2)',
    duration: 3.8,
    curvature: 0.3,
    label: 'Pacific High-Speed (NRT ↔ SFO)',
  },
  {
    fromNodeId: 'iad-01',
    toNodeId: 'gru-01',
    color: 'var(--chart-5)',
    duration: 3.4,
    curvature: 0.24,
    label: 'Americas Interlink (IAD ↔ GRU)',
  },
]

export function GlobalEdgeNetwork() {
  const [activeRegion, setActiveRegion] = React.useState<RegionFilter>('All')
  const [selectedNode, setSelectedNode] = React.useState<EdgeNode | null>(null)
  const [hoveredNode, setHoveredNode] = React.useState<EdgeNode | null>(null)

  const activeNode = hoveredNode || selectedNode

  const setRegion = (region: RegionFilter) => {
    setActiveRegion(region)
    if (selectedNode && region !== 'All' && selectedNode.region !== region) {
      setSelectedNode(null)
    }
  }

  const handlePinClick = (pin: MapPin) => {
    const node = ALL_NODES.find((n) => n.lat === pin.lat && n.lng === pin.lng)
    if (node) {
      setSelectedNode((prev) => (prev?.id === node.id ? null : node))
    }
  }

  const handlePinHover = (pin: MapPin | null) => {
    if (!pin) {
      setHoveredNode(null)
    } else {
      setHoveredNode(ALL_NODES.find((n) => n.lat === pin.lat && n.lng === pin.lng) ?? null)
    }
  }

  const filteredNodes = React.useMemo(() => {
    if (activeRegion === 'All') return ALL_NODES
    return ALL_NODES.filter((n) => n.region === activeRegion)
  }, [activeRegion])

  const nodeMap = React.useMemo(() => new Map(ALL_NODES.map((n) => [n.id, n])), [])

  const mapPins = React.useMemo<MapPin[]>(() => {
    return filteredNodes.map((n) => ({
      lat: n.lat,
      lng: n.lng,
      label: `${n.city} (${n.code})`,
      color: n.status === 'optimal' ? 'var(--chart-1)' : '#f59e0b',
      description: n.role,
      value: `${n.latencyMs}ms • ${n.throughput}`,
      status: n.status,
    }))
  }, [filteredNodes])

  const mapRoutes = React.useMemo<MapRoute[]>(() => {
    const visibleIds = new Set(filteredNodes.map((n) => n.id))
    return CORRIDORS.filter((c) => {
      if (activeRegion === 'All') return true
      return visibleIds.has(c.fromNodeId) && visibleIds.has(c.toNodeId)
    })
      .map((c) => {
        const fromNode = nodeMap.get(c.fromNodeId)
        const toNode = nodeMap.get(c.toNodeId)
        if (!fromNode || !toNode) return null
        return {
          from: { lat: fromNode.lat, lng: fromNode.lng },
          to: { lat: toNode.lat, lng: toNode.lng },
          color: c.color ?? 'var(--primary)',
          duration: c.duration ?? 3,
          curvature: c.curvature ?? 0.2,
          dashed: c.dashed,
          label: c.label,
        }
      })
      .filter(Boolean) as MapRoute[]
  }, [activeRegion, filteredNodes, nodeMap])

  const activeNodesText = React.useMemo(() => {
    switch (activeRegion) {
      case 'Americas':
        return '12 Nodes Active'
      case 'Europe':
        return '11 Nodes Active'
      case 'APAC':
        return '9 Nodes Active'
      default:
        return '32 Nodes Active'
    }
  }, [activeRegion])

  const activeAvgLatencyText = React.useMemo(() => {
    switch (activeRegion) {
      case 'Americas':
        return '16ms avg'
      case 'Europe':
        return '15ms avg'
      case 'APAC':
        return '26ms avg'
      default:
        return '18ms avg'
    }
  }, [activeRegion])

  const p95Latency = React.useMemo(() => {
    switch (activeRegion) {
      case 'Americas':
        return '19ms'
      case 'Europe':
        return '16ms'
      case 'APAC':
        return '28ms'
      default:
        return '24ms'
    }
  }, [activeRegion])

  return (
    <div
      data-slot="global-edge-network"
      className="border-border bg-card/60 relative h-[500px] w-full overflow-hidden rounded-xl border shadow-xs backdrop-blur-xs"
    >
      {/* Map Canvas (Hero) */}
      <DottedMapChart
        pins={mapPins}
        routes={mapRoutes}
        height={500}
        ariaLabel="Global Anycast Edge Network World Map"
        className="h-full w-full"
        onPinClick={handlePinClick}
        onPinHover={handlePinHover}
      />

      {/* Top-Left Floating Chip: Title & Status */}
      <div className="pointer-events-none absolute top-3 left-3 z-10 sm:top-4 sm:left-4">
        <div className="border-border/60 bg-background/80 pointer-events-auto inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium shadow-xs backdrop-blur-md">
          <span className="text-foreground flex items-center gap-1.5">
            <Globe className="text-muted-foreground h-3.5 w-3.5" />
            <span className="tracking-tight">Global Transit Mesh</span>
          </span>
          <span className="text-muted-foreground/40">•</span>
          <span className="text-muted-foreground inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            <span>{activeNodesText}</span>
          </span>
          <span className="text-muted-foreground/40 hidden md:inline">•</span>
          <span className="text-muted-foreground hidden font-mono md:inline">{activeAvgLatencyText}</span>
        </div>
      </div>

      {/* Top-Right Floating Chip: Glass Segmented Region Filter */}
      <div className="pointer-events-none absolute top-3 right-3 z-10 sm:top-4 sm:right-4">
        <div className="border-border/60 bg-muted/60 pointer-events-auto inline-flex items-center gap-0.5 rounded-lg border p-0.5 text-xs shadow-xs backdrop-blur-md">
          {REGIONS.map((region) => (
            <button
              key={region}
              type="button"
              className={cn(
                'rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-150',
                activeRegion === region
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/40',
              )}
              onClick={() => setRegion(region)}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom-Left Floating Chip: Interactive Node Inspector */}
      <div className="pointer-events-none absolute bottom-3 left-3 z-10 sm:bottom-4 sm:left-4">
        <div className="border-border/60 bg-background/80 pointer-events-auto inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs shadow-xs backdrop-blur-md transition-all duration-150">
          {activeNode ? (
            <>
              <span
                className={cn(
                  'h-1.5 w-1.5 shrink-0 rounded-full',
                  activeNode.status === 'optimal' ? 'bg-emerald-500' : 'bg-amber-500',
                )}
              />
              <span className="text-foreground font-medium">
                {activeNode.city} ({activeNode.code})
              </span>
              <span className="text-muted-foreground/40">•</span>
              <span className="text-muted-foreground font-mono">{activeNode.latencyMs}ms</span>
              <span className="text-muted-foreground/40 hidden sm:inline">•</span>
              <span className="text-muted-foreground hidden font-mono sm:inline">{activeNode.throughput}</span>
              {selectedNode && (
                <button
                  type="button"
                  aria-label="Clear selection"
                  className="text-muted-foreground hover:text-foreground hover:bg-muted -mr-1 ml-0.5 rounded-full p-0.5 transition-colors"
                  onClick={() => setSelectedNode(null)}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </>
          ) : (
            <>
              <span className="bg-muted-foreground/40 h-1.5 w-1.5 shrink-0 rounded-full" />
              <span className="text-muted-foreground">Click a node to inspect</span>
            </>
          )}
        </div>
      </div>

      {/* Bottom-Right Floating Chip: Minimal Latency Badge */}
      <div className="pointer-events-none absolute right-3 bottom-3 z-10 sm:right-4 sm:bottom-4">
        <div className="border-border/60 bg-background/80 pointer-events-auto inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium shadow-xs backdrop-blur-md">
          <span className="text-muted-foreground">P95</span>
          <span className="text-foreground font-mono">{p95Latency}</span>
        </div>
      </div>
    </div>
  )
}
