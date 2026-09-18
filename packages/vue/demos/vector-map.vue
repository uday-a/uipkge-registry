<script setup lang="ts">
import { ref } from 'vue'
import { VectorMap, type RegionDataRecord, type MapPin, type FlowRoute } from '@/components/ui/charts/vector-map'

const selectedContinent = ref('northAmerica')

const continentStats: Record<string, RegionDataRecord> = {
  northAmerica: {
    value: 48200,
    status: 'optimal',
    color: 'oklch(0.62 0.16 162)',
    description: '38 Edge Data Centers · 12ms avg latency · 99.99% SLA.',
  },
  europe: {
    value: 39400,
    status: 'optimal',
    color: 'oklch(0.58 0.15 162)',
    description: '29 Edge Data Centers · 14ms avg latency · GDPR Compliant.',
  },
  asia: {
    value: 52100,
    status: 'optimal',
    color: 'oklch(0.66 0.17 162)',
    description: '44 Edge Data Centers · 22ms avg latency · High throughput.',
  },
  southAmerica: {
    value: 14800,
    status: 'growing',
    color: 'oklch(0.72 0.12 162)',
    description: '12 Edge Data Centers · São Paulo and Santiago expansions.',
  },
  africa: {
    value: 9600,
    status: 'developing',
    color: 'oklch(0.76 0.10 162)',
    description: '8 Edge Hubs · Johannesburg, Nairobi, Lagos, and Cairo.',
  },
  australiaOceania: {
    value: 11200,
    status: 'optimal',
    color: 'oklch(0.64 0.14 162)',
    description: '9 Edge Hubs · Sydney, Melbourne, Auckland.',
  },
  unitedKingdom: {
    value: 28900,
    status: 'optimal',
    color: 'oklch(0.55 0.17 162)',
    description: 'London Core Tier-1 Financial Interconnect.',
  },
  japan: {
    value: 31500,
    status: 'optimal',
    color: 'oklch(0.56 0.17 162)',
    description: 'Tokyo & Osaka East Asia Transpacific Hubs.',
  },
}

const globalTransitPins: MapPin[] = [
  {
    lat: 37.7749,
    lng: -122.4194,
    label: 'San Francisco (SFO-Edge)',
    value: '420 Gbps',
    status: 'optimal',
    color: '#10b981',
    description: 'West Coast Core Ingress',
  },
  {
    lat: 40.7128,
    lng: -74.006,
    label: 'New York (JFK-Edge)',
    value: '680 Gbps',
    status: 'optimal',
    color: '#10b981',
    description: 'Transatlantic Low-Latency Terminal',
  },
  {
    lat: 51.5074,
    lng: -0.1278,
    label: 'London (LHR-Edge)',
    value: '740 Gbps',
    status: 'optimal',
    color: '#10b981',
    description: 'EMEA Primary Routing Exchange',
  },
  {
    lat: 50.1109,
    lng: 8.6821,
    label: 'Frankfurt (FRA-Edge)',
    value: '890 Gbps',
    status: 'optimal',
    color: '#10b981',
    description: 'DE-CIX Continental Interconnect',
  },
  {
    lat: 1.3521,
    lng: 103.8198,
    label: 'Singapore (SIN-Edge)',
    value: '510 Gbps',
    status: 'optimal',
    color: '#10b981',
    description: 'Southeast Asia Transit Core',
  },
  {
    lat: 35.6762,
    lng: 139.6503,
    label: 'Tokyo (HND-Edge)',
    value: '620 Gbps',
    status: 'optimal',
    color: '#10b981',
    description: 'North Pacific Subsea Terminal',
  },
  {
    lat: -33.8688,
    lng: 151.2093,
    label: 'Sydney (SYD-Edge)',
    value: '290 Gbps',
    status: 'optimal',
    color: '#10b981',
    description: 'Southern Cross Oceanic POP',
  },
  {
    lat: -23.5505,
    lng: -46.6333,
    label: 'São Paulo (GRU-Edge)',
    value: '210 Gbps',
    status: 'optimal',
    color: '#10b981',
    description: 'LATAM Backhaul Core',
  },
]

const globalTransitRoutes: FlowRoute[] = [
  {
    from: { lat: 37.7749, lng: -122.4194 },
    to: { lat: 40.7128, lng: -74.006 },
    color: '#10b981',
    duration: 3.2,
    label: 'US Transcontinental Optical (SFO ↔ JFK)',
  },
  {
    from: { lat: 40.7128, lng: -74.006 },
    to: { lat: 51.5074, lng: -0.1278 },
    color: '#10b981',
    duration: 3.8,
    curvature: 0.28,
    label: 'Transatlantic Subsea Express (JFK ↔ LHR)',
  },
  {
    from: { lat: 51.5074, lng: -0.1278 },
    to: { lat: 50.1109, lng: 8.6821 },
    color: '#10b981',
    duration: 2.0,
    label: 'Channel Low-Latency Trunk (LHR ↔ FRA)',
  },
  {
    from: { lat: 50.1109, lng: 8.6821 },
    to: { lat: 1.3521, lng: 103.8198 },
    color: '#34d399',
    duration: 4.2,
    curvature: 0.24,
    label: 'Eurasian Core Corridor (FRA ↔ SIN)',
  },
  {
    from: { lat: 1.3521, lng: 103.8198 },
    to: { lat: 35.6762, lng: 139.6503 },
    color: '#10b981',
    duration: 3.0,
    label: 'Asia-Pacific Coastal Route (SIN ↔ TYO)',
  },
  {
    from: { lat: 35.6762, lng: 139.6503 },
    to: { lat: 37.7749, lng: -122.4194 },
    color: '#34d399',
    duration: 4.6,
    curvature: 0.32,
    label: 'Transpacific Fast Cable (TYO ↔ SFO)',
  },
  {
    from: { lat: 40.7128, lng: -74.006 },
    to: { lat: -23.5505, lng: -46.6333 },
    color: '#34d399',
    duration: 4.0,
    curvature: 0.22,
    label: 'Atlantic Americas Link (JFK ↔ GRU)',
  },
  {
    from: { lat: 1.3521, lng: 103.8198 },
    to: { lat: -33.8688, lng: 151.2093 },
    color: '#10b981',
    duration: 3.4,
    curvature: 0.2,
    label: 'Australasia Interconnect (SIN ↔ SYD)',
  },
]

