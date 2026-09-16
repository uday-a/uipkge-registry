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

const resetTheme = () => {
  setColorTheme("default");
  setRadius("0.5rem");
};

const toggleSidebarAction = () => {
  emit("toggleSidebar");
  emit("update:isSidebarOpen", !props.isSidebarOpen);
};

const toggleThemeAction = () => {
  emit("toggleTheme");
};

const setDark = (dark: boolean) => {
  if (props.isDark !== dark) {
    toggleThemeAction();
  }
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
          class="absolute right-0 top-11 w-80 rounded-[14px] border border-border bg-popover/95 text-popover-foreground p-4 shadow-2xl backdrop-blur-md z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <!-- Header -->
          <div class="flex items-center justify-between border-b border-border pb-3 mb-3.5">
            <div class="flex items-center gap-2">
              <div class="flex size-7 items-center justify-center rounded-[8px] border border-border bg-muted/50 text-foreground shadow-2xs">
                <Palette class="size-3.5" />
              </div>
              <div>
                <div class="flex items-center gap-1.5">
                  <h4 class="text-xs font-semibold text-foreground tracking-tight">
                    Theme Customizer
                  </h4>
                  <span class="rounded-[4px] bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground uppercase">
                    OKLCH
                  </span>
                </div>
                <p class="text-[11px] text-muted-foreground">Tokens & preview settings</p>
              </div>
            </div>
            <button
              type="button"
              @click="resetTheme"
              title="Reset to default theme & radius"
              class="flex shrink-0 items-center gap-1 rounded-[6px] px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer border border-transparent hover:border-border/60"
            >
              <RotateCcw class="size-3" />
              <span>Reset</span>
            </button>
          </div>

          <!-- Appearance / Color Mode -->
          <div class="space-y-1.5 mb-3.5">
            <label class="text-xs font-medium text-muted-foreground">Appearance</label>
            <div class="grid grid-cols-2 gap-1 rounded-[8px] border border-border/60 bg-muted/40 p-1">
              <button
                type="button"
                @click="setDark(false)"
                class="flex items-center justify-center gap-2 rounded-[6px] py-1.5 text-xs font-medium transition cursor-pointer"
                :class="
                  !isDark
                    ? 'bg-background text-foreground shadow-xs border border-border/80 font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                "
              >
                <Sun class="size-3.5" />
                <span>Light</span>
              </button>
              <button
                type="button"
                @click="setDark(true)"
                class="flex items-center justify-center gap-2 rounded-[6px] py-1.5 text-xs font-medium transition cursor-pointer"
                :class="
                  isDark
                    ? 'bg-background text-foreground shadow-xs border border-border/80 font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                "
              >
                <Moon class="size-3.5" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          <!-- Accent Color -->
          <div class="space-y-1.5 mb-3.5">
            <div class="flex items-center justify-between">
              <label class="text-xs font-medium text-muted-foreground">Accent Color</label>
              <span class="text-[11px] font-mono text-muted-foreground capitalize flex items-center gap-1.5">
                <span
                  class="size-2 rounded-full border border-black/10 dark:border-white/20"
                  :style="{
                    backgroundColor:
                      activeColorTheme === 'default'
                        ? isDark
                          ? '#fafafa'
                          : '#18181b'
                        : COLOR_THEMES.find((t) => t.id === activeColorTheme)?.swatch || '#18181b',
                  }"
                />
                {{ COLOR_THEMES.find((t) => t.id === activeColorTheme)?.name || 'Neutral' }}
              </span>
            </div>
            <div class="grid grid-cols-3 gap-1.5">
              <button
                v-for="color in COLOR_THEMES"
                :key="color.id"
                type="button"
                @click="setColorTheme(color.id)"
                :title="color.name"
                class="group flex items-center gap-2 rounded-[6px] border px-2 py-1.5 text-xs font-medium transition cursor-pointer"
                :class="
                  activeColorTheme === color.id
                    ? 'border-primary bg-primary/10 text-foreground font-semibold shadow-2xs'
                    : 'border-border/50 bg-background/60 text-muted-foreground hover:border-border hover:bg-muted/60 hover:text-foreground'
                "
              >
                <span
                  class="relative size-3.5 shrink-0 rounded-full border border-black/10 dark:border-white/20 shadow-2xs transition-transform group-hover:scale-110 flex items-center justify-center"
                  :style="{
                    backgroundColor:
                      color.id === 'default' ? (isDark ? '#fafafa' : '#18181b') : color.swatch,
                  }"
                >
                  <Check
                    v-if="activeColorTheme === color.id"
                    class="size-2 stroke-[3]"
                    :class="
                      color.id === 'default'
                        ? isDark
                          ? 'text-black'
                          : 'text-white'
                        : color.id === 'amber' || color.id === 'cyan'
                        ? 'text-black'
                        : 'text-white'
                    "
                  />
                </span>
                <span class="truncate">{{ color.name }}</span>
              </button>
            </div>
          </div>

          <!-- Border Radius -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label class="text-xs font-medium text-muted-foreground">Border Radius</label>
              <span class="text-[11px] font-mono text-muted-foreground">
                {{ RADIUS_PRESETS.find((r) => r.value === activeRadius)?.name || activeRadius }}
              </span>
            </div>
            <div class="grid grid-cols-4 gap-1 rounded-[8px] border border-border/60 bg-muted/40 p-1">
              <button
                v-for="rad in RADIUS_PRESETS"
                :key="rad.id"
                type="button"
                @click="setRadius(rad.value)"
                :title="rad.name"
                class="flex items-center justify-center rounded-[6px] py-1.5 text-xs font-mono transition cursor-pointer"
                :class="
                  activeRadius === rad.value
                    ? 'bg-background text-foreground font-semibold shadow-xs border border-border/80'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/40'
                "
              >
                {{ rad.label }}
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
