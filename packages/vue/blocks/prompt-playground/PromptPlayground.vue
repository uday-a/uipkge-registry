<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import {
  Bot,
  Braces,
  Check,
  Clock,
  Copy,
  Cpu,
  FileCode,
  MessageSquare,
  RotateCcw,
  Save,
  Sliders,
  Sparkles,
  Terminal,
  Zap,
} from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

interface ModelOption {
  id: string
  name: string
  provider: string
  contextWindow: string
  inputCostPer1M: number
  outputCostPer1M: number
}

interface Preset {
  id: string
  name: string
  description: string
  model: string
  temperature: number
  maxTokens: number
  topP: number
  jsonMode: boolean
  stream: boolean
  systemPrompt: string
  userMessage: string
  mockResponse: string
  mockTokens: number
  mockLatency: string
}

const models: ModelOption[] = [
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    contextWindow: '200k',
    inputCostPer1M: 3.0,
    outputCostPer1M: 15.0,
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    contextWindow: '128k',
    inputCostPer1M: 2.5,
    outputCostPer1M: 10.0,
  },
  {
    id: 'llama-3-3-70b',
    name: 'Llama 3.3 70B',
    provider: 'Meta',
    contextWindow: '128k',
    inputCostPer1M: 0.6,
    outputCostPer1M: 0.8,
  },
]

