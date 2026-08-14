<script setup lang="ts">
import { ref } from 'vue'
import { Download, FileSpreadsheet, ShieldCheck } from 'lucide-vue-next'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface VendorPO {
  id: string
  poNumber: string
  issueDate: string
  deliveryDeadline: string
  linesCount: number
  totalAmount: number
  status: 'acknowledged' | 'in_production' | 'shipped' | 'pending_ack'
}

export interface ContractedCatalogItem {
  id: string
  sku: string
  name: string
  moq: number
  contractedPrice: number
  leadTimeDays: number
  validUntil: string
}

export interface VendorPortalProps {
  vendorName?: string
  vendorId?: string
  tier?: string
}

const props = withDefaults(defineProps<VendorPortalProps>(), {
  vendorName: 'Apex Precision Engineering Ltd',
  vendorId: 'VND-2026-9901',
  tier: 'Strategic Tier-1 Supplier',
})

const activeTab = ref<'orders' | 'catalog'>('orders')

const orders = ref<VendorPO[]>([
  {
    id: 'po-1',
    poNumber: 'PO-2026-8840',
    issueDate: '2026-08-18',
    deliveryDeadline: '2026-08-28',
    linesCount: 4,
    totalAmount: 48500,
    status: 'in_production',
  },
  {
    id: 'po-2',
    poNumber: 'PO-2026-8855',
    issueDate: '2026-08-22',
    deliveryDeadline: '2026-09-02',
    linesCount: 2,
    totalAmount: 19200,
    status: 'pending_ack',
  },
  {
    id: 'po-3',
    poNumber: 'PO-2026-8812',
    issueDate: '2026-08-10',
    deliveryDeadline: '2026-08-21',
    linesCount: 6,
    totalAmount: 82400,
    status: 'shipped',
  },
])

const catalog = ref<ContractedCatalogItem[]>([
  {
    id: 'cat-1',
    sku: 'SKU-VALVE-99',
    name: 'High-Pressure Hydraulic Valve 3/8"',
    moq: 50,
    contractedPrice: 185.0,
    leadTimeDays: 7,
    validUntil: '2027-06-30',
  },
  {
    id: 'cat-2',
    sku: 'SKU-SEAL-04',
    name: 'Fluorocarbon O-Ring Flange Kit (Pack of 50)',
    moq: 100,
    contractedPrice: 24.5,
    leadTimeDays: 3,
    validUntil: '2027-06-30',
  },
  {
    id: 'cat-3',
    sku: 'SKU-GAUGE-12',
    name: 'Digital Calibration Pressure Gauge 0-600 PSI',
    moq: 20,
    contractedPrice: 420.0,
    leadTimeDays: 14,
    validUntil: '2027-06-30',
  },
])

function acknowledgePO(id: string) {
  const target = orders.value.find((o) => o.id === id)
  if (target) {
    target.status = 'acknowledged'
  }
}
</script>

