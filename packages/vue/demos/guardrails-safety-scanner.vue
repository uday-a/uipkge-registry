<script setup lang="ts">
import GuardrailsSafetyScanner from '@/components/blocks/guardrails-safety-scanner/GuardrailsSafetyScanner.vue'
</script>

<template>
  <Story
    title="Default"
    description="NVIDIA NeMo Guardrails and LlamaGuard style input/output safety scanner with real-time prompt injection detection, PII redactor, telemetry metrics, and configurable safety policy enforcement table."
  >
    <GuardrailsSafetyScanner />
  </Story>
</template>
