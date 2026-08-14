<script setup lang="ts">
import { computed, ref } from 'vue'
import { Rocket } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

interface WalkthroughStep {
  id: string
  stepNumber: string
  title: string
  subtitle: string
  description: string
  terminalOutput: string
  badgeText: string
  meta: string
}

const steps: WalkthroughStep[] = [
  {
    id: 'init',
    stepNumber: '01',
    title: 'Initialize Registry Foundation',
    subtitle: 'Zero configuration Tailwind tokens',
    description:
      'Run the init command to pull OKLCH color palettes, calibrated shadow tokens, spring physics curves, and cn() utility functions into your project.',
    terminalOutput: `$ npx shadcn-vue add https://uipkge.dev/r/vue/init.json -y\n✔ Downloaded styles/tailwind.css (OKLCH tokens)\n✔ Injected lib/utils.ts (cn helper)\n✔ Configured @/ alias path mapping`,
    badgeText: 'Instant Scaffolding',
    meta: 'Execution time: 1.4s',
  },
  {
    id: 'primitives',
    stepNumber: '02',
    title: 'Pull Headless Primitives',
    subtitle: 'Reka UI & Radix powered primitives',
    description:
      'Pull accessible, keyboard-friendly primitives like Button, Card, Badge, and Sparklines directly into components/ui/ with full TypeScript type safety.',
    terminalOutput: `$ npx shadcn-vue add @uipkge/button @uipkge/card -y\n✔ Created components/ui/button/Button.vue\n✔ Created components/ui/button/button.variants.ts\n✔ Zero npm package dependencies added`,
    badgeText: 'AST Injection',
    meta: 'Unbundled & Tree-shaken',
  },
  {
    id: 'compose',
    stepNumber: '03',
    title: 'Compose Rich Workbenches',
    subtitle: 'Visible markup with zero hidden templates',
    description:
      'Compose tiles, headers, and interactive state directly in your pages. No hidden wrapper abstractions or rigid data prop constraints.',
    terminalOutput:
      `// In your Vue 3.5 SFC:\n<script setup lang="ts">\nimport { Button } from '@/components/ui/button'\nimport { Card } from '@/components/ui/card'\n<` +
      `/script>\n\n<template>\n  <Card class="p-6">...</Card>\n</template>`,
    badgeText: 'Raw Composition',
    meta: '100% Code Ownership',
  },
  {
    id: 'deploy',
    stepNumber: '04',
    title: 'Ship to Global Edge',
    subtitle: 'Zero runtime overhead',
    description:
      'Deploy to Cloudflare, Vercel, or AWS with sub-millisecond cold starts and pristine 100/100 Core Web Vitals performance.',
    terminalOutput: `$ npm run build\n✔ Client build: 38.4 kB (Gzip: 11.2 kB)\n✔ Lighthouse Performance: 100 / 100\n✔ First Contentful Paint: 0.4s\n🚀 Deployed to Edge CDN`,
    badgeText: 'Production Ready',
    meta: 'Zero CSS-in-JS Runtime',
  },
]

const activeStepIndex = ref(0)
const currentStep = computed(() => steps[activeStepIndex.value])
</script>

<template>
  <section
    data-slot="feature-scroll-spy-walkthrough"
    class="bg-background relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
  >
    <div class="mx-auto max-w-6xl space-y-12">
      <!-- Section Header -->
      <div class="mx-auto max-w-3xl space-y-4 text-center">
        <Badge variant="secondary" class="gap-1.5 px-3 py-1 font-mono text-xs shadow-xs">
          <Rocket class="text-primary size-3.5" />
          End-to-End Developer Journey
        </Badge>
        <h2 class="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
          From first command to global production in minutes.
        </h2>
        <p class="text-muted-foreground text-base">
          Follow the 4-stage unbundled workflow that gives your team total freedom and zero maintenance fatigue.
        </p>
      </div>

      <!-- Interactive 2-Column Split: Steps Rail on Left, Sticky Live Sandbox on Right -->
      <div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <!-- Left: Step Navigation Cards (5 Cols) -->
        <div class="space-y-3 lg:col-span-5">
          <div
            v-for="(st, idx) in steps"
            :key="st.id"
            class="group relative cursor-pointer overflow-hidden rounded-2xl border p-5 text-left transition-all"
            :class="
              activeStepIndex === idx
                ? 'border-primary/80 bg-card ring-primary/20 shadow-lg ring-1'
                : 'border-border/70 bg-card/40 hover:border-border hover:bg-card/70'
            "
            @click="activeStepIndex = idx"
          >
            <div class="flex items-start gap-4">
              <div
                class="flex size-8 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold transition-colors"
                :class="
                  activeStepIndex === idx
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-muted text-muted-foreground'
                "
              >
                {{ st.stepNumber }}
              </div>

              <div class="min-w-0 flex-1 space-y-1">
                <div class="flex items-center justify-between">
                  <h3 class="text-foreground truncate font-mono text-sm font-bold">{{ st.title }}</h3>
                  <Badge variant="outline" class="ml-2 shrink-0 font-mono text-xs">
                    {{ st.badgeText }}
                  </Badge>
                </div>
                <p class="text-muted-foreground text-xs leading-relaxed">{{ st.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Sticky Live Sandbox Terminal Display (7 Cols) -->
        <Card
          class="border-border bg-card/95 sticky top-24 space-y-6 rounded-2xl p-6 text-left shadow-sm sm:p-8 lg:col-span-7"
        >
          <!-- Terminal Header Bar -->
          <div class="border-border flex items-center justify-between border-b pb-4">
            <div class="flex items-center gap-2">
              <div class="size-3 rounded-full bg-red-500/80" />
              <div class="size-3 rounded-full bg-amber-500/80" />
              <div class="size-3 rounded-full bg-emerald-500/80" />
              <span class="text-muted-foreground ml-2 font-mono text-xs">
                stage_{{ currentStep.stepNumber }}_{{ currentStep.id }}.sh
              </span>
            </div>
            <Badge
              variant="secondary"
              class="border-emerald-500/20 bg-emerald-500/10 font-mono text-xs text-emerald-600 dark:text-emerald-400"
            >
              {{ currentStep.meta }}
            </Badge>
          </div>

          <!-- Code Sandbox Body -->
          <div class="space-y-2">
            <pre
              class="border-border bg-muted/40 text-foreground overflow-x-auto rounded-xl border p-5 font-mono text-xs leading-relaxed whitespace-pre-wrap"
            ><code>{{ currentStep.terminalOutput }}</code></pre>
          </div>

          <!-- Step Progression Navigator -->
          <div class="border-border flex items-center justify-between border-t pt-2 font-mono text-xs">
            <button
              type="button"
              class="text-muted-foreground hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
              :disabled="activeStepIndex === 0"
              @click="activeStepIndex--"
            >
              &larr; Previous Step
            </button>

            <span class="text-muted-foreground">Step {{ activeStepIndex + 1 }} of {{ steps.length }}</span>

            <button
              type="button"
              class="text-primary font-semibold hover:underline disabled:pointer-events-none disabled:opacity-30"
              :disabled="activeStepIndex === steps.length - 1"
              @click="activeStepIndex++"
            >
              Next Step &rarr;
            </button>
          </div>
        </Card>
      </div>
    </div>
  </section>
</template>
