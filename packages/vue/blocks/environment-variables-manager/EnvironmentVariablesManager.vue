<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, ref } from 'vue'
import {
  AlertCircle,
  Check,
  Copy,
  Download,
  Eye,
  EyeOff,
  FileCode,
  KeyRound,
  Lock,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  Upload,
  X,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

export type EnvironmentScope = 'production' | 'preview' | 'development'
export type EnvVarTypeFilter = 'all' | 'secret' | 'plain'

export interface EnvironmentVariable {
  id: string
  key: string
  value: string
  environments: EnvironmentScope[]
  isSecret: boolean
  updatedAt: string
  updatedBy: string
}

const defaultVariables: EnvironmentVariable[] = [
  {
    id: 'env-1',
    key: 'DATABASE_URL',
    value: 'postgresql://postgres:p4ssw0rd_secure_vault@db.prod.aws.internal:5432/primary_db',
    environments: ['production', 'preview', 'development'],
    isSecret: true,
    updatedAt: 'Updated 2h ago',
    updatedBy: 'alex.chen',
  },
  {
    id: 'env-2',
    key: 'STRIPE_SECRET_KEY',
    value: 'mock_key_51NwY2xK9mPqL8vR4tZa0bCeFgHiJkLmNoPqRsTuVwXyZ',
    environments: ['production'],
    isSecret: true,
    updatedAt: 'Updated 3d ago',
    updatedBy: 'sarah.dev',
  },
  {
    id: 'env-3',
    key: 'NEXT_PUBLIC_APP_URL',
    value: 'https://app.uipkge.dev',
    environments: ['production', 'preview', 'development'],
    isSecret: false,
    updatedAt: 'Updated 5d ago',
    updatedBy: 'uday.craft',
  },
  {
    id: 'env-4',
    key: 'REDIS_PASSWORD',
    value: 'redis_auth_98f4b6201e9d4a87b32c',
    environments: ['production', 'preview'],
    isSecret: true,
    updatedAt: 'Updated 1w ago',
    updatedBy: 'alex.chen',
  },
  {
    id: 'env-5',
    key: 'SENTRY_DSN',
    value: 'https://o45089@sentry.io/45089234871923',
    environments: ['production', 'preview', 'development'],
    isSecret: false,
    updatedAt: 'Updated 2w ago',
    updatedBy: 'sarah.dev',
  },
  {
    id: 'env-6',
    key: 'AWS_SECRET_ACCESS_KEY',
    value: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
    environments: ['production'],
    isSecret: true,
    updatedAt: 'Updated 1mo ago',
    updatedBy: 'infra-bot',
  },
]

interface Props {
  initialVariables?: EnvironmentVariable[]
  initialAddOpen?: boolean
  initialImportOpen?: boolean
  defaultEnvironment?: 'all' | EnvironmentScope
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  initialVariables: undefined,
  initialAddOpen: false,
  initialImportOpen: false,
  defaultEnvironment: 'all',
})

const variables = ref<EnvironmentVariable[]>(
  props.initialVariables ? props.initialVariables.map((v) => ({ ...v })) : defaultVariables.map((v) => ({ ...v })),
)

const activeTab = ref<'all' | EnvironmentScope>(props.defaultEnvironment)
const searchQuery = ref('')
const typeFilter = ref<EnvVarTypeFilter>('all')
const revealAll = ref(false)
const revealedMap = ref<Record<string, boolean>>({})

const isAddOpen = ref(props.initialAddOpen)
const isImportOpen = ref(props.initialImportOpen)
const editingVariable = ref<EnvironmentVariable | null>(null)

// Add variable state
const newKey = ref('')
const newValue = ref('')
const newIsSecret = ref(true)
const newEnvs = ref<EnvironmentScope[]>(['production', 'preview', 'development'])

// Import state
const importText = ref('')
const importEnvs = ref<EnvironmentScope[]>(['production', 'preview', 'development'])
const importEncryptAll = ref(true)

// Copy state
const copiedId = ref<string | null>(null)
let copyTimer: number | undefined

