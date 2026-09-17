'use client'

import * as React from 'react'
import {
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Copy,
  Database,
  FileCode,
  Globe,
  History,
  Loader2,
  Play,
  Search,
  Sparkles,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface SchemaField {
  name: string
  args?: string
  returnType: string
  description: string
  sampleQuery: string
  sampleVariables: string
}

interface RootType {
  name: 'Query' | 'Mutation' | 'Subscription'
  color: string
  badgeVariant: 'default' | 'secondary' | 'outline'
  fields: SchemaField[]
}

interface QueryPreset {
  id: string
  name: string
  operationType: 'query' | 'mutation' | 'subscription'
  query: string
  variables: string
  response: Record<string, unknown>
  latency: string
  size: string
  timestamp: string
}

interface ResolverTrace {
  path: string
  parentType: string
  fieldName: string
  returnType: string
  durationMs: number
  percentage: number
}

export interface GraphqlQueryExplorerProps {
  className?: string
}

const presets: QueryPreset[] = [
  {
    id: 'preset-customer',
    name: 'GetCustomerProfile',
    operationType: 'query',
    query: `query GetCustomerProfile($id: ID!) {
  customer(id: $id) {
    id
    name
    email
    avatarUrl
    status
    createdAt
    subscriptions {
      id
      status
      plan
      renewalDate
      seats
    }
    billingAddress {
      city
      country
      postalCode
    }
  }
}`,
    variables: `{\n  "id": "cust_8492"\n}`,
    response: {
      data: {
        customer: {
          id: 'cust_8492',
          name: 'Sarah Jenkins',
          email: 'sarah.jenkins@acme-corp.io',
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
          status: 'ACTIVE',
          createdAt: '2024-03-15T08:22:19Z',
          subscriptions: [
            {
              id: 'sub_9812',
              status: 'ACTIVE',
              plan: 'ENTERPRISE_ANNUAL',
              renewalDate: '2027-03-15',
              seats: 48,
            },
            {
              id: 'sub_4410',
              status: 'CANCELED',
              plan: 'STARTER_TRIAL',
              renewalDate: '2024-04-01',
              seats: 5,
            },
          ],
          billingAddress: {
            city: 'San Francisco',
            country: 'US',
            postalCode: '94107',
          },
        },
      },
      extensions: {
        tracing: {
          version: 1,
          duration: 64120000,
        },
      },
    },
    latency: '64ms',
    size: '1.8 kB',
    timestamp: 'Just now',
  },
  {
    id: 'preset-users',
    name: 'ListUsers',
    operationType: 'query',
    query: `query ListUsers($limit: Int, $offset: Int) {
  users(limit: $limit, offset: $offset) {
    id
    fullName
    email
    role
    isVerified
    lastActiveAt
  }
}`,
    variables: `{\n  "limit": 3,\n  "offset": 0\n}`,
    response: {
      data: {
        users: [
          {
            id: 'usr_9011',
            fullName: 'Alex Rivera',
            email: 'alex.rivera@uipkge.dev',
            role: 'ADMIN',
            isVerified: true,
            lastActiveAt: '2026-08-21T10:45:00Z',
          },
          {
            id: 'usr_9012',
            fullName: 'Elena Rostova',
            email: 'elena.r@uipkge.dev',
            role: 'DEVELOPER',
            isVerified: true,
            lastActiveAt: '2026-08-21T09:12:30Z',
          },
          {
            id: 'usr_9013',
            fullName: 'Marcus Chen',
            email: 'marcus.chen@uipkge.dev',
            role: 'MEMBER',
            isVerified: false,
            lastActiveAt: '2026-08-20T18:04:12Z',
          },
        ],
      },
    },
    latency: '38ms',
    size: '0.9 kB',
    timestamp: '2 mins ago',
  },
  {
    id: 'preset-create-order',
    name: 'CreateOrder',
    operationType: 'mutation',
    query: `mutation CreateOrder($input: CreateOrderInput!) {
  createOrder(input: $input) {
    order {
      id
      status
      totalAmount
      currency
      itemsCount
      createdAt
    }
    clientSecret
    error {
      code
      message
    }
  }
}`,
    variables: `{\n  "input": {\n    "customerId": "cust_8492",\n    "items": [\n      { "sku": "SKU_PRO_REGISTRY", "quantity": 1, "price": 149.00 }\n    ],\n    "currency": "USD"\n  }\n}`,
    response: {
      data: {
        createOrder: {
          order: {
            id: 'ord_88201',
            status: 'PENDING_PAYMENT',
            totalAmount: 149.0,
            currency: 'USD',
            itemsCount: 1,
            createdAt: '2026-08-21T12:00:00Z',
          },
          clientSecret: 'pi_3Mtwx2_secret_9941a8',
          error: null,
        },
      },
    },
    latency: '112ms',
    size: '1.1 kB',
    timestamp: '5 mins ago',
  },
  {
    id: 'preset-subscription-stream',
    name: 'OnOrderStatusChanged',
    operationType: 'subscription',
    query: `subscription OnOrderStatusChanged($orderId: ID!) {
  orderStatusUpdated(orderId: $orderId) {
    orderId
    previousStatus
    newStatus
    updatedAt
    carrierTracking {
      carrier
      trackingNumber
      estimatedDelivery
    }
  }
}`,
    variables: `{\n  "orderId": "ord_88201"\n}`,
    response: {
      data: {
        orderStatusUpdated: {
          orderId: 'ord_88201',
          previousStatus: 'PROCESSING',
          newStatus: 'SHIPPED',
          updatedAt: '2026-08-21T12:05:44Z',
          carrierTracking: {
            carrier: 'FedEx Priority',
            trackingNumber: 'FDX-9982-1049-US',
            estimatedDelivery: '2026-08-23T16:00:00Z',
          },
        },
      },
    },
    latency: '18ms',
    size: '0.7 kB',
    timestamp: '12 mins ago',
  },
]

const schemaRoots: RootType[] = [
  {
    name: 'Query',
    color: 'text-sky-500 dark:text-sky-400',
    badgeVariant: 'default',
    fields: [
      {
        name: 'customer',
        args: 'id: ID!',
        returnType: 'Customer',
        description: 'Fetches verified customer account, active SaaS subscriptions, and verified billing profile.',
        sampleQuery: `query GetCustomerProfile($id: ID!) {\n  customer(id: $id) {\n    id\n    name\n    email\n    subscriptions { id status plan }\n  }\n}`,
        sampleVariables: `{\n  "id": "cust_8492"\n}`,
      },
      {
        name: 'users',
        args: 'limit: Int, offset: Int',
        returnType: '[User!]!',
        description: 'Returns paginated workspace members with security roles and activity status flags.',
        sampleQuery: `query ListUsers($limit: Int, $offset: Int) {\n  users(limit: $limit, offset: $offset) {\n    id\n    fullName\n    email\n    role\n  }\n}`,
        sampleVariables: `{\n  "limit": 10,\n  "offset": 0\n}`,
      },
      {
        name: 'userById',
        args: 'id: ID!',
        returnType: 'User',
        description: 'Look up specific team member by their unique UUID identifier.',
        sampleQuery: `query GetUser($id: ID!) {\n  userById(id: $id) {\n    id\n    fullName\n    email\n    role\n    isVerified\n  }\n}`,
        sampleVariables: `{\n  "id": "usr_9011"\n}`,
      },
      {
        name: 'products',
        args: 'category: String, inStock: Boolean',
        returnType: '[Product!]!',
        description: 'Catalog items inventory with real-time stock levels and tiered price book.',
        sampleQuery: `query GetProducts($category: String) {\n  products(category: $category) {\n    id\n    title\n    price\n    inventoryCount\n  }\n}`,
        sampleVariables: `{\n  "category": "developer-tools"\n}`,
      },
      {
        name: 'orders',
        args: 'status: OrderStatus, limit: Int',
        returnType: '[Order!]!',
        description: 'Historical and in-flight purchase orders with settlement metadata.',
        sampleQuery: `query GetOrders($status: OrderStatus) {\n  orders(status: $status) {\n    id\n    status\n    totalAmount\n    createdAt\n  }\n}`,
        sampleVariables: `{\n  "status": "COMPLETED"\n}`,
      },
      {
        name: 'organization',
        args: 'slug: String!',
        returnType: 'Organization',
        description: 'Retrieve tenant workspace configurations, member limits, and billing tier.',
        sampleQuery: `query GetOrg($slug: String!) {\n  organization(slug: $slug) {\n    id\n    name\n    slug\n    memberCount\n  }\n}`,
        sampleVariables: `{\n  "slug": "acme-corp"\n}`,
      },
    ],
  },
  {
    name: 'Mutation',
    color: 'text-amber-500 dark:text-amber-400',
    badgeVariant: 'secondary',
    fields: [
      {
        name: 'createOrder',
        args: 'input: CreateOrderInput!',
        returnType: 'OrderPayload!',
        description: 'Creates new purchase order, holds inventory reservations, and emits payment intent.',
        sampleQuery: `mutation CreateOrder($input: CreateOrderInput!) {\n  createOrder(input: $input) {\n    order { id status totalAmount }\n    clientSecret\n  }\n}`,
        sampleVariables: `{\n  "input": {\n    "customerId": "cust_8492",\n    "items": [{ "sku": "SKU_01", "quantity": 1, "price": 149.00 }]\n  }\n}`,
      },
      {
        name: 'updateCustomer',
        args: 'id: ID!, input: CustomerInput!',
        returnType: 'Customer!',
        description: 'Updates customer profile attributes and notification preferences.',
        sampleQuery: `mutation UpdateCustomer($id: ID!, $input: CustomerInput!) {\n  updateCustomer(id: $id, input: $input) {\n    id\n    name\n    email\n  }\n}`,
        sampleVariables: `{\n  "id": "cust_8492",\n  "input": { "name": "Sarah Jenkins" }\n}`,
      },
      {
        name: 'cancelSubscription',
        args: 'id: ID!, reason: String',
        returnType: 'SubscriptionResult!',
        description: 'Immediately pauses or schedules cancellation for recurring billing plan.',
        sampleQuery: `mutation CancelSub($id: ID!, $reason: String) {\n  cancelSubscription(id: $id, reason: $reason) {\n    id\n    status\n    effectiveDate\n  }\n}`,
        sampleVariables: `{\n  "id": "sub_4410",\n  "reason": "Upgraded to Enterprise annual"\n}`,
      },
      {
        name: 'rotateApiKey',
        args: 'keyId: ID!',
        returnType: 'ApiKeyRotationPayload!',
        description: 'Invalidates existing API secret and provisions new machine token.',
        sampleQuery: `mutation RotateKey($keyId: ID!) {\n  rotateApiKey(keyId: $keyId) {\n    keyId\n    secretToken\n    expiresAt\n  }\n}`,
        sampleVariables: `{\n  "keyId": "key_live_9941"\n}`,
      },
    ],
  },
  {
    name: 'Subscription',
    color: 'text-purple-500 dark:text-purple-400',
    badgeVariant: 'outline',
    fields: [
      {
        name: 'orderStatusUpdated',
        args: 'orderId: ID!',
        returnType: 'OrderStatusEvent!',
        description: 'Live push stream delivering order state transitions and logistics milestones.',
        sampleQuery: `subscription WatchOrder($orderId: ID!) {\n  orderStatusUpdated(orderId: $orderId) {\n    orderId\n    newStatus\n    updatedAt\n  }\n}`,
        sampleVariables: `{\n  "orderId": "ord_88201"\n}`,
      },
      {
        name: 'userActivityStream',
        args: 'channelId: ID!',
        returnType: 'ActivityEvent!',
        description: 'Workspace real-time collaboration telemetry and presence updates.',
        sampleQuery: `subscription ActivityStream($channelId: ID!) {\n  userActivityStream(channelId: $channelId) {\n    userId\n    action\n    timestamp\n  }\n}`,
        sampleVariables: `{\n  "channelId": "chan_engineering"\n}`,
      },
    ],
  },
]

const traces: ResolverTrace[] = [
  {
    path: 'Query.customer',
    parentType: 'Query',
    fieldName: 'customer',
    returnType: 'Customer',
    durationMs: 48.2,
    percentage: 75,
  },
  {
    path: 'Customer.subscriptions',
    parentType: 'Customer',
    fieldName: 'subscriptions',
    returnType: '[Subscription!]!',
    durationMs: 14.9,
    percentage: 23,
  },
  {
    path: 'Customer.billingAddress',
    parentType: 'Customer',
    fieldName: 'billingAddress',
    returnType: 'BillingAddress',
    durationMs: 1.0,
    percentage: 2,
  },
]

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function highlightJsonLine(line: string): string {
  if (!line) return ''
  const escaped = escapeHtml(line)
  return escaped.replace(
    /(&quot;(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*&quot;(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      let cls = 'text-amber-600 dark:text-amber-400'
      if (/^&quot;/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'text-sky-600 dark:text-sky-400 font-medium'
        } else {
          cls = 'text-emerald-600 dark:text-emerald-400'
        }
      } else if (/true|false/.test(match)) {
        cls = 'text-purple-600 dark:text-purple-400 font-semibold'
      } else if (/null/.test(match)) {
        cls = 'text-rose-500 dark:text-rose-400 italic'
      }
      return `<span class="${cls}">${match}</span>`
    },
  )
}

function highlightGraphqlLine(line: string): string {
  if (!line) return ''
  const escaped = escapeHtml(line)
  if (escaped.trim().startsWith('#')) {
    return `<span class="text-muted-foreground/60 italic">${escaped}</span>`
  }

  // Park each emitted <span> behind a letter-only placeholder: the type pass
  // (`:\s*Type`) otherwise matched the `dark:text-...` inside markup an earlier
  // pass had already inserted, splitting the class attribute.
  const parked: string[] = []
  const park = (html: string) => {
    const key = String(parked.length)
      .split('')
      .map((d) => String.fromCharCode(97 + Number(d)))
      .join('')
    parked.push(html)
    return `\u0000${key}\u0000`
  }

  return escaped
    .replace(/\b(query|mutation|subscription|fragment|on)\b/g, (m) =>
      park(`<span class="text-sky-600 dark:text-sky-400 font-semibold">${m}</span>`),
    )
    .replace(/(\$[a-zA-Z0-9_]+)/g, (m) =>
      park(`<span class="text-emerald-600 dark:text-emerald-400 font-medium">${m}</span>`),
    )
    .replace(
      /:\s*([A-Za-z0-9_\[\]!]+)/g,
      (_, t) => ': ' + park(`<span class="text-indigo-600 dark:text-indigo-400 font-mono">${t}</span>`),
    )
    .replace(/(@[a-zA-Z0-9_]+)/g, (m) => park(`<span class="text-amber-600 dark:text-amber-400">${m}</span>`))
    .replace(/\u0000([a-j]+)\u0000/g, (_, key: string) => {
      const idx = Number(
        key
          .split('')
          .map((c: string) => String(c.charCodeAt(0) - 97))
          .join(''),
      )
      return parked[idx] ?? ''
    })
}

function prettifyGraphql(queryStr: string): string {
  const lines = queryStr.split('\n')
  let indentLevel = 0
  const formatted: string[] = []

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line) continue

    if (line.startsWith('}') || line.startsWith(')')) {
      indentLevel = Math.max(0, indentLevel - 1)
    }

    formatted.push('  '.repeat(indentLevel) + line)

    if (line.endsWith('{') || line.endsWith('(')) {
      indentLevel++
    }
  }

  return formatted.join('\n')
}

