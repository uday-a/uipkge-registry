<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowRight, Check, Copy, Globe, Play, Terminal } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface FeatureInteractiveApiCurlBuilderProps {
  title?: string
  description?: string
  class?: string
}

const props = withDefaults(defineProps<FeatureInteractiveApiCurlBuilderProps>(), {
  title: 'Composable REST APIs designed for programmatic automation.',
  description:
    'Synthesize type-safe HTTP payloads, test endpoints in real time, and export snippets directly to your production workflow.',
})

const selectedMethod = ref<'GET' | 'POST'>('POST')
const selectedEndpoint = ref('/v1/components/bundle')
const selectedLanguage = ref<'curl' | 'javascript' | 'python' | 'go'>('curl')
const enableAstTree = ref(true)
const enableOklchTokens = ref(true)
const copiedSnippet = ref(false)
const isExecuting = ref(false)
const executionResult = ref<any>({
  status: 200,
  latencyMs: 14,
  data: {
    bundleId: 'pkg_9981x2',
    name: 'button',
    frameworks: ['vue', 'react'],
    astCompiled: true,
    sizeBytes: 1480,
    oklchTokensInlined: 48,
    edgeDeliveryTime: '0.8ms',
  },
})

const generatedCode = computed(() => {
  const payload = JSON.stringify(
    {
      component: 'button',
      framework: 'vue',
      astTree: enableAstTree.value,
      inlineTokens: enableOklchTokens.value,
    },
    null,
    2,
  )

  if (selectedLanguage.value === 'curl') {
    return `curl -X ${selectedMethod.value} https://api.uipkge.dev${selectedEndpoint.value} \\
  -H "Authorization: Bearer uipkge_sec_89201" \\
  -H "Content-Type: application/json" \\
  -d '${payload.replace(/\n/g, '\n  ')}'`
  }

  if (selectedLanguage.value === 'javascript') {
    return `const res = await fetch("https://api.uipkge.dev${selectedEndpoint.value}", {
  method: "${selectedMethod.value}",
  headers: {
    "Authorization": "Bearer uipkge_sec_89201",
    "Content-Type": "application/json"
  },
  body: JSON.stringify(${payload})
});
const data = await res.json();`
  }

  if (selectedLanguage.value === 'python') {
    return `import requests

res = requests.${selectedMethod.value.toLowerCase()}(
    "https://api.uipkge.dev${selectedEndpoint.value}",
    headers={"Authorization": "Bearer uipkge_sec_89201"},
    json=${payload.replace(/true/g, 'True').replace(/false/g, 'False')}
)
data = res.json()`
  }

  return `// Go HTTP Request
req, _ := http.NewRequest("${selectedMethod.value}", "https://api.uipkge.dev${selectedEndpoint.value}", payload)
req.Header.Set("Authorization", "Bearer uipkge_sec_89201")
res, _ := client.Do(req)`
})

async function copySnippet() {
  try {
    await navigator.clipboard.writeText(generatedCode.value)
    copiedSnippet.value = true
    setTimeout(() => {
      copiedSnippet.value = false
    }, 2000)
  } catch {
    // fallback
  }
}

function executeRequest() {
  isExecuting.value = true
  setTimeout(() => {
    isExecuting.value = false
    executionResult.value = {
      status: 200,
      latencyMs: Math.floor(Math.random() * 8) + 11,
      data: {
        bundleId: `pkg_${Math.random().toString(36).substring(2, 8)}`,
        name: selectedEndpoint.value.includes('bundle') ? 'button' : 'tokens',
        frameworks: ['vue', 'react'],
        astCompiled: enableAstTree.value,
        sizeBytes: enableAstTree.value ? 1480 : 1120,
        oklchTokensInlined: enableOklchTokens.value ? 48 : 0,
        edgeDeliveryTime: '0.8ms',
      },
    }
  }, 350)
}
</script>

