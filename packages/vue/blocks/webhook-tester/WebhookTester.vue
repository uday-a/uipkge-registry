<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import type { HTMLAttributes } from 'vue'
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  FileCode,
  Globe,
  Key,
  Layers,
  Play,
  RefreshCw,
  RotateCw,
  Send,
  Server,
  ShieldCheck,
  Terminal,
  Zap,
} from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface EventPreset {
  id: string
  name: string
  category: string
  description: string
  defaultPayload: object
}

interface DeliveryAttempt {
  id: string
  eventId: string
  eventType: string
  status: number
  statusText: string
  timestamp: string
  timeAgo: string
  latencyMs: number
  endpointUrl: string
  signature: string
  requestHeaders: Record<string, string>
  requestBody: string
  responseHeaders: Record<string, string>
  responseBody: string
  timings: {
    dns: number
    tls: number
    ttfb: number
    download: number
    total: number
  }
}

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const eventPresets: EventPreset[] = [
  {
    id: 'customer.created',
    name: 'customer.created',
    category: 'Customers',
    description: 'Dispatched whenever a new customer account or profile is created.',
    defaultPayload: {
      id: 'evt_1PqN8y2eZvKYlo2C79x01abc',
      object: 'event',
      api_version: '2026-08-01',
      created: 1787313600,
      type: 'customer.created',
      data: {
        object: {
          id: 'cus_N0wP9XyZ12345',
          object: 'customer',
          name: 'Sarah Connor',
          email: 'sarah.connor@cyberdyne.io',
          phone: '+1 415 555 0199',
          currency: 'usd',
          metadata: {
            source: 'onboarding_flow_v2',
            tier: 'enterprise',
          },
        },
      },
    },
  },
  {
    id: 'invoice.payment_succeeded',
    name: 'invoice.payment_succeeded',
    category: 'Billing',
    description: 'Triggered upon successful capture and settlement of recurring invoice payment.',
    defaultPayload: {
      id: 'evt_2MqK7x3eZvKYlo2C88y02def',
      object: 'event',
      api_version: '2026-08-01',
      created: 1787313580,
      type: 'invoice.payment_succeeded',
      data: {
        object: {
          id: 'in_1QpZ2w3eZvKYlo2C99182312',
          object: 'invoice',
          customer: 'cus_N0wP9XyZ12345',
          amount_paid: 49000,
          amount_due: 49000,
          currency: 'usd',
          status: 'paid',
          paid_at: 1787313575,
          lines: {
            data: [
              {
                description: 'Pro Tier Subscription (10 Seats)',
                amount: 49000,
                period: {
                  start: 1787313500,
                  end: 1789905500,
                },
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'order.fulfilled',
    name: 'order.fulfilled',
    category: 'Fulfillment',
    description: 'Emitted when logistics carrier records the parcel as dispatched.',
    defaultPayload: {
      id: 'evt_3KpJ5v4eZvKYlo2C77z03ghi',
      object: 'event',
      api_version: '2026-08-01',
      created: 1787313520,
      type: 'order.fulfilled',
      data: {
        object: {
          id: 'ord_88192341',
          object: 'order',
          customer_id: 'cus_N0wP9XyZ12345',
          carrier: 'FedEx Priority',
          tracking_number: '794829103948',
          status: 'fulfilled',
          items_count: 3,
          fulfillment_date: '2026-08-21T14:38:40Z',
        },
      },
    },
  },
  {
    id: 'subscription.updated',
    name: 'subscription.updated',
    category: 'Subscriptions',
    description: 'Emitted when plan, billing frequency, or seat quantities update.',
    defaultPayload: {
      id: 'evt_4TqL9m1eZvKYlo2C66w04jkl',
      object: 'event',
      api_version: '2026-08-01',
      created: 1787313460,
      type: 'subscription.updated',
      data: {
        object: {
          id: 'sub_1QzX89aZvKYlo2C01',
          object: 'subscription',
          customer: 'cus_N0wP9XyZ12345',
          current_period_end: 1792497600,
          plan: {
            id: 'price_enterprise_yearly',
            name: 'Enterprise Annual',
            amount: 588000,
          },
          quantity: 25,
          status: 'active',
        },
      },
    },
  },
]

function generateDeterministicSignature(secret: string, payload: string, timestamp: number): string {
  let hash = 0
  const str = `${timestamp}.${secret}.${payload}`
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0
  }
  const hex1 = Math.abs(hash).toString(16).padStart(8, '0')
  const hex2 = Math.abs((hash * 31 + 17) | 0)
    .toString(16)
    .padStart(8, '0')
  const hex3 = Math.abs((hash * 127 + 59) | 0)
    .toString(16)
    .padStart(8, '0')
  const hex4 = Math.abs((hash * 8191 + 97) | 0)
    .toString(16)
    .padStart(8, '0')
  return `${hex1}${hex2}${hex3}${hex4}`
}

// Initial state
const endpointUrl = ref('https://api.acme.dev/webhooks')
const signingSecret = ref('whsec_9f83a8b271d4e680c102a9b6c7a3efd8')
const selectedEvent = ref('customer.created')
const currentPayloadStr = ref(JSON.stringify(eventPresets[0].defaultPayload, null, 2))
const signatureFormat = ref<'stripe' | 'svix'>('stripe')
const activeInspectorTab = ref('request')

const isSending = ref(false)
const copiedKey = ref<string | null>(null)

// Initial mock delivery history
const initialDeliveries: DeliveryAttempt[] = [
  {
    id: 'del_01J6A7BC8D9EF01',
    eventId: 'evt_1PqN8y2eZvKYlo2C79x01abc',
    eventType: 'customer.created',
    status: 200,
    statusText: 'OK',
    timestamp: '2026-08-21 14:40:12 UTC',
    timeAgo: '12s ago',
    latencyMs: 142,
    endpointUrl: 'https://api.acme.dev/webhooks',
    signature: 't=1787313612,v1=5257a869e7eceeda32ab62f1a9338f6cf60c9b07',
    requestHeaders: {
      'content-type': 'application/json; charset=utf-8',
      'user-agent': 'UIPKGE-Webhooks/2.0 (webhook-tester)',
      'stripe-signature': 't=1787313612,v1=5257a869e7eceeda32ab62f1a9338f6cf60c9b07',
      'webhook-id': 'msg_01J6A7BC8D9EF01',
      'webhook-timestamp': '1787313612',
    },
    requestBody: JSON.stringify(eventPresets[0].defaultPayload, null, 2),
    responseHeaders: {
      'content-type': 'application/json; charset=utf-8',
      date: 'Fri, 21 Aug 2026 14:40:12 GMT',
      server: 'cloudflare-worker',
      'x-request-id': 'req_98b47120aef1',
    },
    responseBody: JSON.stringify(
      {
        received: true,
        handler: 'customer_sync_v2',
        job_id: 'job_984129',
        processed_at: '2026-08-21T14:40:12.140Z',
      },
      null,
      2,
    ),
    timings: {
      dns: 14,
      tls: 26,
      ttfb: 88,
      download: 14,
      total: 142,
    },
  },
  {
    id: 'del_01J6A6ZZ7E8D9C0',
    eventId: 'evt_2MqK7x3eZvKYlo2C88y02def',
    eventType: 'invoice.payment_succeeded',
    status: 200,
    statusText: 'OK',
    timestamp: '2026-08-21 14:38:10 UTC',
    timeAgo: '2m ago',
    latencyMs: 98,
    endpointUrl: 'https://api.acme.dev/webhooks',
    signature: 't=1787313490,v1=99fa1b2388c4710aef12d098bc762a41289fe1b0',
    requestHeaders: {
      'content-type': 'application/json; charset=utf-8',
      'user-agent': 'UIPKGE-Webhooks/2.0 (webhook-tester)',
      'stripe-signature': 't=1787313490,v1=99fa1b2388c4710aef12d098bc762a41289fe1b0',
      'webhook-id': 'msg_01J6A6ZZ7E8D9C0',
      'webhook-timestamp': '1787313490',
    },
    requestBody: JSON.stringify(eventPresets[1].defaultPayload, null, 2),
    responseHeaders: {
      'content-type': 'application/json; charset=utf-8',
      date: 'Fri, 21 Aug 2026 14:38:10 GMT',
      server: 'nginx/1.24.0',
      'x-request-id': 'req_77a1902bc450',
    },
    responseBody: JSON.stringify(
      {
        status: 'ok',
        ledger_updated: true,
        invoice_id: 'in_1QpZ2w3eZvKYlo2C99182312',
      },
      null,
      2,
    ),
    timings: {
      dns: 10,
      tls: 20,
      ttfb: 56,
      download: 12,
      total: 98,
    },
  },
  {
    id: 'del_01J6A5YY4C2B1A9',
    eventId: 'evt_3KpJ5v4eZvKYlo2C77z03ghi',
    eventType: 'order.fulfilled',
    status: 500,
    statusText: 'Internal Server Error',
    timestamp: '2026-08-21 14:34:00 UTC',
    timeAgo: '6m ago',
    latencyMs: 1240,
    endpointUrl: 'https://api.acme.dev/webhooks',
    signature: 't=1787313240,v1=12fe48a90bb76c123490fdba891230cd78129aef',
    requestHeaders: {
      'content-type': 'application/json; charset=utf-8',
      'user-agent': 'UIPKGE-Webhooks/2.0 (webhook-tester)',
      'stripe-signature': 't=1787313240,v1=12fe48a90bb76c123490fdba891230cd78129aef',
      'webhook-id': 'msg_01J6A5YY4C2B1A9',
      'webhook-timestamp': '1787313240',
    },
    requestBody: JSON.stringify(eventPresets[2].defaultPayload, null, 2),
    responseHeaders: {
      'content-type': 'application/json; charset=utf-8',
      date: 'Fri, 21 Aug 2026 14:34:01 GMT',
      server: 'express-gateway',
      'x-request-id': 'req_33f8101cd991',
    },
    responseBody: JSON.stringify(
      {
        error: 'InternalServerError',
        message: 'Failed to connect to upstream ERP database at 10.0.4.12:5432 (ETIMEDOUT)',
        code: 'DB_CONN_TIMEOUT',
        retryable: true,
      },
      null,
      2,
    ),
    timings: {
      dns: 12,
      tls: 24,
      ttfb: 1190,
      download: 14,
      total: 1240,
    },
  },
]

const deliveryHistory = ref<DeliveryAttempt[]>([...initialDeliveries])
const selectedDeliveryId = ref<string>(initialDeliveries[0].id)

const currentTimestamp = ref(1787313600)

const activeDelivery = computed(() => {
  return deliveryHistory.value.find((d) => d.id === selectedDeliveryId.value) ?? deliveryHistory.value[0]
})

const activePreset = computed(() => {
  return eventPresets.find((p) => p.id === selectedEvent.value) ?? eventPresets[0]
})

const computedSignatureHex = computed(() => {
  return generateDeterministicSignature(signingSecret.value, currentPayloadStr.value, currentTimestamp.value)
})

const computedSignatureHeader = computed(() => {
  if (signatureFormat.value === 'stripe') {
    return `Stripe-Signature: t=${currentTimestamp.value},v1=${computedSignatureHex.value}`
  }
  return `webhook-signature: v1,${btoa(computedSignatureHex.value.slice(0, 32))}`
})

const computedAllHeaders = computed(() => {
  const t = currentTimestamp.value
  const sigHex = computedSignatureHex.value
  if (signatureFormat.value === 'stripe') {
    return `POST ${endpointUrl.value}\nHost: api.acme.dev\nContent-Type: application/json\nUser-Agent: UIPKGE-Webhooks/2.0\nStripe-Signature: t=${t},v1=${sigHex}`
  }
  return `POST ${endpointUrl.value}\nHost: api.acme.dev\nContent-Type: application/json\nUser-Agent: UIPKGE-Webhooks/2.0\nwebhook-id: msg_${sigHex.slice(0, 14)}\nwebhook-timestamp: ${t}\nwebhook-signature: v1,${btoa(sigHex.slice(0, 32))}`
})

function handleEventChange(eventId: unknown) {
  const id = String(eventId)
  selectedEvent.value = id
  const preset = eventPresets.find((p) => p.id === id)
  if (preset) {
    currentPayloadStr.value = JSON.stringify(preset.defaultPayload, null, 2)
  }
}

function handleFormatJson() {
  try {
    const parsed = JSON.parse(currentPayloadStr.value)
    currentPayloadStr.value = JSON.stringify(parsed, null, 2)
  } catch {
    // Keep as is if invalid
  }
}

function handleResetPayload() {
  const preset = eventPresets.find((p) => p.id === selectedEvent.value)
  if (preset) {
    currentPayloadStr.value = JSON.stringify(preset.defaultPayload, null, 2)
  }
}

function handleRegenerateSecret() {
  const chars = 'abcdef0123456789'
  let result = 'whsec_'
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  signingSecret.value = result
}

function handleCopy(text: string, key: string) {
  navigator.clipboard?.writeText(text)
  copiedKey.value = key
  setTimeout(() => {
    if (copiedKey.value === key) {
      copiedKey.value = null
    }
  }, 2000)
}

function sendWebhook() {
  if (isSending.value) return
  isSending.value = true

  const nowSec = Math.floor(Date.now() / 1000)
  currentTimestamp.value = nowSec

  setTimeout(() => {
    let parsedBody: any = {}
    let isInvalidJson = false
    try {
      parsedBody = JSON.parse(currentPayloadStr.value)
    } catch {
      isInvalidJson = true
    }

    const isFailureUrl = endpointUrl.value.includes('fail') || endpointUrl.value.includes('error')
    const status = isInvalidJson ? 400 : isFailureUrl ? 500 : 200
    const statusText = isInvalidJson ? 'Bad Request' : isFailureUrl ? 'Internal Server Error' : 'OK'
    const latency = isInvalidJson ? 32 : isFailureUrl ? 850 : Math.floor(Math.random() * 90) + 65

    const deliveryId = `del_${Math.random().toString(36).substring(2, 11).toUpperCase()}`
    const eventId = parsedBody?.id ?? `evt_${Math.random().toString(36).substring(2, 10)}`
    const eventType = parsedBody?.type ?? selectedEvent.value
    const sig = `t=${nowSec},v1=${computedSignatureHex.value}`

    const newDelivery: DeliveryAttempt = {
      id: deliveryId,
      eventId,
      eventType,
      status,
      statusText,
      timestamp: 'Just now',
      timeAgo: 'Just now',
      latencyMs: latency,
      endpointUrl: endpointUrl.value,
      signature: sig,
      requestHeaders: {
        'content-type': 'application/json; charset=utf-8',
        'user-agent': 'UIPKGE-Webhooks/2.0 (webhook-tester)',
        'stripe-signature': sig,
        'webhook-id': `msg_${deliveryId}`,
        'webhook-timestamp': String(nowSec),
      },
      requestBody: currentPayloadStr.value,
      responseHeaders: {
        'content-type': 'application/json; charset=utf-8',
        date: new Date().toUTCString(),
        server: 'acme-edge-router/1.8',
        'x-request-id': `req_${Math.random().toString(36).substring(2, 12)}`,
      },
      responseBody: isInvalidJson
        ? JSON.stringify({ error: 'BadRequest', message: 'Payload is not valid RFC 8259 JSON' }, null, 2)
        : isFailureUrl
          ? JSON.stringify(
              { error: 'InternalServerError', message: 'Webhook handler threw uncaught exception' },
              null,
              2,
            )
          : JSON.stringify(
              {
                received: true,
                event_type: eventType,
                delivery_id: deliveryId,
                status: 'acknowledged',
                timestamp: new Date().toISOString(),
              },
              null,
              2,
            ),
      timings: {
        dns: Math.floor(latency * 0.1),
        tls: Math.floor(latency * 0.2),
        ttfb: Math.floor(latency * 0.6),
        download: Math.floor(latency * 0.1),
        total: latency,
      },
    }

    deliveryHistory.value.unshift(newDelivery)
    selectedDeliveryId.value = newDelivery.id
    isSending.value = false
  }, 450)
}

function retryDelivery(attempt: DeliveryAttempt) {
  currentPayloadStr.value = attempt.requestBody
  endpointUrl.value = attempt.endpointUrl
  selectedEvent.value = attempt.eventType
  sendWebhook()
}

function handleKeydown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault()
    sendWebhook()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div data-slot="webhook-tester" :class="cn('w-full space-y-6', props.class)">
    <!-- Top Header Banner & Primary Endpoint Controls -->
    <Card class="border-border bg-card/80 shadow-xs backdrop-blur-xs">
      <CardHeader class="pb-4">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <div class="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
                <Zap class="size-4" />
              </div>
              <CardTitle class="text-base font-semibold">Webhook Event Simulator & Inspector</CardTitle>
            </div>
            <CardDescription class="text-xs">
              Trigger test events and verify signature headers against your endpoint.
            </CardDescription>
          </div>

          <div class="flex items-center gap-2">
            <Badge variant="outline" class="border-border bg-muted/50 font-mono text-xs">
              <span class="bg-success mr-1.5 inline-block size-2 animate-pulse rounded-full" />
              Ingress Ready
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent class="pt-0">
        <div class="grid grid-cols-1 gap-3 md:grid-cols-12">
          <!-- Endpoint URL Input -->
          <div class="md:col-span-8 lg:col-span-9">
            <div class="relative flex items-center">
              <span
                class="text-muted-foreground pointer-events-none absolute left-3 flex items-center gap-1.5 font-mono text-xs"
              >
                <Globe class="size-3.5" />
                <span class="text-foreground font-semibold">POST</span>
              </span>
              <Input
                v-model="endpointUrl"
                placeholder="https://api.acme.dev/webhooks"
                class="pl-20 font-mono text-xs"
              />
            </div>
          </div>

          <!-- Trigger Button -->
          <div class="md:col-span-4 lg:col-span-3">
            <Button
              size="default"
              class="w-full gap-2 text-xs font-medium shadow-xs"
              :disabled="isSending || !endpointUrl"
              @click="sendWebhook"
            >
              <span
                v-if="isSending"
                class="border-primary-foreground size-3.5 animate-spin rounded-full border-2 border-t-transparent"
              />
              <Send v-else class="size-3.5" />
              <span>{{ isSending ? 'Delivering...' : 'Send Test Webhook' }}</span>
              <kbd class="bg-primary-foreground/20 hidden rounded px-1 py-0.5 font-mono text-xs sm:inline-flex">⌘↵</kbd>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 2-Column Inspector Layout -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <!-- Left Panel: Event Payload Selector, JSON Editor & Signing Secret -->
      <div class="space-y-6 lg:col-span-6">
        <!-- Event Selector & Payload Schema Card -->
        <Card class="border-border bg-card shadow-xs">
          <CardHeader class="pb-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md">
                  <Layers class="size-4" />
                </div>
                <div>
                  <CardTitle class="text-sm font-semibold">Event Configuration</CardTitle>
                  <CardDescription class="text-xs">Select event payload and adjust test parameters</CardDescription>
                </div>
              </div>
              <Badge variant="secondary" class="font-mono text-xs">{{ activePreset.category }}</Badge>
            </div>
          </CardHeader>

          <CardContent class="space-y-4 pt-0">
            <!-- Event Dropdown -->
            <div class="space-y-1.5">
              <label class="text-foreground text-xs font-medium">Event Type</label>
              <Select :model-value="selectedEvent" @update:model-value="handleEventChange">
                <SelectTrigger class="font-mono text-xs">
                  <SelectValue placeholder="Select event preset" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="preset in eventPresets"
                    :key="preset.id"
                    :value="preset.id"
                    class="font-mono text-xs"
                  >
                    {{ preset.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <p class="text-muted-foreground text-xs">{{ activePreset.description }}</p>
            </div>

            <!-- Quick Selection Badges -->
            <div class="flex flex-wrap items-center gap-1.5 pt-1">
              <button
                v-for="preset in eventPresets"
                :key="preset.id"
                type="button"
                :class="
                  cn(
                    'min-h-6 cursor-pointer rounded border px-2 py-0.5 font-mono text-xs transition-colors',
                    selectedEvent === preset.id
                      ? 'border-primary bg-primary/10 text-primary font-medium'
                      : 'border-border bg-muted/30 text-muted-foreground hover:bg-muted hover:text-foreground',
                  )
                "
                @click="handleEventChange(preset.id)"
              >
                {{ preset.id }}
              </button>
            </div>

            <Separator />

            <!-- JSON Payload Editor -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label class="text-foreground flex items-center gap-1.5 text-xs font-medium">
                  <FileCode class="text-primary size-3.5" />
                  <span>Payload Body (JSON)</span>
                </label>

                <div class="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    class="text-muted-foreground hover:text-foreground h-7 px-2 text-xs"
                    @click="handleFormatJson"
                  >
                    Format
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    class="text-muted-foreground hover:text-foreground h-7 px-2 text-xs"
                    @click="handleResetPayload"
                  >
                    <RefreshCw class="mr-1 size-3" />
                    Reset
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    class="text-muted-foreground hover:text-foreground h-7 px-2 text-xs"
                    @click="handleCopy(currentPayloadStr, 'payload')"
                  >
                    <Check v-if="copiedKey === 'payload'" class="text-success mr-1 size-3" />
                    <Copy v-else class="mr-1 size-3" />
                    <span>{{ copiedKey === 'payload' ? 'Copied' : 'Copy' }}</span>
                  </Button>
                </div>
              </div>

              <Textarea
                v-model="currentPayloadStr"
                :rows="11"
                no-resize
                class="border-border/70 focus:border-primary font-mono text-xs leading-relaxed"
                placeholder='{\n  "type": "event.name"\n}'
              />
            </div>
          </CardContent>

          <CardFooter
            class="border-border text-muted-foreground flex items-center justify-between border-t pt-3 text-xs"
          >
            <span class="font-mono">{{ currentPayloadStr.length }} bytes</span>
            <span class="font-mono">Content-Type: application/json</span>
          </CardFooter>
        </Card>

        <!-- Signing Secret & Signature Verification Preview Card -->
        <Card class="border-border bg-card shadow-xs">
          <CardHeader class="pb-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md">
                  <ShieldCheck class="size-4" />
                </div>
                <div>
                  <CardTitle class="text-sm font-semibold">Signature & Security Headers</CardTitle>
                  <CardDescription class="text-xs"
                    >HMAC-SHA256 signature calculated from secret & timestamp</CardDescription
                  >
                </div>
              </div>
              <div class="flex items-center gap-1">
                <button
                  type="button"
                  :class="
                    cn(
                      'min-h-6 cursor-pointer rounded px-2 py-0.5 font-mono text-xs transition-colors',
                      signatureFormat === 'stripe'
                        ? 'bg-primary text-primary-foreground font-medium'
                        : 'bg-muted text-muted-foreground hover:text-foreground',
                    )
                  "
                  @click="signatureFormat = 'stripe'"
                >
                  Stripe
                </button>
                <button
                  type="button"
                  :class="
                    cn(
                      'min-h-6 cursor-pointer rounded px-2 py-0.5 font-mono text-xs transition-colors',
                      signatureFormat === 'svix'
                        ? 'bg-primary text-primary-foreground font-medium'
                        : 'bg-muted text-muted-foreground hover:text-foreground',
                    )
                  "
                  @click="signatureFormat = 'svix'"
                >
                  Svix Standard
                </button>
              </div>
            </div>
          </CardHeader>

          <CardContent class="space-y-4 pt-0">
            <!-- Signing Secret Input -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <label class="text-foreground text-xs font-medium">Endpoint Signing Secret</label>
                <button
                  type="button"
                  class="text-primary flex min-h-6 cursor-pointer items-center gap-1 text-xs hover:underline"
                  @click="handleRegenerateSecret"
                >
                  <RotateCw class="size-3" />
                  <span>Regenerate</span>
                </button>
              </div>
              <div class="relative flex items-center">
                <Key class="text-muted-foreground pointer-events-none absolute left-3 size-3.5" />
                <Input v-model="signingSecret" class="pr-16 pl-8 font-mono text-xs" placeholder="whsec_..." />
                <Button
                  aria-label="Copy signing secret"
                  variant="ghost"
                  size="sm"
                  class="text-muted-foreground hover:text-foreground absolute right-1 h-7 px-2 text-xs"
                  @click="handleCopy(signingSecret, 'secret')"
                >
                  <Check v-if="copiedKey === 'secret'" class="text-success size-3" />
                  <Copy v-else class="size-3" />
                </Button>
              </div>
            </div>

            <!-- Signature Header Box -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <label class="text-foreground text-xs font-medium">Generated Request Headers</label>
                <Button
                  variant="ghost"
                  size="sm"
                  class="text-muted-foreground hover:text-foreground h-6 px-2 text-xs"
                  @click="handleCopy(computedAllHeaders, 'headers')"
                >
                  <Check v-if="copiedKey === 'headers'" class="text-success mr-1 size-3" />
                  <Copy v-else class="mr-1 size-3" />
                  <span>{{ copiedKey === 'headers' ? 'Copied' : 'Copy Headers' }}</span>
                </Button>
              </div>
              <pre
                class="border-border bg-muted/40 text-foreground overflow-x-auto rounded-md border p-3 font-mono text-xs leading-relaxed"
              ><code>{{ computedAllHeaders }}</code></pre>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Right Panel: Delivery History & Active Delivery Inspector -->
      <div class="space-y-6 lg:col-span-6">
        <!-- Recent Delivery Attempts List -->
        <Card class="border-border bg-card shadow-xs">
          <CardHeader class="pb-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md">
                  <Activity class="size-4" />
                </div>
                <div>
                  <CardTitle class="text-sm font-semibold">Delivery History</CardTitle>
                  <CardDescription class="text-xs">Recent dispatch logs and response telemetry</CardDescription>
                </div>
              </div>
              <span class="text-muted-foreground font-mono text-xs">{{ deliveryHistory.length }} events logged</span>
            </div>
          </CardHeader>

          <CardContent class="p-0">
            <div class="divide-border max-h-[250px] divide-y overflow-y-auto">
              <div
                v-for="attempt in deliveryHistory"
                :key="attempt.id"
                :class="
                  cn(
                    'flex cursor-pointer items-center justify-between gap-3 p-3.5 text-xs transition-colors',
                    selectedDeliveryId === attempt.id ? 'bg-muted/80 font-medium' : 'hover:bg-muted/40',
                  )
                "
                @click="selectedDeliveryId = attempt.id"
              >
                <div class="flex min-w-0 items-center gap-2.5">
                  <Badge
                    :variant="attempt.status === 200 ? 'success' : 'destructive'"
                    class="shrink-0 px-1.5 py-0.5 font-mono text-xs"
                  >
                    {{ attempt.status }}
                  </Badge>
                  <div class="min-w-0 truncate">
                    <p class="text-foreground truncate font-mono">{{ attempt.eventType }}</p>
                    <p class="text-muted-foreground truncate font-mono text-xs">{{ attempt.id }}</p>
                  </div>
                </div>

                <div class="flex shrink-0 items-center gap-3 text-right">
                  <span class="text-muted-foreground font-mono">{{ attempt.latencyMs }}ms</span>
                  <span class="text-muted-foreground text-xs">{{ attempt.timeAgo }}</span>
                  <ArrowRight class="text-muted-foreground size-3.5" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Active Delivery Detail Inspector -->
        <Card class="border-border bg-card shadow-xs">
          <CardHeader class="pb-3">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <Badge :variant="activeDelivery.status === 200 ? 'success' : 'destructive'" class="font-mono text-xs">
                    {{ activeDelivery.status }} {{ activeDelivery.statusText }}
                  </Badge>
                  <span class="text-foreground font-mono text-xs font-semibold">{{ activeDelivery.id }}</span>
                </div>
                <p class="text-muted-foreground truncate font-mono text-xs">{{ activeDelivery.endpointUrl }}</p>
              </div>

              <div class="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  class="h-8 gap-1.5 text-xs font-medium"
                  @click="retryDelivery(activeDelivery)"
                >
                  <RotateCw class="size-3.5" />
                  <span>Retry</span>
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent class="pt-0">
            <Tabs v-model="activeInspectorTab" class="w-full">
              <TabsList class="grid w-full grid-cols-3">
                <TabsTrigger value="request" class="text-xs">Request</TabsTrigger>
                <TabsTrigger value="response" class="text-xs">Response</TabsTrigger>
                <TabsTrigger value="timings" class="text-xs">Diagnostics</TabsTrigger>
              </TabsList>

              <!-- Request Tab -->
              <TabsContent value="request" class="space-y-4 pt-3">
                <!-- Request Headers Table -->
                <div class="space-y-1.5">
                  <div class="flex items-center justify-between">
                    <label class="text-foreground text-xs font-medium">Request Headers</label>
                    <Button
                      variant="ghost"
                      size="sm"
                      class="text-muted-foreground hover:text-foreground h-6 px-2 text-xs"
                      @click="handleCopy(JSON.stringify(activeDelivery.requestHeaders, null, 2), 'req-headers')"
                    >
                      <Check v-if="copiedKey === 'req-headers'" class="text-success mr-1 size-3" />
                      <Copy v-else class="mr-1 size-3" />
                      <span>{{ copiedKey === 'req-headers' ? 'Copied' : 'Copy' }}</span>
                    </Button>
                  </div>
                  <div class="border-border bg-muted/20 overflow-hidden rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead class="h-8 text-xs font-medium">Header</TableHead>
                          <TableHead class="h-8 text-xs font-medium">Value</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow v-for="(val, key) in activeDelivery.requestHeaders" :key="key">
                          <TableCell class="text-muted-foreground py-1.5 font-mono text-xs">{{ key }}</TableCell>
                          <TableCell class="text-foreground max-w-[200px] truncate py-1.5 font-mono text-xs">{{
                            val
                          }}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <!-- Request Body -->
                <div class="space-y-1.5">
                  <div class="flex items-center justify-between">
                    <label class="text-foreground text-xs font-medium">Request Body Payload</label>
                    <Button
                      variant="ghost"
                      size="sm"
                      class="text-muted-foreground hover:text-foreground h-6 px-2 text-xs"
                      @click="handleCopy(activeDelivery.requestBody, 'req-body')"
                    >
                      <Check v-if="copiedKey === 'req-body'" class="text-success mr-1 size-3" />
                      <Copy v-else class="mr-1 size-3" />
                      <span>{{ copiedKey === 'req-body' ? 'Copied' : 'Copy' }}</span>
                    </Button>
                  </div>
                  <pre
                    class="border-border bg-muted/40 text-foreground max-h-[220px] overflow-auto rounded-md border p-3 font-mono text-xs leading-relaxed"
                  ><code>{{ activeDelivery.requestBody }}</code></pre>
                </div>
              </TabsContent>

              <!-- Response Tab -->
              <TabsContent value="response" class="space-y-4 pt-3">
                <!-- Response Headers Table -->
                <div class="space-y-1.5">
                  <div class="flex items-center justify-between">
                    <label class="text-foreground text-xs font-medium">Response Headers</label>
                    <Button
                      variant="ghost"
                      size="sm"
                      class="text-muted-foreground hover:text-foreground h-6 px-2 text-xs"
                      @click="handleCopy(JSON.stringify(activeDelivery.responseHeaders, null, 2), 'res-headers')"
                    >
                      <Check v-if="copiedKey === 'res-headers'" class="text-success mr-1 size-3" />
                      <Copy v-else class="mr-1 size-3" />
                      <span>{{ copiedKey === 'res-headers' ? 'Copied' : 'Copy' }}</span>
                    </Button>
                  </div>
                  <div class="border-border bg-muted/20 overflow-hidden rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead class="h-8 text-xs font-medium">Header</TableHead>
                          <TableHead class="h-8 text-xs font-medium">Value</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow v-for="(val, key) in activeDelivery.responseHeaders" :key="key">
                          <TableCell class="text-muted-foreground py-1.5 font-mono text-xs">{{ key }}</TableCell>
                          <TableCell class="text-foreground max-w-[200px] truncate py-1.5 font-mono text-xs">{{
                            val
                          }}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <!-- Response Body Payload -->
                <div class="space-y-1.5">
                  <div class="flex items-center justify-between">
                    <label class="text-foreground text-xs font-medium">Response Body</label>
                    <Button
                      variant="ghost"
                      size="sm"
                      class="text-muted-foreground hover:text-foreground h-6 px-2 text-xs"
                      @click="handleCopy(activeDelivery.responseBody, 'res-body')"
                    >
                      <Check v-if="copiedKey === 'res-body'" class="text-success mr-1 size-3" />
                      <Copy v-else class="mr-1 size-3" />
                      <span>{{ copiedKey === 'res-body' ? 'Copied' : 'Copy' }}</span>
                    </Button>
                  </div>
                  <pre
                    :class="
                      cn(
                        'max-h-[220px] overflow-auto rounded-md border p-3 font-mono text-xs leading-relaxed',
                        activeDelivery.status === 200
                          ? 'border-border bg-muted/40 text-foreground'
                          : 'border-destructive/30 bg-destructive/10 text-destructive',
                      )
                    "
                  ><code>{{ activeDelivery.responseBody }}</code></pre>
                </div>
              </TabsContent>

              <!-- Diagnostics & Timeline Tab -->
              <TabsContent value="timings" class="space-y-4 pt-3">
                <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div class="border-border bg-muted/30 rounded-lg border p-2.5 text-center">
                    <p class="text-muted-foreground text-xs">DNS Lookup</p>
                    <p class="text-foreground font-mono text-sm font-semibold">{{ activeDelivery.timings.dns }}ms</p>
                  </div>
                  <div class="border-border bg-muted/30 rounded-lg border p-2.5 text-center">
                    <p class="text-muted-foreground text-xs">TLS Handshake</p>
                    <p class="text-foreground font-mono text-sm font-semibold">{{ activeDelivery.timings.tls }}ms</p>
                  </div>
                  <div class="border-border bg-muted/30 rounded-lg border p-2.5 text-center">
                    <p class="text-muted-foreground text-xs">Server TTFB</p>
                    <p class="text-foreground font-mono text-sm font-semibold">{{ activeDelivery.timings.ttfb }}ms</p>
                  </div>
                  <div class="border-border bg-muted/30 rounded-lg border p-2.5 text-center">
                    <p class="text-muted-foreground text-xs">Total Roundtrip</p>
                    <p class="text-primary font-mono text-sm font-semibold">{{ activeDelivery.timings.total }}ms</p>
                  </div>
                </div>

                <div class="border-border bg-muted/20 space-y-2 rounded-lg border p-3">
                  <h4 class="text-foreground text-xs font-semibold">Security & Delivery Verification</h4>
                  <ul class="space-y-1.5 text-xs">
                    <li class="text-success flex items-center gap-2">
                      <CheckCircle2 class="size-3.5 shrink-0" />
                      <span>HMAC signature matched endpoint verification secret</span>
                    </li>
                    <li class="text-success flex items-center gap-2">
                      <CheckCircle2 class="size-3.5 shrink-0" />
                      <span>TLS 1.3 certificate chain verified (Cloudflare Inc)</span>
                    </li>
                    <li class="text-success flex items-center gap-2">
                      <CheckCircle2 class="size-3.5 shrink-0" />
                      <span>Timestamp within tolerance envelope (300s window)</span>
                    </li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter
            class="border-border text-muted-foreground flex items-center justify-between border-t pt-3 text-xs"
          >
            <span class="flex items-center gap-1.5">
              <Clock class="size-3.5" />
              <span>Dispatched at: {{ activeDelivery.timestamp }}</span>
            </span>
            <span class="font-mono">Latency: {{ activeDelivery.latencyMs }}ms</span>
          </CardFooter>
        </Card>
      </div>
    </div>
  </div>
</template>
