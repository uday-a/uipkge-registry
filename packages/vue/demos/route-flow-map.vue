<script setup lang="ts">
import { ref } from "vue";
import {
  RouteFlowMap,
  type RouteHub,
  type FlightRoute,
} from "@/components/ui/charts/route-flow-map";

const selectedFlight = ref("BA-178");
const selectedCargo = ref("");

const aviationHubs: RouteHub[] = [
  {
    id: "JFK",
    name: "John F. Kennedy Intl",
    city: "New York",
    lat: 40.6413,
    lng: -73.7781,
    status: "optimal",
    latency: "22m turn",
    color: "#10b981",
  },
  {
    id: "LHR",
    name: "London Heathrow",
    city: "London",
    lat: 51.47,
    lng: -0.4543,
    status: "optimal",
    latency: "35m turn",
    color: "#10b981",
  },
  {
    id: "FRA",
    name: "Frankfurt Main",
    city: "Frankfurt",
    lat: 50.0379,
    lng: 8.5622,
    status: "optimal",
    latency: "28m turn",
    color: "#10b981",
  },
  {
    id: "HND",
    name: "Tokyo Haneda",
    city: "Tokyo",
    lat: 35.5494,
    lng: 139.7798,
    status: "optimal",
    latency: "18m turn",
    color: "#10b981",
  },
  {
    id: "SIN",
    name: "Singapore Changi",
    city: "Singapore",
    lat: 1.3644,
    lng: 103.9915,
    status: "optimal",
    latency: "20m turn",
    color: "#10b981",
  },
  {
    id: "DXB",
    name: "Dubai International",
    city: "Dubai",
    lat: 25.2532,
    lng: 55.3657,
    status: "optimal",
    latency: "25m turn",
    color: "#10b981",
  },
  {
    id: "SFO",
    name: "San Francisco Intl",
    city: "San Francisco",
    lat: 37.6213,
    lng: -122.379,
    status: "optimal",
    latency: "30m turn",
    color: "#10b981",
  },
  {
    id: "SYD",
    name: "Sydney Kingsford Smith",
    city: "Sydney",
    lat: -33.9399,
    lng: 151.1753,
    status: "optimal",
    latency: "40m turn",
    color: "#10b981",
  },
];

const scheduledFlights: FlightRoute[] = [
  {
    id: "BA-178",
    from: "JFK",
    to: "LHR",
    callsign: "SPEEDBIRD 178",
    aircraft: "Boeing 777-300ER",
    speed: "562 kts · 1,040 km/h",
    altitude: "FL380 · 38,000 ft",
    progress: 68,
    eta: "2h 10m",
    status: "en-route",
    color: "#10b981",
    duration: 4.2,
    curvature: 0.28,
  },
  {
    id: "LH-400",
    from: "FRA",
    to: "JFK",
    callsign: "LUFTHANSA 400",
    aircraft: "Airbus A340-600",
    speed: "495 kts · 915 km/h",
    altitude: "FL360 · 36,000 ft",
    progress: 42,
    eta: "4h 30m",
    status: "en-route",
    color: "#34d399",
    duration: 5.0,
    curvature: 0.26,
  },
  {
    id: "JL-006",
    from: "HND",
    to: "JFK",
    callsign: "JAPANAIR 006",
    aircraft: "Airbus A350-1000",
    speed: "585 kts · 1,080 km/h",
    altitude: "FL410 · 41,000 ft",
    progress: 81,
    eta: "1h 50m",
    status: "approaching",
    color: "#10b981",
    duration: 6.0,
    curvature: 0.35,
  },
  {
    id: "SQ-322",
    from: "SIN",
    to: "LHR",
    callsign: "SINGAPORE 322",
    aircraft: "Airbus A380-800",
    speed: "540 kts · 1,000 km/h",
    altitude: "FL390 · 39,000 ft",
    progress: 55,
    eta: "6h 15m",
    status: "en-route",
    color: "#34d399",
    duration: 5.5,
    curvature: 0.24,
  },
  {
    id: "EK-201",
    from: "DXB",
    to: "JFK",
    callsign: "EMIRATES 201",
    aircraft: "Airbus A380-800",
    speed: "525 kts · 972 km/h",
    altitude: "FL380 · 38,000 ft",
    progress: 35,
    eta: "8h 40m",
    status: "en-route",
    color: "#10b981",
    duration: 5.8,
    curvature: 0.3,
  },
  {
    id: "UA-869",
    from: "SFO",
    to: "HND",
    callsign: "UNITED 869",
    aircraft: "Boeing 787-9 Dreamliner",
    speed: "510 kts · 945 km/h",
    altitude: "FL400 · 40,000 ft",
    progress: 48,
    eta: "5h 15m",
    status: "en-route",
    color: "#34d399",
    duration: 5.2,
    curvature: 0.32,
  },
  {
    id: "QF-001",
    from: "SYD",
    to: "SIN",
    callsign: "QANTAS 1",
    aircraft: "Boeing 787-9",
    speed: "498 kts · 922 km/h",
    altitude: "FL370 · 37,000 ft",
    progress: 74,
    eta: "2h 05m",
    status: "en-route",
    color: "#10b981",
    duration: 4.4,
    curvature: 0.2,
  },
];

