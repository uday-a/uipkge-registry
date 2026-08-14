<script setup lang="ts">
import { ref } from 'vue'
import { ArrowRightLeft, CheckCircle2, Clock, Send, Split, Truck } from 'lucide-vue-next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface ShipmentItem {
  id: string
  sku: string
  name: string
  qty: number
  unitPrice: number
  originHub: string
  status: 'ready' | 'backordered' | 'dispatched'
  restockEta?: string
}

export interface SplitPackage {
  packageId: string
  carrier: string
  trackingNumber?: string
  status: 'ready_to_ship' | 'awaiting_inventory' | 'dispatched'
  items: ShipmentItem[]
}

export interface BackorderSplitShipmentProps {
  orderId?: string
  customerName?: string
  customerTier?: string
}

const props = withDefaults(defineProps<BackorderSplitShipmentProps>(), {
  orderId: 'ORD-SPLIT-9921',
  customerName: 'Aero Dynamics Corp',
  customerTier: 'Enterprise VIP · Net-30',
})

const packages = ref<SplitPackage[]>([
  {
    packageId: 'PKG-A (In Stock · WH-East)',
    carrier: 'FedEx Priority Overnight',
    trackingNumber: 'FX-8891-4401-US',
    status: 'ready_to_ship',
    items: [
      {
        id: 'pkg-1-1',
        sku: 'SKU-SERVO-01',
        name: 'Precision Micro Servo Motor 12V',
        qty: 4,
        unitPrice: 125,
        originHub: 'wh-east-01',
        status: 'ready',
      },
      {
        id: 'pkg-1-2',
        sku: 'SKU-FLANGE-99',
        name: 'Anodized Billet Flange Mount 45mm',
        qty: 2,
        unitPrice: 65,
        originHub: 'wh-east-01',
        status: 'ready',
      },
    ],
  },
  {
    packageId: 'PKG-B (Backordered · Sourcing WH-West)',
    carrier: 'UPS Standard Ground',
    status: 'awaiting_inventory',
    items: [
      {
        id: 'pkg-2-1',
        sku: 'SKU-CTRL-BOARD',
        name: 'Industrial Embedded Controller Rev 3.2',
        qty: 1,
        unitPrice: 420,
        originHub: 'wh-west-02',
        status: 'backordered',
        restockEta: 'Inbound PO arrives in 2 business days',
      },
    ],
  },
])

function dispatchPackage(pkgId: string) {
  const pkg = packages.value.find((p) => p.packageId === pkgId)
  if (pkg) {
    pkg.status = 'dispatched'
    pkg.items.forEach((i) => (i.status = 'dispatched'))
  }
}
</script>

