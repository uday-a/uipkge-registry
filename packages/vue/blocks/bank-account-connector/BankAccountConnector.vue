<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, ref, watch } from 'vue'
import { ArrowLeft, Building2, CheckCircle2, ExternalLink, Loader2, Lock, Search, Shield } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

interface BankInstitution {
  id: string
  name: string
  fullName: string
  tagline: string
}

interface BankAccount {
  id: string
  name: string
  last4: string
  type: 'Checking' | 'Savings' | 'Credit'
  balance: string
  balanceLabel: string
  subtitle: string
}

interface ConnectPayload {
  bankId: string
  bankName: string
  accountId: string
  accountName: string
  last4: string
  balance: string
}

const props = defineProps<{
  initialBankId?: string
  class?: HTMLAttributes['class']
}>()

const emit = defineEmits<{
  connect: [payload: ConnectPayload]
  cancel: []
  'select-bank': [bankId: string]
}>()

const institutions: BankInstitution[] = [
  { id: 'chase', name: 'Chase', fullName: 'JPMorgan Chase Bank', tagline: 'Checking, Savings & Credit' },
  { id: 'bofa', name: 'Bank of America', fullName: 'Bank of America N.A.', tagline: 'Advantage Banking' },
  { id: 'wellsfargo', name: 'Wells Fargo', fullName: 'Wells Fargo Bank', tagline: 'Everyday & Way2Save' },
  { id: 'citibank', name: 'Citibank', fullName: 'Citibank N.A.', tagline: 'Citi Priority & Access' },
  { id: 'capitalone', name: 'Capital One', fullName: 'Capital One Bank', tagline: '360 Checking & Savings' },
  { id: 'svb', name: 'SVB', fullName: 'Silicon Valley Bank', tagline: 'Commercial & Startup Banking' },
]

const accounts: BankAccount[] = [
  {
    id: 'acc-chk-4892',
    name: 'Checking',
    last4: '4892',
    type: 'Checking',
    balance: '$14,250.00',
    balanceLabel: 'Available balance',
    subtitle: 'Primary checking account',
  },
  {
    id: 'acc-sav-9210',
    name: 'Savings',
    last4: '9210',
    type: 'Savings',
    balance: '$48,900.00',
    balanceLabel: 'Available balance',
    subtitle: 'High yield savings',
  },
  {
    id: 'acc-crd-1049',
    name: 'Business Credit',
    last4: '1049',
    type: 'Credit',
    balance: '$5,200.00',
    balanceLabel: 'Current balance',
    subtitle: 'Corporate credit line',
  },
]

const searchQuery = ref('')
const selectedBankId = ref<string | null>(props.initialBankId ?? null)
const selectedAccountId = ref<string>('acc-chk-4892')
const isConnecting = ref(false)
const isConnected = ref(false)

watch(
  () => props.initialBankId,
  (newId) => {
    if (newId) {
      selectedBankId.value = newId
    }
  },
)

const filteredInstitutions = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return institutions
  return institutions.filter((b) => b.name.toLowerCase().includes(query) || b.fullName.toLowerCase().includes(query))
})

const activeBank = computed(() => {
  if (!selectedBankId.value) return institutions[0]
  return (
    institutions.find((b) => b.id === selectedBankId.value) ?? {
      id: selectedBankId.value,
      name: searchQuery.value ? searchQuery.value : 'Custom Institution',
      fullName: 'Financial Institution',
      tagline: 'Direct Open Banking',
    }
  )
})

const selectedAccount = computed(() => {
  return accounts.find((a) => a.id === selectedAccountId.value) ?? accounts[0]
})

function handleSelectBank(bankId: string) {
  selectedBankId.value = bankId
  emit('select-bank', bankId)
}