const presets: Preset[] = [
  {
    id: 'code-reviewer',
    name: 'Code Reviewer',
    description: 'Security & vulnerability audit for backend code',
    model: 'claude-3-5-sonnet',
    temperature: 0.2,
    maxTokens: 2048,
    topP: 0.9,
    jsonMode: false,
    stream: true,
    systemPrompt:
      'You are a world-class senior developer assistant specializing in application security, code reviews, and high-performance software architecture. Analyze code with precision, highlight vulnerabilities (OWASP Top 10), and provide clean refactored snippets.',
    userMessage:
      'Review the following authentication middleware for security vulnerabilities and race conditions:\n\n```typescript\nexport async function authMiddleware(req: Request) {\n  const token = req.headers.get("authorization")?.split(" ")[1];\n  if (!token) throw new Error("Unauthorized");\n  const session = await db.session.findUnique({ where: { token } });\n  if (session.expiresAt < new Date()) {\n    await db.session.delete({ where: { token } });\n    throw new Error("Expired");\n  }\n  return session.user;\n}\n```',
    mockResponse:
      '### Security Review & Vulnerability Analysis\n\nI identified 3 key security & stability issues in the provided authentication middleware:\n\n1. **Unhandled Exceptions / Missing Error Envelope:**\n   Throwing raw `Error` instances inside middleware can cause unhandled 500 crashes instead of structured 401/403 HTTP responses.\n2. **Missing Token Existence Check on DB lookup:**\n   If `session` is not found, `session.expiresAt` throws a `TypeError` (cannot read properties of null).\n3. **Non-atomic Cleanup & Database Mutation:**\n   Deleting expired tokens in the read path introduces write amplification on every expired request and isn\'t atomic with the expiration verification.\n\n---\n\n### Recommended Refactoring\n\n```typescript\nimport { NextResponse } from "next/server";\n\nexport async function authMiddleware(req: Request) {\n  const authHeader = req.headers.get("authorization");\n  if (!authHeader?.startsWith("Bearer ")) {\n    return new Response(JSON.stringify({ error: "Missing or malformed Authorization header" }), {\n      status: 401,\n      headers: { "Content-Type": "application/json" },\n    });\n  }\n\n  const token = authHeader.slice(7).trim();\n  const session = await db.session.findUnique({\n    where: { token },\n    include: { user: true },\n  });\n\n  if (!session || session.expiresAt.getTime() <= Date.now()) {\n    return new Response(JSON.stringify({ error: "Invalid or expired session" }), {\n      status: 401,\n      headers: { "Content-Type": "application/json" },\n    });\n  }\n\n  return session.user;\n}\n```\n\n**Key Improvements:**\n- Constant-time prefix check avoiding unexpected array indexing errors.\n- Null-safe session expiration check without throwing uncaught exceptions.\n- Immediate 401 JSON error responses matching standard API conventions.',
    mockTokens: 428,
    mockLatency: '1.4s',
  },
  {
    id: 'customer-support',
    name: 'Customer Support Agent',
    description: 'Empathetic, brand-aligned troubleshooting for customer inquiries',
    model: 'gpt-4o',
    temperature: 0.7,
    maxTokens: 1024,
    topP: 0.95,
    jsonMode: false,
    stream: true,
    systemPrompt:
      'You are an empathetic, concise, and professional Tier-2 support specialist for CloudFlow SaaS. Your goal is to troubleshoot customer issues efficiently while maintaining a helpful, brand-aligned tone.',
    userMessage:
      'A customer wrote: "Our webhooks stopped delivering payload events since 14:00 UTC today. We are seeing intermittent 504 gateway timeout errors on endpoint https://api.client.com/events. Can you check our account ID #ACC-9821?"',
    mockResponse:
      'Hello Team,\n\nThank you for reaching out, and I apologize for the disruption to your event pipeline.\n\nI investigated account **#ACC-9821** and observed the following:\n\n- **Root Cause:** Our webhook dispatch worker encountered downstream 504 Gateway Timeouts from `https://api.client.com/events` when response times exceeded the 5,000ms threshold.\n- **Retry Mechanism:** Failed webhook events have been automatically enrolled into exponential backoff (attempt 3 of 5).\n- **Action Taken:** We temporarily increased the worker handshake timeout to 8,000ms for your tenant while your ingress recovers.\n\n**Recommended Next Steps:**\n1. Check your upstream server logs around 14:00 UTC for concurrent connection saturation or database connection pool starvation.\n2. If you need all 14:00–15:00 UTC events replayed immediately, reply with **"CONFIRM REPLAY #ACC-9821"** and I will trigger a zero-loss backfill.\n\nBest regards,\n**CloudFlow Tier-2 Engineering Support**',
    mockTokens: 286,
    mockLatency: '0.9s',
  },
  {
    id: 'json-extractor',
    name: 'JSON Extractor',
    description: 'Strict schema extraction from unstructured invoices or logs',
    model: 'gpt-4o',
    temperature: 0.0,
    maxTokens: 1024,
    topP: 0.1,
    jsonMode: true,
    stream: false,
    systemPrompt:
      'You are an infallible data extraction engine. Extract structured entities from unstructured receipts, invoices, or logs and return ONLY valid RFC-8259 JSON matching the requested schema. Do not include markdown formatting, explanations, or prologue.',
    userMessage:
      'Extract invoice metadata:\nInvoice Number: INV-2026-8891\nDate: August 21, 2026\nVendor: Acme Cloud Services LLC (Tax ID: US-99182312)\nClient: Cyberdyne Systems\nItems:\n1. GPU Cluster Instance H100 x 48 hrs @ $3.20/hr = $153.60\n2. NVMe High-Speed Storage 2TB x 1 mo @ $80.00/mo = $80.00\nTax: $18.69 (8%)\nTotal Due: $252.29',
    mockResponse:
      '{\n  "invoiceNumber": "INV-2026-8891",\n  "issueDate": "2026-08-21",\n  "vendor": {\n    "name": "Acme Cloud Services LLC",\n    "taxId": "US-99182312"\n  },\n  "client": {\n    "name": "Cyberdyne Systems"\n  },\n  "lineItems": [\n    {\n      "description": "GPU Cluster Instance H100",\n      "quantity": 48,\n      "unit": "hours",\n      "unitPrice": 3.20,\n      "totalPrice": 153.60\n    },\n    {\n      "description": "NVMe High-Speed Storage 2TB",\n      "quantity": 1,\n      "unit": "month",\n      "unitPrice": 80.00,\n      "totalPrice": 80.00\n    }\n  ],\n  "subtotal": 233.60,\n  "taxRate": 0.08,\n  "taxAmount": 18.69,\n  "totalAmount": 252.29,\n  "currency": "USD"\n}',
    mockTokens: 215,
    mockLatency: '0.6s',
  },
]

const selectedModel = ref('claude-3-5-sonnet')
const selectedPreset = ref('code-reviewer')

