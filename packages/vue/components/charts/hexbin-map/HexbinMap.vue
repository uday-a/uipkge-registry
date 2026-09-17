<script lang="ts">
import type { HTMLAttributes } from "vue";

export interface HexState {
  id: string;
  name: string;
  col: number;
  row: number;
}

export interface HexbinDatum {
  value: number;
  status?: "leader" | "active" | "growing" | "developing" | "neutral";
  description?: string;
  color?: string;
}

export interface HexbinMapProps {
  shape?: "hexagon" | "square";
  preset?: "us-states" | "world-regions";
  items?: HexState[];
  data?: Record<string, HexbinDatum>;
  selected?: string;
  showLabels?: boolean;
  showValues?: boolean;
  valueFormatter?: (value: number) => string;
  colorRamp?: string[];
  emptyColor?: string;
  height?: number | string;
  interactive?: boolean;
  class?: HTMLAttributes["class"];
  ariaLabel?: string;
}

export const US_HEX_STATES: HexState[] = [
  { id: "AK", name: "Alaska", col: 0, row: 0 },
  { id: "ME", name: "Maine", col: 11, row: 0 },
  { id: "WA", name: "Washington", col: 1, row: 1 },
  { id: "ID", name: "Idaho", col: 2, row: 1 },
  { id: "MT", name: "Montana", col: 3, row: 1 },
  { id: "ND", name: "North Dakota", col: 4, row: 1 },
  { id: "MN", name: "Minnesota", col: 5, row: 1 },
  { id: "IL", name: "Illinois", col: 6, row: 1 },
  { id: "WI", name: "Wisconsin", col: 7, row: 1 },
  { id: "MI", name: "Michigan", col: 8, row: 1 },
  { id: "NY", name: "New York", col: 9, row: 1 },
  { id: "VT", name: "Vermont", col: 10, row: 1 },
  { id: "NH", name: "New Hampshire", col: 11, row: 1 },
  { id: "OR", name: "Oregon", col: 1, row: 2 },
  { id: "NV", name: "Nevada", col: 2, row: 2 },
  { id: "WY", name: "Wyoming", col: 3, row: 2 },
  { id: "SD", name: "South Dakota", col: 4, row: 2 },
  { id: "IA", name: "Iowa", col: 5, row: 2 },
  { id: "IN", name: "Indiana", col: 6, row: 2 },
  { id: "OH", name: "Ohio", col: 7, row: 2 },
  { id: "PA", name: "Pennsylvania", col: 8, row: 2 },
  { id: "NJ", name: "New Jersey", col: 9, row: 2 },
  { id: "MA", name: "Massachusetts", col: 10, row: 2 },
  { id: "RI", name: "Rhode Island", col: 11, row: 2 },
  { id: "CA", name: "California", col: 1, row: 3 },
  { id: "UT", name: "Utah", col: 2, row: 3 },
  { id: "CO", name: "Colorado", col: 3, row: 3 },
  { id: "NE", name: "Nebraska", col: 4, row: 3 },
  { id: "MO", name: "Missouri", col: 5, row: 3 },
  { id: "KY", name: "Kentucky", col: 6, row: 3 },
  { id: "WV", name: "West Virginia", col: 7, row: 3 },
  { id: "VA", name: "Virginia", col: 8, row: 3 },
  { id: "MD", name: "Maryland", col: 9, row: 3 },
  { id: "DE", name: "Delaware", col: 10, row: 3 },
  { id: "AZ", name: "Arizona", col: 2, row: 4 },
  { id: "NM", name: "New Mexico", col: 3, row: 4 },
  { id: "KS", name: "Kansas", col: 4, row: 4 },
  { id: "AR", name: "Arkansas", col: 5, row: 4 },
  { id: "TN", name: "Tennessee", col: 6, row: 4 },
  { id: "NC", name: "North Carolina", col: 7, row: 4 },
  { id: "SC", name: "South Carolina", col: 8, row: 4 },
  { id: "DC", name: "District of Columbia", col: 9, row: 4 },
  { id: "CT", name: "Connecticut", col: 10, row: 4 },
  { id: "OK", name: "Oklahoma", col: 4, row: 5 },
  { id: "LA", name: "Louisiana", col: 5, row: 5 },
  { id: "MS", name: "Mississippi", col: 6, row: 5 },
  { id: "AL", name: "Alabama", col: 7, row: 5 },
  { id: "GA", name: "Georgia", col: 8, row: 5 },
  { id: "HI", name: "Hawaii", col: 0, row: 6 },
  { id: "TX", name: "Texas", col: 4, row: 6 },
  { id: "FL", name: "Florida", col: 8, row: 6 },
];

