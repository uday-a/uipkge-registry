<script setup lang="ts">
import { ref } from 'vue'
import {
  Check,
  Copy,
  GitBranch,
  Github,
  GitPullRequest,
  MessageSquare,
  Package,
  Star,
  Terminal,
  TrendingUp,
} from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface ReleaseItem {
  version: string
  date: string
  title: string
  type: 'feature' | 'primitive' | 'block'
}

const recentReleases: ReleaseItem[] = [
  { version: 'v2.4.0', date: 'Yesterday', title: 'Added 12 new Marketing & Conversion Workbenches', type: 'block' },
  {
    version: 'v2.3.8',
    date: '3 days ago',
    title: 'OKLCH Dynamic Theme Engine & Tailored HSL generator',
    type: 'feature',
  },
  { version: 'v2.3.5', date: 'Last week', title: 'Added SegmentedGauge & SmoothFunnel primitives', type: 'primitive' },
  {
    version: 'v2.3.0',
    date: '2 weeks ago',
    title: 'Full React 19 single-curly-brace AST parity validation',
    type: 'feature',
  },
]

const starCount = ref('14.8k')
const isCopied = ref(false)
const commandText = ref('npx shadcn-vue add https://uipkge.dev/r/vue/init.json')

function copyCommand() {
  navigator.clipboard.writeText(commandText.value)
  isCopied.value = true
  setTimeout(() => (isCopied.value = false), 2000)
}
</script>

