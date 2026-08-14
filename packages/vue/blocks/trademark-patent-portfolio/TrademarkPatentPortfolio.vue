<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, ref } from 'vue'
import {
  AlertCircle,
  ArrowUpRight,
  Award,
  BadgeCheck,
  Building2,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  Copy,
  Download,
  ExternalLink,
  FilePlus2,
  FileSpreadsheet,
  FileText,
  Filter,
  Globe,
  MoreHorizontal,
  Plus,
  Scale,
  Search,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from 'lucide-vue-next'
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
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

export interface TrademarkPatentPortfolioProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<TrademarkPatentPortfolioProps>()

export type AssetType = 'Utility Patent' | 'Trademark' | 'PCT International'
export type FilingStatus = 'Granted / Registered' | 'Published / Under Exam'

export interface IpAsset {
  id: string
  identifier: string
  officialNumber: string
  title: string
  type: AssetType
  jurisdictionCode: string
  jurisdictionName: string
  jurisdictionFlag: string
  patentOffice: string
  applicationDate: string
  grantDate: string
  status: FilingStatus
  nextDeadline: string
  deadlineNumber: string
  deadlineNote: string
  ipcClass: string
  attorney: string
  gazetteUrl: string
  gazetteLabel: string
}

const ipAssets: IpAsset[] = [
  {
    id: 'ip-1',
    identifier: 'US Patent #11,849,201',
    officialNumber: 'US 11,849,201 B2',
    title: 'Zero-Dependency Dual-Framework AST Generation',
    type: 'Utility Patent',
    jurisdictionCode: 'US',
    jurisdictionName: 'United States',
    jurisdictionFlag: '🇺🇸',
    patentOffice: 'USPTO',
    applicationDate: '2023-04-12',
    grantDate: '2024-06-18',
    status: 'Granted / Registered',
    nextDeadline: 'Dec 2026',
    deadlineNumber: '2026-12-15',
    deadlineNote: 'USPTO 3.5-Year Maintenance Window',
    ipcClass: 'CPC G06F 8/41 · Abstract Syntax Trees',
    attorney: 'Vance & Morrison LLP',
    gazetteUrl: 'https://patents.google.com/patent/US11849201B2/en',
    gazetteLabel: 'View USPTO Gazette',
  },
  {
    id: 'ip-2',
    identifier: 'US Patent #11,420,184',
    officialNumber: 'US 11,420,184 B1',
    title: 'Perceptually Uniform OKLCH Dark Mode Algorithm',
    type: 'Utility Patent',
    jurisdictionCode: 'US',
    jurisdictionName: 'United States',
    jurisdictionFlag: '🇺🇸',
    patentOffice: 'USPTO',
    applicationDate: '2022-09-14',
    grantDate: '2023-08-22',
    status: 'Granted / Registered',
    nextDeadline: 'Feb 2027',
    deadlineNumber: '2027-02-22',
    deadlineNote: 'USPTO 3.5-Year Maintenance Window',
    ipcClass: 'CPC G06T 11/00 · Perceptual Colorimetry',
    attorney: 'Vance & Morrison LLP',
    gazetteUrl: 'https://patents.google.com/patent/US11420184B1/en',
    gazetteLabel: 'View USPTO Gazette',
  },
  {
    id: 'ip-3',
    identifier: 'US Trademark #98421042',
    officialNumber: 'Reg. #7,294,810 (SN 98421042)',
    title: 'UIPKGE™ (Class 09, 42)',
    type: 'Trademark',
    jurisdictionCode: 'US',
    jurisdictionName: 'United States',
    jurisdictionFlag: '🇺🇸',
    patentOffice: 'USPTO',
    applicationDate: '2023-02-10',
    grantDate: '2023-11-14',
    status: 'Granted / Registered',
    nextDeadline: 'Nov 2029',
    deadlineNumber: '2029-11-14',
    deadlineNote: 'Section 8 & 15 Affidavit of Use',
    ipcClass: 'IC 009, 042 · Computer Software & SaaS',
    attorney: 'Kilpatrick Townsend & Stockton',
    gazetteUrl: 'https://tsdr.uspto.gov/',
    gazetteLabel: 'View USPTO TSDR',
  },
  {
    id: 'ip-4',
    identifier: 'WIPO PCT/US2026/018249',
    officialNumber: 'WO 2026/148201 A1',
    title: 'Headless Component State Serialization',
    type: 'PCT International',
    jurisdictionCode: 'WIPO',
    jurisdictionName: 'WIPO International',
    jurisdictionFlag: '🌍',
    patentOffice: 'WIPO IB',
    applicationDate: '2026-01-15',
    grantDate: 'Pending',
    status: 'Published / Under Exam',
    nextDeadline: 'Jul 2027',
    deadlineNumber: '2027-07-15',
    deadlineNote: '30-Mo National Phase Entry Deadline',
    ipcClass: 'IPC G06F 9/44 · Component State Transfer',
    attorney: 'Vance & Morrison LLP',
    gazetteUrl: 'https://patentscope.wipo.int/',
    gazetteLabel: 'View WIPO Patentscope',
  },
  {
    id: 'ip-5',
    identifier: 'EP Patent #3,948,102',
    officialNumber: 'EP 3,948,102 A1',
    title: 'Reactive Virtual DOM Diffing Engine for Web Components',
    type: 'Utility Patent',
    jurisdictionCode: 'EU',
    jurisdictionName: 'European Union',
    jurisdictionFlag: '🇪🇺',
    patentOffice: 'EPO',
    applicationDate: '2024-03-02',
    grantDate: 'Pending',
    status: 'Published / Under Exam',
    nextDeadline: 'Mar 2027',
    deadlineNumber: '2027-03-31',
    deadlineNote: 'EPO 3rd Year Annuity Maintenance Fee',
    ipcClass: 'CPC G06F 9/455 · Virtualized DOM Execution',
    attorney: 'Bardehle Pagenberg Partnerschaft',
    gazetteUrl: 'https://worldwide.espacenet.com/',
    gazetteLabel: 'View EPO Espacenet',
  },
  {
    id: 'ip-6',
    identifier: 'EU Trademark #018942001',
    officialNumber: 'Reg. #018942001',
    title: 'UIPKGE DESIGN SYSTEM™ (Class 09, 35, 42)',
    type: 'Trademark',
    jurisdictionCode: 'EU',
    jurisdictionName: 'European Union',
    jurisdictionFlag: '🇪🇺',
    patentOffice: 'EUIPO',
    applicationDate: '2023-08-05',
    grantDate: '2024-01-19',
    status: 'Granted / Registered',
    nextDeadline: 'May 2030',
    deadlineNumber: '2030-05-08',
    deadlineNote: 'EUIPO 10-Year Trademark Renewal',
    ipcClass: 'IC 009, 035, 042 · Design Systems & Tooling',
    attorney: 'Bardehle Pagenberg Partnerschaft',
    gazetteUrl: 'https://euipo.europa.eu/eSearch/',
    gazetteLabel: 'View EUIPO eSearch',
  },
]

const searchQuery = ref('')
const selectedType = ref<'all' | AssetType>('all')
const selectedStatus = ref<'all' | FilingStatus>('all')

function resetFilters() {
  searchQuery.value = ''
  selectedType.value = 'all'
  selectedStatus.value = 'all'
}
const copiedId = ref<string | null>(null)
const feedbackMessage = ref<string | null>(null)

const filteredAssets = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return ipAssets.filter((asset) => {
    const matchesType = selectedType.value === 'all' || asset.type === selectedType.value
    const matchesStatus = selectedStatus.value === 'all' || asset.status === selectedStatus.value
    const matchesSearch =
      !query ||
      asset.identifier.toLowerCase().includes(query) ||
      asset.officialNumber.toLowerCase().includes(query) ||
      asset.title.toLowerCase().includes(query) ||
      asset.jurisdictionName.toLowerCase().includes(query) ||
      asset.patentOffice.toLowerCase().includes(query) ||
      asset.ipcClass.toLowerCase().includes(query)
    return matchesType && matchesStatus && matchesSearch
  })
})

