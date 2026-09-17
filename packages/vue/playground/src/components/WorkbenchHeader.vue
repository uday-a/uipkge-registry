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
    class="border-border bg-card z-20 flex h-14 shrink-0 items-center justify-between gap-2 border-b px-3 select-none sm:gap-4 sm:px-4"
  >
    <!-- Left Section: Monogram & Component Info -->
    <div class="flex min-w-0 flex-1 items-center gap-2 sm:gap-2.5">
      <!-- Toggle sidebar button (only when sidebar is closed) -->
      <button
        v-if="!isSidebarOpen"
        type="button"
        class="border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border shadow-2xs transition"
        @click="toggleSidebarAction"
        title="Show sidebar (⌘B)"
      >
        <PanelLeft class="size-4 shrink-0" />
      </button>

      <!-- UIPKGE brand icon (only when sidebar is closed) -->
      <div
        v-if="!isSidebarOpen"
        class="border-border bg-card flex size-8 shrink-0 items-center justify-center rounded-lg border shadow-xs select-none"
        title="UIPKGE Dev Workbench"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 32 32"
          class="shrink-0"
          aria-hidden="true"
        >
          <rect
            x="0.5"
            y="0.5"
            width="31"
            height="31"
            rx="7"
            class="fill-card stroke-border"
            stroke-width="1"
          />
          <rect
            x="6"
            y="6"
            width="8"
            height="8"
            rx="1.6"
            class="fill-foreground"
          />
          <rect
            x="18"
            y="6"
            width="8"
            height="8"
            rx="1.6"
            class="fill-primary"
          />
          <rect x="6" y="18" width="8" height="8" rx="1.6" class="fill-muted" />
          <rect
            x="18"
            y="18"
            width="8"
            height="8"
            rx="1.6"
            class="fill-foreground"
          />
        </svg>
      </div>

      <!-- Framework switch & links -->
      <div class="flex shrink-0 items-center gap-1.5">
        <div class="flex shrink-0 items-center gap-1">
          <span
            class="border-border bg-muted/40 text-foreground inline-flex h-7 shrink-0 items-center rounded-md border px-2 font-mono text-xs font-semibold whitespace-nowrap shadow-2xs"
          >
            Vue 3.5
          </span>
          <a
            :href="'http://localhost:5174?c=' + componentId"
            target="_blank"
            rel="noreferrer"
            class="border-border bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted hidden h-7 shrink-0 items-center rounded-md border px-2 font-mono text-xs whitespace-nowrap transition sm:inline-flex"
            title="Open React 19 Playground on :5174"
          >
            <span>React 19</span>
            <ExternalLink class="ml-1 size-2.5" />
          </a>
        </div>
      </div>

      <div class="bg-border hidden h-4 w-px shrink-0 sm:block" />

      <!-- Breadcrumbs & metadata -->
      <div class="flex min-w-0 shrink items-center gap-1.5">
        <h2
          class="text-foreground max-w-[140px] min-w-0 shrink truncate text-xs font-semibold tracking-tight whitespace-nowrap sm:text-sm md:max-w-[200px]"
        >
          {{ componentName }}
        </h2>
        <span
          v-if="categories && categories[0]"
          class="bg-muted text-muted-foreground hidden shrink-0 rounded-md px-2 py-0.5 text-xs whitespace-nowrap xl:inline-block"
        >
          {{ categories[0] }}
        </span>
      </div>

      <!-- Quick copy install command: Full command on wide screens, compact icon on smaller -->
      <button
        type="button"
        class="border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted hidden h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 font-mono text-xs whitespace-nowrap shadow-xs transition min-[1400px]:flex"
        @click="copyCommand"
        title="Copy install command"
      >
        <Check v-if="copied" class="size-3 shrink-0 text-emerald-500" />
        <Copy v-else class="size-3 shrink-0" />
        <span class="max-w-[180px] truncate whitespace-nowrap"
          >add @uipkge/{{ componentId }}</span
        >
      </button>
      <button
        type="button"
        class="border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border shadow-xs transition min-[1400px]:hidden"
        @click="copyCommand"
        :title="'Copy install command: add @uipkge/' + componentId"
      >
        <Check v-if="copied" class="size-3.5 shrink-0 text-emerald-500" />
        <Copy v-else class="size-3.5 shrink-0" />
      </button>
    </div>

    <!-- Center Section: Viewport Switcher Toolbar (Visible on lg+) -->
    <div
      class="border-border bg-muted/40 hidden shrink-0 items-center rounded-lg border p-0.5 shadow-xs lg:flex"
    >
      <button
        type="button"
        class="flex shrink-0 cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap transition"
        :class="
          activeViewport === 'fluid'
            ? 'bg-background text-foreground border-border/80 border font-semibold shadow-xs'
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
        class="flex shrink-0 cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap transition"
        :class="
          activeViewport === 'desktop'
            ? 'bg-background text-foreground border-border/80 border font-semibold shadow-xs'
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
        class="flex shrink-0 cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap transition"
        :class="
          activeViewport === 'laptop'
            ? 'bg-background text-foreground border-border/80 border font-semibold shadow-xs'
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
        class="flex shrink-0 cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap transition"
        :class="
          activeViewport === 'tablet'
            ? 'bg-background text-foreground border-border/80 border font-semibold shadow-xs'
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
        class="flex shrink-0 cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap transition"
        :class="
          activeViewport === 'mobile'
            ? 'bg-background text-foreground border-border/80 border font-semibold shadow-xs'
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
    <div class="flex shrink-0 items-center gap-1.5 sm:gap-2">
      <!-- Canvas Background Selector -->
      <div
        class="border-border bg-muted/40 hidden shrink-0 items-center rounded-lg border p-0.5 shadow-xs lg:flex"
      >
        <button
          type="button"
          class="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md transition"
          :class="
            canvasBg === 'dots'
              ? 'bg-background text-foreground border-border/80 border shadow-xs'
              : 'text-muted-foreground hover:text-foreground border border-transparent'
          "
          @click="setCanvas('dots')"
          title="Dots canvas background"
        >
          <CircleDot class="size-3.5 shrink-0" />
        </button>
        <button
          type="button"
          class="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md transition"
          :class="
            canvasBg === 'grid'
              ? 'bg-background text-foreground border-border/80 border shadow-xs'
              : 'text-muted-foreground hover:text-foreground border border-transparent'
          "
          @click="setCanvas('grid')"
          title="Grid canvas background"
        >
          <Grid class="size-3.5 shrink-0" />
        </button>
        <button
          type="button"
          class="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md transition"
          :class="
            canvasBg === 'solid'
              ? 'bg-background text-foreground border-border/80 border shadow-xs'
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
        class="border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md border shadow-xs transition-[color,background-color,transform] duration-300 active:rotate-180"
        @click="emit('remount')"
        title="Reset & remount component"
      >
        <RotateCcw class="size-3.5 shrink-0" />
      </button>

      <!-- Theme Customizer Popover Toggle -->
      <div class="relative shrink-0">
        <button
          type="button"
          class="border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md border shadow-xs transition"
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
          class="border-border bg-popover/95 text-popover-foreground animate-in fade-in zoom-in-95 absolute top-11 right-0 z-50 w-80 rounded-[14px] border p-4 shadow-2xl backdrop-blur-md duration-150"
        >
          <!-- Header -->
          <div
            class="border-border mb-3.5 flex items-center justify-between border-b pb-3"
          >
            <div class="flex items-center gap-2">
              <div
                class="border-border bg-muted/50 text-foreground flex size-7 items-center justify-center rounded-[8px] border shadow-2xs"
              >
                <Palette class="size-3.5" />
              </div>
              <div>
                <div class="flex items-center gap-1.5">
                  <h4
                    class="text-foreground text-xs font-semibold tracking-tight"
                  >
                    Theme Customizer
                  </h4>
                  <span
                    class="bg-muted text-muted-foreground rounded-[4px] px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase"
                  >
                    OKLCH
                  </span>
                </div>
                <p class="text-muted-foreground text-[11px]">
                  Tokens & preview settings
                </p>
              </div>
            </div>
            <button
              type="button"
              @click="resetTheme"
              title="Reset to default theme & radius"
              class="text-muted-foreground hover:text-foreground hover:bg-muted hover:border-border/60 flex shrink-0 cursor-pointer items-center gap-1 rounded-[6px] border border-transparent px-2 py-1 text-xs font-medium transition"
            >
              <RotateCcw class="size-3" />
              <span>Reset</span>
            </button>
          </div>

          <!-- Appearance / Color Mode -->
          <div class="mb-3.5 space-y-1.5">
            <label class="text-muted-foreground text-xs font-medium"
              >Appearance</label
            >
            <div
              class="border-border/60 bg-muted/40 grid grid-cols-2 gap-1 rounded-[8px] border p-1"
            >
              <button
                type="button"
                @click="setDark(false)"
                class="flex cursor-pointer items-center justify-center gap-2 rounded-[6px] py-1.5 text-xs font-medium transition"
                :class="
                  !isDark
                    ? 'bg-background text-foreground border-border/80 border font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                "
              >
                <Sun class="size-3.5" />
                <span>Light</span>
              </button>
              <button
                type="button"
                @click="setDark(true)"
                class="flex cursor-pointer items-center justify-center gap-2 rounded-[6px] py-1.5 text-xs font-medium transition"
                :class="
                  isDark
                    ? 'bg-background text-foreground border-border/80 border font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                "
              >
                <Moon class="size-3.5" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          <!-- Accent Color -->
          <div class="mb-3.5 space-y-1.5">
            <div class="flex items-center justify-between">
              <label class="text-muted-foreground text-xs font-medium"
                >Accent Color</label
              >
              <span
                class="text-muted-foreground flex items-center gap-1.5 font-mono text-[11px] capitalize"
              >
                <span
                  class="size-2 rounded-full border border-black/10 dark:border-white/20"
                  :style="{
                    backgroundColor:
                      activeColorTheme === 'default'
                        ? isDark
                          ? '#fafafa'
                          : '#18181b'
                        : COLOR_THEMES.find((t) => t.id === activeColorTheme)
                            ?.swatch || '#18181b',
                  }"
                />
                {{
                  COLOR_THEMES.find((t) => t.id === activeColorTheme)?.name ||
                  "Neutral"
                }}
              </span>
            </div>
            <div class="grid grid-cols-3 gap-1.5">
              <button
                v-for="color in COLOR_THEMES"
                :key="color.id"
                type="button"
                @click="setColorTheme(color.id)"
                :title="color.name"
                class="group flex cursor-pointer items-center gap-2 rounded-[6px] border px-2 py-1.5 text-xs font-medium transition"
                :class="
                  activeColorTheme === color.id
                    ? 'border-primary bg-primary/10 text-foreground font-semibold shadow-2xs'
                    : 'border-border/50 bg-background/60 text-muted-foreground hover:border-border hover:bg-muted/60 hover:text-foreground'
                "
              >
                <span
                  class="relative flex size-3.5 shrink-0 items-center justify-center rounded-full border border-black/10 shadow-2xs transition-transform group-hover:scale-110 dark:border-white/20"
                  :style="{
                    backgroundColor:
                      color.id === 'default'
                        ? isDark
                          ? '#fafafa'
                          : '#18181b'
                        : color.swatch,
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
              <label class="text-muted-foreground text-xs font-medium"
                >Border Radius</label
              >
              <span class="text-muted-foreground font-mono text-[11px]">
                {{
                  RADIUS_PRESETS.find((r) => r.value === activeRadius)?.name ||
                  activeRadius
                }}
              </span>
            </div>
            <div
              class="border-border/60 bg-muted/40 grid grid-cols-4 gap-1 rounded-[8px] border p-1"
            >
              <button
                v-for="rad in RADIUS_PRESETS"
                :key="rad.id"
                type="button"
                @click="setRadius(rad.value)"
                :title="rad.name"
                class="flex cursor-pointer items-center justify-center rounded-[6px] py-1.5 font-mono text-xs transition"
                :class="
                  activeRadius === rad.value
                    ? 'bg-background text-foreground border-border/80 border font-semibold shadow-xs'
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
        class="border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md border shadow-xs transition"
        @click="toggleThemeAction"
        :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
      >
        <Sun v-if="isDark" class="size-4 shrink-0" />
        <Moon v-else class="size-4 shrink-0" />
      </button>

      <div class="bg-border h-4 w-px shrink-0" />

      <!-- Inspector Toggle Button -->
      <button
        type="button"
        class="flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-md border px-2.5 text-xs font-medium whitespace-nowrap shadow-xs transition"
        :class="
          isInspectorOpen
            ? 'bg-primary text-primary-foreground border-primary'
            : 'bg-background text-muted-foreground border-border hover:text-foreground hover:bg-muted'
        "
        @click="toggleInspectorAction"
        title="Toggle Test Bench & Inspector"
      >
        <Sliders class="size-3.5 shrink-0" />
        <span class="hidden whitespace-nowrap md:inline">Test Bench</span>
      </button>
    </div>
  </header>
</template>
