<script setup lang="ts">
import { computed, ref } from 'vue'
import { CheckCircle2, Plus, Trash2 } from 'lucide-vue-next'
import { PaymentCard } from '@/components/ui/payment-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import PaymentForm from '@/components/blocks/PaymentForm.vue'

type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown'

interface SavedCard {
  id: string
  brand: CardBrand
  last4: string
  expiry: string
  holder: string
}

const props = defineProps<{
  cards: SavedCard[]
  defaultId?: string
}>()

const emit = defineEmits<{
  add: [
    payload: {
      number: string
      name: string
      expiry: string
      cvc: string
      brand: CardBrand
    },
  ]
  remove: [id: string]
  'set-default': [id: string]
}>()

const showAdd = ref(false)
const removeTarget = ref<SavedCard | null>(null)

function brandLabel(b: CardBrand) {
  return { visa: 'Visa', mastercard: 'Mastercard', amex: 'Amex', discover: 'Discover', unknown: 'Card' }[b]
}

function maskedNumberFromLast4(last4: string, brand: CardBrand): string {
  if (brand === 'amex') return `•••• •••••• •${last4}`
  return `•••• •••• •••• ${last4}`
}

const confirmOpen = computed({
  get: () => !!removeTarget.value,
  set: (v) => {
    if (!v) removeTarget.value = null
  },
})

function confirmRemove() {
  if (!removeTarget.value) return
  emit('remove', removeTarget.value.id)
  removeTarget.value = null
}
</script>

<template>
  <div
    data-slot="saved-cards-list"
    class="bg-card text-card-foreground mx-auto w-full max-w-2xl rounded-xl border shadow-sm"
  >
    <div class="flex items-center justify-between border-b px-5 py-4">
      <div>
        <h3 class="text-base font-semibold">Saved cards</h3>
        <p class="text-muted-foreground text-xs">Manage the cards used for billing.</p>
      </div>
      <Button size="sm" @click="showAdd = !showAdd"><Plus class="size-4" /> Add card</Button>
    </div>

    <!-- Add form (collapses inline) -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="max-h-0 opacity-0"
      enter-to-class="max-h-[1000px] opacity-100"
      leave-from-class="max-h-[1000px] opacity-100"
      leave-to-class="max-h-0 opacity-0"
    >
      <div v-if="showAdd" class="bg-muted/30 overflow-hidden border-b p-4">
        <PaymentForm
          :amount="0"
          :show-wallets="false"
          :on-submit="
            async (p) => {
              emit('add', p)
              showAdd = false
            }
          "
        />
      </div>
    </Transition>

    <!-- Empty state -->
    <div v-if="cards.length === 0 && !showAdd" class="px-6 py-14 text-center">
      <div class="bg-muted text-muted-foreground mx-auto grid size-12 place-items-center rounded-full">
        <Plus class="size-5" />
      </div>
      <h4 class="mt-3 text-sm font-medium">No cards saved</h4>
      <p class="text-muted-foreground text-xs">Add a card to use it for future payments.</p>
      <Button size="sm" class="mt-4" @click="showAdd = true">Add your first card</Button>
    </div>

    <!-- List -->
    <ul v-else class="divide-border divide-y">
      <li
        v-for="card in cards"
        :key="card.id"
        class="hover:bg-muted/30 flex items-center gap-4 px-5 py-4 transition-colors"
      >
        <PaymentCard
          :number="maskedNumberFromLast4(card.last4, card.brand)"
          :name="card.holder"
          :expiry="card.expiry"
          :brand="card.brand"
          variant="compact"
          :flip="false"
        />
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <p class="text-sm font-medium">{{ brandLabel(card.brand) }} ending {{ card.last4 }}</p>
            <Badge v-if="card.id === defaultId" variant="secondary"><CheckCircle2 class="size-3" /> Default</Badge>
          </div>
          <p class="text-muted-foreground text-xs">Expires {{ card.expiry }} · {{ card.holder }}</p>
        </div>
        <div class="flex gap-1">
          <Button v-if="card.id !== defaultId" variant="ghost" size="sm" @click="emit('set-default', card.id)">
            Set default
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Remove card" @click="removeTarget = card">
            <Trash2 class="text-muted-foreground size-4" />
          </Button>
        </div>
      </li>
    </ul>

    <!-- Remove confirmation -->
    <Dialog v-model:open="confirmOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove this card?</DialogTitle>
          <DialogDescription>
            {{ removeTarget && brandLabel(removeTarget.brand) }} ending {{ removeTarget?.last4 }} will no longer be
            available for payments.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" @click="removeTarget = null">Cancel</Button>
          <Button variant="destructive" @click="confirmRemove">Remove</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
