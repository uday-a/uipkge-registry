import { useState, useRef } from "react";
import type mapboxgl from "mapbox-gl";
import Story from "../../components/story/Story";
import {
  Map,
  MapMarker,
  MapPopup,
  MapSource,
  MapLayer,
  type MapVariant,
} from "@react-registry/map";
import {
  Navigation,
  ChevronDown,
  ChevronUp,
  Globe2,
  Boxes,
  Building2,
  Mountain,
  Car,
  Sparkles,
  Server,
  Plus,
  Minus,
  RotateCcw,
  Compass,
  Maximize2,
} from "lucide-react";

// Mapbox token from the environment; undefined falls through to the demo key
// baked into Map itself, so the stories render without local env setup.
const token = (import.meta.env.PUBLIC_MAPBOX_TOKEN as string) || undefined;

// ─────────────────────────────────────────────────────────────────────────────
// VARIANT SWITCHER DATA & GEOGRAPHIC SCOPE
// ─────────────────────────────────────────────────────────────────────────────
type MapScope = "world" | "americas" | "emea" | "apac" | "metro";

const scopeOptions: {
  id: MapScope;
  label: string;
  center: [number, number];
  zoom: number;
  pitch: number;
}[] = [
  { id: "world", label: "World", center: [15, 20], zoom: 1.35, pitch: 0 },
  { id: "americas", label: "Americas", center: [-85, 20], zoom: 2.8, pitch: 0 },
  {
    id: "emea",
    label: "Europe & Africa",
    center: [18, 28],
    zoom: 2.9,
    pitch: 0,
  },
  { id: "apac", label: "Asia-Pacific", center: [115, 12], zoom: 2.7, pitch: 0 },
  {
    id: "metro",
    label: "Metro NYC",
    center: [-73.985, 40.748],
    zoom: 13.8,
    pitch: 45,
  },
];

const worldHubs = [
  {
    name: "New York (JFK)",
    coords: [-74.006, 40.713] as [number, number],
    region: "North America",
    status: "Active",
  },
  {
    name: "San Francisco (SFO)",
    coords: [-122.419, 37.774] as [number, number],
    region: "North America",
    status: "Active",
  },
  {
    name: "London (LHR)",
    coords: [-0.128, 51.507] as [number, number],
    region: "EMEA",
    status: "Active",
  },
  {
    name: "Frankfurt (FRA)",
    coords: [8.682, 50.11] as [number, number],
    region: "EMEA",
    status: "Active",
  },
  {
    name: "Tokyo (HND)",
    coords: [139.692, 35.689] as [number, number],
    region: "APAC",
    status: "Active",
  },
  {
    name: "Singapore (SIN)",
    coords: [103.852, 1.29] as [number, number],
    region: "APAC",
    status: "Active",
  },
  {
    name: "Sydney (SYD)",
    coords: [151.209, -33.868] as [number, number],
    region: "Oceania",
    status: "Active",
  },
  {
    name: "São Paulo (GRU)",
    coords: [-46.633, -23.55] as [number, number],
    region: "LATAM",
    status: "Active",
  },
  {
    name: "Dubai (DXB)",
    coords: [55.27, 25.205] as [number, number],
    region: "Middle East",
    status: "Active",
  },
  {
    name: "Cape Town (CPT)",
    coords: [18.424, -33.925] as [number, number],
    region: "Africa",
    status: "Active",
  },
];

const variantOptions: { id: MapVariant; label: string; desc: string }[] = [
  { id: "default", label: "Default", desc: "Theme-aware light/dark basemap" },
  {
    id: "streets",
    label: "Streets",
    desc: "Detailed road network, transit, and POIs",
  },
  {
    id: "standard",
    label: "Standard 3D",
    desc: "Mapbox Standard with dynamic lighting",
  },
  {
    id: "satellite-streets",
    label: "Satellite Hybrid",
    desc: "High-res satellite + street vector overlays",
  },
  {
    id: "outdoors",
    label: "Outdoors",
    desc: "Topographic contours, hillshades, hiking trails",
  },
  {
    id: "navigation-night",
    label: "Nav Night",
    desc: "High-contrast automotive dark HUD",
  },
  {
    id: "navigation-day",
    label: "Nav Day",
    desc: "High-contrast automotive day palette",
  },
  { id: "dark", label: "Dark v11", desc: "Sleek monochromatic dark theme" },
  { id: "light", label: "Light v11", desc: "Clean monochromatic light theme" },
  {
    id: "satellite",
    label: "Satellite Pure",
    desc: "Pure satellite imagery without labels",
  },
  {
    id: "muted",
    label: "Muted Canvas",
    desc: "Theme-aware desaturated data dashboard",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MATH & ROUTING HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function wrapLng(lng: number) {
  return ((((lng + 180) % 360) + 360) % 360) - 180;
}

function shortestLngDelta(from: number, to: number) {
  let d = to - from;
  while (d > 180) d -= 360;
  while (d < -180) d += 360;
  return d;
}

function createCurvedArc(
  start: [number, number],
  end: [number, number],
  numPoints = 60,
  curvature = 0.18,
): [number, number][] {
  const [lng1, lat1] = start;
  const dLng = shortestLngDelta(lng1, end[0]);
  const lng2 = lng1 + dLng;
  const lat2 = end[1];
  const midLng = (lng1 + lng2) / 2;
  const midLat = (lat1 + lat2) / 2;
  const dLat = lat2 - lat1;
  const dist = Math.hypot(dLng, dLat);
  const normLng = -dLat / (dist || 1);
  const normLat = dLng / (dist || 1);
  const ctrlLng = midLng + normLng * dist * curvature;
  const ctrlLat = midLat + normLat * dist * curvature + Math.abs(dLng) * 0.08;

  const points: [number, number][] = [];
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const lng =
      (1 - t) * (1 - t) * lng1 + 2 * (1 - t) * t * ctrlLng + t * t * lng2;
    const lat =
      (1 - t) * (1 - t) * lat1 + 2 * (1 - t) * t * ctrlLat + t * t * lat2;
    points.push([Number(wrapLng(lng).toFixed(4)), Number(lat.toFixed(4))]);
  }
  return points;
}

/** Hand-drawn North Pacific route (Oregon → Tokyo). Avoids the eastward
 *  lerp across the Atlantic/Arctic when the antimeridian sits between the
 *  endpoints. */
function transpacificRoute(): [number, number][] {
  const waypoints: [number, number][] = [
    [-122.68, 45.52],
    [-130.8, 44.1],
    [-141.5, 42.6],
    [-153.2, 41.4],
    [-165.4, 40.5],
    [-176.8, 39.8],
    [171.6, 39.2],
    [160.4, 38.3],
    [150.2, 37.1],
    [139.69, 35.68],
  ];
  const points: [number, number][] = [];
  for (let i = 0; i < waypoints.length - 1; i++) {
    const [lng1, lat1] = waypoints[i];
    const dLng = shortestLngDelta(lng1, waypoints[i + 1][0]);
    const dLat = waypoints[i + 1][1] - lat1;
    const steps = 8;
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      points.push([
        Number(wrapLng(lng1 + dLng * t).toFixed(4)),
        Number((lat1 + dLat * t).toFixed(4)),
      ]);
    }
  }
  points.push([139.69, 35.68]);
  return points;
}

