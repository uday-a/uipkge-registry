<script setup lang="ts">
import { DottedMapChart } from '@/components/ui/charts'

const globalNodes = [
  {
    lat: 40.7128,
    lng: -74.006,
    label: 'US-East (N. Virginia)',
    description: 'Primary Datacenter',
    value: '99.99% uptime',
  },
  { lat: 37.7749, lng: -122.4194, label: 'US-West (Oregon)', description: 'Failover Hub', value: '4.2 Tbps' },
  { lat: 50.1109, lng: 8.6821, label: 'EU-Central (Frankfurt)', description: 'Central Exchange', value: '6.4 Tbps' },
  { lat: 51.5074, lng: -0.1278, label: 'EU-West (London)', description: 'EMEA Backbone', value: '5.1 Tbps' },
  { lat: 1.3521, lng: 103.8198, label: 'AP-Southeast (Singapore)', description: 'South Asia Core', value: '2.9 Tbps' },
  { lat: 35.6762, lng: 139.6503, label: 'AP-Northeast (Tokyo)', description: 'East Asia Gateway', value: '3.8 Tbps' },
  { lat: -33.8688, lng: 151.2093, label: 'AP-Southeast (Sydney)', description: 'Oceania POP', value: '1.7 Tbps' },
  { lat: -23.5505, lng: -46.6333, label: 'SA-East (São Paulo)', description: 'LATAM Core', value: '2.1 Tbps' },
]

const clusterStatus = [
  {
    lat: 40.7128,
    lng: -74.006,
    label: 'Primary DC: 99.99% operational',
    color: '#10b981',
    status: 'healthy',
    value: '18ms',
  },
  {
    lat: 50.1109,
    lng: 8.6821,
    label: 'EU Core: 99.95% operational',
    color: '#10b981',
    status: 'healthy',
    value: '12ms',
  },
  {
    lat: 1.3521,
    lng: 103.8198,
    label: 'APAC Gateway: Latency spike (amber)',
    color: '#f59e0b',
    status: 'degraded',
    value: '88ms',
  },
  {
    lat: 35.6762,
    lng: 139.6503,
    label: 'Tokyo Edge: Failover active',
    color: '#f59e0b',
    status: 'degraded',
    value: '42ms',
  },
  {
    lat: -23.5505,
    lng: -46.6333,
    label: 'São Paulo: Fiber cut investigation',
    color: '#ef4444',
    status: 'incident',
    value: 'Offline',
  },
]

// Showcase 1: Global Data & Flight Corridors
const corridorPins = [
  {
    lat: 37.7749,
    lng: -122.4194,
    label: 'San Francisco (SFO-Edge)',
    color: 'var(--chart-1)',
    description: 'Transit Core',
    value: '4.2 Tbps',
  },
  {
    lat: 35.6762,
    lng: 139.6503,
    label: 'Tokyo (NRT-Edge)',
    color: 'var(--chart-2)',
    description: 'APAC Gateway',
    value: '3.8 Tbps',
  },
  {
    lat: 51.5074,
    lng: -0.1278,
    label: 'London (LHR-Edge)',
    color: 'var(--chart-3)',
    description: 'EMEA Backbone',
    value: '5.1 Tbps',
  },
  {
    lat: 50.1109,
    lng: 8.6821,
    label: 'Frankfurt (FRA-Edge)',
    color: 'var(--chart-4)',
    description: 'Central Exchange',
    value: '6.4 Tbps',
  },
  {
    lat: 1.3521,
    lng: 103.8198,
    label: 'Singapore (SIN-Edge)',
    color: 'var(--chart-5)',
    description: 'South Asia Hub',
    value: '2.9 Tbps',
  },
  {
    lat: -33.8688,
    lng: 151.2093,
    label: 'Sydney (SYD-Edge)',
    color: 'var(--chart-1)',
    description: 'Oceania POP',
    value: '1.7 Tbps',
  },
  {
    lat: -23.5505,
    lng: -46.6333,
    label: 'São Paulo (GRU-Edge)',
    color: 'var(--chart-2)',
    description: 'LATAM Core',
    value: '2.1 Tbps',
  },
]

