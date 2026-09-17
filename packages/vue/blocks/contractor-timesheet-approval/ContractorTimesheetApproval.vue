<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, ref } from 'vue'
import {
  AlertCircle,
  ArrowUpRight,
  Calendar,
  Check,
  CheckCheck,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  Download,
  ExternalLink,
  Eye,
  FileCheck,
  FileCode,
  FileSpreadsheet,
  FileText,
  Filter,
  GitBranch,
  GitCommit,
  GitPullRequest,
  Globe,
  MoreHorizontal,
  RotateCcw,
  Search,
  ShieldCheck,
  Timer,
  User,
  Users,
  Wallet,
  XCircle,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export type ApprovalStatus = 'pending' | 'approved' | 'disputed'
export type DeliverableType = 'github_pr' | 'figma' | 'ci_pipeline' | 'code_review'

export interface DailyTimesheetEntry {
  id: string
  date: string
  day: string
  hours: number
  regularHours: number
  overtimeHours: number
  task: string
  deliverableType: DeliverableType
  referenceId: string
  referenceLabel: string
  commitCount?: number
  verified: boolean
}

export interface ContractorSubmission {
  id: string
  name: string
  initials: string
  avatarUrl?: string
  role: string
  country: string
  countryCode: string
  flag: string
  city: string
  contractType: string
  hourlyRateUsd: number
  hourlyRateLocal: number
  currencyCode: string
  currencySymbol: string
  fxRate: number
  hoursLogged: number
  regularHours: number
  overtimeHours: number
  grossAmountLocal: number
  grossAmountUsd: number
  verificationBadge: {
    label: string
    subtext: string
    status: 'verified' | 'manual'
  }
  status: ApprovalStatus
  invoiceNumber: string
  submittedAt: string
  payPeriod: string
  taxCompliance: {
    w8benStatus: 'valid' | 'pending' | 'exempt'
    taxIdMasked: string
    jurisdiction: string
  }
  paymentMethod: {
    type: 'SWIFT' | 'SEPA' | 'Local Wire' | 'ACH'
    accountMasked: string
    bankName: string
  }
  dailyEntries: DailyTimesheetEntry[]
}

interface Props {
  title?: string
  subtitle?: string
  payCycle?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Contractor Invoices & Timesheets',
  subtitle:
    'Review international contractor hours, verify commit logs & deliverables, and execute multi-currency invoice approvals.',
  payCycle: 'August 2026 · Bi-Weekly #2',
})

