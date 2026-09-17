<script setup lang="ts">
import Webhooks from '@/components/blocks/webhooks/Webhooks.vue'
</script>

<template>
  <Story title="Default" description="Endpoints with event chips and success rates above a live delivery log.">
    <Webhooks />
  </Story>

  <Story title="Disabled endpoint" description="Paused endpoints keep their config but stop receiving payloads.">
    <Webhooks
      :endpoints="[
        {
          id: 'e1',
          url: 'https://api.acme.com/hooks/orders',
          enabled: false,
          events: ['order.created'],
          successRate: '—',
        },
      ]"
    />
  </Story>

  <Story title="Failing deliveries" description="5xx responses render destructive pills with retry affordances.">
    <Webhooks
      :endpoints="[
        {
          id: 'e1',
          url: 'https://api.acme.com/hooks/orders',
          enabled: true,
          events: ['order.created'],
          successRate: '62.0% · 24h',
        },
      ]"
      :deliveries="[
        {
          id: 'd1',
          endpointId: 'e1',
          event: 'order.created',
          status: 500,
          durationMs: 10_240,
          retries: 3,
          date: new Date(),
        },
        {
          id: 'd2',
          endpointId: 'e1',
          event: 'order.created',
          status: 502,
          durationMs: 8_120,
          retries: 2,
          date: new Date(Date.now() - 600_000),
        },
        {
          id: 'd3',
          endpointId: 'e1',
          event: 'order.created',
          status: 200,
          durationMs: 280,
          retries: 0,
          date: new Date(Date.now() - 1_200_000),
        },
      ]"
    />
  </Story>

  <Story
    title="Retry affordance"
    description="Any 4xx/5xx row exposes a retry action; durations format to seconds past 1s."
  >
    <Webhooks
      :endpoints="[]"
      :deliveries="[
        {
          id: 'd1',
          endpointId: 'e1',
          event: 'customer.updated',
          status: 429,
          durationMs: 1_480,
          retries: 1,
          date: new Date(),
        },
        {
          id: 'd2',
          endpointId: 'e1',
          event: 'invoice.paid',
          status: 200,
          durationMs: 1_240,
          retries: 0,
          date: new Date(Date.now() - 300_000),
        },
      ]"
    />
  </Story>

  <Story title="Empty deliveries" description="Fresh endpoints have nothing in the log yet.">
    <Webhooks :deliveries="[]" />
  </Story>

  <Story title="Many events" description="Event chips wrap cleanly when an endpoint subscribes to everything.">
    <Webhooks
      :endpoints="[
        {
          id: 'e1',
          url: 'https://api.acme.com/hooks/all-events',
          enabled: true,
          events: ['order.created', 'order.refunded', 'customer.updated', 'invoice.paid'],
          successRate: '99.9% · 24h',
        },
      ]"
    />
  </Story>

  <Story
    title="Mixed statuses"
    description="A realistic log mixing successes, redirects-class client errors and server failures."
  >
    <Webhooks
      :deliveries="[
        {
          id: 'd1',
          endpointId: 'e1',
          event: 'order.created',
          status: 200,
          durationMs: 312,
          retries: 0,
          date: new Date(),
        },
        {
          id: 'd2',
          endpointId: 'e1',
          event: 'order.refunded',
          status: 404,
          durationMs: 96,
          retries: 1,
          date: new Date(Date.now() - 240_000),
        },
        {
          id: 'd3',
          endpointId: 'e1',
          event: 'invoice.paid',
          status: 200,
          durationMs: 188,
          retries: 0,
          date: new Date(Date.now() - 480_000),
        },
        {
          id: 'd4',
          endpointId: 'e1',
          event: 'customer.updated',
          status: 410,
          durationMs: 51,
          retries: 0,
          date: new Date(Date.now() - 720_000),
        },
        {
          id: 'd5',
          endpointId: 'e1',
          event: 'order.created',
          status: 500,
          durationMs: 10_240,
          retries: 2,
          date: new Date(Date.now() - 960_000),
        },
      ]"
    />
  </Story>

  <Story title="Latency formatting" description="Sub-second shows ms; longer attempts show seconds with one decimal.">
    <Webhooks
      :deliveries="[
        {
          id: 'd1',
          endpointId: 'e1',
          event: 'order.created',
          status: 200,
          durationMs: 96,
          retries: 0,
          date: new Date(),
        },
        {
          id: 'd2',
          endpointId: 'e1',
          event: 'order.created',
          status: 200,
          durationMs: 1_480,
          retries: 0,
          date: new Date(Date.now() - 60_000),
        },
        {
          id: 'd3',
          endpointId: 'e1',
          event: 'order.created',
          status: 200,
          durationMs: 12_800,
          retries: 0,
          date: new Date(Date.now() - 120_000),
        },
      ]"
    />
  </Story>
</template>
