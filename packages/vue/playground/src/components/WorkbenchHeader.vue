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
  PanelLeftClose,
  PanelLeft,
  ExternalLink,
} from "lucide-vue-next";
import {
  COLOR_THEMES,
  RADIUS_PRESETS,
  VIEWPORT_PRESETS,
  type CanvasBackground,
} from "../theme";

const props = withDefaults(
  defineProps<{
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
    isSidebarOpen?: boolean;
  }>(),
  {
    isSidebarOpen: true,
  },
);

const emit = defineEmits<{
  (e: "toggleTheme"): void;
  (e: "toggle-theme"): void;
  (e: "toggleSidebar"): void;
  (e: "toggle-sidebar"): void;
  (e: "update:isSidebarOpen", open: boolean): void;
  (e: "update:is-sidebar-open", open: boolean): void;
  (e: "update:activeColorTheme", theme: string): void;
  (e: "update:active-color-theme", theme: string): void;
  (e: "update:activeRadius", radius: string): void;
  (e: "update:active-radius", radius: string): void;
  (e: "update:activeViewport", viewport: string): void;
  (e: "update:active-viewport", viewport: string): void;
  (e: "update:canvasBg", bg: CanvasBackground): void;
  (e: "update:canvas-bg", bg: CanvasBackground): void;
  (e: "update:isInspectorOpen", open: boolean): void;
  (e: "update:is-inspector-open", open: boolean): void;
  (e: "remount"): void;
}>();

const copied = ref(false);
const showThemeMenu = ref(false);

const setViewport = (vp: string) => {
  emit("update:activeViewport", vp);
  emit("update:active-viewport", vp);
};

const setCanvas = (bg: CanvasBackground) => {
  emit("update:canvasBg", bg);
  emit("update:canvas-bg", bg);
};

const setColorTheme = (theme: string) => {
  emit("update:activeColorTheme", theme);
  emit("update:active-color-theme", theme);
};

const setRadius = (rad: string) => {
  emit("update:activeRadius", rad);
  emit("update:active-radius", rad);
};

const toggleSidebarAction = () => {
  emit("toggleSidebar");
  emit("update:isSidebarOpen", !props.isSidebarOpen);
};

const toggleThemeAction = () => {
  emit("toggleTheme");
};

