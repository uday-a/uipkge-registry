<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Check,
  Copy,
  Eye,
  EyeOff,
  Layers,
  RotateCcw,
  Sparkles,
} from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface LayoutWidget {
  id: string
  name: string
  category: string
  visible: boolean
  colSpan: number
  previewSnippet: string
}

export interface FeatureDragDropOrganizerProps {
  title?: string
  description?: string
  class?: string
}

const INITIAL_WIDGETS: LayoutWidget[] = [
  {
    id: 'widget-kpi',
    name: 'Real-time KPI Metrics',
    category: 'Analytics',
    visible: true,
    colSpan: 12,
    previewSnippet: '3 Cards: $124.5k MRR • 18ms Latency • 99.99% Uptime',
  },
  {
    id: 'widget-chart',
    name: 'Traffic Sparkline Chart',
    category: 'Telemetry',
    visible: true,
    colSpan: 8,
    previewSnippet: 'SVG Real-time stream (35,000 req/s live)',
  },
  {
    id: 'widget-nodes',
    name: 'Edge PoP Status',
    category: 'Infrastructure',
    visible: true,
    colSpan: 4,
    previewSnippet: '8 global edge regions active (optimal)',
  },
  {
    id: 'widget-feed',
    name: 'Deployment Activity Feed',
    category: 'Workflows',
    visible: true,
    colSpan: 12,
    previewSnippet: 'sha-a81f9c deployed to edge via CLI (2 mins ago)',
  },
]

const props = withDefaults(defineProps<FeatureDragDropOrganizerProps>(), {
  title: 'Arrange dashboard layouts intuitively with zero boilerplate.',
  description:
    'Customize widget order, toggle component visibility, and export clean declarative JSON layout schemas for your application.',
})

const widgets = ref<LayoutWidget[]>([...INITIAL_WIDGETS])
const copied = ref(false)

function moveWidget(index: number, direction: 'up' | 'down') {
  const targetIndex = direction === 'up' ? index - 1 : index + 1
  if (targetIndex < 0 || targetIndex >= widgets.value.length) return

  const updated = [...widgets.value]
  const [removed] = updated.splice(index, 1)
  updated.splice(targetIndex, 0, removed)
  widgets.value = updated
}

function toggleVisibility(index: number) {
  widgets.value[index].visible = !widgets.value[index].visible
}

function resetLayout() {
  widgets.value = JSON.parse(JSON.stringify(INITIAL_WIDGETS))
}

const exportJson = computed(() => {
  return JSON.stringify(
    widgets.value.map((w, idx) => ({
      order: idx,
      id: w.id,
      name: w.name,
      visible: w.visible,
      colSpan: w.colSpan,
    })),
    null,
    2,
  )
})

