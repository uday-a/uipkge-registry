<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, ref } from 'vue'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Map } from '@/components/ui/map'

export type AttackVectorType = 'volumetric' | 'l7' | 'botnet'
export type MitigationAction = 'DROP' | 'CHALLENGE' | 'RATE_LIMIT'

export interface ThreatOrigin {
  id: string
  country: string
  countryCode: string
  volume: string
  vectorType: AttackVectorType
  mitigation: MitigationAction
  coords: { x: number; y: number }
  targetEdgeId: string
}

export interface EdgePoP {
  id: string
  code: string
  city: string
  coords: { x: number; y: number }
}

export interface AttackArc {
  id: string
  originId: string
  edgeId: string
  sourceCoords: { x: number; y: number }
  targetCoords: { x: number; y: number }
  controlOffset: number
  vectorType: AttackVectorType
  gradientId: string
}

export interface ThreatMapRadarProps {
  class?: HTMLAttributes['class']
  origins?: ThreatOrigin[]
}

const props = defineProps<ThreatMapRadarProps>()

const defaultOrigins: ThreatOrigin[] = [
  {
    id: 'origin-1',
    country: 'China',
    countryCode: 'CN',
    volume: '642.5K/s',
    vectorType: 'l7',
    mitigation: 'DROP',
    coords: { x: 785, y: 185 },
    targetEdgeId: 'edge-nrt',
  },
  {
    id: 'origin-2',
    country: 'Russia',
    countryCode: 'RU',
    volume: '418.2K/s',
    vectorType: 'l7',
    mitigation: 'CHALLENGE',
    coords: { x: 595, y: 135 },
    targetEdgeId: 'edge-fra',
  },
  {
    id: 'origin-3',
    country: 'Brazil',
    countryCode: 'BR',
    volume: '285.4K/s',
    vectorType: 'botnet',
    mitigation: 'RATE_LIMIT',
    coords: { x: 310, y: 340 },
    targetEdgeId: 'edge-iad',
  },
  {
    id: 'origin-4',
    country: 'Vietnam',
    countryCode: 'VN',
    volume: '194.0K/s',
    vectorType: 'volumetric',
    mitigation: 'DROP',
    coords: { x: 725, y: 275 },
    targetEdgeId: 'edge-sin',
  },
]

const edgeNodes: EdgePoP[] = [
  { id: 'edge-iad', code: 'IAD', city: 'Ashburn', coords: { x: 270, y: 185 } },
  { id: 'edge-fra', code: 'FRA', city: 'Frankfurt', coords: { x: 515, y: 145 } },
  { id: 'edge-nrt', code: 'NRT', city: 'Tokyo', coords: { x: 840, y: 185 } },
  { id: 'edge-sin', code: 'SIN', city: 'Singapore', coords: { x: 755, y: 310 } },
  { id: 'edge-gru', code: 'GRU', city: 'São Paulo', coords: { x: 345, y: 385 } },
]

const attackArcs: AttackArc[] = [
  {
    id: 'arc-1',
    originId: 'origin-1',
    edgeId: 'edge-nrt',
    sourceCoords: { x: 785, y: 185 },
    targetCoords: { x: 840, y: 185 },
    controlOffset: -40,
    vectorType: 'l7',
    gradientId: 'attack-gradient-amber',
  },
  {
    id: 'arc-2',
    originId: 'origin-1',
    edgeId: 'edge-iad',
    sourceCoords: { x: 785, y: 185 },
    targetCoords: { x: 270, y: 185 },
    controlOffset: -160,
    vectorType: 'l7',
    gradientId: 'attack-gradient-amber',
  },
  {
    id: 'arc-3',
    originId: 'origin-2',
    edgeId: 'edge-fra',
    sourceCoords: { x: 595, y: 135 },
    targetCoords: { x: 515, y: 145 },
    controlOffset: -35,
    vectorType: 'l7',
    gradientId: 'attack-gradient-amber',
  },
  {
    id: 'arc-4',
    originId: 'origin-3',
    edgeId: 'edge-iad',
    sourceCoords: { x: 310, y: 340 },
    targetCoords: { x: 270, y: 185 },
    controlOffset: -45,
    vectorType: 'botnet',
    gradientId: 'attack-gradient-purple',
  },
  {
    id: 'arc-5',
    originId: 'origin-4',
    edgeId: 'edge-sin',
    sourceCoords: { x: 725, y: 275 },
    targetCoords: { x: 755, y: 310 },
    controlOffset: 30,
    vectorType: 'volumetric',
    gradientId: 'attack-gradient-rose',
  },
]