function lineGeometry(
  coords: [number, number][],
):
  | { type: "LineString"; coordinates: [number, number][] }
  | { type: "MultiLineString"; coordinates: [number, number][][] } {
  const parts: [number, number][][] = [];
  let current: [number, number][] = [];
  for (const pt of coords) {
    if (
      current.length &&
      Math.abs(pt[0] - current[current.length - 1][0]) > 180
    ) {
      if (current.length > 1) parts.push(current);
      current = [];
    }
    current.push(pt);
  }
  if (current.length > 1) parts.push(current);
  if (parts.length <= 1)
    return { type: "LineString", coordinates: parts[0] ?? coords };
  return { type: "MultiLineString", coordinates: parts };
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA SETS
// ─────────────────────────────────────────────────────────────────────────────

// ── 0. Global Cloud Infrastructure Story Data (Full World View) ──────────────
const cloudRegions = [
  {
    id: "us-east-1",
    name: "N. Virginia",
    code: "us-east-1",
    coords: [-77.48, 39.04] as [number, number],
    ping: "12ms",
    status: "Optimal",
    egress: "4.8 Tbps",
  },
  {
    id: "us-west-2",
    name: "Oregon",
    code: "us-west-2",
    coords: [-122.68, 45.52] as [number, number],
    ping: "18ms",
    status: "Optimal",
    egress: "3.9 Tbps",
  },
  {
    id: "sa-east-1",
    name: "São Paulo",
    code: "sa-east-1",
    coords: [-46.63, -23.55] as [number, number],
    ping: "68ms",
    status: "Optimal",
    egress: "1.4 Tbps",
  },
  {
    id: "eu-west-1",
    name: "Dublin",
    code: "eu-west-1",
    coords: [-6.26, 53.35] as [number, number],
    ping: "24ms",
    status: "Optimal",
    egress: "3.6 Tbps",
  },
  {
    id: "eu-central-1",
    name: "Frankfurt",
    code: "eu-central-1",
    coords: [8.68, 50.11] as [number, number],
    ping: "28ms",
    status: "Optimal",
    egress: "4.2 Tbps",
  },
  {
    id: "me-central-1",
    name: "Dubai",
    code: "me-central-1",
    coords: [55.27, 25.2] as [number, number],
    ping: "54ms",
    status: "Optimal",
    egress: "1.8 Tbps",
  },
  {
    id: "af-south-1",
    name: "Cape Town",
    code: "af-south-1",
    coords: [18.42, -33.92] as [number, number],
    ping: "82ms",
    status: "Optimal",
    egress: "850 Gbps",
  },
  {
    id: "ap-south-1",
    name: "Mumbai",
    code: "ap-south-1",
    coords: [72.88, 19.08] as [number, number],
    ping: "42ms",
    status: "Optimal",
    egress: "2.1 Tbps",
  },
  {
    id: "ap-southeast-1",
    name: "Singapore",
    code: "ap-southeast-1",
    coords: [103.85, 1.29] as [number, number],
    ping: "31ms",
    status: "Optimal",
    egress: "3.8 Tbps",
  },
  {
    id: "ap-northeast-1",
    name: "Tokyo",
    code: "ap-northeast-1",
    coords: [139.69, 35.68] as [number, number],
    ping: "36ms",
    status: "Optimal",
    egress: "3.5 Tbps",
  },
  {
    id: "ap-southeast-2",
    name: "Sydney",
    code: "ap-southeast-2",
    coords: [151.21, -33.87] as [number, number],
    ping: "65ms",
    status: "Optimal",
    egress: "1.9 Tbps",
  },
];

const fiberCables = [
  {
    id: "cable-transatlantic",
    name: "Transatlantic High-Speed Fiber",
    coords: createCurvedArc([-77.48, 39.04], [-6.26, 53.35], 40, 0.15),
    color: "#38bdf8",
  },
  {
    id: "cable-eu-interlink",
    name: "Pan-European Terrestrial Backbone",
    coords: createCurvedArc([-6.26, 53.35], [8.68, 50.11], 20, 0.05),
    color: "#38bdf8",
  },
  {
    id: "cable-eu-mideast",
    name: "Euro-Middle East Trans-Suez Subsea",
    coords: createCurvedArc([8.68, 50.11], [55.27, 25.2], 35, -0.1),
    color: "#06b6d4",
  },
  {
    id: "cable-gulf-india",
    name: "Gulf to India Subsea Fiber",
    coords: createCurvedArc([55.27, 25.2], [72.88, 19.08], 25, -0.08),
    color: "#06b6d4",
  },
  {
    id: "cable-india-singapore",
    name: "Bay of Bengal Gateway",
    coords: createCurvedArc([72.88, 19.08], [103.85, 1.29], 30, -0.1),
    color: "#10b981",
  },
  {
    id: "cable-singapore-tokyo",
    name: "Asia Submarine-express Cable",
    coords: createCurvedArc([103.85, 1.29], [139.69, 35.68], 35, 0.12),
    color: "#10b981",
  },
  {
    id: "cable-transpacific",
    name: "Transpacific High-Bandwidth Fiber",
    coords: transpacificRoute(),
    color: "#a855f7",
  },
  {
    id: "cable-pan-american",
    name: "Pan-American Subsea Cable",
    coords: createCurvedArc([-77.48, 39.04], [-46.63, -23.55], 45, -0.15),
    color: "#f59e0b",
  },
  {
    id: "cable-africa-link",
    name: "Africa Intercontinental Subsea",
    coords: createCurvedArc([8.68, 50.11], [18.42, -33.92], 40, -0.18),
    color: "#f43f5e",
  },
  {
    id: "cable-oceania-link",
    name: "Australia-Singapore Subsea",
    coords: createCurvedArc([103.85, 1.29], [151.21, -33.87], 35, -0.12),
    color: "#10b981",
  },
];

// ── 1. 3D Globe Projection Arcs & Nodes ──────────────────────────────────────
const globeArcs = [
  {
    id: "g1",
    coords: createCurvedArc([-122.42, 37.77], [139.69, 35.68], 50, 0.08),
    color: "#38bdf8",
  },
  {
    id: "g2",
    coords: createCurvedArc([-74.0, 40.71], [-0.12, 51.5], 50, 0.2),
    color: "#38bdf8",
  },
  {
    id: "g3",
    coords: createCurvedArc([-0.12, 51.5], [103.85, 1.29], 50, 0.15),
    color: "#06b6d4",
  },
  {
    id: "g4",
    coords: createCurvedArc([103.85, 1.29], [151.2, -33.86], 40, -0.15),
    color: "#10b981",
  },
];

const globeNodes = [
  { name: "San Francisco", coords: [-122.42, 37.77] as [number, number] },
  { name: "New York", coords: [-74.0, 40.71] as [number, number] },
  { name: "London", coords: [-0.12, 51.5] as [number, number] },
  { name: "Tokyo", coords: [139.69, 35.68] as [number, number] },
  { name: "Singapore", coords: [103.85, 1.29] as [number, number] },
  { name: "Sydney", coords: [151.2, -33.86] as [number, number] },
];

function initGlobeLayers(map: mapboxgl.Map) {
  try {
    map.setFog({
      color: "rgb(186, 210, 240)",
      "high-color": "rgb(36, 92, 223)",
      "horizon-blend": 0.02,
      "space-color": "rgb(11, 11, 25)",
      "star-intensity": 0.6,
    });
  } catch {
    /* fallback */
  }

  globeArcs.forEach((arc) => {
    map.addSource(arc.id, {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: lineGeometry(arc.coords),
      },
    });
    map.addLayer({
      id: `${arc.id}-line`,
      type: "line",
      source: arc.id,
      layout: { "line-cap": "round", "line-join": "round" },
      paint: {
        "line-color": arc.color,
        "line-width": 2.2,
        "line-opacity": 0.8,
      },
    });
  });
}

