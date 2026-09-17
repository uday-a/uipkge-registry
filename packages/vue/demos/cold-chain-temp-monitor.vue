<script setup lang="ts">
import ColdChainTempMonitor from '@/components/blocks/cold-chain-temp-monitor/ColdChainTempMonitor.vue'
</script>

<template>
  <Story
    title="Ultra-Cold Vaccine Consignment"
    description="Refrigerated pharmaceutical IoT temperature logger and excursion monitoring dashboard with live thermal gradient curves, multi-probe telemetry logs, and critical excursion alert protocol."
  >
    <ColdChainTempMonitor />
  </Story>

  <Story
    title="Deep Cryogenic mRNA Consignment"
    description="Deep freeze clinical shipment with -70°C dry ice thermal hold and extreme ambient differential monitoring."
  >
    <ColdChainTempMonitor
      shipment-id="#CC-8810"
      shipment-title="mRNA Therapeutics Cryo-Consignment #CC-8810"
      temp-class="Deep Cryo-Freeze · Target: -70°C ± 5°C"
      beacon-id="CryoTag #CT-9011 · BLE 5.3 + Iridium Sat"
      :current-internal-temp="-72.4"
      :current-ambient-temp="26.5"
      :current-humidity="12"
      :battery-percent="98"
      :battery-days="240"
    />
  </Story>
</template>