const corridorRoutes = [
  {
    from: { lat: 51.5074, lng: -0.1278 },
    to: { lat: 50.1109, lng: 8.6821 },
    color: 'var(--chart-1)',
    duration: 2.2,
    label: 'London ↔ Frankfurt Interconnect (12ms)',
  },
  {
    from: { lat: 51.5074, lng: -0.1278 },
    to: { lat: 37.7749, lng: -122.4194 },
    color: 'var(--chart-2)',
    duration: 3.5,
    curvature: 0.28,
    label: 'Transatlantic Express (78ms)',
  },
  {
    from: { lat: 50.1109, lng: 8.6821 },
    to: { lat: 1.3521, lng: 103.8198 },
    color: 'var(--chart-3)',
    duration: 3.8,
    curvature: 0.22,
    label: 'Eurasia Optical Trunk (86ms)',
  },
  {
    from: { lat: 1.3521, lng: 103.8198 },
    to: { lat: 35.6762, lng: 139.6503 },
    color: 'var(--chart-1)',
    duration: 2.6,
    curvature: 0.18,
    label: 'APAC Subsea Cable (48ms)',
  },
  {
    from: { lat: 1.3521, lng: 103.8198 },
    to: { lat: -33.8688, lng: 151.2093 },
    color: 'var(--chart-4)',
    duration: 3.0,
    curvature: 0.24,
    label: 'Southern Cross Route (62ms)',
  },
  {
    from: { lat: 37.7749, lng: -122.4194 },
    to: { lat: -23.5505, lng: -46.6333 },
    color: 'var(--chart-5)',
    duration: 3.4,
    curvature: 0.26,
    label: 'Pan-American Link (114ms)',
  },
  {
    from: { lat: 35.6762, lng: 139.6503 },
    to: { lat: 37.7749, lng: -122.4194 },
    color: 'var(--chart-2)',
    duration: 4.0,
    curvature: 0.3,
    label: 'Trans-Pacific Direct (92ms)',
  },
]

// Showcase 2: Cross-Country Logistics Flow
const logisticsPins = [
  {
    lat: 47.6062,
    lng: -122.3321,
    label: 'Seattle (SEA-1)',
    color: 'var(--chart-1)',
    description: 'Pacific Northwest Sortation',
    value: '42k pkgs/hr',
  },
  {
    lat: 37.7749,
    lng: -122.4194,
    label: 'Oakland (OAK-2)',
    color: 'var(--chart-1)',
    description: 'NorCal Air Cargo Gateway',
    value: '68k pkgs/hr',
  },
  {
    lat: 34.0522,
    lng: -118.2437,
    label: 'Los Angeles (LAX-4)',
    color: 'var(--chart-1)',
    description: 'SoCal Ground/Air Terminal',
    value: '95k pkgs/hr',
  },
  {
    lat: 41.8781,
    lng: -87.6298,
    label: 'Chicago (ORD-1)',
    color: 'var(--chart-2)',
    description: 'Midwest Air Superhub',
    value: '140k pkgs/hr',
  },
  {
    lat: 32.7767,
    lng: -96.797,
    label: 'Dallas (DFW-3)',
    color: 'var(--chart-3)',
    description: 'South Central Gateway',
    value: '88k pkgs/hr',
  },
  {
    lat: 33.749,
    lng: -84.388,
    label: 'Atlanta (ATL-2)',
    color: 'var(--chart-4)',
    description: 'Southeast Logistics Core',
    value: '76k pkgs/hr',
  },
  {
    lat: 40.7128,
    lng: -74.006,
    label: 'Newark (EWR-5)',
    color: 'var(--chart-5)',
    description: 'Northeast Metro Hub',
    value: '115k pkgs/hr',
  },
]

const logisticsRoutes = [
  {
    from: { lat: 47.6062, lng: -122.3321 },
    to: { lat: 41.8781, lng: -87.6298 },
    color: 'var(--chart-1)',
    dashed: true,
    duration: 2.8,
    label: 'Northern Corridor (SEA → ORD)',
  },
  {
    from: { lat: 37.7749, lng: -122.4194 },
    to: { lat: 41.8781, lng: -87.6298 },
    color: 'var(--chart-2)',
    duration: 3.2,
    label: 'Central Overland Route (OAK → ORD)',
  },
  {
    from: { lat: 34.0522, lng: -118.2437 },
    to: { lat: 32.7767, lng: -96.797 },
    color: 'var(--chart-3)',
    dashed: true,
    duration: 2.5,
    label: 'Southern Airway (LAX → DFW)',
  },
  {
    from: { lat: 32.7767, lng: -96.797 },
    to: { lat: 33.749, lng: -84.388 },
    color: 'var(--chart-4)',
    duration: 2.2,
    label: 'Gulf Logistics Link (DFW → ATL)',
  },
  {
    from: { lat: 41.8781, lng: -87.6298 },
    to: { lat: 40.7128, lng: -74.006 },
    color: 'var(--chart-5)',
    dashed: true,
    duration: 2.0,
    label: 'Express Freight Trunk (ORD → EWR)',
  },
  {
    from: { lat: 33.749, lng: -84.388 },
    to: { lat: 40.7128, lng: -74.006 },
    color: 'var(--chart-1)',
    duration: 2.4,
    label: 'Atlantic Seaboard Line (ATL → EWR)',
  },
]

