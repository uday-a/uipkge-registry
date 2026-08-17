<script setup lang="ts">
import { ref } from "vue";
import {
  Sun,
  Moon,
  Copy,
  Check,
  RotateCcw,
  Maximize2,
  Monitor,
  Laptop,
  Tablet,
  Smartphone,
  Grid,
  CircleDot,
  Square,
  Sparkles,
  Sliders,
  Palette,
  Layers,
} from "lucide-vue-next";
import {
  COLOR_THEMES,
  RADIUS_PRESETS,
  VIEWPORT_PRESETS,
  type CanvasBackground,
} from "../theme";

const props = defineProps<{
  componentId: string;
  componentName: string;
  componentType: string;
  categories: string[];
  isDark: boolean;
  activeColorTheme: string;
  activeRadius: string;
  activeViewport: string;
  canvasBg: CanvasBackground;
  isInspectorOpen: boolean;
}>();

const emit = defineEmits<{
  (e: "toggleTheme"): void;
  (e: "update:activeColorTheme", theme: string): void;
  (e: "update:activeRadius", radius: string): void;
  (e: "update:activeViewport", viewport: string): void;
  (e: "update:canvasBg", bg: CanvasBackground): void;
  (e: "update:isInspectorOpen", open: boolean): void;
  (e: "remount"): void;
}>();

const copied = ref(false);
const showThemeMenu = ref(false);

const copyCommand = async () => {
  try {
    await navigator.clipboard.writeText(
      `npx shadcn-vue add @uipkge/${props.componentId}`,
    );
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 1500);
  } catch (err) {
    console.error("Failed to copy install command:", err);
  }
};
</script>

