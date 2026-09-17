<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import {
  Check,
  Clock,
  Copy,
  FileText,
  History,
  Hourglass,
  KeyRound,
  Lock,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  ShieldAlert,
  X,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge, type BadgeVariants } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'

interface Props {
  title?: string
  subtitle?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Access Requests & Privilege Elevation',
  subtitle: 'Request temporary Just-In-Time production access with audit approval.',
})

export interface AccessRequest {
  id: string
  requester: {
    name: string
    email: string
    team: string
    avatar: string
  }
  targetRole: string
  system: string
  duration: string
  timeLeftLabel: string
  secondsLeft: number
  justification: string
  ticketId: string
  approver: string
  status: 'active' | 'pending' | 'expired' | 'rejected'
  createdAt: string
  expiresAt: string
}

const requests = ref<AccessRequest[]>([
  {
    id: 'req-1',
    requester: {
      name: 'Elena Rostova',
      email: 'elena.rostova@acme.corp',
      team: 'SecOps Team',
      avatar: 'ER',
    },
    targetRole: 'AWS Production Admin',
    system: 'AWS Cloud IAM (us-east-1)',
    duration: '4 Hours',
    timeLeftLabel: '2h 45m left',
    secondsLeft: 9918,
    justification: 'Investigating latency spike on payment gateway for incident #SEC-849',
    ticketId: 'SEC-849',
    approver: 'Marcus Vance',
    status: 'active',
    createdAt: '1h 15m ago',
    expiresAt: 'Today at 16:30',
  },
  {
    id: 'req-2',
    requester: {
      name: 'Marcus Vance',
      email: 'marcus.vance@acme.corp',
      team: 'DevOps & Infra',
      avatar: 'MV',
    },
    targetRole: 'Production DB Read-Only',
    system: 'PostgreSQL Aurora Primary',
    duration: '1 Hour (Emergency)',
    timeLeftLabel: '48m left',
    secondsLeft: 2892,
    justification: 'Emergency replica query check during PostgreSQL failover testing',
    ticketId: 'INC-2044',
    approver: 'Sarah Chen',
    status: 'active',
    createdAt: '12m ago',
    expiresAt: 'Today at 14:15',
  },
  {
    id: 'req-3',
    requester: {
      name: 'Sarah Chen',
      email: 'sarah.chen@acme.corp',
      team: 'Core Platform',
      avatar: 'SC',
    },
    targetRole: 'Customer PII Decryption',
    system: 'Customer Data Vault (KMS)',
    duration: '8 Hours (1 Shift)',
    timeLeftLabel: 'Pending Approval',
    secondsLeft: 28800,
    justification: 'GDPR user deletion verification request #COMP-1102',
    ticketId: 'COMP-1102',
    approver: 'Marcus Vance',
    status: 'pending',
    createdAt: '10m ago',
    expiresAt: 'Awaiting approval',
  },
  {
    id: 'req-4',
    requester: {
      name: 'David Kim',
      email: 'david.kim@acme.corp',
      team: 'Fintech Systems',
      avatar: 'DK',
    },
    targetRole: 'Stripe Dashboard Full Access',
    system: 'Stripe Merchant Gateway',
    duration: '1 Hour (Emergency)',
    timeLeftLabel: 'Pending Approval',
    secondsLeft: 3600,
    justification: 'Refunding disputed charges for compromised merchant accounts',
    ticketId: 'FIN-582',
    approver: 'Marcus Vance',
    status: 'pending',
    createdAt: '25m ago',
    expiresAt: 'Awaiting approval',
  },
  {
    id: 'req-5',
    requester: {
      name: 'Alex Morgan',
      email: 'alex.m@acme.corp',
      team: 'Data Platform',
      avatar: 'AM',
    },
    targetRole: 'Production DB Read-Only',
    system: 'Snowflake Core Analytics',
    duration: '4 Hours',
    timeLeftLabel: 'Expired',
    secondsLeft: 0,
    justification: 'Quarterly compliance metrics export and audit schema migration verification',
    ticketId: 'AUD-309',
    approver: 'Elena Rostova',
    status: 'expired',
    createdAt: 'Yesterday',
    expiresAt: 'Expired at 18:00',
  },
])