const initialSubmissions: ContractorSubmission[] = [
  {
    id: 'ctr-1',
    name: "Liam O'Connor",
    initials: 'LO',
    role: 'Senior React Engineer',
    country: 'United Kingdom',
    countryCode: 'GB',
    flag: '🇬🇧',
    city: 'London, UK',
    contractType: 'Hourly Contract · $97.00/hr',
    hourlyRateUsd: 97.0,
    hourlyRateLocal: 76.0,
    currencyCode: 'GBP',
    currencySymbol: '£',
    fxRate: 1.2763,
    hoursLogged: 50.0,
    regularHours: 40.0,
    overtimeHours: 10.0,
    grossAmountLocal: 3800.0,
    grossAmountUsd: 4850.0,
    verificationBadge: {
      label: 'Verified with GitHub PRs',
      subtext: '14 PRs merged · 46 verified commits',
      status: 'verified',
    },
    status: 'pending',
    invoiceNumber: 'INV-2026-UK-0841',
    submittedAt: 'Aug 21, 2026 · 17:45 UTC',
    payPeriod: 'Aug 08 – Aug 21, 2026',
    taxCompliance: {
      w8benStatus: 'valid',
      taxIdMasked: 'GB-UTR ••••••8912',
      jurisdiction: 'HMRC UK (Non-US Source)',
    },
    paymentMethod: {
      type: 'SWIFT',
      accountMasked: 'Barclays •••• 4421',
      bankName: 'Barclays Bank UK PLC',
    },
    dailyEntries: [
      {
        id: 'entry-1-1',
        date: '2026-08-17',
        day: 'Mon, Aug 17',
        hours: 10.0,
        regularHours: 8.0,
        overtimeHours: 2.0,
        task: 'Refactoring OKLCH Color Engine & AST Parser for sub-theme resolution',
        deliverableType: 'github_pr',
        referenceId: 'PR #412',
        referenceLabel: 'feature/v4-ast-parser',
        commitCount: 12,
        verified: true,
      },
      {
        id: 'entry-1-2',
        date: '2026-08-18',
        day: 'Tue, Aug 18',
        hours: 10.0,
        regularHours: 8.0,
        overtimeHours: 2.0,
        task: 'SSR Hydration Mismatch Resolver for cross-framework Island Architectures',
        deliverableType: 'github_pr',
        referenceId: 'PR #415',
        referenceLabel: 'fix/island-hydration',
        commitCount: 8,
        verified: true,
      },
      {
        id: 'entry-1-3',
        date: '2026-08-19',
        day: 'Wed, Aug 19',
        hours: 10.0,
        regularHours: 8.0,
        overtimeHours: 2.0,
        task: 'Design token runtime compilation and memoized theme class cache',
        deliverableType: 'github_pr',
        referenceId: 'PR #418',
        referenceLabel: 'perf/token-runtime',
        commitCount: 7,
        verified: true,
      },
      {
        id: 'entry-1-4',
        date: '2026-08-20',
        day: 'Thu, Aug 20',
        hours: 10.0,
        regularHours: 8.0,
        overtimeHours: 2.0,
        task: 'Figma token sync GitHub Action workflow optimization and schema tests',
        deliverableType: 'github_pr',
        referenceId: 'PR #419',
        referenceLabel: 'ci/figma-token-sync',
        commitCount: 9,
        verified: true,
      },
      {
        id: 'entry-1-5',
        date: '2026-08-21',
        day: 'Fri, Aug 21',
        hours: 10.0,
        regularHours: 8.0,
        overtimeHours: 2.0,
        task: 'Reka UI combobox accessible keyboard navigation bridge and focus ring parity',
        deliverableType: 'github_pr',
        referenceId: 'PR #423',
        referenceLabel: 'feat/reka-combobox-a11y',
        commitCount: 10,
        verified: true,
      },
    ],
  },
  {
    id: 'ctr-2',
    name: 'Yuki Tanaka',
    initials: 'YT',
    role: 'UI/UX Designer',
    country: 'Japan',
    countryCode: 'JP',
    flag: '🇯🇵',
    city: 'Tokyo, JP',
    contractType: 'Hourly Contract · $90.00/hr',
    hourlyRateUsd: 90.0,
    hourlyRateLocal: 13500,
    currencyCode: 'JPY',
    currencySymbol: '¥',
    fxRate: 0.00667,
    hoursLogged: 60.0,
    regularHours: 40.0,
    overtimeHours: 20.0,
    grossAmountLocal: 810000,
    grossAmountUsd: 5400.0,
    verificationBadge: {
      label: 'Figma Files & Handoff Verified',
      subtext: '8 wireframes & design spec approved',
      status: 'verified',
    },
    status: 'pending',
    invoiceNumber: 'INV-2026-JP-0219',
    submittedAt: 'Aug 21, 2026 · 14:10 UTC',
    payPeriod: 'Aug 08 – Aug 21, 2026',
    taxCompliance: {
      w8benStatus: 'valid',
      taxIdMasked: 'JP-NTA ••••••4401',
      jurisdiction: 'National Tax Agency Japan',
    },
    paymentMethod: {
      type: 'Local Wire',
      accountMasked: 'MUFG •••• 9102',
      bankName: 'Mitsubishi UFJ Financial Group',
    },
    dailyEntries: [
      {
        id: 'entry-2-1',
        date: '2026-08-17',
        day: 'Mon, Aug 17',
        hours: 12.0,
        regularHours: 8.0,
        overtimeHours: 4.0,
        task: 'Enterprise Multi-currency Invoicing Flow User Journey Map & Edge Cases',
        deliverableType: 'figma',
        referenceId: 'Node #492:102',
        referenceLabel: 'figma.com/@uipkge/multi-currency-flow',
        commitCount: 6,
        verified: true,
      },
      {
        id: 'entry-2-2',
        date: '2026-08-18',
        day: 'Tue, Aug 18',
        hours: 12.0,
        regularHours: 8.0,
        overtimeHours: 4.0,
        task: 'Contractor Compliance Document Verification UX Specs & Empty States',
        deliverableType: 'figma',
        referenceId: 'Node #495:88',
        referenceLabel: 'figma.com/@uipkge/compliance-docs',
        commitCount: 5,
        verified: true,
      },
      {
        id: 'entry-2-3',
        date: '2026-08-19',
        day: 'Wed, Aug 19',
        hours: 12.0,
        regularHours: 8.0,
        overtimeHours: 4.0,
        task: 'Mobile responsive Timesheet approval breakpoints, drawers, and gesture specs',
        deliverableType: 'figma',
        referenceId: 'Node #501:14',
        referenceLabel: 'figma.com/@uipkge/mobile-timesheet',
        commitCount: 8,
        verified: true,
      },
      {
        id: 'entry-2-4',
        date: '2026-08-20',
        day: 'Thu, Aug 20',
        hours: 12.0,
        regularHours: 8.0,
        overtimeHours: 4.0,
        task: 'Interactive Design System Token Library for Dark/Light Themes & High-Contrast',
        deliverableType: 'figma',
        referenceId: 'Node #510:33',
        referenceLabel: 'figma.com/@uipkge/tokens-library',
        commitCount: 11,
        verified: true,
      },
      {
        id: 'entry-2-5',
        date: '2026-08-21',
        day: 'Fri, Aug 21',
        hours: 12.0,
        regularHours: 8.0,
        overtimeHours: 4.0,
        task: 'Usability testing session synthesis, prototype refinements, and engineering handoff',
        deliverableType: 'figma',
        referenceId: 'Node #514:02',
        referenceLabel: 'figma.com/@uipkge/handoff-v2',
        commitCount: 4,
        verified: true,
      },
    ],
  },
  {
    id: 'ctr-3',
    name: 'Mateo Silva',
    initials: 'MS',
    role: 'Go Backend Specialist',
    country: 'Brazil',
    countryCode: 'BR',
    flag: '🇧🇷',
    city: 'São Paulo, BR',
    contractType: 'Hourly Contract · $91.11/hr',
    hourlyRateUsd: 91.11,
    hourlyRateLocal: 455.55,
    currencyCode: 'BRL',
    currencySymbol: 'R$',
    fxRate: 0.2,
    hoursLogged: 90.0,
    regularHours: 40.0,
    overtimeHours: 50.0,
    grossAmountLocal: 41000.0,
    grossAmountUsd: 8200.0,
    verificationBadge: {
      label: 'Verified with GitHub PRs',
      subtext: 'Kafka partitioning & Redis idempotency engine',
      status: 'verified',
    },
    status: 'pending',
    invoiceNumber: 'INV-2026-BR-0572',
    submittedAt: 'Aug 21, 2026 · 19:20 UTC',
    payPeriod: 'Aug 08 – Aug 21, 2026',
    taxCompliance: {
      w8benStatus: 'valid',
      taxIdMasked: 'BR-CNPJ ••••••7100',
      jurisdiction: 'Receita Federal do Brasil',
    },
    paymentMethod: {
      type: 'SWIFT',
      accountMasked: 'Itaú Unibanco •••• 8831',
      bankName: 'Banco Itaú S.A.',
    },
    dailyEntries: [
      {
        id: 'entry-3-1',
        date: '2026-08-17',
        day: 'Mon, Aug 17',
        hours: 18.0,
        regularHours: 8.0,
        overtimeHours: 10.0,
        task: 'Distributed transaction saga orchestrator for multi-currency payout reconciliation',
        deliverableType: 'github_pr',
        referenceId: 'PR #289',
        referenceLabel: 'feat/saga-orchestrator',
        commitCount: 15,
        verified: true,
      },
      {
        id: 'entry-3-2',
        date: '2026-08-18',
        day: 'Tue, Aug 18',
        hours: 18.0,
        regularHours: 8.0,
        overtimeHours: 10.0,
        task: 'Zero-downtime PostgreSQL table partitioning for timesheet audit logs & retention',
        deliverableType: 'github_pr',
        referenceId: 'PR #294',
        referenceLabel: 'db/pg-partitioning',
        commitCount: 7,
        verified: true,
      },
      {
        id: 'entry-3-3',
        date: '2026-08-19',
        day: 'Wed, Aug 19',
        hours: 18.0,
        regularHours: 8.0,
        overtimeHours: 10.0,
        task: 'Webhook delivery retry backoff with Kafka dead-letter queue & idempotency keys',
        deliverableType: 'github_pr',
        referenceId: 'PR #298',
        referenceLabel: 'feat/kafka-dlq-retries',
        commitCount: 19,
        verified: true,
      },
      {
        id: 'entry-3-4',
        date: '2026-08-20',
        day: 'Thu, Aug 20',
        hours: 18.0,
        regularHours: 8.0,
        overtimeHours: 10.0,
        task: 'Prometheus latency metric instrumentation & Grafana alert rules for payment workers',
        deliverableType: 'github_pr',
        referenceId: 'PR #302',
        referenceLabel: 'obs/prometheus-metrics',
        commitCount: 5,
        verified: true,
      },
      {
        id: 'entry-3-5',
        date: '2026-08-21',
        day: 'Fri, Aug 21',
        hours: 18.0,
        regularHours: 8.0,
        overtimeHours: 10.0,
        task: 'Payment gateway failover simulation & multi-region load testing at 25k req/s',
        deliverableType: 'github_pr',
        referenceId: 'PR #307',
        referenceLabel: 'test/gateway-failover',
        commitCount: 12,
        verified: true,
      },
    ],
  },
  {
    id: 'ctr-4',
    name: 'Chloe Dubois',
    initials: 'CD',
    role: 'QA Automation Lead',
    country: 'France',
    countryCode: 'FR',
    flag: '🇫🇷',
    city: 'Paris, FR',
    contractType: 'Hourly Contract · $92.00/hr',
    hourlyRateUsd: 92.0,
    hourlyRateLocal: 85.0,
    currencyCode: 'EUR',
    currencySymbol: '€',
    fxRate: 1.0824,
    hoursLogged: 40.0,
    regularHours: 40.0,
    overtimeHours: 0.0,
    grossAmountLocal: 3400.0,
    grossAmountUsd: 3680.0,
    verificationBadge: {
      label: 'Playwright E2E Suites 100% Pass',
      subtext: 'CI Run #8821 verified · 342 browser tests green',
      status: 'verified',
    },
    status: 'approved',
    invoiceNumber: 'INV-2026-FR-1108',
    submittedAt: 'Aug 20, 2026 · 16:30 UTC',
    payPeriod: 'Aug 08 – Aug 21, 2026',
    taxCompliance: {
      w8benStatus: 'valid',
      taxIdMasked: 'FR-SIRET ••••••3921',
      jurisdiction: 'DGFiP France (EU VAT Reg)',
    },
    paymentMethod: {
      type: 'SEPA',
      accountMasked: 'BNP Paribas •••• 5590',
      bankName: 'BNP Paribas S.A.',
    },
    dailyEntries: [
      {
        id: 'entry-4-1',
        date: '2026-08-17',
        day: 'Mon, Aug 17',
        hours: 8.0,
        regularHours: 8.0,
        overtimeHours: 0.0,
        task: 'Playwright end-to-end multi-currency payment checkout regression suite',
        deliverableType: 'ci_pipeline',
        referenceId: 'CI Run #8812',
        referenceLabel: 'e2e-checkout-matrix',
        commitCount: 8,
        verified: true,
      },
      {
        id: 'entry-4-2',
        date: '2026-08-18',
        day: 'Tue, Aug 18',
        hours: 8.0,
        regularHours: 8.0,
        overtimeHours: 0.0,
        task: 'Visual regression tests for dark mode and high-contrast accessibility across viewports',
        deliverableType: 'ci_pipeline',
        referenceId: 'CI Run #8815',
        referenceLabel: 'visual-regression-a11y',
        commitCount: 6,
        verified: true,
      },
      {
        id: 'entry-4-3',
        date: '2026-08-19',
        day: 'Wed, Aug 19',
        hours: 8.0,
        regularHours: 8.0,
        overtimeHours: 0.0,
        task: 'Automated timesheet submission stress testing & concurrent approval race conditions',
        deliverableType: 'ci_pipeline',
        referenceId: 'CI Run #8818',
        referenceLabel: 'load-timesheet-concurrency',
        commitCount: 14,
        verified: true,
      },
      {
        id: 'entry-4-4',
        date: '2026-08-20',
        day: 'Thu, Aug 20',
        hours: 8.0,
        regularHours: 8.0,
        overtimeHours: 0.0,
        task: 'Cross-browser matrix testing (Chromium, Firefox, WebKit) on macOS/Linux runners',
        deliverableType: 'ci_pipeline',
        referenceId: 'CI Run #8820',
        referenceLabel: 'cross-browser-ci',
        commitCount: 4,
        verified: true,
      },
      {
        id: 'entry-4-5',
        date: '2026-08-21',
        day: 'Fri, Aug 21',
        hours: 8.0,
        regularHours: 8.0,
        overtimeHours: 0.0,
        task: 'CI test sharding optimization reducing full regression duration from 18m to 3m 12s',
        deliverableType: 'ci_pipeline',
        referenceId: 'CI Run #8821',
        referenceLabel: 'ci-sharding-speedup',
        commitCount: 5,
        verified: true,
      },
    ],
  },
]

