<script setup lang="ts">
import { ref } from 'vue'
import { JsonTreeView, type JsonValue } from '@/components/ui/json-tree-view'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'vue-sonner'

const apiResponse: JsonValue = {
  status: 'success',
  data: {
    user: {
      id: 8421,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@acme.com',
      role: 'admin',
      verified: true,
      createdAt: '2023-04-12T08:30:00Z',
    },
    organization: {
      id: 'org_abc123',
      name: 'Acme Inc.',
      plan: 'enterprise',
      seats: 50,
      usedSeats: 37,
    },
    permissions: ['read', 'write', 'delete', 'admin'],
    metadata: {
      lastLogin: '2024-03-15T14:22:11Z',
      ipAddress: '192.168.1.42',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      factors: null,
    },
  },
  pagination: {
    page: 1,
    perPage: 20,
    total: 1,
    hasNext: false,
  },
}

const errorResponse: JsonValue = {
  error: {
    code: 'VALIDATION_FAILED',
    message: 'The request body did not match the expected schema.',
    details: [
      { field: 'email', issue: 'must be a valid email address' },
      { field: 'age', issue: 'must be a positive integer' },
    ],
    requestId: 'req_01HZK8XJ9F2P3Q4R5S6T7U8V9W',
    timestamp: '2024-03-15T14:23:01Z',
  },
}

const webhookPayload: JsonValue = {
  event: 'order.created',
  id: 'evt_173829',
  created: 1710510184,
  data: {
    object: {
      id: 'ord_5521',
      number: 'ACME-0042',
      status: 'paid',
      total: 12900,
      currency: 'usd',
      customer: {
        id: 'cus_881',
        email: 'buyer@example.com',
      },
      items: [
        { sku: 'WIDGET-RED', quantity: 2, unitPrice: 4500 },
        { sku: 'WIDGET-BLUE', quantity: 1, unitPrice: 3900 },
      ],
    },
  },
  livemode: false,
}

const lastCopied = ref('')
function onCopy(value: string, path: string) {
  lastCopied.value = `${path} = ${value.slice(0, 50)}`
  toast.success('Copied to clipboard', { description: path })
}
</script>

<template>
  <Story
    title="API response inspector"
    description="A typical paginated user fetch — the kind of payload you'd inspect in a network debugger or admin panel."
  >
    <JsonTreeView :data="apiResponse" root-label="response" :expand-depth="2" class="max-h-96" />
  </Story>

  <Story
    title="Error response"
    description="Validation errors with a nested details array — root-labeled 'error' to mirror the response shape."
  >
    <JsonTreeView :data="errorResponse" root-label="error" :expand-depth="3" class="max-h-80" />
  </Story>

  <Story
    title="Webhook payload"
    description="A Stripe-style event payload with nested object and line-item arrays — common in integration logs."
  >
    <JsonTreeView :data="webhookPayload" root-label="event" :expand-depth="2" class="max-h-96" />
  </Story>

  <Story
    title="In a debug card"
    description="The viewer inside a Card with a status badge — how it looks embedded in a real admin dashboard."
  >
    <Card class="max-w-2xl">
      <CardHeader>
        <CardTitle class="flex items-center justify-between text-base">
          <span>GET /api/v2/users/8421</span>
          <Badge variant="secondary" class="font-mono text-xs">200 OK</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <JsonTreeView :data="apiResponse" root-label="response" :expand-depth="1" class="max-h-72" />
      </CardContent>
    </Card>
  </Story>

  <Story
    title="Searchable + copy on click"
    description="Type in the filter to dim non-matching nodes; click any value to copy it and fire a copy event."
  >
    <JsonTreeView :data="apiResponse" root-label="response" :expand-depth="3" @copy="onCopy" class="max-h-96" />
    <p v-if="lastCopied" class="text-muted-foreground mt-2 text-xs">Last copied: {{ lastCopied }}</p>
  </Story>

  <Story
    title="Collapsed vs. expanded"
    description="expandDepth 0 shows only the root; expandDepth 2 reveals two levels. Use the toolbar to expand all."
  >
    <div class="grid gap-4 lg:grid-cols-2">
      <div class="space-y-1.5">
        <span class="text-muted-foreground text-xs">expandDepth 0 — collapsed</span>
        <JsonTreeView :data="apiResponse" root-label="response" :expand-depth="0" class="max-h-64" />
      </div>
      <div class="space-y-1.5">
        <span class="text-muted-foreground text-xs">expandDepth 2 — expanded</span>
        <JsonTreeView :data="apiResponse" root-label="response" :expand-depth="2" class="max-h-64" />
      </div>
    </div>
  </Story>

  <Story
    title="Minimal toolbar"
    description="Hide search controls or the whole toolbar for a cleaner embed where filtering isn't needed."
  >
    <div class="grid gap-4 lg:grid-cols-2">
      <div class="space-y-1.5">
        <span class="text-muted-foreground text-xs">No search</span>
        <JsonTreeView
          :data="apiResponse"
          root-label="response"
          :show-search="false"
          :expand-depth="1"
          class="max-h-56"
        />
      </div>
      <div class="space-y-1.5">
        <span class="text-muted-foreground text-xs">No toolbar</span>
        <JsonTreeView
          :data="apiResponse"
          root-label="response"
          :show-toolbar="false"
          :show-search="false"
          :expand-depth="1"
          class="max-h-56"
        />
      </div>
    </div>
  </Story>
</template>