// Timer ticker for active sessions
let timerInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timerInterval = setInterval(() => {
    requests.value.forEach((req) => {
      if (req.status === 'active' && req.secondsLeft > 0) {
        req.secondsLeft -= 1
        if (req.secondsLeft <= 0) {
          req.status = 'expired'
          req.timeLeftLabel = 'Expired'
        } else {
          const h = Math.floor(req.secondsLeft / 3600)
          const m = Math.floor((req.secondsLeft % 3600) / 60)
          req.timeLeftLabel = h > 0 ? `${h}h ${m}m left` : `${m}m left`
        }
      }
    })
  }, 1000)
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})

function formatSeconds(seconds: number): string {
  if (seconds <= 0) return '00:00:00'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

// Governance KPI Counts
const activeCount = computed(() => requests.value.filter((r) => r.status === 'active').length)
const pendingCount = computed(() => requests.value.filter((r) => r.status === 'pending').length)
const expiringCount = computed(
  () => requests.value.filter((r) => r.status === 'active' && r.secondsLeft <= 3600 * 4).length,
)
const total30Day = computed(() => 42 + requests.value.filter((r) => r.id.startsWith('req-custom')).length)

// Modal Form State
const isDialogOpen = ref(false)
const formRole = ref('AWS Production Admin')
const formDuration = ref('4 Hours')
const formApprover = ref('Security Lead: Marcus Vance')
const formJustification = ref('Investigating latency spike on payment gateway for incident #SEC-849')

function handleCreateRequest() {
  if (!formJustification.value.trim()) return

  let seconds = 3600 * 4
  if (formDuration.value.includes('1 Hour')) seconds = 3600
  else if (formDuration.value.includes('8 Hours')) seconds = 3600 * 8
  else if (formDuration.value.includes('24 Hours')) seconds = 3600 * 24

  let system = 'AWS Cloud IAM (us-east-1)'
  if (formRole.value.includes('DB')) system = 'PostgreSQL Aurora Primary'
  else if (formRole.value.includes('Stripe')) system = 'Stripe Merchant Gateway'
  else if (formRole.value.includes('PII')) system = 'Customer Data Vault (KMS)'

  const newReq: AccessRequest = {
    id: `req-custom-${Date.now()}`,
    requester: {
      name: 'Current Operator (You)',
      email: 'operator@acme.corp',
      team: 'Platform Engineering',
      avatar: 'OP',
    },
    targetRole: formRole.value,
    system,
    duration: formDuration.value,
    timeLeftLabel: 'Pending Approval',
    secondsLeft: seconds,
    justification: formJustification.value,
    ticketId: `SEC-${Math.floor(100 + Math.random() * 900)}`,
    approver: formApprover.value,
    status: 'pending',
    createdAt: 'Just now',
    expiresAt: 'Awaiting approval',
  }

  requests.value.unshift(newReq)
  isDialogOpen.value = false
}

// Table Filters
const selectedTab = ref<'all' | 'pending' | 'active' | 'expired'>('all')
const searchQuery = ref('')

const filteredRequests = computed(() => {
  return requests.value.filter((req) => {
    if (selectedTab.value !== 'all' && req.status !== selectedTab.value) {
      return false
    }
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const matchName = req.requester.name.toLowerCase().includes(q)
      const matchRole = req.targetRole.toLowerCase().includes(q)
      const matchTicket = req.ticketId.toLowerCase().includes(q)
      const matchJust = req.justification.toLowerCase().includes(q)
      const matchSys = req.system.toLowerCase().includes(q)
      if (!matchName && !matchRole && !matchTicket && !matchJust && !matchSys) {
        return false
      }
    }
    return true
  })
})

// Manager Actions
function handleApprove(id: string) {
  const req = requests.value.find((r) => r.id === id)
  if (req) {
    req.status = 'active'
    const h = Math.floor(req.secondsLeft / 3600)
    const m = Math.floor((req.secondsLeft % 3600) / 60)
    req.timeLeftLabel = h > 0 ? `${h}h ${m}m left` : `${m}m left`
  }
}

