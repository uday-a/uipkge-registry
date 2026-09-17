<script setup lang="ts">
import { ref, computed, shallowRef, watchEffect, onMounted } from 'vue'
import { Search, Sun, Moon, Sparkles, Component, LayoutGrid, Check, Copy } from 'lucide-vue-next'

// Discover all demos in packages/vue/demos
const demoModules = import.meta.glob('../../demos/*.vue')

interface DemoEntry {
  id: string
  name: string
  loader: () => Promise<any>
}

const demos: DemoEntry[] = Object.entries(demoModules).map(([path, loader]) => {
  const filename = path.split('/').pop()?.replace('.vue', '') || ''
  return {
    id: filename,
    name: filename
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' '),
    loader: loader as () => Promise<any>,
  }
}).sort((a, b) => a.name.localeCompare(b.name))

const search = ref('')
const selectedId = ref(demos[0]?.id || 'button')
const activeComponent = shallowRef<any>(null)
const loading = ref(false)
const copied = ref(false)
const isDark = ref(false)

const filteredDemos = computed(() => {
  const q = search.value.toLowerCase().trim()
  if (!q) return demos
  return demos.filter((d) => d.id.toLowerCase().includes(q) || d.name.toLowerCase().includes(q))
})

watchEffect(async () => {
  const target = demos.find((d) => d.id === selectedId.value)
  if (!target) return
  loading.value = true
  try {
    const mod = await target.loader()
    activeComponent.value = mod.default
  } catch (err) {
    console.error('Failed to load demo:', err)
  } finally {
    loading.value = false
  }
})

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

const copyCommand = (id: string) => {
  navigator.clipboard.writeText(`npx shadcn-vue add @uipkge/${id}`)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}

onMounted(() => {
  // Check system dark mode
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
})
</script>

<template>
  <div class="flex h-screen w-screen overflow-hidden bg-background text-foreground font-sans antialiased">
    <!-- Sidebar -->
    <aside class="flex w-72 shrink-0 flex-col border-r border-border bg-card">
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-border px-4 py-3.5">
        <div class="flex items-center gap-2">
          <div class="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground font-mono text-xs font-bold shadow-xs">
            UI
          </div>
          <div>
            <h1 class="text-xs font-bold tracking-tight">UIPKGE Vue</h1>
            <p class="text-[10px] text-muted-foreground font-mono">dev playground</p>
          </div>
        </div>
        <button
          type="button"
          class="flex size-7 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition"
          @click="toggleTheme"
          :title="isDark ? 'Switch to Light' : 'Switch to Dark'"
        >
          <Sun v-if="isDark" class="size-3.5" />
          <Moon v-else class="size-3.5" />
        </button>
      </div>

      <!-- Search -->
      <div class="p-3 border-b border-border">
        <div class="relative">
          <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <input
            v-model="search"
            type="text"
            placeholder="Filter components..."
            class="w-full rounded-md border border-border bg-background pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <!-- Component List -->
      <div class="flex-1 overflow-y-auto p-2 space-y-0.5">
        <div class="px-2 py-1 text-[11px] font-medium text-muted-foreground flex items-center justify-between">
          <span>Components & Blocks</span>
          <span class="font-mono text-[10px]">{{ filteredDemos.length }}</span>
        </div>
        <button
          v-for="item in filteredDemos"
          :key="item.id"
          type="button"
          class="flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-xs transition"
          :class="
            selectedId === item.id
              ? 'bg-primary text-primary-foreground font-medium shadow-xs'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          "
          @click="selectedId = item.id"
        >
          <span class="truncate">{{ item.name }}</span>
          <span class="font-mono text-[10px] opacity-70 ml-2">{{ item.id }}</span>
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex flex-1 flex-col overflow-hidden bg-background">
      <!-- Top Navigation Bar -->
      <header class="flex h-13 items-center justify-between border-b border-border px-6 bg-card/50 backdrop-blur">
        <div class="flex items-center gap-3">
          <h2 class="text-sm font-semibold tracking-tight">{{ demos.find((d) => d.id === selectedId)?.name }}</h2>
          <span class="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            @uipkge/{{ selectedId }}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-muted transition"
            @click="copyCommand(selectedId)"
          >
            <Check v-if="copied" class="size-3 text-success" />
            <Copy v-else class="size-3" />
            <span>npx shadcn-vue add @uipkge/{{ selectedId }}</span>
          </button>
        </div>
      </header>

      <!-- Preview Canvas -->
      <div class="flex-1 overflow-y-auto p-8">
        <div class="mx-auto max-w-4xl">
          <div v-if="loading" class="flex items-center justify-center py-20 text-muted-foreground text-xs font-mono">
            Loading preview...
          </div>
          <component :is="activeComponent" v-else-if="activeComponent" />
          <div v-else class="text-center py-20 text-muted-foreground text-xs">
            Select a component from the sidebar to preview
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
