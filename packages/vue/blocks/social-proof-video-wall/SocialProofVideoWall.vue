<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowRight, Play, Video, X } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface VideoTestimonial {
  id: string
  name: string
  role: string
  company: string
  category: 'fintech' | 'saas' | 'ai'
  quote: string
  duration: string
  metricHighlight: string
  metricLabel: string
}

export interface SocialProofVideoWallProps {
  title?: string
  description?: string
  testimonials?: VideoTestimonial[]
  class?: string
}

const DEFAULT_TESTIMONIALS: VideoTestimonial[] = [
  {
    id: 'story-1',
    name: 'Elena Rostova',
    role: 'Staff Frontend Architect',
    company: 'FinFlow Global',
    category: 'fintech',
    quote:
      'Unbundled components gave our core engineering team complete ownership over PCI-compliant ledger tables without maintaining a bloated bespoke fork.',
    duration: '2:14',
    metricHighlight: '4.2x Faster',
    metricLabel: 'Sprint delivery velocity',
  },
  {
    id: 'story-2',
    name: 'Marcus Vance',
    role: 'VP of Engineering',
    company: 'Synthetix AI',
    category: 'ai',
    quote:
      'Our AI canvas needed sub-millisecond AST updates. Copying pure Vue and React primitives eliminated hours of npm dependency version conflicts.',
    duration: '1:48',
    metricHighlight: '&minus;380 KB',
    metricLabel: 'Zero runtime bundle overhead',
  },
  {
    id: 'story-3',
    name: 'Sarah Chen',
    role: 'Head of Product Design',
    company: 'Linearis Cloud',
    category: 'saas',
    quote:
      'The Tailwind v4 token system and OKLCH color palettes match our design system tokens 1:1. Zero translation friction between Figma and code.',
    duration: '3:05',
    metricHighlight: '100% Token Sync',
    metricLabel: 'Figma to code parity',
  },
  {
    id: 'story-4',
    name: 'Devon Wright',
    role: 'Principal Engineer',
    company: 'OmniStream Data',
    category: 'saas',
    quote:
      'We replaced 14 disparate npm UI libraries with a single clean registry pull. Full keyboard ergonomics and ARIA compliance right out of the box.',
    duration: '2:30',
    metricHighlight: '14 &rarr; 1',
    metricLabel: 'Vendor dependency consolidation',
  },
]

const props = withDefaults(defineProps<SocialProofVideoWallProps>(), {
  title: 'Trusted by world-class design engineers and platform architects.',
  description:
    'Discover how high-velocity engineering organizations leverage unbundled UI primitives to build ultra-fast, accessible products.',
})

const selectedCategory = ref<'all' | 'fintech' | 'saas' | 'ai'>('all')
const activeVideo = ref<VideoTestimonial | null>(null)

const activeTestimonials = computed(() => props.testimonials ?? DEFAULT_TESTIMONIALS)

const filteredTestimonials = computed(() => {
  if (selectedCategory.value === 'all') return activeTestimonials.value
  return activeTestimonials.value.filter((t) => t.category === selectedCategory.value)
})

function openVideoModal(t: VideoTestimonial) {
  activeVideo.value = t
}

function closeVideoModal() {
  activeVideo.value = null
}
</script>