// Filtered variables
const filteredVariables = computed(() => {
  return variables.value.filter((item) => {
    // Environment filter
    if (activeTab.value !== 'all' && !item.environments.includes(activeTab.value)) {
      return false
    }

    // Type filter
    if (typeFilter.value === 'secret' && !item.isSecret) return false
    if (typeFilter.value === 'plain' && item.isSecret) return false

    // Search query
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim()
      const keyMatch = item.key.toLowerCase().includes(q)
      const authorMatch = item.updatedBy.toLowerCase().includes(q)
      if (!keyMatch && !authorMatch) return false
    }

    return true
  })
})

const counts = computed(() => {
  return {
    all: variables.value.length,
    production: variables.value.filter((v) => v.environments.includes('production')).length,
    preview: variables.value.filter((v) => v.environments.includes('preview')).length,
    development: variables.value.filter((v) => v.environments.includes('development')).length,
  }
})

function isRevealed(id: string): boolean {
  if (revealAll.value) return true
  return Boolean(revealedMap.value[id])
}

function toggleReveal(id: string) {
  revealedMap.value[id] = !revealedMap.value[id]
}

function toggleRevealAll() {
  revealAll.value = !revealAll.value
  if (!revealAll.value) {
    revealedMap.value = {}
  }
}

async function copyValue(text: string, id: string) {
  try {
    await navigator.clipboard.writeText(text)
    copiedId.value = id
    window.clearTimeout(copyTimer)
    copyTimer = window.setTimeout(() => {
      copiedId.value = null
    }, 1600)
  } catch {
    // Clipboard fallback
  }
}

function toggleNewEnv(env: EnvironmentScope) {
  if (newEnvs.value.includes(env)) {
    if (newEnvs.value.length > 1) {
      newEnvs.value = newEnvs.value.filter((e) => e !== env)
    }
  } else {
    newEnvs.value = [...newEnvs.value, env]
  }
}

function resetAddForm() {
  newKey.value = ''
  newValue.value = ''
  newIsSecret.value = true
  newEnvs.value = ['production', 'preview', 'development']
  isAddOpen.value = false
}

function handleAddVariable() {
  const key = newKey.value.trim().toUpperCase()
  const val = newValue.value.trim()
  if (!key || !val) return

  const newVar: EnvironmentVariable = {
    id: `env-${Date.now()}`,
    key,
    value: val,
    environments: [...newEnvs.value],
    isSecret: newIsSecret.value,
    updatedAt: 'Just now',
    updatedBy: 'you',
  }

  variables.value.unshift(newVar)
  resetAddForm()
}

function handleDuplicate(item: EnvironmentVariable) {
  const duplicateVar: EnvironmentVariable = {
    ...item,
    id: `env-${Date.now()}`,
    key: `${item.key}_COPY`,
    updatedAt: 'Just now',
    updatedBy: 'you',
  }
  const index = variables.value.findIndex((v) => v.id === item.id)
  if (index >= 0) {
    variables.value.splice(index + 1, 0, duplicateVar)
  } else {
    variables.value.unshift(duplicateVar)
  }
}

function handleDelete(id: string) {
  variables.value = variables.value.filter((v) => v.id !== id)
}

function openEdit(item: EnvironmentVariable) {
  editingVariable.value = {
    ...item,
    environments: [...item.environments],
  }
}

function saveEdit() {
  if (!editingVariable.value) return
  const key = editingVariable.value.key.trim().toUpperCase()
  const val = editingVariable.value.value.trim()
  if (!key || !val) return

  const index = variables.value.findIndex((v) => v.id === editingVariable.value?.id)
  if (index >= 0) {
    variables.value[index] = {
      ...editingVariable.value,
      key,
      value: val,
      updatedAt: 'Just now',
      updatedBy: 'you',
    }
  }
  editingVariable.value = null
}

function toggleEditEnv(env: EnvironmentScope) {
  if (!editingVariable.value) return
  const current = editingVariable.value.environments
  if (current.includes(env)) {
    if (current.length > 1) {
      editingVariable.value.environments = current.filter((e) => e !== env)
    }
  } else {
    editingVariable.value.environments = [...current, env]
  }
}

function toggleImportEnv(env: EnvironmentScope) {
  if (importEnvs.value.includes(env)) {
    if (importEnvs.value.length > 1) {
      importEnvs.value = importEnvs.value.filter((e) => e !== env)
    }
  } else {
    importEnvs.value = [...importEnvs.value, env]
  }
}