<template>
  <div data-slot="vendor-supplier-portal" class="w-full space-y-6">
    <!-- Header / Supplier SLA Scorecard -->
    <Card>
      <CardHeader class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="text-foreground font-mono text-sm font-semibold">{{ vendorId }}</span>
            <Badge variant="outline">{{ tier }}</Badge>
            <Badge variant="secondary" class="gap-1">
              <ShieldCheck class="text-foreground size-3" />
              ISO 9001:2015 Certified
            </Badge>
          </div>
          <CardTitle class="text-xl">{{ vendorName }}</CardTitle>
          <CardDescription> Supplier SLA Performance Scorecard & Active Purchase Order Console </CardDescription>
        </div>

        <div class="flex items-center gap-2">
          <Button variant="outline" size="sm" class="gap-1.5">
            <FileSpreadsheet class="size-3.5" />
            Export Statement
          </Button>
          <Button variant="default" size="sm" class="gap-1.5">
            <Download class="size-3.5" />
            Download MSA Contract
          </Button>
        </div>
      </CardHeader>

      <CardContent class="border-border grid grid-cols-1 gap-4 border-t pt-4 sm:grid-cols-4">
        <!-- On Time Delivery -->
        <div class="border-border space-y-1 rounded-lg border p-3">
          <div class="text-muted-foreground text-xs font-medium">ON-TIME DELIVERY (OTD)</div>
          <div class="flex items-baseline justify-between pt-1">
            <div class="font-mono text-xl font-semibold">98.6%</div>
            <span class="text-muted-foreground font-mono text-xs">Target: 95.0%</span>
          </div>
        </div>

        <!-- QA Acceptance -->
        <div class="border-border space-y-1 rounded-lg border p-3">
          <div class="text-muted-foreground text-xs font-medium">QA ACCEPTANCE RATE</div>
          <div class="flex items-baseline justify-between pt-1">
            <div class="font-mono text-xl font-semibold">99.8%</div>
            <span class="text-muted-foreground font-mono text-xs">&lt; 0.2% NCR</span>
          </div>
        </div>

        <!-- Avg Lead Time -->
        <div class="border-border space-y-1 rounded-lg border p-3">
          <div class="text-muted-foreground text-xs font-medium">AVG FULFILLMENT LEAD TIME</div>
          <div class="pt-1 font-mono text-xl font-semibold">5.4 Days</div>
        </div>

        <!-- Total YTD Volume -->
        <div class="border-border space-y-1 rounded-lg border p-3">
          <div class="text-muted-foreground text-xs font-medium">ACTIVE PURCHASE VOLUME</div>
          <div class="pt-1 font-mono text-xl font-semibold">$150,100 USD</div>
        </div>
      </CardContent>
    </Card>

    <!-- Navigation Tabs & Content Card -->
    <Card>
      <CardHeader class="flex flex-col gap-3 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-2">
          <Button :variant="activeTab === 'orders' ? 'default' : 'outline'" size="sm" @click="activeTab = 'orders'">
            Active Purchase Orders ({{ orders.length }})
          </Button>
          <Button :variant="activeTab === 'catalog' ? 'default' : 'outline'" size="sm" @click="activeTab = 'catalog'">
            Contracted Catalog Prices ({{ catalog.length }})
          </Button>
        </div>

        <div class="text-muted-foreground text-xs">
          Payment Terms: <span class="text-foreground font-medium">Net-45 Direct ACH Wire</span>
        </div>
      </CardHeader>

      <CardContent class="p-0">
        <!-- Table for Orders -->
        <Table v-if="activeTab === 'orders'">
          <TableHeader>
            <TableRow>
              <TableHead class="w-[180px]">PO Reference</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Delivery Deadline</TableHead>
              <TableHead class="text-right">Line Items</TableHead>
              <TableHead class="text-right">Total Order Value</TableHead>
              <TableHead>Fulfillment Status</TableHead>
              <TableHead class="w-[140px] text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="order in orders" :key="order.id">
              <TableCell>
                <div class="text-foreground font-mono font-semibold">{{ order.poNumber }}</div>
              </TableCell>

              <TableCell class="text-muted-foreground font-mono text-xs">
                {{ order.issueDate }}
              </TableCell>

              <TableCell class="text-foreground font-mono text-xs font-medium">
                {{ order.deliveryDeadline }}
              </TableCell>

              <TableCell class="text-right font-mono text-sm"> {{ order.linesCount }} SKUs </TableCell>

              <TableCell class="text-foreground text-right font-mono text-sm font-semibold">
                ${{ order.totalAmount.toLocaleString() }} USD
              </TableCell>

              <TableCell>
                <Badge
                  :variant="
                    order.status === 'shipped'
                      ? 'default'
                      : order.status === 'in_production'
                        ? 'secondary'
                        : order.status === 'acknowledged'
                          ? 'outline'
                          : 'outline'
                  "
                  class="capitalize"
                >
                  {{ order.status.replace('_', ' ') }}
                </Badge>
              </TableCell>

              <TableCell class="text-right">
                <Button
                  v-if="order.status === 'pending_ack'"
                  size="sm"
                  variant="default"
                  class="h-7 text-xs"
                  @click="acknowledgePO(order.id)"
                >
                  Acknowledge PO
                </Button>
                <span v-else class="text-muted-foreground text-xs"> Processed </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <!-- Table for Catalog Items -->
        <Table v-else>
          <TableHeader>
            <TableRow>
              <TableHead class="w-[280px]">Product / Description</TableHead>
              <TableHead>SKU Reference</TableHead>
              <TableHead class="text-right">Min Order Qty (MOQ)</TableHead>
              <TableHead class="text-right">Contracted Unit Price</TableHead>
              <TableHead class="text-right">Standard Lead Time</TableHead>
              <TableHead>Contract Validity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="item in catalog" :key="item.id">
              <TableCell>
                <div class="text-foreground font-medium">{{ item.name }}</div>
              </TableCell>

              <TableCell>
                <span class="font-mono text-xs font-semibold">{{ item.sku }}</span>
              </TableCell>

              <TableCell class="text-right font-mono text-sm"> {{ item.moq }} units </TableCell>

              <TableCell class="text-foreground text-right font-mono text-sm font-semibold">
                ${{ item.contractedPrice.toFixed(2) }}
              </TableCell>

              <TableCell class="text-muted-foreground text-right font-mono text-sm">
                {{ item.leadTimeDays }} Days
              </TableCell>

              <TableCell>
                <span class="text-muted-foreground font-mono text-xs">Valid to {{ item.validUntil }}</span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>

      <CardFooter class="border-border text-muted-foreground flex items-center justify-between border-t py-3 text-xs">
        <div>Supplier contract SLA terms audited quarterly per ISO 9001 compliance standards.</div>
        <div class="text-foreground font-medium">
          Vendor Status: <span class="text-foreground">Active & In Good Standing</span>
        </div>
      </CardFooter>
    </Card>
  </div>
</template>
