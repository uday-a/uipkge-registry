'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LeafletMap, LeafletMarker, LeafletPolyline } from '@/components/ui/leaflet-map'

export type AttackVectorType = 'volumetric' | 'l7' | 'botnet'
export type MitigationAction = 'DROP' | 'CHALLENGE' | 'RATE_LIMIT'

export interface ThreatOrigin {
  id: string
  country: string
  countryCode: string
  volume: string
  vectorType: AttackVectorType
  mitigation: MitigationAction
  /** [lng, lat] */
  lngLat: [number, number]
  targetEdgeId: string
}

export interface EdgePoP {
  id: string
  code: string
  city: string
  /** [lng, lat] */
  lngLat: [number, number]
}

export interface AttackArc {
  id: string
  originId: string
  edgeId: string
  /** Sampled arc path as [lng, lat][]. */
  path: [number, number][]
  vectorType: AttackVectorType
}

export interface LeafletThreatMapRadarProps extends React.HTMLAttributes<HTMLDivElement> {
  origins?: ThreatOrigin[]
}

const defaultOrigins: ThreatOrigin[] = [
  {
    id: 'origin-1',
    country: 'China',
    countryCode: 'CN',
    volume: '642.5K/s',
    vectorType: 'l7',
    mitigation: 'DROP',
    lngLat: [104.2, 35.9],
    targetEdgeId: 'edge-nrt',
  },
  {
    id: 'origin-2',
    country: 'Russia',
    countryCode: 'RU',
    volume: '418.2K/s',
    vectorType: 'l7',
    mitigation: 'CHALLENGE',
    lngLat: [37.6, 55.7],
    targetEdgeId: 'edge-fra',
  },
  {
    id: 'origin-3',
    country: 'Brazil',
    countryCode: 'BR',
    volume: '285.4K/s',
    vectorType: 'botnet',
    mitigation: 'RATE_LIMIT',
    lngLat: [-51.9, -14.2],
    targetEdgeId: 'edge-iad',
  },
  {
    id: 'origin-4',
    country: 'Vietnam',
    countryCode: 'VN',
    volume: '194.0K/s',
    vectorType: 'volumetric',
    mitigation: 'DROP',
    lngLat: [105.8, 21.0],
    targetEdgeId: 'edge-sin',
  },
]

const edgeNodes: EdgePoP[] = [
  { id: 'edge-iad', code: 'IAD', city: 'Ashburn', lngLat: [-77.45, 39.04] },
  { id: 'edge-fra', code: 'FRA', city: 'Frankfurt', lngLat: [8.68, 50.11] },
  { id: 'edge-nrt', code: 'NRT', city: 'Tokyo', lngLat: [139.69, 35.69] },
  { id: 'edge-sin', code: 'SIN', city: 'Singapore', lngLat: [103.85, 1.29] },
  { id: 'edge-gru', code: 'GRU', city: 'São Paulo', lngLat: [-46.63, -23.55] },
]

// Curved attack arc: sample a quadratic bezier whose control point bows
// perpendicular to the route (biased northward) for a great-circle feel.
function arcPath(from: [number, number], to: [number, number], bend = 0.22): [number, number][] {
  const dx = to[0] - from[0]
  const dy = to[1] - from[1]
  const dist = Math.hypot(dx, dy) || 1
  let nx = -dy / dist
  let ny = dx / dist
  if (ny < 0) {
    nx = -nx
    ny = -ny
  }
  const cx = (from[0] + to[0]) / 2 + nx * dist * bend
  const cy = (from[1] + to[1]) / 2 + ny * dist * bend
  const points: [number, number][] = []
  const steps = 32
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const u = 1 - t
    points.push([u * u * from[0] + 2 * u * t * cx + t * t * to[0], u * u * from[1] + 2 * u * t * cy + t * t * to[1]])
  }
  return points
}

const attackArcs: AttackArc[] = [
  {
    id: 'arc-1',
    originId: 'origin-1',
    edgeId: 'edge-nrt',
    vectorType: 'l7',
    path: arcPath([104.2, 35.9], [139.69, 35.69], 0.3),
  },
  {
    id: 'arc-2',
    originId: 'origin-1',
    edgeId: 'edge-iad',
    vectorType: 'l7',
    path: arcPath([104.2, 35.9], [-77.45, 39.04], 0.22),
  },
  {
    id: 'arc-3',
    originId: 'origin-2',
    edgeId: 'edge-fra',
    vectorType: 'l7',
    path: arcPath([37.6, 55.7], [8.68, 50.11], 0.35),
  },
  {
    id: 'arc-4',
    originId: 'origin-3',
    edgeId: 'edge-iad',
    vectorType: 'botnet',
    path: arcPath([-51.9, -14.2], [-77.45, 39.04], 0.25),
  },
  {
    id: 'arc-5',
    originId: 'origin-4',
    edgeId: 'edge-sin',
    vectorType: 'volumetric',
    path: arcPath([105.8, 21.0], [103.85, 1.29], 0.35),
  },
]

