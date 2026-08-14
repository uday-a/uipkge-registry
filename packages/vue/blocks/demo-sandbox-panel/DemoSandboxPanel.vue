<script setup lang="ts">
import { computed, reactive } from 'vue'
import { RotateCcw } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const DEFAULTS = { metric: 'revenue_net', window: 'trailing_28d', groupBy: 'region' }

const form = reactive({ ...DEFAULTS })

// Both outputs derive from the same form, so the query and the result can never
// describe different things — the failure mode of most fake sandboxes.
const query = computed(
  () => `SELECT ${form.groupBy},
       SUM(amount) AS ${form.metric}
FROM   metrics.${form.metric}
WHERE  window = '${form.window}'
GROUP  BY ${form.groupBy}
ORDER  BY ${form.metric} DESC`,
)

const BASE: Record<string, { key: string; value: number }[]> = {
  region: [
    { key: 'EMEA', value: 1_842_100 },
    { key: 'AMER', value: 1_536_400 },
    { key: 'APAC', value: 762_400 },
  ],
  channel: [
    { key: 'Direct', value: 2_104_900 },
    { key: 'Marketplace', value: 1_218_600 },
    { key: 'Wholesale', value: 817_400 },
  ],
}

const MULTIPLIER: Record<string, number> = { trailing_7d: 0.25, trailing_28d: 1, trailing_90d: 3.1 }

const results = computed(() =>
  (BASE[form.groupBy] ?? BASE.region).map((row) => ({
    key: row.key,
    value: Math.round(row.value * (MULTIPLIER[form.window] ?? 1)),
  })),
)

function reset() {
  Object.assign(form, DEFAULTS)
}
</script>

<template>
  <section data-slot="demo-sandbox-panel" class="bg-background">
    <div class="mx-auto max-w-5xl px-6 py-20 lg:py-28">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <div class="max-w-xl">
          <Badge variant="secondary">Sandbox</Badge>
          <h2 class="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Change the definition, watch both sides
          </h2>
        </div>
        <Button variant="ghost" size="sm" @click="reset">
          <RotateCcw class="mr-1.5 size-3.5" aria-hidden="true" />
          Reset
        </Button>
      </div>

      <Card class="mt-8">
        <CardContent class="grid gap-6 p-6 lg:grid-cols-[18rem_1fr] lg:gap-8">
          <div class="space-y-4">
            <div>
              <label for="sandbox-metric" class="text-sm font-medium">Metric</label>
              <Input id="sandbox-metric" v-model="form.metric" class="mt-1.5 font-mono text-sm" />
            </div>

            <div>
              <label for="sandbox-window" class="text-sm font-medium">Window</label>
              <Select v-model="form.window">
                <SelectTrigger id="sandbox-window" class="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trailing_7d">trailing_7d</SelectItem>
                  <SelectItem value="trailing_28d">trailing_28d</SelectItem>
                  <SelectItem value="trailing_90d">trailing_90d</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label for="sandbox-group" class="text-sm font-medium">Group by</label>
              <Select v-model="form.groupBy">
                <SelectTrigger id="sandbox-group" class="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="region">region</SelectItem>
                  <SelectItem value="channel">channel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />
            <p class="text-muted-foreground text-xs leading-relaxed">
              Both panels recompute from these three fields. Nothing is cached between them.
            </p>
          </div>

          <Tabs default-value="result">
            <TabsList variant="segmented">
              <TabsTrigger value="result" variant="segmented">Result</TabsTrigger>
              <TabsTrigger value="query" variant="segmented">Generated query</TabsTrigger>
            </TabsList>

            <TabsContent value="result" class="mt-4">
              <div class="border-border min-h-[12rem] overflow-hidden rounded-lg border">
                <div class="border-border text-muted-foreground border-b px-4 py-2 font-mono text-xs">
                  {{ form.metric }} · {{ form.window }}
                </div>
                <ul class="divide-border divide-y">
                  <li v-for="row in results" :key="row.key" class="flex items-center justify-between gap-4 px-4 py-2.5">
                    <span class="text-sm">{{ row.key }}</span>
                    <span class="font-mono text-sm tabular-nums">£{{ row.value.toLocaleString('en-GB') }}</span>
                  </li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="query" class="mt-4">
              <pre
                class="border-border min-h-[12rem] overflow-x-auto rounded-lg border p-4 font-mono text-xs leading-relaxed"
              ><code>{{ query }}</code></pre>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  </section>
</template>
