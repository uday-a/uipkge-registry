<script setup lang="ts">
import { ref, computed } from 'vue'
import { AlertTriangle, Clock, PackageCheck, Printer, ShieldCheck, Warehouse } from 'lucide-vue-next'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface POLineItem {
  id: string
  sku: string
  title: string
  orderedQty: number
  receivedQty: number
  rejectedQty: number
  rejectionReason: 'none' | 'damaged_packaging' | 'expired_lot' | 'wrong_specification' | 'temperature_excursion'
  lotNumber: string
  expiryDate: string
  stagingLocation: string
}

export interface PurchaseOrderReceivingProps {
  poNumber?: string
  vendorName?: string
  deliveryDocket?: string
}

const props = withDefaults(defineProps<PurchaseOrderReceivingProps>(), {
  poNumber: 'PO-2026-4409',
  vendorName: 'Apex Precision Engineering Ltd',
  deliveryDocket: 'BOL-APX-98214',
})

const isCompleted = ref(false)
const receivingDock = ref('dock-03')
const inspectionStatus = ref<'pending' | 'passed' | 'discrepancy'>('pending')

const lines = ref<POLineItem[]>([
  {
    id: 'po-1',
    sku: 'SKU-VALVE-99',
    title: 'High-Pressure Hydraulic Valve 3/8"',
    orderedQty: 100,
    receivedQty: 100,
    rejectedQty: 0,
    rejectionReason: 'none',
    lotNumber: 'LOT-HYD-998',
    expiryDate: '2029-12-31',
    stagingLocation: 'ZONE-A-RACK-04',
  },
  {
    id: 'po-2',
    sku: 'SKU-SEAL-04',
    title: 'Fluorocarbon O-Ring Flange Kit (Pack of 50)',
    orderedQty: 250,
    receivedQty: 245,
    rejectedQty: 5,
    rejectionReason: 'damaged_packaging',
    lotNumber: 'LOT-O-7712',
    expiryDate: '2028-06-30',
    stagingLocation: 'ZONE-A-RACK-01',
  },
  {
    id: 'po-3',
    sku: 'SKU-GAUGE-12',
    title: 'Digital Calibration Pressure Gauge 0-600 PSI',
    orderedQty: 40,
    receivedQty: 40,
    rejectedQty: 0,
    rejectionReason: 'none',
    lotNumber: 'LOT-CAL-002',
    expiryDate: '2031-01-15',
    stagingLocation: 'ZONE-B-RACK-09',
  },
])

const totalOrdered = computed(() => lines.value.reduce((acc, item) => acc + item.orderedQty, 0))
const totalAccepted = computed(() => lines.value.reduce((acc, item) => acc + item.receivedQty, 0))
const totalRejected = computed(() => lines.value.reduce((acc, item) => acc + item.rejectedQty, 0))

function finalizeReceipt() {
  if (totalRejected.value > 0 || totalAccepted.value < totalOrdered.value) {
    inspectionStatus.value = 'discrepancy'
  } else {
    inspectionStatus.value = 'passed'
  }
  isCompleted.value = true
}

function resetReceipt() {
  isCompleted.value = false
  inspectionStatus.value = 'pending'
}
</script>