const toggleInspectorAction = () => {
  emit("update:isInspectorOpen", !props.isInspectorOpen);
  emit("update:is-inspector-open", !props.isInspectorOpen);
};

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
    class="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-3 sm:px-4 z-20 gap-2 sm:gap-4 select-none"
  >
    <!-- Left Section: Monogram & Component Info -->
    <div class="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
      <!-- Toggle sidebar button (only when sidebar is closed) -->
      <button
        v-if="!isSidebarOpen"
        type="button"
        class="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition shadow-2xs cursor-pointer"
        @click="toggleSidebarAction"
        title="Show sidebar (⌘B)"
      >
        <PanelLeft class="size-4 shrink-0" />
      </button>

      <!-- UIPKGE brand icon (only when sidebar is closed) -->
      <div
        v-if="!isSidebarOpen"
        class="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card shadow-xs select-none"
        title="UIPKGE Dev Workbench"
      >
        <svg width="22" height="22" viewBox="0 0 32 32" class="shrink-0" aria-hidden="true">
          <rect x="0.5" y="0.5" width="31" height="31" rx="7" class="fill-card stroke-border" stroke-width="1" />
          <rect x="6" y="6" width="8" height="8" rx="1.6" class="fill-foreground" />
          <rect x="18" y="6" width="8" height="8" rx="1.6" class="fill-primary" />
          <rect x="6" y="18" width="8" height="8" rx="1.6" class="fill-muted" />
          <rect x="18" y="18" width="8" height="8" rx="1.6" class="fill-foreground" />
        </svg>
      </div>

      <!-- Framework switch & links -->
      <div class="flex items-center gap-1.5 shrink-0">
        <div class="flex items-center gap-1 shrink-0">
          <span
            class="inline-flex items-center h-7 px-2 rounded-md border border-border bg-muted/40 font-mono text-xs font-semibold text-foreground whitespace-nowrap shrink-0 shadow-2xs"
          >
            Vue 3.5
          </span>
          <a
            :href="'http://localhost:5174?c=' + componentId"
            target="_blank"
            rel="noreferrer"
            class="hidden sm:inline-flex items-center h-7 px-2 rounded-md border border-border bg-muted/40 font-mono text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition whitespace-nowrap shrink-0"
            title="Open React 19 Playground on :5174"
          >
            <span>React 19</span>
            <ExternalLink class="size-2.5 ml-1" />
          </a>
        </div>
      </div>

      <div class="hidden sm:block h-4 w-px bg-border shrink-0" />

      <!-- Breadcrumbs & metadata -->
      <div class="flex items-center gap-1.5 min-w-0 shrink">
        <h2
          class="text-xs sm:text-sm font-semibold tracking-tight text-foreground truncate whitespace-nowrap shrink min-w-0 max-w-[140px] md:max-w-[200px]"
        >
          {{ componentName }}
        </h2>
        <span
          v-if="categories && categories[0]"
          class="hidden xl:inline-block rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground whitespace-nowrap shrink-0"
        >
          {{ categories[0] }}
        </span>
      </div>

      <!-- Quick copy install command: Full command on wide screens, compact icon on smaller -->
      <button
        type="button"
        class="hidden min-[1400px]:flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 h-8 text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-muted transition shadow-xs whitespace-nowrap shrink-0 cursor-pointer"
        @click="copyCommand"
        title="Copy install command"
      >
        <Check v-if="copied" class="size-3 text-emerald-500 shrink-0" />
        <Copy v-else class="size-3 shrink-0" />
        <span class="whitespace-nowrap max-w-[180px] truncate">add @uipkge/{{ componentId }}</span>
      </button>
      <button
        type="button"
        class="flex min-[1400px]:hidden size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition shadow-xs cursor-pointer"
        @click="copyCommand"
        :title="'Copy install command: add @uipkge/' + componentId"
      >
        <Check v-if="copied" class="size-3.5 text-emerald-500 shrink-0" />
        <Copy v-else class="size-3.5 shrink-0" />
      </button>
    </div>

    <!-- Center Section: Viewport Switcher Toolbar (Visible on lg+) -->
    <div
      class="hidden lg:flex items-center rounded-lg border border-border bg-muted/40 p-0.5 shadow-xs shrink-0"
    >
      <button
        type="button"
        class="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition whitespace-nowrap shrink-0 cursor-pointer"
        :class="
          activeViewport === 'fluid'
            ? 'bg-background text-foreground shadow-xs font-semibold border border-border/80'
            : 'text-muted-foreground hover:text-foreground border border-transparent'
        "
        @click="setViewport('fluid')"
        title="Fluid (100%)"
      >
        <Maximize2 class="size-3.5 shrink-0" />
        <span class="hidden min-[1600px]:inline">Full</span>
      </button>

      <button
        type="button"
        class="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition whitespace-nowrap shrink-0 cursor-pointer"
        :class="
          activeViewport === 'desktop'
            ? 'bg-background text-foreground shadow-xs font-semibold border border-border/80'
            : 'text-muted-foreground hover:text-foreground border border-transparent'
        "
        @click="setViewport('desktop')"
        title="Desktop (1280px)"
      >
        <Monitor class="size-3.5 shrink-0" />
        <span class="hidden min-[1600px]:inline">1280</span>
      </button>

      <button
        type="button"
        class="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition whitespace-nowrap shrink-0 cursor-pointer"
        :class="
          activeViewport === 'laptop'
            ? 'bg-background text-foreground shadow-xs font-semibold border border-border/80'
            : 'text-muted-foreground hover:text-foreground border border-transparent'
        "
        @click="setViewport('laptop')"
        title="Laptop (1024px)"
      >
        <Laptop class="size-3.5 shrink-0" />
        <span class="hidden min-[1600px]:inline">1024</span>
      </button>

      <button
        type="button"
        class="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition whitespace-nowrap shrink-0 cursor-pointer"
        :class="
          activeViewport === 'tablet'
            ? 'bg-background text-foreground shadow-xs font-semibold border border-border/80'
            : 'text-muted-foreground hover:text-foreground border border-transparent'
        "
        @click="setViewport('tablet')"
        title="Tablet (768px)"
      >
        <Tablet class="size-3.5 shrink-0" />
        <span class="hidden min-[1600px]:inline">768</span>
      </button>

      <button
        type="button"
        class="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition whitespace-nowrap shrink-0 cursor-pointer"
        :class="
          activeViewport === 'mobile'
            ? 'bg-background text-foreground shadow-xs font-semibold border border-border/80'
            : 'text-muted-foreground hover:text-foreground border border-transparent'
        "
        @click="setViewport('mobile')"
        title="Mobile (375px)"
      >
        <Smartphone class="size-3.5 shrink-0" />
        <span class="hidden min-[1600px]:inline">375</span>
      </button>
    </div>

    <!-- Right Section: Canvas Controls & Theme -->
    <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
      <!-- Canvas Background Selector -->
      <div
        class="hidden lg:flex items-center rounded-lg border border-border bg-muted/40 p-0.5 shadow-xs shrink-0"
      >
        <button
          type="button"
          class="flex size-7 items-center justify-center rounded-md transition shrink-0 cursor-pointer"
          :class="
            canvasBg === 'dots'
              ? 'bg-background text-foreground shadow-xs border border-border/80'
              : 'text-muted-foreground hover:text-foreground border border-transparent'
          "
          @click="setCanvas('dots')"
          title="Dots canvas background"
        >
          <CircleDot class="size-3.5 shrink-0" />
        </button>
        <button
          type="button"
          class="flex size-7 items-center justify-center rounded-md transition shrink-0 cursor-pointer"
          :class="
            canvasBg === 'grid'
              ? 'bg-background text-foreground shadow-xs border border-border/80'
              : 'text-muted-foreground hover:text-foreground border border-transparent'
          "
          @click="setCanvas('grid')"
          title="Grid canvas background"
        >
          <Grid class="size-3.5 shrink-0" />
        </button>
        <button
          type="button"
          class="flex size-7 items-center justify-center rounded-md transition shrink-0 cursor-pointer"
          :class="
            canvasBg === 'solid'
              ? 'bg-background text-foreground shadow-xs border border-border/80'
              : 'text-muted-foreground hover:text-foreground border border-transparent'
          "
          @click="setCanvas('solid')"
          title="Solid canvas background"
        >
          <Square class="size-3.5 shrink-0" />
        </button>
      </div>

      <!-- Remount Canvas Button -->
      <button
        type="button"
        class="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground active:rotate-180 transition-all duration-300 shadow-xs cursor-pointer"
        @click="emit('remount')"
        title="Reset & remount component"
      >
        <RotateCcw class="size-3.5 shrink-0" />
      </button>

      <!-- Theme Customizer Popover Toggle -->
      <div class="relative shrink-0">
        <button
          type="button"
          class="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition shadow-xs cursor-pointer"
          @click="showThemeMenu = !showThemeMenu"
          title="Customize Theme & Radius"
        >
          <Palette class="size-3.5 shrink-0" />
        </button>

        <!-- Click outside backdrop -->
        <div
          v-if="showThemeMenu"
          class="fixed inset-0 z-40"
          @click="showThemeMenu = false"
        />

        <!-- Dropdown Popover -->
        <div
          v-if="showThemeMenu"
          class="absolute right-0 top-11 w-72 rounded-xl border border-border bg-card p-4 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <div
            class="flex items-center justify-between pb-2 mb-3 border-b border-border"
          >
            <span class="text-xs font-semibold text-foreground"
              >Theme Customizer</span
            >
            <span class="text-xs font-mono text-muted-foreground uppercase">OKLCH</span>
          </div>

          <!-- Color Presets -->
          <div class="space-y-2 mb-4">
            <label class="text-xs text-muted-foreground font-medium">
              Accent Color
            </label>
            <div class="grid grid-cols-5 gap-2">
              <button
                v-for="color in COLOR_THEMES"
                :key="color.id"
                type="button"
                class="group flex flex-col items-center gap-1 rounded-lg border p-1.5 transition cursor-pointer"
                :class="
                  activeColorTheme === color.id
                    ? 'border-primary bg-primary/10 shadow-xs'
                    : 'border-border/60 hover:border-border hover:bg-muted/40'
                "
                @click="setColorTheme(color.id)"
                :title="color.name"
              >
                <span
                  class="size-4 rounded-full border border-black/10 dark:border-white/10"
                  :style="{ backgroundColor: color.id === 'default' ? (isDark ? '#fafafa' : '#18181b') : color.swatch }"
                />
                <span class="text-xs text-muted-foreground group-hover:text-foreground">{{
                  color.name
                }}</span>
              </button>
            </div>
          </div>

          <!-- Radius Presets -->
          <div class="space-y-2">
            <label class="text-xs text-muted-foreground font-medium">
              Border Radius
            </label>
            <div class="grid grid-cols-5 gap-1.5">
              <button
                v-for="rad in RADIUS_PRESETS"
                :key="rad.id"
                type="button"
                class="rounded-md border py-1 text-xs font-mono transition cursor-pointer text-center"
                :class="
                  activeRadius === rad.value
                    ? 'border-primary bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground'
                "
                :title="rad.name"
                @click="setRadius(rad.value)"
              >
                {{ rad.name.split(' ')[0] }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Dark / Light Mode Toggle -->
      <button
        type="button"
        class="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition shadow-xs cursor-pointer"
        @click="toggleThemeAction"
        :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
      >
        <Sun v-if="isDark" class="size-4 shrink-0" />
        <Moon v-else class="size-4 shrink-0" />
      </button>

      <div class="h-4 w-px bg-border shrink-0" />

      <!-- Inspector Toggle Button -->
      <button
        type="button"
        class="flex items-center gap-1.5 rounded-md px-2.5 h-8 text-xs font-medium transition shadow-xs border whitespace-nowrap shrink-0 cursor-pointer"
        :class="
          isInspectorOpen
            ? 'bg-primary text-primary-foreground border-primary'
            : 'bg-background text-muted-foreground border-border hover:text-foreground hover:bg-muted'
        "
        @click="toggleInspectorAction"
        title="Toggle Test Bench & Inspector"
      >
        <Sliders class="size-3.5 shrink-0" />
        <span class="hidden md:inline whitespace-nowrap">Test Bench</span>
      </button>
    </div>
  </header>
</template>
