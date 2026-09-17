<script setup lang="ts">
import { ref } from 'vue'
import { ArrowRight, BellRing, BookOpen, Check, Mail, Send } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

interface Props {
  variant?: 'centered' | 'split'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'split',
})

interface ChannelOption {
  id: string
  title: string
  frequency: string
  description: string
  badge: string
}

const channels: ChannelOption[] = [
  {
    id: 'architecture',
    title: 'Architecture & Token Deep Dives',
    frequency: 'Bi-Weekly',
    description: 'Technical breakdowns on OKLCH color science, headless AST transformers, and zero-lockin paradigms.',
    badge: 'Flagship',
  },
  {
    id: 'releases',
    title: 'Registry Ship Notes & RFCs',
    frequency: 'Monthly',
    description: 'Direct changelogs, new workbench releases, breaking primitive refactors, and roadmap discussions.',
    badge: 'Changelog',
  },
  {
    id: 'security',
    title: 'Security & Dependency Bulletins',
    frequency: 'As-Needed',
    description: 'Zero-day vulnerability alerts, upstream headless primitive fixes, and patch notifications.',
    badge: 'Critical',
  },
]

const recentIssues = [
  {
    id: 48,
    date: 'Aug 2026',
    title: 'The Death of Monolithic npm UI Packages',
    reads: '4 min read',
    tags: ['Architecture', 'Registry', 'AST'],
    snippet:
      'Why the next decade of frontend engineering belongs to unbundled registries where the consumer owns the source code.',
  },
  {
    id: 47,
    date: 'Jul 2026',
    title: 'OKLCH Theming in Tailwind CSS v4',
    reads: '6 min read',
    tags: ['Tailwind v4', 'Color Science', 'Tokens'],
    snippet:
      'Mastering perceptual lightness, chroma gamut mapping, and dynamic theme switching without runtime CSS bloat.',
  },
]

const email = ref('')
const selectedChannel = ref('architecture')
const submitted = ref(false)
const activePreviewIssue = ref(0)
const isSubmitting = ref(false)

function handleSubmit() {
  if (!email.value || !email.value.includes('@')) return
  isSubmitting.value = true
  setTimeout(() => {
    isSubmitting.value = false
    submitted.value = true
  }, 400)
}
</script>

