<script setup lang="ts">
import { computed, ref } from 'vue'
import { CheckCircle2, Star } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

type RoleFilter = 'all' | 'frontend' | 'founder' | 'design-eng'

interface Testimonial {
  id: string
  name: string
  role: string
  roleCategory: 'frontend' | 'founder' | 'design-eng'
  company: string
  avatar: string
  handle: string
  verifiedSource: 'Twitter' | 'GitHub' | 'LinkedIn'
  quote: string
  metricBadge?: string
  starCount: number
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Alexandre Rivière',
    role: 'Principal Design Engineer',
    roleCategory: 'design-eng',
    company: 'Linear Ecosystem',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    handle: '@alex_riviere',
    verifiedSource: 'Twitter',
    quote:
      'The unbundled component model completely cured our team from npm dependency fatigue. We get raw SFCs and TSX with exact Tailwind v4 token alignments. Zero wrapper bloat, 100% code ownership.',
    metricBadge: '4.2x Faster Ship Velocity',
    starCount: 5,
  },
  {
    id: '2',
    name: 'Sarah Chen',
    role: 'VP of Engineering',
    roleCategory: 'founder',
    company: 'ScaleDev AI',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    handle: '@schen_ai',
    verifiedSource: 'GitHub',
    quote:
      'We had severe bundle bloat with our previous UI package (over 500kB of unused JS). Switching to UIPKGE reduced our initial bundle to 38kB and solved our INP scores overnight.',
    metricBadge: '-88% Bundle Size',
    starCount: 5,
  },
  {
    id: '3',
    name: 'Marcus Vance',
    role: 'Staff Frontend Architect',
    roleCategory: 'frontend',
    company: 'HyperQubit Cloud',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    handle: '@marcus_vance',
    verifiedSource: 'Twitter',
    quote:
      'Dual-framework parity is not a gimmick here—it is mathematically verified. We maintain a Nuxt 3 admin console and Next.js customer portal with identical design tokens and micro-interactions.',
    metricBadge: '100% Token Parity',
    starCount: 5,
  },
  {
    id: '4',
    name: 'Elena Rostova',
    role: 'Head of Product Design',
    roleCategory: 'design-eng',
    company: 'Fintech Velocity',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    handle: '@elena_craft',
    verifiedSource: 'GitHub',
    quote:
      'The spring physics and micro-interactions match Linear and Raycast levels of craft. No arbitrary sub-12px micro-text or sloppy contrast issues.',
    metricBadge: 'WCAG AA AA Certified',
    starCount: 5,
  },
  {
    id: '5',
    name: 'David Kim',
    role: 'Founder & CTO',
    roleCategory: 'founder',
    company: 'PulseOps',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    handle: '@dkim_ops',
    verifiedSource: 'Twitter',
    quote:
      'Being able to run `npx shadcn-vue add` and have clean, pristine components in our git repository is the single biggest DX breakthrough since Vite.',
    metricBadge: 'Zero Upstream Lock-in',
    starCount: 5,
  },
  {
    id: '6',
    name: 'Liam O’Connor',
    role: 'Lead UI Engineer',
    roleCategory: 'frontend',
    company: 'Starlight Media',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    handle: '@liam_dev',
    verifiedSource: 'GitHub',
    quote:
      'The marketing blocks are actually functional workbenches with live sliders, real SVG telemetry sparklines, and zero dummy shapes. Huge time saver.',
    metricBadge: '450+ Verified Blocks',
    starCount: 5,
  },
]

const activeFilter = ref<RoleFilter>('all')

const filteredTestimonials = computed(() => {
  if (activeFilter.value === 'all') return testimonials
  return testimonials.filter((t) => t.roleCategory === activeFilter.value)
})
</script>

