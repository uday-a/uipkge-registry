<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Map, MapMarker, type MapVariant } from "@/components/ui/map";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-vue-next";

export interface MapBubble {
  id: string;
  name: string;
  lat: number;
  lng: number;
  value: number;
  formattedValue?: string;
  category?: string;
  status?: "optimal" | "warning" | "destructive" | "neutral" | "active";
  color?: string;
  pulse?: boolean;
  description?: string;
}

export interface BubbleMapProps {
  bubbles?: MapBubble[];
  minRadius?: number;
  maxRadius?: number;
  showLegend?: boolean;
  legendTitle?: string;
  selectedId?: string;
  interactive?: boolean;
  projection?: "globe" | "mercator";
  variant?: MapVariant;
  center?: [number, number];
  zoom?: number;
  class?: string;
}

const props = withDefaults(defineProps<BubbleMapProps>(), {
  bubbles: () => [],
  minRadius: 10,
  maxRadius: 42,
  showLegend: true,
  legendTitle: "Scale by Magnitude",
  interactive: true,
  projection: "globe",
  variant: "dark",
  center: () => [0, 20],
  zoom: 1.5,
});

const emit = defineEmits<{
  (e: "update:selectedId", id: string): void;
  (e: "select", bubble: MapBubble): void;
}>();

const activeId = ref(props.selectedId || "");
const currentProjection = ref<"globe" | "mercator">(props.projection);

watch(
  () => props.selectedId,
  (newId) => {
    if (newId !== undefined) activeId.value = newId;
  },
);

const values = computed(() => props.bubbles.map((b) => b.value));
const minValue = computed(() =>
  values.value.length ? Math.min(...values.value) : 1,
);
const maxValue = computed(() =>
  values.value.length ? Math.max(...values.value) : 100,
);

function getRadius(val: number): number {
  if (maxValue.value === minValue.value)
    return (props.minRadius + props.maxRadius) / 2;
  const ratio = Math.sqrt(
    Math.max(0, val - minValue.value) / (maxValue.value - minValue.value),
  );
  return Math.round(
    props.minRadius + ratio * (props.maxRadius - props.minRadius),
  );
}

const STATUS_COLORS: Record<string, string> = {
  optimal: "oklch(0.65 0.20 145)",
  active: "oklch(0.60 0.20 250)",
  warning: "oklch(0.75 0.18 65)",
  destructive: "oklch(0.60 0.22 25)",
  neutral: "oklch(0.65 0.05 240)",
};

function getBubbleColor(b: MapBubble): string {
  if (b.color) return b.color;
  if (b.status && STATUS_COLORS[b.status]) return STATUS_COLORS[b.status];
  return "oklch(0.60 0.20 250)";
}

const activeBubble = computed(() =>
  props.bubbles.find((b) => b.id === activeId.value),
);

function selectBubble(b: MapBubble) {
  if (!props.interactive) return;
  activeId.value = b.id;
  emit("update:selectedId", b.id);
  emit("select", b);
}

function toggleProjection() {
  currentProjection.value =
    currentProjection.value === "globe" ? "mercator" : "globe";
}
</script>

<script lang="ts">
export function projectPoint(
  lat: number,
  lng: number,
): { x: number; y: number } {
  const x = ((lng + 180) / 360) * 1000;
  const y = ((90 - lat) / 180) * 500;
  return { x, y };
}

export const CONTINENT_LANDMASSES: Array<{
  id: string;
  name: string;
  d: string;
}> = [];
</script>

