<script setup lang="ts">
import WebhookTester from '@/components/blocks/webhook-tester/WebhookTester.vue'
</script>

<template>
  <Story
    title="Webhook Tester"
    description="Svix and Stripe style live webhook delivery inspector and event simulator. Features event payload selection, inline JSON editing, HMAC-SHA256 signature verification preview, live delivery attempt logs, request/response headers, and retry telemetry."
  >
    <WebhookTester />
  </Story>
</template>
