<script setup lang="ts">
import { computed, ref } from 'vue'
import { Command, CornerDownLeft, FileCode, FolderGit2, Layers, Palette, Search, Sparkles, Zap } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface CommandAction {
  id: string
  title: string
  category: 'Components' | 'Themes' | 'Git' | 'Workflows'
  shortcut: string[]
  icon: any
  description: string
  status: string
}

export interface HeroTypingCommandCenterProps {
  title?: string
  description?: string
  class?: string
}

const props = withDefaults(defineProps<HeroTypingCommandCenterProps>(), {
  title: 'Execute workflows at the speed of thought with keyboard command palette.',
  description:
    'Instant component insertion, theme switching, git branches, and automated deployment pipelines driven by zero-latency hotkeys.',
})

const searchQuery = ref('')
const selectedIndex = ref(0)
const executedAction = ref<CommandAction | null>(null)

const actions: CommandAction[] = [
  {
    id: 'add-pdp',
    title: 'Insert Product Detail Page',
    category: 'Components',
    shortcut: ['⌘', 'I', 'P'],
    icon: Layers,
    description: 'Adds flagship unbundled PDP with gallery, reviews & buy box',
    status: 'Ready to inject',
  },
  {
    id: 'toggle-dark',
    title: 'Toggle High-Contrast Dark Theme',
    category: 'Themes',
    shortcut: ['⌘', 'T'],
    icon: Palette,
    description: 'Switches active OKLCH tokens to studio obsidian mode',
    status: 'Instant update',
  },
  {
    id: 'git-branch',
    title: 'Checkout Release Branch: v2.4.0',
    category: 'Git',
    shortcut: ['⌘', 'G', 'B'],
    icon: FolderGit2,
    description: 'Switches workspace to staging pipeline branch',
    status: 'Clean working tree',
  },
  {
    id: 'sync-registry',
    title: 'Synchronize Dual-Framework ASTs',
    category: 'Workflows',
    shortcut: ['⌘', 'S', 'Y'],
    icon: FileCode,
    description: 'Generates parity manifests between Vue 3.5 and React 19',
    status: 'Verified 100% parity',
  },
  {
    id: 'run-audit',
    title: 'Trigger Automated Craft Audit',
    category: 'Workflows',
    shortcut: ['⌘', 'A', 'U'],
    icon: Zap,
    description: 'Validates semantic scales, AA contrast and eliminates design slop',
    status: 'Zero regressions',
  },
]

const filteredActions = computed(() => {
  if (!searchQuery.value.trim()) return actions
  const q = searchQuery.value.toLowerCase()
  return actions.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q),
  )
})

function execute(action: CommandAction) {
  executedAction.value = action
  setTimeout(() => {
    executedAction.value = null
  }, 2500)
}
</script>

<template>
  <section
    data-slot="hero-typing-command-center"
    :class="cn('bg-background relative overflow-hidden py-16 sm:py-24 lg:py-28', props.class)"
  >
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
        <!-- Left: Headline & Key Advantages (5 Cols) -->
        <div class="space-y-6 lg:col-span-5">
          <div
            class="border-border/80 bg-secondary/60 text-foreground inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-medium shadow-2xs"
          >
            <Command class="text-primary size-3.5" />
            <span>Keyboard Ergonomics &bull; Zero Latency</span>
          </div>

          <h1 class="text-foreground text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {{ title }}
          </h1>

          <p class="text-muted-foreground text-base sm:text-lg">
            {{ description }}
          </p>

          <!-- Hotkey Highlights Grid -->
          <div class="border-border bg-muted/20 grid grid-cols-2 gap-3 rounded-xl border p-4 text-xs">
            <div class="space-y-1">
              <div class="text-muted-foreground font-medium">Global Trigger</div>
              <div class="flex items-center gap-1 font-mono">
                <kbd class="border-border bg-card rounded border px-1.5 py-0.5 shadow-2xs">⌘</kbd>
                <kbd class="border-border bg-card rounded border px-1.5 py-0.5 shadow-2xs">K</kbd>
              </div>
            </div>
            <div class="space-y-1">
              <div class="text-muted-foreground font-medium">Quick Insert</div>
              <div class="flex items-center gap-1 font-mono">
                <kbd class="border-border bg-card rounded border px-1.5 py-0.5 shadow-2xs">⌘</kbd>
                <kbd class="border-border bg-card rounded border px-1.5 py-0.5 shadow-2xs">I</kbd>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Interactive Command Palette Hub (7 Cols) -->
        <div class="lg:col-span-7">
          <Card class="border-border bg-card shadow-lg">
            <!-- Search Header -->
            <div class="border-border flex items-center gap-3 border-b px-4 py-3">
              <Search class="text-muted-foreground size-4 shrink-0" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Type a command or search actions (e.g., 'insert', 'git', 'theme')..."
                class="placeholder:text-muted-foreground text-foreground flex-1 bg-transparent text-sm outline-none"
              />
              <div class="text-muted-foreground flex items-center gap-1 font-mono text-xs">
                <kbd class="border-border bg-muted rounded border px-1.5 py-0.5 text-xs">ESC</kbd>
              </div>
            </div>

            <!-- Command List -->
            <CardContent class="space-y-1 p-2">
              <button
                v-for="(action, idx) in filteredActions"
                :key="action.id"
                type="button"
                :class="
                  cn(
                    'group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-all',
                    selectedIndex === idx
                      ? 'border-primary/30 bg-accent text-accent-foreground border'
                      : 'hover:bg-muted/50 text-foreground border border-transparent',
                  )
                "
                @mouseenter="selectedIndex = idx"
                @click="execute(action)"
              >
                <div class="flex min-w-0 items-center gap-3">
                  <div
                    class="border-border bg-background flex size-8 shrink-0 items-center justify-center rounded-md border shadow-2xs"
                  >
                    <component :is="action.icon" class="text-primary size-4" />
                  </div>
                  <div class="min-w-0 space-y-0.5">
                    <div class="flex items-center gap-2">
                      <span class="truncate text-xs font-semibold">{{ action.title }}</span>
                      <Badge variant="outline" class="h-4.5 px-1.5 text-xs">{{ action.category }}</Badge>
                    </div>
                    <p class="text-muted-foreground truncate text-xs">{{ action.description }}</p>
                  </div>
                </div>

                <!-- Shortcut Badge Group -->
                <div class="ml-3 flex shrink-0 items-center gap-1 font-mono text-xs">
                  <kbd
                    v-for="(key, kIdx) in action.shortcut"
                    :key="kIdx"
                    class="border-border bg-background rounded border px-1.5 py-0.5 text-xs shadow-2xs"
                  >
                    {{ key }}
                  </kbd>
                </div>
              </button>
            </CardContent>

            <!-- Status Footer -->
            <div class="border-border bg-muted/30 flex items-center justify-between border-t px-4 py-2.5 text-xs">
              <div class="text-muted-foreground flex items-center gap-2">
                <CornerDownLeft class="size-3.5" />
                <span>Press <strong>Enter</strong> to run</span>
              </div>
              <div
                v-if="executedAction"
                class="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400"
              >
                <Sparkles class="size-3.5" />
                <span>Executed: {{ executedAction.title }}</span>
              </div>
              <div v-else class="text-muted-foreground font-mono text-xs">
                {{ filteredActions.length }} actions available
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  </section>
</template>