const submissions = ref<ContractorSubmission[]>(JSON.parse(JSON.stringify(initialSubmissions)))
const searchQuery = ref('')
const selectedStatus = ref<'all' | 'pending' | 'approved' | 'disputed'>('all')
const currencyDisplay = ref<'both' | 'usd' | 'local'>('both')
const selectedContractorId = ref<string | null>(null)
const isDrawerOpen = ref(false)
const isApprovingAll = ref(false)
const bulkApprovalDone = ref(false)

const pendingSubmissions = computed(() => submissions.value.filter((s) => s.status === 'pending'))
const pendingCount = computed(() => pendingSubmissions.value.length)
const pendingAmountUsd = computed(() => pendingSubmissions.value.reduce((acc, curr) => acc + curr.grossAmountUsd, 0))

const approvedSubmissions = computed(() => submissions.value.filter((s) => s.status === 'approved'))
const approvedCount = computed(() => approvedSubmissions.value.length)
const approvedAmountUsd = computed(() => approvedSubmissions.value.reduce((acc, curr) => acc + curr.grossAmountUsd, 0))

const disputedSubmissions = computed(() => submissions.value.filter((s) => s.status === 'disputed'))
const disputedCount = computed(() => disputedSubmissions.value.length)

const totalHoursLogged = computed(() => submissions.value.reduce((acc, curr) => acc + curr.hoursLogged, 0))

const scheduledPayoutsTotal = computed(() => 42800.0)

const filteredSubmissions = computed(() => {
  return submissions.value.filter((item) => {
    const matchesStatus = selectedStatus.value === 'all' ? true : item.status === selectedStatus.value
    const query = searchQuery.value.trim().toLowerCase()
    if (!query) return matchesStatus

    const matchesSearch =
      item.name.toLowerCase().includes(query) ||
      item.role.toLowerCase().includes(query) ||
      item.country.toLowerCase().includes(query) ||
      item.city.toLowerCase().includes(query) ||
      item.invoiceNumber.toLowerCase().includes(query) ||
      item.verificationBadge.label.toLowerCase().includes(query)

    return matchesStatus && matchesSearch
  })
})