const selectedCountry = ref('USA')
const countryDistributionData: Record<string, RegionDataRecord> = {
  USA: { value: 68400, status: 'optimal', description: 'Primary enterprise and cloud cluster.' },
  GBR: { value: 41200, status: 'optimal', description: 'London financial routing terminal.' },
  DEU: { value: 43500, status: 'optimal', description: 'DE-CIX Frankfurt internet exchange.' },
  FRA: { value: 32100, status: 'optimal', description: 'Paris edge compute gateway.' },
  JPN: { value: 52300, status: 'optimal', description: 'Tokyo transpacific high-speed link.' },
  AUS: { value: 24800, status: 'optimal', description: 'Sydney & Melbourne Oceania hubs.' },
  SGP: { value: 38900, status: 'optimal', description: 'Southeast Asia primary peering point.' },
  CAN: { value: 29400, status: 'optimal', description: 'Toronto & Montreal cloud regions.' },
  IND: { value: 48900, status: 'growing', description: 'Mumbai and Bangalore hyperscale nodes.' },
  BRA: { value: 21300, status: 'growing', description: 'São Paulo South American core.' },
}
</script>

<template>
  <Story
    title="Global Traffic by Continent"
    description="Interactive SVG world map with high-precision Natural Earth continental paths, custom data fills, and hover telemetry cards."
  >
    <div class="space-y-4">
      <div class="flex flex-wrap items-center gap-2 text-xs">
        <div
          class="border-border bg-card text-muted-foreground flex items-center gap-1.5 rounded-md border px-2.5 py-1"
        >
          <span class="inline-block h-2 w-2 rounded-full bg-emerald-500" />
          <span class="text-foreground font-medium">Selected:</span>
          <span>{{ selectedContinent }}</span>
        </div>
        <div
          class="border-border bg-card text-muted-foreground flex items-center gap-1.5 rounded-md border px-2.5 py-1"
        >
          <span class="text-foreground font-medium">Total Edge Capacity:</span> 235,000 req/s
        </div>
      </div>

      <div class="border-border bg-card rounded-xl border p-4">
        <VectorMap v-model:selected-region="selectedContinent" :region-data="continentStats" />
      </div>
    </div>
  </Story>

  <Story
    title="Country-Level Regional Coverage"
    description="Vector world map rendering individual sovereign nations with ISO alpha-3 badges, custom regional datasets, and click selection."
  >
    <div class="space-y-4">
      <div class="flex flex-wrap items-center gap-2 text-xs">
        <div
          class="border-border bg-card text-muted-foreground flex items-center gap-1.5 rounded-md border px-2.5 py-1"
        >
          <span class="bg-primary inline-block h-2 w-2 rounded-full" />
          <span class="text-foreground font-medium">Focused Economy:</span>
          <span>{{ selectedCountry }}</span>
        </div>
        <div
          class="border-border bg-card text-muted-foreground flex items-center gap-1.5 rounded-md border px-2.5 py-1"
        >
          <span class="text-foreground font-medium">Compliance:</span> SOC2 Type II, ISO 27001, FedRAMP
        </div>
      </div>

      <div class="border-border bg-card rounded-xl border p-4">
        <VectorMap v-model:selected-region="selectedCountry" mode="countries" :region-data="countryDistributionData" />
      </div>
    </div>
  </Story>

  <Story
    title="Transcontinental Fiber Corridors"
    description="Live global backbone topology with pulsing edge nodes, curved Bezier arcs, and animated traveling packet streams."
  >
    <div class="space-y-4">
      <div class="flex flex-wrap items-center gap-2 text-xs">
        <div
          class="border-border bg-card text-muted-foreground flex items-center gap-1.5 rounded-md border px-2.5 py-1"
        >
          <span class="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          <span class="text-foreground font-medium">Active Backbones:</span> 8 Trunk Lines
        </div>
        <div
          class="border-border bg-card text-muted-foreground flex items-center gap-1.5 rounded-md border px-2.5 py-1"
        >
          <span class="text-foreground font-medium">Total Transit Throughput:</span> 4.36 Tbps
        </div>
        <div
          class="border-border bg-card text-muted-foreground flex items-center gap-1.5 rounded-md border px-2.5 py-1"
        >
          <span class="text-foreground font-medium">Global P95 RTT:</span> 38.4ms
        </div>
      </div>

      <div class="border-border bg-card rounded-xl border p-4">
        <VectorMap :pins="globalTransitPins" :routes="globalTransitRoutes" />
      </div>
    </div>
  </Story>
</template>
