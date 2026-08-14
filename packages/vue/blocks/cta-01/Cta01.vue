<script setup lang="ts">
import { ref } from 'vue'
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  Download,
  Globe,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

type Framework = 'vue' | 'react' | 'nuxt'

const activeFramework = ref<Framework>('vue')
const copied = ref(false)
const pingMs = ref(14)

const installCommands: Record<Framework, { command: string; subtitle: string }> = {
  vue: {
    command: 'npx shadcn-vue@latest add https://uipkge.dev/r/vue/init.json -y',
    subtitle: 'Zero-config Vue 3.5 + Tailwind v4 + Reka UI primitives',
  },
  react: {
    command: 'npx shadcn@latest add https://uipkge.dev/r/react/init.json -y',
    subtitle: 'Production-ready React 19 + Radix primitives + CVA variants',
  },
  nuxt: {
    command: 'npx shadcn-vue@latest add https://uipkge.dev/r/vue/init.json -y',
    subtitle: 'Nuxt 3 auto-imports, SSR hydration-safe, unbundled ownership',
  },
}

function copyCommand() {
  navigator.clipboard.writeText(installCommands[activeFramework.value].command)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}
</script>

<template>
  <section
    data-slot="cta-01"
    class="bg-background border-border relative w-full overflow-hidden border-y py-16 lg:py-24"
  >
    <!-- Subtle architectural background glow -->
    <div
      class="from-primary/10 via-background to-background pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]"
    />

    <div class="mx-auto max-w-5xl space-y-10 px-4 text-center sm:px-6 lg:px-8">
      <!-- Eyebrow Pill -->
      <div class="inline-flex items-center gap-2">
        <Badge
          variant="outline"
          class="border-primary/30 text-primary bg-primary/5 gap-1.5 px-3 py-1 font-mono text-xs tracking-wide uppercase"
        >
          <Zap class="size-3.5" />
          Unbundled Registry Distribution
        </Badge>
        <div class="text-muted-foreground flex items-center gap-1.5 font-mono text-xs">
          <span class="size-2 animate-pulse rounded-full bg-emerald-500" />
          <span>CDN Edge: {{ pingMs }}ms P99</span>
        </div>
      </div>

      <!-- Main Headline & Narrative -->
      <div class="mx-auto max-w-3xl space-y-4">
        <h2 class="text-foreground text-3xl leading-[1.15] font-bold tracking-tight sm:text-5xl">
          Own Your UI. No Semver Lock-in. Zero Bloat.
        </h2>
        <p class="text-muted-foreground text-base leading-relaxed sm:text-lg">
          The components are the product. Source files are copied directly into your workspace. Modify, compose, and
          refactor without fighting external package boundaries.
        </p>
      </div>

      <!-- Interactive Developer Terminal Box -->
      <Card class="mx-auto max-w-2xl overflow-hidden border-zinc-800 bg-zinc-950 text-left text-zinc-100 shadow-sm">
        <!-- Terminal Titlebar -->
        <div class="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/70 px-4 py-3">
          <div class="flex items-center gap-2">
            <div class="flex gap-1.5">
              <div class="size-3 rounded-full bg-rose-500/80" />
              <div class="size-3 rounded-full bg-amber-500/80" />
              <div class="size-3 rounded-full bg-emerald-500/80" />
            </div>
            <span class="ml-2 font-mono text-xs text-zinc-400">terminal — bootstrap workspace</span>
          </div>

          <!-- Framework selector tabs -->
          <div class="flex items-center gap-1 rounded-md border border-zinc-800 bg-zinc-950 p-0.5">
            <button
              v-for="fw in [
                { id: 'vue', label: 'Vue 3' },
                { id: 'react', label: 'React 19' },
                { id: 'nuxt', label: 'Nuxt 3' },
              ]"
              :key="fw.id"
              type="button"
              class="rounded px-2 py-0.5 font-mono text-xs transition-all"
              :class="
                activeFramework === fw.id
                  ? 'bg-zinc-800 font-semibold text-zinc-100 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              "
              @click="activeFramework = fw.id as any"
            >
              {{ fw.label }}
            </button>
          </div>
        </div>

        <!-- Terminal Command Runner Body -->
        <div class="space-y-3 p-4 font-mono text-xs sm:p-5">
          <div class="flex items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-900/90 p-3">
            <div class="flex items-center gap-2.5 overflow-x-auto text-emerald-400 select-all">
              <span class="shrink-0 text-zinc-500">$</span>
              <span class="whitespace-nowrap">{{ installCommands[activeFramework].command }}</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              class="h-7 shrink-0 gap-1.5 border-zinc-700 bg-zinc-800 px-2.5 font-mono text-xs text-zinc-200 hover:bg-zinc-700"
              @click="copyCommand"
            >
              <Check v-if="copied" class="size-3.5 text-emerald-400" />
              <Copy v-else class="size-3.5" />
              <span>{{ copied ? 'Copied' : 'Copy' }}</span>
            </Button>
          </div>

          <p class="flex items-center gap-1.5 text-xs text-zinc-400">
            <Sparkles class="size-3.5 shrink-0 text-yellow-400" />
            <span>{{ installCommands[activeFramework].subtitle }}</span>
          </p>
        </div>
      </Card>

      <!-- Primary Action Buttons -->
      <div class="flex flex-wrap items-center justify-center gap-3.5 pt-2">
        <Button size="lg" class="h-11 gap-2 px-6 font-semibold shadow-sm" @click="copyCommand">
          <Download class="size-4" />
          {{ copied ? 'Command Copied to Clipboard' : 'Install Components' }}
        </Button>
        <Button size="lg" variant="outline" class="h-11 gap-2 px-6 font-semibold" as-child>
          <a href="https://github.com/uday-a/uipkge" target="_blank" rel="noreferrer">
            <Code2 class="size-4" />
            Explore Source Registry
            <ArrowRight class="size-4" />
          </a>
        </Button>
      </div>

      <!-- Trust Badges & Guarantees Grid -->
      <div class="border-border grid grid-cols-2 gap-4 border-t pt-8 text-left sm:grid-cols-4">
        <div class="flex items-start gap-2.5">
          <CheckCircle2 class="mt-0.5 size-4 shrink-0 text-emerald-500" />
          <div>
            <p class="text-foreground text-xs font-semibold">100% Code Ownership</p>
            <p class="text-muted-foreground mt-0.5 text-xs">Files live in your repository</p>
          </div>
        </div>
        <div class="flex items-start gap-2.5">
          <ShieldCheck class="mt-0.5 size-4 shrink-0 text-emerald-500" />
          <div>
            <p class="text-foreground text-xs font-semibold">Zero Runtime Bloat</p>
            <p class="text-muted-foreground mt-0.5 text-xs">No opaque wrapper dependencies</p>
          </div>
        </div>
        <div class="flex items-start gap-2.5">
          <Sparkles class="mt-0.5 size-4 shrink-0 text-emerald-500" />
          <div>
            <p class="text-foreground text-xs font-semibold">Tailwind CSS v4</p>
            <p class="text-muted-foreground mt-0.5 text-xs">OKLCH color system & tokens</p>
          </div>
        </div>
        <div class="flex items-start gap-2.5">
          <Globe class="mt-0.5 size-4 shrink-0 text-emerald-500" />
          <div>
            <p class="text-foreground text-xs font-semibold">Dual Framework</p>
            <p class="text-muted-foreground mt-0.5 text-xs">Strict Vue 3 & React parity</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
