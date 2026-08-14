<script setup lang="ts">
import DataContractGovernance from '@/components/blocks/data-contract-governance/DataContractGovernance.vue'
</script>

<template>
  <Story
    title="Default"
    description="PayPal and OpenDataContract style Data Contracts specification editor, breaking change validator, and producer/consumer SLA agreements dashboard with YAML inspector, schema field explorer, live breaking change linter, and registered consumer status."
  >
    <DataContractGovernance />
  </Story>

  <Story
    title="Custom Domain Contract"
    description="Payments authorization stream data contract with custom producer service, Kafka destination topic, and Iceberg lakehouse target."
  >
    <DataContractGovernance
      contract-title="payment_transactions_v2.contract.yaml"
      version="v2.4.1"
      owner-team="Payments Core Platform SRE"
      producer-service="payments-gateway-prod"
      destination-topic="events.payments.authorized"
      lakehouse-target="s3://lakehouse-analytics/tables/payments/authorized_v2"
    />
  </Story>
</template>
