<script setup lang="ts">
/**
 * LeafletMap — a thin, theme-aware Leaflet wrapper that renders free raster
 * tiles (OpenStreetMap, OpenTopoMap, Esri). No API key required.
 *
 * Drop `<LeafletMarker>` / `<LeafletPopup>` / `<LeafletPolyline>` /
 * `<LeafletPolygon>` / `<LeafletCircle>` / `<LeafletCircleMarker>` /
 * `<LeafletGeoJson>` / `<LeafletTileLayer>` into the default slot to build any
 * map — the same composition model as the Mapbox `map` component.
 *
 * Basemap `variant` presets (all key-free tile providers):
 * - `default`: theme-aware Esri light/dark canvas
 * - `streets` / `standard`: OpenStreetMap Standard
 * - `light` / `dark`: Esri Light/Dark Gray Canvas
 * - `muted`: theme-aware Esri canvas + desaturated tile pane
 * - `outdoors`: OpenTopoMap topographic contours
 * - `satellite`: Esri World Imagery
 * - `satellite-streets`: Esri imagery + Esri reference labels overlay
 * - `navigation-day`: Esri World Street Map
 * - `navigation-night`: Esri Dark Gray Canvas
 *
 * Not supported (Leaflet has no vector/GL renderer — these Mapbox props have
 * no counterpart): pitch, bearing, 3D buildings/terrain, globe projection.
 * Use a `variant` preset or `tile-url` for custom raster tiles instead.
 */
import {
  computed,
  onMounted,
  onUnmounted,
  provide,
  ref,
  shallowRef,
  watch,
} from "vue";
import type * as L from "leaflet";
import { cn } from "@/lib/utils";
import {
  defined,
  fixDefaultLeafletIcon,
  loadLeaflet,
  toLatLng,
  toLatLngBounds,
  LEAFLET_MAP_KEY,
  type LeafletPosition,
} from "./leaflet-context";
import {
  leafletMapVariants,
  LEAFLET_TILES,
  LEAFLET_THEME_TILES,
  type LeafletMapVariant,
  type LeafletMapVariants,
  type LeafletTilePreset,
} from "./leaflet-map.variants";
import "leaflet/dist/leaflet.css";
import "./leaflet-map.css";

const props = withDefaults(
  defineProps<{
    /** Named raster basemap preset ('streets' | 'outdoors' | 'satellite' | 'satellite-streets' | 'light' | 'dark' | 'navigation-day' | 'navigation-night' | 'standard' | 'muted' | 'default'). */
    variant?: LeafletMapVariant;
    /** Height preset. Omit to size via `class` (blocks typically pass `size-full`). */
    size?: LeafletMapVariants["size"];
    /** Custom raster tile URL template — overrides `variant`. */
    tileUrl?: string;
    /** Attribution HTML for a custom `tile-url`. Defaults to the OpenStreetMap credit. */
    tileAttribution?: string;
    /** Tile subdomains for a custom `tile-url` ('abcd' or ['a','b']). */
    tileSubdomains?: string | string[];
    /** Initial [lng, lat] — Mapbox order, matching the `map` component. */
    center?: [number, number];
    zoom?: number;
    minZoom?: number;
    /** Caps the map's max zoom. Defaults to the tile provider's own maxZoom. */
    maxZoom?: number;
    /** Show the zoom control. */
    navigation?: boolean;
    /** Placement of the zoom control ('top-left' | 'top-right' | 'bottom-left' | 'bottom-right'). */
    navigationPosition?: LeafletPosition;
    /** Show the HTML5 fullscreen toggle button. */
    fullscreen?: boolean;
    /** Placement of the fullscreen button. Defaults to 'top-right'. */
    fullscreenPosition?: LeafletPosition;
    /** Show tile credits behind a ⓘ button (reveals on hover/tap). Keep on — OSM/Esri tiles require attribution. */
    attribution?: boolean;
    /** Wheel zoom. Set false for maps embedded in scrollable pages. */
    scrollWheelZoom?: boolean;
    /** Desaturate the tile pane to a quiet canvas (markers stay coloured). */
    muted?: boolean;
    class?: string;
  }>(),
  {
    variant: "default",
    tileUrl: undefined,
    tileAttribution: undefined,
    tileSubdomains: undefined,
    center: () => [0, 20],
    zoom: 2,
    minZoom: undefined,
    maxZoom: undefined,
    navigation: true,
    navigationPosition: "bottom-right",
    fullscreen: false,
    fullscreenPosition: "top-right",
    attribution: true,
    scrollWheelZoom: true,
    muted: false,
  },
);

const emit = defineEmits<{ (e: "created", map: L.Map): void }>();

const htmlDark = ref(false);
const isMuted = computed(() => props.muted || props.variant === "muted");

