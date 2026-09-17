import Story from '../../components/story/Story'
import { PackingSlipGenerator } from '@react-registry-blocks/packing-slip-generator/PackingSlipGenerator'

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

export default function PackingSlipGeneratorDemo() {
  return (
    <>
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
        <PackingSlipGenerator initialPackedAll={true} />
      </Story>

      <Story
        title="Priority International Air Express"
        description="Cross-border priority air shipment with DHL Express Worldwide, industrial sensor payload, customs documentation notes, and specialized handling instructions."
      >
        <PackingSlipGenerator
          packingSlipNo="#PS-990142"
          orderNo="#ORD-55102"
          carrier="DHL Express"
          carrierService="DHL Express Worldwide (Air)"
          trackingNo="9821 0041 3829"
          customerName="Klaus Becker"
          customerCompany="Becker Automation & Robotics GmbH"
          customerAddress="Friedrichstraße 44, 10117 Berlin, Germany"
          customerPhone="+49 30 8920 144"
          customerEmail="klaus.becker@becker-robotics.de"
          deliveryNotes="Commercial Customs Invoice attached to package exterior. Direct recipient signature required upon delivery."
          pickerName="Samantha Wu"
          pickerId="#EMP-1902"
          packStation="Station #2 (High-Value Export)"
          boxSize='Box #4 Heavy · 18" × 12" × 8"'
          dunnageType="Anti-Static Air Pillows & Desiccant Pack"
          qcInspector="David Chen (#QC-14)"
          qcStamp="QC Passed · Intl Gate #2"
          items={internationalItems}
          initialPackedAll={true}
        />
      </Story>

      <Story
        title="Multi-SKU Outdoor Gear Order"
        description="Fulfillment slip with multiple apparel and gear SKUs showing partial pick progress (3 of 4 line items verified)."
      >
        <PackingSlipGenerator
          packingSlipNo="#PS-610948"
          orderNo="#ORD-77401"
          carrier="UPS"
          carrierService="UPS Ground Commercial"
          trackingNo="1Z 999 999 99 9999 9999"
          customerName="Samantha Reed"
          customerCompany="Pacific Northwest Outdoor Co."
          customerAddress="1208 Pine Street, Seattle, WA 98101"
          customerPhone="+1 (206) 555-0144"
          customerEmail="samantha@pnwoutdoor.com"
          deliveryNotes="Commercial loading dock receiving between 08:00 and 16:00. Call receiver 30 mins prior."
          pickerName="Marcus Vance"
          pickerId="#EMP-4821"
          packStation="Pack Station #4"
          boxSize='Box #5 Master · 24" × 16" × 12"'
          dunnageType="Recycled Kraft Void Fill (2.4 oz)"
          items={multiItems}
        />
      </Story>
    </>
  )
}
