<script setup lang="ts">
import { computed, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import { Plus, RotateCw, Webhook } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Chip } from '@/components/ui/chip'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { RelativeTime } from '@/components/ui/relative-time'
import { SectionCard } from '@/components/ui/section-card'

type WebhookEvent = 'order.created' | 'order.refunded' | 'customer.updated' | 'invoice.paid'

interface Endpoint {
  id: string
  url: string
  enabled: boolean
  events: WebhookEvent[]
  successRate: string
}

interface Delivery {
  id: string
  endpointId: string
  event: WebhookEvent
  status: number
  durationMs: number
  retries: number
  date: Date
}

const props = defineProps<{
  endpoints?: Endpoint[]
  deliveries?: Delivery[]
  class?: HTMLAttributes['class']
}>()

const now = new Date()
const minutesAgo = (m: number) => new Date(now.getTime() - m * 60_000)

const stubEndpoints: Endpoint[] = [
  {
    id: 'e1',
    url: 'https://api.acme.com/hooks/orders',
    enabled: true,
    events: ['order.created', 'order.refunded'],
    successRate: '99.2% · 24h',
  },
  {
    id: 'e2',
    url: 'https://hooks.billing.io/acme',
    enabled: true,
    events: ['invoice.paid'],
    successRate: '97.8% · 24h',
  },
  {
    id: 'e3',
    url: 'https://staging.acme.dev/hooks/all',
    enabled: false,
    events: ['order.created', 'customer.updated', 'invoice.paid'],
    successRate: '—',
  },
]

const stubDeliveries: Delivery[] = [
  { id: 'd1', endpointId: 'e1', event: 'order.created', status: 200, durationMs: 312, retries: 0, date: minutesAgo(2) },
  { id: 'd2', endpointId: 'e2', event: 'invoice.paid', status: 200, durationMs: 188, retries: 0, date: minutesAgo(9) },
  {
    id: 'd3',
    endpointId: 'e1',
    event: 'order.refunded',
    status: 500,
    durationMs: 10_240,
    retries: 2,
    date: minutesAgo(26),
  },
  { id: 'd4', endpointId: 'e1', event: 'order.created', status: 404, durationMs: 96, retries: 1, date: minutesAgo(41) },
  { id: 'd5', endpointId: 'e2', event: 'invoice.paid', status: 200, durationMs: 244, retries: 0, date: minutesAgo(58) },
  {
    id: 'd6',
    endpointId: 'e3',
    event: 'customer.updated',
    status: 410,
    durationMs: 51,
    retries: 0,
    date: minutesAgo(75),
  },
]

const endpoints = computed(() => props.endpoints ?? stubEndpoints)
const deliveries = computed(() => props.deliveries ?? stubDeliveries)

const allEvents: WebhookEvent[] = ['order.created', 'order.refunded', 'customer.updated', 'invoice.paid']

const createOpen = ref(false)
const newUrl = ref('')
const newEvents = ref<WebhookEvent[]>([])

function toggleEndpoint(endpoint: Endpoint) {
  endpoint.enabled = !endpoint.enabled
}

function toggleEvent(event: WebhookEvent) {
  newEvents.value = newEvents.value.includes(event)
    ? newEvents.value.filter((e) => e !== event)
    : [...newEvents.value, event]
}

function createEndpoint() {
  if (!newUrl.value || newEvents.value.length === 0) return
  endpoints.value.push({
    id: `e${endpoints.value.length + 1}`,
    url: newUrl.value,
    enabled: true,
    events: [...newEvents.value],
    successRate: '—',
  })
  newUrl.value = ''
  newEvents.value = []
  createOpen.value = false
}

function statusTone(status: number) {
  if (status < 300) return 'success' as const
  if (status < 500) return 'warning' as const
  return 'destructive' as const
}
</script>