export const WORLD_HEX_REGIONS: HexState[] = [
  { id: "CA", name: "Canada", col: 2, row: 0 },
  { id: "GL", name: "Greenland", col: 4, row: 0 },
  { id: "NO", name: "Nordics", col: 6, row: 0 },
  { id: "US-W", name: "US West", col: 1, row: 1 },
  { id: "US-E", name: "US East", col: 2, row: 1 },
  { id: "UK", name: "United Kingdom", col: 5, row: 1 },
  { id: "EU-W", name: "Western Europe", col: 6, row: 1 },
  { id: "EU-E", name: "Eastern Europe", col: 7, row: 1 },
  { id: "RU", name: "Northern Eurasia", col: 8, row: 1 },
  { id: "MX", name: "Mexico", col: 1, row: 2 },
  { id: "MED", name: "Mediterranean", col: 6, row: 2 },
  { id: "ME", name: "Middle East", col: 7, row: 2 },
  { id: "CN", name: "East Asia", col: 8, row: 2 },
  { id: "JP", name: "Japan", col: 9, row: 2 },
  { id: "BR", name: "Brazil", col: 2, row: 3 },
  { id: "AF-N", name: "North Africa", col: 5, row: 3 },
  { id: "IN", name: "South Asia", col: 7, row: 3 },
  { id: "SEA", name: "Southeast Asia", col: 8, row: 3 },
  { id: "AR", name: "South Cone", col: 2, row: 4 },
  { id: "AF-S", name: "Sub-Saharan", col: 5, row: 4 },
  { id: "AU", name: "Australia & Oceania", col: 8, row: 4 },
];

// Geographic coordinates mapping for placing Hexbins in space
const US_CENTROIDS: Record<string, [number, number]> = {
  AK: [-152.4, 64.2],
  ME: [-69.4, 45.3],
  WA: [-120.7, 47.7],
  ID: [-114.7, 44.1],
  MT: [-110.4, 46.9],
  ND: [-100.5, 47.5],
  MN: [-94.6, 46.7],
  IL: [-89.4, 40.6],
  WI: [-89.6, 43.8],
  MI: [-85.6, 44.3],
  NY: [-74.2, 43.3],
  VT: [-72.6, 44.6],
  NH: [-71.6, 43.2],
  OR: [-120.5, 43.8],
  NV: [-116.4, 38.8],
  WY: [-107.3, 43.1],
  SD: [-99.9, 44.3],
  IA: [-93.5, 42.0],
  IN: [-86.1, 40.3],
  OH: [-82.9, 40.4],
  PA: [-77.2, 41.2],
  NJ: [-74.4, 40.1],
  MA: [-71.4, 42.4],
  RI: [-71.5, 41.6],
  CA: [-119.4, 36.8],
  UT: [-111.1, 39.3],
  CO: [-105.8, 39.5],
  NE: [-99.9, 41.5],
  MO: [-91.8, 37.9],
  KY: [-84.3, 37.8],
  WV: [-80.4, 38.6],
  VA: [-78.7, 37.4],
  MD: [-76.6, 39.0],
  DE: [-75.5, 39.0],
  AZ: [-111.1, 34.0],
  NM: [-106.0, 34.5],
  KS: [-98.5, 38.5],
  AR: [-92.3, 34.8],
  TN: [-86.6, 35.5],
  NC: [-79.0, 35.8],
  SC: [-81.2, 33.8],
  DC: [-77.0, 38.9],
  CT: [-72.7, 41.6],
  OK: [-97.5, 35.0],
  LA: [-91.9, 30.9],
  MS: [-89.7, 32.4],
  AL: [-86.9, 32.3],
  GA: [-83.6, 32.2],
  HI: [-157.8, 21.3],
  TX: [-99.9, 31.9],
  FL: [-81.5, 27.6],
};
</script>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Map, MapMarker, type MapVariant } from "@/components/ui/map";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-vue-next";