const parsedImportItems = computed(() => {
  if (!importText.value.trim()) return []
  const lines = importText.value.split('\n')
  const results: { key: string; value: string; isSecret: boolean }[] = []

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const eqIdx = line.indexOf('=')
    if (eqIdx > 0) {
      const k = line.slice(0, eqIdx).trim().toUpperCase()
      let v = line.slice(eqIdx + 1).trim()
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1)
      }
      if (k) {
        const isSecret =
          importEncryptAll.value ||
          k.includes('SECRET') ||
          k.includes('KEY') ||
          k.includes('PASSWORD') ||
          k.includes('TOKEN') ||
          k.includes('PRIVATE') ||
          k.includes('AUTH')
        results.push({ key: k, value: v, isSecret })
      }
    }
  }
  return results
})

function handleImport() {
  const items = parsedImportItems.value
  if (items.length === 0) return

  const newVars: EnvironmentVariable[] = items.map((item, index) => ({
    id: `env-imported-${Date.now()}-${index}`,
    key: item.key,
    value: item.value,
    environments: [...importEnvs.value],
    isSecret: item.isSecret,
    updatedAt: 'Imported just now',
    updatedBy: 'you',
  }))

  variables.value = [...newVars, ...variables.value]
  importText.value = ''
  isImportOpen.value = false
}

