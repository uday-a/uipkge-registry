<script setup lang="ts">
import { ref } from 'vue'
import BankAccountConnector from '@/components/blocks/bank-account-connector/BankAccountConnector.vue'

interface ConnectPayload {
  bankId: string
  bankName: string
  accountId: string
  accountName: string
  last4: string
  balance: string
}

const lastConnected = ref<string | null>(null)

function handleConnect(payload: ConnectPayload) {
  lastConnected.value = `${payload.bankName} - ${payload.accountName} (•••• ${payload.last4}) - ${payload.balance}`
}
</script>

<template>
  <Story
    title="Interactive bank connector"
    description="Plaid and Tink style bank linking modal. Features institution search, 6 popular banks grid, account selector, and an encrypted security footer."
  >
    <div class="space-y-4">
      <BankAccountConnector @connect="handleConnect" />
      <div
        v-if="lastConnected"
        class="bg-muted/40 text-muted-foreground mx-auto max-w-lg rounded-xl border p-3 text-center text-xs"
      >
        <span class="text-foreground font-medium">Last Connected Account:</span> {{ lastConnected }}
      </div>
    </div>
  </Story>

  <Story
    title="Pre-selected Chase checking and savings"
    description="Starts on the account selection step showing checking, savings, and credit cards with live balances and badges."
  >
    <BankAccountConnector initial-bank-id="chase" @connect="handleConnect" />
  </Story>

  <Story
    title="Pre-selected Bank of America"
    description="Connected institution banner with quick 'Change' trigger, account radio options, and AES-256 security assurance."
  >
    <BankAccountConnector initial-bank-id="bofa" @connect="handleConnect" />
  </Story>

  <Story
    title="Pre-selected Wells Fargo"
    description="Direct account selection view for Wells Fargo accounts with tabular numeral balances."
  >
    <BankAccountConnector initial-bank-id="wellsfargo" @connect="handleConnect" />
  </Story>
</template>