const props = withDefaults(defineProps<HexbinMapProps>(), {
  shape: "hexagon",
  preset: "us-states",
  data: () => ({}),
  selected: undefined,
  showLabels: true,
  showValues: false,
  valueFormatter: (v: number) => v.toLocaleString(),
  colorRamp: () => [
    "oklch(0.92 0.05 162)",
    "oklch(0.82 0.10 162)",
    "oklch(0.72 0.14 162)",
    "oklch(0.62 0.17 162)",
    "oklch(0.50 0.18 162)",
    "oklch(0.38 0.16 162)",
  ],
  emptyColor: "rgba(255, 255, 255, 0.08)",
  height: 480,
  interactive: true,
  ariaLabel: "Cartogram Tile Grid Map",
});

const emit = defineEmits<{
  (e: "update:selected", id: string): void;
  (
    e: "select",
    payload: { id: string; name: string; datum?: HexbinDatum },
  ): void;
}>();

const activeSelected = ref(props.selected || "");
const currentProjection = ref<"globe" | "mercator">(
  props.preset === "world-regions" ? "globe" : "mercator",
);

watch(
  () => props.selected,
  (newVal) => {
    if (newVal !== undefined) activeSelected.value = newVal;
  },
);

const activeItems = computed(() => {
  if (props.items && props.items.length > 0) return props.items;
  return props.preset === "world-regions" ? WORLD_HEX_REGIONS : US_HEX_STATES;
});

const values = computed(() =>
  Object.values(props.data)
    .map((d) => d.value)
    .filter((v) => typeof v === "number"),
);
const minValue = computed(() =>
  values.value.length ? Math.min(...values.value) : 0,
);
const maxValue = computed(() =>
  values.value.length ? Math.max(...values.value) : 100,
);

function getColor(datum?: HexbinDatum): string {
  if (!datum) return props.emptyColor;
  if (datum.color) return datum.color;

  const val = datum.value;
  const span = maxValue.value - minValue.value;
  const normalized = span > 0 ? (val - minValue.value) / span : 0.5;
  const idx = Math.min(
    props.colorRamp.length - 1,
    Math.floor(normalized * props.colorRamp.length),
  );
  return props.colorRamp[idx];
}

const activeStateItem = computed(() =>
  activeItems.value.find((it) => it.id === activeSelected.value),
);
const activeStateDatum = computed(() =>
  activeSelected.value ? props.data[activeSelected.value] : undefined,
);

function handleSelect(item: HexState) {
  if (!props.interactive) return;
  activeSelected.value = item.id;
  emit("update:selected", item.id);
  emit("select", { id: item.id, name: item.name, datum: props.data[item.id] });
}

function getCoords(item: HexState): [number, number] {
  if (US_CENTROIDS[item.id]) return US_CENTROIDS[item.id];
  const lng = -120 + item.col * 14;
  const lat = 50 - item.row * 8;
  return [lng, lat];
}

const mapCenter = computed<[number, number]>(() => {
  return props.preset === "world-regions" ? [0, 20] : [-97, 39];
});

const mapZoom = computed(() => {
  return props.preset === "world-regions" ? 1.5 : 3.6;
});

function toggleProjection() {
  currentProjection.value =
    currentProjection.value === "globe" ? "mercator" : "globe";
}
</script>

