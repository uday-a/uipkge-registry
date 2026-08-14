<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { ref, computed } from 'vue'
import { BatteryCharging, Navigation, Phone, Radio, Truck } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { LeafletMap, LeafletMarker, LeafletPolyline, type LeafletMapRef } from '@/components/ui/leaflet-map'

export interface DeliveryStop {
  id: string
  stopNumber: number
  trackingCode: string
  recipient: string
  address: string
  parcels: number
  timeWindow: string
  eta: string
  status: 'delivered' | 'en_route' | 'scheduled' | 'failed'
  podType?: 'signature' | 'photo_scanned' | 'front_door'
  podTimestamp?: string
  coords?: [number, number]
}

export interface LeafletLastMileCourierDispatchProps {
  routeId?: string
  driverName?: string
  vehicleCode?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<LeafletLastMileCourierDispatchProps>(), {
  routeId: 'RTE-METRO-409',
  driverName: 'Elena Rostova',
  vehicleCode: 'VAN-EV-09 (Ford E-Transit)',
})

const stops = ref<DeliveryStop[]>([
  {
    id: 'stp-1',
    stopNumber: 1,
    trackingCode: 'TRK-9941-8812',
    recipient: 'Apex Logistics HQ',
    address: '742 Evergreen Terrace, Sector 4',
    parcels: 3,
    timeWindow: '08:30 - 09:30',
    eta: '08:52 AM',
    status: 'delivered',
    podType: 'signature',
    podTimestamp: '08:54 AM (Signed by J. Doe)',
    coords: [-73.991, 40.743],
  },
  {
    id: 'stp-2',
    stopNumber: 2,
    trackingCode: 'TRK-9941-8813',
    recipient: 'David K. Miller',
    address: '1204 Pinehurst Ave, Apt 3B',
    parcels: 1,
    timeWindow: '09:30 - 10:30',
    eta: '09:45 AM',
    status: 'delivered',
    podType: 'photo_scanned',
    podTimestamp: '09:48 AM (Doorstep Verified)',
    coords: [-73.987, 40.747],
  },
  {
    id: 'stp-3',
    stopNumber: 3,
    trackingCode: 'TRK-9941-8814',
    recipient: 'Global Tech Labs',
    address: '450 Innovation Parkway, Suite 100',
    parcels: 4,
    timeWindow: '10:00 - 11:30',
    eta: '10:25 AM',
    status: 'en_route',
    coords: [-73.982, 40.751],
  },
  {
    id: 'stp-4',
    stopNumber: 4,
    trackingCode: 'TRK-9941-8815',
    recipient: 'Sarah Jenkins',
    address: '88 Riverfront Blvd',
    parcels: 2,
    timeWindow: '11:30 - 12:30',
    eta: '11:45 AM',
    status: 'scheduled',
    coords: [-73.978, 40.755],
  },
  {
    id: 'stp-5',
    stopNumber: 5,
    trackingCode: 'TRK-9941-8816',
    recipient: 'Metro Health Clinic',
    address: '310 Health Sciences Way',
    parcels: 1,
    timeWindow: '12:30 - 14:00',
    eta: '01:10 PM',
    status: 'scheduled',
    coords: [-73.971, 40.758],
  },
])

const completedCount = computed(() => stops.value.filter((s) => s.status === 'delivered').length)
const totalStops = computed(() => stops.value.length)
const onTimeRate = computed(() => '98.4%')

const routePath = computed<[number, number][]>(
  () => stops.value.map((s) => s.coords).filter(Boolean) as [number, number][],
)

const mapRef = ref<LeafletMapRef | null>(null)

function focusStop(stop: DeliveryStop) {
  if (!stop.coords) return
  mapRef.value?.flyTo?.({ center: stop.coords, zoom: 15, duration: 800 })
}

function fitRoute() {
  const coords = routePath.value
  if (coords.length < 2) return
  const lngs = coords.map((c) => c[0])
  const lats = coords.map((c) => c[1])
  mapRef.value?.fitBounds?.(
    [
      [Math.min(...lngs), Math.min(...lats)],
      [Math.max(...lngs), Math.max(...lats)],
    ],
    { padding: [48, 48] },
  )
}

function markDelivered(id: string) {
  const stop = stops.value.find((s) => s.id === id)
  if (stop) {
    stop.status = 'delivered'
    stop.podType = 'signature'
    stop.podTimestamp = 'Just now (Signed)'

    // Move next scheduled to en_route
    const next = stops.value.find((s) => s.status === 'scheduled')
    if (next) next.status = 'en_route'
  }
}
</script>