// ── 2. Cluster Facility Points (North America) ───────────────────────────────
const hubClusterPoints = [
  { name: "Seattle Hub", lngLat: [-122.33, 47.6] },
  { name: "Tacoma Depot", lngLat: [-122.44, 47.25] },
  { name: "Portland Center", lngLat: [-122.67, 45.52] },
  { name: "Sacramento Depot", lngLat: [-121.49, 38.58] },
  { name: "SF Logistics", lngLat: [-122.41, 37.77] },
  { name: "Oakland Port Facility", lngLat: [-122.27, 37.8] },
  { name: "San Jose Depot", lngLat: [-121.88, 37.33] },
  { name: "Fresno Center", lngLat: [-119.78, 36.74] },
  { name: "LA Harbor Terminal", lngLat: [-118.24, 34.05] },
  { name: "Long Beach Depot", lngLat: [-118.19, 33.77] },
  { name: "Ontario Freight Hub", lngLat: [-117.65, 34.06] },
  { name: "San Diego Hub", lngLat: [-117.16, 32.71] },
  { name: "Phoenix Central", lngLat: [-112.07, 33.44] },
  { name: "Tucson Center", lngLat: [-110.97, 32.22] },
  { name: "Las Vegas Depot", lngLat: [-115.13, 36.16] },
  { name: "Salt Lake Hub", lngLat: [-111.89, 40.76] },
  { name: "Denver Gateway", lngLat: [-104.99, 39.73] },
  { name: "Aurora Logistics", lngLat: [-104.83, 39.72] },
  { name: "Albuquerque Terminal", lngLat: [-106.65, 35.08] },
  { name: "El Paso Gateway", lngLat: [-106.48, 31.76] },
  { name: "Dallas Fort Worth Hub", lngLat: [-96.79, 32.77] },
  { name: "Fort Worth Depot", lngLat: [-97.33, 32.75] },
  { name: "Austin Central", lngLat: [-97.74, 30.26] },
  { name: "Houston Port Logistics", lngLat: [-95.36, 29.76] },
  { name: "Kansas City Terminal", lngLat: [-94.57, 39.09] },
  { name: "St. Louis Depot", lngLat: [-90.19, 38.62] },
  { name: "Minneapolis Hub", lngLat: [-93.26, 44.97] },
  { name: "Milwaukee Depot", lngLat: [-87.9, 43.03] },
  { name: "Chicago O’Hare Cargo", lngLat: [-87.62, 41.87] },
  { name: "Chicago South Rail", lngLat: [-87.7, 41.7] },
  { name: "Indianapolis Freight", lngLat: [-86.15, 39.76] },
  { name: "Detroit Terminal", lngLat: [-83.04, 42.33] },
  { name: "Columbus Hub", lngLat: [-82.99, 39.96] },
  { name: "Memphis Air Cargo Hub", lngLat: [-90.04, 35.14] },
  { name: "Nashville Depot", lngLat: [-86.78, 36.16] },
  { name: "Atlanta Super-Hub", lngLat: [-84.38, 33.74] },
  { name: "Savannah Port Center", lngLat: [-81.09, 32.08] },
  { name: "Jacksonville Terminal", lngLat: [-81.65, 30.33] },
  { name: "Miami Gateway", lngLat: [-80.19, 25.76] },
  { name: "Charlotte Hub", lngLat: [-80.84, 35.22] },
  { name: "Washington DC Freight", lngLat: [-77.03, 38.9] },
  { name: "Philadelphia Terminal", lngLat: [-75.16, 39.95] },
  { name: "Newark Air Cargo", lngLat: [-74.17, 40.73] },
  { name: "JFK Freight Terminal", lngLat: [-73.78, 40.64] },
  { name: "Boston Center", lngLat: [-71.05, 42.36] },
];

function initClusterLayers(map: mapboxgl.Map) {
  const geojson: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: hubClusterPoints.map((pt, i) => ({
      type: "Feature",
      id: i,
      properties: { name: pt.name },
      geometry: { type: "Point", coordinates: pt.lngLat },
    })),
  };

  map.addSource("cluster-hubs", {
    type: "geojson",
    data: geojson,
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 45,
  });

  map.addLayer({
    id: "clusters-glow",
    type: "circle",
    source: "cluster-hubs",
    filter: ["has", "point_count"],
    paint: {
      "circle-color": [
        "step",
        ["get", "point_count"],
        "#3b82f6",
        5,
        "#6366f1",
        15,
        "#8b5cf6",
      ],
      "circle-radius": ["step", ["get", "point_count"], 20, 5, 26, 15, 32],
      "circle-opacity": 0.2,
    },
  });

  map.addLayer({
    id: "clusters",
    type: "circle",
    source: "cluster-hubs",
    filter: ["has", "point_count"],
    paint: {
      "circle-color": [
        "step",
        ["get", "point_count"],
        "#2563eb",
        5,
        "#4f46e5",
        15,
        "#7c3aed",
      ],
      "circle-radius": ["step", ["get", "point_count"], 14, 5, 18, 15, 24],
      "circle-stroke-width": 2,
      "circle-stroke-color": "#ffffff",
    },
  });

  map.addLayer({
    id: "cluster-count",
    type: "symbol",
    source: "cluster-hubs",
    filter: ["has", "point_count"],
    layout: {
      "text-field": "{point_count_abbreviated}",
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 11,
    },
    paint: { "text-color": "#ffffff" },
  });

  map.addLayer({
    id: "unclustered-point",
    type: "circle",
    source: "cluster-hubs",
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-color": "#3b82f6",
      "circle-radius": 5,
      "circle-stroke-width": 1.5,
      "circle-stroke-color": "#ffffff",
    },
  });

  map.on("click", "clusters", (e) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ["clusters"],
    });
    const clusterId = features[0]?.properties?.cluster_id;
    const source = map.getSource("cluster-hubs") as mapboxgl.GeoJSONSource;
    source.getClusterExpansionZoom(clusterId, (err, zoom) => {
      if (err) return;
      const coords = (features[0].geometry as any).coordinates;
      map.easeTo({ center: coords, zoom: zoom + 0.5, duration: 500 });
    });
  });

  map.on("mouseenter", "clusters", () => {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", "clusters", () => {
    map.getCanvas().style.cursor = "";
  });
}

// ── 3. Delivery Route Data ───────────────────────────────────────────────────
const deliveryOrigin: [number, number] = [-122.414, 37.788];
const deliveryDest: [number, number] = [-122.392, 37.776];
const deliveryRoute: [number, number][] = [
  [-122.414, 37.788],
  [-122.411, 37.785],
  [-122.407, 37.784],
  [-122.402, 37.782],
  [-122.397, 37.779],
  [-122.392, 37.776],
];