const cargoRoutes: FlightRoute[] = [
  {
    id: "FDX-012",
    from: "SFO",
    to: "JFK",
    callsign: "FEDEX 12",
    aircraft: "MD-11F Cargo (48 tons)",
    speed: "480 kts",
    altitude: "FL340",
    progress: 60,
    eta: "1h 55m",
    status: "en-route",
    color: "#10b981",
    vehicleType: "dot",
    duration: 3.5,
  },
  {
    id: "DHL-881",
    from: "FRA",
    to: "DXB",
    callsign: "DHL 881",
    aircraft: "Boeing 777F (102 tons)",
    speed: "515 kts",
    altitude: "FL370",
    progress: 88,
    eta: "45m",
    status: "approaching",
    color: "#10b981",
    vehicleType: "dot",
    duration: 3.8,
  },
  {
    id: "UPS-204",
    from: "SIN",
    to: "HND",
    callsign: "UPS 204",
    aircraft: "Boeing 747-8F (130 tons)",
    speed: "545 kts",
    altitude: "FL390",
    progress: 32,
    eta: "4h 10m",
    status: "en-route",
    color: "#34d399",
    vehicleType: "packet",
    duration: 4.0,
  },
];

const selectedMaritime = ref("MSC-910");

const maritimeHubs: RouteHub[] = [
  {
    id: "SHA",
    name: "Port of Shanghai",
    city: "Shanghai",
    lat: 31.2304,
    lng: 121.4737,
    status: "optimal",
    latency: "47M TEU/yr",
    color: "#10b981",
  },
  {
    id: "SIN",
    name: "Port of Singapore",
    city: "Singapore",
    lat: 1.2838,
    lng: 103.8591,
    status: "optimal",
    latency: "39M TEU/yr",
    color: "#10b981",
  },
  {
    id: "RTM",
    name: "Port of Rotterdam",
    city: "Rotterdam",
    lat: 51.9244,
    lng: 4.4777,
    status: "optimal",
    latency: "14M TEU/yr",
    color: "#10b981",
  },
  {
    id: "LAX",
    name: "Port of Los Angeles",
    city: "Los Angeles",
    lat: 33.7432,
    lng: -118.2673,
    status: "optimal",
    latency: "10M TEU/yr",
    color: "#10b981",
  },
  {
    id: "DXB",
    name: "Jebel Ali Port",
    city: "Dubai",
    lat: 25.0118,
    lng: 55.0611,
    status: "optimal",
    latency: "15M TEU/yr",
    color: "#10b981",
  },
];

const maritimeRoutes: FlightRoute[] = [
  {
    id: "MSC-910",
    from: "SHA",
    to: "LAX",
    callsign: "MSC OSCAR",
    aircraft: "Ultra Large Container Vessel (19,224 TEU)",
    speed: "19.4 knots",
    altitude: "Sea Level · Draft 16.0m",
    progress: 58,
    eta: "4d 12h",
    status: "en-route",
    color: "#10b981",
    vehicleType: "ship",
    duration: 5.5,
    curvature: 0.18,
  },
  {
    id: "MAERSK-44",
    from: "SIN",
    to: "RTM",
    callsign: "MAERSK MC-KINNEY",
    aircraft: "Triple-E Container Vessel (18,270 TEU)",
    speed: "18.2 knots",
    altitude: "Sea Level · Draft 15.5m",
    progress: 72,
    eta: "6d 08h",
    status: "en-route",
    color: "#10b981",
    vehicleType: "ship",
    duration: 6.2,
    curvature: 0.24,
  },
  {
    id: "CMA-201",
    from: "DXB",
    to: "SIN",
    callsign: "CMA CGM JACQUES SAADE",
    aircraft: "LNG Mega Carrier (23,000 TEU)",
    speed: "21.0 knots",
    altitude: "Sea Level · Draft 15.8m",
    progress: 35,
    eta: "3d 14h",
    status: "en-route",
    color: "#34d399",
    vehicleType: "ship",
    duration: 4.8,
    curvature: 0.16,
  },
];
</script>

