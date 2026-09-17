<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import {
  AlertTriangle,
  BadgeCheck,
  Calendar,
  CalendarClock,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  FileCheck,
  FileSpreadsheet,
  Info,
  Lock,
  Mail,
  MoreHorizontal,
  Plus,
  RefreshCw,
  RotateCcw,
  Scale,
  Search,
  Send,
  Server,
  Share2,
  Shield,
  ShieldCheck,
  Users,
  UserX,
  X,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface CustodianRecord {
  id: string
  name: string
  role: string
  department: string
  departmentCategory: 'engineering' | 'product' | 'operations'
  email: string
  avatarInitials: string
  noticeSentDate: string
  acknowledgedDate: string
  status: 'acknowledged' | 'pending' | 're-certified'
  statusLabel: string
  sha256Signature: string
  ipAddress: string
  dataSources: string[]
  preservedAssets: string
}

export interface PreservationSystem {
  id: string
  name: string
  integrationType: string
  status: 'active' | 'warning' | 'synced'
  statusLabel: string
  scope: string
  lockProtocol: string
  lastSync: string
  iconName: 'slack' | 'aws' | 'google' | 'github'
}

interface Props {
  class?: HTMLAttributes['class']
  defaultFilter?: string
}

const props = withDefaults(defineProps<Props>(), {
  defaultFilter: 'all',
})

const custodiansData: CustodianRecord[] = [
  {
    id: 'CUST-8801',
    name: 'Marcus Vance',
    role: 'VP of Engineering',
    department: 'Engineering & Architecture',
    departmentCategory: 'engineering',
    email: 'marcus.vance@uipkge.internal',
    avatarInitials: 'MV',
    noticeSentDate: 'Aug 14, 2026',
    acknowledgedDate: 'Aug 15, 2026 · 09:12 PST',
    status: 'acknowledged',
    statusLabel: 'Acknowledged & Compliant',
    sha256Signature: '4f8a9e62b11d87e0fa1943892c55b38d019f2a4e87dc261904a8b71239c0812e',
    ipAddress: '198.51.100.42 (Corp Gateway)',
    dataSources: ['Google Workspace', 'Slack Channels', 'GitHub PRs', 'Local Drive'],
    preservedAssets: '1,420 Commits · 84 Channels · 3.2 GB Mail',
  },
  {
    id: 'CUST-8802',
    name: 'Elena Rostova',
    role: 'VP of Product',
    department: 'Product & Design',
    departmentCategory: 'product',
    email: 'elena.rostova@uipkge.internal',
    avatarInitials: 'ER',
    noticeSentDate: 'Aug 14, 2026',
    acknowledgedDate: 'Aug 15, 2026 · 10:45 PST',
    status: 'acknowledged',
    statusLabel: 'Acknowledged & Compliant',
    sha256Signature: '8b3c1d9a7402ef1904a8b71239c0812e4f8a9e62b11d87e0fa1943892c55b38d',
    ipAddress: '198.51.100.58 (Corp Gateway)',
    dataSources: ['Google Workspace', 'Notion', 'Slack Channels', 'Jira'],
    preservedAssets: '312 PRDs · 62 Channels · 1.8 GB Mail',
  },
  {
    id: 'CUST-8803',
    name: 'David Chen',
    role: 'VP of Operations',
    department: 'Operations & Legal',
    departmentCategory: 'operations',
    email: 'david.chen@uipkge.internal',
    avatarInitials: 'DC',
    noticeSentDate: 'Aug 14, 2026',
    acknowledgedDate: 'Aug 15, 2026 · 11:20 PST',
    status: 'acknowledged',
    statusLabel: 'Acknowledged & Compliant',
    sha256Signature: '1a9e7f3c82904a8b71239c0812e4f8a9e62b11d87e0fa1943892c55b38d8b3c1',
    ipAddress: '198.51.100.19 (Corp Gateway)',
    dataSources: ['Google Workspace', 'Box Drive', 'Slack Channels', 'Salesforce'],
    preservedAssets: '94 Vendor Contracts · 48 Channels · 4.1 GB Mail',
  },
  {
    id: 'CUST-8804',
    name: 'Alex Rivera',
    role: 'Lead Architect',
    department: 'Engineering & Architecture',
    departmentCategory: 'engineering',
    email: 'alex.rivera@uipkge.internal',
    avatarInitials: 'AR',
    noticeSentDate: 'Aug 14, 2026',
    acknowledgedDate: 'Aug 16, 2026 · 08:30 PST',
    status: 'acknowledged',
    statusLabel: 'Acknowledged & Compliant',
    sha256Signature: '7e2d5c0b912e4f8a9e62b11d87e0fa1943892c55b38d8b3c1d9a7402ef1904a8',
    ipAddress: '198.51.100.73 (Corp Gateway)',
    dataSources: ['Google Workspace', 'GitHub Repos', 'Figma Files', 'Slack'],
    preservedAssets: '890 Commits · 52 Figma Files · 2.4 GB Mail',
  },
  {
    id: 'CUST-8805',
    name: 'Sarah Jenkins',
    role: 'DevOps Lead',
    department: 'Platform & Infrastructure',
    departmentCategory: 'engineering',
    email: 'sarah.jenkins@uipkge.internal',
    avatarInitials: 'SJ',
    noticeSentDate: 'Aug 14, 2026',
    acknowledgedDate: 'Aug 16, 2026 · 14:05 PST',
    status: 'acknowledged',
    statusLabel: 'Acknowledged & Compliant',
    sha256Signature: '5c0b3a7f4802ef1904a8b71239c0812e4f8a9e62b11d87e0fa1943892c55b38d',
    ipAddress: '198.51.100.91 (Corp Gateway)',
    dataSources: ['AWS CloudTrail', 'GitHub Repos', 'Slack', 'Terraform Cloud'],
    preservedAssets: '340 TF Workspaces · CloudTrail WORM Logs',
  },
]

const preservationSystemsData: PreservationSystem[] = [
  {
    id: 'sys-slack',
    name: 'Slack Enterprise Grid',
    integrationType: 'e-Discovery Legal Hold Lock',
    status: 'active',
    statusLabel: 'Active Hold Lock · Auto-Tombstoning Halted',
    scope: 'All direct messages, private channels, and file attachments preserved.',
    lockProtocol: 'Immutable Hold Policy #LIT-842',
    lastSync: 'Today at 08:15 UTC',
    iconName: 'slack',
  },
  {
    id: 'sys-aws',
    name: 'AWS S3 Object Lock',
    integrationType: 'WORM Compliance Storage Mode',
    status: 'active',
    statusLabel: 'Compliance Mode Verified · Deletions Prohibited',
    scope: 'Production log buckets and database snapshot retention override active.',
    lockProtocol: 'SEC Rule 17a-4 / FINRA WORM Policy',
    lastSync: 'Today at 07:30 UTC',
    iconName: 'aws',
  },
  {
    id: 'sys-google',
    name: 'Google Workspace Vault',
    integrationType: 'Continuous Matter Retention Hold',
    status: 'active',
    statusLabel: 'Indefinite Preservation Active',
    scope: 'Gmail threads, Google Drive revisions, and Google Chat transcripts frozen.',
    lockProtocol: 'Vault Discovery Rule #LIT-2026-0842',
    lastSync: 'Today at 09:00 UTC',
    iconName: 'google',
  },
  {
    id: 'sys-github',
    name: 'GitHub Enterprise Server',
    integrationType: 'Repository & Code Audit Preservation',
    status: 'active',
    statusLabel: 'Audit Lock Active · Force-Pushing Blocked',
    scope: 'Commit trees, Pull Request reviews, and issue histories locked against deletion.',
    lockProtocol: 'Branch & Audit Immutability Policy',
    lastSync: 'Today at 06:45 UTC',
    iconName: 'github',
  },
]

const activeFilter = ref<string>(props.defaultFilter)
const searchQuery = ref<string>('')
const selectedReceipt = ref<CustodianRecord | null>(null)
const isExportingLog = ref(false)
const notificationBanner = ref<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null)
const isIssueHoldModalOpen = ref(false)

