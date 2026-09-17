<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import {
  Search,
  X,
  Layers,
  LayoutGrid,
  BarChart3,
  Sparkles,
  ChevronRight,
  ChevronDown,
} from "lucide-vue-next";

export interface SidebarItem {
  id: string;
  name: string;
  type: string;
  category: string;
  categories?: string[];
}

const props = defineProps<{
  items: SidebarItem[];
  selectedId: string;
}>();

const emit = defineEmits<{
  (e: "select", id: string): void;
}>();

const search = ref("");
const searchInputRef = ref<HTMLInputElement | null>(null);
type FilterTab = "all" | "ui" | "block" | "charts";
const activeTab = ref<FilterTab>("all");
const collapsedCategories = ref<Record<string, boolean>>({});

// Filter items by search query and type tab
const filteredItems = computed(() => {
  let list = props.items;

  if (activeTab.value === "ui") {
    list = list.filter(
      (i) =>
        i.type === "registry:ui" &&
        !i.id.includes("chart") &&
        !i.categories?.includes("chart"),
    );
  } else if (activeTab.value === "block") {
    list = list.filter((i) => i.type === "registry:block");
  } else if (activeTab.value === "charts") {
    list = list.filter(
      (i) =>
        i.id.includes("chart") ||
        i.category === "Charts" ||
        i.categories?.some(
          (c) => c.includes("chart") || c.includes("visualization"),
        ),
    );
  }

  const q = search.value.toLowerCase().trim();
  if (!q) return list;
  return list.filter(
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
    class="flex w-72 sm:w-80 shrink-0 flex-col border-r border-border bg-card/60 backdrop-blur select-none"
  >
    <!-- Search Bar -->
    <div class="p-3 border-b border-border">
      <div class="relative">
        <Search
          class="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground"
        />
        <input
          ref="searchInputRef"
          v-model="search"
          type="text"
          placeholder="Search components... (/)"
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

      <!-- Segmented Type Filter Tabs -->
      <div
        class="mt-2.5 grid grid-cols-4 gap-1 rounded-lg border border-border bg-muted/40 p-0.5 text-[11px] font-medium"
      >
        <button
          type="button"
          class="rounded-md py-1 text-center transition"
          :class="
            activeTab === 'all'
              ? 'bg-background text-foreground shadow-xs font-semibold'
              : 'text-muted-foreground hover:text-foreground'
          "
          @click="activeTab = 'all'"
        >
          All
        </button>
        <button
          type="button"
          class="rounded-md py-1 text-center transition"
          :class="
            activeTab === 'ui'
              ? 'bg-background text-foreground shadow-xs font-semibold'
              : 'text-muted-foreground hover:text-foreground'
          "
          @click="activeTab = 'ui'"
        >
          UI
        </button>
        <button
          type="button"
          class="rounded-md py-1 text-center transition"
          :class="
            activeTab === 'block'
              ? 'bg-background text-foreground shadow-xs font-semibold'
              : 'text-muted-foreground hover:text-foreground'
          "
          @click="activeTab = 'block'"
        >
          Blocks
        </button>
        <button
          type="button"
          class="rounded-md py-1 text-center transition"
          :class="
            activeTab === 'charts'
              ? 'bg-background text-foreground shadow-xs font-semibold'
              : 'text-muted-foreground hover:text-foreground'
          "
          @click="activeTab = 'charts'"
        >
          Charts
        </button>
      </div>
    </div>

    <!-- Grouped Component List -->
    <div class="flex-1 overflow-y-auto p-2 space-y-3">
      <div
        v-for="[category, groupItems] in groupedItems"
        :key="category"
        class="space-y-0.5"
      >
        <!-- Category Header -->
        <button
          type="button"
          class="flex w-full items-center justify-between px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground transition rounded"
          @click="toggleCategory(category)"
        >
          <div class="flex items-center gap-1.5">
            <component
              :is="collapsedCategories[category] ? ChevronRight : ChevronDown"
              class="size-3 opacity-60"
            />
            <span>{{ category }}</span>
          </div>
          <span class="font-mono text-[10px] text-muted-foreground/80">
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
            class="flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-xs transition group"
            :class="
              selectedId === item.id
                ? 'bg-primary text-primary-foreground font-medium shadow-xs'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            "
            @click="emit('select', item.id)"
          >
            <span class="truncate pr-2">{{ item.name }}</span>
            <span
              class="font-mono text-[9px] uppercase px-1 py-0.2 rounded shrink-0"
              :class="
                selectedId === item.id
                  ? 'bg-primary-foreground/20 text-primary-foreground'
                  : item.type === 'registry:block'
                    ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                    : 'bg-muted text-muted-foreground'
              "
            >
              {{ item.type === "registry:block" ? "block" : "ui" }}
            </span>
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="filteredItems.length === 0"
        class="py-12 text-center text-xs text-muted-foreground"
      >
        No components match "{{ search }}"
      </div>
    </div>

    <!-- Sidebar Footer -->
    <div
      class="border-t border-border p-3 bg-muted/20 flex items-center justify-between text-[11px] text-muted-foreground font-mono"
    >
      <span>{{ filteredItems.length }} items shown</span>
      <span>UIPKGE v1.0</span>
    </div>
  </aside>
</template>
