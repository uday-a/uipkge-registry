<script setup lang="ts">
import { computed, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import { Building2, Check, ChevronsUpDown, Globe, LogOut, Plus, Settings, UserPlus } from 'lucide-vue-next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

export interface WorkspaceItem {
  id: string
  name: string
  slug?: string
  plan: string
  planTier: string
  members: number
  region: string
  regionCode: string
  role: 'Owner' | 'Admin' | 'Member' | 'Personal'
  color: string
  initials: string
}

export interface UserInfo {
  name: string
  email: string
  avatar?: string
}

interface Props {
  initialWorkspaces?: WorkspaceItem[]
  defaultActiveId?: string
  user?: UserInfo
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  initialWorkspaces: () => [
    {
      id: 'ws-1',
      name: 'UIPKGE Enterprise Inc.',
      slug: 'uipkge-enterprise',
      plan: 'Enterprise Scale',
      planTier: 'Enterprise Plan',
      members: 64,
      region: 'US East (N. Virginia)',
      regionCode: 'US-East',
      role: 'Owner',
      color: 'bg-primary/10 text-primary border border-primary/20',
      initials: 'UE',
    },
    {
      id: 'ws-2',
      name: 'Acme Design Systems Lab',
      slug: 'acme-design',
      plan: 'Pro Team',
      planTier: 'Pro Team',
      members: 18,
      region: 'EU Central (Frankfurt)',
      regionCode: 'EU-Central',
      role: 'Admin',
      color: 'bg-sky-500/10 text-sky-500 border border-sky-500/20',
      initials: 'AD',
    },
    {
      id: 'ws-3',
      name: 'Personal Sandbox',
      slug: 'personal-sandbox',
      plan: 'Developer Tier',
      planTier: 'Free Developer Tier',
      members: 1,
      region: 'Global Edge',
      regionCode: 'Global',
      role: 'Personal',
      color: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
      initials: 'PS',
    },
  ],
  defaultActiveId: 'ws-1',
  user: () => ({
    name: 'Elena Rostova',
    email: 'elena@uipkge.dev',
    avatar: '',
  }),
})

const emit = defineEmits<{
  (e: 'change', workspace: WorkspaceItem): void
  (e: 'create', workspace: WorkspaceItem): void
  (e: 'action', key: 'settings' | 'billing' | 'invite' | 'logout'): void
}>()

const workspaces = ref<WorkspaceItem[]>([...props.initialWorkspaces])
const activeWorkspaceId = ref<string>(props.defaultActiveId)
const isCreateDialogOpen = ref(false)

const activeWorkspace = computed(() => {
  return (
    workspaces.value.find((w) => w.id === activeWorkspaceId.value) ||
    workspaces.value[0] || {
      id: 'ws-fallback',
      name: 'Workspace',
      plan: 'Standard',
      planTier: 'Standard',
      members: 1,
      region: 'US-East',
      regionCode: 'US-East',
      role: 'Owner' as const,
      color: 'bg-muted text-foreground border border-border',
      initials: 'WS',
    }
  )
})

// Dialog Form State
const newOrgName = ref('Stripe Developer Platform')
const newOrgRegion = ref('us-east')
const newOrgPlan = ref('pro')

const slugPreview = computed(() => {
  const cleaned = newOrgName.value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return cleaned || 'stripe-dev'
})

function selectWorkspace(workspace: WorkspaceItem) {
  activeWorkspaceId.value = workspace.id
  emit('change', workspace)
}

function handleOpenCreateDialog() {
  isCreateDialogOpen.value = true
}