// New Legal Hold Form state
const newHoldForm = ref({
  custodianName: '',
  custodianRole: '',
  custodianEmail: '',
  department: 'engineering',
  scopeNotes:
    'All source code repositories, direct messages, and design specifications relevant to Matter #LIT-2026-0842.',
})

const copiedSignature = ref(false)
const copiedVerifyLink = ref(false)

const filterCategories = [
  { id: 'all', label: 'All Custodians', count: 5 },
  { id: 'engineering', label: 'Engineering', count: 3 },
  { id: 'product', label: 'Product & Design', count: 1 },
  { id: 'operations', label: 'Operations & Legal', count: 1 },
]

const filteredCustodians = computed(() => {
  return custodiansData.filter((custodian) => {
    let matchesCategory = true
    if (activeFilter.value === 'engineering') {
      matchesCategory = custodian.departmentCategory === 'engineering'
    } else if (activeFilter.value === 'product') {
      matchesCategory = custodian.departmentCategory === 'product'
    } else if (activeFilter.value === 'operations') {
      matchesCategory = custodian.departmentCategory === 'operations'
    }

    const query = searchQuery.value.trim().toLowerCase()
    if (!query) return matchesCategory

    const matchesSearch =
      custodian.name.toLowerCase().includes(query) ||
      custodian.role.toLowerCase().includes(query) ||
      custodian.department.toLowerCase().includes(query) ||
      custodian.email.toLowerCase().includes(query) ||
      custodian.dataSources.some((source) => source.toLowerCase().includes(query)) ||
      custodian.id.toLowerCase().includes(query)

    return matchesCategory && matchesSearch
  })
})

function showNotification(message: string, type: 'success' | 'info' | 'warning' = 'success', duration = 4000) {
  notificationBanner.value = { message, type }
  setTimeout(() => {
    if (notificationBanner.value?.message === message) {
      notificationBanner.value = null
    }
  }, duration)
}

function handleExportAuditLog() {
  if (isExportingLog.value) return
  isExportingLog.value = true
  showNotification(
    'Compiling full litigation hold preservation receipts and cryptographic audit ledger...',
    'info',
    2000,
  )

  setTimeout(() => {
    isExportingLog.value = false
    showNotification(
      'Export complete: LIT-2026-0842_Custodian_Preservation_Audit_Package_2026-08-21.zip (2.4 MB · 18 Custodian Receipts)',
      'success',
      5000,
    )
  }, 1400)
}

function openReceiptModal(custodian: CustodianRecord) {
  selectedReceipt.value = custodian
  copiedSignature.value = false
  copiedVerifyLink.value = false
}

function handleExportAndClose() {
  handleExportAuditLog()
  closeReceiptModal()
}

function closeReceiptModal() {
  selectedReceipt.value = null
}

