<script setup lang="ts">
import { Github, Globe, Twitter } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

interface FooterColumn {
  title: string
  links: { label: string; href: string; badge?: string }[]
}

const columns: FooterColumn[] = [
  {
    title: 'UI Primitives',
    links: [
      { label: 'Button & Controls', href: '#' },
      { label: 'Dialog & Overlays', href: '#' },
      { label: 'Data Table & Virtual', href: '#' },
      { label: 'Charts & Sparklines', href: '#' },
      { label: 'Form Controls & Inputs', href: '#' },
      { label: 'KpiGrid & Metric Tiles', href: '#' },
    ],
  },
  {
    title: 'Marketing Blocks',
    links: [
      { label: 'Hero Sandboxes', href: '#' },
      { label: 'Feature Workbenches', href: '#' },
      { label: 'Pricing Matrix & ROI', href: '#' },
      { label: 'Social Proof Tickers', href: '#' },
      { label: 'Testimonial Masonry', href: '#' },
      { label: 'Interactive Demos', href: '#', badge: 'New' },
    ],
  },
  {
    title: 'Ecosystem Templates',
    links: [
      { label: 'HRMS Nuxt Template', href: '#' },
      { label: 'HMS Clinical Dashboard', href: '#' },
      { label: 'Shipment Tracking Live', href: '#' },
      { label: 'Fintech Banking Portal', href: '#' },
      { label: 'AI LLM Workspace', href: '#' },
    ],
  },
  {
    title: 'Developer DX',
    links: [
      { label: 'CLI Installation Guide', href: '#' },
      { label: 'Tailwind CSS v4 Tokens', href: '#' },
      { label: 'Dual-Framework Parity', href: '#' },
      { label: 'Reka UI Primitives', href: '#' },
      { label: 'Radix UI Primitives', href: '#' },
      { label: 'Changelog Timeline', href: '#' },
    ],
  },
]
</script>

<template>
  <footer
    data-slot="footer-developer-dense-grid"
    class="border-border bg-card/60 text-foreground border-t backdrop-blur-md"
  >
    <div class="mx-auto max-w-7xl space-y-12 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <!-- Top Grid: Brand & Categorized Columns -->
      <div class="grid grid-cols-2 gap-8 text-left md:grid-cols-6 lg:grid-cols-12">
        <!-- Brand Info (4 Cols) -->
        <div class="col-span-2 space-y-4 md:col-span-6 lg:col-span-4">
          <div class="flex items-center gap-2 font-mono text-base font-bold tracking-tight">
            <span
              class="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-lg text-xs font-bold shadow-xs"
            >
              U
            </span>
            <span>UIPKGE.DEV</span>
          </div>

          <p class="text-muted-foreground max-w-sm text-xs leading-relaxed">
            The open-source unbundled component registry where you own 100% of the source code. Calibrated tokens, pure
            AST distribution, and mathematical dual-framework parity across Vue 3.5 and React 19.
          </p>

          <!-- Social links -->
          <div class="flex items-center gap-2 pt-2">
            <Button size="sm" variant="outline" class="size-8 rounded-lg p-0">
              <Github class="size-3.5" />
            </Button>
            <Button size="sm" variant="outline" class="size-8 rounded-lg p-0">
              <Twitter class="size-3.5" />
            </Button>
            <Button size="sm" variant="outline" class="size-8 rounded-lg p-0">
              <Globe class="size-3.5" />
            </Button>
          </div>
        </div>

        <!-- 4 Links Columns (8 Cols total, 2 cols each) -->
        <div v-for="(col, idx) in columns" :key="idx" class="col-span-1 space-y-3 md:col-span-3 lg:col-span-2">
          <h4 class="text-foreground font-mono text-xs font-bold tracking-wider uppercase">
            {{ col.title }}
          </h4>
          <ul class="text-muted-foreground space-y-2 font-mono text-xs">
            <li v-for="(link, lIdx) in col.links" :key="lIdx">
              <a :href="link.href" class="hover:text-foreground inline-flex items-center gap-1.5 transition-colors">
                <span>{{ link.label }}</span>
                <span
                  v-if="link.badge"
                  class="py-0.2 bg-primary/20 text-primary rounded px-1.5 text-xs font-bold uppercase"
                >
                  {{ link.badge }}
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Operational Status & Copyright Bar -->
      <div
        class="border-border/80 text-muted-foreground flex flex-col items-center justify-between gap-4 border-t pt-8 text-center font-mono text-xs sm:flex-row sm:text-left"
      >
        <!-- Live System Telemetry Status -->
        <div class="flex items-center gap-2.5">
          <span class="relative flex size-2">
            <span class="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span class="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          <span class="text-foreground font-medium">All Global Edge Nodes Operational</span>
          <span class="text-muted-foreground/60">&bull; Latency: 14ms (P99)</span>
        </div>

        <!-- Right Copyright & MIT Notice -->
        <div class="flex items-center gap-3">
          <span>MIT Licensed &bull; Unbundled Code</span>
          <span>&copy; {{ new Date().getFullYear() }} UIPKGE</span>
        </div>
      </div>
    </div>
  </footer>
</template>
