<script setup lang="ts">
import { computed, ref } from 'vue'
import { Activity, Check, CheckCircle2, Code2, Copy, LayoutGrid, Sparkles, Terminal, Zap } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

interface FeatureTab {
  id: string
  title: string
  subtitle: string
  icon: any
  tag: string
  headline: string
  description: string
  codeSnippet: string
  stats: { label: string; value: string }[]
  checks: string[]
}

const tabs: FeatureTab[] = [
  {
    id: 'unbundled',
    title: 'Zero-Package Registry',
    subtitle: 'Direct AST source ownership',
    icon: Code2,
    tag: 'No Node Modules Bloat',
    headline: 'You own 100% of the source code. No semver breaking changes.',
    description:
      'Unlike monolithic component packages that lock you into inflexible dependency trees, UIPKGE copies pristine, tree-shakeable source files directly into your project repository.',
    codeSnippet: `// Terminal command:\nnpx shadcn-vue@latest add https://uipkge.dev/r/vue/hero-developer-terminal.json\n\n// Output in your repo:\n// \u2714 Placed components/blocks/HeroDeveloperTerminal.vue\n// \u2714 Installed zero runtime wrapper overhead`,
    stats: [
      { label: 'Bundle Size Overhead', value: '0.0 kB' },
      { label: 'Semver Breakage Risk', value: '0%' },
      { label: 'Customization Freedom', value: '100%' },
    ],
    checks: [
      'Raw SFC/TSX files living right in your /components directory',
      'Edit Tailwind tokens, props, or behavior anytime without forking',
      'Never wait on upstream maintainers for critical hotfixes or styling tweaks',
    ],
  },
  {
    id: 'parity',
    title: 'Dual-Framework Parity',
    subtitle: 'Synchronized Vue 3.5 & React 19',
    icon: LayoutGrid,
    tag: '1:1 AST Parity',
    headline: 'One design system, identical aesthetics across Vue and React.',
    description:
      'Whether your engineering organization uses Nuxt 3, Vite, Next.js, or Astro, every primitive and block shares identical OKLCH color spaces, CVA variant tokens, and spring transition curves.',
    codeSnippet: `// Vue 3.5 SFC:\n<Button variant="default" size="sm">Deploy</Button>\n\n// React 19 JSX:\n<Button variant="default" size="sm">Deploy</Button>\n\n// Both generate identical DOM attributes & micro-interactions`,
    stats: [
      { label: 'Token Parity', value: '100.0%' },
      { label: 'Supported Frameworks', value: 'Vue 3.5 + React 19' },
      { label: 'Shared CVA Tokens', value: '31 Primitives' },
    ],
    checks: [
      'Reka UI (Vue) and Radix UI (React) accessible headless engines',
      'Automated CI check verifying cross-framework class string equality',
      'Identical behavior in Vue and React microfrontends',
    ],
  },
  {
    id: 'telemetry',
    title: 'Interactive Workbenches',
    subtitle: 'Beyond static cards & fluff',
    icon: Activity,
    tag: 'Dense & Functional',
    headline: 'Real-time controls, telemetry, and live interactive state.',
    description:
      'Every UIPKGE marketing block functions as a live interactive workbench with stateful sliders, timeframe toggles, and reactive calculation engines.',
    codeSnippet: `// Composing live reactive telemetry in your blocks:\nconst activeCohort = ref<'enterprise' | 'growth'>('enterprise')\nconst liveThroughput = computed(() => activeCohort.value === 'enterprise' ? '1.2M QPS' : '45k QPS')`,
    stats: [
      { label: 'Interactive Demos', value: '450+ Blocks' },
      { label: 'Keyboard Ergonomics', value: 'WCAG AA' },
      { label: 'Telemetry Visualizers', value: 'Real SVG Sparklines' },
    ],
    checks: [
      'Functional master-detail views and comparative toggles',
      'Integrated mock API testers, terminal sandboxes, and pricing calculators',
      'Zero placeholder text or dummy lorum ipsum shapes',
    ],
  },
  {
    id: 'performance',
    title: 'Sub-Millisecond Speed',
    subtitle: 'OKLCH Tailwind v4 Engine',
    icon: Zap,
    tag: 'Lighthouse 100',
    headline: 'Engineered for zero-latency interactions and pristine Lighthouse scores.',
    description:
      'Built on modern CSS custom properties and lightweight headless primitives, our blocks avoid hefty client-side runtime libraries, keeping your First Contentful Paint blazing fast.',
    codeSnippet: `@theme inline {\n  --color-primary: oklch(0.205 0 0);\n  --color-primary-foreground: oklch(0.985 0 0);\n  --ease-spring: cubic-bezier(0.16, 1, 0.3, 1);\n}`,
    stats: [
      { label: 'Interaction to Next Paint (INP)', value: '< 16ms' },
      { label: 'Lighthouse Score', value: '100 / 100' },
      { label: 'CSS Engine', value: 'Tailwind CSS v4' },
    ],
    checks: [
      'OKLCH native color spaces with automatic light/dark mode adaptation',
      'Hardware-accelerated transforms and calibrated spring physics',
      'Zero runtime JavaScript CSS parsing or CSS-in-JS style injection',
    ],
  },
]

const activeTabId = ref<string>('unbundled')
const copiedCode = ref(false)

const currentTab = computed(() => tabs.find((t) => t.id === activeTabId.value)!)