<template>
  <header
    class="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4 z-20"
  >
    <!-- Left Section: Monogram & Component Info -->
    <div class="flex items-center gap-3">
      <!-- UIPKGE brand & framework switch -->
      <div class="flex items-center gap-2">
        <a
          href="/"
          class="flex size-7 items-center justify-center rounded-lg bg-foreground text-background font-mono text-xs font-bold shadow-xs hover:opacity-90 transition"
          title="UIPKGE Dev Workbench"
        >
          UI
        </a>
        <div class="flex items-center gap-1.5">
          <span
            class="rounded bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-600 dark:text-emerald-400"
          >
            Vue 3.5
          </span>
          <a
            href="http://localhost:5174"
            target="_blank"
            class="hidden sm:inline-flex items-center rounded border border-border bg-muted/40 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground hover:text-foreground hover:bg-muted transition"
            title="Open React 19 Playground on :5174"
          >
            React 19 ↗
          </a>
        </div>
      </div>

      <div class="h-4 w-px bg-border" />

      <!-- Breadcrumbs & metadata -->
      <div class="flex items-center gap-2">
        <h2
          class="text-xs sm:text-sm font-semibold tracking-tight text-foreground truncate max-w-[180px] sm:max-w-xs"
        >
          {{ componentName }}
        </h2>
        <span
          class="rounded px-1.5 py-0.2 font-mono text-[10px] uppercase font-bold tracking-wider"
          :class="
            componentType === 'registry:block'
              ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
              : 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20'
          "
        >
          {{ componentType === "registry:block" ? "block" : "ui" }}
        </span>
        <span
          v-if="categories && categories[0]"
          class="hidden md:inline-block rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
        >
          {{ categories[0] }}
        </span>
      </div>

      <!-- Quick copy install command -->
      <button
        type="button"
        class="hidden lg:flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-muted transition shadow-xs"
        @click="copyCommand"
        title="Copy install command"
      >
        <Check v-if="copied" class="size-3 text-emerald-500" />
        <Copy v-else class="size-3" />
        <span>npx shadcn-vue add @uipkge/{{ componentId }}</span>
      </button>
    </div>

    <!-- Center Section: Viewport Switcher Toolbar -->
    <div
      class="hidden md:flex items-center rounded-lg border border-border bg-muted/40 p-0.5 shadow-xs"
    >
      <button
        type="button"
        class="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition"
        :class="
          activeViewport === 'fluid'
            ? 'bg-background text-foreground shadow-xs'
            : 'text-muted-foreground hover:text-foreground'
        "
        @click="emit('update:activeViewport', 'fluid')"
        title="Fluid 100%"
      >
        <Maximize2 class="size-3.5" />
        <span>Full</span>
      </button>

      <button
        type="button"
        class="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition"
        :class="
          activeViewport === 'desktop'
            ? 'bg-background text-foreground shadow-xs'
            : 'text-muted-foreground hover:text-foreground'
        "
        @click="emit('update:activeViewport', 'desktop')"
        title="Desktop (1280px)"
      >
        <Monitor class="size-3.5" />
        <span>1280</span>
      </button>

      <button
        type="button"
        class="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition"
        :class="
          activeViewport === 'laptop'
            ? 'bg-background text-foreground shadow-xs'
            : 'text-muted-foreground hover:text-foreground'
        "
        @click="emit('update:activeViewport', 'laptop')"
        title="Laptop (1024px)"
      >
        <Laptop class="size-3.5" />
        <span>1024</span>
      </button>

      <button
        type="button"
        class="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition"
        :class="
          activeViewport === 'tablet'
            ? 'bg-background text-foreground shadow-xs'
            : 'text-muted-foreground hover:text-foreground'
        "
        @click="emit('update:activeViewport', 'tablet')"
        title="Tablet (768px)"
      >
        <Tablet class="size-3.5" />
        <span>768</span>
      </button>

      <button
        type="button"
        class="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition"
        :class="
          activeViewport === 'mobile'
            ? 'bg-background text-foreground shadow-xs'
            : 'text-muted-foreground hover:text-foreground'
        "
        @click="emit('update:activeViewport', 'mobile')"
        title="Mobile (375px)"
      >
        <Smartphone class="size-3.5" />
        <span>375</span>
      </button>
    </div>

    <!-- Right Section: Canvas Controls & Theme -->
    <div class="flex items-center gap-1.5 sm:gap-2">
      <!-- Canvas Background Selector -->
      <div
        class="hidden sm:flex items-center rounded-lg border border-border bg-muted/40 p-0.5 shadow-xs"
      >
        <button
          type="button"
          class="flex size-7 items-center justify-center rounded-md transition"
          :class="
            canvasBg === 'dots'
              ? 'bg-background text-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          "
          @click="emit('update:canvasBg', 'dots')"
          title="Dot pattern canvas"
        >
          <CircleDot class="size-3.5" />
        </button>
        <button
          type="button"
          class="flex size-7 items-center justify-center rounded-md transition"
          :class="
            canvasBg === 'grid'
              ? 'bg-background text-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          "
          @click="emit('update:canvasBg', 'grid')"
          title="Grid pattern canvas"
        >
          <Grid class="size-3.5" />
        </button>
        <button
          type="button"
          class="flex size-7 items-center justify-center rounded-md transition"
          :class="
            canvasBg === 'solid'
              ? 'bg-background text-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          "
          @click="emit('update:canvasBg', 'solid')"
          title="Solid clean canvas"
        >
          <Square class="size-3.5" />
        </button>
      </div>

      <!-- Remount Canvas Button -->
      <button
        type="button"
        class="flex size-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition shadow-xs"
        @click="emit('remount')"
        title="Reset & remount component"
      >
        <RotateCcw class="size-3.5" />
      </button>

      <!-- Theme Customizer Popover Toggle -->
      <div class="relative">
        <button
          type="button"
          class="flex size-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition shadow-xs"
          @click="showThemeMenu = !showThemeMenu"
          title="Customize Theme & Radius"
        >
          <Palette class="size-3.5" />
        </button>

        <!-- Dropdown Popover -->
        <div
          v-if="showThemeMenu"
          class="absolute right-0 top-10 w-64 rounded-xl border border-border bg-card p-4 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <div
            class="flex items-center justify-between pb-2 border-b border-border"
          >
            <span class="text-xs font-semibold text-foreground"
              >Theme Customizer</span
            >
            <span class="text-[10px] font-mono text-muted-foreground"
              >OKLCH</span
            >
          </div>

          <!-- Color Presets -->
          <div class="py-3">
            <div class="text-[11px] font-medium text-muted-foreground mb-2">
              Accent Color
            </div>
            <div class="grid grid-cols-5 gap-1.5">
              <button
                v-for="color in COLOR_THEMES"
                :key="color.id"
                type="button"
                class="flex flex-col items-center gap-1 rounded-md p-1.5 border transition"
                :class="
                  activeColorTheme === color.id
                    ? 'border-foreground bg-muted shadow-xs'
                    : 'border-transparent hover:bg-muted/50'
                "
                @click="emit('update:activeColorTheme', color.id)"
                :title="color.name"
              >
                <span
                  class="size-4 rounded-full border border-black/10"
                  :style="{ backgroundColor: color.swatch }"
                />
                <span class="text-[9px] font-medium text-muted-foreground">{{
                  color.name
                }}</span>
              </button>
            </div>
          </div>

          <!-- Radius Presets -->
          <div class="pt-2 border-t border-border">
            <div class="text-[11px] font-medium text-muted-foreground mb-2">
              Border Radius
            </div>
            <div class="grid grid-cols-3 gap-1">
              <button
                v-for="rad in RADIUS_PRESETS"
                :key="rad.id"
                type="button"
                class="rounded px-2 py-1 text-[10px] font-medium border text-center transition"
                :class="
                  activeRadius === rad.value
                    ? 'border-foreground bg-foreground text-background shadow-xs font-semibold'
                    : 'border-border text-muted-foreground hover:bg-muted'
                "
                @click="emit('update:activeRadius', rad.value)"
              >
                {{ rad.id }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Dark / Light Mode Toggle -->
      <button
        type="button"
        class="flex size-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition shadow-xs"
        @click="emit('toggleTheme')"
        :title="isDark ? 'Switch to Light' : 'Switch to Dark'"
      >
        <Sun v-if="isDark" class="size-4" />
        <Moon v-else class="size-4" />
      </button>

      <div class="h-4 w-px bg-border" />

      <!-- Inspector Toggle Button -->
      <button
        type="button"
        class="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition shadow-xs border"
        :class="
          isInspectorOpen
            ? 'bg-primary text-primary-foreground border-primary'
            : 'bg-background text-muted-foreground border-border hover:text-foreground hover:bg-muted'
        "
        @click="emit('update:isInspectorOpen', !isInspectorOpen)"
        title="Toggle Test Bench & Inspector"
      >
        <Sliders class="size-3.5" />
        <span class="hidden sm:inline">Test Bench</span>
      </button>
    </div>
  </header>
</template>