function handleCreateWorkspace() {
  if (!newOrgName.value.trim()) return

  const regionMap: Record<string, { full: string; code: string }> = {
    'us-east': { full: 'US East (N. Virginia)', code: 'US-East' },
    'eu-central': { full: 'EU Central (Frankfurt)', code: 'EU-Central' },
    'ap-south': { full: 'AP South (Mumbai)', code: 'AP-South' },
  }

  const regionInfo = regionMap[newOrgRegion.value] || {
    full: 'US East (N. Virginia)',
    code: 'US-East',
  }

  const parts = newOrgName.value.trim().split(/\s+/)
  const initials =
    parts.length > 1
      ? `${parts[0]?.[0] || ''}${parts[1]?.[0] || ''}`.toUpperCase()
      : (parts[0]?.slice(0, 2) || 'WS').toUpperCase()

  const newWs: WorkspaceItem = {
    id: `ws-${Date.now()}`,
    name: newOrgName.value.trim(),
    slug: slugPreview.value,
    plan: newOrgPlan.value === 'enterprise' ? 'Enterprise Scale' : 'Pro Team',
    planTier: newOrgPlan.value === 'enterprise' ? 'Enterprise Custom' : 'Pro Team',
    members: 1,
    region: regionInfo.full,
    regionCode: regionInfo.code,
    role: 'Owner',
    color:
      newOrgPlan.value === 'enterprise'
        ? 'bg-primary/10 text-primary border border-primary/20'
        : 'bg-sky-500/10 text-sky-500 border border-sky-500/20',
    initials,
  }

  workspaces.value.unshift(newWs)
  activeWorkspaceId.value = newWs.id
  emit('create', newWs)
  emit('change', newWs)

  // Reset form
  newOrgName.value = ''
  isCreateDialogOpen.value = false
}
</script>