// Showcase 3: Global Cyber Threat Vectors
const threatPins = [
  {
    lat: 39.0438,
    lng: -77.4874,
    label: 'IAD-01 Core Edge (Target)',
    color: '#10b981',
    status: 'mitigating',
    description: 'Anycast scrubbing center',
    value: 'WAF active',
  },
  {
    lat: 50.1109,
    lng: 8.6821,
    label: 'FRA-01 Cloud Gateway (Target)',
    color: '#10b981',
    status: 'optimal',
    description: 'EU Core Scrubber',
    value: 'Clean 99.9%',
  },
  {
    lat: 35.6762,
    lng: 139.6503,
    label: 'TYO-02 APAC Gateway (Target)',
    color: '#10b981',
    status: 'optimal',
    description: 'Tokyo Scrubbing Node',
    value: '0% loss',
  },
  {
    lat: 55.7558,
    lng: 37.6173,
    label: 'Vector ASN-4132 Volumetric UDP Flood',
    color: '#ef4444',
    status: 'blocked',
    description: 'Origin: Eastern Europe',
    value: '420 Gbps',
  },
  {
    lat: 39.9042,
    lng: 116.4074,
    label: 'Vector SYN Flood Cluster',
    color: '#ef4444',
    status: 'scrubbed',
    description: 'Origin: East Asia botnet',
    value: '180 Mpps',
  },
  {
    lat: -22.9068,
    lng: -43.1729,
    label: 'Vector Mirai Botnet Variant',
    color: '#f59e0b',
    status: 'rate-limited',
    description: 'Origin: South America',
    value: '65 Gbps',
  },
  {
    lat: 28.6139,
    lng: 77.209,
    label: 'Vector HTTP/2 Rapid Reset',
    color: '#f59e0b',
    status: 'blocked',
    description: 'Origin: South Asia',
    value: '2.4M rps',
  },
]

const threatRoutes = [
  {
    from: { lat: 55.7558, lng: 37.6173 },
    to: { lat: 50.1109, lng: 8.6821 },
    color: '#ef4444',
    duration: 1.6,
    label: 'UDP Reflection Vector → FRA',
  },
  {
    from: { lat: 39.9042, lng: 116.4074 },
    to: { lat: 39.0438, lng: -77.4874 },
    color: '#ef4444',
    dashed: true,
    duration: 2.2,
    curvature: 0.32,
    label: 'SYN Flood Corridor → IAD',
  },
  {
    from: { lat: -22.9068, lng: -43.1729 },
    to: { lat: 39.0438, lng: -77.4874 },
    color: '#f59e0b',
    duration: 2.4,
    label: 'IoT Mirai Ingress → IAD',
  },
  {
    from: { lat: 28.6139, lng: 77.209 },
    to: { lat: 35.6762, lng: 139.6503 },
    color: '#f59e0b',
    duration: 2.0,
    label: 'L7 Rapid Reset Ingress → TYO',
  },
  {
    from: { lat: 39.9042, lng: 116.4074 },
    to: { lat: 50.1109, lng: 8.6821 },
    color: '#ef4444',
    dashed: true,
    duration: 2.5,
    curvature: 0.25,
    label: 'Secondary Volumetric Vector → FRA',
  },
]
</script>

