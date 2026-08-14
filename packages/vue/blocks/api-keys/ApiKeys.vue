<script setup lang="ts">
import { computed, ref } from 'vue'
import { Check, Copy, Eye, EyeOff, KeyRound, Plus } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { SectionCard } from '@/components/ui/section-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type ApiKeyEnvironment = 'production' | 'staging' | 'development'

type ApiKeyStatus = 'active' | 'revoked' | 'expiring'

interface ApiKey {
  id: string
  name: string
  environment: ApiKeyEnvironment
  value: string
  createdAt: Date
  lastUsedAt: Date | null
  status: ApiKeyStatus
}

const props = withDefaults(
  defineProps<{
    /** Replacement seed data. Pass [] to start from the empty state. */
    initialKeys?: ApiKey[]
    initialCreateOpen?: boolean
    density?: 'default' | 'compact'
    class?: string
  }>(),
  {
    initialKeys: undefined,
    initialCreateOpen: false,
    density: 'default',
  },
)

const now = new Date()

function daysAgo(days: number): Date {
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
}

function hoursAgo(hours: number): Date {
  return new Date(now.getTime() - hours * 60 * 60 * 1000)
}

const stubKeys: ApiKey[] = [
  {
    id: 'key-prod-server',
    name: 'Production server',
    environment: 'production',
    value: 'uipkge_live_51HxQp9mZvKYlo2C4f2a',
    createdAt: daysAgo(94),
    lastUsedAt: hoursAgo(2),
    status: 'active',
  },
  {
    id: 'key-ci-pipeline',
    name: 'CI pipeline (GitHub Actions)',
    environment: 'staging',
    value: 'sk_stg_6JdRw3nAwLZmp7xQb91e',
    createdAt: daysAgo(41),
    lastUsedAt: hoursAgo(26),
    status: 'active',
  },
  {
    id: 'key-mobile-backend',
    name: 'Mobile app backend',
    environment: 'production',
    value: 'uipkge_live_8KfSx1oCyUZiqw9Ma2b7',
    createdAt: daysAgo(27),
    lastUsedAt: hoursAgo(5),
    status: 'expiring',
  },
  {
    id: 'key-local-dev',
    name: 'Local development',
    environment: 'development',
    value: 'sk_dev_k2MnQ8tReFvBgy5Xc40d',
    createdAt: daysAgo(12),
    lastUsedAt: daysAgo(3),
    status: 'active',
  },
  {
    id: 'key-legacy-webhooks',
    name: 'Legacy webhook integration',
    environment: 'production',
    value: 'uipkge_live_2PvBgR6nTxAokdJe5f8c',
    createdAt: daysAgo(210),
    lastUsedAt: daysAgo(64),
    status: 'revoked',
  },
]

const keys = ref<ApiKey[]>(
  props.initialKeys ? props.initialKeys.map((k) => ({ ...k })) : stubKeys.map((k) => ({ ...k })),
)

const dense = computed(() => props.density === 'compact')

const statusMeta: Record<ApiKeyStatus, { label: string; variant: 'success' | 'warning' | 'destructive' }> = {
  active: { label: 'Active', variant: 'success' },
  expiring: { label: 'Expires soon', variant: 'warning' },
  revoked: { label: 'Revoked', variant: 'destructive' },
}

function maskKeyValue(value: string): string {
  const parts = value.split('_')
  const prefix = parts.length > 2 ? `${parts[0]}_${parts[1]}_` : ''
  return `${prefix}••••••••${value.slice(-4)}`
}