// `hex` feeds Leaflet path options; `dot`/`ping` feed the div-icon markers.
const VECTOR_STYLES: Record<AttackVectorType, { hex: string; dot: string; ping: string }> = {
  volumetric: { hex: '#f43f5e', dot: 'bg-rose-500', ping: 'bg-rose-400' },
  l7: { hex: '#f59e0b', dot: 'bg-amber-500', ping: 'bg-amber-400' },
  botnet: { hex: '#a855f7', dot: 'bg-purple-500', ping: 'bg-purple-400' },
}

function mitigationVariant(action: MitigationAction) {
  if (action === 'DROP') return 'destructive' as const
  if (action === 'CHALLENGE') return 'warning' as const
  return 'info' as const
}

export function LeafletThreatMapRadar({ className, origins = defaultOrigins, ...props }: LeafletThreatMapRadarProps) {
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const filteredArcs = selectedId ? attackArcs.filter((arc) => arc.originId === selectedId) : attackArcs

  const selectOrigin = (id: string) => {
    setSelectedId((current) => (current === id ? null : id))
  }

  return (
    <div
      data-slot="leaflet-threat-map-radar"
      className={cn('flex h-full min-h-0 flex-col gap-4', className)}
      {...props}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-foreground text-lg font-semibold tracking-tight">Threat Radar</h2>
          <Badge
            variant="outline"
            className="border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-700 dark:text-emerald-400"
          >
            Live
          </Badge>
        </div>
        <p className="text-muted-foreground text-xs">
          {origins.length} origins · {edgeNodes.length} edge PoPs
        </p>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-12">
        <Card className="border-border flex min-h-0 flex-col overflow-hidden shadow-xs lg:col-span-8">
          <div className="relative min-h-[360px] flex-1 overflow-hidden bg-zinc-950">
            <LeafletMap
              variant="dark"
              center={[10, 30]}
              zoom={2}
              minZoom={2}
              navigation={false}
              scrollWheelZoom={false}
              className="pointer-events-none absolute inset-0 size-full"
            >
              {/* Radar sweep: a rotating conic-gradient wedge layered over the
                  tiles, plus two static range rings. */}
              <div className="pointer-events-none absolute inset-0 z-[500] flex items-center justify-center">
                <div className="absolute size-[340px] rounded-full border border-emerald-500/15" />
                <div className="absolute size-[220px] rounded-full border border-emerald-500/15" />
                <div className="size-[340px] animate-[spin_9s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,rgba(16,185,129,0.35),transparent_75deg)]" />
              </div>

              {/* Attack arcs */}
              {filteredArcs.map((arc) => (
                <LeafletPolyline
                  key={arc.id}
                  lngLatPath={arc.path}
                  color={VECTOR_STYLES[arc.vectorType].hex}
                  weight={2}
                  dashArray="6 4"
                  lineCap="round"
                  opacity={0.9}
                />
              ))}

              {/* Edge PoPs */}
              {edgeNodes.map((edge) => (
                <LeafletMarker key={edge.id} lngLat={edge.lngLat} anchor="center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="block size-2.5 rotate-45 border border-white/70 bg-emerald-500 shadow-xs" />
                    <span className="font-mono text-[10px] font-bold text-emerald-300">{edge.code}</span>
                  </div>
                </LeafletMarker>
              ))}

              {/* Origins */}
              {origins.map((origin) => (
                <LeafletMarker key={origin.id} lngLat={origin.lngLat} anchor="center">
                  <button
                    type="button"
                    className="pointer-events-auto relative flex flex-col items-center gap-1"
                    aria-label={origin.country}
                    onClick={() => selectOrigin(origin.id)}
                  >
                    <span className="font-mono text-[10px] font-bold text-white">{origin.countryCode}</span>
                    <span className="relative flex size-3 items-center justify-center">
                      <span
                        className={cn(
                          'absolute size-3 animate-ping rounded-full opacity-70',
                          VECTOR_STYLES[origin.vectorType].ping,
                        )}
                      />
                      <span
                        className={cn(
                          'relative size-3 rounded-full border-2 border-white/80',
                          VECTOR_STYLES[origin.vectorType].dot,
                        )}
                      />
                    </span>
                  </button>
                </LeafletMarker>
              ))}
            </LeafletMap>
          </div>
        </Card>

        <Card className="border-border flex min-h-0 flex-col overflow-hidden shadow-xs lg:col-span-4">
          <CardHeader className="border-border border-b p-4">
            <CardTitle className="text-sm font-semibold">Origins</CardTitle>
          </CardHeader>
          <CardContent className="divide-border min-h-0 flex-1 divide-y overflow-auto p-0">
            {origins.map((origin) => (
              <button
                key={origin.id}
                type="button"
                className={cn(
                  'hover:bg-accent/50 flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors',
                  selectedId === origin.id && 'bg-accent/60',
                )}
                onClick={() => selectOrigin(origin.id)}
              >
                <div className="min-w-0">
                  <p className="text-foreground truncate text-sm font-medium">
                    {origin.countryCode} · {origin.country}
                  </p>
                  <p className="text-muted-foreground font-mono text-xs tabular-nums">{origin.volume}</p>
                </div>
                <Badge variant={mitigationVariant(origin.mitigation)} className="shrink-0 text-xs uppercase">
                  {origin.mitigation.replace('_', ' ')}
                </Badge>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default LeafletThreatMapRadar
