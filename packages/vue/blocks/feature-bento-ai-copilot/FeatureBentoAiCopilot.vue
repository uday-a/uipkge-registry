<script setup lang="ts">
import { computed, ref } from 'vue'
import { Activity, ArrowRight, BrainCircuit, Check, Copy, Cpu, Play, Sliders, Sparkles, Zap } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface FeatureBentoAiCopilotProps {
  title?: string
  description?: string
  class?: string
}

const props = withDefaults(defineProps<FeatureBentoAiCopilotProps>(), {
  title: 'AI Copilot tooling built directly into your component architecture.',
  description:
    'Debug prompts, inspect LLM token streaming speeds, and synthesize Vue 3.5 and React 19 templates in real-time with sub-millisecond local latency.',
})

const selectedModel = ref<'sonnet' | 'gpt4o' | 'gemini'>('sonnet')
const temperature = ref(0.2)
const isGenerating = ref(false)
const systemPrompt = ref(
  'You are a senior UI design engineer. Generate an accessible, zero-dependency KPI metric card for Vue 3.5 and React 19 using semantic Tailwind v4 tokens.',
)
const generatedStream = ref(
  `<template>\n  <Card class="border-border bg-card p-4">\n    <div class="text-xs text-muted-foreground">MRR Growth</div>\n    <div class="text-2xl font-bold">$124,500</div>\n    <div class="text-xs text-emerald-500 font-medium">+18.4% vs last month</div>\n  </Card>\n</template>`,
)

const modelMetrics = computed(() => {
  if (selectedModel.value === 'sonnet') {
    return { name: 'Claude 3.5 Sonnet', ttftMs: 180, tokPerSec: 142, costPer1k: '$0.003' }
  }
  if (selectedModel.value === 'gpt4o') {
    return { name: 'GPT-4o Omnimodel', ttftMs: 140, tokPerSec: 165, costPer1k: '$0.0025' }
  }
  return { name: 'Gemini 1.5 Pro', ttftMs: 160, tokPerSec: 155, costPer1k: '$0.00125' }
})

const copied = ref(false)

