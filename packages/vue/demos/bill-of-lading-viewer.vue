<script setup lang="ts">
import BillOfLadingViewer from '@/components/blocks/bill-of-lading-viewer/BillOfLadingViewer.vue'
</script>

<template>
  <Story
    title="Default"
    description="Standard original negotiable ocean bill of lading with carrier verification, multi-party logistics grid, container cargo manifest, freight terms, and customs compliance inspector."
  >
    <BillOfLadingViewer />
  </Story>

  <Story
    title="Air Waybill / Transatlantic Air Cargo"
    description="Air consignment note variant configured for scheduled air freight with IATA airport routing, expedited carrier details, and custom freight terms."
  >
    <BillOfLadingViewer
      document-title="Air Waybill (Non-Negotiable Consignment Note)"
      bol-number="#AWB-2026-449102"
      carrier-name="Lufthansa Cargo AG"
      scac-code="LH"
      booking-reference="BKG-LH-99201"
      export-reference="EXP-DE-2026-771"
      place-of-issue="Frankfurt, Germany"
      vessel-voyage="Boeing 777-F / Flight LH8401"
      vessel-imo="ICAO DLH"
      vessel-flag="Germany (DE)"
      port-of-loading="Frankfurt Airport (FRA)"
      port-of-discharge="Chicago O'Hare Intl (ORD)"
      place-of-delivery="Chicago Midwest Cargo Hub (ORD)"
      final-destination="Detroit Distribution Center #2"
      declared-value="$89,400.00 USD"
      freight-terms="Prepaid"
    />
  </Story>
</template>
