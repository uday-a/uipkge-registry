<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowRight, Barcode, CheckCircle2, Plus, QrCode, Trash2, Truck, Warehouse } from 'lucide-vue-next'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface TransferItem {
  id: string
  sku: string
  name: string
  barcode: string
  lotNumber: string
  sourceBin: string
  targetBin: string
  availableQty: number
  transferQty: number
  unit: string
  condition: 'sellable' | 'quarantine' | 'damaged'
}

export interface StockTransferProps {
  transferId?: string
  initialStatus?: 'draft' | 'staged' | 'in_transit' | 'received'
}

const props = withDefaults(defineProps<StockTransferProps>(), {
  transferId: 'TRF-2026-8841',
  initialStatus: 'staged',
})

const status = ref(props.initialStatus)
const sourceWarehouse = ref('wh-east-01')
const targetWarehouse = ref('wh-central-02')
const transportType = ref('pallet_freight')
const barcodeQuery = ref('')

const items = ref<TransferItem[]>([
  {
    id: 'itm-1',
    sku: 'SKU-LOGI-884',
    name: 'Industrial Barcode Scanner IP65',
    barcode: '079357318921',
    lotNumber: 'LOT-2026-A1',
    sourceBin: 'A-04-R2-B12',
    targetBin: 'C-01-R1-B03',
    availableQty: 140,
    transferQty: 25,
    unit: 'pcs',
    condition: 'sellable',
  },
  {
    id: 'itm-2',
    sku: 'SKU-PWR-331',
    name: 'Lithium Iron Battery Pack 48V',
    barcode: '079357318945',
    lotNumber: 'LOT-2025-X9',
    sourceBin: 'B-12-R4-B01',
    targetBin: 'D-08-R2-B09',
    availableQty: 48,
    transferQty: 12,
    unit: 'units',
    condition: 'sellable',
  },
  {
    id: 'itm-3',
    sku: 'SKU-SENS-102',
    name: 'Optical Proximity Sensor M18',
    barcode: '079357318988',
    lotNumber: 'LOT-2026-C4',
    sourceBin: 'A-02-R1-B06',
    targetBin: 'A-09-R3-B02',
    availableQty: 320,
    transferQty: 80,
    unit: 'pcs',
    condition: 'sellable',
  },
])

const totalUnits = computed(() => items.value.reduce((sum, item) => sum + Number(item.transferQty || 0), 0))
const totalLineItems = computed(() => items.value.length)

function addItem() {
  items.value.push({
    id: `itm-${Date.now()}`,
    sku: 'SKU-GEN-001',
    name: 'Standard Packing Material Kit',
    barcode: '079357399999',
    lotNumber: 'LOT-UNASSIGNED',
    sourceBin: 'A-01-R1-B01',
    targetBin: 'B-01-R1-B01',
    availableQty: 100,
    transferQty: 10,
    unit: 'kits',
    condition: 'sellable',
  })
}

function removeItem(id: string) {
  items.value = items.value.filter((i) => i.id !== id)
}

function handleScan() {
  if (!barcodeQuery.value) return
  const found = items.value.find((i) => i.barcode === barcodeQuery.value || i.sku === barcodeQuery.value)
  if (found) {
    found.transferQty += 1
  }
  barcodeQuery.value = ''
}
</script>