const systemPrompt = ref(presets[0].systemPrompt)
const userMessage = ref(presets[0].userMessage)
const temperature = ref(presets[0].temperature)
const maxTokens = ref(presets[0].maxTokens)
const topP = ref(presets[0].topP)
const jsonMode = ref(presets[0].jsonMode)
const streamResponses = ref(presets[0].stream)

const displayedResponse = ref(presets[0].mockResponse)
const responseStatus = ref('200 OK · 1.4s · 428 tokens')
const isGenerating = ref(false)
const showRawJson = ref(false)
const isCopied = ref(false)
const isPresetSaved = ref(false)

let streamTimer: ReturnType<typeof setInterval> | null = null

const activeModel = computed(() => {
  return models.find((m) => m.id === selectedModel.value) ?? models[0]
})

const estimatedPromptTokens = computed(() => {
  const combined = (systemPrompt.value || '') + (userMessage.value || '')
  return Math.max(1, Math.round(combined.length / 3.8))
})

const estimatedTotalTokens = computed(() => {
  const outputEstimate = isGenerating.value ? Math.round(maxTokens.value / 4) : 428
  return estimatedPromptTokens.value + outputEstimate
})

const estimatedCost = computed(() => {
  const m = activeModel.value
  const inputCost = (estimatedPromptTokens.value / 1_000_000) * m.inputCostPer1M
  const outputCost = (428 / 1_000_000) * m.outputCostPer1M
  return (inputCost + outputCost).toFixed(4)
})

const rawJsonPayload = computed(() => {
  return JSON.stringify(
    {
      id: `chatcmpl-${Math.random().toString(36).substring(2, 10)}`,
      object: 'chat.completion',
      created: 1787313600,
      model: selectedModel.value,
      system_fingerprint: 'fp_uipkge_49a',
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: displayedResponse.value,
          },
          finish_reason: 'stop',
        },
      ],
      usage: {
        prompt_tokens: estimatedPromptTokens.value,
        completion_tokens: 428,
        total_tokens: estimatedPromptTokens.value + 428,
      },
      configuration: {
        temperature: temperature.value,
        max_tokens: maxTokens.value,
        top_p: topP.value,
        response_format: jsonMode.value ? { type: 'json_object' } : { type: 'text' },
        stream: streamResponses.value,
      },
    },
    null,
    2,
  )
})

function applyPreset(presetId: string) {
  const preset = presets.find((p) => p.id === presetId)
  if (!preset) return

  systemPrompt.value = preset.systemPrompt
  userMessage.value = preset.userMessage
  selectedModel.value = preset.model
  temperature.value = preset.temperature
  maxTokens.value = preset.maxTokens
  topP.value = preset.topP
  jsonMode.value = preset.jsonMode
  streamResponses.value = preset.stream
  displayedResponse.value = preset.mockResponse
  responseStatus.value = `200 OK · ${preset.mockLatency} · ${preset.mockTokens} tokens`
}

watch(selectedPreset, (newPreset) => {
  applyPreset(newPreset)
})

function runPrompt() {
  if (isGenerating.value) return
  if (streamTimer) clearInterval(streamTimer)

  const activePresetObj = presets.find((p) => p.id === selectedPreset.value) ?? presets[0]
  const targetResponse =
    jsonMode.value && !activePresetObj.jsonMode ? presets[2].mockResponse : activePresetObj.mockResponse
  const targetLatency = activePresetObj.mockLatency
  const targetTokens = activePresetObj.mockTokens

  isGenerating.value = true
  responseStatus.value = 'Generating...'

  if (streamResponses.value) {
    displayedResponse.value = ''
    let charIndex = 0
    const chunkSize = 8
    const totalChars = targetResponse.length

    streamTimer = setInterval(() => {
      charIndex += chunkSize
      if (charIndex >= totalChars) {
        displayedResponse.value = targetResponse
        if (streamTimer) clearInterval(streamTimer)
        streamTimer = null
        isGenerating.value = false
        responseStatus.value = `200 OK · ${targetLatency} · ${targetTokens} tokens`
      } else {
        displayedResponse.value = targetResponse.slice(0, charIndex)
      }
    }, 25)
  } else {
    setTimeout(() => {
      displayedResponse.value = targetResponse
      isGenerating.value = false
      responseStatus.value = `200 OK · ${targetLatency} · ${targetTokens} tokens`
    }, 600)
  }
}