export function GraphqlQueryExplorer({ className }: GraphqlQueryExplorerProps) {
  const [endpointUrl, setEndpointUrl] = React.useState('https://api.uipkge.dev/graphql')
  const [schemaSearch, setSchemaSearch] = React.useState('')
  const [selectedField, setSelectedField] = React.useState<SchemaField | null>(null)
  const [expandedRoots, setExpandedRoots] = React.useState<Record<string, boolean>>({
    Query: true,
    Mutation: true,
    Subscription: true,
  })

  const [editorMode, setEditorMode] = React.useState<'edit' | 'preview'>('edit')
  const [activeCenterTab, setActiveCenterTab] = React.useState<'variables' | 'headers'>('variables')
  const [isVariablesCollapsed, setIsVariablesCollapsed] = React.useState(false)
  const [activeResponseTab, setActiveResponseTab] = React.useState<'response' | 'tracing' | 'headers'>('response')

  const [isLoading, setIsLoading] = React.useState(false)
  const [copiedResponse, setCopiedResponse] = React.useState(false)
  const [showHistoryDropdown, setShowHistoryDropdown] = React.useState(false)

  const [activeQuery, setActiveQuery] = React.useState(presets[0].query)
  const [activeVariables, setActiveVariables] = React.useState(presets[0].variables)
  const [activeHeaders, setActiveHeaders] = React.useState(
    `{\n  "Authorization": "Bearer uipkge_live_9f81a7",\n  "X-Tenant-ID": "tenant_prod_eu"\n}`,
  )
  const [responseJson, setResponseJson] = React.useState<Record<string, unknown>>(presets[0].response)
  const [responseStatus, setResponseStatus] = React.useState('200 OK')
  const [responseLatency, setResponseLatency] = React.useState('64ms')
  const [responseSize, setResponseSize] = React.useState('1.8 kB')

  const queryLines = React.useMemo(() => activeQuery.split('\n'), [activeQuery])
  const variableLines = React.useMemo(() => activeVariables.split('\n'), [activeVariables])
  const headersLines = React.useMemo(() => activeHeaders.split('\n'), [activeHeaders])
  const formattedResponseString = React.useMemo(() => JSON.stringify(responseJson, null, 2), [responseJson])
  const responseLines = React.useMemo(() => formattedResponseString.split('\n'), [formattedResponseString])

  const detectedOperation = React.useMemo(() => {
    const q = activeQuery.trim()
    if (q.startsWith('mutation'))
      return { type: 'mutation', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30' }
    if (q.startsWith('subscription'))
      return {
        type: 'subscription',
        color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
      }
    return { type: 'query', color: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30' }
  }, [activeQuery])

  const isVariablesValidJson = React.useMemo(() => {
    try {
      JSON.parse(activeVariables)
      return true
    } catch {
      return false
    }
  }, [activeVariables])

  const filteredSchemaRoots = React.useMemo(() => {
    const query = schemaSearch.trim().toLowerCase()
    if (!query) return schemaRoots

    return schemaRoots
      .map((root) => {
        const matchingFields = root.fields.filter(
          (f) =>
            f.name.toLowerCase().includes(query) ||
            f.returnType.toLowerCase().includes(query) ||
            (f.args && f.args.toLowerCase().includes(query)) ||
            f.description.toLowerCase().includes(query),
        )
        return {
          ...root,
          fields: matchingFields,
        }
      })
      .filter((root) => root.fields.length > 0)
  }, [schemaSearch])

  const toggleRoot = (name: string) => {
    setExpandedRoots((prev) => ({ ...prev, [name]: !prev[name] }))
  }

  const handlePrettify = () => {
    setActiveQuery(prettifyGraphql(activeQuery))
    if (isVariablesValidJson) {
      try {
        setActiveVariables(JSON.stringify(JSON.parse(activeVariables), null, 2))
      } catch {
        // Keep as-is
      }
    }
  }

  const runQuery = () => {
    if (isLoading) return
    setIsLoading(true)

    setTimeout(() => {
      const randMs = Math.floor(Math.random() * 40) + 35
      setResponseLatency(`${randMs}ms`)

      const trimmed = activeQuery.trim()
      if (trimmed.includes('createOrder') || trimmed.includes('mutation')) {
        setResponseJson(presets[2].response)
        setResponseSize(presets[2].size)
        setResponseStatus('200 OK')
      } else if (trimmed.includes('orderStatusUpdated') || trimmed.includes('subscription')) {
        setResponseJson(presets[3].response)
        setResponseSize(presets[3].size)
        setResponseStatus('200 OK · SSE Stream')
      } else if (trimmed.includes('users') || trimmed.includes('ListUsers')) {
        setResponseJson(presets[1].response)
        setResponseSize(presets[1].size)
        setResponseStatus('200 OK')
      } else {
        setResponseJson(presets[0].response)
        setResponseSize(presets[0].size)
        setResponseStatus('200 OK')
      }

      setIsLoading(false)
    }, 260)
  }

  const loadPreset = (preset: QueryPreset) => {
    setActiveQuery(preset.query)
    setActiveVariables(preset.variables)
    setResponseJson(preset.response)
    setResponseLatency(preset.latency)
    setResponseSize(preset.size)
    setShowHistoryDropdown(false)
  }

  const loadFieldQuery = (field: SchemaField) => {
    setActiveQuery(field.sampleQuery)
    setActiveVariables(field.sampleVariables)
    setSelectedField(field)
  }

  const copyResponse = () => {
    navigator.clipboard.writeText(formattedResponseString)
    setCopiedResponse(true)
    setTimeout(() => {
      setCopiedResponse(false)
    }, 2000)
  }

  return (
    <Card
      data-slot="graphql-query-explorer"
      className={cn(
        'border-border bg-card text-card-foreground flex min-h-[720px] flex-col overflow-hidden rounded-xl border shadow-xs',
        className,
      )}
    >
      {/* TOP TOOLBAR */}
      <header className="border-border bg-muted/40 flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
        {/* Left: Endpoint & Method & Schema Badge */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Badge
            variant="outline"
            className="border-border bg-background font-mono text-xs font-semibold tracking-wider"
          >
            POST
          </Badge>

          <div className="border-border bg-background flex h-8 items-center gap-2 rounded-md border px-3 text-xs shadow-xs">
            <Globe className="text-muted-foreground size-3.5" />
            <input
              value={endpointUrl}
              onChange={(e) => setEndpointUrl(e.target.value)}
              type="text"
              className="text-foreground w-64 bg-transparent font-mono text-xs focus:outline-none"
              placeholder="https://api.example.com/graphql"
            />
          </div>

          <Badge variant="secondary" className="gap-1.5 py-1 font-mono text-xs font-normal">
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
            Schema v2.4 · 48 Types
          </Badge>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            title="Format query (Shift + Option + F)"
            onClick={handlePrettify}
          >
            <Sparkles className="size-3.5" />
            Prettify
          </Button>

          {/* History Menu Toggle */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs"
              onClick={() => setShowHistoryDropdown(!showHistoryDropdown)}
            >
              <History className="size-3.5" />
              History
              <Badge variant="secondary" className="ml-0.5 h-4 px-1 font-mono text-xs">
                {presets.length}
              </Badge>
            </Button>

            {/* History Dropdown Card */}
            {showHistoryDropdown && (
              <div className="border-border bg-popover text-popover-foreground absolute right-0 z-50 mt-2 w-80 rounded-lg border p-2 text-xs shadow-md">
                <div className="border-border text-muted-foreground flex items-center justify-between gap-x-2 border-b px-2 py-1.5 font-medium">
                  <span>Recent Executions</span>
                  <span className="font-mono text-xs">Saved Stubs</span>
                </div>
                <div className="mt-1 max-h-60 space-y-1 overflow-y-auto">
                  {presets.map((preset) => (
                    <button
                      key={preset.id}
                      className="hover:bg-muted focus:bg-muted flex w-full flex-col gap-0.5 rounded-md p-2 text-left transition-colors"
                      onClick={() => loadPreset(preset)}
                    >
                      <div className="flex items-center justify-between gap-x-2">
                        <span className="text-foreground font-mono font-medium">{preset.name}</span>
                        <Badge variant="outline" className="font-mono text-xs font-normal">
                          {preset.latency}
                        </Badge>
                      </div>
                      <div className="text-muted-foreground flex flex-wrap items-center gap-2 font-mono text-xs">
                        <span className="text-primary font-semibold uppercase">{preset.operationType}</span>
                        <span>·</span>
                        <span>{preset.timestamp}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Run Query Primary Action */}
          <Button
            variant="default"
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 gap-2 text-xs font-semibold shadow-xs"
            disabled={isLoading}
            onClick={runQuery}
          >
            {isLoading ? <Loader2 className="size-3.5 animate-spin" /> : <Play className="size-3.5 fill-current" />}
            Run Query
            <kbd className="border-primary-foreground/30 bg-primary-foreground/15 hidden rounded border px-1 py-0.5 font-mono text-xs font-normal sm:inline-block">
              ⌘↵
            </kbd>
          </Button>
        </div>
      </header>

      {/* 3-COLUMN STUDIO LAYOUT */}
      <div className="divide-border grid flex-1 grid-cols-1 divide-y overflow-hidden lg:grid-cols-12 lg:divide-x lg:divide-y-0">
        {/* COLUMN 1: SCHEMA DOCUMENTATION SIDEBAR (lg:col-span-3) */}
        <aside className="bg-muted/15 flex flex-col overflow-hidden lg:col-span-3">
          {/* Sidebar Header */}
          <div className="border-border bg-muted/30 flex items-center justify-between gap-x-2 border-b px-3 py-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <Database className="text-primary size-3.5" />
              <span>Schema Explorer</span>
            </div>
            <Badge variant="outline" className="font-mono text-xs">
              v2.4
            </Badge>
          </div>

          {/* Search Types Input */}
          <div className="border-border border-b p-2.5">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-2.5 left-2.5 size-3.5" />
              <Input
                value={schemaSearch}
                onChange={(e) => setSchemaSearch(e.target.value)}
                type="text"
                placeholder="Search types & fields..."
                className="h-8 pl-8 font-mono text-xs"
              />
            </div>
          </div>

          {/* Root Types & Field Tree */}
          <div className="flex-1 space-y-3 overflow-y-auto p-2.5">
            {filteredSchemaRoots.map((root) => (
              <div key={root.name} className="space-y-1">
                {/* Root Type Toggle */}
                <button
                  className="hover:bg-muted/60 flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs font-semibold transition-colors"
                  onClick={() => toggleRoot(root.name)}
                >
                  <div className="flex items-center gap-1.5">
                    {expandedRoots[root.name] ? (
                      <ChevronDown className="text-muted-foreground size-3.5" />
                    ) : (
                      <ChevronRight className="text-muted-foreground size-3.5" />
                    )}
                    <span className={root.color}>{root.name}</span>
                  </div>
                  <Badge variant="secondary" className="font-mono text-xs font-normal">
                    {root.fields.length}
                  </Badge>
                </button>

                {/* Fields List */}
                {expandedRoots[root.name] && (
                  <div className="border-border/70 ml-2 space-y-0.5 border-l pl-2">
                    {root.fields.map((field) => (
                      <button
                        key={field.name}
                        className={cn(
                          'hover:bg-muted focus:bg-muted group flex w-full flex-col gap-0.5 rounded px-2 py-1.5 text-left transition-colors',
                          selectedField?.name === field.name && 'bg-muted/90 ring-border ring-1',
                        )}
                        onClick={() => loadFieldQuery(field)}
                      >
                        <div className="flex items-center justify-between gap-x-2">
                          <span className="text-foreground group-hover:text-primary font-mono text-xs font-medium transition-colors">
                            {field.name}
                          </span>
                          <span className="text-muted-foreground font-mono text-xs">{field.returnType}</span>
                        </div>
                        {field.args && (
                          <div className="text-muted-foreground truncate font-mono text-xs">({field.args})</div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Selected Field Documentation Preview */}
          {selectedField && (
            <div className="border-border bg-card/60 border-t p-3 text-xs">
              <div className="flex items-center justify-between gap-x-2">
                <span className="text-foreground font-mono font-semibold">{selectedField.name}</span>
                <Badge variant="secondary" className="font-mono text-xs">
                  {selectedField.returnType}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1.5 text-xs leading-normal">{selectedField.description}</p>
              {selectedField.args && (
                <div className="border-border bg-muted/40 mt-2 rounded border p-1.5 font-mono text-xs">
                  <span className="text-muted-foreground">Args: </span>
                  <span className="text-foreground font-medium">{selectedField.args}</span>
                </div>
              )}
            </div>
          )}
        </aside>

        {/* COLUMN 2: CENTER QUERY & VARIABLES EDITOR (lg:col-span-5) */}
        <main className="bg-card flex flex-col overflow-hidden lg:col-span-5">
          {/* Query Toolbar */}
          <div className="border-border bg-muted/20 flex items-center justify-between gap-x-2 border-b px-3 py-2">
            <div className="flex flex-wrap items-center gap-2">
              <FileCode className="text-primary size-4" />
              <span className="text-foreground font-mono text-xs font-semibold">Query.graphql</span>
              <Badge variant="outline" className={cn('font-mono text-xs uppercase', detectedOperation.color)}>
                {detectedOperation.type}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted-foreground font-mono text-xs">
                {queryLines.length} lines · {activeQuery.length} chars
              </span>
              <div className="border-border bg-muted/60 flex items-center rounded-md border p-0.5">
                <button
                  className={cn(
                    'min-h-6 rounded px-2 py-0.5 text-xs font-medium transition-colors',
                    editorMode === 'edit'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                  onClick={() => setEditorMode('edit')}
                >
                  Edit
                </button>
                <button
                  className={cn(
                    'min-h-6 rounded px-2 py-0.5 text-xs font-medium transition-colors',
                    editorMode === 'preview'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                  onClick={() => setEditorMode('preview')}
                >
                  Preview
                </button>
              </div>
            </div>
          </div>

          {/* Query Editor Body with Line Numbers */}
          <div className="relative flex min-h-[260px] flex-1 overflow-hidden">
            {/* Line Numbers Gutter */}
            <div className="border-border/60 bg-muted/20 text-muted-foreground/50 w-10 shrink-0 overflow-hidden border-r py-3 pr-2 text-right font-mono text-xs leading-relaxed select-none">
              {queryLines.map((_, idx) => (
                <div key={idx}>{idx + 1}</div>
              ))}
            </div>

            {/* Code Area: Editable or Syntax Preview */}
            <div className="bg-background/50 flex-1 overflow-auto">
              {editorMode === 'edit' ? (
                <textarea
                  value={activeQuery}
                  onChange={(e) => setActiveQuery(e.target.value)}
                  spellCheck={false}
                  className="text-foreground h-full w-full resize-none bg-transparent p-3 font-mono text-xs leading-relaxed focus:outline-none"
                  placeholder="# Write GraphQL query or mutation here..."
                />
              ) : (
                <div className="space-y-0.5 p-3 font-mono text-xs leading-relaxed">
                  {queryLines.map((line, idx) => (
                    <div
                      key={idx}
                      className="whitespace-pre"
                      dangerouslySetInnerHTML={{ __html: highlightGraphqlLine(line) }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* COLLAPSIBLE BOTTOM PANE: VARIABLES / HEADERS */}
          <div className="border-border bg-muted/10 flex flex-col border-t">
            {/* Pane Header */}
            <div className="border-border bg-muted/30 flex items-center justify-between gap-x-2 border-b px-3 py-1.5 text-xs">
              <div className="flex items-center gap-3">
                <button
                  className={cn(
                    'font-mono font-medium transition-colors',
                    activeCenterTab === 'variables' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                  )}
                  onClick={() => setActiveCenterTab('variables')}
                >
                  {'{ }'} Query Variables
                </button>
                <span className="text-border">|</span>
                <button
                  className={cn(
                    'font-mono font-medium transition-colors',
                    activeCenterTab === 'headers' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                  )}
                  onClick={() => setActiveCenterTab('headers')}
                >
                  HTTP Headers (2)
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {activeCenterTab === 'variables' && (
                  <Badge
                    variant="outline"
                    className={cn(
                      'font-mono text-xs',
                      isVariablesValidJson
                        ? 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                        : 'border-rose-500/30 text-rose-600 dark:text-rose-400',
                    )}
                  >
                    {isVariablesValidJson ? 'Valid JSON' : 'Invalid JSON'}
                  </Badge>
                )}

                <button
                  className="text-muted-foreground hover:text-foreground min-h-6 p-0.5 transition-colors"
                  title={isVariablesCollapsed ? 'Expand pane' : 'Collapse pane'}
                  onClick={() => setIsVariablesCollapsed(!isVariablesCollapsed)}
                >
                  {isVariablesCollapsed ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                </button>
              </div>
            </div>

            {/* Pane Content */}
            {!isVariablesCollapsed && (
              <div className="bg-background/50 relative flex h-36 min-h-[140px] overflow-hidden">
                {activeCenterTab === 'variables' ? (
                  <>
                    <div className="border-border/60 bg-muted/20 text-muted-foreground/50 w-8 shrink-0 overflow-hidden border-r py-2 pr-2 text-right font-mono text-xs leading-relaxed select-none">
                      {variableLines.map((_, idx) => (
                        <div key={idx}>{idx + 1}</div>
                      ))}
                    </div>
                    <textarea
                      value={activeVariables}
                      onChange={(e) => setActiveVariables(e.target.value)}
                      spellCheck={false}
                      className="text-foreground h-full w-full resize-none bg-transparent p-2 font-mono text-xs leading-relaxed focus:outline-none"
                      placeholder="{}"
                    />
                  </>
                ) : (
                  <>
                    <div className="border-border/60 bg-muted/20 text-muted-foreground/50 w-8 shrink-0 overflow-hidden border-r py-2 pr-2 text-right font-mono text-xs leading-relaxed select-none">
                      {headersLines.map((_, idx) => (
                        <div key={idx}>{idx + 1}</div>
                      ))}
                    </div>
                    <textarea
                      value={activeHeaders}
                      onChange={(e) => setActiveHeaders(e.target.value)}
                      spellCheck={false}
                      className="text-foreground h-full w-full resize-none bg-transparent p-2 font-mono text-xs leading-relaxed focus:outline-none"
                    />
                  </>
                )}
              </div>
            )}
          </div>
        </main>

        {/* COLUMN 3: RIGHT RESPONSE PANEL (lg:col-span-4) */}
        <section className="bg-muted/10 flex flex-col overflow-hidden lg:col-span-4">
          {/* Response Header */}
          <div className="border-border bg-muted/30 flex items-center justify-between gap-x-2 border-b px-3 py-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400"
              >
                <span className="size-1.5 rounded-full bg-emerald-500" />
                {responseStatus}
              </Badge>

              <span className="text-muted-foreground flex items-center gap-1 font-mono text-xs">
                <Zap className="size-3 text-amber-500" />
                {responseLatency}
              </span>

              <span className="text-muted-foreground font-mono text-xs">{responseSize}</span>
            </div>

            <Button variant="ghost" size="sm" className="h-7 gap-1 px-2 text-xs" onClick={copyResponse}>
              {copiedResponse ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
              <span>{copiedResponse ? 'Copied' : 'Copy'}</span>
            </Button>
          </div>

          {/* Response View Tabs */}
          <div className="border-border bg-muted/20 flex items-center gap-1 border-b px-3 py-1">
            <button
              className={cn(
                'min-h-6 rounded px-2 py-1 font-mono text-xs font-medium transition-colors',
                activeResponseTab === 'response'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              )}
              onClick={() => setActiveResponseTab('response')}
            >
              Response JSON
            </button>
            <button
              className={cn(
                'min-h-6 rounded px-2 py-1 font-mono text-xs font-medium transition-colors',
                activeResponseTab === 'tracing'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              )}
              onClick={() => setActiveResponseTab('tracing')}
            >
              Tracing
            </button>
            <button
              className={cn(
                'min-h-6 rounded px-2 py-1 font-mono text-xs font-medium transition-colors',
                activeResponseTab === 'headers'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              )}
              onClick={() => setActiveResponseTab('headers')}
            >
              Headers
            </button>
          </div>

          {/* Loading Indicator */}
          {isLoading ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
              <Loader2 className="text-primary size-6 animate-spin" />
              <div className="space-y-1">
                <p className="text-foreground font-mono text-xs font-medium">Executing GraphQL Operation...</p>
                <p className="text-muted-foreground font-mono text-xs">{endpointUrl}</p>
              </div>
            </div>
          ) : activeResponseTab === 'response' ? (
            /* Response Body: Tab 1 (JSON Response) */
            <div className="relative flex flex-1 overflow-auto bg-neutral-950 text-neutral-100 dark:bg-neutral-950">
              {/* Gutter */}
              <div className="w-10 shrink-0 overflow-hidden border-r border-neutral-800 bg-neutral-900/50 py-3 pr-2 text-right font-mono text-xs leading-relaxed text-neutral-500 select-none">
                {responseLines.map((_, idx) => (
                  <div key={idx}>{idx + 1}</div>
                ))}
              </div>

              {/* Colorized JSON Code */}
              <div className="flex-1 overflow-auto p-3 font-mono text-xs leading-relaxed">
                {responseLines.map((line, idx) => (
                  <div
                    key={idx}
                    className="font-mono whitespace-pre"
                    dangerouslySetInnerHTML={{ __html: highlightJsonLine(line) }}
                  />
                ))}
              </div>
            </div>
          ) : activeResponseTab === 'tracing' ? (
            /* Response Body: Tab 2 (Tracing Waterfall) */
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              <div className="border-border bg-card flex items-center justify-between gap-x-2 rounded-lg border p-3">
                <div>
                  <span className="text-muted-foreground text-xs">Total Duration</span>
                  <p className="text-foreground font-mono text-base font-bold">{responseLatency}</p>
                </div>
                <Badge variant="secondary" className="font-mono text-xs">
                  Apollo Tracing v1
                </Badge>
              </div>

              <div className="space-y-2">
                <span className="text-muted-foreground font-mono text-xs font-medium">Resolver Execution Times</span>
                <div className="space-y-2">
                  {traces.map((trace) => (
                    <div key={trace.path} className="border-border bg-card space-y-1.5 rounded-lg border p-2.5 text-xs">
                      <div className="flex items-center justify-between gap-x-2">
                        <span className="text-foreground font-mono font-semibold">{trace.path}</span>
                        <span className="text-muted-foreground font-mono">{trace.durationMs}ms</span>
                      </div>
                      <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
                        <div className="bg-primary h-full rounded-full" style={{ width: `${trace.percentage}%` }} />
                      </div>
                      <div className="text-muted-foreground flex justify-between font-mono text-xs">
                        <span>Type: {trace.returnType}</span>
                        <span>{trace.percentage}% of query</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Response Body: Tab 3 (HTTP Response Headers) */
            <div className="flex-1 space-y-2 overflow-y-auto p-3 font-mono text-xs">
              <div className="border-border bg-card space-y-2 rounded-lg border p-3">
                <div className="border-border/50 flex justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">content-type:</span>
                  <span className="text-foreground font-medium">application/graphql-response+json; charset=utf-8</span>
                </div>
                <div className="border-border/50 flex justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">cache-control:</span>
                  <span className="text-foreground font-medium">max-age=0, private, must-revalidate</span>
                </div>
                <div className="border-border/50 flex justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">x-request-id:</span>
                  <span className="text-foreground font-medium">req_01hx8921a9vnm8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">server-timing:</span>
                  <span className="text-foreground font-medium">graphql;dur=64.1</span>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </Card>
  )
}

export default GraphqlQueryExplorer
