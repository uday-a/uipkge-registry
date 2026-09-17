<script setup lang="ts">
import PackingSlipGenerator from '@/components/blocks/packing-slip-generator/PackingSlipGenerator.vue'

const internationalItems = [
  {
    id: 'intl-1',
    sku: '#SKU-99041',
    barcode: '990418491028',
    name: 'Precision Calibration Laser Sensor Unit',
    variant: 'Industrial Grade · Model C4',
    location: 'Aisle 01 · High-Value Vault · Shelf 01',
    qtyOrdered: 1,
    qtyPacked: 1,
    weightLbs: 2.4,
    notes: 'Static Sensitive / Padded ESD Packaging',
    initialPacked: true,
  },
  {
    id: 'intl-2',
    sku: '#SKU-66291',
    barcode: '662910492817',
    name: 'Shielded Optic Fiber Interface Cable (5m)',
    variant: 'Dual LC to LC · Armored',
    location: 'Aisle 03 · Rack E · Shelf 03',
    qtyOrdered: 2,
    qtyPacked: 2,
    weightLbs: 0.8,
    notes: 'Hermetically sealed',
    initialPacked: true,
  },
  {
    id: 'intl-3',
    sku: '#SKU-44019',
    barcode: '440192841029',
    name: 'Reinforced Aluminum Mounting Bracket Kit',
    variant: 'Anodized Gunmetal · 12-Piece Set',
    location: 'Aisle 06 · Rack C · Shelf 02',
    qtyOrdered: 1,
    qtyPacked: 1,
    weightLbs: 3.1,
    notes: 'Includes torque fasteners & hex tool',
    initialPacked: true,
  },
]

const multiItems = [
  {
    id: 'gear-1',
    sku: '#SKU-55102',
    barcode: '551029481023',
    name: 'Summit Series 45L Alpine Backpack',
    variant: 'Obsidian Black / Solar Flare · M/L',
    location: 'Aisle 05 · Rack A · Shelf 01',
    qtyOrdered: 1,
    qtyPacked: 1,
    weightLbs: 3.2,
    notes: 'Includes integrated rainfly cover in top pocket',
    initialPacked: true,
  },
  {
    id: 'gear-2',
    sku: '#SKU-38291',
    barcode: '382910491823',
    name: 'Ultralight Carbon Trekking Poles (Pair)',
    variant: 'Quick-Lock · Matte Slate',
    location: 'Aisle 05 · Rack C · Shelf 04',
    qtyOrdered: 2,
    qtyPacked: 2,
    weightLbs: 1.1,
    notes: 'Includes carbide tips & rubber mud baskets',
    initialPacked: true,
  },
  {
    id: 'gear-3',
    sku: '#SKU-81920',
    barcode: '819203918204',
    name: 'Insulated Titanium Camping Mug (450ml)',
    variant: 'Double-Wall · Brushed Finish',
    location: 'Aisle 09 · Rack B · Shelf 02',
    qtyOrdered: 2,
    qtyPacked: 1,
    weightLbs: 0.6,
    notes: 'Mesh storage pouch included',
    initialPacked: false,
  },
  {
    id: 'gear-4',
    sku: '#SKU-19482',
    barcode: '194820391845',
    name: 'High-Lumen Rechargeable Headlamp (800lm)',
    variant: 'IPX8 Waterproof · USB-C Charging',
    location: 'Aisle 02 · Rack A · Shelf 03',
    qtyOrdered: 1,
    qtyPacked: 0,
    weightLbs: 0.4,
    notes: 'Lithium battery pre-installed (UN3481 compliant)',
    initialPacked: false,
  },
]
</script>

<template>
  <Story
    title="Default"
    description="Standard warehouse packing slip with reference #PS-849201, order #ORD-92841, FedEx 2-Day Air, interactive itemized pick checklist, carton packaging specs, and certified QC Inspector stamp."
  >
    <PackingSlipGenerator />
  </Story>

  <Story
    title="All Items Verified & Ready for Dispatch"
    description="Fully packed and audited packing slip ready for carton sealing, shipping label generation, and carrier pickup."
  >
    <PackingSlipGenerator :initial-packed-all="true" />
  </Story>

  <Story
    title="Priority International Air Express"
    description="Cross-border priority air shipment with DHL Express Worldwide, industrial sensor payload, customs documentation notes, and specialized handling instructions."
  >
    <PackingSlipGenerator
      packing-slip-no="#PS-990142"
      order-no="#ORD-55102"
      carrier="DHL Express"
      carrier-service="DHL Express Worldwide (Air)"
      tracking-no="9821 0041 3829"
      customer-name="Klaus Becker"
      customer-company="Becker Automation & Robotics GmbH"
      customer-address="Friedrichstraße 44, 10117 Berlin, Germany"
      customer-phone="+49 30 8920 144"
      customer-email="klaus.becker@becker-robotics.de"
      delivery-notes="Commercial Customs Invoice attached to package exterior. Direct recipient signature required upon delivery."
      picker-name="Samantha Wu"
      picker-id="#EMP-1902"
      pack-station="Station #2 (High-Value Export)"
      box-size='Box #4 Heavy · 18" × 12" × 8"'
      dunnage-type="Anti-Static Air Pillows & Desiccant Pack"
      qc-inspector="David Chen (#QC-14)"
      qc-stamp="QC Passed · Intl Gate #2"
      :items="internationalItems"
      :initial-packed-all="true"
    />
  </Story>

  <Story
    title="Multi-SKU Outdoor Gear Order"
    description="Fulfillment slip with multiple apparel and gear SKUs showing partial pick progress (3 of 4 line items verified)."
  >
    <PackingSlipGenerator
      packing-slip-no="#PS-610948"
      order-no="#ORD-77401"
      carrier="UPS"
      carrier-service="UPS Ground Commercial"
      tracking-no="1Z 999 999 99 9999 9999"
      customer-name="Samantha Reed"
      customer-company="Pacific Northwest Outdoor Co."
      customer-address="1208 Pine Street, Seattle, WA 98101"
      customer-phone="+1 (206) 555-0144"
      customer-email="samantha@pnwoutdoor.com"
      delivery-notes="Commercial loading dock receiving between 08:00 and 16:00. Call receiver 30 mins prior."
      picker-name="Marcus Vance"
      picker-id="#EMP-4821"
      pack-station="Pack Station #4"
      box-size='Box #5 Master · 24" × 16" × 12"'
      dunnage-type="Recycled Kraft Void Fill (2.4 oz)"
      :items="multiItems"
    />
  </Story>
</template>
