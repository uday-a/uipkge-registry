<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import {
  Search,
  X,
  Layers,
  LayoutGrid,
  BarChart3,
  Sparkles,
  ChevronRight,
  ChevronDown,
  PanelLeftClose,
} from "lucide-vue-next";

export interface SidebarItem {
  id: string;
  name: string;
  type: string;
  category: string;
  categories?: string[];
}

const props = withDefaults(
  defineProps<{
    items: SidebarItem[];
    selectedId: string;
    collapsed?: boolean;
  }>(),
  {
    collapsed: false,
  },
);

const emit = defineEmits<{
  (e: "select", id: string): void;
  (e: "toggle-collapse"): void;
}>();

const search = ref("");
const searchInputRef = ref<HTMLInputElement | null>(null);
const collapsedCategories = ref<Record<string, boolean>>({});

const isBlockItem = (item: SidebarItem) =>
  item.type === "registry:block" ||
  item.category === "Blocks" ||
  item.id === "cloud-backup-schedule";

const componentsList = computed(() => props.items.filter((i) => !isBlockItem(i)));
const blocksList = computed(() => props.items.filter((i) => isBlockItem(i)));

const activeTab = ref<"components" | "blocks">("components");

// Sync active tab with selected component
watch(
  () => props.selectedId,
  (newId) => {
    if (newId) {
      const match = props.items.find((i) => i.id === newId);
      if (match) {
        activeTab.value = isBlockItem(match) ? "blocks" : "components";
      }
    }
  },
  { immediate: true },
);

function switchTab(tab: "components" | "blocks") {
  activeTab.value = tab;
  search.value = "";
  if (tab === "blocks") {
    if (!blocksList.value.some((b) => b.id === props.selectedId)) {
      if (blocksList.value.length > 0) {
        emit("select", blocksList.value[0].id);
      }
    }
  } else {
    if (!componentsList.value.some((c) => c.id === props.selectedId)) {
      const defaultComp = componentsList.value.some((c) => c.id === "button")
        ? "button"
        : componentsList.value[0]?.id;
      if (defaultComp) emit("select", defaultComp);
    }
  }
}

// Items for the current active tab
const currentTabItems = computed(() => {
  return activeTab.value === "blocks" ? blocksList.value : componentsList.value;
});

// Filter items by search query
const filteredItems = computed(() => {
  const q = search.value.toLowerCase().trim();
  if (!q) return currentTabItems.value;
  return currentTabItems.value.filter(
    (i) =>
      i.id.toLowerCase().includes(q) ||
      i.name.toLowerCase().includes(q) ||
      i.categories?.some((c) => c.toLowerCase().includes(q)),
  );
});

// Group items by category
const groupedItems = computed(() => {
  const groups: Record<string, SidebarItem[]> = {};
  for (const item of filteredItems.value) {
    const cat = item.category || "General";
    const formattedCat = cat.charAt(0).toUpperCase() + cat.slice(1);
    if (!groups[formattedCat]) groups[formattedCat] = [];
    groups[formattedCat].push(item);
  }
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
});

const toggleCategory = (cat: string) => {
  collapsedCategories.value[cat] = !collapsedCategories.value[cat];
};

const clearSearch = () => {
  search.value = "";
  searchInputRef.value?.focus();
};