function handleConnect() {
  if (!selectedBankId.value) {
    selectedBankId.value = institutions[0].id
    return
  }

  isConnecting.value = true
  setTimeout(() => {
    isConnecting.value = false
    isConnected.value = true
    emit('connect', {
      bankId: activeBank.value.id,
      bankName: activeBank.value.name,
      accountId: selectedAccount.value.id,
      accountName: selectedAccount.value.name,
      last4: selectedAccount.value.last4,
      balance: selectedAccount.value.balance,
    })
    setTimeout(() => {
      isConnected.value = false
    }, 2500)
  }, 900)
}

function handleCancel() {
  if (selectedBankId.value && !props.initialBankId) {
    selectedBankId.value = null
  }
  emit('cancel')
}
</script>

<template>
  <Card
    data-slot="bank-account-connector"
    :class="cn('mx-auto w-full max-w-lg overflow-hidden border shadow-sm', props.class)"
  >
    <CardContent class="space-y-5 p-6">
      <!-- Step 1: Institution Selection -->
      <div v-if="!selectedBankId" class="space-y-5">
        <!-- Header -->
        <div class="flex items-start gap-3.5">
          <div
            class="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 ring-4 ring-emerald-500/5 dark:bg-emerald-950/50 dark:text-emerald-400"
          >
            <Shield class="size-5" />
          </div>
          <div class="min-w-0 space-y-1">
            <h3 class="text-foreground text-base leading-tight font-semibold tracking-tight">
              Connect your bank account
            </h3>
            <p class="text-muted-foreground text-xs">Secure 256-bit encrypted connection powered by open banking.</p>
          </div>
        </div>

        <!-- Search input -->
        <div class="relative">
          <Input
            v-model="searchQuery"
            :prefix-icon="Search"
            placeholder="Search institutions (e.g. Chase, Wells Fargo)..."
            class="text-sm"
          />
        </div>

        <!-- Popular Institutions Grid -->
        <div class="space-y-2.5">
          <div class="flex items-center justify-between">
            <p class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Popular institutions</p>
            <span class="text-muted-foreground text-xs">10,000+ supported</span>
          </div>

          <div v-if="filteredInstitutions.length > 0" class="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            <button
              v-for="bank in filteredInstitutions"
              :key="bank.id"
              type="button"
              class="group border-border bg-card hover:border-primary/40 hover:bg-muted/40 focus-visible:ring-ring flex flex-col items-center justify-center rounded-xl border p-3.5 text-center transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              @click="handleSelectBank(bank.id)"
            >
              <div
                class="border-border/60 bg-muted/60 dark:bg-muted/30 mb-2 flex size-10 items-center justify-center rounded-lg border shadow-xs transition-transform group-hover:scale-105"
              >
                <!-- Chase -->
                <svg
                  v-if="bank.id === 'chase'"
                  viewBox="0 0 24 24"
                  class="size-5 shrink-0 text-[#117ACA]"
                  fill="currentColor"
                >
                  <path
                    d="M12 2.5L7.5 7h4.8L16.2 3.1 12 2.5zm9.5 9.5L17 7.5v4.8l3.9 3.9.6-4.2zm-9.5 9.5L16.5 17h-4.8L7.8 20.9l4.2.6zm-9.5-9.5L7 16.5v-4.8L3.1 7.8 2.5 12z"
                  />
                </svg>
                <!-- Bank of America -->
                <svg v-else-if="bank.id === 'bofa'" viewBox="0 0 24 24" class="size-5 shrink-0" fill="none">
                  <rect x="2" y="5" width="8" height="4" rx="1" fill="#E31837" />
                  <rect x="2" y="10.5" width="8" height="4" rx="1" fill="#002D62" />
                  <rect x="2" y="16" width="8" height="3" rx="0.5" fill="#E31837" />
                  <rect x="14" y="5" width="8" height="4" rx="1" fill="#002D62" />
                  <rect x="14" y="10.5" width="8" height="4" rx="1" fill="#E31837" />
                  <rect x="14" y="16" width="8" height="3" rx="0.5" fill="#002D62" />
                </svg>
                <!-- Wells Fargo -->
                <svg v-else-if="bank.id === 'wellsfargo'" viewBox="0 0 24 24" class="size-5 shrink-0" fill="none">
                  <rect width="24" height="24" rx="4" fill="#D71E28" />
                  <path
                    d="M4 7h2.2l1.6 7 1.8-7h2.1l1.8 7 1.6-7H17.5l-2.6 10h-2.2l-1.8-7-1.8 7H7.1L4 7z"
                    fill="#FFCC00"
                  />
                </svg>
                <!-- Citibank -->
                <svg v-else-if="bank.id === 'citibank'" viewBox="0 0 24 24" class="size-5 shrink-0" fill="none">
                  <path
                    d="M12 4.5C8 4.5 4.5 6.8 4 9.5h2.5c.5-1.5 3-2.5 5.5-2.5s5 1 5.5 2.5H20c-.5-2.7-4-5-8-5z"
                    fill="#EC111A"
                  />
                  <rect x="4" y="11" width="3" height="8" rx="0.5" fill="#003B70" />
                  <circle cx="12" cy="15" r="4" fill="#003B70" />
                  <rect x="17" y="11" width="3" height="8" rx="0.5" fill="#003B70" />
                </svg>
                <!-- Capital One -->
                <svg v-else-if="bank.id === 'capitalone'" viewBox="0 0 24 24" class="size-5 shrink-0" fill="none">
                  <rect width="24" height="24" rx="4" fill="#004879" />
                  <path d="M3.5 15.5C8 9.5 16 8 20.5 12c-5-2-12-1-15 3.5z" fill="#D03027" />
                  <rect x="7" y="9" width="10" height="2" rx="1" fill="#FFFFFF" />
                </svg>
                <!-- SVB -->
                <svg v-else-if="bank.id === 'svb'" viewBox="0 0 24 24" class="size-5 shrink-0" fill="none">
                  <rect width="24" height="24" rx="4" fill="#005587" />
                  <path d="M6 15l6-9 6 9-3 1.5-3-4.5-3 4.5L6 15z" fill="#FFFFFF" />
                  <path d="M9 16.5l3-4.5 3 4.5-3 1.5-3-1.5z" fill="#00A3E0" />
                </svg>
                <!-- Generic fallback -->
                <Building2 v-else class="text-muted-foreground size-5" />
              </div>

              <span class="text-foreground w-full truncate text-xs font-semibold">{{ bank.name }}</span>
              <span class="text-muted-foreground mt-0.5 w-full truncate text-xs">{{ bank.tagline }}</span>
            </button>
          </div>

          <!-- Direct search fallback for non-popular queries -->
          <div v-else class="border-border rounded-xl border border-dashed p-4 text-center">
            <p class="text-muted-foreground mb-2 text-xs">
              No popular bank matched "{{ searchQuery }}". Connect via direct institution link:
            </p>
            <Button
              size="sm"
              variant="outline"
              class="gap-1.5 text-xs"
              @click="handleSelectBank(searchQuery.toLowerCase().replace(/\s+/g, '-'))"
            >
              <Building2 class="text-muted-foreground size-3.5" />
              Connect with {{ searchQuery }}
            </Button>
          </div>
        </div>
      </div>

      <!-- Step 2: Account Selection Step -->
      <div v-else class="space-y-5">
        <!-- Back and Banner Header -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              class="text-muted-foreground hover:text-foreground -ml-2 h-7 gap-1 px-2 text-xs"
              @click="selectedBankId = null"
            >
              <ArrowLeft class="size-3.5" />
              Back to banks
            </Button>
            <span class="text-muted-foreground font-mono text-xs">Step 2 of 2</span>
          </div>

          <!-- Bank Banner -->
          <div class="border-border bg-muted/40 flex items-center justify-between rounded-xl border p-3.5">
            <div class="flex min-w-0 items-center gap-3">
              <div
                class="border-border/80 bg-background flex size-10 shrink-0 items-center justify-center rounded-lg border shadow-xs"
              >
                <!-- Chase -->
                <svg
                  v-if="activeBank.id === 'chase'"
                  viewBox="0 0 24 24"
                  class="size-5 shrink-0 text-[#117ACA]"
                  fill="currentColor"
                >
                  <path
                    d="M12 2.5L7.5 7h4.8L16.2 3.1 12 2.5zm9.5 9.5L17 7.5v4.8l3.9 3.9.6-4.2zm-9.5 9.5L16.5 17h-4.8L7.8 20.9l4.2.6zm-9.5-9.5L7 16.5v-4.8L3.1 7.8 2.5 12z"
                  />
                </svg>
                <!-- Bank of America -->
                <svg v-else-if="activeBank.id === 'bofa'" viewBox="0 0 24 24" class="size-5 shrink-0" fill="none">
                  <rect x="2" y="5" width="8" height="4" rx="1" fill="#E31837" />
                  <rect x="2" y="10.5" width="8" height="4" rx="1" fill="#002D62" />
                  <rect x="2" y="16" width="8" height="3" rx="0.5" fill="#E31837" />
                  <rect x="14" y="5" width="8" height="4" rx="1" fill="#002D62" />
                  <rect x="14" y="10.5" width="8" height="4" rx="1" fill="#E31837" />
                  <rect x="14" y="16" width="8" height="3" rx="0.5" fill="#002D62" />
                </svg>
                <!-- Wells Fargo -->
                <svg v-else-if="activeBank.id === 'wellsfargo'" viewBox="0 0 24 24" class="size-5 shrink-0" fill="none">
                  <rect width="24" height="24" rx="4" fill="#D71E28" />
                  <path
                    d="M4 7h2.2l1.6 7 1.8-7h2.1l1.8 7 1.6-7H17.5l-2.6 10h-2.2l-1.8-7-1.8 7H7.1L4 7z"
                    fill="#FFCC00"
                  />
                </svg>
                <!-- Citibank -->
                <svg v-else-if="activeBank.id === 'citibank'" viewBox="0 0 24 24" class="size-5 shrink-0" fill="none">
                  <path
                    d="M12 4.5C8 4.5 4.5 6.8 4 9.5h2.5c.5-1.5 3-2.5 5.5-2.5s5 1 5.5 2.5H20c-.5-2.7-4-5-8-5z"
                    fill="#EC111A"
                  />
                  <rect x="4" y="11" width="3" height="8" rx="0.5" fill="#003B70" />
                  <circle cx="12" cy="15" r="4" fill="#003B70" />
                  <rect x="17" y="11" width="3" height="8" rx="0.5" fill="#003B70" />
                </svg>
                <!-- Capital One -->
                <svg v-else-if="activeBank.id === 'capitalone'" viewBox="0 0 24 24" class="size-5 shrink-0" fill="none">
                  <rect width="24" height="24" rx="4" fill="#004879" />
                  <path d="M3.5 15.5C8 9.5 16 8 20.5 12c-5-2-12-1-15 3.5z" fill="#D03027" />
                  <rect x="7" y="9" width="10" height="2" rx="1" fill="#FFFFFF" />
                </svg>
                <!-- SVB -->
                <svg v-else-if="activeBank.id === 'svb'" viewBox="0 0 24 24" class="size-5 shrink-0" fill="none">
                  <rect width="24" height="24" rx="4" fill="#005587" />
                  <path d="M6 15l6-9 6 9-3 1.5-3-4.5-3 4.5L6 15z" fill="#FFFFFF" />
                  <path d="M9 16.5l3-4.5 3 4.5-3 1.5-3-1.5z" fill="#00A3E0" />
                </svg>
                <!-- Generic fallback -->
                <Building2 v-else class="text-muted-foreground size-5" />
              </div>

              <div class="min-w-0">
                <p class="text-foreground truncate text-sm font-semibold">
                  {{ activeBank.name }} Checking &amp; Savings
                </p>
                <div class="mt-0.5 flex items-center gap-1.5">
                  <span class="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                  <span class="text-xs font-medium text-emerald-600 dark:text-emerald-400">Connected</span>
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              class="text-muted-foreground hover:text-foreground h-7 shrink-0 text-xs"
              @click="selectedBankId = null"
            >
              Change
            </Button>
          </div>
        </div>

        <!-- Account Radio Cards -->
        <div class="space-y-2.5">
          <div class="space-y-1">
            <h4 class="text-foreground text-sm font-semibold">Select an account</h4>
            <p class="text-muted-foreground text-xs">
              Choose the primary account to link for transactions and balance tracking.
            </p>
          </div>

          <div role="radiogroup" aria-label="Bank accounts" class="space-y-2">
            <div
              v-for="account in accounts"
              :key="account.id"
              role="radio"
              :aria-checked="selectedAccountId === account.id"
              tabindex="0"
              class="group focus-visible:ring-ring relative flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              :class="[
                selectedAccountId === account.id
                  ? 'border-primary bg-primary/5 ring-primary/20 shadow-xs ring-1'
                  : 'border-border bg-card hover:border-border/80 hover:bg-muted/30',
              ]"
              @click="selectedAccountId = account.id"
              @keydown.enter.prevent="selectedAccountId = account.id"
              @keydown.space.prevent="selectedAccountId = account.id"
            >
              <div class="flex min-w-0 items-center gap-3">
                <!-- Custom Radio Indicator -->
                <div
                  class="flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors"
                  :class="[
                    selectedAccountId === account.id
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-muted-foreground/30 bg-background group-hover:border-muted-foreground/60',
                  ]"
                >
                  <div v-if="selectedAccountId === account.id" class="bg-primary-foreground size-1.5 rounded-full" />
                </div>

                <!-- Account Info -->
                <div class="min-w-0 space-y-0.5">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="text-foreground truncate text-sm font-medium">
                      {{ account.name }}
                    </span>
                    <span class="text-muted-foreground font-mono text-xs"> •••• {{ account.last4 }} </span>
                    <Badge
                      :variant="account.type === 'Credit' ? 'outline' : 'secondary'"
                      class="h-5 px-2 py-0 text-xs font-normal"
                    >
                      {{ account.type }}
                    </Badge>
                  </div>
                  <p class="text-muted-foreground text-xs">
                    {{ account.subtitle }}
                  </p>
                </div>
              </div>

              <!-- Balance -->
              <div class="shrink-0 pl-3 text-right">
                <div class="text-foreground font-mono text-sm font-semibold tabular-nums">
                  {{ account.balance }}
                </div>
                <div class="text-muted-foreground text-xs">
                  {{ account.balanceLabel }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Security Footer -->
      <div class="space-y-4 pt-2">
        <Separator />

        <div class="flex flex-wrap items-center justify-between gap-2">
          <Badge variant="outline" class="text-muted-foreground border-border/80 gap-1.5 py-1 text-xs font-normal">
            <Lock class="size-3 shrink-0 text-emerald-500" />
            <span>Encrypted with AES-256</span>
          </Badge>

          <a
            href="#"
            class="text-muted-foreground hover:text-foreground flex min-h-6 items-center gap-1 text-xs underline underline-offset-4 transition-colors"
            @click.prevent
          >
            Privacy policy
            <ExternalLink class="size-3" />
          </a>
        </div>

        <div class="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:items-center sm:justify-end">
          <Button
            variant="ghost"
            size="sm"
            class="text-muted-foreground hover:text-foreground h-9 text-xs"
            @click="handleCancel"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            class="h-9 text-xs font-medium"
            :disabled="isConnecting || isConnected"
            @click="handleConnect"
          >
            <Loader2 v-if="isConnecting" class="mr-1.5 size-3.5 animate-spin" />
            <CheckCircle2 v-else-if="isConnected" class="mr-1.5 size-3.5 text-emerald-400" />
            <span v-if="isConnected">Account Connected!</span>
            <span v-else-if="isConnecting">Connecting…</span>
            <span v-else-if="!selectedBankId">Continue</span>
            <span v-else>Connect Selected Account</span>
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
