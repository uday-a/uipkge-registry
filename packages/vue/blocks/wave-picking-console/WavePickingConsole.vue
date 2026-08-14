<script setup lang="ts">
import { ref, computed } from 'vue'
import { Barcode, Check, MapPin } from 'lucide-vue-next'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface PickItem {
  id: string
  sequence: number
  location: string
  sku: string
  name: string
  barcode: string
  requiredQty: number
  pickedQty: number
  toteNumber: string
  orderNumber: string
  status: 'pending' | 'picking' | 'picked' | 'shortage'
}

export interface WavePickingConsoleProps {
  waveId?: string
  zoneName?: string
  pickerName?: string
}

const props = withDefaults(defineProps<WavePickingConsoleProps>(), {
  waveId: 'WAVE-B2C-904',
  zoneName: 'Zone 02 · Fast Mover Aisle',
  pickerName: 'Alex Mercer (ID: PK-41)',
})

const activeBarcode = ref('')

const pickItems = ref<PickItem[]>([
  {
    id: 'pk-1',
    sequence: 1,
    location: 'A02-S1-B04',
    sku: 'SKU-AUDIO-ANC',
    name: 'Active Noise Canceling Headphones Matte Black',
    barcode: '079357319901',
    requiredQty: 2,
    pickedQty: 2,
    toteNumber: 'TOTE-01',
    orderNumber: 'ORD-99120',
    status: 'picked',
  },
  {
    id: 'pk-2',
    sequence: 2,
    location: 'A02-S3-B11',
    sku: 'SKU-CABLE-BRAID',
    name: 'Braided Type-C Thunderbolt 4 Cable (2m)',
    barcode: '079357319902',
    requiredQty: 4,
    pickedQty: 1,
    toteNumber: 'TOTE-02',
    orderNumber: 'ORD-99124',
    status: 'picking',
  },
  {
    id: 'pk-3',
    sequence: 3,
    location: 'A03-S2-B08',
    sku: 'SKU-DESK-PAD',
    name: 'Top-Grain Leather Desk Mat Midnight Gray',
    barcode: '079357319903',
    requiredQty: 1,
    pickedQty: 0,
    toteNumber: 'TOTE-01',
    orderNumber: 'ORD-99120',
    status: 'pending',
  },
  {
    id: 'pk-4',
    sequence: 4,
    location: 'A04-S1-B02',
    sku: 'SKU-HUB-10IN1',
    name: 'USB-C Aluminum Desktop Docking Station',
    barcode: '079357319904',
    requiredQty: 3,
    pickedQty: 0,
    toteNumber: 'TOTE-03',
    orderNumber: 'ORD-99131',
    status: 'pending',
  },
])

const totalUnitsToPick = computed(() => pickItems.value.reduce((acc, i) => acc + i.requiredQty, 0))
const totalUnitsPicked = computed(() => pickItems.value.reduce((acc, i) => acc + i.pickedQty, 0))
const progressPercentage = computed(() => Math.round((totalUnitsPicked.value / totalUnitsToPick.value) * 100))

const activeItem = computed(
  () => pickItems.value.find((i) => i.status === 'picking') || pickItems.value.find((i) => i.status === 'pending'),
)

function scanItem() {
  if (!activeItem.value) return
  if (activeItem.value.pickedQty < activeItem.value.requiredQty) {
    activeItem.value.pickedQty += 1
    if (activeItem.value.pickedQty === activeItem.value.requiredQty) {
      activeItem.value.status = 'picked'
      // Move to next pending
      const nextPending = pickItems.value.find((i) => i.status === 'pending')
      if (nextPending) nextPending.status = 'picking'
    }
  }
  activeBarcode.value = ''
}

function flagShortage(id: string) {
  const target = pickItems.value.find((i) => i.id === id)
  if (target) {
    target.status = 'shortage'
    const nextPending = pickItems.value.find((i) => i.status === 'pending')
    if (nextPending) nextPending.status = 'picking'
  }
}
</script>

