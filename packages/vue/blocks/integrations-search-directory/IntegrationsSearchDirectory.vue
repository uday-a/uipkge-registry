<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowUpRight, Search } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

const integrations = [
  {
    mark: 'SF',
    name: 'Snowflake',
    category: 'Warehouses',
    blurb: 'Query live tables with a read-only role.',
    auth: 'Key pair',
  },
  {
    mark: 'BQ',
    name: 'BigQuery',
    category: 'Warehouses',
    blurb: 'Service-account access, per-dataset scope.',
    auth: 'Service account',
  },
  {
    mark: 'RS',
    name: 'Redshift',
    category: 'Warehouses',
    blurb: 'Serverless and provisioned clusters.',
    auth: 'IAM role',
  },
  {
    mark: 'OK',
    name: 'Okta',
    category: 'Identity',
    blurb: 'Group membership drives row-level scope.',
    auth: 'SAML + SCIM',
  },
  {
    mark: 'EI',
    name: 'Entra ID',
    category: 'Identity',
    blurb: 'Directory groups sync on a schedule.',
    auth: 'SAML + SCIM',
  },
  {
    mark: 'SL',
    name: 'Slack',
    category: 'Alerting',
    blurb: 'Route alerts to the metric owner’s channel.',
    auth: 'OAuth',
  },
  {
    mark: 'PD',
    name: 'PagerDuty',
    category: 'Alerting',
    blurb: 'Page on freshness breaches, not on noise.',
    auth: 'API key',
  },
  {
    mark: 'DT',
    name: 'dbt',
    category: 'Modelling',
    blurb: 'Import models as certified metric sources.',
    auth: 'API token',
  },
  {
    mark: 'AF',
    name: 'Airflow',
    category: 'Modelling',
    blurb: 'Trigger materialisation from your DAGs.',
    auth: 'API token',
  },
]

const query = ref('')
const matches = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return integrations
  return integrations.filter((i) => `${i.name} ${i.category} ${i.blurb} ${i.auth}`.toLowerCase().includes(q))
})
const groups = computed(() => {
  const map = new Map<string, typeof integrations>()
  for (const integration of matches.value) {
    const list = map.get(integration.category)
    if (list) list.push(integration)
    else map.set(integration.category, [integration])
  }
  return [...map.entries()]
})
</script>

<template>
  <section data-slot="integrations-search-directory" class="bg-background">
    <div class="mx-auto max-w-4xl px-6 py-20 lg:py-28">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Badge variant="secondary">Directory</Badge>
          <h2 class="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Find your stack</h2>
        </div>

        <div class="relative w-full sm:w-72">
          <Search
            class="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
            aria-hidden="true"
          />
          <Input v-model="query" class="pl-9" placeholder="Search integrations…" aria-label="Search integrations" />
        </div>
      </div>

      <Card class="mt-8">
        <CardContent class="p-2">
          <div v-if="!groups.length" class="px-4 py-16 text-center">
            <p class="text-sm font-medium">No integration matches “{{ query }}”.</p>
            <p class="text-muted-foreground mt-1 text-xs">
              We ship new connectors most releases — tell us which one you need.
            </p>
            <Button variant="outline" size="sm" class="mt-4">Request an integration</Button>
          </div>

          <div v-for="([category, list], index) in groups" :key="category">
            <p class="text-muted-foreground px-4 pt-4 pb-2 font-mono text-xs tracking-[0.14em] uppercase">
              {{ category }}
            </p>
            <ul>
              <li v-for="integration in list" :key="integration.name">
                <a
                  href="#"
                  class="hover:bg-muted focus-visible:ring-ring group flex items-center gap-4 rounded-lg px-4 py-3 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  <span
                    class="border-border text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-md border font-mono text-xs font-semibold"
                    aria-hidden="true"
                  >
                    {{ integration.mark }}
                  </span>
                  <span class="min-w-0 flex-1">
                    <span class="block text-sm font-medium">{{ integration.name }}</span>
                    <span class="text-muted-foreground block truncate text-xs">{{ integration.blurb }}</span>
                  </span>
                  <Badge variant="outline" class="hidden shrink-0 sm:inline-flex">{{ integration.auth }}</Badge>
                  <ArrowUpRight
                    class="text-muted-foreground size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>
              </li>
            </ul>
            <Separator v-if="index < groups.length - 1" class="my-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  </section>
</template>
