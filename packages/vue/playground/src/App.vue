<script setup lang="ts">
import {
  ref,
  computed,
  shallowRef,
  watch,
  provide,
  onMounted,
  onUnmounted,
} from "vue";
import WorkbenchHeader from "./components/WorkbenchHeader.vue";
import WorkbenchSidebar, {
  type SidebarItem,
} from "./components/WorkbenchSidebar.vue";
import TestBenchDrawer, {
  type LoggedEvent,
} from "./components/TestBenchDrawer.vue";
import { extractProps, type PropMeta } from "./lib/extract-props";
import { extractTypeDecls, type TypeDecl } from "./lib/extract-meta";
import { extractStories } from "./lib/extract-stories";
import { COLOR_THEMES, RADIUS_PRESETS, type CanvasBackground } from "./theme";

import registryManifest from "../../registry.json";

// Globs for both Vue demos and their raw source code
const demoModules = import.meta.glob("../../demos/*.vue");
const demoRawModules = import.meta.glob("../../demos/*.vue", {
  query: "?raw",
  import: "default",
});

const manifestMap = new Map(
  (registryManifest.items as any[]).map((it) => [it.name, it]),
);

// Build catalog item list from demo files enriched by registry.json
const demoKeys = Object.keys(demoModules);
const items: SidebarItem[] = demoKeys
  .map((p) => {
    const filename = p.split("/").pop()?.replace(".vue", "") || "";
    const meta = manifestMap.get(filename);
    const isBlock = meta
      ? meta.type === "registry:block"
      : p.includes("block") || filename.includes("-dashboard");
    let category = "UI";
    if (isBlock) {
      category = "Blocks";
    } else if (
      filename.includes("chart") ||
      meta?.categories?.includes("chart") ||
      meta?.categories?.includes("data-visualization")
    ) {
      category = "Charts";
    } else if (meta?.categories?.[0]) {
      category =
        meta.categories[0].charAt(0).toUpperCase() +
        meta.categories[0].slice(1);
    }

    return {
      id: filename,
      name: filename
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      type: (meta?.type || (isBlock ? "registry:block" : "registry:ui")) as any,
      category,
      categories: meta?.categories || [],
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

const selectedId = ref("button");
const activeComponent = shallowRef<any>(null);
const loading = ref(false);
const remountKey = ref(0);
const previewContainerRef = ref<HTMLElement | null>(null);

// Theme & Canvas state
const isDark = ref(false);
const activeColorTheme = ref("default");
const activeRadius = ref("0.5rem");
const activeViewport = ref("fluid");
const canvasBg = ref<CanvasBackground>("dots");
const isInspectorOpen = ref(true);

// Component Metadata loaded from /r/vue/<name>.json
const currentMeta = ref<{
  type: string;
  description?: string;
  categories: string[];
  dependencies: string[];
  registryDependencies: string[];
  files: Array<{ path: string; target: string; content?: string }>;
}>({
  type: "registry:ui",
  categories: [],
  dependencies: [],
  registryDependencies: [],
  files: [],
});

// Props & Schema extracted from primary SFC
const propsList = ref<PropMeta[]>([]);
const typeDecls = ref<TypeDecl[]>([]);

// Story code snippets extracted from raw demo source
const storyCodeMap = ref<Record<string, string>>({});
provide("story:codeMap", storyCodeMap);

// Event Logger
const loggedEvents = ref<LoggedEvent[]>([]);

const logEvent = (ev: Event) => {
  const target = ev.target as HTMLElement | null;
  const tagName = target?.tagName?.toLowerCase() || "unknown";
  const slot = target?.getAttribute("data-slot") || "";
  const targetDesc = slot ? `${tagName}[data-slot=${slot}]` : tagName;

  const id = `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
  const now = new Date();
  const timestamp = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}.${now.getMilliseconds().toString().padStart(3, "0")}`;

  let detail: string | undefined;
  if (ev.type === "input" || ev.type === "change") {
    const val = (target as HTMLInputElement)?.value;
    if (val !== undefined) detail = `value: "${val}"`;
  }

  loggedEvents.value.unshift({
    id,
    timestamp,
    type: ev.type,
    target: targetDesc,
    detail,
  });

  // Keep max 50 events
  if (loggedEvents.value.length > 50) {
    loggedEvents.value.pop();
  }
};

// Load component demo + manifest + raw source
const loadComponent = async (id: string) => {
  const demoPath = Object.keys(demoModules).find((p) =>
    p.endsWith(`/${id}.vue`),
  );
  if (!demoPath) return;

  loading.value = true;
  try {
    // 1. Load component demo
    const compLoader = demoModules[demoPath];
    if (compLoader) {
      const mod: any = await compLoader();
      activeComponent.value = mod.default;
    }

    // 2. Load raw demo source for story snippets
    const rawLoader = demoRawModules[demoPath];
    if (rawLoader) {
      const rawCode: any = await rawLoader();
      if (typeof rawCode === "string") {
        storyCodeMap.value = extractStories(rawCode);
      }
    }

    // 3. Pre-populate from manifest immediately
    const localMeta = manifestMap.get(id);
    if (localMeta) {
      currentMeta.value = {
        type: localMeta.type || "registry:ui",
        description: localMeta.description,
        categories: localMeta.categories || [],
        dependencies: localMeta.dependencies || [],
        registryDependencies: localMeta.registryDependencies || [],
        files: localMeta.files || [],
      };
      const mainVue = localMeta.files?.find((f: any) =>
        f.path?.endsWith(".vue"),
      );
      if (mainVue && mainVue.content) {
        propsList.value = extractProps(mainVue.content).props;
      }
      if (localMeta.files?.length) {
        typeDecls.value = extractTypeDecls(localMeta.files);
      }
    }

    // 4. Refine from item JSON manifest if available
    try {
      const res = await fetch(`/r/vue/${id}.json`);
      if (res.ok) {
        const json = await res.json();
        currentMeta.value = {
          type: json.type || "registry:ui",
          description: json.description,
          categories: json.categories || [],
          dependencies: json.dependencies || [],
          registryDependencies: json.registryDependencies || [],
          files: json.files || [],
        };

        // Update item in sidebar with accurate metadata
        const target = items.find((i) => i.id === id);
        if (target) {
          target.type = json.type || target.type;
          if (json.categories?.[0]) target.category = json.categories[0];
        }

        // Extract props & schema from main Vue component
        const mainVueFile = json.files?.find((f: any) =>
          f.path.endsWith(".vue"),
        );
        if (mainVueFile && mainVueFile.content) {
          const res = extractProps(mainVueFile.content);
          propsList.value = res.props;
        } else {
          propsList.value = [];
        }

        // Extract types & schema from all files
        if (json.files?.length) {
          typeDecls.value = extractTypeDecls(json.files);
        } else {
          typeDecls.value = [];
        }
      }
    } catch (manifestErr) {
      console.warn("Could not fetch manifest for", id, manifestErr);
    }
  } catch (err) {
    console.error("Failed to load demo:", err);
  } finally {
    loading.value = false;
  }
};

// Watch selected component
watch(selectedId, (newId) => {
  loadComponent(newId);
});

// Theme handlers
const toggleTheme = () => {
  isDark.value = !isDark.value;
  applyTheme();
};

const applyTheme = () => {
  if (isDark.value) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

watch(activeColorTheme, (theme) => {
  if (theme === "default") {
    delete document.documentElement.dataset.colorTheme;
  } else {
    document.documentElement.dataset.colorTheme = theme;
  }
});

watch(activeRadius, (rad) => {
  document.documentElement.style.setProperty("--radius", rad);
});

const remount = () => {
  remountKey.value++;
};

const selectComponent = (id: string) => {
  selectedId.value = id;
};

const clearEvents = () => {
  loggedEvents.value = [];
};

// Event capture listeners on canvas
onMounted(() => {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    isDark.value = true;
  }
  applyTheme();
  loadComponent(selectedId.value);

  const el = previewContainerRef.value;
  if (el) {
    el.addEventListener("click", logEvent, { capture: true });
    el.addEventListener("input", logEvent, { capture: true });
    el.addEventListener("change", logEvent, { capture: true });
    el.addEventListener("submit", logEvent, { capture: true });
  }
});

onUnmounted(() => {
  const el = previewContainerRef.value;
  if (el) {
    el.removeEventListener("click", logEvent, { capture: true });
    el.removeEventListener("input", logEvent, { capture: true });
    el.removeEventListener("change", logEvent, { capture: true });
    el.removeEventListener("submit", logEvent, { capture: true });
  }
});

const activeItemName = computed(() => {
  return items.find((i) => i.id === selectedId.value)?.name || selectedId.value;
});
</script>

<template>
  <div
    class="flex h-screen w-screen overflow-hidden bg-background text-foreground font-sans antialiased"
  >
    <!-- Left Navigation Sidebar -->
    <WorkbenchSidebar
      :items="items"
      :selected-id="selectedId"
      @select="selectComponent"
    />

    <!-- Main Workspace -->
    <div class="flex flex-1 flex-col overflow-hidden min-w-0">
      <!-- Top Craft Header Bar -->
      <WorkbenchHeader
        :component-id="selectedId"
        :component-name="activeItemName"
        :component-type="currentMeta.type"
        :categories="currentMeta.categories"
        :is-dark="isDark"
        :active-color-theme="activeColorTheme"
        :active-radius="activeRadius"
        :active-viewport="activeViewport"
        :canvas-bg="canvasBg"
        :is-inspector-open="isInspectorOpen"
        @toggle-theme="toggleTheme"
        @update:active-color-theme="activeColorTheme = $event"
        @update:active-radius="activeRadius = $event"
        @update:active-viewport="activeViewport = $event"
        @update:canvas-bg="canvasBg = $event"
        @update:is-inspector-open="isInspectorOpen = $event"
        @remount="remount"
      />

      <!-- Middle: Canvas Preview Stage -->
      <div
        ref="previewContainerRef"
        class="flex-1 overflow-y-auto overflow-x-hidden p-6 transition-colors duration-200"
        :class="[
          canvasBg === 'dots' ? 'canvas-dots' : '',
          canvasBg === 'grid' ? 'canvas-grid' : '',
          canvasBg === 'checker' ? 'canvas-checker' : '',
          canvasBg === 'solid' ? 'canvas-solid' : '',
        ]"
      >
        <!-- Responsive Device Viewport Frame -->
        <div
          class="mx-auto transition-all duration-300"
          :class="[
            activeViewport === 'fluid'
              ? 'w-full max-w-6xl'
              : 'rounded-xl border border-border bg-card p-6 shadow-2xl ring-1 ring-border/50',
          ]"
          :style="
            activeViewport !== 'fluid'
              ? {
                  width:
                    activeViewport === 'desktop'
                      ? '1280px'
                      : activeViewport === 'laptop'
                        ? '1024px'
                        : activeViewport === 'tablet'
                          ? '768px'
                          : '375px',
                  maxWidth: '100%',
                }
              : {}
          "
        >
          <!-- Frame Device Header indicator when constrained -->
          <div
            v-if="activeViewport !== 'fluid'"
            class="mb-4 flex items-center justify-between border-b border-border pb-3 text-xs text-muted-foreground font-mono"
          >
            <div class="flex items-center gap-2">
              <span class="size-2 rounded-full bg-emerald-500" />
              <span
                class="font-semibold text-foreground uppercase tracking-wider text-[11px]"
                >{{ activeViewport }} VIEWPORT</span
              >
            </div>
            <span
              >{{
                activeViewport === "desktop"
                  ? "1280px"
                  : activeViewport === "laptop"
                    ? "1024px"
                    : activeViewport === "tablet"
                      ? "768px"
                      : "375px"
              }}
              × auto</span
            >
          </div>

          <!-- Loading state -->
          <div
            v-if="loading"
            class="flex items-center justify-center py-32 text-xs font-mono text-muted-foreground"
          >
            <div class="flex flex-col items-center gap-3">
              <div
                class="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin"
              />
              <span>Loading {{ activeItemName }}...</span>
            </div>
          </div>

          <!-- Live Component Demo -->
          <div v-else :key="remountKey">
            <component :is="activeComponent" v-if="activeComponent" />
            <div v-else class="py-24 text-center text-xs text-muted-foreground">
              Select a component to preview
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom: Test Bench & Inspector Drawer -->
      <TestBenchDrawer
        :component-id="selectedId"
        :component-name="activeItemName"
        :component-type="currentMeta.type"
        :props-list="propsList"
        :type-decls="typeDecls"
        :files="currentMeta.files"
        :dependencies="currentMeta.dependencies"
        :registry-dependencies="currentMeta.registryDependencies"
        :events="loggedEvents"
        :is-open="isInspectorOpen"
        @update:is-open="isInspectorOpen = $event"
        @select-component="selectComponent"
        @clear-events="clearEvents"
      />
    </div>
  </div>
</template>
