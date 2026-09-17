<script setup lang="ts">
import {
  ArrowRight,
  Bell,
  Boxes,
  Clock,
  Download,
  FileSearch,
  GitBranch,
  Globe,
  KeyRound,
  Lock,
  Receipt,
  Share2,
  Terminal,
} from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const capabilities = [
  { icon: GitBranch, title: 'Version control', body: 'Every definition change is a reviewable diff.' },
  { icon: Lock, title: 'Row-level scope', body: 'Resolved per query from your IdP.' },
  { icon: KeyRound, title: 'SSO + SCIM', body: 'Okta, Entra ID, and Google Workspace.' },
  { icon: Clock, title: 'Freshness policy', body: 'Per-metric materialisation schedules.' },
  { icon: Receipt, title: 'Cost ceilings', body: 'Query budgets enforced per team.' },
  { icon: Bell, title: 'Drift alerts', body: 'Threshold and anomaly triggers.' },
  { icon: FileSearch, title: 'Audit export', body: 'Generated from change history.' },
  { icon: Share2, title: 'Scoped sharing', body: 'Signed links that respect permissions.' },
  { icon: Boxes, title: 'Embedding', body: 'Same dashboards inside your product.' },
  { icon: Terminal, title: 'CLI + API', body: 'Everything the UI does, scriptable.' },
  { icon: Download, title: 'Exports', body: 'CSV, Parquet, and scheduled delivery.' },
  { icon: Globe, title: 'Data residency', body: 'EU, US, and AU regions available.' },
]
</script>

<template>
  <section data-slot="features-icon-list-dense" class="bg-background">
    <div class="mx-auto max-w-6xl px-6 py-20 lg:py-24">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <div class="max-w-2xl">
          <Badge variant="secondary">Also included</Badge>
          <h2 class="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">The rest of the surface area</h2>
          <p class="text-muted-foreground mt-2">
            The detail sections above cover the hard parts. This is everything else, in one pass.
          </p>
        </div>
        <Button variant="ghost">
          Full feature list
          <ArrowRight class="ml-2 size-4" aria-hidden="true" />
        </Button>
      </div>

      <Separator class="my-10" />

      <ul class="grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="capability in capabilities" :key="capability.title" class="flex gap-3">
          <component :is="capability.icon" class="text-muted-foreground mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <div class="min-w-0">
            <p class="text-sm font-medium">{{ capability.title }}</p>
            <p class="text-muted-foreground mt-0.5 text-xs leading-relaxed">{{ capability.body }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