async function copyJson() {
  try {
    await navigator.clipboard.writeText(exportJson.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    // fallback
  }
}
</script>

<template>
  <section
    data-slot="feature-drag-drop-organizer"
    :class="cn('bg-background relative overflow-hidden py-16 sm:py-24', props.class)"
  >
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="mx-auto max-w-3xl space-y-4 text-center">
        <a
          href="#layout-organizer"
          class="group border-border/80 bg-secondary/60 hover:bg-secondary text-foreground inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-medium shadow-2xs transition-colors"
        >
          <Sparkles class="text-primary size-3.5" />
          <span>Composable Layout Workbench</span>
          <ArrowRight class="text-muted-foreground size-3 transition-transform group-hover:translate-x-0.5" />
        </a>

        <h2 class="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
          {{ title }}
        </h2>

        <p class="text-muted-foreground text-base sm:text-lg">
          {{ description }}
        </p>
      </div>

      <!-- Workbench Grid (2 Columns: Controls & Live Canvas) -->
      <div class="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <!-- Left: Widget Re-ordering Controls (6 Cols) -->
        <Card class="border-border bg-card/80 flex flex-col justify-between shadow-xs backdrop-blur-xs lg:col-span-6">
          <CardContent class="space-y-5 p-6">
            <div class="border-border flex items-center justify-between border-b pb-3">
              <div class="flex items-center gap-2">
                <Layers class="text-primary size-4" />
                <span class="text-foreground text-sm font-semibold">Widget Hierarchy</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                class="text-muted-foreground hover:text-foreground h-7 gap-1 px-2 font-mono text-xs"
                @click="resetLayout"
              >
                <RotateCcw class="size-3" />
                <span>Reset</span>
              </Button>
            </div>

            <!-- Reorderable List of Widgets -->
            <div class="space-y-2">
              <div
                v-for="(widget, idx) in widgets"
                :key="widget.id"
                :class="
                  cn(
                    'flex items-center justify-between rounded-lg border p-3 transition-all',
                    widget.visible ? 'border-border bg-background' : 'border-border/60 bg-muted/30 opacity-60',
                  )
                "
              >
                <div class="flex min-w-0 items-center gap-3">
                  <div class="text-muted-foreground flex items-center gap-1">
                    <button
                      type="button"
                      :disabled="idx === 0"
                      class="hover:bg-muted rounded p-1 transition-colors disabled:opacity-30"
                      @click="moveWidget(idx, 'up')"
                    >
                      <ArrowUp class="size-3.5" />
                    </button>
                    <button
                      type="button"
                      :disabled="idx === widgets.length - 1"
                      class="hover:bg-muted rounded p-1 transition-colors disabled:opacity-30"
                      @click="moveWidget(idx, 'down')"
                    >
                      <ArrowDown class="size-3.5" />
                    </button>
                  </div>

                  <div class="min-w-0 space-y-0.5">
                    <div class="flex items-center gap-2">
                      <span class="text-foreground text-xs font-bold">{{ widget.name }}</span>
                      <Badge variant="outline" class="border-border text-muted-foreground text-xs">
                        {{ widget.category }}
                      </Badge>
                    </div>
                    <div class="text-muted-foreground truncate text-xs">{{ widget.previewSnippet }}</div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  class="text-muted-foreground hover:text-foreground size-8 shrink-0"
                  @click="toggleVisibility(idx)"
                >
                  <Eye v-if="widget.visible" class="text-primary size-3.5" />
                  <EyeOff v-else class="size-3.5" />
                </Button>
              </div>
            </div>

            <!-- Export JSON Box -->
            <div class="border-border space-y-2 border-t pt-2">
              <div class="flex items-center justify-between text-xs">
                <span class="text-foreground font-medium">Generated Layout JSON</span>
                <Button variant="ghost" size="sm" class="h-6 gap-1 px-2 font-mono text-xs" @click="copyJson">
                  <Check v-if="copied" class="text-primary size-3" />
                  <Copy v-else class="size-3" />
                  <span>{{ copied ? 'Copied' : 'Copy JSON' }}</span>
                </Button>
              </div>
              <pre
                class="border-border bg-muted/40 text-muted-foreground max-h-32 overflow-y-auto rounded-lg border p-2.5 font-mono text-xs"
              ><code>{{ exportJson }}</code></pre>
            </div>
          </CardContent>
        </Card>

        <!-- Right: Live Canvas Preview (6 Cols) -->
        <Card class="border-border bg-card/80 flex flex-col justify-between shadow-xs backdrop-blur-xs lg:col-span-6">
          <CardContent class="space-y-4 p-6">
            <div class="border-border flex items-center justify-between border-b pb-3">
              <div class="flex items-center gap-2">
                <Activity class="size-4 text-emerald-500" />
                <span class="text-foreground text-sm font-semibold">Rendered Canvas Preview</span>
              </div>
              <span class="font-mono text-xs text-emerald-500">Live Synchronized</span>
            </div>

            <!-- Simulated Dashboard Canvas with Reordered Components -->
            <div class="border-border/80 bg-background/80 space-y-3 rounded-lg border p-4">
              <template v-for="widget in widgets" :key="widget.id">
                <div
                  v-if="widget.visible"
                  class="border-border bg-muted/30 space-y-1 rounded-lg border p-3 transition-all"
                >
                  <div class="text-foreground flex items-center justify-between text-xs font-semibold">
                    <span>{{ widget.name }}</span>
                    <span class="text-muted-foreground font-mono text-xs">col-span-{{ widget.colSpan }}</span>
                  </div>
                  <div class="text-muted-foreground text-xs">{{ widget.previewSnippet }}</div>
                </div>
              </template>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>
