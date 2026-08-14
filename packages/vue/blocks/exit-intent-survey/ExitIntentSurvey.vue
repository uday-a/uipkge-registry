<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Check } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

const props = withDefaults(defineProps<{ storageKey?: string }>(), {
  storageKey: 'uipkge:exit-survey-seen',
})

const options = [
  'Pricing was unclear',
  'Missing an integration',
  'Just browsing',
  'Security questions',
  'Something else',
]

const open = ref(false)
const choice = ref('')
const detail = ref('')
const sent = ref(false)

function onPointerOut(event: MouseEvent) {
  if (event.relatedTarget || event.clientY > 4) return
  try {
    if (window.sessionStorage.getItem(props.storageKey) === '1') return
    window.sessionStorage.setItem(props.storageKey, '1')
  } catch {
    // Blocked storage: shows once more this page view, never in a loop.
  }
  open.value = true
  document.removeEventListener('mouseout', onPointerOut)
}

function submit() {
  if (!choice.value) return
  sent.value = true
  // Close on its own rather than making someone dismiss a thank-you.
  setTimeout(() => (open.value = false), 1400)
}

onMounted(() => document.addEventListener('mouseout', onPointerOut))
onBeforeUnmount(() => document.removeEventListener('mouseout', onPointerOut))
</script>

<template>
  <div data-slot="exit-intent-survey">
    <Dialog v-model:open="open">
      <DialogContent class="sm:max-w-md">
        <div v-if="!sent">
          <DialogHeader>
            <Badge variant="secondary" class="w-fit">One question</Badge>
            <DialogTitle class="mt-3 text-xl leading-snug text-balance">What were you looking for?</DialogTitle>
            <DialogDescription>
              It goes to the people who build the page. No follow-up email unless you ask for one.
            </DialogDescription>
          </DialogHeader>

          <ToggleGroup
            :model-value="choice"
            type="single"
            variant="outline"
            size="sm"
            class="mt-5 flex-wrap justify-start"
            aria-label="Reason for leaving"
            @update:model-value="(value) => (choice = typeof value === 'string' ? value : '')"
          >
            <ToggleGroupItem v-for="option in options" :key="option" :value="option">{{ option }}</ToggleGroupItem>
          </ToggleGroup>

          <Textarea
            v-model="detail"
            class="mt-3"
            rows="3"
            placeholder="Anything more (optional)"
            label="Anything more (optional)"
          />

          <div class="mt-4 flex items-center gap-2">
            <Button :disabled="!choice" @click="submit">Send</Button>
            <Button variant="ghost" @click="open = false">Skip</Button>
          </div>
        </div>

        <div v-else class="py-6 text-center" aria-live="polite">
          <span class="bg-success/10 mx-auto flex size-10 items-center justify-center rounded-full">
            <Check class="text-success size-5" aria-hidden="true" />
          </span>
          <p class="mt-3 text-sm font-medium">Thanks — that is genuinely useful.</p>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