function formatDate(d: Date): string {
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function lastUsedText(d: Date | null): string {
  if (!d) return 'Never'
  const minutes = Math.max(1, Math.round((now.getTime() - d.getTime()) / 60000))
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.round(hours / 24)}d ago`
}

const revealed = ref<Record<string, boolean>>({})

function toggleRevealed(id: string) {
  revealed.value[id] = !revealed.value[id]
}

const copiedId = ref<string | null>(null)
let copyTimer: number | undefined

async function copyKey(key: ApiKey) {
  try {
    await navigator.clipboard.writeText(key.value)
    copiedId.value = key.id
    window.clearTimeout(copyTimer)
    copyTimer = window.setTimeout(() => {
      copiedId.value = null
    }, 1600)
  } catch {
    // Clipboard unavailable (e.g. insecure context) — skip the feedback swap.
  }
}

const confirmingId = ref<string | null>(null)
let confirmTimer: number | undefined

function requestRevoke(id: string) {
  if (confirmingId.value === id) {
    revokeKey(id)
    return
  }
  confirmingId.value = id
  window.clearTimeout(confirmTimer)
  confirmTimer = window.setTimeout(() => {
    confirmingId.value = null
  }, 3000)
}

function cancelRevoke(id: string) {
  if (confirmingId.value === id) {
    window.clearTimeout(confirmTimer)
    confirmingId.value = null
  }
}

function revokeKey(id: string) {
  window.clearTimeout(confirmTimer)
  confirmingId.value = null
  const key = keys.value.find((k) => k.id === id)
  if (key) key.status = 'revoked'
}

const createOpen = ref(props.initialCreateOpen)
const newName = ref('')
const newEnv = ref<ApiKeyEnvironment>('production')

function setCreateOpen(open: boolean) {
  createOpen.value = open
  if (open) {
    newName.value = ''
    newEnv.value = 'production'
  }
}

function createKey() {
  const name = newName.value.trim()
  if (!name) return
  const prefix = { production: 'uipkge_live_', staging: 'sk_stg_', development: 'sk_dev_' }[newEnv.value]
  const random = Array.from({ length: 2 }, () => Math.random().toString(36).slice(2, 14)).join('')
  keys.value.unshift({
    id: `key-${Date.now()}`,
    name,
    environment: newEnv.value,
    value: `${prefix}${random}`,
    createdAt: new Date(),
    lastUsedAt: null,
    status: 'active',
  })
  setCreateOpen(false)
}
</script>

<template>
  <div data-slot="api-keys" :class="cn('w-full', props.class)">
    <SectionCard title="API Keys" description="Secret keys used to authenticate requests to your API.">
      <template #header-action>
        <Button size="sm" @click="setCreateOpen(true)">
          <Plus class="size-4" />
          Create key
        </Button>
      </template>

      <div v-if="keys.length === 0" class="flex flex-col items-center justify-center px-6 py-14 text-center">
        <div class="bg-muted text-muted-foreground mx-auto grid size-12 place-items-center rounded-full">
          <KeyRound class="size-5" />
        </div>
        <p class="mt-3 text-sm font-medium">No API keys yet</p>
        <p class="text-muted-foreground mt-0.5 max-w-xs text-xs">
          Create a key to start authenticating requests against your API.
        </p>
        <Button size="sm" class="mt-4" @click="setCreateOpen(true)">Create your first key</Button>
      </div>

      <ul v-else class="-my-4 divide-y">
        <li
          v-for="key in keys"
          :key="key.id"
          class="flex items-center gap-3 sm:gap-4"
          :class="dense ? 'py-2.5' : 'py-4'"
        >
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <p class="truncate text-sm font-medium">{{ key.name }}</p>
              <Badge :variant="statusMeta[key.status].variant">{{ statusMeta[key.status].label }}</Badge>
            </div>
            <p class="text-muted-foreground mt-0.5 truncate text-xs">
              Created {{ formatDate(key.createdAt) }} · Last used {{ lastUsedText(key.lastUsedAt) }}
            </p>
          </div>

          <code class="bg-muted hidden shrink-0 rounded px-2 py-1 font-mono text-xs md:block">
            {{ revealed[key.id] ? key.value : maskKeyValue(key.value) }}
          </code>

          <div class="flex shrink-0 items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              :aria-label="revealed[key.id] ? 'Hide key value' : 'Reveal key value'"
              @click="toggleRevealed(key.id)"
            >
              <EyeOff v-if="revealed[key.id]" class="size-4" />
              <Eye v-else class="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              :aria-label="copiedId === key.id ? 'Copied' : 'Copy key value'"
              @click="copyKey(key)"
            >
              <Check v-if="copiedId === key.id" class="text-success size-4" />
              <Copy v-else class="text-muted-foreground size-4" />
            </Button>
            <Button
              v-if="key.status !== 'revoked'"
              size="sm"
              :variant="confirmingId === key.id ? 'destructive' : 'ghost'"
              :class="confirmingId === key.id ? '' : 'text-muted-foreground hover:text-destructive'"
              @click="requestRevoke(key.id)"
              @blur="cancelRevoke(key.id)"
            >
              {{ confirmingId === key.id ? 'Confirm?' : 'Revoke' }}
            </Button>
          </div>
        </li>
      </ul>
    </SectionCard>

    <Dialog :open="createOpen" @update:open="setCreateOpen">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create API key</DialogTitle>
          <DialogDescription>
            Generate a new secret key. The full value is only shown once — store it somewhere safe.
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-2">
          <div class="grid gap-1.5">
            <label for="api-key-name" class="text-sm leading-none font-medium">Name</label>
            <Input id="api-key-name" v-model="newName" placeholder="e.g. Production server" @keyup.enter="createKey" />
          </div>
          <div class="grid gap-1.5">
            <label for="api-key-environment" class="text-sm leading-none font-medium">Environment</label>
            <Select v-model="newEnv">
              <SelectTrigger id="api-key-environment" class="w-full">
                <SelectValue placeholder="Choose an environment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="production">Production</SelectItem>
                <SelectItem value="staging">Staging</SelectItem>
                <SelectItem value="development">Development</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="setCreateOpen(false)">Cancel</Button>
          <Button :disabled="!newName.trim()" @click="createKey">Create key</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
