<script setup lang="ts">
import PropertyAmenitiesGrid from '@/components/blocks/property-amenities-grid/PropertyAmenitiesGrid.vue'
</script>

<template>
  <Story
    title="Default"
    description="Full community and luxury building amenities grid with interactive category filtering, live keyword search, and rich feature cards."
  >
    <PropertyAmenitiesGrid />
  </Story>

  <Story
    title="Custom Copy"
    description="Customized title, subtitle, and eyebrow badge tailored to luxury hospitality or boutique residences."
  >
    <PropertyAmenitiesGrid
      badge="Resort Privileges"
      title="Exclusive Resident Sanctuaries"
      subtitle="Experience an elevated lifestyle curated for health, high performance, and uncompromised ease."
    />
  </Story>
</template>