async function copyCode() {
  try {
    await navigator.clipboard.writeText(generatedStream.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    // fallback
  }
}

function triggerGeneration() {
  isGenerating.value = true
  setTimeout(() => {
    isGenerating.value = false
  }, 1200)
}
</script>

<template>
  <section
    data-slot="feature-bento-ai-copilot"
    :class="cn('bg-background relative overflow-hidden py-16 sm:py-24', props.class)"
  >
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="mx-auto max-w-3xl space-y-4 text-center">
        <a
          href="#ai-copilot"
          class="group border-border/80 bg-secondary/60 hover:bg-secondary text-foreground inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-medium shadow-2xs transition-colors"
        >
          <Sparkles class="text-primary size-3.5" />
          <span>Next-Gen AI Agent Workbench</span>
          <ArrowRight class="text-muted-foreground size-3 transition-transform group-hover:translate-x-0.5" />
        </a>

        <h2 class="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
          {{ title }}
        </h2>

        <p class="text-muted-foreground text-base sm:text-lg">
          {{ description }}
        </p>
      </div>

      <!-- Bento Grid (3 Cards) -->
      <div class="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <!-- Left: Model Tuning & Hyperparameters (5 Cols) -->
        <Card class="border-border bg-card/80 flex flex-col justify-between shadow-xs backdrop-blur-xs lg:col-span-5">
          <CardContent class="space-y-5 p-6">
            <div class="border-border flex items-center justify-between border-b pb-3">
              <div class="flex items-center gap-2">
                <Sliders class="text-primary size-4" />
                <span class="text-foreground text-sm font-semibold">Inference Hyperparameters</span>
              </div>
              <Badge variant="outline" class="border-border font-mono text-xs">
                {{ modelMetrics.name }}
              </Badge>
            </div>

            <!-- Model Switcher -->
            <div class="space-y-2">
              <label class="text-muted-foreground text-xs font-semibold tracking-wider uppercase"
                >Foundation Model</label
              >
              <div class="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  :class="
                    cn(
                      'rounded-lg border p-2 text-center text-xs font-medium transition-colors',
                      selectedModel === 'sonnet'
                        ? 'border-primary bg-primary/10 text-primary font-semibold'
                        : 'border-border bg-muted/40 text-muted-foreground hover:text-foreground',
                    )
                  "
                  @click="selectedModel = 'sonnet'"
                >
                  Sonnet 3.5
                </button>
                <button
                  type="button"
                  :class="
                    cn(
                      'rounded-lg border p-2 text-center text-xs font-medium transition-colors',
                      selectedModel === 'gpt4o'
                        ? 'border-primary bg-primary/10 text-primary font-semibold'
                        : 'border-border bg-muted/40 text-muted-foreground hover:text-foreground',
                    )
                  "
                  @click="selectedModel = 'gpt4o'"
                >
                  GPT-4o
                </button>
                <button
                  type="button"
                  :class="
                    cn(
                      'rounded-lg border p-2 text-center text-xs font-medium transition-colors',
                      selectedModel === 'gemini'
                        ? 'border-primary bg-primary/10 text-primary font-semibold'
                        : 'border-border bg-muted/40 text-muted-foreground hover:text-foreground',
                    )
                  "
                  @click="selectedModel = 'gemini'"
                >
                  Gemini Pro
                </button>
              </div>
            </div>

            <!-- Temperature Slider -->
            <div class="space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="text-foreground font-medium">Sampling Temperature</span>
                <span class="text-primary font-mono font-bold">{{ temperature }}</span>
              </div>
              <input
                v-model.number="temperature"
                type="range"
                min="0"
                max="1"
                step="0.1"
                class="accent-primary w-full cursor-pointer"
              />
              <div class="text-muted-foreground flex justify-between text-xs">
                <span>0.0 (Deterministic)</span>
                <span>1.0 (Creative)</span>
              </div>
            </div>

            <!-- System Prompt Input -->
            <div class="space-y-2">
              <label class="text-muted-foreground text-xs font-semibold tracking-wider uppercase"
                >System Directive</label
              >
              <textarea
                v-model="systemPrompt"
                rows="3"
                class="border-border bg-muted/30 text-foreground focus-visible:ring-primary w-full rounded-md border p-2.5 font-mono text-xs focus-visible:ring-1 focus-visible:outline-none"
              />
            </div>

            <!-- Action Button -->
            <Button class="w-full gap-2 shadow-xs" :disabled="isGenerating" @click="triggerGeneration">
              <Play v-if="!isGenerating" class="size-3.5" />
              <Zap v-else class="size-3.5 animate-spin" />
              <span>{{ isGenerating ? 'Streaming Inference...' : 'Synthesize UI Primitive' }}</span>
            </Button>
          </CardContent>
        </Card>

        <!-- Right: Streaming Code Output & Real-time Telemetry (7 Cols) -->
        <Card class="border-border bg-card/80 flex flex-col justify-between shadow-xs backdrop-blur-xs lg:col-span-7">
          <CardContent class="space-y-4 p-6">
            <!-- Output Header & Telemetry -->
            <div class="border-border flex flex-wrap items-center justify-between gap-3 border-b pb-3">
              <div class="flex items-center gap-2">
                <BrainCircuit class="size-4 text-emerald-500" />
                <span class="text-foreground text-sm font-semibold">Live Streaming Synthesis</span>
              </div>

              <div class="flex items-center gap-2">
                <Button variant="ghost" size="sm" class="h-7 gap-1 px-2 font-mono text-xs" @click="copyCode">
                  <Check v-if="copied" class="text-primary size-3.5" />
                  <Copy v-else class="size-3.5" />
                  <span>{{ copied ? 'Copied' : 'Copy SFC' }}</span>
                </Button>
              </div>
            </div>

            <!-- Telemetry KPI Pill Row -->
            <div class="border-border bg-muted/20 grid grid-cols-3 gap-3 rounded-lg border p-3">
              <div class="space-y-0.5">
                <div class="text-muted-foreground flex items-center gap-1 text-xs">
                  <Activity class="size-3 text-emerald-500" />
                  <span>TTFT</span>
                </div>
                <div class="text-foreground font-mono text-sm font-bold">{{ modelMetrics.ttftMs }}ms</div>
              </div>
              <div class="space-y-0.5">
                <div class="text-muted-foreground flex items-center gap-1 text-xs">
                  <Cpu class="size-3 text-sky-500" />
                  <span>Velocity</span>
                </div>
                <div class="text-foreground font-mono text-sm font-bold">{{ modelMetrics.tokPerSec }} tok/s</div>
              </div>
              <div class="space-y-0.5">
                <div class="text-muted-foreground flex items-center gap-1 text-xs">
                  <Zap class="text-primary size-3" />
                  <span>Cost</span>
                </div>
                <div class="text-foreground font-mono text-sm font-bold">{{ modelMetrics.costPer1k }}/1k</div>
              </div>
            </div>

            <!-- Code Sandbox Block -->
            <div
              class="border-border bg-muted/50 text-foreground relative overflow-x-auto rounded-lg border p-4 font-mono text-xs"
            >
              <pre class="leading-relaxed"><code>{{ generatedStream }}</code></pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>
