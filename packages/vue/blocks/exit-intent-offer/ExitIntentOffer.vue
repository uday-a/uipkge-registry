<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { ArrowRight, Sparkles } from 'lucide-vue-next'
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

const props = withDefaults(defineProps<{ storageKey?: string }>(), {
  storageKey: 'uipkge:exit-intent-seen',
})

const open = ref(false)

// Only the top edge counts. A pointer leaving left, right, or bottom is usually
// someone reaching for a scrollbar or another window, not leaving the page.
function onPointerOut(event: MouseEvent) {
  if (event.relatedTarget || event.clientY > 4) return
  show()
}

function show() {
  try {
    if (window.sessionStorage.getItem(props.storageKey) === '1') return
    window.sessionStorage.setItem(props.storageKey, '1')
  } catch {
    // Blocked storage: it can show once more this page view, never in a loop.
  }
  open.value = true
  document.removeEventListener('mouseout', onPointerOut)
}

onMounted(() => document.addEventListener('mouseout', onPointerOut))
onBeforeUnmount(() => document.removeEventListener('mouseout', onPointerOut))
</script>

<template>
  <div data-slot="exit-intent-offer">
    <Dialog v-model:open="open">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <Badge variant="secondary" class="w-fit gap-1.5">
            <Sparkles class="size-3" aria-hidden="true" />
            Before you go
          </Badge>
          <DialogTitle class="mt-3 text-xl leading-snug text-balance"> Take 30 days instead of 14 </DialogTitle>
          <DialogDescription class="leading-relaxed">
            A full close cycle fits in 30 days and 14 does not, which is the actual reason most trials stall. No card,
            no call, cancel from the dashboard.
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <ul class="text-muted-foreground space-y-1.5 text-sm">
          <li>· Everything on the Business plan</li>
          <li>· Connect your real warehouse, read-only</li>
          <li>· Keep the definitions you author either way</li>
        </ul>

        <DialogFooter class="sm:justify-start">
          <Button>
            Start the 30-day trial
            <ArrowRight class="ml-2 size-4" aria-hidden="true" />
          </Button>
          <Button variant="ghost" @click="open = false">No thanks</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