function initDeliveryRoute(map: mapboxgl.Map) {
  map.addSource("delivery-route", {
    type: "geojson",
    data: {
      type: "Feature",
      properties: {},
      geometry: { type: "LineString", coordinates: deliveryRoute },
    },
  });
  map.addLayer({
    id: "delivery-route-casing",
    type: "line",
    source: "delivery-route",
    layout: { "line-cap": "round", "line-join": "round" },
    paint: { "line-color": "#3b82f6", "line-width": 6, "line-opacity": 0.25 },
  });
  map.addLayer({
    id: "delivery-route-line",
    type: "line",
    source: "delivery-route",
    layout: { "line-cap": "round", "line-join": "round" },
    paint: { "line-color": "#2563eb", "line-width": 3.5 },
  });
}

export default function MapDemos() {
  const [activeVariant, setActiveVariant] = useState<MapVariant>("streets");
  const [popupOpen, setPopupOpen] = useState(true);
  const [cameraPitch, setCameraPitch] = useState(45);
  const [cameraBearing, setCameraBearing] = useState(-20);
  const [activeScope, setActiveScope] = useState<MapScope>("world");
  const [selectedRegionId, setSelectedRegionId] = useState<string>("us-east-1");
  const switcherMapRef = useRef<mapboxgl.Map | null>(null);
  const cloudMapRef = useRef<mapboxgl.Map | null>(null);
  const [expandGlobeInfo, setExpandGlobeInfo] = useState(false);
  const [expandClusterInfo, setExpandClusterInfo] = useState(false);

  function setScope(scopeId: MapScope) {
    setActiveScope(scopeId);
    const target = scopeOptions.find((s) => s.id === scopeId);
    if (target && switcherMapRef.current) {
      switcherMapRef.current.flyTo({
        center: target.center,
        zoom: target.zoom,
        pitch: target.pitch,
        duration: 1200,
        essential: true,
      });
    }
  }

  function onCloudMapCreated(map: mapboxgl.Map) {
    cloudMapRef.current = map;
    fiberCables.forEach((cable) => {
      if (map.getSource(cable.id)) return;
      map.addSource(cable.id, {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: lineGeometry(cable.coords),
        },
      });
      map.addLayer({
        id: `${cable.id}-glow`,
        type: "line",
        source: cable.id,
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": cable.color,
          "line-width": 4,
          "line-opacity": 0.25,
        },
      });
      map.addLayer({
        id: `${cable.id}-line`,
        type: "line",
        source: cable.id,
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": cable.color,
          "line-width": 2,
          "line-dasharray": [3, 2],
          "line-opacity": 0.85,
        },
      });
    });
  }

  function selectCloudRegion(regionId: string) {
    setSelectedRegionId(regionId);
    const reg = cloudRegions.find((r) => r.id === regionId);
    if (reg && cloudMapRef.current) {
      cloudMapRef.current.flyTo({
        center: reg.coords,
        zoom: 4.2,
        duration: 1200,
        essential: true,
      });
    }
  }

  function resetCloudWorldView() {
    setSelectedRegionId("");
    if (cloudMapRef.current) {
      cloudMapRef.current.flyTo({
        center: [15, 20],
        zoom: 1.35,
        duration: 1200,
        essential: true,
      });
    }
  }

  // Zoom, Navigation & Fullscreen Controls Demo State
  const [zoomNavPosition, setZoomNavPosition] = useState<
    "top-left" | "top-right" | "bottom-left" | "bottom-right"
  >("top-right");
  const [zoomNavCompass, setZoomNavCompass] = useState(true);
  const [zoomNavButtons, setZoomNavButtons] = useState(true);
  const [zoomNavFullscreen, setZoomNavFullscreen] = useState(true);
  const [zoomNavFullscreenPos, setZoomNavFullscreenPos] = useState<
    "top-left" | "top-right" | "bottom-left" | "bottom-right"
  >("top-left");
  const [currentZoomLevel, setCurrentZoomLevel] = useState(2.4);
  const zoomMapRef = useRef<mapboxgl.Map | null>(null);

  function onZoomMapCreated(map: mapboxgl.Map) {
    zoomMapRef.current = map;
    map.on("zoom", () => {
      setCurrentZoomLevel(Math.round(map.getZoom() * 10) / 10);
    });
  }

  function handleZoomIn() {
    zoomMapRef.current?.zoomIn({ duration: 300 });
  }

  function handleZoomOut() {
    zoomMapRef.current?.zoomOut({ duration: 300 });
  }

  function handleZoomTo(targetZoom: number) {
    zoomMapRef.current?.zoomTo(targetZoom, { duration: 600 });
  }

  function handleResetBearing() {
    zoomMapRef.current?.resetNorthPitch({ duration: 500 });
  }

  function handleToggleFullscreen() {
    const el = zoomMapRef.current?.getContainer();
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen?.();
    }
  }

  const activeScopePreset =
    scopeOptions.find((s) => s.id === activeScope) ?? scopeOptions[0];

  return (
    <>
      <Story
        title="Default"
        description="Theme-aware basemap with a single marker. Light and dark follow the site theme; pass an access token and drop MapMarker into the children."
      >
        <Map
          accessToken={token}
          center={[-74.006, 40.713]}
          zoom={11}
          className="h-80 w-full rounded-lg border"
        >
          <MapMarker longitude={-74.006} latitude={40.713} anchor="bottom">
            <span className="bg-primary ring-background size-3 rounded-full ring-2" />
          </MapMarker>
        </Map>
      </Story>

      <Story
        title="Missing access token"
        description="Pass an empty `accessToken` to skip the demo key. The map slot stays empty until Mapbox credentials are provided."
      >
        <Map accessToken="" className="h-80 w-full rounded-lg border" />
      </Story>

      <Story
        title="Marker popup"
        description="MapPopup is re-exported from the map package. Pair it with MapMarker for a clickable pin that opens a token-styled popup."
      >
        <Map
          accessToken={token}
          center={[-0.128, 51.507]}
          zoom={12}
          className="h-80 w-full rounded-lg border"
        >
          <MapMarker
            longitude={-0.128}
            latitude={51.507}
            anchor="bottom"
            onClick={() => setPopupOpen((open) => !open)}
          >
            <button
              type="button"
              className="bg-primary ring-background size-3 rounded-full ring-2"
              aria-label="Toggle London office popup"
            />
          </MapMarker>
          {popupOpen && (
            <MapPopup
              longitude={-0.128}
              latitude={51.507}
              anchor="bottom"
              offset={12}
              onClose={() => setPopupOpen(false)}
            >
              <div className="space-y-0.5 px-1 py-0.5">
                <p className="text-sm font-medium">London office</p>
                <p className="text-muted-foreground text-xs">
                  King&apos;s Cross · open 08:00–18:00
                </p>
              </div>
            </MapPopup>
          )}
        </Map>
      </Story>

      <Story
        title="Camera pitch and bearing"
        description="`pitch` tilts the camera (0–85°) and `bearing` rotates it. Both are watched live — useful for 3D city and terrain views."
      >
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <label className="flex items-center gap-2">
              <span className="text-muted-foreground w-14">Pitch</span>
              <input
                type="range"
                min={0}
                max={80}
                value={cameraPitch}
                onChange={(e) => setCameraPitch(Number(e.target.value))}
                className="accent-primary w-40"
              />
              <span className="font-mono">{cameraPitch}°</span>
            </label>
            <label className="flex items-center gap-2">
              <span className="text-muted-foreground w-14">Bearing</span>
              <input
                type="range"
                min={-180}
                max={180}
                value={cameraBearing}
                onChange={(e) => setCameraBearing(Number(e.target.value))}
                className="accent-primary w-40"
              />
              <span className="font-mono">{cameraBearing}°</span>
            </label>
          </div>
          <Map
            accessToken={token}
            variant="streets"
            center={[-73.985, 40.748]}
            zoom={15.2}
            pitch={cameraPitch}
            bearing={cameraBearing}
            buildings3d
            className="h-80 w-full rounded-lg border"
          />
        </div>
      </Story>

      <Story
        title="Controls off"
        description="Hide zoom, compass, and fullscreen with `navigation={false}` and `fullscreen={false}` when the map is decorative or you provide your own chrome."
      >
        <Map
          accessToken={token}
          variant="light"
          center={[2.352, 48.857]}
          zoom={11.5}
          navigation={false}
          fullscreen={false}
          className="h-64 w-full rounded-lg border"
        />
      </Story>

      <Story
        title="Sizes"
        description="`size` sets a height preset (`sm`, `default`, `lg`, `xl`, `full`). Omit it and size the map with `className` instead — blocks typically pass `size-full`."
      >
        <div className="grid h-full min-h-[480px] grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex min-h-0 flex-col gap-1">
            <p className="text-muted-foreground font-mono text-xs">sm</p>
            <div className="min-h-64 flex-1 overflow-hidden rounded-lg border">
              <Map
                accessToken={token}
                variant="light"
                center={[-0.128, 51.507]}
                zoom={10}
                size="full"
                className="size-full"
              />
            </div>
          </div>
          <div className="flex min-h-0 flex-col gap-1">
            <p className="text-muted-foreground font-mono text-xs">lg</p>
            <div className="min-h-64 flex-1 overflow-hidden rounded-lg border">
              <Map
                accessToken={token}
                variant="streets"
                center={[-73.985, 40.748]}
                zoom={11}
                size="full"
                className="size-full"
              />
            </div>
          </div>
        </div>
      </Story>

      <Story
        title="Declarative source and layer"
        description="MapSource + MapLayer are re-exported from the map package. Draw a GeoJSON line without touching the raw Mapbox instance."
      >
        <Map
          accessToken={token}
          variant="light"
          center={[-122.4, 37.78]}
          zoom={12}
          className="h-80 w-full rounded-lg border"
        >
          <MapSource
            id="demo-route"
            type="geojson"
            data={{
              type: "Feature",
              properties: {},
              geometry: { type: "LineString", coordinates: deliveryRoute },
            }}
          >
            <MapLayer
              id="demo-route-line"
              type="line"
              layout={{ "line-cap": "round", "line-join": "round" }}
              paint={{ "line-color": "#18181b", "line-width": 3.5 }}
            />
          </MapSource>
          <MapMarker
            longitude={deliveryOrigin[0]}
            latitude={deliveryOrigin[1]}
            anchor="bottom"
          >
            <span className="bg-primary ring-background size-2.5 rounded-full ring-2" />
          </MapMarker>
          <MapMarker
            longitude={deliveryDest[0]}
            latitude={deliveryDest[1]}
            anchor="bottom"
          >
            <span className="bg-foreground ring-background size-2.5 rounded-full ring-2" />
          </MapMarker>
        </Map>
      </Story>

      {/* 1. Interactive Variant Switcher */}
      <Story
        title="Interactive variant switcher"
        description="Mapbox provides an expansive suite of production basemaps. Toggle dynamically between all official Mapbox variants at full world scale or zoom into specific continents and metropolitan regions."
      >
        <div className="space-y-3">
          {/* Scope & Variant Controls */}
          <div className="bg-muted/60 border-border/80 flex flex-col gap-2.5 rounded-lg border p-2.5">
            {/* Geographic Scope Pills */}
            <div className="border-border/60 flex flex-wrap items-center justify-between gap-2 border-b pb-2">
              <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                View Scope:
              </span>
              <div className="flex flex-wrap gap-1">
                {scopeOptions.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                      activeScope === s.id
                        ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                    onClick={() => setScope(s.id)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Basemap Style Pills */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Basemap Style:
              </span>
              <div className="flex flex-wrap gap-1">
                {variantOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                      activeVariant === opt.id
                        ? "bg-foreground text-background font-semibold shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                    onClick={() => setActiveVariant(opt.id)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-lg border shadow-xs">
            {/* Active Style HUD Overlay */}
            <div className="bg-background/90 border-border/80 absolute top-3 left-3 z-10 flex items-center gap-2 rounded-md border px-2.5 py-1.5 font-mono text-xs shadow-xs backdrop-blur-md">
              <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
              <span className="text-muted-foreground">scope:</span>
              <span className="text-foreground font-bold">{activeScope}</span>
              <span className="text-muted-foreground">• variant:</span>
              <span className="text-foreground font-bold">{activeVariant}</span>
            </div>

            <Map
              key={`${activeVariant}-${activeScope}`}
              accessToken={token}
              variant={activeVariant}
              center={activeScopePreset.center}
              zoom={activeScopePreset.zoom}
              pitch={activeScopePreset.pitch}
              fullscreen={true}
              projection="mercator"
              className="min-h-[460px] w-full md:h-[520px]"
              onCreated={(map) => {
                switcherMapRef.current = map;
              }}
            >
              {/* Global World Markers */}
              {activeScope !== "metro" ? (
                worldHubs.map((hub) => (
                  <MapMarker
                    key={hub.name}
                    longitude={hub.coords[0]}
                    latitude={hub.coords[1]}
                    anchor="center"
                  >
                    <div className="group relative flex cursor-pointer flex-col items-center">
                      <span className="size-2.5 animate-pulse rounded-full bg-emerald-500 shadow-sm ring-4 ring-emerald-500/25" />
                      <div className="bg-background/95 border-border pointer-events-none z-20 mt-1.5 hidden flex-col items-center rounded border px-2 py-0.5 font-mono text-xs shadow-md backdrop-blur-sm group-hover:flex">
                        <span className="text-foreground font-bold">
                          {hub.name}
                        </span>
                        <span className="text-xs text-emerald-500">
                          {hub.region} · {hub.status}
                        </span>
                      </div>
                    </div>
                  </MapMarker>
                ))
              ) : (
                <>
                  <MapMarker
                    longitude={-73.985}
                    latitude={40.748}
                    anchor="bottom"
                  >
                    <div className="flex flex-col items-center">
                      <span className="bg-primary ring-primary/20 size-3 rounded-full ring-4" />
                      <span className="border-border bg-background/90 mt-1 rounded border px-1.5 py-0.5 font-mono text-xs font-bold shadow-xs">
                        Empire State Building
                      </span>
                    </div>
                  </MapMarker>

                  <MapMarker
                    longitude={-74.006}
                    latitude={40.713}
                    anchor="bottom"
                  >
                    <div className="flex flex-col items-center">
                      <span className="size-2.5 rounded-full bg-sky-500 ring-4 ring-sky-500/20" />
                      <span className="border-border bg-background/90 mt-1 rounded border px-1.5 py-0.5 font-mono text-xs font-medium shadow-xs">
                        Lower Manhattan
                      </span>
                    </div>
                  </MapMarker>
                </>
              )}
            </Map>
          </div>
        </div>
      </Story>

      {/* 2. Global Multi-Region Cloud Infrastructure (Full World View) */}
      <Story
        title="Global multi-region cloud topology"
        description="Full planetary world view showing multi-region data centers, edge POPs, and transoceanic subsea fiber optic cables connecting the Americas, EMEA, APAC, and LATAM."
      >
        <div className="relative overflow-hidden rounded-lg border shadow-xs">
          {/* Top Overlay HUD */}
          <div className="bg-background/90 border-border/80 pointer-events-auto absolute top-3 left-3 z-10 flex max-w-sm flex-col gap-2 rounded-lg border p-3 shadow-md backdrop-blur-md sm:max-w-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Server className="size-3.5 text-sky-400" />
                <span className="text-xs font-semibold">
                  Global Cloud Topology
                </span>
              </div>
              <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                11 Regions Online
              </span>
            </div>

            <p className="text-muted-foreground text-xs leading-relaxed">
              Transoceanic subsea fiber networks with live region ping
              telemetry. Click any region pill below to navigate.
            </p>

            <div className="flex flex-wrap gap-1 pt-1">
              {cloudRegions.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  className={`rounded border px-1.5 py-0.5 font-mono text-xs transition-colors ${
                    selectedRegionId === r.id
                      ? "border-sky-500 bg-sky-500/20 font-bold text-sky-300 shadow-xs"
                      : "border-border/60 bg-muted/40 text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => selectCloudRegion(r.id)}
                >
                  {r.code} ({r.ping})
                </button>
              ))}
              {selectedRegionId && (
                <button
                  type="button"
                  className="border-border/80 bg-muted/80 text-foreground hover:bg-muted rounded border px-2 py-0.5 text-xs font-semibold"
                  onClick={resetCloudWorldView}
                >
                  Reset World View
                </button>
              )}
            </div>
          </div>

          <Map
            accessToken={token}
            variant="dark"
            center={[15, 20]}
            zoom={1.35}
            navigation={true}
            fullscreen={true}
            projection="mercator"
            className="min-h-[520px] w-full md:h-[600px]"
            onCreated={onCloudMapCreated}
          >
            {cloudRegions.map((r) => (
              <MapMarker
                key={r.id}
                longitude={r.coords[0]}
                latitude={r.coords[1]}
                anchor="center"
              >
                <div
                  className="group relative flex cursor-pointer flex-col items-center select-none"
                  onClick={() => selectCloudRegion(r.id)}
                >
                  <div className="relative flex items-center justify-center">
                    <span className="absolute size-5 animate-ping rounded-full bg-sky-400/30" />
                    <span
                      className={`size-2.5 rounded-full border border-white shadow-sm ${
                        selectedRegionId === r.id
                          ? "bg-sky-400 ring-4 ring-sky-400/50"
                          : "bg-emerald-500"
                      }`}
                    />
                  </div>
                  <div className="border-border/80 bg-background/95 mt-1.5 flex flex-col items-center rounded border px-1.5 py-0.5 font-mono text-xs shadow-md backdrop-blur-xs">
                    <span className="text-foreground font-bold">{r.name}</span>
                    <span className="text-muted-foreground text-xs">
                      {r.ping} · {r.egress}
                    </span>
                  </div>
                </div>
              </MapMarker>
            ))}
          </Map>
        </div>
      </Story>

      {/* 3. Zoom, Navigation & Fullscreen Controls */}
      <Story
        title="Zoom, navigation & fullscreen controls"
        description="Themed Mapbox GL NavigationControl (+/- zoom buttons, compass) and FullscreenControl with configurable corner placement, plus custom programmatic zoom HUD and HTML5 Fullscreen API toggle."
      >
        <div className="border-border relative overflow-hidden rounded-lg border shadow-xs">
          {/* Control Toolbar Header */}
          <div className="border-border bg-muted/40 space-y-2 border-b p-3 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              {/* Nav Position Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground font-medium">
                  Zoom Nav Pos:
                </span>
                <div className="border-border bg-background inline-flex rounded-md border p-0.5">
                  {(
                    [
                      "top-left",
                      "top-right",
                      "bottom-left",
                      "bottom-right",
                    ] as const
                  ).map((pos) => (
                    <button
                      key={pos}
                      type="button"
                      className={`rounded px-2 py-1 font-mono text-xs transition-colors ${
                        zoomNavPosition === pos
                          ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      onClick={() => setZoomNavPosition(pos)}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fullscreen Pos Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground font-medium">
                  Fullscreen Pos:
                </span>
                <div className="border-border bg-background inline-flex rounded-md border p-0.5">
                  {(
                    [
                      "top-left",
                      "top-right",
                      "bottom-left",
                      "bottom-right",
                    ] as const
                  ).map((pos) => (
                    <button
                      key={pos}
                      type="button"
                      className={`rounded px-2 py-1 font-mono text-xs transition-colors ${
                        zoomNavFullscreenPos === pos
                          ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      onClick={() => setZoomNavFullscreenPos(pos)}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Feature Toggles & Programmatic Presets */}
            <div className="border-border/50 flex flex-wrap items-center justify-between gap-2 border-t pt-1">
              {/* Toggles */}
              <div className="flex items-center gap-3">
                <label className="flex cursor-pointer items-center gap-1.5 select-none">
                  <input
                    type="checkbox"
                    checked={zoomNavFullscreen}
                    onChange={(e) => setZoomNavFullscreen(e.target.checked)}
                    className="border-border accent-primary size-3.5 rounded"
                  />
                  <span className="text-muted-foreground">Show Fullscreen</span>
                </label>
                <label className="flex cursor-pointer items-center gap-1.5 select-none">
                  <input
                    type="checkbox"
                    checked={zoomNavButtons}
                    onChange={(e) => setZoomNavButtons(e.target.checked)}
                    className="border-border accent-primary size-3.5 rounded"
                  />
                  <span className="text-muted-foreground">
                    Show +/- Buttons
                  </span>
                </label>
                <label className="flex cursor-pointer items-center gap-1.5 select-none">
                  <input
                    type="checkbox"
                    checked={zoomNavCompass}
                    onChange={(e) => setZoomNavCompass(e.target.checked)}
                    className="border-border accent-primary size-3.5 rounded"
                  />
                  <span className="text-muted-foreground">Show Compass</span>
                </label>
              </div>

              {/* Programmatic Zoom Presets Bar */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-muted-foreground font-medium">
                  Presets:
                </span>
                {[
                  { label: "World 1.4×", zoom: 1.4 },
                  { label: "Regional 3.5×", zoom: 3.5 },
                  { label: "Metro 11×", zoom: 11 },
                  { label: "Street 15.5×", zoom: 15.5 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    className="border-border bg-background text-foreground hover:bg-muted rounded border px-2 py-1 font-mono text-xs shadow-2xs transition-colors"
                    onClick={() => handleZoomTo(preset.zoom)}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Map with Custom Floating Zoom HUD */}
          <div className="relative min-h-[460px] w-full md:h-[520px]">
            {/* Floating Custom Programmatic Zoom HUD Overlay */}
            <div className="border-border/80 bg-background/90 absolute bottom-3 left-3 z-10 flex flex-col gap-1.5 rounded-md border p-1.5 shadow-md backdrop-blur-md">
              <div className="text-foreground flex items-center gap-1 px-1 font-mono text-xs font-semibold">
                <Compass className="text-primary size-3.5" />
                <span>Zoom: {currentZoomLevel}x</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Zoom in"
                  className="border-border bg-card text-foreground hover:bg-muted flex size-7 items-center justify-center rounded border shadow-2xs transition-colors"
                  onClick={handleZoomIn}
                >
                  <Plus className="size-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="Zoom out"
                  className="border-border bg-card text-foreground hover:bg-muted flex size-7 items-center justify-center rounded border shadow-2xs transition-colors"
                  onClick={handleZoomOut}
                >
                  <Minus className="size-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="Reset orientation"
                  title="Reset North orientation"
                  className="border-border bg-card text-foreground hover:bg-muted flex size-7 items-center justify-center rounded border shadow-2xs transition-colors"
                  onClick={handleResetBearing}
                >
                  <RotateCcw className="text-muted-foreground size-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="Toggle Fullscreen"
                  title="Toggle Fullscreen Mode"
                  className="border-border bg-card text-foreground hover:bg-muted flex size-7 items-center justify-center rounded border shadow-2xs transition-colors"
                  onClick={handleToggleFullscreen}
                >
                  <Maximize2 className="text-primary size-3.5" />
                </button>
              </div>
            </div>

            <Map
              accessToken={token}
              variant="streets"
              center={[2.3522, 48.8566]}
              zoom={2.4}
              pitch={30}
              bearing={15}
              navigation={true}
              navigationPosition={zoomNavPosition}
              showCompass={zoomNavCompass}
              showZoom={zoomNavButtons}
              fullscreen={zoomNavFullscreen}
              fullscreenPosition={zoomNavFullscreenPos}
              className="h-full w-full"
              onCreated={onZoomMapCreated}
            />
          </div>
        </div>
      </Story>

      {/* 4. 3D Extruded Buildings Skyline */}
      <Story
        title="3D extruded buildings"
        description="Real-time 3D building footprint extrusion with 60° camera pitch and ambient roof shading across Midtown Manhattan."
      >
        <div className="relative overflow-hidden rounded-lg border shadow-xs">
          <div className="bg-background/90 border-border/80 absolute top-3 left-3 z-10 flex items-center gap-2 rounded-md border px-2.5 py-1.5 font-mono text-xs shadow-xs backdrop-blur-md">
            <Building2 className="text-primary size-3.5" />
            <span className="text-foreground font-bold">
              3D Extruded Urban Footprints
            </span>
            <span className="text-muted-foreground">• Pitch: 60°</span>
          </div>

          <Map
            accessToken={token}
            variant="dark"
            center={[-73.985, 40.748]}
            zoom={15.8}
            pitch={60}
            bearing={-17}
            buildings3d={true}
            className="min-h-[460px] w-full md:h-[520px]"
          >
            <MapMarker longitude={-73.985} latitude={40.748} anchor="bottom">
              <div className="flex flex-col items-center">
                <span className="size-3 animate-ping rounded-full bg-sky-400" />
                <span className="border-border bg-background/95 mt-1 rounded border px-2 py-0.5 font-mono text-xs font-bold text-sky-500 shadow-md">
                  Midtown Tower
                </span>
              </div>
            </MapMarker>
          </Map>
        </div>
      </Story>

      {/* 3. Satellite & Aerial Hybrid */}
      <Story
        title="Satellite & aerial hybrid"
        description="High-resolution aerial satellite imagery (`satellite-streets`) with vector street grids and labels over the San Francisco Golden Gate."
      >
        <div className="relative overflow-hidden rounded-lg border shadow-xs">
          <div className="bg-background/90 border-border/80 absolute top-3 left-3 z-10 flex items-center gap-2 rounded-md border px-2.5 py-1.5 font-mono text-xs shadow-xs backdrop-blur-md">
            <Sparkles className="size-3.5 text-amber-500" />
            <span className="text-foreground font-bold">
              Satellite Streets (Hybrid)
            </span>
            <span className="text-muted-foreground">• SF Presidio</span>
          </div>

          <Map
            accessToken={token}
            variant="satellite-streets"
            center={[-122.478, 37.819]}
            zoom={13.2}
            className="min-h-[460px] w-full md:h-[520px]"
          >
            <MapMarker longitude={-122.478} latitude={37.819} anchor="bottom">
              <div className="flex flex-col items-center">
                <span className="size-3 rounded-full bg-amber-500 ring-4 ring-amber-500/30" />
                <span className="border-border bg-background/95 mt-1 rounded border px-2 py-0.5 font-mono text-xs font-bold shadow-md">
                  Golden Gate Bridge
                </span>
              </div>
            </MapMarker>
          </Map>
        </div>
      </Story>

      {/* 4. Topographic & Outdoors */}
      <Story
        title="Topographic & outdoors"
        description="Elevation contour lines, mountain relief, and hiking trail networks (`outdoors`) across Yosemite National Park and Half Dome."
      >
        <div className="relative overflow-hidden rounded-lg border shadow-xs">
          <div className="bg-background/90 border-border/80 absolute top-3 left-3 z-10 flex items-center gap-2 rounded-md border px-2.5 py-1.5 font-mono text-xs shadow-xs backdrop-blur-md">
            <Mountain className="size-3.5 text-emerald-500" />
            <span className="text-foreground font-bold">
              Topographic Outdoors
            </span>
            <span className="text-muted-foreground">• Yosemite Valley</span>
          </div>

          <Map
            accessToken={token}
            variant="outdoors"
            center={[-119.538, 37.745]}
            zoom={12.4}
            pitch={40}
            terrain3d={true}
            className="min-h-[460px] w-full md:h-[520px]"
          >
            <MapMarker longitude={-119.538} latitude={37.745} anchor="bottom">
              <div className="flex flex-col items-center">
                <span className="size-3 rounded-full bg-emerald-600 ring-4 ring-emerald-600/30" />
                <span className="border-border bg-background/95 mt-1 rounded border px-2 py-0.5 font-mono text-xs font-bold shadow-md">
                  Half Dome (8,839 ft)
                </span>
              </div>
            </MapMarker>
          </Map>
        </div>
      </Story>

      {/* 5. Turn-by-Turn Navigation Night */}
      <Story
        title="Turn-by-turn navigation HUD"
        description="High-contrast automotive night palette (`navigation-night`) designed for in-dash vehicle navigation, speed limits, and route geometry."
      >
        <div className="relative overflow-hidden rounded-lg border shadow-xs">
          <div className="bg-background/90 border-border/80 absolute top-3 left-3 z-10 flex items-center gap-2 rounded-md border px-2.5 py-1.5 font-mono text-xs shadow-xs backdrop-blur-md">
            <Car className="size-3.5 text-sky-400" />
            <span className="text-foreground font-bold">
              Navigation Night HUD
            </span>
            <span className="text-muted-foreground">• Speed Limit: 35 MPH</span>
          </div>

          <Map
            accessToken={token}
            variant="navigation-night"
            center={[-122.403, 37.782]}
            zoom={14.2}
            className="min-h-[460px] w-full md:h-[520px]"
            onCreated={initDeliveryRoute}
          >
            <MapMarker longitude={-122.402} latitude={37.782} anchor="center">
              <div className="flex flex-col items-center">
                <div className="flex size-7 items-center justify-center rounded-full bg-sky-500 text-white shadow-md ring-2 ring-white">
                  <Navigation className="size-4" />
                </div>
                <span className="border-border/80 bg-card/95 mt-1 rounded border px-1.5 py-0.5 font-mono text-xs font-bold shadow-md">
                  42 mph
                </span>
              </div>
            </MapMarker>
          </Map>
        </div>
      </Story>

      {/* 6. 3D Globe Projection */}
      <Story
        title="3D globe projection"
        description="Spherical 3D globe projection with atmospheric fog, star field, transcontinental flight arcs, and an inline telemetry overlay."
      >
        <div className="relative overflow-hidden rounded-lg border shadow-xs">
          {/* Expandable Inline Overlay HUD (Top Left) */}
          <div className="bg-background/90 border-border/80 pointer-events-auto absolute top-3 left-3 z-10 w-72 rounded-lg border p-3 shadow-md backdrop-blur-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Globe2 className="size-3.5 text-sky-500" />
                <span className="text-xs font-semibold">
                  Global Air Corridors
                </span>
              </div>
              <span className="py-0.2 rounded bg-sky-500/10 px-1.5 font-mono text-xs font-semibold text-sky-600 dark:text-sky-400">
                3D Globe
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between font-mono text-xs">
              <span className="text-muted-foreground">
                Active Routes:{" "}
                <strong className="text-foreground font-semibold">
                  4 Arcs
                </strong>
              </span>
              <span className="text-muted-foreground">
                Hubs:{" "}
                <strong className="text-foreground font-semibold">
                  6 Global
                </strong>
              </span>
            </div>

            {expandGlobeInfo && (
              <div className="border-border/50 mt-3 space-y-1.5 border-t pt-2.5 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-sans">
                    Projection:
                  </span>
                  <span className="font-semibold">Spherical Earth</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-sans">
                    Atmosphere:
                  </span>
                  <span className="font-semibold text-emerald-500">
                    Active Fog Glow
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-sans">
                    Primary Hubs:
                  </span>
                  <span>SFO • NYC • LHR • HND</span>
                </div>
              </div>
            )}

            <button
              type="button"
              className="bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground mt-2.5 flex w-full items-center justify-center gap-1 rounded py-1 text-xs font-medium transition-colors"
              onClick={() => setExpandGlobeInfo(!expandGlobeInfo)}
            >
              <span>
                {expandGlobeInfo ? "Less information" : "More information"}
              </span>
              {expandGlobeInfo ? (
                <ChevronUp className="size-3" />
              ) : (
                <ChevronDown className="size-3" />
              )}
            </button>
          </div>

          <Map
            accessToken={token}
            center={[15, 25]}
            zoom={1.9}
            projection="globe"
            muted
            className="min-h-[480px] w-full md:h-[560px]"
            onCreated={initGlobeLayers}
          >
            {globeNodes.map((node) => (
              <MapMarker
                key={node.name}
                longitude={node.coords[0]}
                latitude={node.coords[1]}
                anchor="center"
              >
                <div className="group relative flex items-center justify-center">
                  <span className="absolute size-6 animate-ping rounded-full bg-sky-400/20 duration-1000" />
                  <div className="size-2.5 rounded-full bg-sky-500 shadow-xs ring-2 ring-white" />
                  <span className="border-border/80 bg-background/90 absolute bottom-full mb-1 hidden rounded border px-1.5 py-0.5 font-mono text-xs whitespace-nowrap shadow-xs group-hover:block">
                    {node.name}
                  </span>
                </div>
              </MapMarker>
            ))}
          </Map>
        </div>
      </Story>

      {/* 7. Logistics Hub Clustering */}
      <Story
        title="Logistics hub clustering"
        description="45+ regional logistics facilities clustered via Mapbox GL point aggregation. Click any cluster to expand into individual facilities."
      >
        <div className="relative overflow-hidden rounded-lg border shadow-xs">
          {/* Expandable Inline Overlay HUD (Top Left) */}
          <div className="bg-background/90 border-border/80 pointer-events-auto absolute top-3 left-3 z-10 w-72 rounded-lg border p-3 shadow-md backdrop-blur-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Boxes className="text-primary size-3.5" />
                <span className="text-xs font-semibold">
                  Facility Clustering
                </span>
              </div>
              <span className="bg-primary/10 text-primary py-0.2 rounded px-1.5 font-mono text-xs font-semibold">
                45 Hubs
              </span>
            </div>

            <p className="text-muted-foreground mt-1 text-xs">
              Click a cluster circle to expand regional depots
            </p>

            {expandClusterInfo && (
              <div className="border-border/50 mt-3 space-y-1.5 border-t pt-2.5 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-sans">
                    West Coast:
                  </span>
                  <span className="font-semibold">13 Facilities</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-sans">
                    Midwest / Central:
                  </span>
                  <span className="font-semibold">16 Facilities</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-sans">
                    East Coast:
                  </span>
                  <span className="font-semibold">16 Facilities</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-sans">
                    Cluster Radius:
                  </span>
                  <span>45px step scaling</span>
                </div>
              </div>
            )}

            <button
              type="button"
              className="bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground mt-2.5 flex w-full items-center justify-center gap-1 rounded py-1 text-xs font-medium transition-colors"
              onClick={() => setExpandClusterInfo(!expandClusterInfo)}
            >
              <span>
                {expandClusterInfo ? "Less information" : "More information"}
              </span>
              {expandClusterInfo ? (
                <ChevronUp className="size-3" />
              ) : (
                <ChevronDown className="size-3" />
              )}
            </button>
          </div>

          <Map
            accessToken={token}
            center={[-96, 38]}
            zoom={3.5}
            variant="light"
            className="min-h-[460px] w-full md:h-[520px]"
            onCreated={initClusterLayers}
          />
        </div>
      </Story>

      {/* 8. Minimal Muted Dashboard */}
      <Story
        title="Minimal muted dashboard"
        description="Theme-aware desaturated Mapbox canvas (`variant='muted'`). Roads and terrain recede to quiet greys so overlaid telemetry markers take visual priority."
      >
        <Map
          accessToken={token}
          variant="muted"
          center={[10, 20]}
          zoom={1.45}
          className="min-h-[460px] w-full rounded-lg border shadow-xs md:h-[520px]"
        >
          {worldHubs.map((hub) => (
            <MapMarker
              key={hub.name}
              longitude={hub.coords[0]}
              latitude={hub.coords[1]}
              anchor="center"
            >
              <div className="group relative flex items-center justify-center">
                <span className="absolute size-5 rounded-full bg-sky-500/25" />
                <span className="size-2.5 rounded-full bg-sky-500 shadow-xs ring-2 ring-white" />
                <span className="border-border/80 bg-background/90 absolute bottom-full mb-1 hidden rounded border px-1.5 py-0.5 font-mono text-xs whitespace-nowrap shadow-xs group-hover:block">
                  {hub.name}
                </span>
              </div>
            </MapMarker>
          ))}
        </Map>
      </Story>
    </>
  );
}