const origins = computed(() => props.origins ?? defaultOrigins)
const selectedId = ref<string | null>(null)

const filteredOrigins = computed(() => origins.value)
const filteredArcs = computed(() => {
  if (!selectedId.value) return attackArcs
  return attackArcs.filter((arc) => arc.originId === selectedId.value)
})

function selectOrigin(id: string) {
  selectedId.value = selectedId.value === id ? null : id
}

function computeCurvePath(arc: AttackArc) {
  const { sourceCoords, targetCoords, controlOffset } = arc
  const midX = (sourceCoords.x + targetCoords.x) / 2
  const midY = (sourceCoords.y + targetCoords.y) / 2 + controlOffset
  return `M ${sourceCoords.x} ${sourceCoords.y} Q ${midX} ${midY} ${targetCoords.x} ${targetCoords.y}`
}

function originColor(type: AttackVectorType) {
  if (type === 'volumetric') return '#f43f5e'
  if (type === 'l7') return '#f59e0b'
  return '#a855f7'
}

function mitigationVariant(action: MitigationAction) {
  if (action === 'DROP') return 'destructive'
  if (action === 'CHALLENGE') return 'warning'
  return 'info'
}
</script>

<template>
  <div data-slot="threat-map-radar" :class="cn('flex h-full min-h-0 flex-col gap-4', props.class)">
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
          <Map
            variant="dark"
            :center="[0, 18]"
            :zoom="1.05"
            :navigation="false"
            class="pointer-events-none absolute inset-0 size-full"
          />
          <svg
            class="pointer-events-none absolute inset-0 size-full"
            viewBox="0 0 1000 500"
            fill="none"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="attack-gradient-rose" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#f43f5e" stop-opacity="0.95" />
                <stop offset="100%" stop-color="#10b981" stop-opacity="0.35" />
              </linearGradient>
              <linearGradient id="attack-gradient-amber" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.95" />
                <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.35" />
              </linearGradient>
              <linearGradient id="attack-gradient-purple" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#a855f7" stop-opacity="0.95" />
                <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.35" />
              </linearGradient>
            </defs>

            <g v-for="arc in filteredArcs" :key="arc.id">
              <path
                :d="computeCurvePath(arc)"
                fill="none"
                :stroke="`url(#${arc.gradientId})`"
                stroke-width="2"
                stroke-dasharray="6 4"
                stroke-linecap="round"
              >
                <animate attributeName="stroke-dashoffset" from="100" to="0" dur="2.5s" repeatCount="indefinite" />
              </path>
              <circle r="3" fill="#ffffff">
                <animateMotion :path="computeCurvePath(arc)" dur="2.8s" repeatCount="indefinite" />
              </circle>
            </g>

            <g v-for="edge in edgeNodes" :key="edge.id" :transform="`translate(${edge.coords.x}, ${edge.coords.y})`">
              <polygon points="0,-5 5,0 0,5 -5,0" fill="#10b981" stroke="#ffffff" stroke-width="1.25" />
              <text
                y="16"
                text-anchor="middle"
                fill="rgba(255,255,255,0.85)"
                font-size="11"
                font-family="ui-monospace, monospace"
                font-weight="700"
              >
                {{ edge.code }}
              </text>
            </g>

            <g
              v-for="origin in filteredOrigins"
              :key="origin.id"
              :transform="`translate(${origin.coords.x}, ${origin.coords.y})`"
              class="pointer-events-auto cursor-pointer"
              role="button"
              tabindex="0"
              :aria-label="origin.country"
              @click="selectOrigin(origin.id)"
              @keydown.enter="selectOrigin(origin.id)"
            >
              <circle r="6" :fill="originColor(origin.vectorType)" stroke="#ffffff" stroke-width="1.5" />
              <text
                y="-10"
                text-anchor="middle"
                fill="#ffffff"
                font-size="11"
                font-family="ui-monospace, monospace"
                font-weight="700"
              >
                {{ origin.countryCode }}
              </text>
            </g>
          </svg>
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
