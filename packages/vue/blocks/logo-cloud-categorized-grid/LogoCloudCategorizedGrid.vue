<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowRight, Brain, Building2, Cloud, Quote, ShieldCheck, Sparkles, Terminal, X } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

interface CustomerEntity {
  id: string
  name: string
  category: 'cloud' | 'devtools' | 'fintech' | 'ai'
  tier: string
  scale: string
  quote: string
  author: string
  title: string
}

const customerList: CustomerEntity[] = [
  // Infrastructure & Cloud
  {
    id: 'cloudflare',
    name: 'Cloudflare',
    category: 'cloud',
    tier: 'Enterprise Scale',
    scale: '300+ Edge Data Centers',
    quote:
      'UIPKGE allowed us to standardize our internal console UI across 40+ engineering squads with zero bundle overhead.',
    author: 'Alex K.',
    title: 'Principal Architect, Cloudflare Workers',
  },
  {
    id: 'flyio',
    name: 'Fly.io',
    category: 'cloud',
    tier: 'Core Partner',
    scale: '50k+ Compute Machines',
    quote: 'We copy the raw SFC components and style them directly to match our brand — no package upgrades to fight.',
    author: 'Sam T.',
    title: 'Lead Frontend Engineer',
  },
  {
    id: 'railway',
    name: 'Railway',
    category: 'cloud',
    tier: 'Growth Tier',
    scale: '1.5M Deployed Services',
    quote:
      'AST-level source control gives our team complete confidence without ever fearing breaking upstream package releases.',
    author: 'Elena R.',
    title: 'VP of Product Experience',
  },

  // Developer Tooling
  {
    id: 'vercel',
    name: 'Vercel',
    category: 'devtools',
    tier: 'Design Pioneer',
    scale: '100M+ Monthly Visitors',
    quote:
      'The level of keyboard ergonomics, focus ring layering, and spring physics in UIPKGE meets the highest craft benchmarks.',
    author: 'Rauno F.',
    title: 'Design Engineering Advisor',
  },
  {
    id: 'supabase',
    name: 'Supabase',
    category: 'devtools',
    tier: 'Ecosystem Partner',
    scale: '1M+ Databases Provisioned',
    quote: 'Dual-framework parity means we can ship both Vue and React examples for our developer docs in minutes.',
    author: 'Ant W.',
    title: 'Co-Founder & CEO',
  },
  {
    id: 'biome',
    name: 'BiomeJS',
    category: 'devtools',
    tier: 'Open Source',
    scale: '20M+ Weekly Downloads',
    quote: 'The cleanest AST code patterns in any modern UI registry. 100% type-safe.',
    author: 'Nico M.',
    title: 'Core Maintainer',
  },

  // Fintech & Security
  {
    id: 'stripe',
    name: 'Stripe',
    category: 'fintech',
    tier: 'Global Infrastructure',
    scale: '$1T+ Payment Volume',
    quote:
      'Zero dependency bloat guarantees compliance with strict internal security and dependency auditing requirements.',
    author: 'Marcus H.',
    title: 'Staff Security Engineer',
  },
  {
    id: 'ramp',
    name: 'Ramp',
    category: 'fintech',
    tier: 'Scale Unicorn',
    scale: '$10B+ Managed Spend',
    quote: 'The dense KPI tiles and transaction workbenches are plug-and-play masterpieces.',
    author: 'David P.',
    title: 'Director of Frontend Engineering',
  },
  {
    id: 'snyk',
    name: 'Snyk Security',
    category: 'fintech',
    tier: 'Enterprise SecOps',
    scale: '2.5M+ Repos Scanned',
    quote: 'Owning the source code completely removes transitive dependency CVE vulnerabilities.',
    author: 'Sarah L.',
    title: 'Head of Developer Relations',
  },

  // AI & Machine Learning
  {
    id: 'replicate',
    name: 'Replicate',
    category: 'ai',
    tier: 'AI Infrastructure',
    scale: '500M+ Model Inferences',
    quote: 'We built our interactive prompt tester in an afternoon using UIPKGE terminal and slider primitives.',
    author: 'Ben F.',
    title: 'Co-Founder',
  },
  {
    id: 'modal',
    name: 'Modal Labs',
    category: 'ai',
    tier: 'GPU Cloud',
    scale: '10k+ GPU Clusters',
    quote: 'The tactile feel and speed of the UI blocks matches the lightning speed of our Python container runs.',
    author: 'Erik B.',
    title: 'Co-Founder & CTO',
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    category: 'ai',
    tier: 'Frontier AI',
    scale: 'Global Deployment',
    quote: 'Phenomenal attention to typographic hierarchy and clean Geist font metrics.',
    author: 'Arthur M.',
    title: 'Co-Founder',
  },
]

type VerticalCategory = 'all' | 'cloud' | 'devtools' | 'fintech' | 'ai'

const selectedCategory = ref<VerticalCategory>('all')
const activeModalCustomer = ref<CustomerEntity | null>(null)

const categoryLabels: Record<VerticalCategory, { label: string; icon: any }> = {
  all: { label: 'All Industries', icon: Sparkles },
  cloud: { label: 'Cloud & Infra', icon: Cloud },
  devtools: { label: 'DevTools & DX', icon: Terminal },
  fintech: { label: 'Fintech & Security', icon: ShieldCheck },
  ai: { label: 'AI & GPU Compute', icon: Brain },
}