<template>
  <div data-slot="backorder-split-shipment-manager" class="w-full space-y-6">
    <!-- Header Summary Card -->
    <Card>
      <CardHeader class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="text-foreground font-mono text-sm font-semibold">{{ orderId }}</span>
            <Badge variant="outline">{{ customerTier }}</Badge>
            <Badge variant="secondary" class="gap-1">
              <Split class="text-foreground size-3" />
              Split Fulfillment (2 Shipments)
            </Badge>
          </div>
          <CardTitle class="text-xl">Split Shipment & Backorder Triage</CardTitle>
          <CardDescription>
            Account: <strong class="text-foreground font-medium">{{ customerName }}</strong> · Multi-Node Routing
          </CardDescription>
        </div>

        <div class="flex items-center gap-2">
          <Button variant="outline" size="sm" class="gap-1.5">
            <Clock class="size-3.5" />
            Hold Entire Order
          </Button>
          <Button variant="default" size="sm" class="gap-1.5">
            <Send class="size-3.5" />
            Release Ready Packages
          </Button>
        </div>
      </CardHeader>

      <CardContent class="border-border grid grid-cols-1 gap-4 border-t pt-4 sm:grid-cols-3">
        <!-- Fulfillment Policy -->
        <div class="border-border space-y-1 rounded-lg border p-3">
          <div class="text-muted-foreground text-xs font-medium">FULFILLMENT RULE</div>
          <div class="text-foreground text-sm font-semibold">Partial Dispatch Allowed (Speed Priority)</div>
          <div class="text-muted-foreground text-xs">Ship available items immediately without backorder delay.</div>
        </div>

        <!-- In-Stock Value -->
        <div class="border-border space-y-1 rounded-lg border p-3">
          <div class="text-muted-foreground text-xs font-medium">READY SHIPMENT VALUE</div>
          <div class="text-foreground font-mono text-xl font-semibold">$630.00 USD</div>
          <div class="text-muted-foreground text-xs">6 units allocated from East Coast Hub.</div>
        </div>

        <!-- Backordered Value -->
        <div class="border-border space-y-1 rounded-lg border p-3">
          <div class="text-muted-foreground text-xs font-medium">BACKORDERED VALUE</div>
          <div class="text-foreground font-mono text-xl font-semibold">$420.00 USD</div>
          <div class="text-muted-foreground text-xs">1 unit waiting on PO-2026-881 inbound dock.</div>
        </div>
      </CardContent>
    </Card>

    <!-- Split Packages Breakdown -->
    <div class="space-y-4">
      <Card v-for="pkg in packages" :key="pkg.packageId">
        <CardHeader class="flex flex-col gap-3 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="text-foreground font-semibold">{{ pkg.packageId }}</span>
              <Badge
                :variant="
                  pkg.status === 'dispatched' ? 'default' : pkg.status === 'ready_to_ship' ? 'secondary' : 'outline'
                "
                class="capitalize"
              >
                {{ pkg.status.replace(/_/g, ' ') }}
              </Badge>
            </div>
            <div class="text-muted-foreground font-mono text-xs">
              Carrier: {{ pkg.carrier }}
              <span v-if="pkg.trackingNumber">· Tracking: {{ pkg.trackingNumber }}</span>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <Button
              v-if="pkg.status === 'ready_to_ship'"
              size="sm"
              variant="default"
              class="gap-1.5"
              @click="dispatchPackage(pkg.packageId)"
            >
              <Truck class="size-3.5" />
              Dispatch Package Now
            </Button>
            <Button v-else-if="pkg.status === 'awaiting_inventory'" size="sm" variant="outline" class="gap-1.5">
              <ArrowRightLeft class="size-3.5" />
              Re-route to 3PL
            </Button>
            <Badge v-else variant="outline" class="text-xs">Dispatched</Badge>
          </div>
        </CardHeader>

        <CardContent class="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead class="w-[300px]">SKU & Description</TableHead>
                <TableHead>Fulfillment Origin</TableHead>
                <TableHead class="text-right">Qty</TableHead>
                <TableHead class="text-right">Unit Price</TableHead>
                <TableHead class="text-right">Line Total</TableHead>
                <TableHead>Inventory Status / ETA</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="item in pkg.items" :key="item.id">
                <TableCell>
                  <div class="text-foreground font-medium">{{ item.name }}</div>
                  <div class="text-muted-foreground font-mono text-xs">{{ item.sku }}</div>
                </TableCell>

                <TableCell>
                  <span class="bg-muted text-foreground rounded px-2 py-0.5 font-mono text-xs font-medium">
                    {{ item.originHub }}
                  </span>
                </TableCell>

                <TableCell class="text-right font-mono text-sm">
                  {{ item.qty }}
                </TableCell>

                <TableCell class="text-muted-foreground text-right font-mono text-sm">
                  ${{ item.unitPrice.toFixed(2) }}
                </TableCell>

                <TableCell class="text-right font-mono text-sm font-medium">
                  ${{ (item.qty * item.unitPrice).toFixed(2) }}
                </TableCell>

                <TableCell>
                  <div v-if="item.status === 'ready'" class="text-foreground flex items-center gap-1.5 text-xs">
                    <CheckCircle2 class="size-3.5" />
                    <span>Allocated & Packed</span>
                  </div>
                  <div
                    v-else-if="item.status === 'dispatched'"
                    class="text-foreground flex items-center gap-1.5 text-xs"
                  >
                    <Truck class="size-3.5" />
                    <span>In Transit</span>
                  </div>
                  <div v-else class="text-muted-foreground flex items-center gap-1.5 text-xs">
                    <Clock class="size-3.5" />
                    <span>{{ item.restockEta }}</span>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