<template>
  <section
    data-slot="testimonial-masonry-verified-grid"
    class="bg-background relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
  >
    <div class="mx-auto max-w-7xl space-y-12">
      <!-- Section Header -->
      <div class="mx-auto max-w-3xl space-y-4 text-center">
        <Badge variant="secondary" class="gap-1.5 px-3 py-1 font-mono text-xs shadow-xs">
          <Star class="size-3.5 fill-amber-500 text-amber-500" />
          Verified Engineer Endorsements
        </Badge>
        <h2 class="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
          Loved by design engineers and CTOs worldwide.
        </h2>
        <p class="text-muted-foreground text-base">
          Real feedback from engineers who dumped monolithic npm packages for unbundled code ownership.
        </p>

        <!-- Category Filters -->
        <div class="flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            type="button"
            class="rounded-lg border px-3.5 py-1 font-mono text-xs transition-all"
            :class="
              activeFilter === 'all'
                ? 'border-primary bg-primary text-primary-foreground font-semibold shadow-xs'
                : 'border-border bg-card text-muted-foreground hover:text-foreground'
            "
            @click="activeFilter = 'all'"
          >
            All Perspectives ({{ testimonials.length }})
          </button>
          <button
            type="button"
            class="rounded-lg border px-3.5 py-1 font-mono text-xs transition-all"
            :class="
              activeFilter === 'design-eng'
                ? 'border-primary bg-primary text-primary-foreground font-semibold shadow-xs'
                : 'border-border bg-card text-muted-foreground hover:text-foreground'
            "
            @click="activeFilter = 'design-eng'"
          >
            Design Engineers
          </button>
          <button
            type="button"
            class="rounded-lg border px-3.5 py-1 font-mono text-xs transition-all"
            :class="
              activeFilter === 'frontend'
                ? 'border-primary bg-primary text-primary-foreground font-semibold shadow-xs'
                : 'border-border bg-card text-muted-foreground hover:text-foreground'
            "
            @click="activeFilter = 'frontend'"
          >
            Frontend Architects
          </button>
          <button
            type="button"
            class="rounded-lg border px-3.5 py-1 font-mono text-xs transition-all"
            :class="
              activeFilter === 'founder'
                ? 'border-primary bg-primary text-primary-foreground font-semibold shadow-xs'
                : 'border-border bg-card text-muted-foreground hover:text-foreground'
            "
            @click="activeFilter = 'founder'"
          >
            CTOs &amp; Founders
          </button>
        </div>
      </div>

      <!-- Masonry Grid (3 Columns) -->
      <div class="grid grid-cols-1 items-start gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card
          v-for="t in filteredTestimonials"
          :key="t.id"
          class="border-border bg-card/95 hover:border-primary/40 group relative flex flex-col justify-between space-y-4 overflow-hidden rounded-2xl p-6 text-left shadow-lg transition-all hover:shadow-xl"
        >
          <!-- Top Row: Avatar, Name, Handle, Verified Badge -->
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <img
                :src="t.avatar"
                :alt="t.name"
                class="border-border size-10 shrink-0 rounded-full border object-cover"
              />
              <div class="min-w-0">
                <div class="flex items-center gap-1.5">
                  <h4 class="text-foreground truncate font-mono text-xs font-bold">{{ t.name }}</h4>
                  <CheckCircle2 class="size-3.5 shrink-0 text-blue-500" />
                </div>
                <p class="text-muted-foreground truncate text-xs">{{ t.role }} &bull; {{ t.company }}</p>
              </div>
            </div>

            <Badge variant="outline" class="text-muted-foreground shrink-0 font-mono text-xs">
              {{ t.verifiedSource }}
            </Badge>
          </div>

          <!-- Quote text -->
          <p class="text-foreground/90 text-xs leading-relaxed italic sm:text-sm">&ldquo;{{ t.quote }}&rdquo;</p>

          <!-- Footer Row: Star Rating & Impact Metric Badge -->
          <div class="border-border/60 flex flex-wrap items-center justify-between gap-2 border-t pt-3">
            <div class="flex items-center gap-0.5">
              <Star v-for="s in t.starCount" :key="s" class="size-3.5 fill-amber-500 text-amber-500" />
            </div>

            <Badge
              v-if="t.metricBadge"
              variant="outline"
              class="border-emerald-500/20 bg-emerald-500/10 font-mono text-xs text-emerald-600 dark:text-emerald-400"
            >
              {{ t.metricBadge }}
            </Badge>
          </div>
        </Card>
      </div>
    </div>
  </section>
</template>
