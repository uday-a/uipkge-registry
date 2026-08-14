'use client'

import * as React from 'react'
import {
  Activity,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Copy,
  Filter,
  Gauge,
  HardDrive,
  Layers,
  Pause,
  Play,
  PlusCircle,
  Radio,
  RotateCcw,
  Search,
  ShieldCheck,
  Terminal,
  Trash2,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface KafkaStreamMessage {
  id: string
  offset: number
  partition: number
  key: string
  timestamp: string
  eventType: string
  sizeBytes: number
  schemaId: number
  traceId: string
  payload: Record<string, unknown>
}

export interface PartitionTelemetryRow {
  partitionId: number
  leaderBroker: string
  rack: string
  logEndOffset: number
  consumerOffset: number
  lag: number
  messageRate: string
  isrCount: number
  replicasCount: number
  status: 'healthy' | 'warning'
}

export interface KafkaStreamMonitorProps {
  className?: string
}

const partitions: PartitionTelemetryRow[] = [
  {
    partitionId: 0,
    leaderBroker: 'Broker #102',
    rack: 'us-east-1a',
    logEndOffset: 1482910,
    consumerOffset: 1482910,
    lag: 0,
    messageRate: '1.2k msg/s',
    isrCount: 3,
    replicasCount: 3,
    status: 'healthy',
  },
  {
    partitionId: 1,
    leaderBroker: 'Broker #103',
    rack: 'us-east-1b',
    logEndOffset: 1482884,
    consumerOffset: 1482884,
    lag: 0,
    messageRate: '1.1k msg/s',
    isrCount: 3,
    replicasCount: 3,
    status: 'healthy',
  },
  {
    partitionId: 2,
    leaderBroker: 'Broker #101',
    rack: 'us-east-1c',
    logEndOffset: 1482905,
    consumerOffset: 1482905,
    lag: 0,
    messageRate: '1.4k msg/s',
    isrCount: 3,
    replicasCount: 3,
    status: 'healthy',
  },
  {
    partitionId: 3,
    leaderBroker: 'Broker #104',
    rack: 'us-east-1a',
    logEndOffset: 1482872,
    consumerOffset: 1482872,
    lag: 0,
    messageRate: '1.2k msg/s',
    isrCount: 3,
    replicasCount: 3,
    status: 'healthy',
  },
]

const defaultMessages: KafkaStreamMessage[] = [
  {
    id: 'msg-1482910',
    offset: 1482910,
    partition: 0,
    key: 'cust_99201a',
    timestamp: '2026-08-21 14:32:05.812 UTC',
    eventType: 'checkout.order_completed',
    sizeBytes: 1420,
    schemaId: 104,
    traceId: '00-4bf92f3577b34da6a3ce929d0e0e4736',
    payload: {
      order_id: 'ord_9920184a',
      customer_id: 'cust_99201a',
      checkout_session: 'cs_live_992019482',
      currency: 'USD',
      total_amount: 349.5,
      item_count: 3,
      items: [
        { sku: 'SKU-PRO-4K', name: 'UltraHD Pro Monitor 32-inch', qty: 1, price: 299.0 },
        { sku: 'SKU-USB-C-2M', name: 'Braided Thunderbolt 4 Cable 2m', qty: 2, price: 25.25 },
      ],
      payment_status: 'authorized',
      fraud_risk_score: 0.02,
      shipping_destination: 'US-CA-94105',
      produced_at_epoch_ms: 1787322725812,
    },
  },
  {
    id: 'msg-1482909',
    offset: 1482909,
    partition: 2,
    key: 'cust_88301b',
    timestamp: '2026-08-21 14:31:58.240 UTC',
    eventType: 'checkout.payment_authorized',
    sizeBytes: 890,
    schemaId: 104,
    traceId: '00-7c201a9981f34ec189aa1029481920aa',
    payload: {
      transaction_id: 'txn_8830192b',
      customer_id: 'cust_88301b',
      payment_provider: 'stripe_us_direct',
      amount: 129.0,
      currency: 'USD',
      card_brand: 'visa',
      last4: '4242',
      avs_check: 'matched',
      cvv_check: 'matched',
      '3ds_authenticated': true,
      latency_ms: 142,
    },
  },
  {
    id: 'msg-1482908',
    offset: 1482908,
    partition: 1,
    key: 'cust_44109c',
    timestamp: '2026-08-21 14:31:44.102 UTC',
    eventType: 'checkout.cart_updated',
    sizeBytes: 1150,
    schemaId: 104,
    traceId: '00-11209e8832a44bb0902188492019ab23',
    payload: {
      cart_id: 'cart_4410912c',
      customer_id: 'cust_44109c',
      action: 'item_added',
      sku: 'SKU-MECH-KEYBOARD',
      name: 'Custom Wireless Mechanical Keyboard',
      quantity: 1,
      unit_price: 189.0,
      applied_promo_code: 'DEVCON2026',
      discount_amount: 18.9,
      cart_subtotal: 170.1,
    },
  },
  {
    id: 'msg-1482907',
    offset: 1482907,
    partition: 3,
    key: 'cust_11094d',
    timestamp: '2026-08-21 14:31:22.955 UTC',
    eventType: 'checkout.shipping_calculated',
    sizeBytes: 760,
    schemaId: 104,
    traceId: '00-66a9104882194cc2810992384719bb81',
    payload: {
      quote_id: 'shp_1109482d',
      customer_id: 'cust_11094d',
      carrier: 'FedEx Express',
      service_tier: 'Priority Overnight',
      estimated_delivery: '2026-08-22T10:30:00Z',
      rate_usd: 24.5,
      origin_postal: '94105',
      destination_postal: '10001',
      weight_kg: 1.85,
    },
  },
  {
    id: 'msg-1482906',
    offset: 1482906,
    partition: 0,
    key: 'cust_77210e',
    timestamp: '2026-08-21 14:31:05.419 UTC',
    eventType: 'checkout.address_validated',
    sizeBytes: 640,
    schemaId: 104,
    traceId: '00-559012bb99304ff091920394881029cc',
    payload: {
      validation_id: 'val_7721098e',
      customer_id: 'cust_77210e',
      country: 'US',
      state: 'CA',
      city: 'San Francisco',
      postal_code: '94107',
      is_residential: true,
      standardized: true,
      dpv_match: 'Y',
      service: 'smartystreets_v2',
    },
  },
]

export function KafkaStreamMonitor({ className }: KafkaStreamMonitorProps) {
  const [messages, setMessages] = React.useState<KafkaStreamMessage[]>([...defaultMessages])
  const [isPaused, setIsPaused] = React.useState(false)
  const [selectedPartition, setSelectedPartition] = React.useState<number | 'all'>('all')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [expandedOffsets, setExpandedOffsets] = React.useState<Record<number, boolean>>({
    1482910: true,
  })
  const [copiedId, setCopiedId] = React.useState<string | null>(null)
  const [produceNotice, setProduceNotice] = React.useState<string | null>(null)
  const nextOffsetRef = React.useRef(1482911)

  const filteredMessages = React.useMemo(() => {
    return messages.filter((msg) => {
      const matchesPartition = selectedPartition === 'all' || msg.partition === selectedPartition
      if (!matchesPartition) return false

      if (!searchQuery.trim()) return true
      const q = searchQuery.trim().toLowerCase()
      return (
        msg.key.toLowerCase().includes(q) ||
        msg.eventType.toLowerCase().includes(q) ||
        msg.offset.toString().includes(q) ||
        msg.partition.toString().includes(q) ||
        JSON.stringify(msg.payload).toLowerCase().includes(q)
      )
    })
  }, [messages, selectedPartition, searchQuery])

  const allExpanded = filteredMessages.length > 0 && filteredMessages.every((msg) => expandedOffsets[msg.offset])

  const togglePause = () => {
    setIsPaused((prev) => !prev)
  }

  const toggleExpand = (offset: number) => {
    setExpandedOffsets((prev) => ({
      ...prev,
      [offset]: !prev[offset],
    }))
  }

  const toggleAllExpand = () => {
    if (allExpanded) {
      setExpandedOffsets({})
    } else {
      const next: Record<number, boolean> = {}
      filteredMessages.forEach((m) => {
        next[m.offset] = true
      })
      setExpandedOffsets(next)
    }
  }

  const clearStream = () => {
    setMessages([])
    setExpandedOffsets({})
  }

  const resetStream = () => {
    setMessages([...defaultMessages])
    setSearchQuery('')
    setSelectedPartition('all')
    setExpandedOffsets({ 1482910: true })
  }

  const copyPayload = (id: string, payload: Record<string, unknown>) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(JSON.stringify(payload, null, 2))
      setCopiedId(id)
      setTimeout(() => {
        setCopiedId((curr) => (curr === id ? null : curr))
      }, 2000)
    }
  }

  const produceTestMessage = () => {
    const currentOffset = nextOffsetRef.current++
    const targetPartition = currentOffset % 4
    const testCustomer = `cust_${Math.random().toString(36).substring(2, 8)}`
    const testOrderId = `ord_${Math.random().toString(36).substring(2, 9)}`
    const testAmount = +(Math.random() * 250 + 25).toFixed(2)

    const newMessage: KafkaStreamMessage = {
      id: `msg-${currentOffset}`,
      offset: currentOffset,
      partition: targetPartition,
      key: testCustomer,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 23) + ' UTC',
      eventType: 'checkout.order_placed',
      sizeBytes: 1280,
      schemaId: 104,
      traceId: `00-${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
      payload: {
        order_id: testOrderId,
        customer_id: testCustomer,
        currency: 'USD',
        total_amount: testAmount,
        item_count: Math.floor(Math.random() * 3) + 1,
        items: [
          {
            sku: 'SKU-SYNTH-DEVICE',
            name: 'Developer Workstation Hub',
            qty: 1,
            price: testAmount,
          },
        ],
        payment_status: 'authorized',
        producer: 'console-stream-tester-ui',
        test_message: true,
      },
    }

    setMessages((prev) => [newMessage, ...prev])
    setExpandedOffsets((prev) => ({ ...prev, [currentOffset]: true }))
    setProduceNotice(`Produced message #${currentOffset.toLocaleString()} to Partition ${targetPartition}`)

    setTimeout(() => {
      setProduceNotice((curr) => (curr?.includes(currentOffset.toLocaleString()) ? null : curr))
    }, 3500)
  }

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    return `${(bytes / 1024).toFixed(1)} KB`
  }

  return (
    <div data-slot="kafka-stream-monitor" className={cn('mx-auto w-full max-w-6xl space-y-6', className)}>
      {/* Header Section */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <div
              className="bg-muted text-muted-foreground border-border flex size-9 shrink-0 items-center justify-center rounded-lg border shadow-xs"
              aria-hidden="true"
            >
              <Radio className="text-primary size-4.5" />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted-foreground font-mono text-xs font-medium">production-kafka-us-east-1</span>
              <span className="text-muted-foreground text-xs">/</span>
              <h1 className="text-foreground font-mono text-xl font-bold tracking-tight break-all sm:text-2xl">
                events.customer.checkout_v2
              </h1>
            </div>
            <Badge variant="success" className="gap-1.5 text-xs font-medium">
              <span className="relative flex size-2 shrink-0">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span>Healthy · Zero Consumer Lag</span>
            </Badge>
          </div>
          <p className="text-muted-foreground text-xs">
            12 Partitions · Replication Factor: 3 · min.insync.replicas: 2 · Cleanup Policy: delete,compact
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={resetStream}>
            <RotateCcw className="size-3.5" aria-hidden="true" />
            <span>Reset</span>
          </Button>

          <Button variant="default" size="sm" className="gap-1.5 text-xs" onClick={produceTestMessage}>
            <PlusCircle className="size-3.5" aria-hidden="true" />
            <span>Produce Test Message</span>
          </Button>
        </div>
      </div>

      {/* Active Produce Alert Banner */}
      {produceNotice && (
        <div
          className="border-border bg-card flex items-center justify-between rounded-lg border p-3 text-xs shadow-xs"
          role="status"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-primary size-4 shrink-0" aria-hidden="true" />
            <span className="text-foreground font-medium">{produceNotice}</span>
          </div>
          <Badge variant="outline" className="font-mono text-xs">
            Offset Ack: OK (2ms)
          </Badge>
        </div>
      )}

      {/* 4 Kafka Telemetry Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Message Inflow Rate */}
        <Card className="flex flex-col justify-between shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <div
                  className="bg-muted text-muted-foreground border-border flex size-8 shrink-0 items-center justify-center rounded-lg border shadow-xs"
                  aria-hidden="true"
                >
                  <Activity className="size-4" />
                </div>
                <CardTitle className="truncate text-xs font-medium">Message Inflow Rate</CardTitle>
              </div>
              <Badge variant="outline" className="shrink-0 text-xs font-normal tabular-nums">
                +5.8% 1h
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-foreground text-2xl font-bold tracking-tight tabular-nums">14,250 msgs/sec</div>
              <p className="text-muted-foreground text-xs tabular-nums">2.4 MB/s throughput</p>
            </div>
            <div className="space-y-1.5">
              <div className="text-muted-foreground flex items-center justify-between text-xs">
                <span>Ingress Bandwidth</span>
                <span className="text-foreground font-medium tabular-nums">48% of cap</span>
              </div>
              <Progress value={48} className="h-1.5" />
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Consumer Group Lag */}
        <Card className="flex flex-col justify-between shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <div
                  className="bg-muted text-muted-foreground border-border flex size-8 shrink-0 items-center justify-center rounded-lg border shadow-xs"
                  aria-hidden="true"
                >
                  <Gauge className="size-4" />
                </div>
                <CardTitle className="truncate text-xs font-medium">Consumer Group Lag</CardTitle>
              </div>
              <Badge variant="success" className="shrink-0 text-xs">
                Real-time
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-foreground text-2xl font-bold tracking-tight tabular-nums">0 messages lag</div>
              <p className="text-muted-foreground text-xs">across 4 consumer groups</p>
            </div>
            <div className="space-y-1.5">
              <div className="text-muted-foreground flex items-center justify-between text-xs">
                <span>Processing Drift</span>
                <span className="text-foreground font-medium tabular-nums">0 ms lag</span>
              </div>
              <Progress value={100} className="h-1.5" />
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Total Retention */}
        <Card className="flex flex-col justify-between shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <div
                  className="bg-muted text-muted-foreground border-border flex size-8 shrink-0 items-center justify-center rounded-lg border shadow-xs"
                  aria-hidden="true"
                >
                  <HardDrive className="size-4" />
                </div>
                <CardTitle className="truncate text-xs font-medium">Total Retention</CardTitle>
              </div>
              <Badge variant="outline" className="shrink-0 text-xs font-normal">
                7 Days
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-foreground text-2xl font-bold tracking-tight tabular-nums">
                480 GB total footprint
              </div>
              <p className="text-muted-foreground text-xs tabular-nums">40 GB avg / partition</p>
            </div>
            <div className="space-y-1.5">
              <div className="text-muted-foreground flex items-center justify-between text-xs">
                <span>Disk Footprint</span>
                <span className="text-foreground font-medium tabular-nums">480 GB / 1.0 TB</span>
              </div>
              <Progress value={48} className="h-1.5" />
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Under-Replicated Partitions */}
        <Card className="flex flex-col justify-between shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <div
                  className="bg-muted text-muted-foreground border-border flex size-8 shrink-0 items-center justify-center rounded-lg border shadow-xs"
                  aria-hidden="true"
                >
                  <ShieldCheck className="size-4" />
                </div>
                <CardTitle className="truncate text-xs font-medium">Under-Replicated</CardTitle>
              </div>
              <Badge variant="success" className="shrink-0 text-xs">
                In-Sync
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-foreground text-2xl font-bold tracking-tight tabular-nums">0 / 12 Partitions</div>
              <p className="text-muted-foreground text-xs">All 36 replicas fully in-sync (ISR)</p>
            </div>
            <div className="space-y-1.5">
              <div className="text-muted-foreground flex items-center justify-between text-xs">
                <span>Replication Health</span>
                <span className="text-foreground font-medium tabular-nums">100% ISR</span>
              </div>
              <Progress value={100} className="h-1.5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Partitions & Offset Distribution Table */}
      <Card className="shadow-xs">
        <CardHeader>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">Partitions & Offset Distribution</CardTitle>
              <CardDescription className="text-xs">
                Per-partition log high-water marks, consumer group commitments, and leader broker assignments.
              </CardDescription>
            </div>
            <Badge variant="outline" className="w-fit font-mono text-xs font-normal tabular-nums">
              Showing 4 of 12 Partitions
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6 sm:pt-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Partition ID</TableHead>
                  <TableHead className="text-xs">Leader Broker</TableHead>
                  <TableHead className="text-right text-xs">Log End Offset</TableHead>
                  <TableHead className="text-right text-xs">Consumer Offset</TableHead>
                  <TableHead className="text-right text-xs">Lag</TableHead>
                  <TableHead className="text-right text-xs">Message Rate</TableHead>
                  <TableHead className="text-right text-xs">Replicas (ISR)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partitions.map((partition) => (
                  <TableRow key={partition.partitionId}>
                    <TableCell className="text-xs font-medium">
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-emerald-500" aria-hidden="true" />
                        <span className="font-mono">Partition {partition.partitionId}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="text-foreground font-medium">{partition.leaderBroker}</span>
                        <span className="text-muted-foreground font-mono text-xs">({partition.rack})</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground text-right font-mono text-xs font-medium tabular-nums">
                      {{ ...partition }.logEndOffset.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-right font-mono text-xs tabular-nums">
                      {{ ...partition }.consumerOffset.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="success" className="font-mono text-xs tabular-nums">
                        {partition.lag}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-foreground text-right font-mono text-xs font-medium tabular-nums">
                      {partition.messageRate}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="font-mono text-xs tabular-nums">
                        {partition.isrCount} / {partition.replicasCount} In-Sync
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Live Message Stream Inspector */}
      <Card className="shadow-xs">
        {/* Inspector Header Bar */}
        <div className="bg-muted/40 flex flex-col gap-3 border-b p-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-red-500/80" />
              <span className="size-2.5 rounded-full bg-amber-500/80" />
              <span className="size-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-foreground text-xs font-semibold">Live Message Stream Inspector</span>
              {!isPaused ? (
                <div className="border-border bg-card inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium">
                  <span className="relative flex size-1.5 shrink-0">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-muted-foreground">Streaming</span>
                </div>
              ) : (
                <div className="border-border bg-card inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium">
                  <span className="relative inline-flex size-1.5 rounded-full bg-amber-500" />
                  <span className="text-muted-foreground">Paused</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="xs"
              className="h-7 gap-1 text-xs"
              disabled={filteredMessages.length === 0}
              onClick={toggleAllExpand}
            >
              {allExpanded ? (
                <ChevronDown className="size-3" aria-hidden="true" />
              ) : (
                <ChevronRight className="size-3" aria-hidden="true" />
              )}
              <span>{allExpanded ? 'Collapse All' : 'Expand All'}</span>
            </Button>

            <Button variant="outline" size="xs" className="h-7 gap-1 text-xs" onClick={togglePause}>
              {isPaused ? (
                <Play className="size-3 fill-current" aria-hidden="true" />
              ) : (
                <Pause className="size-3" aria-hidden="true" />
              )}
              <span>{isPaused ? 'Resume' : 'Pause'}</span>
            </Button>

            <Button
              variant="outline"
              size="xs"
              className="h-7 gap-1 text-xs"
              disabled={messages.length === 0}
              onClick={clearStream}
            >
              <Trash2 className="size-3" aria-hidden="true" />
              <span>Clear</span>
            </Button>
          </div>
        </div>

        {/* Filter and Partition Selector Controls */}
        <div className="bg-card/50 flex flex-col gap-3 border-b p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search
              className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2"
              aria-hidden="true"
            />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter message key, offset, event type, or JSON payload..."
              className="h-8 pl-8 text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1">
            <span className="text-muted-foreground mr-1 flex items-center gap-1 text-xs font-medium">
              <Filter className="size-3" aria-hidden="true" />
              Partition:
            </span>

            <button
              type="button"
              className={cn(
                'focus-visible:ring-ring inline-flex h-7 items-center rounded-md border px-2.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                selectedPartition === 'all'
                  ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                  : 'border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground',
              )}
              onClick={() => setSelectedPartition('all')}
            >
              All
            </button>

            {[0, 1, 2, 3].map((p) => (
              <button
                key={p}
                type="button"
                className={cn(
                  'focus-visible:ring-ring inline-flex h-7 items-center rounded-md border px-2.5 font-mono text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                  selectedPartition === p
                    ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                    : 'border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground',
                )}
                onClick={() => setSelectedPartition(p)}
              >
                P-{p}
              </button>
            ))}
          </div>
        </div>

        {/* Messages Stream List */}
        <CardContent className="p-0">
          {filteredMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2.5 px-4 py-12 text-center">
              <div className="bg-muted flex size-10 items-center justify-center rounded-full">
                <Radio className="text-muted-foreground size-5 opacity-60" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <p className="text-foreground text-sm font-semibold">No messages found</p>
                <p className="text-muted-foreground text-xs">
                  {messages.length === 0
                    ? 'Message buffer was cleared. Reset to restore sample messages or produce a test event.'
                    : 'Try clearing the search query or changing partition filter.'}
                </p>
              </div>
              <Button variant="outline" size="sm" className="mt-1 gap-1.5 text-xs" onClick={resetStream}>
                <RotateCcw className="size-3.5" aria-hidden="true" />
                <span>Reset Stream</span>
              </Button>
            </div>
          ) : (
            <ul className="divide-border/60 divide-y">
              {filteredMessages.map((msg) => {
                const isExpanded = !!expandedOffsets[msg.offset]
                return (
                  <li
                    key={msg.id}
                    className={cn('group transition-colors', isExpanded ? 'bg-muted/30' : 'hover:bg-muted/20')}
                  >
                    {/* Row Trigger */}
                    <div
                      role="button"
                      tabIndex={0}
                      aria-expanded={isExpanded}
                      className="focus-visible:ring-ring flex cursor-pointer flex-col gap-2.5 p-3.5 focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset sm:flex-row sm:items-center sm:justify-between"
                      onClick={() => toggleExpand(msg.offset)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          toggleExpand(msg.offset)
                        }
                      }}
                    >
                      {/* Left: Chevron + Offset + Partition + Key + Event */}
                      <div className="flex min-w-0 items-start gap-3 sm:items-center">
                        <button
                          type="button"
                          aria-label="Toggle payload details"
                          className={cn(
                            'text-muted-foreground group-hover:text-foreground mt-0.5 shrink-0 transition-transform sm:mt-0',
                            isExpanded && 'text-foreground rotate-90',
                          )}
                        >
                          <ChevronRight className="size-4" aria-hidden="true" />
                        </button>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-foreground font-mono text-xs font-bold tabular-nums">
                              #{msg.offset.toLocaleString()}
                            </span>

                            <Badge variant="outline" className="font-mono text-xs">
                              P-{msg.partition}
                            </Badge>

                            <Badge variant="secondary" className="font-mono text-xs font-normal">
                              key: {msg.key}
                            </Badge>

                            <span className="text-foreground font-mono text-xs font-semibold">{msg.eventType}</span>
                          </div>

                          <p className="text-muted-foreground font-mono text-xs tabular-nums">{msg.timestamp}</p>
                        </div>
                      </div>

                      {/* Right: Size + Trace ID */}
                      <div className="flex shrink-0 items-center gap-2.5 sm:justify-end">
                        <span className="text-muted-foreground font-mono text-xs tabular-nums">
                          {formatBytes(msg.sizeBytes)}
                        </span>
                        <Badge variant="outline" className="hidden font-mono text-xs font-normal sm:inline-flex">
                          schema_id: {msg.schemaId}
                        </Badge>
                      </div>
                    </div>

                    {/* Expanded Payload Detail View */}
                    {isExpanded && (
                      <div className="bg-muted/15 border-t px-4 py-3.5">
                        <div className="space-y-3">
                          {/* Metadata Info Strip */}
                          <div className="bg-card flex flex-col gap-2 rounded-md border p-2.5 text-xs sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex min-w-0 items-center gap-2">
                              <span className="text-muted-foreground shrink-0 font-medium">Trace ID:</span>
                              <span className="text-foreground truncate font-mono">{msg.traceId}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Format:</span>
                              <Badge variant="outline" className="font-mono text-xs">
                                json+avro
                              </Badge>
                            </div>
                          </div>

                          {/* JSON Payload Inspector Box */}
                          <div className="overflow-hidden rounded-md border bg-zinc-950 font-mono text-xs text-zinc-100 shadow-inner">
                            <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-3 py-1.5">
                              <div className="flex items-center gap-2">
                                <Terminal className="size-3.5 text-zinc-400" aria-hidden="true" />
                                <span className="text-xs text-zinc-400">deserialized_payload.json</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="xs"
                                className="h-6 gap-1 px-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                                onClick={() => copyPayload(msg.id, msg.payload)}
                              >
                                {copiedId === msg.id ? (
                                  <Check className="size-3 text-emerald-400" aria-hidden="true" />
                                ) : (
                                  <Copy className="size-3" aria-hidden="true" />
                                )}
                                <span>{copiedId === msg.id ? 'Copied' : 'Copy JSON'}</span>
                              </Button>
                            </div>

                            <pre className="max-h-64 overflow-x-auto overflow-y-auto p-3 text-xs leading-relaxed select-text">
                              <code className="text-emerald-400">{JSON.stringify(msg.payload, null, 2)}</code>
                            </pre>
                          </div>
                        </div>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </CardContent>

        {/* Bottom Stream Telemetry Bar */}
        <div className="bg-muted/40 flex flex-col gap-2.5 border-t px-4 py-3 text-xs sm:flex-row sm:items-center sm:justify-between">
          <div className="text-muted-foreground flex flex-wrap items-center gap-4">
            <div className="text-foreground flex items-center gap-1.5 font-medium">
              <Activity className="size-3.5 text-emerald-500" aria-hidden="true" />
              <span>Rate:</span>
              <span className="font-mono">{isPaused ? '0 msg/s (Paused)' : '14,250 msgs/sec'}</span>
            </div>

            <Separator orientation="vertical" className="hidden h-3.5 sm:block" />

            <div className="flex items-center gap-1.5">
              <Layers className="size-3.5" aria-hidden="true" />
              <span>Buffer:</span>
              <span className="text-foreground font-mono">
                {filteredMessages.length} / {messages.length} cached
              </span>
            </div>

            <Separator orientation="vertical" className="hidden h-3.5 sm:block" />

            <div className="flex items-center gap-1.5">
              <Zap className="size-3.5 text-amber-500" aria-hidden="true" />
              <span>Avg Latency:</span>
              <span className="text-foreground font-mono">1.8ms</span>
            </div>
          </div>

          <div className="text-muted-foreground flex items-center gap-2 font-mono">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            <span>SASL_SSL · LZ4 Compression · Schema Registry OK</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