<template>
  <Story
    title="Global Long-Haul Flight Operations"
    description="Dedicated flight corridor map featuring Bezier curved arcs with traveling aircraft oriented along flight heading via native SVG motion, pulse hubs, and hover telemetry cards."
  >
    <div class="space-y-4">
      <div class="flex flex-wrap items-center gap-2 text-xs">
        <div
          class="border-border bg-card text-muted-foreground flex items-center gap-1.5 rounded-md border px-2.5 py-1"
        >
          <span
            class="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500"
          />
          <span class="text-foreground font-medium">Selected Flight:</span>
          <span>{{ selectedFlight || "None (Hover or click arc)" }}</span>
        </div>
        <div
          class="border-border bg-card text-muted-foreground flex items-center gap-1.5 rounded-md border px-2.5 py-1"
        >
          <span class="text-foreground font-medium">Airborne Fleet:</span> 7
          Aircraft
        </div>
        <div
          class="border-border bg-card text-muted-foreground flex items-center gap-1.5 rounded-md border px-2.5 py-1"
        >
          <span class="text-foreground font-medium">Global Hubs:</span> 8
          Gateways
        </div>
      </div>

      <div class="border-border bg-card rounded-xl border p-4">
        <RouteFlowMap
          v-model:selected-route="selectedFlight"
          :hubs="aviationHubs"
          :routes="scheduledFlights"
        />
      </div>
    </div>
  </Story>

  <Story
    title="Express Air Cargo Freight Trunks"
    description="Heavy cargo transit network featuring packet pulses, payload tonnages, and airport turnaround diagnostics."
  >
    <div class="space-y-4">
      <div class="flex flex-wrap items-center gap-2 text-xs">
        <div
          class="border-border bg-card text-muted-foreground flex items-center gap-1.5 rounded-md border px-2.5 py-1"
        >
          <span class="inline-block h-2 w-2 rounded-full bg-emerald-500" />
          <span class="text-foreground font-medium">Network Payload:</span> 280
          Metric Tons
        </div>
        <div
          class="border-border bg-card text-muted-foreground flex items-center gap-1.5 rounded-md border px-2.5 py-1"
        >
          <span class="text-foreground font-medium">On-Time Performance:</span>
          99.4%
        </div>
      </div>

      <div class="border-border bg-card rounded-xl border p-4">
        <RouteFlowMap
          v-model:selected-route="selectedCargo"
          :hubs="aviationHubs"
          :routes="cargoRoutes"
        />
      </div>
    </div>
  </Story>

  <Story
    title="Global Maritime Container Shipping Lanes"
    description="Dedicated ocean freight lanes featuring animated SVG container vessel silhouettes navigating maritime corridors with live TEU payloads, nautical speeds, and draft telemetry."
  >
    <div class="space-y-4">
      <div class="flex flex-wrap items-center gap-2 text-xs">
        <div
          class="border-border bg-card text-muted-foreground flex items-center gap-1.5 rounded-md border px-2.5 py-1"
        >
          <span class="inline-block h-2 w-2 rounded-full bg-cyan-500" />
          <span class="text-foreground font-medium">Focused Vessel:</span>
          <span>{{ selectedMaritime }}</span>
        </div>
        <div
          class="border-border bg-card text-muted-foreground flex items-center gap-1.5 rounded-md border px-2.5 py-1"
        >
          <span class="text-foreground font-medium"
            >Active Container Volume:</span
          >
          60,494 TEU
        </div>
      </div>

      <div class="border-border bg-card rounded-xl border p-4">
        <RouteFlowMap
          v-model:selected-route="selectedMaritime"
          :hubs="maritimeHubs"
          :routes="maritimeRoutes"
        />
      </div>
    </div>
  </Story>
</template>
