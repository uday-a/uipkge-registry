<script setup lang="ts">
import { ArrowRight, Check } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

// Every line pairs a capability with a factual qualifier rather than an
// adjective — the qualifier is what a buyer actually checks.
const capabilities = [
  { label: 'Versioned metric definitions', detail: 'Git-backed, reviewable' },
  { label: 'Row-level access control', detail: 'Evaluated per query' },
  { label: 'Warehouse pass-through', detail: 'No data copied out' },
  { label: 'Scheduled materialisation', detail: 'Per-metric freshness' },
  { label: 'SCIM + SAML provisioning', detail: 'Okta, Entra, Google' },
  { label: 'Audit log export', detail: 'Generated from history' },
  { label: 'Cost ceilings per team', detail: 'Enforced at query time' },
  { label: 'Embedded dashboards', detail: 'Signed URLs, scoped' },
  { label: 'Period locking', detail: 'Restatements tracked' },
  { label: 'Alerting on drift', detail: 'Threshold or anomaly' },
]
</script>

<template>
  <section data-slot="features-checklist-split" class="bg-background">
    <div class="mx-auto max-w-6xl px-6 py-20 lg:py-28">
      <div class="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <!-- Sticky pitch: stays put while the longer checklist scrolls past. -->
        <div class="lg:sticky lg:top-24 lg:self-start">
          <Badge variant="secondary">Capabilities</Badge>
          <h2 class="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Everything the reporting layer needs, nothing it doesn’t
          </h2>
          <p class="text-muted-foreground mt-3 leading-relaxed">
            No add-on tiers and no feature gates between plans. The list on the right is the product.
          </p>
          <Button class="mt-6">
            Compare plans
            <ArrowRight class="ml-2 size-4" aria-hidden="true" />
          </Button>
        </div>

        <div>
          <ul class="grid gap-x-8 sm:grid-cols-2">
            <li v-for="capability in capabilities" :key="capability.label" class="py-3">
              <div class="flex items-start gap-3">
                <Check class="text-primary mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <div class="min-w-0">
                  <p class="text-sm font-medium">{{ capability.label }}</p>
                  <p class="text-muted-foreground mt-0.5 text-xs">{{ capability.detail }}</p>
                </div>
              </div>
              <Separator class="mt-3" />
            </li>
          </ul>
          <p class="text-muted-foreground mt-6 text-xs">
            Every capability is available on every plan. Limits differ, features do not.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
