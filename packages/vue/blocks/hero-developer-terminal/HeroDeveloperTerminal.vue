<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { ArrowRight, Check, Code2, Copy, RotateCcw } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface CommandPreset {
  id: string
  label: string
  command: string
  output: string[]
}

const presets: CommandPreset[] = [
  {
    id: 'init',
    label: '1. Init Theme',
    command: 'npx shadcn-vue@latest add https://uipkge.dev/r/vue/init.json',
    output: [
      '✔ Resolving registry dependencies...',
      '✔ Downloaded packages/shared/styles/tailwind.css (OKLCH @theme inline)',
      '✔ Configured cn() utility in src/lib/utils.ts',
      '✔ Injected useTheme composable with system preference sync',
      '✔ UIPKGE bootstrap complete in 124ms.',
    ],
  },
  {
    id: 'component',
    label: '2. Add KPI Grid',
    command: 'npx shadcn-vue@latest add https://uipkge.dev/r/vue/kpi-grid.json',
    output: [
      '✔ Fetched manifest for kpi-grid (registry:ui)',
      '✔ Added components/ui/kpi-grid/KpiGrid.vue',
      '✔ Verified CVA variants in kpi-grid.variants.ts',
      '✔ Installed transitive primitives: Card, Badge, Sparkline',
      '✔ Zero npm bundle overhead added to node_modules.',
    ],
  },
  {
    id: 'verify',
    label: '3. Parity Check',
    command: 'npm run check:parity',
    output: [
      '✔ Checking 31 shared CVA variant definitions...',
      '✔ Validating Vue 3.5 SFC and React 19 TSX type contracts...',
      '✔ Token synchronization: styles/tailwind.css (100% match)',
      '✔ PASS: Full cross-framework parity confirmed across all 300+ items.',
    ],
  },
]

const activePresetIndex = ref(0)
const activeTab = ref<'terminal' | 'source'>('terminal')
const displayedLines = ref<string[]>([])
const isExecuting = ref(false)
const copied = ref(false)
const executionSpeed = ref<1 | 2>(1)

let executionTimeout: ReturnType<typeof setTimeout> | undefined

function runPreset(index: number) {
  activePresetIndex.value = index
  activeTab.value = 'terminal'
  displayedLines.value = []
  isExecuting.value = true

  if (executionTimeout) clearTimeout(executionTimeout)

  const currentPreset = presets[index]
  const lines = currentPreset.output
  const delay = executionSpeed.value === 1 ? 160 : 70

  lines.forEach((line, i) => {
    executionTimeout = setTimeout(
      () => {
        displayedLines.value.push(line)
        if (i === lines.length - 1) {
          isExecuting.value = false
        }
      },
      (i + 1) * delay,
    )
  })
}

function copyCommand() {
  const current = presets[activePresetIndex.value]
  navigator.clipboard.writeText(current.command)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}

onMounted(() => {
  runPreset(0)
})

onUnmounted(() => {
  if (executionTimeout) clearTimeout(executionTimeout)
})

const currentPreset = computed(() => presets[activePresetIndex.value])
</script>