<template>
  <section
    data-slot="social-proof-video-wall"
    :class="cn('bg-background relative overflow-hidden py-16 sm:py-24', props.class)"
  >
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="mx-auto max-w-3xl space-y-4 text-center">
        <a
          href="#customer-stories"
          class="group border-border/80 bg-secondary/60 hover:bg-secondary text-foreground inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-medium shadow-2xs transition-colors"
        >
          <Video class="text-primary size-3.5" />
          <span>Engineering Case Studies</span>
          <ArrowRight class="text-muted-foreground size-3 transition-transform group-hover:translate-x-0.5" />
        </a>

        <h2 class="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
          {{ title }}
        </h2>

        <p class="text-muted-foreground text-base sm:text-lg">
          {{ description }}
        </p>

        <!-- Category Filter Tabs -->
        <div class="flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            v-for="cat in [
              { id: 'all', label: 'All Customer Stories' },
              { id: 'saas', label: 'Enterprise SaaS' },
              { id: 'fintech', label: 'Fintech & Security' },
              { id: 'ai', label: 'AI & Data Platforms' },
            ]"
            :key="cat.id"
            type="button"
            :class="
              cn(
                'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                selectedCategory === cat.id
                  ? 'border-primary bg-primary/10 text-primary font-semibold'
                  : 'border-border bg-card text-muted-foreground hover:text-foreground',
              )
            "
            @click="selectedCategory = cat.id as any"
          >
            {{ cat.label }}
          </button>
        </div>
      </div>

      <!-- Video Grid (2x2) -->
      <div class="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card
          v-for="item in filteredTestimonials"
          :key="item.id"
          class="group border-border bg-card/80 hover:border-primary/40 relative flex flex-col justify-between overflow-hidden shadow-xs backdrop-blur-xs transition-all hover:shadow-sm"
        >
          <CardContent class="space-y-5 p-6">
            <!-- Simulated Video Preview Banner -->
            <div
              class="border-border bg-muted/60 group/video relative flex aspect-16/9 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border"
              @click="openVideoModal(item)"
            >
              <!-- Center Play Icon -->
              <div
                class="bg-background/90 text-primary flex size-12 items-center justify-center rounded-full shadow-md transition-transform group-hover/video:scale-110"
              >
                <Play class="fill-primary size-5 pl-0.5" />
              </div>

              <!-- Top Pill (Duration) -->
              <div
                class="bg-background/80 text-foreground absolute right-2.5 bottom-2.5 rounded px-2 py-0.5 font-mono text-xs font-medium backdrop-blur-xs"
              >
                {{ item.duration }}
              </div>

              <!-- Top Left Tag -->
              <div class="absolute top-2.5 left-2.5">
                <Badge
                  variant="outline"
                  class="border-border/80 bg-background/80 font-mono text-xs tracking-wider uppercase backdrop-blur-xs"
                >
                  {{ item.company }}
                </Badge>
              </div>
            </div>

            <!-- Quote & Speaker Details -->
            <div class="space-y-3">
              <p class="text-muted-foreground text-xs leading-relaxed italic">&ldquo;{{ item.quote }}&rdquo;</p>

              <div class="border-border/80 flex items-center justify-between border-t pt-3">
                <div>
                  <div class="text-foreground text-xs font-bold">{{ item.name }}</div>
                  <div class="text-muted-foreground text-xs">{{ item.role }} &bull; {{ item.company }}</div>
                </div>

                <div class="text-right">
                  <div class="font-mono text-sm font-bold text-emerald-500" v-html="item.metricHighlight" />
                  <div class="text-muted-foreground text-xs">{{ item.metricLabel }}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Video Modal Simulation -->
      <div
        v-if="activeVideo"
        class="bg-background/80 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        @click.self="closeVideoModal"
      >
        <div class="border-border bg-card relative w-full max-w-2xl space-y-4 rounded-xl border p-6 shadow-sm">
          <div class="border-border flex items-center justify-between border-b pb-3">
            <div class="flex items-center gap-2">
              <Video class="text-primary size-4" />
              <span class="text-foreground text-sm font-bold"
                >{{ activeVideo.company }} &bull; Architecture Deep-Dive</span
              >
            </div>
            <button
              type="button"
              class="text-muted-foreground hover:text-foreground rounded-md p-1"
              @click="closeVideoModal"
            >
              <X class="size-4" />
            </button>
          </div>

          <!-- Video Play Area -->
          <div
            class="border-border bg-muted/40 flex aspect-16/9 w-full flex-col items-center justify-center space-y-2 rounded-lg border p-6 text-center"
          >
            <div
              class="bg-primary text-primary-foreground flex size-14 animate-pulse items-center justify-center rounded-full shadow-lg"
            >
              <Play class="fill-primary-foreground size-6 pl-0.5" />
            </div>
            <div class="text-foreground text-xs font-bold">Streaming Case Study (HD 1080p)</div>
            <div class="text-muted-foreground text-xs">{{ activeVideo.name }} &bull; {{ activeVideo.role }}</div>
          </div>

          <div class="text-muted-foreground text-xs">&ldquo;{{ activeVideo.quote }}&rdquo;</div>
        </div>
      </div>
    </div>
  </section>
</template>