<template>
  <div data-slot="enterprise-workspace-switcher" :class="cn('w-full', props.class)">
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <button
          type="button"
          class="group border-border/80 bg-card hover:bg-accent/40 focus-visible:ring-ring flex w-full items-center gap-3 rounded-xl border p-2.5 text-left shadow-xs transition-all duration-150 focus-visible:ring-2 focus-visible:outline-none"
          aria-label="Select organization workspace"
        >
          <!-- Org Avatar / Monogram with Emerald Ring -->
          <div class="relative size-10 shrink-0">
            <div
              :class="
                cn(
                  'flex size-10 items-center justify-center rounded-lg text-sm font-semibold shadow-2xs',
                  activeWorkspace.color,
                )
              "
            >
              {{ activeWorkspace.initials }}
            </div>
            <span
              class="border-card absolute -top-0.5 -right-0.5 size-2.5 rounded-full border-2 bg-emerald-500"
              title="Active Organization"
              aria-label="Active workspace status: Online"
            />
          </div>

          <!-- Active Org Info & Role Badge -->
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-1.5">
              <span class="text-foreground truncate text-sm font-semibold tracking-tight">
                {{ activeWorkspace.name }}
              </span>
              <Badge variant="secondary" class="shrink-0 px-1.5 py-0 text-xs font-medium">
                {{ activeWorkspace.role }}
              </Badge>
            </div>
            <div class="text-muted-foreground mt-0.5 flex items-center gap-1.5 truncate text-xs">
              <span class="truncate font-medium">Tier: {{ activeWorkspace.plan }}</span>
              <span class="shrink-0">{{ activeWorkspace.regionCode }}</span>
            </div>
          </div>

          <!-- Chevron Icon -->
          <ChevronsUpDown
            class="text-muted-foreground/70 group-hover:text-foreground size-4 shrink-0 transition-colors"
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        class="border-border bg-popover w-80 rounded-xl p-2 shadow-xl sm:w-96"
        align="start"
        :side-offset="6"
      >
        <!-- User Header Profile Info -->
        <DropdownMenuLabel class="p-0 font-normal">
          <div class="bg-muted/40 flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left">
            <Avatar class="size-8 rounded-full border">
              <AvatarImage v-if="user.avatar" :src="user.avatar" :alt="user.name" />
              <AvatarFallback class="bg-primary/10 text-primary text-xs font-bold">
                {{
                  user.name
                    .split(' ')
                    .map((p) => p[0])
                    .join('')
                    .toUpperCase() || 'U'
                }}
              </AvatarFallback>
            </Avatar>
            <div class="grid min-w-0 flex-1 text-left leading-tight">
              <span class="text-muted-foreground text-xs font-medium">Signed in as</span>
              <span class="text-foreground truncate text-xs font-semibold">{{ user.email }}</span>
            </div>
            <div class="flex items-center gap-1">
              <span class="size-2 rounded-full bg-emerald-500" />
              <span class="text-muted-foreground text-xs font-medium">Ready</span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator class="my-1.5" />

        <!-- Workspaces Section -->
        <div class="flex items-center justify-between px-2 py-1">
          <span class="text-muted-foreground text-xs font-semibold tracking-wider uppercase"> Workspaces </span>
          <span class="text-muted-foreground/70 text-xs">{{ workspaces.length }} total</span>
        </div>

        <div class="my-1 space-y-1">
          <DropdownMenuItem
            v-for="ws in workspaces"
            :key="ws.id"
            class="hover:bg-accent focus:bg-accent flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors"
            @select="selectWorkspace(ws)"
          >
            <div
              :class="
                cn(
                  'flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold shadow-2xs',
                  ws.color,
                )
              "
            >
              {{ ws.initials }}
            </div>

            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-1.5">
                <span
                  :class="
                    cn(
                      'truncate text-sm font-medium',
                      activeWorkspaceId === ws.id ? 'text-foreground font-semibold' : 'text-foreground/90',
                    )
                  "
                >
                  {{ ws.name }}
                </span>
                <Badge v-if="ws.role === 'Owner'" variant="secondary" class="shrink-0 px-1 py-0 text-xs font-medium">
                  Owner
                </Badge>
                <Badge v-else-if="ws.role === 'Admin'" variant="outline" class="shrink-0 px-1 py-0 text-xs font-medium">
                  Admin
                </Badge>
              </div>
              <p class="text-muted-foreground truncate text-xs">
                {{ ws.planTier }} · {{ ws.members }} Member{{ ws.members === 1 ? '' : 's' }} ·
                {{ ws.regionCode }}
              </p>
            </div>

            <Check v-if="activeWorkspaceId === ws.id" class="size-4 shrink-0 text-emerald-500" aria-hidden="true" />
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator class="my-1.5" />

        <!-- Actions -->
        <DropdownMenuGroup>
          <DropdownMenuItem
            class="text-foreground hover:bg-accent focus:bg-accent flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors"
            @select="handleOpenCreateDialog"
          >
            <div
              class="border-primary/30 bg-primary/10 text-primary flex size-6 items-center justify-center rounded-md border"
            >
              <Plus class="size-3.5" />
            </div>
            <span class="font-medium">Create New Workspace</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            class="text-muted-foreground hover:text-foreground hover:bg-accent focus:bg-accent flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors"
            @select="emit('action', 'settings')"
          >
            <div class="border-border bg-muted flex size-6 items-center justify-center rounded-md border">
              <Settings class="size-3.5" />
            </div>
            <span>Organization Settings & Billing</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            class="text-muted-foreground hover:text-foreground hover:bg-accent focus:bg-accent flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors"
            @select="emit('action', 'invite')"
          >
            <div class="border-border bg-muted flex size-6 items-center justify-center rounded-md border">
              <UserPlus class="size-3.5" />
            </div>
            <span>Invite Team Members</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator class="my-1.5" />

        <!-- Logout -->
        <DropdownMenuItem
          class="text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm font-medium transition-colors"
          @select="emit('action', 'logout')"
        >
          <div
            class="border-destructive/20 bg-destructive/10 text-destructive flex size-6 items-center justify-center rounded-md border"
          >
            <LogOut class="size-3.5" />
          </div>
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <!-- Create New Workspace Modal Dialog -->
    <Dialog v-model:open="isCreateDialogOpen">
      <DialogContent class="border-border bg-background rounded-2xl p-6 shadow-sm sm:max-w-lg">
        <DialogHeader class="space-y-2 text-left">
          <div
            class="border-primary/20 bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl border shadow-xs"
          >
            <Building2 class="size-5" />
          </div>
          <DialogTitle class="text-foreground text-lg font-bold tracking-tight"> Create New Workspace </DialogTitle>
          <DialogDescription class="text-muted-foreground text-sm leading-relaxed">
            Spin up a dedicated organization workspace with multi-region routing and isolated billing.
          </DialogDescription>
        </DialogHeader>

        <form class="space-y-4 py-2" @submit.prevent="handleCreateWorkspace">
          <!-- Workspace Name -->
          <div class="space-y-1.5">
            <label for="new-workspace-name" class="text-foreground text-sm font-medium"> Workspace Name </label>
            <Input
              id="new-workspace-name"
              v-model="newOrgName"
              placeholder="e.g. Stripe Developer Platform"
              autocomplete="off"
              class="h-10 text-sm"
              required
            />
          </div>

          <!-- URL Slug Preview -->
          <div class="space-y-1.5">
            <label class="text-muted-foreground text-xs font-medium"> Workspace URL Slug </label>
            <div class="border-border bg-muted/40 flex items-center gap-2 rounded-lg border px-3 py-2 text-xs">
              <Globe class="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
              <span class="text-muted-foreground">uipkge.dev/</span>
              <span class="text-foreground truncate font-semibold">{{ slugPreview }}</span>
            </div>
          </div>

          <!-- Primary Region Selection -->
          <div class="space-y-1.5">
            <label class="text-foreground text-sm font-medium"> Primary Region </label>
            <Select v-model="newOrgRegion">
              <SelectTrigger class="h-10 w-full">
                <SelectValue placeholder="Select primary region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us-east"> US East (N. Virginia) </SelectItem>
                <SelectItem value="eu-central"> EU Central (Frankfurt) </SelectItem>
                <SelectItem value="ap-south"> AP South (Mumbai) </SelectItem>
              </SelectContent>
            </Select>
            <p class="text-muted-foreground text-xs">
              Primary cluster location for low-latency queries and database replication.
            </p>
          </div>

          <!-- Plan Selection Radios -->
          <div class="space-y-2">
            <label class="text-foreground text-sm font-medium"> Choose Workspace Plan </label>
            <RadioGroup v-model="newOrgPlan" class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label
                for="plan-pro"
                :class="
                  cn(
                    'border-border/80 hover:border-primary/50 relative flex cursor-pointer flex-col justify-between rounded-xl border p-3.5 shadow-xs transition-all',
                    newOrgPlan === 'pro' && 'border-primary bg-primary/5 ring-primary/40 shadow-sm ring-1',
                  )
                "
              >
                <div class="flex items-start justify-between gap-2">
                  <div class="space-y-0.5">
                    <span class="text-foreground text-sm font-semibold">Pro Team</span>
                    <p class="text-primary text-xs font-medium">$29 / month</p>
                  </div>
                  <RadioGroupItem id="plan-pro" value="pro" class="mt-0.5" />
                </div>
                <p class="text-muted-foreground mt-2 text-xs leading-relaxed">
                  Up to 25 members, standard 99.9% SLA, and daily automated backups.
                </p>
              </label>

              <label
                for="plan-enterprise"
                :class="
                  cn(
                    'border-border/80 hover:border-primary/50 relative flex cursor-pointer flex-col justify-between rounded-xl border p-3.5 shadow-xs transition-all',
                    newOrgPlan === 'enterprise' && 'border-primary bg-primary/5 ring-primary/40 shadow-sm ring-1',
                  )
                "
              >
                <div class="flex items-start justify-between gap-2">
                  <div class="space-y-0.5">
                    <span class="text-foreground text-sm font-semibold">Enterprise Scale</span>
                    <p class="text-primary text-xs font-medium">Custom billing</p>
                  </div>
                  <RadioGroupItem id="plan-enterprise" value="enterprise" class="mt-0.5" />
                </div>
                <p class="text-muted-foreground mt-2 text-xs leading-relaxed">
                  Unlimited members, dedicated VPC peering, 99.99% uptime SLA & SSO.
                </p>
              </label>
            </RadioGroup>
          </div>

          <DialogFooter class="border-border/60 flex gap-2 border-t pt-4 sm:justify-end">
            <Button type="button" variant="outline" @click="isCreateDialogOpen = false"> Cancel </Button>
            <Button type="submit" :disabled="!newOrgName.trim()"> Create Workspace </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>