const filteredCustomers = computed(() => {
  if (selectedCategory.value === 'all') return customerList
  return customerList.filter((c) => c.category === selectedCategory.value)
})
</script>

<template>
  <section
    data-slot="logo-cloud-categorized-grid"
    class="bg-background relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
  >
    <div class="mx-auto max-w-7xl space-y-12">
      <!-- Section Header -->
      <div class="mx-auto max-w-3xl space-y-4 text-center">
        <Badge variant="secondary" class="gap-1.5 px-3 py-1 font-mono text-xs shadow-xs">
          <Building2 class="text-primary size-3.5" />
          Industry Benchmark Customers
        </Badge>
        <h2 class="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
          Powering the world's most rigorous engineering organizations.
        </h2>
        <p class="text-muted-foreground text-base">
          From frontier AI labs to global payment platforms, see how top tier engineering teams build on UIPKGE.
        </p>

        <!-- Vertical Category Filter Tabs -->
        <div class="flex flex-wrap items-center justify-center gap-1 pt-4">
          <button
            v-for="(meta, catKey) in categoryLabels"
            :key="catKey"
            type="button"
            class="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-xs transition-all"
            :class="
              selectedCategory === catKey
                ? 'border-primary bg-primary text-primary-foreground font-semibold shadow-xs'
                : 'border-border bg-card/60 text-muted-foreground hover:text-foreground hover:bg-muted'
            "
            @click="selectedCategory = catKey as VerticalCategory"
          >
            <component :is="meta.icon" class="size-3.5" />
            <span>{{ meta.label }}</span>
          </button>
        </div>
      </div>

      <!-- Categorized Customer Grid -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        <Card
          v-for="customer in filteredCustomers"
          :key="customer.id"
          class="border-border bg-card/90 hover:border-primary/40 group flex cursor-pointer flex-col justify-between space-y-4 rounded-2xl p-5 shadow-sm transition-all hover:shadow-md"
          @click="activeModalCustomer = customer"
        >
          <!-- Card Top: Name & Tier Pill -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div
                class="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg font-mono text-xs font-bold"
              >
                {{ customer.name.charAt(0) }}
              </div>
              <div>
                <h3 class="text-foreground group-hover:text-primary font-mono text-sm font-bold transition-colors">
                  {{ customer.name }}
                </h3>
                <p class="text-muted-foreground text-xs">{{ customer.scale }}</p>
              </div>
            </div>
            <Badge variant="outline" class="font-mono text-xs capitalize">
              {{ customer.tier }}
            </Badge>
          </div>

          <!-- Quote Excerpt -->
          <p class="text-muted-foreground line-clamp-2 text-xs leading-relaxed italic">
            &ldquo;{{ customer.quote }}&rdquo;
          </p>

          <!-- Card Footer: Author & Read Case Study -->
          <div class="border-border/60 flex items-center justify-between border-t pt-2 text-xs">
            <span class="text-muted-foreground font-mono text-xs">{{ customer.author }}</span>
            <span class="text-primary flex items-center gap-1 text-xs font-medium group-hover:underline">
              <span>Read quote</span>
              <ArrowRight class="size-3" />
            </span>
          </div>
        </Card>
      </div>

      <!-- Testimonial Detail Dialog Modal -->
      <div
        v-if="activeModalCustomer"
        class="bg-background/80 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md sm:p-6"
      >
        <div
          class="bg-card border-border animate-in fade-in-0 zoom-in-95 relative w-full max-w-xl space-y-6 rounded-2xl border p-6 text-left shadow-sm duration-200 sm:p-8"
        >
          <div class="border-border flex items-center justify-between border-b pb-4">
            <div class="flex items-center gap-3">
              <div
                class="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl font-mono text-sm font-bold"
              >
                {{ activeModalCustomer.name.charAt(0) }}
              </div>
              <div>
                <h3 class="text-foreground font-mono text-base font-bold">{{ activeModalCustomer.name }}</h3>
                <p class="text-muted-foreground font-mono text-xs">{{ activeModalCustomer.scale }}</p>
              </div>
            </div>
            <button
              type="button"
              class="text-muted-foreground hover:text-foreground hover:bg-muted rounded-md p-1 transition-colors"
              @click="activeModalCustomer = null"
            >
              <X class="size-4" />
            </button>
          </div>

          <div class="space-y-4">
            <Quote class="text-primary/40 size-6" />
            <p class="text-foreground text-sm leading-relaxed sm:text-base">
              &ldquo;{{ activeModalCustomer.quote }}&rdquo;
            </p>
          </div>

          <div
            class="border-border bg-muted/20 -mx-6 -mb-6 flex items-center justify-between rounded-b-2xl border-t p-4 px-6 pt-4 sm:-mx-8 sm:-mb-8 sm:px-8"
          >
            <div>
              <p class="text-foreground text-xs font-bold">{{ activeModalCustomer.author }}</p>
              <p class="text-muted-foreground font-mono text-xs">{{ activeModalCustomer.title }}</p>
            </div>
            <Badge
              variant="outline"
              class="border-emerald-500/20 bg-emerald-500/10 font-mono text-xs text-emerald-600 dark:text-emerald-400"
            >
              Verified Production Customer
            </Badge>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