<template>
  <div data-slot="stock-transfer-manager" class="w-full space-y-6">
    <!-- Header Summary Card -->
    <Card>
      <CardHeader class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="text-muted-foreground font-mono text-sm font-medium">{{ transferId }}</span>
            <Badge
              :variant="
                status === 'received'
                  ? 'default'
                  : status === 'in_transit'
                    ? 'secondary'
                    : status === 'staged'
                      ? 'outline'
                      : 'outline'
              "
              class="capitalize"
            >
              {{ status.replace('_', ' ') }}
            </Badge>
          </div>
          <CardTitle class="text-xl">Inter-Warehouse Stock Transfer</CardTitle>
          <CardDescription>
            Transfer goods between fulfillment hubs with bin-level tracking and scan verification.
          </CardDescription>
        </div>
        <div class="flex items-center gap-2">
          <Button v-if="status === 'staged'" variant="default" class="gap-2" @click="status = 'in_transit'">
            <Truck class="size-4" />
            Dispatch Transfer
          </Button>
          <Button v-else-if="status === 'in_transit'" variant="default" class="gap-2" @click="status = 'received'">
            <CheckCircle2 class="size-4" />
            Confirm Receipt
          </Button>
          <Button v-else-if="status === 'received'" variant="outline" class="gap-2" @click="status = 'staged'">
            Reset Transfer
          </Button>
        </div>
      </CardHeader>

      <CardContent class="border-border grid grid-cols-1 gap-4 border-t pt-4 sm:grid-cols-3">
        <!-- Source Hub -->
        <div class="border-border space-y-2 rounded-lg border p-3">
          <div class="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
            <Warehouse class="size-3.5" />
            <span>ORIGIN FACILITY</span>
          </div>
          <Select v-model="sourceWarehouse" :disabled="status !== 'draft' && status !== 'staged'">
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Select origin warehouse" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wh-east-01">East Coast Fulfillment (NJ-01)</SelectItem>
              <SelectItem value="wh-west-02">West Coast Distribution (CA-04)</SelectItem>
              <SelectItem value="wh-midwest-03">Midwest Logistics Hub (IL-02)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Destination Hub -->
        <div class="border-border space-y-2 rounded-lg border p-3">
          <div class="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
            <ArrowRight class="size-3.5" />
            <span>DESTINATION FACILITY</span>
          </div>
          <Select v-model="targetWarehouse" :disabled="status !== 'draft' && status !== 'staged'">
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Select target warehouse" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wh-central-02">Central Distribution Center (TX-01)</SelectItem>
              <SelectItem value="wh-north-01">Northern Sorting Facility (WA-02)</SelectItem>
              <SelectItem value="wh-south-03">Southeast Regional Hub (GA-03)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Carrier / Transport -->
        <div class="border-border space-y-2 rounded-lg border p-3">
          <div class="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
            <Truck class="size-3.5" />
            <span>SHIPPING METHOD</span>
          </div>
          <Select v-model="transportType" :disabled="status !== 'draft' && status !== 'staged'">
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Select transit mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pallet_freight">Dedicated LTL Freight (Palletized)</SelectItem>
              <SelectItem value="express_courier">Priority Courier (Same Day Air)</SelectItem>
              <SelectItem value="internal_fleet">Internal Fleet Transfer (Route 09)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>

    <!-- Line Items Table Card -->
    <Card>
      <CardHeader class="flex flex-col gap-3 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle class="text-base font-semibold">Manifest Line Items</CardTitle>
          <CardDescription>
            {{ totalLineItems }} unique SKUs · {{ totalUnits }} total units staged for transfer
          </CardDescription>
        </div>

        <!-- Quick Scan / SKU lookup bar -->
        <div class="flex items-center gap-2">
          <div class="relative w-64">
            <Barcode class="text-muted-foreground pointer-events-none absolute top-2.5 left-2.5 size-4" />
            <Input
              v-model="barcodeQuery"
              placeholder="Scan barcode or SKU..."
              class="pl-8"
              @keydown.enter.prevent="handleScan"
            />
          </div>
          <Button variant="secondary" size="icon" title="Scan Barcode" @click="handleScan">
            <QrCode class="size-4" />
          </Button>
          <Button variant="outline" size="sm" class="gap-1" @click="addItem">
            <Plus class="size-3.5" />
            Add Item
          </Button>
        </div>
      </CardHeader>

      <CardContent class="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="w-[280px]">Product / SKU</TableHead>
              <TableHead>Lot / Batch</TableHead>
              <TableHead>Source Bin</TableHead>
              <TableHead>Target Bin</TableHead>
              <TableHead class="text-right">Available</TableHead>
              <TableHead class="w-[120px] text-right">Transfer Qty</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead class="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="item in items" :key="item.id">
              <!-- SKU + Name -->
              <TableCell>
                <div class="font-medium">{{ item.name }}</div>
                <div class="text-muted-foreground flex items-center gap-2 font-mono text-xs">
                  <span>{{ item.sku }}</span>
                  <span>·</span>
                  <span>{{ item.barcode }}</span>
                </div>
              </TableCell>

              <!-- Lot Number -->
              <TableCell>
                <span class="font-mono text-xs">{{ item.lotNumber }}</span>
              </TableCell>

              <!-- Source Bin -->
              <TableCell>
                <span class="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs font-medium">
                  {{ item.sourceBin }}
                </span>
              </TableCell>

              <!-- Target Bin -->
              <TableCell>
                <span class="border-border text-foreground rounded border px-1.5 py-0.5 font-mono text-xs font-medium">
                  {{ item.targetBin }}
                </span>
              </TableCell>

              <!-- Available Qty -->
              <TableCell class="text-muted-foreground text-right font-mono text-xs">
                {{ item.availableQty }} {{ item.unit }}
              </TableCell>

              <!-- Transfer Qty Input -->
              <TableCell class="text-right">
                <Input
                  v-model.number="item.transferQty"
                  type="number"
                  min="1"
                  :max="item.availableQty"
                  class="h-8 text-right font-mono"
                  :disabled="status === 'received'"
                />
              </TableCell>

              <!-- Condition -->
              <TableCell>
                <Select v-model="item.condition" :disabled="status === 'received'">
                  <SelectTrigger class="h-8 w-[110px] text-xs capitalize">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sellable">Sellable</SelectItem>
                    <SelectItem value="quarantine">Quarantine</SelectItem>
                    <SelectItem value="damaged">Damaged</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>

              <!-- Remove Action -->
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  class="text-muted-foreground hover:text-destructive size-8"
                  :disabled="status === 'received'"
                  @click="removeItem(item.id)"
                >
                  <Trash2 class="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>

      <CardFooter class="border-border text-muted-foreground flex items-center justify-between border-t py-3 text-xs">
        <div>All inventory movements are recorded in immutable ledger log #LOG-9402.</div>
        <div class="text-foreground font-medium">
          Total: <span class="font-mono">{{ totalUnits }}</span> items across
          <span class="font-mono">{{ totalLineItems }}</span> positions
        </div>
      </CardFooter>
    </Card>
  </div>
</template>
