<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, ref } from 'vue'
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

export interface LeafletThreatMapRadarProps {
  class?: HTMLAttributes['class']
  origins?: ThreatOrigin[]
}

const props = defineProps<LeafletThreatMapRadarProps>()

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

const origins = computed(() => props.origins ?? defaultOrigins)
const selectedId = ref<string | null>(null)

const filteredArcs = computed(() => {
  if (!selectedId.value) return attackArcs
  return attackArcs.filter((arc) => arc.originId === selectedId.value)
})

function selectOrigin(id: string) {
  selectedId.value = selectedId.value === id ? null : id
}

function mitigationVariant(action: MitigationAction) {
  if (action === 'DROP') return 'destructive'
  if (action === 'CHALLENGE') return 'warning'
  return 'info'
}
</script>

<template>
  <div data-slot="leaflet-threat-map-radar" :class="cn('flex h-full min-h-0 flex-col gap-4', props.class)">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex flex-wrap items-center gap-2">
        <h2 class="text-foreground text-lg font-semibold tracking-tight">Threat Radar</h2>
        <Badge
          variant="outline"
          class="border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-700 dark:text-emerald-400"
        >
          Live
        </Badge>
      </div>
      <p class="text-muted-foreground text-xs">{{ origins.length }} origins · {{ edgeNodes.length }} edge PoPs</p>
    </div>

    <div class="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-12">
      <Card class="border-border flex min-h-0 flex-col overflow-hidden shadow-xs lg:col-span-8">
        <div class="relative min-h-[360px] flex-1 overflow-hidden bg-zinc-950">
          <LeafletMap
            variant="dark"
            :center="[10, 30]"
            :zoom="2"
            :min-zoom="2"
            :navigation="false"
            :scroll-wheel-zoom="false"
            class="pointer-events-none absolute inset-0 size-full"
          >
            <!-- Radar sweep: a rotating conic-gradient wedge layered over the
                 tiles, plus two static range rings. -->
            <div class="pointer-events-none absolute inset-0 z-[500] flex items-center justify-center">
              <div class="absolute size-[340px] rounded-full border border-emerald-500/15" />
              <div class="absolute size-[220px] rounded-full border border-emerald-500/15" />
              <div
                class="size-[340px] animate-[spin_9s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,rgba(16,185,129,0.35),transparent_75deg)]"
              />
            </div>

            <!-- Attack arcs -->
            <LeafletPolyline
              v-for="arc in filteredArcs"
              :key="arc.id"
              :lng-lat-path="arc.path"
              :color="VECTOR_STYLES[arc.vectorType].hex"
              :weight="2"
              dash-array="6 4"
              line-cap="round"
              :opacity="0.9"
            />

            <!-- Edge PoPs -->
            <LeafletMarker v-for="edge in edgeNodes" :key="edge.id" :lng-lat="edge.lngLat" anchor="center">
              <div class="flex flex-col items-center gap-1">
                <span class="block size-2.5 rotate-45 border border-white/70 bg-emerald-500 shadow-xs" />
                <span class="font-mono text-[10px] font-bold text-emerald-300">{{ edge.code }}</span>
              </div>
            </LeafletMarker>

            <!-- Origins -->
            <LeafletMarker v-for="origin in origins" :key="origin.id" :lng-lat="origin.lngLat" anchor="center">
              <button
                type="button"
                class="pointer-events-auto relative flex flex-col items-center gap-1"
                :aria-label="origin.country"
                @click="selectOrigin(origin.id)"
              >
                <span class="font-mono text-[10px] font-bold text-white">{{ origin.countryCode }}</span>
                <span class="relative flex size-3 items-center justify-center">
                  <span
                    :class="
                      cn('absolute size-3 animate-ping rounded-full opacity-70', VECTOR_STYLES[origin.vectorType].ping)
                    "
                  />
                  <span
                    :class="
                      cn('relative size-3 rounded-full border-2 border-white/80', VECTOR_STYLES[origin.vectorType].dot)
                    "
                  />
                </span>
              </button>
            </LeafletMarker>
          </LeafletMap>
        </div>
      </Card>

      <Card class="border-border flex min-h-0 flex-col overflow-hidden shadow-xs lg:col-span-4">
        <CardHeader class="border-border border-b p-4">
          <CardTitle class="text-sm font-semibold">Origins</CardTitle>
        </CardHeader>
        <CardContent class="divide-border min-h-0 flex-1 divide-y overflow-auto p-0">
          <button
            v-for="origin in origins"
            :key="origin.id"
            type="button"
            :class="
              cn(
                'hover:bg-accent/50 flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors',
                selectedId === origin.id && 'bg-accent/60',
              )
            "
            @click="selectOrigin(origin.id)"
          >
            <div class="min-w-0">
              <p class="text-foreground truncate text-sm font-medium">
                {{ origin.countryCode }} · {{ origin.country }}
              </p>
              <p class="text-muted-foreground font-mono text-xs tabular-nums">{{ origin.volume }}</p>
            </div>
            <Badge :variant="mitigationVariant(origin.mitigation)" class="shrink-0 text-xs uppercase">
              {{ origin.mitigation.replace('_', ' ') }}
            </Badge>
          </button>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