<template>
  <section
    data-slot="feature-interactive-api-curl-builder"
    :class="cn('bg-background relative overflow-hidden py-16 sm:py-24', props.class)"
  >
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="mx-auto max-w-3xl space-y-4 text-center">
        <a
          href="#api-builder"
          class="group border-border/80 bg-secondary/60 hover:bg-secondary text-foreground inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-medium shadow-2xs transition-colors"
        >
          <Globe class="text-primary size-3.5" />
          <span>Interactive Edge API Console</span>
          <ArrowRight class="text-muted-foreground size-3 transition-transform group-hover:translate-x-0.5" />
        </a>

        <h2 class="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
          {{ title }}
        </h2>

        <p class="text-muted-foreground text-base sm:text-lg">
          {{ description }}
        </p>
      </div>

      <!-- API Builder Workbench -->
      <div class="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <!-- Left Config Parameters (5 cols) -->
        <div class="space-y-4 lg:col-span-5">
          <Card class="border-border bg-card shadow-xs">
            <CardContent class="space-y-5 p-6">
              <div class="border-border flex items-center justify-between border-b pb-3">
                <span class="text-muted-foreground text-xs font-bold tracking-wider uppercase">Request Parameters</span>
                <Badge
                  variant="outline"
                  class="border-emerald-500/30 bg-emerald-500/10 font-mono text-xs text-emerald-500"
                >
                  Edge v1
                </Badge>
              </div>

              <!-- Endpoint Selector -->
              <div class="space-y-2">
                <label class="text-foreground text-xs font-bold">Endpoint Path</label>
                <div class="border-border bg-muted/40 flex rounded-lg border p-1">
                  <button
                    v-for="ep in ['/v1/components/bundle', '/v1/tokens/compile']"
                    :key="ep"
                    type="button"
                    :class="
                      cn(
                        'flex-1 rounded-md py-1 font-mono text-xs transition-colors',
                        selectedEndpoint === ep
                          ? 'bg-background text-foreground font-bold shadow-2xs'
                          : 'text-muted-foreground hover:text-foreground',
                      )
                    "
                    @click="selectedEndpoint = ep"
                  >
                    {{ ep }}
                  </button>
                </div>
              </div>

              <!-- Payload Toggles -->
              <div class="space-y-2.5 pt-2">
                <label class="text-foreground text-xs font-bold">Payload Flags</label>
                <div class="space-y-2">
                  <label
                    class="border-border/80 bg-background hover:bg-muted/20 flex cursor-pointer items-center justify-between rounded-lg border p-3 text-xs"
                  >
                    <span class="text-muted-foreground">Emit AST Syntax Tree</span>
                    <input v-model="enableAstTree" type="checkbox" class="accent-primary size-4 cursor-pointer" />
                  </label>
                  <label
                    class="border-border/80 bg-background hover:bg-muted/20 flex cursor-pointer items-center justify-between rounded-lg border p-3 text-xs"
                  >
                    <span class="text-muted-foreground">Inline OKLCH CSS Tokens</span>
                    <input v-model="enableOklchTokens" type="checkbox" class="accent-primary size-4 cursor-pointer" />
                  </label>
                </div>
              </div>

              <Button class="w-full gap-2 shadow-xs" :disabled="isExecuting" @click="executeRequest">
                <Play class="fill-primary-foreground size-3.5" />
                <span>{{ isExecuting ? 'Executing Edge Call...' : 'Send Live HTTP Request' }}</span>
              </Button>
            </CardContent>
          </Card>
        </div>

        <!-- Right Code Preview & Simulated Response (7 cols) -->
        <div class="space-y-4 lg:col-span-7">
          <Card class="border-border bg-card overflow-hidden font-mono text-xs shadow-xs">
            <!-- Language Selector Tabs -->
            <div class="border-border bg-muted/40 flex items-center justify-between border-b px-4 py-2">
              <div class="flex items-center gap-1">
                <button
                  v-for="lang in [
                    { id: 'curl', label: 'cURL' },
                    { id: 'javascript', label: 'Fetch' },
                    { id: 'python', label: 'Python' },
                    { id: 'go', label: 'Go' },
                  ]"
                  :key="lang.id"
                  type="button"
                  :class="
                    cn(
                      'rounded px-2.5 py-1 text-xs transition-colors',
                      selectedLanguage === lang.id
                        ? 'bg-background text-foreground font-bold shadow-2xs'
                        : 'text-muted-foreground hover:text-foreground',
                    )
                  "
                  @click="selectedLanguage = lang.id as any"
                >
                  {{ lang.label }}
                </button>
              </div>

              <button
                type="button"
                class="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs transition-colors"
                @click="copySnippet"
              >
                <Check v-if="copiedSnippet" class="size-3 text-emerald-500" />
                <Copy v-else class="size-3" />
                <span>{{ copiedSnippet ? 'Copied' : 'Copy' }}</span>
              </button>
            </div>

            <CardContent class="bg-muted/10 p-4">
              <pre
                class="text-foreground overflow-x-auto text-xs leading-relaxed"
              ><code>{{ generatedCode }}</code></pre>
            </CardContent>
          </Card>

          <!-- Simulated Live HTTP Response -->
          <div class="border-border bg-muted/30 space-y-2 rounded-xl border p-4 font-mono text-xs">
            <div class="border-border/80 flex items-center justify-between border-b pb-2">
              <div class="flex items-center gap-2">
                <Terminal class="text-primary size-3.5" />
                <span class="text-foreground font-bold">Response Payload</span>
              </div>
              <div class="flex items-center gap-3 text-xs">
                <span class="font-bold text-emerald-500">HTTP {{ executionResult.status }} OK</span>
                <span class="text-muted-foreground">{{ executionResult.latencyMs }}ms</span>
              </div>
            </div>
            <pre
              class="text-muted-foreground overflow-x-auto text-xs leading-relaxed"
            ><code>{{ JSON.stringify(executionResult.data, null, 2) }}</code></pre>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