const selectedContractor = computed(() => submissions.value.find((c) => c.id === selectedContractorId.value))

function formatUsd(val: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val)
}

function formatLocal(val: number, currencyCode: string, currencySymbol: string): string {
  if (currencyCode === 'JPY') {
    return `${currencySymbol}${new Intl.NumberFormat('ja-JP').format(val)}`
  }
  return `${currencySymbol}${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val)} ${currencyCode}`
}

function openDrawer(contractor: ContractorSubmission) {
  selectedContractorId.value = contractor.id
  isDrawerOpen.value = true
}

function approveInvoice(id: string) {
  const index = submissions.value.findIndex((s) => s.id === id)
  if (index !== -1) {
    submissions.value[index].status = 'approved'
  }
}

function disputeInvoice(id: string) {
  const index = submissions.value.findIndex((s) => s.id === id)
  if (index !== -1) {
    submissions.value[index].status = 'disputed'
  }
}

function handleApproveDrawer() {
  if (selectedContractorId.value) approveInvoice(selectedContractorId.value)
  isDrawerOpen.value = false
}

function handleDisputeDrawer() {
  if (selectedContractorId.value) disputeInvoice(selectedContractorId.value)
  isDrawerOpen.value = false
}

function approveAllPending() {
  if (pendingCount.value === 0) return
  isApprovingAll.value = true
  setTimeout(() => {
    submissions.value.forEach((s) => {
      if (s.status === 'pending') {
        s.status = 'approved'
      }
    })
    isApprovingAll.value = false
    bulkApprovalDone.value = true
    setTimeout(() => {
      bulkApprovalDone.value = false
    }, 3000)
  }, 400)
}

function resetData() {
  submissions.value = JSON.parse(JSON.stringify(initialSubmissions))
  selectedStatus.value = 'all'
  searchQuery.value = ''
  bulkApprovalDone.value = false
}
</script>