function handleReject(id: string) {
  const req = requests.value.find((r) => r.id === id)
  if (req) {
    req.status = 'rejected'
    req.timeLeftLabel = 'Rejected'
  }
}

function handleRevoke(id: string) {
  const req = requests.value.find((r) => r.id === id)
  if (req) {
    req.status = 'expired'
    req.secondsLeft = 0
    req.timeLeftLabel = 'Revoked'
  }
}

function handleExtend(id: string) {
  const req = requests.value.find((r) => r.id === id)
  if (req && req.status === 'active') {
    req.secondsLeft += 1800
    const h = Math.floor(req.secondsLeft / 3600)
    const m = Math.floor((req.secondsLeft % 3600) / 60)
    req.timeLeftLabel = h > 0 ? `${h}h ${m}m left` : `${m}m left`
  }
}

function handleReRequest(id: string) {
  const req = requests.value.find((r) => r.id === id)
  if (req) {
    req.status = 'pending'
    req.timeLeftLabel = 'Pending Approval'
    req.secondsLeft = 3600 * 4
  }
}

const copiedId = ref<string | null>(null)
function handleCopyToken(id: string) {
  copiedId.value = id
  setTimeout(() => {
    if (copiedId.value === id) copiedId.value = null
  }, 2000)
}

function getRoleBadgeVariant(role: string): BadgeVariants['variant'] {
  if (role.includes('AWS') || role.includes('Admin')) return 'destructive'
  if (role.includes('PII') || role.includes('Decryption')) return 'warning'
  if (role.includes('DB') || role.includes('Read-Only')) return 'info'
  if (role.includes('Stripe')) return 'secondary'
  return 'default'
}
</script>