<template>
  <div data-slot="wave-picking-console" class="w-full space-y-6">
    <!-- Top Wave Header Card -->
    <Card>
      <CardHeader class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="text-foreground font-mono text-sm font-semibold">{{ waveId }}</span>
            <Badge variant="outline" class="font-mono text-xs">
              {{ zoneName }}
            </Badge>
            <Badge :variant="progressPercentage === 100 ? 'default' : 'secondary'">
              {{ progressPercentage }}% Picked
            </Badge>
          </div>
          <CardTitle class="text-xl">Batch Order Wave Picking Console</CardTitle>
          <CardDescription>
            Assigned Picker: <span class="text-foreground font-medium">{{ pickerName }}</span> · Route Optimized
          </CardDescription>
        </div>

        <div class="flex items-center gap-3">
          <div class="text-right">
            <div class="text-muted-foreground text-xs">Pick Completion</div>
            <div class="font-mono text-lg font-bold">{{ totalUnitsPicked }} / {{ totalUnitsToPick }} Units</div>
          </div>
        </div>
      </CardHeader>

      <!-- Active Pick Target Banner -->
      <CardContent v-if="activeItem" class="border-border border-t pt-4">
        <div class="border-border bg-muted/40 rounded-lg border p-4">
          <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="bg-foreground text-background rounded px-2 py-0.5 font-mono text-xs font-semibold">
                  NEXT TARGET: {{ activeItem.location }}
                </span>
                <span class="text-muted-foreground font-mono text-xs">TOTE: {{ activeItem.toteNumber }}</span>
                <span class="text-muted-foreground font-mono text-xs">({{ activeItem.orderNumber }})</span>
              </div>
              <div class="text-foreground text-lg font-semibold">{{ activeItem.name }}</div>
              <div class="text-muted-foreground font-mono text-xs">
                SKU: {{ activeItem.sku }} · Scan Barcode: {{ activeItem.barcode }}
              </div>
            </div>

            <!-- Fast Scan & Action Button Group -->
            <div class="flex items-center gap-2">
              <div class="relative w-48">
                <Barcode class="text-muted-foreground pointer-events-none absolute top-2.5 left-2.5 size-4" />
                <Input
                  v-model="activeBarcode"
                  placeholder="Scan SKU barcode..."
                  class="h-9 pl-8"
                  @keydown.enter.prevent="scanItem"
                />
              </div>
              <Button size="sm" class="gap-1.5" @click="scanItem">
                <Check class="size-4" />
                Confirm Pick
              </Button>
              <Button
                variant="outline"
                size="sm"
                class="text-destructive hover:bg-destructive/10"
                @click="flagShortage(activeItem.id)"
              >
                Flag Shortage
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Optimized Route Table -->
    <Card>
      <CardHeader class="pb-3">
        <CardTitle class="text-base font-semibold">Optimized Pick Route Sequence</CardTitle>
        <CardDescription>
          Pick items strictly in sequence to minimize travel distance across fulfillment aisles.
        </CardDescription>
      </CardHeader>

      <CardContent class="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="w-[60px]">Seq</TableHead>
              <TableHead>Location Bin</TableHead>
              <TableHead class="w-[300px]">Product / SKU</TableHead>
              <TableHead>Tote & Order</TableHead>
              <TableHead class="text-right">Qty</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="item in pickItems"
              :key="item.id"
              :class="item.status === 'picking' ? 'bg-muted/50 font-medium' : ''"
            >
              <!-- Sequence Number -->
              <TableCell class="text-muted-foreground font-mono text-xs"> #{{ item.sequence }} </TableCell>

              <!-- Location Bin -->
              <TableCell>
                <div class="text-foreground flex items-center gap-1.5 font-mono text-xs font-semibold">
                  <MapPin class="text-muted-foreground size-3.5" />
                  <span>{{ item.location }}</span>
                </div>
              </TableCell>

              <!-- Product -->
              <TableCell>
                <div class="font-medium">{{ item.name }}</div>
                <div class="text-muted-foreground font-mono text-xs">{{ item.sku }}</div>
              </TableCell>

              <!-- Tote & Order -->
              <TableCell>
                <div class="flex items-center gap-1.5 font-mono text-xs">
                  <Badge variant="outline">{{ item.toteNumber }}</Badge>
                  <span class="text-muted-foreground">{{ item.orderNumber }}</span>
                </div>
              </TableCell>

              <!-- Qty Progress -->
              <TableCell class="text-right font-mono text-sm">
                {{ item.pickedQty }} / {{ item.requiredQty }}
              </TableCell>

              <!-- Status Badge -->
              <TableCell>
                <Badge
                  :variant="
                    item.status === 'picked'
                      ? 'default'
                      : item.status === 'picking'
                        ? 'secondary'
                        : item.status === 'shortage'
                          ? 'destructive'
                          : 'outline'
                  "
                  class="capitalize"
                >
                  {{ item.status }}
                </Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>

      <CardFooter class="border-border text-muted-foreground flex items-center justify-between border-t py-3 text-xs">
        <div>Completed totes are automatically routed to Conveyor Pack Station 04.</div>
        <div class="text-foreground font-medium">
          Wave Target: <span class="font-mono">{{ pickItems.length }}</span> pick positions
        </div>
      </CardFooter>
    </Card>
  </div>
</template>