<template>
  <div
    :class="
      cn(
        'border-border bg-card group relative h-[420px] w-full overflow-hidden rounded-xl border shadow-xs',
        props.class,
      )
    "
  >
    <Map
      :variant="variant"
      :projection="currentProjection"
      :center="center"
      :zoom="zoom"
      class="size-full"
    >
      <MapMarker
        v-for="b in bubbles"
        :key="b.id"
        :lng-lat="[b.lng, b.lat]"
        anchor="center"
        :class="
          cn(
            'cursor-pointer transition-transform select-none',
            activeId === b.id ? 'z-30 scale-110' : 'z-20 hover:scale-105',
          )
        "
      >
        <div
          class="relative flex items-center justify-center"
          :style="{
            width: `${getRadius(b.value) * 2}px`,
            height: `${getRadius(b.value) * 2}px`,
          }"
          @click="selectBubble(b)"
        >
          <span
            v-if="b.pulse"
            class="absolute inline-flex size-full animate-ping rounded-full opacity-40"
            :style="{ backgroundColor: getBubbleColor(b) }"
          />

          <div
            class="absolute inset-0 rounded-full opacity-25"
            :style="{ backgroundColor: getBubbleColor(b) }"
          />

          <div
            class="relative flex size-4/5 items-center justify-center rounded-full border border-white/40 shadow-sm backdrop-blur-[1px] transition-[background-color,box-shadow]"
            :style="{
              backgroundColor: getBubbleColor(b),
              boxShadow:
                activeId === b.id ? `0 0 16px ${getBubbleColor(b)}` : 'none',
            }"
          >
            <span
              v-if="getRadius(b.value) >= 20"
              class="px-1 text-center font-mono text-[10px] font-bold text-white drop-shadow-xs"
            >
              {{ b.formattedValue || b.value }}
            </span>
            <span v-else class="size-1.5 rounded-full bg-white shadow-xs" />
          </div>
        </div>
      </MapMarker>
    </Map>

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

    <div
      v-if="activeBubble"
      class="border-border/80 bg-card/95 animate-in fade-in slide-in-from-bottom-2 absolute bottom-3 left-3 z-10 max-w-sm rounded-xl border p-3.5 shadow-lg backdrop-blur-md duration-150"
    >
      <div class="flex items-start justify-between gap-3">
        <div>
          <div class="flex items-center gap-2">
            <span
              class="size-2 rounded-full ring-2 ring-white/20"
              :style="{ backgroundColor: getBubbleColor(activeBubble) }"
            />
            <span
              class="text-muted-foreground font-mono text-xs tracking-wider uppercase"
            >
              {{ activeBubble.category || "Node" }}
            </span>
          </div>
          <h4 class="text-foreground mt-0.5 text-sm font-semibold">
            {{ activeBubble.name }}
          </h4>
        </div>
        <button
          type="button"
          class="text-muted-foreground hover:text-foreground text-xs"
          @click="activeId = ''"
        >
          ✕
        </button>
      </div>

      <div
        class="border-border/60 mt-2.5 flex items-baseline justify-between border-t pt-2 font-mono text-xs"
      >
        <span class="text-muted-foreground">Magnitude</span>
        <span class="text-foreground font-semibold">
          {{
            activeBubble.formattedValue || activeBubble.value.toLocaleString()
          }}
        </span>
      </div>

      <p
        v-if="activeBubble.description"
        class="text-muted-foreground mt-1.5 text-xs leading-relaxed"
      >
        {{ activeBubble.description }}
      </p>
    </div>

    <div
      v-if="showLegend && bubbles.length > 0"
      class="border-border/70 bg-card/85 absolute right-3 bottom-3 z-10 hidden items-center gap-3 rounded-lg border px-3 py-2 text-xs shadow-xs backdrop-blur-md sm:flex"
    >
      <span class="text-muted-foreground font-mono text-[11px]">{{
        legendTitle
      }}</span>
      <div class="flex items-center gap-2">
        <span class="bg-muted-foreground/40 size-2 rounded-full" />
        <span class="text-muted-foreground font-mono text-[10px]">{{
          minValue.toLocaleString()
        }}</span>
        <span class="bg-muted-foreground/60 size-4 rounded-full" />
        <span class="text-foreground font-mono text-[10px] font-semibold">{{
          maxValue.toLocaleString()
        }}</span>
      </div>
    </div>
  </div>
</template>