<template>
  <div data-slot="access-request-workflow" :class="cn('flex flex-col gap-6', props.class)">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div class="flex items-center gap-2">
          <div class="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-lg">
            <KeyRound class="size-5" />
          </div>
          <h1 class="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
            {{ title }}
          </h1>
        </div>
        <p class="text-muted-foreground mt-1 text-sm">
          {{ subtitle }}
        </p>
      </div>

      <!-- Request New Access Modal Dialog -->
      <Dialog v-model:open="isDialogOpen">
        <DialogTrigger as-child>
          <Button class="shrink-0 gap-2 shadow-xs">
            <Plus class="size-4" />
            Request New Access
          </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle class="flex items-center gap-2">
              <ShieldAlert class="text-primary size-5" />
              Request Temporary Access
            </DialogTitle>
            <DialogDescription>
              Submit a Just-In-Time (JIT) access request with duration and business justification.
            </DialogDescription>
          </DialogHeader>

          <form class="space-y-4 py-2" @submit.prevent="handleCreateRequest">
            <div class="space-y-1.5">
              <label class="text-foreground text-xs font-medium">Target System / Role</label>
              <Select v-model="formRole">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Select target role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Production DB Read-Only">Production DB Read-Only</SelectItem>
                  <SelectItem value="AWS Production Admin">AWS Production Admin</SelectItem>
                  <SelectItem value="Stripe Dashboard Full Access">Stripe Dashboard Full Access</SelectItem>
                  <SelectItem value="Customer PII Decryption">Customer PII Decryption</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div class="space-y-1.5">
                <label class="text-foreground text-xs font-medium">Access Duration</label>
                <Select v-model="formDuration">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1 Hour (Emergency)">1 Hour (Emergency)</SelectItem>
                    <SelectItem value="4 Hours">4 Hours</SelectItem>
                    <SelectItem value="8 Hours (1 Shift)">8 Hours (1 Shift)</SelectItem>
                    <SelectItem value="24 Hours max">24 Hours max</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div class="space-y-1.5">
                <label class="text-foreground text-xs font-medium">Approver / Team</label>
                <Select v-model="formApprover">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select approver" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Security Lead: Marcus Vance">Security Lead: Marcus Vance</SelectItem>
                    <SelectItem value="Infrastructure Team: Sarah Chen">Infrastructure Team: Sarah Chen</SelectItem>
                    <SelectItem value="Compliance Officer: Elena Rostova">Compliance Officer: Elena Rostova</SelectItem>
                    <SelectItem value="On-Call Lead: David Kim">On-Call Lead: David Kim</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="text-foreground text-xs font-medium">Business Justification</label>
              <Textarea
                v-model="formJustification"
                placeholder="Investigating latency spike on payment gateway for incident #SEC-849"
                rows="3"
                class="resize-none text-xs"
              />
              <p class="text-muted-foreground text-xs">
                All elevated actions are recorded and signed in the immutable IAM audit stream.
              </p>
            </div>

            <DialogFooter class="pt-2">
              <Button type="button" variant="outline" @click="isDialogOpen = false"> Cancel </Button>
              <Button type="submit" class="gap-2">
                <Send class="size-4" />
                Submit Request
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>

    <!-- 4 Access Governance KPI Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card class="border-border/80 relative overflow-hidden shadow-xs">
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-muted-foreground text-xs font-medium">Active Elevated Sessions</CardTitle>
          <div class="rounded-md bg-emerald-500/10 p-1.5 text-emerald-600 dark:text-emerald-400">
            <ShieldAlert class="size-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div class="text-foreground text-2xl font-bold tracking-tight tabular-nums">{{ activeCount }}</div>
          <p class="text-muted-foreground mt-1 text-xs">Expiring within 8h</p>
        </CardContent>
      </Card>

      <Card class="border-border/80 relative overflow-hidden shadow-xs">
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-muted-foreground text-xs font-medium">Pending Approvals</CardTitle>
          <div class="rounded-md bg-amber-500/10 p-1.5 text-amber-600 dark:text-amber-400">
            <Clock class="size-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div class="text-foreground text-2xl font-bold tracking-tight tabular-nums">{{ pendingCount }}</div>
          <p class="text-muted-foreground mt-1 text-xs">Requires security lead review</p>
        </CardContent>
      </Card>

      <Card class="border-border/80 relative overflow-hidden shadow-xs">
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-muted-foreground text-xs font-medium">Requests Expiring Today</CardTitle>
          <div class="rounded-md bg-indigo-500/10 p-1.5 text-indigo-600 dark:text-indigo-400">
            <Hourglass class="size-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div class="text-foreground text-2xl font-bold tracking-tight tabular-nums">{{ expiringCount }}</div>
          <p class="text-muted-foreground mt-1 text-xs">Auto-revocation armed</p>
        </CardContent>
      </Card>

      <Card class="border-border/80 relative overflow-hidden shadow-xs">
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-muted-foreground text-xs font-medium">30-Day Total Requests</CardTitle>
          <div class="bg-primary/10 text-primary rounded-md p-1.5">
            <History class="size-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div class="text-foreground text-2xl font-bold tracking-tight tabular-nums">{{ total30Day }}</div>
          <p class="text-muted-foreground mt-1 text-xs">98.2% compliance audit pass</p>
        </CardContent>
      </Card>
    </div>

    <!-- Pending & Active Requests Table Card -->
    <Card class="border-border/80 shadow-xs">
      <CardHeader class="border-border/60 border-b pb-4">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle class="text-foreground text-base font-semibold">Privilege Escalation Queue</CardTitle>
            <CardDescription class="text-muted-foreground mt-0.5 text-xs">
              Review, approve, or reject active and pending privilege requests.
            </CardDescription>
          </div>

          <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
            <!-- Search -->
            <div class="relative w-full sm:w-60">
              <Search class="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
              <Input v-model="searchQuery" placeholder="Search requester, role, ticket..." class="h-8 pl-8 text-xs" />
            </div>

            <!-- Filter Tabs -->
            <div class="border-border bg-muted/40 flex items-center rounded-lg border p-0.5">
              <button
                type="button"
                :class="
                  cn(
                    'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                    selectedTab === 'all'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )
                "
                @click="selectedTab = 'all'"
              >
                All ({{ requests.length }})
              </button>
              <button
                type="button"
                :class="
                  cn(
                    'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                    selectedTab === 'pending'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )
                "
                @click="selectedTab = 'pending'"
              >
                Pending ({{ pendingCount }})
              </button>
              <button
                type="button"
                :class="
                  cn(
                    'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                    selectedTab === 'active'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )
                "
                @click="selectedTab = 'active'"
              >
                Active ({{ activeCount }})
              </button>
              <button
                type="button"
                :class="
                  cn(
                    'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                    selectedTab === 'expired'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )
                "
                @click="selectedTab = 'expired'"
              >
                Expired ({{ requests.filter((r) => r.status === 'expired' || r.status === 'rejected').length }})
              </button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent class="p-0">
        <div class="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow class="hover:bg-transparent">
                <TableHead class="w-[220px] text-xs font-medium">Requester</TableHead>
                <TableHead class="w-[200px] text-xs font-medium">Target Role & System</TableHead>
                <TableHead class="w-[170px] text-xs font-medium">Duration & Timer</TableHead>
                <TableHead class="min-w-[260px] text-xs font-medium">Business Justification</TableHead>
                <TableHead class="w-[180px] text-xs font-medium">Status</TableHead>
                <TableHead class="w-[160px] text-right text-xs font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-if="filteredRequests.length === 0">
                <TableCell colspan="6" class="text-muted-foreground h-32 text-center text-xs">
                  No access requests match your filter.
                </TableCell>
              </TableRow>

              <TableRow v-for="req in filteredRequests" :key="req.id" class="hover:bg-muted/30 transition-colors">
                <!-- Requester -->
                <TableCell>
                  <div class="flex items-center gap-3">
                    <Avatar class="border-border/60 size-8 border">
                      <AvatarFallback class="bg-muted text-foreground text-xs font-semibold">
                        {{ req.requester.avatar }}
                      </AvatarFallback>
                    </Avatar>
                    <div class="min-w-0">
                      <div class="text-foreground truncate text-xs font-medium">
                        {{ req.requester.name }}
                      </div>
                      <div class="text-muted-foreground truncate text-xs">
                        {{ req.requester.email }}
                      </div>
                    </div>
                  </div>
                </TableCell>

                <!-- Target Role & System -->
                <TableCell>
                  <div class="flex flex-col gap-1">
                    <Badge :variant="getRoleBadgeVariant(req.targetRole)" class="w-fit text-xs font-medium">
                      {{ req.targetRole }}
                    </Badge>
                    <span class="text-muted-foreground truncate text-xs">
                      {{ req.system }}
                    </span>
                  </div>
                </TableCell>

                <!-- Duration & Timer -->
                <TableCell>
                  <div class="flex flex-col gap-1">
                    <span class="text-foreground text-xs font-medium">
                      {{ req.duration }}
                    </span>
                    <div
                      v-if="req.status === 'active'"
                      class="flex items-center gap-1.5 font-mono text-xs text-emerald-600 tabular-nums dark:text-emerald-400"
                    >
                      <Clock class="size-3 shrink-0" />
                      <span>{{ formatSeconds(req.secondsLeft) }}</span>
                    </div>
                    <div
                      v-else-if="req.status === 'pending'"
                      class="text-muted-foreground flex items-center gap-1.5 font-mono text-xs tabular-nums"
                    >
                      <Clock class="size-3 shrink-0" />
                      <span>Awaiting start</span>
                    </div>
                    <div v-else class="text-muted-foreground flex items-center gap-1.5 font-mono text-xs tabular-nums">
                      <Clock class="size-3 shrink-0" />
                      <span>Session ended</span>
                    </div>
                  </div>
                </TableCell>

                <!-- Business Justification -->
                <TableCell>
                  <div class="flex flex-col gap-1">
                    <div class="flex items-center gap-1.5">
                      <span
                        class="border-border bg-muted/60 text-foreground inline-flex items-center rounded border px-1.5 py-0.5 font-mono text-xs font-medium"
                      >
                        #{{ req.ticketId }}
                      </span>
                      <span class="text-muted-foreground text-xs">
                        Approver:
                        {{
                          req.approver
                            .replace('Security Lead: ', '')
                            .replace('Infrastructure Team: ', '')
                            .replace('Compliance Officer: ', '')
                            .replace('On-Call Lead: ', '')
                        }}
                      </span>
                    </div>
                    <p class="text-muted-foreground line-clamp-2 text-xs" :title="req.justification">
                      {{ req.justification }}
                    </p>
                  </div>
                </TableCell>

                <!-- Status Badge -->
                <TableCell>
                  <div class="flex items-center">
                    <Badge v-if="req.status === 'active'" variant="success" class="gap-1.5 text-xs font-medium">
                      <span class="relative flex size-2">
                        <span class="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span class="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
                      </span>
                      <span>Active - {{ req.timeLeftLabel }}</span>
                    </Badge>

                    <Badge v-else-if="req.status === 'pending'" variant="warning" class="gap-1.5 text-xs font-medium">
                      <span class="size-2 animate-pulse rounded-full bg-amber-500"></span>
                      <span>Pending Approval</span>
                    </Badge>

                    <Badge
                      v-else-if="req.status === 'expired'"
                      variant="secondary"
                      class="text-muted-foreground gap-1.5 text-xs font-normal"
                    >
                      <span class="bg-muted-foreground/50 size-2 rounded-full"></span>
                      <span>Expired</span>
                    </Badge>

                    <Badge
                      v-else-if="req.status === 'rejected'"
                      variant="destructive"
                      class="gap-1.5 text-xs font-normal"
                    >
                      <span class="size-2 rounded-full bg-red-400"></span>
                      <span>Rejected</span>
                    </Badge>
                  </div>
                </TableCell>

                <!-- Actions -->
                <TableCell class="text-right">
                  <div class="flex items-center justify-end gap-1.5">
                    <!-- Pending Actions -->
                    <template v-if="req.status === 'pending'">
                      <Button size="sm" class="h-7 gap-1 px-2.5 text-xs shadow-xs" @click="handleApprove(req.id)">
                        <Check class="size-3.5" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        class="text-destructive hover:bg-destructive/10 hover:text-destructive h-7 gap-1 px-2 text-xs"
                        @click="handleReject(req.id)"
                      >
                        <X class="size-3.5" />
                        Reject
                      </Button>
                    </template>

                    <!-- Active Actions -->
                    <template v-else-if="req.status === 'active'">
                      <Button
                        size="sm"
                        variant="outline"
                        class="text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive h-7 gap-1 px-2 text-xs"
                        @click="handleRevoke(req.id)"
                      >
                        <Lock class="size-3.5" />
                        Revoke
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                          <Button variant="ghost" size="icon" class="size-7">
                            <MoreHorizontal class="size-3.5" />
                            <span class="sr-only">More actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" class="w-48">
                          <DropdownMenuLabel class="text-xs">Elevated Session</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem @click="handleExtend(req.id)">
                            <Clock class="mr-2 size-3.5" />
                            Extend 30 Minutes
                          </DropdownMenuItem>
                          <DropdownMenuItem @click="handleCopyToken(req.id)">
                            <Copy class="mr-2 size-3.5" />
                            {{ copiedId === req.id ? 'Copied Token!' : 'Copy Token' }}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            class="text-destructive focus:text-destructive"
                            @click="handleRevoke(req.id)"
                          >
                            <ShieldAlert class="mr-2 size-3.5" />
                            Revoke Immediately
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </template>

                    <!-- Expired / Rejected Actions -->
                    <template v-else>
                      <Button
                        size="sm"
                        variant="ghost"
                        class="text-muted-foreground hover:text-foreground h-7 px-2 text-xs"
                        @click="handleReRequest(req.id)"
                      >
                        Re-request
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                          <Button variant="ghost" size="icon" class="size-7">
                            <MoreHorizontal class="size-3.5" />
                            <span class="sr-only">More actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" class="w-44">
                          <DropdownMenuItem @click="handleReRequest(req.id)">
                            <History class="mr-2 size-3.5" />
                            Request Again
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText class="mr-2 size-3.5" />
                            View Audit Log
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </template>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
