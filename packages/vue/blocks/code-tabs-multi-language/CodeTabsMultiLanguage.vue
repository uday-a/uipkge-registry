<script setup lang="ts">
import { ref } from 'vue'
import { Check, Copy } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Samples are plain strings, so a highlighter can be layered on later without
// touching this component.
const samples = [
  {
    id: 'curl',
    label: 'cURL',
    code: `curl https://api.northwind.dev/v1/metrics/revenue_net \\
  -H "Authorization: Bearer $NORTHWIND_TOKEN" \\
  -d 'window=trailing_28d' \\
  -d 'group_by=region'`,
  },
  {
    id: 'ts',
    label: 'TypeScript',
    code: `import { Northwind } from '@northwind/metrics'

const client = new Northwind(process.env.NORTHWIND_TOKEN)

const revenue = await client.metrics.get('revenue_net', {
  window: 'trailing_28d',
  groupBy: ['region'],
})`,
  },
  {
    id: 'python',
    label: 'Python',
    code: `from northwind import Northwind

client = Northwind(os.environ["NORTHWIND_TOKEN"])

revenue = client.metrics.get(
    "revenue_net",
    window="trailing_28d",
    group_by=["region"],
)`,
  },
]

const copied = ref('')

async function copy(code: string, id: string) {
  try {
    await navigator.clipboard.writeText(code)
    copied.value = id
    setTimeout(() => (copied.value = ''), 1600)
  } catch {
    // Clipboard blocked: the sample stays selectable by hand.
  }
}
</script>

<template>
  <section data-slot="code-tabs-multi-language" class="bg-background">
    <div class="mx-auto max-w-3xl px-6 py-20">
      <Badge variant="secondary">API</Badge>
      <h2 class="mt-4 text-2xl font-semibold tracking-tight">Read a certified metric in three lines</h2>
      <p class="text-muted-foreground mt-2">
        The same definition the dashboards use. Scope is applied from the caller's token, not the query.
      </p>

      <Tabs default-value="curl" class="mt-6">
        <TabsList variant="segmented" class="flex-nowrap overflow-x-auto">
          <TabsTrigger v-for="sample in samples" :key="sample.id" :value="sample.id" variant="segmented">
            {{ sample.label }}
          </TabsTrigger>
        </TabsList>

        <TabsContent v-for="sample in samples" :key="sample.id" :value="sample.id" class="mt-4">
          <Card>
            <CardContent class="p-0">
              <div class="border-border flex items-center gap-3 border-b px-4 py-2">
                <span class="text-muted-foreground font-mono text-xs">GET /v1/metrics/revenue_net</span>
                <Button
                  variant="ghost"
                  size="sm"
                  class="ml-auto h-7 gap-1.5 text-xs"
                  :aria-label="`Copy the ${sample.label} sample`"
                  @click="copy(sample.code, sample.id)"
                >
                  <Check v-if="copied === sample.id" class="text-success size-3.5" aria-hidden="true" />
                  <Copy v-else class="size-3.5" aria-hidden="true" />
                  {{ copied === sample.id ? 'Copied' : 'Copy' }}
                </Button>
              </div>
              <pre class="overflow-x-auto p-4 font-mono text-xs leading-relaxed"><code>{{ sample.code }}</code></pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  </section>
</template>