const resolvedTiles = computed<LeafletTilePreset>(() => {
  if (props.tileUrl) {
    return {
      url: props.tileUrl,
      attribution:
        props.tileAttribution ??
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      subdomains: props.tileSubdomains,
      maxZoom: props.maxZoom,
    };
  }
  if (
    props.variant &&
    props.variant !== "default" &&
    props.variant !== "muted" &&
    LEAFLET_TILES[props.variant as keyof typeof LEAFLET_TILES]
  ) {
    return LEAFLET_TILES[props.variant as keyof typeof LEAFLET_TILES];
  }
  return htmlDark.value ? LEAFLET_THEME_TILES.dark : LEAFLET_THEME_TILES.light;
});

// Client-only: Leaflet needs the DOM, so SSR renders just the bg-muted shell.
const mounted = ref(false);
const inView = ref(false);
const containerRef = ref<HTMLDivElement | null>(null);
const mapEl = ref<HTMLDivElement | null>(null);
const map = shallowRef<L.Map | null>(null);
let Lmod: typeof import("leaflet") | null = null;
let baseLayer: L.TileLayer | null = null;
let overlayLayer: L.TileLayer | null = null;
let resizeObserver: ResizeObserver | null = null;
let intersectionObserver: IntersectionObserver | null = null;
let themeObserver: MutationObserver | null = null;
let onFullscreenChange: (() => void) | null = null;

// Published to LeafletMarker / LeafletPopup / … children.
provide(LEAFLET_MAP_KEY, map);

function applyTiles(tiles: LeafletTilePreset) {
  const m = map.value;
  const L = Lmod;
  if (!m || !L) return;
  baseLayer?.remove();
  baseLayer = null;
  overlayLayer?.remove();
  overlayLayer = null;
  baseLayer = L.tileLayer(tiles.url, {
    attribution: tiles.attribution,
    ...(tiles.subdomains ? { subdomains: tiles.subdomains } : {}),
    maxZoom: tiles.maxZoom ?? 19,
  });
  baseLayer.addTo(m);
  if (tiles.overlayUrl) {
    overlayLayer = L.tileLayer(tiles.overlayUrl, {
      maxZoom: tiles.maxZoom ?? 19,
    });
    overlayLayer.addTo(m);
  }
}

// Collect attribution strings from every layer (base tiles, overlays, custom
// LeafletTileLayers) — deduped, rendered by the ⓘ popover.
const attributions = ref<string[]>([]);
const showAttribution = ref(false);
function collectAttributions() {
  const m = map.value;
  if (!m) return;
  const seen = new Set<string>();
  m.eachLayer((layer) => {
    const a = (layer as L.TileLayer).options?.attribution;
    if (typeof a === "string" && a) seen.add(a);
  });
  attributions.value = [...seen];
}

function createMap() {
  const el = mapEl.value;
  const L = Lmod;
  if (!el || !L || map.value) return;
  fixDefaultLeafletIcon(L);
  const tiles = resolvedTiles.value;
  const m = L.map(
    el,
    defined({
      center: toLatLng(props.center ?? [0, 20]),
      zoom: props.zoom,
      minZoom: props.minZoom,
      maxZoom: props.maxZoom ?? tiles.maxZoom,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: props.scrollWheelZoom,
    }),
  );
  map.value = m;
  applyTiles(tiles);
  m.on("zoomend", syncZoomBounds);
  syncZoomBounds();
  m.on("layeradd layerremove", collectAttributions);
  collectAttributions();
  emit("created", m);
}

onMounted(() => {
  const root = document.documentElement;
  const syncTheme = () => {
    htmlDark.value = root.classList.contains("dark");
  };
  syncTheme();
  themeObserver = new MutationObserver(syncTheme);
  themeObserver.observe(root, { attributes: true, attributeFilter: ["class"] });
  mounted.value = true;

  const el = containerRef.value;
  if (!el || typeof IntersectionObserver === "undefined") {
    inView.value = true;
  } else {
    intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        inView.value = entry.isIntersecting;
      },
      { rootMargin: "160px", threshold: 0.01 },
    );
    intersectionObserver.observe(el);
  }
  if (typeof ResizeObserver !== "undefined" && el) {
    resizeObserver = new ResizeObserver(() => {
      map.value?.invalidateSize();
    });
    resizeObserver.observe(el);
  }

  onFullscreenChange = () => {
    isFullscreen.value = Boolean(document.fullscreenElement);
  };
  document.addEventListener("fullscreenchange", onFullscreenChange);
});

onUnmounted(() => {
  resizeObserver?.disconnect();
  intersectionObserver?.disconnect();
  themeObserver?.disconnect();
  if (onFullscreenChange)
    document.removeEventListener("fullscreenchange", onFullscreenChange);
  map.value?.remove();
  map.value = null;
});