function exportEnvFile() {
  const lines = variables.value.map((v) => `# ${v.environments.join(', ')}\n${v.key}=${v.value}`)
  const blob = new Blob([lines.join('\n\n')], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = '.env.production'
  a.click()
  URL.revokeObjectURL(url)
}

function maskString(val: string): string {
  if (val.length <= 12) return '••••••••••••'
  return '••••••••••••••••••••'
}
</script>

<template>
  <div data-slot="environment-variables-manager" :class="cn('w-full space-y-6', props.class)">
    <!-- Header Section -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="space-y-1">
        <div class="flex items-center gap-2.5">
          <div class="bg-primary/10 text-primary grid size-8 place-items-center rounded-lg border">
            <KeyRound class="size-4" />
          </div>
          <h2 class="text-xl font-semibold tracking-tight sm:text-2xl">Environment Variables</h2>
        </div>
        <p class="text-muted-foreground text-sm">
          Manage encrypted secrets, API keys, and configuration for your deployments.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" class="gap-1.5 shadow-xs" @click="isImportOpen = true">
          <Upload class="size-3.5" />
          <span>Import .env</span>
        </Button>
        <Button
          aria-label="Download attachment"
          variant="outline"
          size="sm"
          class="gap-1.5 shadow-xs"
          @click="exportEnvFile"
        >
          <Download class="size-3.5" />
          <span>Export</span>
        </Button>
        <Button
          size="sm"
          class="gap-1.5 shadow-xs"
          :variant="isAddOpen ? 'secondary' : 'default'"
          @click="isAddOpen = !isAddOpen"
        >
          <Plus v-if="!isAddOpen" class="size-4" />
          <X v-else class="size-4" />
          <span>{{ isAddOpen ? 'Close Form' : 'Add Variable' }}</span>
        </Button>
      </div>
    </div>

    <!-- Add Variable Expandable Card -->
    <Card v-if="isAddOpen" class="border-primary/30 bg-card/60 relative shadow-sm">
      <CardHeader class="pb-3">
        <div class="flex items-center justify-between">
          <div>
            <CardTitle class="text-base font-semibold">New Environment Variable</CardTitle>
            <CardDescription class="text-xs">
              Add a new secret key or configuration parameter to your environment scopes.
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon-sm" aria-label="Cancel adding variable" @click="resetAddForm">
            <X class="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div class="space-y-1.5">
            <label class="text-foreground text-xs font-medium">Variable Key</label>
            <Input
              v-model="newKey"
              placeholder="e.g. STRIPE_SECRET_KEY"
              class="font-mono text-xs uppercase"
              @keydown.enter="handleAddVariable"
            />
            <p class="text-muted-foreground text-xs">Uppercase characters and underscores recommended.</p>
          </div>
          <div class="space-y-1.5">
            <label class="text-foreground text-xs font-medium">Variable Value</label>
            <Input
              v-model="newValue"
              :type="newIsSecret ? 'password' : 'text'"
              placeholder="Enter secret token or value..."
              class="font-mono text-xs"
              @keydown.enter="handleAddVariable"
            />
            <p class="text-muted-foreground text-xs">Values are encrypted at rest with AES-256-GCM.</p>
          </div>
        </div>

        <div class="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
          <div class="space-y-2">
            <span class="text-foreground text-xs font-medium">Environment Scopes</span>
            <div class="flex flex-wrap items-center gap-3">
              <label
                class="hover:bg-accent/50 flex cursor-pointer items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs transition-colors select-none"
                :class="newEnvs.includes('production') ? 'border-emerald-500/40 bg-emerald-500/5' : ''"
              >
                <Checkbox
                  :model-value="newEnvs.includes('production')"
                  @update:model-value="toggleNewEnv('production')"
                />
                <span class="font-medium text-emerald-600 dark:text-emerald-400">Production</span>
              </label>
              <label
                class="hover:bg-accent/50 flex cursor-pointer items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs transition-colors select-none"
                :class="newEnvs.includes('preview') ? 'border-blue-500/40 bg-blue-500/5' : ''"
              >
                <Checkbox :model-value="newEnvs.includes('preview')" @update:model-value="toggleNewEnv('preview')" />
                <span class="font-medium text-blue-600 dark:text-blue-400">Preview</span>
              </label>
              <label
                class="hover:bg-accent/50 flex cursor-pointer items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs transition-colors select-none"
                :class="newEnvs.includes('development') ? 'border-purple-500/40 bg-purple-500/5' : ''"
              >
                <Checkbox
                  :model-value="newEnvs.includes('development')"
                  @update:model-value="toggleNewEnv('development')"
                />
                <span class="font-medium text-purple-600 dark:text-purple-400">Development</span>
              </label>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <Checkbox
              id="new-is-secret"
              :model-value="newIsSecret"
              @update:model-value="newIsSecret = $event === true"
            />
            <label for="new-is-secret" class="cursor-pointer text-xs font-medium select-none">
              Encrypt as Secret
            </label>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 border-t pt-3">
          <Button aria-label="Cancel adding variable" variant="ghost" size="sm" @click="resetAddForm">Cancel</Button>
          <Button size="sm" :disabled="!newKey.trim() || !newValue.trim()" @click="handleAddVariable">
            Save Variable
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Environment Tabs & Search / Filter Controls -->
    <div class="space-y-3">
      <Tabs v-model="activeTab" class="w-full">
        <TabsList class="w-full justify-start overflow-x-auto sm:w-auto">
          <TabsTrigger value="all" class="text-xs">
            All Environments
            <Badge variant="secondary" class="ml-1.5 px-1.5 py-0 text-xs font-semibold">{{ counts.all }}</Badge>
          </TabsTrigger>
          <TabsTrigger value="production" class="text-xs">
            Production
            <Badge variant="secondary" class="ml-1.5 px-1.5 py-0 text-xs font-semibold">{{ counts.production }}</Badge>
          </TabsTrigger>
          <TabsTrigger value="preview" class="text-xs">
            Preview
            <Badge variant="secondary" class="ml-1.5 px-1.5 py-0 text-xs font-semibold">{{ counts.preview }}</Badge>
          </TabsTrigger>
          <TabsTrigger value="development" class="text-xs">
            Development
            <Badge variant="secondary" class="ml-1.5 px-1.5 py-0 text-xs font-semibold">{{ counts.development }}</Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div class="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex flex-1 flex-wrap items-center gap-2">
          <div class="relative max-w-sm min-w-[200px] flex-1">
            <Search
              class="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2"
            />
            <Input
              v-model="searchQuery"
              placeholder="Search variables by key..."
              class="h-8.5 pl-8 text-xs shadow-xs"
            />
          </div>

          <Select v-model="typeFilter">
            <SelectTrigger class="h-8.5 w-[140px] text-xs shadow-xs">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="secret">Encrypted Secrets</SelectItem>
              <SelectItem value="plain">Plaintext</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            class="h-8.5 gap-1.5 text-xs shadow-xs"
            :class="revealAll ? 'border-primary text-primary' : ''"
            @click="toggleRevealAll"
          >
            <EyeOff v-if="revealAll" class="size-3.5" />
            <Eye v-else class="size-3.5" />
            <span>{{ revealAll ? 'Hide All' : 'Reveal All Values' }}</span>
          </Button>
        </div>
      </div>
    </div>

    <!-- Variables Table -->
    <div class="bg-card overflow-hidden rounded-lg border shadow-xs">
      <div class="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow class="bg-muted/40 hover:bg-muted/40">
              <TableHead class="text-muted-foreground text-xs font-medium">Variable Key</TableHead>
              <TableHead class="text-muted-foreground text-xs font-medium">Value</TableHead>
              <TableHead class="text-muted-foreground text-xs font-medium">Environments</TableHead>
              <TableHead class="text-muted-foreground text-xs font-medium">Type</TableHead>
              <TableHead class="text-muted-foreground hidden text-xs font-medium md:table-cell">Updated</TableHead>
              <TableHead class="w-[70px] text-right text-xs font-medium">
                <span class="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="item in filteredVariables"
              :key="item.id"
              class="group hover:bg-muted/30 transition-colors"
            >
              <!-- Key -->
              <TableCell class="py-3.5">
                <div class="flex items-center gap-2">
                  <span class="text-foreground font-mono text-xs font-semibold tracking-tight select-all sm:text-sm">
                    {{ item.key }}
                  </span>
                  <button
                    type="button"
                    aria-label="Copy variable key"
                    class="text-muted-foreground hover:text-foreground opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                    @click="copyValue(item.key, `key-${item.id}`)"
                  >
                    <Check v-if="copiedId === `key-${item.id}`" class="text-success size-3.5" />
                    <Copy v-else class="size-3.5" />
                  </button>
                </div>
              </TableCell>

              <!-- Value Mask / Plain -->
              <TableCell class="py-3.5">
                <div class="flex max-w-[280px] items-center gap-1.5 sm:max-w-xs md:max-w-sm">
                  <code
                    class="bg-muted/60 text-foreground max-w-[200px] min-w-0 truncate rounded border px-2 py-1 font-mono text-xs sm:max-w-[240px]"
                    :title="isRevealed(item.id) ? item.value : 'Masked secret value'"
                  >
                    {{ isRevealed(item.id) ? item.value : maskString(item.value) }}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    class="text-muted-foreground hover:text-foreground size-7 shrink-0"
                    :aria-label="isRevealed(item.id) ? 'Hide value' : 'Reveal value'"
                    @click="toggleReveal(item.id)"
                  >
                    <EyeOff v-if="isRevealed(item.id)" class="size-3.5" />
                    <Eye v-else class="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    class="text-muted-foreground hover:text-foreground size-7 shrink-0"
                    :aria-label="copiedId === item.id ? 'Copied' : 'Copy value'"
                    @click="copyValue(item.value, item.id)"
                  >
                    <Check v-if="copiedId === item.id" class="text-success size-3.5" />
                    <Copy v-else class="size-3.5" />
                  </Button>
                </div>
              </TableCell>

              <!-- Environments -->
              <TableCell class="py-3.5">
                <div class="flex flex-wrap items-center gap-1">
                  <Badge
                    v-if="item.environments.includes('production')"
                    variant="outline"
                    class="border-emerald-500/30 bg-emerald-500/10 px-2 py-0 text-xs font-medium text-emerald-700 dark:text-emerald-400"
                  >
                    Production
                  </Badge>
                  <Badge
                    v-if="item.environments.includes('preview')"
                    variant="outline"
                    class="border-blue-500/30 bg-blue-500/10 px-2 py-0 text-xs font-medium text-blue-700 dark:text-blue-400"
                  >
                    Preview
                  </Badge>
                  <Badge
                    v-if="item.environments.includes('development')"
                    variant="outline"
                    class="border-purple-500/30 bg-purple-500/10 px-2 py-0 text-xs font-medium text-purple-700 dark:text-purple-400"
                  >
                    Development
                  </Badge>
                </div>
              </TableCell>

              <!-- Type -->
              <TableCell class="py-3.5">
                <Badge
                  v-if="item.isSecret"
                  variant="secondary"
                  class="gap-1 border-amber-500/30 bg-amber-500/10 px-2 py-0 text-xs font-medium text-amber-700 dark:text-amber-400"
                >
                  <Lock class="size-3" />
                  Encrypted Secret
                </Badge>
                <Badge v-else variant="outline" class="text-muted-foreground gap-1 px-2 py-0 text-xs font-medium">
                  <FileCode class="size-3" />
                  Plaintext
                </Badge>
              </TableCell>

              <!-- Updated -->
              <TableCell class="text-muted-foreground hidden py-3.5 text-xs whitespace-nowrap md:table-cell">
                <span>{{ item.updatedAt }}</span>
                <span class="block text-xs opacity-75">by {{ item.updatedBy }}</span>
              </TableCell>

              <!-- Actions Dropdown -->
              <TableCell class="py-3.5 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button variant="ghost" size="icon-sm" class="text-muted-foreground hover:text-foreground size-8">
                      <MoreHorizontal class="size-4" />
                      <span class="sr-only">Actions for {{ item.key }}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" class="w-44 text-xs">
                    <DropdownMenuItem @click="openEdit(item)">
                      <Pencil class="mr-2 size-3.5" />
                      <span>Edit variable</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="handleDuplicate(item)">
                      <Copy class="mr-2 size-3.5" />
                      <span>Duplicate</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="copyValue(item.value, item.id)">
                      <Check v-if="copiedId === item.id" class="mr-2 size-3.5 text-emerald-500" />
                      <Copy v-else class="mr-2 size-3.5" />
                      <span>Copy value</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem class="text-destructive focus:text-destructive" @click="handleDelete(item.id)">
                      <Trash2 class="mr-2 size-3.5" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>

            <!-- Empty State -->
            <TableRow v-if="filteredVariables.length === 0">
              <TableCell colspan="6" class="h-44 text-center">
                <div class="flex flex-col items-center justify-center space-y-2 py-6">
                  <div class="bg-muted text-muted-foreground grid size-10 place-items-center rounded-full border">
                    <AlertCircle class="size-5" />
                  </div>
                  <p class="text-foreground text-sm font-medium">No environment variables found</p>
                  <p class="text-muted-foreground max-w-xs text-xs">
                    {{
                      searchQuery || typeFilter !== 'all' || activeTab !== 'all'
                        ? 'Try adjusting your filters or search keywords.'
                        : 'Add your first environment secret or configuration key.'
                    }}
                  </p>
                  <Button
                    v-if="!searchQuery && typeFilter === 'all' && activeTab === 'all'"
                    size="sm"
                    class="mt-2 text-xs"
                    @click="isAddOpen = true"
                  >
                    <Plus class="mr-1.5 size-3.5" />
                    Add Variable
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>

    <!-- Edit Variable Dialog -->
    <Dialog :open="Boolean(editingVariable)" @update:open="(open) => !open && (editingVariable = null)">
      <DialogContent v-if="editingVariable" class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Environment Variable</DialogTitle>
          <DialogDescription> Update variable value and configured environment scopes. </DialogDescription>
        </DialogHeader>
        <div class="space-y-4 py-2">
          <div class="space-y-1.5">
            <label class="text-xs font-medium">Variable Key</label>
            <Input v-model="editingVariable.key" class="font-mono text-xs uppercase" />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-medium">Variable Value</label>
            <Input
              v-model="editingVariable.value"
              :type="editingVariable.isSecret ? 'password' : 'text'"
              class="font-mono text-xs"
            />
          </div>

          <div class="space-y-2">
            <span class="text-xs font-medium">Environments</span>
            <div class="flex flex-wrap items-center gap-2">
              <label
                class="hover:bg-accent/50 flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs select-none"
                :class="
                  editingVariable.environments.includes('production') ? 'border-emerald-500/40 bg-emerald-500/5' : ''
                "
              >
                <Checkbox
                  :model-value="editingVariable.environments.includes('production')"
                  @update:model-value="toggleEditEnv('production')"
                />
                <span class="font-medium text-emerald-600 dark:text-emerald-400">Production</span>
              </label>
              <label
                class="hover:bg-accent/50 flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs select-none"
                :class="editingVariable.environments.includes('preview') ? 'border-blue-500/40 bg-blue-500/5' : ''"
              >
                <Checkbox
                  :model-value="editingVariable.environments.includes('preview')"
                  @update:model-value="toggleEditEnv('preview')"
                />
                <span class="font-medium text-blue-600 dark:text-blue-400">Preview</span>
              </label>
              <label
                class="hover:bg-accent/50 flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs select-none"
                :class="
                  editingVariable.environments.includes('development') ? 'border-purple-500/40 bg-purple-500/5' : ''
                "
              >
                <Checkbox
                  :model-value="editingVariable.environments.includes('development')"
                  @update:model-value="toggleEditEnv('development')"
                />
                <span class="font-medium text-purple-600 dark:text-purple-400">Development</span>
              </label>
            </div>
          </div>

          <div class="flex items-center gap-2 pt-1">
            <Checkbox
              id="edit-is-secret"
              :model-value="editingVariable.isSecret"
              @update:model-value="editingVariable.isSecret = $event === true"
            />
            <label for="edit-is-secret" class="cursor-pointer text-xs font-medium select-none">
              Encrypt as Secret
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" size="sm" @click="editingVariable = null">Cancel</Button>
          <Button size="sm" @click="saveEdit">Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Import .env Dialog -->
    <Dialog :open="isImportOpen" @update:open="(open) => (isImportOpen = open)">
      <DialogContent class="sm:max-w-lg">
        <DialogHeader>
          <div class="flex items-center gap-2">
            <div class="bg-primary/10 text-primary grid size-7 place-items-center rounded-md border">
              <Upload class="size-3.5" />
            </div>
            <DialogTitle>Import .env File</DialogTitle>
          </div>
          <DialogDescription>
            Paste your raw .env, .env.local, or .env.production file contents to bulk add variables.
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-4 py-2">
          <div class="space-y-1.5">
            <label class="text-xs font-medium">.env File Content</label>
            <Textarea
              v-model="importText"
              rows="6"
              placeholder="DATABASE_URL=postgresql://user:pass@host:5432/db&#10;STRIPE_SECRET_KEY=mock_key_...&#10;NEXT_PUBLIC_APP_URL=https://app.example.com"
              class="font-mono text-xs"
            />
          </div>

          <div class="space-y-2">
            <span class="text-xs font-medium">Assign to Environments</span>
            <div class="flex flex-wrap items-center gap-2">
              <label
                class="hover:bg-accent/50 flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs select-none"
                :class="importEnvs.includes('production') ? 'border-emerald-500/40 bg-emerald-500/5' : ''"
              >
                <Checkbox
                  :model-value="importEnvs.includes('production')"
                  @update:model-value="toggleImportEnv('production')"
                />
                <span class="font-medium text-emerald-600 dark:text-emerald-400">Production</span>
              </label>
              <label
                class="hover:bg-accent/50 flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs select-none"
                :class="importEnvs.includes('preview') ? 'border-blue-500/40 bg-blue-500/5' : ''"
              >
                <Checkbox
                  :model-value="importEnvs.includes('preview')"
                  @update:model-value="toggleImportEnv('preview')"
                />
                <span class="font-medium text-blue-600 dark:text-blue-400">Preview</span>
              </label>
              <label
                class="hover:bg-accent/50 flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs select-none"
                :class="importEnvs.includes('development') ? 'border-purple-500/40 bg-purple-500/5' : ''"
              >
                <Checkbox
                  :model-value="importEnvs.includes('development')"
                  @update:model-value="toggleImportEnv('development')"
                />
                <span class="font-medium text-purple-600 dark:text-purple-400">Development</span>
              </label>
            </div>
          </div>

          <div class="flex items-center gap-2 pt-1">
            <Checkbox
              id="import-encrypt-all"
              :model-value="importEncryptAll"
              @update:model-value="importEncryptAll = $event === true"
            />
            <label for="import-encrypt-all" class="cursor-pointer text-xs font-medium select-none">
              Encrypt all variables by default
            </label>
          </div>

          <div
            v-if="parsedImportItems.length > 0"
            class="bg-muted/60 flex items-center gap-2 rounded-md border px-3 py-2 text-xs"
          >
            <ShieldCheck class="text-success size-4 shrink-0" />
            <span
              >Ready to import <strong>{{ parsedImportItems.length }}</strong> variable(s).</span
            >
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" size="sm" @click="isImportOpen = false">Cancel</Button>
          <Button size="sm" :disabled="parsedImportItems.length === 0" @click="handleImport">
            Import {{ parsedImportItems.length > 0 ? `(${parsedImportItems.length})` : '' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
