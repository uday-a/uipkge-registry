<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Lock } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'

// Strictly-necessary is listed and shown locked rather than hidden. Omitting it
// implies there is nothing there, which is not true.
const categories = [
  {
    id: 'necessary',
    label: 'Strictly necessary',
    purpose: 'Session and sign-in state. Without these the app cannot keep you logged in.',
    retention: 'Session',
    locked: true,
  },
  {
    id: 'analytics',
    label: 'Product analytics',
    purpose: 'Which pages are read and where people give up. Aggregated, never sold.',
    retention: '13 months',
    locked: false,
  },
  {
    id: 'support',
    label: 'Support chat',
    purpose: 'Keeps a conversation open across page loads so you do not repeat yourself.',
    retention: '30 days',
    locked: false,
  },
]

const open = ref(true)
const choices = reactive<Record<string, boolean>>({ necessary: true, analytics: false, support: false })
</script>

<template>
  <div data-slot="cookie-consent-preferences">
    <Dialog v-model:open="open">
      <DialogContent class="sm:max-w-lg">
        <DialogHeader>
          <Badge variant="secondary" class="w-fit">Privacy</Badge>
          <DialogTitle class="mt-3 text-xl">Choose what we store</DialogTitle>
          <DialogDescription>
            Each category says what it is for and how long it is kept. Nothing here is advertising.
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <ul class="space-y-4">
          <li v-for="category in categories" :key="category.id" class="flex items-start gap-4">
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <p class="text-sm font-medium">{{ category.label }}</p>
                <Badge v-if="category.locked" variant="outline" class="gap-1">
                  <Lock class="size-2.5" aria-hidden="true" />
                  Required
                </Badge>
              </div>
              <p class="text-muted-foreground mt-1 text-xs leading-relaxed">{{ category.purpose }}</p>
              <p class="text-muted-foreground/80 mt-1 font-mono text-xs">Kept {{ category.retention }}</p>
            </div>
            <Switch
              v-model="choices[category.id]"
              :disabled="category.locked"
              :aria-label="`Allow ${category.label}`"
              class="mt-1 shrink-0"
            />
          </li>
        </ul>

        <DialogFooter class="sm:justify-start">
          <Button @click="open = false">Save choices</Button>
          <Button variant="outline" @click="open = false">Reject optional</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
