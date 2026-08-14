<script setup lang="ts">
import { ref } from 'vue'
import { Check, ChevronDown, Minus } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'

const plans = ['Team', 'Business', 'Enterprise']

const groups = [
  {
    id: 'modelling',
    label: 'Modelling',
    summary: 'Definitions, versioning, and review',
    rows: [
      { feature: 'Certified definitions', values: ['50', '500', 'Unlimited'] },
      { feature: 'Version history', values: ['30 days', 'Unlimited', 'Unlimited'] },
      { feature: 'Required review', values: [false, true, true] },
      { feature: 'Period locking', values: [false, true, true] },
    ],
  },
  {
    id: 'access',
    label: 'Access & identity',
    summary: 'Who sees which rows',
    rows: [
      { feature: 'SSO (SAML)', values: [true, true, true] },
      { feature: 'SCIM provisioning', values: [false, true, true] },
      { feature: 'Row-level scope', values: [false, true, true] },
      { feature: 'Customer-managed keys', values: [false, false, true] },
    ],
  },
  {
    id: 'ops',
    label: 'Operations',
    summary: 'Cost, alerting, and support',
    rows: [
      { feature: 'Query budgets', values: [false, true, true] },
      { feature: 'Drift alerting', values: [false, true, true] },
      { feature: 'Audit log export', values: [false, '90 days', 'Unlimited'] },
      { feature: 'Named support engineer', values: [false, false, true] },
    ],
  },
]

// Opens on the first group only: a fully expanded matrix is the thing readers
// bounce off, and every group is one click from open.
const open = ref<string[]>([groups[0].id])

function toggle(id: string) {
  open.value = open.value.includes(id) ? open.value.filter((entry) => entry !== id) : [...open.value, id]
}
</script>

<template>
  <section data-slot="pricing-matrix-grouped" class="bg-background">
    <div class="mx-auto max-w-4xl px-6 py-20 lg:py-28">
      <Badge variant="secondary">Compare plans</Badge>
      <h2 class="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Grouped, so it stays readable</h2>

      <Card class="mt-8">
        <CardContent class="p-0">
          <div
            class="text-muted-foreground grid grid-cols-[1fr_repeat(3,5rem)] gap-2 px-4 py-3 text-xs font-medium sm:grid-cols-[1fr_repeat(3,7rem)]"
          >
            <span>Capability</span>
            <span v-for="plan in plans" :key="plan" class="text-center">{{ plan }}</span>
          </div>
          <Separator />

          <div v-for="group in groups" :key="group.id">
            <button
              type="button"
              class="hover:bg-muted focus-visible:ring-ring flex w-full items-center gap-3 px-4 py-3 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none"
              :aria-expanded="open.includes(group.id)"
              :aria-controls="`group-${group.id}`"
              @click="toggle(group.id)"
            >
              <ChevronDown
                class="text-muted-foreground size-4 shrink-0 transition-transform"
                :class="open.includes(group.id) ? '' : '-rotate-90'"
                aria-hidden="true"
              />
              <span class="min-w-0">
                <span class="block text-sm font-medium">{{ group.label }}</span>
                <span class="text-muted-foreground block text-xs">{{ group.summary }}</span>
              </span>
              <span class="text-muted-foreground ml-auto shrink-0 font-mono text-xs">{{ group.rows.length }}</span>
            </button>

            <div v-show="open.includes(group.id)" :id="`group-${group.id}`">
              <Table>
                <TableBody>
                  <TableRow v-for="row in group.rows" :key="row.feature">
                    <TableCell class="pl-11 text-sm">{{ row.feature }}</TableCell>
                    <TableCell v-for="(value, index) in row.values" :key="index" class="w-20 text-center sm:w-28">
                      <template v-if="value === true">
                        <Check class="text-success mx-auto size-4" aria-hidden="true" />
                        <span class="sr-only">Included</span>
                      </template>
                      <template v-else-if="value === false">
                        <Minus class="text-muted-foreground/50 mx-auto size-4" aria-hidden="true" />
                        <span class="sr-only">Not included</span>
                      </template>
                      <span v-else class="font-mono text-xs">{{ value }}</span>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <Separator />
          </div>
        </CardContent>
      </Card>

      <Button class="mt-6">Start on Business</Button>
    </div>
  </section>
</template>