<template>
  <section
    data-slot="hero-developer-terminal"
    class="bg-background relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
  >
    <!-- Subtle Background Glow -->
    <div
      class="bg-primary/5 pointer-events-none absolute -top-40 left-1/2 -z-10 h-96 w-full max-w-7xl -translate-x-1/2 rounded-full blur-3xl"
    />

    <div class="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
      <!-- Left Column: Value Proposition & CTAs (6 Cols) -->
      <div class="space-y-6 text-left lg:col-span-6">
        <!-- Parity Badge -->
        <div
          class="border-border bg-muted/40 inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-xs shadow-xs"
        >
          <span class="size-2 animate-pulse rounded-full bg-emerald-500" />
          <span class="text-foreground font-medium">Dual-Framework UI Registry</span>
          <span class="text-muted-foreground">&bull;</span>
          <span class="text-muted-foreground">Vue 3.5 & React 19</span>
        </div>

        <!-- Main Headline -->
        <h1 class="text-foreground text-4xl leading-[1.1] font-bold tracking-tight sm:text-5xl lg:text-6xl">
          The unbundled UI registry for design engineers.
        </h1>

        <!-- Subtitle -->
        <p class="text-muted-foreground max-w-xl text-base leading-relaxed sm:text-lg">
          Own your source code. Copy production-grade components and dense workbenches directly into your project with
          zero npm runtime lock-in.
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-wrap items-center gap-3 pt-2">
          <Button as="a" href="#components" size="lg" class="gap-2 font-semibold shadow-xs">
            <span>Explore 300+ Blocks</span>
            <ArrowRight class="size-4" />
          </Button>

          <Button as="a" href="#spec" variant="outline" size="lg" class="gap-2 font-medium">
            <Code2 class="text-muted-foreground size-4" />
            <span>Registry Spec</span>
          </Button>
        </div>

        <!-- Telemetry Metrics Strip -->
        <div class="border-border/80 grid grid-cols-3 gap-4 border-t pt-6 text-left">
          <div>
            <p class="text-foreground font-mono text-2xl font-bold">300+</p>
            <p class="text-muted-foreground mt-0.5 text-xs">Workbenches & Primitives</p>
          </div>
          <div>
            <p class="text-foreground font-mono text-2xl font-bold">0 kB</p>
            <p class="text-muted-foreground mt-0.5 text-xs">Runtime Package Bloat</p>
          </div>
          <div>
            <p class="text-foreground font-mono text-2xl font-bold">100%</p>
            <p class="text-muted-foreground mt-0.5 text-xs">Cross-Framework Parity</p>
          </div>
        </div>
      </div>

      <!-- Right Column: Interactive Developer Terminal Workbench (6 Cols) -->
      <div class="lg:col-span-6">
        <Card class="border-border bg-card overflow-hidden rounded-xl shadow-sm">
          <!-- Terminal Header -->
          <div class="border-border bg-muted/40 flex items-center justify-between border-b px-4 py-2.5">
            <!-- Window Controls & File Path -->
            <div class="flex items-center gap-2">
              <div class="flex gap-1.5">
                <div class="size-3 rounded-full bg-red-500/80" />
                <div class="size-3 rounded-full bg-amber-500/80" />
                <div class="size-3 rounded-full bg-emerald-500/80" />
              </div>
              <span class="text-muted-foreground ml-2 font-mono text-xs">uipkge-cli &mdash; bash</span>
            </div>

            <!-- Action Controls -->
            <div class="flex items-center gap-1.5">
              <!-- Speed Selector -->
              <button
                type="button"
                class="border-border bg-background text-muted-foreground hover:text-foreground rounded border px-2 py-0.5 font-mono text-xs transition-colors"
                @click="executionSpeed = executionSpeed === 1 ? 2 : 1"
              >
                {{ executionSpeed }}x speed
              </button>

              <!-- Copy Button -->
              <button
                type="button"
                class="border-border bg-background text-muted-foreground hover:text-foreground flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-xs transition-colors"
                @click="copyCommand"
              >
                <Check v-if="copied" class="size-3 text-emerald-500" />
                <Copy v-else class="size-3" />
                <span>{{ copied ? 'Copied' : 'Copy' }}</span>
              </button>
            </div>
          </div>

          <!-- Preset Navigation Tabs -->
          <div class="border-border/80 bg-muted/20 flex items-center overflow-x-auto border-b px-2">
            <button
              v-for="(preset, idx) in presets"
              :key="preset.id"
              type="button"
              class="border-b-2 px-3 py-2 font-mono text-xs whitespace-nowrap transition-colors"
              :class="
                activePresetIndex === idx
                  ? 'border-primary text-foreground bg-background/50 font-semibold'
                  : 'text-muted-foreground hover:text-foreground border-transparent'
              "
              @click="runPreset(idx)"
            >
              {{ preset.label }}
            </button>
          </div>

          <!-- Terminal Content Viewport -->
          <div class="bg-card min-h-[220px] space-y-3 p-4 font-mono text-xs sm:p-5">
            <!-- Command Input Line -->
            <div class="text-foreground flex items-start gap-2">
              <span class="text-primary font-bold select-none">&gt;</span>
              <span class="text-foreground font-medium break-all">{{ currentPreset.command }}</span>
            </div>

            <!-- Output Lines -->
            <div class="space-y-1.5 pt-1">
              <div
                v-for="(line, idx) in displayedLines"
                :key="idx"
                class="text-muted-foreground flex items-center gap-2 transition-all duration-150"
              >
                <span class="shrink-0 font-bold text-emerald-500 select-none">&check;</span>
                <span class="text-xs">{{ line.replace(/^✔\s*/, '') }}</span>
              </div>

              <!-- Typing / Loading Cursor -->
              <div v-if="isExecuting" class="text-muted-foreground flex items-center gap-2 pt-1">
                <span class="bg-primary size-1.5 rounded-full" />
                <span class="text-muted-foreground text-xs italic">Streaming AST payload...</span>
              </div>
            </div>
          </div>

          <!-- Terminal Footer Status Bar -->
          <div
            class="border-border bg-muted/30 text-muted-foreground flex items-center justify-between border-t px-4 py-2 font-mono text-xs"
          >
            <div class="flex items-center gap-2">
              <span class="size-2 rounded-full bg-emerald-500" />
              <span>Registry v2.4.0 (OKLCH)</span>
            </div>
            <button
              type="button"
              class="text-primary inline-flex items-center gap-1 hover:underline"
              @click="runPreset(activePresetIndex)"
            >
              <RotateCcw class="size-3" />
              <span>Re-run</span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  </section>
</template>