<template>
  <div data-slot="purchase-order-receiving" class="w-full space-y-6">
    <!-- Top PO Header Info -->
    <Card>
      <CardHeader class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="text-foreground font-mono text-sm font-semibold">{{ poNumber }}</span>
            <Badge variant="outline" class="font-mono text-xs">
              {{ deliveryDocket }}
            </Badge>
            <Badge
              :variant="
                inspectionStatus === 'passed'
                  ? 'default'
                  : inspectionStatus === 'discrepancy'
                    ? 'destructive'
                    : 'secondary'
              "
              class="capitalize"
            >
              {{ isCompleted ? `GRN ${inspectionStatus}` : 'Receiving in Progress' }}
            </Badge>
          </div>
          <CardTitle class="text-xl">Inbound Goods Receipt & QA Inspection</CardTitle>
          <CardDescription>
            Supplier: <strong class="text-foreground font-medium">{{ vendorName }}</strong> · Inbound Dock Verification
          </CardDescription>
        </div>

        <div class="flex items-center gap-2">
          <Button variant="outline" size="sm" class="gap-1.5">
            <Printer class="size-4" />
            Print Putaway Labels
          </Button>
          <Button v-if="!isCompleted" variant="default" size="sm" class="gap-1.5" @click="finalizeReceipt">
            <PackageCheck class="size-4" />
            Generate GRN
          </Button>
          <Button v-else variant="secondary" size="sm" class="gap-1.5" @click="resetReceipt"> Edit Receipt </Button>
        </div>
      </CardHeader>

      <CardContent class="border-border grid grid-cols-1 gap-4 border-t pt-4 sm:grid-cols-3">
        <!-- Receiving Dock -->
        <div class="border-border space-y-1.5 rounded-lg border p-3">
          <div class="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
            <Warehouse class="size-3.5" />
            <span>RECEIVING BAY</span>
          </div>
          <Select v-model="receivingDock" :disabled="isCompleted">
            <SelectTrigger class="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dock-01">Inbound Dock Bay 01 (Heavy Freight)</SelectItem>
              <SelectItem value="dock-02">Inbound Dock Bay 02 (Cross-Dock)</SelectItem>
              <SelectItem value="dock-03">Inbound Dock Bay 03 (Standard Freight)</SelectItem>
              <SelectItem value="dock-04">Inbound Cold Storage Quarantine Bay</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Discrepancy Summary -->
        <div class="border-border space-y-1 rounded-lg border p-3">
          <div class="text-muted-foreground text-xs font-medium">RECEIPT SUMMARY</div>
          <div class="flex items-baseline justify-between pt-1">
            <div class="font-mono text-xl font-semibold">{{ totalAccepted }} / {{ totalOrdered }}</div>
            <Badge v-if="totalRejected > 0" variant="destructive" class="font-mono text-xs">
              {{ totalRejected }} Rejected
            </Badge>
            <Badge v-else variant="outline" class="text-muted-foreground font-mono text-xs"> 100% Match </Badge>
          </div>
        </div>

        <!-- QA Verification Badge -->
        <div class="border-border space-y-1 rounded-lg border p-3">
          <div class="text-muted-foreground text-xs font-medium">QA AUDIT DISPOSITION</div>
          <div class="flex items-center gap-2 pt-1">
            <ShieldCheck v-if="inspectionStatus === 'passed'" class="text-foreground size-5" />
            <AlertTriangle v-else-if="inspectionStatus === 'discrepancy'" class="text-destructive size-5" />
            <Clock v-else class="text-muted-foreground size-5" />
            <span class="text-sm font-medium">
              {{
                inspectionStatus === 'passed'
                  ? 'All lines cleared for putaway'
                  : inspectionStatus === 'discrepancy'
                    ? 'Discrepancy logged for vendor credit'
                    : 'Awaiting line verification'
              }}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- PO Line Item Matching Table -->
    <Card>
      <CardHeader class="pb-3">
        <CardTitle class="text-base font-semibold">Purchase Order Line Verification</CardTitle>
        <CardDescription>
          Verify quantities received against vendor packing list and assign warehouse staging zones.
        </CardDescription>
      </CardHeader>

      <CardContent class="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="w-[280px]">Item / Description</TableHead>
              <TableHead class="text-right">Ordered</TableHead>
              <TableHead class="w-[110px] text-right">Received</TableHead>
              <TableHead class="w-[110px] text-right">Rejected</TableHead>
              <TableHead>Rejection Reason</TableHead>
              <TableHead>Lot Number</TableHead>
              <TableHead>Staging Target</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="line in lines" :key="line.id">
              <!-- Item Details -->
              <TableCell>
                <div class="font-medium">{{ line.title }}</div>
                <div class="text-muted-foreground font-mono text-xs">{{ line.sku }}</div>
              </TableCell>

              <!-- Ordered Qty -->
              <TableCell class="text-muted-foreground text-right font-mono text-sm">
                {{ line.orderedQty }}
              </TableCell>

              <!-- Received Qty -->
              <TableCell class="text-right">
                <Input
                  v-model.number="line.receivedQty"
                  type="number"
                  min="0"
                  class="h-8 text-right font-mono"
                  :disabled="isCompleted"
                />
              </TableCell>

              <!-- Rejected Qty -->
              <TableCell class="text-right">
                <Input
                  v-model.number="line.rejectedQty"
                  type="number"
                  min="0"
                  class="h-8 text-right font-mono"
                  :disabled="isCompleted"
                />
              </TableCell>

              <!-- Reason -->
              <TableCell>
                <Select v-model="line.rejectionReason" :disabled="isCompleted || line.rejectedQty === 0">
                  <SelectTrigger class="h-8 w-[160px] text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (Accepted)</SelectItem>
                    <SelectItem value="damaged_packaging">Damaged Packaging</SelectItem>
                    <SelectItem value="expired_lot">Short Shelf Life</SelectItem>
                    <SelectItem value="wrong_specification">Incorrect Spec</SelectItem>
                    <SelectItem value="temperature_excursion">Temp Excursion</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>

              <!-- Lot Number Input -->
              <TableCell>
                <Input
                  v-model="line.lotNumber"
                  placeholder="Lot #"
                  class="h-8 w-28 font-mono text-xs"
                  :disabled="isCompleted"
                />
              </TableCell>

              <!-- Staging Target -->
              <TableCell>
                <span class="bg-muted text-foreground rounded px-2 py-1 font-mono text-xs font-medium">
                  {{ line.stagingLocation }}
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>

      <CardFooter class="border-border text-muted-foreground flex items-center justify-between border-t py-3 text-xs">
        <div>Official GRN generates supplier debit note automatically for any non-zero rejection.</div>
        <div class="text-foreground font-medium">
          Accepted: <span class="font-mono font-semibold">{{ totalAccepted }}</span> units · Rejected:{' '}
          <span class="text-destructive font-mono font-semibold">{{ totalRejected }}</span> units
        </div>
      </CardFooter>
    </Card>
  </div>
</template>