<template>
  <div data-slot="webhooks" :class="cn('space-y-4', props.class)">
    <SectionCard title="Endpoints" description="HTTP endpoints that receive signed webhook payloads.">
      <template #header-action>
        <Dialog v-model:open="createOpen">
          <DialogTrigger as-child>
            <Button size="sm">
              <Plus aria-hidden="true" />
              Add endpoint
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add endpoint</DialogTitle>
              <DialogDescription>Choose the events this URL should receive.</DialogDescription>
            </DialogHeader>
            <Input v-model="newUrl" placeholder="https://api.yourapp.com/hooks/…" class="font-mono text-xs" />
            <div class="flex flex-wrap gap-2">
              <button
                v-for="event in allEvents"
                :key="event"
                type="button"
                class="focus-visible:ring-ring rounded-full focus-visible:ring-2 focus-visible:outline-none"
                @click="toggleEvent(event)"
              >
                <Chip :variant="newEvents.includes(event) ? 'filled' : 'outline'">{{ event }}</Chip>
              </button>
            </div>
            <DialogFooter>
              <Button variant="outline" @click="createOpen = false">Cancel</Button>
              <Button :disabled="!newUrl || newEvents.length === 0" @click="createEndpoint">Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </template>

      <ul class="-mb-4 divide-y">
        <li v-for="endpoint in endpoints" :key="endpoint.id" class="flex items-center gap-3 py-4">
          <span
            class="bg-muted text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-md"
            aria-hidden="true"
          >
            <Webhook class="size-4" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="truncate font-mono text-xs font-medium">{{ endpoint.url }}</p>
            <div class="mt-1.5 flex flex-wrap items-center gap-1.5">
              <Chip v-for="event in endpoint.events" :key="event" variant="outline" size="sm">{{ event }}</Chip>
            </div>
          </div>
          <div class="hidden text-right sm:block">
            <p class="text-xs font-medium">{{ endpoint.enabled ? endpoint.successRate : 'Paused' }}</p>
            <p class="text-muted-foreground text-xs">{{ endpoint.events.length }} events</p>
          </div>
          <button
            type="button"
            role="switch"
            :aria-checked="endpoint.enabled"
            :aria-label="endpoint.enabled ? 'Pause endpoint' : 'Resume endpoint'"
            class="focus-visible:ring-ring relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors focus:outline-none focus-visible:ring-2"
            :class="endpoint.enabled ? 'bg-primary' : 'bg-muted-foreground/30'"
            @click="toggleEndpoint(endpoint)"
          >
            <span
              class="bg-background inline-block size-4 translate-y-0.5 rounded-full shadow transition-transform"
              :class="endpoint.enabled ? 'translate-x-[18px]' : 'translate-x-0.5'"
            />
          </button>
        </li>
      </ul>
    </SectionCard>

    <SectionCard title="Recent deliveries" description="Latest payload attempts across all endpoints.">
      <ul class="-my-4 divide-y">
        <li v-for="delivery in deliveries" :key="delivery.id" class="flex flex-wrap items-center gap-3 py-3">
          <RelativeTime :date="delivery.date" class="text-muted-foreground w-16 shrink-0 text-xs" />
          <Badge :variant="statusTone(delivery.status)" class="w-12 shrink-0 justify-center font-mono">
            {{ delivery.status }}
          </Badge>
          <p class="min-w-[10rem] flex-1 truncate text-sm">{{ delivery.event }}</p>
          <p class="text-muted-foreground hidden w-20 shrink-0 text-right font-mono text-xs sm:block">
            {{
              delivery.durationMs >= 1000 ? `${(delivery.durationMs / 1000).toFixed(1)} s` : `${delivery.durationMs} ms`
            }}
          </p>
          <p v-if="delivery.retries > 0" class="text-warning shrink-0 text-xs font-medium">
            retry {{ delivery.retries }}
          </p>
          <Button v-if="delivery.status >= 400" variant="ghost" size="icon-sm" aria-label="Retry delivery">
            <RotateCw aria-hidden="true" />
          </Button>
        </li>
      </ul>
    </SectionCard>
  </div>
</template>