// Global hotkeys: '/' to focus search, Esc to blur
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "/" && document.activeElement !== searchInputRef.value) {
    e.preventDefault();
    searchInputRef.value?.focus();
  } else if (
    e.key === "Escape" &&
    document.activeElement === searchInputRef.value
  ) {
    searchInputRef.value?.blur();
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <aside
    class="flex shrink-0 flex-col border-r border-border bg-card/60 backdrop-blur select-none transition-all duration-200"
    :class="[
      collapsed
        ? 'w-0 overflow-hidden border-r-0 p-0 opacity-0 pointer-events-none'
        : 'w-80',
    ]"
  >
    <!-- Brand Header: UIPKGE Registry Logo, Title & Collapse Action -->
    <div class="flex h-14 shrink-0 items-center justify-between px-3.5 border-b border-border bg-card/80">
      <div class="flex items-center gap-2.5 min-w-0">
        <!-- UIPKGE Official Brand Icon -->
        <svg width="24" height="24" viewBox="0 0 32 32" class="shrink-0" aria-hidden="true">
          <rect x="0.5" y="0.5" width="31" height="31" rx="7" class="fill-card stroke-border" stroke-width="1" />
          <rect x="6" y="6" width="8" height="8" rx="1.6" class="fill-foreground" />
          <rect x="18" y="6" width="8" height="8" rx="1.6" class="fill-primary" />
          <rect x="6" y="18" width="8" height="8" rx="1.6" class="fill-muted" />
          <rect x="18" y="18" width="8" height="8" rx="1.6" class="fill-foreground" />
        </svg>
        <div class="flex items-baseline gap-1.5 min-w-0">
          <span class="text-sm font-bold tracking-tight text-foreground font-display">UIPKGE</span>
          <span class="text-xs font-semibold text-muted-foreground">Registry</span>
        </div>
      </div>
      <div class="flex items-center gap-1.5 shrink-0">
        <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium border border-border bg-muted/60 text-muted-foreground">
          v1.0
        </span>
        <button
          type="button"
          class="flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer shadow-2xs"
          @click="emit('toggle-collapse')"
          title="Close sidebar (⌘B)"
        >
          <PanelLeftClose class="size-3.5 shrink-0" />
        </button>
      </div>
    </div>

    <!-- Top Section: Components & Blocks Tabs Side by Side + Search Bar -->
    <div class="p-3 border-b border-border space-y-2.5">
      <!-- Tabs Side by Side: Flexible Components tab + snug Blocks tab -->
      <div
        class="flex items-center gap-1 p-0.5 bg-muted/60 rounded-lg text-xs font-medium border border-border/50"
      >
        <button
          type="button"
          id="tab-components"
          class="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md transition cursor-pointer whitespace-nowrap min-w-0 select-none"
          :class="
            activeTab === 'components'
              ? 'bg-background text-foreground shadow-xs font-semibold'
              : 'text-muted-foreground hover:text-foreground'
          "
          @click="switchTab('components')"
          title="Components (UI Primitives)"
        >
          <Layers class="size-3.5 shrink-0" />
          <span class="text-xs font-medium">Components</span>
          <span
            class="text-[10px] px-1.5 py-0.5 rounded-full font-mono shrink-0 leading-none tabular-nums"
            :class="
              activeTab === 'components'
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground'
            "
          >
            {{ componentsList.length }}
          </span>
        </button>

        <button
          type="button"
          id="tab-blocks"
          class="shrink-0 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-md transition cursor-pointer whitespace-nowrap select-none"
          :class="
            activeTab === 'blocks'
              ? 'bg-background text-foreground shadow-xs font-semibold'
              : 'text-muted-foreground hover:text-foreground'
          "
          @click="switchTab('blocks')"
          title="Blocks (Composed Layouts)"
        >
          <LayoutGrid class="size-3.5 shrink-0" />
          <span class="text-xs font-medium">Blocks</span>
          <span
            class="text-[10px] px-1.5 py-0.5 rounded-full font-mono shrink-0 leading-none tabular-nums"
            :class="
              activeTab === 'blocks'
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground'
            "
          >
            {{ blocksList.length }}
          </span>
        </button>
      </div>

      <!-- Search Bar -->
      <div class="relative">
        <Search
          class="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none"
        />
        <input
          ref="searchInputRef"
          v-model="search"
          type="text"
          :placeholder="
            activeTab === 'blocks'
              ? 'Search blocks... (/)'
              : 'Search components... (/)'
          "
          class="w-full rounded-lg border border-border bg-background pl-8 pr-7 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
        />
        <button
          v-if="search"
          type="button"
          class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          @click="clearSearch"
        >
          <X class="size-3.5" />
        </button>
      </div>
    </div>

    <!-- Grouped Component / Block List -->
    <div class="flex-1 overflow-y-auto p-2 space-y-3">
      <div
        v-for="[category, groupItems] in groupedItems"
        :key="category"
        class="space-y-0.5"
      >
        <!-- Category Header -->
        <button
          type="button"
          class="flex w-full items-center justify-between px-2 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition rounded"
          @click="toggleCategory(category)"
        >
          <div class="flex items-center gap-1.5">
            <component
              :is="collapsedCategories[category] ? ChevronRight : ChevronDown"
              class="size-3 opacity-60"
            />
            <span>{{ category }}</span>
          </div>
          <span class="font-mono text-xs text-muted-foreground/80">
            {{ groupItems.length }}
          </span>
        </button>

        <!-- Category Items -->
        <div v-show="!collapsedCategories[category]" class="space-y-0.5 pl-1">
          <button
            v-for="item in groupItems"
            :key="item.id"
            :id="`sidebar-item-${item.id}`"
            type="button"
            class="flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-xs transition group cursor-pointer"
            :class="
              selectedId === item.id
                ? 'bg-primary text-primary-foreground font-medium shadow-xs'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            "
            @click="emit('select', item.id)"
          >
            <span class="truncate pr-2">{{ item.name }}</span>
            <span
              v-if="item.id.includes('chart') || item.category === 'Charts'"
              class="text-[11px] opacity-70 shrink-0"
            >
              chart
            </span>
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="filteredItems.length === 0"
        class="py-12 text-center text-xs text-muted-foreground"
      >
        No {{ activeTab === 'blocks' ? 'blocks' : 'components' }} match "{{ search }}"
      </div>
    </div>

    <!-- Sidebar Footer -->
    <div
      class="border-t border-border p-3 bg-muted/20 flex items-center justify-between text-xs text-muted-foreground font-mono"
    >
      <span>
        {{ filteredItems.length }}
        {{
          activeTab === 'blocks'
            ? filteredItems.length === 1
              ? 'block'
              : 'blocks'
            : 'components'
        }}
      </span>
      <span>UIPKGE v1.0</span>
    </div>
  </aside>
</template>
