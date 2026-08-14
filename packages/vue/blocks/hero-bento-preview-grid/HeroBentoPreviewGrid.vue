<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Code2,
  Cpu,
  Moon,
  Palette,
  Play,
  Sparkles,
  Sun,
  Zap,
} from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

// Tile 1: OKLCH Palette preview state
const colorThemes = [
  { name: 'Emerald', hue: 'oklch(0.65 0.22 145)', hex: '#10b981' },
  { name: 'Indigo', hue: 'oklch(0.60 0.24 275)', hex: '#6366f1' },
  { name: 'Amber', hue: 'oklch(0.75 0.18 70)', hex: '#f59e0b' },
  { name: 'Rose', hue: 'oklch(0.65 0.24 15)', hex: '#f43f5e' },
]
const activeColorIndex = ref(0)
const isDarkPreview = ref(true)

// Tile 2: Dual framework parity toggle
const activeFramework = ref<'vue' | 'react'>('vue')

// Tile 3: Bundle slider
const componentCount = ref(12)
const estimatedSavings = computed(() => (componentCount.value * 42).toFixed(0))

// Tile 4: Query execution simulator
const isRunningQuery = ref(false)
const queryLatency = ref('12ms')

function triggerQuery() {
  isRunningQuery.value = true
  setTimeout(() => {
    queryLatency.value = `${Math.floor(Math.random() * 8) + 8}ms`
    isRunningQuery.value = false
  }, 400)
}
</script>