// Leaflet module loads lazily once the container is both mounted and in view.
watch([mounted, inView], async ([isMounted, visible]) => {
  if (!isMounted || !visible || map.value) return;
  Lmod = await loadLeaflet();
  createMap();
});

// Retile on variant / theme / custom-tile changes.
watch(resolvedTiles, (tiles) => {
  if (map.value) applyTiles(tiles);
});

watch(
  () => [props.center, props.zoom],
  () => {
    const m = map.value;
    if (!m || !props.center) return;
    m.setView(toLatLng(props.center), props.zoom);
  },
);

watch(
  () => props.attribution,
  () => {
    if (!props.attribution) showAttribution.value = false;
  },
);

watch(
  () => props.scrollWheelZoom,
  (enabled) => {
    if (!map.value) return;
    if (enabled) map.value.scrollWheelZoom.enable();
    else map.value.scrollWheelZoom.disable();
  },
);

const isFullscreen = ref(false);
function toggleFullscreen() {
  const el = containerRef.value;
  if (!el) return;
  if (document.fullscreenElement) document.exitFullscreen();
  else el.requestFullscreen?.();
}

// Zoom/fullscreen chrome is plain HTML overlaid on the map (like Mapbox's
// controls) — a corner stack per occupied corner, zoom group above fullscreen.
const cornerOrder: LeafletPosition[] = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
];
const cornerClasses = computed<Record<LeafletPosition, string>>(() => ({
  "top-left": "left-3 top-3",
  "top-right": "right-3 top-3",
  // above the ⓘ button (bottom-left) when credits are shown
  "bottom-left":
    props.attribution && attributions.value.length
      ? "bottom-9 left-3"
      : "bottom-3 left-3",
  "bottom-right": "bottom-3 right-3",
}));
const navPosition = computed(() => props.navigationPosition ?? "bottom-right");
const fsPosition = computed(() => props.fullscreenPosition ?? "top-right");

const canZoomIn = ref(true);
const canZoomOut = ref(true);
function syncZoomBounds() {
  const m = map.value;
  if (!m) return;
  canZoomIn.value = m.getZoom() < m.getMaxZoom();
  canZoomOut.value = m.getZoom() > m.getMinZoom();
}

/** Mapbox-style camera shim — accepts { center: [lng, lat], zoom, duration(ms) }. */
function flyTo(
  options: { center?: [number, number]; zoom?: number; duration?: number } = {},
) {
  const m = map.value;
  if (!m) return;
  const target = options.center ? toLatLng(options.center) : m.getCenter();
  m.flyTo(target, options.zoom ?? m.getZoom(), {
    duration: (options.duration ?? 800) / 1000,
  });
}

function setView(options: { center?: [number, number]; zoom?: number } = {}) {
  const m = map.value;
  if (!m) return;
  m.setView(
    options.center ? toLatLng(options.center) : m.getCenter(),
    options.zoom ?? m.getZoom(),
  );
}

function jumpTo(options: { center?: [number, number]; zoom?: number } = {}) {
  const m = map.value;
  if (!m) return;
  m.setView(
    options.center ? toLatLng(options.center) : m.getCenter(),
    options.zoom ?? m.getZoom(),
    {
      animate: false,
    },
  );
}

// <script setup> components are closed by default, so a template ref on
// <LeafletMap> hands back this object. It mirrors the `map` component's MapRef
// surface: camera helpers plus `map` / `getMap()` for the raw L.Map.
defineExpose({
  /** The underlying Leaflet Map, or null until it is created. */
  get map() {
    return map.value;
  },
  getMap: () => map.value,
  flyTo,
  setView,
  jumpTo,
  /** [[west,south],[east,north]] in [lng, lat], or any Leaflet bounds expression. */
  fitBounds: (
    bounds: [[number, number], [number, number]] | L.LatLngBoundsExpression,
    options?: L.FitBoundsOptions,
  ) =>
    map.value?.fitBounds(
      toLatLngBounds(bounds as [[number, number], [number, number]]),
      options,
    ),
  panTo: (center: [number, number]) => map.value?.panTo(toLatLng(center)),
  zoomIn: () => map.value?.zoomIn(),
  zoomOut: () => map.value?.zoomOut(),
  resize: () => map.value?.invalidateSize(),
});
</script>