function handleSendReminder(custodian: CustodianRecord) {
  showNotification(
    `Re-affirmation reminder & notice receipt dispatched to ${custodian.name} (${custodian.email}).`,
    'info',
  )
}

function handleRecertify(custodian: CustodianRecord) {
  showNotification(
    `Semi-annual re-certification workflow initiated for ${custodian.name}. Acknowledgment due within 5 business days.`,
    'success',
  )
}

function handleReleaseFromHold(custodian: CustodianRecord) {
  showNotification(
    `Hold release request queued for ${custodian.name} (${custodian.id}). Pending final authorization from Lead Litigation Counsel.`,
    'warning',
  )
}

function handleOpenIssueHoldModal() {
  isIssueHoldModalOpen.value = true
}

function handleCloseIssueHoldModal() {
  isIssueHoldModalOpen.value = false
  newHoldForm.value = {
    custodianName: '',
    custodianRole: '',
    custodianEmail: '',
    department: 'engineering',
    scopeNotes:
      'All source code repositories, direct messages, and design specifications relevant to Matter #LIT-2026-0842.',
  }
}

function handleIssueHoldSubmit() {
  if (!newHoldForm.value.custodianName || !newHoldForm.value.custodianEmail) {
    showNotification('Please enter custodian name and corporate email address.', 'warning')
    return
  }

  const name = newHoldForm.value.custodianName
  handleCloseIssueHoldModal()
  showNotification(
    `Legal Hold Notice #LIT-2026-0842-N6 dispatched to ${name}. Auto-purge suspension lock applied across endpoints.`,
    'success',
    5000,
  )
}