<template>
  <section
    data-slot="hero-bento-preview-grid"
    class="bg-background relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
  >
    <!-- Center Ambient Glow -->
    <div
      class="bg-primary/10 pointer-events-none absolute top-1/4 left-1/2 -z-10 h-96 w-full max-w-5xl -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl"
    />

    <div class="mx-auto max-w-7xl space-y-12 text-center">
      <!-- Headline & Subtitle -->
      <div class="mx-auto max-w-3xl space-y-5">
        <Badge variant="secondary" class="gap-1.5 px-3 py-1 font-mono text-xs shadow-xs">
          <Sparkles class="text-primary size-3.5" />
          The Unbundled Design Engineering Platform
        </Badge>

        <h1 class="text-foreground text-4xl leading-[1.12] font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Everything design engineers need to build at lightspeed.
        </h1>

        <p class="text-muted-foreground text-base leading-relaxed sm:text-lg">
          Tactile workbenches, OKLCH fluid color palettes, and guaranteed cross-framework parity—composed right in your
          hero.
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button as="a" href="#explore" size="lg" class="gap-2 font-semibold shadow-xs">
            <span>Explore 300+ Workbenches</span>
            <ArrowRight class="size-4" />
          </Button>

          <Button as="a" href="#docs" variant="outline" size="lg" class="gap-2 font-medium">
            <Code2 class="text-muted-foreground size-4" />
            <span>View Architecture</span>
          </Button>
        </div>
      </div>

      <!-- 3-Column Asymmetric Bento Hero Grid -->
      <div class="mx-auto grid max-w-6xl grid-cols-1 gap-4 pt-4 text-left sm:gap-6 md:grid-cols-3">
        <!-- Tile 1: OKLCH Theme Customizer (2 Cols) -->
        <Card
          class="border-border bg-card/95 flex flex-col justify-between space-y-6 rounded-2xl p-6 shadow-lg backdrop-blur-md md:col-span-2"
        >
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-primary inline-flex items-center gap-1.5 font-mono text-xs font-semibold">
                <Palette class="size-3.5" /> OKLCH Dynamic Theme Engine
              </span>
              <Badge variant="outline" class="font-mono text-xs">Zero Runtime CSS</Badge>
            </div>
            <h3 class="text-foreground text-lg font-bold">Interactive Palette & Contrast Synthesizer</h3>
            <p class="text-muted-foreground text-xs">
              Select a brand accent and watch UI components dynamically adjust perceptual contrast.
            </p>
          </div>

          <!-- Color Buttons & Live Preview -->
          <div class="border-border bg-background/60 space-y-4 rounded-xl border p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <button
                  v-for="(c, idx) in colorThemes"
                  :key="c.name"
                  type="button"
                  class="size-6 rounded-full border-2 transition-transform"
                  :class="
                    activeColorIndex === idx
                      ? 'border-foreground scale-125 shadow-xs'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  "
                  :style="{ backgroundColor: c.hex }"
                  @click="activeColorIndex = idx"
                />
              </div>

              <div class="text-muted-foreground flex items-center gap-1 font-mono text-xs">
                <span>Mode:</span>
                <button
                  type="button"
                  class="border-border hover:bg-muted rounded border p-1 transition-colors"
                  @click="isDarkPreview = !isDarkPreview"
                >
                  <Sun v-if="!isDarkPreview" class="size-3.5 text-amber-500" />
                  <Moon v-else class="size-3.5 text-indigo-400" />
                </button>
              </div>
            </div>

            <!-- Live Button Demo with Active Hue -->
            <div class="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                class="rounded-lg px-4 py-2 text-xs font-semibold text-white shadow-xs transition-transform active:scale-95"
                :style="{ backgroundColor: colorThemes[activeColorIndex].hex }"
              >
                Synthesized Action Button
              </button>
              <button
                type="button"
                class="border-border bg-background text-foreground hover:bg-muted rounded-lg border px-4 py-2 text-xs font-medium transition-colors"
              >
                Secondary Token
              </button>
            </div>
          </div>
        </Card>

        <!-- Tile 2: Dual Framework Parity (1 Col) -->
        <Card
          class="border-border bg-card/95 flex flex-col justify-between space-y-4 rounded-2xl p-6 shadow-lg backdrop-blur-md"
        >
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span
                class="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400"
              >
                <CheckCircle2 class="size-3.5" /> 100% Mirror Parity
              </span>
            </div>
            <h3 class="text-foreground text-lg font-bold">Vue 3.5 & React 19</h3>
            <p class="text-muted-foreground text-xs">
              Identical CVA variant matrix and AST output across both frameworks.
            </p>
          </div>

          <!-- Framework Toggle -->
          <div class="space-y-3">
            <div class="bg-muted/40 border-border grid grid-cols-2 gap-1 rounded-lg border p-1">
              <button
                type="button"
                class="rounded-md py-1.5 font-mono text-xs font-semibold transition-all"
                :class="
                  activeFramework === 'vue' ? 'bg-background text-emerald-600 shadow-xs' : 'text-muted-foreground'
                "
                @click="activeFramework = 'vue'"
              >
                Vue 3.5 SFC
              </button>
              <button
                type="button"
                class="rounded-md py-1.5 font-mono text-xs font-semibold transition-all"
                :class="activeFramework === 'react' ? 'bg-background text-blue-600 shadow-xs' : 'text-muted-foreground'"
                @click="activeFramework = 'react'"
              >
                React 19 TSX
              </button>
            </div>

            <!-- Code snippet snippet -->
            <div class="bg-muted/30 border-border/80 text-muted-foreground rounded-lg border p-3 font-mono text-xs">
              <span class="text-primary font-bold">&gt;</span>
              <span v-if="activeFramework === 'vue'"> &lt;Button variant="primary"&gt;</span>
              <span v-else> &lt;Button variant="primary"&gt;</span>
              <div class="mt-0.5 font-medium text-emerald-500">&check; CVA Type Contract Validated</div>
            </div>
          </div>
        </Card>

        <!-- Tile 3: Zero Bundle Bloat Calculator (1 Col) -->
        <Card
          class="border-border bg-card/95 flex flex-col justify-between space-y-4 rounded-2xl p-6 shadow-lg backdrop-blur-md"
        >
          <div class="space-y-2">
            <span class="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-amber-500">
              <Cpu class="size-3.5" /> Zero NPM Overhead
            </span>
            <h3 class="text-foreground text-lg font-bold">Own Your Source Code</h3>
            <p class="text-muted-foreground text-xs">
              Slide to calculate bundle weight saved compared to monolithic packages.
            </p>
          </div>

          <!-- Slider Widget -->
          <div class="border-border bg-background/60 space-y-3 rounded-xl border p-4">
            <div class="flex items-center justify-between font-mono text-xs">
              <span class="text-muted-foreground">Installed Blocks:</span>
              <span class="text-foreground font-bold">{{ componentCount }}</span>
            </div>
            <input
              v-model.number="componentCount"
              type="range"
              min="1"
              max="50"
              class="accent-primary w-full cursor-pointer"
            />
            <div class="border-border/60 flex items-center justify-between border-t pt-1 font-mono text-xs">
              <span class="text-muted-foreground">Bundle Saved:</span>
              <span class="font-mono font-bold text-emerald-500">~{{ estimatedSavings }} kB</span>
            </div>
          </div>
        </Card>

        <!-- Tile 4: Sub-millisecond Execution Speed (2 Cols) -->
        <Card
          class="border-border bg-card/95 flex flex-col justify-between space-y-4 rounded-2xl p-6 shadow-lg backdrop-blur-md md:col-span-2"
        >
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <span class="text-primary inline-flex items-center gap-1.5 font-mono text-xs font-semibold">
                <Zap class="size-3.5" /> Instant Hydration & Zero Latency
              </span>
              <h3 class="text-foreground text-lg font-bold">Edge Optimized Architecture</h3>
            </div>
            <Button size="sm" variant="outline" class="gap-1.5 font-mono text-xs" @click="triggerQuery">
              <Play v-if="!isRunningQuery" class="size-3 fill-current" />
              <Activity v-else class="size-3 animate-spin" />
              <span>Ping Edge</span>
            </Button>
          </div>

          <!-- Latency Telemetry Row -->
          <div class="grid grid-cols-3 gap-3">
            <div class="border-border bg-background/50 space-y-0.5 rounded-xl border p-3">
              <p class="text-muted-foreground font-mono text-xs">Round-Trip Latency</p>
              <p class="font-mono text-xl font-bold text-emerald-500">{{ queryLatency }}</p>
            </div>
            <div class="border-border bg-background/50 space-y-0.5 rounded-xl border p-3">
              <p class="text-muted-foreground font-mono text-xs">DOM Mutation Time</p>
              <p class="text-foreground font-mono text-xl font-bold">&lt; 1.2ms</p>
            </div>
            <div class="border-border bg-background/50 space-y-0.5 rounded-xl border p-3">
              <p class="text-muted-foreground font-mono text-xs">Accessibility Score</p>
              <p class="text-primary font-mono text-xl font-bold">100 / 100</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </section>
</template>
