<script setup lang="ts">
/**
 * Full-page demo. Shows the conversion funnel block in two typical
 * contexts: an e-commerce purchase funnel (large drop-off) and a
 * hiring funnel (extreme drop-off, 482 -> 12).
 */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ConversionFunnel } from './index'

const PURCHASE = [
  { name: 'Product views', value: 72000 },
  { name: 'Add to cart', value: 38200 },
  { name: 'Checkout', value: 16800 },
  { name: 'Purchase', value: 5600 },
]

const HIRING = [
  { name: 'Applied', value: 482 },
  { name: 'Screened', value: 184 },
  { name: 'Interviewed', value: 64 },
  { name: 'Offered', value: 22 },
  { name: 'Hired', value: 12 },
]

const SIGNUP = [
  { name: 'Visitors', value: 12400 },
  { name: 'Signed up', value: 3120 },
  { name: 'Activated', value: 1880 },
]

const compact = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K` : String(n))
</script>

<template>
  <div class="mx-auto max-w-6xl space-y-6 p-6">
    <Card>
      <CardHeader>
        <CardTitle class="text-base">Purchase funnel</CardTitle>
        <CardDescription>
          Overall purchase rate · {{ compact(PURCHASE[PURCHASE.length - 1]!.value) }} orders from
          {{ compact(PURCHASE[0]!.value) }} views · Last 30 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ConversionFunnel :data="PURCHASE" :format="compact" />
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle class="text-base">Hiring funnel</CardTitle>
        <CardDescription> 5-stage conversion across all open requisitions, last 90 days. </CardDescription>
      </CardHeader>
      <CardContent>
        <ConversionFunnel :data="HIRING" />
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle class="text-base">Signup funnel</CardTitle>
        <CardDescription>3-stage activation flow.</CardDescription>
      </CardHeader>
      <CardContent>
        <ConversionFunnel :data="SIGNUP" :format="compact" />
      </CardContent>
    </Card>
  </div>
</template>