<template>
  <div data-slot="leaflet-last-mile-courier-dispatch" :class="cn('w-full space-y-6', props.class)">
    <!-- Header / Dispatch Telemetry Overview -->
    <Card>
      <CardHeader class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="text-foreground font-mono text-sm font-semibold">{{ routeId }}</span>
            <Badge variant="outline" class="font-mono text-xs">
              {{ vehicleCode }}
            </Badge>
            <Badge variant="secondary" class="gap-1 text-xs">
              <Radio class="text-foreground size-3" />
              Live Telemetry Active
            </Badge>
          </div>
          <CardTitle class="text-xl">Last-Mile Courier Dispatch & POD Telemetry</CardTitle>
          <CardDescription>
            Courier: <span class="text-foreground font-medium">{{ driverName }}</span> · Urban Route Dispatch Matrix
          </CardDescription>
        </div>

        <div class="flex items-center gap-2">
          <Button variant="outline" size="sm" class="gap-1.5">
            <Phone class="size-3.5" />
            Contact Driver
          </Button>
          <Button variant="default" size="sm" class="gap-1.5" @click="fitRoute">
            <Navigation class="size-3.5" />
            Live GPS Map
          </Button>
        </div>
      </CardHeader>

      <CardContent class="border-border grid grid-cols-1 gap-4 border-t pt-4 sm:grid-cols-4">
        <!-- Progress Metric -->
        <div class="border-border space-y-1 rounded-lg border p-3">
          <div class="text-muted-foreground text-xs font-medium">ROUTE COMPLETION</div>
          <div class="flex items-baseline justify-between pt-1">
            <div class="font-mono text-xl font-semibold">{{ completedCount }} / {{ totalStops }}</div>
            <span class="text-muted-foreground font-mono text-xs">
              {{ Math.round((completedCount / totalStops) * 100) }}%
            </span>
          </div>
        </div>

        <!-- On-time SLA -->
        <div class="border-border space-y-1 rounded-lg border p-3">
          <div class="text-muted-foreground text-xs font-medium">ON-TIME WINDOW SLA</div>
          <div class="pt-1 font-mono text-xl font-semibold">{{ onTimeRate }}</div>
        </div>

        <!-- Vehicle Telemetry -->
        <div class="border-border space-y-1 rounded-lg border p-3">
          <div class="text-muted-foreground flex items-center gap-1 text-xs font-medium">
            <BatteryCharging class="size-3.5" />
            <span>EV BATTERY / RANGE</span>
          </div>
          <div class="pt-1 font-mono text-xl font-semibold">74% · 142 km</div>
        </div>

        <!-- Next Stop ETA -->
        <div class="border-border space-y-1 rounded-lg border p-3">
          <div class="text-muted-foreground text-xs font-medium">CURRENT TARGET ETA</div>
          <div class="pt-1 font-mono text-xl font-semibold">10:25 AM (Stop #3)</div>
        </div>
      </CardContent>
    </Card>

    <!-- Live GPS Route Map -->
    <Card class="overflow-hidden">
      <CardHeader class="border-border/70 border-b pb-3">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle class="flex items-center gap-2 text-base font-semibold">
              <Navigation class="size-4 text-sky-400" />
              <span>Live GPS Telemetry & Corridor Map</span>
            </CardTitle>
            <CardDescription>
              Real-time courier positioning with sequenced drop waypoints and completion status.
            </CardDescription>
          </div>
          <div class="flex items-center gap-2">
            <span class="inline-flex size-2 animate-ping rounded-full bg-emerald-500" />
            <span class="text-muted-foreground font-mono text-xs">GPS Synced · 3s ago</span>
          </div>
        </div>
      </CardHeader>
      <div class="relative h-72 w-full sm:h-80">
        <LeafletMap ref="mapRef" variant="dark" :center="[-73.982, 40.75]" :zoom="13.8" class="size-full">
          <!-- Route Polyline -->
          <LeafletPolyline :lng-lat-path="routePath" color="#0284c7" :weight="3" :dash-array="[2, 2]" />

          <!-- Delivery Stop Markers -->
          <LeafletMarker v-for="stop in stops" :key="stop.id" :lng-lat="stop.coords!" anchor="center">
            <div class="flex cursor-pointer flex-col items-center" @click="focusStop(stop)">
              <div
                class="border-background flex size-6 items-center justify-center rounded-full border-2 font-mono text-[10px] font-bold shadow-md"
                :class="
                  stop.status === 'delivered'
                    ? 'bg-emerald-500 text-white'
                    : stop.status === 'en_route'
                      ? 'bg-amber-500 text-white ring-2 ring-amber-400/50'
                      : 'bg-muted text-muted-foreground'
                "
              >
                {{ stop.stopNumber }}
              </div>
              <span
                class="border-border/80 bg-background/90 py-0.2 mt-0.5 rounded border px-1 font-mono text-[9px] font-medium shadow-xs backdrop-blur-xs"
              >
                {{ stop.recipient.split(' ')[0] }}
              </span>
            </div>
          </LeafletMarker>

          <!-- Live Courier Van Marker -->
          <LeafletMarker :lng-lat="[-73.984, 40.749]" anchor="center" :z-index-offset="1000">
            <div class="relative flex size-9 items-center justify-center">
              <span class="absolute inline-flex size-full animate-ping rounded-full bg-sky-400 opacity-60" />
              <div
                class="relative flex size-8 items-center justify-center rounded-full border-2 border-white bg-sky-600 text-white shadow-lg"
              >
                <Truck class="size-4" />
              </div>
            </div>
          </LeafletMarker>
        </LeafletMap>
      </div>
    </Card>

    <!-- Dispatch Sequence Table -->
    <Card>
      <CardHeader class="pb-3">
        <CardTitle class="text-base font-semibold">Delivery Manifest & Proof of Delivery (POD)</CardTitle>
        <CardDescription>
          Ordered drop sequence with recipient signature capture and delivery window timestamps.
        </CardDescription>
      </CardHeader>

      <CardContent class="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="w-[60px]">Stop</TableHead>
              <TableHead class="w-[180px]">Tracking ID</TableHead>
              <TableHead class="w-[260px]">Recipient & Address</TableHead>
              <TableHead>Window / ETA</TableHead>
              <TableHead class="text-right">Parcels</TableHead>
              <TableHead>Status & Proof of Delivery</TableHead>
              <TableHead class="w-[100px] text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="stop in stops"
              :key="stop.id"
              :class="stop.status === 'en_route' ? 'bg-muted/40 font-medium' : ''"
            >
              <!-- Stop Number -->
              <TableCell class="text-muted-foreground font-mono text-xs"> #0{{ stop.stopNumber }} </TableCell>

              <!-- Tracking Code -->
              <TableCell>
                <div class="text-foreground font-mono text-xs font-semibold">{{ stop.trackingCode }}</div>
              </TableCell>

              <!-- Recipient & Address -->
              <TableCell>
                <div class="text-foreground font-medium">{{ stop.recipient }}</div>
                <div class="text-muted-foreground truncate text-xs">{{ stop.address }}</div>
              </TableCell>

              <!-- Time Window & ETA -->
              <TableCell>
                <div class="text-foreground text-xs">{{ stop.timeWindow }}</div>
                <div class="text-muted-foreground font-mono text-xs">ETA: {{ stop.eta }}</div>
              </TableCell>

              <!-- Parcels Count -->
              <TableCell class="text-right font-mono text-sm"> {{ stop.parcels }} pkg </TableCell>

              <!-- Status & Proof of Delivery -->
              <TableCell>
                <div class="flex flex-col gap-1">
                  <div class="flex items-center gap-2">
                    <Badge
                      :variant="
                        stop.status === 'delivered' ? 'default' : stop.status === 'en_route' ? 'secondary' : 'outline'
                      "
                      class="capitalize"
                    >
                      {{ stop.status.replace('_', ' ') }}
                    </Badge>
                  </div>
                  <span v-if="stop.podTimestamp" class="text-muted-foreground font-mono text-xs">
                    {{ stop.podTimestamp }}
                  </span>
                </div>
              </TableCell>

              <!-- Action -->
              <TableCell class="text-right">
                <Button
                  v-if="stop.status === 'en_route'"
                  size="sm"
                  variant="default"
                  class="h-7 text-xs"
                  @click="markDelivered(stop.id)"
                >
                  Confirm POD
                </Button>
                <span v-else-if="stop.status === 'delivered'" class="text-muted-foreground text-xs"> Logged </span>
                <span v-else class="text-muted-foreground text-xs"> Queued </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>

      <CardFooter class="border-border text-muted-foreground flex items-center justify-between border-t py-3 text-xs">
        <div>Geotagged proof of delivery records are synced automatically to customer tracking portals.</div>
        <div class="text-foreground font-medium">
          Route summary: <span class="font-mono">{{ totalStops }}</span> total consignments
        </div>
      </CardFooter>
    </Card>
  </div>
</template>
