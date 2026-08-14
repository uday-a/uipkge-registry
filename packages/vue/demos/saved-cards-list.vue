<script setup lang="ts">
import SavedCardsList from '@/components/blocks/saved-cards-list/SavedCardsList.vue'
import { ref } from 'vue'

interface SavedCard {
  id: string
  brand: 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown'
  last4: string
  expiry: string
  holder: string
}

const cards = ref<SavedCard[]>([
  { id: 'c1', brand: 'visa', last4: '4242', expiry: '12/29', holder: 'Jane Doe' },
  { id: 'c2', brand: 'mastercard', last4: '4444', expiry: '08/27', holder: 'Jane Doe' },
  { id: 'c3', brand: 'amex', last4: '0005', expiry: '03/30', holder: 'Jane Doe' },
])
const defaultId = ref('c1')

function onRemove(id: string) {
  cards.value = cards.value.filter((c) => c.id !== id)
  if (defaultId.value === id) defaultId.value = cards.value[0]?.id ?? ''
}

function onAdd(payload: { number: string; brand: SavedCard['brand']; expiry: string; name: string }) {
  cards.value.push({
    id: 'c' + Date.now(),
    brand: payload.brand,
    last4: payload.number.slice(-4),
    expiry: payload.expiry,
    holder: payload.name,
  })
}

const emptyCards = ref<SavedCard[]>([])
</script>

<template>
  <Story
    title="Three cards, default set"
    description="Mixed brands. The default card has a badge; non-default rows expose a 'Set default' action."
  >
    <SavedCardsList
      :cards="cards"
      :default-id="defaultId"
      @remove="onRemove"
      @add="onAdd"
      @set-default="(id) => (defaultId = id)"
    />
  </Story>

  <Story title="Empty state" description="No saved cards yet — prominent 'Add your first card' call to action.">
    <SavedCardsList
      :cards="emptyCards"
      @add="
        (p) => emptyCards.push({ id: '1', brand: p.brand, last4: p.number.slice(-4), expiry: p.expiry, holder: p.name })
      "
    />
  </Story>

  <Story
    title="Add flow"
    description="Click 'Add card' to expand an inline PaymentForm (wallets hidden). On submit it collapses and pushes a new row."
  >
    <SavedCardsList
      :cards="cards"
      :default-id="defaultId"
      @add="onAdd"
      @remove="onRemove"
      @set-default="(id) => (defaultId = id)"
    />
  </Story>
</template>