<template>
  <div data-slot="contractor-timesheet-approval" :class="cn('text-foreground w-full space-y-6', props.class)">
    <!-- Header Section -->
    <div class="border-border/80 flex flex-col gap-4 border-b pb-6 lg:flex-row lg:items-center lg:justify-between">
      <div class="space-y-1.5">
        <div class="flex flex-wrap items-center gap-2">
          <Badge variant="outline" class="border-border text-muted-foreground text-xs font-medium">
            <Globe class="text-primary mr-1 size-3" />
            Global Workforce · HRMS
          </Badge>
          <div class="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
            <Calendar class="text-muted-foreground size-3.5" />
            <span>Pay Cycle:</span>
            <span class="text-foreground font-semibold">{{ payCycle }}</span>
          </div>
          <Badge
            v-if="pendingCount > 0"
            variant="outline"
            class="border-amber-500/30 bg-amber-500/10 text-xs font-medium text-amber-600 dark:text-amber-400"
          >
            <span class="mr-1.5 size-1.5 animate-pulse rounded-full bg-amber-500" />
            {{ pendingCount }} Invoices Pending Review
          </Badge>
          <Badge
            v-else
            variant="outline"
            class="border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-600 dark:text-emerald-400"
          >
            <CheckCircle2 class="mr-1 size-3 text-emerald-500" />
            All Invoices Reviewed
          </Badge>
        </div>
        <h1 class="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
          {{ title }}
        </h1>
        <p class="text-muted-foreground max-w-3xl text-sm leading-relaxed">
          {{ subtitle }}
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap items-center gap-2.5 pt-1 lg:pt-0">
        <Button
          variant="outline"
          size="sm"
          class="border-border hover:bg-muted h-9 gap-1.5 text-xs font-medium shadow-xs"
          @click="resetData"
        >
          <RotateCcw class="text-muted-foreground size-3.5" />
          Reset Demo
        </Button>

        <Button
          variant="default"
          size="sm"
          :disabled="pendingCount === 0 || isApprovingAll"
          class="h-9 gap-2 text-xs font-medium shadow-xs transition-all"
          @click="approveAllPending"
        >
          <template v-if="isApprovingAll">
            <Clock class="size-3.5 animate-spin" />
            Processing Batch...
          </template>
          <template v-else-if="bulkApprovalDone">
            <Check class="size-3.5 text-emerald-300" />
            Batch Approved!
          </template>
          <template v-else>
            <CheckCheck class="size-3.5" />
            <span>Approve All Pending ({{ formatUsd(pendingAmountUsd) }})</span>
          </template>
        </Button>
      </div>
    </div>

    <!-- 4 Billing Overview KPI Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Card 1: Pending Approval Amount -->
      <Card class="border-border bg-card shadow-xs transition-colors">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-muted-foreground text-xs font-medium"> Pending Approval Amount </CardTitle>
          <div
            class="flex size-8 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400"
          >
            <Clock class="size-4" />
          </div>
        </CardHeader>
        <CardContent class="space-y-1">
          <div class="text-foreground text-2xl font-bold tracking-tight tabular-nums">
            {{ formatUsd(pendingAmountUsd) }}
          </div>
          <p class="text-muted-foreground text-xs">
            <span class="font-semibold text-amber-600 tabular-nums dark:text-amber-400">
              {{ pendingCount }} invoices
            </span>
            awaiting your approval
          </p>
          <div class="pt-2">
            <span
              class="bg-muted text-muted-foreground inline-flex items-center rounded-md px-2 py-0.5 text-xs tabular-nums"
            >
              £3,800 · ¥810k · R$41k
            </span>
          </div>
        </CardContent>
      </Card>

      <!-- Card 2: Total Contractor Hours -->
      <Card class="border-border bg-card shadow-xs transition-colors">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-muted-foreground text-xs font-medium"> Total Contractor Hours </CardTitle>
          <div
            class="flex size-8 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400"
          >
            <Timer class="size-4" />
          </div>
        </CardHeader>
        <CardContent class="space-y-1">
          <div class="text-foreground text-2xl font-bold tracking-tight tabular-nums">
            {{ totalHoursLogged.toFixed(1) }} hrs
          </div>
          <p class="text-muted-foreground text-xs">
            <span class="text-foreground font-medium tabular-nums">160.0 regular</span>
            · 80.0 overtime / project
          </p>
          <div class="pt-2">
            <span
              class="inline-flex items-center rounded-md bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-400"
            >
              100% Timesheets submitted
            </span>
          </div>
        </CardContent>
      </Card>

      <!-- Card 3: Approved & Scheduled Payouts -->
      <Card class="border-border bg-card shadow-xs transition-colors">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-muted-foreground text-xs font-medium"> Approved & Scheduled </CardTitle>
          <div
            class="flex size-8 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          >
            <ShieldCheck class="size-4" />
          </div>
        </CardHeader>
        <CardContent class="space-y-1">
          <div class="text-foreground text-2xl font-bold tracking-tight tabular-nums">
            {{ formatUsd(scheduledPayoutsTotal) }}
          </div>
          <p class="text-muted-foreground text-xs">
            <span class="font-medium text-emerald-600 tabular-nums dark:text-emerald-400"> 5 invoices </span>
            batched for Aug 25 payout
          </p>
          <div class="pt-2">
            <span class="bg-muted text-muted-foreground inline-flex items-center rounded-md px-2 py-0.5 text-xs">
              Direct SEPA · ACH · SWIFT
            </span>
          </div>
        </CardContent>
      </Card>

      <!-- Card 4: Active International Contractors -->
      <Card class="border-border bg-card shadow-xs transition-colors">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-muted-foreground text-xs font-medium"> Active Contractors </CardTitle>
          <div
            class="flex size-8 items-center justify-center rounded-lg border border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400"
          >
            <Users class="size-4" />
          </div>
        </CardHeader>
        <CardContent class="space-y-1">
          <div class="text-foreground text-2xl font-bold tracking-tight tabular-nums">8 Contractors</div>
          <p class="text-muted-foreground text-xs">Across 5 countries (UK, JP, BR, FR, CA)</p>
          <div class="pt-2">
            <span
              class="inline-flex items-center rounded-md bg-purple-500/10 px-2 py-0.5 text-xs font-medium text-purple-700 dark:text-purple-400"
            >
              100% W-8BEN Tax Valid
            </span>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Filter Toolbar -->
    <Card class="border-border bg-card shadow-xs">
      <CardContent class="p-4">
        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <!-- Search input -->
          <div class="relative max-w-md flex-1">
            <Search class="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search contractor, role, country, or PR..."
              class="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-md border py-1.5 pr-3 pl-9 text-xs focus-visible:ring-2 focus-visible:outline-hidden"
            />
          </div>

          <!-- Filter buttons & Currency Toggle -->
          <div class="flex flex-wrap items-center gap-2">
            <!-- Status filter tabs -->
            <div class="border-border bg-muted/40 inline-flex rounded-lg border p-0.5 text-xs">
              <button
                type="button"
                :class="
                  cn(
                    'rounded-md px-2.5 py-1 font-medium transition-colors',
                    selectedStatus === 'all'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )
                "
                @click="selectedStatus = 'all'"
              >
                All ({{ submissions.length }})
              </button>
              <button
                type="button"
                :class="
                  cn(
                    'rounded-md px-2.5 py-1 font-medium transition-colors',
                    selectedStatus === 'pending'
                      ? 'bg-background text-amber-600 shadow-xs dark:text-amber-400'
                      : 'text-muted-foreground hover:text-foreground',
                  )
                "
                @click="selectedStatus = 'pending'"
              >
                Pending ({{ pendingCount }})
              </button>
              <button
                type="button"
                :class="
                  cn(
                    'rounded-md px-2.5 py-1 font-medium transition-colors',
                    selectedStatus === 'approved'
                      ? 'bg-background text-emerald-600 shadow-xs dark:text-emerald-400'
                      : 'text-muted-foreground hover:text-foreground',
                  )
                "
                @click="selectedStatus = 'approved'"
              >
                Approved ({{ approvedCount }})
              </button>
              <button
                type="button"
                :class="
                  cn(
                    'rounded-md px-2.5 py-1 font-medium transition-colors',
                    selectedStatus === 'disputed'
                      ? 'bg-background text-red-600 shadow-xs dark:text-red-400'
                      : 'text-muted-foreground hover:text-foreground',
                  )
                "
                @click="selectedStatus = 'disputed'"
              >
                Disputed ({{ disputedCount }})
              </button>
            </div>

            <Separator orientation="vertical" class="hidden h-6 md:block" />

            <!-- Currency toggle selector -->
            <div class="border-border bg-muted/40 inline-flex rounded-lg border p-0.5 text-xs">
              <button
                type="button"
                :class="
                  cn(
                    'rounded-md px-2 py-1 font-medium transition-colors',
                    currencyDisplay === 'both'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )
                "
                @click="currencyDisplay = 'both'"
              >
                Dual FX
              </button>
              <button
                type="button"
                :class="
                  cn(
                    'rounded-md px-2 py-1 font-medium transition-colors',
                    currencyDisplay === 'usd'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )
                "
                @click="currencyDisplay = 'usd'"
              >
                USD ($)
              </button>
              <button
                type="button"
                :class="
                  cn(
                    'rounded-md px-2 py-1 font-medium transition-colors',
                    currencyDisplay === 'local'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )
                "
                @click="currencyDisplay = 'local'"
              >
                Local
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Contractor Invoices & Timesheets Table -->
    <Card class="border-border bg-card overflow-hidden shadow-xs">
      <div class="overflow-x-auto">
        <Table>
          <TableHeader class="bg-muted/40">
            <TableRow class="border-border hover:bg-transparent">
              <TableHead class="text-muted-foreground min-w-[240px] text-xs font-semibold tracking-wider uppercase">
                Contractor & Location
              </TableHead>
              <TableHead class="text-muted-foreground min-w-[180px] text-xs font-semibold tracking-wider uppercase">
                Role & Rate
              </TableHead>
              <TableHead class="text-muted-foreground min-w-[140px] text-xs font-semibold tracking-wider uppercase">
                Hours Logged
              </TableHead>
              <TableHead class="text-muted-foreground min-w-[200px] text-xs font-semibold tracking-wider uppercase">
                Invoice Gross Amount
              </TableHead>
              <TableHead class="text-muted-foreground min-w-[220px] text-xs font-semibold tracking-wider uppercase">
                Timesheet Verification
              </TableHead>
              <TableHead class="text-muted-foreground min-w-[120px] text-xs font-semibold tracking-wider uppercase">
                Status
              </TableHead>
              <TableHead
                class="text-muted-foreground min-w-[180px] text-right text-xs font-semibold tracking-wider uppercase"
              >
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-if="filteredSubmissions.length > 0">
              <TableRow
                v-for="contractor in filteredSubmissions"
                :key="contractor.id"
                class="border-border hover:bg-muted/30 transition-colors"
              >
                <!-- Contractor & Location -->
                <TableCell class="py-4">
                  <div class="flex items-center gap-3">
                    <Avatar class="border-border size-10 shrink-0 border">
                      <AvatarFallback class="bg-primary/10 text-primary text-xs font-semibold">
                        {{ contractor.initials }}
                      </AvatarFallback>
                    </Avatar>
                    <div class="space-y-0.5">
                      <div class="flex items-center gap-1.5">
                        <button
                          type="button"
                          class="text-foreground focus-visible:ring-ring cursor-pointer rounded-xs text-left text-sm font-semibold hover:underline focus-visible:ring-2 focus-visible:outline-none"
                          @click="openDrawer(contractor)"
                        >
                          {{ contractor.name }}
                        </button>
                        <span class="text-sm" :title="contractor.country">{{ contractor.flag }}</span>
                      </div>
                      <p class="text-muted-foreground flex items-center gap-1 text-xs">
                        <span>{{ contractor.city }}</span>
                        <span>•</span>
                        <span class="text-muted-foreground/80 font-mono">{{ contractor.invoiceNumber }}</span>
                      </p>
                    </div>
                  </div>
                </TableCell>

                <!-- Role & Rate -->
                <TableCell class="py-4">
                  <div class="space-y-0.5">
                    <p class="text-foreground text-xs font-medium">{{ contractor.role }}</p>
                    <p class="text-muted-foreground text-xs tabular-nums">
                      {{ formatUsd(contractor.hourlyRateUsd) }}/hr
                      <span class="text-muted-foreground/70">
                        ({{
                          formatLocal(contractor.hourlyRateLocal, contractor.currencyCode, contractor.currencySymbol)
                        }}/hr)
                      </span>
                    </p>
                  </div>
                </TableCell>

                <!-- Hours Logged with daily breakdown expander button -->
                <TableCell class="py-4">
                  <div class="space-y-1">
                    <div class="flex items-center gap-1.5">
                      <span class="text-foreground text-sm font-bold tabular-nums">
                        {{ contractor.hoursLogged.toFixed(1) }} hrs
                      </span>
                    </div>
                    <div class="text-muted-foreground flex items-center gap-1 text-xs tabular-nums">
                      <span class="font-medium text-emerald-600 dark:text-emerald-400">
                        {{ contractor.regularHours.toFixed(0) }}h reg
                      </span>
                      <template v-if="contractor.overtimeHours > 0">
                        <span>+</span>
                        <span class="font-medium text-blue-600 dark:text-blue-400">
                          {{ contractor.overtimeHours.toFixed(0) }}h ot
                        </span>
                      </template>
                    </div>
                  </div>
                </TableCell>

                <!-- Invoice Gross (Local & USD) -->
                <TableCell class="py-4">
                  <div class="space-y-1">
                    <template v-if="currencyDisplay === 'both'">
                      <div class="flex items-baseline gap-1.5">
                        <span class="text-foreground text-sm font-bold tabular-nums">
                          {{ formatUsd(contractor.grossAmountUsd) }}
                        </span>
                        <span class="text-muted-foreground text-xs font-normal">USD</span>
                      </div>
                      <p class="text-muted-foreground text-xs tabular-nums">
                        {{
                          formatLocal(contractor.grossAmountLocal, contractor.currencyCode, contractor.currencySymbol)
                        }}
                        <span class="text-muted-foreground/60 text-xs">(FX: {{ contractor.fxRate.toFixed(4) }})</span>
                      </p>
                    </template>
                    <template v-else-if="currencyDisplay === 'usd'">
                      <div class="text-foreground text-sm font-bold tabular-nums">
                        {{ formatUsd(contractor.grossAmountUsd) }} USD
                      </div>
                      <p class="text-muted-foreground text-xs tabular-nums">
                        Rate: {{ formatUsd(contractor.hourlyRateUsd) }}/hr
                      </p>
                    </template>
                    <template v-else>
                      <div class="text-foreground text-sm font-bold tabular-nums">
                        {{
                          formatLocal(contractor.grossAmountLocal, contractor.currencyCode, contractor.currencySymbol)
                        }}
                      </div>
                      <p class="text-muted-foreground text-xs tabular-nums">
                        Conv: {{ formatUsd(contractor.grossAmountUsd) }} USD
                      </p>
                    </template>
                  </div>
                </TableCell>

                <!-- Timesheet Verification Status -->
                <TableCell class="py-4">
                  <div class="space-y-1">
                    <Badge
                      variant="outline"
                      class="gap-1 border-emerald-500/25 bg-emerald-500/10 text-xs font-medium text-emerald-600 dark:text-emerald-400"
                    >
                      <CheckCircle2 class="size-3 text-emerald-500" />
                      {{ contractor.verificationBadge.label }}
                    </Badge>
                    <p
                      class="text-muted-foreground max-w-[200px] truncate text-xs"
                      :title="contractor.verificationBadge.subtext"
                    >
                      {{ contractor.verificationBadge.subtext }}
                    </p>
                  </div>
                </TableCell>

                <!-- Approval Status -->
                <TableCell class="py-4">
                  <Badge
                    v-if="contractor.status === 'pending'"
                    variant="outline"
                    class="border-amber-500/30 bg-amber-500/10 text-xs font-medium text-amber-600 dark:text-amber-400"
                  >
                    <span class="mr-1.5 size-1.5 rounded-full bg-amber-500" />
                    Pending Review
                  </Badge>
                  <Badge
                    v-else-if="contractor.status === 'approved'"
                    variant="outline"
                    class="border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-600 dark:text-emerald-400"
                  >
                    <Check class="mr-1 size-3 text-emerald-500" />
                    Approved
                  </Badge>
                  <Badge
                    v-else
                    variant="outline"
                    class="border-red-500/30 bg-red-500/10 text-xs font-medium text-red-600 dark:text-red-400"
                  >
                    <XCircle class="mr-1 size-3 text-red-500" />
                    Disputed
                  </Badge>
                </TableCell>

                <!-- Action Buttons -->
                <TableCell class="py-4 text-right">
                  <div class="flex items-center justify-end gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      class="border-border hover:bg-muted h-8 gap-1 px-2.5 text-xs font-medium"
                      @click="openDrawer(contractor)"
                    >
                      <Eye class="text-muted-foreground size-3.5" />
                      Timesheet
                    </Button>

                    <template v-if="contractor.status === 'pending'">
                      <Button
                        variant="default"
                        size="sm"
                        class="h-8 px-2.5 text-xs font-medium shadow-xs"
                        @click="approveInvoice(contractor.id)"
                      >
                        <Check class="mr-1 size-3.5" />
                        Approve
                      </Button>
                    </template>

                    <!-- Dropdown Menu for Secondary Actions -->
                    <DropdownMenu>
                      <DropdownMenuTrigger as-child>
                        <Button variant="ghost" size="icon" class="text-muted-foreground hover:text-foreground size-8">
                          <MoreHorizontal class="size-4" />
                          <span class="sr-only">Open contractor menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" class="w-48">
                        <DropdownMenuLabel class="text-muted-foreground text-xs">
                          Invoice {{ contractor.invoiceNumber }}
                        </DropdownMenuLabel>
                        <DropdownMenuItem class="cursor-pointer text-xs" @click="openDrawer(contractor)">
                          <FileText class="text-muted-foreground mr-2 size-3.5" />
                          Itemized Timesheet
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          v-if="contractor.status !== 'approved'"
                          class="cursor-pointer text-xs text-emerald-600 dark:text-emerald-400"
                          @click="approveInvoice(contractor.id)"
                        >
                          <Check class="mr-2 size-3.5" />
                          Approve Invoice
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          v-if="contractor.status !== 'disputed'"
                          class="cursor-pointer text-xs text-red-600 dark:text-red-400"
                          @click="disputeInvoice(contractor.id)"
                        >
                          <AlertCircle class="mr-2 size-3.5" />
                          Dispute / Reject
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem class="cursor-pointer text-xs">
                          <Download class="text-muted-foreground mr-2 size-3.5" />
                          Download Invoice PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem class="cursor-pointer text-xs">
                          <ShieldCheck class="text-muted-foreground mr-2 size-3.5" />
                          View W-8BEN Form
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            </template>

            <template v-else>
              <TableRow>
                <TableCell colspan="7" class="h-36 text-center">
                  <div class="flex flex-col items-center justify-center gap-1.5">
                    <FileSpreadsheet class="text-muted-foreground/50 size-8" />
                    <p class="text-foreground text-sm font-medium">No invoices match your filter</p>
                    <p class="text-muted-foreground text-xs">
                      Try clearing your search query or selecting "All" statuses.
                    </p>
                    <Button variant="outline" size="sm" class="mt-2 text-xs" @click="resetData"> Reset Filters </Button>
                  </div>
                </TableCell>
              </TableRow>
            </template>
          </TableBody>
        </Table>
      </div>

      <!-- Table Footer / Summary Bar -->
      <div
        class="border-border bg-muted/20 text-muted-foreground flex flex-col gap-3 border-t px-4 py-3 text-xs sm:flex-row sm:items-center sm:justify-between"
      >
        <div class="flex items-center gap-2">
          <span
            >Showing <strong>{{ filteredSubmissions.length }}</strong> of {{ submissions.length }} contractor
            submissions</span
          >
          <span>•</span>
          <span class="tabular-nums"
            >Pay Cycle: <strong>{{ payPeriodLabel(submissions[0]?.payPeriod) }}</strong></span
          >
        </div>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-1.5">
            <span class="size-2 rounded-full bg-emerald-500" />
            <span>Automated FX Locking Active</span>
          </div>
          <div class="text-foreground flex items-center gap-1.5 font-medium">
            <span>Total Gross:</span>
            <span class="font-bold tabular-nums">{{ formatUsd(totalGrossUsd(submissions)) }} USD</span>
          </div>
        </div>
      </div>
    </Card>

    <!-- Itemized Daily Timesheet Drawer (Sheet) -->
    <Sheet v-model:open="isDrawerOpen">
      <SheetContent
        side="right"
        class="bg-background text-foreground flex w-full flex-col overflow-y-auto p-0 sm:max-w-xl md:max-w-2xl"
      >
        <template v-if="selectedContractor">
          <!-- Drawer Header -->
          <SheetHeader class="border-border/80 space-y-3 border-b px-6 py-5 text-left">
            <div class="flex items-start justify-between gap-4">
              <div class="flex items-center gap-3">
                <Avatar class="border-border size-12 border">
                  <AvatarFallback class="bg-primary/10 text-primary text-sm font-bold">
                    {{ selectedContractor.initials }}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div class="flex items-center gap-2">
                    <SheetTitle class="text-foreground text-lg font-bold">
                      {{ selectedContractor.name }}
                    </SheetTitle>
                    <span class="text-base" :title="selectedContractor.country">
                      {{ selectedContractor.flag }}
                    </span>
                  </div>
                  <SheetDescription class="text-muted-foreground text-xs">
                    {{ selectedContractor.role }} · {{ selectedContractor.city }}
                  </SheetDescription>
                </div>
              </div>

              <!-- Status Badge in Header -->
              <Badge
                v-if="selectedContractor.status === 'pending'"
                variant="outline"
                class="shrink-0 border-amber-500/30 bg-amber-500/10 text-xs font-medium text-amber-600 dark:text-amber-400"
              >
                <span class="mr-1.5 size-1.5 rounded-full bg-amber-500" />
                Pending Review
              </Badge>
              <Badge
                v-else-if="selectedContractor.status === 'approved'"
                variant="outline"
                class="shrink-0 border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-600 dark:text-emerald-400"
              >
                <Check class="mr-1 size-3 text-emerald-500" />
                Approved
              </Badge>
              <Badge
                v-else
                variant="outline"
                class="shrink-0 border-red-500/30 bg-red-500/10 text-xs font-medium text-red-600 dark:text-red-400"
              >
                <XCircle class="mr-1 size-3 text-red-500" />
                Disputed
              </Badge>
            </div>

            <!-- Header Quick Stats Grid -->
            <div class="grid grid-cols-3 gap-2 pt-2 text-xs">
              <div class="border-border bg-muted/40 rounded-lg border p-2.5">
                <span class="text-muted-foreground block">Invoice Gross</span>
                <span class="text-foreground text-sm font-bold tabular-nums">
                  {{ formatUsd(selectedContractor.grossAmountUsd) }}
                </span>
                <span class="text-muted-foreground/70 block text-xs tabular-nums">
                  {{
                    formatLocal(
                      selectedContractor.grossAmountLocal,
                      selectedContractor.currencyCode,
                      selectedContractor.currencySymbol,
                    )
                  }}
                </span>
              </div>
              <div class="border-border bg-muted/40 rounded-lg border p-2.5">
                <span class="text-muted-foreground block">Total Hours</span>
                <span class="text-foreground text-sm font-bold tabular-nums">
                  {{ selectedContractor.hoursLogged.toFixed(1) }} hrs
                </span>
                <span class="block text-xs font-medium text-emerald-600 tabular-nums dark:text-emerald-400">
                  {{ selectedContractor.regularHours.toFixed(0) }}h reg ·
                  {{ selectedContractor.overtimeHours.toFixed(0) }}h ot
                </span>
              </div>
              <div class="border-border bg-muted/40 rounded-lg border p-2.5">
                <span class="text-muted-foreground block">Contract Rate</span>
                <span class="text-foreground text-sm font-bold tabular-nums">
                  {{ formatUsd(selectedContractor.hourlyRateUsd) }}/hr
                </span>
                <span class="text-muted-foreground/70 block truncate text-xs">
                  {{ selectedContractor.taxCompliance.jurisdiction }}
                </span>
              </div>
            </div>
          </SheetHeader>

          <!-- Drawer Body: Timesheet Breakdown -->
          <div class="flex-1 space-y-6 overflow-y-auto px-6 py-5">
            <!-- Verification Callout Banner -->
            <div
              class="flex items-start gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs text-emerald-800 dark:text-emerald-300"
            >
              <ShieldCheck class="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div class="space-y-0.5">
                <p class="font-semibold text-emerald-900 dark:text-emerald-200">
                  {{ selectedContractor.verificationBadge.label }}
                </p>
                <p class="leading-normal text-emerald-700 dark:text-emerald-400">
                  {{ selectedContractor.verificationBadge.subtext }}. Automated hash verification confirmed timestamps
                  match developer activity during the billing window.
                </p>
              </div>
            </div>

            <!-- Daily Task Itemization -->
            <div class="space-y-3">
              <div class="flex items-center justify-between gap-x-2">
                <h2 class="text-muted-foreground text-xs font-semibold">
                  Daily Itemized Activity Log ({{ selectedContractor.dailyEntries.length }} Work Days)
                </h2>
                <span class="text-muted-foreground font-mono text-xs">
                  {{ selectedContractor.payPeriod }}
                </span>
              </div>

              <div class="space-y-2.5">
                <div
                  v-for="entry in selectedContractor.dailyEntries"
                  :key="entry.id"
                  class="border-border bg-card hover:border-border/80 space-y-2 rounded-lg border p-3.5 transition-colors"
                >
                  <div class="flex items-center justify-between gap-x-2">
                    <div class="flex items-center gap-2">
                      <span class="text-foreground text-xs font-semibold">{{ entry.day }}</span>
                      <Badge variant="outline" class="border-border text-muted-foreground h-4 py-0 text-xs">
                        {{ entry.date }}
                      </Badge>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="text-foreground text-xs font-bold tabular-nums">
                        {{ entry.hours.toFixed(1) }} hrs
                      </span>
                      <span class="text-muted-foreground text-xs tabular-nums">
                        ({{ formatUsd(entry.hours * selectedContractor.hourlyRateUsd) }})
                      </span>
                    </div>
                  </div>

                  <p class="text-muted-foreground text-xs leading-relaxed">
                    {{ entry.task }}
                  </p>

                  <!-- Linked Deliverables (PR / Commit / Figma / CI) -->
                  <div class="flex flex-wrap items-center gap-2 pt-1">
                    <div
                      class="border-border bg-muted/50 text-foreground inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-xs"
                    >
                      <template v-if="entry.deliverableType === 'github_pr'">
                        <GitPullRequest class="size-3 text-purple-500" />
                        <span>{{ entry.referenceId }}</span>
                        <span class="text-muted-foreground">({{ entry.referenceLabel }})</span>
                        <span v-if="entry.commitCount" class="text-muted-foreground"
                          >· {{ entry.commitCount }} commits</span
                        >
                      </template>
                      <template v-else-if="entry.deliverableType === 'figma'">
                        <FileCode class="size-3 text-pink-500" />
                        <span>{{ entry.referenceId }}</span>
                        <span class="text-muted-foreground">({{ entry.referenceLabel }})</span>
                      </template>
                      <template v-else>
                        <CheckCircle2 class="size-3 text-emerald-500" />
                        <span>{{ entry.referenceId }}</span>
                        <span class="text-muted-foreground">({{ entry.referenceLabel }})</span>
                      </template>
                    </div>

                    <Badge
                      variant="outline"
                      class="h-5 gap-1 border-emerald-500/20 bg-emerald-500/10 py-0 text-xs text-emerald-600 dark:text-emerald-400"
                    >
                      <Check class="size-2.5" />
                      Verified
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tax & Bank Payout Compliance Box -->
            <div class="border-border bg-muted/20 space-y-2.5 rounded-lg border p-4 text-xs">
              <h3 class="text-foreground flex items-center gap-1.5 font-bold">
                <FileCheck class="text-primary size-3.5" />
                Compliance & Disbursement Routing
              </h3>
              <div class="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <span class="text-muted-foreground block">Tax Form Status:</span>
                  <span class="text-foreground font-medium">
                    Form W-8BEN ({{ selectedContractor.taxCompliance.w8benStatus.toUpperCase() }})
                  </span>
                  <span class="text-muted-foreground block font-mono text-xs">{{
                    selectedContractor.taxCompliance.taxIdMasked
                  }}</span>
                </div>
                <div>
                  <span class="text-muted-foreground block">Disbursement Route:</span>
                  <span class="text-foreground font-medium"> {{ selectedContractor.paymentMethod.type }} Payout </span>
                  <span class="text-muted-foreground block text-xs">{{
                    selectedContractor.paymentMethod.bankName
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Drawer Footer Actions -->
          <SheetFooter
            class="border-border/80 bg-muted/20 flex flex-row items-center justify-between gap-3 border-t px-6 py-4"
          >
            <SheetClose as-child>
              <Button variant="outline" size="sm" class="text-xs"> Close </Button>
            </SheetClose>

            <div class="flex items-center gap-2">
              <Button
                v-if="selectedContractor.status !== 'disputed'"
                variant="outline"
                size="sm"
                class="border-red-500/30 text-xs text-red-600 hover:bg-red-500/10 dark:text-red-400"
                @click="handleDisputeDrawer"
              >
                <XCircle class="mr-1.5 size-3.5" />
                Dispute Invoice
              </Button>

              <Button
                v-if="selectedContractor.status !== 'approved'"
                variant="default"
                size="sm"
                class="text-xs shadow-xs"
                @click="handleApproveDrawer"
              >
                <Check class="mr-1.5 size-3.5" />
                Approve ({{ formatUsd(selectedContractor.grossAmountUsd) }})
              </Button>
              <span v-else class="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 class="size-4" />
                Approved & Queued
              </span>
            </div>
          </SheetFooter>
        </template>
      </SheetContent>
    </Sheet>
  </div>
</template>

<script lang="ts">
function payPeriodLabel(period?: string): string {
  return period || 'Aug 08 – Aug 21, 2026'
}

function totalGrossUsd(items: ContractorSubmission[]): number {
  return items.reduce((acc, curr) => acc + curr.grossAmountUsd, 0)
}
</script>