function copyToClipboard(text: string, type: 'signature' | 'verifyLink') {
  navigator.clipboard?.writeText(text)
  if (type === 'signature') {
    copiedSignature.value = true
    setTimeout(() => (copiedSignature.value = false), 2000)
  } else if (type === 'verifyLink') {
    copiedVerifyLink.value = true
    setTimeout(() => (copiedVerifyLink.value = false), 2000)
  }
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    if (selectedReceipt.value) closeReceiptModal()
    if (isIssueHoldModalOpen.value) handleCloseIssueHoldModal()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div :class="cn('w-full space-y-6', props.class)" data-slot="subpoena-legal-hold-manager">
    <!-- Header Card -->
    <Card class="border-border bg-card shadow-xs">
      <CardContent class="p-5 sm:p-6">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <!-- Left Column: Matter Details & Compliance Badges -->
          <div class="space-y-3">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-muted-foreground text-xs font-medium">
                Enterprise e-Discovery & Litigation Readiness
              </span>
              <Badge
                wrap
                variant="outline"
                class="border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-700 dark:text-emerald-400"
              >
                Fed. R. Civ. P. 37(e) Active Hold
              </Badge>
            </div>

            <div>
              <h2 class="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                Matter #LIT-2026-0842: In re UI Component Intellectual Property
              </h2>
              <p class="text-muted-foreground mt-1 text-sm font-medium">
                Federal Civil Litigation · US District Court SDNY
              </p>
            </div>

            <!-- Matter Metadata Strip -->
            <div class="text-muted-foreground flex flex-wrap items-center gap-3 pt-1 text-xs">
              <div class="flex items-center gap-1.5 font-mono tabular-nums">
                <span class="text-muted-foreground">Docket:</span>
                <span class="text-foreground font-medium">1:26-cv-04892-RMB</span>
              </div>
              <Separator orientation="vertical" class="h-3.5" />
              <div class="flex items-center gap-1">
                <Scale class="text-muted-foreground size-3.5" />
                <span>Hon. Richard M. Berman</span>
              </div>
              <Separator orientation="vertical" class="h-3.5" />
              <div class="flex items-center gap-1">
                <Shield class="text-muted-foreground size-3.5" />
                <span>Counsel: Vance &amp; Sterling LLP</span>
              </div>
              <Separator orientation="vertical" class="h-3.5" />
              <div class="flex items-center gap-1.5 font-mono tabular-nums">
                <Calendar class="text-muted-foreground size-3.5" />
                <span>Issued: Aug 14, 2026</span>
              </div>
            </div>
          </div>

          <!-- Right Column: Active Status Pill & Primary Action Buttons -->
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end">
            <!-- Hold Status Pill -->
            <div
              class="inline-flex items-center gap-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-semibold text-emerald-700 shadow-xs dark:bg-emerald-950/40 dark:text-emerald-300"
            >
              <ShieldCheck class="size-4.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div class="flex flex-col text-left">
                <span>Active Preservation Hold · 100% Custodian Compliance</span>
                <span class="text-xs font-normal text-emerald-600/90 dark:text-emerald-400/80">
                  18/18 Signed Receipts · Auto-Purge Suspended
                </span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                class="hover:bg-accent gap-1.5 text-xs shadow-xs transition-colors"
                :disabled="isExportingLog"
                @click="handleExportAuditLog"
              >
                <RefreshCw v-if="isExportingLog" class="size-3.5 animate-spin" />
                <FileSpreadsheet v-else class="text-foreground size-3.5" />
                <span>{{ isExportingLog ? 'Exporting Package...' : 'Export Custodian Audit Log' }}</span>
              </Button>

              <Button variant="default" size="sm" class="gap-1.5 text-xs shadow-xs" @click="handleOpenIssueHoldModal">
                <Plus class="size-3.5" />
                <span>Issue New Legal Hold</span>
              </Button>
            </div>
          </div>
        </div>

        <!-- Dynamic notification banner -->
        <div
          v-if="notificationBanner"
          :class="
            cn(
              'mt-4 flex items-center gap-2 rounded-md border p-2.5 text-xs transition-all',
              notificationBanner.type === 'success' &&
                'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200',
              notificationBanner.type === 'info' &&
                'border-sky-500/30 bg-sky-500/10 text-sky-800 dark:bg-sky-950/50 dark:text-sky-200',
              notificationBanner.type === 'warning' &&
                'border-amber-500/30 bg-amber-500/10 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200',
            )
          "
        >
          <CheckCircle2
            v-if="notificationBanner.type === 'success'"
            class="size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
          />
          <Info v-else-if="notificationBanner.type === 'info'" class="size-4 shrink-0 text-sky-600 dark:text-sky-400" />
          <AlertTriangle v-else class="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>{{ notificationBanner.message }}</span>
        </div>
      </CardContent>
    </Card>

    <!-- 4 Legal Hold Metric Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Card 1: Total Custodians Notified -->
      <Card class="border-border bg-card shadow-xs transition-shadow hover:shadow-sm">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-muted-foreground text-xs font-medium"> Total Custodians Notified </CardTitle>
          <div class="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-md">
            <Users class="size-4.5" />
          </div>
        </CardHeader>
        <CardContent class="space-y-3">
          <div>
            <div
              class="text-foreground flex items-baseline gap-1.5 font-mono text-2xl font-bold tracking-tight tabular-nums"
            >
              18 Custodians
            </div>
            <p class="text-muted-foreground text-xs">18 / 18 custodians active under hold notice</p>
          </div>
          <div class="space-y-1">
            <Progress :model-value="100" class="bg-primary/20 h-1.5" />
            <div class="text-muted-foreground flex items-center justify-between text-xs">
              <span class="text-foreground font-medium">Notice Delivery</span>
              <span class="font-mono tabular-nums">100% delivered</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Card 2: Acknowledgements Received -->
      <Card class="border-border bg-card shadow-xs transition-shadow hover:shadow-sm">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-muted-foreground text-xs font-medium"> Acknowledgements Received </CardTitle>
          <div
            class="flex size-8 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          >
            <FileCheck class="size-4.5" />
          </div>
        </CardHeader>
        <CardContent class="space-y-3">
          <div>
            <div
              class="flex items-baseline gap-1.5 font-mono text-2xl font-bold tracking-tight text-emerald-600 tabular-nums dark:text-emerald-400"
            >
              18 / 18 Signed · 100%
            </div>
            <p class="text-muted-foreground text-xs">Zero overdue · 100% compliant response rate</p>
          </div>
          <div class="space-y-1">
            <Progress :model-value="100" class="h-1.5 bg-emerald-500/20" />
            <div class="text-muted-foreground flex items-center justify-between text-xs">
              <span class="font-medium text-emerald-600 dark:text-emerald-400">Zero Non-Responsive</span>
              <span class="font-mono tabular-nums">0 pending</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Card 3: Auto-Purge Suspended Systems -->
      <Card class="border-border bg-card shadow-xs transition-shadow hover:shadow-sm">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-muted-foreground text-xs font-medium"> Auto-Purge Suspended Systems </CardTitle>
          <div
            class="flex size-8 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
          >
            <Lock class="size-4.5" />
          </div>
        </CardHeader>
        <CardContent class="space-y-3">
          <div>
            <div class="text-foreground font-mono text-lg font-bold tracking-tight tabular-nums sm:text-xl">
              4 Systems Active
            </div>
            <p class="truncate text-xs font-medium text-indigo-700 dark:text-indigo-400">Gmail, Slack, S3, GitHub</p>
          </div>
          <div class="border-border bg-muted/40 flex items-center justify-between rounded border px-2 py-1 text-xs">
            <span class="text-muted-foreground">Purge Status</span>
            <Badge
              wrap
              variant="outline"
              class="border-indigo-500/30 font-mono text-xs text-indigo-700 dark:text-indigo-400"
            >
              Retention Paused
            </Badge>
          </div>
        </CardContent>
      </Card>

      <!-- Card 4: Next Annual Re-certification -->
      <Card class="border-border bg-card shadow-xs transition-shadow hover:shadow-sm">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-muted-foreground text-xs font-medium"> Next Re-certification </CardTitle>
          <div
            class="flex size-8 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400"
          >
            <CalendarClock class="size-4.5" />
          </div>
        </CardHeader>
        <CardContent class="space-y-3">
          <div>
            <div class="text-foreground font-mono text-lg font-bold tracking-tight tabular-nums sm:text-xl">
              In 6 Months · Feb 2027
            </div>
            <p class="text-muted-foreground text-xs">Semi-annual custodian confirmation cycle</p>
          </div>
          <div class="border-border bg-muted/40 flex items-center justify-between rounded border px-2 py-1 text-xs">
            <span class="text-muted-foreground">Countdown</span>
            <span class="font-mono font-medium text-amber-700 tabular-nums dark:text-amber-400">
              178 days remaining
            </span>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Custodian Filter Toolbar & Search -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <!-- Category Filter Pills -->
      <div class="flex flex-wrap items-center gap-1.5">
        <button
          v-for="cat in filterCategories"
          :key="cat.id"
          type="button"
          :class="
            cn(
              'focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all focus-visible:ring-2 focus-visible:outline-none',
              activeFilter === cat.id
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground border',
            )
          "
          @click="activeFilter = cat.id"
        >
          <span>{{ cat.label }}</span>
          <span
            :class="
              cn(
                'py-0.2 rounded-full px-1.5 font-mono text-xs tabular-nums',
                activeFilter === cat.id
                  ? 'bg-primary-foreground/20 text-primary-foreground'
                  : 'bg-muted text-muted-foreground',
              )
            "
          >
            {{ cat.count }}
          </span>
        </button>
      </div>

      <!-- Search Input -->
      <div class="relative w-full sm:w-72">
        <Search class="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Filter custodians, roles, data sources..."
          class="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-8 w-full rounded-md border pr-8 pl-8 text-xs focus-visible:ring-2 focus-visible:outline-none"
        />
        <button
          aria-label="Clear search"
          v-if="searchQuery"
          type="button"
          class="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2"
          @click="searchQuery = ''"
        >
          <X class="size-3.5" />
        </button>
      </div>
    </div>

    <!-- Custodian Acknowledgement Roster Table Card -->
    <Card class="border-border bg-card shadow-xs">
      <CardHeader class="p-5 pb-3">
        <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle class="text-foreground text-base font-semibold tracking-tight">
              Custodian Acknowledgement Roster &amp; Preservation Status
            </CardTitle>
            <CardDescription class="text-muted-foreground text-xs">
              Active enterprise custodians, certified preservation receipts, and electronic data source scopes.
            </CardDescription>
          </div>
          <div class="flex items-center gap-2 pt-2 sm:pt-0">
            <span class="text-muted-foreground text-xs">
              Showing
              <span class="text-foreground font-mono font-medium tabular-nums">{{ filteredCustodians.length }}</span> of
              <span class="text-foreground font-mono font-medium tabular-nums">5</span> sample custodians
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent class="p-0">
        <div class="overflow-x-auto">
          <Table>
            <TableHeader class="bg-muted/40">
              <TableRow class="hover:bg-transparent">
                <TableHead
                  class="text-muted-foreground min-w-[260px] py-3 text-xs font-semibold tracking-wider uppercase"
                >
                  Custodian &amp; Department
                </TableHead>
                <TableHead
                  class="text-muted-foreground min-w-[130px] py-3 text-xs font-semibold tracking-wider uppercase"
                >
                  Notice Sent Date
                </TableHead>
                <TableHead
                  class="text-muted-foreground min-w-[170px] py-3 text-xs font-semibold tracking-wider uppercase"
                >
                  Acknowledged Date
                </TableHead>
                <TableHead
                  class="text-muted-foreground min-w-[170px] py-3 text-xs font-semibold tracking-wider uppercase"
                >
                  Compliance Status
                </TableHead>
                <TableHead
                  class="text-muted-foreground min-w-[280px] py-3 text-xs font-semibold tracking-wider uppercase"
                >
                  Data Sources Preserved
                </TableHead>
                <TableHead
                  class="text-muted-foreground min-w-[140px] py-3 text-right text-xs font-semibold tracking-wider uppercase"
                >
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow
                v-for="custodian in filteredCustodians"
                :key="custodian.id"
                class="hover:bg-muted/30 transition-colors"
              >
                <!-- Custodian Avatar, Name & Department -->
                <TableCell class="py-3.5 align-middle">
                  <div class="flex items-center gap-3">
                    <Avatar class="size-8 shrink-0">
                      <AvatarFallback class="text-primary bg-primary/10 text-xs font-semibold">
                        {{ custodian.avatarInitials }}
                      </AvatarFallback>
                    </Avatar>
                    <div class="min-w-0 space-y-0.5">
                      <div class="flex items-center gap-2">
                        <span class="text-foreground truncate text-sm font-semibold">
                          {{ custodian.name }}
                        </span>
                        <span class="text-muted-foreground font-mono text-xs tabular-nums">
                          {{ custodian.id }}
                        </span>
                      </div>
                      <div class="text-muted-foreground flex flex-wrap items-center gap-1.5 text-xs">
                        <span class="text-foreground font-medium">{{ custodian.role }}</span>
                        <span>·</span>
                        <span>{{ custodian.department }}</span>
                      </div>
                    </div>
                  </div>
                </TableCell>

                <!-- Notice Sent Date -->
                <TableCell class="py-3.5 align-middle">
                  <div class="text-foreground flex items-center gap-1.5 font-mono text-xs tabular-nums">
                    <Send class="text-muted-foreground size-3.5" />
                    <span>{{ custodian.noticeSentDate }}</span>
                  </div>
                </TableCell>

                <!-- Acknowledged Date -->
                <TableCell class="py-3.5 align-middle">
                  <div class="space-y-0.5">
                    <div class="text-foreground flex items-center gap-1.5 font-mono text-xs font-medium tabular-nums">
                      <Clock class="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <span>{{ custodian.acknowledgedDate }}</span>
                    </div>
                    <div
                      class="text-muted-foreground max-w-[160px] truncate font-mono text-xs"
                      :title="custodian.ipAddress"
                    >
                      IP: {{ custodian.ipAddress }}
                    </div>
                  </div>
                </TableCell>

                <!-- Compliance Status Badge -->
                <TableCell class="py-3.5 align-middle">
                  <div class="space-y-1">
                    <div
                      class="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400"
                    >
                      <BadgeCheck class="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <span>{{ custodian.statusLabel }}</span>
                    </div>
                    <p class="text-muted-foreground text-xs">Receipt Verified</p>
                  </div>
                </TableCell>

                <!-- Data Sources Preserved -->
                <TableCell class="py-3.5 align-middle">
                  <div class="space-y-1.5">
                    <div class="flex flex-wrap items-center gap-1">
                      <Badge
                        wrap
                        v-for="source in custodian.dataSources"
                        :key="source"
                        variant="secondary"
                        class="px-2 py-0.5 text-xs font-normal"
                      >
                        {{ source }}
                      </Badge>
                    </div>
                    <p class="text-muted-foreground font-mono text-xs tabular-nums">
                      Scope: {{ custodian.preservedAssets }}
                    </p>
                  </div>
                </TableCell>

                <!-- Actions Dropdown -->
                <TableCell class="py-3.5 text-right align-middle">
                  <div class="flex items-center justify-end gap-1.5">
                    <Button
                      variant="outline"
                      size="xs"
                      class="hover:bg-accent h-7 gap-1 px-2.5 text-xs font-medium shadow-2xs"
                      @click="openReceiptModal(custodian)"
                    >
                      <FileCheck class="text-muted-foreground size-3" />
                      <span>Receipt</span>
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger as-child>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          class="text-muted-foreground hover:text-foreground size-7 p-0"
                        >
                          <MoreHorizontal class="size-4" />
                          <span class="sr-only">Open custodian options for {{ custodian.name }}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" class="w-52">
                        <DropdownMenuLabel class="text-xs font-semibold"> Custodian Actions </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem class="cursor-pointer text-xs" @click="openReceiptModal(custodian)">
                          <FileCheck class="mr-2 size-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>View Signed Receipt</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem class="cursor-pointer text-xs" @click="handleSendReminder(custodian)">
                          <Mail class="text-muted-foreground mr-2 size-3.5" />
                          <span>Send Re-affirmation Notice</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem class="cursor-pointer text-xs" @click="handleRecertify(custodian)">
                          <RotateCcw class="text-muted-foreground mr-2 size-3.5" />
                          <span>Initiate Re-certification</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          class="text-destructive focus:text-destructive cursor-pointer text-xs"
                          @click="handleReleaseFromHold(custodian)"
                        >
                          <UserX class="text-destructive mr-2 size-3.5" />
                          <span>Release from Hold...</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>

              <TableRow v-if="filteredCustodians.length === 0">
                <TableCell colspan="6" class="text-muted-foreground py-8 text-center text-xs">
                  No custodians match your search or filter criteria.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <!-- Table Sub-Footer -->
      <CardFooter
        class="border-border bg-muted/20 text-muted-foreground flex flex-col gap-2 border-t p-4 text-xs sm:flex-row sm:items-center sm:justify-between"
      >
        <div class="flex items-center gap-2">
          <ShieldCheck class="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>
            All custodian preservation receipts are immutably timestamped and hashed under SEC &amp; FRCP 37(e)
            evidentiary rules.
          </span>
        </div>
        <div class="flex items-center gap-2 font-mono tabular-nums">
          <span>Roster Hash: e7d9-4081-9bf2</span>
          <span class="font-medium text-emerald-600 dark:text-emerald-400">18 Total Certified</span>
        </div>
      </CardFooter>
    </Card>

    <!-- System Preservation Integrations Card -->
    <Card class="border-border bg-card shadow-xs">
      <CardHeader class="p-5 pb-3">
        <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div class="space-y-0.5">
            <div class="flex items-center gap-2">
              <Server class="text-primary size-4" />
              <CardTitle class="text-foreground text-base font-semibold tracking-tight">
                System Preservation Integrations &amp; Automated Storage Locks
              </CardTitle>
            </div>
            <CardDescription class="text-muted-foreground text-xs">
              Automated retention policy overrides and immutable WORM lock status across enterprise infrastructure.
            </CardDescription>
          </div>
          <Badge wrap variant="outline" class="w-fit border-indigo-500/30 text-xs text-indigo-700 dark:text-indigo-400">
            4 / 4 Systems Enforced
          </Badge>
        </div>
      </CardHeader>

      <CardContent class="p-5 pt-2">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div
            v-for="system in preservationSystemsData"
            :key="system.id"
            class="border-border bg-muted/30 hover:bg-muted/50 flex flex-col justify-between space-y-3 rounded-lg border p-4 transition-colors"
          >
            <div class="space-y-2">
              <div class="flex items-start justify-between gap-2">
                <div class="flex items-center gap-2.5">
                  <div
                    class="border-border bg-card text-foreground flex size-8 items-center justify-center rounded-md border shadow-2xs"
                  >
                    <Lock class="size-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h4 class="text-foreground text-sm font-semibold">
                      {{ system.name }}
                    </h4>
                    <p class="text-muted-foreground text-xs">
                      {{ system.integrationType }}
                    </p>
                  </div>
                </div>
                <div
                  class="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400"
                >
                  <span class="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                  <span>Locked</span>
                </div>
              </div>

              <p class="text-muted-foreground text-xs leading-relaxed">
                {{ system.scope }}
              </p>
            </div>

            <div class="border-border/60 space-y-1.5 border-t pt-2.5 text-xs">
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">Enforcement:</span>
                <span class="text-foreground font-mono font-medium">{{ system.lockProtocol }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">Last Audit Sync:</span>
                <span class="text-muted-foreground font-mono tabular-nums">{{ system.lastSync }}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Custodian Signed Receipt & Cryptographic Audit Modal -->
    <div
      v-if="selectedReceipt"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs transition-opacity"
      @click.self="closeReceiptModal"
    >
      <div
        class="border-border bg-card text-card-foreground animate-in fade-in zoom-in-95 relative w-full max-w-2xl overflow-hidden rounded-xl border shadow-sm duration-200"
      >
        <!-- Modal Top Bar -->
        <div class="border-border bg-muted/40 flex items-center justify-between border-b px-5 py-3.5">
          <div class="flex items-center gap-2.5">
            <div
              class="flex size-7 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            >
              <BadgeCheck class="size-4" />
            </div>
            <div>
              <h3 class="text-foreground text-xs font-semibold">Preservation Acknowledgment Receipt</h3>
              <p class="text-muted-foreground font-mono text-xs tabular-nums">
                Record ID: {{ selectedReceipt.id }} · Matter #LIT-2026-0842
              </p>
            </div>
          </div>

          <button
            type="button"
            class="text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-ring rounded-md p-1.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
            aria-label="Close receipt modal"
            @click="closeReceiptModal"
          >
            <X class="size-4" />
          </button>
        </div>

        <!-- Receipt Document Body -->
        <div class="max-h-[75vh] space-y-5 overflow-y-auto p-6">
          <!-- Legal Receipt Certificate Frame -->
          <div
            class="relative rounded-lg border-2 border-dashed border-emerald-500/30 bg-emerald-500/5 p-5 dark:bg-emerald-950/20"
          >
            <div class="border-border/80 flex items-center justify-between border-b pb-3">
              <div class="space-y-0.5">
                <span class="text-xs font-semibold tracking-wide text-emerald-700 dark:text-emerald-400">
                  Certified Custodian E-Discovery Receipt
                </span>
                <h4 class="text-foreground text-base font-bold">Litigation Hold Notice &amp; Preservation Directive</h4>
              </div>
              <Badge
                wrap
                variant="outline"
                class="border-emerald-500/40 text-xs font-semibold text-emerald-700 dark:text-emerald-400"
              >
                100% Valid &amp; Attested
              </Badge>
            </div>

            <div class="text-foreground mt-4 space-y-3 text-xs leading-relaxed">
              <div class="bg-card/60 border-border/60 grid grid-cols-2 gap-3 rounded-md border p-3 sm:grid-cols-3">
                <div>
                  <span class="text-muted-foreground block text-xs">Custodian Name:</span>
                  <span class="text-foreground text-sm font-semibold">{{ selectedReceipt.name }}</span>
                </div>
                <div>
                  <span class="text-muted-foreground block text-xs">Title &amp; Role:</span>
                  <span class="text-foreground font-medium">{{ selectedReceipt.role }}</span>
                </div>
                <div>
                  <span class="text-muted-foreground block text-xs">Corporate Email:</span>
                  <span class="text-foreground font-mono">{{ selectedReceipt.email }}</span>
                </div>
              </div>

              <!-- Legal Notice Text -->
              <div class="text-muted-foreground bg-muted/40 border-border/60 space-y-1.5 rounded-md border p-3 text-xs">
                <p class="text-foreground font-semibold">Acknowledgment Declaration &amp; Legal Affirmation:</p>
                <p>
                  "I hereby confirm receipt and comprehension of the Formal Legal Hold Notice for Matter #LIT-2026-0842.
                  I have immediately ceased all automated or manual deletion, purging, and overwriting of relevant
                  electronic documents, chat logs, code commits, emails, and physical files within my custody or
                  control."
                </p>
              </div>

              <!-- Preserved Repositories -->
              <div class="space-y-1 pt-1">
                <span class="text-foreground text-xs font-semibold">Mandatory Preserved Repositories:</span>
                <div class="flex flex-wrap gap-1.5 pt-0.5">
                  <Badge
                    wrap
                    v-for="source in selectedReceipt.dataSources"
                    :key="source"
                    variant="secondary"
                    class="text-xs"
                  >
                    {{ source }}
                  </Badge>
                </div>
              </div>
            </div>

            <!-- Attestation Timestamps -->
            <div class="border-border/60 mt-4 grid grid-cols-2 gap-3 border-t pt-3 text-xs sm:grid-cols-3">
              <div>
                <span class="text-muted-foreground block">Notice Dispatched:</span>
                <span class="text-foreground font-mono font-medium tabular-nums">{{
                  selectedReceipt.noticeSentDate
                }}</span>
              </div>
              <div>
                <span class="text-muted-foreground block">Signed &amp; Acknowledged:</span>
                <span class="font-mono font-medium text-emerald-600 tabular-nums dark:text-emerald-400">
                  {{ selectedReceipt.acknowledgedDate }}
                </span>
              </div>
              <div>
                <span class="text-muted-foreground block">Origin Host IP:</span>
                <span class="text-foreground font-mono tabular-nums">{{ selectedReceipt.ipAddress }}</span>
              </div>
            </div>
          </div>

          <!-- Cryptographic SHA-256 Signature Box -->
          <div class="border-border bg-muted/40 space-y-2 rounded-lg border p-3.5 text-xs">
            <div class="flex items-center justify-between">
              <div class="text-foreground flex items-center gap-1.5 font-medium">
                <ShieldCheck class="size-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Digital Signature Digest (SHA-256)</span>
              </div>
              <button
                type="button"
                class="text-primary flex items-center gap-1 text-xs font-medium hover:underline"
                @click="copyToClipboard(selectedReceipt.sha256Signature, 'signature')"
              >
                <Check v-if="copiedSignature" class="size-3 text-emerald-600" />
                <Copy v-else class="size-3" />
                <span>{{ copiedSignature ? 'Copied' : 'Copy Hash' }}</span>
              </button>
            </div>
            <p
              class="text-muted-foreground bg-background/80 border-border rounded border p-2 font-mono text-xs break-all"
            >
              {{ selectedReceipt.sha256Signature }}
            </p>
            <div
              class="border-border/50 text-muted-foreground flex flex-wrap items-center justify-between gap-2 border-t pt-1"
            >
              <span>Attestation Engine: UIPKGE Legal Vault v4</span>
              <span class="font-mono tabular-nums">Evidentiary Standard: FRCP 37(e)</span>
            </div>
          </div>
        </div>

        <!-- Modal Actions Footer -->
        <div
          class="border-border bg-muted/40 flex flex-col-reverse gap-2 border-t p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <Button
            variant="ghost"
            size="sm"
            class="text-xs"
            @click="copyToClipboard(`https://uipkge.dev/legal/receipt/${selectedReceipt.id}`, 'verifyLink')"
          >
            <Check v-if="copiedVerifyLink" class="size-3.5 text-emerald-600" />
            <Share2 v-else class="size-3.5" />
            <span>{{ copiedVerifyLink ? 'Link Copied!' : 'Copy Verification Link' }}</span>
          </Button>

          <div class="flex items-center gap-2">
            <Button variant="outline" size="sm" class="text-xs" @click="closeReceiptModal"> Close </Button>
            <Button
              aria-label="Download attachment"
              variant="default"
              size="sm"
              class="gap-1.5 text-xs shadow-xs"
              @click="handleExportAndClose"
            >
              <Download class="size-3.5" />
              <span>Download Signed PDF</span>
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Issue New Legal Hold Modal -->
    <div
      v-if="isIssueHoldModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs transition-opacity"
      @click.self="handleCloseIssueHoldModal"
    >
      <div
        class="border-border bg-card text-card-foreground animate-in fade-in zoom-in-95 relative w-full max-w-lg overflow-hidden rounded-xl border shadow-sm duration-200"
      >
        <div class="border-border bg-muted/40 flex items-center justify-between border-b px-5 py-3.5">
          <div class="flex items-center gap-2">
            <div class="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-full">
              <Plus class="size-4" />
            </div>
            <div>
              <h3 class="text-foreground text-sm font-bold">Issue New Legal Hold Notice</h3>
              <p class="text-muted-foreground text-xs">Matter #LIT-2026-0842 · Dispatch formal preservation notice</p>
            </div>
          </div>
          <button
            aria-label="Close issue hold dialog"
            type="button"
            class="text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-ring rounded-md p-1.5 focus-visible:ring-2 focus-visible:outline-none"
            @click="handleCloseIssueHoldModal"
          >
            <X class="size-4" />
          </button>
        </div>

        <div class="space-y-4 p-5 text-xs">
          <div class="rounded-md border border-indigo-500/30 bg-indigo-500/10 p-3 text-indigo-900 dark:text-indigo-200">
            <div class="flex gap-2">
              <Info class="size-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
              <p class="leading-relaxed">
                Issuing a notice automatically suspends auto-tombstoning and scheduled purges across Gmail, Slack, and
                cloud storage for this custodian.
              </p>
            </div>
          </div>

          <div class="space-y-3">
            <div>
              <label class="text-foreground mb-1 block font-semibold"> Custodian Full Name </label>
              <input
                v-model="newHoldForm.custodianName"
                type="text"
                placeholder="e.g. Jordan Mitchell"
                class="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-8 w-full rounded-md border px-3 text-xs focus-visible:ring-2 focus-visible:outline-none"
              />
            </div>

            <div>
              <label class="text-foreground mb-1 block font-semibold"> Corporate Email Address </label>
              <input
                v-model="newHoldForm.custodianEmail"
                type="email"
                placeholder="e.g. jordan.mitchell@uipkge.internal"
                class="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-8 w-full rounded-md border px-3 text-xs focus-visible:ring-2 focus-visible:outline-none"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-foreground mb-1 block font-semibold"> Title &amp; Role </label>
                <input
                  v-model="newHoldForm.custodianRole"
                  type="text"
                  placeholder="e.g. Principal Engineer"
                  class="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-8 w-full rounded-md border px-3 text-xs focus-visible:ring-2 focus-visible:outline-none"
                />
              </div>
              <div>
                <label class="text-foreground mb-1 block font-semibold"> Department </label>
                <select
                  v-model="newHoldForm.department"
                  class="border-input bg-background text-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-8 w-full rounded-md border px-2 text-xs focus-visible:ring-2 focus-visible:outline-none"
                >
                  <option value="engineering">Engineering</option>
                  <option value="product">Product &amp; Design</option>
                  <option value="operations">Operations &amp; Legal</option>
                </select>
              </div>
            </div>

            <div>
              <label class="text-foreground mb-1 block font-semibold">
                Preservation Scope &amp; Custom Instructions
              </label>
              <textarea
                v-model="newHoldForm.scopeNotes"
                rows="3"
                class="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-md border p-2.5 text-xs focus-visible:ring-2 focus-visible:outline-none"
              />
            </div>
          </div>
        </div>

        <div class="border-border bg-muted/40 flex items-center justify-end gap-2 border-t p-4">
          <Button
            aria-label="Close issue hold dialog"
            variant="outline"
            size="sm"
            class="text-xs"
            @click="handleCloseIssueHoldModal"
          >
            Cancel
          </Button>
          <Button variant="default" size="sm" class="gap-1.5 text-xs shadow-xs" @click="handleIssueHoldSubmit">
            <Send class="size-3.5" />
            <span>Dispatch Notice &amp; Apply Lock</span>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
