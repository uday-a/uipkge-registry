<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowUpRight } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

const studies = [
  {
    company: 'Northwind Logistics',
    industry: 'Logistics',
    result: '5 days off the monthly close',
    stack: 'Snowflake · dbt · Okta',
    readTime: '8 min',
  },
  {
    company: 'Halden Health',
    industry: 'Healthcare',
    result: '71% fewer ad-hoc data requests',
    stack: 'BigQuery · Airflow',
    readTime: '6 min',
  },
  {
    company: 'Verity Retail Group',
    industry: 'Retail',
    result: '2.4pp tighter forecast band',
    stack: 'Redshift · dbt',
    readTime: '7 min',
  },
  {
    company: 'Calder Manufacturing',
    industry: 'Manufacturing',
    result: '11 spreadsheets retired',
    stack: 'Postgres · Dagster',
    readTime: '5 min',
  },
  {
    company: 'Ridgeway Freight',
    industry: 'Logistics',
    result: 'Per-shipment landed cost',
    stack: 'Snowflake · Fivetran',
    readTime: '9 min',
  },
  {
    company: 'Ashford Clinics',
    industry: 'Healthcare',
    result: 'PHI-scoped self-serve reporting',
    stack: 'BigQuery · Entra ID',
    readTime: '6 min',
  },
]

const ALL = 'All'
const industries = computed(() => [ALL, ...new Set(studies.map((study) => study.industry))])
const active = ref(ALL)
const visible = computed(() =>
  active.value === ALL ? studies : studies.filter((study) => study.industry === active.value),
)

// Single-select emits '' when the pressed chip is pressed again; fall back to
// ALL so the list is never empty by accident.
function onChange(value: unknown) {
  active.value = typeof value === 'string' && value ? value : ALL
}
</script>

<template>
  <section data-slot="case-study-filterable-list" class="bg-background">
    <div class="mx-auto max-w-4xl px-6 py-20 lg:py-28">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Badge variant="secondary">Customer stories</Badge>
          <h2 class="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Read one close to your own</h2>
        </div>

        <ToggleGroup
          :model-value="active"
          type="single"
          variant="outline"
          size="sm"
          class="flex-nowrap overflow-x-auto"
          aria-label="Filter case studies by industry"
          @update:model-value="onChange"
        >
          <ToggleGroupItem v-for="industry in industries" :key="industry" :value="industry">
            {{ industry }}
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <Card class="mt-8">
        <CardContent class="p-2">
          <div v-if="!visible.length" class="px-4 py-16 text-center">
            <p class="text-sm font-medium">No stories in that industry yet.</p>
            <Button variant="outline" size="sm" class="mt-4" @click="active = ALL">Show all</Button>
          </div>

          <ul v-else>
            <li v-for="(study, index) in visible" :key="study.company">
              <a
                href="#"
                class="hover:bg-muted focus-visible:ring-ring group flex items-center gap-4 rounded-lg p-4 transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                <div class="min-w-0 flex-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <p class="text-sm font-semibold">{{ study.company }}</p>
                    <Badge variant="outline">{{ study.industry }}</Badge>
                  </div>
                  <p class="mt-1 text-sm">{{ study.result }}</p>
                  <p class="text-muted-foreground mt-1 font-mono text-xs">{{ study.stack }}</p>
                </div>
                <span class="text-muted-foreground shrink-0 text-xs">{{ study.readTime }}</span>
                <ArrowUpRight
                  class="text-muted-foreground size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </a>
              <Separator v-if="index < visible.length - 1" />
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  </section>
</template>