<template>
  <div
    :class="
      cn(
        'border-border bg-card group relative w-full overflow-hidden rounded-xl border shadow-xs',
        props.class,
      )
    "
    :style="{
      height:
        typeof props.height === 'number'
          ? `${props.height}px`
          : /^\d+$/.test(String(props.height))
            ? `${props.height}px`
            : props.height,
    }"
  >
    <Map
      variant="dark"
      :projection="currentProjection"
      :center="mapCenter"
      :zoom="mapZoom"
      class="size-full"
    >
      <MapMarker
        v-for="item in activeItems"
        :key="item.id"
        :lng-lat="getCoords(item)"
        anchor="center"
        :class="
          cn(
            'cursor-pointer transition-transform select-none',
            activeSelected === item.id
              ? 'z-30 scale-115'
              : 'z-20 hover:scale-105',
          )
        "
      >
        <button
          type="button"
          class="group/hex relative flex size-10 items-center justify-center font-mono"
          @click="handleSelect(item)"
        >
          <!-- Hexagon Shape Container -->
          <div
            class="absolute inset-0 flex items-center justify-center"
            :style="{
              clipPath:
                shape === 'hexagon'
                  ? 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                  : 'none',
              backgroundColor: getColor(data[item.id]),
              border:
                activeSelected === item.id
                  ? '2px solid white'
                  : '1px solid rgba(255,255,255,0.2)',
              boxShadow:
                activeSelected === item.id
                  ? `0 0 14px ${getColor(data[item.id])}`
                  : 'none',
            }"
          />

          <!-- Label & Metric -->
          <div
            class="relative z-10 flex flex-col items-center justify-center text-center"
          >
            <span class="text-[10px] font-bold text-white drop-shadow-sm">
              {{ item.id }}
            </span>
            <span
              v-if="showValues && data[item.id]"
              class="text-[8px] font-semibold text-white/90"
            >
              {{ Math.round(data[item.id].value) }}
            </span>
          </div>
        </button>
      </MapMarker>
    </Map>

    <!-- Top-Right Projection Switcher -->
    <div
      class="border-border/70 bg-card/85 absolute top-3 right-3 z-10 flex items-center gap-1 rounded-lg border p-1 shadow-xs backdrop-blur-md"
    >
      <button
        type="button"
        class="text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition"
        @click="toggleProjection"
      >
        <Globe class="size-3.5" />
        <span class="capitalize">{{ currentProjection }}</span>
      </button>
    </div>

    <!-- Active State Detail Card -->
    <div
      v-if="activeStateItem"
      class="border-border/80 bg-card/95 animate-in fade-in slide-in-from-bottom-2 absolute bottom-3 left-3 z-10 max-w-sm rounded-xl border p-3.5 shadow-lg backdrop-blur-md duration-150"
    >
      <div class="flex items-start justify-between gap-3">
        <div>
          <div class="flex items-center gap-2">
            <span
              class="size-2 rounded-full"
              :style="{ backgroundColor: getColor(activeStateDatum) }"
            />
            <span
              class="text-muted-foreground font-mono text-xs tracking-wider uppercase"
            >
              {{ activeStateDatum?.status || "Region" }}
            </span>
          </div>
          <h4 class="text-foreground mt-0.5 text-sm font-semibold">
            {{ activeStateItem.name }} ({{ activeStateItem.id }})
          </h4>
        </div>
        <button
          type="button"
          class="text-muted-foreground hover:text-foreground text-xs"
          @click="activeSelected = ''"
        >
          ✕
        </button>
      </div>

      <div
        v-if="activeStateDatum"
        class="border-border/60 mt-2.5 flex items-baseline justify-between border-t pt-2 font-mono text-xs"
      >
        <span class="text-muted-foreground">Adoption Metric</span>
        <span class="text-foreground font-semibold">
          {{ valueFormatter(activeStateDatum.value) }}%
        </span>
      </div>

      <p
        v-if="activeStateDatum?.description"
        class="text-muted-foreground mt-1.5 text-xs leading-relaxed"
      >
        {{ activeStateDatum.description }}
      </p>
    </div>

    <!-- Bottom-Right Color Ramp Legend -->
    <div
      v-if="values.length > 0"
      class="border-border/70 bg-card/85 absolute right-3 bottom-3 z-10 hidden items-center gap-2 rounded-lg border px-3 py-2 text-xs shadow-xs backdrop-blur-md sm:flex"
    >
      <span class="text-muted-foreground font-mono text-[10px]">{{
        minValue
      }}</span>
      <div class="flex h-2.5 gap-0.5 overflow-hidden rounded-xs">
        <div
          v-for="(c, i) in colorRamp"
          :key="i"
          class="w-3"
          :style="{ backgroundColor: c }"
        />
      </div>
      <span class="text-foreground font-mono text-[10px] font-semibold">{{
        maxValue
      }}</span>
    </div>
  </div>
</template>