function copySnippet() {
  navigator.clipboard.writeText(currentTab.value.codeSnippet)
  copiedCode.value = true
  setTimeout(() => (copiedCode.value = false), 2000)
}
</script>

<template>
  <section
    data-slot="feature-interactive-tabs"
    class="bg-background relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
  >
    <!-- Subtle Radial Glow -->
    <div
      class="bg-primary/5 pointer-events-none absolute top-1/2 left-1/2 -z-10 h-80 w-full max-w-5xl -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl"
    />

    <div class="mx-auto max-w-7xl space-y-12">
      <!-- Section Header -->
      <div class="mx-auto max-w-3xl space-y-4 text-center">
        <Badge variant="secondary" class="gap-1.5 px-3 py-1 font-mono text-xs shadow-xs">
          <Sparkles class="text-primary size-3.5" />
          Architecture Differentiation
        </Badge>
        <h2 class="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
          Why engineering teams choose UIPKGE.
        </h2>
        <p class="text-muted-foreground text-base">
          Explore the architectural pillars behind our unbundled component registry.
        </p>
      </div>

      <!-- Feature Interactive Tabs Workbench -->
      <div class="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <!-- Left Column: Master Feature Navigation Rail (4 Cols) -->
        <div class="flex flex-col gap-2.5 lg:col-span-4">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            type="button"
            class="group relative overflow-hidden rounded-2xl border p-4 text-left transition-all"
            :class="
              activeTabId === tab.id
                ? 'border-primary/80 bg-card ring-primary/20 shadow-md ring-1'
                : 'border-border/70 bg-card/50 hover:border-border hover:bg-card/80'
            "
            @click="activeTabId = tab.id"
          >
            <div class="flex items-start gap-3.5">
              <div
                class="flex size-9 shrink-0 items-center justify-center rounded-xl font-mono transition-colors"
                :class="
                  activeTabId === tab.id
                    ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                    : 'bg-muted text-muted-foreground group-hover:text-foreground'
                "
              >
                <component :is="tab.icon" class="size-4" />
              </div>

              <div class="min-w-0 space-y-0.5">
                <div class="flex items-center justify-between gap-2">
                  <h3 class="text-foreground truncate font-mono text-xs font-bold">{{ tab.title }}</h3>
                  <span
                    class="size-1.5 shrink-0 rounded-full"
                    :class="activeTabId === tab.id ? 'bg-primary animate-pulse' : 'bg-transparent'"
                  />
                </div>
                <p class="text-muted-foreground truncate text-xs">{{ tab.subtitle }}</p>
              </div>
            </div>
          </button>
        </div>

        <!-- Right Column: Interactive Detail Sandbox Panel (8 Cols) -->
        <Card class="border-border bg-card/95 space-y-6 rounded-2xl p-6 text-left shadow-sm sm:p-8 lg:col-span-8">
          <!-- Detail Header -->
          <div class="border-border/80 space-y-3 border-b pb-6">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <Badge variant="outline" class="text-primary bg-primary/5 border-primary/20 font-mono text-xs">
                {{ currentTab.tag }}
              </Badge>
              <span class="text-muted-foreground font-mono text-xs">Architectural Specification</span>
            </div>
            <h3 class="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
              {{ currentTab.headline }}
            </h3>
            <p class="text-muted-foreground text-xs leading-relaxed sm:text-sm">
              {{ currentTab.description }}
            </p>
          </div>

          <!-- Code Snippet Sandbox Preview -->
          <div class="space-y-2">
            <div class="text-muted-foreground flex items-center justify-between font-mono text-xs">
              <span class="flex items-center gap-1.5">
                <Terminal class="text-primary size-3.5" /> Source Implementation
              </span>
              <button type="button" class="text-primary flex items-center gap-1 hover:underline" @click="copySnippet">
                <Check v-if="copiedCode" class="size-3 text-emerald-500" />
                <Copy v-else class="size-3" />
                <span>{{ copiedCode ? 'Copied' : 'Copy Snippet' }}</span>
              </button>
            </div>
            <pre
              class="border-border bg-muted/40 text-foreground overflow-x-auto rounded-xl border p-4 font-mono text-xs leading-relaxed"
            ><code>{{ currentTab.codeSnippet }}</code></pre>
          </div>

          <!-- 3-Pillar Telemetry Metrics Bar -->
          <div class="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-3">
            <div
              v-for="(st, idx) in currentTab.stats"
              :key="idx"
              class="border-border bg-background/50 space-y-0.5 rounded-xl border p-3.5"
            >
              <p class="text-muted-foreground font-mono text-xs tracking-wider uppercase">{{ st.label }}</p>
              <p class="text-foreground font-mono text-base font-bold">{{ st.value }}</p>
            </div>
          </div>

          <!-- Technical Checkmarks List -->
          <div class="border-border/60 space-y-2 border-t pt-2">
            <p class="text-muted-foreground font-mono text-xs tracking-wider uppercase">Verified Enforcements</p>
            <ul class="space-y-2">
              <li
                v-for="(chk, idx) in currentTab.checks"
                :key="idx"
                class="text-foreground/90 flex items-start gap-2 text-xs"
              >
                <CheckCircle2 class="mt-0.5 size-4 shrink-0 text-emerald-500" />
                <span>{{ chk }}</span>
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  </section>
</template>
