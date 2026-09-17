<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const customers = [
  'Northwind',
  'Halden',
  'Verity',
  'Calder',
  'Ridgeway',
  'Ashford',
  'Brightmoor',
  'Kesteven',
  'Marlowe',
  'Thornbury',
  'Wexley',
  'Alderton',
]
</script>

<template>
  <section data-slot="logo-cloud-grayscale" class="bg-background">
    <div class="mx-auto max-w-6xl px-6 py-16">
      <div class="text-center">
        <Badge variant="secondary">Customers</Badge>
        <p class="mt-4 text-lg font-medium">Running the close at 240 companies</p>
        <p class="text-muted-foreground mt-1.5 text-sm">
          Freight, healthcare, retail, and manufacturing · median 1,100 staff
        </p>
      </div>

      <!-- Muted by default, full contrast on hover: the wall reads as texture
           until someone looks for a specific name. -->
      <ul class="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
        <li v-for="customer in customers" :key="customer" class="flex items-center justify-center">
          <span
            class="text-muted-foreground/60 hover:text-foreground cursor-default text-sm font-semibold tracking-[0.18em] uppercase transition-colors"
          >
            {{ customer }}
          </span>
        </li>
      </ul>

      <Separator class="my-10" />

      <div class="flex flex-wrap items-center justify-center gap-4 text-center">
        <p class="text-muted-foreground text-sm">Six of the ten largest UK freight forwarders.</p>
        <Button variant="link" class="h-auto p-0 text-sm">Read their stories</Button>
      </div>
    </div>
  </section>
</template>