<template>
  <section
    data-slot="github-oss-traction-band"
    class="bg-background relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
  >
    <!-- Ambient Glow Background -->
    <div
      class="bg-primary/10 pointer-events-none absolute top-1/2 left-1/2 -z-10 h-72 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl"
    />

    <div class="mx-auto max-w-6xl space-y-12">
      <!-- Section Header -->
      <div
        class="border-border/60 flex flex-col items-center justify-between gap-6 border-b pb-8 text-center md:flex-row md:text-left"
      >
        <div class="space-y-2">
          <Badge variant="secondary" class="gap-1.5 px-3 py-1 font-mono text-xs shadow-xs">
            <Github class="size-3.5" />
            100% Free & Open Source on GitHub
          </Badge>
          <h2 class="text-foreground text-3xl font-bold tracking-tight">Backed by a thriving open-source community.</h2>
          <p class="text-muted-foreground text-xs sm:text-sm">
            Zero vendor lock-in. 100% unbundled source code ownership under the permissive MIT License.
          </p>
        </div>

        <!-- GitHub Primary Action -->
        <div class="flex shrink-0 items-center gap-3">
          <Button
            as="a"
            href="https://github.com/uday-a/uipkge"
            target="_blank"
            rel="noreferrer"
            size="lg"
            class="gap-2 font-semibold shadow-xs"
          >
            <Github class="size-4" />
            <span>Star on GitHub</span>
            <Badge
              variant="outline"
              class="bg-primary-foreground/20 text-primary-foreground ml-1 border-transparent font-mono text-xs"
            >
              {{ starCount }}
            </Badge>
          </Button>
        </div>
      </div>

      <!-- 4-Stat Community Traction Grid -->
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <!-- Stars -->
        <Card class="border-border bg-card/80 space-y-2 rounded-2xl p-5 shadow-xs">
          <div class="text-muted-foreground flex items-center justify-between">
            <span class="font-mono text-xs">GitHub Stars</span>
            <Star class="size-4 fill-amber-500 text-amber-500" />
          </div>
          <p class="text-foreground font-mono text-3xl font-bold">14,820</p>
          <p class="flex items-center gap-1 font-mono text-xs text-emerald-600 dark:text-emerald-400">
            <TrendingUp class="size-3" /> +420 this week
          </p>
        </Card>

        <!-- Weekly Installs -->
        <Card class="border-border bg-card/80 space-y-2 rounded-2xl p-5 shadow-xs">
          <div class="text-muted-foreground flex items-center justify-between">
            <span class="font-mono text-xs">Weekly Installs</span>
            <Package class="text-primary size-4" />
          </div>
          <p class="text-foreground font-mono text-3xl font-bold">142,500</p>
          <p class="text-muted-foreground font-mono text-xs">Across Vue & React</p>
        </Card>

        <!-- Active Contributors -->
        <Card class="border-border bg-card/80 space-y-2 rounded-2xl p-5 shadow-xs">
          <div class="text-muted-foreground flex items-center justify-between">
            <span class="font-mono text-xs">Contributors</span>
            <GitPullRequest class="size-4 text-emerald-500" />
          </div>
          <p class="text-foreground font-mono text-3xl font-bold">84+</p>
          <p class="text-muted-foreground font-mono text-xs">Design engineers</p>
        </Card>

        <!-- Discord Community -->
        <Card class="border-border bg-card/80 space-y-2 rounded-2xl p-5 shadow-xs">
          <div class="text-muted-foreground flex items-center justify-between">
            <span class="font-mono text-xs">Community</span>
            <MessageSquare class="size-4 text-blue-500" />
          </div>
          <p class="text-foreground font-mono text-3xl font-bold">4,200+</p>
          <p class="text-muted-foreground font-mono text-xs">Active builders</p>
        </Card>
      </div>

      <!-- Live Release Pulse & Quick CLI Card -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <!-- Recent Releases Feed -->
        <Card class="border-border bg-card/90 space-y-4 rounded-2xl p-6 text-left shadow-sm">
          <div class="border-border flex items-center justify-between border-b pb-3">
            <h3 class="text-foreground flex items-center gap-2 font-mono text-sm font-bold">
              <GitBranch class="text-primary size-4" /> Recent Registry Releases
            </h3>
            <span class="text-muted-foreground font-mono text-xs">Continuous Shipping</span>
          </div>

          <div class="space-y-3">
            <div v-for="(rel, idx) in recentReleases" :key="idx" class="flex items-start justify-between gap-3 text-xs">
              <div class="space-y-0.5">
                <div class="flex items-center gap-2">
                  <span class="text-foreground font-mono font-bold">{{ rel.version }}</span>
                  <Badge variant="outline" class="font-mono text-xs capitalize">
                    {{ rel.type }}
                  </Badge>
                </div>
                <p class="text-muted-foreground leading-snug">{{ rel.title }}</p>
              </div>
              <span class="text-muted-foreground shrink-0 font-mono text-xs">{{ rel.date }}</span>
            </div>
          </div>
        </Card>

        <!-- Quick Install CLI Terminal -->
        <Card
          class="border-border bg-card/90 flex flex-col justify-between space-y-4 rounded-2xl p-6 text-left shadow-sm"
        >
          <div class="space-y-1">
            <h3 class="text-foreground flex items-center gap-2 font-mono text-sm font-bold">
              <Terminal class="size-4 text-emerald-500" /> Quickstart CLI
            </h3>
            <p class="text-muted-foreground text-xs">
              Add tokens, utils, and theme scaffolding into your repository in seconds.
            </p>
          </div>

          <!-- Code Box -->
          <div
            class="border-border bg-background text-foreground flex items-center justify-between gap-2 overflow-hidden rounded-xl border p-3.5 font-mono text-xs"
          >
            <span class="text-muted-foreground truncate">
              <span class="text-primary font-bold">&gt;</span> {{ commandText }}
            </span>
            <Button size="sm" variant="ghost" class="h-8 shrink-0 gap-1.5 px-2 text-xs" @click="copyCommand">
              <Check v-if="isCopied" class="size-3.5 text-emerald-500" />
              <Copy v-else class="size-3.5" />
              <span>{{ isCopied ? 'Copied' : 'Copy' }}</span>
            </Button>
          </div>

          <div
            class="text-muted-foreground border-border/60 flex items-center justify-between border-t pt-2 font-mono text-xs"
          >
            <span>Supports Vue 3.5, Nuxt, React 19, Next.js</span>
            <span class="font-semibold text-emerald-500">&check; Zero lock-in</span>
          </div>
        </Card>
      </div>
    </div>
  </section>
</template>
