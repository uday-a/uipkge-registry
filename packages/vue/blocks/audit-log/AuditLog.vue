<script setup lang="ts">
import { computed, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import { Download, Fingerprint, RadioTower, Search } from 'lucide-vue-next'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge, type BadgeVariants } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RelativeTime } from '@/components/ui/relative-time'
import { SectionCard } from '@/components/ui/section-card'

type AuditAction = 'sign-in' | 'user.updated' | 'role.changed' | 'export' | 'delete'

interface AuditEntry {
  id: string
  actor: string
  action: AuditAction
  target: string
  ip: string
  date: Date
}

const props = defineProps<{
  entries?: AuditEntry[]
  class?: HTMLAttributes['class']
}>()

const actionTone: Record<AuditAction, BadgeVariants['variant']> = {
  'sign-in': 'secondary',
  'user.updated': 'default',
  'role.changed': 'warning',
  export: 'info',
  delete: 'destructive',
}

const now = new Date()
const minutesAgo = (m: number) => new Date(now.getTime() - m * 60_000)
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3_600_000)
const daysAgo = (d: number) => new Date(now.getTime() - d * 86_400_000)

const stubEntries: AuditEntry[] = [
  {
    id: 'a1',
    actor: 'Amara Osei',
    action: 'role.changed',
    target: 'priya@acme.com → Editor',
    ip: '77.12.44.9',
    date: minutesAgo(4),
  },
  { id: 'a2', actor: 'System', action: 'export', target: 'payroll-2026-07.csv', ip: '—', date: minutesAgo(38) },
  {
    id: 'a3',
    actor: 'Jonas Weber',
    action: 'sign-in',
    target: 'admin.acme.com',
    ip: '84.190.201.3',
    date: hoursAgo(1),
  },
  {
    id: 'a4',
    actor: 'Priya Nair',
    action: 'user.updated',
    target: 'profile.phone',
    ip: '103.25.8.77',
    date: hoursAgo(3),
  },
  {
    id: 'a5',
    actor: 'Amara Osei',
    action: 'delete',
    target: 'draft-policy-v3.pdf',
    ip: '77.12.44.9',
    date: hoursAgo(5),
  },
  { id: 'a6', actor: 'Marcus Lee', action: 'sign-in', target: 'admin.acme.com', ip: '45.62.110.204', date: daysAgo(1) },
  {
    id: 'a7',
    actor: 'Priya Nair',
    action: 'user.updated',
    target: 'team/onboarding-flow',
    ip: '103.25.8.77',
    date: daysAgo(1),
  },
  { id: 'a8', actor: 'System', action: 'role.changed', target: 'contractors → Viewer', ip: '—', date: daysAgo(2) },
  {
    id: 'a9',
    actor: 'Jonas Weber',
    action: 'export',
    target: 'audit-trail-q2.json',
    ip: '84.190.201.3',
    date: daysAgo(2),
  },
  {
    id: 'a10',
    actor: 'Marcus Lee',
    action: 'delete',
    target: 'staging-deploy-key',
    ip: '45.62.110.204',
    date: daysAgo(3),
  },
]

const entries = computed(() => props.entries ?? stubEntries)

const search = ref('')
const actionFilter = ref<'all' | AuditAction>('all')

const filtered = computed(() =>
  entries.value.filter((entry) => {
    const matchesQuery =
      search.value === '' || `${entry.actor} ${entry.target}`.toLowerCase().includes(search.value.toLowerCase())
    const matchesAction = actionFilter.value === 'all' || entry.action === actionFilter.value
    return matchesQuery && matchesAction
  }),
)

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
</script>

<template>
  <SectionCard
    data-slot="audit-log"
    title="Audit log"
    description="Who changed what, when — across your workspace."
    :class="props.class"
  >
    <template #header-action>
      <span class="text-success flex items-center gap-1.5 text-xs font-medium">
        <RadioTower class="size-3.5" aria-hidden="true" />
        live
      </span>
    </template>

    <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div class="relative flex-1">
        <Search
          class="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2"
          aria-hidden="true"
        />
        <Input v-model="search" placeholder="Search actor or target…" class="pl-8" />
      </div>
      <Select v-model="actionFilter">
        <SelectTrigger class="sm:w-44">
          <SelectValue placeholder="All actions" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All actions</SelectItem>
          <SelectItem v-for="(tone, action) in actionTone" :key="action" :value="action">{{ action }}</SelectItem>
        </SelectContent>
      </Select>
      <Button aria-label="Download attachment" variant="outline" size="sm">
        <Download aria-hidden="true" />
        Export
      </Button>
    </div>

    <ul class="-mb-4 divide-y">
      <li v-if="filtered.length === 0" class="text-muted-foreground flex flex-col items-center gap-2 py-10 text-sm">
        <Fingerprint class="size-6 opacity-50" aria-hidden="true" />
        No activity matches your filters.
      </li>
      <li v-for="entry in filtered" :key="entry.id" class="flex items-center gap-3 py-3">
        <Avatar class="size-7">
          <AvatarFallback class="text-xs">{{ initials(entry.actor) }}</AvatarFallback>
        </Avatar>
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <p class="truncate text-sm font-medium">{{ entry.actor }}</p>
            <Badge :variant="actionTone[entry.action]" class="shrink-0">{{ entry.action }}</Badge>
          </div>
          <p class="text-muted-foreground truncate font-mono text-xs">{{ entry.target }}</p>
        </div>
        <div class="hidden text-right sm:block">
          <RelativeTime :date="entry.date" class="text-muted-foreground block text-xs" />
          <p class="text-muted-foreground/70 font-mono text-xs">{{ entry.ip }}</p>
        </div>
      </li>
    </ul>
  </SectionCard>
</template>
