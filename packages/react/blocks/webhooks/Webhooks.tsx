'use client'

import * as React from 'react'
import { Plus, RotateCw, Webhook } from 'lucide-react'
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

export interface Endpoint {
  id: string
  url: string
  enabled: boolean
  events: WebhookEvent[]
  successRate: string
}

export interface Delivery {
  id: string
  endpointId: string
  event: WebhookEvent
  status: number
  durationMs: number
  retries: number
  date: Date
}

export interface WebhooksProps {
  endpoints?: Endpoint[]
  deliveries?: Delivery[]
  className?: string
}

const now = Date.now()
const minutesAgo = (m: number) => new Date(now - m * 60_000)

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

const allEvents: WebhookEvent[] = ['order.created', 'order.refunded', 'customer.updated', 'invoice.paid']

function statusTone(status: number): 'success' | 'warning' | 'destructive' {
  if (status < 300) return 'success'
  if (status < 500) return 'warning'
  return 'destructive'
}

export function Webhooks({ endpoints, deliveries, className }: WebhooksProps) {
  const [endpointList, setEndpointList] = React.useState<Endpoint[]>(endpoints ?? stubEndpoints)
  const deliveryList = deliveries ?? stubDeliveries

  const [createOpen, setCreateOpen] = React.useState(false)
  const [newUrl, setNewUrl] = React.useState('')
  const [newEvents, setNewEvents] = React.useState<WebhookEvent[]>([])

  function toggleEndpoint(endpoint: Endpoint) {
    setEndpointList((list) => list.map((e) => (e.id === endpoint.id ? { ...e, enabled: !e.enabled } : e)))
  }

  function toggleEvent(event: WebhookEvent) {
    setNewEvents((events) => (events.includes(event) ? events.filter((e) => e !== event) : [...events, event]))
  }

  function createEndpoint() {
    if (!newUrl || newEvents.length === 0) return
    setEndpointList((list) => [
      ...list,
      { id: `e${list.length + 1}`, url: newUrl, enabled: true, events: [...newEvents], successRate: '—' },
    ])
    setNewUrl('')
    setNewEvents([])
    setCreateOpen(false)
  }

  return (
    <div data-slot="webhooks" className={cn('space-y-4', className)}>
      <SectionCard
        title="Endpoints"
        description="HTTP endpoints that receive signed webhook payloads."
        headerAction={
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
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
              <Input
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://api.yourapp.com/hooks/…"
                className="font-mono text-xs"
              />
              <div className="flex flex-wrap gap-2">
                {allEvents.map((event) => (
                  <button
                    key={event}
                    type="button"
                    className="focus-visible:ring-ring rounded-full focus-visible:ring-2 focus-visible:outline-none"
                    onClick={() => toggleEvent(event)}
                  >
                    <Chip variant={newEvents.includes(event) ? 'filled' : 'outline'}>{event}</Chip>
                  </button>
                ))}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateOpen(false)}>
                  Cancel
                </Button>
                <Button disabled={!newUrl || newEvents.length === 0} onClick={createEndpoint}>
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      >
        <ul className="-mb-4 divide-y">
          {endpointList.map((endpoint) => (
            <li key={endpoint.id} className="flex items-center gap-3 py-4">
              <span
                className="bg-muted text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-md"
                aria-hidden="true"
              >
                <Webhook className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-mono text-xs font-medium">{endpoint.url}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  {endpoint.events.map((event) => (
                    <Chip key={event} variant="outline" size="sm">
                      {event}
                    </Chip>
                  ))}
                </div>
              </div>
              <div className="hidden text-right sm:block">
                <p className="text-xs font-medium">{endpoint.enabled ? endpoint.successRate : 'Paused'}</p>
                <p className="text-muted-foreground text-xs">{endpoint.events.length} events</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={endpoint.enabled}
                aria-label={endpoint.enabled ? 'Pause endpoint' : 'Resume endpoint'}
                className={[
                  'focus-visible:ring-ring relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors focus:outline-none focus-visible:ring-2',
                  endpoint.enabled ? 'bg-primary' : 'bg-muted-foreground/30',
                ].join(' ')}
                onClick={() => toggleEndpoint(endpoint)}
              >
                <span
                  className={[
                    'bg-background inline-block size-4 translate-y-0.5 rounded-full shadow transition-transform',
                    endpoint.enabled ? 'translate-x-[18px]' : 'translate-x-0.5',
                  ].join(' ')}
                />
              </button>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="Recent deliveries" description="Latest payload attempts across all endpoints.">
        <ul className="-my-4 divide-y">
          {deliveryList.map((delivery) => (
            <li key={delivery.id} className="flex flex-wrap items-center gap-3 py-3">
              <RelativeTime date={delivery.date} className="text-muted-foreground w-16 shrink-0 text-xs" />
              <Badge variant={statusTone(delivery.status)} className="w-12 shrink-0 justify-center font-mono">
                {delivery.status}
              </Badge>
              <p className="min-w-[10rem] flex-1 truncate text-sm">{delivery.event}</p>
              <p className="text-muted-foreground hidden w-20 shrink-0 text-right font-mono text-xs sm:block">
                {delivery.durationMs >= 1000
                  ? `${(delivery.durationMs / 1000).toFixed(1)} s`
                  : `${delivery.durationMs} ms`}
              </p>
              {delivery.retries > 0 && (
                <p className="text-warning shrink-0 text-xs font-medium">retry {delivery.retries}</p>
              )}
              {delivery.status >= 400 && (
                <Button variant="ghost" size="icon-sm" aria-label="Retry delivery">
                  <RotateCw aria-hidden="true" />
                </Button>
              )}
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  )
}