function handleCopyResponse() {
  if (!displayedResponse.value) return
  navigator.clipboard?.writeText(displayedResponse.value)
  isCopied.value = true
  setTimeout(() => {
    isCopied.value = false
  }, 2000)
}

function handleSavePreset() {
  isPresetSaved.value = true
  setTimeout(() => {
    isPresetSaved.value = false
  }, 2000)
}

function handleResetDefaults() {
  temperature.value = 0.7
  maxTokens.value = 2048
  topP.value = 0.9
  jsonMode.value = false
  streamResponses.value = true
}

function handleKeydown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault()
    runPrompt()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  if (streamTimer) clearInterval(streamTimer)
})
</script>

<template>
  <div data-slot="prompt-playground" class="w-full space-y-6">
    <!-- Top Toolbar -->
    <div
      class="border-border bg-card/70 flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3.5 shadow-xs backdrop-blur-xs"
    >
      <div class="flex flex-wrap items-center gap-2.5">
        <!-- Model Selector -->
        <div class="w-48">
          <Select v-model="selectedModel">
            <SelectTrigger class="h-9 w-full text-xs font-medium" aria-label="Select AI Model">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="m in models" :key="m.id" :value="m.id">
                <div class="flex items-center gap-2">
                  <Sparkles class="text-primary size-3.5" />
                  <span>{{ m.name }}</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Preset Template Dropdown -->
        <div class="w-52">
          <Select v-model="selectedPreset">
            <SelectTrigger class="h-9 w-full text-xs" aria-label="Select Preset Template">
              <SelectValue placeholder="Preset template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="p in presets" :key="p.id" :value="p.id">
                <span>{{ p.name }}</span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Token Counter Pill -->
        <div
          class="border-border bg-muted/60 text-muted-foreground hidden items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs md:inline-flex"
        >
          <Cpu class="text-primary size-3.5" />
          <span>{{ estimatedTotalTokens.toLocaleString() }} tokens</span>
          <span class="text-foreground font-medium">${{ estimatedCost }}</span>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <!-- Save Preset Outline Button -->
        <Button variant="outline" size="sm" class="h-9 gap-1.5 text-xs font-medium" @click="handleSavePreset">
          <Check v-if="isPresetSaved" class="text-success size-3.5" />
          <Save v-else class="size-3.5" />
          <span>{{ isPresetSaved ? 'Saved!' : 'Save Preset' }}</span>
        </Button>

        <!-- Run Prompt Primary Button -->
        <Button
          size="sm"
          class="bg-primary text-primary-foreground h-9 gap-1.5 text-xs font-medium shadow-xs"
          :disabled="isGenerating"
          @click="runPrompt"
        >
          <span
            v-if="isGenerating"
            class="border-primary-foreground size-3.5 animate-spin rounded-full border-2 border-t-transparent"
          />
          <Zap v-else class="size-3.5 fill-current" />
          <span>{{ isGenerating ? 'Running...' : 'Run Prompt' }}</span>
          <kbd
            class="bg-primary-foreground/20 hidden items-center rounded px-1 py-0.5 font-mono text-xs sm:inline-flex"
          >
            ⌘↵
          </kbd>
        </Button>
      </div>
    </div>

    <!-- 2-Column Studio Layout -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <!-- Left Panel: Prompt Configuration & Test Input -->
      <div class="space-y-6 lg:col-span-7">
        <!-- System Instructions Card -->
        <Card class="border-border bg-card shadow-xs">
          <CardHeader class="pb-3">
            <div class="flex flex-wrap items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md">
                  <Bot class="size-4" />
                </div>
                <div>
                  <CardTitle class="text-sm font-semibold">System Instructions</CardTitle>
                  <CardDescription class="text-xs"
                    >Behavior, role personality, and operational constraints</CardDescription
                  >
                </div>
              </div>
              <Badge variant="secondary" class="font-mono text-xs">role: system</Badge>
            </div>
          </CardHeader>
          <CardContent class="pt-0">
            <Textarea
              v-model="systemPrompt"
              placeholder="You are an expert AI assistant..."
              :rows="4"
              no-resize
              class="border-border/70 focus:border-primary font-mono text-xs leading-relaxed"
            />
          </CardContent>
          <CardFooter
            class="border-border text-muted-foreground flex flex-wrap items-center justify-between border-t pt-3 text-xs"
          >
            <span class="flex flex-wrap items-center gap-1.5">
              <FileCode class="size-3.5" />
              <span>Context: {{ activeModel.contextWindow }}</span>
            </span>
            <span class="font-mono">{{ systemPrompt.length }} chars</span>
          </CardFooter>
        </Card>

        <!-- User Message Input Card -->
        <Card class="border-border bg-card shadow-xs">
          <CardHeader class="pb-3">
            <div class="flex flex-wrap items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="bg-secondary text-secondary-foreground flex size-7 items-center justify-center rounded-md">
                  <MessageSquare class="size-4" />
                </div>
                <div>
                  <CardTitle class="text-sm font-semibold">User Message</CardTitle>
                  <CardDescription class="text-xs">Prompt input payload and test variables</CardDescription>
                </div>
              </div>
              <Badge variant="outline" class="font-mono text-xs">role: user</Badge>
            </div>
          </CardHeader>
          <CardContent class="pt-0">
            <Textarea
              v-model="userMessage"
              placeholder="Enter user test prompt..."
              :rows="7"
              no-resize
              class="border-border/70 focus:border-primary font-mono text-xs leading-relaxed"
            />
          </CardContent>
          <CardFooter
            class="border-border text-muted-foreground flex flex-wrap items-center justify-between border-t pt-3 text-xs"
          >
            <div class="flex items-center gap-2">
              <span class="text-muted-foreground text-xs">Quick inject:</span>
              <button
                type="button"
                class="hover:border-primary/60 hover:text-foreground min-h-6 rounded border border-dashed px-1.5 py-0.5 font-mono text-xs transition-colors"
                @click="userMessage += '\n\nEnsure strict backward compatibility.'"
              >
                +compatibility
              </button>
              <button
                type="button"
                class="hover:border-primary/60 hover:text-foreground min-h-6 rounded border border-dashed px-1.5 py-0.5 font-mono text-xs transition-colors"
                @click="userMessage += '\n\nOutput in concise bullet points.'"
              >
                +bullets
              </button>
            </div>
            <span class="font-mono">~{{ estimatedPromptTokens }} tokens</span>
          </CardFooter>
        </Card>
      </div>

      <!-- Right Panel: Parameters Sidebar + Output Card -->
      <div class="space-y-6 lg:col-span-5">
        <!-- Right Parameter Sidebar Card -->
        <Card class="border-border bg-card shadow-xs">
          <CardHeader class="pb-3">
            <div class="flex flex-wrap items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="bg-muted text-muted-foreground flex size-7 items-center justify-center rounded-md">
                  <Sliders class="size-4" />
                </div>
                <CardTitle class="text-sm font-semibold">Parameters</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                class="text-muted-foreground hover:text-foreground h-7 px-2 text-xs"
                @click="handleResetDefaults"
              >
                <RotateCcw class="mr-1 size-3" />
                <span>Reset</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent class="space-y-4 pt-0">
            <!-- Temperature Slider -->
            <div class="space-y-2">
              <div class="flex flex-wrap items-center justify-between text-xs">
                <label class="text-foreground font-medium">Temperature</label>
                <span class="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono font-medium">
                  {{ Number(temperature).toFixed(2) }}
                </span>
              </div>
              <Slider v-model="temperature" :min="0" :max="1" :step="0.05" />
              <div class="text-muted-foreground flex justify-between text-xs">
                <span>0.0 (Deterministic)</span>
                <span>1.0 (Creative)</span>
              </div>
            </div>

            <!-- Max Tokens Slider -->
            <div class="space-y-2">
              <div class="flex flex-wrap items-center justify-between text-xs">
                <label class="text-foreground font-medium">Max Tokens</label>
                <span class="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono font-medium">
                  {{ Number(maxTokens).toLocaleString() }}
                </span>
              </div>
              <Slider v-model="maxTokens" :min="256" :max="4096" :step="128" />
              <div class="text-muted-foreground flex justify-between text-xs">
                <span>256</span>
                <span>4,096</span>
              </div>
            </div>

            <!-- Top P Slider -->
            <div class="space-y-2">
              <div class="flex flex-wrap items-center justify-between text-xs">
                <label class="text-foreground font-medium">Top P</label>
                <span class="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono font-medium">
                  {{ Number(topP).toFixed(2) }}
                </span>
              </div>
              <Slider v-model="topP" :min="0" :max="1" :step="0.05" />
              <div class="text-muted-foreground flex justify-between text-xs">
                <span>0.0 (Focused)</span>
                <span>1.0 (Diverse)</span>
              </div>
            </div>

            <Separator />

            <!-- Switches -->
            <div class="space-y-3">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <div class="space-y-0.5">
                  <label for="vue-json-mode" class="text-foreground cursor-pointer text-xs font-medium">
                    JSON Mode
                  </label>
                  <p class="text-muted-foreground text-xs">Enforce structured JSON output</p>
                </div>
                <Switch id="vue-json-mode" v-model="jsonMode" />
              </div>

              <div class="flex flex-wrap items-center justify-between gap-2">
                <div class="space-y-0.5">
                  <label for="vue-stream-responses" class="text-foreground cursor-pointer text-xs font-medium">
                    Stream Responses
                  </label>
                  <p class="text-muted-foreground text-xs">Simulate real-time token streaming</p>
                </div>
                <Switch id="vue-stream-responses" v-model="streamResponses" />
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Response Output Card -->
        <Card class="border-border bg-card shadow-xs">
          <CardHeader class="pb-3">
            <div class="flex flex-wrap items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md">
                  <Terminal class="size-4" />
                </div>
                <div>
                  <CardTitle class="text-sm font-semibold">Response Output</CardTitle>
                </div>
              </div>
              <div class="flex flex-wrap items-center gap-1.5">
                <Button
                  variant="ghost"
                  size="sm"
                  class="h-7 px-2 text-xs"
                  :class="showRawJson ? 'text-primary bg-primary/10' : 'text-muted-foreground'"
                  @click="showRawJson = !showRawJson"
                >
                  <Braces class="mr-1 size-3.5" />
                  <span>{{ showRawJson ? 'Formatted' : 'Raw JSON' }}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  class="text-muted-foreground hover:text-foreground h-7 px-2 text-xs"
                  @click="handleCopyResponse"
                >
                  <Check v-if="isCopied" class="text-success mr-1 size-3.5" />
                  <Copy v-else class="mr-1 size-3.5" />
                  <span>{{ isCopied ? 'Copied' : 'Copy' }}</span>
                </Button>
              </div>
            </div>
            <div class="mt-2 flex items-center gap-2">
              <Badge
                variant="outline"
                class="font-mono text-xs"
                :class="
                  isGenerating ? 'border-primary/40 text-primary animate-pulse' : 'border-success/30 text-success'
                "
              >
                <span
                  class="mr-1.5 inline-block size-1.5 rounded-full"
                  :class="isGenerating ? 'bg-primary' : 'bg-success'"
                />
                {{ responseStatus }}
              </Badge>
            </div>
          </CardHeader>
          <CardContent class="pt-0">
            <!-- Raw JSON View -->
            <div v-if="showRawJson" class="relative">
              <pre
                class="border-border bg-muted/40 text-foreground max-h-[380px] overflow-x-auto overflow-y-auto rounded-md border p-3.5 font-mono text-xs leading-relaxed"
              ><code>{{ rawJsonPayload }}</code></pre>
            </div>

            <!-- Prose / Markdown View -->
            <div
              v-else
              class="border-border bg-muted/20 text-foreground max-h-[380px] min-h-[220px] overflow-y-auto rounded-md border p-3.5 font-mono text-xs leading-relaxed whitespace-pre-wrap"
            >
              {{ displayedResponse
              }}<span v-if="isGenerating" class="text-primary ml-0.5 inline-block animate-pulse">▋</span>
            </div>
          </CardContent>
          <CardFooter
            class="border-border text-muted-foreground flex flex-wrap items-center justify-between border-t pt-3 text-xs"
          >
            <span class="flex items-center gap-1">
              <Clock class="size-3.5" />
              <span>Finish: stop</span>
            </span>
            <span class="font-mono">Throughput: ~305 tok/s</span>
          </CardFooter>
        </Card>
      </div>
    </div>
  </div>
</template>