function copyText(id: string, text: string) {
  navigator.clipboard?.writeText(text)
  copiedId.value = id
  setTimeout(() => {
    copiedId.value = null
  }, 2000)
}

function handleExport() {
  feedbackMessage.value = 'Exporting IP Portfolio summary (CSV / PDF)...'
  setTimeout(() => {
    feedbackMessage.value = null
  }, 3000)
}

function handleFileNewAsset() {
  feedbackMessage.value = 'Opening USPTO / WIPO EFS-Web filing wizard...'
  setTimeout(() => {
    feedbackMessage.value = null
  }, 3000)
}

function handleAction(action: string, asset: IpAsset) {
  feedbackMessage.value = `${action}: ${asset.identifier}`
  setTimeout(() => {
    feedbackMessage.value = null
  }, 3000)
}
</script>

<template>
  <div data-slot="trademark-patent-portfolio" :class="cn('w-full space-y-6', props.class)">
    <!-- Header Section -->
    <Card class="border-border shadow-xs">
      <CardHeader class="flex flex-col gap-4 pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div class="space-y-1.5">
          <div class="flex flex-wrap items-center gap-2">
            <Badge variant="outline" class="gap-1.5 font-medium">
              <Building2 class="text-muted-foreground size-3.5" aria-hidden="true" />
              <span>UIPKGE Technologies Inc.</span>
            </Badge>
            <Badge wrap variant="secondary" class="gap-1 font-mono text-xs">
              <Scale class="text-primary size-3" aria-hidden="true" />
              <span>12 Patents · 6 Registered Trademarks</span>
            </Badge>
          </div>
          <CardTitle class="text-xl font-bold tracking-tight sm:text-2xl">
            Intellectual Property &amp; Patent Portfolio
          </CardTitle>
          <CardDescription class="text-xs sm:text-sm">
            USPTO, EPO, and WIPO asset docket, grant prosecution tracker, and statutory maintenance timeline.
          </CardDescription>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap items-center gap-2.5">
          <Button aria-label="Download attachment" variant="outline" class="gap-2 shadow-xs" @click="handleExport">
            <Download class="size-4" aria-hidden="true" />
            <span>Export Portfolio Report</span>
          </Button>
          <Button variant="default" class="gap-2 shadow-xs" @click="handleFileNewAsset">
            <Plus class="size-4" aria-hidden="true" />
            <span>File New IP Asset</span>
          </Button>
        </div>
      </CardHeader>
    </Card>

    <!-- Feedback Notification Toast/Banner if active -->
    <div
      v-if="feedbackMessage"
      class="border-primary/30 bg-primary/10 text-primary flex items-center justify-between rounded-lg border px-4 py-2.5 text-xs font-medium shadow-xs transition-all"
    >
      <div class="flex items-center gap-2">
        <Sparkles class="size-4 shrink-0" aria-hidden="true" />
        <span>{{ feedbackMessage }}</span>
      </div>
      <button
        type="button"
        @click="feedbackMessage = null"
        class="text-primary/70 hover:text-primary rounded text-xs underline underline-offset-2"
      >
        Dismiss
      </button>
    </div>

    <!-- 4 IP Portfolio KPI Cards Grid -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Card 1: Granted Utility Patents -->
      <Card class="border-border shadow-xs">
        <CardContent class="p-5">
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground text-xs font-medium">Granted Patents</span>
            <div
              class="flex size-8 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            >
              <Award class="size-4" aria-hidden="true" />
            </div>
          </div>
          <div class="mt-3">
            <div class="text-2xl font-bold tracking-tight text-emerald-600 tabular-nums dark:text-emerald-400">
              8 Patents Granted
            </div>
            <p class="text-muted-foreground mt-1 text-xs">6 USPTO · 2 EPO · 100% Enforceable</p>
          </div>
        </CardContent>
      </Card>

      <!-- Card 2: Pending Applications -->
      <Card class="border-border shadow-xs">
        <CardContent class="p-5">
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground text-xs font-medium">Pending Examination</span>
            <div
              class="flex size-8 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400"
            >
              <Clock class="size-4" aria-hidden="true" />
            </div>
          </div>
          <div class="mt-3">
            <div class="text-2xl font-bold tracking-tight text-amber-600 tabular-nums dark:text-amber-400">
              4 Under Examination · USPTO
            </div>
            <p class="text-muted-foreground mt-1 text-xs">2 PCT International · 1 USPTO · 1 EPO</p>
          </div>
        </CardContent>
      </Card>

      <!-- Card 3: Registered Trademarks -->
      <Card class="border-border shadow-xs">
        <CardContent class="p-5">
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground text-xs font-medium">Registered Trademarks</span>
            <div
              class="flex size-8 items-center justify-center rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400"
            >
              <BadgeCheck class="size-4" aria-hidden="true" />
            </div>
          </div>
          <div class="mt-3">
            <div class="text-2xl font-bold tracking-tight text-sky-600 tabular-nums dark:text-sky-400">
              6 Trademarks Active
            </div>
            <p class="text-muted-foreground mt-1 text-xs">Classes 09, 35, 42 · Global Protection</p>
          </div>
        </CardContent>
      </Card>

      <!-- Card 4: Next Maintenance Fee -->
      <Card class="border-border shadow-xs">
        <CardContent class="p-5">
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground text-xs font-medium">Next Maintenance Fee</span>
            <div
              class="flex size-8 items-center justify-center rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400"
            >
              <Calendar class="size-4" aria-hidden="true" />
            </div>
          </div>
          <div class="mt-3">
            <div class="text-2xl font-bold tracking-tight text-rose-600 tabular-nums dark:text-rose-400">
              Due Dec 15, 2026 · USPTO 3.5-Year Window
            </div>
            <p class="text-muted-foreground mt-1 text-xs">Est. fee $2,000 · Surcharge window opens</p>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Filters & Table Container Card -->
    <Card class="border-border shadow-xs">
      <CardHeader class="border-border border-b pb-4">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle class="text-base font-semibold">Registered Intellectual Property Assets</CardTitle>
            <CardDescription class="text-xs">
              Showing {{ filteredAssets.length }} of {{ ipAssets.length }} assets across USPTO, EUIPO, and WIPO
            </CardDescription>
          </div>

          <!-- Controls: Search and Filters -->
          <div class="flex flex-wrap items-center gap-2">
            <div class="relative min-w-[200px] flex-1 sm:w-64">
              <Search
                aria-hidden="true"
                class="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2"
              />
              <Input
                v-model="searchQuery"
                type="text"
                placeholder="Search patent #, title, class..."
                class="h-8 pl-8 text-xs"
              />
            </div>

            <!-- Type Filter Dropdown -->
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="outline" size="sm" class="h-8 gap-1.5 text-xs">
                  <Filter class="size-3.5 opacity-70" aria-hidden="true" />
                  <span>{{ selectedType === 'all' ? 'Type: All' : selectedType }}</span>
                  <ChevronDown class="size-3 opacity-50" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" class="w-48">
                <DropdownMenuLabel class="text-xs">Filter by Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="selectedType = 'all'">All Types</DropdownMenuItem>
                <DropdownMenuItem @click="selectedType = 'Utility Patent'">Utility Patent</DropdownMenuItem>
                <DropdownMenuItem @click="selectedType = 'Trademark'">Trademark</DropdownMenuItem>
                <DropdownMenuItem @click="selectedType = 'PCT International'">PCT International</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <!-- Status Filter Dropdown -->
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="outline" size="sm" class="h-8 gap-1.5 text-xs">
                  <span>{{ selectedStatus === 'all' ? 'Status: All' : selectedStatus }}</span>
                  <ChevronDown class="size-3 opacity-50" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" class="w-52">
                <DropdownMenuLabel class="text-xs">Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="selectedStatus = 'all'">All Statuses</DropdownMenuItem>
                <DropdownMenuItem @click="selectedStatus = 'Granted / Registered'"
                  >Granted / Registered</DropdownMenuItem
                >
                <DropdownMenuItem @click="selectedStatus = 'Published / Under Exam'"
                  >Published / Under Exam</DropdownMenuItem
                >
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent class="p-0">
        <div class="overflow-x-auto">
          <Table>
            <TableHeader class="bg-muted/40">
              <TableRow>
                <TableHead class="min-w-[280px]">Asset Identifier &amp; Title</TableHead>
                <TableHead class="w-[140px]">Type</TableHead>
                <TableHead class="w-[160px]">Jurisdiction</TableHead>
                <TableHead class="w-[160px]">App / Grant Date</TableHead>
                <TableHead class="w-[170px]">Filing Status</TableHead>
                <TableHead class="w-[180px]">Next Renewal / Deadline</TableHead>
                <TableHead class="w-[70px] text-right"><span class="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="asset in filteredAssets" :key="asset.id" class="hover:bg-muted/40 transition-colors">
                <!-- Asset Identifier & Title -->
                <TableCell class="py-3.5 align-top">
                  <div class="space-y-1">
                    <div class="flex flex-wrap items-center gap-1.5">
                      <span class="text-foreground font-mono text-xs font-bold tracking-tight">
                        {{ asset.identifier }}
                      </span>
                      <button
                        type="button"
                        @click="copyText(asset.id, asset.officialNumber)"
                        class="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex items-center gap-1 rounded p-0.5 transition-colors focus-visible:ring-2 focus-visible:outline-hidden"
                        :title="`Copy ${asset.officialNumber}`"
                      >
                        <Check
                          v-if="copiedId === asset.id"
                          class="size-3 text-emerald-600 dark:text-emerald-400"
                          aria-hidden="true"
                        />
                        <Copy v-else class="size-3" aria-hidden="true" />
                      </button>
                    </div>
                    <div class="text-foreground text-xs font-medium">
                      {{ asset.title }}
                    </div>
                    <div class="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
                      <span>{{ asset.ipcClass }}</span>
                      <span>•</span>
                      <span>Counsel: {{ asset.attorney }}</span>
                    </div>
                  </div>
                </TableCell>

                <!-- Type Badge -->
                <TableCell class="align-top">
                  <Badge
                    variant="outline"
                    :class="
                      cn('font-mono text-xs font-medium', {
                        'border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300':
                          asset.type === 'Utility Patent',
                        'border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300': asset.type === 'Trademark',
                        'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300':
                          asset.type === 'PCT International',
                      })
                    "
                  >
                    {{ asset.type }}
                  </Badge>
                </TableCell>

                <!-- Jurisdiction Flag & Office -->
                <TableCell class="align-top">
                  <div class="flex items-center gap-2">
                    <span class="text-base leading-none" :aria-label="asset.jurisdictionName">
                      {{ asset.jurisdictionFlag }}
                    </span>
                    <div>
                      <div class="text-foreground text-xs font-medium">
                        {{ asset.jurisdictionName }}
                      </div>
                      <div class="text-muted-foreground font-mono text-xs">
                        {{ asset.patentOffice }}
                      </div>
                    </div>
                  </div>
                </TableCell>

                <!-- Application / Grant Date in tabular-nums -->
                <TableCell class="align-top">
                  <div class="space-y-0.5 font-mono text-xs tabular-nums">
                    <div class="text-muted-foreground flex items-center gap-1.5">
                      <span class="text-muted-foreground/70">Filing:</span>
                      <span class="text-foreground font-medium">{{ asset.applicationDate }}</span>
                    </div>
                    <div class="text-muted-foreground flex items-center gap-1.5">
                      <span class="text-muted-foreground/70">Grant:</span>
                      <span
                        :class="
                          asset.grantDate === 'Pending'
                            ? 'font-medium text-amber-600 dark:text-amber-400'
                            : 'text-foreground font-medium'
                        "
                      >
                        {{ asset.grantDate }}
                      </span>
                    </div>
                  </div>
                </TableCell>

                <!-- Filing Status -->
                <TableCell class="align-top">
                  <div
                    v-if="asset.status === 'Granted / Registered'"
                    class="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400"
                  >
                    <span class="relative flex size-1.5">
                      <span class="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                      <span class="relative inline-flex size-1.5 rounded-full bg-emerald-500"></span>
                    </span>
                    <span>Granted / Registered</span>
                  </div>
                  <div
                    v-else
                    class="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400"
                  >
                    <Clock class="size-3 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                    <span>Published / Under Exam</span>
                  </div>
                </TableCell>

                <!-- Next Renewal / Maintenance Deadline -->
                <TableCell class="align-top">
                  <div class="space-y-0.5">
                    <div class="text-foreground flex items-center gap-1.5 font-mono text-xs font-semibold tabular-nums">
                      <Calendar class="text-muted-foreground size-3.5" aria-hidden="true" />
                      <span>{{ asset.nextDeadline }}</span>
                    </div>
                    <p class="text-muted-foreground text-xs leading-tight">
                      {{ asset.deadlineNote }}
                    </p>
                  </div>
                </TableCell>

                <!-- Actions Dropdown -->
                <TableCell class="py-3.5 text-right align-top">
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        class="text-muted-foreground hover:text-foreground focus-visible:ring-ring"
                      >
                        <MoreHorizontal class="size-4" aria-hidden="true" />
                        <span class="sr-only">Open actions for {{ asset.identifier }}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" class="w-56">
                      <DropdownMenuLabel class="text-xs">Asset Operations</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem @click="handleAction(asset.gazetteLabel, asset)">
                        <ExternalLink class="mr-2 size-4" aria-hidden="true" />
                        <span>{{ asset.gazetteLabel }}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem @click="handleAction('Download Grant Certificate', asset)">
                        <Download class="mr-2 size-4" aria-hidden="true" />
                        <span>Download Grant Certificate</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem @click="handleAction('Assign Counsel', asset)">
                        <UserCheck class="mr-2 size-4" aria-hidden="true" />
                        <span>Assign Counsel</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem @click="copyText(asset.id, asset.officialNumber)">
                        <Copy class="mr-2 size-4" aria-hidden="true" />
                        <span>Copy Docket Number</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>

              <!-- Empty Filter State -->
              <TableRow v-if="filteredAssets.length === 0">
                <TableCell colspan="7" class="text-muted-foreground py-10 text-center text-xs">
                  <div class="flex flex-col items-center justify-center gap-2">
                    <FileText class="text-muted-foreground/60 size-8" aria-hidden="true" />
                    <p class="font-medium">No intellectual property assets match your search filters.</p>
                    <Button variant="outline" size="sm" class="mt-1 text-xs" @click="resetFilters">
                      Reset Filters
                    </Button>
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