<template>
  <div
    ref="containerRef"
    data-uipkge
    data-slot="leaflet-map"
    :data-variant="variant"
    :data-muted="isMuted"
    :class="
      cn(
        leafletMapVariants({ variant, ...(size ? { size } : {}) }),
        props.class,
      )
    "
  >
    <div v-show="inView" ref="mapEl" class="size-full" />
    <template v-for="corner in cornerOrder" :key="corner">
      <div
        v-if="
          map &&
          ((navigation && navPosition === corner) ||
            (fullscreen && fsPosition === corner))
        "
        class="absolute z-[1000] flex flex-col gap-2.5"
        :class="cornerClasses[corner]"
      >
        <div
          v-if="navigation && navPosition === corner"
          class="border-border bg-card divide-border flex flex-col divide-y overflow-hidden rounded-lg border shadow-sm"
        >
          <button
            type="button"
            class="text-muted-foreground hover:bg-muted flex size-8 items-center justify-center transition-colors disabled:pointer-events-none disabled:opacity-40"
            aria-label="Zoom in"
            :disabled="!canZoomIn"
            @click="map?.zoomIn()"
          >
            <svg
              class="size-full"
              viewBox="0 0 29 29"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M14.5 8.5c-.75 0-1.5.75-1.5 1.5v3h-3c-.75 0-1.5.75-1.5 1.5S9.25 16 10 16h3v3c0 .75.75 1.5 1.5 1.5S16 19.75 16 19v-3h3c.75 0 1.5-.75 1.5-1.5S19.75 13 19 13h-3v-3c0-.75-.75-1.5-1.5-1.5z"
              />
            </svg>
          </button>
          <button
            type="button"
            class="text-muted-foreground hover:bg-muted flex size-8 items-center justify-center transition-colors disabled:pointer-events-none disabled:opacity-40"
            aria-label="Zoom out"
            :disabled="!canZoomOut"
            @click="map?.zoomOut()"
          >
            <svg
              class="size-full"
              viewBox="0 0 29 29"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M10 13c-.75 0-1.5.75-1.5 1.5S9.25 16 10 16h9c.75 0 1.5-.75 1.5-1.5S19.75 13 19 13h-9z"
              />
            </svg>
          </button>
        </div>
        <button
          v-if="fullscreen && fsPosition === corner"
          type="button"
          class="border-border bg-card text-muted-foreground hover:bg-muted flex size-8 items-center justify-center rounded-lg border shadow-sm transition-colors"
          aria-label="Toggle fullscreen"
          @click="toggleFullscreen"
        >
          <svg
            class="size-full"
            viewBox="0 0 29 29"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              v-if="isFullscreen"
              d="M18.5 16c-1.75 0-2.5.75-2.5 2.5V24h1l1.5-3 5.5 4 1-1-4-5.5 3-1.5v-1h-5.5zM13 18.5c0-1.75-.75-2.5-2.5-2.5H5v1l3 1.5L4 24l1 1 5.5-4 1.5 3h1v-5.5zm3-8c0 1.75.75 2.5 2.5 2.5H24v-1l-3-1.5L25 5l-1-1-5.5 4L17 5h-1v5.5zM10.5 13c1.75 0 2.5-.75 2.5-2.5V5h-1l-1.5 3L5 4 4 5l4 5.5L5 12v1h5.5z"
            />
            <path
              v-else
              d="M24 16v5.5c0 1.75-.75 2.5-2.5 2.5H16v-1l3-1.5-4-5.5 1-1 5.5 4 1.5-3h1zM6 16l1.5 3 5.5-4 1 1-4 5.5 3 1.5v1H7.5C5.75 24 5 23.25 5 21.5V16h1zm7-11v1l-3 1.5 4 5.5-1 1-5.5-4L6 13H5V7.5C5 5.75 5.75 5 7.5 5H13zm11 2.5c0-1.75-.75-2.5-2.5-2.5H16v1l3 1.5-4 5.5 1 1 5.5-4 1.5 3h1V7.5z"
            />
          </svg>
        </button>
      </div>
    </template>
    <!-- Tile credits behind a Mapbox-style ⓘ button: hover reveals on desktop,
         tap toggles on touch. Keep visible — OSM/Esri tiles require credit. -->
    <div
      v-if="map && attribution && attributions.length"
      class="group absolute bottom-3 left-3 z-[1000] flex flex-col items-start gap-1.5"
    >
      <div
        class="border-border bg-popover text-popover-foreground max-w-64 rounded-md border px-2.5 py-1.5 text-[11px] leading-relaxed shadow-md transition-opacity [&_a]:underline"
        :class="
          showAttribution
            ? 'visible opacity-100'
            : 'invisible opacity-0 group-hover:visible group-hover:opacity-100'
        "
        role="note"
        v-html="attributions.join(' | ')"
      />
      <button
        type="button"
        class="border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground flex size-4 items-center justify-center rounded-full border shadow-xs transition-colors"
        aria-label="Map data attribution"
        :aria-expanded="showAttribution"
        @click="showAttribution = !showAttribution"
      >
        <svg
          class="size-3"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
      </button>
    </div>
    <slot />
  </div>
</template>