<template>
  <section data-slot="newsletter-signup" class="bg-background relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-6xl space-y-10">
      <!-- Section Header -->
      <div class="max-w-3xl space-y-3">
        <Badge variant="secondary" class="gap-1.5 px-3 py-1 font-mono text-xs shadow-xs">
          <Mail class="text-primary size-3.5" />
          Engineering Dispatch & Architecture Radar
        </Badge>
        <h2 class="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">Ship notes, not marketing fluff.</h2>
        <p class="text-muted-foreground text-sm leading-relaxed sm:text-base">
          Join 18,400+ frontend architects, design engineers, and systems builders. Plain-text insights into component
          architecture, token systems, and dual-framework engineering.
        </p>
      </div>

      <!-- Main Layout -->
      <div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <!-- Left Column: Channel Selector & Live Dispatch Form (7 Cols) -->
        <div class="space-y-6 lg:col-span-7">
          <Card class="border-border bg-card overflow-hidden shadow-sm">
            <CardHeader class="bg-muted/20 border-border/60 border-b pb-4">
              <div class="flex items-center justify-between">
                <CardTitle class="flex items-center gap-2 text-base font-semibold">
                  <BellRing class="text-primary size-4" />
                  Select Dispatch Track
                </CardTitle>
                <span class="text-muted-foreground font-mono text-xs">Zero Spam Guarantee</span>
              </div>
              <CardDescription class="text-xs">
                Choose the telemetry streams you want delivered to your inbox.
              </CardDescription>
            </CardHeader>

            <CardContent class="space-y-5 p-6">
              <!-- Channel Radio Cards -->
              <div class="space-y-2.5">
                <div
                  v-for="ch in channels"
                  :key="ch.id"
                  class="group cursor-pointer rounded-xl border p-3.5 transition-all"
                  :class="
                    selectedChannel === ch.id
                      ? 'border-primary bg-primary/5 ring-primary/20 shadow-xs ring-1'
                      : 'border-border bg-background hover:bg-muted/40'
                  "
                  @click="selectedChannel = ch.id"
                >
                  <div class="flex items-center justify-between gap-2">
                    <div class="flex items-center gap-2">
                      <div
                        class="flex size-3.5 items-center justify-center rounded-full border transition-colors"
                        :class="selectedChannel === ch.id ? 'border-primary bg-primary' : 'border-muted-foreground/40'"
                      >
                        <div v-if="selectedChannel === ch.id" class="bg-primary-foreground size-1.5 rounded-full" />
                      </div>
                      <span class="text-foreground text-xs font-semibold">{{ ch.title }}</span>
                    </div>
                    <Badge variant="outline" class="font-mono text-xs">
                      {{ ch.frequency }}
                    </Badge>
                  </div>
                  <p class="text-muted-foreground mt-1.5 pl-5.5 text-xs leading-relaxed">
                    {{ ch.description }}
                  </p>
                </div>
              </div>

              <Separator />

              <!-- Dispatch Subscription Input -->
              <form v-if="!submitted" class="space-y-3" @submit.prevent="handleSubmit">
                <div class="flex flex-col gap-2 sm:flex-row">
                  <Input
                    v-model="email"
                    type="email"
                    placeholder="architect@company.com"
                    required
                    class="h-10 flex-1 font-mono text-xs"
                    aria-label="Email address for dispatch"
                  />
                  <Button type="submit" :disabled="isSubmitting" class="h-10 gap-1.5 px-5 text-xs font-semibold">
                    <span>Subscribe to Stream</span>
                    <Send class="size-3.5" />
                  </Button>
                </div>
                <div class="text-muted-foreground flex items-center justify-between pt-1 font-mono text-xs">
                  <span>Plain text &bull; 1-click unsubscribe</span>
                  <span class="font-semibold text-emerald-600 dark:text-emerald-400">18,412 Active Subscribers</span>
                </div>
              </form>

              <!-- Subscription Success View -->
              <div v-else class="space-y-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-5 text-center">
                <div
                  class="mx-auto flex size-9 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                >
                  <Check class="size-5" />
                </div>
                <p class="text-foreground text-sm font-semibold">Dispatches Activated!</p>
                <p class="text-muted-foreground text-xs">
                  Verification sent to <strong class="text-foreground font-mono">{{ email }}</strong
                  >. Check your inbox to confirm delivery.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Right Column: Recent Issue Sampler & Archives (5 Cols) -->
        <div class="space-y-4 lg:col-span-5">
          <div class="flex items-center justify-between">
            <p class="text-muted-foreground flex items-center gap-1.5 font-mono text-xs tracking-wider uppercase">
              <BookOpen class="text-primary size-3.5" /> Archive Sampler
            </p>
            <span class="text-muted-foreground font-mono text-xs"
              >Issue #{{ recentIssues[activePreviewIssue].id }}</span
            >
          </div>

          <!-- Interactive Issue Cards -->
          <div class="space-y-3">
            <div
              v-for="(issue, idx) in recentIssues"
              :key="issue.id"
              class="bg-card cursor-pointer rounded-xl border p-4 transition-all"
              :class="
                activePreviewIssue === idx ? 'border-primary/50 shadow-xs' : 'border-border hover:border-border/80'
              "
              @click="activePreviewIssue = idx"
            >
              <div class="text-muted-foreground mb-1.5 flex items-center justify-between font-mono text-xs">
                <span>{{ issue.date }} &bull; Issue #{{ issue.id }}</span>
                <span class="text-foreground font-medium">{{ issue.reads }}</span>
              </div>
              <h3 class="text-foreground mb-1.5 text-sm leading-snug font-bold">{{ issue.title }}</h3>
              <p class="text-muted-foreground text-xs leading-relaxed">{{ issue.snippet }}</p>

              <div class="mt-3 flex flex-wrap gap-1.5">
                <Badge v-for="tag in issue.tags" :key="tag" variant="secondary" class="px-1.5 py-0 font-mono text-xs">
                  #{{ tag }}
                </Badge>
              </div>
            </div>
          </div>

          <!-- RSS / Mastodon / CLI note -->
          <div
            class="border-border bg-muted/20 text-muted-foreground flex items-center justify-between rounded-lg border p-3.5 text-xs"
          >
            <span class="font-mono">Prefer RSS feeds?</span>
            <a
              href="https://uipkge.dev/rss.xml"
              target="_blank"
              rel="noreferrer"
              class="text-primary inline-flex items-center gap-1 font-mono hover:underline"
            >
              uipkge.dev/rss.xml <ArrowRight class="size-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
