<script setup lang="ts">
import ReturnMerchandiseInspection from '@/components/blocks/return-merchandise-inspection/ReturnMerchandiseInspection.vue'
</script>

<template>
  <Story
    title="Default (Grade A Restock)"
    description="Standard intake inspection station with item UPC verification, Grade A condition rating, and primary inventory putaway routing."
  >
    <ReturnMerchandiseInspection />
  </Story>

  <Story
    title="Grade B (Outlet Store Re-routing)"
    description="Open box item evaluated for secondary outlet store sales channel with standard priority putaway."
  >
    <ReturnMerchandiseInspection initial-grade="grade-b" />
  </Story>

  <Story
    title="Grade D (Quarantine & Vendor RTV)"
    description="Damaged merchandise intake triggering quarantine hold, RTV vendor credit claim, and defect documentation."
  >
    <ReturnMerchandiseInspection initial-grade="grade-d" initial-refund-action="full-refund" />
  </Story>

  <Story
    title="Store Credit Incentive (+10% Bonus)"
    description="Customer return settlement configured for instant store credit digital gift card with +10% loyalty bonus value."
  >
    <ReturnMerchandiseInspection initial-grade="grade-a" initial-refund-action="store-credit" />
  </Story>

  <Story
    title="Completed Disposition Receipt"
    description="Post-inspection confirmation screen with generated Pallet/Tote LPN barcode label and printable warehouse manifest."
  >
    <ReturnMerchandiseInspection :initial-submitted="true" />
  </Story>
</template>