<template>
  <Story
    title="Global Data & Flight Corridors"
    description="Interconnected global edge hubs with quadratic Bezier curved flow arcs, comet pulse animations, and interactive telemetry tooltips."
  >
    <div class="space-y-4">
      <div class="flex flex-wrap items-center gap-2 text-xs">
        <div
          class="border-border bg-card text-muted-foreground flex items-center gap-1.5 rounded-md border px-2.5 py-1"
        >
          <span class="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          <span class="text-foreground font-medium">Active Corridors:</span> 7 Links
        </div>
        <div
          class="border-border bg-card text-muted-foreground flex items-center gap-1.5 rounded-md border px-2.5 py-1"
        >
          <span class="text-foreground font-medium">Global Bandwidth:</span> 26.2 Tbps
        </div>
        <div
          class="border-border bg-card text-muted-foreground flex items-center gap-1.5 rounded-md border px-2.5 py-1"
        >
          <span class="text-foreground font-medium">Global P95 RTT:</span> 34ms
        </div>
        <div
          class="border-border bg-card text-muted-foreground flex items-center gap-1.5 rounded-md border px-2.5 py-1"
        >
          <span class="text-foreground font-medium">Packet Loss:</span> 0.001%
        </div>
      </div>
      <DottedMapChart :pins="corridorPins" :routes="corridorRoutes" height="380" />
    </div>
  </Story>

  <Story
    title="Cross-Country Logistics Flow"
    description="Distribution center routing network across the United States with animated marching dashed arcs and facility sortation metrics."
  >
    <div class="space-y-4">
      <div class="flex flex-wrap items-center gap-2 text-xs">
        <div
          class="border-border bg-card text-muted-foreground flex items-center gap-1.5 rounded-md border px-2.5 py-1"
        >
          <span class="text-foreground font-medium">Sortation Hubs:</span> 7 Facilities
        </div>
        <div
          class="border-border bg-card text-muted-foreground flex items-center gap-1.5 rounded-md border px-2.5 py-1"
        >
          <span class="text-foreground font-medium">Volume:</span> 624,000 pkgs/hr
        </div>
        <div
          class="border-border bg-card text-muted-foreground flex items-center gap-1.5 rounded-md border px-2.5 py-1"
        >
          <span class="text-foreground font-medium">On-Time Rate:</span> 99.4%
        </div>
      </div>
      <DottedMapChart map="usa" :pins="logisticsPins" :routes="logisticsRoutes" height="380" />
    </div>
  </Story>

  <Story
    title="Global Cyber Threat Vectors"
    description="Real-time DDoS attack telemetry with live volumetric vectors targeting anycast scrubbing centers."
  >
    <div class="space-y-4">
      <div class="flex flex-wrap items-center gap-2 text-xs">
        <div
          class="border-border bg-card text-muted-foreground flex items-center gap-1.5 rounded-md border px-2.5 py-1"
        >
          <span class="inline-block h-2 w-2 rounded-full bg-emerald-500" />
          <span class="text-foreground font-medium">WAF Status:</span> Automated Defense Active
        </div>
        <div
          class="border-border bg-card text-muted-foreground flex items-center gap-1.5 rounded-md border px-2.5 py-1"
        >
          <span class="text-foreground font-medium">Peak Ingress:</span> 665 Gbps
        </div>
        <div
          class="border-border bg-card text-muted-foreground flex items-center gap-1.5 rounded-md border px-2.5 py-1"
        >
          <span class="text-foreground font-medium">Scrubbing Efficiency:</span> 99.85%
        </div>
      </div>
      <DottedMapChart :pins="threatPins" :routes="threatRoutes" height="380" />
    </div>
  </Story>

  <Story
    title="Global infrastructure"
    description="Lat/lng nodes pulse over the dot matrix. Hover any pin for details."
  >
    <DottedMapChart :pins="globalNodes" height="340" />
  </Story>

  <Story
    title="Multi-status telemetry"
    description="Individual pin colors indicate operational state: healthy (teal), degraded (amber), and incident (red)."
  >
    <DottedMapChart :pins="clusterStatus" height="340" />
  </Story>

  <Story title="Hexagonal honeycomb" description="Diagonal staggered layout with hexagonal cells.">
    <DottedMapChart :pins="globalNodes.slice(0, 4)" grid="diagonal" shape="hexagon" height="340" />
  </Story>

  <Story title="Themed matrix" description="Custom dot coloring via theme tokens or brand variables.">
    <DottedMapChart :pins="clusterStatus.slice(0, 3)" dot-color="var(--chart-2)" height="340" />
  </Story>

  <Story
    title="Regional sub-grid"
    description="High-density landmask with cartographic insets for domestic infrastructure."
  >
    <DottedMapChart
      map="usa"
      :pins="[
        { lat: 40.7128, lng: -74.006, label: 'New York (JFK)' },
        { lat: 41.8781, lng: -87.6298, label: 'Chicago (ORD)' },
        { lat: 29.7604, lng: -95.3698, label: 'Houston (IAH)' },
        { lat: 37.7749, lng: -122.4194, label: 'San Francisco (SFO)' },
        { lat: 47.6062, lng: -122.3321, label: 'Seattle (SEA)' },
      ]"
      height="340"
    />
  </Story>

  <Story
    title="Quiet backdrop"
    description="No pins, no pulse animation — an unobtrusive textured background for dashboard KPI cards."
  >
    <DottedMapChart :pulse="false" height="240" />
  </Story>
</template>
