<script setup lang="ts">
import DataMeshDomainCatalog from '@/components/blocks/data-mesh-domain-catalog/DataMeshDomainCatalog.vue'
</script>

<template>
  <Story
    title="Default"
    description="Zhamak Dehghani Data Mesh architecture domain catalog, Data Products directory, polyglot output ports (Snowflake, Kafka, GraphQL, S3), and federated computational governance SLA scorecards."
  >
    <DataMeshDomainCatalog />
  </Story>

  <Story
    title="Filtered to Checkout & Payments Domain"
    description="Domain view focused on Checkout & Payments with real-time Kafka order authorization streams and GAAP subscription MRR ledgers."
  >
    <DataMeshDomainCatalog
      initial-domain-filter="checkout-payments"
      initial-selected-product-id="dp_realtime_order_stream"
    />
  </Story>

  <Story
    title="Logistics & Supply Chain Telematics Quantum"
    description="Deep architectural inspection of the Logistics & Supply Chain domain carrier delivery telematics and multi-warehouse inventory snapshots."
  >
    <DataMeshDomainCatalog
      initial-domain-filter="logistics-supply-chain"
      initial-selected-product-id="dp_carrier_delivery_performance"
    />
  </Story>
</template>
